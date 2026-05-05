# TECH SPEC — REVYX Property Showcase Links
<!-- TECH_SPEC_REVYX_showcase-links_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect | Spec inițială Showcase Links — token 6 char · rate limiting · 410 Gone · tracking first-party · Phase 1 |

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
19. [Impact Assessment](#19-impact-assessment)

---

## 1. Executive Summary

Property Showcase Links sunt URL-uri publice unice (path `/p/{token}`) care expun o pagină de prezentare per proprietate. Fiecare token este 6 caractere alfanumerice, generat cu collision check, rate-limited 20 req/oră per IP, și răspunde HTTP 410 Gone la expirare/invalidare.

| Atribut | Valoare |
|---|---|
| **Scope** | Generare token · publish/expire · rate limiting public · tracking RF_show first-party · pagină public render |
| **Referință BRD** | §5 Pilon 02 · §6.1 BR-08 · §6.2 NFR-04, NFR-07 · §12 AC-SL-01..05 |
| **Phase** | 1 (Core) |
| **Owner tehnic** | Solution Architect + Security Lead |
| **Dependențe upstream** | TECH_SPEC property (entitatea PROPERTY) · TECH_SPEC audit-log · auth-rbac (admin/manager) |
| **Dependențe downstream** | Lead Scoring (RF_show feed în IS) · Match Engine (Phase 2) |

**Garanții oferite:**

1. Token 6 caractere alfanumeric (`[A-Za-z0-9]`) cu collision check la generare (BRD §5 Pilon 02).
2. Rate limiting 20 req/oră per IP cu blocare 60 min după 5 token-uri greșite consecutive (NFR-07, AC-SL-02).
3. HTTP 410 Gone la expirare/regenerare/withdraw (BR-08, AC-SL-01, AC-SL-05).
4. Tracking ACTIVITY `showcase_viewed` în ≤ 5 sec (AC-SL-03).
5. Analytics → dashboard agent în ≤ 1 min (NFR-04, AC-SL-04).
6. **Niciun pixel terț, niciun cookie de tracking terț** (cookie-policy §7) — tracking exclusiv server-side first-party.

---

## 2. Architecture Overview

```mermaid
flowchart LR
  AGT[Agent UI] -->|POST publish| API[Showcase API]
  API -->|generate token<br/>collision check| DB[(PostgreSQL<br/>property · showcase_event)]
  API -->|invalidate cache| RD[(Redis)]

  V[Visitor /p/:token] --> EDGE[Edge / WAF]
  EDGE -->|rate limit 20/h IP| RL[Redis<br/>rate counter]
  EDGE --> RNDR[Public Render Service]
  RNDR -->|lookup token| RD
  RNDR -.->|cache miss| DB
  RNDR -->|track view| EVT[showcase_event<br/>async insert]
  EVT -->|publish| Q[showcase.viewed]
  Q --> ACT[ACTIVITY recorder<br/>type=showcase_viewed]
  ACT --> SCR[Lead Scoring Engine<br/>RF_show input IS]
  RNDR -->|410| GONE[Page „Link Expirat"]
```

### 2.1 Data flow (publish)

1. Agent face publish property → API generează `token` (6 char, collision-checked).
2. INSERT update PROPERTY: `showcase_token`, `showcase_published_at = NOW()`, `showcase_expires_at = NOW() + 90 zile` (default).
3. AUDIT_LOG event `SHOWCASE_LINK_GENERATED` cu token în metadata (token redactat în vizualizare manager — nu PII, doar least-privilege).
4. Redis: `showcase:token:{token} → property_id` cu TTL = expires_at.

### 2.2 Data flow (visit)

1. Vizitator hit `/p/{token}` → Edge layer aplică rate limit 20 req/oră per IP.
2. La 5 token-uri **invalide consecutive** de la același IP → IP banned 60 min (sliding window).
3. Render service caută token în Redis → fallback DB.
4. Dacă: invalid token → 404 + counter invalid++. Dacă expirat / withdrawn → **HTTP 410 Gone** + pagina „Link Expirat" cu contact agenție.
5. Dacă valid → render HTML + INSERT async `showcase_event` cu hash IP, user-agent fingerprint, referrer.
6. Job: agregare `showcase_event` → ACTIVITY `showcase_viewed` consolidat la nivel de `(property_id, lead_fingerprint, day)` pentru a feed-ul RF_show.

---

## 3. Stack & Dependencies

| Layer | Tehnologie | Versiune | Justificare |
|---|---|---|---|
| Edge | Cloudflare / nginx + Lua | — | Rate limiting eficient + IP geo |
| Backend | Node.js + TypeScript | 20 LTS · TS 5.x | Stack standard |
| DB | PostgreSQL | 16.x | UNIQUE constraint + partitioned event table |
| Cache | Redis | 7.x | Rate limit counters + token lookup |
| Render | Server-side React (Next.js) sau template SSR | latest | Fără JS analytics terț |
| Audit | `auditLogger` | 1.0.0 | INSERT pe events critice |

---

## 4. Data Model

### 4.1 Câmpuri pe `property` (deja definite în TECH_SPEC property)

```sql
-- Reluat aici pentru claritate (definite în 0060_property_phase1.sql)
showcase_token           TEXT     NULL UNIQUE,
showcase_published_at    TIMESTAMPTZ NULL,
showcase_expires_at      TIMESTAMPTZ NULL,
```

### 4.2 Tabel `showcase_event` (partitioned by month)

```sql
-- Migrare: 0070_showcase_event.sql
CREATE TABLE IF NOT EXISTS showcase_event (
  event_id          UUID            NOT NULL DEFAULT gen_random_uuid(),
  occurred_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  tenant_id         UUID            NOT NULL,
  property_id       UUID            NOT NULL,
  token             TEXT            NOT NULL,                 -- păstrat pentru audit chiar și după regenerare
  ip_hash           TEXT            NOT NULL,                  -- SHA256(ip || tenant_salt) — niciodată raw IP
  ua_fingerprint    TEXT            NULL,                       -- hash User-Agent normalizat
  referrer_host     TEXT            NULL,                       -- doar host, nu full URL (PII reduction)
  country_code      CHAR(2)         NULL,                       -- din GeoIP
  session_token     TEXT            NULL,                       -- cookie first-party UUID (consent strictly necessary)
  is_unique_visit   BOOLEAN         NOT NULL DEFAULT TRUE,      -- unic per (ip_hash, day)
  duration_seconds  INTEGER         NULL,                        -- update la beacon /p/heartbeat
  PRIMARY KEY (occurred_at, event_id)
) PARTITION BY RANGE (occurred_at);

-- Partiție inițială (luna curentă)
CREATE TABLE IF NOT EXISTS showcase_event_2026_05
  PARTITION OF showcase_event
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

CREATE INDEX IF NOT EXISTS idx_showcase_event_2026_05_property
  ON showcase_event_2026_05 (tenant_id, property_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_showcase_event_2026_05_session
  ON showcase_event_2026_05 (session_token, occurred_at DESC) WHERE session_token IS NOT NULL;
```

### 4.3 Tabel `showcase_rate_limit` (auxiliar persistent — primary store: Redis)

```sql
-- Persistă blocările lungi peste restart Redis (defense in depth)
CREATE TABLE IF NOT EXISTS showcase_ip_block (
  ip_hash       TEXT         PRIMARY KEY,
  blocked_until TIMESTAMPTZ  NOT NULL,
  reason        TEXT         NOT NULL,
  block_count   INTEGER      NOT NULL DEFAULT 1,
  last_blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.4 Constraints & invariants

| Invariant | Enforcement |
|---|---|
| `showcase_token` UNIQUE global | UNIQUE constraint pe `property.showcase_token` |
| Token charset = `[A-Za-z0-9]`, length = 6 | App validation regex `^[A-Za-z0-9]{6}$` |
| Token regenerat → vechiul invalidat instant | `WHERE property_id = X` UPDATE atomic + Redis invalidate |
| Niciodată raw IP stocat | `ip_hash = SHA256(ip || tenant_salt)` mandatory |
| Cookie session strictly necessary (cookie-policy §7) | App-level: nu se setează decât session UUID |

---

## 5. API Contracts

### 5.1 Internal (admin/manager + agent owner)

```typescript
interface ShowcaseService {
  publish(propertyId: string, agent: User, opts?: { ttlDays?: number }): Promise<{ token: string; url: string; expiresAt: Date }>;
  regenerateToken(propertyId: string, manager: User, reason: string): Promise<{ token: string; previousToken: string }>;
  withdraw(propertyId: string, agent: User, reason: string): Promise<void>;
  analytics(propertyId: string, range: DateRange): Promise<ShowcaseAnalytics>;
}
```

### 5.2 Internal REST endpoints

| Method | Path | RBAC | Descriere |
|---|---|---|---|
| `POST` | `/api/v1/properties/:id/showcase/publish` | agent (own) / team_lead+ | Generează token + publish |
| `POST` | `/api/v1/properties/:id/showcase/regenerate` | manager+ | Token nou (vechiul → 410 imediat) |
| `POST` | `/api/v1/properties/:id/showcase/withdraw` | agent (own) / team_lead+ | Invalidează token (status PROPERTY rămâne ACTIVE/WITHDRAWN per spec property) |
| `GET` | `/api/v1/properties/:id/showcase/analytics` | agent (own) / team_lead+ | Vizualizări · IP unice · durata medie |

### 5.3 Public endpoints (rate limited)

| Method | Path | RBAC | Descriere |
|---|---|---|---|
| `GET` | `/p/:token` | public | Render pagină showcase · 200 / 410 / 404 |
| `POST` | `/p/:token/heartbeat` | public (same session) | Update `duration_seconds` (beacon la 30s) |
| `POST` | `/p/:token/contact` | public | Form contact → creează LEAD (cu consent) |

### 5.4 Response codes

| Cod | Caz |
|---|---|
| `200` | Token valid · pagină randată |
| `404` | Token inexistent (în DB) |
| `410` | Token există dar `showcase_expires_at < NOW()` SAU property `WITHDRAWN/SOLD` SAU regenerat (BR-08, AC-SL-01, AC-SL-05) |
| `429` | Rate limit depășit (>20 req/oră IP) |
| `403` | IP în `showcase_ip_block` (blocat 60 min) |

---

## 6. Algorithms

### 6.1 Token generation (cu collision check)

```typescript
const TOKEN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const TOKEN_LENGTH = 6;
// Spațiu = 62^6 ≈ 56.8 miliarde — collision improbabilă, dar verificată

function generateToken(): string {
  const bytes = crypto.randomBytes(TOKEN_LENGTH);
  let out = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) out += TOKEN_ALPHABET[bytes[i] % TOKEN_ALPHABET.length];
  return out;
}

