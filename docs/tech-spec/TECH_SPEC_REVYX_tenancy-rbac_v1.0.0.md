# TECH SPEC — Tenancy & RBAC Foundation
<!-- TECH_SPEC_REVYX_tenancy-rbac_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Solution Architect | Tech spec inițial pentru Phase 0 — multi-tenant + RBAC system roles + custom roles |

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Stack & Dependencies](#3-stack--dependencies)
4. [Data Model](#4-data-model)
5. [API Contracts](#5-api-contracts)
6. [Algorithms](#6-algorithms)
7. [State Machines](#7-state-machines)
8. [Concurrency](#8-concurrency)
9. [Caching](#9-caching)
10. [Background Jobs](#10-background-jobs)
11. [Error Handling](#11-error-handling)
12. [Security](#12-security)
13. [Observability](#13-observability)
14. [Performance Budgets](#14-performance-budgets)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment](#16-deployment)
17. [Migration Strategy](#17-migration-strategy)
18. [Risks & Mitigations](#18-risks--mitigations)

---

## 1. Executive Summary

| Atribut | Valoare |
|---|---|
| **Scope** | Multi-tenant data isolation + RBAC (system + custom roles) |
| **Phase** | Phase 0 — BLOCANT |
| **Refs** | BRD §4.3 (Tenancy Models) · BRD §8 (Entități tenancy) · BRD §10 (RBAC) · BRD §9 (Securitate) |
| **Audiență** | Backend · DevOps · Security · QA Automation |

Această componentă livrează:

1. Izolarea multi-tenant la nivel de bază de date prin `tenant_id` FK + Row-Level Security (RLS)
2. Gestionarea celor 5 system roles (seed la deploy, imutabile)
3. Suportul pentru custom roles (Agency Pro) cu moștenire dintr-un system role
4. Catalog de permisiuni atomice cu `risk_level`
5. JWT cu claim `tenant_id` + `role_id` + `permissions[]` (cached)
6. Switch de comportament per `tenant_type` (Lead Firewall, Override, distribuție lead-uri)

**Out of scope** (alte tech-spec-uri):
- Lead Scoring Engine, NBA Engine, DHI — `TECH_SPEC_REVYX_*-engine`
- Webhook Intake — `TECH_SPEC_REVYX_webhook-intake`
- Showcase Links — `TECH_SPEC_REVYX_showcase-links`

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                      REVYX API (Express/Fastify)                 │
│                                                                  │
│  ┌────────────┐   ┌──────────────┐   ┌────────────────────────┐  │
│  │ Auth       │──▶│ TenantCtx    │──▶│ PermissionResolver     │  │
│  │ Middleware │   │ Middleware   │   │ (cache: Redis)         │  │
│  └────────────┘   └──────────────┘   └────────────────────────┘  │
│         │                │                       │                │
│         ▼                ▼                       ▼                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           Route Handlers (with @requirePermission)       │    │
│  └──────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │   PostgreSQL (RLS active per tenant_id) + AUDIT_LOG     │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

### Request lifecycle

1. **Auth Middleware**: validează JWT RS256 → extrage `user_id`, `tenant_id`, `role_id`
2. **TenantCtx Middleware**: setează `SET LOCAL revyx.tenant_id = $1` pe conexiunea PG (RLS hook)
3. **PermissionResolver**: lookup `role_id → permissions[]` din Redis (fallback: PG)
4. **Route handler**: evaluează `@requirePermission('LEAD_FIREWALL_OVERRIDE')`
5. **Query DB**: PG aplică RLS automat pe `tenant_id`
6. **Audit**: orice WRITE → INSERT în `AUDIT_LOG` (trigger BD)

---

## 3. Stack & Dependencies

| Layer | Tehnologie | Versiune | Justificare |
|---|---|---|---|
| Runtime | Node.js | ≥20 LTS | TLS 1.3 nativ · ES2023 |
| Language | TypeScript | ≥5.4 | `strict: true` obligatoriu |
| Web framework | Fastify | ≥4.x | Performanță · plugin model curat · validare schema nativă |
| DB driver | `postgres` (porsager) | ≥3.x | Tagged template literals · zero deps |
| Migrations | `node-pg-migrate` | ≥7.x | SQL pur · numerotare secvențială |
| Auth | jose | ≥5.x | JWT RS256 sign + verify |
| Cache | ioredis | ≥5.x | Cluster ready |
| Validation | zod | ≥3.23 | Inferență type-safe |
| DB | PostgreSQL | ≥16 | RLS · `gen_random_uuid()` · `IMMUTABLE` columns |
| Cache | Redis | ≥7.2 | ACL per-service · pub/sub pentru invalidation |

---

## 4. Data Model

### 4.1 SQL Schema

```sql
-- 0001_init_tenancy.sql
-- Phase 0 — Tenancy + RBAC foundation

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TENANT
-- ============================================================
CREATE TYPE tenant_type_enum AS ENUM (
  'SOLO', 'NETWORK_FLAT', 'NETWORK_LED',
  'AGENCY', 'AGENCY_CUSTOM', 'FRANCHISE'
);

CREATE TYPE subscription_plan_enum AS ENUM (
  'solo', 'team', 'agency', 'agency_pro', 'enterprise'
);

CREATE TYPE currency_enum AS ENUM ('EUR', 'MDL', 'USD');

CREATE TABLE tenant (
  tenant_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_type            tenant_type_enum NOT NULL,
  tenant_parent_id       UUID NULL REFERENCES tenant(tenant_id) ON DELETE RESTRICT,
  display_name           VARCHAR(200) NOT NULL,
  legal_name             VARCHAR(200) NULL,
  subscription_plan      subscription_plan_enum NOT NULL,
  subscription_active    BOOLEAN NOT NULL DEFAULT true,
  max_users              INTEGER NOT NULL,
  max_leads_per_month    INTEGER NOT NULL,
  billing_email          VARCHAR(320) NOT NULL,
  timezone               VARCHAR(64) NOT NULL DEFAULT 'Europe/Chisinau',
  currency_default       currency_enum NOT NULL DEFAULT 'EUR',
  white_label_config     JSONB NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  version                INTEGER NOT NULL DEFAULT 1,

  -- FRANCHISE-only constraint: parent must be FRANCHISE root
  CONSTRAINT chk_franchise_parent CHECK (
    (tenant_parent_id IS NULL) OR (tenant_type IN ('AGENCY', 'AGENCY_CUSTOM'))
  )
);

CREATE INDEX idx_tenant_parent       ON tenant(tenant_parent_id) WHERE tenant_parent_id IS NOT NULL;
CREATE INDEX idx_tenant_active       ON tenant(subscription_active) WHERE subscription_active = true;
CREATE INDEX idx_tenant_type         ON tenant(tenant_type);

-- ============================================================
-- PERMISSION (catalog read-only, seeded la deploy)
-- ============================================================
CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE permission (
  permission_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   VARCHAR(64) NOT NULL UNIQUE,
  description            TEXT NOT NULL,
  risk_level             risk_level_enum NOT NULL,
  applies_to_tenancy     tenant_type_enum[] NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_permission_risk ON permission(risk_level);

-- ============================================================
-- ROLE
-- ============================================================
CREATE TABLE role (
  role_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  role_code              VARCHAR(64) NOT NULL,
  role_name              VARCHAR(200) NOT NULL,
  parent_role_id         UUID NULL REFERENCES role(role_id) ON DELETE RESTRICT,
  is_system              BOOLEAN NOT NULL DEFAULT false,
  description            TEXT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  version                INTEGER NOT NULL DEFAULT 1,

  -- System roles have NULL tenant_id; custom roles MUST have tenant_id and parent_role_id
  CONSTRAINT chk_role_system CHECK (
    (is_system = true  AND tenant_id IS NULL  AND parent_role_id IS NULL) OR
    (is_system = false AND tenant_id IS NOT NULL AND parent_role_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX uq_role_system_code ON role(role_code) WHERE is_system = true;
CREATE UNIQUE INDEX uq_role_tenant_code ON role(tenant_id, role_code) WHERE tenant_id IS NOT NULL;
CREATE INDEX idx_role_parent          ON role(parent_role_id);

-- ============================================================
-- ROLE_PERMISSION (junction)
-- ============================================================
CREATE TABLE role_permission (
  role_id                UUID NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
  permission_id          UUID NOT NULL REFERENCES permission(permission_id) ON DELETE RESTRICT,
  granted_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by             UUID NULL,  -- FK -> agent.agent_id (added in 0004)

  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_perm_role ON role_permission(role_id);
CREATE INDEX idx_role_perm_perm ON role_permission(permission_id);

-- ============================================================
-- AGENT (extended, was in v1.0)
-- Phase 0: minimal AGENT to support FK
-- Phase 1: extended with APS, calendar_sync_token etc.
-- ============================================================
CREATE TABLE agent (
  agent_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NOT NULL REFERENCES tenant(tenant_id) ON DELETE RESTRICT,
  role_id                UUID NOT NULL REFERENCES role(role_id) ON DELETE RESTRICT,
  email                  VARCHAR(320) NOT NULL,
  display_name           VARCHAR(200) NOT NULL,
  agent_since_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active              BOOLEAN NOT NULL DEFAULT true,
  out_of_office_until    TIMESTAMPTZ NULL,
  language_skills        VARCHAR(8)[] NOT NULL DEFAULT ARRAY['ro', 'ru'],
  password_hash          VARCHAR(255) NOT NULL,
  password_changed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  version                INTEGER NOT NULL DEFAULT 1,

  CONSTRAINT uq_agent_email_per_tenant UNIQUE (tenant_id, email)
);

CREATE INDEX idx_agent_tenant ON agent(tenant_id);
CREATE INDEX idx_agent_role   ON agent(role_id);

-- Now add the FK on role_permission.granted_by
ALTER TABLE role_permission
  ADD CONSTRAINT fk_role_perm_granted_by
  FOREIGN KEY (granted_by) REFERENCES agent(agent_id) ON DELETE SET NULL;
```

### 4.2 Row-Level Security

```sql
-- 0002_rls_tenant_isolation.sql

-- Helper: read tenant_id from session
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('revyx.tenant_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

-- Enable RLS on all tenant-scoped tables
ALTER TABLE agent           ENABLE ROW LEVEL SECURITY;
ALTER TABLE role            ENABLE ROW LEVEL SECURITY;

-- Agent: only see/modify agents in own tenant
CREATE POLICY agent_tenant_isolation ON agent
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());

-- Role: see system roles (tenant_id NULL) + own tenant's custom roles
CREATE POLICY role_tenant_isolation ON role
  USING (tenant_id IS NULL OR tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());  -- WRITE only on own custom

-- Bypass for service account (system seeding, migrations)
ALTER TABLE agent FORCE ROW LEVEL SECURITY;
ALTER TABLE role  FORCE ROW LEVEL SECURITY;
-- Service role bypasses via SET ROLE postgres or NOFORCE on connect
```

### 4.3 System roles seed

```sql
-- 0003_seed_system_roles.sql

INSERT INTO role (role_code, role_name, is_system, description) VALUES
  ('agent',         'Agent',          true, 'Utilizator primar — leads & deals proprii'),
  ('senior_agent',  'Senior Agent',   true, 'Agent + override prioritate lead'),
  ('team_lead',     'Team Lead',      true, 'Senior + vizibilitate echipă'),
  ('manager',       'Manager',        true, 'Team Lead + Firewall override + GDPR export'),
  ('admin',         'Admin',          true, 'Manager + scoring weights + tenant management');

-- Permission catalog
INSERT INTO permission (code, description, risk_level, applies_to_tenancy) VALUES
  ('LEAD_OWN_RW',              'CRUD pe lead-urile proprii',                     'low',      ARRAY['SOLO','NETWORK_FLAT','NETWORK_LED','AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('LEAD_TEAM_R',              'Vizibilitate lead-uri echipă',                   'medium',   ARRAY['NETWORK_FLAT','NETWORK_LED','AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('LEAD_FIREWALL_OVERRIDE',   'Forțare lead sub LS threshold',                  'high',     ARRAY['NETWORK_LED','AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('DEAL_TEAM_R',              'Vizibilitate deal-uri echipă',                   'medium',   ARRAY['NETWORK_FLAT','NETWORK_LED','AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('AUDIT_LOG_READ',           'Citire AUDIT_LOG',                               'high',     ARRAY['AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('AUDIT_LOG_FULL',           'Acces complet AUDIT_LOG',                        'critical', ARRAY['AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('GDPR_EXPORT',              'Export date GDPR',                               'high',     ARRAY['SOLO','AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('GDPR_ERASURE',             'Executare cerere ștergere',                      'critical', ARRAY['SOLO','AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('SCORING_WEIGHTS_TUNE',     'Modificare ponderi formule scoring',             'critical', ARRAY['AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('TENANT_MANAGE',            'Management tenant (users, billing, plan)',       'critical', ARRAY['SOLO','NETWORK_LED','AGENCY','AGENCY_CUSTOM','FRANCHISE']::tenant_type_enum[]),
  ('ROLE_DEFINITION_RW',       'Creare/editare roluri custom (Agency Pro)',      'critical', ARRAY['AGENCY_CUSTOM']::tenant_type_enum[]),
  ('WHITE_LABEL_CONFIG',       'Configurare brand per-agency',                   'high',     ARRAY['FRANCHISE']::tenant_type_enum[]);

-- Grant default permissions per system role
-- (compact: each row grants by joining role.role_code)
WITH grants(role_code, perm_code) AS (VALUES
  ('agent',         'LEAD_OWN_RW'),
  ('senior_agent',  'LEAD_OWN_RW'),
  ('team_lead',     'LEAD_OWN_RW'),  ('team_lead', 'LEAD_TEAM_R'), ('team_lead', 'DEAL_TEAM_R'),
  ('manager',       'LEAD_OWN_RW'),  ('manager',   'LEAD_TEAM_R'), ('manager',   'DEAL_TEAM_R'),
  ('manager',       'LEAD_FIREWALL_OVERRIDE'), ('manager', 'AUDIT_LOG_READ'), ('manager', 'GDPR_EXPORT'),
  ('admin',         'LEAD_OWN_RW'),  ('admin',     'LEAD_TEAM_R'), ('admin',     'DEAL_TEAM_R'),
  ('admin',         'LEAD_FIREWALL_OVERRIDE'), ('admin',  'AUDIT_LOG_FULL'), ('admin', 'GDPR_EXPORT'),
  ('admin',         'GDPR_ERASURE'), ('admin',     'SCORING_WEIGHTS_TUNE'),
  ('admin',         'TENANT_MANAGE'),('admin',     'ROLE_DEFINITION_RW')
)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM grants g
JOIN role r       ON r.role_code = g.role_code AND r.is_system = true
JOIN permission p ON p.code = g.perm_code
ON CONFLICT DO NOTHING;
```

---

## 5. API Contracts

### 5.1 Authentication

```yaml
POST /v1/auth/login
  body:
    email: string
    password: string
    tenant_slug: string   # for multi-tenant resolution
  response 200:
    access_token: string  # JWT RS256, TTL 15 min
    refresh_token: string # opaque, rotated, TTL 7 days
    expires_in: 900
  errors:
    401 invalid_credentials
    403 tenant_suspended
    429 rate_limited
```

### 5.2 Tenant management

```yaml
POST /v1/tenants
  auth: anonymous (signup)
  body:
    tenant_type: enum
    display_name: string
    billing_email: email
    subscription_plan: enum
    owner: { email, password, display_name }
  response 201:
    tenant_id: uuid
    owner_agent_id: uuid

GET /v1/tenants/me
  auth: any authenticated
  response 200: TenantContext

PATCH /v1/tenants/me
  auth: TENANT_MANAGE
  body: partial Tenant
```

### 5.3 Role & permission management

```yaml
GET /v1/roles
  auth: any authenticated
  response 200: list of system roles + own tenant's custom roles

POST /v1/roles
  auth: ROLE_DEFINITION_RW (only AGENCY_CUSTOM)
  body:
    role_code: string
    role_name: string
    parent_role_id: uuid  # MUST be system role
    permissions: uuid[]
  validation:
    - parent_role_id.is_system === true
    - if any permission.risk_level === 'critical' → parent_role_id must be 'admin'
    - all permissions ⊇ inherited from parent_role
  response 201: { role_id }

PATCH /v1/roles/:role_id
  auth: ROLE_DEFINITION_RW
  body: partial role
  errors:
    400 cannot_modify_system_role (if is_system)
    400 reduces_inherited_permissions

DELETE /v1/roles/:role_id
  auth: ROLE_DEFINITION_RW
  errors:
    400 cannot_delete_system_role
    409 role_in_use (agents still assigned)

GET /v1/permissions
  auth: any authenticated
  response 200: catalog filtered by tenant_type
```

### 5.4 Agent management

```yaml
POST /v1/agents
  auth: TENANT_MANAGE
  body: { email, display_name, role_id, password_initial }
  validation:
    - role.tenant_id IS NULL OR role.tenant_id === current_tenant
    - check tenant.max_users not exceeded
  response 201: { agent_id }

PATCH /v1/agents/:agent_id/role
  auth: TENANT_MANAGE
  body: { role_id }
  effect: invalidate permission cache for agent_id

POST /v1/agents/:agent_id/deactivate
  auth: TENANT_MANAGE
  effect: is_active=false + force logout (Redis token blacklist)
```

---

## 6. Algorithms

### 6.1 Permission resolution (with role inheritance)

```typescript
// src/auth/permissions.ts

export type Permission = {
  code: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
};

/**
 * Resolves the effective set of permissions for a role, walking up
 * the parent_role_id chain. Cycle detection via visited set.
 */
export async function resolveRolePermissions(
  sql: Sql,
  roleId: string,
): Promise<Permission[]> {
  const visited = new Set<string>();
  const queue = [roleId];
  const result = new Map<string, Permission>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const rows = await sql<{
      code: string;
      risk_level: Permission['riskLevel'];
      parent_role_id: string | null;
    }[]>`
      SELECT p.code, p.risk_level, r.parent_role_id
      FROM role r
      LEFT JOIN role_permission rp ON rp.role_id = r.role_id
      LEFT JOIN permission p       ON p.permission_id = rp.permission_id
      WHERE r.role_id = ${current}
    `;

    for (const row of rows) {
      if (row.code) {
        result.set(row.code, { code: row.code, riskLevel: row.risk_level });
      }
      if (row.parent_role_id && !visited.has(row.parent_role_id)) {
        queue.push(row.parent_role_id);
      }
    }
  }

  return Array.from(result.values());
}
```

**Cache strategy:** rezultatul stocat în Redis cu cheia `perms:{role_id}`, TTL 1h. Invalidare la `PATCH /v1/roles/:role_id` și la `DELETE /v1/role_permission`.

### 6.2 Custom role validation (creation)

```typescript
// src/roles/validate.ts

export function validateCustomRoleCreation(input: {
  tenantType: TenantType;
  parentRole: Role;
  selectedPermissions: Permission[];
}): { ok: true } | { ok: false; error: string } {
  // Rule 1: only AGENCY_CUSTOM can create custom roles
  if (input.tenantType !== 'AGENCY_CUSTOM') {
    return { ok: false, error: 'tenant_tier_not_eligible' };
  }

  // Rule 2: parent must be a system role
  if (!input.parentRole.isSystem) {
    return { ok: false, error: 'parent_must_be_system_role' };
  }

  // Rule 3: critical permissions require parent_role='admin'
  const hasCritical = input.selectedPermissions.some(
    (p) => p.riskLevel === 'critical',
  );
  if (hasCritical && input.parentRole.code !== 'admin') {
    return { ok: false, error: 'critical_permissions_require_admin_parent' };
  }

  return { ok: true };
}
```

### 6.3 Tenant behavior switch

```typescript
// src/tenancy/behavior.ts

export type LeadDistributionStrategy =
  | 'owner_only'
  | 'round_robin_ls_weighted'
  | 'lead_decides'
  | 'nba_aps'
  | 'nba_aps_territorial';

export const TENANT_BEHAVIOR: Record<TenantType, {
  leadDistribution: LeadDistributionStrategy;
  firewallOverrideRole: 'none' | 'consensus' | string;  // role_code
  pipelineTeamView: boolean;
  whiteLabelEnabled: boolean;
}> = {
  SOLO:           { leadDistribution: 'owner_only',              firewallOverrideRole: 'none',         pipelineTeamView: false, whiteLabelEnabled: false },
  NETWORK_FLAT:   { leadDistribution: 'round_robin_ls_weighted', firewallOverrideRole: 'consensus',    pipelineTeamView: true,  whiteLabelEnabled: false },
  NETWORK_LED:    { leadDistribution: 'lead_decides',            firewallOverrideRole: 'network_lead', pipelineTeamView: true,  whiteLabelEnabled: false },
  AGENCY:         { leadDistribution: 'nba_aps',                 firewallOverrideRole: 'manager',      pipelineTeamView: true,  whiteLabelEnabled: false },
  AGENCY_CUSTOM:  { leadDistribution: 'nba_aps',                 firewallOverrideRole: 'manager',      pipelineTeamView: true,  whiteLabelEnabled: false },
  FRANCHISE:      { leadDistribution: 'nba_aps_territorial',     firewallOverrideRole: 'manager',      pipelineTeamView: true,  whiteLabelEnabled: true  },
};
```

---

## 7. State Machines

### 7.1 Tenant lifecycle

```
       ┌──────────┐
       │ PROVISIONING │ (signup → seed roles, owner agent)
       └─────┬────┘
             │ provisioned
             ▼
       ┌──────────┐    suspend     ┌──────────┐
       │  ACTIVE  │───────────────▶│ SUSPENDED│ (billing failure, manual)
       └─────┬────┘                └────┬─────┘
             │ delete request           │ resume
             ▼                          │
       ┌──────────┐                     │
       │PENDING_  │◀────────────────────┘
       │ DELETION │
       └─────┬────┘
             │ retention expired (30 days grace)
             ▼
       ┌──────────┐
       │ DELETED  │ (anonymized; audit log retained)
       └──────────┘
```

### 7.2 Custom role lifecycle

```
DRAFT → ACTIVE → ARCHIVED
         │
         └→ DELETED (only if 0 agents assigned)
```

---

## 8. Concurrency

### 8.1 Optimistic locking

Toate entitățile cu state mutabil au câmp `version INTEGER NOT NULL DEFAULT 1`.

```typescript
// PATCH role pattern
const result = await sql`
  UPDATE role
  SET role_name = ${input.role_name},
      version = version + 1,
      updated_at = now()
  WHERE role_id = ${id} AND version = ${input.expectedVersion}
  RETURNING role_id, version
`;
if (result.length === 0) {
  throw new ConflictError('role_version_mismatch');
}
```

### 8.2 Race condition: agent role change while in-flight request

Mitigation: la `PATCH /v1/agents/:id/role`, pune token-ul vechi pe blacklist și forțează re-login. Permission cache invalidate.

---

## 9. Caching

| Key pattern | TTL | Invalidare |
|---|---|---|
| `perms:{role_id}` | 1h | `PATCH role`, `INSERT/DELETE role_permission` |
| `tenant:{tenant_id}` | 5 min | `PATCH tenant` |
| `agent:{agent_id}` | 5 min | `PATCH agent`, `deactivate` |
| `blacklist:token:{jti}` | until exp | append-only până la expirare JWT |

Pub/sub channel `revyx.invalidate` — orice instanță publică `{ key, action }` la modificare.

---

## 10. Background Jobs

| Job | Frequency | Idempotent | Action |
|---|---|---|---|
| `seed-system-roles` | la deploy (one-shot) | da (`ON CONFLICT DO NOTHING`) | Inserare 5 system roles + permission catalog |
| `tenant-pending-deletion-purge` | nightly 03:00 UTC+2 | da | Anonimizare tenanți cu `pending_deletion_at < now() - 30d` |
| `permission-cache-refresh` | la modificare role_permission | da | `DEL perms:*` + warm-up pentru roluri active |
| `subscription-quota-check` | hourly | da | Verificare `agent count > max_users` → flag `OVER_QUOTA` |

---

## 11. Error Handling

Format eroare standard (RFC 7807 Problem Details):

```json
{
  "type": "https://docs.revyx.app/errors/critical_permissions_require_admin_parent",
  "title": "Custom role with critical permissions must inherit from admin",
  "status": 400,
  "code": "ROLE_VALIDATION_FAILED",
  "detail": "Permission 'SCORING_WEIGHTS_TUNE' (risk: critical) requires parent_role='admin', got 'manager'",
  "trace_id": "01HZ4..."
}
```

Toate erorile critice (`status >= 500` SAU `risk_level=critical`) → log structured + alert PagerDuty.

---

## 12. Security

### 12.1 JWT structure

```json
{
  "iss": "https://api.revyx.app",
  "sub": "agent_id_uuid",
  "aud": "revyx-app",
  "iat": 1715000000,
  "exp": 1715000900,
  "jti": "unique_token_id",
  "tenant_id": "tenant_uuid",
  "tenant_type": "AGENCY_CUSTOM",
  "role_id": "role_uuid",
  "role_code": "manager",
  "perms_hash": "sha256_of_sorted_permission_codes"
}
```

`perms_hash` permite invalidare rapidă: dacă hash-ul nu se potrivește cu cache-ul curent al rolului → forțare refresh.

### 12.2 Single session enforcement

La login: emite token nou cu `jti` unic + adaugă `jti`-ul vechi (dacă există) pe blacklist. Token blacklist în Redis cu TTL = `exp - now()`.

### 12.3 Password change → forced logout

Trigger BD pe `agent.password_changed_at`: insert `jti` toate token-urile active pe blacklist (lookup via Redis prefix).

### 12.4 Webhook HMAC verification (alt scope, dar relevant pentru intake)

Out of scope aici — `TECH_SPEC_REVYX_webhook-intake`.

### 12.5 Database connection security

- Connection string în secret manager (Vault / AWS Secrets / ENV cu KMS encryption)
- TLS obligatoriu (`sslmode=require`)
- Service role pentru migrations · App role cu `NOFORCE RLS` doar pe tabele utilitare

---

## 13. Observability

### 13.1 Logs structured

```json
{
  "timestamp": "2026-05-03T14:32:11.123+02:00",
  "level": "info",
  "event": "role.created",
  "tenant_id": "...",
  "actor_agent_id": "...",
  "role_id": "...",
  "trace_id": "..."
}
```

### 13.2 Metrics (Prometheus)

| Metric | Tip | Labels |
|---|---|---|
| `revyx_auth_login_total` | counter | `tenant_type`, `result` (ok/fail) |
| `revyx_permission_resolution_seconds` | histogram | `cache` (hit/miss) |
| `revyx_role_create_total` | counter | `tenant_type`, `parent_role_code` |
| `revyx_jwt_blacklist_size` | gauge | — |

### 13.3 Traces (OpenTelemetry)

Span propagation via `trace_id` în toate log-urile. Sampling 100% pentru rute auth, 10% baseline.

---

## 14. Performance Budgets

Aliniate cu BRD §6.2 NFR-08 + considerații proprii:

| Operație | P50 | P99 | Sursă |
|---|---|---|---|
| JWT verify + permission resolution (cache hit) | <2ms | <10ms | NFR proprie |
| JWT verify + permission resolution (cache miss) | <30ms | <100ms | NFR proprie |
| Login end-to-end | <150ms | <500ms | UX |
| Role creation | <100ms | <300ms | UX |
| Tenant signup (provisioning) | <2s | <5s | UX |

Load target Phase 0: 500 RPS sustained, 2.000 RPS burst pentru auth.

---

## 15. Testing Strategy

| Tip | Coverage target | Unelte |
|---|---|---|
| Unit | ≥85% | vitest |
| Integration (DB + Redis) | toate path-urile API | testcontainers |
| E2E auth flow | critic | Playwright API |
| Load | 500 RPS sustained | k6 |
| Security | OWASP ASVS L2 | OWASP ZAP + manual |

**Test cases obligatorii:**

1. RLS — agent din tenant A NU vede agenți din tenant B (SELECT/UPDATE/DELETE)
2. Permission resolution cu lanț de 3 nivele de moștenire
3. Custom role cu permisiune `critical` și parent ≠ `admin` → respins
4. JWT cu `tenant_id` invalid → 401
5. Single session — login B invalidează jti A
6. Optimistic locking — 2 PATCH paralele pe role → un succes + un 409
7. Tenant suspended — orice WRITE → 403, READ → 200
8. Migration rollback — `0001 → 0000` curat fără orphan rows

---

## 16. Deployment

### 16.1 Environments

| Env | Purpose | Tenant data |
|---|---|---|
| `dev` | Development local | Mock tenants |
| `staging` | Pre-prod testing | Synthetic tenants |
| `prod` | Production | Real tenants |

### 16.2 Feature flags

Configurate via tabel `feature_flag` per `tenant_id` (sau global). Folosit pentru:

- `tenancy.network_flat` — activare graduală Phase 2
- `tenancy.franchise` — activare Phase 3
- `custom_roles.builder_ui` — Agency Pro tier

### 16.3 Rollback

```bash
# DB rollback (using node-pg-migrate)
npm run migrate:down  # reverts last migration

# App rollback
kubectl rollout undo deployment/revyx-api
```

---

## 17. Migration Strategy

### 17.1 Numerotare

| File | Scop |
|---|---|
| `0001_init_tenancy.sql` | TENANT, ROLE, PERMISSION, ROLE_PERMISSION, AGENT (minimal) |
| `0002_rls_tenant_isolation.sql` | RLS policies + helper function |
| `0003_seed_system_roles.sql` | Seed 5 system roles + permission catalog |
| `0004_audit_log.sql` | AUDIT_LOG table + APPEND-ONLY trigger |
| `0005_lead_property_deal.sql` | LEAD, PROPERTY, DEAL cu `tenant_id` |
| `0006_showing_offer_activity.sql` | Entitățile noi v1.1 |

### 17.2 Backwards compatibility

- Niciun `DROP COLUMN` fără 2 release-uri de deprecation
- ALTER TABLE folosește `ADD COLUMN ... DEFAULT ... NOT NULL` cu `SET (autovacuum_enabled = false)` pentru tabele >10M rânduri
- Migrările sunt idempotente unde posibil (`IF NOT EXISTS`)

### 17.3 Initial data flow

```
Deploy 0001 → 0002 (RLS) → 0003 (seed system roles + permissions)
   ↓
Tenant signup endpoint disponibil
   ↓
Provisioning: INSERT tenant → INSERT agent (owner) cu role_id=admin
```

---

## 18. Risks & Mitigations

| Risc | Severitate | Mitigare |
|---|---|---|
| RLS bypass accidental (dev forgets `SET LOCAL`) | CRITIC | Middleware obligatoriu + integration tests verifică pe fiecare endpoint |
| Permission cache stale post-modificare role | RIDICAT | `perms_hash` în JWT + invalidate pe pub/sub |
| Custom role escalates privileges (critical perm cu parent=manager) | CRITIC | Validare server-side (§6.2) + DB constraint (CHECK) |
| Tenant signup race (același email pe 2 tenanți) | MEDIU | UNIQUE `(tenant_id, email)` pe agent |
| FRANCHISE child cu parent suspended | MEDIU | Job nightly cascade `subscription_active=false` |
| Migration 0003 rulează de 2× (duplicate system roles) | MEDIU | `ON CONFLICT DO NOTHING` + UNIQUE pe `role_code WHERE is_system` |
| JWT secret rotation invalidates all sessions | RIDICAT | Dual-key validation (JWKS) cu suprapunere 24h |

---

*TECH_SPEC_REVYX_tenancy-rbac_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
