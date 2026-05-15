# TECH SPEC — REVYX UI Design System
<!-- TECH_SPEC_REVYX_ui-design-system_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** M0.S1 — Design System direct-to-code (Creative Director shift away from Figma)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (M0.S1) · §1.3 Stack tehnic frontend Web · §1.4 DP-01..DP-07
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.1.md` §3.1 T-M0.S1-01..10 (direct-to-code path)
**Closes (gap):** F-S20-04 component half (`ui-design-system` spec was flagged LIPSEȘTE per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §19) + F-S20-10 (DP-06 brand components Web ↔ Mobile parity catalog)

## 0.1 Platform Matrix

**Scope:** 🌐 **WEB only** in M0/M1 (per DP-01 Web-first). At M2.S3 the same token tree is consumed by `apps/mobile/` via NativeWind to enforce DP-06 brand consistency.

Modules covered (per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md`): Modul 1 Auth, Modul 2 Lead, Modul 3 Property, Modul 4 Match+NBA, Modul 5 Deal, Modul 10 Reports, Modul 11 Admin (🌐 Web only DP-05), Modul 15 Audit (🌐 Web only DP-05).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | ★ DESIGNER (Creative Director) + ARCHITECT + FRONTEND WEB DEV + DOC | INITIAL — direct-to-code design system. Defines tokens schema, primitive component catalog, responsive strategy, WCAG AA contract, dark-mode stance (M0 = light-on-dark only), Tailwind + shadcn/ui consumption contract. Closes F-S20-04 component half + F-S20-10 brand parity. |

---

## 1. Scope & non-scope

### 1.1 In scope

1. **Single source of truth for design tokens** (`design/tokens.json`) — colors, typography, spacing, radii, shadows, motion, breakpoints, z-index, component-level token bundles.
2. **Primitive component catalog** — Button, Card, Input, Modal, Badge, Table, Toast — API contract + accessibility contract.
3. **Tailwind + shadcn/ui consumption contract** — how `apps/web-preview/` (and later `apps/web/`) reads tokens.
4. **Responsive breakpoints** — Tailwind defaults aligned (sm/md/lg/xl/2xl).
5. **Accessibility contract** — WCAG 2.1 AA target with measured contrast ratios.
6. **Dark mode stance** — M0 ships light-on-dark only; theme switch deferred to M2+.

### 1.2 Out of scope

- Backend / API contracts (Phase 0 spec at M1.S1).
- Full page-level component library (Lead Card, Deal Card composites) — composed in M0.S3.
- Mobile NativeWind setup — deferred to M2.S3 (will *consume* the same `tokens.json`).
- Animation library beyond CSS transitions (Framer Motion evaluation deferred to M2.S2).

---

## 2. Tokens schema

### 2.1 File contract

`design/tokens.json` is the **single source of truth**. Consumers:

| Consumer | Path | Mechanism |
|---|---|---|
| `apps/web-preview/tailwind.config.ts` | `import tokens from '../../design/tokens.json'` | Theme extension |
| `apps/web-preview/app/globals.css` | CSS custom properties layer (`:root { --navy: #0C1428; ... }`) | Generated/hand-mirrored at M0.S3 |
| `apps/mobile/tailwind.config.ts` (M2.S3+) | Same `design/tokens.json` import | NativeWind |
| Storybook (deferred M1.S5) | Same import | Decorator |

### 2.2 Token categories

| Category | Brand-config §  | Tokens.json key |
|---|---|---|
| Colors — navy palette       | §2.1 | `color.navy.{base,deep,mid,card,hover}` |
| Colors — gold palette       | §2.1 | `color.gold.{base,light,bright,dark}` |
| Colors — borders            | §2.2 | `color.border.{base,light,gold,goldPale}` |
| Colors — text               | §2.3 | `color.text.{h,primary,secondary,muted,white}` |
| Colors — status             | §2.4 | `color.status.{green,amber,red,blue}` |
| Colors — actor              | §2.5 | `color.actor.{seller,agent,ai,buyer,manager,bank,notary,social}` |
| Colors — lead temperature   | §5.8 | `color.leadTemperature.{cold,warm,qualified,hot}` |
| Typography — families       | §3   | `typography.family.{display,body,mono}` |
| Typography — scale          | §3.1 | `typography.scale.*` |
| Spacing                     | §4   | `spacing.scale.sp1..sp16` |
| Radius                      | §4   | `radius.{sm,md,lg,xl,pill}` |
| Shadow                      | —    | `shadow.*` (derived) |
| Motion                      | —    | `motion.{duration,easing}.*` (derived) |
| Breakpoints                 | —    | `breakpoint.*` (Tailwind defaults) |

