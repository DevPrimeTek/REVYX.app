# TECH SPEC — REVYX Mobile RN (Push Deep-Link PATCH)
<!-- TECH_SPEC_REVYX_mobile-rn_v1.0.1.md · v1.0.1 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M1.S5 (Mobile companion agent UX — push deep-link routing) + post-Phase 5 Stage 1 follow-up (F-S13-01 LOW closure).
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` §5 M1.S5 Mobile companion.
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.1 T-S16-06.
**Trio canonical citat:** Master Plan v1.1.1 + Platform Matrix v1.0.0 + Detailed Roadmap v1.0.0 (Regula 8 + Regula 9).

## 0.1 Platform Matrix

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md`:
- §2 Modul 1 — Auth Feature **1.5 Password reset deep-link** `revyx://auth/reset/{token}` (🔁 Web + 📱 Mobile native)
- §4 Modul 4 — Match Feature **4.5 Re-matching trigger** (🌐 Web banner + 📱 Mobile push notif → deep-link)
- §7 Modul 6 — Showing Feature **6.3 Showing reminder push** (📱 push → deep-link)
- §13 Modul 12 — Marketplace Feature **12.5 Contact-grant approve** (📱 push primit + approve via deep-link)

Toate push notifications cu acțiune navigabilă utilizează scheme URL universal `revyx://` (iOS Universal Link `https://revyx.app/m/...` + Android App Link). Acest PATCH closes F-S13-01 LOW prin specificarea **API contract + algorithm routing** lipsă din v1.0.0.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect + Mobile Lead | Initial spec — React Native Expo, OT auth, push notifications baseline |
| 1.0.1 | 2026-06 | Senior PM + Solution Architect + Mobile Lead + Audit Lead | ★ PATCH — closes F-S13-01 LOW (cf. `AUDIT_REVYX_s14-external-pass` §3.2 IN PROGRESS → `AUDIT_REVYX_s15-external-pass` §4.1 CLOSED doc-side). Schimbări: (1) §5 API contract `push_payload.deep_link_url` field nou + APNS `apns_payload.aps.url` + FCM `data.click_action` mapping; (2) §6 algorithm "Push deep-link routing" cu route table + fallback comportament; (3) §7 state machine extension `PushReceived → DeepLinkResolved → ScreenNavigated`; (4) §12 security — `deep_link_url` validare URL allowlist + assertNoPII verify; (5) §15 testing snapshot — fixture `assertNoPII(deep_link_url)` PASS (UUID-only, no leakage); (6) §17 migration: zero schema BD change; client-side parser update + backend payload extension; (7) pii_field_registry seed update planificat post-deploy 0611 (`deep_link_url` cu `pii_kind='internal_id'`). Backwards compat full: clients < v1.0.1 ignore field (default behavior = land pe home post-push tap). |

---

## 1. Backwards compatibility & scope PATCH

Acest PATCH **NU schimbă** §1-§4 + §8-§11 + §13-§14 + §16 + §18 din v1.0.0 (executive summary, architecture, stack, data model, concurrency, caching, background jobs, error handling, observability, performance budgets, rollout, risks). Modificările sunt **chirurgicale** pe:

- §5 API contracts (extension)
- §6 algorithms (extension)
- §7 state machines (extension)
- §12 security (extension)
- §15 testing (extension)
- §17 migration (no-op BD)
- §19 impact assessment (extension)

Clientele Mobile pe v1.0.0 (build TestFlight Stage 1 deployed 2026-05-04) **rămân funcționale** post-deploy backend payload extension; field nou e **ignorat silent** dacă client < v1.0.1 (fallback land pe home post-push tap, ca azi).

---

## 5. API Contracts (PATCH — extension)

### 5.1 `push_payload` field extension (NEW)

Field nou pe payload normalized intern (înainte de mapping APNS/FCM):

```typescript
interface PushPayload {
  // ... existing fields (v1.0.0)
  notification_id: string;          // UUID
  title: string;                    // RO/RU/EN per user.locale
  body: string;                     // RO/RU/EN per user.locale
  data: {
    event_type: 'NEW_LEAD' | 'LEAD_REMATCH' | 'SHOWING_REMINDER' | 'BUYER_CONTACT_GRANT_REQUEST' | 'PASSWORD_RESET' | 'CHURN_TASK_OPENED';
    resource_id: string;            // UUID (lead_id / showing_id / etc.)
    // ... existing
  };
  
  // ★ NEW v1.0.1
  deep_link_url?: string;           // optional; revyx:// scheme; max 200 chars; UUID-only no PII
}
```

