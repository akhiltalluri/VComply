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
    description: "Customer support, drafting, summarization, and agentic reasoning systems.",
  },
  {
    id: "vision",
    title: "Computer Vision",
    description: "Image recognition, biometric analysis, identity verification, and review tooling.",
  },
  {
    id: "predictive",
    title: "Predictive Analytics",
    description: "Ranking, scoring, forecasting, recommendation, and eligibility systems.",
  },
  {
    id: "robotics",
    title: "Robotics / Autonomous",
    description: "Physical actuation, industrial control, and autonomous decision loops.",
  },
];

function lawAction(
  id: string,
  title: string,
  article: string,
  due: string,
  urgency: RiskLevel | "INFO",
  status: "todo" | "complete",
  description: string,
  owner?: string
): LawAction {
  return {
    id,
    title,
    article,
    due,
    urgency,
    status,
    description,
    owner,
  };
}

export const lawsData: LawRecord[] = [
  {
    id: "nyc-ll-144",
    title: "NYC Local Law 144",
    jurisdiction: "New York City",
    regionBadge: "NY",
    status: "ENACTED",
    risk: "HIGH",
    category: "Employment AI",
    summary:
      "Bias audit, notice, and publication obligations for automated employment decision tools used in hiring and promotion.",
    description:
      "NYC Local Law 144 governs automated employment decision tools used by employers and agencies in New York City. Covered tools require an independent bias audit, publication of audit results, and candidate notice before the system is used.",
    whyItMatters:
      "If AI influences candidate ranking, resume screening, or promotion decisions in New York City, the workflow moves from internal tooling into a directly regulated employment process.",
    useCases: ["Hiring"],
    affectedWorkflows: ["Candidate screening", "Resume ranking", "Promotion decisions"],
    tags: ["Bias Audit", "AEDT", "Employment"],
    effectiveDate: "July 5, 2023",
    enforcementStage: "Active Enforcement",
    enforcementStatus: "Active enforcement by NYC DCWP",
    sourceLabel: "VComply Policy Library",
    ownerTeam: "Employment Compliance",
    notes: [
      "Bias audit summaries must be publicly available before deployment.",
      "Material model changes can trigger the need for a fresh audit cycle.",
    ],
    exposure: {
      title: "Critical Exposure",
      body: "Hiring models used in New York City can trigger audit, disclosure, and candidate notice duties before the system is used in production.",
      penalty: "Civil penalties and corrective enforcement by NYC DCWP.",
      rationale:
        "Hiring is one of the most heavily scrutinized AI use cases because even assistive ranking can materially affect employment opportunities.",
    },
    requiredActions: [
      lawAction(
        "nyc-audit",
        "Complete independent bias audit",
        "Bias Audit Requirement",
        "Before next hiring cycle",
        "HIGH",
        "todo",
        "Commission a third-party bias audit for the candidate ranking workflow.",
        "Employment Compliance"
      ),
      lawAction(
        "nyc-publication",
        "Publish audit summary and methodology",
        "Public Disclosure",
        "Before deployment",
        "HIGH",
        "todo",
        "Prepare the public-facing summary required for candidate and regulator review.",
        "Legal Operations"
      ),
      lawAction(
        "nyc-notice",
        "Implement candidate notice workflow",
        "Candidate Notice",
        "Before use",
        "MEDIUM",
        "todo",
        "Add notice language to recruiting workflows and recruiter operating procedures.",
        "Talent Operations"
      ),
    ],
    timeline: [
      {
        date: "July 5, 2023",
        label: "Enforcement began",
        detail: "Audit and notice obligations became enforceable for covered AEDTs.",
      },
      {
        date: "Current",
        label: "Ongoing review window",
        detail: "Model changes should trigger a fresh audit readiness review.",
      },
    ],
  },
  {
    id: "ca-admt",
    title: "California ADMT Draft Regulations",
    jurisdiction: "California",
    regionBadge: "CA",
    status: "PROPOSED",
    risk: "MEDIUM",
    category: "Consumer Privacy",
    summary:
      "Draft CPPA rules on automated decision-making, profiling, notice, access, and opt-out rights.",
    description:
      "California's draft ADMT regulations would require businesses to inventory covered decision systems, provide notices, and offer additional controls where automated decision-making affects consumers or workers in significant ways.",
    whyItMatters:
      "Even ahead of final rulemaking, these drafts show where California expects profiling, recommendation, and consequential decision systems to provide stronger transparency and user controls.",
    useCases: ["Profiling", "Hiring"],
    affectedWorkflows: ["Consumer profiling", "Recommendation engines", "Hiring analytics"],
    tags: ["ADMT", "Opt-Out", "Notice"],
    effectiveDate: "Pending final rulemaking",
    enforcementStage: "Draft Rulemaking",
    enforcementStatus: "Draft regulations under CPPA review",
    sourceLabel: "VComply Research Desk",
    ownerTeam: "Privacy Ops",
    notes: [
      "Operational readiness matters even before the final text is effective.",
      "Current inventories will make final compliance much faster once the rule is settled.",
    ],
    exposure: {
      title: "Moderate Exposure",
      body: "Consumer profiling, personalization, and worker-facing scoring systems may soon require expanded notice and opt-out controls in California.",
      penalty: "Regulatory remediation obligations and consumer rights enforcement risk.",
      rationale:
        "California is shaping the U.S. baseline for automated decision transparency, especially for high-visibility consumer and workforce uses.",
    },
    requiredActions: [
      lawAction(
        "ca-inventory",
        "Map ADMT use cases and consumer touchpoints",
        "Draft ADMT Scope",
        "Current planning cycle",
        "MEDIUM",
        "todo",
        "Inventory recommendation, profiling, and worker-scoring systems that may fall into scope.",
        "Privacy Ops"
      ),
      lawAction(
        "ca-controls",
        "Draft notice and opt-out controls",
        "Draft Consumer Rights",
        "Before rule finalization",
        "MEDIUM",
        "todo",
        "Prepare product and policy changes for likely transparency and user control requirements.",
        "Product Counsel"
      ),
    ],
    timeline: [
      {
        date: "Current",
        label: "Rulemaking continues",
        detail: "Teams should maintain inventories and monitor CPPA updates for final scope.",
      },
    ],
  },
  {
    id: "illinois-ai-video",
    title: "Illinois AI Video Interview Act",
    jurisdiction: "Illinois",
    regionBadge: "IL",
    status: "ENACTED",
    risk: "HIGH",
    category: "Employment AI",
    summary:
      "Notice, consent, explanation, and deletion requirements for employers using AI to analyze video interviews.",
    description:
      "The Illinois AI Video Interview Act requires employers to notify candidates when AI evaluates interview videos, explain the role of AI, obtain consent, and follow sharing and deletion controls for interview recordings.",
    whyItMatters:
      "AI-assisted interview scoring is expressly regulated in Illinois, so otherwise routine recruiter tooling can create statutory notice and retention obligations immediately.",
    useCases: ["Hiring"],
    affectedWorkflows: ["Video interview analysis", "Candidate scoring", "Recruiter review tooling"],
    tags: ["Consent", "Deletion", "Employment"],
    effectiveDate: "January 1, 2020",
    enforcementStage: "In Force",
    enforcementStatus: "In effect",
    sourceLabel: "VComply Policy Library",
    ownerTeam: "Talent Operations",
    notes: [
      "Candidate-facing language should explain how AI contributes to interview evaluation.",
      "Deletion requests require an operational process, not just a policy statement.",
    ],
    exposure: {
      title: "Critical Exposure",
      body: "AI-assisted interview review in Illinois can create direct consent and retention obligations that standard recruiting workflows usually do not handle by default.",
      penalty: "State enforcement risk and employment-related claims.",
      rationale:
        "Video analysis creates a high-trust risk surface because candidates are directly subject to algorithmic evaluation.",
    },
    requiredActions: [
      lawAction(
        "il-consent",
        "Update candidate consent workflow",
        "Consent Requirement",
        "Immediately",
        "HIGH",
        "todo",
        "Capture explicit consent before AI analysis is applied to interview recordings.",
        "Talent Operations"
      ),
      lawAction(
        "il-deletion",
        "Implement interview deletion process",
        "Deletion / Disclosure",
        "Immediately",
        "HIGH",
        "todo",
        "Document retention limits, access restrictions, and deletion handling for interview media.",
        "People Systems"
      ),
    ],
    timeline: [
      {
        date: "January 1, 2020",
        label: "Act effective",
        detail: "Candidate notice and consent obligations took effect for covered interview workflows.",
      },
    ],
  },
  {
    id: "bipa",
    title: "Illinois BIPA",
    jurisdiction: "Illinois",
    regionBadge: "IL",
    status: "ENACTED",
    risk: "HIGH",
    category: "Biometric Privacy",
    summary:
      "Strict written consent, retention, and disclosure rules for biometric identifiers and biometric information.",
    description:
      "The Illinois Biometric Information Privacy Act requires informed written consent, retention schedules, and restrictions on disclosure when companies collect or process biometric identifiers or related biometric information.",
    whyItMatters:
      "Biometric-enabled verification or analysis features can create immediate litigation exposure, even when no regulator is actively involved at the outset.",
    useCases: ["Biometric", "Hiring"],
    affectedWorkflows: ["Facial analysis", "Identity verification", "Biometric hiring tools"],
    tags: ["Biometrics", "Consent", "Retention"],
    effectiveDate: "October 3, 2008",
    enforcementStage: "Litigation Risk",
    enforcementStatus: "Private litigation and enforcement risk",
    sourceLabel: "VComply Litigation Watch",
    ownerTeam: "Privacy Engineering",
    notes: [
      "Private right of action makes implementation mistakes especially costly.",
      "Biometric features should be assessed before rollout in Illinois, even in pilot phases.",
    ],
    exposure: {
      title: "Critical Exposure",
      body: "Facial analysis and biometric identity workflows can trigger direct consent and retention duties with meaningful class-action exposure.",
      penalty: "Statutory damages and class-action litigation risk.",
      rationale:
        "BIPA is one of the clearest examples of how a narrow feature set can create outsized operational and financial risk.",
    },
    requiredActions: [
      lawAction(
        "bipa-consent",
        "Obtain written biometric consent",
        "Section 15(b)",
        "Before biometric collection",
        "HIGH",
        "todo",
        "Implement explicit consent before any biometric identifier is captured or analyzed.",
        "Privacy Engineering"
      ),
      lawAction(
        "bipa-retention",
        "Publish biometric retention schedule",
        "Section 15(a)",
        "Immediate priority",
        "HIGH",
        "todo",
        "Define retention and destruction timelines for biometric artifacts and derived signals.",
        "Data Governance"
      ),
    ],
    timeline: [
      {
        date: "Current",
        label: "Ongoing litigation risk",
        detail: "BIPA continues to drive significant class-action activity around biometric-enabled products.",
      },
    ],
  },
  {
    id: "mass-guidance",
    title: "Massachusetts Generative AI Guidance",
    jurisdiction: "Massachusetts",
    regionBadge: "MA",
    status: "GUIDANCE",
    risk: "LOW",
    category: "AI Governance",
    summary:
      "Governance guidance emphasizing human oversight, vendor diligence, documentation, and clear accountability for AI-assisted decisions.",
    description:
      "Massachusetts policy guidance on generative AI emphasizes procurement diligence, documentation, human review, and clear accountability when AI systems inform decisions with meaningful operational impact.",
    whyItMatters:
      "Even where requirements are guidance-based rather than statutory, they often shape what regulators, auditors, and enterprise customers expect to see in an AI governance program.",
    useCases: ["Governance", "Procurement"],
    affectedWorkflows: ["Vendor review", "Policy drafting", "Internal AI governance"],
    tags: ["Oversight", "Documentation", "Procurement"],
    effectiveDate: "2024 guidance cycle",
    enforcementStage: "Guidance / Monitoring",
    enforcementStatus: "Advisory guidance",
    sourceLabel: "VComply Governance Notes",
    ownerTeam: "AI Governance Council",
    notes: [
      "Useful as a practical baseline for governance even outside Massachusetts.",
      "Highlights procurement diligence and documented oversight expectations.",
    ],
    exposure: {
      title: "Operational Exposure",
      body: "The guidance is not directly punitive, but it raises the standard for what a mature enterprise AI governance program should document and demonstrate.",
      penalty: "Audit scrutiny and procurement friction.",
      rationale:
        "Soft-law guidance often becomes the benchmark enterprise customers expect during diligence and procurement reviews.",
    },
    requiredActions: [
      lawAction(
        "ma-oversight",
        "Document human oversight model",
        "Governance Guidance",
        "Next control review",
        "LOW",
        "todo",
        "Clarify escalation, override, and approval responsibilities for AI-assisted workflows.",
        "AI Governance Council"
      ),
      lawAction(
        "ma-standard",
        "Publish internal AI usage standard",
        "Operational Governance",
        "Next policy update",
        "LOW",
        "todo",
        "Capture acceptable use boundaries, review responsibilities, and vendor escalation paths.",
        "Policy Office"
      ),
    ],
    timeline: [
      {
        date: "2024",
        label: "Guidance published",
        detail: "State guidance highlighted governance, transparency, and oversight expectations for AI adoption.",
      },
    ],
  },
  {
    id: "eu-ai-act",
    title: "EU AI Act",
    jurisdiction: "European Union",
    regionBadge: "EU",
    status: "ENACTED",
    risk: "HIGH",
    category: "AI Governance",
    summary:
      "Comprehensive EU framework classifying AI systems by risk and imposing provider and deployer obligations.",
    description:
      "The EU AI Act establishes a broad risk-based framework for AI systems across the European Union, introducing obligations for high-risk systems, transparency requirements, governance controls, and enforcement mechanisms across multiple deployment scenarios.",
    whyItMatters:
      "This is the most consequential cross-sector AI law in the current landscape and can impose documentation, registration, governance, and post-market duties across multiple systems at once.",
    useCases: ["Hiring", "Profiling", "Governance"],
    affectedWorkflows: [
      "Hiring systems",
      "Scoring models",
      "Provider documentation",
      "Model governance",
    ],
    tags: ["High-Risk AI", "Documentation", "Registration"],
    effectiveDate: "August 1, 2024",
    enforcementStage: "Phased Enforcement",
    enforcementStatus: "Phased enforcement",
    sourceLabel: "VComply Policy Library",
    ownerTeam: "EU Compliance Program",
    notes: [
      "Different obligations phase in over time depending on system type and organizational role.",
      "High-risk system classification is often the biggest operational trigger for deployers.",
    ],
    exposure: {
      title: "Critical Exposure",
      body: "Hiring, scoring, and consequential decision workflows may classify parts of your system inventory as high-risk AI, triggering documentation, governance, and registration duties.",
      penalty: "Up to EUR 35M or 7% of global annual turnover.",
      rationale:
        "The EU AI Act creates formal provider and deployer duties that cannot be satisfied by policy text alone; teams need operational controls and evidence.",
    },
    requiredActions: [
      lawAction(
        "eu-qms",
        "Implement quality management controls",
        "Article 17",
        "Before high-risk deployment",
        "HIGH",
        "todo",
        "Stand up governance controls supporting risk management, recordkeeping, and accountability.",
        "EU Compliance Program"
      ),
      lawAction(
        "eu-tech-docs",
        "Generate technical documentation package",
        "Article 11",
        "Before placing on market",
        "HIGH",
        "todo",
        "Prepare system documentation covering intended use, safeguards, validation, and limitations.",
        "Model Governance"
      ),
      lawAction(
        "eu-registration",
        "Prepare registration workflow",
        "Article 49 / 60",
        "Before deployment",
        "MEDIUM",
        "todo",
        "Document the internal process for registering covered high-risk systems where required.",
        "Legal Operations"
      ),
    ],
    timeline: [
      {
        date: "August 1, 2024",
        label: "Act entered into force",
        detail: "The EU AI Act began phased implementation across prohibited practices, GPAI, and high-risk obligations.",
      },
      {
        date: "2025-2026",
        label: "Phased compliance windows",
        detail: "Additional duties continue rolling in across provider, deployer, and market obligations.",
      },
    ],
  },
  {
    id: "gdpr-article-22",
    title: "GDPR Article 22",
    jurisdiction: "European Union",
    regionBadge: "EU",
    status: "ENACTED",
    risk: "MEDIUM",
    category: "Privacy",
    summary:
      "Restrictions on solely automated decisions with legal or similarly significant effects.",
    description:
      "GDPR Article 22 protects individuals from decisions based solely on automated processing that produce legal or similarly significant effects, requiring safeguards such as human intervention, appeal rights, and explainability controls.",
    whyItMatters:
      "Recommendation, ranking, and eligibility systems can cross into significant automated decision-making faster than teams expect, especially when human review is nominal rather than meaningful.",
    useCases: ["Profiling", "Hiring"],
    affectedWorkflows: ["Consumer profiling", "Eligibility decisions", "Automated ranking"],
    tags: ["Automated Decisions", "Human Review", "Privacy"],
    effectiveDate: "May 25, 2018",
    enforcementStage: "In Force",
    enforcementStatus: "In force",
    sourceLabel: "VComply Policy Library",
    ownerTeam: "Privacy Ops",
    notes: [
      "Often overlaps with transparency, lawful basis, and DPIA analysis under broader GDPR obligations.",
      "Particularly important where ranking materially affects access, pricing, or employment outcomes.",
    ],
    exposure: {
      title: "Moderate Exposure",
      body: "Profiling, ranking, or automated eligibility decisions for EU users may require stronger human review, recourse, and explanation controls.",
      penalty: "Supervisory action, fines, and remediation requirements.",
      rationale:
        "The risk is not just the model itself, but whether the organization can show meaningful review and redress for affected individuals.",
    },
    requiredActions: [
      lawAction(
        "gdpr-review",
        "Document human review fallback",
        "Article 22",
        "Immediate priority",
        "MEDIUM",
        "todo",
        "Define how a qualified reviewer intervenes before a decision takes legal or similarly significant effect.",
        "Privacy Ops"
      ),
      lawAction(
        "gdpr-disclosures",
        "Refresh explainability and appeals language",
        "Transparency Controls",
        "Next privacy review",
        "MEDIUM",
        "todo",
        "Update privacy notices and internal SOPs to explain review and challenge rights.",
        "Privacy Counsel"
      ),
    ],
    timeline: [
      {
        date: "May 25, 2018",
        label: "GDPR effective date",
        detail: "Automated decision-making safeguards became enforceable across the EU.",
      },
    ],
  },
  {
    id: "colorado-ai-act",
    title: "Colorado AI Act",
    jurisdiction: "Colorado",
    regionBadge: "CO",
    status: "ENACTED",
    risk: "MEDIUM",
    category: "AI Governance",
    summary:
      "State AI law covering developers and deployers of high-risk AI systems used in consequential decisions.",
    description:
      "Colorado's AI Act introduces duties for both developers and deployers of high-risk AI systems, including governance documentation, impact assessments, disclosures, and consumer protections for consequential decisions.",
    whyItMatters:
      "Colorado is one of the clearest state-level signals that consequential AI systems will soon require formal impact reviews and public-facing governance artifacts in the U.S.",
    useCases: ["Profiling", "Hiring"],
    affectedWorkflows: ["Scoring systems", "Recommendation engines", "Eligibility decisions"],
    tags: ["Impact Assessment", "Notice", "High-Risk AI"],
    effectiveDate: "February 1, 2026",
    enforcementStage: "Upcoming Compliance",
    enforcementStatus: "Upcoming compliance window",
    sourceLabel: "VComply Research Desk",
    ownerTeam: "AI Governance Council",
    notes: [
      "Impact assessment readiness is the main operational challenge for most deployers.",
      "This law is a useful readiness benchmark even for teams outside Colorado.",
    ],
    exposure: {
      title: "Moderate Exposure",
      body: "Scoring or recommendation models used in consequential decisions may require impact reviews, governance artifacts, and consumer-facing notices under Colorado law.",
      penalty: "State AG enforcement and corrective orders.",
      rationale:
        "Colorado pushes U.S. teams toward formalized AI governance even before a broader federal framework exists.",
    },
    requiredActions: [
      lawAction(
        "co-impact",
        "Stand up high-risk AI impact assessment process",
        "Deployer Duties",
        "Before February 2026",
        "MEDIUM",
        "todo",
        "Create a repeatable workflow to assess purpose, risk, mitigation, and monitoring.",
        "AI Governance Council"
      ),
      lawAction(
        "co-disclosures",
        "Prepare consumer-facing notices",
        "Disclosure Obligations",
        "Before February 2026",
        "MEDIUM",
        "todo",
        "Draft disclosures for consequential AI systems that affect individuals.",
        "Product Counsel"
      ),
    ],
    timeline: [
      {
        date: "February 1, 2026",
        label: "Core obligations expected",
        detail: "Colorado developer and deployer duties begin taking effect.",
      },
    ],
  },
  {
    id: "eeoc-ai-guidance",
    title: "EEOC AI Hiring Guidance",
    jurisdiction: "United States",
    regionBadge: "US",
    status: "GUIDANCE",
    risk: "MEDIUM",
    category: "Employment AI",
    summary:
      "Federal guidance on discrimination risk and employer accountability when AI is used in hiring.",
    description:
      "EEOC guidance makes clear that employers remain responsible for discriminatory outcomes caused by algorithmic hiring tools, with emphasis on accommodation, validation, and vendor oversight.",
    whyItMatters:
      "Even where the source is guidance rather than a statute, it shapes what employers are expected to validate, monitor, and explain when AI systems screen candidates or influence hiring outcomes.",
    useCases: ["Hiring"],
    affectedWorkflows: ["Candidate screening", "Assessment tools", "Vendor-provided hiring AI"],
    tags: ["Discrimination", "Vendor Oversight", "Validation"],
    effectiveDate: "2022 guidance onward",
    enforcementStage: "Guidance / Monitoring",
    enforcementStatus: "Agency guidance",
    sourceLabel: "VComply Employment Desk",
    ownerTeam: "Employment Compliance",
    notes: [
      "Vendor-provided systems do not transfer accountability away from the employer.",
      "Accommodation and adverse impact review remain recurring audit pressure points.",
    ],
    exposure: {
      title: "Moderate Exposure",
      body: "AI screening and ranking systems used in employment decisions can create Title VII and ADA-related risk even when sourced from third-party vendors.",
      penalty: "EEOC enforcement and employment claims.",
      rationale:
        "This guidance is frequently used as the practical standard for vendor review and fairness testing in hiring programs.",
    },
    requiredActions: [
      lawAction(
        "eeoc-validation",
        "Review validation and fairness testing",
        "Selection Procedure Guidance",
        "Quarterly review",
        "MEDIUM",
        "todo",
        "Verify that selection tools are monitored for adverse impact and supported by defensible validation evidence.",
        "Employment Compliance"
      ),
      lawAction(
        "eeoc-accommodation",
        "Confirm accommodation path for AI tools",
        "ADA Guidance",
        "Immediate priority",
        "MEDIUM",
        "todo",
        "Ensure candidates can request alternatives or accommodations when AI is used in evaluation.",
        "Talent Operations"
      ),
    ],
    timeline: [
      {
        date: "2022-2024",
        label: "Guidance series issued",
        detail: "EEOC clarified employer accountability for algorithmic hiring and disability accommodation risk.",
      },
    ],
  },
  {
    id: "quebec-law-25",
    title: "Quebec Law 25 Automated Decision Transparency",
    jurisdiction: "Quebec",
    regionBadge: "QC",
    status: "ENACTED",
    risk: "MEDIUM",
    category: "Privacy",
    summary:
      "Transparency obligations when individuals are subject to decisions based exclusively on automated processing.",
    description:
      "Quebec's privacy reform framework requires organizations to inform individuals when a decision is based exclusively on automated processing and provide access to key information about the decision process.",
    whyItMatters:
      "For organizations serving Quebec residents, automated profiling and eligibility systems may require disclosure and explanation practices that many product teams do not currently operationalize.",
    useCases: ["Profiling", "Consumer Decisions"],
    affectedWorkflows: ["Pricing", "Eligibility decisions", "Automated customer segmentation"],
    tags: ["Transparency", "Automated Processing", "Privacy"],
    effectiveDate: "September 22, 2023",
    enforcementStage: "In Force",
    enforcementStatus: "In force",
    sourceLabel: "VComply Privacy Monitor",
    ownerTeam: "Privacy Ops",
    notes: [
      "Useful for North American teams operating beyond U.S. state-only frameworks.",
      "Decision explainability and customer service escalation paths are the main operational gap areas.",
    ],
    exposure: {
      title: "Moderate Exposure",
      body: "If automated systems materially influence customer decisions in Quebec, individuals may need disclosure and access to the decision rationale.",
      penalty: "Privacy regulator scrutiny and remediation obligations.",
      rationale:
        "Quebec is an important signal that North American privacy regulation is moving beyond notice into decision-process transparency.",
    },
    requiredActions: [
      lawAction(
        "qc-disclosure",
        "Implement automated decision disclosures",
        "Automated Processing Notice",
        "Current release cycle",
        "MEDIUM",
        "todo",
        "Add customer-facing disclosures where decisions are based exclusively on automated processing.",
        "Privacy Ops"
      ),
      lawAction(
        "qc-escalation",
        "Define review and escalation path",
        "Access Rights",
        "Current release cycle",
        "LOW",
        "todo",
        "Document the route for customers to request additional information or escalation review.",
        "Customer Experience"
      ),
    ],
    timeline: [
      {
        date: "September 22, 2023",
        label: "Core transparency duties effective",
        detail: "Automated processing disclosure expectations became active under Quebec's privacy reform.",
      },
    ],
  },
  {
    id: "utah-ai-policy-act",
    title: "Utah Artificial Intelligence Policy Act",
    jurisdiction: "Utah",
    regionBadge: "UT",
    status: "ENACTED",
    risk: "LOW",
    category: "Consumer Transparency",
    summary:
      "Disclosure-focused law requiring certain entities to make clear when consumers are interacting with generative AI.",
    description:
      "Utah's Artificial Intelligence Policy Act focuses on disclosure and accountability, especially where regulated occupations or consumer-facing interactions involve generative AI systems.",
    whyItMatters:
      "For companies exposing chatbots or AI assistants to consumers, Utah is an early signal that disclosure expectations for generative AI interactions will continue to grow.",
    useCases: ["Chatbots", "Consumer Decisions"],
    affectedWorkflows: ["AI assistants", "Support chatbots", "Regulated professional services"],
    tags: ["Disclosure", "Generative AI", "Consumer Interaction"],
    effectiveDate: "May 1, 2024",
    enforcementStage: "In Force",
    enforcementStatus: "In force",
    sourceLabel: "VComply Emerging Laws Tracker",
    ownerTeam: "Product Counsel",
    notes: [
      "Most useful as a transparency baseline for consumer-facing assistants.",
      "Low direct risk, but increasingly relevant to brand trust and product disclosures.",
    ],
    exposure: {
      title: "Operational Exposure",
      body: "Consumer-facing AI assistants may require clearer disclosures about AI involvement, especially in regulated interaction contexts.",
      penalty: "State enforcement and corrective disclosure obligations.",
      rationale:
        "Disclosure laws tend to expand quickly once consumer-facing generative AI becomes common in support and intake flows.",
    },
    requiredActions: [
      lawAction(
        "ut-disclosure",
        "Review consumer-facing AI disclosure language",
        "Disclosure Duties",
        "Next product release",
        "LOW",
        "todo",
        "Ensure chatbot and assistant interfaces clearly disclose AI involvement where required.",
        "Product Counsel"
      ),
      lawAction(
        "ut-training",
        "Update frontline support SOPs",
        "Operational Readiness",
        "Next enablement cycle",
        "LOW",
        "todo",
        "Train customer-facing teams on how AI-assisted interactions should be presented to users.",
        "Support Operations"
      ),
    ],
    timeline: [
      {
        date: "May 1, 2024",
        label: "Act effective",
        detail: "Disclosure-focused Utah AI requirements became active.",
      },
    ],
  },
];

