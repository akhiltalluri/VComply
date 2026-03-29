import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterGroup } from "@/components/laws/FilterGroup";

type FilterSidebarProps = {
  jurisdictions: string[];
  useCases: string[];
  riskLevels: string[];
  enforcementStages: string[];
  categories: string[];
  selectedJurisdictions: string[];
  selectedUseCases: string[];
  selectedRiskLevels: string[];
  selectedEnforcementStages: string[];
  selectedCategories: string[];
  onToggleJurisdiction: (value: string) => void;
  onToggleUseCase: (value: string) => void;
  onToggleRiskLevel: (value: string) => void;
  onToggleEnforcementStage: (value: string) => void;
  onToggleCategory: (value: string) => void;
  onReset: () => void;
};

export function FilterSidebar({
  jurisdictions,
  useCases,
  riskLevels,
  enforcementStages,
  categories,
  selectedJurisdictions,
  selectedUseCases,
  selectedRiskLevels,
  selectedEnforcementStages,
  selectedCategories,
  onToggleJurisdiction,
  onToggleUseCase,
  onToggleRiskLevel,
  onToggleEnforcementStage,
  onToggleCategory,
  onReset,
}: FilterSidebarProps) {
  return (
    <Card tone="primary" className="h-full p-5 lg:p-6">
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">
            Regulatory Filters
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Narrow the federal legislative catalog by jurisdiction, workflow, congressional status, and risk level.
          </p>
          </div>
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={onReset}>
            Clear all
          </Button>
        </div>

        <div className="space-y-8">
          <FilterGroup
            title="Jurisdiction"
            items={jurisdictions}
            selected={selectedJurisdictions}
            onToggle={onToggleJurisdiction}
          />

          <FilterGroup
            title="Use Case"
            items={useCases}
            selected={selectedUseCases}
            onToggle={onToggleUseCase}
          />

          <FilterGroup
            title="Risk Level"
            items={riskLevels}
            selected={selectedRiskLevels}
            onToggle={onToggleRiskLevel}
          />

          <FilterGroup
            title="Enforcement Status"
            items={enforcementStages}
            selected={selectedEnforcementStages}
            onToggle={onToggleEnforcementStage}
          />

          <FilterGroup
            title="Category"
            items={categories}
            selected={selectedCategories}
            onToggle={onToggleCategory}
          />
        </div>
      </div>
    </Card>
  );
}
