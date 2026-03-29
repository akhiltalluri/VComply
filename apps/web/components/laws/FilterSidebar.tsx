import { Card } from "@/components/ui/Card";

type FilterSidebarProps = {
  selectedJurisdictions: string[];
  selectedUseCases: string[];
  selectedRiskLevels: string[];
  onToggleJurisdiction: (value: string) => void;
  onToggleUseCase: (value: string) => void;
  onToggleRiskLevel: (value: string) => void;
};

type FilterGroupProps = {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

function FilterCheckbox({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm text-slate-300 transition hover:bg-white/[0.03]">
      <input checked={active} onChange={onToggle} type="checkbox" className="peer sr-only" />
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
          active
            ? "border-sky-400 bg-sky-400 text-slate-950"
            : "border-slate-700 bg-slate-950 text-transparent"
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4]">
          <path d="M3.5 8.4 6.6 11.5 12.5 5.3" />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}

function FilterGroup({ title, items, selected, onToggle }: FilterGroupProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <FilterCheckbox
            key={item}
            label={item}
            active={selected.includes(item)}
            onToggle={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
}

export function FilterSidebar({
  selectedJurisdictions,
  selectedUseCases,
  selectedRiskLevels,
  onToggleJurisdiction,
  onToggleUseCase,
  onToggleRiskLevel,
}: FilterSidebarProps) {
  return (
    <Card tone="primary" className="h-full p-5 lg:p-6">
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">
            Filters
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Narrow the regulations shown based on jurisdiction, use case, and risk profile.
          </p>
        </div>

        <div className="space-y-8">
          <FilterGroup
            title="Jurisdiction"
            items={["New York", "California", "Illinois", "Massachusetts", "Colorado", "European Union", "United States"]}
            selected={selectedJurisdictions}
            onToggle={onToggleJurisdiction}
          />

          <FilterGroup
            title="Use Case"
            items={["Hiring", "Profiling", "Biometric", "Governance", "Procurement"]}
            selected={selectedUseCases}
            onToggle={onToggleUseCase}
          />

          <FilterGroup
            title="Risk Level"
            items={["HIGH", "MEDIUM", "LOW"]}
            selected={selectedRiskLevels}
            onToggle={onToggleRiskLevel}
          />
        </div>
      </div>
    </Card>
  );
}
