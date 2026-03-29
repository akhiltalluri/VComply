import type { LawRecord } from "@/types";

function createFederalMonitoringAction(
  id: string,
  title: string,
  article: string,
  due: string,
  urgency: "HIGH" | "MEDIUM" | "LOW",
  description: string,
  owner: string
) {
  return {
    id,
    title,
    article,
    due,
    urgency,
    status: "todo" as const,
    description,
    owner,
  };
}

export const federalSeedLawRecords: LawRecord[] = [
  {
    id: "118-hr-1234",
    title: "Artificial Intelligence Accountability Act",
    jurisdiction: "United States",
    regionBadge: "US",
    status: "PROPOSED",
    risk: "HIGH",
    category: "AI Governance",
    summary:
      "Congress.gov record proposing transparency and audit controls for high-impact automated decision systems.",
    description:
      "This Congress.gov-backed record tracks the Artificial Intelligence Accountability Act, a federal proposal focused on transparency, audit readiness, and governance controls for consequential automated decision systems.",
    whyItMatters:
      "High-impact AI programs usually need stronger documentation, review evidence, and escalation paths long before a bill becomes enforceable. This record is useful for federal legislative monitoring and control planning.",
    useCases: ["High-impact AI", "Risk scoring", "Model governance"],
    affectedWorkflows: [
      "Model governance review",
      "High-impact scoring systems",
      "Audit readiness",
    ],
    tags: ["118th Congress", "Transparency", "Audit"],
    effectiveDate: "Not enacted",
    enforcementStage: "Committee Review",
    enforcementStatus: "Referred to the House Committee on Science, Space, and Technology.",
    sourceLabel: "Congress.gov",
    ownerTeam: "Federal Affairs",
    notes: [
      "Track as a federal legislative record, not an enacted obligation.",
      "Use it to prepare governance evidence for high-impact systems already in production.",
    ],
    exposure: {
      title: "Federal legislative watchpoint",
      body:
        "Teams deploying consequential AI should monitor this bill because it signals likely federal expectations around auditability, documentation, and transparency.",
      penalty:
        "No federal penalty is active unless and until Congress advances and enacts the proposal.",
      rationale:
        "The strongest signal is governance readiness: if an organization cannot explain a high-impact model today, it will struggle if federal obligations tighten.",
    },
    requiredActions: [
      createFederalMonitoringAction(
        "ai-accountability-inventory",
        "Inventory high-impact AI systems",
        "Congress.gov bill summary",
        "Current review cycle",
        "HIGH",
        "Identify consequential systems that would need audit evidence, governance owners, and traceable controls if the bill advances.",
        "Federal Affairs"
      ),
      createFederalMonitoringAction(
        "ai-accountability-brief",
        "Prepare federal monitoring brief",
        "Latest congressional action",
        "Next legislative review",
        "MEDIUM",
        "Summarize the latest congressional action and note which business stakeholders would be affected by stronger transparency requirements.",
        "Legal Operations"
      ),
    ],
    timeline: [
      {
        date: "2024-04-15",
        label: "Introduced in Congress",
        detail: "Artificial Intelligence Accountability Act introduced in the House.",
      },
      {
        date: "2024-04-22",
        label: "Referred to committee",
        detail: "Referred to the House Committee on Science, Space, and Technology.",
      },
    ],
  },
  {
    id: "118-s-4321",
    title: "Federal AI Transparency in Employment Act",
    jurisdiction: "United States",
    regionBadge: "US",
    status: "PROPOSED",
    risk: "HIGH",
    category: "Employment AI",
    summary:
      "Congress.gov record proposing notice and audit obligations for AI used in employment screening and recommendation workflows.",
    description:
      "This federal legislative record focuses on employment-related AI screening and recommendation systems, with proposed notice, audit, and transparency requirements for hiring workflows.",
    whyItMatters:
      "Hiring and HR systems are one of the most sensitive AI deployment areas. Even as a bill, this record is a strong signal that employment-facing models should have reviewable fairness, notice, and governance controls.",
    useCases: ["Hiring & HR AI", "Candidate screening", "Employment recommendations"],
    affectedWorkflows: [
      "Candidate screening",
      "Recruiter decision support",
      "Employment audit readiness",
    ],
    tags: ["118th Congress", "Employment", "Notice"],
    effectiveDate: "Not enacted",
    enforcementStage: "Active Legislative Process",
    enforcementStatus: "Placed on Senate Legislative Calendar under General Orders.",
    sourceLabel: "Congress.gov",
    ownerTeam: "Employment Compliance",
    notes: [
      "Treat as a congressional proposal, not an enacted employment law.",
      "Useful for pressure-testing hiring AI controls and candidate-facing notice language.",
    ],
    exposure: {
      title: "Federal employment watchpoint",
      body:
        "Organizations using AI for candidate screening, ranking, or employment recommendations should treat this bill as a signal to document fairness testing, candidate notices, and model accountability.",
      penalty:
        "No enforceable federal penalty applies unless Congress enacts the proposal.",
      rationale:
        "Employment-related AI creates the clearest overlap between consequential decision-making and federal legislative attention.",
    },
    requiredActions: [
      createFederalMonitoringAction(
        "employment-ai-notice",
        "Review hiring AI notice language",
        "Congress.gov bill summary",
        "Before next hiring cycle",
        "HIGH",
        "Confirm recruiting and HR teams can explain when AI contributes to screening, ranking, or recommendation workflows.",
        "Talent Operations"
      ),
      createFederalMonitoringAction(
        "employment-ai-audit",
        "Confirm fairness testing evidence",
        "Latest congressional action",
        "Current review cycle",
        "HIGH",
        "Document the audit, validation, and review artifacts already available for employment-facing models.",
        "Employment Compliance"
      ),
    ],
    timeline: [
      {
        date: "2024-06-10",
        label: "Introduced in Congress",
        detail: "Federal AI Transparency in Employment Act introduced in the Senate.",
      },
      {
        date: "2024-07-01",
        label: "Placed on Senate calendar",
        detail: "Placed on Senate Legislative Calendar under General Orders.",
      },
    ],
  },
];

export const federalLandingPreview = federalSeedLawRecords.map((law) => ({
  name: law.title,
  detail: law.summary,
  risk: law.risk === "HIGH" ? "High-priority monitoring" : "Monitoring",
}));
