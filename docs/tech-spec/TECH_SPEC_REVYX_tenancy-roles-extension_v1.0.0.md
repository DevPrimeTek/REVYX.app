# TECH SPEC — REVYX Tenancy Roles Extension
<!-- TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect | Spec inițială — rezolvă gap-ul ★ tenancy-specific roles descoperit la WORKFLOW tenant-provisioning |

---

> **Notă de context:** Acest spec presupune existența unei spec-uri-părinte `TECH_SPEC_REVYX_tenancy-rbac_v1.0.0.md` (ne-livrată încă în repo la momentul scrierii). Concepte minime referite — 6 modele de tenancy și 13 entități extinse — sunt rezumate în §2 pentru a face spec-ul self-contained. Când spec-ul-părinte va fi materializat, secțiunea §2 din acest document devine o referință (`vezi TECH_SPEC_tenancy-rbac §X`) și se elimină rezumatul.

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

REVYX expune **5 system roles** definite în BRD §10 (`agent → senior_agent → team_lead → manager → admin`, aditive). În spec-ul de tenancy au fost identificate scenarii (NETWORK, FRANCHISE) care necesită roluri suplimentare specifice modelului de tenant — neacoperite de cele 5 roluri de bază.

Acest document **standardizează** 4 custom roles tenancy-specific seed-uite la provisioning, cu mapping explicit la system roles ca parent (pentru moștenire de permisiuni).

| Atribut | Valoare |
|---|---|
| **Scope** | Definiție · seed · validare · resolution custom roles tenancy |
| **Referință** | BRD §10 RBAC · CLAUDE.md §3 RBAC · gap workflow tenant-provisioning |
| **Phase** | 0 (BLOCANT — RBAC complet înainte de cod) |

**Custom roles introduse (4):**

| Cod rol | Aplicabil în tenant_type | Parent system role | Esență |
|---|---|---|---|
| `owner` | toate (SOLO, AGENCY, NETWORK, FRANCHISE, MARKETPLACE, ENTERPRISE) | `admin` | Proprietarul juridic al tenant-ului — billing + transfer ownership |
| `network_lead` | NETWORK | `manager` | Lider al unei rețele federate, vedere cross-agency |
| `network_member` | NETWORK | `team_lead` | Manager al unei agenții membre în NETWORK |
| `franchise_admin` | FRANCHISE | `admin` (scoped la locație) | Admin per locație franciză — fără cross-location vision |

---

## 2. Context tenancy (rezumat)

### 2.1 Modele de tenant (6)

| Cod | Denumire | Caz de utilizare | Custom roles necesare |
|---|---|---|---|
| `SOLO` | Agent independent | 1 user, 0–10 deal-uri/lună | `owner` |
| `AGENCY` | Agenție clasică | 1 sediu, 5–50 agenți | `owner` |
| `NETWORK` | Rețea federată | N agenții independente sub umbrelă comună | `owner` · `network_lead` · `network_member` |
| `FRANCHISE` | Franciză cu brand central | N locații sub brand unic, central admin | `owner` · `franchise_admin` |
| `MARKETPLACE` | Platformă multi-agenție | M agenții pe platformă REVYX-as-a-platform | `owner` · `franchise_admin` (re-utilizat) |
| `ENTERPRISE` | Org mare cu sub-divizii | corporate, multiple BU-uri | `owner` |

### 2.2 Entități atinse

Spec-ul afectează **3 entități** din cele 13 ale spec-ului tenancy-părinte: `TENANT`, `ROLE`, `USER_ROLE`. Restul (LEAD, PROPERTY, DEAL, AGENT, TASK, SHOWING, OFFER, ACTIVITY, AUDIT_LOG, WEBHOOK_EVENT) nu sunt modificate aici.

---

## 3. Stack & Dependencies

| Layer | Tehnologie |
|---|---|
| DB | PostgreSQL (RLS opțional pentru multi-tenant isolation) |
| Auth | JWT RS256 (system + custom roles incluse în claim `roles[]`) |
| Backend | Node.js + TypeScript strict |
| Cache | Redis (resolved roles per `(tenant_id, user_id)`) |

