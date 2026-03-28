"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { postApplicabilityCheck } from "@/lib/api";
import type { ApplicabilityCheckResponse } from "@/types";

/** Simple intake form — parses comma-separated states and calls the mock applicability API */
export function IntakeForm() {
  const [statesRaw, setStatesRaw] = useState("NY");
  const [usesHiringAi, setUsesHiringAi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplicabilityCheckResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const states = statesRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const data = await postApplicabilityCheck({
        states,
        uses_hiring_ai: usesHiringAi,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="states" className="mb-1 block text-sm font-medium text-neutral-700">
          States (comma-separated)
        </label>
        <input
          id="states"
          name="states"
          value={statesRaw}
          onChange={(e) => setStatesRaw(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          placeholder="NY, CA"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={usesHiringAi}
          onChange={(e) => setUsesHiringAi(e.target.checked)}
        />
        Uses AI in hiring / recruiting
      </label>
      <div>
        <Button type="submit" disabled={loading}>
          {loading ? "Checking…" : "Check applicability"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
          <p className="font-medium text-neutral-900">Risk score: {result.risk_score}</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-neutral-700">
            {result.applicable_laws.map((law) => (
              <li key={law.law}>
                <span className="font-medium">{law.law}</span> — {law.risk}: {law.reason}
              </li>
            ))}
          </ul>
          {result.applicable_laws.length === 0 && (
            <p className="text-neutral-600">No matching demo laws for this profile.</p>
          )}
        </div>
      )}
    </form>
  );
}