async function generateUniqueToken(tx: Transaction): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const token = generateToken();
    const exists = await tx.selectFrom('property')
      .select('property_id')
      .where('showcase_token','=',token)
      .executeTakeFirst();
    if (!exists) return token;
  }
  throw new Error('SHOWCASE_TOKEN_COLLISION_EXHAUSTED'); // 5 colisiuni consecutive — alert SecOps
}
```

> Probabilitate practică de collision la 1M tokeni activi: `1M / 62^6 ≈ 0.0018%`. Limită 5 retry-uri este conservativă și alertează la rată anormală (semnal de PRNG corupt).

### 6.2 Publish

```typescript
async function publish(propertyId: string, agent: User, opts?: { ttlDays?: number }) {
  const ttl = opts?.ttlDays ?? 90;
  return db.transaction(async (tx) => {
    const p = await tx.selectFrom('property').where('property_id','=',propertyId).forUpdate().executeTakeFirstOrThrow();
    if (p.status === 'SOLD' || p.status === 'WITHDRAWN') throw new Error('SHOWCASE_INVALID_PROPERTY_STATUS');

    const token = await generateUniqueToken(tx);
    const expiresAt = addDays(new Date(), ttl);

    await tx.updateTable('property').set({
      showcase_token: token,
      showcase_published_at: new Date(),
      showcase_expires_at: expiresAt,
      status: p.status === 'DRAFT' ? 'ACTIVE' : p.status,
      version: p.version + 1n,
    }).where('property_id','=',propertyId).where('version','=',p.version).execute();

    await auditLogger.record({
      tenantId: p.tenant_id, userId: agent.userId, actorType: 'USER',
      eventType: 'SHOWCASE_LINK_GENERATED', entityType: 'PROPERTY', entityId: propertyId,
      newValue: { showcase_published_at: new Date(), showcase_expires_at: expiresAt },
      metadata: { token_hint: token.slice(0,2) + '****', ttl_days: ttl },  // token mascat în audit
    }, tx);

    await redis.set(`showcase:token:${token}`, propertyId, 'EXAT', Math.floor(expiresAt.getTime()/1000));
    return { token, url: `${PUBLIC_BASE_URL}/p/${token}`, expiresAt };
  });
}
```

### 6.3 Regenerate (AC-SL-05)

```typescript
async function regenerateToken(propertyId: string, manager: User, reason: string) {
  return db.transaction(async (tx) => {
    const p = await tx.selectFrom('property').where('property_id','=',propertyId).forUpdate().executeTakeFirstOrThrow();
    const previousToken = p.showcase_token;
    const newToken = await generateUniqueToken(tx);

    await tx.updateTable('property').set({
      showcase_token: newToken,
      showcase_published_at: new Date(),
      version: p.version + 1n,
    }).where('property_id','=',propertyId).where('version','=',p.version).execute();

    // CRITIC: invalidate vechiul token instant
    if (previousToken) await redis.del(`showcase:token:${previousToken}`);
    await redis.set(`showcase:token:${newToken}`, propertyId, 'EXAT', Math.floor(p.showcase_expires_at!.getTime()/1000));

    await auditLogger.record({
      tenantId: p.tenant_id, userId: manager.userId, actorType: 'USER',
      eventType: 'SHOWCASE_TOKEN_REGENERATED', entityType: 'PROPERTY', entityId: propertyId,
      metadata: { reason, previous_token_hint: previousToken?.slice(0,2) + '****' },
    }, tx);
    return { token: newToken, previousToken: previousToken! };
  });
}
```

### 6.4 Public render (cu rate limit)

```typescript
async function handleShowcaseGet(req: Request, res: Response) {
  const token = req.params.token;
  const ipHash = hashIP(req.ip, TENANT_GLOBAL_SALT);

  // 1. IP block check
  if (await redis.get(`showcase:ipblock:${ipHash}`)) return res.status(403).render('blocked');

  // 2. Rate limit 20 req/oră (sliding window)
  const rlKey = `showcase:rl:${ipHash}`;
  const count = await redis.incr(rlKey);
  if (count === 1) await redis.expire(rlKey, 3600);
  if (count > 20) return res.status(429).render('rate_limited');

  // 3. Token format validation
  if (!/^[A-Za-z0-9]{6}$/.test(token)) {
    await trackInvalidToken(ipHash, token);
    return res.status(404).render('not_found');
  }

  // 4. Token lookup
  const propertyId = await redis.get(`showcase:token:${token}`)
    ?? await dbLookupAndCache(token);

  if (!propertyId) {
    await trackInvalidToken(ipHash, token);
    return res.status(404).render('not_found');
  }

  // 5. Property state check
  const p = await loadProperty(propertyId);
  if (!p || p.status === 'WITHDRAWN' || p.status === 'SOLD'
      || (p.showcase_expires_at && p.showcase_expires_at < new Date())
      || p.showcase_token !== token /* regenerated */) {
    return res.status(410).render('expired_link', { agencyContact: p?.tenant_contact });
  }

  // 6. Render + async tracking
  res.status(200).render('showcase', { property: p });
  setImmediate(() => recordShowcaseEvent({ propertyId, token, ipHash, req }));
}

