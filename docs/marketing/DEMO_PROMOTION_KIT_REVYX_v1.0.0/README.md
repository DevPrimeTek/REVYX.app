# KIT PROMOVARE DEMO — REVYX (Index)
<!-- docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/README.md · v1.1.0 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan
**Stage:** Mkt-M1 — Pre-Launch (paralel M1.S3) · promovare + colectare feedback pe demo-ul live `apps/web-preview/`.
**Hats:** Director Marketing (P) + FRONTEND WEB DEV (S, mecanism feedback în demo) + DOC.

## 0.1 Platform Matrix
🌐 **WEB** — totul trimite către demo-ul live (`apps/web-preview/`, 26 ecrane, Vercel).

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-07 | Director Marketing + FRONTEND WEB DEV + DOC | ★ INITIAL — kit de promovare a demo-ului cu colectare de feedback **self-service**: mecanism de feedback integrat în demo (buton global + nudge automat + ghid de bun-venit) + formular Tally gata de lipit + pachet de conținut promo RO/RU copy-paste + plan de execuție cu implicare minimă a fondatorului. |
| 1.1.0 | 2026-07 | Director Marketing + FRONTEND WEB DEV + DOC | ★ Înlocuit formularul Tally cu **formular nativ în stilul demo-ului** + stocare în **Supabase (Postgres)** prin ruta API `/api/feedback`. `FEEDBACK_FORM_TALLY.md` → `FEEDBACK_DB_SETUP.md`. |

---

## 1. Scop

Promovarea demo-ului REVYX ca să găsim **testeri** (agenți / agenții imobiliare din RM) și să colectăm **cât mai mult feedback**, cu **implicarea fondatorului aproape de zero**.

Diferența față de kit-ul de validare (VAL-01, interviuri 1:1 conduse de o persoană): aici demo-ul se **auto-explică** și **cere singur feedback**. Testerul intră pe link, primește un ghid de 2 minute, explorează, iar la final (sau după ce a văzut destule ecrane) i se cere feedback printr-un formular. Nimeni nu trebuie să fie prezent la un apel.

## 2. Principiul „Founder Firewall"

Fondatorul **nu** participă la apeluri, demo-uri live, onboarding sau discuții 1:1 cu agențiile. Rolul lui este redus la:
- (opțional) aprobarea conținutului promo înainte de publicare;
- setarea unică a conturilor pe care doar el le poate crea (Supabase, rețele sociale) — pași de ~10 min descriși în `EXECUTION_PLAN.md` + `FEEDBACK_DB_SETUP.md`.

Tot restul — conținut, mecanism de feedback, sinteză răspunsuri — e produs de Directorul Marketing (Claude).

## 3. Conținut kit (4 fișiere)

| # | Fișier | Ce este | Cine îl folosește |
|---|---|---|---|
| 1 | `README.md` | Acest index + principiul de operare | Referință |
| 2 | `FEEDBACK_DB_SETUP.md` | Formularul nativ (întrebări) + setup bazei de date Supabase (SQL tabel + env var Vercel) + cum vezi/exporți răspunsurile | Fondator (setup ~10 min), apoi automat |
| 3 | `PROMO_CONTENT_PACK.md` | Tot conținutul de promovare, copy-paste RO/RU: WhatsApp, grupuri Facebook, Telegram, LinkedIn, follow-up | Fondator lipește pe canale (2 min/canal) |
| 4 | `EXECUTION_PLAN.md` | Secvența de lansare + checklist setup unic + cadență săptămânală + cum ajunge feedback-ul la sinteză | Director Marketing (owner) |

## 4. Fluxul de la zero la feedback

```
[setup unic ~30 min, fondator]
   Creează proiect Supabase + rulează SQL tabel (FEEDBACK_DB_SETUP §1-§2)
   → setează SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY în Vercel → redeploy
   Confirmă link public demo (Vercel)
   │
[promovare, fondator lipește ~2 min/canal]
   PROMO_CONTENT_PACK → WhatsApp + 2-3 grupuri FB + Telegram + LinkedIn company page
   │
[testerul, singur, fără apel]
   Deschide link → Ghid bun-venit 2 min → explorează 26 ecrane → buton/nudge feedback → formular nativ
   │
[colectare automată]
   Formular nativ → ruta /api/feedback → tabelul Supabase `feedback`
   │
[sinteză, Director Marketing]
   Citește răspunsurile (Supabase Table Editor / export CSV) → praguri VAL-01 SUCCESS_CRITERIA §1 → re-prioritizează M1.S4-S6
```

## 5. Mecanismul de feedback din demo (deja implementat în cod)

Integrat global în `apps/web-preview/` (o singură dată, apare pe toate cele 26 ecrane):
- **Ghid de bun-venit** (prima vizită) — 4 pași de auto-explorare, RO/RU/EN. `components/feedback/welcome-guide.tsx`.
- **Buton feedback plutitor** — mereu vizibil jos-dreapta. `components/feedback/feedback-widget.tsx`.
- **Nudge automat** — apare după ce testerul a văzut ≥ 4 ecrane distincte, o singură dată. Idem.
- **Formular nativ** — în stilul demo-ului (Modal + rating 1-5 + textarea), RO/RU/EN. `components/feedback/feedback-form.tsx`.
- **Rută API + bază de date** — `app/api/feedback/route.ts` scrie în Supabase (Postgres); validare `lib/feedback-payload.ts`.
- **Stare locală** — `lib/feedback-store.ts` (localStorage, nu insistă după ce a dat feedback / a închis).
- **Config** — `lib/feedback-config.ts` (opțiuni rol + scală rating + prag nudge).

## 6. Reguli de conținut respectate
- Fără promisiuni de features inexistente — doar demo (26 ecrane) + roadmap aprobat.
- Formulele de scoring rămân ascunse — vorbim în beneficii (prioritate, direcție, stare), nu acronime (Regula 11).
- Ton brand profesional (`brand-configs/revyx.md` §7).
- GDPR / Legea 133 — date de contact colectate doar cu acord, minimizare, oprire la cerere (BR-06).

## 7. Cross-references
- `docs/marketing/MARKET_VALIDATION_KIT_REVYX_v1.0.0/` — kit interviuri 1:1 (complementar; SUCCESS_CRITERIA reutilizat la sinteză)
- `docs/marketing/MARKETING_STRATEGY_REVYX_v1.0.0.md` §5 canale · §4 messaging house
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/` — context extins

---

*docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/README.md · v1.1.0 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
