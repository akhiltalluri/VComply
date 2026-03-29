import type { LawAction } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { InsetPanel } from "@/components/ui/InsetPanel";

type ActionChecklistProps = {
  actions: LawAction[];
};

function urgencyTone(urgency?: LawAction["urgency"]) {
  if (urgency === "HIGH") {
    return "high" as const;
  }

  if (urgency === "MEDIUM") {
    return "medium" as const;
  }

  if (urgency === "LOW") {
    return "low" as const;
  }

  return "neutral" as const;
}

export function ActionChecklist({ actions }: ActionChecklistProps) {
  return (
    <div className="space-y-3">
      {actions.map((action) => (
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

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={`text-sm font-medium ${
                  action.status === "complete" ? "text-slate-500 line-through" : "text-slate-100"
                }`}
              >
                {action.title}
              </p>
              <Badge
                tone={action.status === "complete" ? "low" : "medium"}
                className="normal-case tracking-normal"
              >
                {action.status === "complete" ? "Completed" : "Pending"}
              </Badge>
              {action.urgency ? (
                <Badge tone={urgencyTone(action.urgency)} className="tracking-[0.16em]">
                  {action.urgency}
                </Badge>
              ) : null}
            </div>

            {action.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-400">{action.description}</p>
            ) : null}

            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              {action.article} • {action.due}
              {action.owner ? ` • ${action.owner}` : ""}
            </p>
          </div>
        </InsetPanel>
      ))}
    </div>
  );
}
