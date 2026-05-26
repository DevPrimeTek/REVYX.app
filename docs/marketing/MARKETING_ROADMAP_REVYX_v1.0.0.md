# REVYX — Marketing Roadmap 180 zile (Pre-Launch MVP)
<!-- docs/marketing/MARKETING_ROADMAP_REVYX_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** Mkt-M1 — Pre-Launch Marketing Execution (paralel cu M1.S3 → M2.S1 dev track)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4 (M1) + §5 (M2)
**Strategy doc:** `MARKETING_STRATEGY_REVYX_v1.0.0.md` (single source of truth pentru poziționare + ICP + canale)
**Sister doc:** `WEBSITE_PROMOTION_PLAN_REVYX_v1.0.0.md` (livrabile website)

## 0.1 Platform Matrix

🌐 **WEB primary** (landing + blog + community gateway). 📱 **Mobile companion** post-MVP M2.S3+.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior Marketing + Senior PM + DOC | ★ INITIAL — Roadmap 180 zile descompus în 4 faze (T0-T30 Foundation · T30-T90 Build-up · T90-T150 Beta Acquisition · T150-T180 Launch Prep). 87 atomic tasks (T-Mkt-XXX) cu owner hat + effort estimate + dependencies + output + deliverable check. Beta cohort timeline detaliat. Cross-ref strategy §3 ICP + §5 canale + §8 KPI. |

---

## 1. Logică Roadmap

### 1.1 Faze macro

```
T0 ─── T+30 ────── T+90 ────── T+150 ──── T+180 ── T+180+30 (GA)
Faza A           Faza B          Faza C        Faza D
Foundation       Build-up        Beta          Launch
(setup tool)     (audience)      (cohort 1-3)  (PR push)
                                                + GA
```

| Fază | Obiectiv principal | Output măsurabil |
|---|---|---|
| **A — Foundation (T0 → T+30)** | Setup infrastructură marketing + brand asset library + content pipeline | Website live · Newsletter live · Telegram live · 6 lead magnets prep · 3 articole publicate |
| **B — Build-up (T+30 → T+90)** | Generare awareness organic + buildup waitlist | 1,500 newsletter subs · 2,000 LinkedIn followers · 500 Telegram subs · 200 lead magnet downloads/lună |
| **C — Beta Acquisition (T+90 → T+150)** | Recrutare + activare 3 beta cohorts | 500 beta applications · 55 beta active · 8 case studies în curs |
| **D — Launch Prep (T+150 → T+180)** | Embargo PR coordonat + waitlist final + conversie beta → paid | 8 earned media live săpt. lansare · 80 beta active · 200 waitlist warm pentru GA |

### 1.2 Atomic task format

Fiecare task urmează schema:

```
T-Mkt-XXX [P/S/T] [hat] [effort h] — Title
  Dep: T-Mkt-YYY (dacă există)
  Output: deliverable concret
  Check: criteriu acceptance
```

Legend:
- **[P]** = Primary (must-do, blocking faza următoare)
- **[S]** = Secondary (high-value, planned)
- **[T]** = Tertiary (nice-to-have, time-permitting)
- **[hat]:** SM=Senior Marketing · F=Fondator · D=DESIGNER · CD=Creative Director · DOC=DOC · DEV=FRONTEND DEV · LEGAL=Legal

---

## 2. Faza A — Foundation (T0 → T+30)

**Obiectiv:** Infrastructura marketing operațională + 3 lead magnets gata de promovat + primele 3 articole SEO live.

### 2.1 Săptămâna 1 (T0 → T+7) — Setup brand + tooling