---

## 4. Data Model

### 4.1 Tabel `role` (extins)

```sql
-- Migrare: 0030_role_custom.sql
CREATE TYPE role_kind AS ENUM ('SYSTEM','CUSTOM');

ALTER TABLE IF EXISTS role
  ADD COLUMN IF NOT EXISTS kind role_kind NOT NULL DEFAULT 'SYSTEM',
  ADD COLUMN IF NOT EXISTS parent_role_code TEXT NULL REFERENCES role(code),
  ADD COLUMN IF NOT EXISTS applicable_tenant_types TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS scope_type TEXT NOT NULL DEFAULT 'TENANT'
    CHECK (scope_type IN ('TENANT','LOCATION','NETWORK_NODE','GLOBAL')),
  ADD COLUMN IF NOT EXISTS is_seeded BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_role_kind ON role (kind);
CREATE INDEX IF NOT EXISTS idx_role_parent ON role (parent_role_code);
```

### 4.2 Tabel `user_role` (extins cu scope_id)

```sql
ALTER TABLE IF EXISTS user_role
  ADD COLUMN IF NOT EXISTS scope_id UUID NULL,    -- location_id pentru franchise_admin, network_node_id pentru network_*
  ADD COLUMN IF NOT EXISTS granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS granted_by UUID NULL,
  ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS revoked_by UUID NULL;

CREATE INDEX IF NOT EXISTS idx_user_role_active
  ON user_role (tenant_id, user_id)
  WHERE revoked_at IS NULL;
```

### 4.3 Seed obligatoriu (toate tenant-urile noi)

```sql
-- Migrare: 0031_role_seed_custom.sql
INSERT INTO role (code, kind, parent_role_code, applicable_tenant_types, scope_type, is_seeded, description)
VALUES
  ('owner',            'CUSTOM', 'admin',    ARRAY['SOLO','AGENCY','NETWORK','FRANCHISE','MARKETPLACE','ENTERPRISE'], 'TENANT',       TRUE, 'Tenant owner — billing + ownership transfer'),
  ('network_lead',     'CUSTOM', 'manager',  ARRAY['NETWORK'],                                                         'TENANT',       TRUE, 'Network lead — cross-agency visibility'),
  ('network_member',   'CUSTOM', 'team_lead', ARRAY['NETWORK'],                                                        'NETWORK_NODE', TRUE, 'Network node manager — single agency in network'),
  ('franchise_admin',  'CUSTOM', 'admin',    ARRAY['FRANCHISE','MARKETPLACE'],                                         'LOCATION',     TRUE, 'Franchise admin — scoped to location_id')
ON CONFLICT (code) DO UPDATE SET
  kind                    = EXCLUDED.kind,
  parent_role_code        = EXCLUDED.parent_role_code,
  applicable_tenant_types = EXCLUDED.applicable_tenant_types,
  scope_type              = EXCLUDED.scope_type,
  is_seeded               = EXCLUDED.is_seeded;
```

### 4.4 Validare BD (CHECK)

```sql
-- Asigură că un user_role respectă applicable_tenant_types al rolului
CREATE OR REPLACE FUNCTION user_role_validate_tenant_type()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  rt TEXT;
  applicable TEXT[];
BEGIN
  SELECT t.tenant_type INTO rt FROM tenant t WHERE t.tenant_id = NEW.tenant_id;
  SELECT r.applicable_tenant_types INTO applicable FROM role r WHERE r.code = NEW.role_code;
  IF applicable IS NOT NULL AND array_length(applicable,1) > 0 AND NOT (rt = ANY(applicable)) THEN
    RAISE EXCEPTION 'role % not applicable for tenant_type %', NEW.role_code, rt
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_role_tenant_type_check
  BEFORE INSERT OR UPDATE ON user_role
  FOR EACH ROW EXECUTE FUNCTION user_role_validate_tenant_type();
```

---

## 5. API Contracts

