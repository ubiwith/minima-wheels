// 문서 하나를 구성하는 핵심 타입들.
// 템플릿(Template)은 "어떤 섹션을 어떤 순서로, 어떤 안내와 함께 보여줄지"를 정의하고,
// 문서(Document)는 사용자가 실제로 입력한 내용을 담는다.

export interface TemplateSection {
  /** 문서 내에서 고유한 섹션 id (docx 내보내기 시에도 순서 기준으로 사용) */
  id: string;
  /** 섹션 제목 (예: "사업 개요") */
  title: string;
  /** 섹션 번호 (예: "Ⅰ", "1", "1.1" 등 표시용) */
  numbering?: string;
  /** 이 섹션에 무엇을, 어떤 순서로 써야 하는지 안내하는 가이드 문구 */
  guide: string;
  /** 입력창에 표시할 예시/placeholder */
  placeholder?: string;
  /** 여러 줄 입력이 필요한지 (기본 true) */
  multiline?: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  /** 카드 등에 보여줄 짧은 설명 */
  description: string;
  /** 이 템플릿이 주로 쓰이는 상황 안내 */
  usageHint: string;
  sections: TemplateSection[];
}

export interface StudioDocument {
  id: string;
  templateId: string;
  /** 문서 제목 (표지에 들어감) */
  title: string;
  /** 부제 (예: 사업명, 평가 대상 기관명 등) */
  subtitle: string;
  /** 작성 기관/작성자 */
  author: string;
  /** 작성일 (YYYY-MM-DD) */
  date: string;
  /** 섹션 id -> 입력된 본문 텍스트 */
  content: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
