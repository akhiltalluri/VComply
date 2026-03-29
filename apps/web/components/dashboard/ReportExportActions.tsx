import { Button } from "@/components/ui/Button";
import { InsetPanel } from "@/components/ui/InsetPanel";
import type { ComplianceReportRecord } from "@/types";

type ReportExportActionsProps = {
  report: ComplianceReportRecord | null;
  onExportPdf: () => void;
  onExportCsv: () => void;
};

export function ReportExportActions({
  report,
  onExportPdf,
  onExportCsv,
}: ReportExportActionsProps) {
  return (
    <InsetPanel className="motion-lift motion-swap min-w-[280px]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Export Report
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Download the currently viewed assessment in a demo-safe format for sharing or review.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onExportPdf} disabled={!report}>
          Download PDF
        </Button>
        <Button variant="ghost" onClick={onExportCsv} disabled={!report}>
          Download CSV
        </Button>
      </div>
    </InsetPanel>
  );
}
