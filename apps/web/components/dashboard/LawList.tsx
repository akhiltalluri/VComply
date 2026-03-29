"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { ComplianceAssessment, RiskLevel } from "@/lib/mock-data";

type LawItem = ComplianceAssessment["applicable_laws"][number];

type LawListProps = {
  laws: LawItem[];
};

function inferJurisdiction() {
  return "United States";
}

function normalizeRiskLevel(risk: string): RiskLevel {
  if (risk === "HIGH" || risk === "MEDIUM" || risk === "LOW") {
    return risk;
  }

  return "MEDIUM";
}

export function LawList({ laws }: LawListProps) {
  const [expandedLawId, setExpandedLawId] = useState<string | null>(laws[0]?.id ?? null);

  useEffect(() => {
    setExpandedLawId(laws[0]?.id ?? laws[0]?.law ?? null);
  }, [laws]);

  return (
    <Card tone="subtle" className="p-0">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-xl font-semibold text-slate-100">Impacted Regulations</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Regulations and frameworks currently affecting the assessed deployment profile.
        </p>
      </div>

      <div className="divide-y divide-slate-800">
        {laws.length === 0 ? (
          <div className="px-6 py-8">
            <InsetPanel>
              <p className="text-sm font-semibold text-slate-100">No impacted regulations returned</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                VComply did not receive any law matches for the current assessment. Review the intake
                inputs or rerun the assessment once the backend provides a fuller result.
              </p>
            </InsetPanel>
          </div>
        ) : null}
        {laws.map((law) => {
          const isExpanded = expandedLawId === (law.id ?? law.law);

          return (
            <div
              key={`${law.law}-${law.next_step}`}
              className="px-6 py-5 transition hover:bg-white/[0.02]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-100">{law.law}</h3>
                    <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-medium tracking-[0.08em] text-slate-400">
                      {law.jurisdiction ?? inferJurisdiction()}
                    </span>
                    <span className="rounded-lg border border-slate-800 bg-white/[0.03] px-3 py-1 text-xs font-medium tracking-[0.08em] text-slate-400">
                      {law.category ?? (law.law.includes("AI") ? "AI Governance" : "Regulatory Trigger")}
                    </span>
                    <span className="rounded-lg border border-slate-800 bg-white/[0.03] px-3 py-1 text-xs font-medium tracking-[0.08em] text-slate-400">
                      {law.status ?? (law.risk === "HIGH" ? "ACTIVE" : "MONITORING")}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{law.reason}</p>
                </div>

                <RiskBadge risk={normalizeRiskLevel(law.risk)} />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-slate-500">Required action</span>
                <span className="rounded-lg border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-blue-300">
                  {law.next_step}
                </span>
                {law.source_label ? (
                  <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400">
                    {law.source_label}
                  </span>
                ) : null}
                {law.affected_workflows?.[0] ? (
                  <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400">
                    {law.affected_workflows[0]}
                  </span>
                ) : null}
                {law.why_it_applies ? (
                  <button
                    type="button"
                    onClick={() => setExpandedLawId(isExpanded ? null : law.id ?? law.law)}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
                  >
                    {isExpanded ? "Hide Applicability Logic" : "Why This Applies"}
                  </button>
                ) : null}
              </div>

              {isExpanded && law.why_it_applies ? (
                <div className="mt-4 rounded-2xl border border-sky-500/15 bg-sky-500/[0.06] px-4 py-4">
                  <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                    Why this applies to your company
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{law.why_it_applies}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
