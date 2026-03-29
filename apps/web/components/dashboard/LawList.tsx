import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { ComplianceAssessment } from "@/lib/mock-data";

type LawItem = ComplianceAssessment["applicable_laws"][number];

type LawListProps = {
  laws: LawItem[];
};

function inferJurisdiction(lawName: string) {
  if (lawName.includes("EU") || lawName.includes("GDPR")) {
    return "European Union";
  }

  if (lawName.includes("NYC") || lawName.includes("California") || lawName.includes("CCPA")) {
    return "United States";
  }

  return "Applicable Jurisdiction";
}

export function LawList({ laws }: LawListProps) {
  return (
    <Card tone="subtle" className="p-0">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-100">Applicable Laws</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Regulations currently triggered by your AI deployment profile.
        </p>
      </div>

      <div className="divide-y divide-slate-800">
        {laws.map((law) => (
          <div
            key={`${law.law}-${law.next_step}`}
            className="px-6 py-5 transition hover:bg-white/[0.02]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-100">{law.law}</h3>
                  <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    {inferJurisdiction(law.law)}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{law.reason}</p>
              </div>

              <RiskBadge risk={law.risk} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-500">Next step</span>
              <span className="rounded-lg border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-blue-300">
                {law.next_step}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
