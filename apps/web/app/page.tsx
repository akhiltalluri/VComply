import { StartAssessmentButton } from "@/components/auth/StartAssessmentButton";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { federalLandingPreview } from "@/lib/federal-law-examples";

const valueProps = [
  {
    title: "Regulatory Mapping",
    description:
      "Map deployed AI systems and business workflows to the federal legislative records most likely to matter before exposure turns into reactive legal work.",
    icon: "map",
  },
  {
    title: "Risk Visibility",
    description:
      "See where hiring, scoring, support automation, and sensitive decisioning create the highest federal legislative pressure.",
    icon: "risk",
  },
  {
    title: "Actionable Next Steps",
    description:
      "Turn regulatory obligations into concrete compliance workstreams: audits, notices, governance controls, documentation, and operational remediation.",
    icon: "actions",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Enter Company Context",
    description:
      "Capture the company profile, AI systems in scope, and the workflows materially affected.",
  },
  {
    step: "02",
    title: "Identify Federal Records",
    description:
      "VComply maps that deployment profile to relevant Congress.gov-backed federal legislative records.",
  },
  {
    step: "03",
    title: "Generate Risk and Action Plan",
    description:
      "Review triggered laws, regulatory severity, and the concrete actions legal, risk, and operations teams should take next.",
  },
];

const heroSignals = [
  {
    label: "Primary Use Case",
    value: "Map AI deployments to federal legislative records and control requirements",
  },
  {
    label: "Federal Data Source",
    value: "Congress.gov-backed federal legislative records normalized for compliance review",
  },
  {
    label: "Assessment Output",
    value: "Computed risk signals, impacted federal records, and required compliance actions",
  },
];

const dashboardPreview = [
  {
    title: "Regulatory Risk Level",
    subtitle: "Hiring and consequential AI workflows are creating immediate federal monitoring pressure",
    badge: "High",
    tone: "high" as const,
  },
  {
    title: "Required Compliance Actions",
    subtitle: "Notice review, governance evidence readiness, and federal monitoring workflows",
    badge: "3 Open",
    tone: "neutral" as const,
  },
  {
    title: "Impacted Federal Records",
    subtitle: "Artificial Intelligence Accountability Act and Federal AI Transparency in Employment Act",
    badge: "2 Records",
    tone: "neutral" as const,
  },
];

function ValueIcon({ kind }: { kind: string }) {
  if (kind === "map") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-sky-400 stroke-[1.8]">
        <path d="M4 6.5 9 4l6 2 5-2v13.5L15 20l-6-2-5 2z" fill="none" />
        <path d="M9 4v14M15 6v14" fill="none" />
      </svg>
    );
  }

  if (kind === "risk") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-sky-400 stroke-[1.8]">
        <path
          d="M12 3 4.5 6v5.2c0 4.7 2.8 8.8 7.5 10.8 4.7-2 7.5-6.1 7.5-10.8V6z"
          fill="none"
        />
        <path d="M12 8v4m0 3h.01" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-sky-400 stroke-[1.8]">
      <path d="M5 12.5 9 16l10-10" fill="none" />
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none" />
    </svg>
  );
}

function SignalPanel({ label, value }: { label: string; value: string }) {
  return (
    <InsetPanel className="px-4 py-4">
      <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{value}</p>
    </InsetPanel>
  );
}

