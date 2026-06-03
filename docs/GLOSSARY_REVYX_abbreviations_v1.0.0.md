# GLOSAR — REVYX Abrevieri, Acronime și Coduri
<!-- GLOSSARY_REVYX_abbreviations_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + DOC + Audit Lead | Initial — consolidare exhaustivă a tuturor abrevierilor, acronimelor și codurilor scurte utilizate în documentația REVYX (CLAUDE.md + BRD + MASTER_PLAN + PLATFORM_MATRIX + ROADMAP + 25 TECH_SPEC + 9 WORKFLOW + 11 RUNBOOK + audit + marketing + legal). 226 termeni unici grupați pe 14 categorii + quick A-Z lookup. Sursă: harvest sistematic via grep + cross-verificare cu BRD §15 + CLAUDE.md §12. |

---

## 0. Stage Master Plan

**Acoperă:** transversal pe toate macro-milestone-urile (M0/M1/M2) — document de referință permanent. Nu aparține unui sub-stage anume; servește ca lexicon comun pentru orice cititor (PM, dev, auditor extern, legal counsel, stakeholder) care întâlnește un acronim într-un alt document.

**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` — toate fazele.
**BRD ref:** `BRD_REVYX_v1.1.0.md` §15 Glosar (extins aici cu toate codurile non-business).
**CLAUDE.md ref:** §4 (BR-XX critice) + §12 (glosar minim) + §10b (regulile operaționale R-01..R-19).

## 0.1 Platform Matrix

🔧 **Backend & docs (nicio interfață vizuală).** Glosarul e un fișier text intern utilizat de PM/dev/auditori; nu se randează în UI agent (Web) sau Mobile.

---

## Cuprins

1. [Convenții de utilizare](#1-convenții-de-utilizare)
2. [Scoruri & metrici AOS](#2-scoruri--metrici-aos)
3. [Business Rules (BR-XX)](#3-business-rules-br-xx)
4. [Non-Functional Requirements (NFR-XX)](#4-non-functional-requirements-nfr-xx)
5. [Reguli operaționale Claude (R-01..R-19)](#5-reguli-operaționale-claude-r-01r-19)
6. [Acceptance Criteria (AC-XX)](#6-acceptance-criteria-ac-xx)
7. [Findings & Open Decisions (F-XXX / OD-XX)](#7-findings--open-decisions-f-xxx--od-xx)
8. [Roadmap codes (Milestones, sub-stages, tasks)](#8-roadmap-codes-milestones-sub-stages-tasks)
9. [Document type prefixes](#9-document-type-prefixes)
10. [Roluri & companii](#10-roluri--companii)
11. [Tech stack & securitate](#11-tech-stack--securitate)
12. [Canale & integrări](#12-canale--integrări)
13. [Phase 5 (Marketplace, Churn, White-Label)](#13-phase-5-marketplace-churn-white-label)
14. [Compliance & legislație](#14-compliance--legislație)
15. [Geo · Currency · Timezone](#15-geo--currency--timezone)
16. [Quick lookup A-Z](#16-quick-lookup-a-z)
17. [Surse & cross-references](#17-surse--cross-references)
18. [Aprobare](#18-aprobare)

---

## 1. Convenții de utilizare

| Convenție | Detaliu |
|---|---|
| **Domeniu de validitate** | Acronimele listate sunt canonice pentru întreaga documentație REVYX (BRD, TECH_SPEC, WORKFLOW, RUNBOOK, audit, marketing, legal). Orice doc nou care introduce un acronim **trebuie** să-l înregistreze aici (Regula 6 INDEX update + extensie glosar). |
| **Forma scrisă** | Acronimele rămân în engleză (LS, NBA, JWT) chiar și în text românesc — cf. Regula 11 (Puritate i18n), excepții acronime tehnice. Pluralul: `LS-uri`, `BR-uri` (silver-dash). |
| **Litere mari** | Toate acronimele se scriu **integral cu majuscule** în text (LS, nu Ls). Excepție: tag-uri kebab-case în cod (`lead_score`) sau în filename (`lead-scoring`). |
| **Sinonime / variante** | În cazul în care există echivalent RO autohton (CRM = Sistem de Gestionare a Clienților), forma RO **nu se folosește** în doc tehnic; UI agent randa label-uri prietenoase per Regula 11. |
| **Coduri compozite** | `BR-04`, `T-M1.S2-03`, `F-M0S5-01` — toate au format `PREFIX-SCOPE-INDEX` strict; nu se admit variații (`BR04`, `T_M1S2_03`). |
| **Versioning** | Glosarul respectă semantic versioning (Regula 18 — single living document). Bump PATCH la adăugare ≤5 termeni; MINOR la adăugare categorie nouă sau ≥10 termeni; MAJOR la rescriere structurală. |

---

## 2. Scoruri & metrici AOS

Toate scorurile sunt ∈ **[0, 1]** **cu o singură excepție**: `NBA ∈ [0, 2.0]` (BRD §7.5).

| Acronim | Denumire completă | Domeniu | Definiție | Sursă |
|---|---|---|---|---|
| **LS** | Lead Score | [0,1] | Indicator calitate potențial client. `LS_initial = 0.30` la creare (BR-02). Praguri SLA: HOT ≥0.75 · calificat 0.60-0.75 · warm 0.40-0.60 · rece <0.40. | BRD §7.1 · CLAUDE.md §12 |
| **PS** | Property Score | [0,1] | Calitate proprietate în portofoliu — derivat din caracteristici intrinseci + istoricul vânzării. Penalizat de LF când anunț e vechi. | BRD §7.2 |
| **IS** | Interaction Strength | [0,1] | Forța conexiunii dintre lead și proprietate; calculat din ACTIVITY istorice (vizionări, mesaje, clicks). | BRD §7.3 |
| **DP** | Deal Probability | [0,1] | Probabilitate de închidere a tranzacției; LS+PS+IS triple cosine în Match Engine v1. | BRD §7.4 |
| **NBA** | Next Best Action | **[0, 2.0]** | Acțiune recomandată de sistem pentru agent; **unica excepție de scală** la BRD §7.5. Formula include `e^(-age_zile/100)` decay. | BRD §7.5 · CLAUDE.md §4 |
| **TS** | Trust Score | [0,1] | Încrederea pe care clienții o au în agent; derivat din rating deal-uri închise + retenție clienți. | BRD §7.6 |
| **APS** | Agent Performance Score | [0,1] | Performanța generală a agentului; `APS_default = 0.65` pentru agenți cu <5 deal-uri SAU <30 zile (BR-11). | BRD §7.7 · CLAUDE.md §4 |
| **DHI** | Deal Health Index | [0,1] | Sănătatea tranzacției în pipeline; compozit TF + RF + LS + PS. `TF_default = 0.70` când `expected_close_date IS NULL` (BR-10). | BRD §7.8 |
| **LF** | Listing Freshness | [0,1] | Recența anunțului; formula `1 − min(1, zile/90)` — penalizare după 90 zile. UI prietenos: "Anunț nou / De reîmprospătat / Necesită atenție" (M0.S6). | BRD §7.2 · CLAUDE.md §12 |
| **TF** | Time Factor | [0,1] | Subcomponentă DHI; reflectă urgența temporală a deal-ului. Default 0.70 (BR-10). | BRD §7.8 |
| **UF** | Urgency Factor | [0,1] | Subcomponentă NBA; ponderează acțiuni cu deadline iminent. | BRD §7.5 |
| **RF** | Risk Factor | [0,1] | Subcomponentă DHI; reflectă probabilitatea de derailare a deal-ului. | BRD §7.8 |
| **Churn Score** | Churn Probability | [0,1] | Probabilitate renunțare subscripție tenant/agent în 30/60 zile. Risk band ∈ {LOW, MEDIUM, HIGH, CRITICAL} cu praguri <0.20 / 0.20-0.45 / 0.45-0.70 / ≥0.70 (BR-14). NU partajat cu agentul subiect (BR-18). | BRD §15 v1.1 · TECH_SPEC churn-ga |
| **Prevention Rate** | Rată Prevenție Churn | [0,1] | KPI Phase 5: `retained_90d / flagged_medium_plus`; target ≥30% rolling 90d cohort (BR-17). | BRD §6.4 · CLAUDE.md §0a |
| **Scale clamp** | — | [0,1] sau [0,2] | Toate scorurile **clamp explicit la output** — niciun score negativ, niciun score peste pragul superior. Optimistic locking via `version` field pe entitățile cu scoruri. | CLAUDE.md §9 |

**Test fixtures referință:** T01..T07 în `apps/api/src/scoring/fixtures.ts` — inputs + expected + brdRef per fiecare formulă (10 tests PASS M1.S2).

---

## 3. Business Rules (BR-XX)

| Cod | Regulă | Prioritate | Sursă |
|---|---|---|---|
| **BR-01** | **Lead Firewall**: doar lead-uri cu LS ≥ 0.60 + contact valid ajung la agent | CRITIC | BRD §6.1 |
| **BR-02** | `LS_initial = 0.30` la creare lead (NU 0 — penalizează nedrept) | RIDICAT | BRD §7.1 |
| **BR-03** | **Escalation Protocol** 3 niveluri: T+SLA → T+SLA+30min → T+SLA+2h | RIDICAT | BRD §5 Pilon 04 |
| **BR-04** | **Maximum 3 task-uri active** per agent în orice moment; trigger PL/pgSQL `task_enforce_max_3_active` în `0012_tasks.sql` | CRITIC | BRD §6.1 |
| **BR-05** | Re-matching trigger → `needs_review=true` · **deal-urile NU se anulează automat** | RIDICAT | BRD §5 Pilon 03 |
| **BR-06** | **GDPR consent** capturat și stocat la intake orice lead | CRITIC | BRD §9.4 |
| **BR-07** | **AUDIT_LOG append-only** pentru toate WRITE-urile; trigger PL/pgSQL `audit_log_block_modify` + REVOKE UPDATE/DELETE pe rol `revyx_app` (defense-in-depth) | CRITIC | BRD §8 · TECH_SPEC audit-log v1.1.1 |
| **BR-08** | (Rezervat — nu apare în v1.1.0) | — | — |
| **BR-09** | WhatsApp notification `offer_received` + push notification (offer chain) | RIDICAT | TECH_SPEC offer-engine v1.0.0 |
| **BR-10** | `TF_default = 0.70` când `expected_close_date IS NULL` | RIDICAT | BRD §7.8 |
| **BR-11** | `APS_default = 0.65` pentru agenți cu <5 deal-uri SAU <30 zile vechime | RIDICAT | BRD §7.7 |
| **BR-12** | **Single session per agent** · forțare logout la password change (revoke toate refresh tokens) | CRITIC | BRD §9.1 |
| **BR-13** | Churn score calculat săptămânal per tenant + agent activ; recompute la `subscription.changed` sau `usage.spike` | RIDICAT | BRD §6.4 (v1.1) |
| **BR-14** | Risk band ∈ {LOW, MEDIUM, HIGH, CRITICAL} cu praguri prob30d: <0.20 / 0.20-0.45 / 0.45-0.70 / ≥0.70 | RIDICAT | BRD §6.4 |
| **BR-15** | Semnalare MEDIUM+ generează `churn_cs_task` cu SLA: CRITICAL 24h · HIGH 72h · MEDIUM 168h | RIDICAT | BRD §6.4 |
| **BR-16** | Decizia churn = **suport** pentru CS · NICIUN decizionalism automat (Art. 22 GDPR) · human-in-the-loop obligatoriu | CRITIC | BRD §6.4 |
| **BR-17** | Outcome verificat la 90 zile post-flag (auto-job) → KPI Prevention Rate calculat strict pe `outcome=RETAINED` | RIDICAT | BRD §6.4 |
| **BR-18** | Churn score-ul **nu** este partajat cu agentul subiect — comunicare CS doar la nivel "risc retenție" în conversație; RLS verification E2E mandatory | CRITIC | BRD §6.4 |
| **BR-19** | Tenant cu `plan_tier=ENTERPRISE` poate revendica un domeniu custom; verificare CNAME + TLS provision automat | RIDICAT | BRD §11 (v1.1) |
| **BR-20** | Plan downgrade (ENTERPRISE → BUSINESS) auto-revocă rolurile `tenant_admin` (cron `tenant_plan_downgrade_audit`) și suspendă domeniul custom | CRITIC | BRD §11 |
| **BR-21..BR-24** | Phase 5 specific (tenancy-roles, marketplace contact-grant, white-label DKIM rotation) | RIDICAT/CRITIC | BRD §10-11 + TECH_SPEC marketplace/white-label |

---

## 4. Non-Functional Requirements (NFR-XX)

| Cod | Cerință | Target | Test |
|---|---|---|---|
| **NFR-01** | Recalc cascade LS/PS/IS/DP după event | p95 ≤ 30 sec end-to-end | Load test 15.4 |
| **NFR-02** | Webhook intake → lead în coadă | p95 ≤ 2 minute | E2E AC-LF-01 |
| **NFR-03** | Recalc DHI per deal | ≤ 10 minute | E2E AC-DHI-04 |
| **NFR-04** | Analytics dashboard refresh | ≤ 1 minut | E2E AC-SL-04 |
| **NFR-05** | Rate limiting endpoint-uri publice (auth, webhook) | 60 req/min/IP webhook · 20 req/min auth | TECH_SPEC webhook-intake §15.3 |
| **NFR-06** | Rate limiting per source per tenant | 300 req/min | TECH_SPEC webhook-intake |
| **NFR-07** | Rate limit Showcase Link `/p/:token` | 20 req/h/IP · block 60min | TECH_SPEC showcase-links §15.4 |
| **NFR-08** | Availability platform | 99.5% lunar (M1) · 99.9% (M2 GA) | SRE monitor |
| **NFR-09** | JWT lifetime: access 15min · refresh 7 zile + rotație | enforced + replay detection | TECH_SPEC phase0-security |
| **NFR-10** | GDPR retention default | 3 ani · enforced via saga BullMQ | E2E deal-closure |
| **NFR-11** | Backup + DR RPO/RTO | RPO ≤ 1h · RTO ≤ 4h | RUNBOOK dr-test |

---

## 5. Reguli operaționale Claude (R-01..R-19)

Toate sunt în `CLAUDE.md §10b`. Listate aici pentru reference rapidă.

| Cod | Numele regulii | Scop |
|---|---|---|
| **R-01** | Prompts în chat | Toate prompturile/rezumatele de sesiune **doar în chat** — nu în CLAUDE.md/README/repo |
| **R-02** | Senior Architect + PM + Tester | Claude self-review pass înainte de marcare task complet |
| **R-03** | Audit checkpoints recurente | 7-rol audit team la fiecare etapă majoră (Audit Lead + Architect + Security + DBA + QA + Compliance + Product) |
| **R-04** | Verificare finală post-commit | Re-citire integrală + cross-ref integrity + formule scoring + schema BD + audit-log catalog + approval gate |
| **R-05** | Prompt next session | Format strict pentru `/sN+1`: Branch + Model recomandat + Context + Task + Files + Deliverables + Operating rules |
| **R-06** | INDEX documents update | Orice doc nou → entry în `INDEX_REVYX_documents` cu descriere ≤10 rânduri + bump PATCH/MINOR |
| **R-07** | Roluri operaționale (11 hats) | ARCHITECT + BACKEND DEV + FRONTEND WEB DEV + MOBILE DEV + DBA + TESTER + SECURITY + DEVOPS + ML ENGINEER + DESIGNER + DOC; max 2-3 hats simultan |
| **R-08** | Master Plan compliance | Orice doc/cod citează în header `## 0. Stage Master Plan` cu sub-stage explicit |
| **R-09** | Platform Matrix compliance | Orice spec UI-touching cross-ref `PLATFORM_MATRIX` + tag 🌐 WEB / 📱 MOBILE / 🔁 BOTH / 🔧 Backend |
| **R-10** | Deployment verification mandatory | Pre-commit checks Vercel Root Directory + post-deploy verification + Tests primary status report obligatoriu |
| **R-11** | Puritate i18n RO/RU/EN | Fără anglicisme când există echivalent autohton (Dashboard→Panou; Queue→Listă); excepție acronime tehnice (LS/NBA/GDPR/RBAC) |
| **R-12** | Disciplina interacțiunilor layout | Static stays static · Dynamic responds. `:hover` doar pe `cursor: pointer/grab` cu rol semantic |
| **R-13** | In-app tutorial / onboarding | Fiecare pagină principală `<TutorialOverlay screenId="...">` cu max 3-5 hotspots + i18n RO/RU/EN |
| **R-14** | Verificare overlap layout | Manual smoke test 3 viewport-uri (1920×1080 · 1440×900 · 1024×768); visual regression Playwright sugerat M1.S5+ |
| **R-15** | Routare model per tip task | Sonnet = dezvoltare/programare/ajustare · Opus = analiză/refactoring/audit/arhitectură |
| **R-16** | Întrebări exacte cu opțiuni | Format 4-pași: ambiguitate + 2-4 opțiuni mutually exclusive + recomandare + scope REVYX strict |
| **R-17** | Optimizare token la generare prompt | Target <2000 tokens/prompt · cross-refs prin acronim · max 5-7 files to read |
| **R-18** | Single living document, no version proliferation | Doc bump = `Edit` (nu `Write`) + `git mv` la noul filename · niciodată două versiuni paralele simultan |
| **R-19** | Segregare buyer/seller pentru Lead | `leadType` NOT NULL ∈ {buyer, seller} · `selling_property_id` FK obligatoriu seller · UI distinct (BuyerPreferencesPanel vs SellerPropertyPanel) |

