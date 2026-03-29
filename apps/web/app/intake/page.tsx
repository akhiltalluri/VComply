"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { IntakeSidebarProgress } from "@/components/intake/IntakeSidebarProgress";
import { IntakeStepHeader } from "@/components/intake/IntakeStepHeader";
import { OptionCard } from "@/components/intake/OptionCard";
import { ReviewPanel } from "@/components/intake/ReviewPanel";
import { StepNavigation } from "@/components/intake/StepNavigation";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatePanel } from "@/components/ui/StatePanel";
import { TextArea } from "@/components/ui/TextArea";
import { checkApplicability, getApiErrorMessage } from "@/lib/api";
import { useAuthState } from "@/lib/auth";
import {
  createAssessmentFromIntake,
  modelCategories,
  normalizeComplianceAssessment,
} from "@/lib/mock-data";
import {
  COMPLIANCE_INTAKE_DRAFT_KEY,
  startNewAssessmentWorkspace,
  storeAssessmentReport,
} from "@/lib/report-workspace";
import { parseStoredJson } from "@/lib/storage";
import type { IntakeDraft } from "@/lib/mock-data";

const steps = [
  {
    id: "company",
    title: "Company Profile",
    subtitle: "Business context and operating environment",
    description:
      "Establish the company context VComply will use to interpret federal legislative overlap, sector expectations, and likely compliance pressure.",
    guidance:
      "We use this information to frame the assessment around the right business environment before mapping current federal legislative records.",
  },
  {
    id: "usage",
    title: "AI Systems and Use Cases",
    subtitle: "Deployments, systems, and affected workflows",
    description:
      "Describe how AI is used in production so the assessment can distinguish general-purpose automation from consequential business workflows.",
    guidance:
      "This tells VComply which systems create the strongest overlap with current federal hiring, transparency, accountability, and governance records.",
  },
  {
    id: "risk",
    title: "Risk Context",
    subtitle: "Sensitive workflows, data sources, and review posture",
    description:
      "Add the details that help VComply compute risk, especially where workflows touch hiring, scoring, identity, or other high-sensitivity decisions.",
    guidance:
      "Risk is computed from your selected systems, use cases, and mapped federal legislative overlap rather than chosen manually.",
  },
  {
    id: "review",
    title: "Assessment Review",
    subtitle: "Confirm assessment inputs before analysis",
    description:
      "Confirm the submitted information before VComply generates the initial federal compliance assessment and recommended actions.",
    guidance:
      "Review the inputs below before VComply generates the current assessment, mapped federal records, and recommended actions.",
  },
];

function formatDataProvenance(value: string) {
  if (value === "first-party") {
    return "First-party enterprise datasets";
  }

  if (value === "licensed") {
    return "Licensed third-party corpora";
  }

  if (value === "public") {
    return "Public web and open datasets";
  }

  return value;
}

function parseStoredDataProvenance(value: string) {
  if (value === "First-party enterprise datasets") {
    return "first-party";
  }

  if (value === "Licensed third-party corpora") {
    return "licensed";
  }

  if (value === "Public web and open datasets") {
    return "public";
  }

  return value;
}

