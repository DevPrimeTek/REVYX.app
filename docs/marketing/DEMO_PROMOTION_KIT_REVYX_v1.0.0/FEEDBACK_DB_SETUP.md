# FORMULAR FEEDBACK NATIV + BAZĂ DE DATE (Supabase)
<!-- docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/FEEDBACK_DB_SETUP.md · v1.1.0 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog
| Versiune | Data | Note |
|---|---|---|
| 1.0.0 | 2026-07 | INITIAL — formular pe Tally (extern). |
| 1.1.0 | 2026-07 | ★ Înlocuit Tally cu **formular nativ în stilul demo-ului** + stocare în **Supabase (Postgres)** prin ruta API `/api/feedback`. |

## 0. Scop
Testerul completează un formular **nativ** (același stil ca demo-ul, deschis din butonul „Feedback" / nudge), iar răspunsurile se scriu într-o **bază de date reală** (Supabase Postgres). Fără serviciu extern de formulare. Colectare automată, fără apel.

Codul e deja livrat:
- Formular: `apps/web-preview/components/feedback/feedback-form.tsx`
- Rută API (scrie în DB): `apps/web-preview/app/api/feedback/route.ts`
- Validare partajată: `apps/web-preview/lib/feedback-payload.ts`

Rămâne **doar setup-ul bazei de date** (fondator, o singură dată).

---

## 1. Setup Supabase (fondator, ~10 min, o singură dată)

1. Cont pe [supabase.com](https://supabase.com) (gratuit) → **New project** (alege regiune EU, ex. Frankfurt).
2. **SQL Editor** → rulează scriptul din §2 (creează tabelul `feedback`).
3. **Project Settings → API** → copiază:
   - **Project URL** (ex. `https://xxxx.supabase.co`)
   - **service_role** secret key (secțiunea „Project API keys" → `service_role`). ⚠️ Secret — NU cheia `anon`.
4. Vercel → proiectul demo → **Settings → Environment Variables** → adaugă (scope: Production + Preview):
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key
5. **Redeploy** (Deployments → ultimul → Redeploy).
6. Verificare: intră pe demo → buton „Feedback" → completează → **Trimite** → apare „Mulțumim pentru feedback!". Vezi rândul în Supabase → **Table Editor → feedback**.

> Securitate: `service_role` e citită DOAR pe server (în ruta API), nu e `NEXT_PUBLIC`, nu ajunge niciodată în browser. Până setezi env var-ul, formularul răspunde curat cu „Nu am putut trimite" (ruta întoarce 503), fără să crape.

---

## 2. Schema tabel (rulează în SQL Editor)

```sql
create table if not exists public.feedback (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  role         text        not null,
  city         text,
  clarity      smallint    not null,
  utility      smallint    not null,
  pilot_intent smallint    not null,
  liked        text,
  missing      text,
  contact      text,
  locale       text        not null default 'ro'
);

-- Scrierea se face DOAR prin ruta API cu cheia service_role (bypass RLS).
-- Activăm RLS fără nicio politică publică → nimeni cu cheia anon nu poate citi/scrie.
alter table public.feedback enable row level security;
```

---

## 3. Întrebările formularului (deja în cod + i18n)

| # | Câmp DB | Întrebare (RO) | Tip |
|---|---|---|---|
| 1 | `role` | Ce descrie cel mai bine rolul tău? | alegere: independent / broker / agent în rețea / manager / altceva |
| 2 | `city` | Orașul (opțional) | text |
| 3 | `clarity` | Cât de clar ți s-a părut demo-ul? | scală 1–5 |
| 4 | `utility` | Cât de util ar fi în munca ta de zi cu zi? | scală 1–5 |
| 5 | `pilot_intent` | Cât de probabil ai testa varianta reală cu propriile lead-uri? | scală 1–5 |
| 6 | `liked` | Ce ți-a plăcut? Ce te-ar face să-l folosești? (opțional) | text lung |
| 7 | `missing` | Ce lipsește / ce te-ar face să NU-l folosești? (opțional) | text lung |
| 8 | `contact` | Vrei să te anunțăm când e gata? (opțional) | text (email/telefon) |

`locale` se completează automat cu limba activă (ro/ru/en). Textele sunt traduse în `messages/{ro,ru,en}.json` sub `feedback.*`.

---

## 4. Cum se mapează pe decizii

| Câmp | Semnal | Prag (cf. SUCCESS_CRITERIA) |
|---|---|---|
| `role` | Segment ICP (P1 / P2 / P3) | echilibru între segmente |
| `clarity` | UX demo — ecran confuz se reface | media ≥ 4/5 |
| `utility` | Product-message fit (pilon Direcție M2) | ≥ 3 din 5 dau ≥ 4 |
| `missing` | Backlog features → re-prioritizare M1.S4-S6 | catalog obiecții |
| `pilot_intent` | Cerere reală de testare | ≥ 2 din 5 dau ≥ 4 |
| `contact` | Conversie tester → lead | orice contact = win |

---

## 5. Colectare & sinteză (Director Marketing)
- Răspunsurile apar în **Supabase → Table Editor → feedback** (sortare pe `created_at`).
- Export: Table Editor → **Export → CSV**, sau SQL: `select * from feedback order by created_at desc;`.
- La fiecare 5 răspunsuri noi: transferă în tabelul din `MARKET_VALIDATION_KIT/SUCCESS_CRITERIA.md` §3 + verifică pragurile §1.
- Zero timp al fondatorului în colectare.

---

## 6. GDPR / Legea 133
- `contact` e opțional, colectat cu acord explicit (textul de sub câmp) doar pentru a anunța lansarea.
- Ștergere la cerere: `delete from feedback where contact = '<valoare>';` (BR-06).
- Fără PII obligatoriu — răspunsul poate fi complet anonim.

---

*docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/FEEDBACK_DB_SETUP.md · v1.1.0 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