---

## 6. Acceptance Criteria (AC-XX)

| Prefix | Interval | Scop | Sursă |
|---|---|---|---|
| **AC-M0-XX** | AC-M0-01..07 | M0 (MVP Prezentare) exit gate — Design System + Clickable + Demo + Pitch + HST | MASTER_PLAN §3 |
| **AC-M1-XX** | AC-M1-01..10 | M1 (MVP Funcțional) — Phase 0 Security + Phase A Foundation + Phase B engines + Phase C UI wire-up | MASTER_PLAN §4 |
| **AC-M2-XX** | AC-M2-01..11 | M2 (FULL Release GA) — Phase 5 (marketplace, churn, white-label, mobile) | MASTER_PLAN §5 |
| **AC-BUYER-XX** | AC-BUYER-01..XX | Marketplace buyer profile (Phase 5 marketplace-two-sided) | TECH_SPEC marketplace |
| **AC-CHURN-XX** | AC-CHURN-01..05 | Churn engine + Prevention Rate KPI + BR-18 RLS test | TECH_SPEC churn-ga |
| **AC-DC-XX** | AC-DC-01..XX | Deal closure flow (8 document types + closure_phase) | TECH_SPEC deal-closure |
| **AC-DHI-XX** | AC-DHI-01..04 | DHI engine recompute + TF default + edge cases | TECH_SPEC dhi-engine |
| **AC-ESC-XX** | AC-ESC-01..XX | Escalation protocol BR-03 3 niveluri | WORKFLOW escalation |
| **AC-LF-XX** | AC-LF-01..XX | Listing Freshness cron + lead intake p95 ≤ 2min | TECH_SPEC lead-scoring + webhook-intake |
| **AC-LS-XX** | AC-LS-01..XX | Lead Score recompute + LS_initial = 0.30 + Lead Firewall ≥0.60 | TECH_SPEC lead-scoring |
| **AC-SH-XX** | AC-SH-01..02 | SHOWING flow + LS recompute trigger ≤ 30s | TECH_SPEC showing + WORKFLOW showing-flow |
| **AC-SL-XX** | AC-SL-01..04 | Showcase Link `/p/:token` + analytics + rate limit | TECH_SPEC showcase-links |
| **AC-WL-XX** | AC-WL-01..XX | White-Label tenant onboarding + DKIM/CNAME provision | TECH_SPEC white-label + WORKFLOW white-label-onboarding |

