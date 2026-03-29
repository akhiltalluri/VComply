import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InsetPanelProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "blue" | "amber" | "red" | "green";
};

const toneClasses: Record<NonNullable<InsetPanelProps["tone"]>, string> = {
  default: "border-slate-800 bg-slate-950/70",
  blue: "border-blue-500/20 bg-blue-500/10",
  amber: "border-amber-500/20 bg-amber-500/[0.07]",
  red: "border-red-500/20 bg-red-500/[0.07]",
  green: "border-emerald-500/20 bg-emerald-500/[0.07]",
};

export function InsetPanel({
  className,
  tone = "default",
  children,
  ...props
}: InsetPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-[transform,border-color,background-color,box-shadow] duration-300 motion-reduce:transform-none",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
