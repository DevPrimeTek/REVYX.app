# MASTER PLAN — REVYX Execution Roadmap
<!-- MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md · v1.1.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | Senior PM + Senior PO + Solution Architect + Audit Lead | INITIAL — Master Plan execution roadmap pentru REVYX AOS. Devine structural backbone al documentației: orice document nou (spec, runbook, audit) trebuie să citeze stage-ul de care aparține și să se conformeze cu acceptance criteria al milestone-ului respectiv. Definește 3 macro-milestones (M0 MVP Prezentare · M1 MVP Funcțional · M2 FULL Release GA), echipa virtuală Claude Code (10 hats cu activare condiționată per stage pentru optimizare token), Hard Stress Test methodology mandatory pre-fiecare milestone, gating documentation closure pre-development (S16-S19 + S20 HST #2). Cross-ref CLAUDE.md §10b Regula 3 (audit checkpoint) + Regula 4 (post-commit verify) + nou Regula 8 (Master Plan compliance). |
| **1.1.0** | **2026-06** | ★ Senior PM + Senior PO + Solution Architect + Frontend Lead | ★ MINOR — **Dual-platform architecture explicit**. Triggered de feedback PM: REVYX este platformă dual-channel (Web primary + Mobile companion), nu doar mobile-centric. Schimbări: (1) §1.4 NEW — clarificare platforme: Web = ~80% workflow agenți (PC desktop, primary), Mobile = ~20% workflow în deplasare (companion); (2) §2.2 nou hat **FRONTEND WEB DEV** (separat de IMPLEMENTER backend); 10 → 11 hats; (3) §2.3 matrice actualizată — FRONTEND WEB DEV activ în M0.S3 + M1.S5/S6 + M2.S2/S5 + DESIGNER co-active pentru parity Web/Mobile; (4) §4-§6 restructurare sub-stages — M1 acum 8 sub-stages (split web dashboard în Agent + Manager), M2 acum 8 sub-stages (split web platform complete vs mobile companion); (5) §11 Definition of Done — Web AC explicit la M1 + M2; (6) AC matrix update — AC-M1-04 split în AC-M1-04a (Web agent) + AC-M1-04b (Web manager); AC-M2-02 Mobile devine companion (nu primary); (7) §10 risk register — nou R-11 "Web/Mobile feature parity drift" MED. Cross-ref CLAUDE.md v1.2.1 §10b Regula 7 (11 hats), BRD futura v1.2.0 trebuie să adauge §10.4 Web Platform Architecture explicit. |

---

## 0. STATUS CURENT (LIVE TRACKER) ★

> Acest § se actualizează la fiecare sesiune `/sN`. Reprezintă single source of truth pentru "unde suntem acum".

### 0.1 Faza actuală

| Atribut | Valoare |
|---|---|
| **Macro-milestone activ** | Pre-development — Documentation closure |
| **Sub-stage activ** | S15 ✅ CLOSED → S16 next |
| **Documentație rămasă** | 4 sesiuni (S16, S17, S18, S19) |
| **Hard Stress Test #2** | Programat post-S19 ca sesiune **S20** |
| **Development start (Phase 0)** | Blocat până la închidere S20 |
| **Modul Claude activ** | DOC + ARCHITECT (no code) |
| **Plan tariff curent** | Claude.ai Pro $20/lună |
| **Capacitate work/zi declarată** | 6-8 ore (efectiv ~4-5 ore post rate-limit overhead) |

### 0.2 Progres milestone-uri

| Milestone | Status | Progres documentație | Progres execuție |
|---|---|---|---|
| **Pre-dev** | 🟡 IN PROGRESS | 83/~95 docs | N/A |
| **M0 — MVP Prezentare** | ⚪ NOT STARTED | 0/required | 0% |
| **M1 — MVP Funcțional** | ⚪ NOT STARTED | 0/required | 0% |
| **M2 — FULL Release GA** | ⚪ NOT STARTED | 0/required | 0% |

### 0.3 Următoarele 5 sesiuni programate

| Sesiune | Scop | Output principal |
|---|---|---|
| **S16** | Stage 3 audit + Stage 4 entry | AUDIT_s15, RUNBOOK_stage4-churn, READINESS v1.0.4 |
| **S17** | Stage 4 audit + Stage 5 entry | AUDIT_s16, RUNBOOK_stage5-white-label, READINESS v1.0.5 |
| **S18** | Stage 5 audit + GA prep | AUDIT_s17, READINESS v1.1.0 MINOR (GA close) |
| **S19** | Final doc closure + GA sign-off | Raport final board, INDEX v1.1.0 |
| **S20** | **Hard Stress Test #2** ⚠️ MANDATORY GATE | HST report, gap closure backlog |

### 0.4 Gating items active

| Item | Categorie | Status |
|---|---|---|
| Documentation closure 100% | Pre-dev | 🟡 4 sesiuni rămase |
| Hard Stress Test #2 (S20) | Pre-dev | ⚪ programat |
| Gap closure post-HST | Pre-dev | ⚪ dependent S20 |
| Master Plan approval | Pre-dev | 🟡 acest doc — aprobare la close |
| Phase 0 Security checklist | M1 entry | 🔴 nu început |
| ISO 27001 RFP (BSI Group MD) | M2 entry | 🟡 BSI-M1..M4 tracking S16+ |

---

## 1. FILOZOFIE EXECUTION

### 1.1 Principii fundamentale

| # | Principiu | Implicație practică |
|---|---|---|
| 1 | **Claude Code = singura forță de execuție** | Nu există echipă umană externă. Toate rolurile sunt jucate de Claude ca "hats" condiționate per stage. |
| 2 | **Quality > Speed** | Hard Stress Test mandatory pre-fiecare milestone. Nu se trece la următorul stage cu findings CRIT/HIGH deschise. |
| 3 | **Token efficiency** | Roluri activate doar când necesar. ARCHITECT și IMPLEMENTER nu se invocă simultan pe același fișier. Cod fără comentarii except WHY non-obvious. |
| 4 | **Documentation-first** | Niciun cod fără spec aprobată. Dacă spec lipsește → ARCHITECT mode primul, IMPLEMENTER abia după. |
| 5 | **Test-driven validation** | T01-T07 vectori canonici BRD §12 sunt acceptance criteria pentru orice scoring engine. |
| 6 | **Stage gating strict** | Exit gates per stage trebuie verificate înainte de a începe următorul. AUDIT_REVYX_sN documentează gating closure. |
| 7 | **CLAUDE.md = lege** | Toate regulile §10b (1-8) sunt non-negotiable. Violarea triggerează rollback sesiune. |

### 1.2 Anti-patterns interzise

| Anti-pattern | De ce |
|---|---|
| Scriere cod fără spec aprobată | Generează rework masiv post-audit |
| Skip Hard Stress Test pre-milestone | 47 gap-uri găsite în HST #1 BRD v1.0→v1.1 demonstrează necesitatea |
| Activare toate rolurile simultan | Risipă token + dilution focus |
| Comentarii narative în cod | "// Aici verificăm dacă..." — interzis (CLAUDE.md §9) |
| Modificare formule scoring fără PM sign-off | BR critic — invalidează T01-T07 |
| Commit fără Regula 4 self-review | Inconsistențe cross-ref propagate downstream |
| **Tratare Web ca afterthought al Mobile** ★ | Web = PRIMARY platform (~80% workflow); Mobile = COMPANION (~20%) |
| **Feature drift Web vs Mobile** ★ | Feature trebuie întâi pe Web (Web-first), apoi adaptat Mobile dacă applicable |

### 1.3 Stack tehnic frontend (referință) ★ NEW v1.1.0

| Layer | Web (PRIMARY) | Mobile (COMPANION) |
|---|---|---|
| Framework | Next.js 14 App Router (RSC + Server Actions) | React Native + Expo SDK 51 |
| Language | TypeScript strict | TypeScript strict |
| Styling | TailwindCSS + shadcn/ui (paletă revyx.md) | NativeWind (Tailwind for RN) + react-native-paper |
| State | Zustand + TanStack Query | Zustand + TanStack Query (cod partajat) |
| Auth | Supabase Auth (cookie-based session) | Supabase Auth (token + secure storage) |
| Forms | react-hook-form + zod | react-hook-form + zod |
| Routing | Next.js App Router | expo-router |
| Charts | Recharts (manager dashboard) | victory-native (subset) |
| i18n | next-intl (RO + RU primar; EN admin) | i18next (RO + RU; EN admin) |
| Testing | Playwright (E2E) + Vitest (unit) | Detox (E2E) + Jest (unit) |

### 1.4 Filozofie dual-platform ★ NEW v1.1.0

**REVYX este platformă DUAL-CHANNEL.** Niciodată gândită ca "mobile-only" sau "web-only".

| Platformă | Audience primar | % workflow agent | Use cases primare |
|---|---|---|---|
| **WEB (PC browser)** | Toate rolurile (agent, senior, team_lead, manager, admin) | ~80% | Management complet: lead queue, deal pipeline, dashboards, reports, configuration, RBAC mgmt, marketplace ops, white-label setup, ML model promote, churn analytics, admin panel |
| **MOBILE (RN companion)** | Agent + Senior Agent (in-field) | ~20% | În deplasare: lead detail view, NBA recommendations, WhatsApp send, push notifications, showing check-in, photo upload property, voice memo activity log |

**Reguli dual-platform:**

| # | Regulă | Aplicare |
|---|---|---|
| DP-01 | **Web-first development** | Orice feature nou implementat întâi pe Web; Mobile primește subset relevant pentru in-field use |
| DP-02 | **Feature parity matrix** | Spec-urile feature menționează explicit "WEB only" / "MOBILE only" / "BOTH" |
| DP-03 | **Single source backend** | API REST/GraphQL identic pentru Web + Mobile; nu există endpoints "mobile-only" |
| DP-04 | **Auth single session per agent** (BR-12) | Web și Mobile NU pot fi logate simultan cu același cont |
| DP-05 | **Critical admin = Web only** | RBAC mgmt, white-label config, ML promote, billing → niciodată pe Mobile |
| DP-06 | **Brand consistency** | Paletă revyx.md identică Web+Mobile; componente UI corespondente (Card, Button, Modal) |
| DP-07 | **Performance budget** | Web FCP < 1.5s; Mobile JS bundle < 5MB |

---

## 2. ECHIPA VIRTUALĂ CLAUDE CODE (HATS)

### 2.1 Filozofie role-switching

Claude joacă **11 roluri distincte** ★ (v1.1.0) activate condiționat per stage. La un moment dat, **maximum 2-3 hats active** pe aceeași unitate de lucru pentru a păstra focus + minimiza token usage.

### 2.2 Catalog hats ★ v1.1.0

| # | Hat | Activare | Output primar | Token profile |
|---|---|---|---|---|
| 1 | **ARCHITECT** | Plan + design fază nouă | Design doc fragment, ADR, schema diagram | High thinking · Low output |
| 2 | **BACKEND DEV** (rename din IMPLEMENTER) | Cod backend API + business logic | Fișiere .ts în `apps/api/`, services, controllers | Med thinking · High output focused |
| 3 | **FRONTEND WEB DEV** ★ NEW | Cod Next.js Web platform PRIMARY | Fișiere .tsx în `apps/web/`, RSC, Server Actions, shadcn/ui | Med thinking · High output focused |
| 4 | **MOBILE DEV** | Cod React Native COMPANION | Fișiere .tsx în `apps/mobile/`, expo-router, native bindings | Med thinking · High output |
| 5 | **DBA** | Migrări + schema BD | Fișiere SQL idempotente 0001-0XXX | Low thinking · Low output precis |
| 6 | **TESTER** | Test vectori + edge cases | Fișiere .test.ts cu T01-T07 + BR-XX + Playwright E2E + Detox | Med thinking · Med output structurat |
| 7 | **SECURITY** | RBAC, GDPR, OWASP, audit hardening | Audit checklist, security review notes, fixes in-place | High thinking · Low output critic |
| 8 | **DEVOPS** | CI/CD, deploy, infra | GitHub Actions yaml, Dockerfile, env templates | Low thinking · Med output template |
| 9 | **ML ENGINEER** | Phase F (ML Pricing + Churn) | Notebook ipynb, model training scripts, registry | High thinking · Med output |
| 10 | **DESIGNER** | Wireframes, design system, brand parity Web↔Mobile | Componente React (Web + RN) + brand-config compliance | Med thinking · Med output vizual |
| 11 | **DOC** | Spec, runbook, audit, INDEX | Markdown cu header + changelog + cross-ref | Med thinking · High output structurat |

**Notă rename:** "IMPLEMENTER" generic din v1.0.0 s-a split în **BACKEND DEV** + **FRONTEND WEB DEV** + **MOBILE DEV** pentru claritate dual-platform.

### 2.3 Matrice activare hats per stage ★ v1.1.0

Legendă: **P** = primary (always active) · **S** = secondary (conditional) · `—` = inactive

| Stage / Hat | ARCH | BE | FE-WEB | MOB | DBA | TEST | SEC | OPS | ML | DES | DOC |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Pre-dev (S16-S20)** | P | — | — | — | — | S | S | — | — | — | P |
| **M0.S1 Wireframes+Design** | P | — | — | — | — | — | — | — | — | P | S |
| **M0.S2 Clickable Prototype** | S | — | — | — | — | — | — | — | — | P | — |
| **M0.S3 React Static Demo (Web)** | — | — | **P** | — | — | — | — | S | — | P | — |
| **M0.S4 Pitch Deck** | S | — | — | — | — | — | — | — | — | S | P |
| **M0.S5 HST M0** | P | — | — | — | — | P | P | — | — | — | S |
| **M1.S1 Phase 0 Security** | S | P | — | — | S | S | P | S | — | — | — |
| **M1.S2 Phase A Backend Foundation** | S | P | — | — | P | S | — | S | — | — | — |
| **M1.S3 Phase B Lead Intake+Scoring (BE)** | S | P | — | — | S | P | — | — | — | — | — |
| **M1.S4 Phase C Property+Match (BE)** | S | P | — | — | P | S | — | — | — | — | — |
| **M1.S5 Web Dashboard Agent** ★ | S | — | **P** | — | — | S | — | — | — | P | — |
| **M1.S6 Web Dashboard Manager** ★ NEW | S | — | **P** | — | — | S | — | — | — | S | — |
| **M1.S7 Pilot Deploy + Monitoring** | — | S | S | — | S | S | P | P | — | — | — |
| **M1.S8 HST M1 + bug fix** ★ shifted | P | S | S | — | S | P | P | — | — | — | S |
| **M2.S1 Phase D Deals+DHI+NBA (BE)** | S | P | S | — | S | P | — | — | — | — | — |
| **M2.S2 Web Platform Complete** ★ NEW | S | S | **P** | — | — | S | S | — | — | P | — |
| **M2.S3 Mobile RN Companion** ★ shifted | S | S | — | **P** | — | S | — | S | — | S | — |
| **M2.S4 Phase F ML Pricing+Churn** | S | S | S | — | S | S | S | — | P | — | — |
| **M2.S5 Phase G Marketplace+White-Label** | S | P | **P** | — | P | S | S | S | — | P | — |
| **M2.S6 WhatsApp Business Integration** ★ NEW | S | P | S | S | — | S | — | — | — | — | — |
| **M2.S7 Hardening + Pen-test** | P | S | — | — | — | P | P | S | — | — | — |
| **M2.S8 GA Launch** ★ shifted | — | S | S | S | — | S | P | P | — | — | P |

### 2.4 Reguli switching între hats

1. **La inceput sesiune**: Claude declară în chat ce hats activează (ex: "Activez ARCHITECT + DBA pentru această sesiune").
2. **Tranziție explicită**: La switch (ex: ARCHITECT → IMPLEMENTER), Claude anunță în chat ("Trec la IMPLEMENTER pentru a scrie codul").
3. **Restricție focus**: ARCHITECT nu scrie cod production. IMPLEMENTER nu modifică specs. DOC nu scrie cod aplicație.
4. **Hand-off intern**: Output de la un hat devine input pentru altul (ex: ARCHITECT produce design fragment → IMPLEMENTER scrie cod conform).

---

## 3. MACRO-MILESTONES

### 3.1 Visiune globală

REVYX AOS este construit în **3 etape macro** strict gated, fiecare cu Hard Stress Test obligatoriu la închidere:

```
Pre-dev ──→ M0 ──→ HST M0 ──→ M1 ──→ HST M1 ──→ M2 ──→ HST M2 ──→ GA
(S16-S20)  (Demo)  (audit)   (Pilot) (audit)   (GA)   (audit)
```

### 3.2 Macro-comparație ★ v1.1.0

| Atribut | M0 — MVP Prezentare | M1 — MVP Funcțional | M2 — FULL Release GA |
|---|---|---|---|
| **Scop** | Pitching investitori/clienți | Pilot real cu tenanți reali | Public GA, toate feature-uri BRD |
| **Platforme livrate** ★ | WEB demo (browser, static) | WEB primary (Agent + Manager dashboard) | WEB complet + MOBILE companion |
| **Backend real** | ❌ Mock data | ✅ Phase 0 + A + B + C | ✅ Phase 0 → G complet |
| **Web Frontend** ★ | ✅ Next.js static demo | ✅ Next.js cu auth + RBAC + critical features | ✅ Next.js platform completă (admin, marketplace, white-label, ML promote UI) |
| **Mobile Frontend** ★ | ❌ N/A | ❌ Amânat la M2 | ✅ React Native companion (TestFlight + Play Store live) |
| **Auth real** | ❌ Mock | ✅ Supabase Auth + RBAC 5 | ✅ + 4-eyes ML + SCC vendors |
| **GDPR + Audit** | ❌ Nu aplicabil | ✅ Consent + AUDIT_LOG | ✅ + DPIA + SCC + Privacy Policy publică |
| **Stress test** | UX + presentation rehearsal | HST tehnic complet 7-rol | HST complet + pen-test extern |
| **Audience** | Demo deck + video | 2-3 tenanți pilot | Public Moldova + extensie regiune |
| **Sub-stages** | 5 (M0.S1-S5) | **8** ★ (M1.S1-S8) | **8** ★ (M2.S1-S8) |

---

## 4. M0 — MVP PREZENTARE (DETALIU)

### 4.1 Scope & Obiective

**Definiție:** Aplicație **demo-able** pentru pitch investitori, parteneri, clienți enterprise. NU este produs funcțional — este **vitrina** care convinge decident să investească/contracteze.

**Obiective măsurabile (acceptance criteria globale M0):**

| # | Criteriu | Target |
|---|---|---|
| AC-M0-01 | Demo end-to-end clickable (lead intake → matching → deal close simulat) | ≥ 12 ecrane navigabile |
| AC-M0-02 | Brand compliance (revyx.md paletă, font Inter, ton) | 100% screens |
| AC-M0-03 | Video walkthrough max 5 min cu voice-over RO + EN | 2 versiuni livrate |
| AC-M0-04 | Pitch deck 15-20 slide-uri (problem → solution → market → product → traction → ask) | 1 deck în 3 limbi (RO, RU, EN) |
| AC-M0-05 | Demo data realistic (≥ 100 lead-uri fake, ≥ 50 properties, ≥ 20 deals) | seed JSON livrat |
| AC-M0-06 | Hosting demo public (Vercel/Netlify) cu link partajabil | URL HTTPS activ |
| AC-M0-07 | HST M0 PASS (UX + presentation rehearsal) | 0 findings BLOCK |

### 4.2 Sub-stages M0

#### **M0.S1 — Wireframes & Design System**

| Aspect | Valoare |
|---|---|
| **Hats active** | DESIGNER (primary), ARCHITECT (secondary), DOC (secondary) |
| **Input** | brand-configs/revyx.md, BRD §5 piloni, PRD-uri existente |
| **Output** | `design/wireframes/` Figma-export sau React mockup primitives, design system tokens (.json) |
| **Acceptance** | Toate ecranele critice (lead list, lead detail, property, deal, dashboard agent, dashboard manager) wireframe-uite |
| **Token strategy** | DESIGNER produce componente repetabile (Button, Card, Table, Modal); reuse aggressive |

#### **M0.S2 — Clickable Prototype**

| Aspect | Valoare |
|---|---|
| **Hats active** | DESIGNER (primary), ARCHITECT (secondary) |
| **Output** | Prototip Figma cu hover-states + click-flows, sau React static cu react-router |
| **Acceptance** | Lead intake → score → assign → activity → deal close — toată călătoria click-by-click |

#### **M0.S3 — Web Static Demo (Next.js)** ★ v1.1.0

| Aspect | Valoare |
|---|---|
| **Hats active** | FRONTEND WEB DEV (primary), DESIGNER (primary), DEVOPS (secondary) |
| **Platformă** | WEB only (browser desktop) — Mobile companion N/A pentru M0 |
| **Output** | `apps/web/` Next.js 14 App Router cu mock-data JSON, deploy Vercel |
| **Acceptance** | Toate ecranele AC-M0-01 funcționale (lead list, lead detail, property, deal, dashboard agent, dashboard manager); demo data AC-M0-05 seeded; URL public AC-M0-06 |
| **Tech stack** | Conform §1.3 Web column: Next.js 14 RSC, TypeScript strict, TailwindCSS (paletă revyx.md), shadcn/ui, lucide-react, next-intl RO/RU |
| **Token strategy** | FRONTEND WEB DEV folosește shadcn/ui pre-built; minimal custom CSS; componente reusable salvate în `apps/web/components/ui/` pentru reuse în M1.S5+ |

#### **M0.S4 — Pitch Deck + Video Walkthrough**

| Aspect | Valoare |
|---|---|
| **Hats active** | DOC (primary), ARCHITECT (secondary), DESIGNER (secondary) |
| **Output** | `marketing/pitch/REVYX_pitch_v1.md` (RO/RU/EN) + `marketing/video/script.md` |
| **Acceptance** | AC-M0-03 + AC-M0-04 |
| **Structură deck** | 1. Problem · 2. Solution · 3. Market size (RM + extensie) · 4. Product (screenshots demo) · 5. Business model · 6. Traction · 7. Team · 8. Roadmap · 9. Ask · 10. Q&A |

#### **M0.S5 — Hard Stress Test M0 ⚠️ GATE**

| Aspect | Valoare |
|---|---|
| **Hats active** | ARCHITECT, SECURITY, TESTER, DOC |
| **Metodologie** | §8 acest document |
| **Focus** | UX flow, brand compliance, presentation rehearsal, message clarity, demo robustness |
| **Output** | `docs/audit/HST_REVYX_m0_v1.0.0.md` cu findings + closure plan |
| **Exit gate** | 0 findings CRIT/HIGH; toate MED triagate; LOW backlog acceptat |

### 4.3 M0 — Definition of Done

- [ ] AC-M0-01 → AC-M0-07 toate ☑
- [ ] HST M0 raport publicat și findings CRIT/HIGH = 0
- [ ] Demo URL public activ + accesibil
- [ ] Pitch deck 3 limbi în PR aprobat
- [ ] Video walkthrough livrat (RO + EN)
- [ ] Sign-off PM + PO

---

## 5. M1 — MVP FUNCȚIONAL (DETALIU)

### 5.1 Scope & Obiective

**Definiție:** Produs **funcțional în pilot** cu 2-3 tenanți reali. Acoperă Phase 0 Security + Phase A Foundation + Phase B Lead Intake/Scoring + Phase C Property/Matching. Validează BR-XX critic, scoring engines T01-T07, GDPR compliance.

**Obiective măsurabile (acceptance criteria globale M1):** ★ v1.1.0

| # | Criteriu | Target | Platform |
|---|---|---|---|
| AC-M1-01 | Phase 0 Security checklist 100% completă | toate 6 items CLAUDE.md §6 | Backend |
| AC-M1-02 | LS engine + Lead Firewall (BR-01) funcțional cu T01-T07 PASS | 7/7 vectori | Backend |
| AC-M1-03 | Property + Match engine v1 (PS + IS) | acuratețe ≥ 70% pe set test | Backend |
| **AC-M1-04a** ★ | Web dashboard **Agent** (lead queue, task max 3, SLA timer, lead detail, activity log) | 100% feature critic + Playwright E2E PASS | **WEB primary** |
| **AC-M1-04b** ★ NEW | Web dashboard **Manager** (team overview, escalation queue, APS leaderboard, audit log viewer) | 100% feature critic + RBAC enforced | **WEB primary** |
| AC-M1-05 | RBAC 5 roluri operațional + AUDIT_LOG append-only | 100% WRITE logged | Backend + Web |
| AC-M1-06 | GDPR consent capture + Privacy Policy publică RO+RU | 100% leads cu consent | Web (legal pages) |
| AC-M1-07 | Pilot deploy 2-3 tenanți + monitoring (Sentry + uptime) | live ≥ 7 zile fără incident P1 | Web + Backend |
| AC-M1-08 | HST M1 tehnic complet PASS | 0 findings CRIT/HIGH | Cross-cutting |
| **AC-M1-09** ★ NEW | Web FCP < 1.5s pe pagina lead queue (3G slow) | Lighthouse score Performance ≥ 80 | **WEB** |
| **AC-M1-10** ★ NEW | Web i18n RO + RU complet pe ecrane critice | 100% string-uri externalizate | **WEB** |

**Notă M1 platform scope:** Mobile RN este **AMÂNAT** la M2.S3 (companion). M1 livrează doar platforma WEB.

### 5.2 Sub-stages M1

#### **M1.S1 — Phase 0 Security Foundation**

| Aspect | Valoare |
|---|---|
| **Hats active** | SECURITY (primary), IMPLEMENTER (primary), DBA (secondary), DEVOPS (secondary), TESTER (secondary) |
| **Spec referință** | `TECH_SPEC_REVYX_tenancy-roles-extension_v1.1.0.md`, `TECH_SPEC_REVYX_audit-log_v1.1.1.md`, `TECH_SPEC_REVYX_webhook-intake_v1.0.0.md` |
| **Sub-tasks** | (a) Repo bootstrap TypeScript strict · (b) Supabase Auth integration · (c) JWT RS256 + RBAC middleware · (d) AUDIT_LOG schema + trigger PostgreSQL · (e) Webhook HMAC-SHA256 verification · (f) Rate limiting · (g) GDPR câmpuri LEAD · (h) Privacy Policy + Cookie Policy publish |
| **Acceptance** | CLAUDE.md §6 checklist all ☑; AC-M1-01 |
| **Token strategy** | SECURITY produce checklist scurt → IMPLEMENTER aplică punct-cu-punct fără re-discuție |

#### **M1.S2 — Phase A Core Infrastructure**

| Aspect | Valoare |
|---|---|
| **Hats active** | IMPLEMENTER (primary), DBA (primary), DEVOPS (secondary), TESTER (secondary) |
| **Output** | Migrări 0001-0099, Redis setup, API skeleton (Fastify recomandat — performant + low overhead), error handling, logger structurat (pino) |
| **Acceptance** | API server pornește, health check 200, migrări idempotente, Redis cache funcțional |

#### **M1.S3 — Phase B Lead Intake + Scoring**

| Aspect | Valoare |
|---|---|
| **Hats active** | IMPLEMENTER (primary), TESTER (primary), DBA (secondary), ARCHITECT (secondary) |
| **Spec referință** | `TECH_SPEC_REVYX_lead-scoring_v1.0.0.md`, `TECH_SPEC_REVYX_webhook-intake_v1.0.0.md`, `WORKFLOW_REVYX_lead-lifecycle_v1.0.0.md`, `WORKFLOW_REVYX_escalation_v1.0.0.md` |
| **Sub-tasks** | (a) Webhook parsers Meta/Google/OLX · (b) LS engine formula BRD §7.1 · (c) `LS_initial=0.30` (BR-02) · (d) Lead Firewall LS≥0.60 + contact valid (BR-01) · (e) SLA engine 15min/2h/24h · (f) Escalation Protocol 3-niveluri (BR-03) · (g) Max 3 task active/agent (BR-04) · (h) Nurturing leads <0.40 · (i) Tests T01-T07 + BR-01..07 |
| **Acceptance** | AC-M1-02; testele T01-T07 PASS 7/7 |
| **Token strategy** | TESTER scrie întâi vectorii T01-T07 → IMPLEMENTER face cod să facă PASS (TDD strict) |

#### **M1.S4 — Phase C Property + Matching**

| Aspect | Valoare |
|---|---|
| **Hats active** | IMPLEMENTER (primary), DBA (primary), TESTER (secondary), ARCHITECT (secondary) |
| **Spec referință** | `TECH_SPEC_REVYX_property_v1.0.0.md`, `TECH_SPEC_REVYX_match-engine_v1.0.0.md`, `TECH_SPEC_REVYX_interaction-strength_v1.0.0.md`, `WORKFLOW_REVYX_property-onboarding_v1.0.0.md` |
| **Sub-tasks** | (a) PROPERTY schema + CRUD · (b) PS scoring §7.2 · (c) LF = 1 − min(1, zile/90) decay · (d) IS engine activitate-based · (e) Match v1 (PS+LS+IS combined) · (f) Re-matching trigger needs_review=true (BR-05) · (g) NU anulare automată deals |
| **Acceptance** | AC-M1-03 |
| **Notă** | pgvector HNSW (match v2) este AMÂNAT pentru M2 (Phase G marketplace) |

#### **M1.S5 — Web Dashboard Agent** ★ v1.1.0

| Aspect | Valoare |
|---|---|
| **Hats active** | FRONTEND WEB DEV (primary), DESIGNER (primary), TESTER (secondary), ARCHITECT (secondary) |
| **Platformă** | **WEB ONLY** (Mobile companion amânat la M2.S3) |
| **Spec referință** | `TECH_SPEC_REVYX_web-platform_v1.0.0.md` (NEW — to be created în S16+) + `WORKFLOW_REVYX_lead-lifecycle_v1.0.0.md` |
| **Output** | `apps/web/` Next.js 14 App Router cu auth Supabase, dashboard agent: lead queue prioritizat (sorted by LS + SLA expiry), task list max 3 active (BR-04), SLA timer real-time (15min/2h/24h), lead detail page + activity log + IS history, property browse + match suggestions |
| **Acceptance** | AC-M1-04a + AC-M1-09 + AC-M1-10 |
| **Token strategy** | Reuse componente design system din M0.S1; Server Components pentru fetching, Client Components doar pentru interactivitate (lead actions, filters); shadcn/ui pre-built |
| **Routing** | `/dashboard`, `/leads`, `/leads/[id]`, `/properties`, `/properties/[id]`, `/tasks` |

#### **M1.S6 — Web Dashboard Manager** ★ NEW v1.1.0

| Aspect | Valoare |
|---|---|
| **Hats active** | FRONTEND WEB DEV (primary), DESIGNER (secondary), TESTER (secondary), ARCHITECT (secondary) |
| **Platformă** | **WEB ONLY** (admin features niciodată Mobile per DP-05) |
| **Output** | `apps/web/manager/` sub-routes cu RBAC enforcement (team_lead + manager roles): team overview cards (APS leaderboard, lead conversion), escalation queue (BR-03 leveled), audit log viewer (filterable cu PII redaction §6.5), tenant settings (RBAC mgmt, user invite) |
| **Acceptance** | AC-M1-04b |
| **Critical features** | Read-only Audit log view (BR-07 append-only respectat); RBAC matrix view; escalation override (manager only, audit-logged) |
| **Routing** | `/manager`, `/manager/team`, `/manager/escalations`, `/manager/audit`, `/manager/settings` |

#### **M1.S7 — Pilot Deploy + Monitoring** ★ shifted (was S6)

| Aspect | Valoare |
|---|---|
| **Hats active** | DEVOPS (primary), SECURITY (primary), BACKEND DEV (secondary), FRONTEND WEB DEV (secondary), DBA (secondary), TESTER (secondary) |
| **Output** | Deploy production: Web pe Vercel (frontend) + AWS eu-west-1 (API + DB conform SCC §3.4) sau Hetzner pentru cost reduction; Sentry pentru Web + Backend; uptime monitoring (Better Uptime); runbook DR baseline |
| **Acceptance** | AC-M1-07 |
| **Tenanți pilot** | 2-3 agenții imobiliare RM (cohort criteria adaptat din `RUNBOOK_REVYX_stage1-mobile-launch_v1.0.0.md`) |

#### **M1.S8 — HST M1 + Bug Fix Sprint ⚠️ GATE** ★ shifted (was S7)

| Aspect | Valoare |
|---|---|
| **Hats active** | ARCHITECT, SECURITY, TESTER, BACKEND DEV, FRONTEND WEB DEV, DBA, DOC |
| **Metodologie** | §8 acest document — 7-rol audit panel complet |
| **Focus** | RBAC correctness (Web enforcement + API), T01-T07 regression, GDPR compliance, SLA precision, audit log completitudine, OWASP top 10 baseline, Web Lighthouse audit (Performance + Accessibility + Best Practices ≥ 80) |
| **Output** | `docs/audit/HST_REVYX_m1_v1.0.0.md` + fix sprint cu PR-uri |
| **Exit gate** | 0 findings CRIT/HIGH; pilot real activ ≥ 7 zile fără P1; AC-M1-04a + AC-M1-04b ☑ |

### 5.3 M1 — Definition of Done

- [ ] AC-M1-01 → AC-M1-08 toate ☑
- [ ] HST M1 raport publicat și findings CRIT/HIGH = 0
- [ ] Pilot 2-3 tenanți cu ≥ 7 zile uptime
- [ ] AUDIT_LOG verificat append-only la nivel BD (revoke UPDATE/DELETE)
- [ ] Privacy Policy + Cookie Policy publice + legal review
- [ ] T01-T07 vectori 7/7 PASS în CI
- [ ] Sign-off PM + PO + Security Lead

---

## 6. M2 — FULL RELEASE GA (DETALIU)

### 6.1 Scope & Obiective

**Definiție:** Produs **GA public** cu toate feature-uri BRD v1.1: Deals + DHI + NBA, Mobile (iOS + Android), WhatsApp Business, ML Pricing CANARY/GA, Churn Prediction, Marketplace two-sided, White-Label Enterprise.

**Obiective măsurabile (acceptance criteria globale M2):** ★ v1.1.0

| # | Criteriu | Target | Platform |
|---|---|---|---|
| AC-M2-01 | DEAL pipeline complet + DHI + NBA funcțional | toate BR-10/11/14-18 PASS | Backend + Web |
| **AC-M2-02a** ★ | **Web platform completă** — admin panel, RBAC mgmt, ML promote UI, marketplace ops, white-label config, reports | 100% feature parity cu BRD v1.1 | **WEB primary** |
| **AC-M2-02b** ★ | Mobile RN COMPANION live (iOS + Android, App Store + Google Play) | ratings ≥ 4.0 după 30 zile + crash-free ≥ 99% | **MOBILE companion** |
| AC-M2-03 | WhatsApp Business cu 5 templates Meta-approved | trimitere reală OK (Web + Mobile entry points) | Web + Mobile |
| AC-M2-04 | ML Pricing model `pricing-gbm v2.0.0` în GA 100% (cu Web promote UI 4-eyes) | bias 0 alert, drift sub threshold | Backend + Web |
| AC-M2-05 | Churn prediction operațional + Prevention Rate ≥ 30% (cu Web CS dashboard) | KPI BRD §6.4 | Backend + Web |
| AC-M2-06 | Marketplace buyer-side (Web public) + Stripe Connect funcțional | NPS ≥ +25 | **WEB public** + Backend |
| AC-M2-07 | White-Label per-tenant theming + custom domain (Web admin config) | ≥ 1 client Enterprise live | **WEB primary** |
| AC-M2-08 | OWASP top 10 audit extern (pen-test) PASS — Web + API + Mobile | 0 finding HIGH/CRIT | Cross-cutting |
| AC-M2-09 | ISO 27001 readiness (BSI Group MD) DPA semnat | ✅ | N/A |
| AC-M2-10 | HST M2 + GA decision board approved | sign-off VP Product + CTO + CISO + DPO | N/A |
| **AC-M2-11** ★ NEW | Web/Mobile feature parity matrix documentată | 100% feature-uri cu "WEB only" / "BOTH" / "MOBILE only" tag | Doc |

### 6.2 Sub-stages M2

#### **M2.S1 — Phase D Deals + DHI + NBA (Backend + Web UI)** ★ v1.1.0

| Aspect | Valoare |
|---|---|
| **Hats active** | BACKEND DEV (primary), TESTER (primary), DBA (secondary), FRONTEND WEB DEV (secondary), ARCHITECT (secondary) |
| **Platformă** | Backend + WEB UI (Mobile read-only la M2.S3) |
| **Spec referință** | `TECH_SPEC_REVYX_dhi-engine_v1.0.0.md`, `TECH_SPEC_REVYX_nba-engine_v1.0.0.md`, `TECH_SPEC_REVYX_aps-engine_v1.0.0.md`, `TECH_SPEC_REVYX_deal-closure_v1.0.0.md`, `TECH_SPEC_REVYX_offer-engine_v1.0.0.md`, `TECH_SPEC_REVYX_showing_v1.0.0.md` |
| **Sub-tasks** | (a) DEAL pipeline + DP probability · (b) DHI: TF (`TF_default=0.70` BR-10), RF · (c) APS: `APS_default=0.65` agenți <5 deals/<30 zile (BR-11) · (d) NBA [0, 2.0] · (e) OFFER state machine · (f) SHOWING scheduling · (g) Commission split deal closure · (h) Web UI deal pipeline (kanban) + DHI heatmap + NBA recommendations widget |
| **Acceptance** | AC-M2-01 |

#### **M2.S2 — Web Platform COMPLETE** ★ NEW v1.1.0 — PRIMARY PLATFORM

| Aspect | Valoare |
|---|---|
| **Hats active** | FRONTEND WEB DEV (primary), DESIGNER (primary), BACKEND DEV (secondary), TESTER (secondary), SECURITY (secondary) |
| **Platformă** | **WEB primary — ~80% workflow agenți + admin** |
| **Scope** | Web platform feature-complete pentru toate rolurile (agent, senior, team_lead, manager, admin): admin panel (RBAC mgmt, tenant config, user invite), reports section (lead conversion, APS leaderboard, deal closure rate), ML Pricing **promote UI cu 4-eyes flow** (admin only), Churn analytics dashboard (CS Lead), Audit log advanced viewer (filterable, exportable), BUYER_PROFILE moderation tools, system health page (admin) |
| **Sub-tasks** | (a) Admin panel `/admin` · (b) Reports section `/reports` cu Recharts · (c) ML promote UI `/admin/ml-models` cu 4-eyes 2-step approval flow (PRICING_MODEL_4EYES_REQUEST → APPROVED) · (d) Churn analytics `/cs/churn-dashboard` (cs_lead role) · (e) Audit viewer `/admin/audit` cu filtre + export CSV · (f) White-Label config `/admin/branding` (Enterprise tier gating) · (g) RBAC matrix view `/admin/rbac` · (h) i18n RO+RU + EN admin-only · (i) Playwright E2E suite |
| **Acceptance** | AC-M2-02a + AC-M2-04 (ML Web UI part) + AC-M2-05 (Churn Web UI part) + AC-M2-07 (White-Label config part) |
| **Token strategy** | Reuse aggressive componente din M1.S5/S6; shadcn/ui Data Table pentru toate listings; Recharts pentru toate charts; React Server Components pentru fetch-uri statice |

#### **M2.S3 — Mobile RN COMPANION** ★ shifted (was M2.S2) — SECONDARY PLATFORM

| Aspect | Valoare |
|---|---|
| **Hats active** | MOBILE DEV (primary), DESIGNER (secondary), BACKEND DEV (secondary), DEVOPS (secondary), TESTER (secondary) |
| **Platformă** | **MOBILE companion — ~20% workflow în deplasare** |
| **Spec referință** | `TECH_SPEC_REVYX_mobile-rn_v1.0.0.md` (+ v1.0.1 PATCH F-S13-01 post-S16) |
| **Scope mobile (FILTERED subset)** | Doar features relevante pentru in-field: lead detail view + call/WhatsApp action, NBA recommendations consum (read), push notifications APNS+FCM, showing check-in (geo-tag + photo upload), property photo gallery upload, voice memo activity log, deal kanban read-only. **EXCLUS din Mobile per DP-05**: RBAC mgmt, white-label config, ML promote, billing, admin panel, reports. |
| **Sub-tasks** | (a) RN setup expo SDK 51 + expo-router · (b) Auth + RBAC mobile (token + secure storage) · (c) Screens lead/deal/task/NBA · (d) Push APNS + FCM · (e) Deep-link `revyx://leads/{id}` (F-S13-01 spec) · (f) Offline sync optimistic locking cu `version` field · (g) Photo upload (compress + S3 presigned) · (h) Geo-tag showing check-in · (i) TestFlight + Play internal · (j) Public release App Store + Play Store |
| **Acceptance** | AC-M2-02b |
| **NU în scope mobile** | Admin features (per DP-05), reports complete, marketplace ops, white-label config |

#### **M2.S4 — Phase F ML Pricing + Churn (Backend + ML)** ★ shifted (was M2.S3)

| Aspect | Valoare |
|---|---|
| **Hats active** | ML ENGINEER (primary), BACKEND DEV (primary), DBA (secondary), TESTER (secondary), SECURITY (secondary) |
| **Platformă** | Backend + ML; UI promote part în M2.S2 (Web) |
| **Spec referință** | `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md`, `TECH_SPEC_REVYX_churn-ga_v1.0.1.md`, `RUNBOOK_REVYX_stage3-ml-pricing-launch_v1.0.0.md` |
| **Sub-tasks** | (a) Model `pricing-gbm v2.0.0` training + `ml_model_registry` · (b) SHADOW 28 zile · (c) 4-eyes promote CANARY 5% (events PRICING_MODEL_4EYES_*) · (d) Bias monitoring SQL daily 03:00 UTC · (e) Auto-rollback 3× CRIT / 30% MAE · (f) CANARY 25% → GA 100% · (g) Churn scoring engine · (h) CS task generation Prevention Rate ≥30% |
| **Acceptance** | AC-M2-04 (backend part) + AC-M2-05 (backend part) |

#### **M2.S5 — Phase G Marketplace + White-Label (Backend + Web)** ★ shifted (was M2.S4)

| Aspect | Valoare |
|---|---|
| **Hats active** | BACKEND DEV (primary), FRONTEND WEB DEV (primary), DESIGNER (primary), DBA (primary), SECURITY (secondary), TESTER (secondary), DEVOPS (secondary) |
| **Platformă** | Backend + **WEB primary** (marketplace public Web; admin config Web) |
| **Spec referință** | `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.0.md`, `TECH_SPEC_REVYX_white-label_v1.0.0.md`, `TECH_SPEC_REVYX_match-engine_v2.0.0.md` (pgvector) |
| **Sub-tasks Backend** | (a) BUYER_PROFILE entity (BRD §8.3) · (b) Contact-grant rate limiting · (c) Stripe Connect + webhooks idempotency · (d) pgvector HNSW match v2 · (e) White-Label backend (per-tenant config) · (f) Cloudflare edge HMAC |
| **Sub-tasks Web** | (g) Marketplace public landing `marketplace.revyx.app` · (h) Buyer self-publish form `/marketplace/publish` · (i) Buyer profile browse + filter · (j) Contact-grant request UI · (k) Agent-side contact requests inbox · (l) White-Label admin config `/admin/branding` (custom domain + colors + logo) · (m) DKIM rotation runbook UI helper |
| **Acceptance** | AC-M2-06 + AC-M2-07 + AC-M2-11 |

#### **M2.S6 — WhatsApp Business Integration** ★ NEW v1.1.0

| Aspect | Valoare |
|---|---|
| **Hats active** | BACKEND DEV (primary), MOBILE DEV (secondary), FRONTEND WEB DEV (secondary), TESTER (secondary) |
| **Platformă** | Backend + Web + Mobile (entry points pe ambele) |
| **Sub-tasks** | (a) WhatsApp Business API integration · (b) 5 templates Meta-approved pre-aprobate · (c) Web "Send WhatsApp" button în lead detail · (d) Mobile "Send WhatsApp" deep-link nativ · (e) Audit log WHATSAPP_* events · (f) Rate limiting Meta API (per-tenant + per-agent) · (g) Delivery status webhook |
| **Acceptance** | AC-M2-03 |

#### **M2.S7 — Security + Performance Hardening** ★ shifted (was M2.S5)

| Aspect | Valoare |
|---|---|
| **Hats active** | SECURITY (primary), ARCHITECT (primary), TESTER (secondary), BACKEND DEV (secondary), FRONTEND WEB DEV (secondary), DEVOPS (secondary) |
| **Scope cross-platform** | Web + API + Mobile sub OWASP top 10 |
| **Sub-tasks** | (a) OWASP top 10 audit (Web + API + Mobile) · (b) Penetration test extern (sau OWASP ZAP self-audit dacă buget limitat) · (c) BSI Group MD DPA signing · (d) ISO 27001 controls verification · (e) DPIA refresh · (f) Performance: query optimization, index audit, N+1 elimination, Web Lighthouse audit final · (g) Load test (k6) backend + lighthouse-ci Web |
| **Acceptance** | AC-M2-08 + AC-M2-09 |

#### **M2.S8 — GA Launch ⚠️ FINAL GATE** ★ shifted (was M2.S6)

| Aspect | Valoare |
|---|---|
| **Hats active** | DEVOPS (primary), SECURITY (primary), DOC (primary), BACKEND DEV (secondary), FRONTEND WEB DEV (secondary), MOBILE DEV (secondary), TESTER (secondary) |
| **Sub-tasks** | (a) HST M2 final cross-platform · (b) Feature flag ramp-up · (c) Public marketing site live `revyx.app` (Web) · (d) Pricing page (GROWTH/BUSINESS/ENTERPRISE) · (e) Onboarding flow self-service · (f) Support docs publice (Web) · (g) Status page `status.revyx.app` · (h) Mobile apps public live App Store + Play Store · (i) GA decision board sign-off · (j) Public launch |
| **Acceptance** | AC-M2-10 |

### 6.3 M2 — Definition of Done ★ v1.1.0

- [ ] AC-M2-01 → AC-M2-11 toate ☑ (11 AC-uri ★)
- [ ] HST M2 raport publicat și findings CRIT/HIGH = 0
- [ ] Pen-test extern PASS (Web + API + Mobile)
- [ ] BSI Group MD DPA semnat
- [ ] **Web platform feature-complete** ★ (admin, reports, marketplace ops, white-label, ML promote UI)
- [ ] **Mobile companion live** App Store + Play Store cu ratings ≥ 4.0
- [ ] **Web/Mobile feature parity matrix** documentată ★ (AC-M2-11)
- [ ] Marketplace + ML + White-Label toate live
- [ ] Sign-off board (VP Product + CTO + CISO + DPO + Audit Lead)

---

## 7. PRE-DEVELOPMENT GATES

### 7.1 Documentation closure (S16-S19)

Cele 4 sesiuni rămase închid documentația Phase 5 conform `RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md`:

| Sesiune | Trigger | Deliverables principale |
|---|---|---|
| S16 | Stage 3 exit | AUDIT_s15, RUNBOOK_stage4-churn, READINESS v1.0.4 |
| S17 | Stage 4 exit | AUDIT_s16, RUNBOOK_stage5-white-label, READINESS v1.0.5 |
| S18 | Stage 5 exit | AUDIT_s17, READINESS v1.1.0 MINOR (GA close) |
| S19 | GA decision | Raport final board, INDEX v1.1.0 |

### 7.2 Hard Stress Test #2 (S20) ⚠️ MANDATORY GATE

**Trigger:** Post-S19 completion.

**Scop:** Re-validare comprehensivă a întregului corpus documentar înainte de a permite start development.

**Metodologie:** §8 acest document. Echipa 7-rol auditori virtuali (CLAUDE.md §10b Regula 3) parcurg **fiecare document** din INDEX + cross-checks integrate.

**Output:** `docs/audit/HST_REVYX_pre-dev_v1.0.0.md` + gap closure backlog.

**Exit gate:** 0 findings CRIT; toate HIGH closed sau triage-uite cu owner + ETA.

### 7.3 Documentation adjustment cycle (S21+)

Post-HST findings → sesiuni S21+ pentru:
- PATCH/MINOR/MAJOR bumps pe documente afectate
- New documente dacă gap-uri descoperite (ex: nou skill, nou playbook, nou tech spec)
- INDEX bump corespunzător

**Exit gate:** Toate findings HST CRIT/HIGH → CLOSED.

### 7.4 Master Plan approval

Acest document (`MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md`, versiunea curentă activă) **trebuie aprobat** înainte de a începe M0.

**Aprobatori:** Senior PM + Senior PO + Solution Architect + Audit Lead + CTO (sign-off în §13 acest document).

---

## 8. HARD STRESS TEST METHODOLOGY

### 8.1 Echipa virtuală 7-rol auditori

Conform CLAUDE.md §10b Regula 3:

| Rol | Focus principal |
|---|---|
| Audit Lead | Orchestrare + severity scoring + remediation tracking |
| Senior Solution Architect | Cross-spec consistency, integration contracts, NFR alignment |
| Senior Security Auditor | RBAC matrix, GDPR Art. 5/6/15-22/32, OWASP, encryption, secrets |
| Senior DBA | Schema, FK/index, RLS, migrations, partitioning |
| Senior QA / Test Architect | Test coverage, edge cases, BR-XX traceability, NFR validation |
| Senior Compliance Auditor | GDPR, Legea 133/2011 RM, Legea 142/2018, retention, DPIA |
| Senior Product Auditor | BRD ↔ specs ↔ workflows formula alignment |

### 8.2 Procese HST

1. **Scope definition** — ce documente/cod intră în audit (full pentru S20; subset per HST M0/M1/M2)
2. **Parallel review** — fiecare auditor parcurge scope-ul în domeniul lui
3. **Findings table** — severitate CRIT/HIGH/MED/LOW + owner + remediation
4. **Triage meeting (sync)** — Audit Lead consolidează, prioritizează
5. **Fix sprint** — IMPLEMENTER/DBA/SECURITY aplică fixes
6. **Re-audit** — re-verificare findings CLOSED
7. **Sign-off** — Audit Lead + relevant auditori semnează raportul

### 8.3 Severity matrix

| Severitate | Impact | Acțiune |
|---|---|---|
| **CRIT** | Blochează release · GDPR breach risk · auth bypass · scoring formula broken | FIX IMMEDIATE pre-merge |
| **HIGH** | Funcționalitate critică afectată · BR-XX neconformitate · compliance gap | FIX în fix sprint pre-milestone exit |
| **MED** | UX degradat · perf sub target · spec inconsistency | Triage → backlog cu owner |
| **LOW** | Nice-to-have · cosmetic · refactor opportunity | Backlog general |

### 8.4 HST cadence

| HST | Trigger | Scope |
|---|---|---|
| **HST #1** ✅ | Pre-Phase 5 (efectuat istoric, 47 gap-uri BRD v1.0→v1.1) | BRD |
| **HST #2 — Pre-Dev** | S20 | Întregul corpus documentar (toate 83+ docs) |
| **HST M0** | M0.S5 | UX, brand, presentation |
| **HST M1** | M1.S7 | Cod + spec + GDPR + RBAC + scoring |
| **HST M2** | M2.S6 | Full system + pen-test extern |

---

## 9. TOKEN EFFICIENCY RULES (Pro plan optimization)

### 9.1 Reguli operaționale

| # | Regulă | Justificare |
|---|---|---|
| 1 | **Maximum 2-3 hats active simultan** | Focus + token reduction |
| 2 | **Architect mode = thinking-heavy, low output** | Designul nu necesită cod final, doar plan structurat |
| 3 | **Implementer mode = no narration, no "let me explain"** | Cod direct, comentarii doar WHY non-obvious |
| 4 | **TESTER scrie întâi vectorii → IMPLEMENTER face PASS (TDD)** | Reducere iterații post-implementare |
| 5 | **Reuse componente** (shadcn/ui, design system M0.S1) | Evită rescriere ad-hoc |
| 6 | **Self-review automated cu §10b Regula 4 înainte de commit** | Reducere re-prompt cycle |
| 7 | **Batch-uri de fișiere conexe în același Edit call** | Reducere round-trips |
| 8 | **Read targeted** (offset+limit pentru fișiere mari) | Evită ingestie integrală |
| 9 | **Skip narrative responses pentru task-uri repetitive** | Output direct fără preamble |
| 10 | **Plan mode pentru task-uri complexe înainte de execuție** | Cleared plan = fewer false starts |

### 9.2 Heuristici de session-planning

- **Sesiune de design (ARCHITECT)** → max 1-2 documente per sesiune
- **Sesiune de implementare (IMPLEMENTER + TESTER)** → 1 feature complet (cod + teste + migration)
- **Sesiune de audit (HST)** → 1 categorie documente (ex: toate Tech Specs Phase B)
- **Sesiune de doc-only (DOC)** → max 3-4 documente noi
- **Sesiune mixed** evitată — risc de focus dilution

### 9.3 Token budget estimat per milestone (Pro plan) ★ v1.1.0

| Milestone | Sesiuni estimate | Cost lunar | Notă |
|---|---|---|---|
| Pre-dev (S16-S20) | 5 | $20 | Doc-only, low burn |
| M0 MVP Prezentare | 8-10 | $20-40 | Web frontend focus, no backend |
| M1 MVP Funcțional (8 sub-stages) ★ | **40-55** | **$100-140** | Phase 0+A+B+C backend + **Web Agent + Web Manager** + pilot |
| M2 FULL Release GA (8 sub-stages) ★ | **70-95** | **$160-240** | Phase D backend + **Web Complete** + Mobile Companion + ML + Marketplace + WhatsApp + GA |
| **Total** | **~125-165** ★ | **~$320-440** ★ | Pe Pro, cu rate-limit overhead 30% · Web work adds ~15-25 sesiuni totale vs v1.0.0 |

---

## 10. RISK REGISTER

| ID | Risc | Probabilitate | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | Rate limit Pro plan blochează sesiuni critice | HIGH | MED | Plan upgrade Max $100 la M1.S3 (Lead Scoring) când complexitatea crește |
| R-02 | Scoring formule descoperite incorecte post-pilot | MED | HIGH | T01-T07 vectori validate în CI; HST M1 testează regresie |
| R-03 | GDPR breach în pilot | LOW | CRIT | Phase 0 BLOCANT; AUDIT_LOG append-only; DPO sign-off pre-M1.S6 |
| R-04 | Mobile RN bugs în production | MED | HIGH | TestFlight + Play internal îndelungat; deep-link spec strict |
| R-05 | ML bias în Pricing model | MED | HIGH | Bias monitoring SQL daily; auto-rollback 3× CRIT; 4-eyes promote |
| R-06 | BSI Group MD DPA întârziere | MED | MED | Plan BSI-M1..M4 (S15 SCC v1.0.1); fallback TÜV/Deloitte MD |
| R-07 | Token budget depășit | HIGH | MED | Aderare strictă §9 reguli; monitoring cost lunar |
| R-08 | Bug pilot live blochează tenanți | MED | HIGH | Sentry alerting; runbook DR baseline; rollback fast cu feature flags |
| R-09 | Scope creep adăugat de stakeholder | MED | MED | BRD = lege; PR cu modificare scope cere sign-off PM + PO |
| R-10 | Claude session pierdută mid-feature | MED | MED | Commit frecvent; PR draft cu progres; Regula 5 prompt next session strict |
| **R-11** ★ NEW | Web/Mobile feature parity drift (feature pe Web, lipsește pe Mobile sau invers) | MED | MED | DP-02 feature parity matrix obligatoriu în orice spec nou; AC-M2-11 verifică matricea la M2 close; HST M2 cross-platform check |
| **R-12** ★ NEW | Web Lighthouse score sub target (<80) la pilot | MED | LOW | AC-M1-09 + AC-M2-07 gating; lighthouse-ci în GitHub Actions CI |
| **R-13** ★ NEW | Web admin features expuse accidental pe Mobile (DP-05 violation) | LOW | HIGH | RBAC enforced server-side; client-side guard în RN; SECURITY hat audit la M2.S3 |

---

## 11. DEFINITION OF DONE — SUMMARY

### Pre-dev
- [x] S15 ✅
- [ ] S16-S19 doc closure
- [ ] S20 HST #2 PASS
- [ ] Master Plan §13 sign-off
- [ ] Gap closure backlog 0 CRIT/HIGH

### M0
- [ ] AC-M0-01 → AC-M0-07
- [ ] HST M0 PASS
- [ ] Demo URL live + pitch deck publicat

### M1 ★ v1.1.0
- [ ] AC-M1-01 → AC-M1-10 (10 AC-uri, split AC-M1-04 în 04a/04b + nou 09/10)
- [ ] HST M1 PASS
- [ ] Pilot tenanți activi ≥ 7 zile uptime
- [ ] Web Agent + Web Manager dashboard live; brand revyx.md compliance 100%

### M2 ★ v1.1.0
- [ ] AC-M2-01 → AC-M2-11 (11 AC-uri, split AC-M2-02 în 02a/02b + nou 11 parity matrix)
- [ ] HST M2 + pen-test PASS (Web + API + Mobile)
- [ ] Web platform feature-complete + Mobile companion live
- [ ] Web/Mobile feature parity matrix documentată
- [ ] Board GA sign-off

---

## 12. CROSS-REFERENCES

| Document | Relație |
|---|---|
| `CLAUDE.md` §6 Phase 0 Security | M1.S1 implementează acest checklist |
| `CLAUDE.md` §10b Regulile 1-7 | Operațional în toate sesiunile |
| `CLAUDE.md` §10b Regula 8 (★ NEW) | "Master Plan compliance" — orice doc/cod nou trebuie să citeze stage-ul Master Plan |
| `docs/BRD_REVYX_v1.1.0.md` | Acceptance criteria M1 + M2 derivate aici |
| `docs/INDEX_REVYX_documents_v1.0.4.md` | INDEX listează acest doc în categoria §2a nouă (Strategic Planning) |
| `docs/audit/READINESS_REVYX_phase5_v1.0.3.md` | Stages 1-5 din Phase 5 = sub-set al pre-dev gating |
| `docs/runbook/RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md` | Sequence operațional pentru S16-S19 |

---

## 13. APPROVAL GATE

| Aprobator | Rol | Sign-off | Data |
|---|---|---|---|
| Senior PM | Plan ownership | ⬜ pending | — |
| Senior PO | Product priorities | ⬜ pending | — |
| Solution Architect | Tech feasibility | ⬜ pending | — |
| Audit Lead | Stress test methodology | ⬜ pending | — |
| CTO | Tech execution | ⬜ pending | — |
| DPO | GDPR + compliance gates | ⬜ pending | — |

**Notă:** Aprobarea acestui Master Plan se face la închiderea S20 HST #2, când întreaga documentație + plan sunt validate ca un întreg coerent.

---

*docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md · v1.1.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