---

## 7. Findings & Open Decisions (F-XXX / OD-XX)

### 7.1 Findings (F-XXX)

| Cod | Severitate | Sursă | Descriere scurtă | Status |
|---|---|---|---|---|
| **F-S20-XX** | mixed | HST_REVYX_pre-dev_v1.0.0.md | 13 findings consolidate Phase 5 (4 RESOLVED + 9 TRACKED) | mostly CLOSED |
| **F-S20-04** | RESOLVED | Audit S20 | Component half pre-fix | ✅ CLOSED M0.S1 |
| **F-S20-08** | TRACKED | Audit S20 | NFR clarification | TRACKED → M1.S2 closed cu Master Plan §11 |
| **F-S20-09** | TRACKED | Audit S20 | Token tier upgrade Pro→Max (CFO sign-off pending) | ⏳ M1.S3 entry |
| **F-S20-10** | RESOLVED | Audit S20 | DP-06 brand parity | ✅ CLOSED M0.S1 |
| **F-M0S5-XX** | 2 HIGH + 6 MED + 9 LOW | HST_REVYX_m0_v1.0.0.md | 17 findings M0 EXIT GATE audit | 2 HIGH ✅ FIXED · resturi MED/LOW tracked M1.S5+ |
| **F-M0S5-01** | HIGH | HST M0 | Card hover interactive fără role semantic (R-12) | ✅ FIXED `interactive` prop opt-in |
| **F-M0S5-02** | HIGH | HST M0 | i18n 30 RO + 14 RU keys cu anglicisme (R-11) | ✅ FIXED retraduceri complete |
| **F-M0S5-03..09** | MED | HST M0 | UX clarity + property detail + manager acronime | ⏳ TRACKED M1.S5 |
| **F-M0S5-10..17** | LOW | HST M0 | 9 findings forward-applying, pre-existing, non-blocking | 📋 BACKLOG |