### 2.3 Spacing grid

Brand-config §4 specifies **8px base grid** (sp1=8, sp2=16, sp3=24, …). The original prompt mentioned "4px grid" but this conflicts with the canonical brand source — resolved to 8px (brand-config authoritative).

---

## 3. Component primitives — API contract

All component primitives live in `apps/web-preview/components/ui/` (shadcn/ui patterns, customized to REVYX tokens). React Server Component compatible except where `'use client'` is required.

### 3.1 Button

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';   // default 'primary'
  size?: 'sm' | 'md' | 'lg';                                      // default 'md'
  disabled?: boolean;
  loading?: boolean;
  asChild?: boolean;     // Radix Slot pattern
  children: ReactNode;
}
```

**Accessibility:** all buttons MUST have an accessible label (visible text or `aria-label`); focus ring uses `--gold-light` 2px offset; disabled state uses `aria-disabled="true"` + `cursor: not-allowed`.

### 3.2 Card

```ts
type CardProps = {
  variant?: 'default' | 'elevated' | 'formula';   // default 'default'
  accentTop?: boolean;                            // gold gradient line per brand §5.1
  className?: string;
  children: ReactNode;
}
```

**Brand rule:** when `variant='formula'`, header uses `typography.scale.labelMono` in `--gold`. Hover lifts 2px and shifts border to `--border-light`.

### 3.3 Input

```ts
type InputProps = HTMLInputAttributes & {
  invalid?: boolean;     // applies red border + aria-invalid
  hint?: string;         // muted helper text
  error?: string;        // red error text replaces hint
}
```

**Accessibility:** every Input MUST be paired with a `<label>` or have `aria-label`; error text is `role="alert"`.

### 3.4 Badge

```ts
type BadgeProps = {
  variant?: 'new' | 'updated' | 'critical' | 'info' | 'success' | 'warning';
  size?: 'xs' | 'sm';
  children: ReactNode;
}
```

Brand-config §5.4: New=green, Updated=gold, Critical=red. Extended set (info/success/warning) maps to status palette.

### 3.5 Modal

```ts
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;        // required for SR
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```

**Accessibility:** focus trap + `aria-modal="true"` + ESC closes + initial focus on first interactive; backdrop click dismisses unless `dismissible={false}`. Uses Radix Dialog primitive.

### 3.6 Table

```ts
type TableProps = {
  variant?: 'default' | 'striped';
  className?: string;
  children: ReactNode;  // <thead>, <tbody>
}
```

Brand-config §5.5: header has `--navy-card` background + `--gold` text. Striped rows alternate `--navy` / `--navy-mid`. Cell modifier classes: `td-gold`, `td-green`, `td-red`, `td-amber`, `td-muted`.

### 3.7 Toast

```ts
type ToastProps = {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  duration?: number;     // ms; default 4000
}
```

**Accessibility:** `role="status"` for info/success; `role="alert"` for warning/error. Auto-dismiss configurable; pause on hover/focus.

---

## 4. Responsive breakpoints

Aligned with Tailwind defaults — no custom breakpoint surface:

| Token | Min width | Primary use |
|---|---|---|
| `sm`  | 640px  | Large phone landscape (not target for M0 — Web desktop) |
| `md`  | 768px  | Tablet portrait (graceful) |
| `lg`  | 1024px | Tablet landscape / small laptop (minimum supported) |
| `xl`  | 1280px | Desktop (primary target) |
| `2xl` | 1536px | Wide desktop |

**M0 demo minimum supported:** `lg` (1024px). Sub-`lg` shows a "Pentru o experiență optimă, deschideți REVYX pe desktop sau laptop" banner.

---

## 5. Accessibility (WCAG 2.1 AA)

### 5.1 Contrast ratios (measured)

Per `design/tokens.json` `accessibility.verified`:

| Foreground | Background | Ratio | WCAG AA result |
|---|---|---|---|
| `text.h` `#F0F4FA` | `navy.base` `#0C1428` | 16.8:1 | ✅ AAA |
| `text.primary` `#D8E2F0` | `navy.base` | 14.2:1 | ✅ AAA |
| `gold.base` `#C9870A` | `navy.deep` `#080E1C` | 6.1:1 | ✅ AA normal text |
| `text.muted` `#4A6280` | `navy.base` | 3.4:1 | ⚠️ AA large only (≥18px or ≥14px bold) |