function PreviewBadge({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "high" }) {
  if (tone === "high") {
    return (
      <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-red-300">
        {children}
      </span>
    );
  }

  return (
    <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-slate-300">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="pb-24">
      <PageContainer className="pt-16 sm:pt-20 lg:pt-24">
        <section className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <Badge
            tone="blue"
            className="motion-enter px-4 py-2 text-sm normal-case tracking-[0.12em] text-sky-200"
          >
            Assessment engine active for AI regulatory review
          </Badge>

          <div className="motion-enter motion-enter-delay-1 mt-8 max-w-5xl space-y-6">
            <h1 className="text-[3rem] font-semibold tracking-[-0.055em] text-white sm:text-[4.35rem] lg:text-[5.8rem] lg:leading-[1.01]">
              Understand which
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                federal AI legislation matters
              </span>
              <br />
              to your company.
            </h1>

            <p className="mx-auto max-w-4xl text-[1.05rem] leading-7 text-slate-300 sm:text-[1.25rem] sm:leading-8">
              VComply helps companies understand which federal legislative records may affect their
              AI deployments, where the most meaningful congressional risk sits, and which
              compliance actions should be prioritized next.
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <StartAssessmentButton
                size="lg"
                className="w-full max-w-[320px] text-base sm:min-w-[240px] sm:text-lg"
              />
              <Button
                href="/laws"
                variant="secondary"
                size="lg"
                className="w-full max-w-[320px] text-base sm:min-w-[220px] sm:text-lg"
              >
                Explore Laws
              </Button>
            </div>

            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-400">
              Start with a short intake. VComply then identifies likely regulations, surfaces the
              highest-priority federal watchpoints, and turns them into a concrete compliance action plan.
            </p>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-500">
              Sign in to start your compliance assessment and access the workspace.
            </p>
          </div>

          <div className="motion-enter motion-enter-delay-2 mt-14 grid w-full max-w-5xl gap-4 lg:grid-cols-3">
            {heroSignals.map((signal) => (
              <SignalPanel key={signal.label} label={signal.label} value={signal.value} />
            ))}
          </div>
        </section>
      </PageContainer>

      <PageContainer
        id="features"
        className="motion-enter motion-enter-delay-1 mt-20 space-y-10 sm:mt-24"
      >
        <SectionHeader
          kicker="What The Product Delivers"
          title="A compliance workflow built for teams that need defensible answers."
          subtitle="VComply shows which federal records matter, why they apply, and what operational work is required across active AI deployments."
          className="max-w-4xl"
        />

        <div className="grid gap-7 lg:grid-cols-3">
          {valueProps.map((feature) => (
            <Card key={feature.title} tone="subtle" className="motion-lift p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-sky-500/10 bg-slate-900">
                <ValueIcon kind={feature.icon} />
              </div>
              <h3 className="mt-8 text-[1.5rem] font-semibold tracking-tight text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </PageContainer>

      <PageContainer
        id="workflow"
        className="motion-enter motion-enter-delay-2 mt-20 sm:mt-24"
      >
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <Card tone="subtle" className="motion-lift p-8 sm:p-10">
            <SectionHeader
              kicker="How It Works"
              title="A straightforward path from company footprint to compliance action."
              subtitle="The workflow is built for enterprise teams that need an operating view of federal AI exposure, not abstract legal commentary."
              className="max-w-3xl"
            />

            <div className="mt-10 space-y-5">
              {workflowSteps.map((item) => (
                <InsetPanel key={item.step} className="motion-lift px-5 py-5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sm font-semibold tracking-[0.14em] text-sky-300">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-base leading-7 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </InsetPanel>
              ))}
            </div>
          </Card>

          <Card id="preview" tone="primary" className="motion-lift p-8 sm:p-10">
            <SectionHeader
              kicker="Platform Preview"
              title="A product surface built for compliance teams."
              subtitle="See both sides of the workflow: operational risk in Mission Control and structured regulatory analysis in the Laws Explorer."
              className="max-w-3xl"
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <InsetPanel className="motion-lift p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.04em] text-slate-500">
                      Mission Control
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Regulatory risk, obligations, and work in motion
                    </h3>
                  </div>
                  <Badge tone="blue" className="px-3 py-1.5 text-xs normal-case tracking-normal">
                    Dashboard
                  </Badge>
                </div>

                <div className="mt-5 space-y-3">
                  {dashboardPreview.map((item) => (
                    <div
                      key={item.title}
                      className="motion-lift rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{item.subtitle}</p>
                        </div>
                        <PreviewBadge tone={item.tone}>{item.badge}</PreviewBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </InsetPanel>

              <InsetPanel className="motion-lift p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.04em] text-slate-500">
                      Regulatory Intelligence
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Searchable regulatory analysis
                    </h3>
                  </div>
                  <Badge tone="blue" className="px-3 py-1.5 text-xs normal-case tracking-normal">
                    Laws Explorer
                  </Badge>
                </div>

                <div className="mt-5 space-y-3">
                  {federalLandingPreview.map((law) => (
                    <div
                      key={law.name}
                      className="motion-lift rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-100">{law.name}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{law.detail}</p>
                        </div>
                        <PreviewBadge tone={law.risk === "High Risk" ? "high" : "neutral"}>
                          {law.risk}
                        </PreviewBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </InsetPanel>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
