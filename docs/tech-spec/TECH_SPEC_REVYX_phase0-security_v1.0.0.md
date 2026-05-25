# TECH SPEC — Phase 0 Security Foundation
<!-- TECH_SPEC_REVYX_phase0-security_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Macro-milestone **M1 — MVP Funcțional** / sub-stage **M1.S1 — Phase 0 Security Foundation** ⛔ BLOCANT pentru M1.S2+ application code. Per CLAUDE.md §6 + BRD §9 + Master Plan v1.1.2 §5.2 (M1.S1). Output: arhitectură + contracte API + schema BD + flux deploy pentru toate cele 7 items checklist Phase 0.

**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §5.2 M1.S1 + §5.3 M1 DoD.
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.5.md` §4.1 M1.S1 atomic tasks T-M1.S1-XX.
**BRD ref:** `BRD_REVYX_v1.1.0.md` §9 Securitate & Conformitate (NFR-05..NFR-09) + §10 RBAC 5 roluri + `BRD_REVYX_v1.1.0.md` §10.1.2 custom roles Phase 5 (out of scope M1.S1 — system roles primă tranșă).
**Audit-log ref:** `TECH_SPEC_REVYX_audit-log_v1.1.1.md` §4.3 catalog Phase 0-4 events + §6 append-only enforcement (autoritativ pentru AUDIT_LOG schema + trigger).

## 0.1 Platform Matrix

| Surface | Scope M1.S1 | Notă |
|---|---|---|
| 🔧 Backend API | ✅ primary scope | NestJS 10 + Fastify adapter + Drizzle ORM + PostgreSQL 16 + Redis 7 + BullMQ |
| 🌐 Web | ⚪ out of scope | Wire-up M1.S5 (consumă `/auth/*` + `/gdpr/*` endpoints) |
| 📱 Mobile | ⚪ out of scope | M2.S3 — OT-flow `AUTH_MOBILE_OT_*` (BRD §10.3) consumă același backbone JWT |

Per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §17, modulul `Security` este **🔁 BOTH** dar surface-ul Mobile e gated M2.S3+. M1.S1 livrează backend single source of truth pentru ambele consumatori.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| **1.0.0** | **2026-05** | BACKEND DEV (P) + SECURITY (P) + DBA (S) + ARCHITECT (S) + DOC + Senior PM | ★ Initial — Phase 0 Security Foundation tech spec. Acoperă: §3 stack tehnic NestJS+Drizzle+PostgreSQL+Redis; §4 data model (6 entități: tenants, users, refresh_tokens, audit_log, gdpr_consents, webhook_signatures); §5 API contracts (auth/refresh/logout + gdpr/access/portability/erase/restrict + admin endpoints); §6 append-only enforcement AUDIT_LOG; §7 JWT RS256 cu refresh rotation; §8 RBAC 5 roluri sistem (decorator + guard); §9 HMAC-SHA256 webhook verify (Meta/Google/OLX); §10 rate limiting Redis-backed (NFR-05..NFR-07); §11 error catalog HTTP codes; §12 security (key rotation + secrets mgmt + threat model OWASP Top 10); §13 observability (pino structured logs + correlation_id + metrics); §14 performance budgets; §15 testing strategy (unit + integration + e2e); §16 deployment Docker; §17 migration strategy 0001-0006; §18 risks; §19 impact assessment + sign-off. Aliniat BRD §9.1-§9.6 + NFR-05..NFR-09 + audit-log v1.1.1 §4.3 catalog Phase 0-4. |

---

## 1. Executive Summary

Phase 0 Security Foundation = **fundament tehnic blocant** pentru orice cod aplicație M1.S2+. Livrează:

1. **Identitate & sesiune** — JWT RS256 (access 15min + refresh 7d cu rotație) + single session per agent (BR-12)
2. **Autorizare** — RBAC 5 roluri sistem aditive (agent → senior_agent → team_lead → manager → admin)
3. **Audit-log** — registru append-only PostgreSQL (BR-07) cu trigger BD anti-modify + middleware NestJS interceptor
4. **GDPR** — consent capture + retention + 4 endpoint-uri Art. 15/17/18/20 (drept acces/ștergere/restricție/portabilitate)
5. **Webhook security** — HMAC-SHA256 verify obligatoriu pe intake Meta/Google/OLX (BRD §9.3)
6. **Rate limiting** — Redis-backed (NFR-05/06/07): 20 req/min publice, 1000 req/min API intern, 20 req/oră showcase /p/
7. **Legal docs** — Privacy Policy + Cookie Policy drafts (legal review separat M1.S2 entry)

**Out of scope M1.S1** (tracked forward):
- Custom roles Phase 5 (`data_science_lead`, `cs_user/lead`, `compliance_auditor`, `buyer`, `tenant_admin`) — M2.S6
- Mobile OT flow — M2.S3
- SSO Google — M1.S5+ post-PM decision (BRD §9.1 mențiune)
- DKIM rotation tenant — M2.S6 (white-label scope)
- Penetration test extern — M2.S7

---

## 2. Architecture Overview

### 2.1 High-level

```
┌────────────────────────────────────────────────────────┐
│                       apps/api/                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │            NestJS 10 + Fastify adapter           │  │
│  │  ┌────────┬────────┬────────┬────────┬────────┐  │  │
│  │  │ Auth   │ RBAC   │ Audit  │ Webhook│ GDPR   │  │  │
│  │  │ Module │ Module │ Module │ Module │ Module │  │  │
│  │  └────────┴────────┴────────┴────────┴────────┘  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Global: RolesGuard · AuditInterceptor ·   │  │  │
│  │  │  ThrottlerGuard · ZodValidationPipe ·      │  │  │
│  │  │  CorrelationIdInterceptor · LoggerService  │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
              │              │              │
              ▼              ▼              ▼
    ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
    │ PostgreSQL  │  │   Redis 7    │  │  BullMQ      │
    │ 16+pgvector │  │ rate-limit + │  │ refresh-     │
    │  Drizzle    │  │ sessions     │  │ rotation +   │
    │             │  │              │  │ retention    │
    └─────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Decision drivers

| Decision | Rationale |
|---|---|
| NestJS over Fastify standalone | Module pattern mapează BRD piloni · guards/interceptors decorative reduc boilerplate RBAC + audit · `@nestjs/schedule` pentru BR-03 escalation chain (M1.S3+) · BullMQ first-class |
| Fastify adapter (not Express) | Throughput 2x · schema validation native · cookie/session plugins mature |
| Drizzle ORM over Prisma | SQL legibil (audit DBA friendly) · type inference fără magic · migrations versionate manual (no shadow DB) · zero runtime overhead |
| Zod shared schemas | Single source of truth FE↔BE (M1.S5 wire-up reuse `packages/shared-schemas`) |
| Argon2 password hash | OWASP recomandat · `@node-rs/argon2` pure Rust binding, fără native deps fragile |
| JWT RS256 (asymmetric) | Refresh token verifiable de servicii downstream fără secret partajat · key rotation via JWKS endpoint |
| Append-only via PostgreSQL trigger | Defense-in-depth: app middleware + BD-level enforce (chiar dacă cod compromis, BD respinge UPDATE/DELETE) |
| Redis pentru rate limit + sessions | `@nestjs/throttler` Redis store · refresh token revocation list · BullMQ broker |

---

## 3. Stack & Dependencies

| Layer | Pachet | Versiune | Motiv |
|---|---|---|---|
| Runtime | `node` | 22 LTS | identic cu `apps/web-preview/` CI · perf V8 12 |
| Framework | `@nestjs/core` + `@nestjs/common` + `@nestjs/platform-fastify` | ^10.0 | module + DI + guards/interceptors |
| HTTP | `fastify` | ^4.27 | adapter performance |
| ORM | `drizzle-orm` + `drizzle-kit` | ^0.33 / ^0.24 | type-safe SQL · migrations |
| Driver BD | `postgres` (porsager/postgres) | ^3.4 | minimal · TypeScript native · funcționează cu Drizzle |
| Cache/Queue | `ioredis` + `bullmq` | ^5.4 / ^5.12 | rate limit + jobs |
| JWT | `jose` | ^5.4 | RS256 + JWK rotation · ESM modern |
| Hash | `@node-rs/argon2` | ^2.0 | password hash · binding Rust |
| Validation | `zod` + custom Nest pipe | ^3.23 | shared FE/BE |
| Throttler | `@nestjs/throttler` + `@nestjs/throttler-storage-redis` | ^6.2 | NFR-05/06/07 |
| Logger | `pino` + `pino-pretty` (dev) | ^9.0 | JSON structured · correlation_id |
| Schedule | `@nestjs/schedule` | ^4.0 | cron M1.S3 escalation (preinstalled) |
| Testing | `vitest` + `supertest` | ^2.0 / ^7.0 | identic cu web-preview (Vitest) |
| Config | `@nestjs/config` + `dotenv` | ^3.2 | env management |

---

## 4. Data Model

### 4.1 Entități Phase 0 (6 tabele)

```sql
-- 4.1.1 tenants  (multi-tenant root)
CREATE TABLE tenants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  plan_tier     TEXT NOT NULL DEFAULT 'STARTER',  -- STARTER | BUSINESS | ENTERPRISE
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version       INTEGER NOT NULL DEFAULT 1
);

-- 4.1.2 users  (agent + roluri sistem; custom roles Phase 5 separat)
CREATE TYPE user_role AS ENUM (
  'agent', 'senior_agent', 'team_lead', 'manager', 'admin'
);

CREATE TABLE users (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  email                TEXT NOT NULL,
  password_hash        TEXT NOT NULL,           -- argon2id
  role                 user_role NOT NULL DEFAULT 'agent',
  full_name            TEXT NOT NULL,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  password_changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version              INTEGER NOT NULL DEFAULT 1,
  UNIQUE (tenant_id, email)
);
CREATE INDEX idx_users_tenant ON users(tenant_id);

-- 4.1.3 refresh_tokens  (BR-12 single session + rotation)
CREATE TABLE refresh_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash      TEXT NOT NULL UNIQUE,         -- SHA-256 hash, NU plaintext
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  rotated_at      TIMESTAMPTZ,                  -- non-null = rotated, refuzat la următoarea utilizare
  revoked_at      TIMESTAMPTZ,
  revoke_reason   TEXT,                         -- LOGOUT | PASSWORD_CHANGE | ADMIN | ROTATED | EXPIRED
  ip_address      INET,
  user_agent      TEXT,
  parent_token_id UUID REFERENCES refresh_tokens(id)  -- chain pentru rotation audit
);
CREATE INDEX idx_refresh_tokens_user_active ON refresh_tokens(user_id)
  WHERE revoked_at IS NULL AND rotated_at IS NULL;

-- 4.1.4 audit_log  (BR-07 append-only)
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id       UUID,
  actor_id        UUID,                         -- user_id sau NULL (system)
  actor_type      TEXT NOT NULL,                -- USER | SYSTEM | WEBHOOK
  event_type      TEXT NOT NULL,                -- catalog v1.1.1 §4.3 + §4.4
  entity_type     TEXT,                         -- USER | LEAD | DEAL | TENANT | etc.
  entity_id       UUID,
  correlation_id  UUID,
  request_id      UUID,
  ip_address      INET,
  user_agent      TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  severity        TEXT NOT NULL DEFAULT 'INFO'  -- INFO | WARN | HIGH | CRITICAL
);
CREATE INDEX idx_audit_log_tenant_time ON audit_log(tenant_id, occurred_at DESC);
CREATE INDEX idx_audit_log_actor_time ON audit_log(actor_id, occurred_at DESC);
CREATE INDEX idx_audit_log_event ON audit_log(event_type, occurred_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_metadata ON audit_log USING GIN (metadata);

-- 4.1.5 gdpr_consents  (BRD §9.4 + GDPR Art. 7 + 13)
CREATE TABLE gdpr_consents (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type       TEXT NOT NULL,             -- LEAD | USER | BUYER (M2.S6)
  subject_id         UUID NOT NULL,
  tenant_id          UUID NOT NULL REFERENCES tenants(id),
  consent_channel    TEXT NOT NULL,             -- web_form | whatsapp | phone | email | sms
  consent_version    TEXT NOT NULL,             -- privacy policy version e.g. "1.0.0"
  consent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retention_until    TIMESTAMPTZ NOT NULL,      -- default consent_at + 3 ani (NFR-10)
  erasure_requested  TIMESTAMPTZ,               -- Art. 17 — non-null = pending
  erasure_completed  TIMESTAMPTZ,
  restricted_at      TIMESTAMPTZ,               -- Art. 18 restricție procesare
  raw_consent_text   TEXT NOT NULL              -- copie exactă a textului acceptat (forensic)
);
CREATE INDEX idx_gdpr_consents_subject ON gdpr_consents(subject_type, subject_id);
CREATE INDEX idx_gdpr_consents_retention ON gdpr_consents(retention_until) WHERE erasure_completed IS NULL;

-- 4.1.6 webhook_signatures  (replay attack prevention)
CREATE TABLE webhook_signatures (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider      TEXT NOT NULL,                  -- meta | google | olx
  signature     TEXT NOT NULL,                  -- HMAC-SHA256 hex
  payload_hash  TEXT NOT NULL,                  -- SHA-256 al body raw
  received_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, signature)                  -- dedup replay
);
CREATE INDEX idx_webhook_sig_received ON webhook_signatures(received_at);
```

### 4.2 Append-only enforcement AUDIT_LOG

Per `audit-log` v1.1.0 §6 + BRD §9 + BR-07:

```sql
-- Trigger anti-modify pe audit_log
CREATE OR REPLACE FUNCTION audit_log_block_modify()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AUDIT_LOG_APPEND_ONLY: %  not allowed on audit_log', TG_OP
    USING ERRCODE = '42501';  -- insufficient_privilege
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_log_block_update
  BEFORE UPDATE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_block_modify();

CREATE TRIGGER trg_audit_log_block_delete
  BEFORE DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_block_modify();

-- Defense-in-depth: revoke explicit UPDATE/DELETE pe rolul application
-- (rolul `revyx_app` are doar SELECT + INSERT pe audit_log)
REVOKE UPDATE, DELETE ON audit_log FROM revyx_app;
GRANT SELECT, INSERT ON audit_log TO revyx_app;
```

### 4.3 Constraints & invariants

| ID | Invariant | Enforce |
|---|---|---|
| INV-01 | `users.role` ∈ enum 5 system roles | CHECK (enum) |
| INV-02 | `refresh_tokens.expires_at > issued_at` | CHECK |
| INV-03 | `audit_log` no UPDATE/DELETE | trigger BD + REVOKE |
| INV-04 | `gdpr_consents.retention_until > consent_at` | CHECK |
| INV-05 | `webhook_signatures` unique per (provider, signature) | UNIQUE |
| INV-06 | Refresh token rotation: refuz dacă `rotated_at IS NOT NULL` | App logic + index |
| INV-07 | BR-12 single session: la creare refresh token, revoke toate cele active anterior pentru `user_id` | App logic in `AuthService.login()` |
| INV-08 | Password change → revoke all refresh tokens user | App logic in `AuthService.changePassword()` |

---

## 5. API Contracts

### 5.1 Auth endpoints

| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/auth/login` | `{email, password}` | `{accessToken, refreshToken, user:{id,role,tenantId}}` | rate-limit 5/min/IP · log `AUTH_LOGIN_SUCCESS` / `AUTH_LOGIN_FAILED` |
| POST | `/auth/refresh` | `{refreshToken}` | `{accessToken, refreshToken}` (new) | rotation enforced · refuz `rotated_at IS NOT NULL` · log `AUTH_TOKEN_REFRESHED` |
| POST | `/auth/logout` | (header) | `204` | revoke current refresh · log `AUTH_LOGOUT` |
| POST | `/auth/change-password` | `{currentPassword, newPassword}` | `204` | revoke all refresh tokens · log `AUTH_PASSWORD_CHANGED` |
| GET | `/auth/me` | (header) | `{id, email, role, tenantId, fullName}` | requires valid access token |

### 5.2 GDPR endpoints (rate-limit 5/min/user)

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/gdpr/access` | user | — | JSON export propriile date Art. 15 |
| GET | `/gdpr/portability` | user | — | JSON machine-readable Art. 20 |
| POST | `/gdpr/erase` | user | `{confirmText}` | `202` queued · cascade LEAD→DEAL (anonimizat)→ACTIVITY (delete) per BRD §9.4 |
| POST | `/gdpr/restrict` | user | — | `200` · Art. 18 restricție temporară procesare |

### 5.3 Admin endpoints (RBAC: admin only)

| Method | Path | Body |
|---|---|---|
| POST | `/admin/users` | create user (role agent default) |
| PATCH | `/admin/users/:id/role` | change role (log `RBAC_ROLE_CHANGED`) |
| PATCH | `/admin/users/:id/deactivate` | revoke + log `RBAC_USER_DEACTIVATED` |
| GET | `/admin/audit-log` | filter `?tenant_id&event_type&from&to` (manager: read-only) |

### 5.4 Webhook intake endpoints (HMAC-SHA256 verify)

| Method | Path | Provider header | Verification |
|---|---|---|---|
| POST | `/webhooks/meta` | `X-Hub-Signature-256` | `META_WEBHOOK_SECRET` |
| POST | `/webhooks/google` | `X-Goog-Signature` | `GOOGLE_WEBHOOK_SECRET` |
| POST | `/webhooks/olx` | `X-OLX-Signature` | `OLX_WEBHOOK_SECRET` |

Per BRD §9.3 + audit-log `WEBHOOK_SIGNATURE_INVALID` event la signature fail.

### 5.5 Health endpoints

| Method | Path | Response |
|---|---|---|
| GET | `/health/live` | `{status:"ok"}` (no DB check) |
| GET | `/health/ready` | DB + Redis ping |

---

## 6. JWT RS256 specification

### 6.1 Key management

- **Algorithm:** RS256 (asymmetric).
- **Generation:** `openssl genrsa -out jwt-rs256-priv.pem 2048` + `openssl rsa -in priv -pubout -out pub.pem`. Stocare secret manager (Hashicorp Vault / AWS Secrets Manager / Fly secrets / Vercel env).
- **Rotation:** Annual planned + emergency on compromise. JWKS endpoint `/auth/.well-known/jwks.json` expune cheile publice cu `kid` (key id). Access token header conține `kid` → JWKS lookup.
- **Storage local dev:** `apps/api/secrets/` în `.gitignore` (committed: `apps/api/secrets/.gitkeep` only).

### 6.2 Access token claims

```json
{
  "iss": "https://api.revyx.app",
  "aud": "revyx-api",
  "sub": "<user_id UUID>",
  "tid": "<tenant_id UUID>",
  "role": "agent" | "senior_agent" | "team_lead" | "manager" | "admin",
  "iat": 1716000000,
  "exp": 1716000900,    // +15 min (NFR-08)
  "jti": "<UUID>"        // unique per token (revocation list în Redis dacă necesar)
}
```

### 6.3 Refresh token

- Plaintext refresh token = JWT RS256 cu claims minimale (`sub`, `iat`, `exp`, `jti`).
- BD stochează `SHA-256(refresh_token_raw)` ca `token_hash` — NU plaintext.
- TTL 7 zile (NFR-09).
- **Rotation flow:**
  1. Client trimite `refreshToken` la `/auth/refresh`
  2. Server verifică signature + lookup `token_hash` în BD
  3. Dacă `rotated_at IS NOT NULL` → respingere + log `AUTH_TOKEN_REUSE_DETECTED` (replay attack) + revoke întreaga familie (parent chain)
  4. Else: mark `rotated_at = NOW()` + emit new refresh + access pair · link `parent_token_id`
- **BR-12 single session:** la `/auth/login`, înainte de a emite refresh nou, revoke toate refresh tokens active ale user-ului cu `revoke_reason = 'NEW_SESSION'`.

---

## 7. RBAC implementation

### 7.1 Role enum (system roles)

```typescript
export enum Role {
  AGENT        = 'agent',
  SENIOR_AGENT = 'senior_agent',
  TEAM_LEAD    = 'team_lead',
  MANAGER      = 'manager',
  ADMIN        = 'admin',
}

// Hierarchy: agent < senior_agent < team_lead < manager < admin (aditiv per BRD §10.1.1)
export const ROLE_LEVEL: Record<Role, number> = {
  [Role.AGENT]: 1,
  [Role.SENIOR_AGENT]: 2,
  [Role.TEAM_LEAD]: 3,
  [Role.MANAGER]: 4,
  [Role.ADMIN]: 5,
};
```

### 7.2 Decorator + Guard pattern

```typescript
// @Roles(Role.MANAGER) — endpoint allowed pentru MANAGER + ADMIN (aditiv)
@Roles(Role.MANAGER)
@Get('/admin/audit-log')
listAuditLog() { ... }

// RolesGuard verifică: req.user.role >= required minimum level
```

### 7.3 Tenant isolation

- Toate query-urile WHERE `tenant_id = req.user.tenantId` automat via `TenantScopedRepository` base class.
- ADMIN poate accesa cross-tenant DOAR via flag explicit `?crossTenant=1` + log `ADMIN_CROSS_TENANT_ACCESS`.

---

## 8. AUDIT_LOG middleware

### 8.1 Interceptor pattern

```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const isWrite = ['POST','PUT','PATCH','DELETE'].includes(req.method);
    return next.handle().pipe(
      tap(async () => {
        if (isWrite && req.auditEvent) {
          await this.auditService.write({
            tenantId: req.user?.tenantId,
            actorId: req.user?.id,
            actorType: req.user ? 'USER' : 'WEBHOOK',
            eventType: req.auditEvent,
            entityType: req.auditEntityType,
            entityId: req.auditEntityId,
            correlationId: req.correlationId,
            requestId: req.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: req.auditMetadata ?? {},
          });
        }
      })
    );
  }
}
```

Endpoint-urile setează `req.auditEvent = 'AUTH_LOGIN_SUCCESS'` (etc.) prin decorator `@AuditEvent('AUTH_LOGIN_SUCCESS', 'USER')`.

### 8.2 Phase 0 events catalog (sub-set audit-log v1.1.1 §4.3)

| Event | Severity | Trigger |
|---|---|---|
| `AUTH_LOGIN_SUCCESS` | INFO | `/auth/login` success |
| `AUTH_LOGIN_FAILED` | WARN | `/auth/login` bad credentials |
| `AUTH_LOGOUT` | INFO | `/auth/logout` |
| `AUTH_PASSWORD_CHANGED` | INFO | `/auth/change-password` |
| `AUTH_TOKEN_REFRESHED` | INFO | `/auth/refresh` success |
| `AUTH_TOKEN_REUSE_DETECTED` | HIGH | refresh `rotated_at IS NOT NULL` → replay attack |
| `RBAC_ROLE_CHANGED` | INFO | admin changes user role |
| `RBAC_USER_DEACTIVATED` | INFO | admin deactivates user |
| `RBAC_ACCESS_DENIED` | WARN | RolesGuard reject |
| `GDPR_CONSENT_RECORDED` | INFO | new consent stored |
| `GDPR_ACCESS_REQUEST` | INFO | `/gdpr/access` |
| `GDPR_PORTABILITY_REQUEST` | INFO | `/gdpr/portability` |
| `GDPR_ERASURE_REQUESTED` | INFO | `/gdpr/erase` |
| `GDPR_ERASURE_COMPLETED` | INFO | cascade finished |
| `GDPR_RESTRICTION_APPLIED` | INFO | `/gdpr/restrict` |
| `WEBHOOK_RECEIVED` | INFO | webhook intake any provider |
| `WEBHOOK_SIGNATURE_INVALID` | HIGH | HMAC fail · ip blocked temporar |
| `WEBHOOK_REPLAY_DETECTED` | HIGH | signature deja în `webhook_signatures` table |
| `RATE_LIMIT_EXCEEDED` | WARN | NFR-05/06/07 threshold |
| `TENANT_CREATED` | INFO | admin creates tenant |
| `SECURITY_INCIDENT_REPORTED` | CRITICAL | manual log via admin endpoint |

---

## 9. Webhook HMAC verification

### 9.1 Guard implementation

```typescript
@Injectable()
export class WebhookHmacGuard implements CanActivate {
  constructor(private cfg: ConfigService, private db: DrizzleService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const provider = req.params.provider;  // meta | google | olx
    const secret = this.cfg.get(`${provider.toUpperCase()}_WEBHOOK_SECRET`);
    if (!secret) throw new ForbiddenException('WEBHOOK_PROVIDER_UNKNOWN');

    const signature = req.headers[this.signatureHeader(provider)];
    if (!signature) throw new UnauthorizedException('WEBHOOK_SIGNATURE_MISSING');

    const raw = req.rawBody as Buffer;  // Fastify rawBody plugin
    const expected = createHmac('sha256', secret).update(raw).digest('hex');

    if (!timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))) {
      req.auditEvent = 'WEBHOOK_SIGNATURE_INVALID';
      throw new UnauthorizedException('WEBHOOK_SIGNATURE_INVALID');
    }

    // Replay protection: dedup by (provider, signature)
    const payloadHash = createHash('sha256').update(raw).digest('hex');
    try {
      await this.db.insert(webhookSignatures).values({ provider, signature, payloadHash });
    } catch (e) {
      if (isUniqueViolation(e)) {
        req.auditEvent = 'WEBHOOK_REPLAY_DETECTED';
        throw new ConflictException('WEBHOOK_REPLAY_DETECTED');
      }
      throw e;
    }

    return true;
  }
}
```

### 9.2 Provider headers

| Provider | Header | Format |
|---|---|---|
| Meta | `X-Hub-Signature-256` | `sha256=<hex>` (strip prefix) |
| Google | `X-Goog-Signature` | `<hex>` raw |
| OLX | `X-OLX-Signature` | `<hex>` raw |

---

## 10. Rate limiting

Per NFR-05/06/07 (BRD §9.2):

```typescript
// app.module.ts
ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) => ({
    throttlers: [
      { name: 'public',    ttl: 60_000,    limit: 20    },  // NFR-05: 20/min/IP
      { name: 'internal',  ttl: 60_000,    limit: 1000  },  // NFR-06: 1000/min/token
      { name: 'showcase',  ttl: 3_600_000, limit: 20    },  // NFR-07: 20/hour/IP
    ],
    storage: new ThrottlerStorageRedisService(redis),
  }),
})
```

- Endpoint-uri publice (login, webhooks): `@Throttle({ public: { limit: 20, ttl: 60000 } })`
- Endpoint-uri API intern: `@Throttle({ internal: { limit: 1000, ttl: 60000 } })`
- Showcase `/p/<token>`: `@Throttle({ showcase: { limit: 20, ttl: 3600000 } })` + custom block-on-fail logic (5 bad tokens → 60 min IP block) — implementare M1.S5+ (gating M1.S5 showcase scope)

---

## 11. Error catalog

| HTTP | Error code | Trigger |
|---|---|---|
| 400 | `VALIDATION_FAILED` | Zod validation error |
| 401 | `AUTH_TOKEN_INVALID` | JWT signature fail / expired |
| 401 | `AUTH_TOKEN_MISSING` | no Authorization header |
| 401 | `AUTH_REFRESH_INVALID` | refresh token not found / rotated / revoked |
| 403 | `RBAC_ACCESS_DENIED` | role insufficient |
| 403 | `TENANT_MISMATCH` | cross-tenant access fără flag admin |
| 401 | `WEBHOOK_SIGNATURE_MISSING` | header lipsește |
| 401 | `WEBHOOK_SIGNATURE_INVALID` | HMAC fail |
| 409 | `WEBHOOK_REPLAY_DETECTED` | signature seen before |
| 429 | `RATE_LIMIT_EXCEEDED` | throttler reject |
| 422 | `GDPR_ERASURE_ALREADY_QUEUED` | erasure deja în coadă |

---

## 12. Security & Threat Model

### 12.1 OWASP Top 10 coverage

| Threat | Mitigation Phase 0 |
|---|---|
| A01 Broken Access Control | RBAC guard global + tenant isolation auto + cross-tenant flag audited |
| A02 Cryptographic Failures | JWT RS256 + argon2id passwords + secrets via env (not committed) + TLS 1.3 enforced at LB |
| A03 Injection | Drizzle parameterized queries + Zod input validation |
| A04 Insecure Design | Tech spec review + sign-off 5-rol |
| A05 Security Misconfiguration | `helmet` middleware + CSP headers + `X-Frame-Options DENY` |
| A06 Vulnerable Components | `npm audit` în CI + `pnpm audit` weekly cron |
| A07 Auth Failures | rate limit 5/min/IP login + lockout 5 fail = 15min · refresh rotation + replay detection |
| A08 Data Integrity | AUDIT_LOG append-only trigger + signed JWT |
| A09 Logging Failures | pino structured + correlation_id + AUDIT_LOG + secrets redact filter |
| A10 SSRF | webhook outbound (M1.S3+) URL allowlist + DNS rebinding protect |

### 12.2 Secrets management

- **Local dev:** `.env` în `.gitignore` · `.env.example` committed cu nume, fără valori.
- **CI:** GitHub Secrets (encrypted).
- **Prod:** Fly.io secrets / AWS Secrets Manager.
- **Audit:** secret access logged la fiecare deploy (`SECRET_ACCESSED` event Phase 5 audit-log).

### 12.3 BR-12 Single Session enforcement

La `/auth/login`:
```typescript
await db.update(refreshTokens)
  .set({ revokedAt: NOW(), revokeReason: 'NEW_SESSION' })
  .where(and(eq(refreshTokens.userId, user.id), isNull(refreshTokens.revokedAt)));
const newRefresh = await issueRefreshToken(user);
```

---

## 13. Observability

- **Logger:** `pino` JSON structured cu `correlation_id` injected via `CorrelationIdInterceptor` (uuid4 sau preluat din `X-Correlation-Id` header).
- **Redact:** `password`, `password_hash`, `accessToken`, `refreshToken`, `Authorization` header — automated via pino `redact` paths.
- **Metrics M1.S2+:** Prometheus `/metrics` endpoint (RED method: rate/errors/duration per route).

---

## 14. Performance Budgets

| Metric | Target |
|---|---|
| `/auth/login` p95 latency | <200ms (incl. argon2 verify ~50ms) |
| `/auth/refresh` p95 | <50ms |
| `/auth/me` p95 | <20ms |
| `/gdpr/access` p95 | <500ms (full export user data) |
| Webhook intake p95 | <30ms (HMAC verify + dedup insert) |
| AUDIT_LOG write overhead | <2ms median |
| DB connection pool | 20 connections per pod |

---

## 15. Testing Strategy

| Layer | Tool | Scope M1.S1 |
|---|---|---|
| Unit | Vitest | RolesGuard + WebhookHmacGuard + AuthService.refresh rotation + ArgonHashService |
| Integration | Vitest + testcontainers-postgres | Migrations apply + AuditInterceptor writes + RBAC permission matrix |
| E2E | Vitest + supertest | `/auth/login → /auth/me → /auth/refresh → /auth/logout` happy path + RBAC denial cases |
| Security | manual | OWASP ZAP scan baseline (M1.S2 entry, not M1.S1 close) |

Test fixtures: `apps/api/test/fixtures/` cu users seed pentru fiecare rol.

---

## 16. Deployment

- **Docker:** multi-stage `node:22-alpine` build → `gcr.io/distroless/nodejs22-debian12` runtime (~50MB).
- **Healthcheck:** `/health/ready` (DB + Redis).
- **CI pipeline (M1.S1):** `.github/workflows/api-ci.yml` cu `npm ci → typecheck → lint → test → build → docker build (PR only, no push)`.
- **CD prod (M1.S2+):** Fly.io deploy on main merge.

---

## 17. Migration Strategy

| Migration | File | Conținut |
|---|---|---|
| 0001 | `0001_tenants.sql` | tenants table + indexes |
| 0002 | `0002_users.sql` | user_role enum + users table |
| 0003 | `0003_refresh_tokens.sql` | refresh_tokens + indexes |
| 0004 | `0004_audit_log.sql` | audit_log + indexes + trigger anti-modify + REVOKE |
| 0005 | `0005_gdpr_consents.sql` | gdpr_consents + indexes |
| 0006 | `0006_webhook_signatures.sql` | webhook_signatures + indexes |

Toate migrations idempotente unde posibil (`CREATE TABLE IF NOT EXISTS` evitat — Drizzle generate explicit; rollback prin `down.sql` partner pentru fiecare).

---

## 18. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| RSA private key compromise | CRITICAL | JWKS rotation + kid header + revoke compromised kid + force re-auth |
| Replay attack pe refresh | HIGH | Rotation + `rotated_at` + family revoke + `AUTH_TOKEN_REUSE_DETECTED` alert |
| Webhook secret leak | HIGH | Per-provider secret + rotation procedure documented · M2.S6 vault automation |
| GDPR erasure cascade incomplete | HIGH | Transaction + verification step + `GDPR_ERASURE_COMPLETED` audit pentru forensic |
| BR-12 race (concurrent login) | MED | Postgres serializable transaction on `/auth/login` |
| Rate limit Redis down | MED | Throttler fallback to in-memory (allow with WARN log) — degradare graceful |

---

## 19. Impact Assessment

### 19.1 Scope of Change

- **Code:** new `apps/api/` (~80 files initial). Zero impact `apps/web-preview/`.
- **DB:** 6 migrations 0001-0006. Zero impact existing data (Phase 0 = greenfield).
- **CI:** new `.github/workflows/api-ci.yml`. Existing `web-preview-ci.yml` unchanged.

### 19.2 Impact pe documente conexe

| Doc | Impact |
|---|---|
| `BRD_REVYX_v1.1.0.md` §9 + §10.1.1 | aligned (no change needed) |
| `audit-log` v1.1.1 §4.3 | events Phase 0 deja cataloged — used as authoritative source |
| `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §5.2 | M1.S1 ☑ on close |
| `ROADMAP_REVYX_detailed-execution_v1.0.5.md` §4.1 | T-M1.S1-XX ☑ on close → bump v1.0.6 |
| `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §17 | Backend column M1.S1 marked |

### 19.3 Sign-off 5-rol

| Aprobator | Rol | Sign-off | Data |
|---|---|---|---|
| BACKEND DEV | Architecture + code structure | ✅ | 2026-05 |
| Senior Security Auditor | RBAC + JWT + GDPR + OWASP coverage | ✅ | 2026-05 |
| Senior DBA | Schema + trigger append-only + indexes | ✅ | 2026-05 |
| Senior Solution Architect | Cross-spec consistency + NFR alignment | ✅ | 2026-05 |
| DOC | Spec completeness + cross-refs | ✅ | 2026-05 |
| Senior PM | Phase 0 checklist closure | ✅ | 2026-05 |

---

## 20. Cross-references

- `BRD_REVYX_v1.1.0.md` §9 + §10 + `BRD_REVYX_v1.1.0.md` §10.1
- `TECH_SPEC_REVYX_audit-log_v1.1.1.md` §4.3 + §6 (authoritative AUDIT_LOG)
- `TECH_SPEC_REVYX_webhook-intake_v1.0.0.md` (provider-specific contract M1.S3 webhooks)
- `CLAUDE.md` §6 Phase 0 checklist + §3 stack tehnic + §10b Regulile 1-14
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §5.2 M1.S1
- `ROADMAP_REVYX_detailed-execution_v1.0.5.md` §4.1 (next bump v1.0.6 cu T-M1.S1-XX ☑)

---

*docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
