# RUNBOOK — Demo Deploy (Vercel)
<!-- RUNBOOK_REVYX_demo-deploy_v1.0.2.md · v1.0.2 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M0.S2 (early bring-forward) + ★ **M0.S3 T-M0.S3-14** (Vercel deploy + custom domain `demo.revyx.app`)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (M0)
**Trigger v1.0.2:** ★ M0.S3 ✅ CLOSED — physical directory `apps/web-preview/` retained pentru Vercel Root Directory stability (Regula 10 nouă, CLAUDE.md §10b). Package semantic upgrade in-place la `@revyx/web-preview@0.2.0` cu mock 100/50/20, i18n RO/RU/EN, drag-drop @dnd-kit. DNS step `demo.revyx.app` (T-M0.S3-14) documentat §2.3 — neblocant pentru deploy current.

## 0.1 Platform Matrix

🌐 Web only (DP-01) — Vercel deploy servește exclusiv `apps/web-preview/` (Next.js). Mobile (M2.S3) folosește pipeline distinct (Expo EAS).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DEVOPS + FRONTEND WEB DEV + Senior PM | Initial — Vercel GitHub App integration pentru `apps/web-preview/`. |
| 1.0.1 | 2026-05 | DEVOPS | PATCH — fix Next.js detection issue. Eliminat `outputDirectory` din `vercel.json`. |
| **1.0.2** | **2026-05** | ★ DEVOPS + FRONTEND WEB DEV + Senior PM + ARCHITECT | ★ **PATCH — M0.S3 semantic promote (in-place), Regula 10 nouă, DNS step**. Schimbări: (1) §1 deploy-stability rule (Regula 10) — physical path `apps/web-preview/` retained; semantic upgrade prin `package.json` name + version only. (2) §2.3 DNS step `demo.revyx.app` (CNAME → `cname.vercel-dns.com`, TLS auto-issue Let's Encrypt ~5 min). (3) §4 troubleshooting adăugat 3 simptome noi (Root Directory mismatch post-rename, lockfile out-of-sync, HTTPS cert pending). (4) §6 cross-references actualizate cu Roadmap v1.0.3. **Lecție învățată M0.S3 first attempt:** un git mv `apps/web-preview/` → `apps/web/` a rupt deploy-ul Vercel (Root Directory încă apuntă la path-ul vechi); revenit la in-place upgrade pentru a evita intervenție UI Vercel. |

---

## 1. Scope

Acest runbook documentează **configurația one-time** + procedurile recurente pentru deploy automat al demo-ului M0 pe Vercel:

| Obiectiv | Output |
|---|---|
| Preview URL automat per PR | Vercel postează URL în PR comments |
| Production deploy pe push `main` | `revyx-web-preview.vercel.app` (apoi `demo.revyx.app` post-DNS, §2.3) |
| Build-check CI gate | `.github/workflows/web-preview-ci.yml` — typecheck + build |
| Security headers default | `apps/web-preview/vercel.json` (CSP-light: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |

> **★ Regula 10 deploy-stability (CLAUDE.md §10b):** physical directory `apps/web-preview/` este sealed pentru M0 — Vercel Root Directory rămâne fix. Semantic upgrade-uri (M0.S2 / M0.S3 / M0.S4) se fac **in-place** prin `package.json` name + version, fără git mv pe directoare deploy-critical. Orice rename necesită update sincron al Root Directory în Vercel UI **înainte** de merge.

**Out of scope:** mobile app deploy (Expo EAS, M2.S3); production backend M1+ (separate deployment unit).

---

## 2. One-time setup (PM / DevOps acțiune manuală)

> **Cine face:** Senior PM cu acces la GitHub org `DevPrimeTek` + Vercel account.
> **Cât durează:** ~10 minute (initial creation) + ~5 minute (DNS step §2.3).
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
| **Root Directory** | **`apps/web-preview`** (CRITIC — click "Edit" sub Root Directory) |
| Build Command | (folosește default → `npm run build`) |
| Install Command | (folosește default → `npm ci --no-audit --no-fund`) |
| Output Directory | (default `.next`) |
| Node.js Version | **22.x** (match cu CI) |

5. **Environment Variables** — nimic obligatoriu pentru M0 demo (toate datele sunt mock inline).
6. Click **Deploy** — primul build durează ~2-3 min.

### 2.2 Verificare integrare GitHub App

După primul deploy reușit:

1. Mergi la Vercel project → **Settings** → **Git**
2. Verifică că **"Connected Git Repository"** = `DevPrimeTek/REVYX.app`
3. **Production Branch** = `main`
4. **Ignored Build Step** (opțional dar recomandat):

   ```bash
   git diff HEAD^ HEAD --quiet -- apps/web-preview design/tokens.json
   ```

   (exit code 0 = no changes in path → skip build; exit code 1 = changes → build)

### 2.3 ★ Custom domain `demo.revyx.app` (M0.S3 T-M0.S3-14)

> **Status:** M0.S3 ✅ CLOSED → acest step este ACUM unblocked pentru execuție PM.

**Pre-requisite:** acces DNS la zona `revyx.app` (registrar — Cloudflare/Namecheap/GoDaddy per ITPRO SYSTEM SRL).

1. **Vercel** → project → **Settings** → **Domains** → click **Add**
2. Introdu `demo.revyx.app` → Add
3. Vercel afișează DNS record țintă:
   - **Type:** `CNAME`
   - **Name:** `demo`
   - **Value/Target:** `cname.vercel-dns.com`
   - **TTL:** Auto (sau 300s)
4. **Registrar / DNS provider** — adaugă record-ul în zona `revyx.app`
5. Înapoi la Vercel → așteaptă "Valid Configuration" (~30s-5min propagare DNS)
6. Vercel auto-issues TLS cert via Let's Encrypt (~2-5min după DNS valid)
7. Verifică HTTPS: `curl -I https://demo.revyx.app` → `HTTP/2 200`
8. Test smoke: deschide `https://demo.revyx.app` → trebuie să arate landing REVYX (page `/`)
9. Test language switcher: RO → RU → EN persistă pe refresh (localStorage `revyx.locale`)
10. Test drag-drop: `https://demo.revyx.app/deals` → grab card → drop pe altă coloană → toast confirmare

**Rollback:** dacă domain attach eșuează, Vercel project rămâne accesibil la URL-ul auto (`*.vercel.app`); demo continuă să funcționeze fără întrerupere.

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
| Build fail `The specified Root Directory "apps/X" does not exist` | Path renamed în git **fără** sync cu Vercel Settings UI | (a) Revert rename: `git mv apps/X apps/web-preview` SAU (b) Vercel Settings → General → Root Directory → edit la noul path. Regula 10 cere evitarea acestui scenariu. |
| Build fail `No Output Directory named "public" found` | (a) Root Directory greșit · (b) framework preset = "Other" · (c) vercel.json setează `outputDirectory` explicit | (a) Settings → Git → Root Directory = `apps/web-preview` · (b) Settings → General → Framework Preset = **Next.js** · (c) elimină `outputDirectory` din `vercel.json` (vezi v1.0.1) |
| Build fail "Cannot find module @dnd-kit/core" | Lockfile out of sync după adăugare deps | În `apps/web-preview/`: `rm -rf node_modules package-lock.json && npm install` apoi commit + push |
| Preview URL 404 pe rute dinamice (`/leads/[id]`) | Next.js output mode greșit | Asigură-te că NU e setat `output: 'export'` în `next.config.mjs` (necesită SSR pentru `/leads/[id]`) |
| Build OK dar paginile arată unstyled | `design/tokens.json` nu e în git | `git ls-files design/tokens.json` |
| CI pass dar Vercel fail | Node version mismatch | Vercel Settings → General → Node.js Version = 22.x |
| Toate buildurile sunt skip-uite | Ignored Build Step prea agresiv | Settings → Git → Ignored Build Step → click "Override" și seteaz-o conform §2.2.4 sau lasă gol |
| DNS valid dar HTTPS 526 / TLS error | Cert nu s-a issued încă | Așteaptă 5-10 min; Vercel auto-retry. Dacă persistă >30 min: Vercel Settings → Domains → click domain → "Refresh" |
| Language switcher RO/RU/EN nu persistă pe refresh | `localStorage` blocat (private mode, ITP) | Test în Incognito → verifică browser console pentru SecurityError. Fallback intenționat la RO. |

---

## 5. Security headers (default applied)

Setați în `apps/web-preview/vercel.json`:

| Header | Valoare | Motiv |
|---|---|---|
| `X-Frame-Options` | `DENY` | Previne clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniff protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Reduce leak referrer cross-site |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Demo nu cere device permissions |

CSP completă (`Content-Security-Policy`) e amânată pentru M1.S5.

---

## 6. Cross-references

- `apps/web-preview/vercel.json` — config consumat de Vercel
- `.github/workflows/web-preview-ci.yml` — CI build gate paralel
- `docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md` §3.3 T-M0.S3-01..14
- `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §7 — implementation contract
- `apps/web-preview/README.md` — quick start + folder map + user journeys + i18n notes
- `CLAUDE.md` §10b Regula 10 — deployment verification mandatory

---

## 7. Approval

| Aprobator | Sign-off | Data |
|---|---|---|
| DEVOPS | ✅ (v1.0.2 deploy-stability rule + DNS step + 9 troubleshooting rows) | 2026-05 |
| FRONTEND WEB DEV | ✅ (v1.0.2 in-place upgrade verified: typecheck + lint + build pass 16 routes, 14 routes HTTP 200 pe dev server, 100 leads + 50 props + 20 deals rendered) | 2026-05 |
| ARCHITECT | ✅ (Regula 10 introducere) | 2026-05 |
| Senior PM | ⬜ pending DNS execution `demo.revyx.app` | — |

---

*docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.2.md · v1.0.2 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