function deriveSeverity(score: number): RiskLevel {
  if (score >= 75) {
    return "HIGH";
  }

  if (score >= 45) {
    return "MEDIUM";
  }

  return "LOW";
}

function deriveSummary(
  score: number,
  applicableLaws: AssessmentLaw[],
  requiredActions: ComplianceAction[]
) {
  const highRiskIssues = applicableLaws.filter((law) => law.risk === "HIGH").length;
  const mediumRiskIssues = applicableLaws.filter((law) => law.risk === "MEDIUM").length;

  return {
    headline:
      highRiskIssues > 0
        ? "Immediate compliance work is required across consequential AI workflows."
        : "Current exposure is manageable, but active monitoring and control evidence still matter.",
    narrative:
      highRiskIssues > 0
        ? `${highRiskIssues} high-risk regulatory triggers are attached to active workflows. The highest-pressure areas are hiring, profiling, and governance controls that need evidence before broader rollout.`
        : "No critical blockers are currently surfaced, but the deployment still touches regulated workflows that require documentation and ongoing oversight.",
    high_risk_issues: highRiskIssues,
    medium_risk_issues: mediumRiskIssues,
    required_action_count: requiredActions.length,
    impacted_regulation_count: applicableLaws.length,
  };
}

function buildStatusIndicators(
  applicableLaws: AssessmentLaw[],
  requiredActions: ComplianceAction[]
): StatusIndicator[] {
  const hiringLaws = applicableLaws.filter((law) => law.category === "Employment AI").length;
  const inProgressActions = requiredActions.filter((action) => action.status === "IN_PROGRESS").length;

  return [
    {
      label: "Most Exposed Workflow",
      value: hiringLaws > 0 ? "Hiring and candidate screening" : "Consumer profiling and scoring",
      tone: hiringLaws > 0 ? "high" : "medium",
    },
    {
      label: "Active Workstreams",
      value: `${requiredActions.length} compliance actions in the current queue`,
      tone: requiredActions.length > 5 ? "medium" : "blue",
    },
    {
      label: "Program Momentum",
      value:
        inProgressActions > 0
          ? `${inProgressActions} remediation items already in motion`
          : "Initial remediation plan needs ownership",
      tone: inProgressActions > 0 ? "low" : "neutral",
    },
  ];
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

function createAssessmentLaw(law: LawRecord): AssessmentLaw {
  const primaryAction = law.requiredActions.find((action) => action.status !== "complete") ?? law.requiredActions[0];
  const status: AssessmentLawStatus =
    law.enforcementStage === "Upcoming Compliance" || law.status === "PROPOSED"
      ? "UPCOMING"
      : law.status === "GUIDANCE"
        ? "MONITORING"
        : "ACTIVE";

  return {
    id: law.id,
    law: law.title,
    risk: law.risk,
    reason: law.summary,
    next_step: primaryAction?.title ?? "Review regulatory readiness",
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

function buildAssessmentFromLaws(
  laws: LawRecord[],
  options?: {
    deployedSystems?: string[];
    jurisdictions?: string[];
    businessAreas?: string[];
    sourceLabel?: string;
    activityPrefix?: string;
    context?: AssessmentContext;
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

  const baseScore =
    laws.filter((law) => law.risk === "HIGH").length * 18 +
    laws.filter((law) => law.risk === "MEDIUM").length * 10 +
    laws.filter((law) => law.risk === "LOW").length * 4;
  const riskScore = Math.max(38, Math.min(92, baseScore + 28));
  const severity = deriveSeverity(riskScore);

  return {
    risk_score: riskScore,
    severity,
    source_label: options?.sourceLabel ?? "VComply Assessment Engine v2",
    summary: deriveSummary(riskScore, applicableLaws, requiredActions),
    impacted_business_areas:
      options?.businessAreas ??
      Array.from(new Set(laws.flatMap((law) => law.affectedWorkflows.slice(0, 2)))).slice(0, 5),
    operational_summary: {
      deployment_profile:
        severity === "HIGH"
          ? "Multiple consequential AI workflows are in scope across regulated employment and profiling use cases."
          : "The deployment profile is meaningful, but the highest-risk workflows are limited and can be contained with controls.",
      business_areas:
        options?.businessAreas ??
        Array.from(new Set(laws.map((law) => law.category))).slice(0, 4),
      deployed_systems:
        options?.deployedSystems ??
        [
          "Resume screening model",
          "Interview analysis workflow",
          "Customer support assistant",
          "Recommendation engine",
        ],
      jurisdictions:
        options?.jurisdictions ?? Array.from(new Set(laws.map((law) => law.jurisdiction))).slice(0, 5),
      review_cadence: severity === "HIGH" ? "Weekly remediation review" : "Bi-weekly governance review",
    },
    status_indicators: buildStatusIndicators(applicableLaws, requiredActions),
    applicable_laws: applicableLaws,
    required_actions: requiredActions,
    recent_activity: [
      {
        id: "activity-audit",
        title: "Bias audit scoping moved into procurement review",
        detail: "Employment Compliance and Legal Ops aligned on auditor shortlist for the hiring model.",
        date: "2 days ago",
        status: "In Progress",
      },
      {
        id: "activity-disclosures",
        title: "Candidate notice language updated for recruiter workflow",
        detail: "Talent Operations drafted revised candidate-facing disclosure copy for AI-assisted screening.",
        date: "4 days ago",
        status: "Completed",
      },
      {
        id: "activity-governance",
        title: "High-risk system inventory review scheduled",
        detail: "Model Governance scheduled the next evidence review for scoring and recommendation systems.",
        date: "This week",
        status: "Scheduled",
      },
    ],
  };
}

export const defaultAssessment = buildAssessmentFromLaws(
  lawsData.filter((law) =>
    ["nyc-ll-144", "illinois-ai-video", "eeoc-ai-guidance", "ca-admt", "colorado-ai-act"].includes(
      law.id
    )
  ),
  {
    deployedSystems: [
      "Resume screening model",
      "Interview analysis workflow",
      "Marketing recommendation engine",
      "Customer support assistant",
    ],
    jurisdictions: ["New York", "Illinois", "California", "Colorado"],
    businessAreas: ["Talent Operations", "People Systems", "Marketing", "Privacy Ops"],
  }
);

export const dashboardQuickLinks = [
  {
    id: "audit-log",
    title: "Audit Evidence Log",
    description: "Export controls, audits, and review artifacts",
    icon: "document",
  },
  {
    id: "laws",
    title: "Laws Explorer",
    description: "Review impacted regulations and enforcement posture",
    icon: "search",
  },
  {
    id: "inventory",
    title: "Deployment Intake",
    description: "Refresh company footprint and in-scope systems",
    icon: "gear",
  },
];

export const lawFilterOptions = {
  jurisdictions: Array.from(new Set(lawsData.map((law) => law.jurisdiction))).sort(),
  useCases: Array.from(new Set(lawsData.flatMap((law) => law.useCases))).sort(),
  riskLevels: ["HIGH", "MEDIUM", "LOW"] as RiskLevel[],
  enforcementStages: Array.from(new Set(lawsData.map((law) => law.enforcementStage))).sort(),
  categories: Array.from(new Set(lawsData.map((law) => law.category))).sort(),
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

function deriveRegionBadge(jurisdiction?: string) {
  const normalized = jurisdiction?.toLowerCase() ?? "";

  if (normalized.includes("new york")) {
    return "NY";
  }
  if (normalized.includes("california")) {
    return "CA";
  }
  if (normalized.includes("illinois")) {
    return "IL";
  }
  if (normalized.includes("massachusetts")) {
    return "MA";
  }
  if (normalized.includes("colorado")) {
    return "CO";
  }
  if (normalized.includes("european")) {
    return "EU";
  }
  if (normalized.includes("united states")) {
    return "US";
  }
  if (normalized.includes("quebec")) {
    return "QC";
  }
  if (normalized.includes("utah")) {
    return "UT";
  }

  return "RG";
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
  const title = fallbackText(item.name ?? item.title ?? item.law, `Regulation ${index + 1}`);
  const jurisdiction = fallbackText(item.jurisdiction, "Not provided");
  const risk =
    item.risk === "HIGH" || item.risk === "MEDIUM" || item.risk === "LOW" ? item.risk : "MEDIUM";

  return {
    id: fallbackText(item.id, `api-law-${index}`),
    title,
    jurisdiction,
    regionBadge: deriveRegionBadge(jurisdiction),
    status: "GUIDANCE",
    risk,
    category: fallbackText(item.category, "AI Governance"),
    summary: fallbackText(item.summary, "Regulatory obligations connected to the assessed AI deployment."),
    description:
      fallbackText(
        item.summary,
        "This regulation has been returned by the backend and is being displayed with a frontend-enriched detail profile until richer law metadata is available from the API."
      ),
    whyItMatters:
      fallbackText(
        item.summary,
        "The backend identified this regulation as relevant to the current deployment profile."
      ),
    useCases: ["Governance"],
    affectedWorkflows: ["In-scope AI workflow"],
    tags: ["API Response"],
    effectiveDate: "Monitoring",
    enforcementStage: "Guidance / Monitoring",
    enforcementStatus: "Assessment-derived signal",
    sourceLabel: "Backend response",
    ownerTeam: "Compliance Program",
    notes: [
      "Detailed law metadata is not yet available from the API, so frontend defaults are being used for presentation.",
    ],
    exposure: {
      title: "Compliance Exposure",
      body:
        fallbackText(
          item.summary,
          "This regulation has been flagged by the backend and should be reviewed for applicability to the current deployment."
        ),
      penalty: "Review against official source material.",
      rationale:
        "The backend has identified this rule as relevant, but detailed rationale is not yet available from the law catalog endpoint.",
    },
    requiredActions: [
      lawAction(
        `api-review-${index}`,
        "Review backend-identified regulatory obligation",
        "Backend applicability result",
        "Current review cycle",
        risk,
        "todo",
        "Validate why this regulation applies and assign an internal owner for remediation planning.",
        "Compliance Program"
      ),
    ],
    timeline: [
      {
        date: "Current",
        label: "Returned by backend catalog",
        detail: "Detailed law metadata is being enriched on the frontend until the backend provides a richer schema.",
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

type AssessmentContext = {
  companyName?: string;
  states?: string[];
  usesAiInHiring?: boolean;
  aiUseCases?: string;
  selectedCategories?: string[];
  jurisdictions?: string[];
  deployedSystems?: string[];
};

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

function normalizeComplianceAction(
  action: Partial<ComplianceAction>,
  index: number
): ComplianceAction {
  return {
    id: fallbackText(action.id, `action-${index}`),
    title: fallbackText(action.title, "Review regulatory obligation"),
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

export function sortComplianceActions<T extends { priority?: ComplianceAction["priority"] }>(
  actions: T[]
) {
  return [...actions].sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
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

function buildDefaultAssessmentContext(options?: {
  jurisdictions?: string[];
  deployedSystems?: string[];
}): AssessmentContext {
  return {
    companyName: "your company",
    jurisdictions: options?.jurisdictions,
    deployedSystems: options?.deployedSystems,
    usesAiInHiring: true,
    aiUseCases: "hiring, screening, profiling, and customer support",
    selectedCategories: ["llm", "predictive"],
  };
}

export function buildLawApplicabilityExplanation(
  law: Pick<LawRecord, "jurisdiction" | "title" | "useCases" | "affectedWorkflows" | "category">,
  context?: AssessmentContext
) {
  const companyLabel = context?.companyName?.trim() || "your company";
  const useCaseText = context?.aiUseCases?.toLowerCase() ?? "";
  const states = context?.states ?? [];
  const jurisdictions = context?.jurisdictions ?? [];
  const combinedJurisdictions = [...states, ...jurisdictions].filter(Boolean);
  const hasJurisdictionMatch =
    combinedJurisdictions.some((entry) => {
      const normalizedEntry = entry.toLowerCase();
      const normalizedLawJurisdiction = law.jurisdiction.toLowerCase();

      return (
        normalizedLawJurisdiction.includes(normalizedEntry) ||
        normalizedEntry.includes(normalizedLawJurisdiction)
      );
    }) ||
    law.jurisdiction === "European Union" ||
    law.jurisdiction === "United States";

  const mentionsProfiling =
    useCaseText.includes("profil") ||
    useCaseText.includes("recommend") ||
    context?.selectedCategories?.includes("predictive");
  const mentionsHiring = context?.usesAiInHiring || useCaseText.includes("hiring");
  const mentionsBiometric =
    useCaseText.includes("biometric") || context?.selectedCategories?.includes("vision");
  const mentionsChatbot =
    useCaseText.includes("chatbot") ||
    useCaseText.includes("assistant") ||
    context?.selectedCategories?.includes("llm");

  if (law.useCases.includes("Hiring") && mentionsHiring) {
    return `${companyLabel} uses AI in employment-related workflows, and that activity${
      hasJurisdictionMatch ? ` in ${law.jurisdiction}` : ""
    } can trigger ${law.title} obligations for screening, scoring, or interview review.`;
  }

  if (law.useCases.includes("Profiling") && mentionsProfiling) {
    return `${companyLabel} relies on profiling, scoring, or recommendation workflows${
      hasJurisdictionMatch ? ` touching ${law.jurisdiction}` : ""
    }, which brings ${law.title} into scope for automated decision-making and transparency controls.`;
  }

  if (law.useCases.includes("Biometric") && mentionsBiometric) {
    return `${companyLabel} appears to use biometric or computer-vision tooling, and those workflows${
      hasJurisdictionMatch ? ` in ${law.jurisdiction}` : ""
    } can trigger consent, retention, and disclosure duties under ${law.title}.`;
  }

  if (law.useCases.includes("Chatbots") && mentionsChatbot) {
    return `${companyLabel} uses customer-facing generative AI systems, which can trigger ${law.title} requirements where AI involvement must be disclosed to users.`;
  }

  const workflow = law.affectedWorkflows[0] ?? law.category.toLowerCase();
  return `${companyLabel} operates AI-enabled ${workflow} workflows${
    hasJurisdictionMatch ? ` in ${law.jurisdiction}` : ""
  }, which is why ${law.title} is being flagged in the current assessment.`;
}

export function generateComplianceSummaryText(assessment: ComplianceAssessment) {
  const jurisdictionCount = assessment.operational_summary.jurisdictions.length;
  const highRisk = assessment.summary.high_risk_issues;
  const areas = assessment.impacted_business_areas.slice(0, 2).map((area) => area.toLowerCase());
  const areaText = areas.length > 0 ? formatList(areas) : "in-scope AI systems";

  return `You are currently exposed to ${assessment.summary.impacted_regulation_count} AI regulations across ${jurisdictionCount} jurisdiction${
    jurisdictionCount === 1 ? "" : "s"
  }, with ${highRisk} high-risk compliance gap${
    highRisk === 1 ? "" : "s"
  } identified in ${areaText}.`;
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
      why_it_applies: buildLawApplicabilityExplanation(
        matchingRecord,
        draft
          ? {
              companyName: draft.company_name || "your company",
              states: draft.states_of_operation
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              usesAiInHiring: draft.uses_ai_in_hiring,
              aiUseCases: [draft.ai_use_cases, draft.critical_use_cases, draft.additional_context]
                .filter(Boolean)
                .join(", "),
              selectedCategories: draft.selected_categories,
              jurisdictions: [matchingRecord.jurisdiction],
            }
          : buildDefaultAssessmentContext()
      ),
    };
  }

  const risk = law.risk === "HIGH" || law.risk === "MEDIUM" || law.risk === "LOW" ? law.risk : "MEDIUM";

  return {
    id: `stored-law-${index}`,
    law: fallbackText(law.law, `Regulation ${index + 1}`),
    risk,
    reason: fallbackText(law.reason, "No risk rationale provided."),
    next_step: fallbackText(law.next_step, "No action specified"),
    jurisdiction: fallbackText(law.jurisdiction, "Not provided"),
    category: "AI Governance",
    status: risk === "HIGH" ? "ACTIVE" : "MONITORING",
    enforcement_status: "Pending classification",
    affected_workflows: [],
    why_it_applies: fallbackText(
      law.reason,
      "The backend did not provide a detailed rationale for this regulation."
    ),
    owner: "Compliance Program",
    source_label: "Stored browser assessment",
    team: "Compliance Program",
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
  };

  if (
    typeof candidate.risk_score !== "number" &&
    !Array.isArray(candidate.applicable_laws) &&
    !Array.isArray(candidate.required_actions)
  ) {
    return null;
  }

  const applicableLaws = (Array.isArray(candidate.applicable_laws) ? candidate.applicable_laws : [])
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
          15,
          applicableLaws.reduce((score, law) => {
            if (law.risk === "HIGH") {
              return score + 28;
            }

            if (law.risk === "MEDIUM") {
              return score + 16;
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
  const jurisdictions = safeStringArray(candidate.operational_summary?.jurisdictions);
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
    source_label: fallbackText(candidate.source_label, "Stored browser assessment"),
    summary,
    impacted_business_areas:
      impactedBusinessAreas.length > 0 ? impactedBusinessAreas.slice(0, 6) : ["Assessment scope pending"],
    operational_summary: {
      deployment_profile: fallbackText(
        candidate.operational_summary?.deployment_profile,
        severity === "HIGH"
          ? "Assessment data indicates regulated AI usage in consequential workflows."
          : "Assessment data indicates active monitoring requirements across in-scope AI systems."
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
      jurisdictions:
        jurisdictions.length > 0
          ? jurisdictions
          : (Array.from(new Set(applicableLaws.map((law) => law.jurisdiction).filter(Boolean))) as string[]),
      review_cadence: fallbackText(
        candidate.operational_summary?.review_cadence,
        severity === "HIGH" ? "Weekly remediation review" : "Bi-weekly governance review"
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
  const states = draft.states_of_operation
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  const textBlob = [draft.ai_use_cases, draft.critical_use_cases, draft.additional_context]
    .join(" ")
    .toLowerCase();
  const selected = new Set<string>();

  if (draft.uses_ai_in_hiring) {
    selected.add("eeoc-ai-guidance");
    if (states.includes("NY")) {
      selected.add("nyc-ll-144");
    }
    if (states.includes("IL")) {
      selected.add("illinois-ai-video");
    }
  }

  if (states.includes("IL") && (draft.selected_categories.includes("vision") || textBlob.includes("biometric"))) {
    selected.add("bipa");
  }

  if (
    states.includes("CA") &&
    (textBlob.includes("profil") ||
      textBlob.includes("recommend") ||
      draft.selected_categories.includes("predictive"))
  ) {
    selected.add("ca-admt");
  }

  if (states.includes("CO") && draft.selected_categories.includes("predictive")) {
    selected.add("colorado-ai-act");
  }

  if (
    textBlob.includes("eu") ||
    textBlob.includes("europe") ||
    textBlob.includes("gdpr") ||
    textBlob.includes("human review")
  ) {
    selected.add("eu-ai-act");
    selected.add("gdpr-article-22");
  }

  if (textBlob.includes("chatbot") || draft.selected_categories.includes("llm")) {
    selected.add("utah-ai-policy-act");
  }

  if (states.includes("MA")) {
    selected.add("mass-guidance");
  }

  if (states.includes("QC") || textBlob.includes("quebec") || textBlob.includes("canada")) {
    selected.add("quebec-law-25");
  }

  if (selected.size === 0) {
    selected.add("eeoc-ai-guidance");
    selected.add("ca-admt");
    selected.add("mass-guidance");
  }

  const chosenLaws = lawsData.filter((law) => selected.has(law.id)).slice(0, 6);
  const businessAreas = Array.from(
    new Set([
      draft.uses_ai_in_hiring ? "Talent Operations" : "Operational AI",
      draft.industry || "Enterprise Operations",
      ...chosenLaws.map((law) => law.category),
    ])
  ).slice(0, 5);

  return buildAssessmentFromLaws(chosenLaws, {
    deployedSystems:
      selected.size > 0
        ? modelCategories
            .filter((category) => draft.selected_categories.includes(category.id))
            .map((category) => category.title)
            .slice(0, 4)
        : ["LLM assistant", "Predictive scoring workflow"],
    jurisdictions: Array.from(new Set(chosenLaws.map((law) => law.jurisdiction))).slice(0, 5),
    businessAreas,
    sourceLabel: `VComply Assessment Engine v2 • ${draft.company_name || "Current Company"} snapshot`,
    context: {
      companyName: draft.company_name || "your company",
      states,
      usesAiInHiring: draft.uses_ai_in_hiring,
      aiUseCases: [draft.ai_use_cases, draft.critical_use_cases, draft.additional_context]
        .filter(Boolean)
        .join(", "),
      selectedCategories: draft.selected_categories,
      jurisdictions: Array.from(new Set(chosenLaws.map((law) => law.jurisdiction))).slice(0, 5),
      deployedSystems:
        selected.size > 0
          ? modelCategories
              .filter((category) => draft.selected_categories.includes(category.id))
              .map((category) => category.title)
              .slice(0, 4)
          : ["LLM assistant", "Predictive scoring workflow"],
    },
  });
}
