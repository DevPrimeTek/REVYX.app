# `@revyx/web-preview` — M0.S1 → M0.S2 Clickable Prototype

> Direct-to-code preview app delivered in M0.S1, extended in M0.S2 with the four
> click-through user journeys (J1-J4). Tokens are sourced from
> `../../design/tokens.json` (single source of truth).

## Stage

- **Master Plan ref:** `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (M0.S1 + M0.S2)
- **Roadmap ref:** `docs/ROADMAP_REVYX_detailed-execution_v1.0.2.md` §3.1 T-M0.S1-05..08 + §3.2 T-M0.S2-01..05
- **Spec:** `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md`
- **Platform:** 🌐 Web only (DP-01); `/manager/escalations` enforces DP-05 admin-on-web rule.

## Quick start

```bash
# from repo root
cd apps/web-preview
npm install        # installs Next 14 + Tailwind 3.4 + lucide-react
npm run dev        # http://localhost:3000
```

Production build smoke test:

```bash
npm run build && npm start
```

## Folder map

```
apps/web-preview/
├── app/                              # Next.js 14 App Router
│   ├── layout.tsx                    # wraps children in <AppProviders>
│   ├── globals.css                   # Tailwind layers + CSS custom props
│   ├── page.tsx                      # Landing → /login
│   ├── login/page.tsx
│   ├── dashboard/page.tsx            # Agent home — NBA + queue + APS
│   ├── leads/page.tsx                # Lead queue
│   ├── leads/[id]/page.tsx           # ★ M0.S2 client — Assign modal + LS recompute (J1)
│   ├── properties/page.tsx
│   ├── properties/new/page.tsx       # ★ M0.S2 client — 8-field intake → match (J2)
│   ├── deals/page.tsx                # ★ M0.S2 client — click-to-advance + Won modal (J3)
│   ├── manager/page.tsx              # ★ M0.S2 link → escalation queue
│   ├── manager/escalations/page.tsx  # ★ M0.S2 client — bulk select + reassign (J4)
│   └── admin/page.tsx
├── components/
│   ├── providers.tsx                 # ★ M0.S2 client — <ToastProvider/>
│   ├── ui/
│   │   ├── button.tsx                # ★ M0.S2 — focus ring + active translate
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx                 # ★ M0.S2 — global toast queue (a11y live region)
│   │   └── score-badge.tsx
│   └── site-nav.tsx
├── lib/utils.ts                      # cn() helper, score formatting
├── tailwind.config.ts                # imports design/tokens.json
├── postcss.config.js
├── next.config.mjs
├── tsconfig.json                     # strict: true + typedRoutes
└── package.json
```

## User journeys (M0.S2)

| ID | Journey | Entry | Outcome |
|---|---|---|---|
| J1 | Lead intake → score → assign | `/leads` → `/leads/[id]` | Recompute LS (animated) → "Asignează agent" modal → toast + redirect `/dashboard` |
| J2 | Property creation → match | `/properties` → `/properties/new` | Submit 8-field form → toast (match suggestions) → redirect `/leads/L-0001` |
| J3 | Deal pipeline → close-won | `/deals` | Per-card ← / Avansează buttons; "Notariat" exposes "Close won" → confirm modal → Won column |
| J4 | Manager escalation override | `/manager` → `/manager/escalations` | Header / row checkboxes → "Bulk reassign" → modal → toast (audit-logged) |

Drag-and-drop on `/deals` is deferred to M0.S3 (T-M0.S3-10); the click-to-advance
buttons remain as the keyboard-accessible a11y fallback even after drag-drop ships.

## Brand business rules surfaced

| BR-XX | Surface |
|---|---|
| BR-01 Lead Firewall | `/leads` shows sub-0.60 leads in muted nurturing group |
| BR-02 `LS_initial = 0.30` | Score badge color codes cold/warm/qualified/hot |
| BR-03 Escalation Protocol 3 niveluri | `/manager` escalation table L1/L2/L3 chips |
| BR-04 Max 3 active tasks | `/dashboard` task slot indicator |
| BR-05 Re-matching `needs_review=true` | `/leads/[id]` amber banner (deal NOT auto-cancelled) |
| BR-10 `TF_default = 0.70` | Surfaced in `/deals` legend |
| BR-11 `APS_default = 0.65` | `/manager` APS leaderboard footnote |
| BR-12 Single session per agent | `/login` copy |

## Known gaps (will close in M0.S3)

- No persisted mock data — pages use inline placeholders (3-6 records each); 100/50/20 dataset lands in M0.S3 (T-M0.S3-04).
- No i18n yet (RO only); RU + EN strings load in M0.S3 (T-M0.S3-13).
- Deal kanban uses click-to-advance buttons; drag-drop with `@dnd-kit` lands in M0.S3 (T-M0.S3-10). Click-to-advance stays as the keyboard a11y fallback.
- Property detail (`/properties/[id]`), other manager sub-pages, admin sub-pages remain skeleton placeholders (M0.S3 T-M0.S3-09/11/12).
- All interactive state is in-memory only — refreshing a page resets the deal stages and reassign queue.
- Screenshots in `design/screenshots/` are NOT captured by this preview — capture them locally via `npm run dev` before M0.S3 deploy.

## Decision log (pending PM resolution)

See `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §10 (OD-01..OD-03):

1. **Font family** — brand-config.md (Bebas Neue + Montserrat + JetBrains Mono) vs Master Plan AC-M0-02 "font Inter". This preview ships brand-config fonts loaded via Google Fonts.
2. **Spacing grid** — 8px (brand-config) vs 4px (prompt). Preview uses 8px.
3. **Theme** — single dark theme; theme toggle deferred to M2+.