export default function IntakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, ready: authReady } = useAuthState();
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [draftReady, setDraftReady] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [aiUseCases, setAiUseCases] = useState(
    "candidate screening, recruiter support, and policy summarization"
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "hiring-hr-ai",
    "llm",
  ]);
  const [criticalUseCases, setCriticalUseCases] = useState(
    "AI-assisted ranking is used to help prioritize candidates before recruiter review, and summaries are generated for hiring managers."
  );
  const [dataProvenance, setDataProvenance] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const shouldStartFresh = searchParams.get("new") === "1";

  function resetDraftState() {
    setCurrentStep(1);
    setShowValidation(false);
    setIsSubmitting(false);
    setSubmissionError("");
    setCompanyName("");
    setIndustry("");
    setAiUseCases("candidate screening, recruiter support, and policy summarization");
    setSelectedCategories(["hiring-hr-ai", "llm"]);
    setCriticalUseCases(
      "AI-assisted ranking is used to help prioritize candidates before recruiter review, and summaries are generated for hiring managers."
    );
    setDataProvenance("");
    setAdditionalContext("");
  }

  const selectedCategoryTitles = useMemo(
    () =>
      modelCategories
        .filter((category) => selectedCategories.includes(category.id))
        .map((category) => category.title),
    [selectedCategories]
  );

  const intakeSnapshot = useMemo<IntakeDraft>(
    () => ({
      company_name: companyName,
      industry,
      ai_use_cases: aiUseCases,
      selected_categories: selectedCategories,
      critical_use_cases: criticalUseCases,
      data_provenance: formatDataProvenance(dataProvenance),
      additional_context: additionalContext,
    }),
    [
      additionalContext,
      aiUseCases,
      companyName,
      criticalUseCases,
      dataProvenance,
      industry,
      selectedCategories,
    ]
  );

  const previewAssessment = useMemo(
    () => createAssessmentFromIntake(intakeSnapshot),
    [intakeSnapshot]
  );

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!authenticated) {
      router.replace("/login");
    }
  }, [authReady, authenticated, router]);

  useEffect(() => {
    if (!authReady || !authenticated || !shouldStartFresh) {
      return;
    }

    startNewAssessmentWorkspace();
    resetDraftState();
    setDraftReady(true);
    router.replace("/intake");
  }, [authReady, authenticated, router, shouldStartFresh]);

  useEffect(() => {
    if (shouldStartFresh) {
      return;
    }

    try {
      const parsed = parseStoredJson<Partial<IntakeDraft>>(
        localStorage.getItem(COMPLIANCE_INTAKE_DRAFT_KEY)
      );

      if (!parsed) {
        setDraftReady(true);
        return;
      }

      setCompanyName(typeof parsed.company_name === "string" ? parsed.company_name : "");
      setIndustry(typeof parsed.industry === "string" ? parsed.industry : "");
      setAiUseCases(
        typeof parsed.ai_use_cases === "string" && parsed.ai_use_cases.trim()
          ? parsed.ai_use_cases
          : "candidate screening, recruiter support, and policy summarization"
      );
      setSelectedCategories(
        Array.isArray(parsed.selected_categories) && parsed.selected_categories.length > 0
          ? parsed.selected_categories.filter((item): item is string => typeof item === "string")
          : ["hiring-hr-ai", "llm"]
      );
      setCriticalUseCases(typeof parsed.critical_use_cases === "string" ? parsed.critical_use_cases : "");
      setDataProvenance(
        typeof parsed.data_provenance === "string"
          ? parseStoredDataProvenance(parsed.data_provenance)
          : ""
      );
      setAdditionalContext(typeof parsed.additional_context === "string" ? parsed.additional_context : "");
    } catch {
      localStorage.removeItem(COMPLIANCE_INTAKE_DRAFT_KEY);
    } finally {
      setDraftReady(true);
    }
  }, [shouldStartFresh]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    localStorage.setItem(COMPLIANCE_INTAKE_DRAFT_KEY, JSON.stringify(intakeSnapshot));
  }, [draftReady, intakeSnapshot]);

  const requiresCriticalUseCase = selectedCategories.some((category) =>
    [
      "hiring-hr-ai",
      "predictive-analytics",
      "compliance-monitoring-automation",
    ].includes(category)
  );
  const hasHiringAi =
    selectedCategories.includes("hiring-hr-ai") ||
    /(hiring|candidate|recruit|interview|employee|talent)/i.test(
      `${aiUseCases} ${criticalUseCases} ${additionalContext}`
    );

  function toggleCategory(id: string) {
    setSelectedCategories((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function getStepErrors(stepNumber: number) {
    if (stepNumber === 1) {
      return {
        companyName: companyName.trim() ? "" : "Enter the company name.",
        industry: industry.trim() ? "" : "Specify the primary industry context.",
      };
    }

    if (stepNumber === 2) {
      return {
        aiUseCases: aiUseCases.trim() ? "" : "Describe the AI use cases in scope.",
        categories:
          selectedCategories.length > 0 ? "" : "Select at least one system category in scope.",
      };
    }

    if (stepNumber === 3) {
      return {
        criticalUseCases:
          !requiresCriticalUseCase || criticalUseCases.trim()
            ? ""
            : "Add context for sensitive or high-impact workflows.",
        dataProvenance: dataProvenance ? "" : "Select the primary training or fine-tuning data source.",
      };
    }

    return {};
  }

  if (!authReady || !authenticated) {
    return (
      <PageContainer className="flex min-h-[60vh] items-center pb-20 pt-10">
        <StatePanel
          title="Loading compliance workspace"
          description="Confirming access before opening the assessment flow."
          tone="info"
          icon={
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          }
          className="mx-auto max-w-2xl"
        />
      </PageContainer>
    );
  }

  const stepErrors = getStepErrors(currentStep);
  const hasCurrentStepErrors = Object.values(stepErrors).some(Boolean);

  function goToPreviousStep() {
    setShowValidation(false);
    setSubmissionError("");

    if (currentStep === 1) {
      router.push("/");
      return;
    }

    setCurrentStep((step) => Math.max(1, step - 1));
  }

  function goToNextStep() {
    if (hasCurrentStepErrors) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);
    setSubmissionError("");
    setCurrentStep((step) => Math.min(steps.length, step + 1));
  }

  async function submitAssessment() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      localStorage.setItem(COMPLIANCE_INTAKE_DRAFT_KEY, JSON.stringify(intakeSnapshot));

      const response = await checkApplicability({
        ai_use_cases: aiUseCases,
        selected_categories: selectedCategories,
        critical_use_cases: criticalUseCases.trim() || undefined,
        states: ["federal-only"],
        uses_hiring_ai: hasHiringAi,
      });

      const normalizedAssessment = normalizeComplianceAssessment(response, intakeSnapshot);

      if (!normalizedAssessment) {
        throw new Error("Invalid assessment response");
      }

      storeAssessmentReport(normalizedAssessment, intakeSnapshot);
      localStorage.setItem(COMPLIANCE_INTAKE_DRAFT_KEY, JSON.stringify(intakeSnapshot));
      router.push("/dashboard");
    } catch (error) {
      setSubmissionError(
        getApiErrorMessage(error, "Unable to generate compliance assessment")
      );
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep !== steps.length) {
      goToNextStep();
      return;
    }

    await submitAssessment();
  }

  function loadDemoAssessment() {
    localStorage.setItem(COMPLIANCE_INTAKE_DRAFT_KEY, JSON.stringify(intakeSnapshot));
    storeAssessmentReport(previewAssessment, intakeSnapshot);
    router.push("/dashboard");
  }

  const currentStepConfig = steps[currentStep - 1];

  return (
    <PageContainer className="max-w-[1500px] py-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <IntakeSidebarProgress steps={steps} currentStep={currentStep} />
        </div>

        <section className="rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <IntakeStepHeader
              step={currentStep}
              title={currentStepConfig.title}
              description={currentStepConfig.description}
              guidance={currentStepConfig.guidance}
            />

            <form
              onSubmit={handleSubmit}
              className={`space-y-8 ${currentStep === 4 ? "mt-12" : "mt-10"}`}
            >
              {currentStep === 1 ? (
                <div className="space-y-6">
                  <Card tone="subtle" className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FormField
                          label="Company Name"
                          htmlFor="company-name"
                          helperText="Use the legal or operating name for the entity being assessed."
                          error={showValidation ? stepErrors.companyName : ""}
                        >
                          <Input
                            id="company-name"
                            value={companyName}
                            onChange={(event) => setCompanyName(event.target.value)}
                            placeholder="Acme Health Systems"
                          />
                        </FormField>
                      </div>

                      <FormField
                        label="Industry"
                        htmlFor="industry"
                        helperText="Industry context helps VComply infer sector-specific regulatory scrutiny."
                        error={showValidation ? stepErrors.industry : ""}
                      >
                        <Input
                          id="industry"
                          value={industry}
                          onChange={(event) => setIndustry(event.target.value)}
                          placeholder="Financial Services"
                        />
                      </FormField>
                    </div>
                  </Card>
                </div>
              ) : null}

              {currentStep === 2 ? (
                <div className="space-y-6">
                  <Card tone="subtle" className="space-y-6 p-6">
                    <FormField
                      label="AI Systems and Use Cases"
                      htmlFor="ai-use-cases"
                      helperText="Describe the business workflows where AI is currently used so the assessment can infer likely federal legislative overlap."
                      error={showValidation ? stepErrors.aiUseCases : ""}
                    >
                      <Input
                        id="ai-use-cases"
                        value={aiUseCases}
                        onChange={(event) => setAiUseCases(event.target.value)}
                        placeholder="candidate screening, support automation, workflow summarization"
                      />
                    </FormField>
                  </Card>

                  <Card tone="subtle" className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-200">System categories in scope</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Select the categories that best describe the systems covered by this assessment.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {modelCategories.map((category) => (
                          <OptionCard
                            key={category.id}
                            title={category.title}
                            description={category.description}
                            selected={selectedCategories.includes(category.id)}
                            onSelect={() => toggleCategory(category.id)}
                          />
                        ))}
                      </div>

                      {showValidation && stepErrors.categories ? (
                        <p className="text-sm text-red-300">{stepErrors.categories}</p>
                      ) : null}
                    </div>
                  </Card>
                </div>
              ) : null}

              {currentStep === 3 ? (
                <div className="space-y-6">
                  <Card tone="subtle" className="p-6">
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Computed risk preview</p>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                          VComply computes risk from your selected AI categories, described use
                          cases, and the current overlap with federal legislative records. This is
                          a preview of the risk posture that will carry into the dashboard.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {previewAssessment.applicable_laws.map((law) => (
                            <span
                              key={law.law}
                              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300"
                            >
                              {law.law}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Card
                        tone={
                          previewAssessment.severity === "HIGH"
                            ? "secondary"
                            : previewAssessment.severity === "MEDIUM"
                              ? "subtle"
                              : "primary"
                        }
                        className="border-slate-800/80 bg-slate-950/60 p-5"
                      >
                        <p className="text-sm font-medium text-slate-300">Current computed risk</p>
                        <p className="mt-3 text-3xl font-semibold text-slate-100">
                          {previewAssessment.severity}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {previewAssessment.risk_score}/100 score
                        </p>
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                          {previewAssessment.summary.narrative}
                        </p>
                      </Card>
                    </div>
                  </Card>

                  <Card tone="secondary" className="border-amber-500/20 bg-amber-500/[0.07] p-6">
                    <FormField
                      label="Critical Use Cases"
                      htmlFor="critical-use-cases"
                      helperText="Document any sensitive workflows that could affect employment, scoring, identity, or other high-impact decisions."
                      error={showValidation ? stepErrors.criticalUseCases : ""}
                    >
                      <TextArea
                        id="critical-use-cases"
                        value={criticalUseCases}
                        onChange={(event) => setCriticalUseCases(event.target.value)}
                        placeholder="Describe any sensitive workflows, such as candidate screening, underwriting support, identity checks, or high-impact prioritization."
                      />
                    </FormField>
                  </Card>

                  <Card tone="subtle" className="space-y-6 p-6">
                    <FormField
                      label="Data Provenance"
                      htmlFor="data-provenance"
                      helperText="Identify the primary source of training or fine-tuning data used by the systems in scope."
                      error={showValidation ? stepErrors.dataProvenance : ""}
                    >
                      <Select
                          id="data-provenance"
                          value={dataProvenance}
                          onChange={(event) => setDataProvenance(event.target.value)}
                        >
                          <option value="" className="bg-slate-950 text-slate-400">
                            Select data source origin...
                          </option>
                          <option value="first-party" className="bg-slate-950">
                            First-party enterprise datasets
                          </option>
                          <option value="licensed" className="bg-slate-950">
                            Licensed third-party corpora
                          </option>
                          <option value="public" className="bg-slate-950">
                            Public web and open datasets
                          </option>
                      </Select>
                    </FormField>

                    <FormField
                      label="Additional Context"
                      htmlFor="additional-context"
                      helperText="Optional notes about vendors, deployment scope, human review, or governance controls that may affect the assessment."
                    >
                      <TextArea
                        id="additional-context"
                        value={additionalContext}
                        onChange={(event) => setAdditionalContext(event.target.value)}
                        placeholder="Add any supporting context for reviewers, such as vendor involvement, human review controls, or upcoming deployment changes."
                      />
                    </FormField>
                  </Card>
                </div>
              ) : null}

              {currentStep === 4 ? (
                <div className="space-y-7 pt-6">
                  <Card tone="subtle" className="max-w-3xl border-slate-800/80 bg-slate-950/60 p-5">
                    <p className="text-sm font-medium text-slate-200">Review before generation</p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      This summary is a final check before VComply promotes the assessment into the
                      dashboard as the active report. Previous reports stay available in Assessment
                      History.
                    </p>
                  </Card>

                  <ReviewPanel
                    companyName={companyName}
                    industry={industry}
                    aiUseCases={aiUseCases}
                    selectedCategoryTitles={selectedCategoryTitles}
                    criticalUseCases={criticalUseCases}
                    dataProvenance={formatDataProvenance(dataProvenance)}
                    additionalContext={additionalContext}
                    previewAssessment={previewAssessment}
                  />
                </div>
              ) : null}

              {submissionError ? (
                <Card tone="secondary" className="border-red-500/20 bg-red-500/[0.07] p-5">
                  <p className="text-sm font-medium text-red-200">{submissionError}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Your assessment inputs are still saved locally. You can retry generation or open
                    a demo-safe preview based on the current intake.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmissionError("");
                        void submitAssessment();
                      }}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={loadDemoAssessment}
                      className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/15"
                    >
                      Open Demo Assessment
                    </button>
                  </div>
                </Card>
              ) : null}

              <StepNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                isSubmitting={isSubmitting}
                onPrevious={goToPreviousStep}
                onNext={goToNextStep}
              />
            </form>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
