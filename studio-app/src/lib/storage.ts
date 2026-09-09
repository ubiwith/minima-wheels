import { StudioDocument } from "./types";

// 서버/DB 없이 브라우저 localStorage에 문서를 저장한다.
// 추후 서버 저장소가 필요해지면 이 파일의 함수 시그니처만 유지한 채
// 구현을 fetch 기반으로 바꾸면 된다.
//
// React 컴포넌트에서는 아래 useDocuments()/useDocument() 훅을 통해
// useSyncExternalStore로 이 store를 구독한다 (effect 안에서 setState를
// 직접 호출하지 않기 위함).

const STORAGE_KEY = "studio-app:documents";

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readAll(): StudioDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StudioDocument[];
  } catch {
    return [];
  }
}

function writeAll(docs: StudioDocument[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

// --- 캐시된 snapshot: useSyncExternalStore는 매 호출마다 동일한 참조를
// 반환해야 불필요한 재렌더링/무한 루프를 피할 수 있으므로, 쓰기가 있을 때만
// 새로 계산한다.

const EMPTY_LIST: StudioDocument[] = [];
let listCache: StudioDocument[] | null = null;
const docCache = new Map<string, StudioDocument | null>();

function invalidateCache() {
  listCache = null;
  docCache.clear();
  notify();
}

export function getDocumentsSnapshot(): StudioDocument[] {
  if (typeof window === "undefined") return EMPTY_LIST;
  if (listCache === null) {
    listCache = readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return listCache;
}

export function getDocumentsServerSnapshot(): StudioDocument[] {
  return EMPTY_LIST;
}

export function getDocumentSnapshot(id: string): StudioDocument | null {
  if (typeof window === "undefined") return null;
  if (!docCache.has(id)) {
    docCache.set(id, readAll().find((d) => d.id === id) ?? null);
  }
  return docCache.get(id) ?? null;
}

export function getDocumentServerSnapshot(): StudioDocument | null {
  return null;
}

export function saveDocument(doc: StudioDocument): void {
  const docs = readAll();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) {
    docs[idx] = doc;
  } else {
    docs.push(doc);
  }
  writeAll(docs);
  invalidateCache();
}

export function deleteDocument(id: string): void {
  writeAll(readAll().filter((d) => d.id !== id));
  invalidateCache();
}

export function createDocumentId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