### 7.2 Open Decisions (OD-XX)

| Cod | Categoria | Descriere | Status |
|---|---|---|---|
| **OD-01** | Design | Font discrepancy — brand-config Bebas Neue vs AC-M0-02 Inter | ⏳ NON-BLOCANT M0+ |
| **OD-02** | Design | Spacing grid baseline 8px vs 4px | ⏳ NON-BLOCANT M0+ |
| **OD-03** | Design | Dark mode stance — M0-M1 single dark vs adaptive | ⏳ NON-BLOCANT M1+ |
| **OD-i18n-01** | i18n | Glosar oficial scoring RO/RU: LS=Scor Lead vs păstrare EN abreviat. Recomandare DESIGNER+DOC: Opțiune C hybrid (long-form RO/RU + acronim EN inline badge) | ⏳ PENDING PM |
| **OD-M0.S4-01** | Marketing | Cifră investiție pentru pitch deck | ⏳ BLOCKING T-M0.S4-08 PDF |
| **OD-M0.S4-02** | Marketing | URL demo final (`demo.revyx.app` DNS vs Vercel default) | ⏳ BLOCKING T-M0.S4-08 PDF |
| **OD-M0.S4-03** | Marketing | Logo asset path | ⏳ BLOCKING T-M0.S4-08 PDF |
| **OD-M0.S4-04** | Marketing | Echipa fondatori (deck listing) | ⏳ BLOCKING T-M0.S4-08 PDF |
| **OD-legal-01..05** | Legal/GDPR | DPO designation · vendor SCC · CNPDCP registration · Legea 133/2011 retention · DPIA Art. 35 · analytics tool privacy | ⏳ PENDING legal consultant |
| **OD-cookie-01..03** | Privacy/Cookie | Cookie banner UX · third-party whitelist · consent persistence storage | ⏳ PENDING legal review |
| **OD-mkt-01..08** | Marketing | Social strategy · landing page · SEO · email nurture · paid ads budget (Mkt-M1) | ⏳ PENDING CMO |

---

## 8. Roadmap codes (Milestones, sub-stages, tasks)

### 8.1 Milestones

| Cod | Nume | Status | Conținut |
|---|---|---|---|
| **M0** | MVP Prezentare | ✅ CLOSED | Design System → Clickable → Demo → Pitch → HST M0 EXIT GATE atins |
| **M1** | MVP Funcțional | ★ ACTIVE | Phase 0 Security ✅ + Phase A Foundation ✅ + Phase B engines next |
| **M2** | FULL Release GA | (planned) | Phase 5 (marketplace, churn, white-label, mobile companion) |

### 8.2 Sub-stages (M0.S1..M0.S7, M1.S1..M1.S8+)

| Cod | Scop | Status |
|---|---|---|
| **M0.S1** | Design System direct-to-code | ✅ CLOSED |
| **M0.S2** | Clickable Prototype (4 user journeys) | ✅ CLOSED |
| **M0.S3** | Web Static Demo (mock data 100/50/20) | ✅ CLOSED |
| **M0.S4** | Pitch Deck + Video Walkthrough | ✅ CLOSED |
| **M0.S5** | Hard Stress Test M0 + findings audit | ✅ CLOSED |
| **M0.S6** | Demo Polish (ascundere formule + cabinet + property detail) | ✅ CLOSED |
| **M0.S7** | Dashboard rework + task management + lead notes/documents + cabinet enrichment | ✅ CLOSED |
| **M1.S1** | Phase 0 Security Foundation (JWT RS256 + RBAC + GDPR + AUDIT_LOG + HMAC + Throttler) | ✅ CLOSED |
| **M1.S2** | Phase A Foundation (9 migrations + 9 schemas + 7 REST CRUD modules + scoring fixtures T01-T07) | ✅ CLOSED |
| **M1.S3** | Phase B Lead Intake + Scoring engines (webhook intake + LS/PS/IS/LF compute + Escalation cron + GDPR erasure BullMQ) | ★ NEXT |
| **M1.S4** | Phase B+ Match Engine v1 + NBA Engine + BR-04 task assignment | planned |
| **M1.S5** | Phase C UI Web wire-up real API + WhatsApp 5 templates + Showcase Link + JWKS rotation | planned |
| **M1.S6** | Billing + plan tiers + Stripe integration | planned |
| **M1.S7** | White-Label foundation (DKIM provision + tenant admin console) | planned |
| **M1.S8** | Mobile companion entry (React Native scaffold) | planned |

### 8.3 Pre-development stages

| Cod | Scop | Status |
|---|---|---|
| **S1..S15** | BRD + PRD + TECH_SPEC + WORKFLOW + Phase 5 specs | ✅ CLOSED |
| **S16..S20** | Phase 5 hardening + Hard Stress Test #2 | ✅ CLOSED (HST #2 PASS clean) |

### 8.4 Atomic tasks (T-XXX)

Format: `T-<MILESTONE>.<SUBSTAGE>-<INDEX>` (ex: `T-M1.S2-03`). Listate per sub-stage în `ROADMAP_REVYX_detailed-execution_v1.0.13.md`. Total: ~308 tasks · ~122-164 sesiuni estimate.

Status legend:
- ☑ = done
- ◐ = deferred / partial
- ☐ = pending

### 8.5 Mkt-M1 (Marketing track paralel)