// Invalid token consecutive counter — 5 strikes → 60 min ban
async function trackInvalidToken(ipHash: string, token: string) {
  const k = `showcase:invalid:${ipHash}`;
  const n = await redis.incr(k);
  if (n === 1) await redis.expire(k, 3600);
  if (n >= 5) {
    const blockUntil = new Date(Date.now() + 60*60*1000);
    await redis.set(`showcase:ipblock:${ipHash}`, '1', 'EXAT', Math.floor(blockUntil.getTime()/1000));
    await db.insertInto('showcase_ip_block').values({ ip_hash: ipHash, blocked_until: blockUntil, reason: '5_invalid_tokens' })
      .onConflict((oc) => oc.column('ip_hash').doUpdateSet({ blocked_until: blockUntil, block_count: sql`block_count+1`, last_blocked_at: new Date() }))
      .execute();
    await auditLogger.record({ actorType: 'SYSTEM', eventType: 'SHOWCASE_IP_BLOCKED', metadata: { ip_hash: ipHash, reason: '5_invalid_tokens' } });
  }
}
```

### 6.5 Tracking → ACTIVITY → IS

```typescript
// Job aggregator (rulează la 1 min): consolidează showcase_event în ACTIVITY
// Pentru a feed-ul RF_show (IS), avem nevoie de mapping vizitator → lead
async function aggregateShowcaseEvents() {
  // 1. Identifică sesiuni asociate cu lead (formular contact completat sau lead existent re-vizită)
  // 2. INSERT în ACTIVITY: { entity_type: 'lead', entity_id: lead_id, activity_type: 'showcase_viewed', metadata: { property_id, duration } }
  // 3. Trigger lead-scoring recalc (eveniment `activity.recorded`)
  // Aggregation reduce volum: 1 ACTIVITY per (lead, property, day) — nu per request
}
```

### 6.6 Analytics (NFR-04, AC-SL-04)

```typescript
async function analytics(propertyId: string, range: DateRange): Promise<ShowcaseAnalytics> {
  // Read-through cache 60 sec (NFR-04 dashboard agent în <1 min)
  const cacheKey = `showcase:analytics:${propertyId}:${range.from}:${range.to}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const result = await db.selectFrom('showcase_event')
    .where('property_id','=',propertyId)
    .where('occurred_at','>=',range.from).where('occurred_at','<',range.to)
    .select([
      sql`COUNT(*)`.as('total_views'),
      sql`COUNT(DISTINCT ip_hash)`.as('unique_visitors'),
      sql`AVG(duration_seconds)`.as('avg_duration_seconds'),
      sql`PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_seconds)`.as('median_duration_seconds'),
    ]).executeTakeFirstOrThrow();

  await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
  return result;
}
```

