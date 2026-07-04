-- REVYX web-landing — feedback questionnaire storage (Supabase / PostgreSQL)
-- Run once in the Supabase SQL editor for your project.
--
-- Data collected here is used to (a) prioritise product development and
-- (b) contact participants about the 1-year free bonus after launch.
-- GDPR / Legea 133/2011 RM: consent is captured explicitly (consent = true),
-- data is minimised, and rows can be deleted on request.

create table if not exists public.feedback (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text,
  email          text not null,
  role           text,
  city           text,
  monthly_volume text,
  pain           text,
  wish           text,
  consent        boolean not null default false,
  pilot_interest boolean not null default false,
  locale         text not null default 'ro'
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_email_idx on public.feedback (lower(email));

-- Row Level Security: enabled with NO public policies.
-- Inserts happen only from the server (/api/feedback) using the service_role
-- key, which bypasses RLS. The anon/public key can neither read nor write.
alter table public.feedback enable row level security;

-- Export the bonus list later with, e.g.:
--   select email, name, role, city, created_at
--   from public.feedback
--   where consent = true
--   order by created_at desc;
