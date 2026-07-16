# CLAUDE.md — REVYX Agent Operating System
<!-- CLAUDE.md · v1.2.37 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> Acest fișier este citit de Claude Code la **fiecare sesiune** din acest repo.
> Conține contextul minim necesar pentru a lucra corect pe REVYX fără brief repetat.

---

## ★ 0z. Principii fundamentale de execuție — Karpathy Guidelines (v1.2.30)

> **Bază pentru toate proiectele.** Skill: `.claude/skills/karpathy-guidelines/SKILL.md` (sursă MIT `multica-ai/andrej-karpathy-skills`). Aceste 4 principii au **prioritate** la orice conflict de stil de execuție. Tradeoff: prudență > viteză; pentru sarcini triviale, judecată.

1. **Think Before Coding** — Nu presupune. Dacă există mai multe interpretări, prezintă-le, nu alege în tăcere. Dacă ceva e neclar, oprește-te și întreabă.
2. **Simplicity First** — Minimul de cod care rezolvă problema. Niciun feature/abstracție/configurabilitate necerută. „Ar spune un senior că e prea complicat?"
3. **Surgical Changes** — Atinge doar ce trebuie. Nu refactoriza ce nu e stricat, respectă stilul existent, curăță doar orfanii pe care schimbarea ta i-a creat. Fiecare linie schimbată se leagă direct de cerere.
4. **Goal-Driven Execution** — Definește criterii de succes verificabile + plan scurt cu checkpoint-uri; buclează până la verificare.

**Mapping cu Regulile existente §10b:** P1 ⊇ Regula 16 (întrebări cu opțiuni) · P2 ⊇ Regula 17 (token/optimizare) + Regula 18 (no proliferation) · P3 = principiu nou explicit (modificări chirurgicale) · P4 ⊇ Regula 2/4 (self-review + verificare post-commit). În caz de tensiune între aceste principii și o regulă locală, **principiile primează** (sunt baza), iar regula locală se aplică în detaliu.

---

## 0a. STATUS EXECUȚIE (LIVE) ★ v1.2.30

