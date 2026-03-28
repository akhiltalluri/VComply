import Link from "next/link";

/** Law catalog browser — later fetch from GET /laws or static seeds */
export default function LawsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
          Applicable Laws Library
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
          Browse regulations relevant to your profile. Hook this page to{" "}
          <code className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200">
            GET /laws
          </code>{" "}
          when ready.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.22)]">
        <ul className="space-y-3">
          <li className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
            <p className="text-sm font-semibold text-slate-100">NYC Local Law 144</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              Automated employment decision tools for hiring workflows.
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-amber-400">
              Demo seed
            </p>
          </li>
        </ul>
      </div>

      <p className="text-sm text-slate-400">
        This section will expand into a searchable compliance library as backend law data is wired
        in.
      </p>

      <Link
        href="/intake"
        className="inline-flex items-center text-sm font-medium text-blue-400 transition hover:text-blue-300"
      >
        Back to intake
      </Link>
    </div>
  );
}
