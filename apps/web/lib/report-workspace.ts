"use client";

import { normalizeComplianceAssessment } from "@/lib/mock-data";
import { parseStoredJson } from "@/lib/storage";
import type {
  ComplianceAssessment,
  ComplianceReportRecord,
  ComplianceWorkspace,
  IntakeDraft,
  RiskLevel,
} from "@/types";

export const COMPLIANCE_WORKSPACE_KEY = "complianceWorkspace";
export const COMPLIANCE_RESULT_KEY = "complianceResult";
export const COMPLIANCE_INTAKE_DRAFT_KEY = "complianceIntakeDraft";
const WORKSPACE_EVENT = "vcomply-workspace-changed";

export const emptyComplianceWorkspace: ComplianceWorkspace = {
  current_report: null,
  archived_reports: [],
};

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `report-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function deriveCompanyName(assessment: ComplianceAssessment, draft?: IntakeDraft | null) {
  if (draft?.company_name?.trim()) {
    return draft.company_name.trim();
  }

  const sourceLabel = cleanText(assessment.source_label);
  const [candidate] = sourceLabel.split("•");
  return candidate || "Current Company";
}

function deriveReportTitle(assessment: ComplianceAssessment, draft?: IntakeDraft | null) {
  const companyName = deriveCompanyName(assessment, draft);
  return `${companyName} Compliance Assessment`;
}

function deriveStatusLabel(riskLevel: RiskLevel) {
  if (riskLevel === "HIGH") {
    return "Immediate Review";
  }

  if (riskLevel === "MEDIUM") {
    return "Action Plan Active";
  }

  return "Monitoring";
}

function createReportRecord(
  assessment: ComplianceAssessment,
  draft?: IntakeDraft | null,
  overrides?: Partial<ComplianceReportRecord>
): ComplianceReportRecord {
  const companyName = deriveCompanyName(assessment, draft);

  return {
    id: overrides?.id ?? createId(),
    created_at: overrides?.created_at ?? new Date().toISOString(),
    title: overrides?.title ?? deriveReportTitle(assessment, draft),
    company_name: overrides?.company_name ?? companyName,
    risk_score: overrides?.risk_score ?? assessment.risk_score,
    risk_level: overrides?.risk_level ?? assessment.severity,
    summary: overrides?.summary ?? assessment.summary.narrative,
    applicable_laws_count:
      overrides?.applicable_laws_count ?? assessment.summary.impacted_regulation_count,
    required_actions_count:
      overrides?.required_actions_count ?? assessment.summary.required_action_count,
    status_label: overrides?.status_label ?? deriveStatusLabel(assessment.severity),
    assessment,
    intake_draft: draft ?? null,
  };
}

function normalizeReportRecord(candidate: unknown): ComplianceReportRecord | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const record = candidate as Partial<ComplianceReportRecord>;
  const intakeDraft =
    record.intake_draft && typeof record.intake_draft === "object" ? record.intake_draft : null;
  const assessment = normalizeComplianceAssessment(record.assessment, intakeDraft);

  if (!assessment) {
    return null;
  }

  return createReportRecord(assessment, intakeDraft, {
    id: typeof record.id === "string" && record.id.trim() ? record.id : createId(),
    created_at:
      typeof record.created_at === "string" && record.created_at.trim()
        ? record.created_at
        : new Date().toISOString(),
    title: typeof record.title === "string" && record.title.trim() ? record.title : undefined,
    company_name:
      typeof record.company_name === "string" && record.company_name.trim()
        ? record.company_name
        : undefined,
    risk_score: typeof record.risk_score === "number" ? record.risk_score : undefined,
    risk_level:
      record.risk_level === "HIGH" || record.risk_level === "MEDIUM" || record.risk_level === "LOW"
        ? record.risk_level
        : undefined,
    summary: typeof record.summary === "string" && record.summary.trim() ? record.summary : undefined,
    applicable_laws_count:
      typeof record.applicable_laws_count === "number" ? record.applicable_laws_count : undefined,
    required_actions_count:
      typeof record.required_actions_count === "number"
        ? record.required_actions_count
        : undefined,
    status_label:
      typeof record.status_label === "string" && record.status_label.trim()
        ? record.status_label
        : undefined,
  });
}

function dedupeReports(reports: ComplianceReportRecord[]) {
  const seen = new Set<string>();

  return reports.filter((report) => {
    if (seen.has(report.id)) {
      return false;
    }

    seen.add(report.id);
    return true;
  });
}

function normalizeWorkspace(candidate: unknown): ComplianceWorkspace {
  if (!candidate || typeof candidate !== "object") {
    return emptyComplianceWorkspace;
  }

  const workspace = candidate as Partial<ComplianceWorkspace>;
  const currentReport = normalizeReportRecord(workspace.current_report);
  const archivedReports = Array.isArray(workspace.archived_reports)
    ? workspace.archived_reports
        .map((report) => normalizeReportRecord(report))
        .filter((report): report is ComplianceReportRecord => Boolean(report))
    : [];

  return {
    current_report: currentReport,
    archived_reports: dedupeReports(
      archivedReports.filter((report) => report.id !== currentReport?.id)
    ).sort((left, right) => right.created_at.localeCompare(left.created_at)),
  };
}

function syncLegacyStorage(workspace: ComplianceWorkspace) {
  if (typeof window === "undefined") {
    return;
  }

  if (workspace.current_report) {
    window.localStorage.setItem(
      COMPLIANCE_RESULT_KEY,
      JSON.stringify(workspace.current_report.assessment)
    );
  } else {
    window.localStorage.removeItem(COMPLIANCE_RESULT_KEY);
  }
}

function persistWorkspace(workspace: ComplianceWorkspace) {
  if (typeof window === "undefined") {
    return workspace;
  }

  const normalizedWorkspace = normalizeWorkspace(workspace);
  window.localStorage.setItem(COMPLIANCE_WORKSPACE_KEY, JSON.stringify(normalizedWorkspace));
  syncLegacyStorage(normalizedWorkspace);
  window.dispatchEvent(new Event(WORKSPACE_EVENT));
  return normalizedWorkspace;
}

function migrateLegacyWorkspace() {
  if (typeof window === "undefined") {
    return emptyComplianceWorkspace;
  }

  const legacyAssessment = parseStoredJson<unknown>(window.localStorage.getItem(COMPLIANCE_RESULT_KEY));
  const intakeDraft = parseStoredJson<IntakeDraft>(
    window.localStorage.getItem(COMPLIANCE_INTAKE_DRAFT_KEY)
  );
  const normalizedAssessment = normalizeComplianceAssessment(legacyAssessment, intakeDraft);

  if (!normalizedAssessment) {
    return emptyComplianceWorkspace;
  }

  return {
    current_report: createReportRecord(normalizedAssessment, intakeDraft),
    archived_reports: [],
  };
}

export function getComplianceWorkspace() {
  if (typeof window === "undefined") {
    return emptyComplianceWorkspace;
  }

  const storedWorkspace = parseStoredJson<unknown>(
    window.localStorage.getItem(COMPLIANCE_WORKSPACE_KEY)
  );

  if (storedWorkspace) {
    const normalizedWorkspace = normalizeWorkspace(storedWorkspace);
    syncLegacyStorage(normalizedWorkspace);
    return normalizedWorkspace;
  }

  const migratedWorkspace = migrateLegacyWorkspace();
  if (migratedWorkspace.current_report || migratedWorkspace.archived_reports.length > 0) {
    persistWorkspace(migratedWorkspace);
    return migratedWorkspace;
  }

  return emptyComplianceWorkspace;
}

export function storeAssessmentReport(assessment: ComplianceAssessment, draft?: IntakeDraft | null) {
  const workspace = getComplianceWorkspace();
  const nextCurrentReport = createReportRecord(assessment, draft);
  const archivedReports = dedupeReports(
    [
      workspace.current_report,
      ...workspace.archived_reports,
    ].filter((report): report is ComplianceReportRecord => Boolean(report))
  ).sort((left, right) => right.created_at.localeCompare(left.created_at));

  return persistWorkspace({
    current_report: nextCurrentReport,
    archived_reports: archivedReports.filter((report) => report.id !== nextCurrentReport.id),
  });
}

export function startNewAssessmentWorkspace() {
  const workspace = getComplianceWorkspace();
  const archivedReports = dedupeReports(
    [
      workspace.current_report,
      ...workspace.archived_reports,
    ].filter((report): report is ComplianceReportRecord => Boolean(report))
  ).sort((left, right) => right.created_at.localeCompare(left.created_at));

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(COMPLIANCE_INTAKE_DRAFT_KEY);
  }

  return persistWorkspace({
    current_report: null,
    archived_reports: archivedReports,
  });
}

export function subscribeToComplianceWorkspace(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      !event.key ||
      event.key === COMPLIANCE_WORKSPACE_KEY ||
      event.key === COMPLIANCE_RESULT_KEY ||
      event.key === COMPLIANCE_INTAKE_DRAFT_KEY
    ) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(WORKSPACE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(WORKSPACE_EVENT, callback);
  };
}