| Task | Pri | Hat | Effort | Output | Check |
|---|---|---|---|---|---|
| T-Mkt-001 | P | SM | 4h | Notion workspace "Marketing REVYX" — 4 databases (Content Calendar · Leads · Partners · Media kit) | Workspace populat cu schema completă |
| T-Mkt-002 | P | SM | 2h | Plausible Analytics setup pe revyx.app (self-host Vercel) | Dashboard funcțional, primele evenimente captate |
| T-Mkt-003 | P | SM | 3h | Beehiiv newsletter setup — branding navy+gold + welcome sequence draft 5 emails | Newsletter "REVYX Weekly" public, 1 test send |
| T-Mkt-004 | P | F+SM | 2h | LinkedIn profil fondator — headline + about + banner + featured | Profil optimizat conform §5.3 strategy |
| T-Mkt-005 | P | SM | 1h | LinkedIn company page REVYX — logo + cover + about + first post | Page publică, 1 inaugural post |
| T-Mkt-006 | P | SM | 2h | Telegram channel @revyx_md + grup închis "REVYX Agenți Pilot" — pinned welcome | Ambele live, 5 pinned resources fiecare |
| T-Mkt-007 | P | SM | 1h | Facebook page REVYX — branding + 5 pinned posts seed | Page publică cu seed content |
| T-Mkt-008 | S | SM | 2h | Calendly setup — 2 event types (Demo call 30min + Press inquiry 15min) | Link-uri publice funcționale |
| T-Mkt-009 | S | SM | 2h | YouTube channel REVYX — branding + 3 placeholder playlists | Channel public, placeholder ready |
| T-Mkt-010 | S | SM | 1h | TikTok account @revyx.md — branding + bio | Account public |

**Săpt. 1 deliverable check:** Infrastructure 100% live. Niciun canal cu "coming soon".

### 2.2 Săptămâna 2 (T+7 → T+14) — Brand asset library

| Task | Pri | Hat | Effort | Output | Check |
|---|---|---|---|---|---|
| T-Mkt-011 | P | D+CD | 6h | Canva template kit — 8 templates (LinkedIn carousel · LinkedIn post text · FB post · IG square · YT thumbnail · Newsletter header · Webinar slide · OG image) | Templates publicate Canva team folder |
| T-Mkt-012 | P | D | 3h | Brand asset pack — logo SVG + PNG + dark + light variants + favicon + apple-touch-icon | ZIP în Google Drive + Vercel `/public` |
| T-Mkt-013 | P | D+CD | 4h | Pitch one-pager PDF (1 față) — 2-min product overview pentru outreach | PDF brandat în 3 limbi (RO/RU/EN) |
| T-Mkt-014 | P | SM | 2h | Press kit pagină pe revyx.app + assets (bio fondator + 2 cifre piață + 3 screenshots app + tagline-uri 10/30/60 cuv.) | `revyx.app/press` live |
| T-Mkt-015 | S | F | 2h | Founder bio + photo profesional (DIY + tool free Removebg + Canva) | Photo + bio EN/RO/RU în press kit |
| T-Mkt-016 | S | D | 3h | UTM tagging schema documentată — `utm_source` × `utm_medium` × `utm_campaign` taxonomie | Notion doc + Bitly free-tier setup |

### 2.3 Săptămâna 3 (T+14 → T+21) — Lead magnets batch 1

| Task | Pri | Hat | Effort | Output | Check |
|---|---|---|---|---|---|
| T-Mkt-017 | P | SM+F | 8h | **L1** — "Checklist preluare anunț imobiliar — 27 puncte" — PDF 4 pagini RO+RU | Tally form gate + PDF download URL |
| T-Mkt-018 | P | SM+F | 6h | **L2** — "Script call lead OLX — primele 3 minute" — PDF 2 pagini RO+RU | Tally form + PDF |
| T-Mkt-019 | P | LEGAL+SM | 6h | **L3** — "Contract preliminar vânzare-cumpărare RM model 2026" — Word + PDF | Validare avocat + disclaimer + Tally form |
| T-Mkt-020 | S | DEV | 8h | **L4** — Calculator comision agent imobiliar RM — mini-app Next.js sub `/calculator-comision` | Live + emailgate post-result |
| T-Mkt-021 | S | SM | 2h | Landing pages dedicate pentru L1-L4 (4 pagini sub `/resurse/{slug}`) | 4 URL-uri live cu Tally embed |

