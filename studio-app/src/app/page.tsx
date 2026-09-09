"use client";

import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";
import { createDocumentId, deleteDocument, saveDocument } from "@/lib/storage";
import { useDocuments } from "@/lib/hooks";
import { StudioDocument } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const docs = useDocuments();

  function handleCreate(templateId: string) {
    const now = new Date().toISOString();
    const doc: StudioDocument = {
      id: createDocumentId(),
      templateId,
      title: "",
      subtitle: "",
      author: "",
      date: now.slice(0, 10),
      content: {},
      createdAt: now,
      updatedAt: now,
    };
    saveDocument(doc);
    router.push(`/editor/${doc.id}`);
  }

  function handleDelete(id: string) {
    if (!window.confirm("이 문서를 삭제할까요? 되돌릴 수 없습니다.")) return;
    deleteDocument(id);
  }

  return (
    <main className="page">
      <div className="topbar">
        <div>
          <div className="brand">콘텐츠 스튜디오</div>
          <div className="brand-sub">
            형식에 맞춰 제안서 · 평가보고서를 빠르게 작성하고 Word로 내보내세요
          </div>
        </div>
      </div>

      <h2 className="section-title">새 문서 만들기</h2>
      <div className="card-grid">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            className="card"
            onClick={() => handleCreate(t.id)}
          >
            <span className="card-title">{t.name}</span>
            <span className="card-desc">{t.description}</span>
            <span className="card-hint">{t.usageHint}</span>
          </button>
        ))}
      </div>

      <h2 className="section-title">작성 중인 문서</h2>
      {docs.length === 0 ? (
        <div className="empty">아직 작성한 문서가 없습니다. 위에서 템플릿을 선택해 시작하세요.</div>
      ) : (
        <div className="doc-list">
          {docs.map((d) => {
            const template = TEMPLATES.find((t) => t.id === d.templateId);
            return (
              <div className="doc-row" key={d.id}>
                <div
                  className="doc-row-main"
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/editor/${d.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="doc-row-title">
                    {d.title || "(제목 없음)"}
                  </span>
                  <span className="doc-row-meta">
                    {template?.name ?? d.templateId} · 마지막 수정{" "}
                    {new Date(d.updatedAt).toLocaleString("ko-KR")}
                  </span>
                </div>
                <div className="doc-row-actions">
                  <button
                    className="btn"
                    onClick={() => router.push(`/editor/${d.id}`)}
                  >
                    이어서 작성
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(d.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
