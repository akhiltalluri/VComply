import { Card } from "@/components/ui/Card";
import { InsetPanel } from "@/components/ui/InsetPanel";

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
}: ReviewPanelProps) {
  return (
    <div className="space-y-6">
      <Card tone="subtle" className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewRow label="Company Name" value={companyName || "Not provided"} />
          <ReviewRow label="Industry" value={industry || "Not provided"} />
          <ReviewRow label="States of Operation" value={statesOfOperation || "Not provided"} />
          <ReviewRow
            label="Uses AI in Hiring"
            value={usesAiInHiring ? "Yes, hiring workflows are in scope" : "No hiring workflow selected"}
          />
        </div>
      </Card>

      <Card tone="subtle" className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewRow label="AI Use Cases" value={aiUseCases || "Not provided"} />
          <ReviewRow
            label="Model Categories"
            value={selectedCategoryTitles.length > 0 ? selectedCategoryTitles.join(", ") : "None selected"}
          />
          <ReviewRow
            label="Data Provenance"
            value={dataProvenance || "Not provided"}
          />
          <ReviewRow
            label="Additional Context"
            value={additionalContext || "No additional notes provided"}
          />
        </div>
      </Card>

      <Card tone="secondary" className="border-amber-500/20 bg-amber-500/[0.07] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
          Sensitive workflow notes
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {criticalUseCases || "No critical use cases were provided."}
        </p>
      </Card>
    </div>
  );
}
