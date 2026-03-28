/**
 * Shared frontend types — keep aligned with FastAPI schemas in `apps/api/app/schemas`.
 * Optionally promote duplicates to `packages/shared` later.
 */
export type ApplicableLaw = {
  law: string;
  risk: string;
  reason: string;
};

export type ApplicabilityCheckRequest = {
  states: string[];
  uses_hiring_ai: boolean;
};

export type ApplicabilityCheckResponse = {
  applicable_laws: ApplicableLaw[];
  risk_score: number;
};
