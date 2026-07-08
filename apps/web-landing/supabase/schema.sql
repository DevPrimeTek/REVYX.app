-- REVYX web-landing — feedback questionnaire storage (Supabase / PostgreSQL)
-- Run once in the Supabase SQL editor for your project.
--
-- Data collected here is used to (a) prioritise product development and
-- (b) contact participants about the 1-year free bonus after launch.
-- GDPR / Legea 133/2011 RM: consent is captured explicitly (consent = true),
-- data is minimised, and rows can be deleted on request.
--
-- Field set mirrors docs/marketing/MARKET_VALIDATION_KIT_REVYX_v1.0.0/FEEDBACK_FORM.md
-- (S1-S5 ratings map 1:1 to the same pillars, so results feed the same
-- SUCCESS_CRITERIA.md centralisation table used for in-person interviews).

create table if not exists public.feedback (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text,
  email          text not null,
  role           text,
  market         text,
  city           text,
  monthly_volume text,
  rating_leads   smallint check (rating_leads between 1 and 5),
  rating_nba     smallint check (rating_nba between 1 and 5),
  rating_match   smallint check (rating_match between 1 and 5),
  rating_deals   smallint check (rating_deals between 1 and 5),
  rating_daily   smallint check (rating_daily between 1 and 5),
  pain           text,
  blockers       text,
  ai_concern     text,
  payment_band   text,
  recommend      boolean not null default false,
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

-- Export ratings for the VAL-01 centralisation table with, e.g.:
--   select email, role, market, rating_leads, rating_nba, rating_match,
--          rating_deals, rating_daily, payment_band, blockers, ai_concern
--   from public.feedback
--   order by created_at desc;
