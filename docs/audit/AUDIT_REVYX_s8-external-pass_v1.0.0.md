# AUDIT — REVYX S8 EXTERNAL PASS
<!-- AUDIT_REVYX_s8-external-pass_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Audit Lead + Senior Solution Architect + Security Auditor + DBA + QA + Compliance + Product Auditor | ★ External audit pass pe S8 (6 specs) per CLAUDE.md §10b Regula 3 · findings tabelate · CRIT/HIGH aplicate inline ca v1.0.1 bumps · MED/LOW tracked pentru S10+ |

---

## 1. Scope

| Element | Detaliu |
|---|---|
| Triggered by | CLAUDE.md §10b Regula 3 — audit obligatoriu la final etapă documentație |
| Specs auditate | `ml-pricing-ga` v1.0.0 · `marketplace-two-sided` v1.0.0 · `white-label` v1.0.0 · `mobile-rn` v1.0.0 · `iso27001-track` v1.0.0 · `churn-ga` v1.0.0 |
| Echipa virtuală | Audit Lead · Senior Solution Architect · Senior Security Auditor · Senior DBA · Senior QA / Test Architect · Senior Compliance Auditor · Senior Product Auditor |
| Output | Findings tabelate cu severitate · fixes aplicate inline · gating items pentru S10+ |

---

## 2. Findings — sumar

| # | Severitate | Aria | Spec | Status |
|---|---|---|---|---|
| F-01 | CRIT | Security · Edge sig | `white-label` §6.1 | ✅ FIXED v1.0.1 |
| F-02 | HIGH | DBA · UNIQUE constraint bug | `marketplace-two-sided` §4.4 | ✅ FIXED v1.0.1 |
| F-03 | HIGH | Architecture · Registry naming | `churn-ga` §4.1 | 📋 TRACKED S10 (rename `pricing_model_registry` → `ml_model_registry` + alias view) |
| F-04 | HIGH | Audit · Event catalog consolidation | All S8 specs | 📋 TRACKED S10 (extension `audit-log` v1.1.0 cu noi events) |
| F-05 | HIGH | Security · RBAC matrix consolidation | Cross-spec | 📋 TRACKED S10 (extension `tenancy-roles-extension` v1.1.0 cu noi roluri) |
| F-06 | MED | Compliance · Compliance auditor RBAC scope | `iso27001-track` §17.2 | 📋 TRACKED S10 |
| F-07 | MED | DBA · Partition maintenance procedure missing | `mobile-rn` §4.3 · `churn-ga` §4.5 · `ml-pricing-ga` §4.2 | 📋 TRACKED S10 (runbook) |
| F-08 | MED | QA · Snapshot redaction tests not formalized | `mobile-rn` §15.6 · `churn-ga` §15 | 📋 TRACKED S10 (test fixture lib) |
| F-09 | MED | Product · BRD §6 retention pillar lipsă referință scor churn | `churn-ga` §1 | 📋 TRACKED S10 (BRD bump) |
| F-10 | LOW | Docs · ★ marker counts inconsistente între S8 specs | toate | NO-OP (cosmetic) |

**Total:** 1 CRIT · 4 HIGH · 4 MED · 1 LOW. Niciun finding necunoscut anterior; CRIT/HIGH fixate inline pentru F-01, F-02. Restul HIGH+MED necesită schimbări cross-spec (audit-log catalog, RBAC matrix, BRD bump) care depășesc S9 — tracked pentru S10.

---

## 3. Findings — detail

### F-01 · CRIT · Edge tenant signature mismatch — `white-label` §6.1

**Echipa:** Senior Security Auditor + Senior Solution Architect

**Constatare:** În §6.1 (Subdomain routing middleware), edge worker semnează `${tenantId}:${Date.now()}` dar app middleware verifică `${tenantId}:` (fără timestamp). Rezultat: **toate verificările vor eșua deterministic** sau, mai grav, dacă `verifySig` ignoră restul payload-ului, semnătura devine **trivial replayabilă**. Header-ul de timestamp nu e propagat.

```typescript
// Edge (incorrect)
const sig = await sign(`${tenantId}:${Date.now()}`, env.EDGE_SIGNING_KEY);
headers.set('X-REVYX-Tenant-Id', tenantId);
headers.set('X-REVYX-Tenant-Sig', sig);

// App (incorrect — payload mismatch)
if (!verifySig(`${tenantId}:`, sig, EDGE_SIGNING_KEY, /* skew=120s */)) { ... }
```

**Impact:** Bypass al validării semnăturii edge → un atacator care pătrunde direct la origin (bypass Cloudflare) poate seta orice `X-REVYX-Tenant-Id` și trecere fără verificare. Multi-tenant data isolation compromis.

**Fix aplicat v1.0.1:** Header separat `X-REVYX-Tenant-Ts` cu timestamp; verificare cu skew tolerance ±120s.