### 2.4 Săptămâna 4 (T+21 → T+30) — Primul content batch + SEO foundation

| Task | Pri | Hat | Effort | Output | Check |
|---|---|---|---|---|---|
| T-Mkt-022 | P | F+SM | 6h | Articol blog #1 — "De ce 30% dintre lead-urile OLX se pierd în primele 24 ore (și ce poți face)" — 2,000 cuvinte RO+RU | Publicat `revyx.app/blog/lead-leakage-olx` |
| T-Mkt-023 | P | F+SM | 6h | Articol blog #2 — "AOS vs CRM: de ce agentul RM are nevoie de altceva" — 1,800 cuvinte RO | Publicat `revyx.app/blog/aos-vs-crm` |
| T-Mkt-024 | P | F+SM | 5h | Articol blog #3 — "GDPR pentru agentul imobiliar din Moldova — ghid 2026" — 2,500 cuvinte RO | Publicat `revyx.app/blog/gdpr-agent-moldova` |
| T-Mkt-025 | P | SM | 3h | Sitemap + robots.txt + schema markup + Google Search Console verify | GSC verified + sitemap submitted |
| T-Mkt-026 | P | F | 4h | LinkedIn launch sequence — 5 posts fondator (Mon-Fri săpt. 4) | 5 posts live · avg engagement >5% |
| T-Mkt-027 | S | SM | 3h | Facebook + Telegram launch — 14 posts seed (7 fiecare canal) | Toate live cu cadence verified |
| T-Mkt-028 | S | DOC | 2h | Update INDEX_REVYX_documents — adăugare cele 3 docs marketing nou | INDEX vXXX bump committed |

**Faza A exit gate:**
- ✅ Website 100% live cu /blog (3 articole) + /press + /resurse (4 lead magnets)
- ✅ Newsletter activ cu ≥1 send
- ✅ LinkedIn, Facebook, Telegram, YouTube, TikTok toate launched
- ✅ Brand asset library completă
- ✅ Analytics + UTM tracking funcțional
- ✅ Press kit ready de distribuit
- 🎯 **Target T+30: 50 newsletter subs · 150 LinkedIn followers · 30 Telegram subs · 100 unique visitors/săpt.**

---

## 3. Faza B — Build-up (T+30 → T+90)

**Obiectiv:** Generare awareness organic prin content consistent + outreach earned media + parteneriate inițiale.

### 3.1 Cadență cumulativă lunile 2-3

| Activitate | Frecvență | T+30→T+60 (luna 2) | T+60→T+90 (luna 3) |
|---|---|---|---|
| Articole blog | 1/săpt | 4 articole | 4 articole |
| LinkedIn posts fondator | 3-5/săpt | ~16 posts | ~16 posts |
| Newsletter sends | 1/săpt | 4 sends | 4 sends |
| Facebook posts | 5/săpt | ~20 posts | ~20 posts |
| Telegram channel posts | 7/săpt | ~28 posts | ~28 posts |
| YouTube Shorts + TikTok | 2/săpt | 8 video | 8 video |
| Webinar | 1/lună | Webinar #1 | Webinar #2 |
| Outreach podcast/PR | 4/lună | 4 outreaches | 4 outreaches |
| Partner outreach | 2/lună | 2 outreaches | 2 outreaches |