| Cod | Interval | Scop |
|---|---|---|
| **T-Mkt-001..028** | T+0 → T+30 | Foundation (infrastructure + brand asset library + 3 articole seed + 4 lead magnets L1-L4) |
| **T-Mkt-029..047** | T+30 → T+90 | Build-up (8 articole + 2 webinare + 16 outreach earned media + beta page draft) |
| **T-Mkt-048..068** | T+90 → T+150 | Beta Acquisition (3 cohorts cumulativ 80 agenți + 5 case studies + L5-L8 magnets) |
| **T-Mkt-069..087** | T+150 → T+210 | Launch Prep (PR embargo 5 outlets + pricing page + beta→paid conversion + GA launch week) |

---

## 9. Document type prefixes

| Prefix | Nume complet | Locație | Exemplu |
|---|---|---|---|
| **BRD** | Business Requirements Document | `docs/BRD_*.md` | `BRD_REVYX_v1.1.0.md` (piloni 8, formule §7.1-7.8, BR-01..24, NFR-01..11) |
| **PRD** | Product Requirements Document | `docs/prd/` | (Phase 5+) per modul |
| **TECH_SPEC** | Technical Specification | `docs/tech-spec/` | 25 specs (phase0-security, lead-scoring, match-engine, churn-ga, white-label, etc.) |
| **WORKFLOW** | Workflow & Process Maps | `docs/workflow/` | 9 workflows (lead-lifecycle, escalation, deal-closure, showing-flow, etc.) |
| **RUNBOOK** | Operational playbook | `docs/runbook/` | 11 runbooks (demo-deploy, dr-test, incident-response, phase5-rollout-sequence, etc.) |
| **HST** | Hard Stress Test report | `docs/audit/` | `HST_REVYX_m0_v1.0.0.md` (audit 9 categorii, findings F-M0S5-01..17) |
| **INDEX** | Document Catalog | `docs/INDEX_*.md` | `INDEX_REVYX_documents_v1.1.19.md` (living catalog 11 categorii) |
| **GLOSSARY** | Lexicon proiect | `docs/GLOSSARY_*.md` | **acest document** — consolidare termeni |
| **MASTER_PLAN** | Execution roadmap | `docs/MASTER_PLAN_*.md` | `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` |
| **ROADMAP** | Detailed atomic tasks | `docs/ROADMAP_*.md` | `ROADMAP_REVYX_detailed-execution_v1.0.13.md` |
| **PLATFORM_MATRIX** | Feature × platform mapping | `docs/PLATFORM_MATRIX_*.md` | `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` |
| **DPIA** | Data Protection Impact Assessment | `docs/legal/` | (Phase 5) Art. 35 GDPR mandatory pre-launch |
| **SCC** | Standard Contractual Clauses | `docs/legal/` | (Phase 5) vendor DPA |
| **DPA** | Data Processing Agreement | `docs/legal/` | tenant → processor (REVYX) |

---

## 10. Roluri & companii

| Acronim | Nume complet | Domeniu |
|---|---|---|
| **AOS** | Agent Operating System | Categorie produs — **ceea ce este REVYX** (NU CRM) |
| **CRM** | Customer Relationship Management | Anti-pattern — REVYX ≠ CRM (diferențiator explicit BRD §1) |
| **PM** | Product Manager | Senior PM orchestrator cerințe + decizii + roadmap |
| **CTO** | Chief Technology Officer | Tech leadership |
| **CFO** | Chief Financial Officer | Sign-off F-S20-09 token tier upgrade |
| **CEO** | Chief Executive Officer | Companie leadership |
| **CISO** | Chief Information Security Officer | Sign-off Phase 5 GA |
| **CMO** | Chief Marketing Officer | Sign-off OD-mkt-01..08 |
| **DPO** | Data Protection Officer | GDPR mandatory tenant Enterprise; provisioning în tenancy-roles-extension |
| **DBA** | Database Administrator | Schema, FK, RLS, migrations, partitioning |
| **QA** | Quality Assurance / Test Architect | Edge cases, BR-XX traceability, NFR validation |
| **DS** | Data Science Lead | Modeling churn + match engine ML + A/B gates |
| **CS** | Customer Success | Outreach retention + outcome capture (Phase 5) |
| **VP** | Vice President | Product / Engineering leadership |
| **PO** | Product Owner | Backlog management |
| **DEV** | Developer | BACKEND DEV · FRONTEND WEB DEV · MOBILE DEV (R-07 cele 11 hats) |
| **FE** | Frontend | Web UI + component system |
| **BE** | Backend | NestJS + database layer |
| **OPS** | Operations | DevOps + SRE + infrastructure |
| **ML** | Machine Learning Engineer | Hat Claude (v1.2.7+) |
| **UI** | User Interface | Labels, butoane, copy user-facing |
| **UX** | User Experience | Flows, interactions, accessibility |
| **KPI** | Key Performance Indicator | Prevention Rate ≥30%, DAU, APS leaderboard |
| **DAU** | Daily Active Users | Adoption metric |
| **SLA** | Service Level Agreement | HOT 15min / Calificat 2h / Warm 24h / Cold nurturing |
| **RM** | Republica Moldova | Piața primară target |
| **CNPDCP** | Consiliul Național pentru Protecția Datelor cu Caracter Personal | RM regulator GDPR; registration pending OD-legal-02 |
| **ITPRO** | ITPRO SYSTEM SRL | Entitatea juridică REVYX |
| **SRL** | Societate cu Răspundere Limitată | Forma juridică RM (≈ LLC EN) |

---

## 11. Tech stack & securitate

### 11.1 Auth & crypto

| Acronim | Sens | Domeniu |
|---|---|---|
| **JWT** | JSON Web Token | Standard OIDC pentru auth; RS256 signing obligatoriu |
| **RS256** | RSA Signature with SHA-256 | JWT signing + JWKS endpoint |
| **RSA-2048** | Rivest-Shamir-Adleman 2048-bit | Key size minim pentru RS256 |
| **HS256** | HMAC SHA-256 | (alternativ JWT signing, NU folosit în REVYX — preferăm RS256 pentru rotație) |
| **HMAC** | Hash-based Message Authentication Code | HMAC-SHA256 verification obligatorie pentru webhook intake (Meta/Google/OLX) |
| **SHA-256** | Secure Hash Algorithm 256-bit | Hashing pentru HMAC |
| **Argon2id** | Argon2 hybrid | Password hashing standard (Phase 0 Security) |
| **AES-256** | Advanced Encryption Standard 256-bit | Symmetric encryption at-rest |
| **SSE-KMS** | Server-Side Encryption — Key Management Service | AWS S3 encryption pentru backups |
| **TLS** | Transport Layer Security | 1.3+ pentru HTTPS |
| **OAuth** | Open Authorization | SSO Google/Meta (Phase 1.5) |
| **SSO** | Single Sign-On | SAML 2.0 + OAuth2 Enterprise (Phase 5 white-label) |
| **MFA / 2FA** | Multi-Factor / Two-Factor Authentication | SMS/TOTP backup codes; Enterprise mandatory |
| **OT / OTT** | One-Time Token | Mobile deep-link auth flow (Phase 2 mobile) |
| **JWKS** | JSON Web Key Set | Public key rotation pentru JWT verification (M1.S5) |

