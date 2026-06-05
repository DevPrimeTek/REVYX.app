# DETAILED ROADMAP — REVYX Execution Tasks Decomposition
<!-- ROADMAP_REVYX_detailed-execution_v1.0.15.md · v1.0.15 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-dev → M0 → M1 → M2 (toate sub-stages)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4-§6
**★ Trigger v1.0.15:** ★ **AGI Layer — Agent Growth Intelligence (BRD §18 NEW).** Senior PM + Solution Architect + Senior BA + Senior Product Auditor. Analiza comparativă a 9 cărți de referință din practica imobiliară profesională (Carnegie/Hill/Beckwith/Maister/Gitomer/Fox/Lukic/Blanchard+Peale/Yamaguchi) + NAR Code of Ethics față de framework REVYX a identificat **7 gap-uri** cu impact HIGH/MEDIUM. Shift conceptual: „AOS care controlează agentul" → „AOS care **dezvoltă** agentul". AGI Layer este al 8-lea strat transversal (analog structural cu Pilon Retention §6.4). Livrabile: (1) **BRD v1.2.0 → v1.3.0** (git mv) cu ★ §18 Agent Growth Intelligence complet: §18.1 Relationship Intelligence (IS sub-dimensions + PKI) · §18.2 Agent Self-Development (agent_goals entity) · §18.3 NBA Execution Guides (execution_guides entity + seed 9 ghiduri) · §18.4 Ethics Checkpoints (BR-28, 4 trigger-uri, append-only) · §18.5 Value Communication Toolkit (value_proposition_card JSONB + Showcase extins) · §18.6 Client Alumni Lifecycle (BR-27, cron touchpoints T+12/24 luni) · §18.7 Financial Readiness Score RM [MOLDOVA-SPECIFIC] (BR-25, FRS calcul simplu). Plus: §6.5 NEW cu BR-25..BR-28 · §7.9 IS sub-dimensions + TS rework · §8.5 4 entități noi (execution_guides / client_alumni / agent_goals / ethics_checkpoints) · §13.4 KPI AGI (5 metrici noi) · §15 glosar +6 termeni AGI · §12 AC-AGI-01..08. (2) **Roadmap v1.0.14 → v1.0.15** (git mv) cu §4.4 AGI Layer NEW — 10 task-uri T-AGI-01..10 spanuite M1.S3-M1.S6 cu dependențe explicite + hats + effort estimate. (3) **INDEX v1.1.20 → v1.1.21** (git mv) — entry actualizat. (4) **CLAUDE.md v1.2.26 → v1.2.27** — §0a sync + changelog row. Backend `apps/api/` + BRD §7 formule + BR-01..BR-24 + Master Plan **INTACTE** (Regula 8 + Regula 18 + Regula 21). Backwards compat full cu v1.0.14.

**★ Trigger v1.0.14:** ★ **Moldova market specs — BRD §17 NEW [MOLDOVA-SPECIFIC].** Senior PM + Senior BA + DBA. Documentate 6 insight-uri specifice pieței RM identificate din analiza fluxului real al agenților moldoveni: (1) buget declarat vs confirmat (divergență sistematică 15-25%); (2) tipuri întâlnire calificare (office/public_place/on_site — on_site auto-create SHOWING); (3) pre-aprobare bancară cvasi-inexistentă (MoldIndConBank/Victoriabank/Mobiasbancă); (4) 90% modificare preferințe post-vizionare (preference_history JSONB[], feedback 5 dimensiuni, dismissed flag); (5) mandat exclusivitate sellers (30-90 zile, status tracking pending/signed/expired + cron reminder); (6) property_class RM (soviet_era/post_soviet/new_build/premium — index pentru Match Engine). Adăugate task-uri [MOLDOVA-SPECIFIC] T-MD-01..05 în §4.3 (M1.S3 scope). BRD v1.1.0 → **v1.2.0** (MINOR §17 nou). CLAUDE.md v1.2.25 → **v1.2.26** §0a sync. INDEX v1.1.19 → **v1.1.20**. Backend `apps/api/` + BRD §7 formule + Master Plan **INTACTE** (Regula 8 + 18 + 21). Backwards compat full cu v1.0.13.

**Trigger v1.0.13:** ★ **M0.S8.3 ✅ CLOSED — /deals polish (Pipeline rename + Kanban 4 zones + commissionPct)**. Creative Director + Senior UI/UX + FRONTEND WEB DEV. Output `apps/web-preview/` (zero backend): (1) i18n RO `deal.title` "Pipeline tranzacții" → **"Flux tranzacții"** (Regula 11 anglicism replace) · RU "Воронка сделок" → **"Поток сделок"** · NEW namespace `deal.intentShort.{sale,rent}` (Vânzare/Chirie · Продажа/Аренда · Sale/Rent) + `deal.rentCommissionShort` 3 limbi. (2) Kanban card 4 zone: **Z1** intent (sus) + ID & sănătate (jos) · **Z2** client / adresă (cu `title` tooltip) / oraș·zonă · **Z3** preț stânga + comision (`pct% · €` sale / `1× chirie · €` rent) / agent avatar+nume · **Z4** buton Detalii. Paddings strânse `px-sp2 py-1.5` pentru lățime utilă adresă. (3) NEW `Property.commissionPct` (nullable, sale|both) + mock distribuție 25% × 2.0% + 55% × 2.5% + 20% × 3.0%. (4) `/properties/new` NEW card `Comision (%)` cu input 0.5-6% step 0.1 + live preview `pct × preț = €sumă`. Preț extins `max=10000000` (10M EUR). (5) `/properties/[id]` afișează `Comision (vizibil clientului)` — vizibilitate dublă agent + client per PM directive. (6) `lib/mock/deals.ts` derivă commission din `property.commissionPct` (consistent cu UI form). T-M0.S8.3-01..09 ☑. Tests: typecheck PASS · lint PASS (1 OD-01) · build PASS **26 routes** · dev smoke 3/3 200 + content probe POZITIV. CLAUDE.md v1.2.23 → **v1.2.24**. Backend + BRD §7 + Master Plan **INTACTE** (Regula 8 + 18 + 21). Backwards compat full cu v1.0.12.

**Trigger v1.0.12:** ★ **M0.S8.2 ✅ CLOSED — Kanban redesign + Workspace Direction + Regula 21**. Creative Director + Senior UI/UX + Senior PM. Output `apps/web-preview/` (zero backend): (1) **Kanban redesign complet** — concept „Card cu 2 zone clare" (`components/deals/kanban-board.tsx`): zonă sus client (bold) + adresă proprietate · divider subtil · zonă jos rând metrici compact (dot intent + dot sănătate + comision auriu) · culoarea de stage DOAR pe headerul coloanei (eliminat bar colorat per card + aglomerarea de badge-uri/dt-dd labels care făceau „haos de informație"). (2) **Workspace Direction NEW** (`lib/workspace-store.ts` + `components/cabinet/workspace-direction-selector.tsx`): toggle global `sale|rent|both` editabil din toate 3 cabinete; ascunde automat lead-urile/proprietățile/tab-urile care nu corespund în `/leads` + `/properties` + `/deals` + `/notary`. (3) **NEW Regula 21** în CLAUDE.md §10b — documentația mereu sincronizată cu funcționalitatea (același PR; finding MED la violare). (4) **Regula 20 §9 NEW** — Workspace Direction: demo toggle global / producție ierarhic companie→grup→agent. (5) **i18n RO** NEW namespace `workspace.*`. T-M0.S8.2-01..05 ☑. Tests: typecheck PASS · lint PASS (1 pre-existing OD-01) · build PASS **26 routes** · dev smoke 7/7 routes 200. CLAUDE.md bump v1.2.20 → **v1.2.21**; INDEX v1.1.17 → **v1.1.18**. Backend + BRD §7 + Master Plan **INTACTE** (Regula 8 + 18 + 21). Backwards compat full cu v1.0.11.

**Trigger v1.0.11:** ★ **M0.S8 ✅ CLOSED — Rental/Lease support (Documentație + Demo full alignment)**. PM identified market gap: REVYX acoperea doar sale (buyer/seller). Chiriile (rent/lease, ~30% volum piață imobiliar RM) erau în afara framework. Software Architect + Senior BA + Senior PM trio: arhitectură **type-agnostic core + Calibration Profiles** (sale|rent ca FK extension viitoare la M1.S3 entry, tabelă mică `transaction_profiles` cu 2 row-uri seed); zero modificări BRD §7 formule (LS/PS/IS/DP/DHI/NBA/APS rămân single source of truth, fixtures T01-T07 backwards compat sale baseline). Output `apps/web-preview/` (zero backend modificat — Regula 8 compliance): (1) **Types extended:** `LeadType` 2→4 (`buyer/seller/tenant/landlord`) Hybrid 4 enum + helper · NEW `TransactionIntent = sale|rent` + `LeadSide = demand|supply` · NEW `Property.listingType = sale|rent|both` + `monthlyRentEur` nullable + `Lead.rentPeriodMonths` nullable. (2) **Helper NEW** `lib/transaction-intent.ts` cu `transactionIntent/leadSide/isDemandSide/isSupplySide/isListingMatchForLead`. (3) **Mock data realistic:** leads 48%/22%/22%/8% (smoke 100: 51/24/20/9) · properties 60%/25%/15% sale/rent/both (smoke 50: 24/9/6) · monthlyRentEur ≈ 0.65% priceEur · commission rent = 1× chirie / commission sale = 2.5% preț. (4) **Component reuse intent-aware DRY:** `BuyerPreferencesPanel` servește buyer+tenant cu pool features adaptiv + i18n `titleRent/descRent` · `SellerPropertyPanel` servește seller+landlord cu price labels adaptive + rent period · `MatchPodium` afișează €/lună + filter `isListingMatchForLead()` · `suggestions` per-(status×leadType) — supply leads primesc `request_documents` priority cu rationale adaptat. (5) **Pages adaptive:** `/leads` filter 4→5 tabs + badge variant per type · `/leads/[id]` switch pe `isDemandSide()` + intent badge · `/properties` NEW filter listing type 4 tabs + dual price display · `/properties/[id]` NEW field Tip listare + Chirie lunară. (6) **Notary acts** filtered sale only (rental lease agreements scope M1.S6+). (7) **i18n RO extins** 6 namespaces. RU/EN deferred M1.S5. **NEW Regula 20** în CLAUDE.md §10b — segregare 4 lead types + transaction_profile concept type-agnostic core + 2 calibration profiles. Tests primary: typecheck PASS · lint PASS (1 pre-existing OD-01) · build PASS **26 routes** · dev smoke 9/9 + content probe POZITIV per 4 lead types. T-M0.S8-01..07 ☑. CLAUDE.md bump v1.2.18 → **v1.2.19**; INDEX bump v1.1.16 → **v1.1.17**. Backend `apps/api/` + BRD §7 + scoring fixtures + Master Plan **INTACTE** — Regula 8 + Regula 18 respectate. **Rental gap închis → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED cu support nativ pentru ambele transaction profiles**.

**Trigger v1.0.9:** ★ **M0.S7 ✅ CLOSED — Dashboard rework + task management + lead notes/documents + cabinet enrichment**. Output `apps/web-preview/`: (1) NEW `/tasks` page cu filtre Azi/În lucru/Finalizate/Toate + modal `Adaugă sarcină nouă` + reusable `<TaskList>` + `<TaskModal>` components. Suport pentru 9 task types din framework (first_contact/follow_up/schedule_showing/send_property/request_documents/draft_offer/close_deal/review_no_show/custom — sync cu TECH_SPEC_REVYX_nba-engine §4.1). Status lifecycle PENDING/ACTIVE/COMPLETED/SNOOZED + BR-04 max 3 ACTIVE enforced via `lib/task-store.ts` (localStorage persistence). (2) Dashboard rework în 6 blocuri A-F: A sarcini sumar (3-slot dots) + link `Deschide programul`; B lead-uri urgente cu link `/leads?priority=urgent` (Block apăsabil); C performanță; D `Programul meu de azi` (ToDo real interactive, max 5 rows + buton add); E `Sugestii pentru lead-urile mele` (per-lead suggestions via `<LeadSuggestions>` — fiecare click `+ Adaugă în sarcini` creează task PENDING); F decizii rapide 4 butoane. (3) Lead detail rework: eliminat Engagement/Win chance buckets → înlocuit cu `<LeadSuggestions>` (sistemul îți spune ce să faci) + NEW secțiune `Note despre client` (textarea + listă persistent localStorage via `lib/lead-extras-store.ts`) + NEW secțiune `Documente client` (modal de atașare + 5 tipuri document: identity_proof/cadastre_extract/contract_preliminary/energy_certificate/other — sync cu TECH_SPEC_REVYX_deal-closure §4.3). (4) Cabinet agent rework: hero card cu avatar (initials gradient gold), bio, contact CTAs (Sună/Mesaj/Distribuie profilul), rating clienți (4.8/5 + 32 recenzii mock), tranzacții totale lifetime + specialty tags (Centru/Botanica/Apartament/Casă). Tab structure păstrată (sumar/istoric/preferințe/documente). (5) Cabinet agency + group: secțiune intro descriptivă „Ce este cabinetul agenției/grupului" la top. (6) Manager page polish: eliminat APS/Trust/Slots/BR-XX → înlocuit cu Scor performanță (dots tonate)/Încredere clienți (dots)/Sarcini active + InfoTooltip pe fiecare coloană tabel + escalation levels redenumite (Atenție/Urgent/Critic) + timing (15 min/45 min/2 ore 15 min). (7) NEW i18n keys: `task.*` (90 keys) + `leadExtras.*` (35 keys) + `cabinetExtras.*` (18 keys) + `dashboard.blocks.suggestionsTitle/tasksTodayTitle/openTasksPage` + `nav.tasks`. Backend `apps/api/` + BRD §7 + scoring/fixtures.ts T01..T07 + nba-engine spec **INTACTE** (framework primitives reused: task_type enum + lifecycle + max 3 active rule). Tests primary: typecheck PASS + lint PASS (1 pre-existing OD-01) + build PASS **21 routes** (+1 `/tasks`) + dev smoke 14/14 routes 200 + content probe POZITIV (0× BR- / 0× SLA HOT / 0× Lead Score / 0× DP0. / 0× APS în UI; 1× legitimate "Slots" în Modul label deja existent). T-M0.S7-01..09 ☑. **M0 demo polish iteration 2 → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**.

**Trigger v1.0.8:** ★ **M0.S6 ✅ CLOSED — Demo Polish UI livrat (formule complet ascunse în UI)**. Output `apps/web-preview/`: (1) i18n RO/RU/EN rescrise complet (zero acronime user-facing — LS/PS/IS/DP/DHI/APS/NBA/BR-XX/SLA HOT eliminate; etichete prietenoase Prioritate/Pe drumul cel bun/Anunț nou). (2) NEW pages: `/tutorial` (7 secțiuni ghid) · `/cabinet/{agent,agency,group}` (3 cabinete cu tabs / KPI / leaderboard) · `/properties/[id]` (galerie 6 foto + video + link public + specs + interes + acțiuni). (3) Dashboard restructurat în 4 blocuri A/B/C/D (sarcini active cu progress dots, lead-uri urgente count gigant, performanță dots tonate, listă de azi + decizii). (4) Lead list cu `<InfoTooltip>` pe toate coloanele + filtru ALL solid auriu + Nurturing → Monitorizare automată + coloana LS → Prioritate (badge text-only, fără 0.xx). (5) Properties freshness `Anunț nou / De reîmprospătat / Necesită atenție` (vs `Proaspăt/Învechire/Vechi`) + cards click-through la detail. (6) Properties/new cu secțiune media (upload area + video link + external link). (7) Deals kanban full-card drag (Avansează/Înapoi REMOVED), per-stage color bar, cards arată Client name + Property address + Comision + Stare badge (vs `L:L-1002 → P:P-1905 DP0.15 DHI0.49`), health → `Pe drumul cel bun / Verifică / Atenție`. (8) `score-badge.tsx` rescris (LeadPriorityBadge + MetricPill) + `components/ui/info-tooltip.tsx` NEW. site-nav extins cu Tutorial + dropdown Cabinet (3 items). Backend (`apps/api/`) + scoring fixtures T01..T07 + BRD §7 **NU se modifică** — single source of truth pentru formule. Tests primary: typecheck PASS + lint PASS (1 pre-existing OD-01) + build PASS **20 routes** (+4) + dev smoke 12/12 HTTP 200 + content probe 0× acronime UI. T-M0.S6-01..08 ☑. **M0 demo aproape MVP-ready → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**.

