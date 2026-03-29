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
      <body className="min-h-full bg-[#050b18] text-slate-100 antialiased">
        <div className="min-h-screen bg-[#050b18]">
          <AppHeader />
          <main className="pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
