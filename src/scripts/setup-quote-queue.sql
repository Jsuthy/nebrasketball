-- Human-approval queue for quote-tweeting (repost-with-comment) big Nebraska
-- accounts. Used by src/lib/social/quote-queue.ts. Run once in the Supabase
-- SQL editor.
create table if not exists public.quote_queue (
  id uuid primary key default gen_random_uuid(),
  source_url text not null,
  source_handle text,
  source_text text,
  source_tweet_id text,
  proposed_comment text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','posted','failed')),
  posted_tweet_id text,
  error text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index if not exists quote_queue_status_idx
  on public.quote_queue (status, created_at desc);

alter table public.quote_queue enable row level security;
-- No public policies: only the service-role key (used by the admin-authed
-- API routes) can read or write this table.