| Method | Path | RBAC | Descriere |
|---|---|---|---|
| GET | `/api/v1/tenants/{tenant_id}/roles` | manager+ | List system + custom roles disponibile pentru tenant_type |
| POST | `/api/v1/tenants/{tenant_id}/users/{user_id}/roles` | admin · owner | Grant rol cu opțional `scope_id` |
| DELETE | `/api/v1/tenants/{tenant_id}/users/{user_id}/roles/{role_code}` | admin · owner | Revoke (soft, marchează `revoked_at`) |
| GET | `/api/v1/me/roles` | self | Roles efective (system + custom + parent inheritance) |

### 5.1 Payload grant

```json
{
  "role_code": "franchise_admin",
  "scope_id": "f8b2...",      // location_id obligatoriu pentru scope_type=LOCATION
  "expires_at": null
}
```

### 5.2 Validare

- `role_code` trebuie să existe în `role`
- `scope_id` obligatoriu dacă `role.scope_type ∈ {LOCATION, NETWORK_NODE}`
- `tenant.tenant_type ∈ role.applicable_tenant_types`
- `owner` nu poate fi revocat dacă e ultimul `owner` activ al tenant-ului (4-eyes / transfer protocol)

---

## 6. Role Resolution Algorithm

### 6.1 Pseudocod

```typescript
async function resolveEffectiveRoles(
  userId: string,
  tenantId: string
): Promise<EffectiveRole[]> {
  const directRoles = await db.userRole.findMany({
    where: { userId, tenantId, revokedAt: null }
  });

  const effective = new Map<string, EffectiveRole>();

  for (const ur of directRoles) {
    const role = await getRole(ur.roleCode);
    effective.set(role.code, {
      code: role.code,
      kind: role.kind,
      scopeId: ur.scopeId,
      inherited: false
    });

    // Walk parent chain pentru moștenire permisiuni
    let parent = role.parentRoleCode;
    while (parent) {
      if (!effective.has(parent)) {
        const p = await getRole(parent);
        effective.set(parent, {
          code: parent,
          kind: p.kind,
          scopeId: ur.scopeId, // moștenim scope din rolul-copil
          inherited: true
        });
        parent = p.parentRoleCode;
      } else {
        break;
      }
    }
  }

  return Array.from(effective.values());
}
```

### 6.2 Inserare în JWT

```json
{
  "sub": "user_uuid",
  "tenant_id": "tenant_uuid",
  "tenant_type": "FRANCHISE",
  "roles": [
    { "code": "franchise_admin", "scope_id": "loc_123" },
    { "code": "admin",           "scope_id": "loc_123", "inherited": true }
  ],
  "iat": 1714867200,
  "exp": 1714868100
}
```

JWT TTL: 15 min (NFR-08). La revoke rol → invalidare cache rezolvat (vezi §9).

### 6.3 Verificare permisiune

```typescript
function can(roles: EffectiveRole[], permission: string, scopeId?: string): boolean {
  const required = permissionToMinSystemRole(permission); // ex: "deal:override" → "manager"
  return roles.some(r =>
    isAtLeast(r.code, required) &&
    (scopeId ? r.scopeId === scopeId || r.scopeId === null : true)
  );
}
```

---

## 7. State Machine

User-rol:

```
GRANTED ──revoke──▶ REVOKED
   │
   └──expires_at hit──▶ EXPIRED
```

Toate tranzițiile generează AUDIT_LOG (`RBAC_ROLE_GRANTED`, `RBAC_ROLE_REVOKED`, `RBAC_ROLE_EXPIRED`).

---

## 8. Concurrency

- INSERT `user_role` cu UNIQUE constraint (`tenant_id, user_id, role_code, COALESCE(scope_id, '00000000-0000-0000-0000-000000000000')`).
- Grant/revoke folosesc tranzacție SQL + `SELECT ... FOR UPDATE` pe rândurile vizate pentru a preveni race conditions.

---

## 9. Caching

