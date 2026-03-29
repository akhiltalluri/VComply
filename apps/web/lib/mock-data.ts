export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type ComplianceAssessment = {
  risk_score: number;
  applicable_laws: Array<{
    law: string;
    risk: RiskLevel;
    reason: string;
    next_step: string;
  }>;
};

export type DashboardAction = {
  id: string;
  title: string;
  system: string;
  source: string;
  priority: RiskLevel | "INFO";
};

export type LawAction = {
  title: string;
  article: string;
  due: string;
  status: "todo" | "complete";
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
  status: "ENACTED" | "PROPOSED" | "GUIDANCE";
  risk: RiskLevel;
  category: string;
  summary: string;
  description: string;
  useCases: string[];
  tags: string[];
  effectiveDate: string;
  enforcementStatus: string;
  exposure: {
    title: string;
    body: string;
    penalty: string;
  };
  requiredActions: LawAction[];
  timeline: LawTimelineItem[];
};

export const landingFeatures = [
  {
    title: "Continuous Assessment",
    description:
      "Replaces disjointed point-in-time audits with automated, real-time tracking of your compliance posture.",
    icon: "orbit",
  },
  {
    title: "Global Mapping",
    description:
      "Tracks your specific AI model usage against a continuously updated database of worldwide laws and frameworks.",
    icon: "globe",
  },
  {
    title: "Actionable Checklists",
    description:
      "Distills complex legal requirements into simple, prioritized engineering tasks and compliance steps.",
    icon: "checklist",
  },
];

export const assessmentSteps = [
  {
    id: "company",
    title: "Company Profile",
    subtitle: "Basic details",
    status: "complete" as const,
  },
  {
    id: "usage",
    title: "AI Usage",
    subtitle: "Model deployment details",
    status: "current" as const,
  },
  {
    id: "jurisdictions",
    title: "Jurisdictions",
    subtitle: "Global operations map",
    status: "upcoming" as const,
  },
];

export const modelCategories = [
  {
    id: "llm",
    title: "Large Language Models (LLMs)",
    description: "Text generation, summarization, chat",
  },
  {
    id: "vision",
    title: "Computer Vision",
    description: "Image recognition, biometric sorting",
  },
  {
    id: "predictive",
    title: "Predictive Analytics",
    description: "Forecasting, scoring, recommendation",
  },
  {
    id: "robotics",
    title: "Robotics / Autonomous",
    description: "Physical actuation, self-driving",
  },
];

export const defaultAssessment: ComplianceAssessment = {
  risk_score: 84,
  applicable_laws: [
    {
      law: "EU AI Act",
      risk: "HIGH",
      reason: "High-risk AI features deployed across EU hiring and recommendation workflows.",
      next_step: "Implement QMS and register high-risk systems.",
    },
    {
      law: "CCPA / CPRA",
      risk: "MEDIUM",
      reason: "Automated profiling creates consumer notice and opt-out obligations in California.",
      next_step: "Implement profiling opt-out and update disclosures.",
    },
    {
      law: "GDPR Article 22",
      risk: "LOW",
      reason: "EU-facing automated decisions require explainability and human review controls.",
      next_step: "Document human-in-the-loop review paths.",
    },
  ],
};

export const dashboardPendingActions: DashboardAction[] = [
  {
    id: "dpia",
    title: "Complete Data Protection Impact Assessment (DPIA)",
    system: "Customer Support Chatbot v2",
    source: "GDPR Art. 35",
    priority: "HIGH",
  },
  {
    id: "register-eu",
    title: "Register High-Risk System in EU Database",
    system: "HR Resume Screener",
    source: "EU AI Act",
    priority: "MEDIUM",
  },
  {
    id: "opt-out",
    title: "Implement opt-out mechanism for automated profiling",
    system: "Marketing Recommendation Engine",
    source: "CCPA Regs",
    priority: "MEDIUM",
  },
  {
    id: "policy",
    title: "Update internal acceptable use policy",
    system: "Generative Content Tools",
    source: "Internal",
    priority: "INFO",
  },
];

