# REVYX — Pitch Deck (EN)
<!-- docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-en.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENTIAL · Internal Use · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** M0.S4 — Pitch Deck (T-M0.S4-04 EN)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 AC-M0-04
**Brand ref:** `docs/brand-configs/revyx.md`

## 0.1 Platform Matrix

🌐 **WEB demo only.** All screenshots sourced from `apps/web-preview/` (Next.js 14). Mobile companion referenced only at Slide 11 (Roadmap) as M2.S3 deliverable.

## Changelog

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0.0 | 2026-05 | DOC + DESIGNER + ARCHITECT + Senior PM | ★ INITIAL — 16 slides EN, translated from canonical RO version. |

---

## SLIDE 01 — Cover

**Headline:** REVYX
**Subheadline:** Real Estate Execution Intelligence
**Tagline:** Not a CRM. An Agent Operating System for real estate.
**CTA:** Live demo → `demo.revyx.app`
**Visual:** REVYX logo centered on navy `#0C1428` + gold radial glow.

---

## SLIDE 02 — The Problem

**Headline:** Real estate agents are overwhelmed. Losses are hidden.

**Three core problems:**

1. **Lead overflow without qualification** — An agent receives 80-150 leads/month from 8 sources (Meta, Google, OLX, referrals, walk-ins). Only 12-18% are real. The rest = wasted time.
2. **Opaque pipeline for managers** — No manager knows in real time which deal is healthy and which is about to die. Escalation decisions arrive too late.
3. **Agent performance unmeasured properly** — APS (Agent Performance Score) is missing. Bonuses + lead allocation = subjective, manager-dependent.

**Footer impact:** ~70% pipeline value lost on leads not delivered on time (SLA > 24h) or deals abandoned without structured follow-up.

---

## SLIDE 03 — The Solution: REVYX AOS

**Headline:** An Agent Operating System for real estate

| 🛡️ **Lead Firewall** | 🤖 **NBA Layer** |
|---|---|
| Only leads with LS ≥ 0.60 + valid contact reach the agent (BR-01). Rest enter automated nurturing. | Next-Best-Action recommended in real time per lead/deal: call, WhatsApp, viewing, follow-up. NBA ∈ [0, 2.0]. |

| ⏱️ **Max 3 active tasks** | 🔥 **Escalation 3 levels** |
|---|---|
| Forced focus: no agent works more than 3 active deals concurrently (BR-04). | T+SLA → T+SLA+30min → T+SLA+2h. No HOT lead (LS ≥ 0.75) goes untouched beyond 15 min. |

**Footer claim:** *REVYX doesn't ask the agent what to do. It tells them.*

---

## SLIDE 04 — The Market

**Headline:** Republic of Moldova — under-digitized market, agencies ready for the leap

**Key numbers:**

- **~400 active real estate agencies** in Moldova (2025 estimate, focus Chișinău + Bălți + Cahul)
- **~2,800 licensed individual agents**
- **0 dedicated AOS platforms.** Current competition: Excel + WhatsApp + 1-2 unadapted Russian/Romanian generic CRMs
- **TAM Moldova (SaaS):** ~€5M/year at full penetration (€50/agent/month × 8,400 regional agents Romania+Moldova combined)

**Phase 5 extensions:** Romania (Bucharest + Cluj + Timișoara) · Ukraine post-stabilization · Buyer-side marketplace (`marketplace-two-sided`) · White-Label Enterprise (tenant brand-config)

---

## SLIDE 05 — 5 AI Engines

**Headline:** One platform. Five orchestrated AI engines.

```
[ Lead Score (LS) ]  →  [ Property Score + Match (PS + IS) ]  →  [ NBA Layer ]  →  [ Deal Probability + Health (DP + DHI) ]  →  [ Agent Performance (APS) ]
```

1. **LS — Lead Score [0,1]** — computed at intake, recomputed at every touchpoint. Firewall: ≥ 0.60.
2. **PS + IS — Property + Interaction Strength** — property ↔ lead matching via embeddings (pgvector HNSW, Phase 3).
3. **NBA — Next Best Action [0, 2.0]** — the only scale exception. Weighted urgency × revenue impact.
4. **DP + DHI — Deal Probability + Health Index** — real-time close probability + pipeline health.
5. **APS — Agent Performance Score [0,1]** — meritocratic. Foundation for future lead allocation + bonuses.

**Footer:** *All scores [0,1] (NBA excepted). Validated on 7 test vectors (T01-T07).*

---

## SLIDE 06 — Demo · J1: Lead Score & Firewall

**Headline:** A lead arrives. In 3 seconds, the agent knows what to do.