### 3.2 Tasks structurate luna 2 (T+30 → T+60)

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-029 | P | F+SM | 24h cumulativ | 4 articole blog luna 2 — calendar: săpt5 "Top 7 greșeli OLX intake" · săpt6 "Cum măsori APS agent" · săpt7 "Lead Score explicat fără matematică" · săpt8 "Calculator comision interactiv" |
| T-Mkt-030 | P | F | 12h cumulativ | LinkedIn editorial calendar luna 2 — 16 posts (4 build-in-public + 4 pain story + 4 piață insight + 4 demo screenshot) |
| T-Mkt-031 | P | SM | 8h cumulativ | Newsletter luna 2 — 4 sends (welcome + 3 weekly digest) |
| T-Mkt-032 | P | F+SM | 6h | **Webinar #1** — "10 lead-uri pierdute săptămânal. Anatomy of a leakage." — pregătire + livrare + repurpose YouTube + 3 Shorts |
| T-Mkt-033 | P | SM | 6h | Outreach earned media batch 1 — 8 outreaches individuale (2 podcast + 3 presă + 2 asociații + 1 conferință) |
| T-Mkt-034 | S | SM | 4h | Partner outreach batch 1 — 2 outreaches (1 asociație + 1 trainer) |
| T-Mkt-035 | S | F+SM | 4h | 8 YouTube Shorts + TikTok luna 2 |
| T-Mkt-036 | T | SM | 3h | A/B test taglines (variante A/B/C strategy §2.4) live pe LinkedIn — track CTR |

### 3.3 Tasks structurate luna 3 (T+60 → T+90)

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-037 | P | F+SM | 24h | 4 articole blog luna 3 — calendar: săpt9 "GDPR audit gratuit step-by-step" · săpt10 "BR-01 Lead Firewall în acțiune" · săpt11 "Story Diana — broker care a scalat 3→8 agenți" · săpt12 "Q1 2026 raport piață RM" |
| T-Mkt-038 | P | F | 12h | 16 LinkedIn posts luna 3 |
| T-Mkt-039 | P | SM | 8h | Newsletter luna 3 — 4 sends |
| T-Mkt-040 | P | F+SM | 6h | **Webinar #2** — "Cum filtrezi 50 lead-uri OLX în 10 care merită timp" |
| T-Mkt-041 | P | SM | 6h | Outreach earned media batch 2 — 8 outreaches (follow-up + new) |
| T-Mkt-042 | P | SM | 4h | Partner outreach batch 2 — 2 outreaches (1 notar + 1 bancă) |
| T-Mkt-043 | P | F+SM | 8h | **Lead magnets batch 2** — L5 GDPR Checklist + L6 Q1 Raport piață (din articolul blog repurposed) |
| T-Mkt-044 | S | F+SM | 4h | 8 YouTube Shorts + TikTok luna 3 |
| T-Mkt-045 | S | SM | 4h | Beta application form draft + landing page `/beta` (păstrat hidden T+30→T+85, public T+85+) |
| T-Mkt-046 | S | SM | 3h | Setup CRM Notion pentru beta applications + tagging system |
| T-Mkt-047 | T | SM | 2h | Pre-beta teaser campaign — Telegram + LinkedIn "Beta soon — get on the list" |

**Faza B exit gate (T+90):**
- ✅ 8 articole blog publicate (cumulativ cu Faza A = 11 articole)
- ✅ 2 webinare livrate + repurposed
- ✅ 16 outreach attempts earned media (target 4 conversii)
- ✅ 4 partner outreach attempts (target 2 confirmate)
- ✅ Beta landing page gata de public
- 🎯 **Target T+90: 1,500 newsletter subs · 2,000 LinkedIn followers · 500 Telegram subs · 4 confirmed earned media apparitions · 2 partneriate semnate**

---

## 4. Faza C — Beta Acquisition (T+90 → T+150)

**Obiectiv:** Recrutare + activare 3 cohorts beta (cumulat 55 beta active la T+150). Generare case studies pentru launch.

