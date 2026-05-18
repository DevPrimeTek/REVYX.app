# PITCH DECK — REVYX M0 (Index)
<!-- docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/README.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** M0.S4 — Pitch Deck + Video Walkthrough (T-M0.S4-01..04)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 M0.S4 (AC-M0-04)
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.4.md` §3.4 T-M0.S4-01..04

## 0.1 Platform Matrix

Pitch deck content surfacează exclusiv flow-ul **🌐 WEB** (apps/web-preview/, Next.js demo). Mobile companion mențiunat doar la **slide 11 Roadmap** ca livrabil M2.S3. Toate screen mock-ups corespund pe `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §17 (41% Web-only / 55% Both — admin features 🌐 only per DP-05).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DOC + DESIGNER (Creative Director) + ARCHITECT + Senior PM | ★ INITIAL — 16 slides RO/RU/EN cu speaker notes RO, screenshot references către `design/screenshots/` + `apps/web-preview/` URL-uri. Închide T-M0.S4-01 (structură), T-M0.S4-02 (RO), T-M0.S4-03 (RU), T-M0.S4-04 (EN), T-M0.S4-05 (speaker notes). |

---

## 1. Scop deck

Document de pitch pentru:
- **Investitori seed/pre-seed** — focus market RM + AOS differentiation + ask
- **Clienți enterprise pilot (Moldova)** — focus demo flow + RBAC + GDPR
- **Parteneri tehnologici** — focus arhitectură + roadmap M1/M2

**Durată live ţintă:** 15-18 minute (incl. Q&A 5 min) · **Slides:** 16

---

## 2. Structură deck (16 slides)

| # | Slide | Categorie | Visual cheie | Speaker time |
|---|---|---|---|---|
| 01 | Cover — REVYX | Hook | Logo + claim + URL demo | 30s |
| 02 | Problema | Problem | Statistici industrie RM + cifre pierderi | 60s |
| 03 | Soluția — REVYX AOS | Solution | "AOS, nu CRM" + 4 diferențiatori | 60s |
| 04 | Piața RM + extensii | Market | Map RM + cifre agenții + extensii Phase 5 | 45s |
| 05 | 5 piloni AI | Product (overview) | Diagrama 5 piloni Lead → Property → NBA → Deal → Performance | 60s |
| 06 | Demo — Lead Score & Firewall (J1) | Product (demo) | Screenshot `/leads` + `/leads/[id]` | 75s |
| 07 | Demo — Property & Match (J2) | Product (demo) | Screenshot `/properties` + `/properties/new` | 60s |
| 08 | Demo — Deal Pipeline (J3) | Product (demo) | Screenshot `/deals` kanban drag-drop | 75s |
| 09 | Demo — Manager Command (J4) | Product (demo) | Screenshot `/manager` + `/manager/escalations` | 60s |
| 10 | Arhitectură Web + Mobile | Tech | Diagrama Web primary 80% + Mobile companion 20% | 45s |
| 11 | Securitate & GDPR | Trust | Phase 0 checklist + AUDIT_LOG + 5 RBAC roles | 45s |
| 12 | Business Model | Business | SaaS tiers Starter / Pro / Enterprise + White-Label | 60s |
| 13 | Roadmap M0 → M1 → M2 | Plan | Timeline cu M0 ✅ + M1 pilot + M2 GA + retention | 60s |
| 14 | Tracțiune & Echipa | Team | Stage M0 livrat + echipa virtuală 11 hats | 45s |
| 15 | Ask | Close | Cifră investiție / programs pilot · contact PM | 45s |
| 16 | Mulțumiri & Q&A | Close | Logo + email + URL demo + LinkedIn | 30s |

**Total speaker time (continuous):** ~14:30 min · **Q&A buffer:** 5 min · **Marja:** ~3 min.

---

## 3. Fișiere livrate

| Limbă | Fișier | Status |
|---|---|---|
| Română (primary) | `deck-ro.md` | ★ NEW |
| Rusă | `deck-ru.md` | ★ NEW |
| Engleză | `deck-en.md` | ★ NEW |
| Speaker notes RO | inline în `deck-ro.md` (per slide `> _Speaker note:_`) | ★ NEW |
| Screenshot refs | `assets/SCREENSHOT_REFS.md` — mapping slide → screen capture | ★ NEW |

**Notă render PDF:** Markdown-to-PDF la export folosește aspect 16:9 cu paletă brand revyx.md (navy `#0C1428` + gold `#C9870A`). Tool sugerat: `marp-cli` sau Pandoc cu template Beamer. Export e tracked T-M0.S4-08 (opțional în M0.S4; deferrabil M0.S5).

---

## 4. Cross-references

- `docs/BRD_REVYX_v1.1.0.md` §1 Executive Summary · §5 7 piloni · §6 BR-XX
- `docs/brand-configs/revyx.md` § paletă + claim + ton
- `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §17 statistici
- `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 M0.S4 + §5 M1 + §6 M2
- `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — companion video deliverable
- `docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md` — capture instructions
- `apps/web-preview/` — demo source (Vercel deploy demo.revyx.app upon DNS step)
- `design/screens-inventory.md` — 18 screens prioritized

---

## 5. Open decisions (PM)

| ID | Issue | Impact | Resolution path |
|---|---|---|---|
| OD-M0.S4-01 | Cifră investiție slide 15 (Ask) — TBD | BLOCKING export PDF | PM input pre-pitch sessions |
| OD-M0.S4-02 | URL demo public — depinde de T-M0.S3-14 DNS | DEMO LINK în slide 01 + 16 | DevOps action Runbook v1.0.2 §2.3 |
| OD-M0.S4-03 | Logo asset path canonical | Slide 01 + 16 visual | Designer source `design/brand/logo.svg` (TBD) |
| OD-M0.S4-04 | Echipa fondatori — nume + titluri slide 14 | Slide 14 content | PM input pre-pitch |

---

*docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/README.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