### 5.2 APNS mapping (iOS) ★

```json
{
  "aps": {
    "alert": { "title": "<title>", "body": "<body>" },
    "sound": "default",
    "url": "revyx://leads/<resource_id>"
  },
  "notification_id": "<uuid>",
  "event_type": "<type>",
  "resource_id": "<uuid>",
  "deep_link_url": "revyx://leads/<resource_id>"
}
```

**Note APNS:** `aps.url` e custom field (NU keyword Apple); iOS RN handler citește din `userInfo['aps']['url']` ca fallback la `userInfo['deep_link_url']`.

### 5.3 FCM mapping (Android) ★

```json
{
  "notification": { "title": "<title>", "body": "<body>" },
  "data": {
    "notification_id": "<uuid>",
    "event_type": "<type>",
    "resource_id": "<uuid>",
    "deep_link_url": "revyx://leads/<resource_id>",
    "click_action": "revyx://leads/<resource_id>"
  }
}
```

**Note FCM:** `data.click_action` setat identic cu `deep_link_url` (Android system intent compat) — pentru ca tap-ul direct pe notification system să declanșeze intent fără cod RN custom.

### 5.4 Route table allowlist

| `event_type` | `deep_link_url` pattern | Target screen RN |
|---|---|---|
| `NEW_LEAD` | `revyx://leads/{lead_id}` | `LeadDetailScreen` |
| `LEAD_REMATCH` | `revyx://leads/{lead_id}?reason=rematch` | `LeadDetailScreen` cu banner re-match |
| `SHOWING_REMINDER` | `revyx://showings/{showing_id}` | `ShowingDetailScreen` |
| `BUYER_CONTACT_GRANT_REQUEST` | `revyx://buyer-grants/{request_id}` | `BuyerGrantApproveScreen` |
| `PASSWORD_RESET` | `revyx://auth/reset/{ot_token}` | `PasswordResetScreen` (no auth required) |
| `CHURN_TASK_OPENED` (cs_user only) | `revyx://cs/tasks/{task_id}` | `CsTaskDetailScreen` |

**Allowlist enforcement:** parser RN validează `deep_link_url` contra regex `^revyx://(leads|showings|buyer-grants|auth/reset|cs/tasks)/[a-f0-9-]+(\?[a-z0-9=&_-]*)?$` înainte de navigation. Mismatch → fallback `HomeScreen` + log `DEEP_LINK_INVALID_REJECTED` Sentry (NU AUDIT_LOG — local-only telemetry).

---

## 6. Algorithms (PATCH — extension §6.4 NEW)

### 6.4 Push deep-link routing algorithm ★ NEW v1.0.1

```
function handlePushTap(notification: ReceivedNotification): NavigationAction {
  // Step 1: Extract candidate URL
  const candidate = notification.deep_link_url 
                  ?? notification.aps?.url 
                  ?? notification.data?.click_action;
  
  if (!candidate) {
    // Backwards compat (client < v1.0.1 server payload OR no URL provided)
    return navigate('Home');
  }
  
  // Step 2: Validate against allowlist regex
  if (!ALLOWLIST_REGEX.test(candidate)) {
    Sentry.captureMessage('DEEP_LINK_INVALID_REJECTED', { 
      level: 'warning', 
      extra: { url_prefix: candidate.substring(0, 32) }  // truncate to avoid PII risk
    });
    return navigate('Home');
  }
  
  // Step 3: Parse target
  const url = new URL(candidate);
  const segments = url.pathname.split('/').filter(Boolean);
  const event = segments[0];                              // 'leads' / 'showings' / ...
  const resourceId = segments[1];                         // UUID
  
  // Step 4: Auth gate (skip pentru PASSWORD_RESET)
  if (event !== 'auth' && !isAuthenticated()) {
    storePendingDeepLink(candidate);                      // resume after login
    return navigate('Login');
  }
  
  // Step 5: Navigate per route table §5.4
  return navigateToScreen(event, resourceId, url.searchParams);
}
```

**Edge cases:**
- App killed → cold start cu `getInitialNotification()` (Expo Push) → handle prin acelaşi `handlePushTap` post-mount.
- App background → `addNotificationResponseReceivedListener` invocat → handle immediate.
- App foreground → notification fired in-app banner; tap → handle same.
- Pending deep-link la login: stored în secure storage (Keychain/Keystore), resumed la `onAuthSuccess`, single-use cleanup.