### 4.1 Beta launch sequence (T+85 → T+95)

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-048 | P | SM+DEV | 6h | Beta landing page `/beta` PUBLIC — formular Tally cu 12 câmpuri (nume, agenție, oraș, OLX profile link, lead volume/săpt, motivație, disponibilitate feedback) |
| T-Mkt-049 | P | F | 4h | LinkedIn launch post beta — vehicle organic principal pentru recruit P2/P3 |
| T-Mkt-050 | P | SM | 3h | Email blast newsletter — "Beta is open" + Telegram announcement + Facebook |
| T-Mkt-051 | P | F+SM | 8h | Manual screening primele 100 applications — fit interview Zoom 15 min fiecare |
| T-Mkt-052 | P | F+SM | 16h | Onboarding cohorta 1 (10 agenți) — 10 × 60 min discovery + setup tenant + 30 min training |
| T-Mkt-053 | S | SM | 4h | Beta resource center `/beta/resources` — tutorial videos + FAQ + Telegram private link |

### 4.2 Beta operations (T+90 → T+150)

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-054 | P | F+SM | 24h cumulativ | Weekly check-ins cohorta 1 — 10 agenți × 15 min × 8 săpt = 20h + 4h synthesis |
| T-Mkt-055 | P | F+SM | 36h cumulativ | Onboarding cohorta 2 (25 agenți) T+120 — 25 × ~80 min cumulativ |
| T-Mkt-056 | P | F+SM | 24h cumulativ | Weekly check-ins cohorta 2 — 25 agenți × 15 min × 4 săpt = 25h |
| T-Mkt-057 | P | F+SM | 60h cumulativ | Onboarding cohorta 3 (45 agenți) T+150 — 45 × ~80 min cumulativ |
| T-Mkt-058 | P | SM | 8h | Beta NPS pulse (luna 4, 5, 6) — 3 NPS surveys + analiza |
| T-Mkt-059 | P | F+SM | 16h | 5 case studies documentate (după T+120) — interviu beta user + reformulare pain → impact + screenshots + testimonial video |

### 4.3 Content + outreach în paralel cu beta ops

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-060 | P | F+SM | 24h | 8 articole blog luna 4-5 — focus: case studies beta + product deep-dives |
| T-Mkt-061 | P | F | 24h | 32 LinkedIn posts (luni 4-5) — 50% beta journey content |
| T-Mkt-062 | P | SM | 16h | 8 newsletter sends luni 4-5 |
| T-Mkt-063 | P | F+SM | 12h | **Webinar #3 + #4** luni 4-5 — "Maximum 3 task-uri active" + "GDPR Compliance Checklist" |
| T-Mkt-064 | P | SM | 12h | Outreach earned media batch 3+4 — 16 outreaches |
| T-Mkt-065 | P | SM | 8h | Partner outreach batch 3+4 — 4 outreaches |
| T-Mkt-066 | S | F+SM | 8h | **L7 + L8** lead magnets — OKR template + Funnel audit Calendly |
| T-Mkt-067 | S | F+SM | 8h | 16 YouTube Shorts + TikTok luni 4-5 |
| T-Mkt-068 | S | SM | 4h | A/B test homepage hero — test 2 variante message house pillar M1 vs M2 |

**Faza C exit gate (T+150):**
- ✅ 3 beta cohorts onboarded (cumulativ 80 agenți, target activation 70%+)
- ✅ 5 case studies documentate + 3 testimonial videos
- ✅ 16 articole blog cumulat (Faza A+B+C = 19)
- ✅ 4 webinare livrate cumulat
- ✅ 6 confirmed earned media apparitions
- ✅ 6 parteneriate confirmate
- 🎯 **Target T+150: 3,500 newsletter subs · 4,000 LinkedIn followers · 800 Telegram subs · 55 beta active · NPS ≥ 40**

---

## 5. Faza D — Launch Prep + GA (T+150 → T+180 → T+210)

**Obiectiv:** PR push coordonat + waitlist warming + conversie beta → paid + lansare publică.

