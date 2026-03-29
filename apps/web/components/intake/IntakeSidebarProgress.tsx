import { BrandLockup } from "@/components/ui/BrandLockup";
import { Card } from "@/components/ui/Card";

type IntakeStep = {
  id: string;
  title: string;
  subtitle: string;
};

type IntakeSidebarProgressProps = {
  steps: IntakeStep[];
  currentStep: number;
};

function StepMarker({
  stepNumber,
  state,
}: {
  stepNumber: number;
  state: "complete" | "current" | "upcoming";
}) {
  if (state === "complete") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
        <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-[2.2]">
          <path d="M3.5 8.4 6.6 11.5 12.5 5.3" />
        </svg>
      </span>
    );
  }

  if (state === "current") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/35 bg-blue-500/10 text-blue-300 shadow-[0_0_0_6px_rgba(59,130,246,0.08)]">
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
      </span>
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-semibold text-slate-500">
      {stepNumber}
    </span>
  );
}

export function IntakeSidebarProgress({
  steps,
  currentStep,
}: IntakeSidebarProgressProps) {
  return (
    <aside className="flex h-full flex-col justify-between rounded-[28px] border border-slate-800 bg-slate-900 px-6 py-7 lg:px-7 lg:py-8">
      <div className="space-y-8">
        <BrandLockup
          subtitle="AI regulatory assessment"
          wordmarkClassName="h-10"
          subtitleClassName="mt-1"
        />

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Assessment Progress
          </p>
          <p className="text-sm leading-6 text-slate-400">
            Complete the intake to map your AI footprint to impacted regulations and the actions most likely to be required.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const stepIndex = index + 1;
            const state =
              stepIndex < currentStep
                ? "complete"
                : stepIndex === currentStep
                  ? "current"
                  : "upcoming";

            return (
              <div key={step.id} className="relative flex gap-4">
                {index < steps.length - 1 ? (
                  <span className="absolute left-[17px] top-10 h-14 w-px bg-slate-800" />
                ) : null}
                <StepMarker stepNumber={stepIndex} state={state} />
                <div className="space-y-1 pt-1">
                  <p
                    className={`text-base font-medium ${
                      state === "current"
                        ? "text-blue-300"
                        : state === "complete"
                          ? "text-slate-100"
                          : "text-slate-500"
                    }`}
                  >
                    {stepIndex}. {step.title}
                  </p>
                  <p className="text-sm text-slate-500">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Card
        tone="secondary"
        className={`border-amber-500/20 bg-amber-500/[0.06] p-5 ${
          currentStep === steps.length ? "mt-8" : "mt-6"
        }`}
      >
        <p className="text-xs font-semibold tracking-[0.04em] text-amber-300">
          Why this input matters
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Accurate deployment context is what allows VComply to distinguish routine automation from workflows that create meaningful regulatory exposure.
        </p>
      </Card>
    </aside>
  );
}
