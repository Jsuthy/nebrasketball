-- Email newsletter signups (captured by /api/email via the service-role client).
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text,
  created_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON public.email_subscribers(email);

-- RLS: enabled so the anon key cannot read or write this PII. The API writes
-- with the service-role key, which bypasses RLS; the explicit insert policy
-- below keeps the intent consistent with the repo's other tables (migration 003).
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_subscribers_service_insert"
  ON public.email_subscribers FOR INSERT TO service_role WITH CHECK (true);
