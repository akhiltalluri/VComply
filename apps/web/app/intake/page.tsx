"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const mockResult = {
  risk_score: 75,
  applicable_laws: [
    {
      law: "NYC Local Law 144",
      risk: "HIGH",
      reason: "AI used in hiring in NY",
      next_step: "Conduct bias audit",
    },
  ],
};

export default function IntakePage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [statesOfOperation, setStatesOfOperation] = useState("NY, CA");
  const [industry, setIndustry] = useState("");
  const [aiUseCases, setAiUseCases] = useState("hiring, chatbots, profiling");
  const [usesAiInHiring, setUsesAiInHiring] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClassName =
    "w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formSnapshot = {
      company_name: companyName,
      states_of_operation: statesOfOperation,
      industry,
      ai_use_cases: aiUseCases,
      uses_ai_in_hiring: usesAiInHiring,
    };

    localStorage.setItem("complianceIntakeDraft", JSON.stringify(formSnapshot));
    localStorage.setItem("complianceResult", JSON.stringify(mockResult));

    await new Promise((resolve) => setTimeout(resolve, 700));
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2 sm:py-4">
      <div className="space-y-3 text-center sm:text-left">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
            Assess Your AI Compliance Risk
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Provide details about your company and AI usage to identify applicable
            regulations and next steps.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="companyName"
              className="text-sm font-medium text-slate-200"
            >
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              disabled={isSubmitting}
              placeholder="Acme Health Systems"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="statesOfOperation"
              className="text-sm font-medium text-slate-200"
            >
              States of Operation
            </label>
            <input
              id="statesOfOperation"
              type="text"
              value={statesOfOperation}
              onChange={(event) => setStatesOfOperation(event.target.value)}
              disabled={isSubmitting}
              placeholder="NY, CA"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="industry" className="text-sm font-medium text-slate-200">
              Industry
            </label>
            <input
              id="industry"
              type="text"
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              disabled={isSubmitting}
              placeholder="Financial Services"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="aiUseCases" className="text-sm font-medium text-slate-200">
              AI Use Cases
            </label>
            <input
              id="aiUseCases"
              type="text"
              value={aiUseCases}
              onChange={(event) => setAiUseCases(event.target.value)}
              disabled={isSubmitting}
              placeholder="hiring, chatbots, profiling"
              className={inputClassName}
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-800/70 px-4 py-4 text-sm text-slate-300 shadow-sm transition hover:border-slate-700">
          <input
            type="checkbox"
            checked={usesAiInHiring}
            onChange={(event) => setUsesAiInHiring(event.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
          />
          <span className="space-y-1">
            <span className="block font-medium text-slate-100">Uses AI in hiring?</span>
            <span className="block text-slate-400">
              Enable this if your company uses AI for screening, recruiting, or employment
              decisions.
            </span>
          </span>
        </label>

        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="max-w-xl text-sm leading-6 text-slate-400">
                This will generate a compliance assessment to help your team understand likely
                AI regulatory exposure and recommended next steps.
              </p>
              {isSubmitting ? (
                <p className="text-sm font-medium text-blue-400">
                  Analyzing your company profile and preparing the assessment...
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(37,99,235,0.18)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600/70 disabled:text-slate-200"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Analyzing...</span>
                </>
              ) : (
                "Generate Assessment"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
