-- Ingestion run metadata for observability and customer freshness confidence
create table if not exists public.law_ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  congress_number int,
  pages_requested int not null default 0,
  request_limit int not null default 0,
  min_score int not null default 1,
  keywords text[] not null default '{}',
  input_file text,
  status text not null default 'RUNNING',
  scanned_count int not null default 0,
  matched_count int not null default 0,
  upserted_count int not null default 0,
  error_count int not null default 0,
  error_message text,
  run_started_at timestamptz not null default now(),
  run_finished_at timestamptz
);

create index if not exists law_ingestion_runs_source_started_idx
  on public.law_ingestion_runs (source, run_started_at desc);

