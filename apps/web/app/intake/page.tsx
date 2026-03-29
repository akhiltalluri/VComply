"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { IntakeSidebarProgress } from "@/components/intake/IntakeSidebarProgress";
import { IntakeStepHeader } from "@/components/intake/IntakeStepHeader";
import { OptionCard } from "@/components/intake/OptionCard";
import { ReviewPanel } from "@/components/intake/ReviewPanel";
import { StepNavigation } from "@/components/intake/StepNavigation";
import { Card } from "@/components/ui/Card";
import { CheckboxField } from "@/components/ui/CheckboxField";
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
import { parseStoredJson } from "@/lib/storage";
import type { IntakeDraft } from "@/lib/mock-data";

const steps = [
  {
    id: "company",
    title: "Company Profile",
    subtitle: "Business footprint and operating context",
    description:
      "Establish the operating footprint VComply will use to assess jurisdictional exposure, sector expectations, and likely regulatory scope.",
    guidance:
      "We use this information to determine which jurisdictions, sector expectations, and baseline regulatory obligations may apply.",
  },
  {
    id: "usage",
    title: "AI Systems and Use Cases",
    subtitle: "Deployments, systems, and affected workflows",
    description:
      "Describe how AI is used in production so the assessment can distinguish routine automation from consequential decision systems.",
    guidance:
      "This tells VComply which systems may trigger hiring, profiling, transparency, or governance obligations.",
  },
  {
    id: "risk",
    title: "Risk Context",
    subtitle: "Sensitive workflows, data sources, and control context",
    description:
      "Add the details that usually determine whether a deployment falls into heightened regulatory review, including sensitive workflows and data sourcing.",
    guidance:
      "These details help distinguish routine automation from higher-risk deployments that require deeper compliance controls.",
  },
  {
    id: "review",
    title: "Assessment Review",
    subtitle: "Confirm assessment inputs before analysis",
    description:
      "Confirm the submitted information before VComply generates the initial regulatory assessment and recommended actions.",
    guidance:
      "Review the inputs below before VComply generates the initial assessment, impacted regulations, and required actions.",
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
  const { authenticated, ready: authReady } = useAuthState();
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [draftReady, setDraftReady] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [statesOfOperation, setStatesOfOperation] = useState("NY, CA");
  const [aiUseCases, setAiUseCases] = useState("hiring, candidate screening");
  const [usesAiInHiring, setUsesAiInHiring] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["llm", "predictive"]);
  const [criticalUseCases, setCriticalUseCases] = useState(
    "AI-assisted ranking is used to help screen and prioritize initial hiring candidates."
  );
  const [dataProvenance, setDataProvenance] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

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
      states_of_operation: statesOfOperation,
      ai_use_cases: aiUseCases,
      uses_ai_in_hiring: usesAiInHiring,
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
      statesOfOperation,
      usesAiInHiring,
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
    try {
      const parsed = parseStoredJson<Partial<IntakeDraft>>(
        localStorage.getItem("complianceIntakeDraft")
      );

      if (!parsed) {
        setDraftReady(true);
        return;
      }

      setCompanyName(typeof parsed.company_name === "string" ? parsed.company_name : "");
      setIndustry(typeof parsed.industry === "string" ? parsed.industry : "");
      setStatesOfOperation(
        typeof parsed.states_of_operation === "string" && parsed.states_of_operation.trim()
          ? parsed.states_of_operation
          : "NY, CA"
      );
      setAiUseCases(
        typeof parsed.ai_use_cases === "string" && parsed.ai_use_cases.trim()
          ? parsed.ai_use_cases
          : "hiring, candidate screening"
      );
      setUsesAiInHiring(
        typeof parsed.uses_ai_in_hiring === "boolean" ? parsed.uses_ai_in_hiring : true
      );
      setSelectedCategories(
        Array.isArray(parsed.selected_categories) && parsed.selected_categories.length > 0
          ? parsed.selected_categories.filter((item): item is string => typeof item === "string")
          : ["llm", "predictive"]
      );
      setCriticalUseCases(typeof parsed.critical_use_cases === "string" ? parsed.critical_use_cases : "");
      setDataProvenance(
        typeof parsed.data_provenance === "string"
          ? parseStoredDataProvenance(parsed.data_provenance)
          : ""
      );
      setAdditionalContext(typeof parsed.additional_context === "string" ? parsed.additional_context : "");
    } catch {
      localStorage.removeItem("complianceIntakeDraft");
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    localStorage.setItem("complianceIntakeDraft", JSON.stringify(intakeSnapshot));
  }, [draftReady, intakeSnapshot]);

  const requiresCriticalUseCase = usesAiInHiring || selectedCategories.includes("predictive");

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
        statesOfOperation: statesOfOperation.trim()
          ? ""
          : "List at least one operating jurisdiction.",
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
      localStorage.setItem("complianceIntakeDraft", JSON.stringify(intakeSnapshot));

      const response = await checkApplicability({
        states: statesOfOperation
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        uses_hiring_ai: usesAiInHiring,
      });

      const normalizedAssessment = normalizeComplianceAssessment(response, intakeSnapshot);

      if (!normalizedAssessment) {
        throw new Error("Invalid assessment response");
      }

      localStorage.setItem("complianceResult", JSON.stringify(normalizedAssessment));
      localStorage.setItem("complianceIntakeDraft", JSON.stringify(intakeSnapshot));
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
    localStorage.setItem("complianceIntakeDraft", JSON.stringify(intakeSnapshot));
    localStorage.setItem("complianceResult", JSON.stringify(previewAssessment));
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

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
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

                      <FormField
                        label="States of Operation"
                        htmlFor="states"
                        helperText="List the U.S. states or jurisdictions where the assessed entity operates, for example NY, CA, IL."
                        error={showValidation ? stepErrors.statesOfOperation : ""}
                      >
                        <Input
                          id="states"
                          value={statesOfOperation}
                          onChange={(event) => setStatesOfOperation(event.target.value)}
                          placeholder="NY, CA"
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
                      helperText="Describe the business workflows where AI is currently used so the assessment can infer likely regulatory triggers."
                      error={showValidation ? stepErrors.aiUseCases : ""}
                    >
                      <Input
                        id="ai-use-cases"
                        value={aiUseCases}
                        onChange={(event) => setAiUseCases(event.target.value)}
                        placeholder="hiring, chatbots, profiling"
                      />
                    </FormField>

                    <CheckboxField
                      checked={usesAiInHiring}
                      onChange={(event) => setUsesAiInHiring(event.target.checked)}
                      label="AI is used in employment-related decisions"
                      description="Enable this if AI informs candidate screening, scoring, interview review, promotion, or other employment-related decisions."
                    />
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
                  <Card tone="secondary" className="border-amber-500/20 bg-amber-500/[0.07] p-6">
                    <FormField
                      label="Critical Use Cases"
                      htmlFor="critical-use-cases"
                      helperText="Document any hiring, profiling, law-enforcement, or other high-impact workflows that require closer regulatory review."
                      error={showValidation ? stepErrors.criticalUseCases : ""}
                    >
                      <TextArea
                        id="critical-use-cases"
                        value={criticalUseCases}
                        onChange={(event) => setCriticalUseCases(event.target.value)}
                        placeholder="Describe any sensitive workflows, such as candidate screening, consequential profiling, or critical infrastructure decision support."
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
                <ReviewPanel
                  companyName={companyName}
                  industry={industry}
                  statesOfOperation={statesOfOperation}
                  aiUseCases={aiUseCases}
                  usesAiInHiring={usesAiInHiring}
                  selectedCategoryTitles={selectedCategoryTitles}
                  criticalUseCases={criticalUseCases}
                  dataProvenance={formatDataProvenance(dataProvenance)}
                  additionalContext={additionalContext}
                  previewAssessment={previewAssessment}
                />
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