### 5.1 Launch readiness (T+150 → T+170)

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-069 | P | SM+F+CD | 12h | Press release official — RO+RU+EN (3 variante distinct framing per audiență) |
| T-Mkt-070 | P | SM | 8h | Embargo PR schedule — 5 outlets target same week (T+178-T+182) |
| T-Mkt-071 | P | F | 8h | LinkedIn launch narrative — 7 posts pre-launch sequence (T+150 → T+180) |
| T-Mkt-072 | P | SM | 12h | Email launch sequence — 5 emails pentru newsletter (T+170 / T+175 / T+178 / T+180 / T+182) |
| T-Mkt-073 | P | DEV+SM | 8h | Pricing page live `/pricing` + checkout flow ready (Stripe/Paynet) |
| T-Mkt-074 | P | SM | 4h | Beta → Paid conversion campaign — 80 emails personalizate cu rebate code "FOUNDING50" |
| T-Mkt-075 | P | F+SM | 6h | **Webinar #5 demo live** "Sneak peek REVYX MVP — Q&A fondator" |
| T-Mkt-076 | S | SM | 4h | Affiliate program seed — beta users → referral 10% commission primii 6 luni |

### 5.2 Launch week (T+178 → T+185)

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-077 | P | F+SM | 6h | T+178 — Embargo lift email send + LinkedIn announcement + Telegram + Facebook + Press release |
| T-Mkt-078 | P | SM | 4h | T+179 — Newsletter blast launch + Webinar invite |
| T-Mkt-079 | P | F+SM | 6h | T+180 — Founder live AMA Telegram + LinkedIn Live + YouTube Live (3-channel simulcast) |
| T-Mkt-080 | P | SM | 4h | T+181 — Customer success spotlight (case study #1 publicat full) |
| T-Mkt-081 | P | SM | 4h | T+182 — Press coverage roundup (link aggregator post) |
| T-Mkt-082 | P | F+SM | 6h | T+183 — Webinar #6 final "Cum am construit primul AOS din Moldova" + Q&A |
| T-Mkt-083 | P | SM | 3h | T+184-185 — Weekend follow-up + DM-uri pierdute |

### 5.3 Post-launch (T+185 → T+210)

| Task | Pri | Hat | Effort | Output |
|---|---|---|---|---|
| T-Mkt-084 | P | SM | 8h | Săpt. 26-27 — Conversion follow-up beta users non-activated paid (manual outreach 80% retention target) |
| T-Mkt-085 | P | SM | 6h | Săpt. 26-27 — Retention email sequence for paid users (welcome + 3 onboarding tips + community invite) |
| T-Mkt-086 | P | SM+F | 8h | T+210 retrospect — Mkt-M1 close report + Mkt-M2 strategy doc seeded |
| T-Mkt-087 | S | F+SM | 8h | Speaker pitch conferința imobiliare RM (toamnă) — submit application gratuit |

**Faza D exit gate (T+210, GA + 30):**
- ✅ Public MVP live + pricing functional
- ✅ 5+ PR articles publicate launch week
- ✅ 20+ paying customers prima lună post-GA
- ✅ €5,000 MRR target prim trimestru post-GA
- 🎯 **Target T+210: 5,000 newsletter subs · 5,000 LinkedIn followers · 1,000 Telegram subs · 20 paying · NPS ≥ 50**

---

## 6. Săptămânal Sprint Cadence (după T+30)

Format săptămânal standard pentru Senior Marketing + Fondator:

| Zi | Activitate | Durată |
|---|---|---|
| **Luni 9:00** | Sprint planning marketing — review KPI săpt. anterior, prioritate săpt. nouă | 60 min |
| **Marți** | Content production block 1 — fondator scrie LinkedIn + 1 articol blog | 4h |
| **Miercuri** | Content production block 2 — SM produce newsletter + 2 social posts + schedule | 4h |
| **Joi** | Outreach block — fondator + SM trimit 5+ outreach (podcast / partener / press) | 3h |
| **Vineri 14:00** | Beta calls block — 5 check-in calls × 15 min (post-T+90) | 90 min |
| **Vineri 16:00** | Weekly retro — KPI snapshot Notion + lecții learnt + next week prep | 60 min |

**Total time investment fondator:** ~12h/săpt. dedicat marketing pre-MVP. **SUSTAINABLE** doar dacă tooling automate + pre-batching content.

---

## 7. Risk Mitigation per Task

| Risk task | Mitigation |
|---|---|
| Articol blog ratează deadline | Fondator scrie 4 articole în advance într-un weekend lunile 1-2 (batch) |
| LinkedIn post idea drought | Library de 50 idei prep T+15 (din strategy.pillars) — fondator alege weekly |
| Beta application count low | T+60 emergency lever: paid Meta Ads €500-1000 buffer (PM decision needed) |
| Earned media outreach ignored | Pivot la 2× volum + sub-tier outlets (TechMD, blog-uri tech) |
| Beta onboarding bottleneck fondator | T+90 hire freelancer asistent comunicare €300-500/lună (din venituri pilot) |
| Webinar attendance < 50 | Reduce frequency la 1/lună in loc 2/lună + boost reminders |
| Lead magnet conversion rate < 3% | A/B test headline + CTA + form copy lunile 2-3 |

---

## 8. Dependencies Cross-Track (Marketing ↔ Dev)

| Dep | Pe ce așteptăm dev (M1.S3+) | Pe ce așteaptă dev de la marketing |
|---|---|---|
| **Beta launch (T+90)** | M1.S3 + M1.S4 finalizate — Lead Intake real + Scoring engines + Match Engine v1 | Beta cohort 1 feedback pentru M1.S5 UI polish |
| **Live demo webinar #5 (T+165)** | M1.S5 Phase C UI Web finalizat — agent + manager dashboard real | Demo URL stabil + 1-2 demo accounts pre-seed |
| **GA launch (T+180+30 = T+210)** | M2.S1 GA readiness + payments + onboarding flow | Newsletter list ready pentru email blast + press kit |
| **Mobile companion content (T+210+)** | M2.S3 Mobile companion live | Mobile demo screenshots + companion narrative |

---

## 9. Cumulativ Effort Estimate

| Fază | Effort fondator | Effort Senior Marketing | Effort Designer | Total cumulat |
|---|---|---|---|---|
| Faza A (T0-T+30) | ~40h | ~80h | ~16h | ~136h |
| Faza B (T+30-T+90) | ~120h | ~160h | ~12h | ~292h |
| Faza C (T+90-T+150) | ~180h | ~200h | ~16h | ~396h |
| Faza D (T+150-T+210) | ~60h | ~80h | ~8h | ~148h |
| **TOTAL 180 zile** | **~400h** | **~520h** | **~52h** | **~972h** |

**Critical insight:** Fondator alocă **~12-15h/săpt.** consistent. Senior Marketing **~17h/săpt.** Designer punctual.

---

## 10. Cross-Reference Documente

- `MARKETING_STRATEGY_REVYX_v1.0.0.md` — strategy doc canonical (poziționare + ICP + canale + funnel + KPI)
- `WEBSITE_PROMOTION_PLAN_REVYX_v1.0.0.md` — sitemap landing + content per pagină + lead capture flow
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/` — pitch deck (T-Mkt-014 press kit cross-ref slide 1 cover)
- `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — demo video 5min (lead magnet la T+165)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4-§5 — dev track dependencies §8

---

## 11. Sign-off

| Rol | Responsabilitate | Semnătură | Data |
|---|---|---|---|
| Senior Marketing | Owner roadmap execution | ___________________________ | Mai 2026 |
| Senior PM | Aprobare timeline + dependencies dev | ___________________________ | Mai 2026 |
| Fondator / CEO | Commitment effort ~400h cumulativ 180 zile | ___________________________ | Mai 2026 |
| DESIGNER (Creative Director) | Aprobare brand asset library + visual templates | ___________________________ | Mai 2026 |

---

*MARKETING_ROADMAP_REVYX · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