---

## 7. State Machines

### 7.1 Showcase token lifecycle

```
[no_token] ──(publish)──> ACTIVE ──(expire 90d / withdraw / regenerate)──> INVALIDATED
ACTIVE ──(regenerate)──> [token nou]; vechi → INVALIDATED
INVALIDATED ──(re-publish)──> ACTIVE (token nou, vechi rămâne 410 forever)
```

### 7.2 IP rate limit state

```
NORMAL ──(20+ req/h)──> RATE_LIMITED (1h sliding)
NORMAL ──(5 invalid tokens)──> BLOCKED (60 min)
BLOCKED ──(60 min expire)──> NORMAL
BLOCKED ──(repeat block)──> BLOCKED extins (escalation block_count++)
```

---

## 8. Concurrency

- Optimistic locking pe `property` (moștenit din TECH_SPEC property) la publish/regenerate/withdraw.
- Token generation rulează în tranzacție; collision check + INSERT atomic.
- `showcase_event` INSERT async (`setImmediate`) — răspunsul HTTP nu așteaptă scrierea pentru a respecta NFR.
- Redis `INCR` + `EXPIRE` non-atomic protejat prin Lua script (sliding window precis).

---

## 9. Caching

| Key Redis | Conținut | TTL | Invalidare |
|---|---|---|---|
| `showcase:token:{token}` | `property_id` | până la `showcase_expires_at` | publish · regenerate · withdraw |
| `showcase:rl:{ipHash}` | counter req | 1h sliding | natural |
| `showcase:invalid:{ipHash}` | counter invalid | 1h sliding | natural |
| `showcase:ipblock:{ipHash}` | flag block | 60 min | natural |
| `showcase:analytics:{propId}:{range}` | summary JSON | 60 sec | event `showcase.viewed` (best effort) |
| `showcase:render:{token}` | HTML pre-rendered | 5 min | publish · update property |

