import { federalSeedLawRecords } from "@/lib/federal-law-examples";
import type {
  ApplicableLaw,
  AssessmentLaw,
  AssessmentLawStatus,
  ComplianceAction,
  ComplianceAssessment,
  DashboardActionStatus,
  EnforcementStatus,
  IntakeDraft,
  LawApiRecord,
  LawAction,
  LawRecord,
  RiskLevel,
  SourceLaw,
  StatusIndicator,
} from "@/types";

export type {
  ApplicableLaw,
  AssessmentLaw,
  AssessmentLawStatus,
  ComplianceAction as DashboardAction,
  ComplianceAssessment,
  DashboardActionStatus,
  EnforcementStatus,
  IntakeDraft,
  LawAction,
  LawRecord,
  RiskLevel,
};

export const modelCategories = [
  {
    id: "llm",
    title: "Large Language Models (LLMs)",
    description: "Drafting, summarization, research assistance, and internal copilots used across teams.",
  },
  {
    id: "customer-support-ai",
    title: "Customer Support AI",
    description: "Support assistants, chat workflows, triage tooling, and customer-facing help experiences.",
  },
  {
    id: "hiring-hr-ai",
    title: "Hiring & HR AI",
    description: "Candidate screening, recruiter decision support, interview review, and workforce planning.",
  },
  {
    id: "document-workflow-automation",
    title: "Document / Workflow Automation",
    description: "Contract review, policy extraction, workflow routing, and back-office automation.",
  },
  {
    id: "predictive-analytics",
    title: "Predictive Analytics",
    description: "Forecasting, prioritization, anomaly detection, and operational scoring used inside business processes.",
  },
  {
    id: "internal-knowledge-search-assistant",
    title: "Internal Knowledge / Search Assistants",
    description: "Internal search, policy lookup, enterprise knowledge retrieval, and employee self-service assistants.",
  },
  {
    id: "compliance-monitoring-automation",
    title: "Compliance / Monitoring Automation",
    description: "Control monitoring, alert triage, evidence collection, and issue management automation for compliance teams.",
  },
] as const;

const lawsData: LawRecord[] = federalSeedLawRecords;

const modelCategoryLookup = new Map(modelCategories.map((category) => [category.id, category]));

type CategoryId = (typeof modelCategories)[number]["id"];

type IntakeRiskProfile = {
  score: number;
  level: RiskLevel;
  headline: string;
  narrative: string;
  deploymentProfile: string;
  reviewCadence: string;
  primaryWorkflow: string;
};

type AssessmentContext = {
  companyName?: string;
  aiUseCases?: string;
  selectedCategories?: string[];
  deployedSystems?: string[];
};

function fallbackText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

