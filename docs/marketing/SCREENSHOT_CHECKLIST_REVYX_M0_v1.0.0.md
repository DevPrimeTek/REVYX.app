# SCREENSHOT CAPTURE CHECKLIST — REVYX M0 Demo
<!-- docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** M0.S4 — Pitch Deck + Video Walkthrough (T-M0.S4-07 Screenshot capture)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 (AC-M0-04 supports + AC-M0-03 video reference frames)
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.4.md` §3.4 T-M0.S4-07

## 0.1 Platform Matrix

🌐 **WEB only.** Toate capturi din `apps/web-preview/` Next.js demo. Browser țintă: Chrome 120+ (sau Chromium-based echivalent) la 1440×900 sau 1920×1080. Mobile screenshots N/A pentru M0 (Mobile companion M2.S3).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DESIGNER + FRONTEND WEB DEV + DOC | ★ INITIAL — 18 screens prioritizate per `design/screens-inventory.md`, instrucțiuni manual + Playwright automation, locale switching procedure RO/RU/EN. |

---

## 1. Pre-flight

### 1.1 Setup local

```bash
cd apps/web-preview
npm install      # dacă nu deja done
npm run dev      # serves at http://localhost:3000
```

Browser: Chrome / Chromium 120+ · resoluție window 1440×900 (minimum) sau 1920×1080 (ideal pentru deck export).

### 1.2 Setup deterministic locale

Mock data este deterministic (xmur3+sfc32 seeded RNG per `apps/web-preview/lib/mock/rng.ts`) — aceleași 100 leads / 50 properties / 20 deals indiferent de momentul capture. Niciun action setup suplimentar.

Pentru setarea limbii **înainte de capture** (i18n folosește `localStorage` cheia `revyx.locale`):

**Manual via DevTools:**
```javascript
// Open DevTools (F12) → Console
localStorage.setItem('revyx.locale', 'ro');  // sau 'ru', 'en'
location.reload();
```

**Sau via UI:** click dropdown în `<SiteNav>` (top-right) → select limbă → așteaptă re-render.

### 1.3 Capture tools

| Tool | OS | Notes |
|---|---|---|
| **Browser native screenshot** (Chrome DevTools → ··· → Capture full size screenshot) | All | Full page incl. scroll · PNG · maximum compatibility |
| **Built-in OS screenshot** | macOS `⌘+Shift+4` / Windows `Win+Shift+S` / Linux `gnome-screenshot` | Window-area only, fast |
| **Playwright automation** | All | Vezi §3 below pentru script reproducibil |

---

## 2. Manual capture checklist (18 screens × 3 locale RO/RU/EN = 54 captures)

> **Notă:** Pentru M0.S4 deck minimum 7 screens × 2 locale (RO + EN) sunt **mandatory**, restul opționale (RU pentru pitch local + 10 nice-to-have pentru anexe). Capturile mandatory sunt marcate **★ MANDATORY**.

### 2.1 Convenții fișier output

```
design/screenshots/
  s01-home-ro.png
  s01-home-ru.png
  s01-home-en.png
  s02-login-ro.png
  ...
