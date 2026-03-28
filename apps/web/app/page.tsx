import Link from "next/link";

/** Landing page — hero + CTA into intake */
export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
          Real-time AI compliance intelligence built for modern risk teams.
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          Map your jurisdictions and AI use cases to likely regulations, surface risk exposure,
          and move from uncertainty to clear compliance next steps with a calm, enterprise-ready
          workflow.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.28)] sm:p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Why VComply
              </p>
              <p className="text-lg leading-8 text-slate-200">
                Understand which AI regulations may apply before they become operational surprises.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Intake
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Capture company footprint, industry context, and AI usage signals.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Assessment
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Review risk score, triggered laws, and concrete next-step recommendations.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/intake"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Start intake
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                What you get
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
                Compliance visibility in one view
              </h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-sm font-medium text-slate-100">Applicable regulations</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Identify which AI laws likely apply to your current use cases and locations.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-sm font-medium text-slate-100">Risk exposure summary</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Surface high-priority issues quickly with a readable dashboard for stakeholders.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-sm font-medium text-slate-100">Recommended next actions</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Turn regulatory signals into practical follow-up steps for compliance teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
