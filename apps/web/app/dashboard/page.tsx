import { CompliancePlaceholder } from "@/components/dashboard/CompliancePlaceholder";

/** Results surface — replace placeholder with live data from API / session */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="text-neutral-600">
        Compliance overview (placeholder). Wire to stored intake + `/applicability/check` results.
      </p>
      <CompliancePlaceholder />
    </div>
  );
}