### F-02 · HIGH · UNIQUE constraint bug — `marketplace-two-sided` §4.4

**Echipa:** Senior DBA

**Constatare:** `buyer_match_score` are:
```sql
UNIQUE (property_id, buyer_profile_id, is_current) DEFERRABLE INITIALLY DEFERRED
```
Această constraint **NU** garantează "un singur is_current=TRUE per (property_id, buyer_profile_id)" — permite conflict pe orice combinație. Două rânduri cu `is_current=FALSE` pe același (property_id, buyer_profile_id) violează constraint-ul, blocând persistarea istorică a snapshot-urilor.

**Impact:** Insert nou snapshot cu `is_current=TRUE` (după marcat vechiul `is_current=FALSE`) → conflict cu alt rând istoric `is_current=FALSE` → tranzacție eșuează. Engine-ul de inverse matching devine non-funcțional după primul recompute.

**Fix aplicat v1.0.1:** Înlocuit cu partial unique index `WHERE is_current = TRUE` (analog patternului din `pricing-ai` §4.1).

### F-03 · HIGH · Registry naming — `churn-ga` §4.1

**Echipa:** Senior Solution Architect + Senior Product Auditor

**Constatare:** `churn-ga` reutilizează `pricing_model_registry` ca registry generic pentru toate modelele ML (inclusiv churn). Numele tabelei e specific pricing → confuz pentru orice citire cross-spec.

**Impact:** Confuzie dezvoltatori (foreign key spre `pricing_model_registry` din `churn_score` pare bug) · audit confusion · imposibil de extins curat la modele viitoare (recommendation, fraud, etc.).

**Fix propus (S10):** Migrare 0600 — `ALTER TABLE pricing_model_registry RENAME TO ml_model_registry` + `CREATE VIEW pricing_model_registry AS SELECT * FROM ml_model_registry WHERE model_name LIKE 'pricing%'` (backwards compat). Update specs `ml-pricing-ga` și `churn-ga` la v1.0.2 cu noul nume.

### F-04 · HIGH · AUDIT_LOG catalog consolidation

**Echipa:** Senior Security Auditor + Compliance Auditor

**Constatare:** S8 specs introduc ~50+ event types noi:
- `PRICING_MODEL_*` (8 events)
- `BUYER_*` (12 events)
- `WL_*` (12 events)
- `MOBILE_*`, `AUTH_MOBILE_*` (8 events)
- `CHURN_*` (14 events)
- `ISO_*` (4 events)

Spec-ul canonical `audit-log` v1.0.0 nu a fost actualizat cu acest catalog → audit risk: evenimente apar în AUDIT_LOG fără să fie definite formal în catalog (severity, retention, alerting hooks).

**Fix propus (S10):** Bump `audit-log` la v1.1.0 cu sectiune nouă "Catalog Events Phase 5" listând toate evenimentele cu schema payload + retention + severitate + handler.

### F-05 · HIGH · RBAC matrix consolidation

**Echipa:** Senior Security Auditor

**Constatare:** Roluri noi introduse în S8 fără update central RBAC:
- `data_science_lead` (`ml-pricing-ga`, `churn-ga`)
- `cs_user`, `cs_lead` (`churn-ga`)
- `compliance_auditor` (`iso27001-track`)
- `buyer` (rol public limitat — `marketplace-two-sided`)
- `tenant_admin` cu plan_tier-gating Enterprise (`white-label`)

`tenancy-roles-extension` v1.0.0 nu reflectă acestea → potential gap la audit ISO 27001 (A.5.15 Access control).

**Fix propus (S10):** Bump `tenancy-roles-extension` la v1.1.0 cu RBAC matrix consolidat; verificare că JWT claims acoperă noile roluri; tabel migrare cu enum extension.

### F-06 · MED · Compliance auditor RBAC scope — `iso27001-track` §17.2

**Echipa:** Senior Compliance Auditor

**Constatare:** §17.2 menționează endpoint `GET /admin/iso/evidence-bundle` (CISO only) și rol `compliance_auditor` cu "read-only access la evidence bundle + AUDIT_LOG", dar:
- Nu e listat în RBAC standard din `tenancy-roles-extension`
- Read-only la AUDIT_LOG complet (cross-tenant) ridică risc privacy — auditorul are acces la PII?
- Lipsă procedură de provisioning/de-provisioning pentru auditor extern temporar

**Fix propus (S10):** Definire procedură provisioning auditor extern (acces time-boxed, audit-of-the-audit), restricționare evidence bundle la non-PII.

### F-07 · MED · Partition maintenance procedure missing

**Echipa:** Senior DBA

**Constatare:** Mai multe tabele declară `PARTITION BY RANGE` lunar dar lipsesc:
- Procedură de creare partiție lunară viitoare (cron)
- Procedură de detașare/arhivare partiții vechi (retention 90d/365d)
- Monitoring de "missing partition" pentru luna curentă (would block INSERT)

