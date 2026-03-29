import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
  wrapperClassName?: string;
};

export function CheckboxField({
  label,
  description,
  className,
  wrapperClassName,
  ...props
}: CheckboxFieldProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-4",
        wrapperClassName
      )}
    >
      <input
        type="checkbox"
        className={cn(
          "mt-1 h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500/20",
          className
        )}
        {...props}
      />
      <span>
        <span className="block text-sm font-medium text-slate-100">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm leading-6 text-slate-400">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