function formatList(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function deriveSeverity(score: number): RiskLevel {
  if (score >= 75) {
    return "HIGH";
  }

  if (score >= 45) {
    return "MEDIUM";
  }

  return "LOW";
}

function normalizeRiskLevel(value: string): RiskLevel {
  if (value === "HIGH" || value === "MEDIUM" || value === "LOW") {
    return value;
  }

  return "MEDIUM";
}

function normalizeActionStatus(value: unknown): DashboardActionStatus {
  if (value === "OPEN" || value === "IN_PROGRESS" || value === "SCHEDULED" || value === "COMPLETED") {
    return value;
  }

  if (value === "Completed") {
    return "COMPLETED";
  }

  if (value === "In Progress") {
    return "IN_PROGRESS";
  }

  if (value === "Scheduled") {
    return "SCHEDULED";
  }

  return "OPEN";
}

function priorityWeight(priority: ComplianceAction["priority"] | LawAction["urgency"]) {
  if (priority === "HIGH") {
    return 3;
  }

  if (priority === "MEDIUM") {
    return 2;
  }

  if (priority === "LOW") {
    return 1;
  }

  return 0;
}

export function sortComplianceActions<T extends { priority?: ComplianceAction["priority"] }>(
  actions: T[]
) {
  return [...actions].sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
}

function createAssessmentLaw(law: LawRecord): AssessmentLaw {
  const primaryAction =
    law.requiredActions.find((action) => action.status !== "complete") ?? law.requiredActions[0];
  const status: AssessmentLawStatus =
    law.status === "PROPOSED" ? "UPCOMING" : law.status === "GUIDANCE" ? "MONITORING" : "ACTIVE";

  return {
    id: law.id,
    law: law.title,
    risk: law.risk,
    reason: law.summary,
    next_step: primaryAction?.title ?? "Review federal legislative posture",
    jurisdiction: law.jurisdiction,
    category: law.category,
    status,
    enforcement_status: law.enforcementStatus,
    affected_workflows: law.affectedWorkflows,
    why_it_applies: law.whyItMatters,
    owner: law.ownerTeam,
    source_label: law.sourceLabel,
    team: law.ownerTeam,
  };
}

function createActionFromLaw(law: LawRecord, action: LawAction, index: number): ComplianceAction {
  return {
    id: `${law.id}-${action.id}-${index}`,
    title: action.title,
    system: law.affectedWorkflows[0] ?? law.category,
    source: law.title,
    priority: action.urgency ?? law.risk,
    description: action.description,
    status:
      action.status === "complete"
        ? "COMPLETED"
        : action.urgency === "HIGH"
          ? "OPEN"
          : action.urgency === "MEDIUM"
            ? "IN_PROGRESS"
            : "SCHEDULED",
    owner: action.owner ?? law.ownerTeam,
    due: action.due,
    business_area: law.category,
  };
}

function deriveSummary(
  score: number,
  applicableLaws: AssessmentLaw[],
  requiredActions: ComplianceAction[],
  overrides?: Pick<ComplianceAssessment["summary"], "headline" | "narrative">
) {
  const highRiskIssues = applicableLaws.filter((law) => law.risk === "HIGH").length;
  const mediumRiskIssues = applicableLaws.filter((law) => law.risk === "MEDIUM").length;

  return {
    headline:
      overrides?.headline ??
      (highRiskIssues > 0
        ? "Immediate compliance work is required across consequential AI workflows."
        : "Current federal exposure is manageable, but active monitoring still matters."),
    narrative:
      overrides?.narrative ??
      (highRiskIssues > 0
        ? `${highRiskIssues} high-priority federal legislative watchpoints are tied to current AI workflows. Governance evidence, monitoring, and explainability controls should be reviewed before broader rollout.`
        : "No critical blockers are currently surfaced, but the deployment still warrants documented controls and federal legislative monitoring."),
    high_risk_issues: highRiskIssues,
    medium_risk_issues: mediumRiskIssues,
    required_action_count: requiredActions.length,
    impacted_regulation_count: applicableLaws.length,
  };
}

function buildStatusIndicators(
  applicableLaws: AssessmentLaw[],
  requiredActions: ComplianceAction[],
  riskProfile?: IntakeRiskProfile
): StatusIndicator[] {
  const employmentOverlap = applicableLaws.filter((law) => law.category === "Employment AI").length;
  const highPriorityActions = requiredActions.filter((action) => action.priority === "HIGH").length;

  return [
    {
      label: "Computed risk",
      value: riskProfile
        ? `${riskProfile.level} based on selected AI categories and federal overlap`
        : "Calculated from in-scope AI workflows and current federal records",
      tone:
        riskProfile?.level === "HIGH"
          ? "high"
          : riskProfile?.level === "MEDIUM"
            ? "medium"
            : "blue",
    },
    {
      label: "Primary watchpoint",
      value:
        employmentOverlap > 0
          ? "Employment-related screening and decision support"
          : riskProfile?.primaryWorkflow ?? "Federal AI governance and transparency readiness",
      tone: employmentOverlap > 0 ? "high" : "blue",
    },
    {
      label: "Program momentum",
      value:
        highPriorityActions > 0
          ? `${highPriorityActions} priority actions need ownership in the current review cycle`
          : "Monitoring plan is active with no immediate blockers",
      tone: highPriorityActions > 0 ? "medium" : "low",
    },
  ];
}

function buildDefaultAssessmentContext(options?: {
  deployedSystems?: string[];
}): AssessmentContext {
  return {
    companyName: "your company",
    aiUseCases: "internal copilots, customer support, hiring review, and automated scoring",
    selectedCategories: ["llm", "hiring-hr-ai"],
    deployedSystems: options?.deployedSystems,
  };
}

function deriveRegionBadge(jurisdiction?: string) {
  const normalized = jurisdiction?.toLowerCase() ?? "";
  return normalized.includes("united states") ? "US" : "FD";
}

function findMatchingLawRecord(item: {
  id?: string;
  law?: string;
  title?: string;
  name?: string;
}) {
  return (
    lawsData.find((record) => item.id && record.id === item.id) ??
    lawsData.find((record) => {
      const candidate = item.law ?? item.title ?? item.name;
      return candidate ? record.title.toLowerCase() === candidate.toLowerCase() : false;
    })
  );
}

function createGenericLawRecord(item: LawApiRecord, index: number): LawRecord {
  const title = fallbackText(item.name ?? item.title ?? item.law, `Federal Record ${index + 1}`);
  const risk =
    item.risk === "HIGH" || item.risk === "MEDIUM" || item.risk === "LOW" ? item.risk : "MEDIUM";
  const legislativeStatus = fallbackText(item.status, "IN_PROGRESS");
  const sourceLabel = fallbackText(item.source_label ?? item.source, "Congress.gov");
  const latestAction = fallbackText(item.latest_action, "Latest action unavailable.");
  const category = fallbackText(item.category, "Federal AI Legislation");
  const useCases = safeStringArray(item.use_cases);
  const affectedWorkflows = safeStringArray(item.affected_workflows);
  const tags = safeStringArray(item.tags);
  const displayStatus: EnforcementStatus =
    legislativeStatus === "ENACTED" ? "ENACTED" : legislativeStatus === "GUIDANCE" ? "GUIDANCE" : "PROPOSED";
  const effectiveDate =
    typeof item.effective_date === "string" && item.effective_date.trim()
      ? item.effective_date.trim()
      : "Not enacted";
  const billLabel =
    item.bill_number && item.congress
      ? `${item.bill_number} • ${item.congress}th Congress`
      : item.bill_number || "";

  return {
    id: fallbackText(item.id, `api-law-${index}`),
    title,
    jurisdiction: fallbackText(item.jurisdiction, "United States"),
    regionBadge: deriveRegionBadge(item.jurisdiction),
    status: displayStatus,
    risk,
    category,
    summary: fallbackText(
      item.summary,
      "Congress.gov did not return a summary for this federal legislative record."
    ),
    description: fallbackText(
      item.summary,
      "This federal legislative record was ingested from Congress.gov and normalized for the VComply laws library."
    ),
    whyItMatters:
      displayStatus === "ENACTED"
        ? "This record is enacted federal law and should be mapped against operational controls."
        : "This record is still moving through the federal legislative process, so it should be monitored rather than treated as an enforceable obligation.",
    useCases: useCases.length > 0 ? useCases : ["Federal oversight"],
    affectedWorkflows: affectedWorkflows.length > 0 ? affectedWorkflows : ["In-scope AI workflow"],
    tags: [...(billLabel ? [billLabel] : []), ...(tags.length > 0 ? tags : ["Congress.gov"])],
    effectiveDate,
    enforcementStage: fallbackText(item.enforcement_stage, "Active Legislative Process"),
    enforcementStatus: fallbackText(item.enforcement_status, latestAction),
    sourceLabel,
    ownerTeam: "Federal Affairs",
    notes: [
      `Source: ${sourceLabel}`,
      latestAction,
      displayStatus === "ENACTED"
        ? "Review enacted text and implementation scope carefully."
        : "Monitor congressional status before presenting this record as binding law.",
    ],
    exposure: {
      title: displayStatus === "ENACTED" ? "Federal compliance obligation" : "Legislative watchpoint",
      body:
        displayStatus === "ENACTED"
          ? "This record should be reviewed as active federal law with potential implementation obligations."
          : "This record can inform monitoring, planning, and executive briefings, but it should not be treated as enacted federal law.",
      penalty:
        displayStatus === "ENACTED"
          ? "Assess implementation requirements against the enacted federal text."
          : "No federal penalty is active unless and until Congress enacts the proposal.",
      rationale: latestAction,
    },
    requiredActions: [
      {
        id: `api-review-${index}`,
        title:
          displayStatus === "ENACTED"
            ? "Assess enacted federal obligation"
            : "Monitor federal bill progress",
        article: billLabel || "Congress.gov record",
        due: "Current review cycle",
        urgency: risk,
        status: "todo",
        description:
          displayStatus === "ENACTED"
            ? "Review the enacted federal text, map implementation scope, and assign an owner for remediation planning."
            : "Track bill progress, capture the latest action, and evaluate whether the proposal could affect current AI workflows if enacted.",
        owner: "Federal Affairs",
      },
    ],
    timeline: [
      {
        date: fallbackText(item.latest_action_date, "Current"),
        label: "Latest congressional action",
        detail: latestAction,
      },
    ],
  };
}

export function hydrateLawRecord(item: LawApiRecord, index = 0): LawRecord {
  return findMatchingLawRecord(item) ?? createGenericLawRecord(item, index);
}

export function hydrateLawRecords(items: LawApiRecord[]) {
  const seen = new Set<string>();

  return items
    .map((item, index) => hydrateLawRecord(item, index))
    .filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }

      seen.add(item.id);
      return true;
    });
}