**Trigger v1.0.7:** ★ **M1.S2 ✅ CLOSED — Phase A Foundation livrată**. Output: (1) Migrations 0007-0015 (9 noi): `0007_agents.sql` ALTER users + agent fields (agent_since_date, out_of_office_until, language_skills JSONB, calendar_sync_token) + partial index active agents · `0008_leads.sql` LEAD entity complete cu GDPR fields NOT NULL + LS_initial 0.300 + firewall_state + scoring scaffold · `0009_properties.sql` PROPERTY cu generated price_per_sqm_eur + showcase_token + LF defaults · `0010_deals.sql` DEAL cu DP+DHI scaffold + closure_phase subset (M1.S6 expands) · `0011_activities.sql` ACTIVITY append source for IS/TS/NBA · `0012_tasks.sql` TASK + trigger PL/pgSQL `task_enforce_max_3_active` (BR-04) · `0013_offers.sql` OFFER cu chain integrity trigger `offer_validate_counter_parent` (T07) · `0014_showings.sql` SHOWING cu EXCLUDE gist agent calendar conflict (graceful fallback btree_gist absent) · `0015_scoring_state.sql` generic scoring snapshot table cu CHECK score_value scale-aware (NBA exception [0,2]). (2) Drizzle schema TS paralele pentru toate 9 tables + users.ts extins. (3) REST modules under `apps/api/src/business/`: leads/properties/deals/activities/tasks/offers/showings — fiecare cu DTO Zod + Service (CRUD + optimistic locking via `version`) + Controller cu `@Roles(Role.AGENT/TEAM_LEAD)` + `@AuditEvent` decorators per operation. Tenant isolation forced în orice query via `requireTenant(req)` din `apps/api/src/common/tenant-context.ts` + `WHERE tenant_id = $1`. (4) Scoring fixtures `apps/api/src/scoring/fixtures.ts` — T01..T07 ca const + helpers `computeLeadScore/computePropertyScore/computeDealProbability/computeNba/computeDhi/computeListingFreshness/apsForAgent`. Tests `fixtures.spec.ts` 10/10 PASS (T01..T07 + invariants NBA range + [0,1] clamp + LF curve). (5) Integration test infrastructure via `@testcontainers/postgresql` — `vitest.integration.config.ts` separat (skip default `npm test`, opt-in `npm run test:integration` + CI job dedicat); `test/integration/setup.ts` cu `setupTestDb/teardownTestDb/seedTenant` helpers; 2 spec files: `migrations.spec.ts` (toate 14 tables + trigger BR-04 + audit_log append-only + offer counter-chain integrity) + `leads-tenant-isolation.spec.ts` (T01 default scores + cross-tenant 404 + optimistic lock conflict). (6) Tests primary post-fix: `npm run typecheck` PASS · `npm run lint` PASS (0 erori, 0 warnings) · `npm run test` PASS **22/22** (4 fișiere: roles.guard 3 + auth.dto 6 + webhook-hmac 3 + scoring/fixtures 10) · `npm run build` PASS NestJS dist · `npm run test:integration` skip-uit local (no Docker) — runs în CI job nou `integration` dependent pe `build`. T-M1.S2-01..06 ☑. Out of scope (forward-applying M1.S3+): webhook intake real processing (Meta/Google/OLX → lead) · scoring engines (LS recompute, IS calc, NBA orchestration) · BR-01 Lead Firewall service · Escalation Protocol cron jobs · GDPR erasure BullMQ cascade worker · Match Engine v1 · pricing AI hooks · WhatsApp templates. **M1.S2 Phase A entry deblocat → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**.

**Trigger v1.0.6:** ★ **M1.S1 ✅ CLOSED — Phase 0 Security Foundation livrată**. Output: (1) `docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md` — spec arhitectural Phase 0 acoperind 7 items checklist + stack NestJS+Drizzle+PostgreSQL+Redis + threat model OWASP Top 10 + sign-off 5-rol. (2) `apps/api/` scaffold full — Next.js-style monorepo: NestJS 10 + Fastify adapter + Drizzle ORM + Vitest + ESLint + 22 fișiere TypeScript source (auth/rbac/audit/webhooks/gdpr/health/common/config/db modules). (3) Migrations SQL 0001-0006: tenants + users (enum role 5 system) + refresh_tokens + audit_log cu trigger anti-modify (BR-07 enforced la nivel BD + REVOKE rol app) + gdpr_consents + webhook_signatures. (4) Modules code: AuthService cu JWT RS256 (jose lib) + refresh rotation cu replay detection (`rotated_at` + `parent_token_id` chain) + Argon2id password hash + BR-12 single session enforcement; RBAC Role enum aditiv + decorator `@Roles` + RolesGuard global; AuditService + AuditInterceptor cu decorator `@AuditEvent`; WebhookHmacGuard cu signature verify timing-safe + dedup replay attack; GdprService cu Art. 15/17/18/20 endpoints; ThrottlerModule cu NFR-05/06 (20/min publice, 1000/min intern). (5) Tests baseline 12 passing: RBAC hierarchy (3) + Webhook HMAC signing (3) + Auth DTO Zod validation (6). (6) Legal drafts `docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md` + `COOKIE_POLICY_REVYX_v0.1.0.md` (drafts pending legal review M1.S2 entry — 5 OD-legal-XX + 3 OD-cookie-XX tracked). (7) CI workflow `.github/workflows/api-ci.yml` (typecheck+lint+test+build paralel pe `apps/api/**`). Tests primary: `npm run typecheck` PASS, `npm run lint` PASS, `npm run test` PASS 12/12, `npm run build` PASS. T-M1.S1-01..09 ☑. Out of scope (forward-applying): real DB integration tests (M1.S2 testcontainers), erasure cascade BullMQ worker (M1.S3), JWKS rotation endpoint, SSO Google, mobile OT-flow, custom roles Phase 5. **Phase 0 BLOCANT lifted** → M1.S2 Phase A Foundation entry UNBLOCKED.

**Trigger v1.0.5:** ★ **M0.S5 ✅ CLOSED — Hard Stress Test M0 EXIT GATE atins**. Output: (1) `docs/audit/HST_REVYX_m0_v1.0.0.md` — raport HST principal cu 9 categorii audit (UX flow J1-J4 + brand compliance + presentation rehearsal + message clarity + demo robustness + ★ Regula 11 i18n + ★ Regula 12 interactions + ★ Regula 13 tutorial coverage + ★ Regula 14 overlap viewport). 17 findings F-M0S5-01..17 catalogate: 0 CRIT, 2 HIGH (★ ambele FIXED acest PR), 6 MED triagate cu owner+ETA, 9 LOW backlog. Sign-off 8/8 (7-rol audit + Senior PM). (2) `docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md` — detailed findings cu repro steps + fix proposal + verification + cross-ref per finding. (3) Fix-uri imediate aplicate în acest PR: **F-M0S5-01 HIGH** `apps/web-preview/components/ui/card.tsx` — introdus `interactive` prop opt-in pentru hover translate; backward compatible (default false → toate Card existente devin static fără modificarea call-site-urilor). Violare Regula 12 closed. **F-M0S5-02 HIGH** `apps/web-preview/messages/{ro,ru}.json` — 30 keys RO + 14 keys RU retraduse (Dashboard → Panou de bord; Sign out → Deconectare; Queue → Listă; Match needs review → Potrivire necesită revizuire; Won → Câștigat / Выигр.; Discovery → Descoperire / Поиск; healthy/review/risk → sănătos/de revizuit/risc; Fresh/Aging/Stale → Proaspăt/Învechire/Vechi; Match suggestions → Sugestii de potrivire; etc). Violare Regula 11 closed. (4) Tests primary post-fix: `npm run typecheck` PASS, `npm run lint` PASS (1 warning known F-M0S5-10 LOW pre-existing), `npm run build` PASS (15 routes static + 1 dynamic identic pre-fix). T-M0.S5-01..04 ☑. T-M0.S5-05 (TutorialOverlay POC) decizie deferred M1.S5 cu task explicit T-M1.S5-XX (cross-ref F-M0S5-14) — Regula 13 forward-applying post-v1.2.10 + demo deck+video substitute pentru M0 demo flow. **M0 EXIT GATE atins** — unblocks M1.S1 Phase 0 Security Foundation entry direct.