---

## 10. Background Jobs

| Job | Cron / Trigger | Idempotent | Retry |
|---|---|---|---|
| `showcase.event.aggregate` | cron `*/1 * * * *` | DA | 3× backoff 30s/2m/5m |
| `showcase.expire.detect` | cron `0 * * * *` (hourly) | DA | 3× backoff |
| `showcase.partition.create` | cron `0 2 25 * *` | DA | 3× backoff |
| `showcase.ipblock.cleanup` | cron `0 3 * * *` | DA | 3× backoff |

---

## 11. Error Handling

| Cod | Caz | Răspuns |
|---|---|---|
| `SHOWCASE_TOKEN_COLLISION_EXHAUSTED` | 5 generări consecutive collision | 500 + alert SecOps (PRNG check) |
| `SHOWCASE_INVALID_PROPERTY_STATUS` | publish pe SOLD/WITHDRAWN | 409 |
| `SHOWCASE_RATE_LIMITED` | >20 req/h | 429 + Retry-After header |
| `SHOWCASE_IP_BLOCKED` | IP în blocklist | 403 |
| `SHOWCASE_TOKEN_INVALID` | format greșit / inexistent | 404 (counter invalid++) |
| `SHOWCASE_TOKEN_EXPIRED` | expirat / regenerat / withdrawn | 410 + render expired page |

