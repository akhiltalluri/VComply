import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/AppHeader";
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
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen bg-slate-950">
          <AppHeader navigation={navigation} />

          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.38)] sm:p-8 lg:p-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
