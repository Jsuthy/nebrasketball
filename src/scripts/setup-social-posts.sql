-- Dedup ledger for the automated X posting engine (src/lib/social/engine.ts).
-- Run once in the Supabase SQL editor.
create table if not exists public.social_posts (
  key text primary key,
  body text not null,
  tweet_id text,
  posted_at timestamptz not null default now()
);

alter table public.social_posts enable row level security;
-- No public policies: only the service-role key (used by the cron route)
-- can read or write this table.