**Trigger v1.0.4:** ★ **M0.S4 ✅ CLOSED — Pitch Deck + Video Walkthrough livrat**. Output: (1) `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/` — director nou cu 5 fișiere: README.md (index + structură 16 slides + visual specs aspect 16:9), deck-ro.md (canonic 16 slides + speaker notes inline RO), deck-ru.md (translation rusă), deck-en.md (translation engleză), assets/SCREENSHOT_REFS.md (mapping slide → screenshot). T-M0.S4-01..05 ☑. (2) `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — storyboard 8 scene × 5:00 durată cu VO RO/RU/EN sincronizat pe timing markers (intro → login+dashboard → leads queue+scoring → lead detail+assign → property+match → deal pipeline drag-drop → manager command → i18n+closing). Production checklist + SRT generation + cross-ref AC-M0-03. T-M0.S4-05..06 (script) ☑ — recording fizic T-M0.S4-06 (post-DNS T-M0.S3-14) tracked separat. (3) `docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md` — instrucțiuni capture 18 screens (7 mandatory × 2 locale RO+EN = 14 fișiere PNG mandatory pentru deck export), procedura manual + Playwright script propus reproducible. T-M0.S4-07 ☑. T-M0.S4-08 (export PDF aspect 16:9 marp-cli) rămâne ◐ opțional — depinde de OD-M0.S4-01..04 PM input (cifră invest, URL demo final, logo asset, echipa). Open decisions tracked OD-M0.S4-01..04 non-blocking M0.S5. **Trigger v1.0.3:** ★ **M0.S3 ✅ CLOSED — Web Static Demo livrat**. Output: (1) **T-M0.S3-01 amended — physical directory `apps/web-preview/` retained pentru Vercel Root Directory stability (Regula 10 nouă)**; semantic upgrade in-place la `@revyx/web-preview@0.2.0`. Un attempt anterior cu `git mv apps/web-preview → apps/web` a fost rolled back când a rupt deploy-ul (Vercel Root Directory încă apuntă la path-ul vechi). (2) Mock data full: 100 leads (LS distribution HOT 12% / qualified 22% / warm 36% / nurturing 30%), 50 properties (apartament/casă/teren/comercial cu PS+LF realistic), 20 deals (6 stages), 8 agents cu APS/Trust/Slots. (3) i18n RO/RU/EN via custom React context provider + `messages/{ro,ru,en}.json` (~120 keys/limbă) + language switcher în `<SiteNav>` cu localStorage persistence. (4) `/deals` drag-drop @dnd-kit (PointerSensor distance 6 + KeyboardSensor + DragOverlay +1°) cu click-to-advance permanent ca a11y fallback. (5) 3 pagini noi: `/settings`, `/profile`, `/notifications`. (6) Tests executate (Regula 10 §2): `npm run typecheck` PASS, `npm run lint` PASS (1 warning known OD-01 font), `npm run build` PASS 16 routes (15 static + 1 dynamic `/leads/[id]`), `npm run dev` smoke test 14 routes HTTP 200 + mock content verified în DOM (100 leads + 50 properties + 20 deals + 20 drag handles + language switcher + 404 fallback `/leads/L-9999`). T-M0.S3-14 DNS step documented Runbook v1.0.2 §2.3.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | Senior Architect + Senior PM + Senior PO | INITIAL — descompune Master Plan v1.1.0 sub-stages în atomic tasks (T-XXX). |
| 1.0.1 | 2026-05 | DESIGNER (Creative Director) + Senior Architect + Frontend Lead + Senior PM + DOC | PATCH — direct-to-code shift M0.S1 + M0.S3 scope rebalance. §3.1 reformulat din wireframe Figma → page stub React; §3.3 T-M0.S3-01..03 marked PARTIAL inherited. NU breaking pentru AC-M0-01..07. |
| 1.0.2 | 2026-05 | FRONTEND WEB DEV + DESIGNER (Creative Director) + ARCHITECT + Senior PM + DOC | PATCH — M0.S2 ✅ CLOSED Clickable Prototype. §3.2 M0.S2 T-M0.S2-01..05 marcaje ☑. Output: 3 pages noi în `apps/web-preview/app/`, `<ToastProvider/>` global, button focus rings/active states. 13/13 routes prerendered. |
| 1.0.3 | 2026-05 | FRONTEND WEB DEV (P) + DEVOPS (S) + DESIGNER (S) + DOC | PATCH — M0.S3 ✅ CLOSED Web Static Demo. §3.3 T-M0.S3-01..13 marcaje ☑ (T-M0.S3-14 PARTIAL — DNS step documented). Backwards compat full cu v1.0.2. SUPERSEDED de v1.0.4. |
| 1.0.4 | 2026-05 | DOC (P) + DESIGNER (S, Creative Director) + ARCHITECT (S, a11y captions) + Senior PM | PATCH — M0.S4 ✅ CLOSED Pitch Deck + Video Walkthrough. §3.4 T-M0.S4-01..05 + T-M0.S4-07 marcaje ☑ (T-M0.S4-06 + T-M0.S4-08 ◐ deferred). Output 6 documente noi în `docs/marketing/`. SUPERSEDED de v1.0.5. |
| **1.0.15** | **2026-06** | ★ Senior PM (P) + Solution Architect (P) + Senior BA (P) + Senior Product Auditor (S) + DOC | ★ **MINOR — AGI Layer (Agent Growth Intelligence) — BRD §18 NEW + §4.4 Roadmap NEW.** Analiza bibliografică profesională (9 cărți + NAR Code of Ethics) vs framework REVYX → 7 gap-uri identificate → §4.4 cu T-AGI-01..10 spanuite M1.S3-M1.S6. BRD v1.2.0 → **v1.3.0** (§18 complet + §6.5 BR-25..28 + §7.9 IS/TS extensii + §8.5 4 entități noi + §13.4 KPI AGI + §12 AC-AGI + §15 glosar). CLAUDE.md v1.2.26 → **v1.2.27** §0a sync. INDEX v1.1.20 → **v1.1.21**. Backwards compat full cu v1.0.14. |
| **1.0.14** | **2026-06** | ★ Senior PM (P) + Senior BA (P) + DBA (S) + DOC | ★ **PATCH — Moldova market specs BRD §17 + T-MD-01..05 [MOLDOVA-SPECIFIC].** §4.3.MD NEW — sub-secțiune Moldova Market-Specific Schema Tasks cu 5 task-uri planificate scope M1.S3: T-MD-01 LEAD câmpuri Moldova (declared_budget/confirmed_budget/preference_history/dismissed_property_ids) · T-MD-02 ACTIVITY meeting_location_type + on_site trigger auto-SHOWING · T-MD-03 PROPERTY property_class enum RM + index matching · T-MD-04 LEAD mandate exclusivitate sellers (status + cron reminder) · T-MD-05 SHOWING feedback 5 dimensiuni structurate (price/zone/surface/condition/other). BRD v1.1.0 → **v1.2.0** (git mv + §17 NEW 6 sub-secțiuni). CLAUDE.md v1.2.25 → **v1.2.26** §0a Moldova row + changelog. INDEX v1.1.19 → **v1.1.20** entry BRD + Roadmap updatate. Backend `apps/api/` + BRD §7 formule + Master Plan **INTACTE** (Regula 8 + Regula 18 + Regula 21). Backwards compat full cu v1.0.13 — task-urile T-MD-XX sunt ADDITIVE pe schema existentă (migrations 0008/0009/0011/0014). |
| **1.0.13** | **2026-05** | ★ Creative Director (P) + Senior UI/UX (P) + FRONTEND WEB DEV (P) + DOC + Senior PM | ★ **PATCH — M0.S8.3 ✅ CLOSED /deals polish (Pipeline rename + Kanban 4 zones + commissionPct).** §3.9 NEW cu T-M0.S8.3-01..09 atomic tasks ☑. PM 7 puncte feedback: (1) i18n RO "Pipeline" → "Flux" + RU "Воронка" → "Поток" (Regula 11). (2) NEW i18n `deal.intentShort.{sale,rent}` în 3 limbi pentru carduri kanban (Chirie/Аренда/Rent — etichete scurte). (3) Card width fit prin paddings strânse + truncate cu title tooltip. (4) Kanban 4 zone explicite (intent sus + ID/sănătate / client+adresă+regiune / preț+comision+agent / detalii). (5) NEW `Property.commissionPct` nullable cu form de input la create + live preview `pct × preț = €sumă`. (6) Vizibilitate dublă agent + client pe property detail page. (7) Preț extins max 10M EUR. Tests: typecheck PASS + lint PASS (1 OD-01) + build PASS **26 routes** + dev smoke 3/3 + content probe (Flux tranzacții 2× / Chirie 8× / Vânzare 13× / commission `pct% · €` 12 sale cards / `1× chirie · €` 8 rent cards / 0× Pipeline rezidual). CLAUDE.md v1.2.23 → **v1.2.24** §0a sync + changelog row + Regula 21 reaffirmation. Backend `apps/api/` + BRD §7 + scoring fixtures + Master Plan **INTACTE** (Regula 8 + Regula 18 + Regula 21). Backwards compat full cu v1.0.12. |
| **1.0.12** | **2026-05** | ★ Creative Director (P) + Senior UI/UX (P) + Senior PM (P) + FRONTEND WEB DEV (P) + DOC | ★ **MINOR — M0.S8.2 ✅ CLOSED Kanban redesign + Workspace Direction + Regula 21.** §0 Trigger v1.0.12 entry. (1) Kanban redesign „card 2 zone clare" — client+adresă sus / metrici jos (intent + sănătate + comision) / culoare stage doar pe header coloană; eliminat haosul de badge-uri + dt/dd labels. (2) Workspace Direction NEW (`lib/workspace-store.ts` + `components/cabinet/workspace-direction-selector.tsx`) — toggle global `sale|rent|both` din 3 cabinete; filtrare automată globală `/leads` + `/properties` + `/deals` + `/notary`. (3) NEW Regula 21 (documentația mereu sincronizată cu funcționalitatea, același PR). (4) Regula 20 §9 (Workspace Direction: demo global / producție ierarhic companie→grup→agent). (5) i18n RO `workspace.*`. T-M0.S8.2-01..05 ☑. Tests: typecheck PASS + lint PASS (1 OD-01) + build PASS **26 routes** + dev smoke 7/7. CLAUDE.md v1.2.20 → v1.2.21; INDEX v1.1.17 → v1.1.18. Backend + BRD §7 + Master Plan INTACTE (Regula 8 + 18 + 21). Backwards compat full cu v1.0.11. |
| **1.0.11** | **2026-05** | ★ Software Architect (P) + Senior BA (P) + Senior PM (P) + FRONTEND WEB DEV (P) + DOC | ★ **MINOR — M0.S8 ✅ CLOSED Rental/Lease support (Documentație + Demo full alignment).** §3.8 NEW cu T-M0.S8-01..07 atomic tasks ☑. Acoperă PM-identified market gap: REVYX acoperea doar sale (buyer/seller). Chiriile (~30% volum piață imobiliar RM) erau în afara framework. **Arhitectură decisivă:** type-agnostic core + Calibration Profiles (sale/rent ca FK extension viitoare M1.S3, 2 row-uri seed în tabelă mică `transaction_profiles`). Zero modificări formule BRD §7 (LS/PS/IS/DP/DHI/NBA/APS rămân single source of truth, fixtures T01-T07 backwards compat sale baseline). Output `apps/web-preview/`: Types extended (LeadType 2→4 Hybrid + TransactionIntent + LeadSide + ListingType + monthlyRentEur + rentPeriodMonths), helper `lib/transaction-intent.ts`, mock data realistic distribution, component reuse intent-aware DRY (BuyerPreferencesPanel serves buyer+tenant; SellerPropertyPanel serves seller+landlord; MatchPodium afișează €/lună + intent compatibility filter), pages adaptive (`/leads` 5 tabs, `/properties` listing filter, `/leads/[id]` switch demand/supply), i18n RO extins 6 namespaces. NEW Regula 20 în CLAUDE.md §10b. Tests primary: typecheck PASS + lint PASS (1 pre-existing OD-01) + build PASS **26 routes** + dev smoke 9/9 routes 200 + content probe POZITIV per 4 lead types. CLAUDE.md bump v1.2.18 → v1.2.19; INDEX bump v1.1.16 → v1.1.17. Backend `apps/api/` + BRD §7 + scoring fixtures + Master Plan **INTACTE** (Regula 8 + Regula 18 compliance). Backwards compat full cu v1.0.10. |
| **1.0.10** | **2026-05** | ★ Senior Architect + Senior PM + DOC | ★ **PATCH — Documentation consolidation (Regula 18 introduction).** Sesiune docs-only. (1) Migrare retroactivă: **60 fișiere** predecesoare șterse pentru toate seriile multi-version din `docs/` (Roadmap 9 + INDEX 20 + Master Plan 1 + BRD 1 + READINESS_phase5 6 + DPIA_phase5 1 + SCC_VENDORS_phase5 2 + 2 RUNBOOK predecessors + 11 TECH_SPEC predecessors + 2 legal duplicates RO + 3 cs-playbooks CHURN + 2 workflow predecessors). Doar ultima versiune din fiecare familie e păstrată în repo. (2) Cross-refs din toate docs supraviețuitoare actualizate via sed bulk (BRD_v1.0.0 → v1.1.0, MASTER_PLAN_v1.1.1 → v1.1.2, TECH_SPEC_match-engine_v1.0.0 → v2.0.0 etc — total 17 mapări). (3) Roadmap rename: v1.0.9 → v1.0.10 (Edit + git mv, NU duplicate). (4) Doc-uri vii (Roadmap/INDEX/Master Plan/BRD/CLAUDE.md/specs/runbook-uri) — la viitoare bump-uri Regula 18 se aplică: Edit + git mv (NU Write + Delete cycle paralel). Backwards compat full cu v1.0.9 (zero modificări `apps/api/` + `apps/web-preview/` + framework specs). Trigger: PM directive post-PR #36 — "consolidați informația în fișiere și ștergeți toate fișierele vechi din documentație; nu creați fișiere noi". |
| 1.0.9 | 2026-05 | ★ DESIGNER (Creative Director, P) + FRONTEND WEB DEV (P) + ARCHITECT (S, framework alignment) + DOC + Senior PM | ★ **PATCH — M0.S7 ✅ CLOSED Dashboard rework + task management + lead notes/documents + cabinet enrichment.** §3.7 NEW cu T-M0.S7-01..09 atomic tasks ☑. Acoperă feedback PM run-2 (5 puncte): (1) dashboard 6 blocuri reale + interactive ToDo list + lead suggestions per-lead (NBA flow demo); (2) lead detail cu notițe + documente atașate (5 tipuri document din TECH_SPEC_REVYX_deal-closure §4.3); (3) cabinet agent enrichment (avatar + bio + specialty + rating + lifetime stats + contact CTAs); (4) cabinet agency/group cu intro descriptiv pentru clienți; (5) manager page acronime stripped. NEW `/tasks` page full-time management cu filtre + modal. Reusable components: `<TaskList>`, `<TaskModal>`, `<LeadSuggestions>`, `<NotesPanel>`, `<DocumentsPanel>`. Stores: `lib/task-store.ts` + `lib/lead-extras-store.ts` cu localStorage persistence. i18n extins cu `task.*` (90 keys) + `leadExtras.*` (35 keys) + `cabinetExtras.*` (18 keys). Framework primitives reused per BRD §5 Pilon 04 + nba-engine §4.1 (9 task types + lifecycle PENDING/ACTIVE/COMPLETED/SNOOZED + BR-04 max 3 active enforced). Backend `apps/api/` + scoring fixtures + BRD §7 NU se modifică. Tests primary: typecheck PASS + lint PASS (1 pre-existing OD-01) + build PASS **21 routes** (+1 `/tasks`) + dev smoke 14/14 routes 200. CLAUDE.md bump v1.2.15 → v1.2.16. Backwards compat full cu v1.0.8. |
| 1.0.8 | 2026-05 | ★ DESIGNER (Creative Director, P) + FRONTEND WEB DEV (P) + ARCHITECT (S) + DOC + Senior PM | ★ **PATCH — M0.S6 ✅ CLOSED Demo Polish (UI-only).** §3.6 NEW cu T-M0.S6-01..08 atomic tasks ☑. Acoperă feedback PM 8 puncte: tutorial menu / cabinete agent+agenție+grup / dashboard restructurat în blocuri / lead column info-tooltips / property detail cu galerie/video/link / deals kanban cu drag full-card + culori per stage / formule complet ascunse în UI. Output `apps/web-preview/`: i18n rescris 254 keys/limbă, 7 new files (info-tooltip, freshness, tutorial, 3 cabinet pages, property detail), kanban-board rewritten, score-badge rewritten (LeadPriorityBadge + MetricPill), 5 pages updated (dashboard / leads / properties / properties/new / profile / leads/[id] / deals). Backend `apps/api/` + scoring/fixtures.ts + BRD §7 NU se modifică. Tests primary: typecheck PASS + lint PASS (1 pre-existing OD-01) + build PASS 20 routes. CLAUDE.md bump v1.2.14 → v1.2.15. Backwards compat full cu v1.0.7. |
| 1.0.7 | 2026-05 | ★ BACKEND DEV (P) + Senior DBA (P) + Senior Solution Architect (S) + Senior QA / Test Architect (S) + DOC + Senior PM | ★ **PATCH — M1.S2 ✅ CLOSED Phase A Foundation livrată.** §4.2 M1.S2 expandat cu T-M1.S2-01..06 atomic tasks ☑. Output: 9 migrations SQL noi (0007-0015) acoperind 9 entități business (LEAD/PROPERTY/DEAL/ACTIVITY/TASK/OFFER/SHOWING + ALTER users agent fields + SCORING_STATE generic) cu trigger PL/pgSQL BR-04 + T07 offer chain integrity + EXCLUDE gist agent calendar; 9 Drizzle schema TS files paralele + index.ts updated; 7 REST CRUD modules sub `apps/api/src/business/` cu `@Roles + @AuditEvent + tenant isolation + optimistic locking`; scoring fixtures T01..T07 + helpers + 10 tests; integration test infrastructure testcontainers-postgres (skip default, opt-in via `npm run test:integration`) + CI job dedicat. CLAUDE.md bump v1.2.13 → v1.2.14 (§0a M1.S2 ☑ sync). Tests primary: typecheck PASS + lint PASS (0/0) + test **22/22** PASS + build PASS. Backwards compat full cu v1.0.6 (zero modificări §3 M0 sau §4.1 M1.S1). **Phase A entry închisă → M1.S3 Phase B Lead Intake + Scoring engines UNBLOCKED**. |
| 1.0.6 | 2026-05 | ★ BACKEND DEV (P) + Senior Security Auditor (P) + Senior DBA (S) + Senior Solution Architect (S) + DOC + Senior PM | ★ **PATCH — M1.S1 ✅ CLOSED Phase 0 Security Foundation livrată.** §4 M1 expandat cu §4.1 M1.S1 atomic tasks T-M1.S1-01..09 ☑. Output: TECH_SPEC phase0-security v1.0.0 + apps/api/ scaffold NestJS 10 cu 22 src TS files + 6 migrations SQL + AuditLog append-only trigger + JWT RS256 + RBAC 5 roluri + GDPR endpoints Art. 15/17/18/20 + HMAC webhook guard + Throttler NFR-05/06 + Privacy/Cookie Policy drafts + CI workflow api-ci.yml. Tests primary PASS: typecheck + lint + test 12/12 + build. Backwards compat full cu v1.0.5 (zero modificări §3 M0). **Phase 0 BLOCANT lifted → M1.S2 entry UNBLOCKED**. |
| 1.0.5 | 2026-05 | Audit Lead (P) + Senior Architect (S) + DESIGNER (S, Creative Director) + QA / Test Architect (S) + Senior Product Auditor (S) + Senior Compliance Auditor (S) + Senior Security Auditor (S) + DOC + Senior PM | PATCH — M0.S5 ✅ CLOSED Hard Stress Test M0 EXIT GATE. §3.5 T-M0.S5-01..04 marcaje ☑ (T-M0.S5-05 TutorialOverlay POC ◐ deferred M1.S5 cu task explicit T-M1.S5-XX, cross-ref F-M0S5-14 forward-applying Regula 13). Output: (1) `docs/audit/HST_REVYX_m0_v1.0.0.md` — raport HST principal 9 categorii audit + 17 findings register + sign-off 8/8. (2) `docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md` — detailed findings cu repro + fix proposal. (3) Fix-uri imediate `apps/web-preview/`: `components/ui/card.tsx` (F-M0S5-01 HIGH Regula 12) + `messages/{ro,ru}.json` (F-M0S5-02 HIGH Regula 11, 44 keys retraduse). Severity: 0 CRIT + 0 HIGH post-fix + 6 MED triagate + 9 LOW backlog. **M0 EXIT GATE ATINS** → M1.S1 Phase 0 Security Foundation entry UNBLOCKED. Backwards compat full cu v1.0.4 (zero modificări §2/§3.1/§3.2/§3.3/§3.4/§4/§5/§6/§7; doar §3.5 M0.S5 expandată + trigger note actualizat în §0). AC-M0-01..07 ☑ toate. |

> **Compat (v1.0.4 → v1.0.5):** Niciun task din Pre-dev, M1.S1..S8, M2.S1..S8 NU e modificat. M0.S1 + M0.S2 + M0.S3 + M0.S4 rămân neschimbate. Doar §3.5 M0.S5 expandată cu T-M0.S5-01..05 detaliate + status marcaje ☑ + trigger note actualizat în §0. AC-M0-01..07 **neschimbate**. M1.S5 capătă reference nouă T-M1.S5-XX TutorialOverlay (forward-applying Regula 13) — tracked în findings F-M0S5-14, NU intrare separată în §4 v1.0.5 (decizia Senior PM: avoid §4 mutation; va fi integrat în Roadmap v1.0.6+ când M1.S1 entry).

---

## 1. Filozofie Detailed Roadmap

| Aspect | Definiție |
|---|---|
| **Atomic task (T-XXX)** | Unit minim de lucru autonom; produce un output verificabil |
| **Effort estimate** | XS (≤2h) · S (2-4h) · M (4-8h) · L (8-16h) · XL (16-32h) |
| **Owner hat** | Unul din 11 hats (vezi Master Plan §2.2); maximum 2-3 hats co-active |
| **Dependencies (DEP)** | Lista task-uri prerequisite (T-YYY); blocking dacă neînchise |
| **Platform tag** | 🌐 Web · 📱 Mobile · 🔁 Both · 🔧 Backend (no UI) · 📋 Doc/Plan |
| **Output deliverable** | Fișier(e) creat(e)/modificat(e) sau livrabil concret |
| **Sesiune Claude estimată** | Atomic task ≈ 1 sesiune productivă pe Pro plan (~3-4h efectiv) |

### 1.1 Reguli planning task

1. Niciun task NU începe înainte ca toate DEP să fie ☑.
2. Tasks XL trebuie split în sub-tasks dacă posibil (preferat L max).
3. Hats specificate per task = activate la inceput sesiune Claude Code.
4. Output deliverable verificat în PR review înainte de close task.
5. Critical Path tasks (§6) au prioritate absolută — orice slack acolo blochează totul.

---

## 2. Pre-development (S16-S20)

> Neschimbat față de v1.0.0. Pre-dev a fost închis la S20 HST #2 PASS clean.
> Pentru detaliu vezi `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2 (mențin compat).

**Summary:** S16..S19 documentation closure + S20 Hard Stress Test #2 ✅ PASS clean (per `HST_REVYX_pre-dev_v1.0.0.md`).

---

## 3. M0 — MVP PREZENTARE Detailed

**Scope:** Demo web pentru pitching investitori/clienți; NU este produs funcțional.
**Hats activate:** DESIGNER (Creative Director), FRONTEND WEB DEV (early activation per direct-to-code shift), ARCHITECT, DOC.

### 3.1 M0.S1 — Design System direct-to-code ★ REVISED v1.0.1

