export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type ActionPriority = RiskLevel | "INFO";

export type AssessmentLawStatus = "ACTIVE" | "UPCOMING" | "MONITORING";

export type EnforcementStatus = "ENACTED" | "PROPOSED" | "GUIDANCE";

export type DashboardActionStatus = "OPEN" | "IN_PROGRESS" | "SCHEDULED" | "COMPLETED";

export type ChecklistActionStatus = "todo" | "complete";

export type ApplicableLaw = {
  id?: string;
  law: string;
  jurisdiction?: string;
  risk: RiskLevel | string;
  reason: string;
  next_step?: string;
};

export type AssessmentLaw = ApplicableLaw & {
  id?: string;
  next_step: string;
  jurisdiction?: string;
  category?: string;
  status?: AssessmentLawStatus;
  enforcement_status?: string;
  affected_workflows?: string[];
  why_it_applies?: string;
  owner?: string;
  source_label?: string;
  team?: string;
};

export type ComplianceAction = {
  id: string;
  title: string;
  system: string;
  source: string;
  priority: ActionPriority;
  description?: string;
  status?: DashboardActionStatus;
  owner?: string;
  due?: string;
  business_area?: string;
};

export type LawAction = {
  id: string;
  title: string;
  description?: string;
  article: string;
  due: string;
  urgency?: ActionPriority;
  status: ChecklistActionStatus;
  owner?: string;
};

export type LawTimelineItem = {
  date: string;
  label: string;
  detail: string;
};

export type LawRecord = {
  id: string;
  title: string;
  jurisdiction: string;
  regionBadge: string;
  status: EnforcementStatus;
  risk: RiskLevel;
  category: string;
  summary: string;
  description: string;
  whyItMatters: string;
  useCases: string[];
  affectedWorkflows: string[];
  tags: string[];
  effectiveDate: string;
  enforcementStage: string;
  enforcementStatus: string;
  sourceLabel: string;
  ownerTeam: string;
  notes?: string[];
  exposure: {
    title: string;
    body: string;
    penalty: string;
    rationale: string;
  };
  requiredActions: LawAction[];
  timeline: LawTimelineItem[];
};

export type AssessmentSummary = {
  headline: string;
  narrative: string;
  high_risk_issues: number;
  medium_risk_issues: number;
  required_action_count: number;
  impacted_regulation_count: number;
};

export type OperationalSummary = {
  deployment_profile: string;
  business_areas: string[];
  deployed_systems: string[];
  jurisdictions: string[];
  review_cadence: string;
};

export type StatusIndicatorTone = "blue" | "high" | "medium" | "low" | "neutral";

export type StatusIndicator = {
  label: string;
  value: string;
  tone: StatusIndicatorTone;
};

export type RecentActivityItem = {
  id: string;
  title: string;
  detail: string;
  date: string;
  status: "Completed" | "In Progress" | "Scheduled" | "Flagged";
};

export type ComplianceAssessment = {
  risk_score: number;
  severity: RiskLevel;
  summary: AssessmentSummary;
  source_label: string;
  impacted_business_areas: string[];
  operational_summary: OperationalSummary;
  status_indicators: StatusIndicator[];
  applicable_laws: AssessmentLaw[];
  required_actions: ComplianceAction[];
  recent_activity: RecentActivityItem[];
};

export type IntakeDraft = {
  company_name: string;
  industry: string;
  states_of_operation: string;
  ai_use_cases: string;
  uses_ai_in_hiring: boolean;
  selected_categories: string[];
  critical_use_cases: string;
  data_provenance: string;
  additional_context: string;
};

export type ApplicabilityCheckRequest = {
  states: string[];
  uses_hiring_ai: boolean;
};

export type ApplicabilityCheckResponse = {
  applicable_laws: ApplicableLaw[];
  risk_score: number;
};

export type LawApiRecord = {
  id?: string;
  name?: string;
  law?: string;
  title?: string;
  jurisdiction?: string;
  summary?: string;
  risk?: RiskLevel | string;
  category?: string;
};

export type LawsResponse = {
  laws: LawApiRecord[];
};
