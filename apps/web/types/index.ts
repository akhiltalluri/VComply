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
  source_laws?: SourceLaw[];
};

export type SourceLaw = {
  id: string;
  source: string;
  law: string;
  risk: string;
  reason: string;
  url?: string | null;
  latest_action_date?: string | null;
  last_synced_at?: string | null;
};

export type CongressLawsResponse = {
  laws: SourceLaw[];
  freshness?: {
    total_records: number;
    latest_sync: string | null;
  };
};
