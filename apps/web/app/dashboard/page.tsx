import { CompliancePlaceholder } from "@/components/dashboard/CompliancePlaceholder";
import { getCongressLaws } from "@/lib/api";

/** Results surface — replace placeholder with live data from API / session */
export default async function DashboardPage() {
  let latestSync = "";
  let totalLaws = 0;
  try {
    const response = await getCongressLaws(1);
    latestSync = response.freshness?.latest_sync
      ? new Date(response.freshness.latest_sync).toLocaleString()
      : "";
    totalLaws = response.freshness?.total_records ?? response.laws.length;
  } catch {
    // Keep dashboard usable even if laws API is temporarily unavailable.
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="text-neutral-600">
        Compliance overview (placeholder). Wire to stored intake + `/applicability/check` results.
      </p>
      <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
        <p className="font-medium text-neutral-900">Regulatory feed status</p>
        <p className="mt-1">
          {latestSync
            ? `Updated from real legislative sources at ${latestSync}.`
            : "Regulatory source freshness unavailable."}
        </p>
        <p className="mt-1 text-neutral-500">Tracked federal records: {totalLaws}</p>
      </div>
      <CompliancePlaceholder />
    </div>
  );
}
