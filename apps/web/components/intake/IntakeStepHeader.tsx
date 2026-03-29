type IntakeStepHeaderProps = {
  step: number;
  title: string;
  description: string;
};

export function IntakeStepHeader({
  step,
  title,
  description,
}: IntakeStepHeaderProps) {
  return (
    <div className="space-y-4">
      <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
        Step {step}
      </span>
      <div className="space-y-2.5">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
          {description}
        </p>
      </div>
    </div>
  );
}
