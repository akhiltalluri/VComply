import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";
import type { ComplianceAssessment } from "@/lib/mock-data";

type ReviewPanelProps = {
  companyName: string;
  industry: string;
  aiUseCases: string;
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
      <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
    </InsetPanel>
  );
}

export function ReviewPanel({
  companyName,
  industry,
  aiUseCases,
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
          <ReviewRow label="Assessed entity" value={companyName || "Not provided"} />
          <ReviewRow label="Industry context" value={industry || "Not provided"} />
          <ReviewRow
            label="Computed risk level"
            value={`${previewAssessment.severity} (${previewAssessment.risk_score}/100)`}
          />
          <ReviewRow
            label="Federal record overlap"
            value={previewAssessment.applicable_laws.map((law) => law.law).join(", ")}
          />
        </div>
      </Card>

      <Card tone="subtle" className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewRow label="AI systems and use cases" value={aiUseCases || "Not provided"} />
          <ReviewRow
            label="System categories"
            value={selectedCategoryTitles.length > 0 ? selectedCategoryTitles.join(", ") : "None selected"}
          />
          <ReviewRow label="Training data provenance" value={dataProvenance || "Not provided"} />
          <ReviewRow
            label="Additional assessment context"
            value={additionalContext || "No additional context provided"}
          />
        </div>
      </Card>

      <Card tone="subtle" className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewRow
            label="Deployment profile"
            value={previewAssessment.operational_summary.deployment_profile}
          />
          <ReviewRow
            label="Review cadence"
            value={previewAssessment.operational_summary.review_cadence}
          />
          <ReviewRow
            label="Likely impacted federal records"
            value={previewAssessment.applicable_laws.map((law) => law.law).join(", ")}
          />
          <ReviewRow
            label="Required compliance actions"
            value={`${previewAssessment.required_actions.length} actions identified across ${previewAssessment.summary.impacted_regulation_count} federal records`}
          />
        </div>
      </Card>

      <Card tone="secondary" className="border-amber-500/20 bg-amber-500/[0.07] p-6">
        <p className="text-xs font-semibold tracking-[0.04em] text-amber-300">
          Sensitive workflow notes
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