### 6.5 PII verification pre-send (backend) ★ NEW v1.0.1

Backend payload builder verifies `deep_link_url` cu regex same allowlist înainte de send (defense in depth):

```typescript
function buildPushPayload(event: PushEvent): PushPayload {
  const url = buildDeepLink(event);  // UUID-only
  if (!ALLOWLIST_REGEX.test(url)) {
    throw new Error('DEEP_LINK_BUILD_INVALID');  // Bug, NOT user input
  }
  assertNoPII({ deep_link_url: url });           // double-check via PII_REDACTION_FIXTURES
  return { /* ... */, deep_link_url: url };
}
```

Eveniment `MOBILE_PUSH_DEEPLINK_BUILT` (cosmetic, audit-log v2.0.0 backlog) — informativ.

---

## 7. State Machines (PATCH — extension)

State machine push notification reception extension:

```
[PushArrived] (from APNS/FCM)
   │
   ├─ App foreground → render in-app banner → [UserTaps] OR [Dismissed]
   ├─ App background → OS notification rendered → [UserTaps] OR [Dismissed]
   └─ App killed → OS notification rendered → [UserTaps] → app cold start
                                                       │
                                                       └─ → getInitialNotification()

[UserTaps] (notification or banner)
   │
   ├─ handlePushTap() invocat
   │   ├─ Has deep_link_url? + valid allowlist?
   │   │   ├─ YES → [DeepLinkResolved]
   │   │   └─ NO  → [FallbackHome]
   │   └─ Auth required?
   │       ├─ Authenticated → [ScreenNavigated]
   │       └─ Not auth → [StorePending] → [LoginNavigate]
   │
   └─ Sentry log on invalid (NOT AUDIT_LOG)

[DeepLinkResolved] → [ScreenNavigated] → end
[FallbackHome] → end
[LoginNavigate] → [AuthSuccess] → [ResumePending] → [ScreenNavigated] → end
```

---

## 12. Security (PATCH — extension §12.6 NEW)

### 12.6 Deep-link security ★ NEW v1.0.1

| Risk | Mitigation |
|---|---|
| Phishing via custom URL (malicious app intercept scheme) | iOS Universal Link `https://revyx.app/m/*` (signed, verified domain); Android App Link cu `autoVerify="true"` + assetlinks.json. Scheme custom `revyx://` doar fallback. |
| PII leakage în URL params | Regex allowlist enforce `[a-f0-9-]+` (UUID only) pentru resourceId. NO email/phone/name în params. assertNoPII verify backend pre-send + RN parser post-receive. |
| Auth token în URL (PASSWORD_RESET) | OT token = single-use, ≤90s TTL, signed JWT separat de session token. Token consumed la `/auth/reset` endpoint server-side. Never logged în AUDIT_LOG raw (hash only). |
| Open redirect via crafted URL | Allowlist regex strictly enforced; rejection logged Sentry; no follow-through la URL extern. |
| Deep-link replay (notification re-tap dupa expire) | TTL per event_type (NEW_LEAD: 24h; SHOWING_REMINDER: până la showing start; PASSWORD_RESET: 90s); server-side check pe resource_id status valid înainte de render. |
| **`deep_link_url` în `pii_field_registry`** | Marcat `pii_kind='internal_id'` (UUID-only, no leakage) post-deploy migrare 0611. Zero redaction necesară pentru audit_log views. |

---

## 15. Testing Strategy (PATCH — extension §15.7 NEW)

### 15.7 Deep-link tests ★ NEW v1.0.1

| Test | Scope | Tooling | Pass criteria |
|---|---|---|---|
| Snapshot `assertNoPII(push_payload.deep_link_url)` | Backend payload builder | Jest + `@revyx/test-fixtures-pii` | 0 PII leak în 6 event types × 100 fixtures = 600 cases |
| Allowlist regex acceptance | RN parser | Jest | 18 valid URLs (3 per event_type) → all pass |
| Allowlist regex rejection | RN parser | Jest | 24 invalid URLs (XSS, JS, http, ftp, file, javascript:, data:, blob:, intent:, malformed, PII-leak attempt, too-long, etc.) → all rejected |
| E2E cold start deep-link | App killed → notif tap → screen mount | Detox + simulated push | 6 event types verified, navigation correct, auth gate respected |
| E2E background → foreground | App background → notif tap → resume to screen | Detox | 6 event types verified |
| E2E pending deep-link login flow | Notif tap unauth → login → resume | Detox | Pending stored Keychain/Keystore; consumed post-login; single-use cleanup verified |
| Sentry log on invalid | RN parser rejection | Mocked Sentry | Captured cu level=warning; url_prefix truncated 32 chars (no PII risk) |

