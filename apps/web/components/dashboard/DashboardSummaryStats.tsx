import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";

type DashboardSummaryStatsProps = {
  regulations: number;
  highRiskIssues: number;
  requiredActions: number;
};

export function DashboardSummaryStats({
  regulations,
  highRiskIssues,
  requiredActions,
}: DashboardSummaryStatsProps) {
  return (
    <Card tone="subtle" className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Assessment Snapshot
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">
            Current regulatory position at a glance
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InsetPanel>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Impacted Regulations
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">{regulations}</p>
        </InsetPanel>

        <InsetPanel tone={highRiskIssues > 0 ? "red" : "green"}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            High-Risk Issues
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">{highRiskIssues}</p>
        </InsetPanel>

        <InsetPanel tone={requiredActions > 0 ? "amber" : "green"}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Required Actions
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">{requiredActions}</p>
        </InsetPanel>
      </div>
    </Card>
  );
}