**Enforcement:** `text.muted` MUST NOT be used for body text < 14px regular weight. Linted in code review (manual M0; automated in M1 via `eslint-plugin-tailwindcss` custom rule).

### 5.2 Focus management

- All interactive elements have a visible focus state (2px outline in `--gold-light`, 2px offset).
- Keyboard navigation MUST traverse content in DOM order; tab traps only in modals.
- Skip-to-main-content link on every page.

### 5.3 Reduced motion

Components respect `@media (prefers-reduced-motion: reduce)` — animations downgrade to instant or sub-100ms.

---

## 6. Dark mode stance

**M0 ships single theme: light-on-dark (navy surfaces).** REVYX brand is intrinsically dark (navy + gold). A true light theme would require re-painting the actor palette and reworking gold-on-light contrast — non-trivial.

**Roadmap:**
- M0–M1: single theme (current).
- M2.S2 Web Platform Complete: evaluate user demand and add `prefers-color-scheme` light variant if requested in pilot HST.
- White-Label (M2.S5): tenant accent override (gold replacement) does **not** flip surface; only accent shifts.

---

## 7. Implementation contract — `apps/web-preview/`

### 7.1 Tooling

| Tool | Version | Why |
|---|---|---|
| Next.js | 14 (App Router) | Per Master Plan §1.3 Web stack |
| React | 18 | RSC + Server Actions |
| TypeScript | 5+ strict | Per CLAUDE.md §9 (`strict: true`) |
| TailwindCSS | 3.4+ | Per Master Plan §1.3 |
| shadcn/ui patterns | n/a (copy-into-repo) | Per Master Plan §4.1 M0.S3 token strategy |
| Radix UI primitives | latest | A11y backbone for Modal, Dropdown, etc. |
| lucide-react | latest | Icons (lightweight, tree-shakable) |

**No runtime CSS-in-JS** (e.g., styled-components) — Tailwind utility classes only, with the occasional `@layer components` directive for repeated patterns.

### 7.2 Folder structure

