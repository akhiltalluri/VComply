"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ApplicableLaw = {
  law: string;
  risk: string;
  reason: string;
  next_step: string;
};

type ComplianceResult = {
  risk_score: number;
  applicable_laws: ApplicableLaw[];
};

type DashboardState = "loading" | "ready" | "empty" | "error";

function getSeverity(score: number) {
  if (score >= 70) {
    return {
      label: "High",
      badge: "bg-red-500/10 text-red-400 ring-red-500/20",
      accent: "text-red-400",
      panel: "border-red-500/20 bg-red-500/10",
    };
  }

  if (score >= 30) {
    return {
      label: "Medium",
      badge: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
      accent: "text-amber-400",
      panel: "border-amber-500/20 bg-amber-500/10",
    };
  }

  return {
    label: "Low",
    badge: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    accent: "text-emerald-400",
    panel: "border-emerald-500/20 bg-emerald-500/10",
  };
}

function getRiskBadgeClasses(risk: string) {
  const normalized = risk.toLowerCase();

  if (normalized === "high") {
    return "bg-red-500/10 text-red-400 ring-red-500/20";
  }

  if (normalized === "medium") {
    return "bg-amber-500/10 text-amber-400 ring-amber-500/20";
  }

  return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";
}

export default function DashboardPage() {
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [state, setState] = useState<DashboardState>("loading");

  useEffect(() => {
    try {
      const storedResult = localStorage.getItem("complianceResult");

      if (!storedResult) {
        setResult(null);
        setState("empty");
        return;
      }

      const parsed = JSON.parse(storedResult) as Partial<ComplianceResult>;

      if (
        typeof parsed?.risk_score === "number" &&
        Array.isArray(parsed?.applicable_laws)
      ) {
        const safeLaws = parsed.applicable_laws.filter(
          (law): law is ApplicableLaw =>
            typeof law?.law === "string" &&
            typeof law?.risk === "string" &&
            typeof law?.reason === "string" &&
            typeof law?.next_step === "string"
        );

        if (safeLaws.length !== parsed.applicable_laws.length) {
          setResult(null);
          setState("error");
          return;
        }

        setResult({
          risk_score: parsed.risk_score,
          applicable_laws: safeLaws,
        });
        setState("ready");
      } else {
        setResult(null);
        setState("error");
      }
    } catch {
      setResult(null);
      setState("error");
    }
  }, []);

  const severity = useMemo(
    () => getSeverity(result?.risk_score ?? 0),
    [result?.risk_score]
  );

  const nextSteps = useMemo(() => {
    if (!result) {
      return [];
    }

    return [...new Set(result.applicable_laws.map((law) => law.next_step))];
  }, [result]);

  const summary = useMemo(() => {
    if (!result) {
      return "";
    }

    const regulationCount = result.applicable_laws.length;
    const regulationLabel = regulationCount === 1 ? "regulation" : "regulations";

    return `Your company may be subject to ${regulationCount} applicable AI ${regulationLabel} with ${severity.label.toLowerCase()} compliance risk.`;
  }, [result, severity.label]);

  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-[0_24px_60px_rgba(2,6,23,0.35)] sm:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-400" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-slate-100">
                Loading compliance assessment...
              </h1>
              <p className="text-sm text-slate-400">
                We&apos;re reading your saved assessment and preparing the dashboard.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="h-4 w-28 animate-pulse rounded-full bg-slate-800" />
              <div className="h-12 w-32 animate-pulse rounded-2xl bg-slate-800" />
              <div className="h-4 w-full max-w-md animate-pulse rounded-full bg-slate-800" />
            </div>
            <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="h-4 w-20 animate-pulse rounded-full bg-slate-800" />
              <div className="h-6 w-full animate-pulse rounded-xl bg-slate-800" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-20 animate-pulse rounded-2xl bg-slate-800" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-[0_24px_60px_rgba(2,6,23,0.35)] sm:p-10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
            <span className="text-xl font-semibold">?</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
              No compliance assessment found
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              We couldn&apos;t find a saved assessment in this browser session. Complete the intake
              flow to generate your AI compliance overview and recommended next steps.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Go to Intake
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error" || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-red-500/20 bg-slate-900 p-8 text-center shadow-[0_24px_60px_rgba(2,6,23,0.35)] sm:p-10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <span className="text-xl font-semibold">!</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
              Unable to load assessment
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              The saved compliance data in this browser session appears incomplete or invalid.
              Return to intake to generate a fresh assessment.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Return to Intake
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
            Compliance Assessment Dashboard
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Overview of applicable AI regulations, risk exposure, and recommended next steps.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section
          className={`rounded-3xl border p-6 shadow-sm sm:p-7 ${severity.panel}`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Risk Score
              </p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-semibold tracking-tight text-slate-100 sm:text-6xl">
                  {result.risk_score}
                </span>
                <span className="pb-2 text-sm text-slate-400">/ 100</span>
              </div>
            </div>

            <div
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${severity.badge}`}
            >
              {severity.label} Severity
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-200">
            Your current profile indicates a{" "}
            <span className={`font-semibold ${severity.accent}`}>{severity.label.toLowerCase()}</span>{" "}
            compliance exposure level based on the AI usage and regulatory triggers captured in the
            latest assessment.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm sm:p-7">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            Summary
          </p>
          <div className="mt-4 space-y-4">
            <p className="text-lg font-medium leading-8 text-slate-100">{summary}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Applicable Laws
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">
                  {result.applicable_laws.length}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Recommended Actions
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">
                  {nextSteps.length}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Applicable Laws</h2>
              <p className="mt-1 text-sm text-slate-300">
                Regulations and triggers identified from your current assessment.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {result.applicable_laws.map((law) => (
              <article
                key={`${law.law}-${law.next_step}`}
                className="rounded-2xl border border-slate-700/80 bg-slate-800 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.22)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{law.law}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{law.reason}</p>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ${getRiskBadgeClasses(
                      law.risk
                    )}`}
                  >
                    {law.risk}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Reason
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{law.reason}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Next Step
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{law.next_step}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold text-slate-100">Next Steps</h2>
          <p className="mt-1 text-sm text-slate-300">
            Prioritized actions for reducing AI compliance risk.
          </p>

          <div className="mt-6 space-y-3">
            {nextSteps.map((step, index) => (
              <div
                key={step}
                className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-800/70 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-400">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
