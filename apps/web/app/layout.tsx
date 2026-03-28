import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "VComply",
  description: "Real-time AI compliance intelligence",
};

const navigation = [
  { href: "/", label: "Home" },
  { href: "/intake", label: "Intake" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/laws", label: "Laws" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-neutral-100 text-neutral-950 antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(244,244,245,0.88)_42%,_rgba(241,245,249,0.72)_100%)]">
          <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="min-w-0">
                <Link href="/" className="inline-flex items-center text-lg font-semibold tracking-tight text-neutral-950">
                  VComply
                </Link>
                <p className="mt-1 text-sm text-neutral-500">
                  Real-Time AI Compliance Intelligence
                </p>
              </div>

              <nav
                aria-label="Primary"
                className="flex items-center gap-2 overflow-x-auto rounded-full border border-black/5 bg-neutral-50/80 p-1.5 shadow-sm"
              >
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-white hover:text-neutral-950"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <div className="rounded-3xl border border-black/5 bg-white/92 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
