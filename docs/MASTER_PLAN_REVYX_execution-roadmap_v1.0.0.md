# MASTER PLAN — REVYX Execution Roadmap
<!-- MASTER_PLAN_REVYX_execution-roadmap_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | Senior PM + Senior PO + Solution Architect + Audit Lead | ★ INITIAL — Master Plan execution roadmap pentru REVYX AOS. Devine structural backbone al documentației: orice document nou (spec, runbook, audit) trebuie să citeze stage-ul de care aparține și să se conformeze cu acceptance criteria al milestone-ului respectiv. Definește 3 macro-milestones (M0 MVP Prezentare · M1 MVP Funcțional · M2 FULL Release GA), echipa virtuală Claude Code (10 hats cu activare condiționată per stage pentru optimizare token), Hard Stress Test methodology mandatory pre-fiecare milestone, gating documentation closure pre-development (S16-S19 + S20 HST #2). Cross-ref CLAUDE.md §10b Regula 3 (audit checkpoint) + Regula 4 (post-commit verify) + nou Regula 8 (Master Plan compliance). |

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

---

## 2. ECHIPA VIRTUALĂ CLAUDE CODE (HATS)

### 2.1 Filozofie role-switching

Claude joacă **10 roluri distincte** activate condiționat per stage. La un moment dat, **maximum 2-3 hats active** pe aceeași unitate de lucru pentru a păstra focus + minimiza token usage.

### 2.2 Catalog hats

| # | Hat | Activare | Output primar | Token profile |
|---|---|---|---|---|
| 1 | **ARCHITECT** | Plan + design fază nouă | Design doc fragment, ADR, schema diagram | High thinking · Low output |
| 2 | **IMPLEMENTER** | Cod aplicație (backend/frontend) | Fișiere .ts/.tsx/.py minimal-comment | Med thinking · High output focused |
| 3 | **DBA** | Migrări + schema BD | Fișiere SQL idempotente 0001-0XXX | Low thinking · Low output precis |
| 4 | **TESTER** | Test vectori + edge cases | Fișiere .test.ts cu T01-T07 + BR-XX validation | Med thinking · Med output structurat |
| 5 | **SECURITY** | RBAC, GDPR, OWASP, audit hardening | Audit checklist, security review notes, fixes in-place | High thinking · Low output critic |
| 6 | **DEVOPS** | CI/CD, deploy, infra | GitHub Actions yaml, Dockerfile, env templates | Low thinking · Med output template |
| 7 | **ML ENGINEER** | Phase F (ML Pricing + Churn) | Notebook ipynb, model training scripts, registry | High thinking · Med output |
| 8 | **MOBILE DEV** | Phase E (React Native) | Screens .tsx, navigation, native bindings | Med thinking · High output |
| 9 | **DESIGNER** | M0 wireframes, M1 dashboard UI | Componente React + brand-config compliance | Med thinking · Med output vizual |
| 10 | **DOC** | Spec, runbook, audit, INDEX | Markdown cu header + changelog + cross-ref | Med thinking · High output structurat |

### 2.3 Matrice activare hats per stage

| Stage milestone | Hats primari (always) | Hats secundari (conditional) | Hats inactivi |
|---|---|---|---|
| Pre-dev (S16-S20) | DOC, ARCHITECT | SECURITY (HST), TESTER (HST) | toate restul |
| M0.S1-S2 Wireframes + Design | DESIGNER, ARCHITECT | DOC | toate restul |
| M0.S3 React Static Demo | DESIGNER, IMPLEMENTER | DEVOPS | DBA, TESTER, SECURITY, ML, MOBILE |
| M0.S4 Pitch Deck | DOC, ARCHITECT | DESIGNER | toate restul |
| M0.S5 HST M0 | ARCHITECT, SECURITY, TESTER | DOC | IMPLEMENTER, DBA, DEVOPS, ML, MOBILE, DESIGNER |
| M1.S1 Phase 0 Security | SECURITY, IMPLEMENTER | DBA, DEVOPS, TESTER | ML, MOBILE, DESIGNER |
| M1.S2 Phase A Foundation | IMPLEMENTER, DBA | DEVOPS, TESTER | ML, MOBILE, DESIGNER |
| M1.S3 Phase B Lead Scoring | IMPLEMENTER, TESTER | DBA, ARCHITECT | ML, MOBILE, DESIGNER |
| M1.S4 Phase C Property+Match | IMPLEMENTER, DBA | TESTER, ARCHITECT | ML, MOBILE, DESIGNER |
| M1.S5 Agent Dashboard MVP | IMPLEMENTER, DESIGNER | TESTER | DBA, ML, MOBILE |
| M1.S6 Pilot Deploy | DEVOPS, SECURITY | IMPLEMENTER, DBA, TESTER | ML, MOBILE, DESIGNER |
| M1.S7 HST M1 + bug fix | ARCHITECT, SECURITY, TESTER, IMPLEMENTER | DBA, DOC | ML, MOBILE, DESIGNER |
| M2.S1 Phase D Deals | IMPLEMENTER, TESTER | DBA, ARCHITECT | ML, MOBILE |
| M2.S2 Phase E Mobile | MOBILE, IMPLEMENTER | DESIGNER, DEVOPS, TESTER | ML, DBA |
| M2.S3 Phase F ML Pricing | ML ENGINEER, IMPLEMENTER | DBA, TESTER, SECURITY | MOBILE, DESIGNER |
| M2.S4 Phase G Marketplace | IMPLEMENTER, DESIGNER, DBA | SECURITY, TESTER, DEVOPS | ML, MOBILE |
| M2.S5 Hardening | SECURITY, ARCHITECT, TESTER | IMPLEMENTER, DEVOPS | ML, MOBILE, DESIGNER |
| M2.S6 GA Launch | DEVOPS, SECURITY, DOC | IMPLEMENTER, TESTER | ML, MOBILE, DESIGNER |

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

### 3.2 Macro-comparație

| Atribut | M0 — MVP Prezentare | M1 — MVP Funcțional | M2 — FULL Release GA |
|---|---|---|---|
| **Scop** | Pitching investitori/clienți | Pilot real cu tenanți reali | Public GA, toate feature-uri BRD |
| **Backend real** | ❌ Mock data | ✅ Phase 0 + A + B + C | ✅ Phase 0 → G complet |
| **UI complet** | ✅ React demo static | ✅ Web dashboard agent | ✅ Web + Mobile + Marketplace |
| **Auth real** | ❌ Mock | ✅ Supabase Auth + RBAC 5 | ✅ + 4-eyes ML + SCC vendors |
| **GDPR + Audit** | ❌ Nu aplicabil | ✅ Consent + AUDIT_LOG | ✅ + DPIA + SCC + Privacy Policy publică |
| **Stress test** | UX + presentation rehearsal | HST tehnic complet 7-rol | HST complet + pen-test extern |
| **Audience** | Demo deck + video | 2-3 tenanți pilot | Public Moldova + extensie regiune |
| **Sub-stages** | 5 (M0.S1-S5) | 7 (M1.S1-S7) | 6 (M2.S1-S6) |

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

#### **M0.S3 — React Static Demo**

| Aspect | Valoare |
|---|---|
| **Hats active** | IMPLEMENTER (primary), DESIGNER (secondary), DEVOPS (secondary) |
| **Output** | `apps/demo/` Next.js 14 sau Vite+React cu mock-data JSON, deploy Vercel |
| **Acceptance** | Toate ecranele AC-M0-01 funcționale; demo data AC-M0-05 seeded; URL public AC-M0-06 |
| **Tech stack** | React 18, TypeScript strict, TailwindCSS (paletă revyx.md), shadcn/ui componente, lucide-react icons |
| **Token strategy** | IMPLEMENTER folosește shadcn/ui pre-built; minimal custom CSS |

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

**Obiective măsurabile (acceptance criteria globale M1):**

| # | Criteriu | Target |
|---|---|---|
| AC-M1-01 | Phase 0 Security checklist 100% completă | toate 6 items CLAUDE.md §6 |
| AC-M1-02 | LS engine + Lead Firewall (BR-01) funcțional cu T01-T07 PASS | 7/7 vectori |
| AC-M1-03 | Property + Match engine v1 (PS + IS) | acuratețe ≥ 70% pe set test |
| AC-M1-04 | Web dashboard agent (lead queue, task max 3, SLA timer) | 100% feature critic |
| AC-M1-05 | RBAC 5 roluri operațional + AUDIT_LOG append-only | 100% WRITE logged |
| AC-M1-06 | GDPR consent capture + Privacy Policy publică | 100% leads cu consent |
| AC-M1-07 | Pilot deploy 2-3 tenanți + monitoring (Sentry + uptime) | live ≥ 7 zile fără incident P1 |
| AC-M1-08 | HST M1 tehnic complet PASS | 0 findings CRIT/HIGH |

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

#### **M1.S5 — Agent Dashboard Web MVP**

| Aspect | Valoare |
|---|---|
| **Hats active** | IMPLEMENTER (primary), DESIGNER (primary), TESTER (secondary) |
| **Output** | `apps/dashboard/` Next.js 14 cu RSC, autentificare, queue lead-uri prioritizate, task list, SLA timer real-time, lead detail + activity log |
| **Acceptance** | AC-M1-04; brand revyx.md compliance 100% |
| **Reuse M0** | Componente design system din M0.S1 refolosite |

#### **M1.S6 — Pilot Deploy + Monitoring**

| Aspect | Valoare |
|---|---|
| **Hats active** | DEVOPS (primary), SECURITY (primary), IMPLEMENTER (secondary), DBA (secondary), TESTER (secondary) |
| **Output** | Deploy production (AWS eu-west-1 conform SCC §3.4 sau Hetzner pentru cost reduction), Sentry, uptime monitoring (Better Uptime), runbook DR baseline |
| **Acceptance** | AC-M1-07 |
| **Tenanți pilot** | 2-3 agenții imobiliare RM selectați (cohort criteria în runbook S15 stage1 adaptat) |

#### **M1.S7 — HST M1 + Bug Fix Sprint ⚠️ GATE**

| Aspect | Valoare |
|---|---|
| **Hats active** | ARCHITECT, SECURITY, TESTER, IMPLEMENTER, DBA, DOC |
| **Metodologie** | §8 acest document — 7-rol audit panel complet |
| **Focus** | RBAC correctness, T01-T07 regression, GDPR compliance, SLA precision, audit log completitudine, OWASP top 10 baseline |
| **Output** | `docs/audit/HST_REVYX_m1_v1.0.0.md` + fix sprint cu PR-uri |
| **Exit gate** | 0 findings CRIT/HIGH; pilot real activ ≥ 7 zile fără P1 |

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

**Obiective măsurabile (acceptance criteria globale M2):**

| # | Criteriu | Target |
|---|---|---|
| AC-M2-01 | DEAL pipeline complet + DHI + NBA funcțional | toate 6 BR-10/11/14-18 PASS |
| AC-M2-02 | Mobile RN iOS + Android live (App Store + Google Play) | cu ratings ≥ 4.0 după 30 zile |
| AC-M2-03 | WhatsApp Business cu 5 templates Meta-approved | trimitere reală OK |
| AC-M2-04 | ML Pricing model `pricing-gbm v2.0.0` în GA 100% | bias 0 alert, drift sub threshold |
| AC-M2-05 | Churn prediction operațional + Prevention Rate ≥ 30% | KPI BRD §6.4 |
| AC-M2-06 | Marketplace buyer-side + Stripe Connect funcțional | NPS ≥ +25 |
| AC-M2-07 | White-Label per-tenant theming + custom domain | ≥ 1 client Enterprise live |
| AC-M2-08 | OWASP top 10 audit extern (pen-test) PASS | 0 finding HIGH/CRIT |
| AC-M2-09 | ISO 27001 readiness (BSI Group MD) DPA semnat | ✅ |
| AC-M2-10 | HST M2 + GA decision board approved | sign-off VP Product + CTO + CISO + DPO |

### 6.2 Sub-stages M2

#### **M2.S1 — Phase D Deals + DHI + NBA**

| Aspect | Valoare |
|---|---|
| **Hats active** | IMPLEMENTER, TESTER, DBA, ARCHITECT |
| **Spec referință** | `TECH_SPEC_REVYX_dhi-engine_v1.0.0.md`, `TECH_SPEC_REVYX_nba-engine_v1.0.0.md`, `TECH_SPEC_REVYX_aps-engine_v1.0.0.md`, `TECH_SPEC_REVYX_deal-closure_v1.0.0.md`, `TECH_SPEC_REVYX_offer-engine_v1.0.0.md`, `TECH_SPEC_REVYX_showing_v1.0.0.md` |
| **Sub-tasks** | (a) DEAL pipeline + DP probability · (b) DHI: TF (`TF_default=0.70` BR-10), RF · (c) APS: `APS_default=0.65` agenți <5 deals/<30 zile (BR-11) · (d) NBA [0, 2.0] · (e) OFFER state machine · (f) SHOWING scheduling · (g) Commission split deal closure · (h) Manager dashboard |
| **Acceptance** | AC-M2-01 |

#### **M2.S2 — Phase E Mobile React Native + WhatsApp**

| Aspect | Valoare |
|---|---|
| **Hats active** | MOBILE (primary), IMPLEMENTER (primary), DESIGNER (secondary), DEVOPS (secondary), TESTER (secondary) |
| **Spec referință** | `TECH_SPEC_REVYX_mobile-rn_v1.0.0.md` (+ v1.0.1 PATCH F-S13-01 post-S16) |
| **Sub-tasks** | (a) RN setup expo SDK 51 · (b) Auth + RBAC mobile · (c) Screens (lead, deal, task, NBA) · (d) Push APNS + FCM · (e) Deep-link `revyx://leads/{id}` · (f) Offline sync optimistic locking · (g) WhatsApp Business API integration · (h) 5 templates Meta-approved · (i) TestFlight + Play internal · (j) Public release |
| **Acceptance** | AC-M2-02 + AC-M2-03 |

#### **M2.S3 — Phase F ML Pricing + Churn**

| Aspect | Valoare |
|---|---|
| **Hats active** | ML ENGINEER (primary), IMPLEMENTER (primary), DBA (secondary), TESTER (secondary), SECURITY (secondary) |
| **Spec referință** | `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md`, `TECH_SPEC_REVYX_churn-ga_v1.0.1.md`, `RUNBOOK_REVYX_stage3-ml-pricing-launch_v1.0.0.md` (din S15) |
| **Sub-tasks** | (a) Model `pricing-gbm v2.0.0` training + registry · (b) SHADOW 28 zile · (c) 4-eyes promote CANARY 5% · (d) Bias monitoring SQL daily · (e) Auto-rollback 3× CRIT / 30% MAE · (f) CANARY 25% → GA 100% · (g) Churn scoring engine · (h) CS task generation Prevention Rate ≥30% |
| **Acceptance** | AC-M2-04 + AC-M2-05 |

#### **M2.S4 — Phase G Marketplace + White-Label**

| Aspect | Valoare |
|---|---|
| **Hats active** | IMPLEMENTER (primary), DESIGNER (primary), DBA (primary), SECURITY (secondary), TESTER (secondary), DEVOPS (secondary) |
| **Spec referință** | `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.0.md`, `TECH_SPEC_REVYX_white-label_v1.0.0.md`, `TECH_SPEC_REVYX_match-engine_v2.0.0.md` (pgvector) |
| **Sub-tasks** | (a) BUYER_PROFILE entity (BRD §8.3) · (b) Self-publish UI · (c) Contact-grant flow + rate limiting · (d) Stripe Connect + webhooks idempotency · (e) pgvector HNSW match v2 · (f) White-Label per-tenant theming · (g) Custom domain + Cloudflare edge HMAC · (h) DKIM rotation runbook · (i) L10n RO+RU complet |
| **Acceptance** | AC-M2-06 + AC-M2-07 |

#### **M2.S5 — Security + Performance Hardening**

| Aspect | Valoare |
|---|---|
| **Hats active** | SECURITY (primary), ARCHITECT (primary), TESTER (secondary), IMPLEMENTER (secondary), DEVOPS (secondary) |
| **Sub-tasks** | (a) OWASP top 10 audit · (b) Penetration test (extern dacă buget; altfel self-audit cu OWASP ZAP) · (c) BSI Group MD DPA signing · (d) ISO 27001 controls verification · (e) DPIA refresh · (f) Performance: query optimization, index audit, N+1 elimination · (g) Load test (k6) |
| **Acceptance** | AC-M2-08 + AC-M2-09 |

#### **M2.S6 — GA Launch ⚠️ FINAL GATE**

| Aspect | Valoare |
|---|---|
| **Hats active** | DEVOPS (primary), SECURITY (primary), DOC (primary), IMPLEMENTER (secondary), TESTER (secondary) |
| **Sub-tasks** | (a) HST M2 final · (b) Feature flag ramp-up · (c) Public marketing site live · (d) Pricing page (GROWTH/BUSINESS/ENTERPRISE) · (e) Onboarding flow self-service · (f) Support docs publice · (g) Status page (status.revyx.app) · (h) GA decision board sign-off · (i) Public launch |
| **Acceptance** | AC-M2-10 |

### 6.3 M2 — Definition of Done

- [ ] AC-M2-01 → AC-M2-10 toate ☑
- [ ] HST M2 raport publicat și findings CRIT/HIGH = 0
- [ ] Pen-test extern PASS
- [ ] BSI Group MD DPA semnat
- [ ] App Store + Play Store apps live
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

Acest document (`MASTER_PLAN_REVYX_execution-roadmap_v1.0.0.md`) **trebuie aprobat** înainte de a începe M0.

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

### 9.3 Token budget estimat per milestone (Pro plan)

| Milestone | Sesiuni estimate | Cost lunar | Notă |
|---|---|---|---|
| Pre-dev (S16-S20) | 5 | $20 | Doc-only, low burn |
| M0 MVP Prezentare | 8-10 | $20-40 | Frontend focus, no backend |
| M1 MVP Funcțional | 35-45 | $80-120 | Full backend + dashboard + pilot |
| M2 FULL Release GA | 60-80 | $140-200 | Mobile + ML + Marketplace + GA |
| **Total** | **~110-140** | **~$280-380** | Pe Pro, cu rate-limit overhead 30% |

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

### M1
- [ ] AC-M1-01 → AC-M1-08
- [ ] HST M1 PASS
- [ ] Pilot tenanți activi ≥ 7 zile uptime

### M2
- [ ] AC-M2-01 → AC-M2-10
- [ ] HST M2 + pen-test PASS
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

*docs/MASTER_PLAN_REVYX_execution-roadmap_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
