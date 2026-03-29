import type { LawRecord } from "@/lib/mock-data";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";

type LawDetailPanelProps = {
  law: LawRecord;
};

export function LawDetailPanel({ law }: LawDetailPanelProps) {
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
          <RiskBadge risk={law.risk} />
        </div>

        <div className="mt-5">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-100">{law.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {law.category} regulation • {law.jurisdiction}
          </p>
        </div>
      </div>

      <div className="space-y-8 px-6 py-6">
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Summary
          </p>
          <p className="text-sm leading-7 text-slate-300">{law.description}</p>
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
          <p className="mt-4 text-sm leading-7 text-slate-100">{law.exposure.body}</p>
          <InsetPanel tone="red" className="mt-5 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Penalty Exposure
            </p>
            <p className="mt-2 text-sm font-medium text-red-200">{law.exposure.penalty}</p>
          </InsetPanel>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Required Actions
            </p>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {law.requiredActions.length} items
            </span>
          </div>

          <div className="space-y-3">
            {law.requiredActions.map((action) => (
              <InsetPanel key={action.title} className="flex gap-3 px-4 py-4">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                    action.status === "complete"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 bg-slate-900 text-transparent"
                  }`}
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.2]">
                    <path d="M3.5 8.4 6.6 11.5 12.5 5.3" />
                  </svg>
                </span>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      action.status === "complete"
                        ? "text-slate-500 line-through"
                        : "text-slate-100"
                    }`}
                  >
                    {action.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {action.article} • {action.due}
                  </p>
                  </div>
              </InsetPanel>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Timeline & Metadata
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <InsetPanel>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Effective Date
              </p>
              <p className="mt-2 text-sm font-medium text-slate-100">{law.effectiveDate}</p>
            </InsetPanel>
            <InsetPanel>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Enforcement Status
              </p>
              <p className="mt-2 text-sm font-medium text-slate-100">{law.enforcementStatus}</p>
            </InsetPanel>
          </div>

          <div className="space-y-4">
            {law.timeline.map((item, index) => (
              <div key={`${item.date}-${item.label}`} className="relative flex gap-4">
                {index !== law.timeline.length - 1 ? (
                  <span className="absolute left-[11px] top-7 h-10 w-px bg-slate-800" />
                ) : null}
                <span className="mt-1 h-6 w-6 rounded-full border border-sky-500/25 bg-sky-500/10" />
                <div>
                  <p className="text-sm font-medium text-sky-300">{item.date}</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Card>
  );
}
