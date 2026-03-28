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
    <div className="flex justify-center py-4 sm:py-8">
      <div className="w-full max-w-3xl rounded-3xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
              Intake
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Assess Your AI Compliance Risk
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
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
                  className="text-sm font-medium text-neutral-800"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Acme Health Systems"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="statesOfOperation"
                  className="text-sm font-medium text-neutral-800"
                >
                  States of Operation
                </label>
                <input
                  id="statesOfOperation"
                  type="text"
                  value={statesOfOperation}
                  onChange={(event) => setStatesOfOperation(event.target.value)}
                  placeholder="NY, CA"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="industry" className="text-sm font-medium text-neutral-800">
                  Industry
                </label>
                <input
                  id="industry"
                  type="text"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  placeholder="Financial Services"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="aiUseCases" className="text-sm font-medium text-neutral-800">
                  AI Use Cases
                </label>
                <input
                  id="aiUseCases"
                  type="text"
                  value={aiUseCases}
                  onChange={(event) => setAiUseCases(event.target.value)}
                  placeholder="hiring, chatbots, profiling"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm text-neutral-700 shadow-sm">
              <input
                type="checkbox"
                checked={usesAiInHiring}
                onChange={(event) => setUsesAiInHiring(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-300"
              />
              <span className="space-y-1">
                <span className="block font-medium text-neutral-900">Uses AI in hiring?</span>
                <span className="block text-neutral-500">
                  Enable this if your company uses AI for screening, recruiting, or employment
                  decisions.
                </span>
              </span>
            </label>

            <div className="flex flex-col items-start gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-6 text-neutral-500">
                This will generate a compliance assessment to help your team understand likely AI
                regulatory exposure and recommended next steps.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-w-[190px] items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Generating assessment..." : "Generate Assessment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
