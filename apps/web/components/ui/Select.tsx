import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 pr-11 text-base text-slate-100 outline-none transition focus:-translate-y-px focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-950 disabled:text-slate-500 motion-reduce:transform-none",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 stroke-slate-500 stroke-[1.8]"
      >
        <path d="m3 6 5 5 5-5" fill="none" />
      </svg>
    </div>
  );
}
