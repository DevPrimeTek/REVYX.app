# `@revyx/web` — M0 Web Static Demo

> Static demo app (Next.js 14, mock-data only, no backend) deployed to Vercel as the
> public M0 prezentare. Promoted from `apps/web-preview/` at M0.S3 T-M0.S3-01.
> Tokens are sourced from `../../design/tokens.json` (single source of truth).

## Stage

- **Master Plan ref:** `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (M0.S1 + M0.S2 + M0.S3)
- **Roadmap ref:** `docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md` §3.3 T-M0.S3-01..14
- **Spec:** `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md`
- **Runbook:** `docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.2.md`
- **Platform:** 🌐 Web only (DP-01); `/manager/*` + `/admin` enforce DP-05 admin-on-web rule.

## Quick start

```bash
# from repo root
cd apps/web
npm install        # installs Next 14 + Tailwind 3.4 + @dnd-kit + lucide-react
npm run dev        # http://localhost:3000
```

Production build smoke test:

```bash
npm run build && npm start
```

## Routes (15)

| Route | Type | Purpose |
|---|---|---|
| `/` | static | Landing → `/login` |
| `/login` | static | Demo splash + entry |
| `/dashboard` | static | Agent home — NBA + queue + APS |
| `/leads` | static | Lead queue (100 records, mock) |
| `/leads/[id]` | client | J1 Assign modal + LS recompute |
| `/properties` | static | Portfolio (50 records, mock) |
| `/properties/new` | client | J2 8-field intake → match |
| `/deals` | client | J3 Kanban — **@dnd-kit drag-drop** + click fallback |
| `/manager` | static | Manager dashboard (escalation summary + APS leaderboard) |
| `/manager/escalations` | client | J4 Bulk reassign modal |
| `/admin` | static | RBAC view stub + tenants overview |
| `/settings` | static | ★ M0.S3 — Tenant + locale + notifications config |
| `/profile` | static | ★ M0.S3 — Agent profile + APS history |
| `/notifications` | static | ★ M0.S3 — Notification feed |

## Folder map

```
apps/web/
├── app/                              # Next.js 14 App Router
│   ├── layout.tsx                    # wraps children in <AppProviders>
│   ├── globals.css
│   └── …pages above…
├── components/
│   ├── providers.tsx                 # <I18nProvider/> + <ToastProvider/>
│   ├── site-nav.tsx                  # ★ M0.S3 — language switcher RO/RU/EN
│   ├── i18n/                         # ★ M0.S3 — provider + useT() hook
│   ├── deals/                        # ★ M0.S3 — @dnd-kit kanban board
│   └── ui/                           # button, card, input, modal, table, toast, badge, score-badge
├── lib/
│   ├── utils.ts                      # cn(), formatScore()
│   └── mock/                         # ★ M0.S3 — leads.ts (100), properties.ts (50), deals.ts (20), agents.ts
├── messages/                         # ★ M0.S3 — ro.json + ru.json + en.json (i18n catalog)
├── tailwind.config.ts                # imports design/tokens.json
└── … config files
```

## User journeys (M0.S2 + M0.S3 extension)

| ID | Journey | Stage | Notes |
|---|---|---|---|
| J1 | Lead intake → score → assign | M0.S2 ☑ | Animated LS recompute + assign modal + audit toast |
| J2 | Property creation → match | M0.S2 ☑ | 8-field form → match suggestions toast |
| J3 | Deal pipeline → close-won | M0.S3 ★ | **@dnd-kit drag-drop** between stages + click-to-advance a11y fallback + Won modal |
| J4 | Manager escalation override | M0.S2 ☑ | Bulk select → reassign modal → audit toast |

## i18n (M0.S3 ★ new)

- Three locales: **RO** (default) · **RU** · **EN**
- Strings catalogued in `messages/{ro,ru,en}.json`
- Provider: `components/i18n/provider.tsx` (React context, persisted to `localStorage` key `revyx.locale`)
- Hook: `useT()` returns `t(key)` + current locale + `setLocale()`
- Language switcher rendered in `<SiteNav>` (top-right, gold-accent dropdown)
- Note: client-side switcher (no /[locale]/ route segments) to keep all 15 pages prerendered statically for the demo.

## Brand business rules surfaced

| BR-XX | Surface |
|---|---|
| BR-01 Lead Firewall | `/leads` filters sub-0.60 into muted nurturing group |
| BR-02 `LS_initial = 0.30` | Score badge color codes cold/warm/qualified/hot |
| BR-03 Escalation Protocol 3 niveluri | `/manager/escalations` L1/L2/L3 chips |
| BR-04 Max 3 active tasks | `/dashboard` task slot indicator + `/profile` |
| BR-05 Re-matching `needs_review=true` | `/leads/[id]` amber banner |
| BR-10 `TF_default = 0.70` | `/deals` legend |
| BR-11 `APS_default = 0.65` | `/manager` leaderboard + `/profile` |
| BR-12 Single session per agent | `/login` + `/settings` |

## Decision log (pending PM resolution)

See `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §10 (OD-01..OD-03):

1. **Font family** — brand-config.md (Bebas Neue + Montserrat + JetBrains Mono) vs AC-M0-02 "Inter". Demo ships brand-config fonts.
2. **Spacing grid** — 8px (brand-config) vs 4px (prompt). Demo uses 8px.
3. **Theme** — single dark theme; theme toggle deferred to M2+.
