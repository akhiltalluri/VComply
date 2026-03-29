"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActionList } from "@/components/dashboard/ActionList";
import { LawList } from "@/components/dashboard/LawList";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ComplianceAssessment, DashboardAction, RiskLevel } from "@/lib/mock-data";
import { dashboardPendingActions, dashboardQuickLinks, defaultAssessment } from "@/lib/mock-data";

function QuickLinkIcon({ kind }: { kind: string }) {
  if (kind === "search") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-slate-300 stroke-[1.8]">
        <circle cx="11" cy="11" r="6" fill="none" />
        <path d="m16 16 4 4M8.2 11.1l1.8 1.8 3.4-3.6" fill="none" />
      </svg>
    );
  }

  if (kind === "gear") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-slate-300 stroke-[1.8]">
        <path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm7 3.5 2 1-2 1-.4 1.2 1.2 1.9-1.9 1.9-1.9-1.2-1.2.4-1 2h-2l-1-2-1.2-.4-1.9 1.2-1.9-1.9 1.2-1.9L5 14l-2-1 2-1 .4-1.2-1.2-1.9 1.9-1.9 1.9 1.2L9.2 7l1-2h2l1 2 1.2.4 1.9-1.2 1.9 1.9-1.2 1.9Z" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-slate-300 stroke-[1.8]">
      <path d="M7 4h8l4 4v12H7z" fill="none" />
      <path d="M15 4v4h4M10 12h6M10 16h6" fill="none" />
    </svg>
  );
}

function priorityWeight(priority: DashboardAction["priority"]) {
  if (priority === "HIGH") {
    return 3;
  }

  if (priority === "MEDIUM") {
    return 2;
  }

  if (priority === "LOW") {
    return 1;
  }

  return 0;
}

function summaryTone(score: number): { label: string; tone: RiskLevel } {
  if (score >= 70) {
    return { label: "High", tone: "HIGH" };
  }

  if (score >= 30) {
    return { label: "Medium", tone: "MEDIUM" };
  }

  return { label: "Low", tone: "LOW" };
}

export default function DashboardPage() {
  const [assessment, setAssessment] = useState<ComplianceAssessment>(defaultAssessment);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("complianceResult");

      if (!stored) {
        setAssessment(defaultAssessment);
        return;
      }

      const parsed = JSON.parse(stored) as Partial<ComplianceAssessment>;

      if (typeof parsed.risk_score === "number" && Array.isArray(parsed.applicable_laws)) {
        setAssessment({
          risk_score: parsed.risk_score,
          applicable_laws: parsed.applicable_laws
            .filter(
              (law) =>
                typeof law?.law === "string" &&
                typeof law?.risk === "string" &&
                typeof law?.reason === "string" &&
                typeof law?.next_step === "string"
            )
            .slice(0, 5) as ComplianceAssessment["applicable_laws"],
        });
      }
    } catch {
      setAssessment(defaultAssessment);
    }
  }, []);

  const highRiskCount = useMemo(
    () => assessment.applicable_laws.filter((law) => law.risk === "HIGH").length,
    [assessment]
  );

  const mediumRiskCount = useMemo(
    () => assessment.applicable_laws.filter((law) => law.risk === "MEDIUM").length,
    [assessment]
  );

  const pendingActions = useMemo(() => {
    const lawDrivenActions: DashboardAction[] = assessment.applicable_laws.map((law, index) => ({
      id: `law-action-${index}`,
      title: law.next_step,
      system: law.reason,
      source: law.law,
      priority: law.risk,
    }));

    const combined = [...lawDrivenActions, ...dashboardPendingActions];
    const seen = new Set<string>();

    return combined
      .filter((action) => {
        const key = `${action.title}-${action.source}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
      .slice(0, 6);
  }, [assessment]);

  const riskSummary = useMemo(() => summaryTone(assessment.risk_score), [assessment.risk_score]);

  return (
    <PageContainer className="space-y-10 pb-20 pt-10">
      <SectionHeader
        title="Mission Control"
        subtitle="Centralized visibility into AI compliance exposure, triggered laws, and the next actions your team should take."
        className="max-w-4xl"
      />

      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <RiskScoreCard score={assessment.risk_score} />

          <StatCard
            title="Deployment Summary"
            subtitle="A quick read on your current company-wide AI compliance footprint."
          >
            <div className="space-y-5 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Applicable regulations</span>
                <span className="text-lg font-semibold text-slate-100">
                  {assessment.applicable_laws.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>High-risk gaps</span>
                <span className="text-lg font-semibold text-red-300">{highRiskCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Medium-risk gaps</span>
                <span className="text-lg font-semibold text-amber-300">{mediumRiskCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Open actions</span>
                <span className="text-lg font-semibold text-slate-100">{pendingActions.length}</span>
              </div>
            </div>
          </StatCard>
        </div>

        <div className="space-y-6">
          <ActionList actions={pendingActions} />
          <LawList laws={assessment.applicable_laws} />
        </div>

        <div className="space-y-6">
          <StatCard
            title="Compliance Summary"
            subtitle="Short, stakeholder-friendly overview of the current posture."
          >
            <div className="space-y-4 border-t border-slate-800 pt-5">
              <p className="text-base leading-7 text-slate-300">
                You are subject to{" "}
                <span className="font-semibold text-slate-100">
                  {assessment.applicable_laws.length} regulations
                </span>{" "}
                with a{" "}
                <span
                  className={`font-semibold ${
                    riskSummary.tone === "HIGH"
                      ? "text-red-300"
                      : riskSummary.tone === "MEDIUM"
                        ? "text-amber-300"
                        : "text-emerald-300"
                  }`}
                >
                  {riskSummary.label.toLowerCase()}
                </span>{" "}
                overall risk profile.
              </p>
              <InsetPanel>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Most urgent gap
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {pendingActions[0]?.title ?? "No urgent actions currently surfaced."}
                </p>
              </InsetPanel>
            </div>
          </StatCard>

          <Card tone="subtle" className="p-0">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-100">Quick Links</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Jump directly into adjacent compliance workflows.
              </p>
            </div>

            <div className="space-y-3 p-4">
              {dashboardQuickLinks.map((link) => (
                <Link
                  key={link.id}
                  href={
                    link.id === "laws" ? "/laws" : link.id === "inventory" ? "/intake" : "/dashboard"
                  }
                  className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 transition hover:border-slate-700 hover:bg-white/[0.03]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
                    <QuickLinkIcon kind={link.icon} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-100">
                      {link.title}
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">{link.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card tone="subtle" className="border-emerald-500/20 bg-emerald-500/[0.07] p-6">
            <Badge tone="low" className="normal-case tracking-normal">
              Operational Status
            </Badge>
            <p className="mt-4 text-lg font-semibold text-slate-100">Bias audit completed</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The HR screening model passed its most recent audit window. Next review is due in 340
              days.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
