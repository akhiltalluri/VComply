import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import type { ComplianceReportRecord } from "@/types";

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

type CurrentAssessmentCardProps = {
  report: ComplianceReportRecord | null;
  isViewingCurrent: boolean;
  onViewCurrent: () => void;
  startNewHref: string;
};

export function CurrentAssessmentCard({
  report,
  isViewingCurrent,
  onViewCurrent,
  startNewHref,
}: CurrentAssessmentCardProps) {
  return (
    <Card tone="subtle" className="motion-lift p-0">
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
              Current Assessment
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">
              {report ? report.title : "No active assessment"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              {report
                ? "The active dashboard workspace always reflects the latest compliance report generated from Intake."
                : "Start a new assessment from Intake to generate a fresh active compliance report. Archived reports remain available in dashboard history."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href={startNewHref} variant="primary">
              Start New Assessment
            </Button>
            {report ? (
              <Button
                variant={isViewingCurrent ? "secondary" : "ghost"}
                onClick={onViewCurrent}
              >
                {isViewingCurrent ? "Viewing Current Report" : "View Current Report"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {report ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="blue" className="normal-case tracking-normal">
                Active Workspace
              </Badge>
              <Badge tone={riskTone(report.risk_level)}>{report.risk_level}</Badge>
              <Badge tone="neutral" className="normal-case tracking-normal">
                {report.status_label}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <InsetPanel className="motion-lift">
                <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                  Company
                </p>
                <p className="mt-3 text-sm font-medium text-slate-100">{report.company_name}</p>
              </InsetPanel>
              <InsetPanel className="motion-lift">
                <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                  Generated
                </p>
                <p className="mt-3 text-sm font-medium text-slate-100">
                  {formatCreatedAt(report.created_at)}
                </p>
              </InsetPanel>
              <InsetPanel className="motion-lift">
                <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                  Risk Score
                </p>
                <p className="mt-3 text-sm font-medium text-slate-100">{report.risk_score}/100</p>
              </InsetPanel>
              <InsetPanel className="motion-lift">
                <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                  Required Actions
                </p>
                <p className="mt-3 text-sm font-medium text-slate-100">
                  {report.required_actions_count}
                </p>
              </InsetPanel>
            </div>

            <InsetPanel
              tone={report.risk_level === "HIGH" ? "red" : report.risk_level === "MEDIUM" ? "amber" : "green"}
              className="motion-lift"
            >
              <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                Active Report Summary
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{report.summary}</p>
            </InsetPanel>
          </>
        ) : (
          <InsetPanel tone="amber">
            <p className="text-sm font-semibold text-amber-200">Active assessment reset</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The previous active report has been moved into Assessment History. Complete Intake to
              promote a fresh report into the current dashboard workspace.
            </p>
          </InsetPanel>
        )}
      </div>
    </Card>
  );
}
