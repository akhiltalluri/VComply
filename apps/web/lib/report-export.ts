"use client";

import type { ComplianceReportRecord } from "@/types";

function sanitizeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 0);
}

function escapeCsvValue(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportReportAsCsv(report: ComplianceReportRecord) {
  const rows = [
    [
      "section",
      "report_title",
      "company_name",
      "generated_at",
      "risk_score",
      "risk_level",
      "status_label",
      "summary",
      "item_name",
      "jurisdiction",
      "detail",
      "next_step",
      "priority",
      "owner",
      "due",
    ],
    [
      "overview",
      report.title,
      report.company_name,
      report.created_at,
      report.risk_score,
      report.risk_level,
      report.status_label,
      report.summary,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    ...report.assessment.applicable_laws.map((law) => [
      "applicable_law",
      report.title,
      report.company_name,
      report.created_at,
      report.risk_score,
      law.risk,
      law.status ?? report.status_label,
      report.summary,
      law.law,
      law.jurisdiction ?? "",
      law.reason,
      law.next_step,
      "",
      law.owner ?? law.team ?? "",
      "",
    ]),
    ...report.assessment.required_actions.map((action) => [
      "required_action",
      report.title,
      report.company_name,
      report.created_at,
      report.risk_score,
      report.risk_level,
      action.status ?? report.status_label,
      report.summary,
      action.title,
      "",
      action.description ?? action.system,
      action.system,
      action.priority,
      action.owner ?? "",
      action.due ?? "",
    ]),
  ];

  const csv = rows
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");

  const filenameBase = sanitizeFilename(`${report.company_name || report.title}-${report.created_at}`);
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${filenameBase}.csv`);
}

function sanitizePdfText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapPdfText(text: string, maxChars: number) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return [""];
  }

  const words = cleaned.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

type PdfLine = {
  text: string;
  font: "regular" | "bold";
  size: number;
  gapAfter?: number;
};

function buildPdfLines(report: ComplianceReportRecord): PdfLine[] {
  const lines: PdfLine[] = [
    { text: "VComply Compliance Report", font: "bold", size: 18, gapAfter: 12 },
    { text: report.title, font: "bold", size: 14 },
    { text: `Company: ${report.company_name}`, font: "regular", size: 11 },
    { text: `Generated: ${formatTimestamp(report.created_at)}`, font: "regular", size: 11 },
    {
      text: `Risk Score: ${report.risk_score}/100 (${report.risk_level})`,
      font: "regular",
      size: 11,
    },
    { text: `Status: ${report.status_label}`, font: "regular", size: 11, gapAfter: 10 },
    { text: "Summary", font: "bold", size: 12 },
    ...wrapPdfText(report.summary, 88).map((text) => ({ text, font: "regular" as const, size: 11 })),
    { text: "", font: "regular", size: 11, gapAfter: 2 },
    { text: "Applicable Laws", font: "bold", size: 12 },
    ...(
      report.assessment.applicable_laws.length > 0
        ? report.assessment.applicable_laws.flatMap((law) => [
            { text: `${law.law} (${law.risk})`, font: "bold" as const, size: 11 },
            ...wrapPdfText(law.reason, 88).map((text) => ({
              text: `Reason: ${text}`,
              font: "regular" as const,
              size: 10,
            })),
            ...wrapPdfText(`Next Step: ${law.next_step}`, 88).map((text) => ({
              text,
              font: "regular" as const,
              size: 10,
            })),
            { text: "", font: "regular" as const, size: 10, gapAfter: 2 },
          ])
        : [{ text: "No applicable laws available.", font: "regular" as const, size: 11 }]
    ),
    { text: "Required Actions", font: "bold", size: 12 },
    ...(
      report.assessment.required_actions.length > 0
        ? report.assessment.required_actions.flatMap((action) => [
            {
              text: `${action.title} [${action.priority}]`,
              font: "bold" as const,
              size: 11,
            },
            ...wrapPdfText(action.description ?? action.system, 88).map((text) => ({
              text: `Detail: ${text}`,
              font: "regular" as const,
              size: 10,
            })),
            {
              text: `Owner: ${action.owner ?? "Unassigned"} | Due: ${action.due ?? "TBD"}`,
              font: "regular" as const,
              size: 10,
            },
            { text: "", font: "regular" as const, size: 10, gapAfter: 2 },
          ])
        : [{ text: "No required actions available.", font: "regular" as const, size: 11 }]
    ),
  ];

  return lines;
}

function renderPdfPages(lines: PdfLine[]) {
  const pages: string[] = [];
  const top = 752;
  const bottom = 72;
  const left = 54;
  let commands: string[] = [];
  let y = top;
  let pageNumber = 1;

  const pushPage = () => {
    const footer = [
      "BT",
      "/F1 9 Tf",
      `${left} 42 Td`,
      `(${sanitizePdfText(`VComply report export • Page ${pageNumber}`)}) Tj`,
      "ET",
    ].join("\n");
    pages.push([...commands, footer].join("\n"));
    commands = [];
    y = top;
    pageNumber += 1;
  };

  lines.forEach((line) => {
    const lineHeight = line.size + 7 + (line.gapAfter ?? 0);

    if (y - lineHeight < bottom) {
      pushPage();
    }

    commands.push(
      "BT",
      `${line.font === "bold" ? "/F2" : "/F1"} ${line.size} Tf`,
      `${left} ${y} Td`,
      `(${sanitizePdfText(line.text)}) Tj`,
      "ET"
    );
    y -= lineHeight;
  });

  if (commands.length > 0 || pages.length === 0) {
    pushPage();
  }

  return pages;
}

function buildPdfDocument(pageStreams: string[]) {
  const encoder = new TextEncoder();
  const pagesId = 1;
  const catalogId = 2;
  const regularFontId = 3;
  const boldFontId = 4;
  const pageIds: number[] = [];
  const contentIds: number[] = [];
  let nextId = 5;

  pageStreams.forEach(() => {
    pageIds.push(nextId++);
    contentIds.push(nextId++);
  });

  const maxId = nextId - 1;
  const objects = new Array<string>(maxId + 1).fill("");

  objects[pagesId] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds
    .map((id) => `${id} 0 R`)
    .join(" ")}] >>`;
  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[regularFontId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[boldFontId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  pageStreams.forEach((stream, index) => {
    const contentId = contentIds[index];
    const pageId = pageIds[index];
    objects[contentId] = `<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}\nendstream`;
    objects[pageId] =
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] ` +
      `/Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> ` +
      `/Contents ${contentId} 0 R >>`;
  });

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = new Array(maxId + 1).fill(0);

  for (let id = 1; id <= maxId; id += 1) {
    offsets[id] = encoder.encode(pdf).length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefPosition = encoder.encode(pdf).length;
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let id = 1; id <= maxId; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`;
  return pdf;
}

export function exportReportAsPdf(report: ComplianceReportRecord) {
  const pages = renderPdfPages(buildPdfLines(report));
  const pdfContent = buildPdfDocument(pages);
  const filenameBase = sanitizeFilename(`${report.company_name || report.title}-${report.created_at}`);
  downloadBlob(new Blob([pdfContent], { type: "application/pdf" }), `${filenameBase}.pdf`);
}
