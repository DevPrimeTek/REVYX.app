# PLATFORM MATRIX — REVYX Web vs Mobile Feature Allocation
<!-- PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-dev (referință canonică) · M0 / M1 / M2 (toate milestones)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §1.4 (filozofie dual-platform) + §6.2 M2.S2 Web Complete + M2.S3 Mobile Companion
**Trigger:** Audit finding 88% docs au gap-uri Web/Mobile ambiguu; 0 specs dedicate Web; pattern "Dashboard" folosit 12× fără platformă specificată.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | Senior Architect + Senior PM + Senior PO + Frontend Lead + Mobile Lead | ★ INITIAL — single source of truth pentru orice feature × platform mapping. Acoperă 15 module funcționale REVYX (Auth, Lead, Property, Match, NBA, Deal, Showing, Offer, Activity, WhatsApp, Reports, Admin, Marketplace, White-Label, ML+Churn, Audit). Pentru fiecare modul: tabel feature × platform (WEB/MOBILE/BOTH) cu detaliu per RBAC role + cross-ref spec sursă + notes implementation. Definitiv: rezolvă pattern "dashboard" ambiguu identificat în audit S15-bis-3 (lead-lifecycle, churn-ga, ml-pricing-ga, offer-chain, marketplace-two-sided). |

---

## 1. Scop & Filozofie

Acest document este **autoritatea finală** pentru întrebarea: *"Această funcționalitate este pe Web, Mobile sau ambele?"*

**Reguli (recapitulare din MASTER_PLAN §1.4 DP-01..DP-07):**

| Regulă | Implicație practică |
|---|---|
| DP-01 Web-first development | Default = WEB ONLY; Mobile primește subset doar dacă justificat de use case in-field |
| DP-02 Feature parity matrix | Acest document este matricea — orice feature trebuie să apară aici |
| DP-03 Single source backend | API identic; tabelul nu acoperă backend (e identic) — doar UI surface |
| DP-04 Single session per agent | Web și Mobile NU pot fi logate simultan cu același user |
| DP-05 Critical admin = Web only | Admin features (RBAC, ML promote, billing, white-label) — niciodată Mobile |
| DP-06 Brand consistency | Componente UI corespondente (Card, Button, Modal) în Web + Mobile |
| DP-07 Performance budgets | Web FCP < 1.5s; Mobile JS bundle < 5MB |

### 1.1 Legendă platformă

| Tag | Semnificație |
|---|---|
| 🌐 **WEB** | Implementat în `apps/web/` Next.js 14 — disponibil în browser desktop |
| 📱 **MOBILE** | Implementat în `apps/mobile/` React Native — disponibil iOS + Android app |
| 🔁 **BOTH** | Implementat pe ambele cu paritate funcțională (datele identice, UI optimizat per device) |
| 🌐+ | Web cu funcționalitate extinsă vs Mobile (subset) |
| 📱-only | Mobile cu funcționalitate care NU are sens pe Web (ex: geo-tag, photo capture) |
| ⛔ N/A | Feature nu se aplică acestui rol |

### 1.2 Legendă RBAC roles (per BRD §6 + tenancy-roles)

| Role | Cod | Web access | Mobile access |
|---|---|---|---|
| Agent | `agent` | ✅ | ✅ |
| Senior Agent | `senior_agent` | ✅ | ✅ |
| Team Lead | `team_lead` | ✅ | ⚠️ Read-only Mobile (no team mgmt actions) |
| Manager | `manager` | ✅ | ⚠️ Read-only Mobile (no escalation actions) |
| Admin | `admin` | ✅ | ❌ DP-05 (admin features = Web only) |
| Buyer (marketplace) | `buyer` | ✅ Web public | 🔮 Future Mobile app (M2+) |
| CS Lead | `cs_lead` | ✅ | ❌ DP-05 |
| CS User | `cs_user` | ✅ | ⚠️ Limited Mobile (call list only) |
| Compliance Auditor | `compliance_auditor` | ✅ | ❌ DP-05 |
| Tenant Admin | `tenant_admin` | ✅ | ❌ DP-05 |
| Data Science Lead | `data_science_lead` | ✅ | ❌ DP-05 |

---