- Cache Redis: `rbac:resolved:{tenant_id}:{user_id}` · TTL 5 min · valoare = JSON `EffectiveRole[]`.
- Invalidare imediată la: grant, revoke, password change (BR-12), tenant suspended.
- Invalidare bulk la: rotare seed roles (rare — doar la migration de versiune).

---

## 10. Background Jobs

```
Job: user_role_expire
Cron: */5 * * * *
Acțiune: SET revoked_at = NOW(), revoked_by = NULL (sistem)
        WHERE revoked_at IS NULL AND expires_at < NOW()
AUDIT_LOG: RBAC_ROLE_EXPIRED per rând
```

---

## 11. Error Handling

| Cod | Caz | HTTP |
|---|---|---|
| `ROLE_NOT_FOUND` | role_code inexistent | 404 |
| `ROLE_NOT_APPLICABLE_FOR_TENANT_TYPE` | trigger CHECK violation | 422 |
| `SCOPE_REQUIRED` | scope_type LOCATION/NETWORK_NODE fără scope_id | 400 |
| `LAST_OWNER_PROTECTED` | revoke ultimul owner | 409 + sugestie transfer |
| `RBAC_RESOLVE_FAILED` | DB error la resolve | 500 (fail-closed → deny) |

---

## 12. Security

### 12.1 Reguli inflexibile

- Niciun cod hardcodat de „rol special" — toate rolurile vin din `role` table.
- `is_seeded = TRUE` blochează DELETE pe rolurile system + 4 custom seed (trigger).
- AUDIT_LOG obligatoriu la fiecare grant/revoke (event types §7).
- `owner` rol → operațiuni critice (delete tenant, transfer ownership, billing) require **dual approval** (al doilea owner SAU manager + 24h delay).
- Cross-tenant role grant strict interzis: `user_role.tenant_id` validat la INSERT.

### 12.2 RLS opțional (Phase 2)

