import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";

const valueProps = [
  {
    title: "Regulatory Mapping",
    description:
      "Map deployed AI systems, use cases, and jurisdictions to the laws most likely to apply before legal exposure becomes operational risk.",
    icon: "map",
  },
  {
    title: "Risk Visibility",
    description:
      "Surface high-risk obligations across hiring, profiling, and consumer-facing AI with clear severity signals your leadership team can act on.",
    icon: "risk",
  },
  {
    title: "Actionable Next Steps",
    description:
      "Convert dense regulatory requirements into prioritized actions, owners, and compliance workstreams instead of disconnected legal notes.",
    icon: "actions",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Enter company footprint",
    description:
      "Capture where you operate, what models you deploy, and where AI touches business-critical workflows.",
  },
  {
    step: "02",
    title: "Identify applicable AI laws",
    description:
      "VComply maps your deployment details against evolving global regulatory frameworks and enforcement triggers.",
  },
  {
    step: "03",
    title: "Get risk assessment and actions",
    description:
      "Review risk score, triggered regulations, and concrete next steps for compliance, legal, and operations teams.",
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
        <path d="M12 3 4.5 6v5.2c0 4.7 2.8 8.8 7.5 10.8 4.7-2 7.5-6.1 7.5-10.8V6z" fill="none" />
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

function MiniMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "high";
}) {
  return (
    <InsetPanel tone={tone === "high" ? "red" : "default"} className="px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-medium text-slate-300">{value}</p>
    </InsetPanel>
  );
}

export default function HomePage() {
  return (
    <div className="pb-24">
      <PageContainer className="pt-20 sm:pt-24 lg:pt-28">
        <section className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-2 text-sm font-medium uppercase tracking-[0.24em] text-sky-300">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.8)]" />
            Real-Time AI Compliance Intelligence
          </div>

          <div className="mt-10 max-w-5xl space-y-7">
            <h1 className="text-[3.8rem] font-semibold tracking-[-0.05em] text-white sm:text-[5rem] lg:text-[6.2rem] lg:leading-[1.02]">
              Understand your
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                AI regulatory exposure.
              </span>
            </h1>

            <p className="mx-auto max-w-4xl text-[1.15rem] leading-7 text-slate-300 sm:text-[1.35rem] sm:leading-8">
              VComply maps company AI usage, jurisdictions, and critical workflows to applicable
              regulations, giving legal and compliance teams a clear view of risk exposure and the
              next actions required to stay ahead.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-3 sm:flex-row">
              <Button href="/intake" size="lg" className="min-w-[240px] text-lg">
                Start Assessment
              </Button>
              <Button href="/laws" variant="secondary" size="lg" className="min-w-[220px] text-lg">
                Explore Laws
              </Button>
            </div>
          </div>

          <div className="mt-14 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
            <MiniMetric label="Coverage" value="EU, US, and state-level AI obligations" />
            <MiniMetric label="Primary Use" value="Map deployments to laws and enforcement risk" />
            <MiniMetric label="Priority Signal" value="High-risk workflows flagged instantly" tone="high" />
          </div>
        </section>
      </PageContainer>

      <PageContainer id="features" className="mt-24 space-y-10">
        <SectionHeader
          kicker="Core Capabilities"
          title="Built for teams that need clarity, not legal guesswork."
          subtitle="A focused product workflow for understanding where AI deployments create exposure and what to do next."
          className="max-w-4xl"
        />

        <div className="grid gap-7 lg:grid-cols-3">
          {valueProps.map((feature) => (
            <Card key={feature.title} tone="subtle" className="p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-sky-500/10 bg-slate-900">
                <ValueIcon kind={feature.icon} />
              </div>
              <h3 className="mt-10 text-[1.7rem] font-semibold tracking-tight text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-lg leading-8 text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </PageContainer>

      <PageContainer className="mt-24">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Card tone="subtle" className="p-8 sm:p-10">
            <SectionHeader
              kicker="How It Works"
              title="A clean path from intake to compliance action."
              subtitle="Designed to help enterprise teams move from uncertainty to a usable compliance operating picture."
              className="max-w-3xl"
            />

            <div className="mt-10 space-y-5">
              {workflowSteps.map((item) => (
                <InsetPanel key={item.step} className="px-5 py-5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sm font-semibold tracking-[0.18em] text-sky-300">
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

          <Card tone="primary" className="overflow-hidden p-0">
            <div className="border-b border-white/8 px-7 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Assessment Preview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    AI Compliance Snapshot
                  </h2>
                </div>
                <Badge tone="blue" className="px-3 py-2 text-sm normal-case tracking-normal">
                  Live View
                </Badge>
              </div>
            </div>

            <div className="space-y-6 px-7 py-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <MiniMetric label="Company Footprint" value="US, EU, hiring + support AI" />
                <MiniMetric label="Applicable Laws" value="EU AI Act, GDPR, CPRA" />
                <MiniMetric label="Risk Score" value="84 / 100" tone="high" />
              </div>

              <InsetPanel className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      High Priority
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      High-risk hiring workflow detected
                    </h3>
                  </div>
                  <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                    High Risk
                  </span>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-400">
                  Resume screening and profiling signals indicate likely obligations under the EU
                  AI Act and automated decisioning rules.
                </p>
              </InsetPanel>

              <div className="grid gap-4 md:grid-cols-2">
                <InsetPanel className="p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Triggered Laws
                  </p>
                  <div className="mt-4 space-y-3">
                    {["EU AI Act", "GDPR Article 22", "CCPA / CPRA"].map((law) => (
                      <InsetPanel
                        key={law}
                        className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3"
                      >
                        <span className="text-sm font-medium text-slate-200">{law}</span>
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Active
                        </span>
                      </InsetPanel>
                    ))}
                  </div>
                </InsetPanel>

                <InsetPanel className="p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Recommended Actions
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      "Conduct bias audit for hiring model",
                      "Document human review controls",
                      "Update profiling disclosures",
                    ].map((item, index) => (
                      <div key={item} className="flex gap-3 rounded-xl bg-white/[0.02] px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-300">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-6 text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </InsetPanel>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
