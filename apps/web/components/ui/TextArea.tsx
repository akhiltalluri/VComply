import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[140px] w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-950 disabled:text-slate-500",
        className
      )}
      {...props}
    />
  );
}
