# TECH SPEC — MLS / Cooperation & Partnership Selling
<!-- TECH_SPEC_REVYX_mls-cooperation_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Macro-milestone **M1 — MVP Funcțional** / sub-stage **M1.S4** (Match + NBA + cooperation layer). Operaționalizează BR-29 (MLS Cooperation & commission-sharing) + §18.10 AGI-08. Depinde de OFFER chain + DEAL pipeline + mandat exclusiv (`mandate_status`, §17.5, M1.S3).

**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §5.2 (M1.S4).
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.15.md` §4.4 AGI Layer (T-AGI-08 / T-MLS-XX).
**BRD ref:** `BRD_REVYX_v1.5.0.md` §6.5.1 (BR-29), §8.5.1 (`cooperation_offers`), §18.10 (AGI-08).
**Conexe:** `TECH_SPEC_REVYX_offer-engine_v1.0.0.md` (OFFER chain) · `TECH_SPEC_REVYX_deal-closure_v1.0.0.md` (DEAL) · `TECH_SPEC_REVYX_showing_v1.0.0.md` (Open House extension) · `WORKFLOW_REVYX_property-onboarding_v1.1.0.md` (mandat).

## 0.1 Platform Matrix

| Surface | Scope | Notă |
|---|---|---|
| 🔧 Backend API | ✅ primary | `cooperation_offers` CRUD + commission split engine |
| 🌐 Web | 🔁 primary UI | Tab „Cooperare (MLS)" pe property detail + queue „Oferte de cooperare" |
| 📱 Mobile | 🔁 companion | View/engage cooperation offers in-field (M2.S3) |

Per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` — cooperare = **🔁 BOTH**, gestionare primară pe Web.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| **1.0.0** | **2026-06** | ARCHITECT (P) + BACKEND DEV (P) + DBA (S) + Senior Compliance Auditor (S) + DOC + Senior PM | ★ Initial — Serviciu de vânzări partenere (MLS) bazat pe metodologia profesională Riѐltor (Сервис партнерских продаж / МЛС) + NAR Art. 3 (cooperare) + APAIM (cooperare între membri). Acoperă: §3 model conceptual + butterfly of sales; §4 entitatea `cooperation_offers`; §5 gate mandat (BR-29); §6 commission split engine; §7 Open House (ДОД) ca extensie SHOWING; §8 API; §9 AUDIT_LOG; §10 RBAC + inter-tenant; §11 raportare scrisă proprietar; §12 test plan; §13 impact + sign-off. |

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Context: МЛС, NAR Art. 3, APAIM](#2-context-млс-nar-art-3-apaim)
3. [Model conceptual + Butterfly of Sales](#3-model-conceptual--butterfly-of-sales)
4. [Entitatea `cooperation_offers`](#4-entitatea-cooperation_offers)
5. [Gate mandat exclusiv (BR-29)](#5-gate-mandat-exclusiv-br-29)
6. [Commission Split Engine](#6-commission-split-engine)
7. [Open House / ДОД (extensie SHOWING)](#7-open-house--дод-extensie-showing)
8. [API Contracts](#8-api-contracts)
9. [AUDIT_LOG events](#9-audit_log-events)
10. [RBAC + cooperare inter-tenant](#10-rbac--cooperare-inter-tenant)
11. [Raportare scrisă către proprietar](#11-raportare-scrisă-către-proprietar)
12. [Test Plan](#12-test-plan)
13. [Impact Assessment + Sign-off](#13-impact-assessment--sign-off)

---

## 1. Executive Summary

REVYX trata agentul ca operator izolat. Practica profesională matură (și NAR/APAIM) demonstrează că **cel mai eficient instrument de vânzare este cooperarea**: listing-ul exclusiv se publică într-o rețea de parteneri, iar agentul listării **împarte comisionul** cu agentul partener care aduce cumpărătorul.

Beneficii (din metodologie): concentrarea cererii → vânzare mai rapidă → preț maxim. Logica banilor: **cumpărător → proprietar → toți cei care participă la vânzare**. Proprietarul plătește comisionul (prin mandat exclusiv); cumpărătorul nu plătește agentului listării.

**Design:** layer transversal peste PROPERTY + DEAL + OFFER existente. **Zero modificare** la schema acestora — doar entitate nouă `cooperation_offers` + FK-uri additive.

---

## 2. Context: МЛС, NAR Art. 3, APAIM

| Sursă | Principiu |
|---|---|
| NAR **Art. 3** | „REALTORS® cooperează cu alți brokeri, exceptând când cooperarea nu e în interesul clientului." |
| APAIM | Promovează cooperarea între agenți membri + reprezentare exclusivă + transparență. |
| Metodologie de teren | „Сервис партнерских продаж (МЛС)": invită colegi-membri la Ziua Ușilor Deschise; oferă cotă de comision motivantă (de regulă jumătate, uneori mai mult); obiectul exclusiv are prioritate la parteneri. |

> **Pre-condiție etică (Art. 16):** cooperarea presupune respectarea mandatelor exclusive ale colegilor — nu se ocolește agentul listării pentru contact direct cu proprietarul.

---

## 3. Model conceptual + Butterfly of Sales

```
        LISTING AGENT (mandat exclusiv semnat)
                 │  publică în MLS cu offered_split_pct (ex: 50%)
                 ▼
        ┌─── cooperation_offers (scope: intra/inter/public) ───┐
        │                                                       │
   PARTNER AGENT A                                       PARTNER AGENT B
   (aduce cumpărător)                                    (aduce cumpărător)
        │                                                       │
        └───────────── OFFER (оферта scrisă) ───────────────────┘
                 │  cea mai bună ofertă → DEAL
                 ▼
        DEAL CÂȘTIGAT → commission split logat append-only
        (listing_agent: 100% − split · cooperating_agent: split)
```

**„Butterfly of Sales" (Бабочка продаж)** — instrument de poziționare folosit de agent în calificarea proprietarului: vizualizează raportul Cerere–Ofertă, planul de marketing activ, comparația Agenți vs Cumpărători și poziționarea prețului. În REVYX se materializează ca **card de poziționare** în Execution Guide `schedule_showing` (seller meeting, §18.3) — NU este o entitate, ci conținut de ghid.

---

## 4. Entitatea `cooperation_offers`

```sql
CREATE TABLE cooperation_offers (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                  UUID NOT NULL REFERENCES tenants(id),
  property_id                UUID NOT NULL REFERENCES properties(id),
  listing_agent_id           UUID NOT NULL REFERENCES users(id),
  offered_split_pct          NUMERIC(5,2) NOT NULL DEFAULT 50.00
                               CHECK (offered_split_pct >= 0 AND offered_split_pct <= 100),
  scope                      TEXT NOT NULL DEFAULT 'intra_agency'
                               CHECK (scope IN ('intra_agency','inter_agency','public_mls')),
  status                     TEXT NOT NULL DEFAULT 'open'
                               CHECK (status IN ('open','engaged','closed','withdrawn')),
  cooperating_agent_id       UUID NULL REFERENCES users(id),
  cooperating_tenant_id      UUID NULL REFERENCES tenants(id),
  deal_id                    UUID NULL REFERENCES deals(id),
  mandate_verified           BOOLEAN NOT NULL DEFAULT false,   -- gate BR-29
  commission_split_logged_at TIMESTAMPTZ NULL,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  version                    INT NOT NULL DEFAULT 0             -- optimistic locking
);
CREATE INDEX idx_coop_property ON cooperation_offers (property_id);
CREATE INDEX idx_coop_open ON cooperation_offers (tenant_id, status) WHERE status IN ('open','engaged');
-- public_mls vizibil cross-tenant prin view dedicat cu PII proprietar mascat
```

**State machine:** `open → engaged → closed` (happy path) · `open/engaged → withdrawn` (retragere listing agent).

---

## 5. Gate mandat exclusiv (BR-29)

Publicarea în MLS este **interzisă** fără mandat exclusiv semnat:

```typescript
async function publishCooperationOffer(dto: PublishDto, ctx: Ctx) {
  const lead = await leadOfProperty(dto.propertyId);          // seller lead
  if (lead.mandate_status !== 'signed')
    throw new ConflictException('BR-29: MLS publish requires signed exclusive mandate');
  return db.insert(cooperationOffers).values({
    ...dto, listingAgentId: ctx.userId, mandateVerified: true,
    tenantId: ctx.tenantId, status: 'open',
  });
}
```

- `mandate_verified` îngheață faptul că mandatul era semnat la publicare (probă).
- La `mandate_status → expired` pe lead → cron `mls_mandate_guard` setează `cooperation_offers.status = 'withdrawn'` pentru ofertele `open` ale acelei proprietăți + AUDIT event.

---

## 6. Commission Split Engine

La `deal.status → CÂȘTIGAT` pentru un deal cu `cooperation_offers.cooperating_agent_id` setat:

```
total_commission_eur = property.commissionPct × final_price_eur        (sale)
                     = 1 × monthly_rent_eur                            (rent — rent_profile)

cooperating_share_eur = total_commission_eur × (offered_split_pct / 100)
listing_share_eur     = total_commission_eur − cooperating_share_eur
```

- Rezultatul se scrie în `cooperation_offers.commission_split_logged_at` + **AUDIT_LOG append-only** `MLS_COMMISSION_SPLIT_LOGGED` cu payload `{ total, listing_share, cooperating_share, offered_split_pct, deal_id }`.
- Idempotent: re-procesare aceluiași deal nu re-loghează (guard pe `commission_split_logged_at IS NULL`).
- **Inter-tenant** (`scope='inter_agency'/'public_mls'`): split-ul este o **înregistrare de reconciliere** (nu transfer financiar automat) — settlement-ul real rămâne între agenții/agențiile partenere conform acordului lor. REVYX furnizează evidența auditabilă.
- Aliniat NAR Art. 6/7 (transparență comision) — split-ul este documentat, nu ascuns.

---

## 7. Open House / ДОД (extensie SHOWING)

Ziua Ușilor Deschise = eveniment de **concentrare a cererii** (din metodologie): showing grupat + invitație agenți parteneri.

- Extensie additive pe entitatea `showings`: `is_open_house BOOLEAN DEFAULT false` + `invited_partner_agent_ids UUID[] DEFAULT '{}'`.
- Un Open House nu este o nouă entitate — reutilizează SHOWING (`TECH_SPEC_REVYX_showing`), cu calendar conflict guard existent.
- Best practice codificat în Execution Guide (§18.3): proprietarul **absent** la showing-uri (tehnica „showing fără proprietar"), concentrarea showing-urilor în 2-3 ore, ofertă scrisă (оферта) după.

---

## 8. API Contracts

| Metodă | Endpoint | Rol | Descriere |
|---|---|---|---|
| `POST` | `/cooperation/offers` | listing agent | Publică (gate BR-29 mandat) |
| `GET` | `/cooperation/offers?scope=&status=` | agent | Listă (intra: tenant; inter/public: view mascat) |
| `POST` | `/cooperation/offers/:id/engage` | partner agent | Se angajează (`status→engaged` + `cooperating_agent_id`) |
| `POST` | `/cooperation/offers/:id/withdraw` | listing agent | `status→withdrawn` |
| `GET` | `/cooperation/report?period=month` | manager / admin | MLS Cooperation Rate + split-uri logate |

Optimistic locking cu `version` pe engage/withdraw (concurență 2 parteneri).

---

## 9. AUDIT_LOG events

| Event | Severity | Payload |
|---|---|---|
| `MLS_OFFER_PUBLISHED` | LOW | offer_id · property_id · offered_split_pct · scope |
| `MLS_OFFER_ENGAGED` | LOW | offer_id · cooperating_agent_id · cooperating_tenant_id |
| `MLS_COMMISSION_SPLIT_LOGGED` | MED | offer_id · deal_id · total · listing_share · cooperating_share |
| `MLS_OFFER_WITHDRAWN` | LOW | offer_id · reason (manual / mandate_expired) |

> Catalogare în `TECH_SPEC_REVYX_audit-log` §4.x la implementare M1.S4.

---

## 10. RBAC + cooperare inter-tenant

| Acțiune | agent | senior_agent | team_lead | manager | admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Publică ofertă cooperare (own listing) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Angajează ofertă partener | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vede oferte echipă | ❌ | ❌ | echipa sa | ✅ | ✅ |
| Activează `inter_agency`/`public_mls` per tenant | ❌ | ❌ | ❌ | ❌ | ✅ |
| Raport split-uri | ❌ | ❌ | echipa sa | ✅ | ✅ |

- **Inter-tenant** necesită config admin la nivel tenant (`tenant.mls_inter_agency_enabled`) + acord de cooperare semnat off-platform. PII proprietar **mascat** în view-ul cross-tenant (analog marketplace).
- Tenant isolation: query-urile intra rămân `WHERE tenant_id = $1`; doar `public_mls` expune un subset prin view dedicat.

---

## 11. Raportare scrisă către proprietar

Obligație din mandatul exclusiv (Art. 9 — documentare scrisă) și din metodologie („отчетность регулярная и в письменном виде"):

- Cadență **săptămânală**: rezumat activitate (showing-uri, parteneri angajați, feedback, oferte primite).
- Generat din activitatea pe PROPERTY + `cooperation_offers` + `showings`.
- Livrarea la termen alimentează **PKI** (Promise Keeping Index, BR-26 / §7.9) — raportarea ratată scade PKI agentului.
- Template în `execution_guides` (`action_type=custom`, key `weekly_owner_report`).

---

## 12. Test Plan

| ID | Test | Așteptat |
|---|---|---|
| MLS-T01 | Publish fără mandat semnat | respins BR-29 (409) |
| MLS-T02 | Publish cu mandat semnat | `cooperation_offers` open + `MLS_OFFER_PUBLISHED` |
| MLS-T03 | 2 parteneri engage concurent | optimistic lock — unul reușește, altul 409 retry |
| MLS-T04 | Deal CÂȘTIGAT cu cooperating agent | split calculat corect + `MLS_COMMISSION_SPLIT_LOGGED` (idempotent) |
| MLS-T05 | Mandat → expired | oferte open ale proprietății → withdrawn |
| MLS-T06 | Open House cu parteneri invitați | SHOWING `is_open_house=true` + calendar guard |
| MLS-T07 | Cross-tenant view `public_mls` | PII proprietar mascat |
| MLS-T08 | Rent deal split | `1 × monthly_rent × split_pct` corect |

---

## 13. Impact Assessment + Sign-off

| Dimensiune | Impact |
|---|---|
| Scoring §7 | **Zero** modificare formule; PKI alimentat de raportare (component existent BR-26) |
| Entități existente | **Zero modificare** PROPERTY/DEAL/OFFER; SHOWING +2 câmpuri additive (Open House) |
| Comision | Logică nouă de **reconciliere** (nu transfer financiar automat) — settlement off-platform |
| GDPR | PII mascat cross-tenant; split logat append-only |
| Etic | Aliniat NAR Art. 3/6/7/16 + APAIM; gate mandat (Art. 9) |
| Dependențe | mandat §17.5 (M1.S3) · OFFER chain · DEAL pipeline · pricing (commissionPct) |

**Sign-off:** Senior Solution Architect ☐ · Senior DBA ☐ · Senior Compliance Auditor ☐ · Senior QA ☐ · Senior PM ☐ (pending review M1.S4 entry).

---

*TECH_SPEC_REVYX_mls-cooperation_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