function createLawMatchSet(draft: IntakeDraft) {
  const textBlob = [draft.ai_use_cases, draft.critical_use_cases, draft.additional_context]
    .join(" ")
    .toLowerCase();
  const selected = new Set(draft.selected_categories);
  const matchedIds = new Set<string>();

  const hasHiring =
    selected.has("hiring-hr-ai") ||
    /(hiring|candidate|recruit|talent|interview|employee|promotion)/.test(textBlob);
  const hasPredictive =
    selected.has("predictive-analytics") ||
    /(fraud|credit|underwriting|eligibility|score|pricing|risk score)/.test(textBlob);
  const hasGeneralGovernance =
    selected.has("llm") ||
    selected.has("customer-support-ai") ||
    selected.has("document-workflow-automation") ||
    selected.has("internal-knowledge-search-assistant") ||
    selected.has("compliance-monitoring-automation") ||
    /(assistant|chatbot|workflow|automation|summar|draft|copilot)/.test(textBlob);

  if (hasHiring) {
    matchedIds.add("118-s-4321");
    matchedIds.add("118-hr-1234");
  }

  if (hasPredictive || hasGeneralGovernance) {
    matchedIds.add("118-hr-1234");
  }

  if (matchedIds.size === 0) {
    matchedIds.add("118-hr-1234");
  }

  return {
    matchedIds,
    hasHiring,
    hasPredictive,
    hasGeneralGovernance,
    textBlob,
  };
}

