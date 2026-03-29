import { Button } from "@/components/ui/Button";

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-4 w-4 fill-none stroke-current stroke-[1.8] ${
        direction === "left" ? "rotate-180" : ""
      }`}
    >
      <path d="m6 3 5 5-5 5M11 8H2.5" />
    </svg>
  );
}

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function StepNavigation({
  currentStep,
  totalSteps,
  isSubmitting = false,
  onPrevious,
  onNext,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const previousLabel = isFirstStep ? "Back to Home" : "Back";

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={onPrevious}
        disabled={isSubmitting}
        className="gap-3 sm:min-w-[160px]"
      >
        <ArrowIcon direction="left" />
        {previousLabel}
      </Button>

      <Button
        type={isLastStep ? "submit" : "button"}
        size="lg"
        onClick={isLastStep ? undefined : onNext}
        disabled={isSubmitting}
        className="gap-3 px-8 shadow-[0_14px_40px_rgba(56,189,248,0.22)] sm:min-w-[220px]"
      >
        {isLastStep ? (isSubmitting ? "Running Assessment..." : "Run Assessment") : "Continue"}
        <ArrowIcon />
      </Button>
    </div>
  );
}
