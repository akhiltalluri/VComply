"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
  className?: string;
};

export function NavLink({ href, label, active = false, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 pb-3 transition",
        active ? "border-sky-400 text-sky-300" : "border-transparent hover:text-slate-200",
        className
      )}
    >
      {label}
    </Link>
  );
}