function deriveIntakeRiskProfile(draft: IntakeDraft, matchedLaws: LawRecord[]): IntakeRiskProfile {
  const matches = createLawMatchSet(draft);
  const selectedCount = draft.selected_categories.length;
  let score = 22 + Math.min(18, selectedCount * 4) + matchedLaws.length * 5;

  if (matches.hasHiring) {
    score += 32;
  }

  if (matches.hasPredictive) {
    score += matchedLaws.length > 1 ? 20 : 16;
  }

  if (matches.hasGeneralGovernance) {
    score += 6;
  }

  score = Math.max(24, Math.min(94, score));
  const level = deriveSeverity(score);

  if (matches.hasHiring) {
    return {
      score,
      level,
      headline: "Employment-related AI requires the most immediate review.",
      narrative:
        "Hiring and HR workflows are in scope, and the current federal legislative overlap points to stronger notice, accountability, and audit-readiness expectations for screening and recommendation systems.",
      deploymentProfile:
        "Employment-related AI is part of the active deployment profile, so candidate-facing controls and defensible model governance should be treated as priority workstreams.",
      reviewCadence: "Weekly compliance and hiring AI review",
      primaryWorkflow: "Hiring, screening, and employment decision support",
    };
  }

  if (matches.hasPredictive) {
    return {
      score,
      level,
      headline: "Predictive systems need structured federal monitoring.",
      narrative:
        "Predictive analytics and business-facing scoring workflows create meaningful regulatory exposure because they influence consequential decisions and require stronger transparency and governance evidence.",
      deploymentProfile:
        "Predictive AI systems are in scope, with a need for documented review of model purpose, escalation, and control ownership.",
      reviewCadence: "Bi-weekly governance review",
      primaryWorkflow: "Predictive analytics and operational scoring workflows",
    };
  }

  return {
    score,
    level,
    headline: "The current AI footprint warrants measured federal monitoring.",
    narrative:
      "The deployment profile is lower sensitivity than hiring or consequential scoring, but it still benefits from federal legislative tracking, documented oversight, and exportable compliance reporting.",
    deploymentProfile:
      "General-purpose AI systems are in scope, with lower immediate pressure but ongoing expectations around transparency, governance, and operational review.",
    reviewCadence: "Monthly governance review",
    primaryWorkflow: "General-purpose AI workflows",
  };
}

