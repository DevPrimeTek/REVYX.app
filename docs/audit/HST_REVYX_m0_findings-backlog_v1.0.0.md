# HST M0 — Findings Backlog (Detailed)
<!-- HST_REVYX_m0_findings-backlog_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M0.S5 — Hard Stress Test M0 ⚠️ GATE. Companion la `HST_REVYX_m0_v1.0.0.md` cu detalii pentru fiecare finding F-M0S5-XX: repro steps + fix proposal + verification + cross-ref. Output T-M0.S5-02 atomic task.

**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 M0.S5.
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.4.md` §3.5 T-M0.S5-02.

## 0.1 Platform Matrix

WEB only (`apps/web-preview/`). Mobile companion N/A scope M0 per Master Plan §4.2.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| **1.0.0** | **2026-05** | Audit Lead + Senior Architect + DESIGNER (Creative Director) + DOC | ★ Initial — 17 findings F-M0S5-01..17 cu repro steps + fix proposal + verification. 2 HIGH FIXED acest PR (F-M0S5-01 + F-M0S5-02). 6 MED + 9 LOW tracked în backlog cu owner+ETA. Cross-ref `HST_REVYX_m0_v1.0.0.md` §3 findings register consolidat. |

---

## 1. Findings detailed

### F-M0S5-01 — Card componentă cu hover translate global ★ HIGH ✅ FIXED

**Severitate:** HIGH (per CLAUDE.md §10b Regula 12 violation explicit + cu impact 7 pagini)
**Categorie HST:** §2.7 Regula 12 disciplina interacțiunilor
**Owner:** FRONTEND WEB DEV + DESIGNER (Creative Director)
**Status:** ✅ FIXED acest PR

**Repro steps (pre-fix):**
1. `cd apps/web-preview && npm run dev`
2. Navighează `/dashboard`
3. Hover pe oricare din cele 3 NBA cards (NBA · 01, NBA · 02, NBA · 03) — observă translate-up + border lighten effect, deși cards sunt pur read-only
4. Hover pe "Queue today" outer Card — același effect, deși outer container nu este clickabil (children Links sunt)
5. Hover pe "My scores" Card — același effect, deși este display stats pur

**Cauză:**
`apps/web-preview/components/ui/card.tsx:19` aplica `hover:-translate-y-0.5 hover:border-border-light` în className-ul de bază al `<Card>`, indiferent de prop-uri sau context interactiv.

**Fix aplicat:**

```diff
 export type CardProps = HTMLAttributes<HTMLDivElement> & {
   variant?: 'default' | 'elevated' | 'formula';
   accentTop?: boolean;
+  interactive?: boolean;
 };

 export const Card = forwardRef<HTMLDivElement, CardProps>(
-  ({ className, variant = 'default', accentTop, children, ...rest }, ref) => (
+  ({ className, variant = 'default', accentTop, interactive = false, children, ...rest }, ref) => (
     <div
       ref={ref}
       className={cn(
         'rounded-lg border transition-all duration-fast ease-standard',
         variant === 'default' && 'bg-navy-mid border-border',
         variant === 'elevated' && 'bg-navy-card border-border shadow-md',
         variant === 'formula' && 'bg-navy-card border-border shadow-md',
         accentTop && 'card-accent-top',
-        'hover:-translate-y-0.5 hover:border-border-light',
+        interactive && 'cursor-pointer hover:-translate-y-0.5 hover:border-border-light',
         className
       )}
```

**Backward compatibility:** Default `interactive=false` → toate Card instanțele existente devin static fără modificarea call-site-urilor (zero migration needed pentru M0). Call-site-uri viitoare care WRAP Card într-un Link sau onClick handler pot explicit opt-in cu `<Card interactive>`.

**Verification:**
- `npm run typecheck` PASS
- `npm run build` PASS (15 routes identic)
- Hover manual smoke pe `/dashboard` post-fix: 3 NBA cards + "Queue today" + "My scores" → niciun hover effect (static) ✅
- Verificare `/leads/[id]` "Top 3 match" rows: hover styling rămâne (acel pattern folosește div cu `hover:` direct, NU Card component — vezi F-M0S5-12 separate)

**Cross-ref:** `docs/brand-configs/revyx.md` §5.1 cards hover baseline (specifies hover doar pentru clickable cards) + `design/tokens.json` motion/cursor patterns + CLAUDE.md §10b Regula 12 explicit example.

---

### F-M0S5-02 — Anglicisme critice RO + RU în messages ★ HIGH ✅ FIXED

**Severitate:** HIGH (per CLAUDE.md §10b Regula 11 violation cu impact ~44 keys cumulative)
**Categorie HST:** §2.6 Regula 11 puritate i18n
**Owner:** DOC + FRONTEND WEB DEV
**Status:** ✅ FIXED acest PR

**Repro steps (pre-fix):**
1. `grep -i -E '\b(dashboard|queue|deal|match|filter|settings|notifications|login|logout)\b' apps/web-preview/messages/ro.json` → 30 hits
2. Same pattern pe `ru.json` → 14 hits
3. Examples:
   - `nav.dashboard`: "Dashboard" (RO) / "Панель" (RU truncated)
   - `nav.signOut`: "Sign out" (RO)
   - `lead.queueTitle`: "Queue lead-uri" (RO)
   - `leadDetail.matchNeedsReview`: "Match needs review" (RO + RU identical)
   - `deal.stages.discovery`: "Discovery" / `deal.stages.won`: "Won" (both RO + RU)
   - `deal.healthy/review/risk`: "healthy/review/risk" (both RO + RU)
   - `property.fresh/aging/stale`: "Fresh/Aging/Stale" (both RO + RU)
   - `manager.title`: "Dashboard Manager" (RO) / "Дашборд менеджера" (RU)

**Fix aplicat:** 30 keys RO retraduse + 14 keys RU retraduse (vezi tabel HST §2.6.1 + §2.6.2 pentru lista completă cu valori before/after).

**Excepții acceptate per Regula 11 (NU s-au atins):**
- "lead-uri" / "Lead Score" / "Lead Firewall" / "Property Score" / "Listing Freshness" / "Trust Score" — unitate semantică spec
- "WhatsApp" / "GDPR" / "RBAC" / "SLA" / "BR-XX" / "LS" / "PS" / "IS" / "DP" / "NBA" / "DHI" / "APS" / "TF" / "TS" / "UF" / "RF" / "HOT" / "audit-log" — acronime tehnice
- "Manager" / "Admin" — împrumut consacrat business RM
- "лид" (RU) — împrumut consacrat
- "override" — termen business cross-locale
- "demo" — domain marketing
- "stages" în propoziție lungă (deal.subtitle RO) — F-M0S5-06 LOW tracked separat

**Verification:**
- `npm run typecheck` PASS
- `npm run build` PASS
- `grep -i 'dashboard\|sign out\|queue lead\|match needs\|^.*Won' messages/ro.json` post-fix → 0 hits anglicisme (excluding "Won ✓" reference fix → "Câștigat ✓" applied)
- Manual smoke `/dashboard` cu locale=RO: header "Panou de bord" în nav, greeting + queue today + my scores toate retraduse
- Manual smoke `/dashboard` cu locale=RU: header "Панель управления" în nav
- Manual smoke `/deals` RO: stages "Descoperire/Calificat/Ofertă/Negociere/Notariat/Câștigat" + status badges retraduse
- Manual smoke `/leads/[id]` RO: "Primele 3 potriviri" + breadcrumb "Listă" + recompute toast "recalculez…"

**Cross-ref:** CLAUDE.md §10b Regula 11 + OD-i18n-01 (glosar scoring AOS) pending PM tracked F-M0S5-11 separately.

---

### F-M0S5-03 — `/properties` click row noop ⚠️ MED

**Severitate:** MED
**Categorie HST:** §2.1 UX flow
**Owner:** FRONTEND WEB DEV
**Status:** Tracked M1.S5

**Repro steps:**
1. Navighează `/properties`
2. Hover pe oricare property card — vezi (post-fix F-M0S5-01) că NU are hover effect (Card static)
3. Click pe property card — nu se întâmplă nimic (noop)

**Inconsistency observed:**
- `/leads` row → click → `/leads/[id]` (interactive)
- `/properties` row → click → noop (read-only)

**Fix propus:**
- Opțiune A (preferată M1.S5): Introdus `/properties/[id]` page MVP (read-only details) + wrap property card în `<Link href="/properties/[id]">` + folosește `<Card interactive>` per F-M0S5-01 pattern
- Opțiune B (M0 patch): Adaugă `cursor: not-allowed` + aria-disabled pe property cards pentru a semnaliza visual non-interactivity

**Decizie:** Opțiune A la M1.S5 (paritate cu `/leads` UX expected).

**Cross-ref:** Cross-link cu F-M0S5-12 (lead detail Top 3 match rows hover styling fără onClick — același pattern problem).

---

### F-M0S5-04 — `/leads` filter chips focus-ring subtle ⚠️ MED

**Severitate:** MED (a11y keyboard navigation)
**Categorie HST:** §2.1 UX flow
**Owner:** FRONTEND WEB DEV + DESIGNER
**Status:** Tracked M1.S5 entry

**Repro steps:**
1. Navighează `/leads`
2. Tab keyboard până la filter chips ("Toate", "HOT", "calificat", "warm", "nurturing")
3. Observă: focus-ring vizual subtle (border culoare schimbată) — dificil de detectat pe ecran luminos

**Fix propus:**
```diff
- 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
+ 'text-text-secondary hover:bg-navy-hover hover:text-text-h focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none'
```

Aplicabil la filter chips din `app/leads/page.tsx:77` + similar pattern în `app/properties/page.tsx:71` + `app/settings/page.tsx:57,86`.

**Cross-ref:** WCAG 2.1 SC 2.4.7 Focus Visible. Brand-config `revyx.md` accent color (#C9A24A gold) ca ring.

---

### F-M0S5-05 — `/dashboard` greeting hardcoded ⚠️ LOW

**Severitate:** LOW (acceptat M0 demo static; M1.S2+ real auth context)
**Categorie HST:** §2.1 UX flow
**Owner:** FRONTEND WEB DEV
**Status:** Tracked M1.S2

**Repro steps:**
1. Navighează `/dashboard`
2. Observă greeting "Bună dimineața, Andrei" hardcoded indiferent de ora curentă

**Fix propus (M1.S2 real auth context):**
- Înlocuiește hardcoded "Bună dimineața, Andrei" cu `t('dashboard.greeting', { name: user.firstName, period: getTimeOfDayLabel() })`
- Adaugă cheie `dashboard.greeting`: "Bună {period}, {name}" + sub-cheie `dashboard.greetingPeriod.morning/afternoon/evening` localizat RO/RU/EN
- Logic `getTimeOfDayLabel()` în `lib/timeUtils.ts`: morning <12, afternoon 12-18, evening >18

**Cross-ref:** Real auth context M1.S1 Phase 0 Security Foundation entry.

---

### F-M0S5-06 — Deal subtitle RO "6 stages" reziduu anglicism ⚠️ LOW

**Severitate:** LOW (residue post-Regula 11 fix; pattern în propoziție lungă neuturalizat)
**Categorie HST:** §2.2 Brand compliance + §2.6 Regula 11
**Owner:** DOC + DESIGNER
**Status:** Tracked M1.S5 entry copy pass

**Repro steps:**
1. Navighează `/deals` cu locale=RO
2. Observă subtitle: "6 stages · DP (Deal Probability) și DHI (Deal Health Index) sub fiecare card..."

**Fix propus:**
```diff
- "subtitle": "6 stages · DP (Deal Probability) și DHI (Deal Health Index) sub fiecare card. Drag-drop activ — ține apăsat și mută cardul între coloane. Butoanele ← / → rămân ca a11y fallback."
+ "subtitle": "6 etape · DP (Deal Probability) și DHI (Deal Health Index) sub fiecare card. Drag-drop activ — ține apăsat și mută cardul între coloane. Butoanele ← / → rămân ca alternativă accesibilă."
```

(Same pattern aplicabil RU `subtitle` "6 стадий" — deja corect.)

**Cross-ref:** Acest finding este un residue al F-M0S5-02 fix (focus pe keys atomice + status enums, NU pe propoziții lungi de subtitle). Copy pass M1.S5 va acoperi propozițiile descriptive.

---

### F-M0S5-07 — Slide 15 "Ask" cifră invest placeholder ⚠️ MED

**Severitate:** MED (blocking PDF export T-M0.S4-08)
**Categorie HST:** §2.3 Presentation rehearsal
**Owner:** PM (Senior PM)
**Status:** OD-M0.S4-01 pending PM input — post-M0.S5

**Repro steps:**
1. Deschide `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ro.md`
2. Scroll la Slide 15 — vezi placeholder `<XXX>` în cifra invest (€XXXK seed → milestone X)

**Fix propus:** PM rezolvă OD-M0.S4-01 cu cifră investment ask finală + valuation hint. Update applicate în:
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ro.md` Slide 15
- `deck-ru.md` Slide 15
- `deck-en.md` Slide 15
- `assets/SCREENSHOT_REFS.md` (dacă slide 15 are screenshot specific)

**Cross-ref:** CLAUDE.md §0a Open decisions row OD-M0.S4-01..04 + T-M0.S4-08 PDF export blocking.

---

### F-M0S5-08 — Slide 14 "Tracțiune" metrici pre-presentation refresh ⚠️ LOW

**Severitate:** LOW (data freshness; cosmetic)
**Categorie HST:** §2.3 Presentation rehearsal
**Owner:** PM + DOC
**Status:** Pre-presentation refresh

**Repro steps:**
1. Deschide `deck-ro.md` Slide 14
2. Vezi metrici hardcoded: "X agenții discovery interview", "Y LOI semnate", "Z agenții pilot M1"

**Fix propus:** Pre-fiecare presentation event, DOC + PM refresh metrici cu cifre actuale (interview count + LOI count + pilot signup count). Recomandare introducere mențiune "snapshot la {data}" în Slide 14 footer ca disclaimer freshness.

**Cross-ref:** Marketing operations pre-event checklist (M1.S6+ ownership).

---

### F-M0S5-09 — Slide 11 "Securitate+GDPR" puncte distincte ⚠️ LOW

**Severitate:** LOW (copy enhancement)
**Categorie HST:** §2.4 Message clarity
**Owner:** DOC + Senior PM
**Status:** Pre-presentation copy enhancement

**Repro steps:**
1. Deschide `deck-ro.md` Slide 11
2. Vezi enumerare Art. 5/6/15-22/32 GDPR cu icon-uri scurte

**Fix propus:**
Adăugare 1 punct explicit "Single session per agent (BR-12) — auto-revocation la password change" pentru a evidenția un feature distinct vs CRM clasic (audience investor înțelege rezistența la account sharing).

**Cross-ref:** BRD v1.1.0 §9.1 BR-12 + Brand-configs §2 ton "executiv".

---

### F-M0S5-10 — Lint warning `no-page-custom-font` ⚠️ LOW

**Severitate:** LOW (pre-existing; zero impact runtime)
**Categorie HST:** §2.5 Demo robustness
**Owner:** FRONTEND WEB DEV
**Status:** Tracked M1.S5

**Repro steps:**
```
cd apps/web-preview && npm run lint
```
Output:
```
./app/layout.tsx
24:9  Warning: Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font  @next/next/no-page-custom-font
```

**Fix propus (M1.S5):**
Migrare la `next/font/google` pentru Bebas Neue + Montserrat + JetBrains Mono. Beneficii:
- CLS improvement (font preload optimizat)
- Eliminate render-blocking `<link>` external request
- Self-host Google Fonts (privacy enhancement EU)

Pattern Next.js 14:
```tsx
import { Bebas_Neue, Montserrat, JetBrains_Mono } from 'next/font/google';
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display' });
// ...
<html className={`${bebas.variable} ${mont.variable} ${jet.variable}`}>
```

**Cross-ref:** Next.js docs — `next/font` migration.

---

### F-M0S5-11 — OD-i18n-01 glosar scoring AOS pending PM ⚠️ LOW

**Severitate:** LOW (Open Decision)
**Categorie HST:** §2.6 Regula 11
**Owner:** PM
**Status:** Open decision tracking

**Repro steps:** N/A (decision, not implementation issue)

**Open question:** Pentru locale RO/RU, ce form prezentăm utilizatorului pentru acronime scoring:
- Opțiune A: păstrare EN abreviat (LS, PS, IS, DP, NBA, DHI, APS) ca acronime tehnice consacrate — comportament curent
- Opțiune B: translation RO ("Scor Lead" / "Scor Proprietate" / "Următoarea Acțiune") cu acronim între paranteze
- Opțiune C: hybrid — translation în text long-form, păstrare acronim EN în badges/inline display

**Recomandare DESIGNER + DOC:** Opțiune C (hybrid). Argumente:
1. Badges/inline trebuie compacte (LS 0.78 vs Scor Lead 0.78) — Opțiune A wins pe UI density
2. Header sections + descriptions trebuie clare pentru user non-tehnic (Opțiune B wins pe accessibility)
3. Opțiune C combină ambele: "Scor Lead (LS) §7.1 BRD" în header, "LS 0.78" în badge

**Cross-ref:** CLAUDE.md §10b Regula 11 OD-i18n-01 + BRD §15 glosar.

---

### F-M0S5-12 — Lead detail "Top 3 match" rows hover fără onClick ⚠️ MED

**Severitate:** MED (Regula 12 cross-pattern violation)
**Categorie HST:** §2.7 Regula 12
**Owner:** FRONTEND WEB DEV
**Status:** Tracked M1.S5

**Repro steps:**
1. Navighează `/leads/[id]` (orice ID valid din mock)
2. Scroll la secțiunea "Primele 3 potriviri"
3. Hover pe oricare din cele 3 match rows — observă hover styling (border-gold + bg shift + translate-y)
4. Click — noop (nu duce nicăieri)

**Cauză:**
`app/leads/[id]/page.tsx:183` aplica hover styling pe `<div>` simplu, NU pe `<Link>` sau `<button>`. Acest pattern este similar cu F-M0S5-01 (Card hover global) dar local pe această componentă.

**Fix propus M1.S5:**
- Opțiune A (preferred): Implementează `/properties/[id]` page (cross-link cu F-M0S5-03) + wrap match rows în `<Link href="/properties/[id]">`
- Opțiune B (interim): Remove hover transform doar pe acest pattern până când property detail există

**Cross-ref:** F-M0S5-03 (`/properties` click row noop) — same root cause.

---

### F-M0S5-13 — Table component hover universal ⚠️ LOW

**Severitate:** LOW (preventive enhancement; current scope all tables interactive M0)
**Categorie HST:** §2.7 Regula 12
**Owner:** FRONTEND WEB DEV + DESIGNER
**Status:** Tracked M1.S5

**Repro steps:**
1. Inspect `components/ui/table.tsx:43`
2. Vezi `hover:bg-navy-hover` aplicat universal pe `<tr>`

**Fix propus M1.S5 (preventive):**
Similar pattern cu F-M0S5-01 Card fix — introdus `interactive` prop pe `<TableRow>`:
```diff
- export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
+ export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & { interactive?: boolean };
- 'border-b border-border last:border-0 hover:bg-navy-hover transition-colors duration-fast'
+ 'border-b border-border last:border-0 transition-colors duration-fast',
+ interactive && 'cursor-pointer hover:bg-navy-hover',
```

Justificare deferred LOW: în scope M0 toate table-urile sunt interactive (`/leads` table click → detail, `/manager/escalations` table click → modal). Pattern preventiv pentru read-only table-uri viitoare (audit log viewer M1.S5+).

**Cross-ref:** F-M0S5-01 backward-compat pattern (interactive prop opt-in).

---

### F-M0S5-14 — TutorialOverlay component gap ⚠️ MED

**Severitate:** MED (Regula 13 forward-applying)
**Categorie HST:** §2.8 Regula 13
**Owner:** FRONTEND WEB DEV + DESIGNER + DOC
**Status:** Tracked M1.S5 entry

**Repro steps:**
1. `find apps/web-preview/components -name 'TutorialOverlay*'` → no results
2. `grep -r 'TutorialOverlay' apps/web-preview/` → no results
3. `grep -r '"tutorial"' apps/web-preview/messages/` → no results

**Gap confirmed:** 13/13 pagini funcționale lipsesc tutorial onboarding per Regula 13.

**Fix propus M1.S5 (task T-M1.S5-XX explicit în Roadmap v1.0.5+):**

Implementation MVP — componenta TutorialOverlay + content 9 pagini principale × 3 locale:

```tsx
// components/ui/tutorial-overlay.tsx
'use client';
import { useState, useEffect } from 'react';
import { useT } from '@/components/i18n/provider';

type TutorialStep = { anchor: string; titleKey: string; bodyKey: string };

export function TutorialOverlay({ screenId, steps }: { screenId: string; steps: TutorialStep[] }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const key = `revyx.tutorial.${screenId}.seen`;
    if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
      setOpen(true);
      localStorage.setItem(key, '1');
    }
  }, [screenId]);

  // ... render hotspot + focus trap + ESC close + Tab navigation + ? button persistent
}
```

Content i18n (per pagina):
```json
{
  "tutorial": {
    "dashboard": {
      "title": "Bun venit pe panoul de bord!",
      "intro": "Acesta este centrul tău de comandă...",
      "steps": [
        { "title": "Sarcini active", "body": "..." },
        { "title": "Lista de azi", "body": "..." },
        { "title": "Scoruri proprii", "body": "..." }
      ]
    },
    "leads": { /* ... */ },
    // ... 7 more pages
  }
}
```

`data-tutorial-anchor` pe elementele target:
```tsx
<section aria-labelledby="nba" data-tutorial-anchor="nba-section">
```

"?" button persistent în `<SiteNav>` header — onClick deschide TutorialOverlay cu activeStep=0.

**Effort estimate:** 1 sesiune productivă (component + 9 pagini × 3 locale = 27 step bundles + anchor attribuții + "?" button + a11y focus trap).

**Cross-ref:** CLAUDE.md §10b Regula 13 implementation specs + screens-inventory.md (18 screens reference, 9 primary).

---

### F-M0S5-15 — `/deals` kanban 1024×768 horizontal scroll ⚠️ MED

**Severitate:** MED (Regula 14 layout overlap edge case)
**Categorie HST:** §2.9 Regula 14
**Owner:** FRONTEND WEB DEV + DESIGNER
**Status:** Tracked M1.S5

**Repro steps:**
1. `cd apps/web-preview && npm run dev`
2. Browser resize 1024×768 (tablet landscape) — folosește DevTools device mode
3. Navighează `/deals`
4. Observă: kanban 6 coloane (Discovery + Calificat + Ofertă + Negociere + Notariat + Câștigat) produc horizontal scroll intern în container

**Acceptat M0:** Use case principal este manager command desktop (1920/1440 viewport), nu agent in-field tablet. Kanban funcționează corect pe 1280+ (no scroll).

**Fix propus M1.S5:**

Opțiune A (condensare): Pe viewport <1280px, combine "Notariat" + "Câștigat" într-o single column cu tab switcher:
```tsx
{viewport < 1280 ? (
  <CombinedFinalStagesColumn />
) : (
  <>
    <StageColumn stage="closing" />
    <StageColumn stage="won" />
  </>
)}
```

Opțiune B (compact mode): Reduce column width de la `w-72` la `w-56` pe viewport <1280px + reduce card padding.

**Decizie DESIGNER:** Opțiune A preferred (semantic — "Notariat" și "Câștigat" sunt stages finale closely related).

**Cross-ref:** Regula 14 viewport audit + tokens.json breakpoints (md=768, lg=1024, xl=1280).

---

### F-M0S5-16 — Table-uri 7-8 coloane horizontal scroll edge ⚠️ LOW

**Severitate:** LOW (browser-native pattern acceptat)
**Categorie HST:** §2.9 Regula 14
**Owner:** FRONTEND WEB DEV
**Status:** Tracked M1.S5+

**Repro steps:**
1. Viewport 1024×768
2. `/leads` table 7 coloane (ID + Nume + Sursă + SLA + LS + Status + Zonă) → potential horizontal scroll (depends pe text length)
3. `/manager/escalations` table 8 coloane similar

**Fix propus M1.S5+:**
- Column hide controls (user toggle column visibility)
- Sticky first column (ID sau Nume) ca anchor visual la horizontal scroll
- Pattern shadcn/ui DataTable preferred

**Cross-ref:** Industry best practice data tables responsive — TanStack Table sau shadcn/ui data-table preset.

---

### F-M0S5-17 — Visual regression baseline tooling absent ⚠️ LOW

**Severitate:** LOW (preventive enhancement M1.S5+)
**Categorie HST:** §2.9 Regula 14
**Owner:** DEVOPS + FRONTEND WEB DEV
**Status:** Tracked M1.S5+

**Repro steps:** N/A (tooling gap; manual smoke testul actual este suficient pentru M0)

**Fix propus M1.S5+:**

Setup Playwright + visual regression:
```bash
cd apps/web-preview
npm install --save-dev @playwright/test
npx playwright install chromium
```

Test file `e2e/visual.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';
const pages = ['/dashboard', '/leads', '/leads/L-001', '/properties', '/deals', '/manager', '/manager/escalations', '/notifications', '/profile', '/settings', '/admin'];
const viewports = [{ w: 1920, h: 1080 }, { w: 1440, h: 900 }, { w: 1024, h: 768 }];
const locales = ['ro', 'ru', 'en'];

for (const path of pages) {
  for (const vp of viewports) {
    for (const loc of locales) {
      test(`${path} ${vp.w}x${vp.h} ${loc}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(`http://localhost:3000${path}`);
        await page.evaluate(l => localStorage.setItem('revyx.locale', l), loc);
        await page.reload();
        await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.005 });
      });
    }
  }
}
```

Effort estimate: 0.5 sesiune (setup + capture 9 pagini × 3 viewport × 3 locale = 81 baselines). CI gate cu maxDiffPixelRatio 0.005 threshold.

**Cross-ref:** CLAUDE.md §10b Regula 14 visual regression suggestion.

---

## 2. Findings closure summary

| ID | Sev | Status | Owner | ETA |
|---|---|---|---|---|
| F-M0S5-01 | HIGH | ✅ FIXED acest PR | FRONTEND WEB DEV + DESIGNER | M0.S5 ☑ |
| F-M0S5-02 | HIGH | ✅ FIXED acest PR | DOC + FRONTEND WEB DEV | M0.S5 ☑ |
| F-M0S5-03 | MED | Tracked | FRONTEND WEB DEV | M1.S5 |
| F-M0S5-04 | MED | Tracked | FRONTEND WEB DEV + DESIGNER | M1.S5 entry |
| F-M0S5-05 | LOW | Tracked | FRONTEND WEB DEV | M1.S2 |
| F-M0S5-06 | LOW | Tracked | DOC + DESIGNER | M1.S5 entry copy pass |
| F-M0S5-07 | MED | OD-M0.S4-01 pending PM | PM | Post-M0.S5 |
| F-M0S5-08 | LOW | Pre-presentation | PM + DOC | Pre-presentation |
| F-M0S5-09 | LOW | Tracked | DOC + Senior PM | Pre-presentation |
| F-M0S5-10 | LOW | Tracked | FRONTEND WEB DEV | M1.S5 |
| F-M0S5-11 | LOW | OD-i18n-01 pending PM | PM | Open decision |
| F-M0S5-12 | MED | Tracked | FRONTEND WEB DEV | M1.S5 |
| F-M0S5-13 | LOW | Tracked | FRONTEND WEB DEV + DESIGNER | M1.S5 |
| F-M0S5-14 | MED | Tracked | FRONTEND WEB DEV + DESIGNER + DOC | M1.S5 (task T-M1.S5-XX) |
| F-M0S5-15 | MED | Tracked | FRONTEND WEB DEV + DESIGNER | M1.S5 |
| F-M0S5-16 | LOW | Tracked | FRONTEND WEB DEV | M1.S5+ |
| F-M0S5-17 | LOW | Tracked | DEVOPS + FRONTEND WEB DEV | M1.S5+ |

**Verdict:** 2 HIGH FIXED + 6 MED triagate + 9 LOW backlog. 0 CRIT. Exit gate M0 atins.

---

## 3. Cross-references

- `docs/audit/HST_REVYX_m0_v1.0.0.md` — raport HST M0 principal (acest sesiune)
- `CLAUDE.md` v1.2.10 §10b Regulile 11-14 (audit operating rules NEW)
- `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 M0.S5 + §4.3 M0 DoD + §8 HST methodology
- `docs/ROADMAP_REVYX_detailed-execution_v1.0.4.md` §3.5 M0.S5 atomic tasks
- `apps/web-preview/components/ui/card.tsx` (FIXED F-M0S5-01)
- `apps/web-preview/messages/ro.json` (FIXED F-M0S5-02 RO portion — 30 keys)
- `apps/web-preview/messages/ru.json` (FIXED F-M0S5-02 RU portion — 14 keys)
- `docs/audit/HST_REVYX_pre-dev_v1.0.0.md` + `HST_REVYX_pre-dev_findings-backlog_v1.0.0.md` (template + lifecycle baseline)
- `docs/brand-configs/revyx.md` §5.1 cards hover (Regula 12 baseline)
- `design/tokens.json` v1.0.0 + `design/screens-inventory.md` v1.0.0

---

*docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