export const dashboardQuickLinks = [
  {
    id: "audit-log",
    title: "Full Audit Log",
    description: "Export CSV/PDF",
    icon: "document",
  },
  {
    id: "laws",
    title: "Laws Explorer",
    description: "Browse global regs",
    icon: "search",
  },
  {
    id: "inventory",
    title: "Model Inventory",
    description: "Manage deployments",
    icon: "gear",
  },
];

export const lawsData: LawRecord[] = [
  {
    id: "nyc-ll-144",
    title: "NYC Local Law 144",
    jurisdiction: "New York",
    regionBadge: "NY",
    status: "ENACTED",
    risk: "HIGH",
    category: "Employment",
    summary:
      "Bias audit, candidate notice, and disclosure obligations for automated employment decision tools.",
    description:
      "NYC Local Law 144 governs automated employment decision tools used in hiring and promotion. Covered employers and agencies must complete an independent bias audit, publish a summary, and provide notice to candidates before use.",
    useCases: ["Hiring"],
    tags: ["Bias Audit", "AEDT", "Employment"],
    effectiveDate: "July 5, 2023",
    enforcementStatus: "Active enforcement",
    exposure: {
      title: "Critical Exposure",
      body: "Using AI to screen or rank candidates in New York City can trigger mandatory bias auditing and pre-use notification obligations.",
      penalty: "Civil penalties and enforcement by NYC DCWP.",
    },
    requiredActions: [
      {
        title: "Complete independent bias audit",
        article: "Bias Audit Requirement",
        due: "Before deployment",
        status: "todo",
      },
      {
        title: "Publish public audit summary",
        article: "Public Disclosure",
        due: "Before deployment",
        status: "todo",
      },
      {
        title: "Notify candidates of AEDT use",
        article: "Candidate Notice",
        due: "10 business days in advance",
        status: "todo",
      },
    ],
    timeline: [
      {
        date: "July 5, 2023",
        label: "Enforcement began",
        detail: "NYC began enforcing audit and notice obligations for covered AEDTs.",
      },
      {
        date: "Current",
        label: "Ongoing compliance monitoring",
        detail: "Bias audits and publication obligations should be repeated as tools materially change.",
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
      "Draft CPPA rules addressing automated decision-making technology, profiling, and consumer rights.",
    description:
      "California's draft ADMT regulations would impose notice, access, and opt-out rights where businesses use automated decision-making technologies in significant consumer or employment contexts.",
    useCases: ["Profiling", "Hiring"],
    tags: ["ADMT", "Profiling", "Consumer Rights"],
    effectiveDate: "Pending final rulemaking",
    enforcementStatus: "Draft regulations",
    exposure: {
      title: "Moderate Exposure",
      body: "Consumer profiling, personalization, and high-impact decision workflows may need expanded notice and opt-out readiness under forthcoming CPPA rules.",
      penalty: "Regulatory enforcement and remediation obligations.",
    },
    requiredActions: [
      {
        title: "Map ADMT use cases and consumer touchpoints",
        article: "Draft ADMT Scope",
        due: "Next planning cycle",
        status: "todo",
      },
      {
        title: "Prepare notice and opt-out controls",
        article: "Draft Consumer Rights",
        due: "Before rule finalization",
        status: "todo",
      },
    ],
    timeline: [
      {
        date: "Ongoing",
        label: "Rulemaking in progress",
        detail: "Businesses should monitor CPPA drafts and operationalize ADMT inventories ahead of final rules.",
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
    category: "Employment",
    summary:
      "Notice, consent, and deletion rules for employers using AI to analyze video interviews.",
    description:
      "The Illinois AI Video Interview Act requires employers to notify candidates, explain how AI is used to evaluate interviews, obtain consent, and follow strict sharing and deletion rules for recordings.",
    useCases: ["Hiring"],
    tags: ["Video Interview", "Consent", "Deletion"],
    effectiveDate: "January 1, 2020",
    enforcementStatus: "In effect",
    exposure: {
      title: "Critical Exposure",
      body: "AI-assisted interview scoring in Illinois triggers candidate consent and retention obligations that require operational controls beyond standard hiring workflows.",
      penalty: "State enforcement risk and employment-related claims.",
    },
    requiredActions: [
      {
        title: "Update candidate consent flows",
        article: "Consent Requirement",
        due: "Immediately",
        status: "todo",
      },
      {
        title: "Limit interview video sharing and retention",
        article: "Deletion / Disclosure",
        due: "Immediately",
        status: "todo",
      },
    ],
    timeline: [
      {
        date: "January 1, 2020",
        label: "Act effective",
        detail: "Illinois candidate notice and consent obligations became active for AI video interview analysis.",
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
    category: "Governance",
    summary:
      "State-level governance guidance emphasizing human oversight, procurement controls, and documentation for AI use.",
    description:
      "Massachusetts public-sector and policy guidance on generative AI emphasizes procurement diligence, documentation, human review, and clear accountability when AI systems inform decisions with public impact.",
    useCases: ["Governance", "Procurement"],
    tags: ["Guidance", "Oversight", "Documentation"],
    effectiveDate: "2024 guidance cycle",
    enforcementStatus: "Advisory guidance",
    exposure: {
      title: "Operational Exposure",
      body: "Massachusetts guidance is not a direct statute, but it signals the governance expectations compliance teams should be ready to demonstrate.",
      penalty: "Audit scrutiny and procurement risk.",
    },
    requiredActions: [
      {
        title: "Document human oversight model",
        article: "Governance Guidance",
        due: "Next control review",
        status: "todo",
      },
      {
        title: "Publish internal AI usage standard",
        article: "Operational Governance",
        due: "Next policy update",
        status: "todo",
      },
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
      "The EU AI Act establishes a broad risk-based framework for AI systems across the European Union, introducing obligations for high-risk systems, transparency requirements, and enforcement mechanisms across multiple deployment scenarios.",
    useCases: ["Hiring", "Profiling", "Governance"],
    tags: ["High-Risk AI", "Documentation", "Registration"],
    effectiveDate: "August 1, 2024",
    enforcementStatus: "Phased enforcement",
    exposure: {
      title: "Critical Exposure",
      body: "Hiring, scoring, and consequential decision workflows may classify parts of your system inventory as high-risk AI, triggering documentation, governance, and registration duties.",
      penalty: "Up to EUR 35M or 7% of global annual turnover.",
    },
    requiredActions: [
      {
        title: "Implement quality management controls",
        article: "Article 17",
        due: "Before high-risk deployment",
        status: "todo",
      },
      {
        title: "Generate technical documentation",
        article: "Article 11",
        due: "Before placing on market",
        status: "todo",
      },
      {
        title: "Prepare registration workflow",
        article: "Article 49 / 60",
        due: "Before deployment",
        status: "todo",
      },
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
        detail: "Additional duties roll in across provider, deployer, and market obligations.",
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
      "Restrictions on solely automated decision-making with legal or similarly significant effects.",
    description:
      "GDPR Article 22 protects individuals from decisions based solely on automated processing that produce legal or similarly significant effects, requiring safeguards such as human intervention, appeal rights, and explainability controls.",
    useCases: ["Profiling", "Hiring"],
    tags: ["Automated Decisions", "Human Review", "Privacy"],
    effectiveDate: "May 25, 2018",
    enforcementStatus: "In force",
    exposure: {
      title: "Moderate Exposure",
      body: "Profiling, ranking, or automated eligibility decisions for EU users may require stronger human review and explanation controls.",
      penalty: "Supervisory action, fines, and remediation requirements.",
    },
    requiredActions: [
      {
        title: "Document human review fallback",
        article: "Article 22",
        due: "Immediate priority",
        status: "todo",
      },
      {
        title: "Review explainability and appeals language",
        article: "Transparency Controls",
        due: "Next privacy review",
        status: "todo",
      },
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
      "State AI law covering developers and deployers of high-risk AI systems in consequential decisions.",
    description:
      "Colorado's AI Act introduces duties for both developers and deployers of high-risk AI systems, including governance documentation, impact assessments, public disclosures, and consumer rights protections.",
    useCases: ["Profiling", "Hiring"],
    tags: ["Impact Assessment", "Notice", "High-Risk AI"],
    effectiveDate: "February 1, 2026",
    enforcementStatus: "Upcoming compliance window",
    exposure: {
      title: "Moderate Exposure",
      body: "Scoring or recommendation models used in consequential decisions may require risk management, impact reviews, and public-facing notices under Colorado law.",
      penalty: "State AG enforcement and corrective orders.",
    },
    requiredActions: [
      {
        title: "Stand up high-risk AI impact assessment process",
        article: "Deployer Duties",
        due: "Before February 2026",
        status: "todo",
      },
      {
        title: "Prepare consumer-facing notices",
        article: "Disclosure Obligations",
        due: "Before February 2026",
        status: "todo",
      },
    ],
    timeline: [
      {
        date: "February 1, 2026",
        label: "Core obligations expected",
        detail: "Colorado deployer and developer duties begin taking effect.",
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
      "Strict consent and retention duties when collecting biometric identifiers or biometric information.",
    description:
      "Illinois' Biometric Information Privacy Act requires informed written consent, retention schedules, and restrictions on disclosure when companies collect or process biometric identifiers or related biometric information.",
    useCases: ["Biometric", "Hiring"],
    tags: ["Biometrics", "Consent", "Retention"],
    effectiveDate: "October 3, 2008",
    enforcementStatus: "Private litigation and enforcement risk",
    exposure: {
      title: "Critical Exposure",
      body: "Facial analysis, identity verification, or biometric-enabled hiring workflows can trigger direct consent and retention requirements with significant litigation exposure.",
      penalty: "Statutory damages and class-action exposure.",
    },
    requiredActions: [
      {
        title: "Obtain written biometric consent",
        article: "Section 15(b)",
        due: "Before collection",
        status: "todo",
      },
      {
        title: "Publish biometric retention schedule",
        article: "Section 15(a)",
        due: "Immediate priority",
        status: "todo",
      },
    ],
    timeline: [
      {
        date: "Current",
        label: "Ongoing enforcement risk",
        detail: "BIPA continues to drive significant litigation around biometric-enabled products.",
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
    category: "Employment",
    summary:
      "Federal guidance on discrimination risk and employer accountability when AI is used in hiring.",
    description:
      "The EEOC has published guidance making clear that employers remain responsible for discriminatory outcomes caused by algorithmic hiring tools, with emphasis on accommodation, validation, and vendor oversight.",
    useCases: ["Hiring"],
    tags: ["Discrimination", "Vendor Oversight", "Validation"],
    effectiveDate: "2022 guidance onward",
    enforcementStatus: "Agency guidance",
    exposure: {
      title: "Moderate Exposure",
      body: "AI screening and ranking systems used in employment decisions can create Title VII and ADA-related risk even when sourced from third-party vendors.",
      penalty: "EEOC enforcement and employment claims.",
    },
    requiredActions: [
      {
        title: "Review validation and fairness testing",
        article: "Selection Procedure Guidance",
        due: "Quarterly review",
        status: "todo",
      },
      {
        title: "Confirm accommodation process for AI tools",
        article: "ADA Guidance",
        due: "Immediate priority",
        status: "todo",
      },
    ],
    timeline: [
      {
        date: "2022-2024",
        label: "Guidance series issued",
        detail: "EEOC clarified employer accountability for algorithmic hiring and disability accommodation risk.",
      },
    ],
  },
];