- **Left:** screenshot `/leads` (queue with colored LS badges: red HOT 0.85 / gold qualified 0.68 / amber warm 0.52 / blue nurturing 0.31) · filter chips
- **Right:** screenshot `/leads/[id]` (lead detail with LS badge 0.78, GDPR consent ✓, side panel "Match suggestions 3", "Assign agent" button)

**3 bullets:**
- Auto-scored at intake — Meta / Google / OLX / direct (HMAC-verified webhooks)
- Firewall BR-01: < 0.60 → automatic nurturing via WhatsApp (5 Meta-pre-approved templates)
- 1-click assign with APS filter — only agents with free slots (max 3)

---

## SLIDE 07 — Demo · J2: Property & Match

**Headline:** Property recorded. Instant match with relevant leads.

- **Left:** screenshot `/properties` (50 properties, filters Apartment / House / Land / Commercial, PS score + LF Listing Freshness `1 − min(1, days/90)`)
- **Right:** screenshot `/properties/new` (8-field intake form) + toast "3 potential lead matches"

**3 bullets:**
- Match engine: pgvector HNSW embeddings (Phase 3) with rule-based fallback pre-vector
- Target accuracy ≥ 70% on test set (AC-M1-03)
- Bidirectional auto-suggestions: property → leads + lead → properties

---

## SLIDE 08 — Demo · J3: Deal Pipeline

**Headline:** 6 stages. Drag-drop. Continuously monitored Deal Health.

- Full-width screenshot `/deals` kanban — 6 columns (Initial / Interest / Viewing / Negotiation / Accepted / Notary), 20 deals distributed. DHI badge per card (green healthy / amber review / red danger). DragOverlay +1° rotation gold border.

**3 bullets:**
- Accessible drag-drop (PointerSensor 6px + KeyboardSensor + permanent click-to-advance fallback)
- DHI computed continuously: TF · UF · RF — re-matching trigger only `needs_review=true`, deals are NOT auto-cancelled (BR-05)
- Close-won → confirmation modal → DEAL_WON event audit-logged

---

## SLIDE 09 — Demo · J4: Manager Command

**Headline:** The manager sees everything. Acts in one click.

- **Left:** screenshot `/manager` (APS leaderboard 8 agents · escalations count · conversion rate · today actions)
- **Right:** screenshot `/manager/escalations` (6 escalations queue, header bulk-select + "Bulk reassign (N)" with 4 target agents, BR-03 3 levels T+SLA / T+SLA+30 / T+SLA+2h with color chips)

**3 bullets:**
- APS leaderboard sorted desc — merit-based promotion, no bias
- Escalation Protocol BR-03 — auto-escalation via SLA timer; manager can override + bulk reassign
- Immutable audit-log: any mgr action → AUDIT_LOG APPEND-ONLY (BR-07)

---

## SLIDE 10 — Architecture Web + Mobile

**Headline:** Web primary. Mobile companion.

```
┌─────────────────────────────────────────────────────────┐
│  WEB ~80%  (apps/web — Next.js 14 + TS strict + Tailwind)│  ← agent + manager + admin (DP-01 Web-first)
│  MOBILE ~20% (apps/mobile — React Native + NativeWind)   │  ← agent in-field only (M2.S3)
├─────────────────────────────────────────────────────────┤
│  REST API + WebSocket (single backend, DP-03)            │
│  Auth: Supabase / Auth0 · JWT RS256 · 15min + 7d refresh │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL + pgvector HNSW · Redis cache · AUDIT_LOG    │
└─────────────────────────────────────────────────────────┘
```