> Single source of truth pentru "unde suntem ACUM". Actualizat la fiecare sesiune `/sN`.
> Pentru detaliu complet → `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §0.

| Atribut | Valoare curentă |
|---|---|
| **Macro-milestone activ** | ★ **M1 — MVP Funcțional** (M0 ✅ CLOSED prior; M1.S1 ✅ Phase 0 Security; M1.S2 ✅ Phase A Foundation; M0.S6/S7 ✅ Demo Polish; M0.S8 ✅ Rental/Lease support + Regula 20; M0.S8.1 ✅ post-merge polish; ★ **M0.S8.2 ✅ CLOSED — Kanban redesign (card 2 zone) + Workspace Direction (filtru global sale/rent/both per cabinet) + Regula 21 (documentația mereu sincronizată)**). Următor: **M1.S3** (Phase B Lead Intake + Scoring engines cu calibration_profile sale/rent). |
| **Sesiune curentă** | ★ **DEMO PROMOTION ✅ — Kit promovare demo + mecanism feedback self-service (paralel M1.S3).** Director Marketing (P) + FRONTEND WEB DEV (S) + DOC. Fondator solo → scop: promovarea demo-ului live + colectare feedback **fără implicarea fondatorului în discuții cu agențiile** (principiul „Founder Firewall"). ★ **Cod `apps/web-preview/` (mecanism, nu feature de produs):** widget feedback global (buton plutitor mereu vizibil + nudge automat după ≥4 ecrane distincte, o dată/browser) + ghid bun-venit prima vizită (4 pași auto-explorare, absent pe `/`+`/login`) — `components/feedback/{feedback-widget,welcome-guide}.tsx` + `lib/{feedback-store,feedback-config}.ts` (localStorage, useSyncExternalStore, URL Tally din env `NEXT_PUBLIC_TALLY_FEEDBACK_URL`) + wire în `providers.tsx` (o singură dată → toate cele 26 ecrane) + chei i18n `feedback.*`/`welcome.*` × RO/RU/EN. ★ **Docs NEW `docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/` (4 fișiere):** README (Founder Firewall + flux), FEEDBACK_FORM_TALLY (8 întrebări gata de lipit + setup env Vercel, referențiat de cod), PROMO_CONTENT_PACK (copy RO/RU copy-paste: WhatsApp/FB/Telegram/LinkedIn/follow-up), EXECUTION_PLAN (setup unic ~30 min fondator + cadență ~45 min/săpt). Tests: typecheck PASS (1 TS5101 pre-existent) · lint PASS (1 OD-01) · build PASS **26 routes** · i18n-check 0 duplicate · smoke rute 200 + widget/ghid prezente. Backend `apps/api/` + Master Plan + BRD **INTACTE** (Regula 6 + 8 + 11 + 12 + 18 + 21). CLAUDE.md v1.2.37 → **v1.2.38**. Trigger: fondator solo „Director Marketing — promovează demo + colectează feedback ca să mă descarc". | ★ **LANDING FONT FIX ✅ — bugfix Cyrillic font mismatch RO/RU pe `apps/web-landing` (site marketing public revyx.app).** Senior Manual Tester + FRONTEND WEB DEV. `apps/web-landing/` e site-ul public de marketing (port 3001, Next.js 14, i18n RO/RU propriu în `lib/content.ts`) — **distinct de demo-ul `apps/web-preview/`** și **anterior necitat în CLAUDE.md/Roadmap/INDEX**. Audit manual live (Playwright, fonturi reale servite din Google Fonts via route interception) a găsit: `globals.css` seta global `h1,h2,h3 { font-display }` (Bebas Neue) — font fără glife Cyrillic (0 subset-uri Cyrillic în CSS-ul Google Fonts servit, verificat). Rezultat: `h1` hero + 7× `h2` de secțiune randau corect în RO (Bebas Neue condensat all-caps) dar cădeau pe fallback system sans complet diferit vizual în RU (Oswald/Impact nu erau nici ele încărcate). Fix surgical: `h1,h2,h3` → `font-body` (Montserrat, Cyrillic nativ) + `font-weight: 700`, aliniat cu `design/tokens.json` typography.scale (h1/h2 family=body weight=700 — single source of truth brand). Bebas Neue rămâne corect pe wordmark logo static + cifre KPI (`01`/`02`/`03`), singurele locuri unde nu apare text tradus. Verificat live cu fonturi de producție: RO și RU randează acum identic (Montserrat Bold), zero regresie de simetrie/overflow pe 1440px + 375px, ambele limbi. Tests: typecheck PASS · lint PASS (1 warning pre-existent `no-page-custom-font`, neintrodus de fix) · build PASS 5 routes identic. Backend + `apps/web-preview/` + Master Plan **INTACTE**. CLAUDE.md v1.2.36 → **v1.2.37**. | ★ **DEMO UX FIX ✅ — ajustări post-audit Senior Manual Tester (bugfix `apps/web-preview`, demo freeze parțial).** Senior Manual Tester + FRONTEND WEB DEV. Fix findings HIGH/MED/LOW din auditul UX manual live (Playwright, 26 rute): (1) **Nav** `site-nav.tsx` — `whitespace-nowrap` + `shrink-0` + padding `px-sp3→px-sp2` + tagline `hidden 2xl:inline` + Manager/Admin mutate în „Mai mult" → **eliminat overflow orizontal 127px pe TOATE paginile** (0px la 1280/1366/1440/1920; 1024 tablet rămâne M2 — necesită meniu colapsabil). (2) **Deal cards** `kanban-board.tsx` — Cost/Comision/Agent stivuite vertical (label deasupra valorii, rând propriu la lățime completă) → suma comisionului + numele agentului nu se mai truchează la 6 coloane; intent „Vânzare" fără trunchiere. (3) **Notary** `lib/mock/closure-states.ts` + `notary-acts.ts` — numere act/cadastru **unice per deal** (anterior toate identice `NA-2026-04217`/`CR-9384-2026`) + pool vânzători + ore programare variate. (4) **Dashboard** `app/dashboard/page.tsx` — eliminat propoziție duplicată în card „Lead-uri urgente" + etichete vestigiale A/B/C. (5) **Intake i18n** `messages/ro.json` — eliminat leak acronim `BR-01` + `Lead Score ≥ 0.30` din UI (Regula 11). Nemodificat intenționat: data `mm/dd/yyyy` pe lead detail = artefact browser en-US (input nativ `type=date` urmează locale user RO/RU → dd.mm.yyyy automat). Tests: typecheck PASS · lint PASS (1 OD-01) · build PASS **26 routes** · smoke live Playwright 24/24 rute 200 + **0× overflow orizontal** global. Backend `apps/api/` + Master Plan + BRD **INTACTE** (Regula 8 + 21). CLAUDE.md v1.2.35 → **v1.2.36**. | ★ **P0 ✅ CLOSED — „Fundația de convergență" (pre-M1.S3, cf. ARCH_REVIEW_REVYX_full-stack_v1.0.0 §5).** Software Architect + BACKEND DEV + FRONTEND WEB DEV + DEVOPS. Refactor PUR (zero schimbare comportament): (1) **monorepo npm workspaces** — root package.json + single root lockfile; CI install la root; Vercel Root Directory NEATINS. (2) NEW **`packages/core` (@revyx/core)** — enums domeniu + helpers transaction-intent partajate (demo consumă via transpilePackages; lib re-exports; apps/api adoptă M1.S3). (3) **scoring split** `engine.ts` (producție) vs `fixtures.ts` (doar T01..T07) — 22/22 PASS. (4) NEW **CI i18n gate** `.github/scripts/check-i18n.mjs` (duplicate=FAIL · paritate RO↔RU/EN=WARNING până M1.S5/D-6). ★ **Politică PM activă: DEMO FREEZE PARȚIAL** — `apps/web-preview/` primește doar bugfix-uri; feature nou în demo DOAR cu aprobare PM explicită per caz; restul merge pe traiectoria backend M1.S3+. Tests: typecheck/lint/build PASS ambele apps · 26 routes identic · dev smoke 7/7 200 + probe POZITIV. Roadmap v1.0.16 → **v1.0.17** (§4.6 T-P0-01..04 ☑) · INDEX v1.1.26 → **v1.1.27**. Regula 8+18+21 ✓. | ★ **M0.S9 — AGI Layer Val 1 „Calificarea ghidată" (SCHELET VIZUAL).** Solution Architect + Senior PM. Cunoașterea de teren (BRD §17/§18) tradusă în funcționalități care descarcă agentul de rutină. NEW `docs/ARCH_REVYX_agent-routine-capability-map_v1.0.0.md` (model „Operating Loop" + §6 datorie D-1..D-7). `apps/web-preview/` (zero backend): Buyer Needs Assessment (buget explicit declarat/confirmat + bancă + must-sell + posesie + deal-breakers) · Financial Readiness badge (înlocuiește leak `BR-25`) · Execution Guides „Cum fac asta?" (9 ghiduri RO: apel+obiecții+10 pași) · Qualification Wizard 10 pași seller · wire `/leads/[id]` + i18n RO `needs/guide/qualification`. **★ DATORIE URMĂRITĂ:** schelet localStorage → **revenim curând la structura avansată** (entități reale + scoring service + Val 2-4), vezi ARCH §6. Tests: typecheck/lint/build PASS **26 routes** · smoke 5/5 200 · 0× `BR-25`. Regula 8+18+21 ✓. | ★ **M0.S8.2 ✅ CLOSED — Kanban redesign + Workspace Direction + Regula 21.** Creative Director + Senior UI/UX + Senior PM. (1) **Kanban redesign** „card 2 zone clare" (`kanban-board.tsx`): client+adresă sus / divider / metrici jos (dot intent + dot sănătate + comision); culoare stage doar pe header coloană; eliminat haosul de badge-uri + dt/dd labels. (2) **Workspace Direction NEW** (`lib/workspace-store.ts` + `components/cabinet/workspace-direction-selector.tsx`): toggle global `sale|rent|both` din cele 3 cabinete; ascunde automat tot ce nu corespunde în `/leads` + `/properties` + `/deals` + `/notary`. (3) **NEW Regula 21** (documentația mereu up-to-date la orice schimbare, în același PR) + **Regula 20 §9** (Workspace Direction: demo toggle global / producție ierarhic companie→grup→agent). (4) **i18n RO** NEW namespace `workspace.*`. Tests: typecheck PASS · lint PASS (1 OD-01) · build PASS **26 routes** · dev smoke 7/7 routes 200. Roadmap v1.0.11 → **v1.0.12**; INDEX v1.1.17 → **v1.1.18**; CLAUDE.md v1.2.20 → **v1.2.21**. Backend `apps/api/` + BRD §7 + Master Plan **INTACTE** (Regula 8 + 18 + 21). | ★ **M0.S8 ✅ CLOSED — Rental/Lease support (Documentație + Demo full alignment).** PM identified market gap: REVYX acoperea doar sale (buy/sell) — chiriile (rent/lease) ~30% din volum imobiliar RM erau în afara framework. Software Architect + Senior BA + Senior PM trio: design type-agnostic core + calibration_profile (sale|rent) ca FK extension; zero modificări la formulele BRD §7 (LS/PS/IS/DP/DHI/NBA/APS rămân single source of truth) + 2 row-uri în tabelă mică `transaction_profiles` (TF_horizon=180d sale / 21d rent; RF=financing-heavy sale / credit-check rent; commission %preț sale / 1× chirie rent). Schimbări `apps/web-preview/` (zero backend modificat — Regula 8): (1) **Types extended:** `lib/mock/types.ts` — `LeadType = 'buyer'|'seller'|'tenant'|'landlord'` (Hybrid 4 enum flat + helper) · NEW `TransactionIntent = 'sale'|'rent'` · NEW `LeadSide = 'demand'|'supply'` · NEW `ListingType = 'sale'|'rent'|'both'` · Lead `rentPeriodMonths` · Property `listingType + monthlyRentEur`. (2) **Helper NEW** `lib/transaction-intent.ts` — `transactionIntent(leadType)` + `leadSide()` + `isDemandSide/isSupplySide()` + `isListingMatchForLead()` — single source pentru derivare intent. (3) **Mock data:** leads distribution 48% buyer + 22% seller + 22% tenant + 8% landlord (smoke 100 leads: 51 buyer / 24 tenant / 20 seller / 9 landlord) · properties listingType 60% sale + 25% rent + 15% both (smoke 50: 24 sale / 9 rent / 6 both) · monthlyRentEur ≈ priceEur × 0.65% + variation · rent profile commission = 1× chirie. (4) **Component reuse intent-aware** (DRY): `BuyerPreferencesPanel` servește buyer+tenant cu pool features adaptiv + i18n keys `preferences.titleRent/descRent` · `SellerPropertyPanel` servește seller+landlord cu price labels adaptive (`seller.priceLabel`/`landlord.monthlyRentLabel`) + rent period display · `MatchPodium` afișează `€/lună` pentru rent + filter `isListingMatchForLead` · `match-reasoning` budget compare contra monthlyRentEur pentru rent · suggestions per-(status+leadType) — supply leads primesc `request_documents` priority (mandat + cadastru pentru sale / acord proprietar + cadastru pentru rent). (5) **Pages adaptive:** `/leads` filter extins 4→5 tabs (Toate/Cumpărător/Vânzător/Chiriaș/Proprietar) + badge variant per type (info/updated/success/warning) · `/leads/[id]` switch pe `isDemandSide()` (vs `isBuyer` legacy) — buyer + tenant primesc match podium · seller + landlord primesc property panel · header badge intent (Vânzare/Închiriere) + budget label adaptive · `/properties` NEW filter listing type 4 tabs (Toate/De vânzare/De închiriat/Vânzare+chirie) + card price display dual (sale + rent inline) · `/properties/[id]` NEW field `Tip listare` Badge + `Chirie lunară` field conditional. (6) **Notary acts:** filtered pentru sale only (rental lease agreements scope M1.S6+; rental deals OK în pipeline cu commission diferit). (7) **i18n RO extins** cu 6 namespaces noi: `leadType.tenant/landlord` + `transactionIntent.sale/rent` + `landlord.*` (8 keys) + `preferences.titleRent/descRent` + `property.listingTypeFilterLabel + listingType.*` + `property.detail.monthlyRentLabel/listingTypeLabel` + `leadDetail.budgetRent + matchSubtitleTenant`. RU/EN deferred M1.S5 (fallback EN existing). **Tests primary post-fix:** `npm run typecheck` PASS (0 errors, 1 pre-existing TS5101 baseUrl warning) · `npm run lint` PASS (1 pre-existing OD-01 font warning) · `npm run build` PASS **26 routes** (identic M0.S7) · `npm run dev` smoke 9/9 routes HTTP 200 + content probe POZITIV per lead type: L-1001 Chiriaș (4× /lună + Buget chirie lunară + Preferințele chiriașului + Top 3 oferte de chirie + Închiriere badge) · L-1100 Proprietar (Proprietatea pentru închiriere + Chirie lunară + Perioadă contract + Închiriere) · L-1003 Cumpărător (Top 3 proprietăți + Vânzare) · L-1009 Vânzător (Proprietatea de vânzare + Preț cerut + Vânzare). Properties: 24 De vânzare + 9 De închiriat + 6 Vânzare+chirie. Deep link `/leads?type=tenant` → 24 chiriași filtered. **NEW Regula 20** în §10b — segregare 4 lead types + transaction_profile concept type-agnostic core + 2 calibration profiles (sale 180d/financing/%preț, rent 21d/credit-check/1× chirie); BR-01 Lead Firewall, BR-04 max 3 task, BR-12 single session, BR-07 audit-log toate aplicabile uniform pe ambele profiles. Roadmap bump v1.0.9 → **v1.0.10** (§3.8 NEW T-M0.S8-01..07 atomic tasks ☑); INDEX bump intern v1.1.13 → v1.1.14; CLAUDE.md v1.2.18 → **v1.2.19** §0a sync + Regula 20 NEW. Backend `apps/api/` + BRD §7 + scoring/fixtures.ts T01..T07 + Master Plan **INTACTE** — Regula 8 + Regula 18 compliance respectate. **Rental gap închis → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED cu support nativ pentru ambele profiles**. | ★ **M0.S7 ✅ CLOSED — Dashboard rework + task management + lead notes/documents + cabinet enrichment.** PM feedback run-2 (5 puncte) implementat full-stack-of-demo. Framework grounding (ARCHITECT pre-implement read): BRD §5 Pilon 04+07 + TECH_SPEC nba-engine §4.1 (9 task_type + lifecycle PENDING/ACTIVE/COMPLETED/SNOOZED + BR-04 max 3) + TECH_SPEC deal-closure §4.3 (8 document_type) — toate primitives există în framework, demo reused 1:1 fără TECH_SPEC nou. Decision PM: localStorage > backend wire (rapid iteration; M1.S5 final wire-up). Schimbări `apps/web-preview/`: (1) **Dashboard rework în 6 blocuri A-F:** A sarcini sumar (3-slot dots + link Deschide programul); B lead-uri urgente cu deep link `/leads?priority=urgent` (Block apăsabil); C performanță; D `Programul meu de azi` (ToDo real interactive — mark complete/snooze, max 5 rows + buton add); E `Sugestii pentru lead-urile mele` (per-lead actions via `<LeadSuggestions>` — fiecare click `+ Adaugă în sarcini` creează task PENDING cu rationale 1-line); F decizii rapide 4 butoane. Eliminat block duplicat „Lista de azi". (2) **NEW `/tasks` full-time management page** — filtre Azi/În lucru/Finalizate/Toate + modal `Adaugă sarcină nouă` (validează BR-04 max 3 active cu toast). Link `Sarcinile mele` adăugat în site-nav primary. (3) **5 reusable components NEW** sub `components/tasks/{task-list,task-modal,lead-suggestions}.tsx` + `components/leads/{notes-panel,documents-panel}.tsx`. (4) **4 stores/data NEW:** `lib/task-store.ts` (useSyncExternalStore + localStorage + BR-04 enforce); `lib/lead-extras-store.ts` (notes + documents per lead); `lib/mock/tasks.ts` (5 seed tasks pe A-001 cu mix de statuses); `lib/mock/suggestions.ts` (per-lead-status NBA-style rule: HOT→[first_contact,schedule_showing], qualified→[follow_up,send_property], warm/nurturing). (5) **Lead detail rework:** eliminat Engagement/Win chance buckets (deadcode șters) → înlocuit cu `<LeadSuggestions>` (sistemul îți spune ce să faci) + NEW secțiuni `Note despre client` (textarea cu autor + timestamp) + `Documente client` (modal de atașare + 5 tipuri document: identity_proof/cadastre_extract/contract_preliminary/energy_certificate/other). Lead deep link `/leads?priority=urgent` suportat via useSearchParams + Suspense boundary. (6) **Cabinet agent enrichment:** hero card cu avatar gradient gold (initials AC) + bio inline + 3 CTAs (Sună/Mesaj/Distribuie profilul) + rating clienți (4.8/5 + 32 recenzii) + tranzacții totale lifetime (47+) + specialty tags (Centru/Botanica/Apartament/Casă). (7) **Cabinet agency + group:** secțiune intro descriptivă „Ce este cabinetul agenției/grupului" la top — clienții înțeleg diferența. (8) **Manager page polish:** APS/Trust/Slots/BR-XX stripped → înlocuit cu `Scor performanță` (dots tonate) + `Încredere clienți` + `Sarcini active` + InfoTooltip pe fiecare coloană tabel + escalation levels redenumite (Atenție/Urgent/Critic) + timing prietenos (15 min/45 min/2 ore 15 min). (9) **i18n RO/RU/EN extins** cu 3 namespaces noi: `task.*` (90 keys), `leadExtras.*` (35 keys), `cabinetExtras.*` (18 keys) + `dashboard.blocks.suggestionsTitle/tasksTodayTitle/openTasksPage` + `nav.tasks`. Backend `apps/api/` + BRD §7 + scoring/fixtures.ts T01..T07 + nba-engine + deal-closure specs **INTACTE** — Regula 8 Master Plan compliance respectată. **Tests primary post-fix:** `npm run typecheck` PASS · `npm run lint` PASS (1 pre-existing OD-01 font warning) · `npm run build` PASS **21 routes** (+1 `/tasks`) · `npm run dev` smoke 14/14 routes HTTP 200 + content probe POZITIV (Programul meu de azi 2× / Sugestii pentru lead 2× / Note despre client 2× / Documente client 2× / Adaugă în sarcini 2× / Scor performanță 4× / Încredere clienți 2× / Sarcini active 2×; 0× BR- / 0× SLA HOT / 0× Lead Score / 0× DP0. / 0× DHI0. / 0× APS / 0× Trust în UI agent). Roadmap bump v1.0.8 → **v1.0.9** (§3.7 NEW cu T-M0.S7-01..09 atomic tasks ☑); INDEX v1.1.12 → **v1.1.13** (NEW /tasks + 5 components + 4 stores + cabinet enrichment entry); CLAUDE.md v1.2.15 → **v1.2.16** §0a sync. **M0 Demo Polish run-2 încheiată → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**. | ★ **M0.S6 ✅ CLOSED — Demo Polish livrat (UI-only, backend M1.S2 intact).** Senior Designer + Creative Director feedback 8 puncte implementat: (1) **Tutorial în meniu** — NEW pagină `/tutorial` cu 7 secțiuni (dashboard + lead list + lead detail + properties + deals + cabinet + tutorial-future) + link în nav primar; producția (MVP) va folosi `<TutorialOverlay>` per ecran cf. Regula 13. (2) **Cabinet personal complet** — 3 noi pagini sub `/cabinet/{agent,agency,group}`: agent cu 4 tabs (sumar/istoric/preferințe/documente) + agenție cu date organizație + echipă + KPI 30 zile + grup cu leaderboard + cota proprie. Nav extins cu dropdown `Cabinet` (3 items). (3) **Denumiri clare în dashboard** — rescris în 4 blocuri A/B/C/D: `Sarcinile mele active` (max 3 cu progress dots + status text), `Lead-uri urgente` (count gigant + primul lead direct), `Performanța mea` (3 metrici dots ●●●/●●○/●○○ tonate), `Lista de azi` + `Ce poți face acum` (4 butoane decizie: Sună urgent / Listă completă / Tranzacții / Adaugă proprietate). Eliminat: `Ai 2/3 sarcini active (BR-04)` + `SLA HOT 12:34`. (4) **Lead list polishat** — info-tooltip (`<InfoTooltip>` NEW component cu popover ESC+outside-click) pe TOATE coloanele (id/name/source/zone/sla/priority/status) cu explicații 1-2 rânduri; filtru `Toate` evidențiat solid auriu (vs tab activ secundar); coloana LS → `Prioritate` cu badge `Foarte mare / Mare / Medie / Scăzută` (ascuns numeric 0.xx); `nurturing` → `Monitorizare automată`; filter sub-help text. (5) **Property detail page NEW** — `/properties/[id]` cu galerie 6 foto SVG placeholder + thumbnail nav, panou video tour, panou link public (`https://demo.revyx.app/p/p-xxxx` cu Open in new tab), specs grid 8 câmpuri, interest active 7d, panou acțiuni (Programează vizionare / Distribuie link / Editează). Properties listing cards click-through la detail (Card `interactive`). Statusuri LF redenumite: `Proaspăt/Învechire/Vechi` → `Anunț nou / De reîmprospătat / Necesită atenție` cu InfoTooltip + helper `lib/freshness.ts`. Properties/new: secțiune media nouă (upload area cu drag border + Video link + External link). (6) **Deals kanban refăcut** — per-stage color bar la top de card (5 culori distincte: blue/qualified/amber/gold/green) + ring drop indicator pe coloana hover. Cards arată acum **Client name + Property address + Comision + Stare badge** în loc de `L:L-1002 → P:P-1905 DP0.15 DHI0.49`. ELIMINATE butoanele Avansează/Înapoi — drag full-card direct via PointerSensor + KeyboardSensor. Health labels: `sănătos/de revizuit/risc` → `Pe drumul cel bun / Verifică / Atenție` cu InfoTooltip + help text 1 rând. Stage names păstrate (Descoperire/Calificat/Ofertă/Negociere/Notariat/Câștigat) cu InfoTooltip pe header. (7) **Manager/admin** deferred per directive. (8) **Formule complet ascunse în UI** — `score-badge.tsx` rescris cu `LeadPriorityBadge` (text-only label) + `MetricPill` (display string, no raw 0.xx); `ScorePill` legacy alias randează dots tonate. Backend (apps/api/) + docs (BRD §7 + scoring/fixtures.ts T01..T07) **NU se modifică** — single source of truth. **i18n RO/RU/EN rescrise complet** — 254 keys per limbă (vs 204 anterior), zero acronime user-facing (excepție WhatsApp/email/SMS canale standard). **Tests primary post-fix:** `npm run typecheck` PASS · `npm run lint` PASS (1 pre-existing warning OD-01 font cf. CLAUDE.md row "Open decisions") · `npm run build` PASS **20 routes** (18 static + 2 dynamic `/leads/[id]` + `/properties/[id]`, +4 față de M0.S3) · `npm run dev` smoke 12/12 routes HTTP 200 + content probe POSITIV (0× BR-04 / 0× SLA HOT / 0× Lead Score / 0× DP0. / 0× DHI0. / 0× `L:L-` în DOM; 34× `Monitorizare automată` / 11× `Pe drumul cel bun` / 12+28+32 freshness labels noi vizibile). Roadmap bump v1.0.7 → **v1.0.8** (§3.6 M0.S6 atomic tasks T-M0.S6-01..08 ☑); INDEX v1.1.11 → **v1.1.12** (cabinet/tutorial/property-detail entry + info-tooltip component); CLAUDE.md v1.2.14 → **v1.2.15** §0a sync. Backwards compat full cu M1.S2 backend (zero modificări `apps/api/`). **M0 Demo Polish entry încheiată → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**. | ★ **M1.S2 ✅ CLOSED — Phase A Foundation livrată.** Livrate atomic: (1) **T-M1.S2-01** — 9 migrations SQL noi în `apps/api/src/db/migrations/`: `0007_agents.sql` ALTER users + agent fields (agent_since_date/out_of_office_until/language_skills JSONB/calendar_sync_token) + partial index active agents · `0008_leads.sql` LEAD complet cu GDPR NOT NULL + LS_initial 0.300 + TS_initial 0.500 + firewall_state + scoring scaffold · `0009_properties.sql` PROPERTY cu generated `price_per_sqm_eur` + showcase_token UNIQUE · `0010_deals.sql` DEAL cu DP+DHI scaffold + closure_phase subset M1.S6-expandable · `0011_activities.sql` ACTIVITY append-source pentru IS/TS/NBA · `0012_tasks.sql` TASK + trigger PL/pgSQL `task_enforce_max_3_active` BR-04 · `0013_offers.sql` OFFER + trigger `offer_validate_counter_parent` T07 chain integrity · `0014_showings.sql` SHOWING + EXCLUDE gist agent calendar conflict cu graceful fallback btree_gist absent · `0015_scoring_state.sql` snapshot generic cu CHECK scale-aware NBA exception [0,2]. (2) **T-M1.S2-02** — 8 Drizzle schema TS noi paralele + extindere `users.ts` cu agent fields + `index.ts` exports. (3) **T-M1.S2-03** — 7 REST modules sub `apps/api/src/business/{leads,properties,deals,activities,tasks,offers,showings}/` × 4 fișiere (DTO Zod + Service cu optimistic locking + Controller cu `@Roles + @AuditEvent` + Module) + helper `apps/api/src/common/tenant-context.ts` cu `requireTenant(req)` enforced în toate query-urile WHERE `tenant_id = $1`. (4) **T-M1.S2-04** — Scoring fixtures `apps/api/src/scoring/{fixtures.ts, fixtures.spec.ts}` — T01..T07 ca const cu inputs + expected + brdRef + helpers `computeLeadScore/PropertyScore/DealProbability/Nba/Dhi/ListingFreshness/apsForAgent` + tests 10/10 PASS (T01 LS_initial 0.30 enforced; T02 NBA 100d ≈ e^-10; T03 DHI TF=0; T04 LF=0 @ 90d penalizes PS by exact LF weight 0.10; T05 APS_default 0.65 BR-11; T06 NBA max=2.0; T07 OFFER chain A→B→C→D linkage; +invariants NBA range + [0,1] clamp + LF curve). (5) **T-M1.S2-05** — Integration test infrastructure via `@testcontainers/postgresql` 10.28 (dev dep nou): `vitest.integration.config.ts` separat (skip default `npm test`, opt-in `npm run test:integration`); `apps/api/test/integration/setup.ts` cu `setupTestDb/teardownTestDb/seedTenant` helpers; 2 spec files: `migrations.spec.ts` (toate 14 tables + audit_log append-only enforcement + trigger BR-04 + offer counter-chain integrity) + `leads-tenant-isolation.spec.ts` (T01 default scores + cross-tenant 404 + optimistic locking version conflict). CI workflow extins cu job nou `integration` dependent pe `build`. (6) **T-M1.S2-06** — Doc bumps: Roadmap v1.0.6 → **v1.0.7** (§4.2 M1.S2 expandat cu T-M1.S2-01..06 atomic tasks ☑); INDEX v1.1.10 → **v1.1.11** (Roadmap v1.0.7 listed + apps/api M1.S2 extensions entry); CLAUDE.md v1.2.13 → **v1.2.14** §0a sync. **Tests primary:** `npm run typecheck` PASS, `npm run lint` PASS (0/0), `npm run test` PASS **22/22** (4 fișiere: roles.guard 3 + auth.dto 6 + webhook-hmac 3 + scoring/fixtures 10), `npm run build` PASS NestJS dist. Local `npm run test:integration` skip-uit (no Docker daemon în env curent) — runs în CI job `integration` pe GHA Ubuntu runners. **Phase A entry închisă → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**. | ★ **M1.S1 ✅ CLOSED — Phase 0 Security Foundation livrată.** Livrate atomic: (1) **T-M1.S1-01** — `docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md` — spec arhitectural complet 20 secțiuni acoperind stack NestJS+Drizzle+PostgreSQL+Redis + data model 6 entități (tenants, users cu enum user_role 5 system roles aditiv, refresh_tokens, audit_log, gdpr_consents, webhook_signatures) + API contracts (auth/refresh/logout/change-password/me + gdpr/access/portability/erase/restrict + webhooks/:provider + health) + JWT RS256 cu refresh rotation + replay detection (`rotated_at` + `parent_token_id` chain) + RBAC implementation + AUDIT_LOG middleware + HMAC verify + Throttler NFR-05/06 + OWASP Top 10 coverage + sign-off 5-rol. (2) **T-M1.S1-02** — `apps/api/` scaffold NestJS 10 + Fastify adapter + Drizzle ORM + Vitest + ESLint cu 22 source files (auth/rbac/audit/webhooks/gdpr/health/common/config/db modules + main.ts + app.module.ts). (3) **T-M1.S1-03** — 6 migrations SQL idempotente (0001 tenants + 0002 users cu enum role + 0003 refresh_tokens + ★ **0004 audit_log + trigger PL/pgSQL `audit_log_block_modify` defense-in-depth + REVOKE UPDATE/DELETE pe rol `revyx_app`** + 0005 gdpr_consents + 0006 webhook_signatures cu UNIQUE replay dedup) + Drizzle schema TS files paralele. (4) **T-M1.S1-04..08** — modules code: **AuthService** cu JWT RS256 jose lib + Argon2id password hash + refresh rotation + BR-12 single session enforce (revoke all active refresh tokens la login + change-password); **RolesGuard** global cu decorator `@Roles(Role.MANAGER)` aditiv; **AuditInterceptor** global APP_INTERCEPTOR cu decorator `@AuditEvent` + ad-hoc `req.auditEvent` pattern pentru guards pre-throw; **WebhookHmacGuard** timing-safe HMAC SHA-256 + dedup replay via UNIQUE (provider, signature); **GdprService** cu 4 endpoints Art. 15/17/18/20 (access/portability/erase/restrict) + queue placeholder M1.S3 cascade. (5) **T-M1.S1-09** — tests baseline 12/12 PASS (RolesGuard hierarchy 3 + Webhook HMAC computation 3 + Auth DTO Zod validation 6) + `.github/workflows/api-ci.yml` (typecheck+lint+test+build paralel pe `apps/api/**` cu Node 22 cache). (6) **Legal drafts** `docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md` (8 OD-legal-XX tracked) + `COOKIE_POLICY_REVYX_v0.1.0.md` (3 OD-cookie-XX tracked) pending consultant juridic review M1.S2 entry. **Tests primary post-fix:** `npm run typecheck` PASS, `npm run lint` PASS, `npm run test` PASS 12/12, `npm run build` PASS (NestJS dist gen). Stack TS/NestJS confirmat post-analiză comparativă cu Python/FastAPI + Go (decisiv: single-language full stack FE+Mobile+BE match-uiește single-dev constraint). **Phase 0 BLOCANT lifted** → M1.S2 entry UNBLOCKED. | Livrate atomic: (1) **T-M0.S5-01** — `docs/audit/HST_REVYX_m0_v1.0.0.md` — raport HST principal cu 9 categorii audit (§2.1 UX flow J1-J4 + §2.2 brand compliance + §2.3 presentation rehearsal + §2.4 message clarity vs BRD §5 piloni + §2.5 demo robustness build/typecheck/lint/i18n/drag-drop + ★ **§2.6 Regula 11 puritate i18n** grep RO/RU + ★ **§2.7 Regula 12 disciplina interacțiuni** grep `hover:` per componentă + ★ **§2.8 Regula 13 in-app tutorial coverage gap analysis** (13/13 pagini gap, MED tracked forward) + ★ **§2.9 Regula 14 overlap audit** pe 3 viewport canonice 1920×1080/1440×900/1024×768 × 14 pagini). 17 findings F-M0S5-01..17 catalogate: **0 CRIT · 2 HIGH (★ ambele FIXED acest PR) · 6 MED · 9 LOW**. Sign-off **8/8** (Audit Lead + Senior Architect + Senior Security Auditor + Senior QA / Test Architect + Senior Compliance Auditor + Senior Product Auditor + DESIGNER Creative Director + Senior PM). (2) **T-M0.S5-02** — `docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md` — detailed findings cu repro steps + cauză + fix code diff + verification + cross-ref per finding. (3) **T-M0.S5-03** — fix-uri imediate aplicate în acest PR: **F-M0S5-01 HIGH Regula 12** `apps/web-preview/components/ui/card.tsx` — introdus `interactive?: boolean` prop opt-in; hover translate și `cursor-pointer` aplicate DOAR când `interactive=true`; backward compatible (default false → toate Card existente devin static fără modificarea call-site-urilor M0). **F-M0S5-02 HIGH Regula 11** `apps/web-preview/messages/{ro,ru}.json` — 30 keys RO + 14 keys RU retraduse (Dashboard→Panou de bord/Панель управления; Sign out→Deconectare; Queue→Listă; Match needs review→Potrivire necesită revizuire; Won→Câștigat/Выигр.; Discovery→Descoperire/Поиск; healthy/review/risk→sănătos/de revizuit/risc и здоровая/проверка/риск; Fresh/Aging/Stale→Proaspăt/Învechire/Vechi и Новый/Стареет/Устарел; Match suggestions→Sugestii de potrivire; Top 3→Primele 3; Dashboard Manager→Panou Manager/Панель менеджера). Excepții acronime EN păstrate (LS/PS/IS/DP/NBA/DHI/APS/SLA/GDPR/RBAC/HOT/audit-log/lead-uri/WhatsApp). (4) **T-M0.S5-04** — sign-off matrix 7-rol + Senior PM = 8/8 documentat în HST §5. (5) **T-M0.S5-05** (TutorialOverlay POC) **decision deferred M1.S5** cu task explicit T-M1.S5-XX (cross-ref F-M0S5-14 MED forward-applying Regula 13). Argument: demo deck+video walkthrough M0.S4 acoperă tutorial scope pentru demo investor flow. **Tests primary post-fix:** `npm run typecheck` PASS, `npm run lint` PASS (1 pre-existing warning F-M0S5-10 LOW), `npm run build` PASS (15 routes static + 1 dynamic identic pre-fix). Regulile 1, 4, 6, 8, 9, 10, 11, 12, 13 (gap analysis only), 14 verificate ☑. **M0 EXIT GATE atins** → M1.S1 entry UNBLOCKED. |
| **M1.S1 (predecesor)** | ✅ CLOSED — Phase 0 Security Foundation livrată. JWT RS256 + RBAC 5 roluri + GDPR Art. 15/17/18/20 + AUDIT_LOG append-only + HMAC webhook + Throttler. |
| **Următoarea sesiune** | **M1.S3** — Phase B Lead Intake + Scoring engines. Hats: BACKEND DEV (P) + ML ENGINEER (P) + DBA (S) + TESTER (S) + DOC. Output: webhook intake real processing Meta/Google/OLX (parser per provider + dedup hash + LEAD INSERT) + scoring engines (LS recompute on event, IS calc din ACTIVITY, PS recompute cron, LF cron daily) + BR-01 Lead Firewall service (gate LS ≥ 0.60 + contact valid) + Escalation Protocol cron BR-03 (3 niveluri T+SLA → T+SLA+30min → T+SLA+2h) + GDPR erasure cascade BullMQ worker (LEAD anonymize → DEAL anonymize → ACTIVITY delete). Acceptance: T01..T07 verified end-to-end via integration tests + BR-01..BR-06 + BR-10..BR-12 all enforced. Probable token tier upgrade: Claude.ai Pro → Max post-F-S20-09 trigger CFO sign-off. |
| **Documentație rămasă** | 0 sesiuni doc-only (M1+ development active post-Phase 0 Security) |
| **Hard Stress Test M0** | ✅ PASS conditional (0 CRIT + 0 HIGH post-fix; 6 MED + 9 LOW) per `docs/audit/HST_REVYX_m0_v1.0.0.md` §5 sign-off 8/8 |
| **Hard Stress Test #2 (pre-dev)** | ✅ PASS clean S20 per `docs/audit/HST_REVYX_pre-dev_v1.0.0.md` §10 sign-off 7-rol |
| **Phase 0 Security checklist** | ✅ **COMPLETE M1.S1 ☑** — JWT RS256 + RBAC 5 roluri + GDPR Art. 15/17/18/20 + AUDIT_LOG append-only (trigger BD + REVOKE rol app) + HMAC-SHA256 webhook + Throttler NFR-05/06 + Privacy/Cookie drafts (legal review pending). Phase 0 BLOCANT lifted. |
| **Phase A Foundation checklist** | ✅ **COMPLETE M1.S2 ☑** — 9 entități business (LEAD/PROPERTY/DEAL/ACTIVITY/TASK/OFFER/SHOWING/AGENT-as-USER-extension/SCORING_STATE) cu migrations + Drizzle schemas + REST CRUD modules + scoring fixtures T01..T07 + integration test infra. Phase A entry închisă. |
| **★ Moldova market specifics** | ★ Documentate în BRD §17 v1.2.0 — 6 insight-uri [MOLDOVA-SPECIFIC]: buget declarat vs confirmat (divergență 15-25%) · tipuri întâlnire calificare (office/public_place/on_site — on_site auto-SHOWING) · pre-aprobare bancară cvasi-inexistentă (MoldIndConBank/Victoriabank/Mobiasbancă) · 90% modificare preferințe post-vizionare (preference_history JSONB[] + feedback 5 dim) · mandat exclusivitate sellers (30-90 zile, status tracking + cron) · property_class RM (soviet_era/post_soviet/new_build/premium). Roadmap T-MD-01..05 planificate M1.S3. |
| **Modul Claude activ** | M0.S7 ☑: DESIGNER (Creative Director, P) + FRONTEND WEB DEV (P) + ARCHITECT (S, framework alignment) + DOC + Senior PM. **M1.S3 next:** BACKEND DEV (P) + ML ENGINEER (P) + DBA (S) + TESTER (S) + DOC. |
| **Plan tariff** | Claude.ai Pro $20/lună (sustained M0 ☑; ★ Max $100/lună anticipat M1.S3 entry per F-S20-09 tracking — CFO sign-off pending la M1.S2 close) |
| **★ AGI Layer status** | ★ **DOCUMENTAT v1.4.0** — BRD §18 Agent Growth Intelligence: 7 gap-uri bibliografie (AGI-01..07) + ★ **3 extensii practici de teren (v1.4.0):** §18.9 Buyer Needs Assessment · §18.10 AGI-08 MLS/Cooperation · §18.11 AGI-09 Listing Price Discipline. BR-25..31 + 6 entități AGI (`execution_guides`/`client_alumni`/`agent_goals`/`ethics_checkpoints`/`cooperation_offers`/`buyer_assessments`) + IS/TS extensii. Task-uri T-AGI-01..10 + ★ T-ETH/T-MLS/T-BNA/T-LPD (§4.5). Implementare M1.S3-M1.S6. |
| **★ Etică profesională (NAR/APAIM)** | ★ **DOCUMENTAT v1.4.0** — Integrare 7 documente de teren client + NAR Code of Ethics (17 articole / 3 categorii) + APAIM (modelat după NAR; reprezentare exclusivă + cooperare + transparență). BRD §18.4 mapping complet NAR ↔ REVYX + Ethics Checkpoints 4→6 (Art.16 + Art.12). NEW `TECH_SPEC_realtor-ethics v1.0.0` + `TECH_SPEC_mls-cooperation v1.0.0`. Misiunea „a reaprinde încrederea în serviciul profesional Riѐltor". |
| **Master Plan status** | v1.1.2 active (Trio canonical: Master Plan v1.1.2 + Platform Matrix ★ **v1.1.0** + ★ **Detailed Roadmap v1.0.17** post-P0 convergence) · BRD ★ **v1.4.0** · INDEX ★ **v1.1.29** · GLOSSARY ★ **v1.0.1** · audit-log ★ **v1.1.2** · §13 approval ✅ SIGNED 6/6 + §0 LIVE TRACKER sync M0.S8.3 ☑ |
| **Arhitectură platforme** | Dual-channel: WEB primary (~80%, browser desktop) + MOBILE companion (~20% in-field, M2.S3) |
| ★ **apps/web-landing** | ★ **NEW entry în CLAUDE.md** — site marketing public revyx.app (Next.js 14, port 3001), distinct de demo `apps/web-preview/` (M0.S3, port 3000) și de `apps/api/`. Copy bilingv RO/RU în `lib/content.ts` (nu în `messages/*.json` ca web-preview). Nu are încă entry în Roadmap/Platform Matrix/INDEX — doc gap deschis, de acoperit când site-ul intră în ciclul de development activ (nu blocant M1.S3). |
| **Phase 5 progress** S19→S20 | Stage 1-5 ✅ PASS · Master Phase 5 GA = GO unanimous T+91 · HST #2 PASS clean S20 |
| **Findings register lifecycle** ★ M1.S2 | 13 CLOSED FULL Phase 5 + 2 CLOSED M0.S1 + 2 CLOSED M0.S5 · 2 TRACKED pre-GA · 1 TRACKED next cycle · 6 NEW S20 LOW/MED tracked · 15 NEW M0.S5 (2 HIGH fixed + 6 MED + 9 LOW backlog M1.S5+) · 8 OD-legal/cookie-XX PM/legal decisions tracked (DPO + vendor SCC + analytics tool + CNPDCP înregistrare) · zero CRIT cumulative S10..M1.S2 · zero NEW M1.S2 (clean session — primary tests 22/22 PASS, no findings raised) |
| **Open decisions (PM)** | OD-01 font · OD-02 spacing 8px · OD-03 dark mode (M0.S1 lineage) · OD-M0.S4-01 cifră invest · OD-M0.S4-02 URL demo final · OD-M0.S4-03 logo asset path · OD-M0.S4-04 echipa fondatori (non-blocking M1.S1, blocking T-M0.S4-08 PDF export) · ★ **OD-i18n-01** glosar scoring AOS RO/RU (LS=Scor Lead? PS=Scor Proprietate? sau păstrare EN abreviat?) — recomandare DESIGNER+DOC: Opțiune C hybrid (long-form RO/RU + acronim EN inline badge). Non-blocking M1.S1. |

