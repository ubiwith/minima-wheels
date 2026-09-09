"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTemplateById } from "@/lib/templates";
import { saveDocument } from "@/lib/storage";
import { useDocument } from "@/lib/hooks";
import { StudioDocument } from "@/lib/types";
import { buildDocxBlob, downloadBlob } from "@/lib/docx-export";

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  // localStorage(외부 저장소)에서 읽어온 값. useSyncExternalStore를 통해
  // 구독하므로 effect 안에서 setState를 호출할 필요가 없다.
  const stored = useDocument(params.id);

  // 타이핑 중에는 매 입력마다 localStorage에 즉시 쓰지 않고, 로컬 draft를
  // 우선 반영한 뒤 debounce로 저장한다. stored가 처음 로드되면(또는 문서가
  // 바뀌면) draft를 그 값으로 동기화한다 — effect가 아니라 렌더 중 상태
  // 조정(React가 권장하는 "Adjusting state when a prop changes" 패턴)으로 처리.
  const [draft, setDraft] = useState<StudioDocument | null>(null);
  const [syncedId, setSyncedId] = useState<string | null>(null);
  if (stored && stored.id !== syncedId) {
    setDraft(stored);
    setSyncedId(stored.id);
  }

  const [saving, setSaving] = useState<"idle" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doc = draft;

  function scheduleSave(next: StudioDocument) {
    setDraft(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDocument({ ...next, updatedAt: new Date().toISOString() });
      setSaving("saved");
    }, 400);
  }

  if (doc === null) {
    return (
      <main className="page">
        <p>문서를 찾을 수 없습니다.</p>
        <Link className="back-link" href="/">
          ← 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const template = getTemplateById(doc.templateId);
  if (!template) {
    return (
      <main className="page">
        <p>알 수 없는 템플릿입니다.</p>
        <Link className="back-link" href="/">
          ← 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  async function handleExport() {
    if (!doc || !template) return;
    const blob = await buildDocxBlob(doc, template);
    const filename = `${doc.title || template.name}.docx`;
    downloadBlob(blob, filename);
  }

  return (
    <main className="page">
      <Link className="back-link" href="/">
        ← 목록으로
      </Link>

      <div className="editor-header">
        <div className="field-row">
          <div className="field">
            <label htmlFor="title">문서 제목</label>
            <input
              id="title"
              value={doc.title}
              placeholder={template.name}
              onChange={(e) =>
                scheduleSave({ ...doc, title: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="subtitle">부제 (사업명/평가대상 등)</label>
            <input
              id="subtitle"
              value={doc.subtitle}
              onChange={(e) =>
                scheduleSave({ ...doc, subtitle: e.target.value })
              }
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="author">작성 기관/작성자</label>
            <input
              id="author"
              value={doc.author}
              onChange={(e) =>
                scheduleSave({ ...doc, author: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="date">작성일</label>
            <input
              id="date"
              type="date"
              value={doc.date}
              onChange={(e) => scheduleSave({ ...doc, date: e.target.value })}
            />
          </div>
        </div>
      </div>

      {template.sections.map((section) => (
        <div className="section-block" key={section.id}>
          <div className="section-block-head">
            {section.numbering && (
              <span className="section-num">{section.numbering}</span>
            )}
            <span className="section-name">{section.title}</span>
          </div>
          <div className="section-guide">{section.guide}</div>
          <textarea
            placeholder={section.placeholder}
            value={doc.content[section.id] ?? ""}
            onChange={(e) =>
              scheduleSave({
                ...doc,
                content: { ...doc.content, [section.id]: e.target.value },
              })
            }
          />
        </div>
      ))}

      <div className="editor-actions">
        <span className="save-hint">
          {saving === "saved" ? "자동 저장됨" : ""}
        </span>
        <button className="btn" onClick={() => router.push("/")}>
          목록으로
        </button>
        <button className="btn btn-primary" onClick={handleExport}>
          .docx로 내보내기
        </button>
      </div>
    </main>
  );
}
