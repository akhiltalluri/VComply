type OptionCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

export function OptionCard({
  title,
  description,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border px-5 py-5 text-left transition ${
        selected
          ? "border-blue-500/35 bg-blue-500/10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.14)]"
          : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border ${
            selected
              ? "border-blue-400 bg-blue-400 text-slate-950"
              : "border-slate-700 bg-slate-950 text-transparent"
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4]">
            <path d="M3.5 8.4 6.6 11.5 12.5 5.3" />
          </svg>
        </span>

        <div>
          <p className="text-base font-medium text-slate-100">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>
    </button>
  );
}