### Roadmap macro

```
Pre-dev (S16-S20) ──→ M0 MVP Prezentare ✅ CLOSED ──→ M1 MVP Funcțional ★ ACTIVE ──→ M2 FULL Release GA
   S20 ✅ CLOSED        M0.S1..M0.S5 toate ✅         M1.S1 ✅ Phase 0 Security    (Public)
                        M0 EXIT GATE atins           M1.S2 ✅ Phase A Foundation  Phase 5 GA-ready ✅
                        HST M0 PASS sign-off 8/8     M1.S3 next Phase B engines
                                                     Phase A entry închisă ✅
```

### Următoarele 3 sesiuni programate

| Sesiune | Scop | Output |
|---|---|---|
| ★ **M1.S3** next | Phase B Lead Intake + Scoring engines | Webhook intake Meta/Google/OLX real processing (parser + dedup + LEAD INSERT) + LS engine (recompute on event) + IS calc din ACTIVITY + LF cron daily + PS recompute cron + BR-01 Lead Firewall service + Escalation Protocol cron BR-03 + GDPR erasure cascade BullMQ worker. Token budget upgrade Pro→Max anticipat (F-S20-09). |
| **M1.S4** | Phase B+ Match Engine v1 + NBA Engine | Match (PS+LS+IS triple cosine) + NBA computation [0, 2.0] + assignment workflow BR-04 (max 3 task/agent enforced via trigger) + Trust Score recompute |
| **M1.S5** | Phase C UI Web (agent + manager dashboards) | Reuse design system M0.S1 tokens + Next.js wire-up real API + WhatsApp 5 templates Meta-approved + Showcase Link /p/:token public viewer + JWKS rotation endpoint |

**Gating pentru a continua M1.S3:** ✅ TOATE atinse — M1.S2 closed cu Phase A Foundation livrată (9 migrations + 9 schemas + 7 REST modules CRUD + scoring fixtures T01..T07 + integration test infra). Tests 22/22 PASS. Phase A entry închisă. Pending PM/legal OD-legal-01..05 + OD-cookie-01..03 rămân non-blocking M1.S3 dev (blocking doar publicare publică finală v1.0.0 Privacy+Cookie policies).

---

## 0. Identitate proiect

| Atribut | Valoare |
|---|---|
| **Produs** | REVYX — Agent Operating System (AOS) pentru imobiliare |
| **NU este** | CRM clasic |
| **Companie** | ITPRO SYSTEM SRL |
| **Piața primară** | Republica Moldova |
| **Tagline** | Real Estate Execution Intelligence |
| **Limbă primară** | Română · Secundar: Rusă (UI local) · Engleză (cod, GitHub, tech docs) |
| **Timezone** | UTC+2 (Chișinău) — forțat în toate calculele temporale |
| **Currency** | EUR default · MDL · USD |
| **Confidențialitate** | CONFIDENȚIAL · Uz intern |

---

## 1. Documente de referință (Source of Truth)

Înainte de orice modificare cu impact funcțional, **citește în această ordine**:

| Prioritate | Document | Scop |
|---|---|---|
| **0** | `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` ★ | **Structural backbone** — milestones M0/M1/M2, sub-stages, echipa virtuală hats, acceptance criteria. Orice cod/doc nou trebuie să citeze stage-ul din care face parte (Regula 8). §13 approval ✅ SIGNED 6/6 post-HST #2 S20. |
| **0.1** ★ v1.2.2 | `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | **Canonical feature × platform mapping** — single source of truth pentru întrebarea "Această funcționalitate e Web, Mobile sau Both?". Acoperă 15 module (119 features) cu RBAC role per platform + reguli DP-01..DP-07. Orice spec/workflow trebuie cross-ref aici (Regula 9). |
| **0.2** ★ v1.2.9 | `docs/ROADMAP_REVYX_detailed-execution_v1.0.4.md` | **Detailed roadmap** — descompunere Master Plan §4-§6 în atomic tasks (T-XXX) cu owner hat, effort estimate, dependencies, output, platform tag. ~308 tasks · ~122-164 sesiuni estimate. v1.0.4 PATCH M0.S4 ✅ CLOSED (T-M0.S4-01..05 + T-M0.S4-07 ☑; T-M0.S4-06 recording + T-M0.S4-08 PDF export ◐ deferred). |
| 1 | `docs/brand-configs/revyx.md` | Brand system (culori, font, componente, ton) |
| 2 | `docs/BRD_REVYX_v1.0.0.md` + `v1.1.0.md` | Business Requirements (piloni, scoring, RBAC, roadmap) |
| 3 | `docs/PRD_REVYX_*.md` | Product Requirements (când există) |
| 4 | `docs/TECH_SPEC_REVYX_*.md` | Technical Specification (când există) |
| 5 | `docs/WORKFLOW_REVYX_*.md` | Workflow & Process Maps (când există) |

**Reguli:**
- Nu inventa cerințe. Dacă un comportament nu e documentat → întreabă PM-ul, nu presupune.
- Brand-config-ul e legea pentru orice UI. Nu introduce culori/fonturi în afara paletei.
- Spec v1.1 a integrat 47 gap-uri din Hard Stress Test — păstrează compatibilitatea.

---

## 2. Reguli de versionare documente

Toate documentele Markdown urmează **semantic versioning** `vMAJOR.MINOR.PATCH`:

- **MAJOR** — schimbare cerințe / breaking change în logica business
- **MINOR** — adăugare cerință / formulă / entitate fără breaking change
- **PATCH** — clarificări, corecții, typo, reformulări

**Header obligatoriu** pentru orice document nou:

```markdown
# [TITLU DOCUMENT]
<!-- [filename] · v[MAJOR.MINOR.PATCH] · [YYYY-MM] -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX -->

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| x.y.z | YYYY-MM | Autor | Descriere modificare |
```

Marcaj modificări în text: `★` = element nou sau actualizat față de versiunea anterioară.

---

## 3. Stack tehnic (referință)

| Layer | Tehnologie | Note |
|---|---|---|
| Auth | Supabase Auth **sau** Auth0 | JWT RS256 · access 15min · refresh 7 zile + rotație |
| Authorization | RBAC 5 roluri | agent → senior_agent → team_lead → manager → admin (aditiv) |
| Database | PostgreSQL + pgvector | pgvector HNSW activat în Phase 3 |
| Cache | Redis | Score cache cu invalidare la modificare entitate |
| Mesagerie | WhatsApp Business API | 5 templates pre-aprobate Meta (obligatoriu) |
| Lead Intake | Webhooks Meta / Google / OLX | HMAC-SHA256 verification obligatorie |
| Audit | AUDIT_LOG (PostgreSQL) | APPEND-ONLY · niciun UPDATE/DELETE permis la nivel BD |

---

## 4. Reguli critice de business (NU LE ÎNCALCA)

| ID | Regulă | Sursă |
|---|---|---|
| BR-01 | Lead Firewall: doar lead-uri cu **LS ≥ 0.60 + contact valid** ajung la agent | BRD §6.1 |
| BR-02 | `LS_initial = 0.30` la creare lead (NU 0) | BRD §7.1 |
| BR-03 | Escalation Protocol 3 niveluri: T+SLA → T+SLA+30min → T+SLA+2h | BRD §5 Pilon 04 |
| BR-04 | Maximum **3 task-uri active** per agent în orice moment | BRD §6.1 |
| BR-05 | Re-matching trigger → `needs_review=true` · **deal-urile NU se anulează automat** | BRD §5 Pilon 03 |
| BR-06 | GDPR consent capturat și stocat la intake orice lead | BRD §9.4 |
| BR-07 | AUDIT_LOG append-only pentru toate WRITE-urile | BRD §8 |
| BR-10 | `TF_default = 0.70` când `expected_close_date = NULL` | BRD §7.8 |
| BR-11 | `APS_default = 0.65` pentru agenți cu <5 deal-uri SAU <30 zile | BRD §7.7 |
| BR-12 | Single session per agent · forțare logout la password change | BRD §9.1 |

**Excepție de scală:** toate scorurile ∈ [0,1] **cu o singură excepție**: `NBA ∈ [0, 2.0]`.

---

## 5. SLA (răspuns lead)

| Tip lead | SLA |
|---|---|
| HOT (LS ≥ 0.75) | **15 minute** |
| Calificat (0.60–0.75) | 2 ore |
| Warm (0.40–0.60) | 24 ore |
| Rece (< 0.40) | Nurturing automat — fără intervenție agent |

---

## 6. Phase 0 — Security Foundation ⛔ BLOCANT

**Niciun cod de aplicație nu poate fi scris fără completarea Phase 0.**

Checklist:
- [ ] JWT RS256 + RBAC 5 roluri
- [ ] GDPR câmpuri pe LEAD + consent management
- [ ] AUDIT_LOG + middleware logging WRITE
- [ ] Webhook HMAC-SHA256 verification
- [ ] Rate limiting endpoint-uri publice
- [ ] Privacy Policy + Cookie Policy legal review

---

## 7. Sistem de skilluri pentru documentație

```
DOC_MASTER (orchestrator)
├── SKILL_BRD       → Business Requirements Document
├── SKILL_PRD       → Product Requirements Document
├── SKILL_TECH_SPEC → Technical Specification
├── SKILL_WORKFLOW  → Workflow & Process Maps
└── brand-configs/
    └── revyx.md    ← config brand citit de toate skillurile
```

Orice skill care generează un document **trebuie**:
1. Să citească `docs/brand-configs/revyx.md` pentru ton, header, paletă
2. Să respecte structura header + changelog + footer brandat
3. Să marcheze cu `★` orice element nou față de versiunea precedentă

---

## 8. Limbă & ton

- **Documentație**: română (primar). Termeni tehnici păstrați în engleză când sunt standard (Lead Score, Deal Probability, NBA, RBAC, JWT, webhook, etc).
- **Cod, comentarii cod, commit messages, PR titluri**: engleză.
- **UI labels & copy utilizator**: română (primar) · rusă (secundar pentru piața locală).
- **Ton documente**: profesional · precis · executiv. Fără jargon inutil. Fără emoji în documente (doar în UI dacă e specificat).

---

## 9. Convenții cod (când începe development)

- Backend: TypeScript / Node.js (preferat) sau Python — confirmat în Tech Spec
- Strict types obligatoriu (`strict: true` în tsconfig sau `mypy --strict`)
- Migrări BD: numerotate secvențial, idempotente unde posibil
- Toate timestamp-urile: `TIMESTAMPTZ` în PostgreSQL · normalizate UTC+2 la afișare
- Toate scorurile [0,1] (sau [0,2] pentru NBA) — clamp explicit la output
- Optimistic locking cu `version` field pe entitățile cu scoruri
- Niciun secret în cod / commit / log (folosește variabile de mediu)

---

## 10. Convenții Git

- Branch feature: `feature/<scope>-<short-desc>` (ex: `feature/lead-scoring-engine`)
- Branch fix: `fix/<issue-id>-<short-desc>`
- Branch docs: `docs/<scope>` (ex: `docs/prd-v1`)
- Commit: `<type>(<scope>): <subject>` — types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- PR: titlu sub 70 caractere · descriere cu Summary + Test plan
- PR pentru schimbări de scoring/cerințe: necesită aprobare PM + Solution Architect

---

## 10b. Reguli operaționale (post-S5)

### Regula 1 — Prompts în chat
Toate prompturile/rezumatele de sesiune se livrează **doar în chat**. Nu se scriu în CLAUDE.md, README.md sau alte fișiere repo.

### Regula 2 — Senior Architect + PM + Tester
Claude operează ca Senior Architect + Senior PM + Senior Tester. După scriere, citește documentele și aplică un self-review pass înainte de a marca task-ul complet (validare formule, schema, cross-refs, edge cases).

### Regula 3 — Audit checkpoints recurente (echipă audit extern)
La **fiecare etapă** de creare documentație ȘI **fiecare etapă** de dezvoltare, se rulează audit complet cu echipă virtuală de specialiști rang superior:

| Rol | Domeniu |
|---|---|
| Audit Lead | Orchestrare + severity scoring + remediation tracking |
| Senior Solution Architect | Cross-spec consistency, integration contracts, NFR alignment |
| Senior Security Auditor | RBAC matrix, GDPR Art. 5/6/15-22/32, OWASP, encryption, secrets |
| Senior DBA | Schema, FK/index, RLS, migrations, partitioning |
| Senior QA / Test Architect | Test coverage, edge cases, BR-XX traceability, NFR validation |
| Senior Compliance Auditor | GDPR, Legea 133/2011 RM, Legea 142/2018, retention, DPIA |
| Senior Product Auditor | BRD ↔ specs ↔ workflows formula alignment |

**Output audit:** raport în chat cu findings tabelate (severitate CRIT/HIGH/MED/LOW) + fixes aplicate direct în documente; out-of-scope items (legal counsel, regulator registration) sunt enumerate ca gating items pentru milestone.

**Trigger checkpoints:**
1. La final de fiecare sesiune `/sN` — înainte de final commit
2. La înainte de orice rampa de feature flag → 100%
3. La major release (vMAJOR bump în BRD/spec)
4. La schimbare regulatorie (GDPR amendment, Moldova Legea modificare)
5. Ad-hoc la cerere stakeholder (PM, DPO, Security Lead)

### ★ Regula 4 — Verificare finală post-commit (CRITIC)
Claude (AI) este **direct responsabil** pentru verificarea corectitudinii informației create în baza analizei Senior Architect + echipa de auditori externi (§10b Regula 3). **După fiecare commit** dintr-o sesiune `/sN`:

1. Re-citește integral fiecare document creat/modificat în acest commit (NU se rezumă la diff).
2. Verifică cross-reference integrity: orice mențiune `vX.Y.Z` / `§N.M` / `F-XXX` să corespundă realității.
3. Verifică formule scoring: dacă un scor e menționat → valid contra BRD §7 + T01-T07.
4. Verifică schema BD coherence: orice migrare nouă (0XXX) — număr unic, nesuprapus, idempotent.
5. Verifică audit-log catalog: orice eveniment introdus → catalogat în `audit-log` v1.x §4.x.
6. Verifică approval gate: fiecare document tech-spec/runbook/audit are §19/§14 cu aprobatori semnați.
7. Raportează în chat orice inconsistență detectată **înainte** de a marca task-ul complet.

Această verificare **substituie review-ul uman** doar la nivel sintactic + cross-ref; **NU** substituie sign-off-ul Senior Architect / Auditors externi (Regula 3) care rămân autoritatea finală.

### ★ Regula 5 — Prompt next session (obligatoriu la final)
La finalizarea **fiecărei** sesiuni `/sN`, Claude generează **în chat** (NU în repo, conform Regula 1) promptul propus pentru sesiunea următoare `/sN+1`. Format:

```
Prompt /sN+1 (proposed):
- Branch: claude/<scope>-<short-id>
- Model recomandat: opus | sonnet (per Regula 15)
- Context: <ce s-a închis în /sN, ce rămâne deschis din audit>
- Task: <obiectiv principal>
- Files to read (in order): <lista>
- Deliverables: <lista numerotată>
- Operating rules: <referință la CLAUDE.md §10b reguli aplicabile>
```

Fără acest prompt, sesiunea NU e considerată închisă. Promptul e self-contained (poate fi copiat 1:1 în următorul `claude /sN+1`). **Model recomandat** este obligatoriu post-v1.2.13 (Regula 15).

### ★ Regula 6 — INDEX documents update (obligatoriu)
La **fiecare** document nou creat (spec, runbook, audit, playbook, checklist, workflow, etc.), Claude trebuie să:

1. Adauge entry în `docs/INDEX_REVYX_documents_v1.0.X.md` (versiunea curentă) — categoria corespunzătoare §2a-§11.
2. Descriere maximum **10 rânduri** — focus pe (a) ce e documentul · (b) ce findings/feature acoperă · (c) versiune · (d) cross-ref-uri majore.
3. Bump PATCH al INDEX la ≥1 doc nou; MINOR la ≥3 docs noi în aceeași sesiune.
4. Marcaj `★` înaintea numelui pentru documente noi/actualizate la sesiunea curentă.
5. La deprecare doc: append `[DEPRECATED]` + cross-ref successor.

Fără update INDEX, sesiunea NU e considerată închisă (verificat de Regula 4 step 7).

### ★ Regula 7 — Roluri operaționale Claude (★ v1.2.1)
Claude operează ca **11 hats** distincte (★ extins din 10 la v1.2.1): ARCHITECT + BACKEND DEV + FRONTEND WEB DEV ★ + MOBILE DEV + DBA + TESTER + SECURITY + DEVOPS + ML ENGINEER + DESIGNER + DOC. Activare condiționată per stage conform `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1` §2.3 matrice. Maximum 2-3 hats simultan pentru focus + token efficiency.

**Notă rename v1.1.0:** "IMPLEMENTER" generic s-a split în BACKEND DEV + FRONTEND WEB DEV + MOBILE DEV pentru claritate dual-platform Web (PRIMARY ~80%) + Mobile (COMPANION ~20%).

### ★ Regula 9 — Platform Matrix compliance (NEW v1.2.2)
Pentru orice spec, workflow, runbook sau cod care **atinge UI** (frontend Web sau Mobile), Claude trebuie:

1. Să citeze în header `## 0.1 Platform Matrix` cu cross-ref la modul-ul corespunzător din `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §X.
2. Să marcheze fiecare feature/screen menționat cu tag explicit: 🌐 WEB / 📱 MOBILE / 🔁 BOTH / 🔧 Backend (no UI).
3. Să respecte regulile DP-01..DP-07 (Web-first, single backend, admin = Web only, etc.).
4. Niciun feature admin (RBAC mgmt, ML promote, white-label config, billing, audit log viewer, reports complete) NU poate apărea pe Mobile per DP-05.
5. Pentru orice termen ambiguu ("dashboard", "queue", "list") → **obligatoriu** specificare platform.