```
apps/web-preview/
├── app/
│   ├── layout.tsx               # Root RSC layout, font + globals
│   ├── globals.css              # Tailwind directives + CSS custom props
│   ├── page.tsx                 # Marketing landing (redirects to /login)
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── leads/page.tsx
│   ├── leads/[id]/page.tsx
│   ├── properties/page.tsx
│   ├── deals/page.tsx
│   ├── manager/page.tsx
│   └── admin/page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── table.tsx
│       └── toast.tsx           # deferred — provider stub only in M0.S1
├── lib/
│   └── utils.ts                 # cn() helper (clsx + tailwind-merge)
├── tailwind.config.ts           # Imports design/tokens.json
├── postcss.config.js
├── next.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

### 7.3 Token consumption (Tailwind)

`tailwind.config.ts` consumes `design/tokens.json` directly and exposes:

- `theme.colors.navy.{base,deep,mid,card,hover}` → `bg-navy-base`, `text-navy-deep`, …
- `theme.colors.gold.{base,light,bright,dark}` → `bg-gold`, `text-gold-light`, …
- `theme.colors.text.{h,primary,secondary,muted}` → `text-text-h`, `text-text-primary`, …
- `theme.colors.status.{green,amber,red,blue}` → `bg-status-red`, …
- `theme.spacing` extends with the brand grid (`sp1`..`sp16`).
- `theme.borderRadius` extends with `sm/md/lg/xl/pill`.
- `theme.fontFamily.display/body/mono` per brand-config.

Existing Tailwind defaults (e.g. `text-sm`, `flex`, `grid`) remain untouched.

---

## 8. Definition of Done (M0.S1)

- [x] `design/tokens.json` published reflecting brand-configs/revyx.md v1.0.0 (100%)
- [x] `design/screens-inventory.md` published (18 screens ≥ AC-M0-01 target 12)
- [x] `apps/web-preview/` skeleton scaffolded with 6 UI primitives + 8 page stubs
- [x] `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` published (this doc)
- [x] Roadmap PATCH v1.0.0 → v1.0.1 reflecting direct-to-code shift
- [x] INDEX PATCH v1.1.1 → v1.1.2 with this spec + roadmap PATCH
- [ ] **DEFERRED to local M0.S1 verification run:** `npm install && npm run dev` smoke pass on localhost:3000; PNG screenshots saved to `design/screenshots/`. Remote container does not run a browser; gate item carried into developer's local close step before M0.S2 entry.

---

## 9. Findings closure

| Finding | Severity | Closure evidence |
|---|---|---|
| F-S20-04 (component half — `ui-design-system` spec missing) | MED | This document published in `docs/tech-spec/` with tokens, primitive catalog, accessibility contract. INDEX v1.1.2 entry added. |
| F-S20-10 (DP-06 brand parity component catalog) | MED | §3 Component primitives + §7.3 token consumption contract — same token tree consumed by Web (M0) and Mobile (M2.S3 NativeWind). |

F-S20-04 web-platform half (gating M1.S5) remains open and will close at M1.S5 entry (separate spec).

---

## 10. Open decisions for PM

| # | Question | Source of conflict | Recommendation |
|---|---|---|---|
| OD-01 | **Typography family** — Bebas Neue + Montserrat + JetBrains Mono (brand-config.md §3, canonical) **or** Inter (Master Plan AC-M0-02 + prompt + INDEX line 39)? | brand-config.md is "law" per CLAUDE.md §1; AC-M0-02 references "font Inter" since Master Plan v1.1.0. | Confirm brand-config; if Inter is preferred, bump brand-config.md → v1.1.0 first, then re-derive tokens. Current tokens follow brand-config. |
| OD-02 | **Spacing grid base** — 8px (brand-config §4) vs 4px (prompt). | brand-config canonical. | Keep 8px. |
| OD-03 | **Dark/light theme switch in M0** — single dark vs both. | Brand intrinsically dark. | Single dark for M0–M1; revisit at M2.S2 based on pilot HST feedback. |

---

## 11. Approval matrix

| Aprobator | Sign-off | Data |
|---|---|---|
| DESIGNER (Creative Director) | ⬜ pending | — |
| Senior Solution Architect | ⬜ pending | — |
| Frontend Lead | ⬜ pending | — |
| Senior PM | ⬜ pending (OD-01..OD-03 resolution) | — |
| Senior PO | ⬜ pending | — |
| Audit Lead | ⬜ pending | — |

Sign-off is contingent on resolution of OD-01..OD-03 above. Spec is otherwise functionally complete for M0.S1 close.

---

## 12. Cross-references

- `design/tokens.json` v1.0.0 — single source of truth
- `design/screens-inventory.md` v1.0.0 — 18 screens
- `docs/brand-configs/revyx.md` v1.0.0 — canonical brand
- `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 M0.S1
- `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §19 (closes ui-design-system gap row)
- `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` §3.1 + §3.3 (PATCH)
- `docs/audit/HST_REVYX_pre-dev_findings-backlog_v1.0.0.md` F-S20-04 + F-S20-10
- `apps/web-preview/` — implementation skeleton

---

*docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