## 2. Modul 1 — Authentication & Session

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 1.1 | Login email + password | 🔁 BOTH | 🔁 BOTH | `tenancy-roles-extension` v1.1.0 | Web: cookie session; Mobile: secure storage token |
| 1.2 | OT (One-Time) auth biometric/SMS | 📱-only | ✅ | `mobile-rn` v1.0.0 §AUTH | Mobile-specific: TouchID/FaceID/SMS |
| 1.3 | Magic link login | 🌐 | ⛔ | TBD | Web only — email-driven |
| 1.4 | Single-session enforcement (BR-12) | 🔁 BOTH | 🔁 BOTH | BRD §9.1 | Forțare logout pe celălalt device la login |
| 1.5 | Password reset | 🌐 | 🔁 deep-link | `mobile-rn` v1.0.1 (F-S13-01) | Mobile primește deep-link `revyx://auth/reset/{token}` |
| 1.6 | Logout (manual) | 🔁 BOTH | 🔁 BOTH | — | Local + server token revoke |
| 1.7 | Session timeout (15min refresh) | 🔁 BOTH | 🔁 BOTH | tenancy §6.1 | Identical TTL |
| 1.8 | Multi-tenant switch (admin) | 🌐 | ⛔ DP-05 | tenancy §3 | Admin-only, Web only |

---

## 3. Modul 2 — Lead Management

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 2.1 | Lead intake webhook (Meta/Google/OLX) | N/A backend | N/A backend | `webhook-intake` v1.0.0 | Server-side; nu UI |
| 2.2 | Lead manual creation | 🌐 form complet | 📱 form simplu | `lead-scoring` v1.0.0 | Web: 20+ fields; Mobile: 6 fields esențiale + photo property |
| 2.3 | Lead list / queue prioritized | 🌐 sortabil + filtre avansate | 📱 list simplu sortat LS+SLA | `lead-lifecycle` workflow | Web: filter complex (10+ criterii); Mobile: 3 filtre (status, SLA, asignat) |
| 2.4 | Lead detail page | 🌐 full + side panel | 📱 single screen scrollabil | `lead-scoring` v1.0.0 | Web: split-pane property suggestions; Mobile: tabs (Detail / Activity / Match) |
| 2.5 | Lead score (LS) display | 🔁 BOTH | 🔁 BOTH | `lead-scoring` v1.0.0 | UI badge identic vizual |
| 2.6 | Lead Firewall enforcement (BR-01) | N/A backend | N/A backend | `lead-scoring` v1.0.0 | Server-side; UI doar afișează rezultatul |
| 2.7 | Lead assignment manual | 🌐 dropdown agent | 📱 dropdown agent | `lead-lifecycle` workflow | Same UX both |
| 2.8 | Lead reassignment (manager_override) | 🌐 + audit log | ⛔ DP-05 (manager action) | `lead-lifecycle` workflow | Web only — audit-logged manager action |
| 2.9 | Lead consent capture (GDPR) | 🌐 form | 📱 form | BRD §9.4 | Identical legal text RO/RU |
| 2.10 | SLA timer real-time countdown | 🔁 BOTH | 🔁 BOTH | BRD §5 SLA | Web: header sticky; Mobile: notification banner |
| 2.11 | Escalation Protocol 3 niveluri (BR-03) | N/A backend | N/A backend | `escalation` workflow | Server-side trigger; UI vede effect |
| 2.12 | Manager escalation queue | 🌐 + bulk actions | ⛔ DP-05 | `escalation` workflow | Manager-only Web feature |
| 2.13 | Nurturing automat leads <0.40 | N/A backend | N/A backend | BRD §6.1 | No UI — automatic |
| 2.14 | Lead history / timeline | 🌐 timeline vertical | 📱 timeline scroll | `audit-log` v1.1.1 | Same data, different layout |
| 2.15 | Lead bulk import CSV | 🌐 | ⛔ | TBD | Web only — file upload pattern |

---

