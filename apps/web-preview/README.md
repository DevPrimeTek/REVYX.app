# `@revyx/web-preview` — M0.S1 Design System Preview

> Direct-to-code preview app delivered in M0.S1 in place of a Figma-only design system.
> Tokens are sourced from `../../design/tokens.json` (single source of truth).

## Stage

- **Master Plan ref:** `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (M0.S1)
- **Roadmap ref:** `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` §3.1 T-M0.S1-05..08
- **Spec:** `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md`
- **Platform:** 🌐 Web only (DP-01)

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
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx
│   ├── globals.css           # Tailwind layers + CSS custom props
│   ├── page.tsx              # Landing → /login
│   ├── login/page.tsx
│   ├── dashboard/page.tsx    # Agent home — NBA + queue + APS
│   ├── leads/page.tsx        # Lead queue
│   ├── leads/[id]/page.tsx   # Lead detail + match suggestions
│   ├── properties/page.tsx
│   ├── deals/page.tsx        # Kanban (drag-drop deferred to M0.S3)
│   ├── manager/page.tsx
│   └── admin/page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── table.tsx
│   │   └── score-badge.tsx
│   └── site-nav.tsx
├── lib/utils.ts              # cn() helper, score formatting
├── tailwind.config.ts        # imports design/tokens.json
├── postcss.config.js
├── next.config.mjs
├── tsconfig.json             # strict: true
└── package.json
```

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

- No persisted mock data — pages use inline placeholders (3-6 records each).
- No i18n yet (RO only); RU + EN strings load in M0.S3 (T-M0.S3-13).
- Deal kanban is static; drag-drop deferred to M0.S3 (T-M0.S3-10).
- Property detail (`/properties/[id]`), manager sub-pages, admin sub-pages are skeleton placeholders.
- Screenshots in `design/screenshots/` are NOT captured by this preview — capture them locally via `npm run dev` before M0.S1 exit gate close.

## Decision log (pending PM resolution)

See `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §10 (OD-01..OD-03):

1. **Font family** — brand-config.md (Bebas Neue + Montserrat + JetBrains Mono) vs Master Plan AC-M0-02 "font Inter". This preview ships brand-config fonts loaded via Google Fonts.
2. **Spacing grid** — 8px (brand-config) vs 4px (prompt). Preview uses 8px.
3. **Theme** — single dark theme; theme toggle deferred to M2+.