```

Format: PNG, 1920×1080 ideal (1440×900 minimum), color profile sRGB. Filename: `s{NN}-{slug}-{locale}.png`.

### 2.2 Mandatory captures (★) pentru deck

| # | URL | Slug | Capture state | Status |
|---|---|---|---|---|
| ★ S-03 | `/leads` | `leads-queue` | Default queue · 100 leads visible · filter chips visible (HOT / Calificat / Warm / Nurturing / Toate) | ⬜ |
| ★ S-04 | `/leads/L-0012` | `lead-detail` | Lead L-0012 (HOT, LS 0.85+ în mock) · activity timeline visible · side-panel match suggestions visible · "Asignează agent" button visible | ⬜ |
| ★ S-05 | `/properties` | `properties-list` | Default 50 properties · filter chips visible (Apartament / Casă / Teren / Comercial / Toate) · PS + LF badges vizibil pe cards | ⬜ |
| ★ S-05b | `/properties/new` | `property-new` | Form 8 câmpuri partial-filled (sugestie: Chișinău · Centru · 3 camere · 78m² · €95.000 · 2018 · etaj 4) | ⬜ |
| ★ S-07 | `/deals` | `deals-kanban` | Default full-width kanban · 6 coloane visible · 20 deals distribuite · scroll-x dacă necesar (capture full page recomandat) | ⬜ |
| ★ S-09 | `/manager` | `manager-dashboard` | APS leaderboard · escalations count · conversion rate widget · today actions | ⬜ |
| ★ S-10 | `/manager/escalations` | `manager-escalations` | 6 escalations queue · BR-03 color chips visible · bulk-select checkbox header · "Bulk reassign" button | ⬜ |

**Total mandatory:** 7 capturi × 2 locale (RO + EN) = **14 fișiere PNG**.

### 2.3 Optional captures pentru extensii deck + video reference

| # | URL | Slug | Capture state | Status |
|---|---|---|---|---|
| S-01 | `/login` | `login` | Mock login form · button "Conectează-te" visible | ⬜ optional |
| S-02 | `/dashboard` | `dashboard-agent` | NBA widget top-3 · task slot indicator · SLA timer countdown | ⬜ recomandat |
| S-06 | `/properties/[id]` | `property-detail` | Property P-0001 detail · gallery + score + suggested leads | ⬜ TBD route |
| S-08 | `/deals/[id]` | `deal-detail` | DHI heatmap + DP score + commission preview | ⬜ TBD route (M0.S3 P1, may be missing) |
| S-11 | `/manager/audit` | `manager-audit` | Audit log viewer + filter + CSV export button | ⬜ TBD route (M0.S3 P1) |
| S-12 | `/admin` | `admin-panel` | RBAC matrix + system health + feature flags | ⬜ optional |
| S-13 | `/admin/users` | `admin-users` | User invite + suspend + role assignment | ⬜ TBD route (M0.S3 P1) |
| S-14 | `/admin/branding` | `admin-branding` | White-label preview colors/logo/domain | ⬜ TBD route (M0.S3 P1) |
| S-15 | `/legal/privacy` | `legal-privacy` | Privacy policy RO/RU/EN | ⬜ TBD route (M0.S3 P2) |
| S-16 | `/legal/cookies` | `legal-cookies` | Cookie policy | ⬜ TBD route (M0.S3 P2) |
| S-17 | `/404` | `404` | Not-found state (visit `/leads/L-9999` for live 404) | ⬜ optional |
| S-18 | `/` | `home` | Marketing landing → route to `/login` | ⬜ optional |
| **NEW** | `/notifications` | `notifications` | Audit-log feed · mark-read state | ⬜ optional (M0.S3 livered) |
| **NEW** | `/profile` | `profile` | Agent profile · APS 6-month bars · my-leads/my-deals | ⬜ optional (M0.S3 livered) |
| **NEW** | `/settings` | `settings` | Settings page | ⬜ optional (M0.S3 livered) |

**Total optional:** 15 capturi × 1-2 locale (recomandat doar RO) = ~15-30 fișiere additional.

---

## 3. Playwright automation (recomandat pentru reproducibilitate)

### 3.1 Setup

```bash
# Din root repo
npm install -D playwright @playwright/test
npx playwright install chromium
```

### 3.2 Script: `scripts/capture-screenshots.ts`

> **Notă:** Acest script e propus, **nu** e livrat în M0.S4 (scope DOC/PM). Frontend Lead poate adăuga în M0.S5+ ca tooling support.

```typescript
// scripts/capture-screenshots.ts
import { chromium, Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = process.env.DEMO_URL ?? 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(__dirname, '../design/screenshots');
const LOCALES = ['ro', 'ru', 'en'] as const;

interface CaptureSpec {
  slug: string;
  url: string;
  mandatory: boolean;
  preparation?: (page: Page) => Promise<void>;
}

const captures: CaptureSpec[] = [
  { slug: 'leads-queue', url: '/leads', mandatory: true },
  { slug: 'lead-detail', url: '/leads/L-0012', mandatory: true },
  { slug: 'properties-list', url: '/properties', mandatory: true },
  { slug: 'property-new', url: '/properties/new', mandatory: true },
  { slug: 'deals-kanban', url: '/deals', mandatory: true },
  { slug: 'manager-dashboard', url: '/manager', mandatory: true },
  { slug: 'manager-escalations', url: '/manager/escalations', mandatory: true },
  // optional
  { slug: 'login', url: '/login', mandatory: false },
  { slug: 'dashboard-agent', url: '/dashboard', mandatory: false },
  { slug: 'notifications', url: '/notifications', mandatory: false },
  { slug: 'profile', url: '/profile', mandatory: false },
];

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();

  for (const locale of LOCALES) {
    await page.goto(`${BASE_URL}/`);
    await page.evaluate((loc) => localStorage.setItem('revyx.locale', loc), locale);

    for (const c of captures) {
      await page.goto(`${BASE_URL}${c.url}`);
      await page.waitForLoadState('networkidle');
      if (c.preparation) await c.preparation(page);
      const file = path.join(OUTPUT_DIR, `${c.slug}-${locale}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✓ ${file}`);
    }
  }

  await browser.close();
})();
```

### 3.3 Run

```bash
# Pornește demo local
cd apps/web-preview && npm run dev &

# Capture
DEMO_URL=http://localhost:3000 npx tsx scripts/capture-screenshots.ts
```

Sau direct pe demo live:
```bash
DEMO_URL=https://demo.revyx.app npx tsx scripts/capture-screenshots.ts
```

---

## 4. Output expected

```
design/screenshots/
├── leads-queue-ro.png         ★ mandatory
├── leads-queue-ru.png
├── leads-queue-en.png         ★ mandatory
├── lead-detail-ro.png         ★ mandatory
├── lead-detail-ru.png
├── lead-detail-en.png         ★ mandatory
├── properties-list-ro.png     ★ mandatory
├── ... (etc., 14 mandatory minimum, ~42 if all 3 locale × 14)
```

Existent în repo: doar `design/screenshots/README.md` (placeholder). Capture step e **separate action** post-M0.S4 commit — depinde de echipa care va executa fizic recordingul video (T-M0.S4-06).

---

## 5. Gating check pentru deck render

- [ ] 7 mandatory screens × 2 locale (RO + EN) capturate ⇒ deck ready pentru export PDF
- [ ] Tip de capture: full-page (DevTools → Capture full size screenshot) preferat
- [ ] Verificare brand compliance: navy `#0C1428` background prezent · gold accents `#C9870A` vizibili pe LS badges + buttons
- [ ] Verificare i18n: text RO clearly visible în `-ro.png` versions · same screen în EN într-un `-en.png`
- [ ] Niciun debug overlay (React DevTools, etc.) vizibil
- [ ] Cursor manual hidden via `body { cursor: none !important; }` injection în DevTools (pentru clean shots)

---

## 6. Cross-references

- `design/screens-inventory.md` — sursa 18 screens cu priority P0/P1/P2
- `apps/web-preview/app/` — live demo routes
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/assets/SCREENSHOT_REFS.md` — slide → screenshot mapping
- `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` §2 — scene → URL mapping (video reference frames)
- `docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.2.md` — Vercel deploy + custom domain demo.revyx.app

---

*docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
