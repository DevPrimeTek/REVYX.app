# RUNBOOK — Demo Deploy (Vercel)
<!-- RUNBOOK_REVYX_demo-deploy_v1.0.2.md · v1.0.2 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M0.S2 (early bring-forward) + ★ **M0.S3 T-M0.S3-14** (Vercel deploy + custom domain `demo.revyx.app`)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (M0)
**Trigger v1.0.2:** ★ M0.S3 ✅ CLOSED — `apps/web-preview/` promovat la `apps/web/` (git mv); Vercel project Root Directory necesită bump corespunzător + DNS step (T-M0.S3-14) acum unblocked pentru execuție PM/DevOps.

## 0.1 Platform Matrix

🌐 Web only (DP-01) — Vercel deploy servește exclusiv `apps/web/` (Next.js). Mobile (M2.S3) folosește pipeline distinct (Expo EAS).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DEVOPS + FRONTEND WEB DEV + Senior PM | Initial — Vercel GitHub App integration pentru `apps/web-preview/`; preview URL per PR + production deploy pe `main`. CI build-check workflow paralel (`web-preview-ci`) gate-uiește merge-uri pe build success. |
| 1.0.1 | 2026-05 | DEVOPS | PATCH — fix Next.js detection issue. Eliminat `outputDirectory`/`buildCommand`/`installCommand`/`devCommand` din `vercel.json`; pentru Next.js framework preset Vercel auto-detectează tot prin `@vercel/next` builder. |
| **1.0.2** | **2026-05** | ★ DEVOPS + FRONTEND WEB DEV + Senior PM | ★ **PATCH — M0.S3 promote (apps/web-preview → apps/web) + DNS step**. Schimbări: (1) §2.1 Root Directory bump `apps/web-preview` → `apps/web` (Vercel Settings → Git → Root Directory edit OR project Settings → General → Root Directory). (2) §2.3 DNS step `demo.revyx.app` (CNAME → `cname.vercel-dns.com`, TLS auto-issue Let's Encrypt ~5 min). (3) §3 operational flow path updates `apps/web-preview/**` → `apps/web/**`. (4) §4 troubleshooting adăugat simptom "Root Directory bump required after rename". (5) §6 cross-references actualizate cu paths noi + Roadmap v1.0.3. |

---

## 1. Scope

Acest runbook documentează **configurația one-time** + procedurile recurente pentru deploy automat al demo-ului M0 pe Vercel:

| Obiectiv | Output |
|---|---|
| Preview URL automat per PR | Vercel postează URL în PR comments |
| Production deploy pe push `main` | `revyx-web-preview.vercel.app` (apoi `demo.revyx.app` post-DNS, §2.3) |
| Build-check CI gate | `.github/workflows/web-ci.yml` — typecheck + build |
| Security headers default | `apps/web/vercel.json` (CSP-light: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |

**Out of scope:** mobile app deploy (Expo EAS, M2.S3); production app backend M1+ (separate deployment unit).

> **★ M0.S3 rename note (T-M0.S3-01):** `apps/web-preview/` a fost promovat la `apps/web/` prin `git mv`. Vercel project trebuie ajustat (Root Directory bump, §2.1). Workflow CI a fost renamed `web-preview-ci.yml` → `web-ci.yml` cu paths bumped la `apps/web/**`.

---

## 2. One-time setup (PM / DevOps acțiune manuală)

> **Cine face:** Senior PM cu acces la GitHub org `DevPrimeTek` + Vercel account.
> **Cât durează:** ~10 minute (initial creation) + ~5 minute (DNS step M0.S3 §2.3).
> **Cost:** Free tier Vercel Hobby (sufficient pentru M0; M1+ poate cere upgrade Pro $20/lună la traffic >100GB).

### 2.1 Creare Vercel project (★ updated M0.S3)

1. Deschide https://vercel.com/new
2. Alege **"Import Git Repository"** → autorizează GitHub access dacă e prima dată
3. Selectează repo-ul `DevPrimeTek/REVYX.app`
4. **Configure Project** — completează:

| Câmp | Valoare |
|---|---|
| Project Name | `revyx-web` (sau retain `revyx-web-preview` dacă există deja, vezi §2.1.bis) |
| Framework Preset | **Next.js** (auto-detectat) |
| **Root Directory** | ★ **`apps/web`** (CRITIC — click "Edit" sub Root Directory) |
| Build Command | (folosește default → `npm run build`) |
| Install Command | (folosește default → `npm ci --no-audit --no-fund`) |
| Output Directory | (default `.next`) |
| Node.js Version | **22.x** (match cu CI) |

5. **Environment Variables** — nimic obligatoriu pentru M0 demo (toate datele sunt mock inline).
6. Click **Deploy** — primul build durează ~2-3 min.

### 2.1.bis Migrare proiect existent (M0.S2 → M0.S3 rename)

> **Se aplică doar dacă** există deja un Vercel project `revyx-web-preview` configurat în M0.S2.

1. Vercel project → **Settings** → **General** → **Root Directory** → click "Edit"
2. Modifică `apps/web-preview` → **`apps/web`** → Save
3. Trigger un re-deploy manual (Deployments → Redeploy latest) sau push un commit nou pe `main`
4. Verifică în Build Logs că path-urile arată `apps/web/.next/...`
5. (Opțional) Rename proiectul în Vercel UI: `revyx-web-preview` → `revyx-web` (Settings → General → Project Name). URL-ul auto-asignat se schimbă; custom domain `demo.revyx.app` rămâne stabil dacă a fost atașat.

### 2.2 Verificare integrare GitHub App

După primul deploy reușit:

1. Mergi la Vercel project → **Settings** → **Git**
2. Verifică că **"Connected Git Repository"** = `DevPrimeTek/REVYX.app`
3. **Production Branch** = `main`
4. **Ignored Build Step** (★ updated paths M0.S3):

   ```bash
   git diff HEAD^ HEAD --quiet -- apps/web design/tokens.json
   ```

   (exit code 0 = no changes in path → skip build; exit code 1 = changes → build)

### 2.3 ★ Custom domain `demo.revyx.app` (M0.S3 T-M0.S3-14)

> **Status:** M0.S3 ✅ CLOSED → acest step e ACUM unblocked pentru execuție PM.

**Pre-requisite:** acces DNS la zona `revyx.app` (registrar — probabil Cloudflare, Namecheap sau GoDaddy per ITPRO SYSTEM SRL).

1. **Vercel** → project → **Settings** → **Domains** → click **Add**
2. Introdu `demo.revyx.app` → Add
3. Vercel afișează DNS record țintă (format CNAME):
   - **Type:** `CNAME`
   - **Name:** `demo`
   - **Value/Target:** `cname.vercel-dns.com`
   - **TTL:** Auto (sau 300s)
4. **Registrar / DNS provider** — adaugă record-ul de mai sus în zona `revyx.app`
5. Înapoi la Vercel → așteaptă "Valid Configuration" (~30s-5min propagare DNS)
6. Vercel auto-issues TLS cert via Let's Encrypt (~2-5min după DNS valid)
7. Verifică HTTPS: `curl -I https://demo.revyx.app` → `HTTP/2 200` (status header trebuie să apară)
8. Test smoke: deschide `https://demo.revyx.app` → trebuie să arate landing REVYX (page `/`)
9. Test language switcher: RO → RU → EN persistă pe refresh (localStorage `revyx.locale`)
10. Test drag-drop: `https://demo.revyx.app/deals` → grab card → drop pe altă coloană → toast confirmare

**Rollback:** dacă domain attach eșuează, Vercel project rămâne accesibil la URL-ul auto (`*.vercel.app`); demo continuă să funcționeze fără întrerupere.

---

## 3. Operational flow (după setup)

| Eveniment | Ce se întâmplă automat |
|---|---|
| PR deschis cu modificări în `apps/web/**` | Vercel construiește preview deploy → comentează URL în PR (~2 min) |
| Push nou la branch-ul PR | Preview re-built; URL-ul rămâne stabil per PR |
| PR merged în `main` | Production deploy → `demo.revyx.app` (sau `revyx-web.vercel.app` pre-DNS) |
| Schimbare doar în `docs/**` sau alte path-uri | "Ignored Build Step" → skip; CI rămâne neimpactat |
| `web-ci` GitHub Action fail | PR merge blocat (CI required check); fixare necesară înainte de re-attempt deploy |

**Important:** preview URLs sunt **publice by default** pe planul Hobby. Pentru demo non-public (NDA pitches), upgrade la Vercel Pro cu Deployment Protection (`$20/lună`).

---

## 4. Troubleshooting

| Simptom | Cauză probabilă | Fix |
|---|---|---|
| ★ Build fail `Couldn't find any pages or app directory` post-rename | Root Directory încă apuntă la `apps/web-preview` | Vercel Settings → General → Root Directory → edit la `apps/web` (vezi §2.1.bis) |
| Build fail `No Output Directory named "public" found` | (a) Root Directory greșit SAU (b) framework preset = "Other" SAU (c) vercel.json setează `outputDirectory` explicit | (a) Settings → Git → Root Directory = `apps/web` · (b) Settings → General → Framework Preset = **Next.js** · (c) elimină `outputDirectory` din `vercel.json` (vezi v1.0.1 changelog) |
| Build fail "Cannot find module @dnd-kit/core" | Lockfile out of sync după adăugare deps M0.S3 | În `apps/web/`: `rm -rf node_modules package-lock.json && npm install` apoi commit + push |
| Preview URL 404 pe rute dinamice (`/leads/[id]`) | Next.js output mode greșit | Asigură-te că NU e setat `output: 'export'` în `next.config.mjs` (necesită SSR pentru `/leads/[id]` care e dynamic) |
| Build OK dar paginile arată unstyled | `design/tokens.json` nu e în git | Verifică `git ls-files design/tokens.json` |
| CI pass dar Vercel fail | Node version mismatch | Vercel Settings → General → Node.js Version = 22.x |
| Toate buildurile sunt skip-uite | Ignored Build Step prea agresiv | Settings → Git → Ignored Build Step → click "Override" și seteaz-o conform §2.2.4 sau lasă gol |
| ★ DNS valid dar HTTPS 526 / TLS error | Cert nu s-a issued încă (propagare lentă) | Așteaptă 5-10 min; Vercel auto-retry. Dacă persistă >30 min: Vercel Settings → Domains → click domain → "Refresh" |
| ★ Language switcher RO/RU/EN nu persistă pe refresh | `localStorage` blocat (private mode, ITP) | Test în Incognito → verifică browser console pentru SecurityError. Fallback intenționat la RO. |

---

## 5. Security headers (default applied)

Setați în `apps/web/vercel.json`:

| Header | Valoare | Motiv |
|---|---|---|
| `X-Frame-Options` | `DENY` | Previne clickjacking (demo neembed-able) |
| `X-Content-Type-Options` | `nosniff` | MIME sniff protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Reduce leak referrer cross-site |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Demo nu cere device permissions |

CSP completă (`Content-Security-Policy`) e amânată pentru M1.S5 când avem API endpoints reale + nonce strategy în RSC.

---

## 6. Cross-references

- `apps/web/vercel.json` — config consumat de Vercel (★ moved from `apps/web-preview/vercel.json`)
- `.github/workflows/web-ci.yml` — CI build gate paralel (★ renamed from `web-preview-ci.yml`)
- `docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md` §3.3 T-M0.S3-14 — custom domain task (M0.S3 ◐ partial)
- `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §7 — implementation contract `apps/web/`
- `apps/web/README.md` — quick start + folder map + user journeys + i18n notes

---

## 7. Approval

| Aprobator | Sign-off | Data |
|---|---|---|
| DEVOPS | ✅ (★ v1.0.2 rename procedure + DNS steps validated locally pe `next build`) | 2026-05 |
| FRONTEND WEB DEV | ✅ (★ v1.0.2 vercel.json moved + ci workflow renamed; `next build` 16 routes PASS) | 2026-05 |
| Senior PM | ⬜ pending Vercel Root Directory bump + DNS execution | — |

---

*docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.2.md · v1.0.2 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