## 4. Modul 3 — Property Management

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 3.1 | Property listing (CRUD) | 🌐 form complet 30+ fields | 📱 quick add 8 fields + photo | `property` v1.0.0 | Web: full edit; Mobile: in-field minimal |
| 3.2 | Property photo upload (multiple) | 🌐 drag-drop | 📱 camera + library | `property-onboarding` workflow | Mobile: photo direct; Web: bulk upload |
| 3.3 | Property photo gallery view | 🔁 BOTH | 🔁 BOTH | — | Web: lightbox; Mobile: swipeable carousel |
| 3.4 | Property score (PS) display | 🔁 BOTH | 🔁 BOTH | `property` v1.0.0 §7.2 | UI identic |
| 3.5 | Listing Freshness (LF) badge | 🔁 BOTH | 🔁 BOTH | `property` v1.0.0 LF formula | Color-coded same logic |
| 3.6 | Property search + filter (advanced) | 🌐 10+ filtre + map | 📱 5 filtre essential + list | `property` v1.0.0 | Web: advanced search; Mobile: quick filter |
| 3.7 | Property map view (GIS) | 🌐 Mapbox/Leaflet desktop | 📱 native maps (Apple/Google) | `property` v1.0.0 §GIS | Web: cluster mosaic; Mobile: native pin markers |
| 3.8 | Property GIS distance calculation | N/A backend (PostGIS) | N/A backend | `property` v1.0.0 | Server-side |
| 3.9 | Property archive (decay LF=0) | N/A backend cron | N/A backend | `property-onboarding` workflow | Auto, no UI action |
| 3.10 | Property edit (manager-level fields) | 🌐 | ⛔ DP-05 | `property` v1.0.0 | Pricing override only Web |
| 3.11 | Property visit / showing schedule | 🔁 BOTH | 🔁 BOTH | `showing` v1.0.0 | Calendar pick |

---

## 5. Modul 4 — Matching & NBA

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 4.1 | Match engine compute (PS+LS+IS) | N/A backend | N/A backend | `match-engine` v1.0.0 | Server-side |
| 4.2 | Match v2 pgvector HNSW (semantic) | N/A backend | N/A backend | `match-engine` v2.0.0 | Server-side |
| 4.3 | Match suggestions list (per lead) | 🌐 split-pane lângă lead | 📱 tab "Match" în lead detail | `match-engine` v1.0.0 | Web: side panel; Mobile: separate tab |
| 4.4 | Match acceptance / rejection | 🔁 BOTH | 🔁 BOTH | — | Same action, different UI affordance |
| 4.5 | Re-matching trigger needs_review (BR-05) | 🌐 banner alert | 📱 push notification | `match-engine` v1.0.0 | UI: Web banner persistent; Mobile push notif |
| 4.6 | Interaction Strength (IS) display | 🔁 BOTH | 🔁 BOTH | `interaction-strength` v1.0.0 | Score badge |
| 4.7 | NBA recommendations (top 3) | 🌐 widget dashboard | 📱 home screen | `nba-engine` v1.0.0 | Mobile: prima screen; Web: dashboard widget |
| 4.8 | NBA action execute (call/email/WA) | 🔁 BOTH | 🔁 BOTH | `nba-engine` v1.0.0 | Mobile: native call/sms intent; Web: triggers WhatsApp Web link |

---

## 6. Modul 5 — Deal Pipeline

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 5.1 | Deal creation (from lead) | 🔁 BOTH | 🔁 BOTH | `deal-closure` v1.0.0 | Same flow |
| 5.2 | Deal pipeline kanban view | 🌐 horizontal kanban 6 stages | 📱 vertical list grouped by stage | `deal-closure` workflow | Mobile: list; Web: kanban drag-drop |
| 5.3 | Deal detail + DHI display | 🔁 BOTH | 🔁 BOTH | `dhi-engine` v1.0.0 | Identical |
| 5.4 | Deal Probability (DP) display | 🔁 BOTH | 🔁 BOTH | `deal-closure` v1.0.0 | Score badge |
| 5.5 | DHI heatmap timeline | 🌐 chart Recharts | 📱 sparkline simplu | `dhi-engine` v1.0.0 | Web: full chart; Mobile: minimal sparkline |
| 5.6 | Deal stage advance (drag/swipe) | 🌐 drag-drop kanban | 📱 swipe right or button | — | Different gesture, same effect |
| 5.7 | Deal commission split | 🌐 form + audit | ⛔ DP-05 | `deal-closure` v1.0.0 | Manager action — Web only |
| 5.8 | Deal closure (won/lost) | 🔁 BOTH | 🔁 BOTH | `deal-closure` workflow | Mobile: confirm modal; Web: confirm + reason field |
| 5.9 | Deal close reason capture | 🔁 BOTH | 🔁 BOTH | `deal-closure` workflow | Same dropdown |