function buildAssessmentFromLaws(
  laws: LawRecord[],
  options?: {
    deployedSystems?: string[];
    sourceLabel?: string;
    context?: AssessmentContext;
    riskProfile?: IntakeRiskProfile;
    businessAreas?: string[];
  }
): ComplianceAssessment {
  const context = options?.context ?? buildDefaultAssessmentContext(options);
  const applicableLaws = laws.map((law) => ({
    ...createAssessmentLaw(law),
    why_it_applies: buildLawApplicabilityExplanation(law, context),
  }));
  const requiredActions = sortComplianceActions(
    laws.flatMap((law) =>
      law.requiredActions.slice(0, 2).map((action, index) => createActionFromLaw(law, action, index))
    )
  ).slice(0, 8);
  const defaultRiskScore = Math.max(
    28,
    Math.min(
      92,
      laws.reduce((score, law) => {
        if (law.risk === "HIGH") {
          return score + 20;
        }

        if (law.risk === "MEDIUM") {
          return score + 12;
        }

        return score + 6;
      }, 18)
    )
  );
  const riskScore = options?.riskProfile?.score ?? defaultRiskScore;
  const severity = options?.riskProfile?.level ?? deriveSeverity(riskScore);
  const summary = deriveSummary(riskScore, applicableLaws, requiredActions, options?.riskProfile);

  return {
    risk_score: riskScore,
    severity,
    source_label: options?.sourceLabel ?? "VComply Assessment Engine",
    summary,
    impacted_business_areas:
      options?.businessAreas ??
      Array.from(new Set(laws.flatMap((law) => [law.category, ...law.affectedWorkflows.slice(0, 1)]))).slice(0, 5),
    operational_summary: {
      deployment_profile:
        options?.riskProfile?.deploymentProfile ??
        "Federal legislative monitoring is active for the current AI deployment profile.",
      business_areas:
        options?.businessAreas ??
        Array.from(new Set(laws.map((law) => law.category))).slice(0, 4),
      deployed_systems:
        options?.deployedSystems ??
        ["AI workflow under review"],
      jurisdictions: ["United States"],
      review_cadence:
        options?.riskProfile?.reviewCadence ??
        (severity === "HIGH" ? "Weekly federal monitoring review" : "Bi-weekly governance review"),
    },
    status_indicators: buildStatusIndicators(applicableLaws, requiredActions, options?.riskProfile),
    applicable_laws: applicableLaws,
    required_actions: requiredActions,
    recent_activity: [
      {
        id: "activity-federal-review",
        title: "Federal legislative watchlist refreshed",
        detail:
          "Congress.gov-backed records were normalized into the current compliance workspace for review.",
        date: "Current session",
        status: "Completed",
      },
      {
        id: "activity-controls",
        title: "Control evidence review queued",
        detail:
          "VComply identified the current documentation and monitoring work needed for the selected AI systems.",
        date: "Today",
        status: "In Progress",
      },
      {
        id: "activity-export",
        title: "Workspace ready for export",
        detail:
          "The active report can be exported as PDF or CSV for legal, compliance, and product stakeholders.",
        date: "Today",
        status: "Scheduled",
      },
    ],
  };
}

export const dashboardQuickLinks = [
  {
    id: "audit-log",
    title: "Audit Evidence Log",
    description: "Export control notes, audits, and federal monitoring artifacts",
    icon: "document",
  },
  {
    id: "laws",
    title: "Federal Laws Explorer",
    description: "Review Congress.gov-backed records and legislative status",
    icon: "search",
  },
  {
    id: "inventory",
    title: "Assessment Intake",
    description: "Refresh the company profile and AI systems in scope",
    icon: "gear",
  },
];

export const lawFilterOptions = {
  jurisdictions: ["United States"],
  useCases: Array.from(new Set(lawsData.flatMap((law) => law.useCases))).sort(),
  riskLevels: ["HIGH", "MEDIUM", "LOW"] as RiskLevel[],
  enforcementStages: Array.from(new Set(lawsData.map((law) => law.enforcementStage))).sort(),
  categories: Array.from(new Set(lawsData.map((law) => law.category))).sort(),
};

export function getRiskLevelOptions(risks: string[]) {
  const order: RiskLevel[] = ["HIGH", "MEDIUM", "LOW"];
  const set = new Set<RiskLevel>(order);

  risks.forEach((risk) => {
    if (risk === "HIGH" || risk === "MEDIUM" || risk === "LOW") {
      set.add(risk);
    }
  });

  return order.filter((risk) => set.has(risk));
}

export function buildLawApplicabilityExplanation(
  law: Pick<LawRecord, "title" | "useCases" | "affectedWorkflows" | "category">,
  context?: AssessmentContext
) {
  const companyLabel = context?.companyName?.trim() || "your company";
  const useCaseText = context?.aiUseCases?.toLowerCase() ?? "";
  const selectedCategoryTitles =
    context?.selectedCategories
      ?.reduce<string[]>((titles, categoryId) => {
        const title = modelCategoryLookup.get(categoryId as CategoryId)?.title;
        if (title) {
          titles.push(title);
        }
        return titles;
      }, []) ?? [];
  const combinedScope = [useCaseText, ...selectedCategoryTitles.map((title) => title.toLowerCase())].join(" ");

  if (law.category === "Employment AI" || /hiring|candidate|recruit|employment/.test(combinedScope)) {
    return `${companyLabel} has employment-related AI in scope, which is why ${law.title} is being surfaced as a federal watchpoint for screening, recommendation, and hiring transparency controls.`;
  }

  if (/score|underwriting|fraud|eligibility|risk/.test(combinedScope)) {
    return `${companyLabel} appears to rely on consequential scoring or risk workflows, so ${law.title} is relevant for audit readiness, documentation, and executive oversight.`;
  }

  if (/vision|biometric|identity|image|surveillance/.test(combinedScope)) {
    return `${companyLabel} uses vision-enabled or identity-related workflows, which makes ${law.title} relevant to transparency, review, and control evidence planning.`;
  }

  if (/assistant|chatbot|support|workflow|automation|llm|recommend/.test(combinedScope)) {
    return `${companyLabel} operates general-purpose AI systems that still benefit from stronger documentation and transparency controls, which is why ${law.title} appears in the current federal assessment.`;
  }

  const workflow = law.affectedWorkflows[0] ?? law.category.toLowerCase();
  return `${companyLabel} has ${workflow.toLowerCase()} in scope, and ${law.title} is relevant because it reflects the current federal legislative direction for AI governance and oversight.`;
}

