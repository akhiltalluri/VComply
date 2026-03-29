import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import type { ComplianceReportRecord } from "@/types";

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recent";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function riskTone(riskLevel: ComplianceReportRecord["risk_level"]) {
  if (riskLevel === "HIGH") {
    return "high";
  }

  if (riskLevel === "MEDIUM") {
    return "medium";
  }

  return "low";
}

type AssessmentHistoryListProps = {
  reports: ComplianceReportRecord[];
  selectedReportId: string | null;
  onSelectReport: (reportId: string) => void;
};

export function AssessmentHistoryList({
  reports,
  selectedReportId,
  onSelectReport,
}: AssessmentHistoryListProps) {
  return (
    <Card tone="subtle" className="motion-lift p-0">
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Assessment History
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">Archived Reports</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Previous compliance reports stay on the dashboard so teams can revisit earlier
              assessments without leaving the active workspace.
            </p>
          </div>
          <Badge tone="neutral" className="normal-case tracking-normal">
            {reports.length} archived
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {reports.length === 0 ? (
          <InsetPanel>
            <p className="text-sm font-semibold text-slate-100">No archived reports yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Once a new assessment starts, the prior active report will move here and remain
              available for review and export.
            </p>
          </InsetPanel>
        ) : null}

        {reports.map((report) => {
          const selected = report.id === selectedReportId;

          return (
            <button
              key={report.id}
              type="button"
              onClick={() => onSelectReport(report.id)}
              className={`motion-lift motion-swap w-full rounded-2xl border px-4 py-4 text-left transition ${
                selected
                  ? "border-blue-500/30 bg-blue-500/[0.08]"
                  : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100">{report.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{formatCreatedAt(report.created_at)}</p>
                </div>
                {selected ? (
                  <Badge tone="blue" className="normal-case tracking-normal">
                    Viewing
                  </Badge>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={riskTone(report.risk_level)}>{report.risk_level}</Badge>
                <Badge tone="neutral" className="normal-case tracking-normal">
                  {report.status_label}
                </Badge>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">{report.summary}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                <span>{report.applicable_laws_count} laws</span>
                <span>{report.required_actions_count} actions</span>
                <span>{report.risk_score}/100 score</span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
