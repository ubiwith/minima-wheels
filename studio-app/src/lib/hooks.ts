"use client";

import { useSyncExternalStore } from "react";
import {
  subscribe,
  getDocumentsSnapshot,
  getDocumentsServerSnapshot,
  getDocumentSnapshot,
  getDocumentServerSnapshot,
} from "./storage";
import { StudioDocument } from "./types";

/** 저장된 전체 문서 목록을 구독한다. 다른 곳에서 저장/삭제가 일어나면 자동 반영된다. */
export function useDocuments(): StudioDocument[] {
  return useSyncExternalStore(
    subscribe,
    getDocumentsSnapshot,
    getDocumentsServerSnapshot
  );
}

/** id로 특정 문서를 구독한다. 존재하지 않으면 null. */
export function useDocument(id: string): StudioDocument | null {
  return useSyncExternalStore(
    subscribe,
    () => getDocumentSnapshot(id),
    getDocumentServerSnapshot
  );
}