---

## 17. Migration Strategy (PATCH — no BD change)

Zero schema BD migrations. Backend payload builder extension este **code-only** (no SQL).

**Backend rollout sequence:**
1. Deploy backend payload builder cu `deep_link_url` field (gated behind `flag.mobile_push_deeplink.enabled=false` initially).
2. Deploy RN build v1.0.1 la TestFlight Apple + Play Internal Track (Mobile Lead, build T+60).
3. Verify TestFlight cohort: deep-link tap pentru NEW_LEAD funcțional (Senior QA).
4. Promote `flag.mobile_push_deeplink.enabled=true` global (DS Lead nu necesită — config simplu Backend Lead).
5. Monitor Sentry `DEEP_LINK_INVALID_REJECTED` rate (target <0.1% per push delivered).
6. Promote production App Store + Play Store după 7 zile TestFlight stable (Mobile Lead).

**Rollback:** flag flip + clients v1.0.1 ignore field; clients v1.0.0 nu primesc field deja → zero rollback de RN code necesar.

---

## 19. Impact Assessment (PATCH — extension)

| Domeniu | Impact | Notă |
|---|---|---|
| Schema BD | Zero | Code-only change |
| Audit-log catalog | Cosmetic event `MOBILE_PUSH_DEEPLINK_BUILT` propus audit-log v2.0.0 backlog (NU mandatory) | LOW priority |
| `pii_field_registry` | Add `deep_link_url` cu `pii_kind='internal_id'` post-deploy 0611 | UUID-only, no redaction needed |
| RBAC | Niciun nou role; deep-link respectă session-based access control existing | — |
| GDPR | Zero impact — UUID în URL nu sunt PII per DPIA §3.2 categorisation | — |
| Performance | Negligible — parser RN regex <1ms per push | — |
| Stage 4 (Churn) | Enables `CHURN_TASK_OPENED` push pentru cs_user mobile → tap → `CsTaskDetailScreen` | Cross-ref `RUNBOOK_REVYX_stage4-churn-launch` §3 cohort plan |
| Stage 5 (White-Label) | Per-tenant deep-link host customization (`{tenant}.example.com/m/leads/{id}`) — out of scope v1.0.1 (post-GA decision) | Tracked future |

---

## 20. Cross-references

- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §2 Modul 1 Feature 1.5 + §4 Modul 4 Feature 4.5 + §7 Modul 6 Feature 6.3 + §13 Modul 12 Feature 12.5 + §15 Modul 14 Feature 14.7
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` §5 M1.S5 Mobile companion + §6 M2.S3 Mobile companion enhancement
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.1 T-S16-06
- `TECH_SPEC_REVYX_mobile-rn_v1.0.0.md` — base spec (toate §1-§18 neschimbate)
- `TECH_SPEC_REVYX_audit-log_v1.1.1.md` §4.4.4 — `MOBILE_PUSH_*` events
- `TECH_SPEC_REVYX_pii-field-registry_v1.0.0.md` §11 — seed update planificat post-0611
- `RUNBOOK_REVYX_stage1-mobile-launch_v1.0.0.md` — Stage 1 execution antecedent
- `RUNBOOK_REVYX_stage4-churn-launch_v1.0.0.md` — Stage 4 cs_user push consumer
- `AUDIT_REVYX_s13-external-pass_v1.0.0.md` §3.2 — F-S13-01 origin finding
- `AUDIT_REVYX_s14-external-pass_v1.0.0.md` §3.2 — F-S13-01 IN PROGRESS status
- `AUDIT_REVYX_s15-external-pass_v1.0.0.md` §4.1 — F-S13-01 CLOSED doc-side
- `docs/test-fixtures/PII_REDACTION_FIXTURES_v1.0.0.md` — `assertNoPII` lib

---

## 21. Approval

| Aprobator | Sign-off |
|---|---|
| Senior PM | ✅ |
| Solution Architect | ✅ |
| Mobile Lead | ✅ |
| Audit Lead | ✅ |
| DPO (PII verify) | ✅ |
| Security Lead (allowlist + Universal Link verify) | ✅ |

---

*docs/tech-spec/TECH_SPEC_REVYX_mobile-rn_v1.0.1.md · v1.0.1 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