Violarea Regulii 9 → finding HIGH în HST + rollback PR până la rezolvare.

### ★ Regula 8 — Master Plan compliance (NEW v1.2.0)
Orice document nou (spec, runbook, audit, playbook) ȘI orice cod scris (Phase 0 → G) **trebuie**:

1. Să citeze în header `## 0. Stage Master Plan` cu referință explicită la stage-ul de care aparține (ex: `M1.S3 — Phase B Lead Intake + Scoring`).
2. Să respecte acceptance criteria definite pentru milestone-ul respectiv (AC-M0-XX / AC-M1-XX / AC-M2-XX).
3. Să respecte matricea de hats activi din §2.3 Master Plan — nu introduce funcționalitate care necesită un hat inactiv pentru stage-ul curent.
4. La închidere stage → update §0a Status Execuție din acest CLAUDE.md ȘI §0 din Master Plan.
5. Niciun cod aplicație înainte de aprobarea Master Plan (§13) și PASS la Hard Stress Test #2 (S20).

Violarea Regulii 8 → rollback sesiune + raport în chat cu remedierea propusă.

### ★ Regula 10 — Deployment verification mandatory (NEW v1.2.8)

Orice modificare care atinge deploy pipeline (rename de path sub `apps/*`, modificare `vercel.json`, modificare CI workflow, adăugare dependency, schimbare framework) **trebuie**:

1. **Pre-commit verification:**
   - (a) Confirm Vercel project Root Directory current value (UI inspection sau Vercel API).
   - (b) Asigură că Root Directory match-uiește un path real în repo.
   - (c) `npm install` în pachetul afectat → commit lockfile sincronizat.
2. **Test plan executat în chat / PR body**, cu output exact al comenzilor (nu doar enumerare):
   - `npm run typecheck` (pass exit 0)
   - `npm run lint` (pass; warnings tracked ca OD-XX, nu ca errors)
   - `npm run build` (pass; număr de routes raportat)
   - `npm run dev` smoke test (HTTP status per route + content probe DOM pentru mock + i18n + interactive elements)
3. **Niciun rename de path deploy-critical** (orice path care apare în Vercel Settings → Root Directory) fără update sincron al UI Vercel **înainte** de merge. Dacă nu există acces UI Vercel, NU se face rename — se preferă semantic upgrade in-place prin `package.json`.
4. **Post-deploy verification mandatory:** după merge la `main`, Claude verifică status-ul deployment Vercel (via webhook PR activity sau Vercel API). La detecție eroare deploy: Claude inițiază remediation imediat în următorul commit pe branch separat, NU așteaptă cerere PM.
5. **Build verification status report obligatoriu în chat la finalul fiecărei sesiuni** cu modificări `apps/*` sau `.github/workflows/*` — secțiune dedicată "Tests primary + secondary" cu PASS/FAIL per item.
6. **Lecție învățată M0.S3 first attempt:** un `git mv apps/web-preview/ → apps/web/` a rupt deploy-ul Vercel când Root Directory rămas la path vechi. Revertit la in-place semantic upgrade. Aceasta este Regula 10 fundator-case.

Violarea Regulii 10 → rollback automat al modificării + raport în chat cu remedierea aplicată + sesiunea NU se închide până la deploy verificat green.

### ★ Regula 11 — Puritate i18n (NEW v1.2.10)

Toate texte UI (labels, headers, butoane, toast, modal, copy general) **trebuie traduse complet** în limba activă a utilizatorului (RO / RU / EN) **fără anglicisme** atunci când există echivalent autohton în limba respectivă.

**Aplicabilitate:**
1. **RO:** "dashboard" → **panou de bord** · "queue" → **listă de așteptare** · "deal" → **tranzacție** · "match" → **potrivire** · "filter" → **filtru** · "settings" → **setări** · "notifications" → **notificări** · "login" → **autentificare** · "logout" → **deconectare** · "manager" rămâne (împrumut consacrat în business RM) · termeni tehnici (NBA, LS, DP, APS, DHI, RBAC, JWT, HMAC, SLA) **rămân în EN** ca acronime standard industrie.
2. **RU:** "dashboard" → **панель управления** · "queue" → **очередь** · "deal" → **сделка** · "match" → **совпадение** · "filter" → **фильтр** · "settings" → **настройки** · "notifications" → **уведомления** · "login" → **вход** · "logout" → **выход**.
3. **EN:** baseline canonic — orice termen anglo-saxon nativ.

**Verificare obligatorie:**
- La fiecare commit care atinge `messages/*.json` sau hardcoded strings UI: grep pentru anglicisme în RO/RU și înlocuire.
- Lista exceptions (termeni EN păstrați): NBA · LS · LF · IS · PS · DP · DHI · APS · TS · TF · UF · RF · RBAC · JWT · HMAC · SLA · GDPR · API · UI · UX · CRM · AOS · M0..M2 · MVP · pgvector · HNSW · Redis · TLS · CNAME · DNS · CI/CD · MD · PR.
- Termeni de specificare a domeniului (lead/property/agent) care **se păstrează** în EN dacă sunt unitate semantică în spec (cross-doc consistency cu BRD); UI poate localiza la rendering layer.

Violarea Regulii 11 → finding **HIGH** în HST + rollback PR până la corectare. Open Decision OD-i18n-01 (pending PM resolution): glosar oficial RO/RU pentru termenii AOS de scoring (LS=Scor Lead? PS=Scor Proprietate? sau păstrare EN abreviat?).

### ★ Regula 12 — Disciplina interacțiunilor layout (NEW v1.2.10)

**Static stays static. Dynamic responds.**

1. **Elementele statice din layout NU trebuie să reacționeze la mișcarea cursorului** — header bar, footer, side-rail navigation (când nu sunt interactive), background, decorative graphics, text labels read-only, badge-uri pur informative.
2. **Elementele dinamice interactive REACȚIONEAZĂ la hover/focus/active** conform tokens.json `motion` + brand-config §5.1 (`translateY(-2px)` + border-color shift) — exclusiv: butoane, link-uri, carduri clickabile, input-uri, dropdown-uri, toggle-uri, drag handles, kanban cards mutabile.
3. **Excluzii explicite (NU au hover/scale/translate):**
   - Logo + cover hero (decorativ)
   - Stats panels / numere mari (read-only)
   - Page headers + breadcrumbs (orientare, NU navigare)
   - Score badges fără context interactive (ex: LS badge pur informativ pe lead-detail header)
   - Workflow timeline markers (statice, nu se selectează)
4. **Pattern auditing:**
   - `:hover` în CSS doar pe elemente cu `cursor: pointer | grab | text` sau `role="button"`/`role="link"`/`role="checkbox"` etc.
   - Folosirea `hover:translate-y-*` / `hover:scale-*` / `hover:shadow-*` în Tailwind doar pe componente interactive cu rol semantic.
   - Card-uri pur statice (read-only) folosesc varianta `Card` fără `hover:` modifiers; varianta interactivă (`InteractiveCard` sau Card cu prop `clickable`) primește hover styling.

Verificare obligatorie pre-commit pe orice modificare în `apps/web-preview/components/**` sau `apps/web/components/**`: grep `hover:` și validare semantică element-by-element. Violarea Regulii 12 → finding **MED** în HST + corectare în PR-ul care a introdus regresia.

### ★ Regula 13 — In-app tutorial / onboarding (NEW v1.2.10)

Fiecare pagină principală (login, dashboard, leads, properties, deals, manager, notifications, profile, settings, admin) **trebuie să aibă element tutorial vizibil** care explică:
1. Ce vede utilizatorul pe ecran (scopul paginii).
2. Care sunt elementele cheie interactive (max 3-5 hotspots) și ce fac.
3. Care este următoarea acțiune recomandată (cross-ref NBA layer când aplicabil).

**Implementare:**
- **Pattern:** `<TutorialOverlay screenId="dashboard">` componentă reutilizabilă; conținut localizat în `messages/{locale}.json` sub cheia `tutorial.{screenId}`.
- **Trigger UX:** auto-show la prima vizită per `screenId` (localStorage flag `revyx.tutorial.{screenId}.seen`) + buton "?" persistent în header pentru re-deschidere.
- **Conținut:** 1 paragraf intro + 3-5 hotspot-uri cu pointer la elemente reale (folosind data-attribute `data-tutorial-anchor="<id>"` pe target).
- **A11y:** keyboard navigable (Tab/Shift+Tab între hotspots, ESC close, Enter advance), focus trap când deschis, screen-reader announce.

**Update protocol:** la **fiecare adăugare de funcționalitate** pe o pagină existentă (nou widget, nou button, nou flow), Claude trebuie:
1. Update `messages/{ro,ru,en}.json` cu hotspot nou în `tutorial.{screenId}.steps[]`.
2. Adaugă `data-tutorial-anchor` pe noul element.
3. Update `tutorial-coverage.md` (tracker) — list per page steps active.

**Implementare M0.S5+ scope:** componenta `TutorialOverlay` + content RO/RU/EN pentru cele 9 pagini principale = task T-M0.S5-XX (sau split la M1.S5 dacă HST M0 ridică prioritate UX).

Violarea Regulii 13 (pagină nouă fără tutorial) → finding **MED** în HST + tracking item în backlog UX.

### ★ Regula 14 — Verificare overlap layout (NEW v1.2.10)

Layout-ul **NU trebuie să conțină elemente vizuale care se suprapun nedorit** (text peste text, butoane peste carduri, modal-uri parțial obscured, dropdown clipping).

**Verificare obligatorie:**
1. **Manual smoke test (pre-commit pe modificări UI):** la fiecare modificare în `app/**/page.tsx` sau `components/**`, navighează cele 3 viewport-uri canonice și verifică:
   - Desktop wide: 1920×1080
   - Desktop standard: 1440×900
   - Tablet landscape: 1024×768
   - (Mobile portrait M2.S3+: 375×667 — N/A pentru M0)
2. **Visual regression tooling sugerat (M1.S5+):** Playwright + `toHaveScreenshot()` baseline pentru pagini cheie cu threshold 0.5%.
3. **Pattern audit:**
   - `position: absolute` + `z-index` interacțiune verifică contra `Modal`, `Toast`, `Dropdown`, `Tooltip` z-stack (constant ordering în `tokens.json` motion/z-index).
   - Sticky header NU obscure content (folosește `scroll-padding-top` pe `<body>`).
   - Dropdown-uri ancorate (combobox, language switcher) clip vs viewport edge — folosește positioning library sau detecție manuală flip-up.
   - Long text content în badges/chips folosește `truncate` sau `line-clamp-N` cu tooltip.

**Findings curent (depistate, requires fix în M0.S5):**
- (TBD per HST M0 audit step — Claude va popula lista în raportul HST_REVYX_m0_v1.0.0.md §findings)

**Quick-check command (pre-commit):**
```bash
cd apps/web-preview && npm run dev &
# Open Chrome → navigate cele 9 pagini × 3 viewport-uri × 3 locale
# Capture screenshots → visual diff vs design/screenshots/baseline/
```

Violarea Regulii 14 (overlap depistat post-merge) → finding **HIGH** în HST + corectare prioritară în PR hotfix.

### ★ Regula 15 — Routare model per tip task (NEW v1.2.13)

**Sarcinile se atribuie modelului potrivit pentru a optimiza cost + calitate:**

| Tip task | Model recomandat | Exemple REVYX |
|---|---|---|
| **Dezvoltare / programare / ajustare** | **Sonnet** | Cod CRUD module M1.S2+, migrations BD simple, fix-uri bug-uri identificate, doc bumps mecanici (INDEX/Roadmap PATCH), implementare endpoint după spec aprobată, retraduceri i18n, scaffold rutine |
| **Analiză / refactoring / audit / arhitectură** | **Opus** | Tech Spec writing, Hard Stress Test audit, design decisions (stack choice TS vs Python vs Go), refactoring multi-modul, threat modeling OWASP, BRD modificări scoring formula, cross-spec consistency review, root cause analysis production incident |

**Aplicare obligatorie:**
1. La fiecare **prompt /sN+1** generat (Regula 5), Claude include explicit linia `Model recomandat: opus | sonnet`.
2. Decizia se bazează pe natura **dominantă** a sesiunii: dacă sesiunea e 80%+ implementare cod după spec → Sonnet; dacă 30%+ decizii arhitecturale noi/audit → Opus.
3. Sesiuni mixte (~50/50): preferință Opus pentru părți critice (security, scoring formula) + handoff Sonnet pentru implementare pură.
4. La acceptarea promptului de către PM, modelul poate fi override în CLI Claude Code (`/model opus|sonnet`); Claude respectă alegerea finală chiar dacă diferă de recomandare.

**Token budget guard:**
- Opus = cost ridicat → folosit doar pentru valoarea arhitecturală
- Sonnet = cost mediu → default pentru execuție repetitivă
- Per F-S20-09 tracking: Pro $20/lună sustainable doar dacă Opus ≤30% din sesiuni; Max $100/lună necesar dacă raport >50%.

Violarea Regulii 15 (folosirea modelului greșit pentru tipul task) → cost waste tracked + retrospect la HST următor.

### ★ Regula 16 — Întrebări exacte cu opțiuni (NEW v1.2.13)

**Când o cerință de la PM/user nu permite un prompt sistematic complet, Claude NU inventează — pune întrebări precise cu opțiuni.**

**Format obligatoriu pentru întrebări:**
1. **Identifică ambiguitatea** — 1-2 propoziții care explică ce lipsește din context pentru a continua.
2. **Generează 2-4 opțiuni alternative** explicite, mutually exclusive, fiecare cu trade-off scurt (1 rând).
3. **Recomandă o opțiune** (cu argumentul principal) — dar lasă decizia PM-ului.
4. **Constrânge la scope REVYX** — niciun "what if" speculativ în afara BRD/Master Plan/Trio canonical. Nu inventa requirements care nu sunt în spec curentă.

**Exemplu format:**
```
Ambiguitate: PM cerere "să adăugăm raportare lunară" — nu e clar dacă raportul e
per agent (APS focus) sau per tenant (admin dashboard).

Opțiuni:
A. Raport per agent — APS history + deal-uri închise + Trust Score (BR-11).
   Trade-off: util agent self-review; redundant cu /profile.
B. Raport per tenant — leaderboard APS + revenue + funnel (manager focus).
   Trade-off: util manager command; necesită aggregare cross-agent (M1.S4 scope).
C. Ambele cu RBAC switch — agent vede self, manager vede tenant.
   Trade-off: dublu effort UI; cleanest pattern.

Recomandare: C (RBAC switch) — match-uiește deja design `/profile` vs `/manager`.
PM decide?
```

**NU faci:**
- Implementări speculative "ar fi util să..."
- Cross-ref invenții la docs care nu există
- Decizii arhitecturale fără sign-off PM/Architect când impactul depășește 1 fișier

Violarea Regulii 16 (implementare fără clarificare la ambiguitate detectată) → rollback PR + retry cu întrebări corecte.

### ★ Regula 17 — Optimizare token la generare prompt (NEW v1.2.13)

**Toate prompturile generate de Claude (pentru sesiunea următoare, sub-task split, sau handoff PM) sunt optimizate maximal pentru consum token.**

**Reguli concrete:**
1. **Format structurat strict** — secțiuni canonice: `Branch`, `Model recomandat`, `Hats`, `Context (1-3 propoziții)`, `Task`, `Files to read (in order)`, `Deliverables (numerotate)`, `Operating rules (numere CLAUDE.md §10b)`. NU paragrafe lungi narative.
2. **Cross-refs prin acronim/short-name** — `BRD §9.4` în loc de `Business Requirements Document versiunea 1.0.0 secțiunea 9.4`. `T-M1.S2-03` în loc de descriere lungă a task-ului.
3. **Niciun context duplicat** — dacă info e în CLAUDE.md §0a Status Execuție, NU o re-explica în prompt; menționează doar `vezi CLAUDE.md §0a`.
4. **Files to read = listă minimă** — NU adăuga fișiere "for context" dacă nu sunt esențiale pentru sesiunea curentă. Files include doar:
   - Spec-uri direct relevante task-ului
   - Doc-ul ce trebuie actualizat (Roadmap, INDEX, CLAUDE.md)
   - Maxim 5-7 fișiere total per prompt
5. **Target token estimate** — prompt sesiune < 2000 tokens (echivalent ~250-400 cuvinte). Exception: HST/audit prompts pot depăși pentru lista comprehensivă audit categorii.
6. **NU re-explica regulile** — referință la numere (`Regula 4 + Regula 8`) e suficient; reguli sunt deja în CLAUDE.md.
7. **Output deliverable list verbose, NU explicație motivație** — promptul descrie CE, nu DE CE (DE CE e în Master Plan + Roadmap deja).

**Anti-pattern interzis:**
- Prompt > 3000 tokens fără justificare (HST e exception)
- Repetare conținut din CLAUDE.md §0a în prompt
- Cross-refs verbose ("vezi documentul respectiv care se află în folderul docs care conține specificațiile arhitecturale...")
- "Background story" sau context istoric — Claude citește CLAUDE.md la fiecare sesiune

Violarea Regulii 17 → prompt rejectat de PM cu cerere reformulare; iterare consumă din timp util.

### ★ Regula 18 — Single living document, no version proliferation (NEW v1.2.17)

**Regulă fundamentală:** un document = un fișier viu, nu o serie de fișiere paralele numerotate. **NU creezi `<NAME>_v1.0.10.md` lângă `<NAME>_v1.0.9.md`.** Bump-ul de versiune trăiește **în interiorul fișierului** (header + changelog), nu în lista de fișiere.

**Aplicare obligatorie:**

1. **La fiecare bump de versiune al unui doc existent (PATCH/MINOR/MAJOR):**
   - `Edit` (nu `Write`) pe ultima versiune curentă a fișierului.
   - Update header intern: `vMAJOR.MINOR.PATCH` + dată + adăugare entry în `## Changelog`.
   - **Dacă filename conține `_vX.Y.Z.md`** (legacy convention): `git mv <name>_v1.0.9.md <name>_v1.0.10.md` urmat de Edit pe noul filename. **NU** lași v1.0.9 alături — predecessor file e șters de `git mv`.
   - **Dacă filename NU conține versiune** (preferat pentru docs vii — Regula 18 long-term ambition): doar Edit. Filename rămâne stabil pe toată durata vieții documentului.

2. **Niciodată două versiuni paralele ale aceluiași doc în repo simultan.** Excepție: când o ramură feature lucrează la o versiune draft (`v1.1.0-draft`), aceasta există DOAR pe acea ramură; merge la `main` produce un singur fișier.

3. **La introducere de doc nou (ex: spec arhitectural pentru un modul):** verifică întâi că nu există un fișier care poate absorbi conținutul (extindere via secțiune nouă). Doc nou doar dacă e fundamental distinct și self-contained.

4. **INDEX_REVYX_documents** = catalog viu cu deletion list:
   - La fiecare ștergere de fișier legacy, înregistrare scurtă în §X "Deletions" cu motivul (consolidation / superseded / deprecation).
   - **NU** păstrezi entry-uri `[HISTORY]` pentru fișiere care nu mai există fizic — git history e source of truth pentru cronologie.