export function generateComplianceSummaryText(assessment: ComplianceAssessment) {
  const recordCount = assessment.summary.impacted_regulation_count;
  const highRisk = assessment.summary.high_risk_issues;
  const areas = assessment.impacted_business_areas.slice(0, 2).map((area) => area.toLowerCase());
  const areaText = areas.length > 0 ? formatList(areas) : "in-scope AI systems";

  return `The current workspace maps ${recordCount} federal legislative record${
    recordCount === 1 ? "" : "s"
  } to ${areaText}, with a computed ${assessment.severity.toLowerCase()} risk posture and ${highRisk} high-priority watchpoint${
    highRisk === 1 ? "" : "s"
  } requiring review.`;
}

function normalizeComplianceAction(
  action: Partial<ComplianceAction>,
  index: number
): ComplianceAction {
  return {
    id: fallbackText(action.id, `action-${index}`),
    title: fallbackText(action.title, "Review federal legislative obligation"),
    system: fallbackText(action.system, "In-scope workflow"),
    source: fallbackText(action.source, "Assessment result"),
    priority:
      action.priority === "HIGH" ||
      action.priority === "MEDIUM" ||
      action.priority === "LOW" ||
      action.priority === "INFO"
        ? action.priority
        : "MEDIUM",
    description: fallbackText(action.description, "No action detail provided."),
    status: normalizeActionStatus(action.status),
    owner: fallbackText(action.owner, "Compliance Program"),
    due: fallbackText(action.due, ""),
    business_area: fallbackText(action.business_area, ""),
  };
}

function normalizeStoredLaw(
  law: ApplicableLaw,
  index: number,
  draft?: IntakeDraft | null
): AssessmentLaw {
  const matchingRecord = findMatchingLawRecord({ id: law.id, law: law.law });

  if (matchingRecord) {
    return {
      ...createAssessmentLaw(matchingRecord),
      why_it_applies: buildLawApplicabilityExplanation(matchingRecord, {
        companyName: draft?.company_name || "your company",
        aiUseCases: [draft?.ai_use_cases, draft?.critical_use_cases, draft?.additional_context]
          .filter(Boolean)
          .join(", "),
        selectedCategories: draft?.selected_categories,
      }),
    };
  }

  const risk = normalizeRiskLevel(String(law.risk));

  return {
    id: law.id ?? `stored-law-${index}`,
    law: fallbackText(law.law, `Federal Record ${index + 1}`),
    risk,
    reason: fallbackText(law.reason, "No risk rationale provided."),
    next_step: fallbackText(law.next_step, "Review federal legislative status"),
    jurisdiction: fallbackText(law.jurisdiction, "United States"),
    category: "Federal AI Legislation",
    status: risk === "HIGH" ? "ACTIVE" : "MONITORING",
    enforcement_status: "Pending classification",
    affected_workflows: [],
    why_it_applies: fallbackText(
      law.reason,
      "The backend did not provide a detailed rationale for this regulation."
    ),
    owner: "Compliance Program",
    source_label: "Stored workspace assessment",
    team: "Compliance Program",
  };
}

function normalizeSourceLawAsApplicableLaw(law: SourceLaw, index: number): ApplicableLaw {
  return {
    id: law.id || `source-law-${index}`,
    law: fallbackText(law.law, `Federal Record ${index + 1}`),
    jurisdiction: fallbackText(law.jurisdiction, "United States"),
    risk: normalizeRiskLevel(law.risk),
    reason: fallbackText(law.reason, "No risk rationale provided."),
    next_step:
      law.status === "ENACTED"
        ? "Review enacted federal text"
        : "Monitor congressional status",
  };
}

