import Link from "next/link";
import { getCongressLaws } from "@/lib/api";

/** Law catalog browser — later fetch from GET /laws or static seeds */
export default async function LawsPage() {
  let laws: Awaited<ReturnType<typeof getCongressLaws>>["laws"] = [];
  let latestSync = "";
  try {
    const response = await getCongressLaws(25);
    laws = response.laws;
    latestSync = response.freshness?.latest_sync
      ? new Date(response.freshness.latest_sync).toLocaleString()
      : "";
  } catch {
    // Keep page resilient if backend fetch is unavailable.
    laws = [];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Laws</h1>
      <p className="text-neutral-600">
        Browse regulations relevant to your profile from real legislative sources.
      </p>
      {latestSync && (
        <p className="text-xs text-neutral-500">Updated from real sources: {latestSync}</p>
      )}
      {laws.length === 0 ? (
        <p className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
          No ingested congress laws yet. Run the ingest script to populate this feed.
        </p>
      ) : (
        <ul className="space-y-3">
          {laws.map((law) => (
            <li key={law.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-sm font-semibold text-neutral-900">{law.law}</p>
              <p className="mt-1 text-xs text-neutral-500">
                Source: {law.source} · Risk: {law.risk}
              </p>
              <p className="mt-2 text-sm text-neutral-700">{law.reason}</p>
              {law.url ? (
                <a
                  href={law.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-neutral-900 underline"
                >
                  Open source link
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <Link href="/intake" className="text-sm font-medium text-neutral-900 underline">
        Back to intake
      </Link>
    </div>
  );
}