---

## 7. Modul 6 — Showing Management

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 6.1 | Showing schedule create | 🌐 calendar drag-create | 📱 form + date picker | `showing` v1.0.0 | Web: calendar UI; Mobile: form-based |
| 6.2 | Showing list / calendar view | 🔁 BOTH | 🔁 BOTH | `showing-flow` workflow | Web: calendar; Mobile: list + agenda |
| 6.3 | Showing reminder push (24h+1h) | N/A backend | 📱 push notification | `showing` v1.0.0 | Mobile: push; Web: email + in-app banner |
| 6.4 | Showing **check-in geo-tag** | ⛔ N/A | 📱-only | `showing-flow` workflow | Mobile-only — needs GPS |
| 6.5 | Showing **photo capture in-place** | ⛔ N/A | 📱-only | `showing-flow` workflow | Mobile-only — needs camera |
| 6.6 | Showing outcome record (post-attended) | 🔁 BOTH | 🔁 BOTH | `showing-flow` workflow | Mobile typically; Web also possible |
| 6.7 | Showing reschedule | 🔁 BOTH | 🔁 BOTH | `showing` v1.0.0 | Same flow |
| 6.8 | Showing cancellation | 🔁 BOTH | 🔁 BOTH | `showing` v1.0.0 | Same flow |
| 6.9 | IS boost post-attended showing | N/A backend | N/A backend | `interaction-strength` | Server-side automatic |

---

## 8. Modul 7 — OFFER Chain

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 7.1 | Offer create | 🌐 form complet | 📱 quick form 4 fields | `offer-engine` v1.0.0 | Web: detailed form; Mobile: quick capture |
| 7.2 | Offer chain visualization (round-trip) | 🌐 timeline split | 📱 list scroll | `offer-chain` workflow | Web: split timeline buyer/seller; Mobile: linear list |
| 7.3 | Counter-offer create | 🔁 BOTH | 🔁 BOTH | `offer-engine` v1.0.0 | Same form |
| 7.4 | Offer accept / reject | 🔁 BOTH | 🔁 BOTH | `offer-engine` v1.0.0 | Confirm modal |
| 7.5 | **Offer manager review queue** ★ | 🌐 + audit | ⛔ DP-05 | `offer-chain` workflow | **Web only** — manager action gating chain |
| 7.6 | Offer state machine logging | N/A backend | N/A backend | `audit-log` v1.1.1 OFFER_* events | Server-side |

---

## 9. Modul 8 — Activity & Notes

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 8.1 | Activity log create (call/email/meeting) | 🔁 BOTH | 🔁 BOTH | `interaction-strength` | Same flow |
| 8.2 | **Voice memo activity** ★ | ⛔ N/A | 📱-only | `interaction-strength` v1.0.0 | Mobile-only — native mic |
| 8.3 | Note text rich-text | 🌐 markdown editor | 📱 plain text | — | Web: rich; Mobile: simple |
| 8.4 | Activity timeline (per lead/deal) | 🔁 BOTH | 🔁 BOTH | `audit-log` v1.1.1 | Same data |
| 8.5 | Activity filter by type | 🔁 BOTH | 🔁 BOTH | — | Filter chip |

---

## 10. Modul 9 — WhatsApp Business Integration

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 9.1 | WhatsApp send (5 templates Meta-approved) | 🌐 button în lead | 📱 button + native deep-link | TBD M2.S6 | Web: opens WhatsApp Web; Mobile: native intent |
| 9.2 | Template selection picker | 🔁 BOTH | 🔁 BOTH | TBD | Same dropdown |
| 9.3 | Delivery status display (sent/delivered/read) | 🔁 BOTH | 🔁 BOTH | TBD | Webhook-driven |
| 9.4 | Rate limiting (per-tenant + per-agent) | N/A backend | N/A backend | TBD | Server-side |
| 9.5 | WhatsApp incoming message reply | 🌐 inbox | 📱 push + reply | TBD M2.S6 | Future feature |

---

