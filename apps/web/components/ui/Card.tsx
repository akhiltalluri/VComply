import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "primary" | "secondary" | "subtle";
};

const toneClasses: Record<NonNullable<CardProps["tone"]>, string> = {
  primary: "border-slate-800 bg-slate-900 shadow-[0_24px_70px_rgba(2,6,23,0.22)]",
  secondary: "border-slate-800 bg-slate-800/70 shadow-[0_18px_50px_rgba(2,6,23,0.18)]",
  subtle: "border-slate-800 bg-white/[0.03] shadow-[0_20px_60px_rgba(2,6,23,0.18)]",
};

export function Card({ children, className, tone = "primary", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 backdrop-blur-[1px] transition-[transform,box-shadow,border-color,background-color] duration-300 will-change-transform motion-reduce:transform-none",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
