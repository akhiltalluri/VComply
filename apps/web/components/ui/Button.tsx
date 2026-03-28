import type { ButtonHTMLAttributes } from "react";

/** Primitive button — extend with variants (size, intent) as the design system grows */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