---

## 12. Security

- **No third-party trackers / pixels** (cookie-policy §7) — confirmat în CSP header.
- **CSP minim** pentru pagina public: `default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';`.
- **Cookie session first-party**: `revyx_sc_session=<uuid>; HttpOnly; Secure; SameSite=Lax; Max-Age=1800` — strictly necessary, fără consent banner conform cookie-policy.
- **IP hashed la storage**: `SHA256(ip || tenant_salt)`. Salt rotated annually.
- **AUDIT_LOG events:**
  - `SHOWCASE_LINK_GENERATED` · `SHOWCASE_TOKEN_REGENERATED` · `SHOWCASE_LINK_WITHDRAWN`
  - `SHOWCASE_IP_BLOCKED` · `SHOWCASE_TOKEN_COLLISION_EXHAUSTED` (alert)
- **Token**: nu expus în AUDIT_LOG raw — doar `token_hint = first2 + '****'`.
- **Rate limiting** strict aplicat la edge (preferabil Cloudflare WAF) cu fallback Redis.
- **GDPR contact form `/p/:token/contact`**: consent checkbox obligatoriu (gdpr_consent_*) la creare LEAD downstream.

---

## 13. Observability

| Metric | Tip | Alert |
|---|---|---|
| `showcase_view_total{property_id}` | counter | trending |
| `showcase_view_410_total` | counter | spike → posibil link distribuit greșit |
| `showcase_invalid_token_total` | counter | spike → atac brute-force token |
| `showcase_ip_blocked_total` | counter | review zilnic |
| `showcase_render_duration_ms` | histogram | p95 > 200ms → alert |
| `showcase_token_collision_total` | counter | >0 → alert SecOps |
| `showcase_aggregate_lag_seconds` | gauge | >120s → alert (NFR-04) |
| `showcase_analytics_p95_ms` | histogram | > 500ms → review |

---

## 14. Performance Budgets

| Metric | Target | Sursă |
|---|---|---|
| Public render `/p/:token` | p95 < 200 ms | UX |
| Rate limit decision | p99 < 5 ms | Edge |
| Token lookup (cached) | p99 < 2 ms | Redis |
| Analytics dashboard | p95 < 1 sec, refresh < 60 sec | NFR-04 |
| ACTIVITY upsert from showcase_event | end-to-end < 5 sec | AC-SL-03 |