> **Re-orientare strategică (S20 close):** Figma traditional → direct-to-code. Tokens.json devine source of truth pentru `tailwind.config.ts`; page stubs React livrați direct (vs wireframe Figma), reusabili 1:1 în M0.S3, M1.S5+, M2.S2.

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M0.S1-01 | Audit brand-config revyx.md compliance | DESIGNER | XS | S20 close | 📋 | review notes (incl. font discrepancy flag) |
| T-M0.S1-02 | Inventory ecranelor critice demo (15-20 screens) | ARCHITECT + DESIGNER | S | T-M0.S1-01 | 📋 | `design/screens-inventory.md` |
| ★ T-M0.S1-03 | Page stub: Login (Auth Modul 1) | FRONTEND WEB DEV + DESIGNER | S | T-M0.S1-09 | 🌐 | `apps/web-preview/app/login/page.tsx` |
| ★ T-M0.S1-04 | Page stub: Dashboard Agent (NBA + queue) | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/dashboard/page.tsx` |
| ★ T-M0.S1-05 | Page stub: Lead Queue + Lead Detail | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/leads/page.tsx` + `[id]/page.tsx` |
| ★ T-M0.S1-06 | Page stubs: Property List + Deal Pipeline kanban (static) | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/properties/page.tsx` + `deals/page.tsx` |
| ★ T-M0.S1-07 | Page stub: Manager Dashboard (APS leaderboard, escalări) | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/manager/page.tsx` |
| ★ T-M0.S1-08 | Page stub: Admin panel (RBAC matrix, DP-05 enforcement) + PNG screenshots | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/admin/page.tsx` + `design/screenshots/*.png` (local capture step) |
| T-M0.S1-09 | Design System tokens (colors, spacing, typography, motion, breakpoints) | DESIGNER | S | T-M0.S1-02 | 🌐 | `design/tokens.json` |
| ★ T-M0.S1-10 | Component primitives in code (Button, Card, Input, Modal, Badge, Table) | FRONTEND WEB DEV + DESIGNER | L | T-M0.S1-09 | 🌐 | `apps/web-preview/components/ui/*.tsx` + `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` |

**Hats activate M0.S1 (revised):** DESIGNER (P, Creative Director) + FRONTEND WEB DEV (P, ★ early activation) + ARCHITECT (S, responsive + a11y strategy) + DOC (S, spec + INDEX/Roadmap PATCH).

**Exit gate M0.S1:**
- `design/tokens.json` validat brand revyx.md (100% paletă + typography + spacing + WCAG AA contrast)
- `apps/web-preview/` rulează `npm install && npm run dev` fără erori (developer-local close step)
- 7+ page stubs accesibile cu navigație linkable; minim 3 cu RSC pattern
- `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` publicat cu §approval matrix
- F-S20-04 component half + F-S20-10 brand parity CLOSED FULL
- AC-M0-01 (≥ 12 screens navigabile) începe acumularea; AC-M0-02 brand compliance 100% pe stub-uri

### 3.2 M0.S2 — Clickable Prototype (Direct-to-code flows) ★ CLOSED v1.0.2

> Pre-existent neschimbat — exceptând input source: în loc de Figma prototypes, M0.S2 leagă page stubs M0.S1 prin `<Link href>` + interactive client components (modale, formulare, click-to-advance). Tasks de mai jos sunt **☑ ALL CLOSED** cu output `apps/web-preview/app/**/page.tsx` (in-place enhancement + 3 pages noi).

| ID | Status | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|---|
| T-M0.S2-01 | ☑ | Click-through Lead intake → Score → Assign (J1) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/leads/[id]/page.tsx` client component — LS recompute animat + `<Modal>` Asignează agent (4 agenți + APS + busy gate) + toast success + redirect `/dashboard` |
| T-M0.S2-02 | ☑ | Click-through Property creation → Match (J2) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/properties/new/page.tsx` 8-field intake form (address, oraș, cartier, camere, area, preț, an, etaj) + toast match suggestions + redirect `/leads/L-0001`; entry-point Link pe `/properties` |
| T-M0.S2-03 | ☑ | Click-through Deal pipeline → close-won (J3) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/deals/page.tsx` client rewrite — click-to-advance ← / Avansează butoane per card (keyboard-accessible) + "Close won" buton pe stage Notariat → `<Modal>` confirm → Won column + DEAL_WON toast. Drag-drop @dnd-kit reținut explicit M0.S3 (T-M0.S3-10); butoane rămân fallback a11y permanent. |
| T-M0.S2-04 | ☑ | Click-through Manager escalation queue (J4) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/manager/escalations/page.tsx` (NEW) — 6 escalări queue, header + per-row checkbox bulk select (cu indeterminate state), "Bulk reassign (N)" button + `<Modal>` cu 4 agenți țintă + toast audit-logged stub; Link "Vezi toate" pe `/manager` |
| T-M0.S2-05 | ☑ | Internal review prototype + feedback loop | ARCHITECT + DESIGNER | S | T-M0.S2-01..04 | 📋 | DESIGNER visual review pe hover/active/focus states (Button + Card + row links cu ring `gold-light`); ARCHITECT a11y check pe modale (focus trap + ESC + return focus existent din M0.S1) + drag-drop alternative (click-to-advance + checkbox bulk = keyboard-only complete). `npm run build` pass (13/13 routes prerendered). |

### 3.3 M0.S3 — Web Static Demo (Next.js) ★ CLOSED v1.0.3

> **Status:** ★ **CLOSED** — Web Static Demo livrat (T-M0.S3-01..13 ☑; T-M0.S3-14 PARTIAL pe DNS step). Output: `apps/web/` (promovat din `apps/web-preview/`) cu mock data 100/50/20, content full pe 12 pagini + 3 noi, i18n RO/RU/EN, drag-drop @dnd-kit pe `/deals`. `next build` PASS 16 routes.

| ID | Status | Task | Owner | Effort | Output realizat |
|---|---|---|---|---|---|
| ★ T-M0.S3-01 | ☑ amended | **Semantic promote in-place** (physical path `apps/web-preview/` retained per Regula 10) | FRONTEND WEB DEV + DEVOPS + ARCHITECT | XS | `package.json` upgrade `@revyx/web-preview@0.1.0` → `@revyx/web-preview@0.2.0` + descriere actualizată. Workflow + vercel.json **NU** s-au mutat. Rationale: un git mv attempt a rupt Vercel Root Directory; Regula 10 nouă în CLAUDE.md §10b previne recurența. |
| ★ T-M0.S3-02 | ☑ | Mock data types + seeded RNG (deterministic across builds) | FRONTEND WEB DEV | S | `lib/mock/types.ts` + `lib/mock/rng.ts` (xmur3 + sfc32) |
| ★ T-M0.S3-03 | ☑ | Mock data: 8 agents (APS/Trust/Slots realistic) | FRONTEND WEB DEV | XS | `lib/mock/agents.ts` |
| ★ T-M0.S3-04 | ☑ | Mock data: 100 leads (LS distribution HOT 12% / qualified 22% / warm 36% / nurturing 30%) | FRONTEND WEB DEV | M | `lib/mock/leads.ts` (40 first names × 30 last names × 6 sources × 8 zones) |
| ★ T-M0.S3-05 | ☑ | Mock data: 50 properties + 20 deals (6 stages) | FRONTEND WEB DEV | M | `lib/mock/properties.ts` (apartament/casă/teren/comercial) + `lib/mock/deals.ts` (TF_default 0.70 BR-10 applied for early stages) |
| ★ T-M0.S3-06 | ☑ | Wire `/dashboard` + `/leads` to mock + search/filter | FRONTEND WEB DEV | M | NBA top-3 by LS desc · queue today 5 hottest · filter tabs HOT/qualified/warm/nurturing/all + search |
| ★ T-M0.S3-07 | ☑ | NEW Page `/profile` (agent + APS 6-month bars + my-leads/my-deals) | FRONTEND WEB DEV | S | `app/profile/page.tsx` |
| ★ T-M0.S3-08 | ☑ | NEW Page `/notifications` (audit-log feed, mark-read state) | FRONTEND WEB DEV | S | `app/notifications/page.tsx` |
| ★ T-M0.S3-09 | ☑ | Wire `/manager` + `/manager/escalations` + `/admin` to mock | FRONTEND WEB DEV | M | leaderboard sorted by APS desc · tenants table 4 records · escalations queue derived from top HOT/qualified leads |
| ★ T-M0.S3-10 | ☑ | `/deals` drag-drop @dnd-kit + click-to-advance a11y fallback retained | FRONTEND WEB DEV | L | `components/deals/kanban-board.tsx` — DealCard draggable + StageColumn droppable + DragOverlay (rotire +1° + ring gold). PointerSensor activation distance 6px (prevents accidental drag on click). KeyboardSensor enabled. ESC close confirm modal preserved. |
| ★ T-M0.S3-11 | ☑ | i18n provider (custom React context, no next-intl middleware routing) | FRONTEND WEB DEV | M | `components/i18n/provider.tsx` — `useT()` hook + `setLocale()` + dot-path key resolution + `{var}` interpolation + RO fallback + localStorage persistence key `revyx.locale` |
| ★ T-M0.S3-12 | ☑ | i18n catalogs RO/RU/EN (~120 keys each) | FRONTEND WEB DEV + DOC | M | `messages/{ro,ru,en}.json` (nav · common · lead · leadDetail · property · deal · dashboard · manager · admin · login · settings · profile · notifications) |
| ★ T-M0.S3-13 | ☑ | Language switcher în `<SiteNav>` (dropdown listbox RO/RU/EN cu ESC close) | FRONTEND WEB DEV | XS | `components/site-nav.tsx` client component cu `useT()` + outside-click + ESC handlers |
| ★ T-M0.S3-14 | ◐ | Vercel deploy + custom domain `demo.revyx.app` | DEVOPS | S | Vercel project Root Directory must bump `apps/web-preview` → `apps/web` (Runbook v1.0.2 §2.1); DNS CNAME `demo.revyx.app` → `cname.vercel-dns.com` step documented Runbook §2.3 — PM/DevOps action. |

**Decizii arhitecturale:**
1. **Mock data deterministic** (seeded RNG) — same dataset across builds, lockstep with screenshots in `design/screenshots/`.
2. **i18n fără route segments** — `useT()` context cu `localStorage` în loc de `[locale]/` Next route segments. Trade-off: SSR initial render = RO (default); hydration switches la stored locale. Avantaj: toate 15 pagini static-only static (zero `/[locale]/` route explosion), URL-uri stabile, deep-link-uri funcționează indiferent de locale.
3. **Drag-drop preservation a11y** — click-to-advance ← / Avansează → rămân **permanent** pe fiecare card; drag handle e separat (`⋮⋮` icon cu `cursor-grab`). PointerSensor distance 6px previne drag accidental pe click. KeyboardSensor activat pentru users care nu pot folosi mouse.
4. **`/leads/[id]` rendered dynamic** — 100 leads → prerender 100 pages e overkill pentru demo; Next 14 SSR pe demand cu cache static (mock e bundled). Performance identic, build mai rapid.

**Build evidence:**
```
Route (app)                    Size     First Load JS
○ /                            1.35 kB        110 kB
○ /admin                       3.44 kB        112 kB
○ /dashboard                   2.06 kB        115 kB
○ /deals                       17.7 kB        131 kB   ← @dnd-kit
○ /leads                       1.93 kB        115 kB
ƒ /leads/[id]                  4.22 kB        117 kB   ← dynamic SSR
○ /login                       1.89 kB        110 kB
○ /manager                     2.59 kB        115 kB
○ /manager/escalations         4.29 kB        117 kB
○ /notifications               3.48 kB        112 kB
○ /profile                     1.59 kB        114 kB
○ /properties                  2.03 kB        115 kB
○ /properties/new              4.44 kB        113 kB
○ /settings                    4.41 kB        113 kB
+ First Load JS shared by all   87.1 kB
```

**Net effort delta M0.S3:** −2 sesiuni vs v1.0.0 (skeleton + primitives ne-mai-livrabile în M0.S3); + nominal effort în M0.S1 +1 sesiune (early FE activation). Total M0 = ~−1 sesiune (~7-9 sesiuni vs original 8-10).

### 3.4 M0.S4 — Pitch Deck + Video Walkthrough ★ CLOSED v1.0.4

> **Status:** ★ **CLOSED** — Pitch Deck (16 slides × 3 limbi) + Video Script (8 scene × 5:00) + Screenshot Checklist livrate. T-M0.S4-01..05 + T-M0.S4-07 ☑. T-M0.S4-06 (recording fizic) + T-M0.S4-08 (PDF export aspect 16:9) rămân ◐ tracked separat — depind de DNS demo.revyx.app (T-M0.S3-14) și de OD-M0.S4-01..04 PM input.

| ID | Status | Task | Owner | Effort | Output realizat |
|---|---|---|---|---|---|
| ★ T-M0.S4-01 | ☑ | Pitch deck structură 16 slide-uri | DOC + ARCHITECT + Senior PM | M | `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/README.md` — index + tabel structură (Hook 1, Problem 1, Solution 1, Market 1, Product 1 overview + 4 demo, Tech 1, Trust 1, Business 1, Roadmap 1, Team 1, Ask 1, Close 1) |
| ★ T-M0.S4-02 | ☑ | Pitch deck content RO + speaker notes | DOC + Senior PM | L | `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ro.md` — 16 slides RO canonical cu speaker notes inline per slide + Anexă A visual specs |
| ★ T-M0.S4-03 | ☑ | Pitch deck content RU | DOC | M | `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ru.md` — 16 slides RU translation |
| ★ T-M0.S4-04 | ☑ | Pitch deck content EN | DOC | M | `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-en.md` — 16 slides EN translation |
| ★ T-M0.S4-05 | ☑ | Video walkthrough script RO + RU + EN (8 scene × 5:00) | DOC + ARCHITECT | M | `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — storyboard 8 scene cu URL-uri exacte + on-screen actions + VO 3 limbi sincronizat pe timing markers + production checklist + SRT generation |
| T-M0.S4-06 | ◐ | Video recording + editing (3 versiuni RO/RU/EN) | DESIGNER | L | DEFERRED — depinde de DNS demo.revyx.app (T-M0.S3-14) + aprobare deck content M0.S5. Script + storyboard ready. |
| ★ T-M0.S4-07 | ☑ | Screenshot capture checklist + Playwright script propus | DESIGNER + FRONTEND WEB DEV + DOC | S | `docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md` — 18 screens × 3 locale mapping; 7 mandatory pentru deck (× 2 locale = 14 PNG mandatory); manual + Playwright procedures; cookie locale via `localStorage.setItem('revyx.locale', ...)` |
| T-M0.S4-08 | ◐ | PDF export deck aspect 16:9 (1920×1080) | DOC + DESIGNER | XS | DEFERRED — depinde de OD-M0.S4-01..04 PM input (cifră invest slide 15, URL demo final slide 01+16, logo asset slide 01+16, echipa fondatori slide 14). Tool sugerat: marp-cli cu custom theme. |

**Decizii arhitecturale M0.S4:**
1. **Speaker notes inline în deck-ro.md** — nu fișier separat. Reduce duplication; speaker poate citi deck integral într-un singur pass.
2. **i18n parity:** RU și EN sunt traduceri compresate ale canonicului RO (acelaşi visual + cifră + structură; speaker notes RO sunt singura asimetrie — RU/EN au doar slide content per pitch live local).
3. **Screenshot capture deferred:** captures fizice livrate într-un commit ulterior (pre-M0.S5). Tracked T-M0.S4-07 ca output checklist procedura — referință mapping slide → screen.
4. **Video recording deferred:** script + VO + storyboard livrate. Recording fizic = T-M0.S4-06 separat (necesită studio + DPS staff + post-DNS demo URL). Acceptance AC-M0-03 *script + storyboard* satisfacut; AC-M0-03 *2 versiuni livrate* (video files RO+EN) gating M0.S5.

**Net effort delta M0.S4 vs v1.0.0:**
- v1.0.0 alocă 5 tasks (T-M0.S4-01..05 + T-M0.S4-06 recording). v1.0.4 elaborează în 8 tasks (separate Screenshot Checklist T-M0.S4-07 + PDF export T-M0.S4-08).
- Effort estimat M0.S4 total: 1 sesiune (DOC primary). Recording fizic = +1 sesiune separat (DESIGNER + DPS).

### 3.5 M0.S5 — HST M0 ⚠️ GATE ★ CLOSED v1.0.5

> **Status:** ★ **CLOSED** — Hard Stress Test M0 EXIT GATE atins. T-M0.S5-01..04 ☑. T-M0.S5-05 (TutorialOverlay POC) decision **deferred M1.S5** cu task explicit (cross-ref F-M0S5-14). HST raport principal + findings backlog publicat. Fix-uri HIGH (F-M0S5-01 Card interactive prop + F-M0S5-02 i18n RO/RU 44 keys) aplicate în acest PR. Re-audit verification PASS.

