"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { NavLink } from "@/components/layout/NavLink";
import { BrandMark } from "@/components/ui/BrandMark";
import { Button } from "@/components/ui/Button";

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M7 3 2 8l5 5M3 8h11" />
    </svg>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isAssessment = pathname.startsWith("/intake");

  if (isAssessment) {
    return (
      <header className="border-b border-white/8 bg-[#071124]">
        <PageContainer className="flex items-center py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 text-lg text-slate-500 transition hover:text-slate-200"
          >
            <ArrowLeftIcon />
            <span>Back to Dashboard</span>
          </Link>
        </PageContainer>
      </header>
    );
  }

  if (isLanding) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#071124]/92 backdrop-blur-xl">
        <PageContainer className="flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-4">
            <BrandMark />
            <span className="text-[2rem] font-semibold tracking-tight text-white">VComply</span>
          </Link>

          <div className="flex items-center gap-4 text-lg">
            <nav className="hidden items-center gap-12 text-slate-400 md:flex">
              <a href="#features" className="transition hover:text-white">
                Features
              </a>
              <a href="#pricing" className="transition hover:text-white">
                Pricing
              </a>
            </nav>
            <Button href="/dashboard" variant="secondary" size="md">
              Log In
            </Button>
            <Button href="/intake" variant="primary" size="md">
              Start Assessment
            </Button>
          </div>
        </PageContainer>
      </header>
    );
  }

  const appNavigation = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/intake", label: "Intake" },
    { href: "/laws", label: "Laws Explorer" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#071124]/92 backdrop-blur-xl">
      <PageContainer className="flex items-center justify-between py-4">
        <Link href="/" className="inline-flex items-center gap-4">
          <BrandMark />
          <span className="text-[2rem] font-semibold tracking-tight text-white">VComply</span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-10 text-lg text-slate-500 md:flex">
            {appNavigation.map((item) => {
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={pathname.startsWith(item.href)}
                />
              );
            })}
          </nav>

          <Button href="/intake" variant="primary" size="md" className="text-lg">
            New Assessment
          </Button>
        </div>
      </PageContainer>
    </header>
  );
}