Aplicabil: `mobile_push_log` (90d), `churn_features_snapshot` (365d), `pricing_prediction_audit` (365d).

**Fix propus (S10):** Runbook `RUNBOOK_REVYX_partition-maintenance_v1.0.0.md` cu cron `pg_partman` sau procedură manuală + alerting.

### F-08 · MED · Snapshot redaction tests not formalized

**Echipa:** Senior QA / Test Architect

**Constatare:** `mobile-rn` §12.3 cere "no PII în push payload" și §15.6 menționează "test snapshot regression". Similar `churn-ga` §12.4 pentru `cs_notes` redaction. Nu există fixture library standardizat — fiecare echipă riscă să implementeze diferit.

**Fix propus (S10):** Lib `@revyx/test-fixtures-pii` cu funcții `assertNoPII(payload)` (regex emails, phone numbers MD/RU/EN, IBANs, CNPs) folosit în CI ca guard.

### F-09 · MED · BRD §6 retention pillar — referință churn lipsă

**Echipa:** Senior Product Auditor

**Constatare:** `churn-ga` §1 scrie "BRD §6 Pilon retention (★ extensie S8)" dar BRD v1.0.0 nu menționează churn score formal. Specs și BRD se desincronizează.

**Fix propus (S10):** Bump BRD la v1.1.0 cu §6.4 Pilon Retention adăugat (cu referință la `churn-ga` formula + KPI).

### F-10 · LOW · ★ marker count inconsistency

**Echipa:** Audit Lead

**Constatare:** Counts `★` per spec: ml-pricing-ga=5, marketplace=5, white-label=3, mobile-rn=3, iso27001=8, churn-ga=6. Inconsistent dar nu blochează — toate au ≥1 marker semantic corect.

**Decizie:** NO-OP (cosmetic, nu reflectă gap real).

---

## 4. Cross-spec consistency checks

| Check | Result |
|---|---|
| Migration numbering 0500-0544 unique | ✅ |
| Header standard (filename, version, copyright) | ✅ 6/6 |
| Footer brandat | ✅ 6/6 |
| TOC ↔ section count match | ✅ verificat sample |
| Referințe upstream specs (rezolvă) | ✅ toate |
| Approval Gate prezent | ✅ 6/6 |
| `★` markers prezenți | ✅ 6/6 |
| AUDIT_LOG event catalog consolidat | ❌ F-04 |
| RBAC matrix consolidat | ❌ F-05 |
| BRD aliniat cu specs | ❌ F-09 |

---

## 5. Out-of-scope items (gating S10+)

| Item | Owner | Trigger |
|---|---|---|
| Legal counsel review pentru `marketplace-two-sided` (terms of buyer profile, dispute resolution) | Legal + DPO | Pre-pilot |
| Regulator notification for ML pricing GA (Moldova) | Legal | Pre-GA rollout |
| ISO 27001 audit firm RFP (Stage 1 + Stage 2 quotes) | CTO + CISO | Lună M+1 după S9 merge |
| Stripe products + price config (real catalog) pentru `marketplace-two-sided` și `white-label` addon | Billing Lead | Pre-pilot |
| App Store + Play Store account provisioning (Apple Developer + Google Play Console) | Mobile Lead | Pre-TestFlight |
| DKIM rotation calendar (selector ` rvxYYYYMMDD`) automation | Security + DevOps | M+1 după white-label deploy |

---

## 6. Inline fixes applied (this session)

| Spec | Old version | New version | Change |
|---|---|---|---|
| `white-label` | 1.0.0 | **1.0.1** | F-01 fix: header `X-REVYX-Tenant-Ts` + skew verify |
| `marketplace-two-sided` | 1.0.0 | **1.0.1** | F-02 fix: partial unique `WHERE is_current = TRUE` |

Restul S8 specs rămân la v1.0.0 — niciun finding CRIT/HIGH inline-fixable fără cross-spec impact.

---

## 7. Approval

| Aprobator | Rol | Sign-off |
|---|---|---|
| Audit Lead | orchestrare audit | ✅ |
| Senior Solution Architect | F-01, F-03 review | ✅ |
| Senior Security Auditor | F-01, F-04, F-05 review | ✅ |
| Senior DBA | F-02, F-07 review | ✅ |
| Senior QA / Test Architect | F-08 review | ✅ |
| Senior Compliance Auditor | F-04, F-06 review | ✅ |
| Senior Product Auditor | F-03, F-09 review | ✅ |

Următorul audit checkpoint: post-S10 (per CLAUDE.md §10b Regula 3) sau la rampa pre-100% feature flag.

---

*docs/audit/AUDIT_REVYX_s8-external-pass_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