### 11.2 Authorization

| Acronim | Sens | Domeniu |
|---|---|---|
| **RBAC** | Role-Based Access Control | 5 system roles aditiv: agent → senior_agent → team_lead → manager → admin |
| **RLS** | Row Level Security | Tenant isolation la nivel PostgreSQL (BR-18 RLS verification E2E) |
| **DENIED** | Access denied | Audit log enum pentru access refused |

### 11.3 Infrastructure / Networking

| Acronim | Sens | Domeniu |
|---|---|---|
| **DNS** | Domain Name System | CNAME/MX/SPF/DKIM/DMARC required post-M0.S3 |
| **CNAME** | Canonical Name record | DNS pentru `demo.revyx.app` → Vercel hostname |
| **MX** | Mail eXchange record | Email routing |
| **SPF** | Sender Policy Framework | Anti-spoofing |
| **DKIM** | DomainKeys Identified Mail | Signing outgoing emails; selector `rvxYYYYMMDD` per tenant (white-label) |
| **DMARC** | Domain-based Message Authentication, Reporting & Conformance | Policy reject/quarantine |
| **HTTP-01** | HTTP-01 challenge type | Let's Encrypt TLS provisioning |
| **CDN** | Content Delivery Network | Vercel Edge Network |
| **IPV4 / IPV6** | Internet Protocol versions 4 / 6 | Dual-stack networking |

### 11.4 Backend stack

| Acronim | Sens | Domeniu |
|---|---|---|
| **NestJS** | Node.js enterprise framework | v10+, Fastify adapter obligatoriu |
| **Fastify** | Lightweight async HTTP server | Adapter NestJS (preferat vs Express) |
| **ORM** | Object-Relational Mapping | Drizzle ORM (preferat vs Prisma/TypeORM) |
| **DTO** | Data Transfer Object | Zod schemas per endpoint |
| **REST** | Representational State Transfer | API style (vs GraphQL — neales) |
| **CRUD** | Create / Read / Update / Delete | Standard data operations |
| **PL/pgSQL** | Procedural Language / PostgreSQL | Trigger language (audit_log_block_modify, task_enforce_max_3_active, offer_validate_counter_parent) |
| **SQL** | Structured Query Language | Migrations + queries |
| **FK** | Foreign Key | Data integrity constraint |
| **PK** | Primary Key | Entity identifier |
| **UUID** | Universally Unique Identifier | Default ID format (vs serial) |
| **BD** | Bază de Date | (RO) = Database |
| **DB** | Database | (EN synonym) |

### 11.5 Database & queue

| Acronim | Sens | Domeniu |
|---|---|---|
| **PostgreSQL** | RDBMS open-source | Primary database; idempotent migrations |
| **pgvector** | PostgreSQL vector extension | AI embedding storage (HNSW activat Phase 3) |
| **HNSW** | Hierarchical Navigable Small World | Vector indexing algorithm pentru similarity search |
| **Redis** | In-memory data store | Cache + BullMQ job store |
| **BullMQ** | Redis-backed job queue | GDPR erasure cascade + scoring recompute cron |

### 11.6 Frontend stack

