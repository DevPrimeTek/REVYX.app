# RUNBOOK — Demo Deploy (Vercel)
<!-- RUNBOOK_REVYX_demo-deploy_v1.0.1.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M0.S2 (early bring-forward) + M0.S3 T-M0.S3-14 (Vercel deploy `demo.revyx.app`)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (M0)
**Trigger:** PM cerere — visibility live pe prototype-ul M0.S2 înainte de M0.S3 substantive work. Setup făcut acum, custom domain `demo.revyx.app` se ataschează în M0.S3 (T-M0.S3-14).

## 0.1 Platform Matrix

🌐 Web only (DP-01) — Vercel deploy servește exclusiv `apps/web-preview/` (Next.js). Mobile (M2.S3) folosește pipeline distinct (Expo EAS).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DEVOPS + FRONTEND WEB DEV + Senior PM | Initial — Vercel GitHub App integration pentru `apps/web-preview/`; preview URL per PR + production deploy pe `main`. CI build-check workflow paralel (`web-preview-ci`) gate-uiește merge-uri pe build success. |
| **1.0.1** | **2026-05** | ★ DEVOPS | ★ **PATCH — fix Next.js detection issue.** Eliminat `outputDirectory`, `buildCommand`, `installCommand`, `devCommand` din `vercel.json` — pentru Next.js framework preset, Vercel auto-detectează tot prin `@vercel/next` builder, iar setarea explicită a `outputDirectory: ".next"` cauzează fallback la "Other" framework (Vercel începe să caute `public/` ca output). vercel.json final = doar `framework`, `regions`, `headers`. §4 troubleshooting actualizat cu noul simptom + cauză + fix. |

---

## 1. Scope

Acest runbook documentează **configurația one-time** + procedurile recurente pentru deploy automat al prototype-ului M0 pe Vercel:

| Obiectiv | Output |
|---|---|
| Preview URL automat per PR | Vercel postează URL în PR comments |
| Production deploy pe push `main` | `revyx-web-preview.vercel.app` (sau `demo.revyx.app` post-DNS) |
| Build-check CI gate | `.github/workflows/web-preview-ci.yml` — typecheck + build |
| Security headers default | `apps/web-preview/vercel.json` (CSP-light: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |

**Out of scope:** mobile app deploy (Expo EAS, M2.S3); production app `apps/web/` (M0.S3 promote step T-M0.S3-01); custom domain `demo.revyx.app` DNS (M0.S3 T-M0.S3-14).

---

## 2. One-time setup (PM / DevOps acțiune manuală)

> **Cine face:** Senior PM cu acces la GitHub org `DevPrimeTek` + Vercel account.
> **Cât durează:** ~10 minute.
> **Cost:** Free tier Vercel Hobby (sufficient pentru M0; M1+ poate cere upgrade Pro $20/lună la traffic >100GB).

### 2.1 Creare Vercel project

1. Deschide https://vercel.com/new
2. Alege **"Import Git Repository"** → autorizează GitHub access dacă e prima dată
3. Selectează repo-ul `DevPrimeTek/REVYX.app`
4. **Configure Project** — completează:

| Câmp | Valoare |
|---|---|
| Project Name | `revyx-web-preview` |
| Framework Preset | **Next.js** (auto-detectat) |
| **Root Directory** | `apps/web-preview` (CRITIC — click "Edit" sub Root Directory) |
| Build Command | (folosește default din `vercel.json` → `npm run build`) |
| Install Command | (folosește default → `npm ci --no-audit --no-fund`) |
| Output Directory | (default `.next`) |
| Node.js Version | **22.x** (match cu CI) |

5. **Environment Variables** — nimic obligatoriu pentru M0 demo (toate datele sunt inline).
6. Click **Deploy** — primul build durează ~2-3 min.

### 2.2 Verificare integrare GitHub App

După primul deploy reușit:

1. Mergi la Vercel project → **Settings** → **Git**
2. Verifică că **"Connected Git Repository"** = `DevPrimeTek/REVYX.app`
3. **Production Branch** = `main`
4. **Ignored Build Step** (opțional dar recomandat ca să nu re-build când nu se schimbă nimic în `apps/web-preview/`):

   ```bash
   git diff HEAD^ HEAD --quiet -- apps/web-preview design/tokens.json
   ```

   (exit code 0 = no changes in path → skip build; exit code 1 = changes → build)

### 2.3 (Opțional, M0.S3) Custom domain

Tracked ca T-M0.S3-14 în Roadmap v1.0.2 §3.3 — nu se face acum:

1. Vercel project → **Settings** → **Domains** → Add `demo.revyx.app`
2. Adaugă în registrar DNS:
   - Tip: `CNAME` · Nume: `demo` · Țintă: `cname.vercel-dns.com`
3. Aștepți validare TLS (~5 min).

---

## 3. Operational flow (după setup)

| Eveniment | Ce se întâmplă automat |
|---|---|
| PR deschis cu modificări în `apps/web-preview/**` | Vercel construiește preview deploy → comentează URL în PR (~2 min) |
| Push nou la branch-ul PR | Preview re-built; URL-ul rămâne stabil per PR |
| PR merged în `main` | Production deploy → `revyx-web-preview.vercel.app` (sau `demo.revyx.app` post-DNS) |
| Schimbare doar în `docs/**` sau alte path-uri | "Ignored Build Step" → skip; CI rămâne neimpactat |
| `web-preview-ci` GitHub Action fail | PR merge blocat (CI required check); fixare necesară înainte de re-attempt deploy |

**Important:** preview URLs sunt **publice by default** pe planul Hobby. Pentru demo non-public (NDA pitches), upgrade la Vercel Pro cu Deployment Protection (`$20/lună`).

---

## 4. Troubleshooting

| Simptom | Cauză probabilă | Fix |
|---|---|---|
| Build fail `No Output Directory named "public" found` | (a) Root Directory ≠ `apps/web-preview` SAU (b) framework preset = "Other" în UI (override din vercel.json) SAU (c) vercel.json setează `outputDirectory` explicit (interfer cu builder `@vercel/next`) | (a) Vercel Settings → Git → Root Directory = `apps/web-preview` · (b) Settings → General → Framework Preset = **Next.js** · (c) elimină `outputDirectory` din `vercel.json` (vezi v1.0.1 changelog) |
| Build fail "Cannot find module" | Root Directory greșit | Vercel Settings → Git → Root Directory = `apps/web-preview` |
| Preview URL 404 pe rute dinamice (`/leads/[id]`) | Next.js output mode greșit | Asigură-te că NU e setat `output: 'export'` în `next.config.mjs` (necesită SSR pentru `/leads/[id]`) |
| Build OK dar paginile arată unstyled | `design/tokens.json` nu e în git | Verifică `git ls-files design/tokens.json` |
| CI pass dar Vercel fail | Node version mismatch | Vercel Settings → General → Node.js Version = 22.x |
| Toate buildurile sunt skip-uite | Ignored Build Step prea agresiv | Settings → Git → Ignored Build Step → click "Override" și seteaz-o conform §2.2.4 sau lasă gol |

---

## 5. Security headers (default applied)

Setați în `apps/web-preview/vercel.json`:

| Header | Valoare | Motiv |
|---|---|---|
| `X-Frame-Options` | `DENY` | Previne clickjacking (demo neembed-able) |
| `X-Content-Type-Options` | `nosniff` | MIME sniff protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Reduce leak referrer cross-site |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Demo nu cere device permissions |

CSP completă (`Content-Security-Policy`) e amânată pentru M1.S5 când avem API endpoints reale + nonce strategy în RSC.

---

## 6. Cross-references

- `apps/web-preview/vercel.json` — config consumat de Vercel
- `.github/workflows/web-preview-ci.yml` — CI build gate paralel
- `docs/ROADMAP_REVYX_detailed-execution_v1.0.2.md` §3.3 T-M0.S3-14 — custom domain task (M0.S3)
- `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §7 — implementation contract `apps/web-preview/`

---

## 7. Approval

| Aprobator | Sign-off | Data |
|---|---|---|
| DEVOPS | ✅ (setup procedure validated) | 2026-05 |
| FRONTEND WEB DEV | ✅ (vercel.json + ci workflow validated locally with `next build`) | 2026-05 |
| Senior PM | ⬜ pending Vercel project creation | — |

---

*docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.1.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
