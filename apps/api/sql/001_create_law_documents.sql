-- Congress.gov law ingestion table (additive; does not alter existing app tables)
create table if not exists public.law_documents (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'congress_gov',
  source_id text not null,
  congress_number int,
  bill_type text,
  bill_number text,
  title text not null,
  summary text,
  status text,
  introduced_at date,
  latest_action_date date,
  url text,
  keywords text[] not null default '{}',
  applicability_tags text[] not null default '{}',
  risk text not null default 'MEDIUM',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_synced_at timestamptz not null default now(),
  unique (source, source_id)
);

create index if not exists law_documents_source_idx
  on public.law_documents (source);

create index if not exists law_documents_latest_action_idx
  on public.law_documents (latest_action_date desc);

create index if not exists law_documents_keywords_gin_idx
  on public.law_documents using gin (keywords);

