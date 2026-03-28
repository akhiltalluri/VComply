import Link from "next/link";

/** Landing page — hero + CTA into intake */
export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900">VComply</h1>
      <p className="text-lg text-neutral-600">
        Real-time AI compliance intelligence: map your jurisdictions and AI use cases to applicable
        laws before they become surprises.
      </p>
      <Link
        href="/intake"
        className="inline-block rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Start intake
      </Link>
    </div>
  );
}