| Acronim | Sens | Domeniu |
|---|---|---|
| **RSC** | React Server Components | Next.js 14 default rendering |
| **SDK** | Software Development Kit | (EN generic) |
| **DOM** | Document Object Model | HTML tree (smoke test content probe) |
| **CSS** | Cascading Style Sheets | Tailwind cu tokens.json |
| **SVG** | Scalable Vector Graphics | Logo + iconuri |
| **MDX** | Markdown + JSX | Marketing pages content |
| **WCAG** | Web Content Accessibility Guidelines | AA contrast target (PR #41 navy fix) |
| **A11Y** | Accessibility | UI standard cerință |

### 11.7 DevOps / CI/CD

| Acronim | Sens | Domeniu |
|---|---|---|
| **CI** | Continuous Integration | `.github/workflows/api-ci.yml` gate typecheck+lint+test+build |
| **CD** | Continuous Deployment | Post-merge `main` → Vercel auto-deploy |
| **PR** | Pull Request | Feature branch merge review gate |
| **MD** | Markdown | Format documentație |
| **CLI** | Command-Line Interface | Tooling (gh, drizzle-kit, vercel CLI) |
| **TDD** | Test-Driven Development | Methodology (scoring fixtures first M1.S2) |
| **GHA** | GitHub Actions | CI runner |
| **TBD** | To Be Determined | Placeholder pentru decizii ulterioare |
| **PoC / POC** | Proof of Concept | Phase 5 pre-dev (S16-S20) |
| **GA** | General Availability | M2 public launch |
| **MVP** | Minimum Viable Product | M0 (Prezentare) + M1 (Funcțional) |
| **DR** | Disaster Recovery | RUNBOOK dr-test (NFR-11) |
| **RPO** | Recovery Point Objective | ≤ 1h (NFR-11) |
| **RTO** | Recovery Time Objective | ≤ 4h (NFR-11) |

### 11.8 Standards & references

| Acronim | Sens | Domeniu |
|---|---|---|
| **ISO27001** | Information Security Management Standard | Audit track (TECH_SPEC iso27001-track) |
| **SOC2** | Service Organization Control 2 | Audit framework (post-GA roadmap) |
| **PCI-DSS** | Payment Card Industry Data Security Standard | (Aplicabil dacă procesăm carduri direct — actual Stripe externalizat) |
| **OWASP** | Open Web Application Security Project | Top 10 coverage mandatory Phase 0 |
| **NFR** | Non-Functional Requirements | NFR-01..11 (vezi §4 acest doc) |
| **ISO-8601** | Date/time format standard | `YYYY-MM-DD HH:MM:SS+TZ` |
| **UTF-8** | Unicode Transformation Format 8-bit | Character encoding standard |
| **JSON** | JavaScript Object Notation | API payload format |
| **YAML** | YAML Ain't Markup Language | CI workflows + config |
| **CSV** | Comma-Separated Values | Export format |
| **PDF** | Portable Document Format | Pitch deck export (T-M0.S4-08) |

---

## 12. Canale & integrări

| Acronim | Sens | Domeniu |
|---|---|---|
| **WhatsApp** | WhatsApp Business API | 5 templates pre-aprobate Meta obligatoriu (M1.S5) |
| **Meta** | Meta Business Platform (Facebook) | Webhook lead intake + WhatsApp approval |
| **Google** | Google Ads / Maps / Calendar | Webhook lead intake + Showcase Link |
| **OLX** | OLX Romania | Lead intake webhook + marketplace syndication (Phase 5) |
| **IDX** | Internet Data eXchange | MLS property feed integration (Phase 5 marketplace) |
| **MLS** | Multiple Listing Service | North American property database (future roadmap) |
| **SMS** | Short Message Service | Notifications alternative WhatsApp |
| **IM** | Instant Messaging | Generic placeholder (Teams, Slack, custom) |
| **APNS** | Apple Push Notification Service | Mobile push iOS |
| **FCM** | Firebase Cloud Messaging | Mobile push Android |
| **Stripe** | Stripe payment processor | Billing M1.S6 (subscription tiers) |
| **Vercel** | Vercel hosting platform | Frontend deploy (apps/web-preview/) |
| **Plausible** | Plausible Analytics | Privacy-first analytics (vs GA4) — OD-legal-05 pending |
| **GA4** | Google Analytics 4 | Alternative analytics platform — OD-legal-05 pending |

---

## 13. Phase 5 (Marketplace, Churn, White-Label)

### 13.1 Marketplace

| Acronim / Entity | Sens | Domeniu |
|---|---|---|
| **BUYER_PROFILE** | Public buyer profile entity | UUID + user_id + intent + budget_band + location/property preferences (BRD §8.3) |
| **Buyer Profile** | Self-service buyer lead | Contact-grant flow în MARKETPLACE (BRD §15) |
| **Marketplace two-sided** | Bilateral platform | Buyer ↔ seller flow + reverse matching |
| **Contact-grant flow** | Consent-based reveal | Buyer profile mask → grant → reveal PII |
| **leadType** | LEAD type enumeration | NOT NULL ∈ {buyer, seller} — segregare obligatorie R-19 |
| **selling_property_id** | Seller LEAD foreign key | FK la PROPERTY entity; obligatoriu pentru seller leads |

### 13.2 Churn engine

| Acronim / Entity | Sens | Domeniu |
|---|---|---|
| **Churn Score** | Probabilitate renunțare 30/60d | [0,1] — recompute săptămânal (BR-13) |
| **Prevention Rate** | KPI retention | retained_90d / flagged_medium_plus ≥30% (BR-17) |
| **Risk band** | Classification praguri | {LOW, MEDIUM, HIGH, CRITICAL} (BR-14) |
| **churn_cs_task** | Auto-generated CS task | SLA per severity (BR-15) |
| **cs_user / cs_lead** | RBAC roluri Customer Success | Outreach retention + supervision |
| **data_science_lead** | RBAC rol DS | Promovare modele ML + A/B gates |

### 13.3 White-Label

| Acronim | Sens | Domeniu |
|---|---|---|
| **White-Label** | Tenant-specific branding | Etichetă Albă: custom domain + DKIM/SPF/DMARC + tenant admin console (Enterprise) |
| **tenant_admin** | RBAC rol Enterprise | Brand + domain + white-label config |
| **WL** | White-Label shorthand | Folosit în AC-WL-XX |
| **DKIM rotation** | DKIM key rotation procedure | Cron `dkim_rotate_keys` + RUNBOOK dkim-rotation v1.0.0 |
| **plan_tier** | Subscription tier enum | {FREE, STARTER, BUSINESS, ENTERPRISE} (BR-19) |
| **DR-2026 / DR-2027** | DR test annual designators | Disaster Recovery test runs |

---

## 14. Compliance & legislație

### 14.1 GDPR articles

| Articol | Subiect | Aplicare REVYX |
|---|---|---|
| **Art. 5** | Principles | Lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, integrity & confidentiality, accountability |
| **Art. 6** | Legal basis | Consent (6a) — BR-06; Contract (6b); Legal obligation (6c); Vital interest (6d); Public task (6e); Legitimate interest (6f) |
| **Art. 15** | Right of access | Endpoint `gdpr/access` (Phase 0 Security) |
| **Art. 17** | Right to erasure | Endpoint `gdpr/erase` + BullMQ cascade (M1.S3) |
| **Art. 18** | Right to restrict | Endpoint `gdpr/restrict` |
| **Art. 20** | Right to data portability | Endpoint `gdpr/portability` (JSON export) |
| **Art. 22** | Automated decision-making | Prohibited fără human oversight; churn = suport only (BR-16) |
| **Art. 32** | Security of processing | Encryption + pseudonymization + resilience + testing |
| **Art. 35** | DPIA | Mandatory pre-launch Phase 5 (OD-legal-04 pending) |

### 14.2 RM legislation

| Cod | Subiect | Aplicare |
|---|---|---|
| **Legea 133/2011** | Legea Protecției Datelor cu Caracter Personal RM | Pre-GDPR baseline + data retention rules |
| **Legea 142/2018** | Aprobare Regulament UE 2016/679 (GDPR implementation RM) | Cross-ref CNPDCP |
| **GDPR-RM** | Composite — GDPR + RM legislation | Compliance dual track |
| **CNPDCP** | Consiliul Național pentru Protecția Datelor cu Caracter Personal | Registration pending OD-legal-02 |
| **DAC7** | EU Directive on Administrative Cooperation 7 | Marketplace reporting (post-GA) |

### 14.3 PII & data classification

| Acronim | Sens | Domeniu |
|---|---|---|
| **PII** | Personally Identifiable Information | TECH_SPEC pii-field-registry v1.0.0 — catalog câmpuri |
| **DPIA** | Data Protection Impact Assessment | Art. 35 GDPR mandatory pre-launch (Phase 5) |
| **DPA** | Data Processing Agreement | Contractual tenant → processor |
| **SCC** | Standard Contractual Clauses | Vendor DPA pentru sub-processor (EU-US data transfer) |

---

## 15. Geo · Currency · Timezone

| Cod | Sens | Folosire REVYX |
|---|---|---|
| **RM** | Republica Moldova | Piața primară target |
| **UTC** | Coordinated Universal Time | Storage standard în TIMESTAMPTZ |
| **UTC+2** | Eastern European Time (Chișinău) | **Forțat în toate calculele temporale** + afișare UI |
| **TZ** | Timezone | Synonym (cod scurt) |
| **EUR** | Euro | Default currency platform |
| **MDL** | Moldavian Leu | Local currency RM |
| **USD** | United States Dollar | Secondary option |
| **EN** | English | Cod, GitHub, tech docs, comentarii |
| **RO** | Română | Limbă primară doc business + UI |
| **RU** | Русский | Limbă secundară UI local (piața RM) |

---

## 16. Quick lookup A-Z

> Index alfabetic — toate acronimele din §2-§15 pentru lookup rapid.

**A** — A11Y · AC-XX · AES-256 · APNS · APS · AOS · Argon2id · Art. 5/6/15/17/18/20/22/32/35 (GDPR)
**B** — BD · BE · BR-01..24 · BRD · BullMQ · BUYER_PROFILE · Buyer Profile
**C** — CD · CDN · CEO · CFO · Churn Score · CI · CISO · CLI · CMO · CNAME · CNPDCP · Consent · CRM · CRUD · CS · CSS · CSV · CTO
**D** — DAC7 · DAU · DB · DBA · DEV · DHI · DKIM · DMARC · DNS · DOM · DP · DPA · DPIA · DPO · DR · DR-2026/2027 · DS · DTO
**E** — EN · EUR
**F** — F-XXX (F-S20-XX, F-M0S5-XX) · Fastify · FCM · FE · FK
**G** — GA · GA4 · GDPR · GDPR-RM · GHA · Google
**H** — HMAC · HMAC-SHA256 · HNSW · HOT · HS256 · HST · HTTP-01
**I** — IDX · IM · INDEX · IPV4 · IPV6 · IS · ISO27001 · ISO-8601 · ITPRO
**J** — JSON · JWKS · JWT
**K** — KPI
**L** — Legea 133/2011 · Legea 142/2018 · LF · LS
**M** — M0 · M0.S1..S7 · M1 · M1.S1..S8+ · M2 · MASTER_PLAN · MDL · MD · MDX · Meta · MFA · ML · Mkt-M1 · MLS · MVP · MX
**N** — NBA · NestJS · NFR-01..11 · NO-GO / NO-OP
**O** — OAuth · OD-XX · OLX · OPS · OT / OTT · OWASP
**P** — PCI-DSS · PDF · PHASE5 · pgvector · PII · PK · PL/pgSQL · Plausible · PM · PO · POC · POST-M0 · PostgreSQL · PR · PRD · Prevention Rate · PS
**Q** — QA
**R** — R-01..19 (Reguli operaționale) · RBAC · README · Redis · REST · RF · RLS · RM · RO · ROADMAP · RPO · RS256 · RSA-2048 · RSC · RTO · RU
**S** — S1..S20 · SCC · SDK · selling_property_id · SHA-256 · SLA · SMS · SOC2 · SPF · SQL · SRL · SSE-KMS · SSO · Stripe · SVG
**T** — T-XXX (T-M0.SX-YY · T-M1.SX-YY · T-Mkt-YYY) · TBD · TDD · TECH_SPEC · TF · TLS · TS · TZ
**U** — UF · UI · USD · UTC · UTC+2 · UTF-8 · UUID · UX
**V** — Vercel · VP
**W** — WCAG · WhatsApp · White-Label · WL · WORKFLOW
**Y** — YAML

---

## 17. Surse & cross-references

### 17.1 Documente sursă consultate

| Sursă primară | Aport principal |
|---|---|
| `CLAUDE.md` v1.2.18 | §4 BR-XX critice · §10b Reguli R-01..R-19 · §12 Glosar minim |
| `docs/BRD_REVYX_v1.1.0.md` | §6 BR-01..24 · §7 formule scoring · §9 NFR/securitate · §10 RBAC · §15 Glosar v1.1 deltas |
| `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` | M0/M1/M2 sub-stages · §11 NFR · §13 sign-off |
| `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | 119 features × Web/Mobile · DP-01..07 reguli platform |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.13.md` | T-XXX atomic tasks · Mkt-M1 marketing track |
| `docs/INDEX_REVYX_documents_v1.1.19.md` | Catalog documente · changelog historic |
| `docs/tech-spec/*.md` (25 specs) | NFR-XX per modul · AC-XX per engine · acronime tehnice |
| `docs/workflow/*.md` (9 workflows) | AC-DC/ESC/SH/etc · cross-spec consistency |
| `docs/runbook/*.md` (11 runbooks) | DR/RPO/RTO · stage rollout sequences |
| `docs/audit/HST_REVYX_m0_v1.0.0.md` + `findings-backlog_v1.0.0.md` | F-M0S5-01..17 findings codes |
| `docs/audit/HST_REVYX_pre-dev_v1.0.0.md` | F-S20-XX findings codes |
| `docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md` + `COOKIE_POLICY_REVYX_v0.1.0.md` | OD-legal-XX + OD-cookie-XX pending |
| `docs/marketing/MARKETING_STRATEGY_REVYX_v1.0.0.md` + `MARKETING_ROADMAP_REVYX_v1.0.0.md` | T-Mkt-XXX + OD-mkt-XX |
| `apps/api/src/scoring/fixtures.ts` | T01..T07 test fixtures |

### 17.2 Procedură update

Conform R-06 (INDEX update) + R-18 (Single living document):

1. **Adăugare termen nou:** `Edit` pe acest fișier — nu creezi `_v1.0.1.md` paralel.
2. **Bump version:** PATCH (≤5 termeni) · MINOR (categorie nouă sau ≥10 termeni) · MAJOR (rescriere structurală).
3. **Cross-ref obligatoriu:** orice doc nou care introduce un acronim → entry aici + entry în INDEX.
4. **Rename pattern** (când există versiune):
   - `git mv docs/GLOSSARY_REVYX_abbreviations_v1.0.0.md docs/GLOSSARY_REVYX_abbreviations_vX.Y.Z.md`
   - Apoi `Edit` pe noul filename.
   - Update referințe în INDEX + alte docs care citează vechea versiune.
5. **Categorii noi:** trebuie inserate în Cuprins + Quick lookup A-Z.

### 17.3 Limitări cunoscute

- BR-08 lipsește din BRD v1.1.0 (probabil rezervat sau deprecated între v1.0.0 și v1.1.0 — git history v1.0.0 a fost șters per R-18 consolidation, deci verificare imposibilă fără git log archeology).
- AC-XX intervale exacte (AC-M1-01..AC-M1-10) sunt aproximative — listele complete trăiesc în MASTER_PLAN §3-§5 și specs individuale.
- T-XXX listing nu este exhaustiv aici (308+ tasks) — sursă autoritativă rămâne ROADMAP v1.0.12.
- OD-legal-01..05 + OD-cookie-01..03 descrierile sunt sumarizate; texte complete în drafts legal v0.1.0.

---

## 18. Aprobare

| Rol | Responsabilitate | Semnătură | Data |
|---|---|---|---|
| Senior PM | Validare completitudine + consistență cu CLAUDE.md §4/§12 + BRD §15 | ___________________________ | 2026-05 |
| DOC Lead | Validare format + cross-refs + R-06 INDEX entry | ___________________________ | 2026-05 |
| Audit Lead | Validare lista findings F-XXX + open decisions OD-XX | ___________________________ | 2026-05 |
| Senior Architect | Validare tech stack §11 + scoring metrici §2 | ___________________________ | 2026-05 |
| Senior Compliance Auditor | Validare GDPR §14 + CNPDCP + Legea 133/142 | ___________________________ | 2026-05 |

---

*GLOSSARY_REVYX_abbreviations_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
