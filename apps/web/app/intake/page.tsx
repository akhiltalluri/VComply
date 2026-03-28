import { IntakeForm } from "@/components/intake/IntakeForm";

/** Company facts collection — feeds applicability checks and dashboard */
export default function IntakePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Intake</h1>
      <p className="text-neutral-600">
        Tell us where you operate and how you use AI. We&apos;ll match mock rules for the demo.
      </p>
      <IntakeForm />
    </div>
  );
}