---

## 15. Testing Strategy

### 15.1 Unit
- `generateToken` — distribuție uniformă, charset corect
- `generateUniqueToken` — collision retry logic
- Rate limit Lua script — sliding window precis
- Token format regex — accept/reject corect

### 15.2 Integration
- Publish → token unique + Redis populated
- Regenerate → vechiul token returnează 410 imediat (AC-SL-05)
- Withdraw → 410 imediat
- 5 invalid tokens consecutive → IP blocat 60 min (AC-SL-02)
- Concurrent publish pe property cu collision simulată → retry success

### 15.3 E2E
- AC-SL-01: link expirat → HTTP 410 + pagina „Link Expirat"
- AC-SL-02: 5 token-uri greșite consecutive → blocare 60 min
- AC-SL-03: vizualizare → ACTIVITY în <5 sec
- AC-SL-04: analytics dashboard în <1 min
- AC-SL-05: regenerare → vechiul link → 410 imediat
- Form contact → LEAD creat cu `gdpr_consent_*` populate

### 15.4 Load
- 5.000 view/sec sustained 5 min · p95 < 250 ms
- 100 attackers cu 50 req/sec/IP → toți blocați după 5 invalid
- Analytics 100 query concurrent · p95 < 1 sec

### 15.5 Security tests
- CSP enforced (no inline scripts, no third-party domains)
- IP raw nu apare în logs / DB / AUDIT
- Token nu apare în referrer URL leak (vezi §12 — `Referrer-Policy: same-origin`)
- Brute-force 6 char token = ~3.16M req/sec necesar pentru 50% prob în 1h — blocat de rate limit

### 15.6 Coverage target

| Layer | Coverage |
|---|---|
| Token gen + lifecycle | ≥ 95% |
| Public render handlers | ≥ 90% |
| Rate limit | ≥ 95% |

---

## 16. Deployment

| Aspect | Detaliu |
|---|---|
| Feature flag | `flag.showcase_links_v1.enabled` (default OFF în staging) |
| Rollout | canary 10% → 50% → 100% |
| Rollback | flag OFF · DOWN migration `0070_down.sql` (DROP showcase_event partitions doar dacă <100k rows) |
| Edge config | Cloudflare WAF rule `revyx-showcase-rl` activată simultan cu flag |
| Secrets | `TENANT_GLOBAL_SALT` în vault (rotation annually) |

---

## 17. Migration Strategy

```
0070_showcase_event.sql            -- CREATE TABLE partitioned + partiție inițială
0071_showcase_event_indexes.sql    -- Indexuri property/session
0072_showcase_ip_block.sql         -- Tabel auxiliar block persistent
0073_showcase_partition_helper.sql -- Funcție create_showcase_partition(month)
```

Idempotent. PROPERTY existent (din TECH_SPEC property) consumă deja `showcase_token`/`showcase_published_at`/`showcase_expires_at`.

---

## 18. Risks & Mitigations

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| R1 | Brute-force token enumeration | LOW | MED | Rate limit + 5-strikes IP block + token space 56B |
| R2 | Cloudflare bypass (origin direct hit) | LOW | HIGH | Origin firewall: accept doar Cloudflare IPs |
| R3 | Aggregate job lag → AC-SL-03 violation | MED | MED | Cron 1 min + alert lag >120s + fallback direct insert path |
| R4 | DDoS pe `/p/` | MED | HIGH | Cloudflare DDoS protection + rate limit edge |
| R5 | Token leak prin Referer header | LOW | MED | `Referrer-Policy: same-origin` enforced |
| R6 | Cookie session abuse pentru tracking PII | LOW | MED | UUID random + no PII binding fără consent |
| R7 | Hot property → cache stampede | MED | LOW | Redis cache + stale-while-revalidate |

---

## 19. Impact Assessment

