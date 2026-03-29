import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "VComply",
  description: "Real-time AI compliance intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        suppressHydrationWarning
        className="min-h-full bg-slate-950 text-slate-100 antialiased"
      >
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.06),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.98)_0%,_rgba(2,6,23,1)_100%)]">
          <AppHeader />
          <main className="pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
