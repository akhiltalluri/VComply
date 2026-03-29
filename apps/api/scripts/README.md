# Congress.gov Ingestion (MVP)

This folder contains additive scripts for loading AI-related law candidates from Congress.gov into Supabase.

## 1) Create table (once)

Run the SQL in:

- `apps/api/sql/001_create_law_documents.sql`

Use Supabase SQL Editor.

## 2) Configure env

In `apps/api/.env`, ensure:

- `DATABASE_URL=...`
- `CONGRESS_API_KEY=...`

## 3) Run ingest

From `apps/api`:

```bash
source .venv/bin/activate
python scripts/congress_ingest.py --congress 118 --pages 3 --limit 50
```

Optional tuning:

```bash
python scripts/congress_ingest.py --congress 118 --pages 5 --limit 100 --min-score 2
```

## 4) Read from API

Existing preview endpoint remains:

- `GET /laws`

New additive endpoint for ingested records:

- `GET /laws/congress?limit=50`

## 5) Validate idempotent upserts without external API (optional)

You can validate duplicate-safe upserts by running the script twice against the same local payload:

```bash
python scripts/congress_ingest.py --input-file scripts/samples/congress_sample.json --min-score 1
python scripts/congress_ingest.py --input-file scripts/samples/congress_sample.json --min-score 1
```

Then verify no duplicate records:

```sql
select source, source_id, count(*)
from public.law_documents
group by source, source_id
having count(*) > 1;
```

## 6) Scheduled updates and manual backfill

- Daily scheduler workflow: `.github/workflows/congress-ingest.yml`
- Manual backfill trigger: GitHub Actions `workflow_dispatch`

Manual local backfill example:

```bash
python scripts/congress_ingest.py --congress 117 --pages 5 --limit 100 --min-score 1
```

