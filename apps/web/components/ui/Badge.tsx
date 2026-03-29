import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "blue" | "high" | "medium" | "low";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "border-slate-700 bg-slate-950 text-slate-200",
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  high: "border-red-500/20 bg-red-500/10 text-red-400",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  low: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

export function Badge({ children, className, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
