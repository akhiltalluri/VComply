import type { DashboardAction } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const priorityStyles: Record<DashboardAction["priority"], string> = {
  HIGH: "bg-red-400",
  MEDIUM: "bg-amber-300",
  LOW: "bg-teal-300",
  INFO: "bg-slate-500",
};

const priorityBadgeTone: Record<DashboardAction["priority"], "high" | "medium" | "low" | "neutral"> =
  {
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
    INFO: "neutral",
  };

type ActionListProps = {
  actions: DashboardAction[];
};

export function ActionList({ actions }: ActionListProps) {
  return (
    <Card tone="subtle" className="p-0">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-100">Pending Actions</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Prioritized compliance work pulled from triggered regulations and current controls.
        </p>
      </div>

      <div className="divide-y divide-slate-800">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-start gap-4 px-6 py-5 transition hover:bg-white/[0.02]"
          >
            <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
              <span className={`h-2.5 w-2.5 rounded-full ${priorityStyles[action.priority]}`} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-base font-semibold text-slate-100">{action.title}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={priorityBadgeTone[action.priority]} className="tracking-[0.18em]">
                    {action.priority}
                  </Badge>
                  <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    {action.source}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-sm leading-7 text-slate-400">{action.system}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