## 11. Modul 10 — Reports & Analytics

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 10.1 | Lead conversion rate | 🌐 chart Recharts | ⛔ DP-05 (manager view) | TBD M2.S2 | Web only |
| 10.2 | APS leaderboard (team_lead+) | 🌐 table sortabilă | ⛔ DP-05 | `aps-engine` v1.0.0 | Web only |
| 10.3 | Deal closure rate per agent | 🌐 chart | ⛔ DP-05 | `deal-closure` | Web only |
| 10.4 | DHI distribution heatmap | 🌐 chart | ⛔ DP-05 | `dhi-engine` | Web only |
| 10.5 | Personal performance dashboard (own APS) | 🔁 BOTH | 🔁 BOTH | `aps-engine` | Agent vede doar self |
| 10.6 | Export CSV reports | 🌐 | ⛔ DP-05 | TBD | Web only — file download pattern |
| 10.7 | Custom date-range filter | 🌐 | ⛔ DP-05 | TBD | Web only — admin/manager feature |

---

## 12. Modul 11 — Admin & Configuration ⛔ DP-05 — Web only complet

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 11.1 | RBAC matrix view | 🌐 admin only | ⛔ DP-05 | `tenancy-roles-extension` | Web only |
| 11.2 | User invite + role assignment | 🌐 admin only | ⛔ DP-05 | tenancy | Web only |
| 11.3 | User suspend / reactivate | 🌐 admin only | ⛔ DP-05 | tenancy | Web only |
| 11.4 | Tenant settings (timezone, currency) | 🌐 tenant_admin | ⛔ DP-05 | tenancy | Web only |
| 11.5 | Audit log viewer (filterable + export) | 🌐 compliance_auditor + admin | ⛔ DP-05 | `audit-log` v1.1.1 | Web only |
| 11.6 | System health page | 🌐 admin | ⛔ DP-05 | TBD | Web only |
| 11.7 | Feature flags admin | 🌐 admin | ⛔ DP-05 | TBD | Web only |
| 11.8 | Billing & subscription management | 🌐 tenant_admin | ⛔ DP-05 | TBD | Web only — Stripe portal embed |

---

## 13. Modul 12 — Marketplace (Buyer-side)

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 12.1 | Buyer profile self-publish form | 🌐 public site | 🔮 Future M2+ | `marketplace-two-sided` v1.0.0 | Web public Marketplace primar |
| 12.2 | Buyer profile browse / search | 🌐 + filters + map | 🔮 Future | `marketplace-two-sided` | Web only inițial |
| 12.3 | Contact-grant request UI (buyer → agent) | 🌐 | 🔮 Future | `marketplace-two-sided` | Web only inițial |
| 12.4 | **Agent search buyer profiles** ★ | 🌐 | 🔮 Future | `marketplace-two-sided` | Web only inițial; Mobile post-M2 |
| 12.5 | Contact-grant approve/reject (agent) | 🌐 inbox dashboard | 📱 push + approve | `marketplace-two-sided` | Mobile: push primit + approve via deep-link |
| 12.6 | Buyer auto-EXPIRE on inactivity | N/A backend cron | N/A backend | `marketplace-two-sided` | Server-side |
| 12.7 | Stripe Connect payment (subscription) | 🌐 portal embed | ⛔ DP-05 | TBD | Web only (Stripe restrictions) |

---

## 14. Modul 13 — White-Label Configuration ⛔ DP-05 — Web only complet

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 13.1 | Custom domain claim | 🌐 tenant_admin | ⛔ DP-05 | `white-label` v1.0.0 | Web only |
| 13.2 | Brand colors + logo upload | 🌐 tenant_admin | ⛔ DP-05 | `white-label` | Web only |
| 13.3 | DKIM rotation status | 🌐 admin | ⛔ DP-05 | `dkim-rotation` runbook | Web only |
| 13.4 | Custom email templates | 🌐 tenant_admin | ⛔ DP-05 | `white-label` | Web only |
| 13.5 | Plan-tier upgrade (Enterprise) | 🌐 tenant_admin | ⛔ DP-05 | TBD | Web only |

---

