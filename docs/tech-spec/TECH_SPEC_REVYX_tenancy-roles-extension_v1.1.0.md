# TECH SPEC — REVYX Tenancy Roles Extension
<!-- TECH_SPEC_REVYX_tenancy-roles-extension_v1.1.0.md · v1.1.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect | Spec inițială — 4 custom roles tenancy-specific (`owner`, `network_lead`, `network_member`, `franchise_admin`) |
| 1.1.0 | 2026-05 | Senior PM + Solution Architect + Security Auditor + Compliance Auditor | ★ Closes F-05 HIGH + F-06 MED (AUDIT_REVYX_s8-external-pass v1.0.0) — RBAC matrix consolidat cu roluri S8/S9: `data_science_lead`, `cs_user`, `cs_lead`, `compliance_auditor`, `buyer` (public limited), `tenant_admin` (Enterprise plan-tier gated) · JWT claims schema extins additiv · migrare 0610 pentru role enum extension · procedură provisioning time-boxed `compliance_auditor` cu AUDIT_LOG access fără PII unmask |

---

> **Backwards compat (v1.0.0 → v1.1.0):** v1.1.0 **adaugă** 6 roluri noi la catalog (toate `is_seeded=TRUE`) și **extinde** JWT claims schema cu câmp opțional `plan_tier` necesar pentru `tenant_admin`-gating. Roles existente (`owner`, `network_lead`, `network_member`, `franchise_admin`) rămân **neschimbate** ca definiție, scope și parent. Resolution algorithm (§6) rămâne neschimbat semantic; doar lista de roluri seedă este extinsă.

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Context tenancy (rezumat)](#2-context-tenancy-rezumat)
3. [Stack & Dependencies](#3-stack--dependencies)
4. [Data Model](#4-data-model)
5. [API Contracts](#5-api-contracts)
6. [Role Resolution Algorithm](#6-role-resolution-algorithm)
7. [State Machine](#7-state-machine)
8. [Concurrency](#8-concurrency)
9. [Caching](#9-caching)
10. [Background Jobs](#10-background-jobs)
11. [Error Handling](#11-error-handling)
12. [Security](#12-security)
13. [Observability](#13-observability)
14. [Performance Budgets](#14-performance-budgets)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment](#16-deployment)
17. [Migration & Seed Strategy](#17-migration--seed-strategy)
18. [Risks & Mitigations](#18-risks--mitigations)
19. [Impact Assessment](#19-impact-assessment)

---

## 1. Executive Summary

REVYX expune **5 system roles** (BRD §10) și un set de **roluri custom seed-uite** la provisioning. v1.0.0 a definit 4 custom roles (`owner`, `network_lead`, `network_member`, `franchise_admin`). v1.1.0 consolidează matricea RBAC cu **6 roluri suplimentare** introduse de S8/S9, alături de procedura time-boxed pentru auditori externi.

| Atribut | Valoare |
|---|---|
| **Scope** | Definiție · seed · validare · resolution custom roles tenancy + roluri operaționale S8/S9 |
| **Referință** | BRD v1.1.0 §10 RBAC + §6.4 Pilon Retention · CLAUDE.md §3 RBAC · F-05 HIGH + F-06 MED audit S9 |
| **Phase** | 0 (BLOCANT) — extensie la Phase 5 (S8/S9 governance) |

**Roluri seedă consolidate (10):**

| Cod rol | Aplicabil în tenant_type | Parent system role | Plan-tier gating | Esență |
|---|---|---|---|---|
| `owner` | toate | `admin` | — | v1.0.0 — proprietar juridic tenant |
| `network_lead` | NETWORK | `manager` | — | v1.0.0 |
| `network_member` | NETWORK | `team_lead` | — | v1.0.0 |
| `franchise_admin` | FRANCHISE / MARKETPLACE | `admin` | — | v1.0.0 |
| ★ `data_science_lead` | toate | `manager` (limited domain) | — | Register/promote modele ML până la CANARY(25%) (`ml-pricing-ga` §12 · `churn-ga` §12.1) |
| ★ `cs_user` | toate | `agent` (limited domain) | — | CS task ops (queue propriu, outcome record) per `churn-ga` §12.1 |
| ★ `cs_lead` | toate | `manager` (limited domain) | — | CS reassign · pause task gen · dashboard tenant-wide |
| ★ `compliance_auditor` | toate | (no parent — explicit grants only) | — | Time-boxed read-only acces ISO/INC/DR_TEST + AUDIT_LOG fără PII unmask |
| ★ `buyer` (public limited) | MARKETPLACE | (no parent) | — | Self-service buyer profile (`marketplace-two-sided` v1.0.1) — niciun acces operațiuni intern |
| ★ `tenant_admin` | toate (Enterprise gated) | `admin` (scoped la propriul tenant) | **`ENTERPRISE`** plan-tier obligatoriu | White-label config + tenant settings (`white-label` v1.0.1 §6) |

---

## 2. Context tenancy (rezumat)

(Identic cu v1.0.0 §2 — 6 modele tenant: SOLO, AGENCY, NETWORK, FRANCHISE, MARKETPLACE, ENTERPRISE.)

### 2.3 ★ Surse roluri noi v1.1.0

| Sursă spec | Roluri introduse |
|---|---|
| `ml-pricing-ga` v1.0.0+ §12 | `data_science_lead` |
| `churn-ga` v1.0.0+ §12.1 | `cs_user`, `cs_lead`, `data_science_lead` (re-utilizat) |
| `iso27001-track` v1.0.0 §17.2 | `compliance_auditor` |
| `marketplace-two-sided` v1.0.1 §5 | `buyer` (public limited) |
| `white-label` v1.0.1 §6 | `tenant_admin` (Enterprise gated) |

---

## 3. Stack & Dependencies

(Identic cu v1.0.0 §3.)

---

## 4. Data Model

### 4.1–4.4

(Identic cu v1.0.0 §4.1–4.4 — schema `role`, `user_role` extinsă, validation trigger.)

### 4.5 ★ Tenant plan-tier (referință) — sursă canonical `white-label` v1.0.1

`tenant.plan_tier` enum existent: `STARTER` < `GROWTH` < `BUSINESS` < `ENTERPRISE`. v1.1.0 reutilizează acest câmp pentru gating-ul `tenant_admin` (vezi §4.7).

### 4.6 ★ Seed extins (migrare 0610)

```sql
-- Migrare: 0610_role_seed_phase5.sql
INSERT INTO role (code, kind, parent_role_code, applicable_tenant_types, scope_type, is_seeded, description)
VALUES
  ('data_science_lead',  'CUSTOM', 'manager',  ARRAY['SOLO','AGENCY','NETWORK','FRANCHISE','MARKETPLACE','ENTERPRISE'], 'TENANT',   TRUE, 'Data Science Lead — register/promote modele ML până la CANARY(25%); GA necesită 4-eyes admin (ml-pricing-ga §12)'),
  ('cs_user',            'CUSTOM', 'agent',    ARRAY['SOLO','AGENCY','NETWORK','FRANCHISE','MARKETPLACE','ENTERPRISE'], 'TENANT',   TRUE, 'Customer Success user — task ops + outcome record (churn-ga §12.1)'),
  ('cs_lead',            'CUSTOM', 'manager',  ARRAY['SOLO','AGENCY','NETWORK','FRANCHISE','MARKETPLACE','ENTERPRISE'], 'TENANT',   TRUE, 'Customer Success lead — reassign + pause task gen + dashboard tenant-wide'),
  ('compliance_auditor', 'CUSTOM', NULL,       ARRAY['SOLO','AGENCY','NETWORK','FRANCHISE','MARKETPLACE','ENTERPRISE'], 'GLOBAL',   TRUE, 'External compliance auditor — time-boxed read-only ISO/INC/DR_TEST + AUDIT_LOG fără PII unmask (iso27001-track §17.2)'),
  ('buyer',              'CUSTOM', NULL,       ARRAY['MARKETPLACE'],                                                    'TENANT',   TRUE, 'Public limited buyer self-service — own buyer_profile only (marketplace-two-sided v1.0.1)'),
  ('tenant_admin',       'CUSTOM', 'admin',    ARRAY['SOLO','AGENCY','NETWORK','FRANCHISE','MARKETPLACE','ENTERPRISE'], 'TENANT',   TRUE, 'Tenant admin — white-label config + tenant settings; ENTERPRISE plan-tier required (white-label v1.0.1 §6)')
ON CONFLICT (code) DO UPDATE SET
  kind                    = EXCLUDED.kind,
  parent_role_code        = EXCLUDED.parent_role_code,
  applicable_tenant_types = EXCLUDED.applicable_tenant_types,
  scope_type              = EXCLUDED.scope_type,
  is_seeded               = EXCLUDED.is_seeded,
  description             = EXCLUDED.description;
```

### 4.7 ★ Plan-tier gating trigger (`tenant_admin`)

```sql
-- Migrare: 0610 (continuation)
CREATE OR REPLACE FUNCTION user_role_validate_plan_tier()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  pt TEXT;
BEGIN
  IF NEW.role_code = 'tenant_admin' THEN
    SELECT t.plan_tier INTO pt FROM tenant t WHERE t.tenant_id = NEW.tenant_id;
    IF pt IS DISTINCT FROM 'ENTERPRISE' THEN
      RAISE EXCEPTION 'role tenant_admin requires plan_tier=ENTERPRISE (current=%)', pt
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_role_plan_tier_check
  BEFORE INSERT OR UPDATE ON user_role
  FOR EACH ROW EXECUTE FUNCTION user_role_validate_plan_tier();
```

> **Plan downgrade flow:** dacă tenant downgrades de la ENTERPRISE, `user_role_plan_tier_check` blochează grants noi `tenant_admin`. Job `tenant_plan_downgrade_audit` (cron `0 3 * * *`) marchează grants `tenant_admin` existente cu `revoked_at=NOW()`, `revoked_by=SYSTEM` și emite `RBAC_ROLE_REVOKED` cu `metadata.reason='PLAN_DOWNGRADE'`. Notificare către owner pentru re-grant manual la upgrade.

### 4.8 ★ Time-boxed `compliance_auditor` (`expires_at` obligatoriu)

```sql
-- Migrare: 0610 (continuation)
CREATE OR REPLACE FUNCTION user_role_validate_compliance_auditor_expiry()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.role_code = 'compliance_auditor' AND NEW.expires_at IS NULL THEN
    RAISE EXCEPTION 'role compliance_auditor requires expires_at NOT NULL (max 90 zile from grant)'
      USING ERRCODE = 'check_violation';
  END IF;
  IF NEW.role_code = 'compliance_auditor' AND NEW.expires_at > NEW.granted_at + INTERVAL '90 days' THEN
    RAISE EXCEPTION 'role compliance_auditor expires_at must be ≤ granted_at + 90 days'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_role_compliance_auditor_expiry_check
  BEFORE INSERT OR UPDATE ON user_role
  FOR EACH ROW EXECUTE FUNCTION user_role_validate_compliance_auditor_expiry();
```

> **Note:** `user_role.expires_at` (existent v1.0.0 §4.2) e folosit; rolul existent `user_role_expire` cron (vezi v1.0.0 §10) auto-revoke la `expires_at < NOW()`. Combinația trigger + cron garantează acces strict time-boxed (F-06 closed).

### 4.9 ★ RBAC matrix consolidat v1.1.0

| Permisiune | agent | senior_agent | team_lead | manager | admin | data_science_lead | cs_user | cs_lead | compliance_auditor | buyer | tenant_admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Leads & Deals proprii | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Override lead priority | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lead Firewall Manager Override | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Toate deal-urile echipei | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AUDIT_LOG access | ❌ | ❌ | ❌ | RO tenant | Full tenant | RO PRICING_MODEL_*+CHURN_* | ❌ | RO CHURN_* | RO ISO/INC/DR_TEST cross-tenant **fără PII unmask** | ❌ | RO WL_* tenant propriu |
| GDPR Tools & Export | ❌ | ❌ | ❌ | Export | Full | ❌ | ❌ | ❌ | ❌ | self only | ❌ |
| Config sistem & Scoring weights | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pricing model register | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ (până la CANARY 25%) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pricing model promote → GA | ❌ | ❌ | ❌ | ❌ | ✅ (4-eyes) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| CS task queue + outcome | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (own) | ✅ (tenant-wide) | ❌ | ❌ | ❌ |
| CS pause task generation | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Churn AUC dashboard | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| BUYER_PROFILE self-service | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (own) | ❌ |
| BUYER contact grant approve/deny | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (own) | ❌ |
| White-label config (domain, branding, email DKIM) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Enterprise) |
| ISO evidence bundle (read-only, fără PII) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ (time-boxed) | ❌ | ❌ |

> **Notă semantică:** `compliance_auditor` are `parent_role_code = NULL` (no inheritance) — **nu** moștenește permisiuni `agent/manager/admin`. Permisiunile sunt explicit grant-uite în matricea de mai sus și sunt strict read-only. Acces la entități business (LEAD, DEAL, PROPERTY, AGENT) **interzis** — auditorul vede doar evenimentele AUDIT_LOG cu `event_type` ∈ ISO_*, INC_*, DR_TEST_* (vezi `audit-log` v1.1.0 §4.4.6–4.4.8).

---

## 5. API Contracts

(Identic cu v1.0.0 §5.)

### 5.3 ★ Endpoint provisioning compliance_auditor (procedure)

| Method | Path | RBAC | Descriere |
|---|---|---|---|
| POST | `/api/v1/admin/compliance/auditor-provision` | super_admin (ITPRO) + DPO sign-off | Body: `{auditor_email, scope:{ tenant_ids:[...] \| 'cross_tenant_iso_only' }, expires_at, audit_firm, contract_uri}` |
| GET | `/api/v1/admin/compliance/auditor/:user_id` | super_admin + admin tenant-affected | Status acces · expires_at · audit query log meta |
| POST | `/api/v1/admin/compliance/auditor/:user_id/revoke` | super_admin SAU DPO | Body: `{reason}` — revocare imediată |

**Procedură 4-eyes provisioning:**

1. Request CISO: `POST /auditor-provision` cu `audit_firm`, `contract_uri` (PDF), `scope`, `expires_at` (≤90 zile).
2. DPO sign-off (separat, în 24h) — altfel request expiră.
3. Emit `RBAC_ROLE_GRANTED` + `metadata.reason='COMPLIANCE_AUDIT'`, `metadata.audit_firm`, `metadata.contract_uri`, `metadata.expires_at`.
4. User invitat via email cu link MFA-protected (TOTP obligatoriu — moștenit din `iso27001-track`).
5. Toate query-urile auditorului peste `audit_log` log-uite ca `AUDIT_QUERIED` cu `metadata.actor_role='compliance_auditor'`, `metadata.session_id` — meta-audit cross-checkable.

**De-provisioning:**

- Auto-revoke la `expires_at` (cron `user_role_expire` existent v1.0.0 §10).
- Manual revoke prin `POST /revoke` — emite `RBAC_ROLE_REVOKED` + `metadata.reason`, invalidate Redis cache imediat (§9), forțare logout sesiune (BR-12 analog).

---

## 6. Role Resolution Algorithm

(Identic cu v1.0.0 §6.)

### 6.4 ★ JWT claims schema v1.1.0 (additiv)

```json
{
  "sub": "user_uuid",
  "tenant_id": "tenant_uuid",
  "tenant_type": "ENTERPRISE",
  "plan_tier": "ENTERPRISE",                                 // ★ NEW (additive, optional in v1.0.0 token)
  "roles": [
    { "code": "tenant_admin",        "scope_id": null,                                                    "inherited": false },
    { "code": "admin",               "scope_id": null,                                                    "inherited": true  },
    { "code": "data_science_lead",   "scope_id": null,                                                    "inherited": false }
  ],
  "compliance_auditor_session": {                            // ★ NEW (only present if role='compliance_auditor')
    "scope": "cross_tenant_iso_only",
    "expires_at": "2026-08-10T12:00:00Z",
    "audit_firm": "BSI Group MD",
    "contract_uri": "s3://revyx-legal/contracts/2026-bsi.pdf",
    "session_id": "uuid"                                     // for meta-audit AUDIT_QUERIED logs
  },
  "iat": 1714867200,
  "exp": 1714868100
}
```

**Backwards compat:** consumatorii JWT (Phase 0) ignorau câmpuri necunoscute (RFC 7519 §4 + spec internal). Token-uri v1.0.0 fără `plan_tier`/`compliance_auditor_session` rămân valide; pentru rolurile noi v1.1.0, cererile fără aceste claims sunt rejected (verifier middleware §12.5).

### 6.5 ★ Permission resolver — expanded

```typescript
// Permission map per role-code → set of permissions
const PERMISSION_MAP: Record<string, Permission[]> = {
  // ... (existent agent/senior_agent/team_lead/manager/admin from v1.0.0)
  data_science_lead: ['ml.model.register','ml.model.promote.shadow','ml.model.promote.canary',
                      'ml.model.metrics.read','churn.dashboard.read','churn.retrain.trigger'],
  cs_user:           ['cs.queue.read.own','cs.task.start','cs.task.contact','cs.task.outcome.record',
                      'cs.task.snooze'],
  cs_lead:           ['cs.queue.read.tenant','cs.task.reassign','cs.task.gen.pause','cs.task.gen.resume',
                      'cs.kpi.dashboard.read','cs.queue.read.own','cs.task.start','cs.task.contact',
                      'cs.task.outcome.record','cs.task.snooze'],
  compliance_auditor:['audit.read.iso','audit.read.inc','audit.read.dr_test',
                      'audit.read.no_pii_unmask','iso.evidence_bundle.read'],
  buyer:             ['buyer_profile.self.create','buyer_profile.self.update','buyer_profile.self.publish',
                      'buyer_profile.self.pause','buyer_profile.self.revoke',
                      'buyer.contact_grant.approve.own','buyer.contact_grant.deny.own',
                      'buyer.contact_grant.revoke.own','buyer_profile.self.read'],
  tenant_admin:      ['wl.config.read','wl.config.update','wl.domain.claim','wl.domain.verify',
                      'wl.domain.revoke','wl.email.dkim.configure','tenant.settings.update.own',
                      'audit.read.wl.own_tenant'],
};
```

---

## 7. State Machine

(Identic cu v1.0.0 §7.)

## 8. Concurrency

(Identic cu v1.0.0 §8.)

## 9. Caching

(Identic cu v1.0.0 §9. Adăugare invalidare imediată la `RBAC_ROLE_REVOKED` cu `reason ∈ {COMPLIANCE_AUDIT, PLAN_DOWNGRADE}`.)

## 10. Background Jobs

(Identic cu v1.0.0 §10.)

### 10.2 ★ `tenant_plan_downgrade_audit` (cron daily)

```
Job: tenant_plan_downgrade_audit
Cron: 0 3 * * *
Acțiune:
  Pentru fiecare user_role ur cu role_code='tenant_admin' AND revoked_at IS NULL:
    SELECT t.plan_tier FROM tenant t WHERE tenant_id = ur.tenant_id;
    IF plan_tier <> 'ENTERPRISE':
      UPDATE user_role SET revoked_at=NOW(), revoked_by=NULL, metadata={'reason':'PLAN_DOWNGRADE'};
      Emit RBAC_ROLE_REVOKED event;
      Notify tenant.owner.
```

## 11. Error Handling

| Cod | Caz | HTTP |
|---|---|---|
| `ROLE_NOT_FOUND` | role_code inexistent | 404 |
| `ROLE_NOT_APPLICABLE_FOR_TENANT_TYPE` | trigger CHECK violation | 422 |
| `SCOPE_REQUIRED` | scope_type LOCATION/NETWORK_NODE fără scope_id | 400 |
| `LAST_OWNER_PROTECTED` | revoke ultimul owner | 409 + sugestie transfer |
| `RBAC_RESOLVE_FAILED` | DB error la resolve | 500 (fail-closed → deny) |
| ★ `PLAN_TIER_INSUFFICIENT_FOR_ROLE` | grant `tenant_admin` fără ENTERPRISE | 422 |
| ★ `COMPLIANCE_AUDITOR_EXPIRES_AT_REQUIRED` | grant `compliance_auditor` fără expires_at | 422 |
| ★ `COMPLIANCE_AUDITOR_EXPIRES_AT_TOO_FAR` | expires_at > granted_at + 90 zile | 422 |
| ★ `COMPLIANCE_AUDITOR_PII_UNMASK_DENIED` | încercare query cu PII unmask | 403 |

---

## 12. Security

### 12.1–12.2

(Identic cu v1.0.0 §12.1–12.2.)

### 12.3 ★ Compliance auditor scope explicit (F-06 closed)

| Aspect | Detaliu |
|---|---|
| **Acces obiect** | Read-only `audit_log` filtrat la `event_type LIKE 'ISO_%' OR 'INC_%' OR 'DR_TEST_%'` (cross-tenant dacă scope='cross_tenant_iso_only') |
| **PII unmask** | **INTERZIS** la nivel BD (RLS + view): auditorul vede doar `audit_log` view-ul `audit_log_compliance_view` (§12.4) care exclude câmpuri `old_value.email`, `old_value.phone_e164`, etc. |
| **Time-box** | `user_role.expires_at` obligatoriu, max 90 zile (trigger §4.8) |
| **Provisioning** | 4-eyes: CISO request + DPO sign-off (§5.3) |
| **De-provisioning** | Auto la `expires_at` SAU manual revoke (super_admin/DPO) |
| **Meta-audit** | Toate query-urile log-uite ca `AUDIT_QUERIED` cu `metadata.actor_role='compliance_auditor'`; auditor-of-the-audit |
| **Sesiune** | Single session · MFA TOTP obligatoriu · session timeout 15 min (NFR-08) |
| **Export** | Doar prin endpoint `POST /api/v1/audit/export` cu `actor_role='compliance_auditor'`; URL semnat cu TTL 24h; export marcat `compliance_auditor_export=true` în AUDIT_LOG |

### 12.4 ★ View `audit_log_compliance_view` (PII-safe)

```sql
-- Migrare: 0610 (continuation)
CREATE OR REPLACE VIEW audit_log_compliance_view AS
SELECT
  audit_id, occurred_at, tenant_id,
  -- user_id înlocuit cu hash stable per tenant (auditorul poate corela acțiuni unui user fără a-i ști identitatea)
  encode(digest(user_id::text || tenant_id::text, 'sha256'), 'hex') AS user_id_pseudonym,
  actor_type, event_type, entity_type, entity_id,
  -- old_value/new_value redactate la nivel JSONB (păstrăm doar câmpuri non-PII whitelisted prin pii_field_registry)
  jsonb_strip_nulls(redact_pii_jsonb(old_value, entity_type)) AS old_value_safe,
  jsonb_strip_nulls(redact_pii_jsonb(new_value, entity_type)) AS new_value_safe,
  -- IP redactat la /24
  host(network(set_masklen(ip_address, 24))) AS ip_subnet,
  metadata, schema_version
FROM audit_log
WHERE event_type LIKE 'ISO_%' OR event_type LIKE 'INC_%' OR event_type LIKE 'DR_TEST_%';

GRANT SELECT ON audit_log_compliance_view TO revyx_compliance_auditor;
REVOKE SELECT ON audit_log FROM revyx_compliance_auditor;
```

> **Implementare `redact_pii_jsonb`:** funcție SQL care iterează `pii_field_registry` (entitate → field paths) și înlocuiește valorile PII cu `'[REDACTED_COMPLIANCE]'`. Reutilizare a infrastructurii GDPR redaction din `audit-log` v1.0.0 §6.5.

### 12.5 ★ JWT verifier middleware — claim guards v1.1.0

- Token cu `roles[].code = 'tenant_admin'` rejected dacă lipsește `plan_tier` sau `plan_tier <> 'ENTERPRISE'`.
- Token cu `roles[].code = 'compliance_auditor'` rejected dacă lipsește `compliance_auditor_session` sau `compliance_auditor_session.expires_at < NOW()`.
- Pentru `compliance_auditor` toate request-urile verifică `tenant_id` în URL împotriva `compliance_auditor_session.scope.tenant_ids` (sau scope='cross_tenant_iso_only' ⇒ acces ISO/INC/DR_TEST events doar; nicio entitate business).

---

## 13. Observability

| Metric | Tip | Alert |
|---|---|---|
| `rbac_resolve_duration_ms` | histogram | p95 > 50ms |
| `rbac_grant_total{role}` | counter | trend dashboard |
| `rbac_revoke_total{role}` | counter | spike >10× baseline |
| `rbac_resolve_cache_hit_ratio` | gauge | <80% → review TTL |
| `rbac_last_owner_protected_total` | counter | >0/zi → revisit ownership transfer flow |
| ★ `rbac_plan_tier_downgrade_revoked_total` | counter | trend (info) |
| ★ `rbac_compliance_auditor_active_total` | gauge | >5 simultan → CISO review |
| ★ `rbac_compliance_auditor_pii_unmask_attempts_total` | counter | >0 → CRITICAL alert (intenție unauthorized access) |

---

## 14. Performance Budgets

(Identic cu v1.0.0 §14. Resolver cu 6 roluri suplimentare verificat ≤5ms cache hit, ≤55ms cold — în budget.)

## 15. Testing Strategy

(Identic cu v1.0.0 §15.)

### 15.5 ★ Tests v1.1.0

- Unit: `PERMISSION_MAP` per rol — matrice §4.9 verificată cell-by-cell.
- Integration: grant `tenant_admin` pe tenant cu plan_tier=BUSINESS → 422 `PLAN_TIER_INSUFFICIENT_FOR_ROLE`.
- Integration: grant `compliance_auditor` fără `expires_at` → 422; cu `expires_at > granted_at + 91d` → 422.
- E2E: provisioning compliance_auditor (CISO + DPO sign-off) → access ISO events OK, access LEAD entity → 403; expiry 90d → auto-revoke; meta-audit `AUDIT_QUERIED` written.
- E2E: tenant downgrade ENTERPRISE→BUSINESS → cron `tenant_plan_downgrade_audit` revokes `tenant_admin` users + emits AUDIT events; owner notified.
- Negative: token `compliance_auditor` cu `plan_tier=ENTERPRISE` dar `tenant_admin` permission requested → 403 (compliance_auditor nu moștenește admin).

---

## 16. Deployment

(Identic cu v1.0.0 §16. Migration 0610 idempotentă; seed re-rulabil.)

## 17. Migration & Seed Strategy

```
0030_role_custom.sql            -- v1.0.0 baseline
0031_role_seed_custom.sql       -- v1.0.0 baseline (4 roles)
0032_role_seed_protect.sql      -- v1.0.0 baseline
0033_user_role_validate.sql     -- v1.0.0 baseline
★ 0610_role_seed_phase5.sql      -- v1.1.0: seed 6 roles + plan_tier trigger + compliance_auditor expiry trigger + audit_log_compliance_view
```

Migrarea 0610 e single-file consolidating §4.6 + §4.7 + §4.8 + §12.4. Idempotentă (ON CONFLICT DO UPDATE pe seed; CREATE OR REPLACE pe triggers/view).

---

## 18. Risks & Mitigations

(Identic cu v1.0.0 §18, plus:)

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| ★ R7 | Compliance auditor face PII unmask via SQL injection sau bypass view | LOW | CRITICAL | View + REVOKE pe tabel master + RLS + meta-audit + alert pe `rbac_compliance_auditor_pii_unmask_attempts_total` |
| ★ R8 | Plan downgrade lasă `tenant_admin` activ → access nelegitim | LOW | MED | Cron `tenant_plan_downgrade_audit` zilnic + alertă owner |
| ★ R9 | `compliance_auditor` extins peste 90 zile prin re-grant abuziv | LOW | MED | Trigger §4.8 hard cap 90 zile per grant; pattern detection: >2 grants consecutive în 6 luni → review CISO |
| ★ R10 | `data_science_lead` promovează model GA fără 4-eyes admin | LOW | HIGH | Permission map §6.5 nu include `ml.model.promote.ga`; spec `ml-pricing-ga` §12 reconfirmat 4-eyes admin |

---

## 19. Impact Assessment

### 19.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_tenancy-roles-extension_v1.1.0.md |
| Tip schimbare | MINOR (RBAC matrix consolidation, additive) |
| Aria afectată | RBAC catalog · Phase 5 governance — closes F-05 HIGH + F-06 MED |
| Origine | F-05 HIGH + F-06 MED audit S9 (AUDIT_REVYX_s8-external-pass v1.0.0) |

### 19.2 Impact pe documente conexe

| Document | Tip impact | Acțiune |
|---|---|---|
| BRD v1.1.0 | Cross-ref §10 RBAC consolidat aici | — |
| `audit-log` v1.1.0 | Cross-ref `compliance_auditor` în §12.5 | Aliniat |
| `ml-pricing-ga` v1.0.2 | Cross-ref `data_science_lead` permission map | Aliniat |
| `churn-ga` v1.0.1 | Cross-ref `cs_user`/`cs_lead`/`data_science_lead` | Aliniat |
| `iso27001-track` v1.0.0 | F-06 closed via §12.3 | Future v1.0.1 va putea referenția acest spec |
| `marketplace-two-sided` v1.0.1 | Cross-ref `buyer` rol | Aliniat |
| `white-label` v1.0.1 | Cross-ref `tenant_admin` Enterprise gating | Aliniat |

### 19.3 Impact pe scoring

| Scor | Afectat? |
|---|---|
| Toate | NU |

### 19.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| ROLE | INSERT 6 seed rows | 0610 |
| USER_ROLE | NONE schema; +trigger plan_tier + trigger compliance_auditor_expiry | 0610 |
| AUDIT_LOG | View nou `audit_log_compliance_view` | 0610 |

### 19.5 Impact pe RBAC

Vezi §4.9 — matrice consolidată cu 11 coloane (5 system + 6 custom incl. v1.0.0 + v1.1.0).

### 19.6 Impact pe SLA & NFR

| NFR | Înainte | După |
|---|---|---|
| JWT issuance latency | <20ms | <20ms (resolver + 6 roles incremental, măsurat <22ms p95) |
| Compliance auditor session | nedefinit | max 90 zile, auto-revoke |

### 19.7 Impact pe Securitate & GDPR

| Aspect | Status |
|---|---|
| PII | DA (compliance_auditor view PII-safe) |
| AUDIT_LOG events noi | DA (`RBAC_ROLE_GRANTED/REVOKED` cu metadata `reason ∈ {COMPLIANCE_AUDIT, PLAN_DOWNGRADE}`) |
| HMAC / JWT / RBAC | DA (claim `plan_tier` + `compliance_auditor_session` extins) |
| Rate limiting | DA pentru `POST /admin/compliance/auditor-provision`: 1/zi/tenant |

### 19.8 Risks & Mitigations

Vezi §18.

### 19.9 Test Plan

Vezi §15.5.

### 19.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | N/A — Phase 0 extensie |
| Rollout | Migrare 0610 înainte de granting roluri Phase 5 |
| Rollback | DROP triggers + DROP view + DELETE rows seedate (rolește la v1.0.0 baseline) |

### 19.11 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Senior PM | RBAC matrix consolidat |
| Solution Architect | Schema · trigger · resolver |
| Security Lead | Compliance auditor scope · plan_tier gating · view PII-safe |
| Compliance Auditor | Procedură provisioning/de-provisioning auditor extern |
| DPO | Confirmare zero PII unmask la `compliance_auditor` |

---

*docs/tech-spec/TECH_SPEC_REVYX_tenancy-roles-extension_v1.1.0.md · v1.1.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