export function normalizeComplianceAssessment(
  input: unknown,
  draft?: IntakeDraft | null
): ComplianceAssessment | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Partial<ComplianceAssessment> & {
    applicable_laws?: ApplicableLaw[];
    required_actions?: ComplianceAction[];
    source_laws?: SourceLaw[];
  };

  if (
    typeof candidate.risk_score !== "number" &&
    !Array.isArray(candidate.applicable_laws) &&
    !Array.isArray(candidate.required_actions) &&
    !Array.isArray(candidate.source_laws)
  ) {
    return null;
  }

  const normalizedApplicableInput =
    Array.isArray(candidate.applicable_laws) && candidate.applicable_laws.length > 0
      ? candidate.applicable_laws
      : Array.isArray(candidate.source_laws)
        ? candidate.source_laws.map((law, index) => normalizeSourceLawAsApplicableLaw(law, index))
        : [];

  const applicableLaws = normalizedApplicableInput
    .map((law, index) => normalizeStoredLaw(law, index, draft))
    .slice(0, 6);

  const fallbackRequiredActions: ComplianceAction[] = sortComplianceActions(
    applicableLaws.map((law, index): ComplianceAction => ({
      id: `normalized-action-${index}`,
      title: law.next_step,
      system: law.affected_workflows?.[0] ?? law.category ?? "In-scope workflow",
      source: law.law,
      priority: normalizeRiskLevel(law.risk),
      description: law.why_it_applies ?? law.reason,
      status: normalizeRiskLevel(law.risk) === "HIGH" ? "OPEN" : "IN_PROGRESS",
      owner: law.owner ?? "Compliance Program",
      business_area: law.category,
    }))
  );

  const requiredActions = sortComplianceActions(
    Array.isArray(candidate.required_actions) && candidate.required_actions.length > 0
      ? candidate.required_actions.map((action, index) => normalizeComplianceAction(action, index))
      : fallbackRequiredActions
  );

  const derivedRiskScore =
    applicableLaws.length > 0
      ? Math.max(
          20,
          applicableLaws.reduce((score, law) => {
            if (law.risk === "HIGH") {
              return score + 24;
            }

            if (law.risk === "MEDIUM") {
              return score + 14;
            }

            return score + 8;
          }, 0)
        )
      : requiredActions.length > 0
        ? 35
        : 0;
  const riskScore =
    typeof candidate.risk_score === "number" && Number.isFinite(candidate.risk_score)
      ? candidate.risk_score
      : Math.min(100, derivedRiskScore);
  const severity = deriveSeverity(riskScore);
  const derivedSummary = deriveSummary(riskScore, applicableLaws, requiredActions);
  const summary = candidate.summary
    ? {
        headline: fallbackText(candidate.summary.headline, derivedSummary.headline),
        narrative: fallbackText(candidate.summary.narrative, derivedSummary.narrative),
        high_risk_issues:
          typeof candidate.summary.high_risk_issues === "number"
            ? candidate.summary.high_risk_issues
            : derivedSummary.high_risk_issues,
        medium_risk_issues:
          typeof candidate.summary.medium_risk_issues === "number"
            ? candidate.summary.medium_risk_issues
            : derivedSummary.medium_risk_issues,
        required_action_count:
          typeof candidate.summary.required_action_count === "number"
            ? candidate.summary.required_action_count
            : derivedSummary.required_action_count,
        impacted_regulation_count:
          typeof candidate.summary.impacted_regulation_count === "number"
            ? candidate.summary.impacted_regulation_count
            : derivedSummary.impacted_regulation_count,
      }
    : derivedSummary;
  const impactedBusinessAreas = Array.from(
    new Set([
      ...safeStringArray(candidate.impacted_business_areas),
      ...applicableLaws.flatMap((law) => law.affected_workflows ?? []),
    ])
  );
  const businessAreas = safeStringArray(candidate.operational_summary?.business_areas);
  const deployedSystems = safeStringArray(candidate.operational_summary?.deployed_systems);
  const recentActivity =
    Array.isArray(candidate.recent_activity) && candidate.recent_activity.length > 0
      ? candidate.recent_activity.map((item, index) => ({
          id: fallbackText(item?.id, `activity-${index}`),
          title: fallbackText(item?.title, "Assessment activity recorded"),
          detail: fallbackText(item?.detail, "Activity details were not provided."),
          date: fallbackText(item?.date, "Current session"),
          status:
            item?.status === "Completed" ||
            item?.status === "In Progress" ||
            item?.status === "Scheduled" ||
            item?.status === "Flagged"
              ? item.status
              : "In Progress",
        }))
      : [
          {
            id: "stored-activity",
            title: "Assessment loaded from local workspace",
            detail:
              "The dashboard is rendering from saved browser state while backend synchronization remains in progress.",
            date: "Current session",
            status: "In Progress" as const,
          },
        ];

  return {
    risk_score: riskScore,
    severity,
    source_label: fallbackText(candidate.source_label, "Stored workspace assessment"),
    summary,
    impacted_business_areas:
      impactedBusinessAreas.length > 0 ? impactedBusinessAreas.slice(0, 6) : ["Assessment scope pending"],
    operational_summary: {
      deployment_profile: fallbackText(
        candidate.operational_summary?.deployment_profile,
        severity === "HIGH"
          ? "Assessment data indicates consequential AI usage requiring immediate review."
          : "Assessment data indicates active federal monitoring requirements across in-scope AI systems."
      ),
      business_areas:
        businessAreas.length > 0
          ? businessAreas
          : (Array.from(new Set(applicableLaws.map((law) => law.category).filter(Boolean))) as string[]),
      deployed_systems:
        deployedSystems.length > 0
          ? deployedSystems
          : (Array.from(
              new Set(applicableLaws.map((law) => law.affected_workflows?.[0]).filter(Boolean))
            ) as string[]),
      jurisdictions: ["United States"],
      review_cadence: fallbackText(
        candidate.operational_summary?.review_cadence,
        severity === "HIGH" ? "Weekly federal monitoring review" : "Bi-weekly governance review"
      ),
    },
    status_indicators:
      Array.isArray(candidate.status_indicators) && candidate.status_indicators.length > 0
        ? candidate.status_indicators.map((indicator, index) => ({
            label: fallbackText(indicator?.label, `Status ${index + 1}`),
            value: fallbackText(indicator?.value, "Unavailable"),
            tone:
              indicator?.tone === "blue" ||
              indicator?.tone === "high" ||
              indicator?.tone === "medium" ||
              indicator?.tone === "low" ||
              indicator?.tone === "neutral"
                ? indicator.tone
                : "neutral",
          }))
        : buildStatusIndicators(applicableLaws, requiredActions),
    applicable_laws: applicableLaws,
    required_actions: requiredActions,
    recent_activity: recentActivity,
  };
}

