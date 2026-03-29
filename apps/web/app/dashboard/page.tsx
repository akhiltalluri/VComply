"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActionList } from "@/components/dashboard/ActionList";
import { DashboardSummaryStats } from "@/components/dashboard/DashboardSummaryStats";
import { LawList } from "@/components/dashboard/LawList";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatePanel } from "@/components/ui/StatePanel";
import type { ComplianceAssessment, IntakeDraft, RiskLevel } from "@/lib/mock-data";
import {
  createAssessmentFromIntake,
  dashboardQuickLinks,
  defaultAssessment,
  generateComplianceSummaryText,
  normalizeComplianceAssessment,
  sortComplianceActions,
} from "@/lib/mock-data";

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

function summaryTone(risk: RiskLevel): { label: string; tone: RiskLevel } {
  if (risk === "HIGH") {
    return { label: "High", tone: "HIGH" };
  }

  if (risk === "MEDIUM") {
    return { label: "Medium", tone: "MEDIUM" };
  }

  return { label: "Low", tone: "LOW" };
}

type DashboardState = "loading" | "ready" | "empty" | "error";

export default function DashboardPage() {
  const [assessment, setAssessment] = useState<ComplianceAssessment>(defaultAssessment);
  const [state, setState] = useState<DashboardState>("loading");
  const [showGeneratedSummary, setShowGeneratedSummary] = useState(false);
  const [assessmentNotice, setAssessmentNotice] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("complianceResult");
    const storedDraft = localStorage.getItem("complianceIntakeDraft");
    let intakeDraft: IntakeDraft | null = null;

    try {
      intakeDraft = storedDraft ? (JSON.parse(storedDraft) as IntakeDraft) : null;
    } catch {
      intakeDraft = null;
    }

    try {
      if (!stored) {
        if (intakeDraft) {
          setAssessment(createAssessmentFromIntake(intakeDraft));
          setAssessmentNotice(
            "No completed backend assessment was found. Showing a locally generated preview based on the most recent intake inputs."
          );
          setState("ready");
          return;
        }

        setState("empty");
        return;
      }

      const normalized = normalizeComplianceAssessment(JSON.parse(stored), intakeDraft);
      if (!normalized) {
        if (intakeDraft) {
          setAssessment(createAssessmentFromIntake(intakeDraft));
          setAssessmentNotice(
            "Saved assessment data was incomplete. Showing a locally generated preview until a fresh backend assessment is available."
          );
          setState("ready");
          return;
        }

        setState("error");
        return;
      }

      setAssessment(normalized);
      setAssessmentNotice(
        normalized.applicable_laws.length === 0
          ? "The backend response did not include impacted regulations. Showing the available assessment summary with placeholder guidance."
          : ""
      );
      setState("ready");
    } catch {
      if (intakeDraft) {
        setAssessment(createAssessmentFromIntake(intakeDraft));
        setAssessmentNotice(
          "Saved assessment data could not be read. Showing a locally generated preview based on the most recent intake inputs."
        );
        setState("ready");
        return;
      }

      setState("error");
    }
  }, []);

  function loadSampleAssessment() {
    localStorage.setItem("complianceResult", JSON.stringify(defaultAssessment));
    setAssessment(defaultAssessment);
    setAssessmentNotice("");
    setState("ready");
  }

  const highRiskCount = useMemo(
    () => assessment.summary.high_risk_issues,
    [assessment.summary.high_risk_issues]
  );

  const mediumRiskCount = useMemo(
    () => assessment.summary.medium_risk_issues,
    [assessment.summary.medium_risk_issues]
  );

  const pendingActions = useMemo(
    () => sortComplianceActions(assessment.required_actions).slice(0, 6),
    [assessment.required_actions]
  );
  const topAction = pendingActions[0];
  const highestRiskLaw =
    assessment.applicable_laws.find((law) => law.risk === "HIGH") ?? assessment.applicable_laws[0];

  const riskSummary = useMemo(() => summaryTone(assessment.severity), [assessment.severity]);
  const complianceSummary = useMemo(
    () => generateComplianceSummaryText(assessment),
    [assessment]
  );

  if (state === "loading") {
    return (
      <PageContainer className="flex min-h-[60vh] items-center pb-20 pt-10">
        <StatePanel
          title="Loading compliance profile"
          description="Preparing the current regulatory assessment and associated remediation work."
          tone="info"
          icon={
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          }
        />
      </PageContainer>
    );
  }

  if (state === "empty") {
    return (
      <PageContainer className="flex min-h-[60vh] items-center pb-20 pt-10">
        <StatePanel
          title="No compliance assessment available"
          description="Start a new assessment to generate a regulatory risk profile, or load the sample workspace to preview Mission Control."
          tone="warning"
          icon={
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
              <path d="M12 8v4m0 4h.01M12 3l9 16H3L12 3Z" />
            </svg>
          }
          actions={
            <>
              <Button href="/intake" variant="primary">
                Start Assessment
              </Button>
              <Button variant="secondary" onClick={loadSampleAssessment}>
                Load Sample Workspace
              </Button>
            </>
          }
        />
      </PageContainer>
    );
  }

  if (state === "error") {
    return (
      <PageContainer className="flex min-h-[60vh] items-center pb-20 pt-10">
        <StatePanel
          title="Unable to load regulatory assessment"
          description="The saved assessment data could not be read. Restore the sample workspace or return to intake to generate a fresh assessment."
          tone="error"
          icon={
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5m0 3h.01" />
            </svg>
          }
          actions={
            <>
              <Button variant="secondary" onClick={loadSampleAssessment}>
                Restore Sample Workspace
              </Button>
              <Button href="/intake" variant="primary">
                Return to Intake
              </Button>
            </>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-10 pb-20 pt-10">
      <SectionHeader
        title="Mission Control"
        subtitle="Based on your submitted deployment profile, here is the current regulatory exposure, the regulations driving that risk, and the remediation work that should happen next."
        className="max-w-5xl"
      />

      <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div>
          <RiskScoreCard score={assessment.risk_score} />
        </div>

        <div className="space-y-6">
          {assessmentNotice ? (
            <InsetPanel tone="amber" className="px-4 py-4">
              <p className="text-sm font-medium text-amber-200">{assessmentNotice}</p>
            </InsetPanel>
          ) : null}

          <DashboardSummaryStats
            regulations={assessment.summary.impacted_regulation_count}
            highRiskIssues={assessment.summary.high_risk_issues}
            requiredActions={assessment.summary.required_action_count}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <InsetPanel tone={highestRiskLaw?.risk === "HIGH" ? "red" : "blue"} className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Highest-Risk Regulation
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-100">
                {highestRiskLaw?.law ?? "No high-risk regulation identified"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {highestRiskLaw?.reason ??
                  "Run or refresh the assessment to identify the regulation creating the highest current pressure."}
              </p>
            </InsetPanel>

            <InsetPanel tone={topAction?.priority === "HIGH" ? "amber" : "blue"} className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Most Urgent Next Step
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-100">
                {topAction?.title ?? "No immediate action specified"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {topAction?.description ??
                  "Once assessment data is available, VComply will surface the highest-priority compliance action here."}
              </p>
            </InsetPanel>
          </div>

          <Card tone="subtle" className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Assessment Status
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-100">
                  {assessment.summary.headline}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {assessment.summary.narrative}
                </p>
              </div>

              <InsetPanel
                tone={
                  riskSummary.tone === "HIGH"
                    ? "red"
                    : riskSummary.tone === "MEDIUM"
                      ? "amber"
                      : "green"
                }
                className="min-w-[240px]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Regulatory Interpretation
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-100">
                  {riskSummary.label} regulatory risk
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {highRiskCount > 0
                    ? `${highRiskCount} high-risk issues and ${pendingActions.length} required actions are currently driving the review cycle.`
                    : "No critical blockers are surfaced, but active monitoring remains necessary."}
                </p>
              </InsetPanel>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100">Compliance Summary</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Generate an executive-ready summary of the current regulatory posture.
                </p>
              </div>
              <Button
                variant={showGeneratedSummary ? "secondary" : "primary"}
                size="md"
                onClick={() => setShowGeneratedSummary((value) => !value)}
                className="sm:min-w-[220px]"
              >
                {showGeneratedSummary ? "Hide Compliance Summary" : "Generate Compliance Summary"}
              </Button>
            </div>

            {showGeneratedSummary ? (
              <InsetPanel tone="blue" className="mt-4 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Executive Readout
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-100">{complianceSummary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(assessment.operational_summary.jurisdictions.length > 0
                    ? assessment.operational_summary.jurisdictions
                    : ["Jurisdiction unavailable"]
                  ).map((item) => (
                    <Badge key={item} tone="neutral" className="normal-case tracking-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </InsetPanel>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {assessment.status_indicators.map((indicator) => (
                <InsetPanel
                  key={indicator.label}
                  tone={
                    indicator.tone === "high"
                      ? "red"
                      : indicator.tone === "medium"
                        ? "amber"
                        : indicator.tone === "low"
                          ? "green"
                          : indicator.tone === "blue"
                            ? "blue"
                            : "default"
                  }
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {indicator.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{indicator.value}</p>
                </InsetPanel>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_340px]">
        <div className="space-y-6">
          <ActionList actions={pendingActions} />
          <LawList laws={assessment.applicable_laws} />
        </div>

        <div className="space-y-6">
          <StatCard
            title="Operational Summary"
            subtitle="Structured context for how the current assessment should be interpreted."
          >
            <div className="space-y-5 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Impacted regulations</span>
                <span className="text-lg font-semibold text-slate-100">
                  {assessment.summary.impacted_regulation_count}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>High-risk triggers</span>
                <span className="text-lg font-semibold text-red-300">{highRiskCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Medium-risk triggers</span>
                <span className="text-lg font-semibold text-amber-300">{mediumRiskCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Review cadence</span>
                <span className="text-sm font-semibold text-slate-100">
                  {assessment.operational_summary.review_cadence}
                </span>
              </div>

              <InsetPanel>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Deployment Profile
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {assessment.operational_summary.deployment_profile}
                </p>
              </InsetPanel>

              <div className="grid gap-3">
                <InsetPanel>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Impacted Business Areas
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(assessment.operational_summary.business_areas.length > 0
                      ? assessment.operational_summary.business_areas
                      : ["Pending classification"]
                    ).map((area) => (
                      <span
                        key={area}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </InsetPanel>

                <InsetPanel>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    In-Scope Systems
                  </p>
                  <div className="mt-3 space-y-2">
                    {(assessment.operational_summary.deployed_systems.length > 0
                      ? assessment.operational_summary.deployed_systems
                      : ["Deployment details unavailable"]
                    ).map((system) => (
                      <div key={system} className="text-sm text-slate-300">
                        {system}
                      </div>
                    ))}
                  </div>
                </InsetPanel>
              </div>
            </div>
          </StatCard>

          <Card tone="subtle" className="p-0">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-100">Related Workspaces</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Move directly into adjacent workflows for evidence review, intake, and regulatory research.
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
                    <span className="block text-sm font-semibold text-slate-100">{link.title}</span>
                    <span className="mt-1 block text-sm text-slate-400">{link.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card tone="subtle" className="p-0">
            <div className="border-b border-slate-800 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-100">Recent Activity</h2>
                <Badge tone="blue" className="normal-case tracking-normal">
                  {assessment.source_label}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Recent program activity associated with the current regulatory assessment.
              </p>
            </div>

            <div className="space-y-3 p-4">
              {assessment.recent_activity.map((item) => (
                <InsetPanel key={item.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                    </div>
                    <Badge
                      tone={
                        item.status === "Completed"
                          ? "low"
                          : item.status === "Flagged"
                            ? "high"
                            : item.status === "Scheduled"
                              ? "medium"
                              : "blue"
                      }
                      className="normal-case tracking-normal"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    {item.date}
                  </p>
                </InsetPanel>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
