import type { DashboardAction } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";

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

const statusTone: Record<
  NonNullable<DashboardAction["status"]>,
  "high" | "medium" | "low" | "blue"
> = {
  OPEN: "high",
  IN_PROGRESS: "blue",
  SCHEDULED: "medium",
  COMPLETED: "low",
};

const statusLabel: Record<NonNullable<DashboardAction["status"]>, string> = {
  OPEN: "Pending",
  IN_PROGRESS: "In Progress",
  SCHEDULED: "Pending",
  COMPLETED: "Completed",
};

type ActionListProps = {
  actions: DashboardAction[];
};

export function ActionList({ actions }: ActionListProps) {
  return (
    <Card tone="subtle" className="p-0">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-100">Required Compliance Actions</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Prioritized remediation work required to reduce current regulatory exposure.
        </p>
      </div>

      <div className="divide-y divide-slate-800">
        {actions.length === 0 ? (
          <div className="px-6 py-8">
            <InsetPanel>
              <p className="text-sm font-semibold text-slate-100">No required actions available</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The assessment did not return any remediation items yet. Continue monitoring the
                impacted regulations and refresh the assessment when more data is available.
              </p>
            </InsetPanel>
          </div>
        ) : null}
        {actions.map((action) => (
          <div
            key={action.id}
            className="px-6 py-5 transition hover:bg-white/[0.02]"
          >
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                <span className={`h-2.5 w-2.5 rounded-full ${priorityStyles[action.priority]}`} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-100">{action.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      {action.description ?? action.system}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={priorityBadgeTone[action.priority]}>{action.priority}</Badge>
                    {action.status ? (
                      <Badge tone={statusTone[action.status]} className="normal-case tracking-normal">
                        {statusLabel[action.status]}
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{action.system}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <span>{action.source}</span>
                  {action.business_area ? (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span>{action.business_area}</span>
                    </>
                  ) : null}
                  {action.owner ? (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span>{action.owner}</span>
                    </>
                  ) : null}
                  {action.due ? (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span>Due {action.due}</span>
                    </>
                  ) : null}
                </div>

                <InsetPanel className="mt-4 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Execution Priority
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        action.priority === "HIGH"
                          ? "text-red-300"
                          : action.priority === "MEDIUM"
                            ? "text-amber-300"
                            : action.priority === "LOW"
                              ? "text-emerald-300"
                              : "text-slate-300"
                      }`}
                    >
                      {action.priority === "HIGH"
                        ? "Address immediately"
                        : action.priority === "MEDIUM"
                          ? "Plan in current cycle"
                          : action.priority === "LOW"
                            ? "Track and complete"
                            : "Informational"}
                    </span>
                  </div>
                </InsetPanel>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