export function createAssessmentFromIntake(draft: IntakeDraft): ComplianceAssessment {
  const matches = createLawMatchSet(draft);
  const chosenLaws = lawsData.filter((law) => matches.matchedIds.has(law.id));
  const riskProfile = deriveIntakeRiskProfile(draft, chosenLaws);
  const selectedSystems = modelCategories
    .filter((category) => draft.selected_categories.includes(category.id))
    .map((category) => category.title)
    .slice(0, 4);
  const businessAreas = Array.from(
    new Set([
      draft.industry || "Enterprise Operations",
      ...selectedSystems,
      ...chosenLaws.map((law) => law.category),
    ])
  ).slice(0, 5);

  return buildAssessmentFromLaws(chosenLaws, {
    deployedSystems: selectedSystems.length > 0 ? selectedSystems : ["General-purpose AI workflow"],
    businessAreas,
    riskProfile,
    sourceLabel: `VComply Assessment Engine • ${draft.company_name || "Current Company"} snapshot`,
    context: {
      companyName: draft.company_name || "your company",
      aiUseCases: [draft.ai_use_cases, draft.critical_use_cases, draft.additional_context]
        .filter(Boolean)
        .join(", "),
      selectedCategories: draft.selected_categories,
      deployedSystems: selectedSystems,
    },
  });
}

export function createDashboardAssessmentFromLawRecords(
  lawRecords: LawRecord[],
  options?: {
    companyName?: string;
    selectedCategories?: string[];
  }
): ComplianceAssessment {
  const records = lawRecords.slice(0, 4);
  const selectedCategories = options?.selectedCategories ?? ["llm", "hiring-hr-ai"];
  const deployedSystems = modelCategories
    .filter((category) => selectedCategories.includes(category.id))
    .map((category) => category.title)
    .slice(0, 4);
  const riskProfile = deriveIntakeRiskProfile(
    {
      company_name: options?.companyName ?? "Demo Workspace",
      industry: "Enterprise Operations",
      ai_use_cases:
        "candidate screening, document automation, support assistance, and internal search",
      selected_categories: selectedCategories,
      critical_use_cases:
        "The organization uses AI in hiring-adjacent workflows and internal compliance operations.",
      data_provenance: "First-party enterprise datasets",
      additional_context:
        "This assessment is generated from live federal law records in the VComply catalog.",
    },
    records
  );

  return buildAssessmentFromLaws(records, {
    deployedSystems,
    businessAreas: Array.from(new Set(records.map((law) => law.category))).slice(0, 4),
    riskProfile,
    sourceLabel: `VComply Assessment Engine • ${options?.companyName ?? "Demo Workspace"} snapshot`,
    context: {
      companyName: options?.companyName ?? "Demo Workspace",
      aiUseCases:
        "candidate screening, document automation, support assistance, and internal search",
      selectedCategories,
      deployedSystems,
    },
  });
}

const sampleDraft: IntakeDraft = {
  company_name: "Northstar Benefits Group",
  industry: "Insurance and Benefits Administration",
  ai_use_cases: "candidate screening, support automation, workflow summarization",
  selected_categories: ["hiring-hr-ai", "customer-support-ai", "llm"],
  critical_use_cases:
    "The team uses AI-assisted ranking to prioritize candidates and summarize recruiter notes for hiring managers.",
  data_provenance: "First-party enterprise datasets",
  additional_context:
    "Compliance leadership needs a federal legislative snapshot for workforce systems and executive review.",
};

export const defaultAssessment = createAssessmentFromIntake(sampleDraft);
