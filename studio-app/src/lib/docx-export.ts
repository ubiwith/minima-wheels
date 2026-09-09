import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  Footer,
  TextRun,
} from "docx";
import { DocumentTemplate } from "./types";
import { StudioDocument } from "./types";

// 표지 -> 목차 -> 섹션(제목+본문) 순서로 .docx를 구성한다.
// 한글(HWP)은 .docx를 그대로 불러오기 할 수 있어, 이후 한글에서 서식을
// 다듬는 마무리 작업이 수월하다.

function bodyParagraphs(text: string): Paragraph[] {
  const lines = text.split("\n");
  if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === "")) {
    return [new Paragraph({ text: "", spacing: { after: 120 } })];
  }
  return lines.map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 22 })],
        spacing: { after: 120, line: 360 },
      })
  );
}

export function buildDocxBlob(
  doc: StudioDocument,
  template: DocumentTemplate
): Promise<Blob> {
  const titleText = doc.title || template.name;

  const coverParagraphs = [
    new Paragraph({ text: "", spacing: { before: 2000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: titleText, bold: true, size: 56 }),
      ],
      spacing: { after: 240 },
    }),
    ...(doc.subtitle
      ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: doc.subtitle, size: 30 })],
            spacing: { after: 800 },
          }),
        ]
      : []),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: doc.date || "", size: 24 })],
      spacing: { after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: doc.author || "", size: 24 })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  const tocHeading = new Paragraph({
    text: "목    차",
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
  });

  const tocEntries = template.sections.map(
    (s) =>
      new Paragraph({
        children: [
          new TextRun({
            text: `${s.numbering ? s.numbering + ". " : ""}${s.title}`,
            size: 24,
          }),
        ],
        spacing: { after: 160 },
      })
  );

  const tocPage = [tocHeading, ...tocEntries, new Paragraph({ children: [new PageBreak()] })];

  const sectionBlocks = template.sections.flatMap((section) => {
    const text = doc.content[section.id] ?? "";
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 200 },
        children: [
          new TextRun({
            text: `${section.numbering ? section.numbering + ". " : ""}${section.title}`,
            bold: true,
          }),
        ],
      }),
      ...bodyParagraphs(text),
    ];
  });

  const file = new Document({
    sections: [
      {
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ children: [PageNumber.CURRENT] }),
                ],
              }),
            ],
          }),
        },
        children: [...coverParagraphs, ...tocPage, ...sectionBlocks],
      },
    ],
  });

  return Packer.toBlob(file);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
