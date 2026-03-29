/**
 * Thin API client for the FastAPI backend.
 * Set NEXT_PUBLIC_API_URL in `.env.local` (see `.env.example`).
 */
import type { ApplicabilityCheckRequest, ApplicabilityCheckResponse } from "@/types";
import type { CongressLawsResponse } from "@/types";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return url.replace(/\/$/, "");
}

export async function postApplicabilityCheck(
  body: ApplicabilityCheckRequest
): Promise<ApplicabilityCheckResponse> {
  const res = await fetch(`${getBaseUrl()}/applicability/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<ApplicabilityCheckResponse>;
}

export async function getCongressLaws(limit = 50): Promise<CongressLawsResponse> {
  const res = await fetch(`${getBaseUrl()}/laws/congress?limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<CongressLawsResponse>;
}
