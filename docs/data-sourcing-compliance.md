# Data Sourcing Compliance Note (MVP)

## Purpose
VComply ingests public regulatory and legislative data to power compliance intelligence features. This note documents how data is sourced, handled, and presented in a legally responsible way for MVP use.

## Sources
- Primary source: official and public governmental source APIs (for example, Congress.gov API).
- Access method: authenticated API access using issued API keys.
- Fallback source methods (if used) must still comply with source terms and technical policies.

## Compliance Principles
1. **Authorized access only**
   - Use official APIs or explicitly permitted public endpoints.
   - Do not bypass authentication, paywalls, or access controls.

2. **Terms-of-service adherence**
   - Respect source licensing and usage terms, including:
     - permitted use
     - attribution obligations
     - redistribution constraints
     - retention constraints

3. **Rate-limit and fair-use controls**
   - Scheduled ingestion cadence (not aggressive crawling).
   - Backoff and retry behavior to prevent abuse of source infrastructure.

4. **Data provenance and transparency**
   - Store source metadata (`source`, `source_id`, canonical URL, sync timestamps).
   - Display freshness and source context in product where applicable.

5. **No legal advice claim**
   - Output is compliance intelligence and support, not legal advice.
   - Customer-facing messaging should reflect this.

## Security and Key Management
- API keys are stored in environment variables or secrets managers only.
- Keys are never hardcoded or committed to Git.
- If exposure is suspected, keys are rotated immediately.
- Access to production keys is limited to authorized team members.

## Data Quality and Auditability
- Ingestion runs are logged (`run_started_at`, `run_finished_at`, counts, errors).
- Upserts are idempotent to avoid duplicate records.
- Failed ingestion runs do not delete prior valid records.
- Source links are preserved for manual verification.

## Customer-Facing Trust Signals
- Indicate when data was last synced.
- Show source attribution for each record where feasible.
- Preserve prior known data if source feed is temporarily unavailable.

## Operational Responsibilities
- Engineering owner reviews source term updates periodically.
- Secrets rotation procedure is documented and tested.
- Incident process exists for:
  - source API policy changes
  - key compromise
  - ingestion failures and data anomalies

## MVP Scope Boundaries
- MVP focuses on official and public legislative sources and additive enrichment.
- Broader legal and licensing review is required before expanding to paid or proprietary datasets.
