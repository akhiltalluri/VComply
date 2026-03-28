import Link from "next/link";

/** Law catalog browser — later fetch from GET /laws or static seeds */
export default function LawsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Laws</h1>
      <p className="text-neutral-600">
        Browse regulations relevant to your profile. Hook this page to <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">GET /laws</code> when ready.
      </p>
      <ul className="list-inside list-disc space-y-2 text-neutral-700">
        <li>NYC Local Law 144 — automated employment decision tools (demo seed)</li>
      </ul>
      <Link href="/intake" className="text-sm font-medium text-neutral-900 underline">
        Back to intake
      </Link>
    </div>
  );
}