## 15. Modul 14 — ML Pricing & Churn

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 14.1 | Pricing prediction display (per property) | 🔁 BOTH | 🔁 BOTH | `ml-pricing-ga` v1.0.2 | Same widget |
| 14.2 | Pricing override agent | 🌐 form + audit | 📱 form + audit | `ml-pricing-ga` | Same flow |
| 14.3 | **ML Model promote 4-eyes UI** ★ | 🌐 admin only | ⛔ DP-05 | `ml-pricing-ga` v1.0.2 §6 | **Web only** — 2-step REQUEST/APPROVE flow |
| 14.4 | Bias monitoring dashboard | 🌐 admin + DS Lead | ⛔ DP-05 | TBD | Web only |
| 14.5 | Churn score per agent (own) | 🔁 BOTH | 🔁 BOTH | `churn-ga` v1.0.1 BR-18 | Display only own |
| 14.6 | **Churn analytics dashboard** ★ | 🌐 cs_lead + manager | ⛔ DP-05 | `churn-ga` v1.0.1 | **Web only** — CS dashboard |
| 14.7 | CS task list (churn intervention) | 🌐 inbox + bulk | 📱 task list (cs_user only) | `churn-ga` + CS playbooks | Mobile limited cs_user |
| 14.8 | Churn intervention playbook execute | 🌐 + checklist | 📱 + checklist | CHURN playbooks | Same flow |

---

## 16. Modul 15 — Audit & Compliance

| # | Feature | 🌐 Web | 📱 Mobile | Spec sursă | Notes |
|---|---|---|---|---|---|
| 15.1 | AUDIT_LOG append-only writes | N/A backend | N/A backend | `audit-log` v1.1.1 | Server-side trigger |
| 15.2 | Audit log viewer (compliance) | 🌐 compliance + admin | ⛔ DP-05 | `audit-log` v1.1.1 | Web only |
| 15.3 | Audit log export CSV | 🌐 | ⛔ DP-05 | `audit-log` v1.1.1 | Web only |
| 15.4 | GDPR Art. 15 right of access (data export) | 🌐 user self-service | 📱 link redirect to Web | BRD §9.4 | Mobile redirects to Web |
| 15.5 | GDPR Art. 17 right to erasure | 🌐 user self-service | 📱 link redirect to Web | BRD §9.4 | Mobile redirects to Web |
| 15.6 | DPIA viewer (internal) | 🌐 DPO | ⛔ DP-05 | `DPIA_REVYX_phase5` | Web only |
| 15.7 | Privacy Policy publică | 🌐 + Mobile webview | 🌐 webview | `privacy-policy` | Mobile shows in webview from Web URL |
| 15.8 | Cookie consent banner | 🌐 only | ⛔ N/A | `cookie-policy` | Cookies = Web concept; Mobile uses iOS/Android consent APIs |

---

## 17. Sumar statistic

| Modul | Total features | 🌐 Web only | 📱 Mobile only | 🔁 BOTH | N/A backend |
|---|---|---|---|---|---|
| 1. Auth | 8 | 2 | 1 | 5 | 0 |
| 2. Lead | 15 | 5 | 0 | 7 | 3 |
| 3. Property | 11 | 1 | 0 | 8 | 2 |
| 4. Match+NBA | 8 | 0 | 0 | 6 | 2 |
| 5. Deal | 9 | 1 | 0 | 8 | 0 |
| 6. Showing | 9 | 0 | 2 | 6 | 1 |
| 7. Offer | 6 | 1 | 0 | 4 | 1 |
| 8. Activity | 5 | 0 | 1 | 4 | 0 |
| 9. WhatsApp | 5 | 0 | 0 | 4 | 1 |
| 10. Reports | 7 | 6 | 0 | 1 | 0 |
| 11. Admin | 8 | 8 | 0 | 0 | 0 |
| 12. Marketplace | 7 | 5 | 0 | 1 | 1 |
| 13. White-Label | 5 | 5 | 0 | 0 | 0 |
| 14. ML+Churn | 8 | 4 | 0 | 3 | 1 |
| 15. Audit | 8 | 5 | 0 | 1 | 2 |
| **TOTAL** | **119** | **43 (36%)** | **4 (3%)** | **58 (49%)** | **14 (12%)** |

**Distribuție efectivă (excluzând backend N/A):**
- 🌐 Web only: **41%**
- 📱 Mobile only: **4%**
- 🔁 BOTH: **55%**

**Confirmare DP-01 (Web-first):** 41% + 55% = 96% features touched de Web; doar 4% Mobile-only (geo-tag, photo capture, voice memo).
**Confirmare DP-05 (admin = Web only):** 100% module 11 (Admin) + 100% module 13 (White-Label) + 100% module 12 (Marketplace except contact-grant approve) = pure Web.