**Hats activi:** ARCHITECT (S) + SECURITY (S) + TESTER (S) + DOC (S) + ★ DESIGNER (P/S, Creative Director, mandatory per Regulile 12+14 v1.2.10) + Audit Lead (P) + Senior Product Auditor (S) + Senior Compliance Auditor (S) + Senior PM (S).

**Audit method:** Parallel review 9 categorii cu echipa virtuală 8-rol → consolidate findings → severity matrix → fix CRIT/HIGH în acest PR → re-audit post-fix → sign-off 8/8.

| Task | Status | Descriere | Owner Hat | Effort | Output |
|---|---|---|---|---|---|
| ★ T-M0.S5-01 | ☑ | HST raport principal 9 categorii audit (UX flow + brand + presentation + message + demo robustness + Regula 11 i18n + Regula 12 interactions + Regula 13 tutorial coverage + Regula 14 overlap viewport) | Audit Lead + Senior Architect + DESIGNER + QA + Product/Compliance/Security Auditor + DOC | L | `docs/audit/HST_REVYX_m0_v1.0.0.md` — §0 Stage + §0.1 Platform Matrix + §1 scope + §2.1-§2.9 categorii audit + §3 findings register consolidat + §4 closure plan + §5 sign-off 8/8 + §6 next steps + §7 cross-refs |
| ★ T-M0.S5-02 | ☑ | Findings backlog detailed cu repro + fix proposal + verification | Audit Lead + DOC | M | `docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md` — 17 findings F-M0S5-01..17 detaliate cu repro steps + cauză + fix code diff + verification + cross-ref per finding |
| ★ T-M0.S5-03 | ☑ | Fix CRIT/HIGH findings în acest PR | FRONTEND WEB DEV + DESIGNER + DOC | M | 2 HIGH fixed: **F-M0S5-01** `apps/web-preview/components/ui/card.tsx` — introdus `interactive` prop opt-in pentru hover translate (backward compatible default=false); **F-M0S5-02** `apps/web-preview/messages/{ro,ru}.json` — 30 keys RO + 14 keys RU retraduse (Dashboard → Panou de bord; Sign out → Deconectare; Queue → Listă; Won → Câștigat; Discovery → Descoperire; etc) per Regula 11 lista explicită + cu excepții acronime EN păstrate (LS/PS/IS/DP/NBA/DHI/APS/SLA/GDPR/RBAC/HOT/audit-log/lead-uri/WhatsApp). Tests primary: typecheck PASS, lint PASS (1 pre-existing warning F-M0S5-10 LOW), build PASS 15+1 routes |
| ★ T-M0.S5-04 | ☑ | Sign-off matrix 7-rol + Senior PM (extins cu DESIGNER Creative Director mandatory per Regula 12+14) | Audit Lead + Senior PM | XS | Sign-off 8/8 documentat în HST §5 — Audit Lead + Senior Architect + Senior Security Auditor + Senior QA / Test Architect + Senior Compliance Auditor + Senior Product Auditor + DESIGNER (Creative Director) + Senior PM |
| T-M0.S5-05 | ◐ | TutorialOverlay POC 1 pagină (optional) | FRONTEND WEB DEV + DESIGNER | M | **DEFERRED M1.S5** cu task explicit T-M1.S5-XX. Cross-ref F-M0S5-14 MED tracked. Argument: Regula 13 forward-applying post-v1.2.10; demo deck+video walkthrough M0.S4 acoperă tutorial scope pentru demo investor flow; implementare nativă (componenta + 9 pagini × 3 locale) necesită ~1 sesiune dedicată M1.S5. Decizia Senior PM + DESIGNER. |

**Decizii arhitecturale M0.S5:**