### 19.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_showcase-links_v1.0.0.md |
| Tip schimbare | NEW |
| Aria afectată | Phase 1 · Pilon 02 (Supply) · token public · rate limiting · tracking RF_show |
| Origine | BRD §5 Pilon 02 · §6.1 BR-08 · §6.2 NFR-04/07 · §12 AC-SL-* |

### 19.2 Impact pe documente conexe

| Document | Tip impact | Acțiune |
|---|---|---|
| BRD_REVYX_v1.0.0.md | None | BR-08 + AC-SL-* deja documentate |
| TECH_SPEC_REVYX_property_v1.0.0.md | Minor | Câmpurile `showcase_*` definite acolo, consumate aici |
| TECH_SPEC_REVYX_audit-log_v1.0.0.md | Minor | Catalog event `SHOWCASE_LINK_GENERATED`, `SHOWCASE_TOKEN_REGENERATED`, `SHOWCASE_LINK_WITHDRAWN`, `SHOWCASE_IP_BLOCKED` |
| TECH_SPEC_REVYX_lead-scoring_v1.0.0.md | Minor | RF_show în IS feed via aggregator |
| docs/legal/cookie-policy.md | Minor | §7 confirmat: doar cookie session first-party + IP hashed |

### 19.3 Impact pe scoring

| Scor | Afectat? | Detaliu |
|---|---|---|
| **IS** | DA (indirect) | RF_show feed din ACTIVITY `showcase_viewed` |
| LS | NU (indirect) | LS depinde de IS |
| Altele | NU | — |

### 19.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| PROPERTY | None (câmpuri deja în 0060) | — |
| SHOWCASE_EVENT | NEW (partitioned) | 0070_showcase_event.sql |
| SHOWCASE_IP_BLOCK | NEW | 0072_showcase_ip_block.sql |

### 19.5 Impact pe RBAC

| Rol | Permisiuni adăugate |
|---|---|
| agent (own) | Publish · withdraw · view analytics |
| team_lead | Publish · withdraw · view analytics echipă |
| manager | Regenerate token · view analytics tot tenant |
| admin | Config TTL default · vizualizare blocklist IP |
| public (anonymous) | GET `/p/:token` (rate limited) |

### 19.6 Impact pe SLA & NFR

| NFR | Înainte | După | Validare |
|---|---|---|---|
| NFR-04 (analytics dashboard) | nedefinit | ≤ 1 min | E2E AC-SL-04 |
| NFR-07 (rate limit /p/) | nedefinit | 20 req/h IP · block 60min | Load 15.4 |
| Public render p95 | nedefinit | < 200 ms | Load 15.4 |
| AC-SL-03 (ACTIVITY <5s) | nedefinit | < 5s | E2E |

### 19.7 Impact pe Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| PII | DA | IP hashed înainte de storage (no raw IP) |
| AUDIT_LOG events noi | DA | `SHOWCASE_*` events în catalog |
| Consent flow | DA | Cookie session strictly necessary (cookie-policy §7); contact form → consent obligatoriu |
| HMAC / JWT / RBAC | DA | RBAC §12 |
| Rate limiting | DA | NFR-07: 20/h IP + 5-strikes 60 min |
| CSP / Headers | DA | `Referrer-Policy: same-origin` · CSP minim |

### 19.8 Risks & Mitigations

Vezi §18.

### 19.9 Test Plan

Vezi §15. Toate AC-SL-01..05 acoperite în E2E.

### 19.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | `flag.showcase_links_v1.enabled` default OFF |
| Strategie rollout | canary 10% → 50% → 100% |
| Rollback | flag OFF + Cloudflare WAF rule disable + DOWN migration |
| Owner rollout | Senior PM + Security Lead |

### 19.11 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Senior PM | UX flow + analytics |
| Solution Architect | Schema event partitioned · token gen · cache strategy |
| Security Lead | Rate limit · CSP · IP hashing · token leak prevention |
| Legal / DPO | Cookie session + GDPR contact form alignment cu cookie-policy §7 |

---

*docs/tech-spec/TECH_SPEC_REVYX_showcase-links_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
