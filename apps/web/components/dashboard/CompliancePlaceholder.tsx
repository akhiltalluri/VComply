/** Static placeholder cards — swap for real metrics from API or persisted intake */

export function CompliancePlaceholder() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-medium text-neutral-500">Open obligations</h2>
        <p className="mt-2 text-2xl font-semibold text-neutral-900">—</p>
        <p className="mt-1 text-xs text-neutral-500">Connect to scoring + task list</p>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-medium text-neutral-500">Risk score</h2>
        <p className="mt-2 text-2xl font-semibold text-neutral-900">—</p>
        <p className="mt-1 text-xs text-neutral-500">Mirror `/applicability/check` output</p>
      </div>
    </div>
  );
}
