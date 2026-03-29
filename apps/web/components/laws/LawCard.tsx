import type { LawRecord } from "@/lib/mock-data";
import { RiskBadge } from "@/components/ui/RiskBadge";

type LawCardProps = {
  law: LawRecord;
  selected: boolean;
  onSelect: () => void;
};

export function LawCard({ law, selected, onSelect }: LawCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-sky-400/60 bg-sky-500/[0.08] shadow-[inset_0_0_0_1px_rgba(56,189,248,0.14)]"
          : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60"
      }`}
    >
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold tracking-[0.2em] text-slate-200">
          {law.regionBadge}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-100">{law.title}</h3>
            <span className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {law.jurisdiction}
            </span>
            <RiskBadge risk={law.risk} />
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-300">{law.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {law.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-slate-800 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
