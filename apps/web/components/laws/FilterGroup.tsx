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
      <input checked={active} onChange={onToggle} type="checkbox" className="peer sr-only" aria-label={label} />
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

export function FilterGroup({ title, items, selected, onToggle }: FilterGroupProps) {
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