5. **CLAUDE.md, README.md, AGENTS.md** = canonical living docs, **fără sufix de versiune în filename, EVER**. Bump intern (v1.2.17 → v1.2.18) prin header + changelog row.

6. **Verificare obligatorie pre-commit pentru orice bump:**
   - `find docs -name "<NAME>_v*.md" | wc -l` trebuie să returneze **1** per nume canonic.
   - Cross-refs interne (`grep -r "<NAME>_vOLD"`) trebuie să fie zero — toate updated la versiunea curentă sau (mai bine) la filename fără versiune.

**Anti-pattern interzis (motivul Regulii 18):**
- Acumulare de zeci de fișiere `INDEX_REVYX_documents_v1.0.0.md..v1.1.13.md` (problemă originală: 22 versiuni paralele pre-consolidare).
- Cross-refs care indică spre versiuni intermediare moarte (ex: `vezi v1.0.5.md` când doar v1.0.9.md mai există).
- Diff-uri de PR cu sute de fișiere create/șterse doar pentru a bump-ui un număr.

**Migrare retroactivă (executat o singură dată la introducerea Regulii v1.2.17):**
- Toate seriile multi-version au fost colapsate la cea mai recentă versiune.
- **60 fișiere predecesoare** șterse (vezi commit `docs(consolidation): apply Regula 18`).
- Toate cross-refs din docs supraviețuitoare **+ CI workflows** (`.github/workflows/audit-catalog-lint.yml` etc) au fost actualizate la versiunile finale via sed bulk — 22 mapări totale.

Violarea Regulii 18 (commit care creează doc paralel `<NAME>_vNEW.md` lângă `<NAME>_vOLD.md` fără să-l șteargă pe vechi) → **rollback automat al commit-ului** + finding HIGH în HST + remediation imediată pe PR următor.

### ★ Regula 19 — Segregare buyer / seller pentru Lead (NEW v1.2.18)

**Lead-urile NU sunt o entitate unică omogenă.** Demo-ul + producția trebuie să trateze separat **buyer leads** (caută proprietate de cumpărat) și **seller leads** (au proprietate de vândut). Informația vizibilă agentului diferă fundamental:

| Lead type | Informație primară | Acțiuni primare agent |
|---|---|---|
| **buyer** | Preferințele clientului (buget, zonă, camere, features, urgență) + Top-3 potriviri sugerate din portofoliu | Programează vizionare la proprietățile match · pregătește ofertă · cere documente client |
| **seller** | Proprietatea pe care o vinde (link la `/properties/[id]`) + beneficiile promovate + vizionările programate pe ea | Editează beneficii anunț · gestionează vizionări către alți buyeri · primește/transmite oferte |

**Reguli concrete de implementare:**

