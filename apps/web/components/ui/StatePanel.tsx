import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type StatePanelTone = "default" | "info" | "warning" | "error";

type StatePanelProps = {
  title: string;
  description: string;
  tone?: StatePanelTone;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

const toneClasses: Record<StatePanelTone, string> = {
  default: "border-slate-800 bg-slate-900",
  info: "border-blue-500/20 bg-blue-500/[0.06]",
  warning: "border-amber-500/20 bg-amber-500/[0.06]",
  error: "border-red-500/20 bg-red-500/[0.06]",
};

export function StatePanel({
  title,
  description,
  tone = "default",
  actions,
  icon,
  className,
}: StatePanelProps) {
  return (
    <Card
      tone="primary"
      className={cn(
        "motion-enter mx-auto max-w-2xl p-8 text-center sm:p-10",
        tone === "info" && "motion-sheen",
        toneClasses[tone],
        className
      )}
    >
      {icon ? (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 text-slate-200">
          {icon}
        </div>
      ) : null}
      <h2 className={cn("mt-6 text-2xl font-semibold text-slate-100", !icon && "mt-0")}>{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">{description}</p>
      {actions ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div> : null}
    </Card>
  );
}
