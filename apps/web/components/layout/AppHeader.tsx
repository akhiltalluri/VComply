"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  href: string;
  label: string;
};

type AppHeaderProps = {
  navigation: NavigationItem[];
};

const routeThemes: Record<
  string,
  {
    nav: string;
    navHover: string;
    rail: string;
  }
> = {
  "/": {
    nav: "bg-blue-500/10 text-blue-400",
    navHover: "hover:bg-blue-500/10 hover:text-blue-300",
    rail: "from-blue-500/70 via-blue-400/40 to-transparent",
  },
  "/intake": {
    nav: "bg-blue-500/10 text-blue-400",
    navHover: "hover:bg-blue-500/10 hover:text-blue-300",
    rail: "from-blue-500/70 via-blue-400/40 to-transparent",
  },
  "/dashboard": {
    nav: "bg-blue-500/10 text-blue-400",
    navHover: "hover:bg-blue-500/10 hover:text-blue-300",
    rail: "from-blue-500/70 via-blue-400/40 to-transparent",
  },
  "/laws": {
    nav: "bg-blue-500/10 text-blue-400",
    navHover: "hover:bg-blue-500/10 hover:text-blue-300",
    rail: "from-blue-500/70 via-blue-400/40 to-transparent",
  },
};

function getTheme(pathname: string) {
  if (pathname.startsWith("/intake")) {
    return routeThemes["/intake"];
  }

  if (pathname.startsWith("/dashboard")) {
    return routeThemes["/dashboard"];
  }

  if (pathname.startsWith("/laws")) {
    return routeThemes["/laws"];
  }

  return routeThemes["/"];
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function AppHeader({ navigation }: AppHeaderProps) {
  const pathname = usePathname();
  const theme = getTheme(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/88 backdrop-blur-xl">
      <div className={`h-px w-full bg-gradient-to-r ${theme.rail}`} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <Link
            href="/"
            className="inline-flex items-center text-lg font-semibold tracking-tight text-slate-100 transition hover:text-blue-400"
          >
            VComply
          </Link>
          <p className="mt-1 text-sm text-slate-400">
            Real-Time AI Compliance Intelligence
          </p>
        </div>

        <nav
          aria-label="Primary"
          className="flex items-center gap-2 overflow-x-auto rounded-full border border-slate-800 bg-slate-900/80 p-1.5 shadow-[0_10px_30px_rgba(2,6,23,0.35)]"
        >
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? theme.nav
                    : `text-slate-300 hover:bg-slate-800 hover:text-slate-100 ${theme.navHover}`
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
