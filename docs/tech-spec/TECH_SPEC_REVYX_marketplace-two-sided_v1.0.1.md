# TECH SPEC — REVYX Marketplace Two-Sided (Platform Clarification PATCH)
<!-- TECH_SPEC_REVYX_marketplace-two-sided_v1.0.1.md · v1.0.1 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M2.S5 (Phase G Marketplace Backend + Web) + M2.S3 (Mobile contact-grant approve)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S5 + §6.2 M2.S3

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-04 | Backend Lead + DPO | Marketplace two-sided initial — BUYER_PROFILE + contact-grant + rate limiting + GDPR |
| **1.0.1** | **2026-06** | ★ Senior Architect + Frontend Lead + Mobile Lead | ★ PATCH — buyer self-publish + browse + agent search = WEB ONLY inițial (Mobile post-M2 roadmap); contact-grant approve agent-side = Web inbox + Mobile push deep-link approve. Deferred F-S14-01 L10n RU email template (TRACKED Stage 3 backlog). |

---

## 1. Platform Matrix cross-ref

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §13 (Modul 12 — Marketplace Buyer-side).

## 2. Clarificări platform

| Termen v1.0.0 | Platformă efectivă | Justificare |
|---|---|---|
| "Buyer profile self-publish" | 🌐 **WEB ONLY** (inițial) | Public marketplace site `marketplace.revyx.app`; Mobile buyer app = future M2+ (Modul 12.1) |
| "Buyer profile browse + filter + map" | 🌐 **WEB ONLY** (inițial) | Web public + filters; Mobile = future (Modul 12.2) |
| "Contact-grant request UI (buyer side)" | 🌐 **WEB ONLY** | Web public form; Mobile = future (Modul 12.3) |
| **"Agent search buyer profiles"** ★ | 🌐 **WEB ONLY** (inițial) | M2.S5 livrare — agent `/marketplace/buyers` route Web; Mobile post-M2 (Modul 12.4) |
| "Contact-grant approve/reject (agent)" | 🌐 inbox + 📱 push approve | Web: full inbox dashboard cu bulk; Mobile: push notification + deep-link approve action (Modul 12.5) |
| "Auto-EXPIRE buyer pe inactivity" | N/A backend cron | Server-side (Modul 12.6) |
| "Stripe Connect payment" | 🌐 **WEB ONLY** | Stripe portal embed; Mobile NU per DP-05 (financial admin) (Modul 12.7) |

## 3. Future Mobile buyer app (post-M2 roadmap)

**OUT OF SCOPE M2 GA:** Mobile buyer app dedicated (separate de agent companion app).

Rationale: M2 buyer experience este **Web-first** prin marketplace public; Mobile buyer app = **post-GA decision** după:
- Validare market fit Web buyer flow (≥6 luni post-GA)
- Volume de buyer profiles ≥1000 active
- Demand documentat (NPS feedback "wish was on mobile")

Dacă justificat, viitoare spec `TECH_SPEC_REVYX_buyer-mobile-app_v1.0.0.md` în M3 sau Phase 6.

## 4. Implementation note pentru M2.S5

### 4.1 Web (T-M2.S5-10..14, T-M2.S5-16..17)
- Public marketplace landing
- Self-publish form GDPR consent (Modul 12.1)
- Browse + filter + map (Modul 12.2)
- Contact-grant request (Modul 12.3)
- Agent search buyers (Modul 12.4) — Web only inițial
- Agent contact-grant inbox (Modul 12.5)

### 4.2 Mobile (T-M2.S5-15)
- DOAR push notification când buyer cere contact + deep-link approve
- NU buyer browsing, NU buyer profile creation
- Deep-link `revyx://contact-grants/{id}/approve`

## 5. Deferred items

| Item | Reason | Target |
|---|---|---|
| F-S14-01 L10n RU email template `BUYER_CONTACT_GRANT_REJECTED` | TRACKED Stage 3 backlog | Pre-M2.S5 |
| Mobile buyer app dedicated | Out of scope M2 | M3 sau post-GA decision |

## 6. Cross-references

- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §13 (canonical)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S5
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §5.5 T-M2.S5-*
- `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.1.md` (backend spec rămâne)
- `WORKFLOW_REVYX_buyer-profile-lifecycle_v1.0.0.md`
- `BRD_REVYX_v1.1.0.md` §8.3 BUYER_PROFILE
- `audit-log_v1.1.1` §4.4 BUYER_* events

## 7. Approval

| Aprobator | Sign-off |
|---|---|
| Senior Architect | ⬜ pending (S20) |
| Frontend Lead | ⬜ pending (S20) |
| Mobile Lead | ⬜ pending (S20) |
| DPO | ⬜ pending (S20) |

---

*docs/tech-spec/TECH_SPEC_REVYX_marketplace-two-sided_v1.0.1.md · v1.0.1 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