---

## 18. Mobile JUSTIFIED features (de ce există pe Mobile)

Doar 4 features sunt **exclusiv Mobile** (Mobile-only) — toate justificate de hardware sau context in-field:

| Feature | Justificare Mobile-only |
|---|---|
| 6.4 Showing check-in geo-tag | Necesită GPS device; Web nu are accuracy GPS |
| 6.5 Showing photo capture in-place | Necesită cameră directă; upload from PC e workflow diferit |
| 8.2 Voice memo activity | Necesită microfon nativ; Web alternative = browser MediaRecorder (limited) |
| 1.2 OT auth biometric | Necesită TouchID/FaceID API native |

Restul features Mobile sunt subset din Web (lead view, deal view, NBA), optimizate pentru ecran mic + context in-field.

---

## 19. Cross-references către spec-uri sursă

| Document | Module afectate | Status update necesar |
|---|---|---|
| `WORKFLOW_REVYX_lead-lifecycle_v1.0.1.md` | Modul 2 | 🟡 PATCH v1.0.1 — adăugare platform tags pentru "agent dashboard" |
| `WORKFLOW_REVYX_offer-chain_v1.0.1.md` | Modul 7 | 🟡 PATCH v1.0.1 — manager review = Web only DP-05 explicit |
| `WORKFLOW_REVYX_property-onboarding_v1.0.0.md` | Modul 3 | 🟢 OK — workflow backend |
| `WORKFLOW_REVYX_deal-closure_v1.0.0.md` | Modul 5 | 🟢 OK — workflow generic |
| `WORKFLOW_REVYX_showing-flow_v1.0.0.md` | Modul 6 | 🟢 OK — already mentions Mobile |
| `WORKFLOW_REVYX_escalation_v1.0.0.md` | Modul 2.11+2.12 | 🟡 PATCH minor — manager queue = Web only |
| `TECH_SPEC_REVYX_lead-scoring_v1.0.0.md` | Modul 2 | 🟢 OK — backend spec |
| `TECH_SPEC_REVYX_property_v1.0.0.md` | Modul 3 | 🟢 OK — backend spec |
| `TECH_SPEC_REVYX_match-engine_v2.0.0.md` | Modul 4 | 🟢 OK — backend spec |
| `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.1.md` | Modul 12 | 🟡 PATCH v1.0.1 — agent search = Web only inițial; Mobile post-M2 |
| `TECH_SPEC_REVYX_white-label_v1.0.0.md` | Modul 13 | 🟢 OK (backend + DP-05 implicit) |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.4.md` | Modul 14.3+14.4 | 🟡 PATCH v1.0.3 — promote UI = Web only DP-05 explicit |
| `TECH_SPEC_REVYX_churn-ga_v1.0.2.md` | Modul 14.6+14.7 | 🟡 PATCH v1.0.2 — CS dashboard = Web only |
| `TECH_SPEC_REVYX_mobile-rn_v1.0.1.md` | Restul Mobile | 🟢 OK — definește subset Mobile |
| `TECH_SPEC_REVYX_audit-log_v1.1.1.md` | Modul 15 | 🟢 OK (Web viewer implicit DP-05) |
| **NEW** `TECH_SPEC_REVYX_web-platform_vX.X.X` | TOATE Web features | 🔴 LIPSEȘTE — gating pentru M1.S5/S6 + M2.S2 |
| **NEW** `TECH_SPEC_REVYX_ui-design-system_vX.X.X` | Component library Web+Mobile | 🔴 LIPSEȘTE — gating pentru M0.S1 |

---

## 20. Approval Gate

| Aprobator | Sign-off | Data |
|---|---|---|
| Senior Architect | ⬜ pending | — |
| Senior PM | ⬜ pending | — |
| Senior PO | ⬜ pending | — |
| Frontend Lead | ⬜ pending | — |
| Mobile Lead | ⬜ pending | — |
| Audit Lead | ⬜ pending | — |
| CTO | ⬜ pending | — |

**Notă:** Aprobarea se face la S20 HST #2 close, ca parte din pre-development gate aprobat de board (Master Plan §13).

---

*docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
