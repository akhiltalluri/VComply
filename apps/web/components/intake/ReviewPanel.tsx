import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import type { ComplianceAssessment } from "@/lib/mock-data";

type ReviewPanelProps = {
  companyName: string;
  industry: string;
  statesOfOperation: string;
  aiUseCases: string;
  usesAiInHiring: boolean;
  selectedCategoryTitles: string[];
  criticalUseCases: string;
  dataProvenance: string;
  additionalContext: string;
  previewAssessment: ComplianceAssessment;
};

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <InsetPanel>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
    </InsetPanel>
  );
}

export function ReviewPanel({
  companyName,
  industry,
  statesOfOperation,
  aiUseCases,
  usesAiInHiring,
  selectedCategoryTitles,
  criticalUseCases,
  dataProvenance,
  additionalContext,
  previewAssessment,
}: ReviewPanelProps) {
  return (
    <div className="space-y-6">
      <Card tone="subtle" className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewRow label="Assessed Entity" value={companyName || "Not provided"} />
          <ReviewRow label="Industry Context" value={industry || "Not provided"} />
          <ReviewRow label="Jurisdictional Exposure" value={statesOfOperation || "Not provided"} />
          <ReviewRow
            label="Employment-Related AI"
            value={usesAiInHiring ? "Yes, employment-related workflows are in scope" : "No employment-related AI workflows selected"}
          />
        </div>
      </Card>

      <Card tone="subtle" className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewRow label="AI Systems and Use Cases" value={aiUseCases || "Not provided"} />
          <ReviewRow
            label="System Categories"
            value={selectedCategoryTitles.length > 0 ? selectedCategoryTitles.join(", ") : "None selected"}
          />
          <ReviewRow
            label="Training Data Provenance"
            value={dataProvenance || "Not provided"}
          />
          <ReviewRow
            label="Additional Assessment Context"
            value={additionalContext || "No additional context provided"}
          />
        </div>
      </Card>

      <Card tone="subtle" className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewRow
            label="Deployment Profile"
            value={previewAssessment.operational_summary.deployment_profile}
          />
          <ReviewRow
            label="Review Cadence"
            value={previewAssessment.operational_summary.review_cadence}
          />
          <ReviewRow
            label="Likely Impacted Regulations"
            value={previewAssessment.applicable_laws.map((law) => law.law).join(", ")}
          />
          <ReviewRow
            label="Required Compliance Actions"
            value={`${previewAssessment.required_actions.length} actions identified across ${previewAssessment.summary.impacted_regulation_count} regulations`}
          />
        </div>
      </Card>

      <Card tone="secondary" className="border-amber-500/20 bg-amber-500/[0.07] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
          Sensitive Workflow Notes
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {criticalUseCases || "No sensitive workflows were provided."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {previewAssessment.impacted_business_areas.map((area) => (
            <span
              key={area}
              className="rounded-lg border border-amber-500/20 bg-slate-950 px-3 py-1.5 text-xs font-medium text-amber-200"
            >
              {area}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