```sql
ALTER TABLE user_role ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_role_tenant_isolation ON user_role
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## 13. Observability

| Metric | Tip | Alert |
|---|---|---|
| `rbac_resolve_duration_ms` | histogram | p95 > 50ms |
| `rbac_grant_total{role}` | counter | trend dashboard |
| `rbac_revoke_total{role}` | counter | spike >10× baseline |
| `rbac_resolve_cache_hit_ratio` | gauge | <80% → review TTL |
| `rbac_last_owner_protected_total` | counter | >0/zi → revisit ownership transfer flow |

---

## 14. Performance Budgets

| Metric | Target |
|---|---|
| Resolve roles (cache hit) | < 5 ms |
| Resolve roles (cold) | < 50 ms |
| Grant/revoke E2E | < 100 ms |
| JWT issuance latency | < 20 ms (cu rezolvare roles) |

---

## 15. Testing Strategy

### 15.1 Unit
- `resolveEffectiveRoles` — toate combinațiile parent chain
- `can()` — matrix permisiune × rol × scope
- Validator `applicable_tenant_types`

### 15.2 Integration
- Grant `network_lead` într-un tenant SOLO → 422
- Grant `franchise_admin` fără scope_id → 400
- Revoke ultimul `owner` → 409
- Inheritance: `network_member` user → can() pentru permisiuni `team_lead` returnează true

### 15.3 E2E
- Provisioning tenant FRANCHISE → seed roluri + creare owner inițial → grant `franchise_admin` per locație
- Provisioning tenant NETWORK → owner + 1 network_lead + 3 network_member-i pe noduri diferite

### 15.4 Coverage target

| Layer | Coverage |
|---|---|
| Resolution algorithm | ≥ 95% |
| Validation triggers | ≥ 90% |
| API handlers | ≥ 85% |

---

## 16. Deployment

| Aspect | Detaliu |
|---|---|
| Feature flag | N/A — Phase 0 |
| Seed | Auto la migration 0031 — rulat o singură dată per cluster |
| Rollback | Trigger DROP + rollback ALTER ADD COLUMN reversibil |

---

## 17. Migration & Seed Strategy

```
0030_role_custom.sql            -- ALTER role + ALTER user_role
0031_role_seed_custom.sql       -- INSERT 4 custom roles seed
0032_role_seed_protect.sql      -- Trigger BLOCK DELETE WHERE is_seeded=TRUE
0033_user_role_validate.sql     -- Trigger applicable_tenant_types CHECK
```

Toate sunt idempotente. Re-rularea seed-ului = ON CONFLICT DO UPDATE (sigur).

---

## 18. Risks & Mitigations

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| R1 | Admin uită să granteze `franchise_admin` per locație nouă | MED | MED | Workflow tenant-provisioning seed-uiește template + alertă post-onboarding |
| R2 | Inheritance neașteptată acordă privilegii excesive | MED | HIGH | Explicit listă `inherited:true` în JWT + UI vizibilă · audit lunar |
| R3 | Race condition grant + revoke simultan | LOW | MED | Tranzacție FOR UPDATE + UNIQUE constraint |
| R4 | Cache stale după revoke (5 min) | MED | MED | Invalidare imediată + JWT TTL 15min ca double safety |
| R5 | DELETE accidental rol system | LOW | CRITIC | Trigger BLOCK + `is_seeded` flag |
| R6 | Rețea NETWORK fără `network_lead` | LOW | MED | Validare la provisioning + alert |

---

## 19. Impact Assessment

### 19.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md |
| Tip schimbare | NEW (extensie) |
| Aria afectată | RBAC (BRD §10) · Tenancy spec părinte · Phase 0 |
| Origine | Gap descoperit la WORKFLOW tenant-provisioning (sesiunea anterioară S1) |

### 19.2 Impact pe documente conexe

| Document | Tip impact | Acțiune |
|---|---|---|
| TECH_SPEC_REVYX_tenancy-rbac (părinte, ne-livrat) | Major | Va trebui să referențieze acest extension la materializare |
| WORKFLOW_REVYX_tenant-provisioning (ne-livrat) | Minor | Etapa „seed roles" referă acest spec |
| WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md | Minor | Owner protection inclus la SUSPENDED/DELETION |
| BRD_REVYX_v1.0.0.md | None | Cele 5 system roles rămân baseline; custom roles sunt extensie |

### 19.3 Impact pe scoring

| Scor | Afectat? |
|---|---|
| Toate (LS, PS, IS, DP, NBA, TS, APS, DHI) | NU |

### 19.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| ROLE | ALTER (+kind, +parent_role_code, +applicable_tenant_types, +scope_type, +is_seeded) | 0030 |
| USER_ROLE | ALTER (+scope_id, +granted_at/by, +revoked_at/by) | 0030 |
| TENANT | NONE | — |

### 19.5 Impact pe RBAC

| Rol nou | Parent | Scope |
|---|---|---|
| `owner` | admin | TENANT |
| `network_lead` | manager | TENANT |
| `network_member` | team_lead | NETWORK_NODE |
| `franchise_admin` | admin | LOCATION |

### 19.6 Impact pe SLA & NFR

| NFR | Înainte | După |
|---|---|---|
| JWT issuance | <20ms | <20ms (cu rezolvare cached <5ms) |

### 19.7 Impact pe Securitate & GDPR

| Aspect | Status |
|---|---|
| PII | NU |
| AUDIT_LOG events noi | DA (`RBAC_ROLE_GRANTED/REVOKED/EXPIRED`) |
| Consent flow | NU |
| HMAC / JWT / RBAC | DA (claim `roles[]` extins cu `scope_id` + `inherited`) |
| Rate limiting | NU |

### 19.8 Risks & Mitigations
Vezi §18.

### 19.9 Test Plan
Vezi §15.

### 19.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | N/A — Phase 0 |
| Rollout | Migrările 0030–0033 înainte de orice tenant nou |
| Rollback | Trigger DROP + ALTER DROP COLUMN reversibil cu data backup |

### 19.11 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Senior PM | Definițiile rolurilor + parent mapping |
| Solution Architect | Schema · trigger · resolution algorithm |
| Security Lead | Inheritance rules · cross-tenant isolation · `last owner` protection |

---

*docs/tech-spec/TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