1. **Lead schema obligatoriu separată prin câmp `leadType: 'buyer' | 'seller'`** — niciodată un fel de polimorfism implicit. Câmpul e NOT NULL la create.
2. **Pentru seller leads:** câmp `selling_property_id` (FK la PROPERTY) obligatoriu la create (proprietatea trebuie să existe deja înainte sau să fie creată în același flow de intake).
3. **UI Lead Detail** randează două layout-uri distincte: buyer → `BuyerPreferencesPanel` + `MatchPodium` Top-1/2/3 cu reveal inline al raționamentului + listă proprii vizionări; seller → `SellerPropertyPanel` cu link la proprietate + beneficiile promovate (editabile pe pagina proprietății) + lista vizionărilor programate pentru acea proprietate (toți buyer-ii interesați).
4. **Agentul trebuie să poată edita:** pe pagina lead-ului buyer — preferințele (features, etaj preferat, urgență, notă cheie); pe pagina proprietății (link-uită din seller lead) — beneficiile anunțului (bullet-uri „de ce să cumperi").
5. **Sugestii NBA per tip:** buyer urgent → first_contact + schedule_showing; buyer calificat → send_property + schedule_showing; seller proaspăt → request_documents (mandat + cadastru) + draft_listing; seller cu vizionări 0 → marketing_push + price_review.
6. **Marketplace cumpărători** listează DOAR buyer leads cu `publicConsent=true` (GDPR Art. 6) cu PII mascat — niciodată seller leads (sellerul publică proprietate, nu profil).
7. **Match engine bidirecțional:** pentru un buyer lead → Top-K properties; pentru o property (seller flow) → Top-K buyer leads compatibili.
8. **Filtru obligatoriu în lead list:** tabul `Cumpărător / Vânzător / Toate` la nivel de pagină `/leads` + query param `?type=buyer|seller` pentru deep link.

**Violarea Regulii 19** (UI care amestecă buyer + seller fără segregare, sau care arată Top-3 match-uri unui seller lead, sau care arată „buget" unui seller lead drept criteriu primar) → finding **HIGH** în HST + corecție obligatorie în PR de remediere. Nu există excepție pentru „simplitate demo" — separarea e definitorie pentru business model.

### ★ Regula 20 — Segregare rent / sale (chirie vs vânzare) (NEW v1.2.19, refined v1.2.20)

**REVYX trebuie să acopere DOUĂ piețe paralele, nu una.** Piața de vânzare (sale) și piața de închiriere (rent) au cicluri de viață diferite, comisioane diferite și artefacte juridice diferite, dar reușesc să trăiască sub același framework prin **arhitectură type-agnostic core + calibration profiles**.

**Modelul canonical (extensie a Regulii 19):**

| Concept | Valoare |
|---|---|
| **`leadType`** | enum flat **4 valori** (Regula 19 extensie): `buyer`, `seller`, `tenant`, `landlord` — Hybrid: 4 enum + helper derivat `transactionIntent()` (în `apps/web-preview/lib/transaction-intent.ts`). |
| **`transactionIntent`** | `'sale' \| 'rent'` derivat: `buyer/seller → sale` · `tenant/landlord → rent`. |
| **`leadSide`** | `'demand' \| 'supply'` derivat: `buyer/tenant → demand` · `seller/landlord → supply`. UI layouts split pe această axă (demand → preferences + match podium; supply → property panel + benefits + showings). |
| **`Property.listingType`** | enum 3 valori: `'sale' \| 'rent' \| 'both'`. O proprietate poate fi listată dual (vânzare + chirie) — match engine verifică intent compatibility via `isListingMatchForLead()`. |
| **`Property.monthlyRentEur`** | nullable EUR/lună — completat pentru `listingType ∈ {'rent', 'both'}`. Pentru listingType `'rent'`, `priceEur = 0` (sale price irrelevant). |
| **`Lead.rentPeriodMonths`** | nullable. Tenant alege 6/12/24 luni; landlord oferă tipic 12. Pentru buyer/seller = `null`. |

**Reguli concrete de implementare:**

1. **Type-agnostic core + Calibration Profiles** — formulele BRD §7 (LS/PS/IS/DP/DHI/NBA/APS) rămân **identice ca structură**. Introducem `transaction_profile_id` FK (M1.S3 entry) pe LEAD + DEAL cu **2 row-uri seed** într-o tabelă mică `transaction_profiles`:
   - **`sale`** — TF_horizon=180 zile, RF=financing-heavy (credit aprobat, evaluare bancă), commission_model=`% preț` (default 2.5%), DHI weight RF=0.25.
   - **`rent`** — TF_horizon=21 zile, RF=credit-check + employment proof + previous landlord ref, commission_model=`1× chirie lunară`, DHI weight RF=0.20.
   - Engine-ul scoring face lookup parametri la compute → zero duplicare cod, zero divergență formule.
   - Fixtures T01-T07 rămân valide (sale baseline backwards compat). Adăugăm T08-T10 doar pentru rental edge cases distincte (DP curve scurtă, RF rent-specific) — M1.S3 entry.

2. **Mock data demo realistic distribution** (`apps/web-preview/lib/mock/leads.ts` + `properties.ts`):
   - Leads: ~48% buyer · ~22% seller · ~22% tenant · ~8% landlord (rent ~30% volum piață RM).
   - Properties: ~60% sale-only · ~25% rent-only · ~15% both.
   - Monthly rent heuristic RM: ~0.65% din preț cumpărare ± variation.

3. **UI layout — reuse semantic via `intent` prop:**
   - `BuyerPreferencesPanel` servește buyer + tenant cu pool features adaptiv (`BUYER_FEATURES` sau `TENANT_FEATURES` — utilități incluse, animal allowance, mobilier etc.) + i18n keys `preferences.titleRent/descRent`.
   - `SellerPropertyPanel` servește seller + landlord cu price labels adaptive (`seller.priceLabel` `Preț cerut` sau `landlord.monthlyRentLabel` `Chirie lunară /lună`) + rent period display.
   - `MatchPodium` afișează `€/lună` pentru rent + filter `isListingMatchForLead()` (intent compatibility).

4. **Sugestii NBA per (status × leadType):**
   - **Demand HOT (buyer/tenant):** `first_contact` + `schedule_showing`.
   - **Demand qualified:** `follow_up` + `send_property`.
   - **Supply HOT (seller/landlord):** `request_documents` priority (sale: mandat + cadastru + 6-8 fotografii; rent: acord proprietar + cadastru + 6-8 fotografii) + `first_contact`.
   - **Supply qualified:** `request_documents` + `follow_up`.
   - **Rent profile** task labels adaptive: `draft_offer` = pregătește contract chirie cu termenii (chirie + perioadă + depozit); `close_deal` = confirmă semnarea contractului + transfer depozit. (`sale` profile: ofertă scrisă + programare notar).

5. **Workflow closure separat per intent (Cabinet notar):** UI `/notary` are **tab toggle obligatoriu** între `Acte notariale (vânzare)` și `Contracte chirie`. Sale flow: SCHEDULED → SIGNED → CADASTRE_REGISTERED (notar real, BRD §6 Deal Closure + NotaryAct entity). Rent flow: DRAFTED → REVIEWED → SIGNED_TENANT → SIGNED_LANDLORD → DEPOSIT_PAID → ACTIVE → ENDED (LeaseAgreement entity NEW; NU necesită notar pentru chirii < 36 luni în RM; agentul gestionează direct, contract semnat = ambele părți + depozit transferat). `/deals` pipeline are **tab toggle Toate / Vânzare / Închiriere** cu badge intent pe fiecare card + commission hint adaptiv (`% preț` sale / `1× chirie` rent).

6. **Filtru obligatoriu în `/leads`:** tabul **5 valori** — `Toate / Cumpărător / Chiriaș / Vânzător / Proprietar` la nivel de pagină `/leads` + query param `?type=buyer|tenant|seller|landlord` pentru deep link. Badge variant per type: buyer=info · tenant=success · seller=updated · landlord=warning.

7. **Filtru obligatoriu în `/properties`:** tabul `Toate / De vânzare / De închiriat / Vânzare + chirie` cu logica `sale tab include both` (proprietățile `both` sunt vizibile când utilizatorul filtrează pe orice intent).

8. **Match engine bidirecțional cu intent compatibility:**
   - Buyer/tenant lead → Top-K properties cu `isListingMatchForLead(lead, property.listingType)` filtered.
   - Property listingType `'sale'` listă match-uri doar din buyer leads; `'rent'` doar din tenant leads; `'both'` din ambele cohort-uri.

9. **Direcția de lucru (Workspace Direction) — filtru global per organizație:** fiecare cabinet (agent / agenție / grup) poate seta direcția `sale | rent | both`. Când e fixă (sale sau rent), platforma **ascunde automat** tot ce nu corespunde: lead-urile (tenant/landlord ascunse la sale, buyer/seller ascunse la rent), proprietățile (listing-urile irelevante ascunse, `both` rămâne vizibil mereu), tab-urile `/deals` (forțat pe intent), tab-urile `/notary` (Acte notariale ascuns la rent, Contracte chirie ascuns la sale).
   - **Demo:** toggle global unic (`lib/workspace-store.ts`, localStorage, `WorkspaceDirection`), editabil din oricare cabinet — aceeași valoare globală.
   - **Producție (model canonical):** ierarhic **companie → grup → agent**, fiecare nivel putând **îngusta dar nu lărgi** direcția nivelului superior (ex: companie `both` → grup `sale` → agent `sale`; un agent NU poate seta `rent` dacă grupul e `sale`). Stocat ca preferință per nivel organizațional cu rezolvare la cel mai restrictiv lanț. Backend M1.S5 implementează rezolvarea ierarhică; demo aproximează prin toggle global.

**Violarea Regulii 20** (UI care arată buget cumpărare la chiriaș; match podium care propune sale property la tenant lead; notary act pe rental deal; filter list care omite tenant/landlord; commission % preț pe rent deal; direcție workspace `sale` care lasă vizibile lead-uri/proprietăți/tab-uri de rent) → finding **HIGH** în HST + corecție obligatorie în PR de remediere.

**Argument arhitectural (de ce calibration profile vs formule paralele):**
- **Flexibilitate viitoare:** corporate_lease, vacation_rental, short-term Airbnb-style = doar profile noi, fără cod nou.
- **DB amprentă minimă:** 1 tabelă mică `transaction_profiles` (2 rows initial) + 1 FK column pe LEAD + DEAL. Zero duplicare formule.
- **Productivitate:** developers/QA mențin 1 engine scoring; calibrare = update parametri în tabelă, no code change.
- **Backwards compat T01-T07:** fixtures existente păstrează validitate completă pentru sale profile.

### ★ Regula 21 — Documentația proiectului mereu sincronizată cu funcționalitatea (NEW v1.2.21)

**Documentația proiectului trebuie să fie ÎNTOTDEAUNA up-to-date.** Orice funcționalitate, condiție, regulă de business sau ajustare nouă introdusă în cod (demo `apps/web-preview/` sau backend `apps/api/`) **obligă** la actualizarea sincronă a documentației relevante — în **același PR**, niciodată amânat.

**Aplicare obligatorie — la fiecare schimbare verifică și actualizează (când e relevant):**

1. **CLAUDE.md** — §0a Status Execuție LIVE (sesiune curentă + milestone) + Regulile §10b (dacă apare o regulă/condiție nouă) + changelog row + footer version bump.
2. **Roadmap** (`ROADMAP_REVYX_detailed-execution_v*.md`) — §0 Trigger entry + secțiune sub-stage cu atomic tasks T-XXX ☑ + changelog.
3. **INDEX** (`INDEX_REVYX_documents_v*.md`) — entry pentru orice doc nou + bump.
4. **BRD** (`BRD_REVYX_v*.md`) — DOAR dacă se schimbă cerințe business / formule / entități (cu aprobare PM per §10 git conventions).
5. **TECH_SPEC / PLATFORM_MATRIX / WORKFLOW** — dacă schimbarea atinge contracte API, mapping feature×platform, sau procese.

**Checklist pre-close sesiune (extensie a Regulii 4):**
- [ ] Funcționalitatea nouă e reflectată în CLAUDE.md §0a?
- [ ] Există o regulă/condiție nouă de business? → Regulă nouă în §10b + cross-ref.
- [ ] Roadmap are atomic tasks pentru schimbare + status ☑?
- [ ] INDEX listează orice doc nou?
- [ ] Toate versiunile bump-uite respectă Regula 18 (single living doc, git mv)?
- [ ] Cross-refs interne (`vX.Y.Z` / `§N.M` / `Regula N`) corespund realității?

**Relația cu celelalte reguli:**
- **Regula 4** (verificare finală post-commit) verifică *corectitudinea* documentației existente; **Regula 21** garantează *existența* documentației pentru orice cod nou.
- **Regula 6** (INDEX update) e un caz particular al Regulii 21.
- **Regula 8** (Master Plan compliance) cere ca fiecare cod să citeze stage-ul; Regula 21 cere ca acel stage să fie *actualizat* la închidere.
- **Regula 17** (token optimization) se aplică: documentația actualizată e concisă, nu verbose.

**Anti-pattern interzis:** cod livrat (PR merged) cu funcționalitate nouă, dar documentația rămasă la starea anterioară („o actualizez data viitoare"). Datoria de documentație nu se acumulează — se plătește în PR-ul care introduce schimbarea.

Violarea Regulii 21 (PR cu funcționalitate/condiție nouă fără actualizare documentație relevantă în același PR) → finding **MED** în HST + actualizare obligatorie înainte de următorul merge.

---

## 11. Ce să faci & ce să nu faci

### ✅ Fă
- Citește documentele de referință înainte de schimbări funcționale
- Întreabă când o cerință lipsește din spec (NU presupune)
- Marchează modificări noi cu `★` în documente
- Actualizează changelog-ul la fiecare modificare de document
- Validează formulele scoring cu valorile de test din §12 BRD (T01–T07)

### ❌ Nu face
- Nu introduce CRM-isme (REVYX = AOS, nu CRM)
- Nu modifica formulele scoring fără aprobare PM (sunt validate)
- Nu folosi culori în afara paletei brand
- Nu scrie cod aplicație înainte de finalizarea Phase 0 Security
- Nu commita secrete, fișiere `.env`, sau date reale clienți
- Nu altera AUDIT_LOG (append-only la nivel BD)
- Nu seta `LS_initial = 0` sau `APS_default = 0` (penalizează nedrept)

---

## 12. Glosar minim (vezi BRD §15 pentru lista completă)

| Acronim | Sensul |
|---|---|
| **AOS** | Agent Operating System (ce este REVYX) |
| **LS** | Lead Score [0,1] |
| **PS** | Property Score [0,1] |
| **IS** | Interaction Strength [0,1] |
| **DP** | Deal Probability [0,1] |
| **NBA** | Next Best Action [0, 2.0] — singura excepție de scală |
| **TS** | Trust Score [0,1] |
| **APS** | Agent Performance Score [0,1] |
| **DHI** | Deal Health Index [0,1] |
| **LF** | Listing Freshness `1 − min(1, zile/90)` |
| **TF** | Time Factor (DHI) |
| **UF** | Urgency Factor (NBA) |
| **RF** | Risk Factor (DHI) |
| **SLA** | 15 min (HOT) / 2h (calificat) / 24h (warm) |

---

*CLAUDE.md · v1.2.38 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*

---

## Changelog CLAUDE.md

| Versiune | Data | Note |
|---|---|---|
| **1.2.38** | **2026-07** | ★ MINOR — **DEMO PROMOTION — Kit promovare demo + mecanism feedback self-service (paralel M1.S3).** Director Marketing + FRONTEND WEB DEV + DOC. Fondator solo → promovarea demo-ului live + colectare feedback fără implicarea fondatorului în discuții („Founder Firewall"). Cod `apps/web-preview/`: widget feedback global (buton plutitor + nudge automat după ≥4 ecrane) + ghid bun-venit prima vizită (4 pași auto-explorare RO/RU/EN, absent pe `/`+`/login`) — `components/feedback/{feedback-widget,welcome-guide}.tsx` + `lib/{feedback-store,feedback-config}.ts` + wire `providers.tsx` + i18n `feedback.*`/`welcome.*` × 3 limbi; URL formular din env `NEXT_PUBLIC_TALLY_FEEDBACK_URL` (zero schimbare cod la legare). Docs NEW `docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/` 4 fișiere (README + FEEDBACK_FORM_TALLY + PROMO_CONTENT_PACK RO/RU + EXECUTION_PLAN). Tests: typecheck PASS (1 TS5101) · lint PASS (1 OD-01) · build PASS 26 routes · i18n-check 0 duplicate · smoke 200 + widget prezent. INDEX v1.1.29 → **v1.1.30**. Backend `apps/api/` + Master Plan + BRD INTACTE (Regula 6 + 8 + 11 + 12 + 18 + 21). Trigger: fondator solo „descarcă-mă, promovează demo + colectează feedback". |
| **1.2.37** | **2026-07** | ★ PATCH — **LANDING FONT FIX (bugfix `apps/web-landing`) — Cyrillic font mismatch RO/RU în titluri.** Senior Manual Tester + FRONTEND WEB DEV. Descoperire: `apps/web-landing/` (site marketing public revyx.app, port 3001) e distinct de demo `apps/web-preview/` și era **necitat în CLAUDE.md/Roadmap/INDEX** — NEW row `apps/web-landing` în §0a documentează existența lui minimal (doc gap rămas: fără entry Roadmap/Platform Matrix, non-blocant M1.S3). Audit manual live (Playwright, fonturi reale via route interception) a confirmat vizual bug CRIT: `app/globals.css` seta global `h1,h2,h3 { font-display }` (Bebas Neue) — font fără glife Cyrillic (verificat: 0 subset-uri Cyrillic în CSS servit de Google Fonts) → `h1` hero + 7× `h2` de secțiune randau branded în RO dar cădeau pe fallback system sans complet diferit vizual în RU. Fix: `h1,h2,h3` → `font-body` (Montserrat, Cyrillic nativ) + `font-weight: 700`, aliniat cu `design/tokens.json` typography.scale (h1/h2 family=body weight=700). Bebas Neue păstrat corect pe wordmark logo + cifre KPI (text netradus). Verificat live: RO/RU randează acum identic, zero regresie simetrie/overflow 1440px+375px. Tests: typecheck PASS · lint PASS (1 warning pre-existent) · build PASS 5 routes identic. Backend + `apps/web-preview/` + Master Plan **INTACTE** (Regula 8 + 21). Trigger: user request „verifică landing-ul, simetrie + font RU=RO". |
| **1.2.36** | **2026-07** | ★ PATCH — **DEMO UX FIX (bugfix `apps/web-preview`, demo freeze parțial) — ajustări post-audit Senior Manual Tester.** Senior Manual Tester + FRONTEND WEB DEV. Auditul UX manual live (Playwright, 26 rute desktop RO) a ridicat 1 HIGH + 3 MED + 3 LOW; toate fix-uite: (1) **Nav overflow (HIGH, toate paginile)** `components/site-nav.tsx` — etichete wrapау mid-word + bară >viewport → `whitespace-nowrap` + `shrink-0` + `px-sp3→px-sp2` + brand tagline `hidden 2xl:inline` + Manager/Admin mutate în dropdown „Mai mult"; overflow orizontal 127px eliminat (0px verificat la 1280/1366/1440/1920; 1024 tablet = M2). (2) **Deal card money truncat (MED)** `components/deals/kanban-board.tsx` — Cost/Comision/Agent restructurate stivuit vertical (label deasupra valorii) → suma comisionului + agent + intent complet vizibile (anterior „2.5% · €2…" / „Andrei Cara…" / „Vân…"). (3) **Notary numere duplicate (MED)** `lib/mock/closure-states.ts` + `lib/mock/notary-acts.ts` — act/cadastru derivate unic per deal (`NA-2026-40NN`/`CR-90NN-2026`) + pool vânzători + ore variate (anterior toate `NA-2026-04217`/`CR-9384-2026`). (4) **Data mm/dd/yyyy (MED)** — investigată, **nemodificată**: `type=date` nativ afișează în locale browser; en-US în env test → RO/RU users văd dd.mm.yyyy automat (a schimba = custom picker, out of scope bugfix). (5) **Dashboard (LOW)** `app/dashboard/page.tsx` — propoziție duplicată în „Lead-uri urgente" + etichete vestigiale A/B/C eliminate. (6) **Intake acronim leak (LOW)** `messages/ro.json` — `Reguli Lead Firewall (BR-01)` + `Lead Score ≥ 0.30` → formulări fără acronim/scor (Regula 11). Tests: typecheck PASS · lint PASS (1 OD-01) · build PASS **26 routes** · smoke live Playwright 24/24 rute 200 + 0× overflow orizontal global. Backend `apps/api/` + Master Plan + BRD **INTACTE** (Regula 8 + 15 Sonnet/Opus + 17 + 21). Fără doc nou (INDEX neatins). Trigger: PM directive „ajustările în demo în baza auditului". |
| **1.2.35** | **2026-07** | ★ PATCH — **VAL-01 extindere · Prospecting Kit (doc-only, paralel M1.S3).** Senior PM + DOC. Trigger: PM directive — lucru paralel cât timp validarea e blocată pe lipsa de companii-țintă („nu am cu cine vorbi"). NEW `docs/marketing/MARKET_VALIDATION_KIT_REVYX_v1.0.0/PROSPECTING_KIT.md` — a 6-a piesă a kit-ului, deblochează pasul dinaintea interviului („cum găsesc companii"): (1) cadru listă-țintă — segmentare (agent independent activ / broker-owner mic / senior în rețea / manager rețea mare) + surse RM (999.md, OLX.md, grupuri FB, Instagram, recomandări, portaluri franciză) + calificare rapidă 4 criterii + tabel țintă (15–25 rânduri → 3–5 demo-uri). (2) strategie de canal (WhatsApp/apel/email/introducere caldă) + secvență per prospect. (3) scripturi de abordare RO+RU (WhatsApp primul contact · apel la rece cu deschidere/motiv/cerere/punte/închidere · email cu subiect+corp · follow-up unic). (4) tratare 6 obiecții de intrare (n-am timp / încă un CRM / cât costă / trimite pe email / nu mă descurc cu tehnologia / de unde ai numărul) → răspuns care duce la întâlnire. (5) tabel pipeline prospectare + metrici. Principiu: validare nu vânzare, ceri 15 min; fără features inexistente (doar demo 26 ecrane + roadmap aprobat); formule ascunse (beneficii, nu acronime); GDPR/Legea 133 (date publice, minimizare, oprire la cerere — BR-06). README kit v1.0.0 → **v1.0.1** (6 fișiere + pas prospectare în flux). INDEX v1.1.28 → **v1.1.29** (git mv, §2d entry + stat 15→16). Backend `apps/` + `apps/web-preview/` + Master Plan + BRD **INTACTE** (Regula 6 + 15 Sonnet + 16 opțiuni + 17 + 18 + 21). |
| **1.2.34** | **2026-07** | ★ PATCH — **VAL-01 ✅ Kit validare de piață (doc-only, paralel M1.S3).** Senior PM + DESIGNER (ton brand) + DOC. NEW `docs/marketing/MARKET_VALIDATION_KIT_REVYX_v1.0.0/` (5 fișiere RO) ca PM-ul să ruleze 3–5 interviuri de validare cu agenții din Chișinău pe demo-ul live (26 ecrane) + pitch deck M0.S4, cât timp dezvoltarea e în M1.S3: (1) `ONE_PAGER.md` — 1 pagină printabil A4 (problema agentului RM → ce face REVYX → ce NU e / CRM → cerere pilot 30 zile). (2) `INTERVIEW_GUIDE.md` — 12 întrebări deschise (rutină lead · rată pierdere · comision sale/rent + mandat exclusivitate · dispoziție plată, fără a vinde) + script demo 10 min pe 4 fluxuri (calificare ghidată → potriviri → kanban → cabinet). (3) `FEEDBACK_FORM.md` — 5 scale 1–5 mapate 1:1 pe piloni (S1 Lead/S2 NBA/S3 Match/S4 Deal+Manager/S5 adopție) + 3 întrebări deschise → traducere directă în priorități M1.S4-S6. (4) `SUCCESS_CRITERIA.md` — praguri C1-C9 (≥3/5 confirmă SLA · ≥2/5 accept pilot) + tabel centralizare + catalog obiecții → livrabil VAL-02. (5) `README.md` — index + flux interviu. Fără promisiuni de features inexistente (doar demo + roadmap aprobat); formule scoring ascunse (beneficii, nu acronime — Regula 11 spirit). INDEX v1.1.27 → **v1.1.28** (git mv, §2d entry). Backend `apps/` + `apps/web-preview/` + Master Plan + BRD **INTACTE** (Regula 6 + 8 + 15 Sonnet + 17 + 18 + 21). Trigger: sesiune VAL-01. |
| **1.2.33** | **2026-07** | ★ MINOR — **P0 ✅ CLOSED „Fundația de convergență" (pre-M1.S3) + politică demo freeze parțial.** Software Architect + DEVOPS. Execuția ARCH_REVIEW_REVYX_full-stack_v1.0.0 §5 P0 (F-ARCH-01/02/03/06), refactor pur fără schimbare de comportament: (1) **Monorepo npm workspaces** — NEW root `package.json` (workspaces apps/* + packages/*, engines node>=22) + single root lockfile (șterse lockfile orfan root gol + lockfile-uri per-app); `api-ci` + `web-preview-ci` install la repo root cu cache pe lockfile root + trigger `packages/**`; Vercel Root Directory `apps/web-preview` NEATINS (Regula 10), gate = preview GREEN pe PR. (2) NEW **`packages/core` (@revyx/core)** — sursă unică enums domeniu (LeadStatus/LeadType/TransactionIntent/LeadSide/ListingType/DealStage/TaskType/TaskStatus, aliniate nominal la coloanele Drizzle) + helpers `transaction-intent`; demo consumă via workspace dep + `transpilePackages`; `lib/mock/types.ts` + `lib/mock/tasks.ts` + `lib/transaction-intent.ts` devin re-exporturi (toate importurile existente rămân valide); apps/api adoptă la M1.S3. (3) **Scoring split** — NEW `apps/api/src/scoring/engine.ts` (compute LS/PS/LF/DP/NBA/DHI + apsForAgent, mutate 1:1 din fixtures); `fixtures.ts` păstrează DOAR tabelele T01..T07; spec asertează engine-ul — 22/22 PASS (testul nu-și mai validează propria copie). (4) NEW **CI i18n integrity** `.github/scripts/check-i18n.mjs` în web-preview-ci — FAIL la chei JSON duplicate în același scope (clasa de bug care a ascuns traduceri en/ru) + raport paritate chei vs ro.json ca WARNING până M1.S5 (D-6: EN 606 / RU 556 lipsă la data P0). ★ **Decizii PM (sesiune interactivă):** pachet = `@revyx/core` · **demo freeze PARȚIAL** — feature nou în `apps/web-preview/` doar cu aprobare PM explicită per caz, default = traiectoria backend M1.S3+ · i18n duplicate=fail / paritate=warning. Tests primary: typecheck/lint PASS ambele apps (1 pre-existing OD-01) · api test **22/22** · build PASS ambele (26 routes, listă identică) · dev smoke 7/7 rute 200 + content probe POZITIV (Închiriere/€lună/Profil de nevoi/Flux tranzacții — identic pre-refactor). Roadmap v1.0.16 → **v1.0.17** (git mv, §4.6 NEW T-P0-01..04 ☑) · INDEX v1.1.26 → **v1.1.27** (git mv) · README refs sync. Backend business logic + BRD §7 + Master Plan **INTACTE** (Regula 8 + 18 + 21). Trigger: PM directive post-ARCH_REVIEW PR #88 (toate ajustările necesare) + 4 decizii clarificate cu opțiuni (Regula 16). |
| **1.2.32** | **2026-06** | ★ MINOR — **PM feedback post-PR #84/#85 — cabinet growth tab redesign + leads table fix + BR-32 Partner Registry.** Solution Architect + Senior PM + Senior BA. Schimbări `apps/web-preview/` (zero backend — Regula 8): **(A) Creșterea Mea (`/cabinet/agent`):** AgentGoalsPanel rescris cu catalog selectabil 10 obiective (`agent-growth-store.ts` migrat de la `targetDeals/targetCommissionEur` la `objectives[]` + helpers `CATALOG/getActualValue/formatObjectiveValue` + migrate legacy) — adăugare din listă + progres per obiectiv + editare țintă inline + eliminare. Tab scoping fix (Regula 1d PM): „Progresul meu lunar" (primele 2 obiective din store + buton „Editează obiective →") + WorkspaceDirectionSelector mutate DOAR pe tabul Sumar. WorkspaceDirectionSelector redesign: butoane pill h-9 (Vânzare/Închiriere/Ambele) + effectNote text simplu fără ramă. **(B) Leads (`/leads`):** tabel redus 7→4 coloane (client/prioritate/sla/status) — celula client = nume + badge tip + flag mandat + id sub-text; fix i18n bug (en.json/ru.json aveau blocuri `\"lead\"` duplicate top-level → JSON last-wins ascundea tableHeader/status/filters; consolidat + ro.json completat). FinancialReadinessBadge inline promovat la card proeminent (border-l-4 colorat + bg tint + text acțiune). **(C) BR-32 Partner Registry Governance NEW:** combinație variante agency + individual cu reguli stricte de scriere — `lib/account-store.ts` (`accountType` + `role` + `canEditPartners`) + `lib/partners-store.ts` (registry pe domeniu agency/individual) + `components/cabinet/{partners-panel,account-switcher}.tsx`. Agency → lista partajată editabilă doar de team_lead/manager/admin (agenții read-only la selectare); individual → owner editează. Tab „Parteneri" pe `/cabinet/agency` (mereu) + `/cabinet/agent` (doar cont individual). `CooperationPanel` consumă lista rezolvată (`resolve_partners`) — doar selectare partener + split + Open House (gate publish: ≥1 partener). i18n RO/RU/EN: namespace `partners.*` + `cooperation.{partnersLabel,managePartners,noPartners,selectPartnerHint}` + `cabinet.{agency,agent}.tabs.*`. **Docs (Regula 21):** BRD v1.4.0 → **v1.5.0** (git mv) NEW §6.5 BR-32 + notă guvernanță §18.10 + 5 cross-refs actualizate; INDEX entry BRD updated. Tests: typecheck PASS · lint PASS (1 OD-01) · build PASS **26 routes** · dev smoke /cabinet/agency + /cabinet/agent + /properties/[id] 200 + probe POZITIV. Backend `apps/api/` + BRD §7 + Master Plan **INTACTE** (Regula 8 + 18 + 21). Trigger: PM feedback (2 pagini + analiză bloc cooperare cu variante validate înainte de implementare). |
| **1.2.31** | **2026-06** | ★ MINOR — **M0.S9 — AGI Layer Val 1 „Calificarea ghidată" (schelet vizual).** Solution Architect + Senior PM. Traducerea cunoașterii de teren (BRD §17/§18) în funcționalități care descarcă agentul de rutină. NEW doc `docs/ARCH_REVYX_agent-routine-capability-map_v1.0.0.md` (model „Operating Loop" + mapare rutină→feature + §6 datorie tehnică D-1..D-7). Schimbări `apps/web-preview/` (zero backend — Regula 8): (1) **Buyer Needs Assessment** `components/leads/buyer-needs-panel.tsx` + `lib/buyer-assessment-store.ts` — profil structurat cu **buget explicit** (declarat vs confirmat, cuvinte de bani neambigue per cerință PM) + pre-aprobare bancară + must-sell + posesie + deal-breakers/compromise + completeness (§18.9/§17.1/§17.3). (2) **Financial Readiness** `components/leads/financial-readiness-badge.tsx` — derivat din buget confirmat + bancă; **înlocuiește blocul vechi care expunea acronimul `BR-25` în UI** (fix convenție M0.S6) (§18.7). (3) **Execution Guides** `lib/mock/execution-guides.ts` (9 ghiduri seed RO: scenariu apel + 5 obiecții + 10 pași) + `components/leads/guide-drawer.tsx` + buton „Cum fac asta?" pe sugestii (§18.3). (4) **Qualification Wizard** `components/leads/qualification-wizard.tsx` — 10 pași seller cu captură verdict/preț/motivație (§18.3). (5) Wire `app/leads/[id]/page.tsx` (demand→needs+FRS; supply→wizard) + i18n RO `needs.*`/`guide.*`/`qualification.*` + fix `lead.financialReadinessHelp`. **★ Datorie urmărită (decizie PM):** livrat SCHELET VIZUAL (localStorage); **revenim curând la structura avansată** (entități reale + scoring service + Val 2-4) — vezi ARCH §6 D-1..D-7 + Roadmap. Tests: typecheck PASS (1 TS5101) · lint PASS (1 OD-01) · build PASS **26 routes** · dev smoke 5/5 200 + probe POZITIV (L-1001 demand: Profil de nevoi + Buget declarat/confirmat + Pregătire financiară + Cum fac asta · L-1009 supply: Întâlnire de calificare · 0× `BR-25` leak). Backend `apps/api/` + BRD §7 + Master Plan **INTACTE** (Regula 8 + 18 + 21). |
| **1.2.30** | **2026-06** | ★ MINOR — **Adoptare Karpathy Guidelines ca principii fundamentale de execuție.** Solution Architect. Sursă: `multica-ai/andrej-karpathy-skills` (MIT). (1) NEW skill `.claude/skills/karpathy-guidelines/SKILL.md` (4 principii: Think Before Coding · Simplicity First · Surgical Changes · Goal-Driven Execution). (2) NEW secțiune `§0z Principii fundamentale` în CLAUDE.md (top, prioritate la conflict de stil execuție) + mapping cu Regulile existente §10b (P1⊇R16, P2⊇R17+R18, P3=nou, P4⊇R2/R4). Bază pentru toate proiectele viitoare. Surgical: zero modificări la conținutul Regulilor 1-21; doar adăugare principii + skill. |
| **1.2.29** | **2026-06** | ★ PATCH — **Consistency pass post-v1.4.0 (Regula 21) — sincronizare documente rămase.** Solution Architect + Senior Compliance Auditor + DOC. Audit de consistență pe toate documentele după BRD v1.4.0; sincronizate cele rămase: (1) **audit-log v1.1.1 → v1.1.2** (git mv) — §4.4.10 familia `AGI/ETHICS/MLS` (10 events) + CI `audit-catalog-lint.yml` `--spec` path actualizat. (2) **PLATFORM_MATRIX v1.0.0 → v1.1.0** (git mv) — Modul 16 (AGI/Ethics/MLS, 12 features, Regula 9) + stat 119→131. (3) **GLOSSARY v1.0.0 → v1.0.1** (git mv) — §14b 9 termeni NAR/APAIM/MLS/PPP/etc. (4) **6 engine tech-specs** — note additive `★ Related v1.4.0` (showing/property/offer-engine/deal-closure/match-engine/nba-engine, in-place fără bump). (5) **HEADER_STANDARD** fix pointer BRD v1.1.0→v1.4.0. (6) **INDEX v1.1.22 → v1.1.23**. **Decizie Regula 17:** MASTER_PLAN v1.1.2 NU bump-uit (referențiat de 35 docs; conținut substanțial necontradictoriu cu v1.4.0; deriva §0 tracker + §12 cross-ref = refresh dedicat separat). Backend `apps/` INTACT. Trigger: PM directive „actualizați toate documentele după modificări majore în framework". |
| **1.2.28** | **2026-06** | ★ MINOR — **Integrare practici de teren + etică profesională (NAR / APAIM).** Solution Architect + Senior PM + Senior BA + Senior Compliance Auditor. Sursă: 7 documente operaționale furnizate de client (instrucțiuni preluare vânzări RO/RU · check-list prima intrare apartament · scenariu apel vânzători · Buyer Needs Assessment ABR® · metodologie profesională Riѐltor ~700 paragrafe) + NAR Code of Ethics (17 articole / 3 categorii) + APAIM (modelat după NAR). Schimbări docs-only (zero cod `apps/`): (1) **BRD v1.3.0 → v1.4.0** (`git mv`) — §6.5.1 BR-29 (MLS Cooperation & commission-sharing) + BR-30 (Listing Price Discipline anti-overpricing) + BR-31 (Buyer Needs Assessment) · §8.5.1 entități `cooperation_offers` + `buyer_assessments` (total 16) · §17.1 extensie buyer worksheet · §18.3 seed real execution guides · §18.4 mapping NAR 17 articole + APAIM + 2 ethics checkpoints noi (Art.16 `exclusive_listing_solicitation` + Art.12 `misleading_advertising`; BR-28 4→6) · NEW §18.9 Buyer Needs Assessment · §18.10 AGI-08 MLS · §18.11 AGI-09 Listing Price Discipline · §13.4 +3 KPI · AC-AGI-09..13. (2) **2 TECH_SPEC noi:** `TECH_SPEC_REVYX_realtor-ethics_v1.0.0` (NAR/APAIM mapping + 6 ethics checkpoints + append-only) + `TECH_SPEC_REVYX_mls-cooperation_v1.0.0` (commission split + ДОД/Open House + gate mandat). (3) **2 Workflows bump:** property-onboarding v1.0.0 → **v1.1.0** (NEW §5.0 SOP preluare + 10-pași seller meeting + Elite Realty SOP codificat) + buyer-profile-lifecycle v1.0.0 → **v1.1.0** (NEW §4.1.1 Buyer Needs Assessment + PPP scripts). (4) **Regula 18 cleanup:** șterse stale `INDEX_v1.1.19` + `ROADMAP_v1.0.13`. (5) **Roadmap v1.0.15 → v1.0.16** (mv) §4.5 NEW T-ETH/T-MLS/T-BNA/T-LPD. (6) **INDEX v1.1.21 → v1.1.22** (mv). (7) §0a NEW row `★ Etică profesională (NAR/APAIM)` + AGI Layer status bump v1.3.0→v1.4.0. Backend `apps/api/` + BRD §7 formule + BR-01..BR-28 + Master Plan **INTACTE** (Regula 8 + 18 + 21). Trigger: PM directive integrare inputuri client (NAR.realtor + APAIM.md + documente de teren). |
| **1.2.27** | **2026-06** | ★ MINOR — **AGI Layer documentat complet — BRD §18 Agent Growth Intelligence + Roadmap §4.4 T-AGI-01..10.** Senior PM + Solution Architect + Senior BA + Senior Product Auditor. Analiza bibliografică profesională (Carnegie/Hill/Beckwith/Maister/Gitomer/Fox/Lukic/Blanchard+Peale/Yamaguchi + NAR Code of Ethics) vs framework REVYX → 7 gap-uri HIGH/MEDIUM. Shift conceptual: AOS care controlează → AOS care **dezvoltă** agentul. BRD v1.2.0 → **v1.3.0** cu §18 complet (AGI-01..AGI-07 + BR-25..28 + IS/TS extensii + 4 entități noi + KPI AGI + AC-AGI). Roadmap v1.0.14 → **v1.0.15** cu §4.4 AGI Layer (T-AGI-01..10). INDEX v1.1.20 → **v1.1.21**. §0a NEW row `★ AGI Layer status` + Roadmap ref v1.0.13 → v1.0.15. Backend `apps/api/` + BRD §7 + Master Plan **INTACTE** (Regula 8 + Regula 18 + Regula 21). |
| **1.2.26** | **2026-06** | ★ MINOR — **Moldova market-specific specs documentate — BRD §17 (6 insight-uri [MOLDOVA-SPECIFIC]).** Senior BA + Software Architect + Senior PM. Schimbări docs-only (zero cod `apps/`): (1) **BRD v1.1.0 → v1.2.0** (`git mv`) — NEW §17 `Specificații piață Republica Moldova` cu 6 sub-secțiuni: §17.1 buget declarat vs confirmat (câmpuri `declared_budget_eur/confirmed_budget_eur/budget_confirmed_at`, RF impact DHI); §17.2 tipuri locație calificare (`meeting_location_type ENUM office/public_place/on_site`, trigger `activity_on_site_create_showing` auto-creare SHOWING, GDPR `verbal_pending_digital`); §17.3 pre-aprobare bancară cvasi-inexistentă (câmpuri `bank_preapproval_status/amount/bank/expires_at`, bănci principale RM); §17.4 modificare preferințe post-vizionare 90% (`preference_history JSONB[]`, `showing.feedback` 5 dimensiuni, trigger `showing_feedback_update_preferences`); §17.5 mandat exclusivitate sellers (`mandate_status ENUM none/pending/signed/expired`, cron `mandate-expiry-checker`); §17.6 clasa proprietate RM (`property_class ENUM soviet_era/post_soviet/new_build/premium`, distribuție ~55/10/30/5%). Toate câmpurile noi marcate `[MOLDOVA-SPECIFIC]` — BRD §7 formule INTACTE. (2) **Roadmap v1.0.13 → v1.0.14** (mv) — NEW §4.3.MD cu tasks T-MD-01..05 (migrations 0016-0020), dependențe pe M1.S2, ordine implementare recomandată. (3) **INDEX v1.1.19 → v1.1.20** (mv) — entry actualizat. (4) **CLAUDE.md v1.2.25 → v1.2.26** — §0a NEW row `★ Moldova market specifics` + changelog. Backend `apps/api/` + BRD §7 + Master Plan INTACTE (Regula 8 + 18 + 21). |
| 1.0.0 | 2026-05 | Initial — identitate proiect, documente referință, BR critice, Phase 0 checklist, §10b Regulile 1-6 |
| 1.1.0 | 2026-05 | MINOR — adăugare Regula 7 (10 hats Claude) |
| 1.2.0 | 2026-06 | MINOR — adăugare §0a Status Execuție LIVE + Master Plan ca priority 0 în §1 + Regula 8 (Master Plan compliance) + footer changelog. Triggered de decizie strategică: Claude Code = singura forță execuție; necesită roadmap structurat M0/M1/M2 + HST mandatory pre-fiecare milestone. |
| 1.2.1 | 2026-06 | PATCH — sincronizare cu MASTER_PLAN v1.1.0 (dual-platform). Regula 7 actualizată: 10 → **11 hats** (IMPLEMENTER split în BACKEND DEV + FRONTEND WEB DEV ★ + MOBILE DEV); §0a Status Execuție adăugare row "Arhitectură platforme" (WEB primary ~80% + MOBILE companion ~20%); referințe `MASTER_PLAN_REVYX_execution-roadmap_v1.0.0` → `v1.1.0` actualizate global. |
| 1.2.2 | 2026-06 | PATCH — Trio canonical introduction. Adăugare priority 0.1 + 0.2 în §1: `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` (canonical feature×platform mapping, 15 module, 119 features) + `ROADMAP_REVYX_detailed-execution_v1.0.0.md` (atomic tasks T-XXX, ~308 total). Adăugare Regula 9 NEW (Platform Matrix compliance) — orice spec/workflow UI-touching trebuie tag-uit explicit Web/Mobile/Both + respectare DP-01..DP-07. Master Plan ref bump v1.1.0 → v1.1.1. Trigger: Audit S15-bis-3 finding 88% docs gap-uri Web/Mobile + cerere user "Senior Architect mandate" — definirea totală pre-development. |
| 1.2.3 | 2026-07 | PATCH — S20 HST #2 PASS clean sync (M0.S1 entry unblocked). |
| 1.2.4 | 2026-05 | PATCH — **M0.S1 ✅ CLOSED — Design System direct-to-code shift**. Schimbări: (1) §0a Status Execuție LIVE actualizat: sesiune curentă S20 ✅ → M0.S1 ✅ CLOSED; următoarea sesiune M0.S1 → M0.S2 (Clickable Prototype direct-to-code in `apps/web-preview/`); modul Claude activ adăugare FRONTEND WEB DEV early activation; (2) Roadmap ref bump v1.0.0 → v1.0.1 în §1 priority 0.2 (PATCH direct-to-code shift §3.1 + §3.3); (3) Findings lifecycle row ★ 2 CLOSED M0.S1 (F-S20-04 component half + F-S20-10 DP-06 brand parity); (4) NEW row "Open decisions (PM)" cu OD-01 font discrepancy (brand-config Bebas Neue+Montserrat+JetBrains Mono — shipped — vs AC-M0-02 "Inter") + OD-02 spacing grid (8px) + OD-03 dark mode stance (single dark M0-M1); (5) Roadmap macro diagram updated; (6) Gating row updated pentru M0.S2 entry. Trigger: T-M0.S1-01..10 atomic tasks output (direct-to-code path per Roadmap v1.0.1). Backwards compat full cu v1.2.3 (Regulile 1-9 neschimbate). |
| 1.2.5 | 2026-05 | PATCH — **M0.S2 ✅ CLOSED — Clickable Prototype direct-to-code**. Schimbări: (1) §0a Status Execuție LIVE actualizat — sesiune curentă M0.S1 → ★ M0.S2 ✅ CLOSED; următoarea M0.S2 → ★ M0.S3 (Web Static Demo); modul Claude activ shift de la DESIGNER-primary la FRONTEND WEB DEV-primary; (2) Roadmap ref bump v1.0.1 → v1.0.2 în §0a + §1 priority 0.2 (PATCH M0.S2 close, T-M0.S2-01..05 ☑); (3) Findings lifecycle row sync ★ zero NEW M0.S2 + zero CRIT/HIGH cumulative S10..M0.S2; (4) Open decisions row simplificat (OD-01..03 rămân non-blocant M0.S3); (5) Roadmap macro diagram updated (M0.S2 ✅ next M0.S3); (6) "Următoarele 3 sesiuni programate" shifted (M0.S3/M0.S4/M0.S5); (7) Gating row actualizat pentru M0.S3 entry. Trigger: T-M0.S2-01..05 atomic tasks output (4 user journeys end-to-end clickable per Roadmap v1.0.2 §3.2 ☑) + `next build` pass 13/13 routes. Backwards compat full cu v1.2.4 (Regulile 1-9 neschimbate). |
| 1.2.6 | 2026-05 | PATCH — **Deploy pipeline online (bring-forward T-M0.S3-14 partial)**. vercel.json + CI gate + runbook v1.0.1. INDEX ref bump v1.1.3 → v1.1.4. Backwards compat full cu v1.2.5. |
| 1.2.7 | 2026-05 | PATCH — M0.S3 ✅ CLOSED Web Static Demo (first attempt — included git mv apps/web-preview → apps/web; ulterior rolled back când a rupt deploy Vercel Root Directory). |
| 1.2.8 | 2026-05 | PATCH — M0.S3 ✅ CLOSED corrected + Regula 10 introduction. Reverted git mv `apps/web-preview/` → `apps/web/` (physical path retained, semantic upgrade in-place la `@revyx/web-preview@0.2.0`). Regula 10 "Deployment verification mandatory" adăugată în §10b. |
| 1.2.9 | 2026-05 | PATCH — M0.S4 ✅ CLOSED Pitch Deck + Video Walkthrough. Roadmap v1.0.4 + INDEX v1.1.6. Output 6 documente `docs/marketing/`. Backwards compat full cu v1.2.8 (Regulile 1-10 neschimbate). |
| 1.2.10 | 2026-05 | PATCH — 4 reguli operaționale noi (Regulile 11-14) triggered de PM design+layout feedback post-M0.S4 merge. §10b extins cu Regula 11 (Puritate i18n) + Regula 12 (Disciplina interacțiuni) + Regula 13 (In-app tutorial) + Regula 14 (Verificare overlap). Backwards compat full cu v1.2.9. |
| 1.2.11 | 2026-05 | PATCH — M0.S5 ✅ CLOSED Hard Stress Test M0 EXIT GATE. Reguli 11-14 prima ocurență audit. 2 HIGH fixed (F-M0S5-01 Card interactive + F-M0S5-02 i18n 44 keys). Roadmap v1.0.5 + INDEX v1.1.8 + Master Plan §0 sync. |
| 1.2.12 | 2026-05 | PATCH — M1.S1 ✅ CLOSED Phase 0 Security Foundation livrată. §0a Status Execuție LIVE actualizat — Macro-milestone shift M0 ✅ CLOSED → M1 ACTIVE cu M1.S1 ☑; sesiune curentă reflectă deliverables (TECH_SPEC phase0-security v1.0.0 + `apps/api/` NestJS scaffold + 6 migrations + JWT RS256 + RBAC + AUDIT_LOG append-only + HMAC webhook + GDPR Art. 15/17/18/20 + Throttler + Privacy/Cookie drafts + tests 12/12 PASS + CI workflow); roadmap macro updated "Phase 0 BLOCANT lifted ✅"; "Următoarele 3 sesiuni" shifted M1.S2/M1.S3/M1.S4; modul Claude activ tranziție audit team → BACKEND DEV + DBA hat M1.S2; Master Plan ref bump v1.0.5 → **v1.0.6** Roadmap + NEW spec phase0-security v1.0.0; NEW Phase 0 Security Checklist row marked COMPLETE; findings register lifecycle row +8 OD-legal-01..05 + OD-cookie-01..03 PM/legal pending; gating row "M1.S2 entry UNBLOCKED". Stack TS/NestJS confirmat post-analiză comparativă (vs Python vs Go) documentată în chat. Backwards compat full cu v1.2.11 (Regulile 1-14 toate neschimbate; doar §0a sync). Trigger: M1.S1 sesiune output T-M1.S1-01..09 ☑ + Regula 4 self-review + Regula 6 INDEX update v1.1.8 → v1.1.9 + Regula 8 Master Plan §0 sync. |
| **1.2.25** | **2026-06** | ★ PATCH — **M0.S8.4 follow-up · Kanban card Zone 4 + Zone 5 polish (2 PM puncte).** Schimbări `apps/web-preview/`: (1) **Zone 4 (agent)** — prefix `Agent:` muted + numele agentului în **bold** (`font-semibold` + `text-text-h`) pentru a-l face elementul dominant vizual al zonei; cheia `deal.agentLabel` exista deja în 3 limbi (RO/RU/EN). (2) **Zone 5 RU** — `deal.detailsLink` „Подробнее" → **„Далее"** (RO/EN nemodificate: Detalii / Details). Layout-ul Zone 5 deja gestionează același rând (intent stânga + buton dreapta) cu `flex-wrap` fallback. Tests: typecheck PASS · build PASS **26 routes** (identic) · dev smoke /deals 200 + content probe POZITIV (8× `Agent` label + nume bold prezent în carduri; RU `Далее` aplicat în json). Backend + Master Plan INTACTE (Regula 8 + 21). Backwards compat full cu v1.2.24. Trigger: PM 3 puncte (Z1-Z3 fără schimbări; Z4 + cuvânt Agent + nume bold; Z5 RU pe un rând cu „Далее"). |
| **1.2.24** | **2026-05** | ★ PATCH — **M0.S8.3 Demo polish · /deals page (7 PM puncte) + commissionPct pe Property.** Creative Director + Senior UI/UX. Schimbări `apps/web-preview/`: (1) **i18n RO**: "Pipeline tranzacții" → **"Flux tranzacții"** (titlu + subtitles + tutorial entry) — analogie RO non-anglicism per Regula 11. (2) **i18n RU**: "Воронка сделок" → **"Поток сделок"** (analogie "flow" mai aproape de "flux"). (3) **NEW i18n namespace `deal.intentShort.{sale,rent}`** + `deal.rentCommissionShort` în 3 limbi — RO: Vânzare/Chirie · RU: Продажа/Аренда · EN: Sale/Rent. Inserate DOAR în carduri kanban pentru economie de spațiu (`Închiriere` rămâne global ca etichetă lungă). (4) **Kanban card restructurat în 4 zone explicite** (`components/deals/kanban-board.tsx`): **Zone 1** = linia 1 tip tranzacție (dot intent + label scurt Vânzare/Chirie); linia 2 ID deal stânga + statut sănătate dreapta. **Zone 2** = linia 1 nume client (bold); linia 2 adresă completă (`property.addr` + `title` attribute pentru tooltip browser pe overflow); linia 3 `oraș · zonă`. **Zone 3** = linia 1 stânga preț (€ sale sau €/lună rent), dreapta comision (`pct% · €sumă` pentru sale / `1× chirie · €sumă` pentru rent); linia 2 agent (avatar gradient gold + nume). **Zone 4** = buton Detalii (jos, alineat dreapta). (5) **Padding-uri strânse** (`px-sp2` în loc de `px-sp3`, `py-1.5` în loc de `py-sp2`, gap-uri 1-1.5px) pentru maximizare lățime utilă adresă fără overflow la 6 coloane. Toate textele păstrează `truncate` ca fallback grațios. (6) **NEW câmp `Property.commissionPct`** (`lib/mock/types.ts` + `lib/mock/properties.ts`) — nullable, completat pentru `listingType ∈ {'sale','both'}`. Distribuție realistă mock: 25% × 2.0% + 55% × 2.5% + 20% × 3.0% (standard piață RM). (7) **Formul `/properties/new`** primește NEW card `Comision (%)` între essentials și benefits — vizibil doar pentru sale/both. Input procent (0.5-6%, step 0.1) cu live amount preview alături (`pct × priceEur = €sumă`) calculat la fiecare keystroke. Preț de vânzare extins cu `max=10000000` (10M EUR). (8) **`/properties/[id]` detail page** afișează NEW field `Comision` cu format `2.5% · €X.XXX` între `Preț de vânzare` și `Tip listare`. Vizibil agentului ȘI clientului (cf. PM directive). (9) **`lib/mock/deals.ts`** folosește `property.commissionPct` în loc de hardcoded 2.5% — fiecare deal sale derivă comisionul din proprietate (consistent cu UI form). Rent rămâne `1× chirie` (rent_profile commission_model). **NEW i18n keys**: RO/RU/EN — `property.detail.commissionLabel` + `property.form.{commissionPctTitle, commissionPctDesc, commissionPctLabel, commissionPctHint, commissionPctAmount, commissionPctRentNote}` (7 keys × 3 limbi = 21 keys). **Tests primary post-fix**: typecheck PASS · lint PASS (1 pre-existing OD-01) · build PASS **26 routes** (identic v1.2.23) · dev smoke 3/3 routes 200 + content probe POZITIV: /deals title "Flux tranzacții" ×2 (header + tutorial) · Vânzare ×13 + Chirie ×8 (intentShort) · `1× chirie` ×8 (rent commission) · 12 sale cards cu format `pct% · €sumă` (3% / 2.5% / 2.0% mix) · 0× "Pipeline tranzacții" rezidual. /properties/new "Comision (%)" + "Procent comision" + "Suma estimată" vizibile. /properties/P-1901 "Comision (vizibil clientului)" vizibil. Backend `apps/api/` + BRD §7 + Master Plan **INTACTE** (Regula 8 + Regula 18 + Regula 21). Backwards compat full cu v1.2.23. Trigger: PM message 7 puncte (Pipeline analogue RO/RU + Chirie short + width fit + 4 zone restructure + commission % pe Property cu vizibilitate dublă agent/client + documentație sincronă cf. Regula 21). |
| **1.2.23** | **2026-05** | ★ PATCH — **M0.S8.2 follow-up #2: Kanban card structură 3 zone + statut clar (2 PM puncte).** Post-merge PR #46. PM: etichetele de sănătate anterioare (Bun/Verifică/Atenție) NU transmiteau sensul; + layout nou explicit pe card. Schimbări `apps/web-preview/components/deals/kanban-board.tsx` + i18n RO/RU/EN: (1) **Statut tranzacție reformulat** (decizie PM via AskUserQuestion) — `deal.healthLabels`: healthy „Merge bine" / review „De verificat" / risk „Risc mare" (RU: Идёт хорошо / Нужна проверка / Высокий риск · EN: Going well / Needs a check / High risk). Mutat sus-dreapta (lângă ID) ca indicator de statut. (2) **Card restructurat în 3 zone** conform spec PM: **Zona 1** = rând ID (stânga) + statut tranzacție (dreapta) / nume client (bold) / adresă completă „addr, oraș · zonă"; **Zona 2** = rând Tip ofertă (dot intent) + Preț (proprietate: €preț vânzare sau €chirie /lună) / rând Agent: nume + Comision €X (decizie PM: afișăm AMBELE preț + comision); **Zona 3** = link „Detalii →". (3) **i18n** chei noi `deal.{offerTypeLabel, priceLabel, commissionLabel, agentLabel, detailsLink, perMonth}` în 3 limbi. Tests: typecheck PASS · JSON valid 3 limbi · build PASS **26 routes** · dev smoke /deals 200 + content probe POZITIV (Merge bine ×10 / De verificat ×11 / Risc mare ×2 · 0× etichete vechi · 40 sume € (preț+comision per card) · 8× /lună rent · Agent: + Comision + Detalii prezente). Backend + Master Plan INTACTE. Backwards compat full cu v1.2.22. Trigger: PM message 2 puncte (statut mai clar + structură card 3 zone cu agent specificat + preț). |
| **1.2.22** | **2026-05** | ★ PATCH — **M0.S8.2 follow-up: Kanban card polish (3 PM puncte).** Post-merge PR #45. Schimbări `apps/web-preview/components/deals/kanban-board.tsx` + i18n: (1) **ID deasupra numelui** — deal ID (label-mono mic) mutat ca prima linie a cardului, apoi client (bold). Eliminat ID din footer. (2) **Adresă completă încadrată frumos** — 2 linii: `addr` (stradă + nr + apartament) pe linia 1 + `oraș · zonă` (muted) pe linia 2; ambele cu `truncate` pentru fit consistent. (3) **Etichetă sănătate într-un singur cuvânt** OK în toate 3 limbile — `deal.healthLabels.healthy`: RO „Pe drumul cel bun" → **„Bun"** · RU „Идёт по плану" → **„Хорошо"** · EN „On track" → **„Good"** (review/risk rămân Verifică/Atenție, deja un cuvânt). (4) **Suma nu se mai suprapune** — rând metrici cu `flex-1 min-w-0` pe grupul stâng (intent + sănătate, truncate) + `flex-shrink-0 whitespace-nowrap` pe comision (dreapta fixă). Tests: typecheck PASS · JSON valid 3 limbi · build PASS **26 routes** · dev smoke /deals 200 + content probe POZITIV (ID deasupra nume label-mono, 0× „Pe drumul cel bun", Bun/Verifică/Atenție vizibile, linie oraș·zonă prezentă). Backend + Master Plan INTACTE. Backwards compat full cu v1.2.21. Trigger: PM message 3 puncte (design tranzacții ID/adresă · health label 1 cuvânt 3 limbi · suma fără suprapunere). |
| **1.2.21** | **2026-05** | ★ MINOR — **M0.S8.2 ✅ CLOSED Kanban redesign + Workspace Direction + Regula 21.** Creative Director + Senior UI/UX + Senior PM. Schimbări `apps/web-preview/` (zero backend): (1) **Kanban redesign complet** (`components/deals/kanban-board.tsx`) — concept „Card cu 2 zone clare": zonă sus client (bold) + adresă proprietate · divider subtil · zonă jos rând metrici compact (dot intent + dot sănătate + comision auriu) · culoarea de stage DOAR pe headerul coloanei (eliminat bar colorat per card) · deal ID + agent mutate la footer subtil. Eliminat aglomerarea de badge-uri/dt-dd labels care făceau „haos de informație". (2) **Workspace Direction NEW** (`lib/workspace-store.ts` + `components/cabinet/workspace-direction-selector.tsx`) — toggle global `sale|rent|both` (localStorage, useSyncExternalStore) editabil din toate 3 cabinete (agent/agency/group). Când direcția e fixă, platforma **ascunde automat** ce nu corespunde: `/leads` (grupuri filtre + lead-uri filtrate prin `isIntentVisible`), `/properties` (tab-uri listing + proprietăți filtrate), `/deals` (tab intent forțat + ascuns toggle, badge direcție activă), `/notary` (tab Acte notariale/Contracte chirie forțat). (3) **NEW Regula 21** în §10b — „Documentația proiectului mereu sincronizată cu funcționalitatea": orice funcționalitate/condiție/regulă nouă obligă actualizarea documentației relevante în ACELAȘI PR (checklist pre-close + relație cu Regulile 4/6/8/17; finding MED la violare). (4) **Regula 20 §9 NEW** — Workspace Direction documentat: demo = toggle global; producție = model ierarhic companie→grup→agent (fiecare ≤ părinte). (5) **i18n RO** NEW namespace `workspace.*` (title/help/scopeDesc.{agent,agency,group}/option.{sale,rent,both}/optionHelp/effectNote/prodNote/savedToast/activeBadge). RU/EN deferred M1.S5. **Tests primary:** typecheck PASS · lint PASS (1 pre-existing OD-01) · build PASS **26 routes** · dev smoke 7/7 routes 200 + content probe POZITIV (Kanban card 2 zone fără old labels · selector Direcția de lucru în toate 3 cabinete · model ierarhic notat în UI). Backend `apps/api/` + BRD §7 + Master Plan **INTACTE** (Regula 8 + Regula 18). Roadmap bump v1.0.11 → **v1.0.12**; INDEX bump v1.1.17 → **v1.1.18**. Backwards compat full cu v1.2.20. Trigger: PM message 4 puncte (redesign Kanban + workspace direction cabinet + ajustare documentație + regulă nouă „mereu update documentația"). |
| **1.2.20** | **2026-05** | ★ PATCH — **M0.S8.1 ✅ CLOSED Post-merge UX polish (5 PM feedback points).** Senior UI/UX iteration post-merge PR #43. Schimbări `apps/web-preview/` (zero backend): (1) `/leads` filter type — grupare vizuală 2 segmented control box-uri: `Vânzare` (Cumpărător+Vânzător) și `Închiriere` (Chiriaș+Proprietar), buton `Toate` separat. Clarifică segregarea intent pe demand+supply. (2) `Vânzare + chirie` (`listingType='both'`) — adăugat `InfoTooltip` pe Badge în `/properties` cards + `/properties/[id]` detail cu explicație `Proprietarul este flexibil: acceptă fie vânzare, fie închiriere`. (3) `/deals` separation — NEW tab toggle `Toate / Vânzare / Închiriere` la top via `IntentFilter` prop pe `KanbanBoard`. Filter aplicat pe lead.leadType derivat intent. Card-uri arată badge intent + commission hint (`1× chirie` pentru rent). Banner pe tab rent cu trimitere la Cabinet notar. (4) `/notary` workflow split — NEW tab toggle `Acte notariale (vânzare) / Contracte chirie`. NEW entity `LeaseAgreement` + `LeaseAgreementStatus` enum 8 stări (DRAFTED → REVIEWED → SIGNED_TENANT → SIGNED_LANDLORD → DEPOSIT_PAID → ACTIVE → ENDED) + `lib/mock/lease-agreements.ts` seed builder. Rent workflow simplificat (RM nu cere notar pentru chirii < 36 luni): pre-completat → semnături ambele părți → depozit transferat → activ. UI cu acțiuni per status (Marchează verificat / Înregistrează semnătura / Confirmă depozit). (5) `/properties/new` — NEW secțiune `Tipul listării` cu 3-card radio selector (Vânzare/Închiriere/Ambele) + helper text per opțiune. Câmp preț condiționat de listingType (sale|both); câmp `Chirie lunară` condiționat (rent|both); ambele obligatorii când vizibile. NEW secțiune `Beneficii (puncte forte)` cu input + add/remove pattern (sync semantic cu PropertyBenefitsPanel din detail). i18n RO extins cu namespaces noi: `property.listingType.bothHelp` · `property.form.{listingTypeTitle, listingTypeDesc, listingTypeHelp.{sale,rent,both}, monthlyRentLabel, monthlyRentHelp, benefitsTitle, benefitsDesc, benefitsEmpty, benefitAddLabel}` · `deal.{subtitleSale, subtitleRent, intentFilterLabel, rentBanner, rentCommissionHint}` · `notary.{tabsLabel, tabSale, tabRent}` · NEW namespace `lease.*` (28 keys: status enum + KPI labels + workflow CTAs + toast messages + parties + period/deposit/contract labels). Regula 20 §5 actualizată cu workflow rent simplificat (LeaseAgreement entity + 7 stări). Tests primary: typecheck PASS · lint PASS (1 pre-existing OD-01) · build PASS **26 routes** · dev smoke 5/5 routes 200 + content probe POZITIV (1× Vânzare label + 1× Închiriere label + grupuri filter `/leads` · Toate+Vânzare+Închiriere tabs `/deals` · Acte notariale+Contracte chirie tabs `/notary` · Tipul listării+Beneficii (puncte forte) `/properties/new` · 8× `1× chirie` commission hint în deal cards · 11× `Vânzare + chirie` badge cu tooltip). Backend `apps/api/` + Master Plan + BRD §7 **INTACTE**. Backwards compat full cu v1.2.19. Trigger: PM message "Pina a trece la urmatorul pas este necesar sa facem ajustari in demo" cu 5 puncte specifice post-merge PR #43. |
| **1.2.19** | **2026-05** | ★ MINOR — **M0.S8 ✅ CLOSED Rental/Lease support + Regula 20 (segregare rent/sale).** PM identified market gap: REVYX acoperea doar sale; chiriile (~30% volum imobiliar RM) lipseau. Software Architect + Senior BA + Senior PM trio: arhitectură **type-agnostic core + calibration profiles** (sale/rent), zero modificare formule BRD §7, extension prin FK `transaction_profile_id` (M1.S3) + 2 row-uri seed în tabelă mică `transaction_profiles`. Schimbări `apps/web-preview/` (zero backend modificat — Regula 8): (1) **Types extended:** `LeadType` 2→4 (`buyer/seller/tenant/landlord`) Hybrid 4 enum + helper · NEW `TransactionIntent = sale|rent` · NEW `LeadSide = demand|supply` · NEW `Property.listingType = sale|rent|both` + `monthlyRentEur` + `Lead.rentPeriodMonths`. (2) **Helper NEW** `lib/transaction-intent.ts` cu `transactionIntent/leadSide/isDemandSide/isSupplySide/isListingMatchForLead`. (3) **Mock data realistic:** leads 48%/22%/22%/8% · properties 60%/25%/15% · rent ≈ 0.65% preț · commission 1× chirie. (4) **Component reuse intent-aware** (DRY): BuyerPreferencesPanel servește buyer+tenant cu pool features adaptiv + i18n `titleRent/descRent` · SellerPropertyPanel servește seller+landlord cu price labels adaptive + rent period · MatchPodium afișează €/lună + filter listing compatibility · suggestions per-(status×leadType) — supply leads primesc `request_documents` priority. (5) **Pages adaptive:** `/leads` filter 4→5 tabs + badge variant per type · `/leads/[id]` switch pe `isDemandSide()` + header intent badge · `/properties` NEW filter listingType 4 tabs + dual price display · `/properties/[id]` NEW field Tip listare + Chirie lunară. (6) **Notary acts** filtered sale only. (7) **i18n RO extins** 6 namespaces (leadType +2 / transactionIntent / landlord 8 keys / preferences titleRent / property.listingType 4 keys / leadDetail budgetRent + matchSubtitleTenant). RU/EN deferred M1.S5. **NEW Regula 20** în §10b — segregare 4 lead types + transaction_profile concept type-agnostic core + 2 calibration profiles (sale 180d/financing/%preț, rent 21d/credit-check/1× chirie); BR-01/BR-04/BR-12/BR-07 toate aplicabile uniform pe ambele. **Tests primary post-fix:** typecheck PASS · lint PASS (1 pre-existing OD-01) · build PASS **26 routes** (identic M0.S7) · dev smoke 9/9 routes 200 + content probe POZITIV per 4 lead types (Chiriaș/Proprietar/Cumpărător/Vânzător + Închiriere/Vânzare badges + €/lună vs preț). Backend `apps/api/` + BRD §7 + scoring/fixtures.ts + Master Plan **INTACTE** — Regula 8 + Regula 18 respectate. Roadmap bump v1.0.9 → **v1.0.10**; INDEX intern bump v1.1.13 → **v1.1.14**. Backwards compat full cu v1.2.18 (Regulile 1-19 toate neschimbate; Regula 20 NEW e extensie aditivă a Regulii 19). Trigger: PM message "gap rent/lease în piață RM — Software Architect + Senior BA + Senior PM trio ajustare full alignment". |
| **1.2.18** | **2026-05** | ★ MINOR — **Regula 19 (segregare buyer/seller) + Lead-detail rework + Dashboard rework + Property benefits.** Schimbări: (1) NEW Regula 19 în §10b — separarea obligatorie buyer/seller la nivel de schema Lead (`leadType` + `selling_property_id` pentru sellers) + UI distinct (BuyerPreferencesPanel + MatchPodium pentru buyer; SellerPropertyPanel + showings property-wide pentru seller) + sugestii NBA per tip + marketplace doar buyer + filtru obligatoriu `?type=` în lead list. (2) Demo `apps/web-preview/`: Lead type adăugat în mock data + types · NEW components `match-podium.tsx` (Top1/2/3 cu reveal inline al raționamentului — click NU navighează, doar expandează) · NEW `buyer-preferences-panel.tsx` (features + urgency + floor + notă cheie, editabil) · NEW `seller-property-panel.tsx` (link la proprietate + benefits + showings) · NEW `properties/benefits-panel.tsx` (bullet-list editabil + seed default per kind) · NEW `agents/rank-badge.tsx` (Top1/Top3/Top10/Performer + PerformanceStars). (3) Dashboard rework: Block A „Sarcinele mele active" eliminat (inutil; informația apare deja în /tasks). Layout nou row1 = Urgent / Performance / Decisii rapide (mutate sus per PM). Performance refacut: AgentRankBadge dominant + PerformanceStars + tranzacții închise + încredere + tenure → link clar la cabinet. (4) Lead detail rework: split conditional buyer/seller; suggestions scos din summary ca bloc separat (cu accentTop); MatchPodium înlocuiește lista de 3 linkuri; recompute button cu InfoTooltip explicativ. (5) i18n RO extins cu 6 namespaces noi (leadType, rank, preferences, benefits, seller, plus extensii la dashboard.blocks + leadDetail + matchReason). Backwards compat full cu v1.2.17 — backend `apps/api/` INTACT (Regula 8). |
| **1.2.17** | **2026-05** | ★ PATCH — **Documentation consolidation + Regula 18 introduction.** Sesiune docs-only triggered de PM directive "consolidare informație + ștergere fișiere vechi + regulă nouă: nu creați fișiere noi, actualizați cele vechi". Schimbări: (1) ★ NEW Regula 18 în §10b — "Single living document, no version proliferation". Doc bump = `Edit` (nu `Write`) pe ultima versiune + `git mv` la noul filename versionat. Niciodată două versiuni paralele simultan în repo. CLAUDE.md / README.md / AGENTS.md = filename fără versiune, bump intern. Anti-pattern interzis: acumulare zeci de fișiere `INDEX_v1.0.0..v1.1.13.md`. (2) Migrare retroactivă: **60 fișiere predecesoare șterse** (Roadmap 9 + INDEX 20 + Master Plan 1 + BRD 1 + READINESS_phase5 6 + DPIA_phase5 1 + SCC_VENDORS_phase5 2 + RUNBOOK_demo-deploy 1 + RUNBOOK_partition 1 + TECH_SPEC audit-log 2 + churn-ga 2 + marketplace 1 + match-engine 1 + ml-pricing-ga 3 + mobile-rn 1 + tenancy-roles 1 + 2 legal duplicates RO + 3 cs-playbooks CHURN + 2 workflow predecessors). Toate cross-refs din docs supraviețuitoare + **CI workflows** actualizate via sed bulk la versiunile finale (22 mapări). (3) **CI fix** `.github/workflows/audit-catalog-lint.yml` — script primea `--spec audit-log_v1.1.0.md` (acum șters); redus la doar v1.1.1 (single source consolidat). (4) §0a Status Execuție sync — bump intern doar; M0.S7 deliverables INTACTE; M1.S3 next neschimbat. Backwards compat full cu v1.2.16 (zero modificări `apps/api/` + `apps/web-preview/`). Trigger: PM directive post-M0.S7 PR #36 creation. |
| 1.2.16 | 2026-05 | ★ PATCH — **M0.S7 ✅ CLOSED Dashboard rework + task management + lead notes/documents + cabinet enrichment.** PM feedback run-2 (5 puncte) implementat. Framework primitives reused 1:1 (BRD §5 Pilon 04 + nba-engine §4.1 task_type enum + lifecycle + BR-04 max 3; deal-closure §4.3 document types). Decision PM: localStorage > backend wire (M1.S5 final wire-up). Schimbări `apps/web-preview/`: NEW `/tasks` page + 5 reusable components (TaskList, TaskModal, LeadSuggestions, NotesPanel, DocumentsPanel) + 4 stores (task-store + lead-extras-store + mock/tasks + mock/suggestions). Dashboard rework 6 blocuri A-F cu real ToDo interactive + per-lead suggestions feed. Lead detail: Engagement/Win chance buckets eliminate → înlocuit cu LeadSuggestions + NEW Notes + Documents sections. Cabinet agent enrichment: avatar gradient gold + bio + 3 CTAs + rating + lifetime + specialty tags. Cabinet agency+group intro descriptiv. Manager page: APS/Trust/Slots/BR-XX stripped → MetricPill (dots tonate) + InfoTooltip + escalation prietenos. i18n +143 keys (task/leadExtras/cabinetExtras). Roadmap bump v1.0.8 → **v1.0.9** (§3.7 NEW T-M0.S7-01..09 ☑); INDEX bump v1.1.12 → **v1.1.13**. Tests primary: typecheck PASS + lint PASS (1 pre-existing OD-01) + build PASS **21 routes** (+1 `/tasks`) + dev smoke 14/14 routes 200. Backend `apps/api/` + framework specs INTACTE (Regula 8). Backwards compat full cu v1.2.15. Trigger: PM directive Senior UI/UX Designer + Creative Director + Software Architect post-M0.S6 demo review (5 puncte feedback: dashboard rework + lead notes/documents + cabinet enrichment + agency-group descriptive intro + manager polish). |
| 1.2.15 | 2026-05 | ★ PATCH — **M0.S6 ✅ CLOSED Demo Polish livrat (UI only).** Senior Designer + Creative Director directive: ascundere completă a formulelor/acronimelor (LS/PS/IS/DP/DHI/APS/NBA/BR-XX/SLA HOT) din UI agent — formulele rămân backend-only (BRD §7 + scoring/fixtures.ts intacte). Schimbări `apps/web-preview/`: (a) i18n RO/RU/EN rescrise complet — etichete prietenoase (Prioritate / Calitate ofertă / Stare deal / Sarcini active din 3 disponibile / Răspunde până la / Recomandări actualizate) + structuri noi cabinet/tutorial/property.detail/property.form/dashboard.blocks/dashboard.decisions/deal.healthLabels/lead.tableHelp. (b) NEW pages: `/tutorial` (ghid 7 secțiuni cu link la fiecare modul) · `/cabinet/{agent,agency,group}` (cabinet personal cu tabs sumar/istoric/preferințe/documente; cabinet agenție cu KPI; cabinet grup cu leaderboard) · `/properties/[id]` (detalii cu galerie 6 foto + tur video + link public + caracteristici complete + interes activ + acțiuni rapide). (c) Dashboard restructurat în 4 blocuri clare A/B/C/D — sarcini active + lead-uri urgente + performanță + listă de azi + bloc decizii rapide (Sună urgent · Listă completă · Tranzacții · Adaugă proprietate). (d) Lead list: info-tooltip pe fiecare coloană (id/name/source/zone/sla/priority/status) cu explicații 1-2 rânduri; filtru `Toate` evidențiat cu fundal solid auriu; coloana LS redenumită Prioritate cu badge `Foarte mare / Mare / Medie / Scăzută`; status `nurturing` → `Monitorizare automată`. (e) Properties: cards click-through la `/properties/[id]`; LF redenumit `Anunț nou / De reîmprospătat / Necesită atenție` cu helper `lib/freshness.ts`. (f) Properties/new: secțiuni `Detalii esențiale` + `Poze și video` (upload area dashed border + Video link + External link). (g) Kanban deals: per-stage color bar + dot + ring drop indicator; cards arată Client name + Property address + Comision + Stare în loc de `L:L-XXXX → P:P-XXXX DP0.15 DHI0.49`; ELIMINATE butoanele Avansează/Înapoi — drag full-card direct via PointerSensor + KeyboardSensor. (h) `components/ui/info-tooltip.tsx` reusable component + `components/ui/score-badge.tsx` rescris cu LeadPriorityBadge + MetricPill (acronime ascunse). (i) site-nav.tsx: NEW link `Tutorial` + dropdown `Cabinet` (My cabinet / Agency cabinet / Group cabinet). **Tests primary post-fix:** `npm run typecheck` PASS · `npm run lint` PASS (1 pre-existing OD-01 font warning) · `npm run build` PASS (**20 routes** — 18 static + 2 dynamic `/leads/[id]` + `/properties/[id]`, +4 față de M0.S3) · `npm run dev` smoke 12/12 routes HTTP 200 + content probe (0× BR-04 / 0× SLA HOT / 0× Lead Score / 0× DP0. / 0× DHI0. în DOM). Roadmap bump v1.0.7 → **v1.0.8** (§3.6 M0.S6); INDEX v1.1.11 → **v1.1.12**. Backwards compat full cu v1.2.14 (zero modificări `apps/api/` — Regula 8 Master Plan compliance: backend M1.S2 nu se atinge, formule rămân intacte). Trigger: PM directive Senior Designer + Creative Director post-M1.S2 demo review (8 puncte feedback: tutorial / cabinete / claritate denumiri / info tooltips / property detail / deals visual + decryptare / formule ascunse). |
| 1.2.14 | 2026-05 | ★ PATCH — **M1.S2 ✅ CLOSED Phase A Foundation livrată.** §0a Status Execuție LIVE actualizat — Macro-milestone shift M1.S1 → M1.S2 ☑ cu Phase A entry închisă; sesiune curentă reflectă deliverables: 9 migrations SQL 0007-0015 (LEAD/PROPERTY/DEAL/ACTIVITY/TASK/OFFER/SHOWING + ALTER users agent fields + SCORING_STATE generic) cu trigger PL/pgSQL BR-04 + T07 chain integrity + EXCLUDE gist agent calendar; 9 Drizzle schemas TS paralele; 7 REST CRUD modules sub `apps/api/src/business/` cu `@Roles + @AuditEvent + tenant isolation + optimistic locking`; scoring fixtures T01..T07 + helpers + 10 tests PASS; integration test infrastructure testcontainers-postgres (opt-in via `npm run test:integration`) + CI job nou `integration`. Roadmap bump v1.0.6 → **v1.0.7**; INDEX bump v1.1.10 → **v1.1.11**. Tests primary: typecheck PASS + lint PASS (0/0) + test **22/22** PASS + build PASS. Trio canonical: Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap v1.0.7 ACTIVE. Backwards compat full cu v1.2.13 (Regulile 1-17 toate neschimbate; doar §0a sync). **Phase A entry închisă → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**. |
| 1.2.13 | 2026-05 | ★ PATCH — **3 reguli operaționale noi (Regulile 15-17) — model routing + întrebări exacte + token optimization.** Triggered de cerere PM "Reguli suplimentare obligatorii". Schimbări: (1) §10b extins cu ★ Regula 15 (Routare model: Sonnet = dezvoltare/programare/ajustare; Opus = analiză/refactoring/audit/arhitectură; aplicare obligatorie la fiecare prompt /sN+1 generat — linie explicită `Model recomandat`). (2) ★ Regula 16 (Întrebări exacte cu opțiuni — format 4 pași: identifică ambiguitatea + 2-4 opțiuni mutually exclusive + recomandare + scope constrains REVYX strict; interdicție invenții speculative). (3) ★ Regula 17 (Optimizare token la generare prompt — format structurat strict, cross-refs prin acronim, no context duplicat, max 5-7 files to read, target <2000 tokens/prompt). (4) Regula 5 actualizată — promptul next session include obligatoriu linie `Model recomandat: opus|sonnet` post-v1.2.13. Backwards compat full cu v1.2.12 (Regulile 1-14 toate neschimbate; doar §10b extins + Regula 5 enhanced). Trigger: PM message cerere reguli suplimentare model routing + clarificări + token optimization. |
