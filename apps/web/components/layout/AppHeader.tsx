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
      <header className="border-b border-white/8 bg-slate-950/92 backdrop-blur-xl">
        <PageContainer className="flex items-center py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 text-base text-slate-500 transition hover:text-slate-200 sm:text-lg"
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
      <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/92 backdrop-blur-xl">
        <PageContainer className="flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-4">
            <BrandMark />
            <span className="text-[1.55rem] font-semibold tracking-tight text-white sm:text-[2rem]">
              VComply
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <nav className="hidden items-center gap-10 text-slate-400 md:flex">
              <a href="#features" className="transition hover:text-white">
                Capabilities
              </a>
              <a href="#workflow" className="transition hover:text-white">
                Workflow
              </a>
              <a href="#preview" className="transition hover:text-white">
                Platform
              </a>
            </nav>
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
    <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/92 backdrop-blur-xl">
        <PageContainer className="flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-4">
            <BrandMark />
            <span className="text-[1.55rem] font-semibold tracking-tight text-white sm:text-[2rem]">
              VComply
            </span>
          </Link>

        <div className="flex items-center gap-4 sm:gap-8">
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

          <Button href="/intake" variant="primary" size="md" className="text-sm sm:text-lg">
            New Assessment
          </Button>
        </div>
      </PageContainer>
    </header>
  );
}
