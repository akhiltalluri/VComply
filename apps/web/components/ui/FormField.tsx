import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  helperText,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-slate-200">
          {label}
        </Label>
        {helperText ? <p className="text-sm leading-6 text-slate-500">{helperText}</p> : null}
      </div>
      {children}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
