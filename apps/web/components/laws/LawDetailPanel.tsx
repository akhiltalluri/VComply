import type { LawRecord } from "@/lib/mock-data";
import { ActionChecklist } from "@/components/laws/ActionChecklist";
import { Badge } from "@/components/ui/Badge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";

type LawDetailPanelProps = {
  law: LawRecord;
  applicabilityExplanation: string;
};

export function LawDetailPanel({ law, applicabilityExplanation }: LawDetailPanelProps) {
  const affectedWorkflows =
    law.affectedWorkflows.length > 0 ? law.affectedWorkflows : ["Not provided"];
  const requiredActions =
    law.requiredActions.length > 0 ? law.requiredActions : [];
  const timeline = law.timeline.length > 0 ? law.timeline : [];
  const notes = law.notes && law.notes.length > 0 ? law.notes : [];

  return (
    <Card tone="primary" className="h-full p-0">
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold tracking-[0.2em] text-slate-200">
            {law.regionBadge}
          </span>
          <span className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {law.status}
          </span>
          <Badge tone="blue" className="tracking-[0.16em]">
            {law.enforcementStage}
          </Badge>
          <RiskBadge risk={law.risk} />
        </div>

        <div className="mt-5">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-100">{law.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {law.category} • {law.jurisdiction}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Source reference: {law.sourceLabel} • Responsible team: {law.ownerTeam}
          </p>
        </div>
      </div>

      <div className="space-y-8 px-6 py-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <InsetPanel>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Jurisdiction
            </p>
            <p className="mt-2 text-sm font-medium text-slate-100">{law.jurisdiction || "Not provided"}</p>
          </InsetPanel>
          <InsetPanel>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Effective Date
            </p>
            <p className="mt-2 text-sm font-medium text-slate-100">{law.effectiveDate || "Unavailable"}</p>
          </InsetPanel>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Legislative Summary
          </p>
          <p className="text-sm leading-7 text-slate-300">{law.description || "Summary unavailable."}</p>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Why It Matters
          </p>
          <InsetPanel className="p-5">
            <p className="text-sm leading-7 text-slate-200">{law.whyItMatters || "Why this matters has not been provided."}</p>
          </InsetPanel>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Risk Rationale
          </p>
          <InsetPanel className="p-5">
            <p className="text-sm leading-7 text-slate-300">{law.exposure.rationale || "Risk rationale unavailable."}</p>
          </InsetPanel>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Why this applies to your company
          </p>
          <InsetPanel tone="blue" className="p-5">
            <p className="text-sm leading-7 text-slate-200">
              {applicabilityExplanation || "No company-specific applicability explanation is available for this regulation."}
            </p>
          </InsetPanel>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Affected Workflows
          </p>
          <div className="flex flex-wrap gap-2">
            {affectedWorkflows.map((workflow) => (
              <span
                key={workflow}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
              >
                {workflow}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-5">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-red-400">
              <path d="M8 1.5 15 14.5H1L8 1.5Zm0 4.2a.8.8 0 0 0-.8.8v2.5a.8.8 0 0 0 1.6 0V6.5a.8.8 0 0 0-.8-.8Zm0 6.1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              {law.exposure.title}
            </p>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-100">
            {law.exposure.body || "Critical exposure details are unavailable."}
          </p>
          <InsetPanel tone="red" className="mt-5 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Penalty Exposure
            </p>
            <p className="mt-2 text-sm font-medium text-red-200">{law.exposure.penalty || "Penalty exposure unavailable."}</p>
          </InsetPanel>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Required Actions
            </p>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {requiredActions.length} items
            </span>
          </div>

          {requiredActions.length > 0 ? (
            <ActionChecklist actions={requiredActions} />
          ) : (
            <InsetPanel>
              <p className="text-sm font-semibold text-slate-100">No actions specified</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The current data source did not return required actions for this regulation.
              </p>
            </InsetPanel>
          )}
        </section>

        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Enforcement Timeline and Metadata
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <InsetPanel>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Effective / Enactment Date
              </p>
              <p className="mt-2 text-sm font-medium text-slate-100">{law.effectiveDate || "Unavailable"}</p>
            </InsetPanel>
            <InsetPanel>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Enforcement Status
              </p>
              <p className="mt-2 text-sm font-medium text-slate-100">{law.enforcementStatus || "Pending classification"}</p>
            </InsetPanel>
          </div>

          {notes.length > 0 ? (
            <InsetPanel className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Regulatory Notes
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-300">
                {notes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </InsetPanel>
          ) : null}

          <div className="space-y-4">
            {timeline.length > 0 ? timeline.map((item, index) => (
              <div key={`${item.date}-${item.label}`} className="relative flex gap-4">
                {index !== timeline.length - 1 ? (
                  <span className="absolute left-[11px] top-7 h-10 w-px bg-slate-800" />
                ) : null}
                <span className="mt-1 h-6 w-6 rounded-full border border-sky-500/25 bg-sky-500/10" />
                <div>
                  <p className="text-sm font-medium text-sky-300">{item.date}</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              </div>
            )) : (
              <InsetPanel>
                <p className="text-sm font-semibold text-slate-100">Timeline unavailable</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  No enforcement timeline is currently available for this regulation.
                </p>
              </InsetPanel>
            )}
          </div>
        </section>
      </div>
    </Card>
  );
}
