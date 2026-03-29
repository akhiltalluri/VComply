import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type SharedProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-blue-500 bg-blue-500 text-slate-950 shadow-[0_14px_36px_rgba(37,99,235,0.18)] hover:bg-blue-400 hover:border-blue-400 active:translate-y-px",
  secondary:
    "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800 active:translate-y-px",
  ghost:
    "border border-transparent bg-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-900 hover:text-slate-100 active:translate-y-px",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

function sharedClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";

  if ("href" in props && props.href) {
    const {
      href,
      children,
      className,
      variant: linkVariant,
      size: linkSize,
      ...linkProps
    } = props as ButtonAsLink;
    void linkVariant;
    void linkSize;
    return (
      <Link
        href={href}
        className={sharedClassName(variant, size, className)}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const {
    children,
    className,
    type,
    variant: buttonVariant,
    size: buttonSize,
    ...buttonProps
  } = props as ButtonAsButton;
  void buttonVariant;
  void buttonSize;

  return (
    <button
      type={type ?? "button"}
      className={sharedClassName(variant, size, className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
