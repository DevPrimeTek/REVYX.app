# REVYX API — Phase 0 Security Foundation

NestJS 10 + Fastify + Drizzle ORM + PostgreSQL 16 + Redis 7.

**Spec:** `docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md`
**Master Plan:** §5.2 M1.S1 (gating BLOCANT pre-M1.S2)

## Quickstart

```bash
cp .env.example .env
# Generate JWT RS256 keypair (local dev)
mkdir -p secrets
openssl genrsa -out secrets/jwt-rs256-priv.pem 2048
openssl rsa -in secrets/jwt-rs256-priv.pem -pubout -out secrets/jwt-rs256-pub.pem

npm install
npm run db:migrate
npm run start:dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Dev server cu hot reload (port 3001) |
| `npm run typecheck` | TS strict check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply migrations 0001..0006 |

## Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/login` | public | rate-limit 20/min/IP |
| POST | `/auth/refresh` | public | rotation enforced |
| POST | `/auth/logout` | bearer | |
| POST | `/auth/change-password` | bearer | revoke all refresh tokens |
| GET | `/auth/me` | bearer | |
| GET | `/gdpr/access` | bearer | Art. 15 |
| GET | `/gdpr/portability` | bearer | Art. 20 |
| POST | `/gdpr/erase` | bearer | Art. 17 (queued cascade) |
| POST | `/gdpr/restrict` | bearer | Art. 18 |
| POST | `/webhooks/:provider` | HMAC-SHA256 | meta/google/olx |
| GET | `/health/live` | public | |
| GET | `/health/ready` | public | DB + Redis ping |

## Module structure

```
src/
  auth/        — JWT RS256 + Argon2id + refresh rotation
  rbac/        — Role enum + decorator + guard
  audit/       — Interceptor + service (append-only AUDIT_LOG)
  webhooks/    — HMAC-SHA256 guard + replay dedup
  gdpr/        — Art. 15/17/18/20 endpoints
  health/      — Liveness + readiness
  common/      — Zod pipe + correlation-id interceptor
  config/      — Env schema (Zod)
  db/          — Drizzle schema + client + migrations + migrator
```

## Phase 0 checklist mapping (CLAUDE.md §6)

| Item | Implementation |
|---|---|
| JWT RS256 + RBAC 5 roluri | `auth/` + `rbac/` |
| GDPR câmpuri LEAD + Art. 15-22 | `gdpr_consents` schema + `gdpr/` controller |
| AUDIT_LOG append-only + middleware | migration `0004_audit_log.sql` + trigger + `audit/` interceptor |
| HMAC-SHA256 webhook verify | `webhooks/webhook-hmac.guard.ts` |
| Rate limiting | `@nestjs/throttler` în `app.module.ts` |
| Privacy + Cookie Policy | `docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md` + `COOKIE_POLICY_REVYX_v0.1.0.md` (drafts pending legal review) |

## Out-of-scope M1.S1 (M1.S2+ scope)

- Real DB integration tests via testcontainers-postgres
- Erasure cascade BullMQ worker (LEAD → DEAL anonimize → ACTIVITY delete)
- JWKS rotation endpoint
- SSO Google (BRD §9.1 mențiune)
- Mobile OT-flow (BRD §10.3) — M2.S3
- Custom roles Phase 5 (data_science_lead, cs_user/lead, etc.) — M2.S6