1. **DESIGNER (Creative Director) ridicat la primary hat mandatory** pentru auditul Regulilor 12 (interaction discipline) + 14 (overlap viewport) — extensie de la 7-rol audit classic (HST #2) la 8-rol M0.S5 cu echilibru creative/technical.
2. **F-M0S5-01 Card interactive prop opt-in** preferată față de variantă alternativă (split Card / InteractiveCard separate components) — backward compat full (zero migration M0), pattern reutilizabil pentru Table (F-M0S5-13 LOW preventive M1.S5).
3. **F-M0S5-02 i18n fix limited la keys atomice + status enums** (NU propoziții lungi descriptive) — focus pe high-frequency UI labels; copy pass extensiv pentru subtitle/descriptions deferred M1.S5 entry (F-M0S5-06 LOW tracked).
4. **TutorialOverlay deferred M1.S5** (NU implementat M0.S5b sub-session) — gating M0 exit nu cere implementation, doar gap analysis + closure plan; demo deck+video substitute pentru M0 demo flow validate per CLAUDE.md Regula 13 forward-applying clause.
5. **Visual regression baseline tooling** (Playwright `toHaveScreenshot`) sugerat M1.S5+ — manual smoke 3 viewport canonice suficient pentru M0 demo (F-M0S5-17 LOW).

**Net effort M0.S5:**
- 1 sesiune productivă (audit + raport + 2 fix-uri + doc bumps). Sub estimate inițial 4-6h.

**M0 EXIT GATE:** ✅ ATINS — AC-M0-01..07 toate ☑; HST M0 0 findings CRIT/HIGH post-fix; demo URL live (Vercel default `*.vercel.app` accept temporar; DNS `demo.revyx.app` T-M0.S3-14 pending PM non-blocking). M1.S1 entry UNBLOCKED.

### 3.6 M0.S6 — Demo Polish (Senior Designer + Creative Director directive) ★ CLOSED v1.0.8

> **Status:** ★ **CLOSED** — feedback PM post-M1.S2 demo review aplicat în 8 puncte: tutorial menu / cabinete agent+agenție+grup / claritate denumiri (acronime ascunse) / lead column info-tooltips / property detail / deals visual + decryptare / formule complet ascunse în UI. Backend `apps/api/` + scoring fixtures **NU se modifică** (single source of truth în BRD §7 + `apps/api/src/scoring/fixtures.ts` T01..T07).

**Hats activi:** DESIGNER (Creative Director, P) + FRONTEND WEB DEV (P) + ARCHITECT (S, formula-hidden enforce) + DOC + Senior PM.

**Scope decision PM (post-feedback):** Branch dedicat `claude/m0-s6-demo-polish` + PR separat față de M1.S2 backend. Formule scope = UI only (acronime LS/PS/IS/DP/DHI/APS/NBA/BR-XX/SLA HOT eliminate din `apps/web-preview/`; backend + docs intacte). Tutorial scope demo = pagină statică `/tutorial`; producție MVP = `<TutorialOverlay>` per Regula 13 deferred M1.S5.

| Task | Status | Descriere | Owner Hat | Effort | Output |
|---|---|---|---|---|---|
| ★ T-M0.S6-01 | ☑ | i18n RO/RU/EN rescris complet — zero acronime user-facing | DESIGNER + DOC | M | `apps/web-preview/messages/{ro,ru,en}.json` — 254 keys/limbă (vs 204 v1.0.5). Etichete prietenoase: Prioritate (Foarte mare/Mare/Medie/Scăzută), Răspunde până la, Recomandări actualizate, Pe drumul cel bun/Verifică/Atenție, Anunț nou/De reîmprospătat/Necesită atenție, Monitorizare automată, Sarcinile mele active, etc. Structuri noi: tutorial.sections.* / cabinet.{agent,agency,group} / property.detail.* / property.form.* / dashboard.blocks.* / dashboard.decisions.* / deal.healthLabels.* / deal.healthHelp.* / deal.stageDescriptions.* / lead.tableHelp.* / lead.filters.* |
| ★ T-M0.S6-02 | ☑ | NEW component `<InfoTooltip>` + `lib/freshness.ts` helper | FRONTEND WEB DEV | S | `apps/web-preview/components/ui/info-tooltip.tsx` (button "i" + popover + ESC/outside-click close) + `apps/web-preview/lib/freshness.ts` (bucketing days→{new,refresh,old} cu label+desc+tone) |
| ★ T-M0.S6-03 | ☑ | NEW page `/tutorial` (ghid demo M0) | FRONTEND WEB DEV + DESIGNER + DOC | S | `apps/web-preview/app/tutorial/page.tsx` — 7 secțiuni (dashboard / leads / leadDetail / properties / deals / cabinet / tutorialFuture) + anchor nav + link la fiecare modul |
| ★ T-M0.S6-04 | ☑ | NEW 3 pagini cabinet sub `/cabinet/{agent,agency,group}` | FRONTEND WEB DEV + DESIGNER | M | `apps/web-preview/app/cabinet/agent/page.tsx` (4 tabs: sumar/istoric/preferințe/documente) · `cabinet/agency/page.tsx` (date organizație + echipă + KPI 30 zile + member list) · `cabinet/group/page.tsx` (group name + manager + share % + leaderboard top 3 + members list) |
| ★ T-M0.S6-05 | ☑ | NEW property detail page `/properties/[id]` + cards click-through | FRONTEND WEB DEV + DESIGNER | M | `apps/web-preview/app/properties/[id]/page.tsx` (galerie 6 foto SVG placeholder + thumbnail nav, video tour panel, public link panel cu Open in new tab, specs grid 8 fields, interest 7d, actions: Programează vizionare / Distribuie link / Editează). Properties listing cards devin `interactive` și linkează la detail. Properties/new: secțiune media nouă (upload area dashed + video link + external link) |
| ★ T-M0.S6-06 | ☑ | Dashboard restructurat în blocuri | FRONTEND WEB DEV + DESIGNER | M | `apps/web-preview/app/dashboard/page.tsx` rescris: 4 blocuri marcate A/B/C/D (Sarcinile mele active cu progress dots 3-slot + status text; Lead-uri urgente cu count gigant + primul lead direct; Performanța mea cu 3 metrici dots tonate; Lista de azi + Ce poți face acum cu 4 butoane decizie). Eliminat: `Ai 2/3 sarcini active (BR-04)` + `SLA HOT 12:34` |
| ★ T-M0.S6-07 | ☑ | Lead list polishat cu info-tooltips + ALL evidențiat | FRONTEND WEB DEV + DESIGNER | M | `apps/web-preview/app/leads/page.tsx` rewritten: `<InfoTooltip>` pe TOATE coloanele (id/name/source/zone/sla/priority/status) cu explicații 1-2 rânduri; filtru `Toate` evidențiat solid auriu (vs tab activ secundar); coloana LS → `Prioritate` cu `<LeadPriorityBadge>` text-only; status `nurturing` → `Monitorizare automată`; filter sub-help text afișat la selecție |
| ★ T-M0.S6-08 | ☑ | Deals kanban full-card drag + per-stage color + cards readable | FRONTEND WEB DEV + DESIGNER | L | `apps/web-preview/components/deals/kanban-board.tsx` rewritten: per-stage color bar (5 distincte: blue/qualified/amber/gold/green) + ring drop indicator + dot pe header. Cards arată Client name + Property address + Comision + Stare badge (vs `L:L-1002 → P:P-1905 DP0.15 DHI0.49`). ELIMINATE butoanele Avansează/Înapoi — drag full-card direct via PointerSensor + KeyboardSensor. Health labels: `sănătos/de revizuit/risc` → `Pe drumul cel bun / Verifică / Atenție` cu InfoTooltip + help text 1 rând. Stage names cu InfoTooltip pe header. Lead detail + profile pages: stripped acronime LS/IS/DP/Trust → replaced cu engagement/winChance buckets (low/medium/high) + metric dots tonate |

**Decizii arhitecturale M0.S6:**

1. **Branch separat + PR separat** (NU amend PR #34 M1.S2) per directive PM — backend rămâne curat pentru review; UI rework izolat ca să nu mixeze responsabilități.
2. **Formule scope = UI ONLY** — apps/web-preview/ → 0 acronime user-facing; apps/api/ + scoring/fixtures.ts T01..T07 + BRD §7 → INTACTE (Master Plan compliance Regula 8). Argument PM: dezvoltarea backend nu trebuie să piardă controlul pe formule; doar interfața agentului trebuie clarificată.
3. **Tutorial demo = pagină statică** (NU TutorialOverlay) — argument PM: demo presentation flow are nevoie de overview, NU tour per ecran. Tour interactive `<TutorialOverlay>` rămâne deferred M1.S5 (Regula 13 production-grade).
4. **Backwards compat 100% cu M1.S2** — zero modificări `apps/api/`; mock data `lib/mock/*` păstrate; legacy alias `LeadScoreBadge = LeadPriorityBadge` ca call-site-urile vechi (profile, lead detail) să nu se rupă.
5. **Score visual = dots tonate** — în loc de `LS 0.85 · HOT`, agentul vede `●●● Foarte mare` (sau metric pill `Prioritate ●●●`). Acronime backend nu pleacă spre UI prin nici un canal.

**Out of scope M0.S6 (forward-applying):**
- Manager + Admin panels (deferred per directive: "le facem mai tirziu")
- Backend wire-up real (`apps/api/` rămâne în M1.S3+ scope — webhook intake / scoring engines / Lead Firewall / Escalation cron / GDPR erasure cascade)
- `<TutorialOverlay>` per ecran (Regula 13 production — M1.S5)
- Real photo/video upload (M0.S6 ships SVG placeholder + dashed upload area cu fake-pick counter)

**Net effort M0.S6:** 1 sesiune productivă (i18n + 4 new pages + restructure 4 existing + 2 new helpers + doc bumps). Backwards compat full cu v1.0.7.

### 3.7 M0.S7 — Dashboard rework + task management + lead notes/documents ★ CLOSED v1.0.9

> **Status:** ★ **CLOSED** — feedback PM run-2 (5 puncte) implementat. Dashboard restructurat ca to-do list real interactiv + sugestii per-lead funcționale. Lead detail extins cu notițe + atașamente documente. Cabinet agent îmbogățit cu bio + foto avatar + specialty + rating. Manager polish (acronime stripped). Backend `apps/api/` NU se modifică (Regula 8 Master Plan compliance — framework primitives reused: nba-engine task_type enum + lifecycle + BR-04).

**Hats activi:** DESIGNER (Creative Director, P) + FRONTEND WEB DEV (P) + ARCHITECT (S, framework alignment) + DOC + Senior PM.

**Framework grounding (citit pre-implement):** BRD §5 Pilon 04 (NBA + Task Allocator + BR-04 max 3 active + SLA 15min/2h/24h + Escalation 3 levels) + BRD §5 Pilon 07 (APS + agent_since_date + out_of_office_until); TECH_SPEC_REVYX_nba-engine §4.1 (task table cu 9 task_type values + lifecycle PENDING/ACTIVE/COMPLETED/SNOOZED/CANCELLED + nba_score + due_at); TECH_SPEC_REVYX_deal-closure §4.3 (documents table cu 8 document_type values + entity_type LEAD/DEAL/PROPERTY/OFFER/AGENT); apps/api/src/business/tasks/* (M1.S2 backend scaffold deja prezent). Toate primitives există în framework — reused 1:1 în UI demo via localStorage stores.

**Scope decision PM (post-feedback run-2):** UI demo + localStorage (NU wire-up real la backend M1.S2 — păstrăm pentru M1.S5). NU TECH_SPEC nou (framework deja are tot). Branch separat `claude/m0-s7-dashboard-rework` + PR separat față de PR #35 (M0.S6).

| Task | Status | Descriere | Owner Hat | Effort | Output |
|---|---|---|---|---|---|
| ★ T-M0.S7-01 | ☑ | Framework grounding read (BRD §5 + nba-engine + deal-closure §4.3) + decision: reuse, NU spec nou | ARCHITECT | XS | Confirmare framework gata: task_type enum (9 values) + lifecycle 5 states + max 3 active rule + 8 document types — toate reflectate in lib/mock/tasks.ts + lib/mock/suggestions.ts |
| ★ T-M0.S7-02 | ☑ | NEW `lib/task-store.ts` cu localStorage persistence + React hook useSyncExternalStore | FRONTEND WEB DEV | M | `apps/web-preview/lib/task-store.ts` — getAllTasks, addTask, updateTask, completeTask, snoozeTask, activateTask (cu BR-04 enforce), deleteTask, resetTasks + useTasks hook |
| ★ T-M0.S7-03 | ☑ | NEW `lib/mock/tasks.ts` (seed 5 task pe agent A-001) + `lib/mock/suggestions.ts` (NBA-style per lead status: HOT→[first_contact,schedule_showing], qualified→[follow_up,send_property], warm→[send_property,follow_up], nurturing→[follow_up]) | FRONTEND WEB DEV + ARCHITECT | M | 2 new mock files referenced de toate componentele ToDo |
| ★ T-M0.S7-04 | ☑ | NEW `lib/lead-extras-store.ts` cu localStorage persistence pentru notițe + documente per lead | FRONTEND WEB DEV | S | `apps/web-preview/lib/lead-extras-store.ts` — getExtrasForLead, addNote, removeNote, addDocument, removeDocument + useLeadExtras hook |
| ★ T-M0.S7-05 | ☑ | NEW reusable components: `<TaskList>`, `<TaskModal>`, `<LeadSuggestions>`, `<NotesPanel>`, `<DocumentsPanel>` | FRONTEND WEB DEV + DESIGNER | M | 5 new files sub `components/tasks/{task-list,task-modal,lead-suggestions}.tsx` + `components/leads/{notes-panel,documents-panel}.tsx`. TaskList suportă filter today/active/completed/all + maxRows. TaskModal validează BR-04. LeadSuggestions push direct in task store cu rationale 1-line. |
| ★ T-M0.S7-06 | ☑ | Dashboard rework: 6 blocuri A-F (sarcini sumar / urgent leads / performanță / programul de azi interactiv / sugestii per lead / decizii rapide) | FRONTEND WEB DEV + DESIGNER | L | `app/dashboard/page.tsx` rescris. Block B link la `/leads?priority=urgent` (deep link cu filtru pre-set). Block D + E sunt interactive (mark complete / accept suggestion → task PENDING). |
| ★ T-M0.S7-07 | ☑ | NEW `/tasks` page full-time management cu filtre Azi/În lucru/Finalizate/Toate + modal Adaugă | FRONTEND WEB DEV | M | `app/tasks/page.tsx` + adăugare link `Sarcinile mele` în site-nav primary |
| ★ T-M0.S7-08 | ☑ | Lead detail rework: eliminat Engagement/Win chance → înlocuit cu `<LeadSuggestions>` + NEW secțiuni Note + Documente | FRONTEND WEB DEV + DESIGNER | M | `app/leads/[id]/page.tsx` cleaned (band/engagement/winChance code removed) + 2 new Card sections cu NotesPanel + DocumentsPanel. Lead deep link `/leads?priority=urgent` suportat via useSearchParams + Suspense boundary. |
| ★ T-M0.S7-09 | ☑ | Cabinet agent enrichment + agency/group intro + manager page acronime stripped | FRONTEND WEB DEV + DESIGNER | M | `app/cabinet/agent/page.tsx` hero card cu avatar gradient gold (initials) + bio + 3 CTAs (Sună/Mesaj/Distribuie) + rating 4.8/5 + lifetime deals + specialty tags. `app/cabinet/{agency,group}/page.tsx` adăugare Card intro. `app/manager/page.tsx` rescris cu MetricPill (dots tonate) + InfoTooltip per header + escalation levels Atenție/Urgent/Critic + timing prietenos. |

**Decizii arhitecturale M0.S7:**

1. **localStorage > backend wire** — PM decision: rapid iteration + Vercel preview deployable fără infra suplimentară. apps/api/src/business/tasks rămâne intact pentru M1.S5 final wire-up.
2. **Reuse framework primitives** — task_type enum (9 values) + lifecycle (5 states) + 8 document types din spec-uri existente, NU invenții. ARCHITECT review pre-implement = 0 redundanță în docs.
3. **BR-04 enforced în client** — `lib/task-store.ts:activateTask` returnează `{ok: false, reason: 'BR_04_MAX_3_ACTIVE_TASKS'}` cu toast prietenos — same semantics ca trigger BD din M1.S2.
4. **Per-lead suggestions = deterministic rules** (NU AI) — `suggestionsForLead(lead)` returnează 2 task types ordonate per lead.status. M1.S3 va înlocui cu real NBA computation; UI compat 1:1.
5. **Notes + Documents = client-only mock** — `lib/lead-extras-store.ts` simulează schema `documents` din TECH_SPEC_REVYX_deal-closure §4.3. Real upload + KMS encryption rămân M1.S5+ scope.

**Out of scope M0.S7 (forward-applying M1.S5+):**
- Real backend wire-up tasks API (apps/api/src/business/tasks — există dar nu cuplat)
- Real document upload + S3 + KMS encryption
- TutorialOverlay per ecran (Regula 13 — M1.S5)
- AI-generated suggestion rationale (acum hardcoded text)
- Manager real-time escalation feed (acum mock 3 rows)

**Net effort M0.S7:** 1 sesiune productivă (5 components new + 2 stores new + 4 pages rewritten + i18n extins + doc bumps). Backwards compat full cu v1.0.8 (zero modificări apps/api/).

---

### 3.8 M0.S8 — Rental/Lease support (4 lead types + Calibration Profiles) ★ CLOSED v1.0.11

> **Status:** ★ **CLOSED** — PM-identified market gap închis. REVYX acoperă acum AMBELE piețe: vânzare (sale, buyer/seller) și închiriere (rent, tenant/landlord), prin arhitectură **type-agnostic core + Calibration Profiles** care păstrează formulele BRD §7 ca single source of truth. Backend `apps/api/` NU se modifică (Regula 8 — extensia FK `transaction_profile_id` va veni la M1.S3 Phase B intake processing).

**Hats activi:** Software Architect (P) + Senior BA (P) + Senior PM (P) + FRONTEND WEB DEV (P) + DOC.

**Framework grounding (pre-implement architectural decision):**
- BRD §7 formule (LS/PS/IS/DP/DHI/NBA/APS) — confirmate ca type-agnostic; doar parametrii TF/RF/commission diferă per profile.
- BRD §5 Pilon 04 (NBA + Task Allocator) — task types reused (no new types needed); rationale adaptat per intent.
- BRD §6.1 BR-01 Lead Firewall — aplicabil uniform pe ambele profiles.
- TECH_SPEC nba-engine §4.1 task table — `request_documents` reused cu rationale adaptat (sale: mandat + cadastru / rent: acord proprietar + cadastru).
- Regula 19 (segregare buyer/seller) — extinsă la Regula 20 (segregare rent/sale + 4 lead types Hybrid).

**Decision PM (architectural):** Hybrid 4 enum flat (`buyer/seller/tenant/landlord`) + helper derivat `transactionIntent()` în `lib/transaction-intent.ts`. Type-agnostic core păstrează backwards compat T01-T07. Demo i18n RO complet; RU/EN deferred M1.S5 (fallback EN existing).

| Task | Status | Descriere | Owner Hat | Effort | Output |
|---|---|---|---|---|---|
| ★ T-M0.S8-01 | ☑ | Architectural decision: Hybrid 4 enum flat + helper + Calibration Profiles (sale/rent) — design 2 row-uri seed `transaction_profiles` cu params (TF/RF/commission_model) | Software Architect + Senior BA | S | Concept documentat în CLAUDE.md §10b Regula 20 + Roadmap §3.8 (acest doc). Backend extension FK `transaction_profile_id` planned M1.S3 entry. |
| ★ T-M0.S8-02 | ☑ | Types extended `lib/mock/types.ts` — `LeadType` 2→4 + NEW `TransactionIntent + LeadSide + ListingType` + Lead `rentPeriodMonths` + Property `listingType + monthlyRentEur` | FRONTEND WEB DEV | S | `apps/web-preview/lib/mock/types.ts` cu 4 new types + 2 new fields pe Lead + 2 new fields pe Property. `lib/mock/index.ts` exports extinse. |
| ★ T-M0.S8-03 | ☑ | Helper NEW `lib/transaction-intent.ts` — `transactionIntent/leadSide/isDemandSide/isSupplySide/isListingMatchForLead/leadTypeI18nKey/intentI18nKey` | FRONTEND WEB DEV | XS | Single source pentru derivare intent. Folosit în 6+ componente downstream. |
| ★ T-M0.S8-04 | ☑ | Mock data extension `leads.ts` + `properties.ts` + `deals.ts` + `notary-acts.ts` cu distribuție realistic + commission rent = 1× chirie + notary filtered sale only | FRONTEND WEB DEV | M | Smoke 100 leads (51 buyer / 24 tenant / 20 seller / 9 landlord), 50 properties (24 sale / 9 rent / 6 both), 20 deals cu match property compatibil intent. |
| ★ T-M0.S8-05 | ☑ | Component reuse intent-aware DRY — BuyerPreferencesPanel + SellerPropertyPanel + MatchPodium + match-reasoning + suggestions updated cu intent awareness | FRONTEND WEB DEV | M | 5 componente extinse. Niciun component NEW — reuse semantic prin `intent` derivat din leadType. |
| ★ T-M0.S8-06 | ☑ | Pages adaptive — `/leads` 5 tabs filter + `/leads/[id]` switch isDemandSide + `/properties` listing type filter 4 tabs + `/properties/[id]` listingType + monthlyRentEur | FRONTEND WEB DEV | M | 4 pages updated. `useSearchParams` extins `?type=tenant\|landlord`. Card display dual price (sale + rent inline). |
| ★ T-M0.S8-07 | ☑ | i18n RO extins 6 namespaces (leadType.tenant/landlord, transactionIntent, landlord.*, preferences.titleRent/descRent, property.listingType + listingTypeFilterLabel, leadDetail.budgetRent + matchSubtitleTenant) + doc bumps (CLAUDE.md v1.2.19 + Roadmap v1.0.11 + INDEX v1.1.17) | DOC + FRONTEND WEB DEV | M | `messages/ro.json` extins. RU/EN deferred M1.S5. CLAUDE.md NEW Regula 20 + §0a sync. |

**Decizii arhitecturale M0.S8:**

1. **Type-agnostic core + Calibration Profiles** — formulele BRD §7 rămân identice ca structură; doar parametrii (TF_horizon, RF_components, commission_model) diferă per profile. Engine-ul scoring (M1.S3 entry) face lookup în `transaction_profiles` table (2 row-uri seed sale + rent). Zero duplicare cod scoring; zero divergență formule.
2. **Hybrid 4 enum flat + helper derivat** — `LeadType` rămâne lizibil în UI/code (buyer/seller/tenant/landlord), iar `transactionIntent()` + `leadSide()` extrag derivările necesare logicii business. Best of both worlds: claritate UI + reuse business logic.
3. **Reuse semantic component (DRY)** — BuyerPreferencesPanel servește buyer + tenant (cu pool features adaptiv + labels i18n); SellerPropertyPanel servește seller + landlord (cu price labels adaptive). Niciun component NEW — am evitat duplicarea, păstrând principiul „o piesă de UI per concept business semantic".
4. **Backwards compat formule** — fixtures T01-T07 acoperă sale baseline; T08-T10 (rent edge cases) tracking M1.S3 entry. Niciun test existing modificat.
5. **i18n RO complet; RU/EN deferred M1.S5** — sesiune M0.S8 a păstrat focusul pe alignment arhitectural + demo flow RO (piață primară RM). Translation RU/EN rămâne tactic la M1.S5 odată cu wire-up real backend.
6. **Notary acts filtered sale only** — rental flow folosește lease agreement (artifact diferit, scope M1.S6+ deal-closure spec extension). Pipeline deals OK pe ambele profiles.

**Out of scope M0.S8 (forward-applying M1.S3+):**
- Backend `transaction_profiles` table + FK column pe LEAD + DEAL (M1.S3 entry — phase B Lead Intake)
- Fixtures T08-T10 rental edge cases (M1.S3 — alongside scoring engines)
- Lease agreement artifact (M1.S6 — deal-closure spec extension)
- RU/EN i18n translation (M1.S5 — Phase C UI Web final wire-up)
- Marketplace buyer profiles extension to tenant profiles (M1.S5+ — separate scope)
- BR-XX renumber pentru rent-specific business rules (M1.S3 — TBD)

**Net effort M0.S8:** 1 sesiune productivă (architectural decision + types + helper + mock data + 5 components extended + 4 pages updated + i18n RO + doc bumps). Backwards compat full cu v1.0.10 (zero modificări `apps/api/` + Master Plan + BRD + Tech Specs).

---

### 3.9 M0.S8.3 — /deals polish (Pipeline rename + Kanban 4 zones + commissionPct) ★ CLOSED v1.0.13

> **Status:** ★ **CLOSED** — PM 7 puncte feedback aplicate pe `apps/web-preview/` (zero backend). Creative Director + Senior UI/UX. Backwards compat full cu v1.0.12.

**Hats activi:** Creative Director (P) + Senior UI/UX (P) + FRONTEND WEB DEV (P) + DOC + Senior PM.

| Task | Status | Output |
|---|---|---|
| ★ T-M0.S8.3-01 | ☑ | i18n RO: `deal.title` "Pipeline tranzacții" → **"Flux tranzacții"** (titlu + subtitles `subtitleSale/Rent` + tutorial.steps.deals). Regula 11 — anglicism replaced. |
| ★ T-M0.S8.3-02 | ☑ | i18n RU: `deal.title` "Воронка сделок" → **"Поток сделок"** (analogie "flow" mai aproape de RO "flux"). |
| ★ T-M0.S8.3-03 | ☑ | NEW i18n namespace `deal.intentShort.{sale,rent}` + `deal.rentCommissionShort` (3 limbi): RO Vânzare/Chirie · RU Продажа/Аренда · EN Sale/Rent. Inserate DOAR pe carduri kanban (economie spațiu); `transactionIntent.rent` "Închiriere" rămâne global pentru tab-uri filter etc. |
| ★ T-M0.S8.3-04 | ☑ | Kanban card 4 zone explicite (`components/deals/kanban-board.tsx`): **Z1** = linia 1 tip tranzacție (dot intent + label scurt) / linia 2 ID + sănătate. **Z2** = client (bold) / adresă completă + `title` attribute / oraș·zonă. **Z3** = linia 1 preț stânga + comision dreapta (`pct% · €sumă` sale / `1× chirie · €sumă` rent) / linia 2 agent avatar+nume. **Z4** = buton Detalii. Paddings strânse `px-sp2 py-1.5` pentru lățime utilă maximă. |
| ★ T-M0.S8.3-05 | ☑ | NEW `Property.commissionPct: number \| null` (`lib/mock/types.ts`) — nullable, completat pentru `listingType ∈ {'sale','both'}`. Mock distribuție realistic RM: 25% × 2.0% + 55% × 2.5% + 20% × 3.0% (`lib/mock/properties.ts`). |
| ★ T-M0.S8.3-06 | ☑ | Formul `/properties/new` primește NEW card `Comision (%)` între essentials și benefits — vizibil sale/both. Input 0.5-6% step 0.1 + live amount preview `pct × priceEur = €sumă` alături. Preț extins `max=10000000` (10M EUR). i18n 7 keys × 3 limbi. |
| ★ T-M0.S8.3-07 | ☑ | `/properties/[id]` detail page afișează NEW field `Comision (vizibil clientului)` cu format `2.5% · €X.XXX` între `Preț de vânzare` și `Tip listare`. PM directive — vizibilitate dublă agent + client. |
| ★ T-M0.S8.3-08 | ☑ | `lib/mock/deals.ts` folosește `property.commissionPct` în loc de hardcoded 2.5% — fiecare deal sale derivă comisionul din proprietate (consistent cu UI form). Rent rămâne `1× chirie`. |
| ★ T-M0.S8.3-09 | ☑ | Doc bumps cf. Regula 21: CLAUDE.md v1.2.23 → **v1.2.24** §0a sync + changelog; ROADMAP v1.0.12 → **v1.0.13** §3.9 NEW (acest doc). INDEX bump M0.S8.3 entry. |

**Tests primary post-fix:** typecheck PASS · lint PASS (1 pre-existing OD-01 font warning) · build PASS **26 routes** (identic v1.2.23) · dev smoke 3/3 routes HTTP 200 + content probe POZITIV: /deals title "Flux tranzacții" ×2, Vânzare ×13 + Chirie ×8 (intentShort), `1× chirie` ×8 (rent commission display), 12 sale cards cu format `pct% · €sumă` (3.0/2.5/2.0% mix), 0× "Pipeline tranzacții" rezidual. /properties/new "Comision (%)" + "Procent comision" + "Suma estimată" vizibile. /properties/P-1901 "Comision (vizibil clientului)" vizibil.

**Decizii arhitecturale M0.S8.3:**
1. **`commissionPct` câmp pe Property (nu pe Deal):** comisionul e atribut al listării (negociat 1× la create per Proprietate-Agent contract), nu derivat pe fiecare deal. Deal moștenește valoarea curentă la momentul calculului commission. M1.S3 entry: backend va expune endpoint `PATCH /properties/:id/commission` cu audit-log + range validation 0.5-6%.
2. **Visibility dublă agent + client (per PM directive):** UI demo afișează formatul `pct% · €sumă` atât pe property detail (citit de client din `/p/[token]` showcase link) cât și pe agent flow (kanban + property page agent). Producție M1.S5: același payload în public API `/p/:token` (vezi PRIVACY_POLICY §2.3 transparency vendor pricing).
3. **`deal.intentShort` separat de `transactionIntent`:** păstrăm `Vânzare/Închiriere` ca etichete canonice (filtrare tab-uri, badge-uri lung), și `Vânzare/Chirie` ca variante scurte pentru contexte cu spațiu limitat (carduri kanban). Regula 11 compliance — ambele sunt RO native (zero anglicisme).
4. **Kanban 4 zone explicite vs 3 zone v1.2.22:** PM feedback v1.2.22 plasase tip tranzacție în zona metrici (jos); revenim sus pentru jerarhia citirii (intent = clasificare primară), iar suma + comisionul migrează în zona dedicată money. Adresa primește mai mult spațiu pentru fit single-line.

**Out of scope M0.S8.3 (forward-applying M1+):**
- Backend persistence `commissionPct` (M1.S3 entry — column add la `properties` migration + DTO + service)
- Audit-log event `PROPERTY_COMMISSION_CHANGED` (M1.S3)
- Range validation server-side + manager override (M1.S4)
- i18n RU/EN extension pentru property.form.* (M1.S5 wire-up real)

**Net effort M0.S8.3:** ~0.5 sesiune (i18n RO/RU/EN + types + mock + 3 pages updated + kanban restructure + doc bumps). Backwards compat full cu v1.0.12 — Master Plan + BRD + Tech Specs INTACTE.

---

## 4. M1 — MVP FUNCȚIONAL Detailed

### 4.1 M1.S1 — Phase 0 Security Foundation ★ CLOSED v1.0.6

> **Status:** ★ **CLOSED** — Phase 0 Security blocant lifted. JWT RS256 + RBAC 5 roluri + GDPR endpoints + AUDIT_LOG append-only + HMAC webhook verify + rate limiting + Privacy/Cookie drafts livrate. Tests baseline 12/12 PASS.

**Hats activi:** BACKEND DEV (P) + SECURITY (P) + DBA (S) + ARCHITECT (S) + DOC + Senior PM.

| Task | Status | Descriere | Owner Hat | Effort | Output |
|---|---|---|---|---|---|
| ★ T-M1.S1-01 | ☑ | TECH_SPEC Phase 0 Security Foundation | ARCHITECT + SECURITY + BACKEND DEV + DBA + DOC | L | `docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md` — 20 secțiuni acoperind stack + data model (6 entități) + API contracts + JWT RS256 + RBAC + AUDIT_LOG append-only + HMAC + rate limit + OWASP Top 10 + sign-off 5-rol |
| ★ T-M1.S1-02 | ☑ | apps/api/ scaffold NestJS + Fastify + Drizzle | BACKEND DEV | M | `apps/api/{package.json, tsconfig.json, nest-cli.json, drizzle.config.ts, vitest.config.ts, .eslintrc.json, .env.example, .gitignore, README.md, src/main.ts, src/app.module.ts}` |
| ★ T-M1.S1-03 | ☑ | Migrations 0001-0006 SQL | DBA + BACKEND DEV | M | `apps/api/src/db/migrations/{0001_tenants, 0002_users (enum user_role), 0003_refresh_tokens, 0004_audit_log + trigger anti-modify + REVOKE, 0005_gdpr_consents, 0006_webhook_signatures}.sql` + Drizzle schema TS files |
| ★ T-M1.S1-04 | ☑ | AuthModule (JWT RS256 + refresh rotation + Argon2id) | BACKEND DEV + SECURITY | L | `apps/api/src/auth/{auth.service.ts, auth.controller.ts, jwt.service.ts, password.service.ts, jwt-auth.guard.ts, auth.dto.ts, auth.module.ts}` — implementare cu replay detection + BR-12 single session |
| ★ T-M1.S1-05 | ☑ | RBAC Module (Role enum + decorator + guard) | BACKEND DEV + SECURITY | S | `apps/api/src/rbac/{role.enum.ts, roles.decorator.ts, roles.guard.ts}` — 5 roluri aditiv (agent..admin) |
| ★ T-M1.S1-06 | ☑ | AuditModule (Service + Interceptor + decorator @AuditEvent) | BACKEND DEV + DBA | M | `apps/api/src/audit/{audit.service.ts, audit.interceptor.ts, audit-event.decorator.ts, audit.module.ts}` — global APP_INTERCEPTOR în AppModule, defense-in-depth cu trigger BD |
| ★ T-M1.S1-07 | ☑ | WebhookHmacGuard + WebhooksController | BACKEND DEV + SECURITY | S | `apps/api/src/webhooks/{webhook-hmac.guard.ts, webhooks.controller.ts, webhooks.module.ts}` — Meta/Google/OLX HMAC SHA-256 timing-safe + replay dedup via UNIQUE (provider, signature) |
| ★ T-M1.S1-08 | ☑ | GdprModule (4 endpoints Art. 15/17/18/20) | BACKEND DEV + COMPLIANCE | M | `apps/api/src/gdpr/{gdpr.service.ts, gdpr.controller.ts, gdpr.module.ts}` — access/portability/erase/restrict cu audit decorator + queue placeholder M1.S3 erasure cascade |
| ★ T-M1.S1-09 | ☑ | Tests baseline + CI workflow + Privacy/Cookie drafts | BACKEND DEV + DOC + DEVOPS | M | `apps/api/src/{rbac,webhooks,auth}/*.spec.ts` 12/12 PASS · `.github/workflows/api-ci.yml` · `docs/legal/{PRIVACY_POLICY_REVYX_v0.1.0.md, COOKIE_POLICY_REVYX_v0.1.0.md}` DRAFT |

**Decizii arhitecturale M1.S1:**

1. **Stack TS/NestJS confirmat** — analiza comparativă TS vs Python vs Go documentată în chat-ul sesiunii M1.S1; argument decisiv: single-language full stack (FE+Mobile+BE) match-uiește constraint-ul "Claude = singura forță execuție".
2. **Append-only enforcement dual-layer** — trigger BD `audit_log_block_modify` (defense-in-depth) + REVOKE UPDATE/DELETE pe rol `revyx_app` + middleware NestJS interceptor pentru logging logic.
3. **Refresh rotation cu replay detection** — coloana `rotated_at` + `parent_token_id` chain pentru detecție atac replay; la replay → revoke întreaga familie + log `AUTH_TOKEN_REUSE_DETECTED` HIGH.
4. **BR-12 single session enforced explicit** la fiecare `/auth/login` (revoke toate refresh tokens active înainte de emit pereche nouă) + la `/auth/change-password`.
5. **Webhook replay protection** via UNIQUE (provider, signature) index (90 zile rolling retention separat post-M1.S2 BullMQ job).
6. **Privacy + Cookie Policy drafts** v0.1.0 livrate cu 8 OD-legal-XX + OD-cookie-XX tracked pentru legal review extern M1.S2 entry.

**Out of scope M1.S1 (forward-applying):**
- Real DB integration tests via testcontainers-postgres → M1.S2
- Erasure cascade BullMQ worker (LEAD→DEAL anonymize→ACTIVITY delete) → M1.S3
- JWKS rotation endpoint `/auth/.well-known/jwks.json` → M1.S5
- SSO Google → M1.S5+ post-PM decision
- Mobile OT-flow `AUTH_MOBILE_OT_*` → M2.S3
- Custom roles Phase 5 → M2.S6

**Net effort M1.S1:** 1 sesiune productivă (spec + scaffold + ~22 source files + migrations + tests + legal drafts + doc bumps). Sub estimate inițial 6-8h.

### 4.2 M1.S2 — Phase A Foundation ★ CLOSED v1.0.7

> **Status:** ★ **CLOSED** — schema BD + REST API scaffold pentru entități business livrate. 9 migrations + 9 Drizzle schemas + 7 REST modules CRUD cu RBAC + tenant isolation + audit + optimistic locking. Test fixtures T01-T07 wired + integration test infra via testcontainers-postgres.

**Hats activi:** BACKEND DEV (P) + DBA (P) + ARCHITECT (S) + TESTER (S) + DOC + Senior PM.

| Task | Status | Descriere | Owner Hat | Effort | Output |
|---|---|---|---|---|---|
| ★ T-M1.S2-01 | ☑ | Migrations 0007-0015 (9 entități business) | DBA + BACKEND DEV | L | `apps/api/src/db/migrations/{0007_agents (ALTER users), 0008_leads, 0009_properties, 0010_deals, 0011_activities, 0012_tasks + trigger BR-04, 0013_offers + trigger counter-chain T07, 0014_showings + EXCLUDE gist, 0015_scoring_state}.sql` |
| ★ T-M1.S2-02 | ☑ | Drizzle schema TS paralele + index.ts | BACKEND DEV | M | `apps/api/src/db/schema/{leads, properties, deals, activities, tasks, offers, showings, scoring-state}.ts` + extindere `users.ts` + update `index.ts` |
| ★ T-M1.S2-03 | ☑ | REST modules cu @Roles + @AuditEvent + tenant isolation | BACKEND DEV + SECURITY | L | `apps/api/src/business/{leads, properties, deals, activities, tasks, offers, showings}/*.{dto, service, controller, module}.ts` + `common/tenant-context.ts` helper |
| ★ T-M1.S2-04 | ☑ | Scoring fixtures T01..T07 + Vitest assertions | TESTER + BACKEND DEV | M | `apps/api/src/scoring/{fixtures.ts, fixtures.spec.ts}` — helpers `computeLeadScore/PropertyScore/DealProbability/Nba/Dhi/ListingFreshness/apsForAgent` + 10 tests PASS |
| ★ T-M1.S2-05 | ☑ | Integration tests via testcontainers-postgres | TESTER + DBA | M | `apps/api/vitest.integration.config.ts` + `apps/api/test/integration/{setup.ts, migrations.spec.ts, leads-tenant-isolation.spec.ts}` + script `npm run test:integration` + CI job `integration` |
| ★ T-M1.S2-06 | ☑ | Doc bumps: Roadmap v1.0.7 + INDEX v1.1.11 + CLAUDE.md §0a sync | DOC + Senior PM | S | `docs/ROADMAP_REVYX_detailed-execution_v1.0.7.md` + `docs/INDEX_REVYX_documents_v1.1.11.md` + `CLAUDE.md` §0a M1.S2 ☑ + v1.2.14 |

**Decizii arhitecturale M1.S2:**

1. **AGENT == USER cu role aditiv** (nu tabel separat) — extindere `users` cu `agent_since_date/out_of_office_until/language_skills/calendar_sync_token`. Argument: FK la `users.id` deja existent în Phase 0; tabel separat ar dubla JOIN-urile fără value add.
2. **`scoring_state` generic** vs per-engine tables — un singur tabel cu `(entity_type, entity_id, score_kind)` UNIQUE; CHECK scale-aware permite NBA [0,2.0] alături de toate celelalte [0,1] fără dual-table. Engines M1.S3+ scriu doar aici via UPSERT.
3. **Optimistic locking obligatoriu** — toate UPDATE endpoints cer `expectedVersion` în body; service compară `WHERE version = $expected` + 409 dacă mismatch. Pattern aplicat la 7 entități (leads/properties/deals/tasks/offers/showings; activities append-only nu are UPDATE).
4. **Integration tests opt-in** — separat de unit tests (Vitest config dedicat) ca să nu rupă CI default fără Docker. CI job `integration` dependent pe `build` rulează doar pe GHA Ubuntu runners (Docker disponibil).
5. **Tenant isolation via `requireTenant(req)` helper** — toate query-uri WHERE `tenant_id = $1` enforced în service layer; integration test `leads-tenant-isolation.spec.ts` validează că cross-tenant lookup returnează 404 (nu 200 cu date altui tenant).
6. **Trigger PL/pgSQL pentru invariants critice** — BR-04 max 3 ACTIVE tasks (`task_enforce_max_3_active`) + T07 offer chain integrity (`offer_validate_counter_parent` — counter trebuie să aparțină aceluiași deal). Verificate în `migrations.spec.ts`.

**Out of scope M1.S2 (forward-applying):**
- Webhook intake real processing (Meta/Google/OLX → LEAD) → M1.S3
- Scoring engines (LS/PS/IS/DP/NBA/DHI/TS/APS) computation + cron recalc → M1.S3+M1.S4
- BR-01 Lead Firewall service (LS ≥ 0.60 + contact valid gate) → M1.S3
- Escalation Protocol cron (BR-03 T+SLA → T+SLA+30min → T+SLA+2h) → M1.S3
- GDPR erasure BullMQ cascade worker (LEAD → DEAL anonymize → ACTIVITY delete) → M1.S3
- Match Engine v1 (PS×LS×IS triple cosine) → M1.S4
- NBA Engine orchestration (BR-04 assignment workflow) → M1.S4
- WhatsApp templates (5 Meta-approved) → M1.S5
- Showcase Link `/p/:token` public viewer → M1.S5

**Net effort M1.S2:** 1 sesiune productivă (9 migrations + 9 schemas + 7 modules + fixtures + integration test infra + doc bumps). Sub estimate inițial L 8-16h.

### 4.3-4.8 M1.S3..M1.S8

> Neschimbat față de v1.0.0. Note: T-M1.S5-01 ("Reuse design system din M0.S1 + tokens") rămâne valid și beneficiază acum de `design/tokens.json` + `apps/web-preview/components/ui/` deja stabilizate. T-M1.S3 entry deblocat post M1.S2 ☑.

---

### ★ 4.3.MD — Moldova Market-Specific Schema Tasks [MOLDOVA-SPECIFIC]

> **Status:** PLANNED — toate task-urile de mai jos sunt în scope M1.S3 (Phase B Lead Intake + Scoring engines). Marcate explicit `[MOLDOVA-SPECIFIC]` — la expansiunea pe alte piețe, task-uri echivalente vor fi create per piață.
>
> **Sursă:** BRD §17 Specificații piață Republica Moldova (v1.2.0). Implementarea depinde de M1.S2 LEAD/PROPERTY/ACTIVITY/SHOWING schema deja existentă (migrations 0008/0009/0011/0014 — baza solidă).

**Hats activi:** DBA (P) + BACKEND DEV (P) + TESTER (S) + DOC + Senior PM.

| Task | Status | Descriere | Owner Hat | Effort | Output |
|---|---|---|---|---|---|
| ★ **T-MD-01** | ⬜ | **[MOLDOVA-SPECIFIC] Schema LEAD — câmpuri buget declarat/confirmat + preferințe + dismissed** | DBA + BACKEND DEV | M | Migration `0016_leads_moldova.sql`: ADD COLUMN `declared_budget_eur NUMERIC(12,2)`, `confirmed_budget_eur NUMERIC(12,2) NULL`, `budget_confirmed_at TIMESTAMPTZ NULL`, `preference_history JSONB[] NOT NULL DEFAULT '{}'::JSONB[]`, `dismissed_property_ids UUID[] NOT NULL DEFAULT '{}'`. Drizzle schema update `leads.ts`. DTO update `leads.dto.ts` cu `confirmedBudgetEur` optional. Service update `leads.service.ts` — `PATCH /leads/:id/confirm-budget` endpoint nou. AUDIT_LOG event `LEAD_BUDGET_CONFIRMED`. |
| ★ **T-MD-02** | ⬜ | **[MOLDOVA-SPECIFIC] Schema ACTIVITY — meeting_location_type + logica on_site auto-create SHOWING** | DBA + BACKEND DEV | M | Migration `0017_activities_moldova.sql`: ADD COLUMN `meeting_location_type ENUM('office','public_place','on_site') NULL` pe tabelul `activities`. Trigger PL/pgSQL `activity_on_site_create_showing`: după INSERT pe ACTIVITY cu `type = 'qualification_meeting' AND meeting_location_type = 'on_site'` → INSERT SHOWING automat cu `showing_type = 'qualification_combined'`. Drizzle schema + DTO update. IS (Interaction Strength) weight coefficient corectat pentru `on_site` (TBD exact valoare cu ML ENGINEER M1.S4). |
| ★ **T-MD-03** | ⬜ | **[MOLDOVA-SPECIFIC] Schema PROPERTY — property_class RM + index matching** | DBA + BACKEND DEV | S | Migration `0018_properties_moldova.sql`: ADD COLUMN `property_class ENUM('soviet_era','post_soviet','new_build','premium') NULL`. Index compus `CREATE INDEX idx_properties_class_listing ON properties (tenant_id, property_class, listing_type)` pentru Match Engine. Drizzle schema update `properties.ts`. DTO update `properties.dto.ts`. Mock data `apps/web-preview/lib/mock/properties.ts` updatat cu `property_class` realistic (~55% soviet_era la sub 80k + ~30% new_build + ~10% post_soviet + ~5% premium). |
| ★ **T-MD-04** | ⬜ | **[MOLDOVA-SPECIFIC] Schema LEAD — mandate tracking exclusivitate sellers** | DBA + BACKEND DEV | M | Migration `0019_leads_mandate.sql`: ADD COLUMN `mandate_status ENUM('none','pending','signed','expired') NOT NULL DEFAULT 'none'`, `mandate_signed_at TIMESTAMPTZ NULL`, `mandate_expires_at TIMESTAMPTZ NULL`, `mandate_document_id UUID NULL REFERENCES documents(id)`. Cron job `mandate-expiry-checker` (rulat zilnic): UPDATE mandate_status = 'expired' WHERE mandate_expires_at < NOW() + AUDIT_LOG + NBA task `renew_mandate` cu `due_at = mandate_expires_at - INTERVAL '3 days'`. NBA engine (M1.S4) — `request_mandate` task cu priority HIGH pentru supply leads `mandate_status = 'none'`. AUDIT_LOG events: `MANDATE_REQUESTED`, `MANDATE_SIGNED`, `MANDATE_EXPIRED`, `MANDATE_RENEWED`. |
| ★ **T-MD-05** | ⬜ | **[MOLDOVA-SPECIFIC] SHOWING feedback structurat 5 dimensiuni RM** | DBA + BACKEND DEV + TESTER | S | Migration `0020_showings_feedback.sql`: ADD COLUMN `feedback JSONB NULL` (structură 5 dimensiuni: price/zone/surface/condition/other cu rating 1-5 + comment string per dimensiune). ADD COLUMN `dismissed BOOLEAN NOT NULL DEFAULT false`. PATCH `/showings/:id/feedback` endpoint — validare Zod schema structurată (vs scalar rating 1-5). Trigger `showing_feedback_update_preferences`: la INSERT/UPDATE pe `showings.feedback` → event `preferences.changed` → snapshot curent `leads.preferences` salvat în `preference_history[]`. Match Engine (M1.S4): filtrare `dismissed = true` excludes property din rezultatele lead-ului respectiv. |

**Dependențe T-MD-XX:**
- T-MD-01: depinde de migration `0008_leads.sql` (M1.S2 ✅) — additive ONLY.
- T-MD-02: depinde de migration `0011_activities.sql` (M1.S2 ✅) + `0014_showings.sql` (M1.S2 ✅) — trigger cross-table.
- T-MD-03: depinde de migration `0009_properties.sql` (M1.S2 ✅) — additive ONLY.
- T-MD-04: depinde de `0008_leads.sql` (M1.S2 ✅) + `documents` table dacă e creat înainte (TECH_SPEC deal-closure M1.S6 scope → FK nullable OK).
- T-MD-05: depinde de `0014_showings.sql` (M1.S2 ✅) + T-MD-01 (preference_history array deja creat).

**Ordinea de implementare recomandată:** T-MD-03 → T-MD-01 → T-MD-05 → T-MD-02 → T-MD-04 (PROPERTY clasă mai simplu + test izolat → LEAD câmpuri → feedback trigger → on_site trigger → mandate complex cu cron).

---

### ★ 4.4 — Agent Growth Intelligence (AGI Layer) [AGI-XX]

> **Status:** PLANNED — tasks spanuite pe M1.S3..M1.S6 conform prioritizării din BRD §18. Sursă: analiza bibliografică profesională (Carnegie/Hill/Beckwith/Maister/Gitomer/Fox/Lukic/Blanchard+Peale/Yamaguchi + NAR Code of Ethics) corelată cu gap analysis framework REVYX. Toate task-urile sunt **additive** — zero modificare la entități existente, formule §7, sau BR-01..BR-24.
>
> **Hats activi (per sub-stage):** M1.S3 → BACKEND DEV (P) + DBA (S); M1.S4 → ML ENGINEER (P) + BACKEND DEV (S); M1.S5 → FRONTEND WEB DEV (P) + BACKEND DEV (S); M1.S6 → BACKEND DEV (P) + DBA (S). DOC transversal.

**M1.S3 — AGI tasks (în paralel cu Phase B Lead Intake + scoring engines):**

| Task | Status | Descriere | Owner Hat | Effort | DEP | Output |
|---|---|---|---|---|---|---|
| ★ **T-AGI-01** | ⬜ | **Ethics Checkpoints — entitate + trigger-uri (BR-28)** | BACKEND DEV + DBA | M | M1.S2 ✅ | Migration `0021_ethics_checkpoints.sql`: tabelă `ethics_checkpoints` cu câmpurile din BRD §8.5 + append-only enforcement (REVOKE UPDATE/DELETE pe rol `revyx_app`, analog audit_log). 4 trigger-uri service-layer (dual_representation / competing_offers / property_disclosure / financing_gap). DTO Zod + Service + Controller cu `@AuditEvent`. AUDIT_LOG events: `ETHICS_CHECKPOINT_TRIGGERED` + `ETHICS_CHECKPOINT_ACKNOWLEDGED`. |
| ★ **T-AGI-02** | ⬜ | **Financial Readiness Score (FRS) — câmpuri + calcul (BR-25) [MOLDOVA-SPECIFIC]** | BACKEND DEV | S | T-MD-01 (§17.1 câmpuri buget) | Service `leads.service.ts`: calcul FRS la fiecare PATCH pe câmpuri §17.1/§17.3 (`declared_budget_eur/confirmed_budget_eur/bank_preapproval_status`) via `computeFinancialReadinessScore()` helper. NBA check: BR-25 logic — dacă FRS < 0.30 AND LS ≥ 0.60 AND no active `clarify_financing` task → create task PENDING `clarify_financing` cu `priority=HIGH`. AC-AGI-05 + AC-AGI-06 verificate. |

**M1.S4 — AGI tasks (în paralel cu Match Engine + NBA Engine):**

| Task | Status | Descriere | Owner Hat | Effort | DEP | Output |
|---|---|---|---|---|---|---|
| ★ **T-AGI-03** | ⬜ | **Execution Guides — entitate + seed 9 ghiduri + NBA wire-up** | BACKEND DEV + ML ENGINEER | M | M1.S3 ✅ | Migration `0022_execution_guides.sql` + entitate din BRD §8.5. Seed `execution_guides_seed.ts` cu 9 ghiduri default pentru 9 `task_type` (script_template cu `{{client_name}}` / `{{property_address}}` variabile; timing_hint; avoid_notes). NBA output extins cu `execution_guide_id` când ghid disponibil. AUDIT_LOG event `EXECUTION_GUIDE_ACCESSED`. AC-AGI-07. |
| ★ **T-AGI-04** | ⬜ | **Promise Keeping Index (PKI) — calcul IS sub-dimensions + TS rework (BR-26)** | ML ENGINEER + BACKEND DEV | M | M1.S3 scoring engines ✅ | `scoring/pki.ts`: helper `computePki(agentId, windowDays=30)` → `tasks_completed_by_committed_deadline / tasks_with_explicit_deadline`. Batch cron `pki-weekly`: INSERT into `scoring_state` (entity_type='agent', score_kind='pki'). TS formula update: `TS_new = TS_existing × 0.85 + PKI × 0.15` per BRD §7.9. IS `quality_weight` component extins cu `follow_through_rate` + `response_consistency` (ambele derivate din task/activity data existentă). AUDIT_LOG event `AGENT_PKI_CALCULATED`. AC-AGI-01. fixtures.spec.ts: T08 (PKI edge case all-complete = 1.0; T09 PKI zero tasks = 0.50 default). |

**M1.S5 — AGI tasks (în paralel cu Phase C UI Web):**

| Task | Status | Descriere | Owner Hat | Effort | DEP | Output |
|---|---|---|---|---|---|---|
| ★ **T-AGI-05** | ⬜ | **Agent Goals — entitate + UI cabinet/agent tab** | BACKEND DEV + FRONTEND WEB DEV | M | M1.S4 ✅ | Migration `0023_agent_goals.sql` + entitate din BRD §8.5 cu câmp GENERATED `progress_pct`. CRUD endpoint `PATCH /agents/:id/goals/:period`. UI `/cabinet/agent` tab nou **„Obiectivele mele"** — input targets lunar + grafic progres real-time (actual vs target). Cron `agent-goals-actualize` (zilnic): UPDATE `actual_*` din deals + scoring_state. NBA context extension: dacă `actual_deals < target_deals × 0.60` AND day > 20 → UF +0.10 în NBA compute. AC-AGI-08. |
| ★ **T-AGI-06** | ⬜ | **Value Proposition Card + Showcase Link extins** | FRONTEND WEB DEV + BACKEND DEV | S | M1.S5 Showcase Link ✅ | ADD COLUMN `value_proposition_card JSONB NULL` pe `users` (migration `0024_users_vpc.sql`). PATCH `/agents/:id/value-proposition` endpoint. UI `/cabinet/agent` secțiune editabilă **„Propunerea mea de valoare"** (max 5 bullet-uri + preview client). Showcase Link `/p/:token` tab extins **„De ce prin agent"** cu `value_proposition_card` + 3 statistici APS auto-populate. |
| ★ **T-AGI-07** | ⬜ | **Ethics Checkpoints UI — soft prompt modal (wire-up T-AGI-01 backend)** | FRONTEND WEB DEV | S | T-AGI-01 ✅ | Componentă `<EthicsCheckpointModal>` — modal non-blocant cu checkbox acknowledge + buton „Am înțeles și am acționat corespunzător". Apare automat la trigger (event emit din backend la operație). POST `/ethics-checkpoints/:id/acknowledge` endpoint. UI `/cabinet/agent` tab „Standardele mele" — statistici checkpoints + ack rate. |
| ★ **T-AGI-08** | ⬜ | **Financial Readiness Score UI** | FRONTEND WEB DEV | XS | T-AGI-02 ✅ | UI `/leads/[id]` secțiune nouă **„Pregătire financiară"** — indicator cu 3 niveluri (Neconfirmat/In progres/Confirmat) + InfoTooltip + câmpuri editabile `confirmed_budget_eur` + `bank_preapproval_status`. Badge vizibil și în leads list (coloana mică indicator). i18n RO keys `lead.financialReadiness.*`. |

**M1.S6 — AGI tasks (în paralel cu Deal Closure pipeline):**

| Task | Status | Descriere | Owner Hat | Effort | DEP | Output |
|---|---|---|---|---|---|---|
| ★ **T-AGI-09** | ⬜ | **Client Alumni — entitate + trigger la deal CÂȘTIGAT + cron touchpoints** | BACKEND DEV + DBA | M | M1.S6 Deal Closure pipeline ✅ | Migration `0025_client_alumni.sql` + entitate din BRD §8.5. Trigger PL/pgSQL `deal_won_create_alumni`: la UPDATE `deals.status = 'CÂȘTIGAT'` → INSERT `client_alumni` + UPDATE `leads.status = 'alumni'` + AUDIT_LOG `CLIENT_ALUMNI_CREATED`. Cron `alumni-touchpoint-scheduler` (zilnic): query `WHERE next_touchpoint_at <= NOW()` + create NBA task `priority=LOW` cu `execution_guide_id` pentru template corespunzător. Câmp `referred_by_alumni_id UUID nullable` pe LEAD (migration extindere `0008_leads.sql` additive). AC-AGI-02. |
| ★ **T-AGI-10** | ⬜ | **Client Alumni UI — dashboard block + cabinet agent section** | FRONTEND WEB DEV | S | T-AGI-09 ✅ | UI `/cabinet/agent` bloc nou **„Clienții anteriori"** — count alumni + return rate + referrals count. Dashboard bloc F extins cu alumni reminder when `next_touchpoint_at <= NOW() + 7 days`. i18n RO keys `alumni.*` (~20 keys). |

**Dependențe AGI inter-task:**
- T-AGI-02 depinde de T-MD-01 (câmpuri buget §17.1 trebuie create prima).
- T-AGI-04 depinde de scoring engines M1.S3 (PKI necesită task completion data din sistemul real).
- T-AGI-03 depinde de NBA Engine M1.S4 (ghidurile se ataşează la NBA output).
- T-AGI-05 depinde de T-AGI-04 (UF extension în NBA necesită PKI compute activ).
- T-AGI-07 depinde de T-AGI-01 (UI wire-up backend endpoint).
- T-AGI-09 depinde de Deal Closure M1.S6 (trigger pe deal.status = CÂȘTIGAT necesar pipeline complet).
- T-AGI-10 depinde de T-AGI-09 (data alumni necesară pentru UI).

---

## 5. M2 — FULL RELEASE GA Detailed

> Neschimbat față de v1.0.0. Note: T-M2.S3-05 (NativeWind + design system tokens shared cu Web) beneficiază de `design/tokens.json` ca single source of truth (DP-06 brand consistency).

---

## 6. Critical Path Analysis (Top 20 dependencies blocking)

> Neschimbat structural. Top entry T-M0.S1-09 (Design System tokens) **rank 20 promovat la rank 5** post-v1.0.1 — devine blocker pentru toate page stubs M0.S1 (T-M0.S1-03..08) **și** pentru tailwind.config în M0.S3 + M1.S5 + M2.S2/S5.

---

## 7. Effort Summary per Milestone

| Milestone | Tasks | XS | S | M | L | XL | Sesiuni Claude estimate |
|---|---|---|---|---|---|---|---|
| Pre-dev (S16-S20) | ~38 | 4 | 16 | 12 | 5 | 1 | 5 sesiuni (CLOSED ✅) |
| ★ M0 (revised v1.0.1) | ~32 | 2 | 9 | 15 | 6 | 0 | **7-9 sesiuni** (−1 vs v1.0.0 via direct-to-code shift) |
| M1 (8 sub-stages) | ~98 | 6 | 22 | 38 | 28 | 4 | 40-55 sesiuni |
| M2 (8 sub-stages) | ~140 | 4 | 22 | 50 | 50 | 14 | 70-95 sesiuni |
| **TOTAL** | **~308** | **16** | **69** | **115** | **89** | **19** | **~122-164 sesiuni** |

---

## 8. Cross-references

- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` — §4-§6 source
- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` — platform tags per task
- ★ `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` — design system spec NEW M0.S1
- ★ `design/tokens.json` — single source of truth tokens NEW M0.S1
- ★ `apps/web-preview/` — preview Next.js 14 app NEW M0.S1
- `CLAUDE.md` §10b Regula 7 (11 hats) + Regula 8 (Master Plan compliance) + Regula 9 (Platform Matrix compliance)
- `HST_REVYX_pre-dev_findings-backlog_v1.0.0.md` F-S20-04 + F-S20-10 (closure path)

---

## 9. Approval Gate

| Aprobator | Sign-off | Data |
|---|---|---|
| Senior Architect | ✅ (v1.0.0 base) · ⬜ pending v1.0.1 ratify | 2026-06 / — |
| Senior PM | ✅ (v1.0.0 base) · ⬜ pending v1.0.1 ratify | 2026-06 / — |
| Frontend Lead | ⬜ pending v1.0.1 (direct-to-code shift) | — |
| DESIGNER (Creative Director) | ⬜ pending v1.0.1 (initiated shift) | — |
| Audit Lead | ⬜ pending v1.0.1 | — |
| CTO | ✅ (v1.0.0) | 2026-06 |

**Notă v1.0.1:** PATCH ratification cycle se închide la M0.S2 entry. Trio canonical **rămâne** Master Plan v1.1.2 + Platform Matrix v1.0.0 + Detailed Roadmap **v1.0.1** (acest doc).

---

*docs/ROADMAP_REVYX_detailed-execution_v1.0.15.md · v1.0.15 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
