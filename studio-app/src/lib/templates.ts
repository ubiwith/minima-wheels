import { DocumentTemplate } from "./types";

// 정부/기관 제안서·평가보고서에서 실제로 요구되는 목차 순서를 기준으로 구성했다.
// 각 섹션의 guide는 "무엇을 어떤 순서(기승전결)로 써야 하는지"를 짧게 안내해서,
// 논리 구조를 매번 새로 고민하지 않아도 되게 하는 것이 목적이다.

export const PROPOSAL_TEMPLATE: DocumentTemplate = {
  id: "proposal",
  name: "사업 제안서",
  description: "정부·기관 지원사업 제안서에 필요한 표준 목차",
  usageHint: "공모사업 신청, 사업계획서 제출 등에 사용하세요.",
  sections: [
    {
      id: "background",
      title: "추진 배경 및 필요성",
      numbering: "Ⅰ",
      guide:
        "① 현재 상황(무엇이 문제인가) → ② 그 문제가 왜 중요한가(근거·통계) → " +
        "③ 이 사업이 왜 지금 필요한가 순서로 씁니다. 심사위원이 가장 먼저 " +
        "읽는 부분이므로 첫 문장에 핵심 문제의식을 요약하세요.",
      placeholder:
        "예) OO 지역은 최근 3년간 ...로 인해 ... 문제가 심화되고 있음. " +
        "이에 따라 ...",
    },
    {
      id: "goal",
      title: "사업 목적 및 목표",
      numbering: "Ⅱ",
      guide:
        "목적(방향성, 정성적)과 목표(측정 가능한 수치)를 구분해서 씁니다. " +
        "목표는 가능하면 '무엇을 몇 %/몇 건 달성'처럼 정량적으로 제시하세요.",
      placeholder: "예) [목적] ... [목표] 1) ... 2) ...",
    },
    {
      id: "system",
      title: "추진 체계 및 조직",
      numbering: "Ⅲ",
      guide:
        "사업을 누가, 어떤 역할로 수행하는지 조직도·인력 구성을 제시합니다. " +
        "총괄책임자 → 실무 담당 → 협력기관 순으로 정리하면 자연스럽습니다.",
      placeholder: "예) 총괄책임자: ... / 실무진: ... / 협력기관: ...",
    },
    {
      id: "plan",
      title: "세부 추진 계획",
      numbering: "Ⅳ",
      guide:
        "'무엇을(내용) → 어떻게(방법) → 언제(일정)' 순으로, 단계별(1단계·2단계…)로 " +
        "나누어 씁니다. 표로 만들 내용이라면 단계 | 기간 | 세부내용 형태로 " +
        "줄바꿈해 입력해도 좋습니다.",
      placeholder: "예) 1단계(1~2개월): ... / 2단계(3~4개월): ...",
    },
    {
      id: "budget",
      title: "소요 예산",
      numbering: "Ⅴ",
      guide:
        "항목별 예산과 산출 근거를 함께 씁니다. 총액을 가장 먼저 제시한 뒤 " +
        "세부 항목을 나열하면 읽기 편합니다.",
      placeholder: "예) 총 사업비: OOO원 / 인건비 OOO원, 재료비 OOO원 ...",
    },
    {
      id: "effect",
      title: "기대효과",
      numbering: "Ⅵ",
      guide:
        "정량적 효과(수치)와 정성적 효과(사회적·정책적 의의)를 나누어 씁니다. " +
        "앞서 제시한 '목표'가 달성되었을 때의 결과를 구체적으로 연결하세요.",
      placeholder: "예) [정량] ... [정성] ...",
    },
  ],
};

export const EVALUATION_REPORT_TEMPLATE: DocumentTemplate = {
  id: "evaluation-report",
  name: "평가(인증) 보고서",
  description: "기관평가·인증평가 결과 보고서에 필요한 표준 목차",
  usageHint: "자체평가보고서, 인증평가 결과보고서 등에 사용하세요.",
  sections: [
    {
      id: "overview",
      title: "평가 개요",
      numbering: "Ⅰ",
      guide:
        "평가 목적 → 평가 기간 → 평가 대상 → 평가 방법(서면/현장 등) 순으로 " +
        "사실 정보를 간결하게 정리합니다.",
      placeholder: "예) 목적: ... / 기간: ... / 대상: ... / 방법: ...",
    },
    {
      id: "criteria",
      title: "평가 지표 및 기준",
      numbering: "Ⅱ",
      guide:
        "사용한 평가지표(영역·항목)와 배점 기준을 나열합니다. 지표는 대분류 → " +
        "세부항목 순으로 계층을 맞춰 씁니다.",
      placeholder: "예) [영역1] 기관운영 - 1) ... (배점 OO) 2) ...",
    },
    {
      id: "summary",
      title: "평가 결과 요약",
      numbering: "Ⅲ",
      guide:
        "총점/등급을 먼저 제시한 뒤, 영역별 결과를 표 형태로 요약합니다. " +
        "'결과 → 근거' 순서를 지키면 논리가 명확해집니다.",
      placeholder: "예) 총점 OO점(등급 O) / 영역별: 기관운영 OO점, ...",
    },
    {
      id: "detail",
      title: "영역별 세부 평가 내용",
      numbering: "Ⅳ",
      guide:
        "지표별로 '① 확인된 사실(증빙 기반) → ② 우수한 점 → ③ 미흡한 점' " +
        "순서로 씁니다. 주관적 판단보다 증빙에 근거한 사실 기술을 우선하세요.",
      placeholder: "예) [지표1] 확인사항: ... / 우수사항: ... / 미흡사항: ...",
    },
    {
      id: "improvement",
      title: "개선사항 및 제언",
      numbering: "Ⅴ",
      guide:
        "위에서 지적한 미흡한 점과 1:1로 대응되는 개선방안을 씁니다. " +
        "'문제점 → 개선방안 → 기대효과' 순서를 지키면 설득력이 높아집니다.",
      placeholder: "예) [문제점] ... → [개선방안] ... → [기대효과] ...",
    },
    {
      id: "conclusion",
      title: "종합 의견",
      numbering: "Ⅵ",
      guide:
        "전체 평가를 한 문단으로 요약합니다. 앞의 세부 내용을 반복하지 말고, " +
        "핵심 결론과 향후 방향을 중심으로 정리하세요.",
      placeholder: "예) 종합적으로 OO 기관은 ...하였으며, 향후 ...",
    },
  ],
};

export const TEMPLATES: DocumentTemplate[] = [
  PROPOSAL_TEMPLATE,
  EVALUATION_REPORT_TEMPLATE,
];

export function getTemplateById(id: string): DocumentTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
