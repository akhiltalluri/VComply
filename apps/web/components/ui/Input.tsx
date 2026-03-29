import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:-translate-y-px focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-950 disabled:text-slate-500 motion-reduce:transform-none",
        className
      )}
      {...props}
    />
  );
}
