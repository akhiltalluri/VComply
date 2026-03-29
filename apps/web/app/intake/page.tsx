"use client";

import { useMemo, useState } from "react";
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
import { TextArea } from "@/components/ui/TextArea";
import { modelCategories } from "@/lib/mock-data";

const steps = [
  {
    id: "company",
    title: "Company Profile",
    subtitle: "Business footprint and operating context",
    description:
      "Establish the company baseline VComply will use to map jurisdictions, industry context, and likely regulatory scope.",
  },
  {
    id: "usage",
    title: "AI Usage",
    subtitle: "Deployments, systems, and affected workflows",
    description:
      "Capture how AI is used operationally so the assessment can distinguish routine automation from consequential decision systems.",
  },
  {
    id: "risk",
    title: "Risk Context",
    subtitle: "Sensitive workflows and data provenance",
    description:
      "Add the higher-sensitivity details that usually determine whether a deployment falls into heightened regulatory review.",
  },
  {
    id: "review",
    title: "Review",
    subtitle: "Confirm details before running assessment",
    description:
      "Review the submitted information before generating the initial compliance assessment and recommended next steps.",
  },
];

const mockResult = {
  risk_score: 84,
  applicable_laws: [
    {
      law: "NYC Local Law 144",
      risk: "HIGH" as const,
      reason: "AI used in hiring in NY",
      next_step: "Conduct an independent bias audit",
    },
    {
      law: "Illinois AI Video Interview Act",
      risk: "MEDIUM" as const,
      reason: "AI-assisted hiring workflows may trigger notice requirements",
      next_step: "Implement candidate notice and consent workflow",
    },
  ],
};

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

export default function IntakePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        industry: industry.trim() ? "" : "Specify the company industry.",
        statesOfOperation: statesOfOperation.trim()
          ? ""
          : "List at least one operating jurisdiction.",
      };
    }

    if (stepNumber === 2) {
      return {
        aiUseCases: aiUseCases.trim() ? "" : "Describe the AI use cases in scope.",
        categories:
          selectedCategories.length > 0 ? "" : "Select at least one model or system category.",
      };
    }

    if (stepNumber === 3) {
      return {
        criticalUseCases:
          !requiresCriticalUseCase || criticalUseCases.trim()
            ? ""
            : "Add context for sensitive or high-impact workflows.",
        dataProvenance: dataProvenance ? "" : "Select the primary data source origin.",
      };
    }

    return {};
  }

  const stepErrors = getStepErrors(currentStep);
  const hasCurrentStepErrors = Object.values(stepErrors).some(Boolean);

  function goToPreviousStep() {
    setShowValidation(false);

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
    setCurrentStep((step) => Math.min(steps.length, step + 1));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep !== steps.length) {
      goToNextStep();
      return;
    }

    setIsSubmitting(true);

    const intakeSnapshot = {
      company_name: companyName,
      industry,
      states_of_operation: statesOfOperation,
      ai_use_cases: aiUseCases,
      uses_ai_in_hiring: usesAiInHiring,
      selected_categories: selectedCategoryTitles,
      critical_use_cases: criticalUseCases,
      data_provenance: formatDataProvenance(dataProvenance),
      additional_context: additionalContext,
    };

    localStorage.setItem("complianceResult", JSON.stringify(mockResult));
    localStorage.setItem("complianceIntakeDraft", JSON.stringify(intakeSnapshot));

    await new Promise((resolve) => setTimeout(resolve, 700));
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
                          helperText="Use the legal or operating name that best represents the assessed entity."
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
                        helperText="This helps align your assessment to sector-specific AI scrutiny."
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
                        helperText="Comma-separated is fine for now, for example NY, CA, IL."
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
                      label="AI Use Cases"
                      htmlFor="ai-use-cases"
                      helperText="Describe the main workflows or functions where AI is used today."
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
                      label="Uses AI in hiring"
                      description="Enable this if AI informs candidate screening, scoring, interview review, or other employment-related decisions."
                    />
                  </Card>

                  <Card tone="subtle" className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Model or system categories</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Select the categories that best describe the deployed systems in scope.
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
                      helperText="Document any hiring, profiling, law-enforcement, or other high-impact workflows that merit closer compliance scrutiny."
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
                      helperText="Choose the primary source of training or fine-tuning data used by the assessed systems."
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
                      helperText="Optional notes about vendors, deployment scope, or internal governance that may affect interpretation."
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
                />
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