- Web ✅ M0 demo live · M1 functional · M2 GA · Mobile 📱 companion M2.S3
- Single backend → identical Web + Mobile API (DP-03)
- Admin = Web only (DP-05): RBAC mgmt · ML promote · billing · white-label · audit log viewer
- 15 functional modules × 119 features platform-mapped in `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §17

---

## SLIDE 11 — Security & GDPR

**Headline:** Phase 0 Security is blocking. No application code without it.

- ⬜ JWT RS256 + RBAC 5 roles (agent · senior_agent · team_lead · manager · admin)
- ⬜ GDPR consent capture at intake of any lead + automatic retention
- ⬜ AUDIT_LOG append-only — no UPDATE/DELETE allowed at DB level (BR-07)
- ⬜ Webhook HMAC-SHA256 verification (Meta · Google · OLX)
- ⬜ Rate limiting on public endpoints
- ⬜ Privacy Policy + Cookie Policy legal review (Moldova Law 133/2011)

**Footer:**
- Compliance: GDPR EU + Moldova Law 133/2011 + Law 142/2018 SaaS
- AUDIT_LOG includes ISO 27001 + INC + DR_TEST events (zero PII unmask for auditors)
- Retention Pillar (Phase 5) — churn score human-in-the-loop, GDPR Art. 22 compliant (no automated decision-making)

---

## SLIDE 12 — Business Model

**Headline:** Multi-tier SaaS. Per-seat pricing.

| Tier | Target | Price /agent /month | Key features |
|---|---|---|---|
| **Starter** | Small agencies (1-5 agents) | **€29** | LS + NBA + Pipeline + Web only |
| **Pro** | Mid agencies (6-25 agents) | **€49** | All Starter + Manager dashboard + Mobile companion + WhatsApp Business templates |
| **Enterprise** | 25+ agents + corporate | **€79** | All Pro + White-Label (tenant brand-config) + priority SLA + API access + Compliance Auditor seat |

**Footer:**
- Setup fee €0 · Annual commit −15% · 30-day free pilot
- Year 1 ARR target: **€80K** (~150 paid agents) · Year 3: **€800K** (~1,500 agents)
- Target CAC: < €120/agent · Target LTV: > €1,200 (LTV/CAC > 10×)

---

## SLIDE 13 — Roadmap M0 → M1 → M2

**Headline:** Three milestones. Clear execution cadence.

```
2026 Q2 ─────── Q3 ─────── Q4 ─────── 2027 Q1 ────── Q2 ────── H2
   │                            │                       │
   ▼ M0 MVP Pitch ✅            ▼ M1 MVP Functional      ▼ M2 FULL Release GA
   • Live demo demo.revyx.app   • Phase 0 Security ✅   • Web Complete
   • 16 Next.js routes          • Phase A Foundation    • Mobile RN Companion
   • Mock 100/50/20             • Phase B Lead+Score    • 2-sided Marketplace
   • i18n RO/RU/EN              • Pilot 2-3 tenants     • Retention Pillar
   • Pitch deck + video ★ NOW   • HST M1 0 CRIT/HIGH    • White-Label Enterprise
```

**Milestone gates:**
- M0 exit: AC-M0-01..07 ☑ + HST M0 0 CRIT/HIGH ✅
- M1 exit: AC-M1-01..10 ☑ + Pilot live ≥ 7 days no P1 incident + HST M1 PASS
- M2 exit: Public GA + iOS/Android distribution + Marketplace ≥ 1,000 buyer profiles + Prevention Rate ≥ 30%

---

## SLIDE 14 — Traction & Team

**Headline:** Fast execution, lean team, continuous audit.

**M0 traction:**
- ✅ M0.S1 Design System direct-to-code (tokens.json + 18-screen inventory)
- ✅ M0.S2 Clickable prototype — 4 user journeys end-to-end
- ✅ M0.S3 Web Static Demo (16 Next.js routes · mock 100/50/20 · i18n RO/RU/EN · drag-drop)

**Core team (placeholder TBD):**

| Role | Name |
|---|---|
| Founder / PM | {{TBD}} |
| Solution Architect | {{TBD}} |
| Frontend Lead | {{TBD}} |
| Backend / DBA | {{TBD}} |
| DPO + Security | {{TBD}} |

**AI virtual team (11 Claude Code hats):** ARCHITECT · BACKEND DEV · FRONTEND WEB DEV · MOBILE DEV · DBA · TESTER · SECURITY · DEVOPS · ML ENGINEER · DESIGNER · DOC — conditionally activated per stage (CLAUDE.md §10b Rule 7).

---

## SLIDE 15 — Ask

**Headline:** We're here for two conversations.

### 🤝 Pilot client (Moldova real estate agencies)
- **30-day free pilot** Pro tier (€49/agent/month post-pilot)
- Onboarding assisted by Customer Success Lead
- Direct access to M1 roadmap backlog
- Target: **3 pilot agencies by Q3 2026**

### 💰 Investors (seed / pre-seed)
- **Investment ask: €{{XXXk}}** for M1 (Phase 0..C, 10 months)
- Use of funds: 60% dev (Backend + Frontend + Mobile) · 20% sales (Pilot + Brand) · 15% compliance (GDPR + DPIA + DPO) · 5% buffer
- Equity: {{X}}% · Pre-money: €{{YYY}}k
- Target: **€{{XXX}}k closed by Q3 2026**

**Footer CTA:** *Contact PM: {{email}} · Live demo: `demo.revyx.app` · Full deck: `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/`*

---

## SLIDE 16 — Thanks & Q&A

**Headline:** Thank you.

- Large REVYX logo
- Tagline: *Real Estate Execution Intelligence*
- **Live demo:** `demo.revyx.app`
- **Contact:** {{PM email}} · {{LinkedIn}} · {{phone RM}}
- Footer: *© 2026 REVYX · ITPRO SYSTEM SRL · CONFIDENTIAL*

---

## Cross-references

- `deck-ro.md` — canonical original (RO, with speaker notes)
- `deck-ru.md` — Russian translation
- `VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — companion video walkthrough

---

*docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-en.md · v1.0.0 · 2026-05 · CONFIDENTIAL · Internal Use*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
