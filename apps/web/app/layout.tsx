import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

/** Root layout: add providers (theme, query client) here as the app grows */
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
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-neutral-200 bg-white">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3 text-sm">
            <Link href="/" className="font-semibold text-neutral-900">
              VComply
            </Link>
            <Link href="/intake" className="text-neutral-600 hover:text-neutral-900">
              Intake
            </Link>
            <Link href="/dashboard" className="text-neutral-600 hover:text-neutral-900">
              Dashboard
            </Link>
            <Link href="/laws" className="text-neutral-600 hover:text-neutral-900">
              Laws
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
