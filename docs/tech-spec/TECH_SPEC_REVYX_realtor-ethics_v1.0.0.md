# TECH SPEC — Realtor Ethics Framework (NAR / APAIM)
<!-- TECH_SPEC_REVYX_realtor-ethics_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Macro-milestone **M1 — MVP Funcțional** / sub-stages **M1.S3** (4 checkpoint-uri originale + entitate) + **M1.S4** (2 checkpoint-uri noi dependente de `buyer_assessments` + `overpricing_risk`). Operaționalizează BR-28 (Ethics Checkpoints) extins de la 4 la 6 trigger-uri + mapping complet NAR Code of Ethics (17 articole) și APAIM ↔ mecanisme REVYX.

**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §5.2 (M1.S3/M1.S4).
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.15.md` §4.4 AGI Layer (T-AGI-04 + T-ETH-XX).
**BRD ref:** `BRD_REVYX_v1.4.0.md` §6.5 (BR-28), §8.5 (`ethics_checkpoints`), §18.4 (AGI-04 + mapping NAR/APAIM).
**Audit-log ref:** `TECH_SPEC_REVYX_audit-log_v1.1.1.md` §6 append-only enforcement.

## 0.1 Platform Matrix

| Surface | Scope | Notă |
|---|---|---|
| 🔧 Backend API | ✅ primary | Trigger generation + append-only persist + AUDIT_LOG events |
| 🌐 Web | 🔁 consumer | Soft-prompt modal non-blocant pe lead/property/deal detail |
| 📱 Mobile | 🔁 consumer | Aceleași prompt-uri pe acțiunile in-field (M2.S3) |

Per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` — etica este **🔁 BOTH** (prompt-uri unde apare acțiunea cu risc etic), backend single source.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| **1.0.0** | **2026-06** | SECURITY (P) + ARCHITECT (P) + Senior Compliance Auditor (S) + BACKEND DEV (S) + DOC + Senior PM | ★ Initial — Framework etic REVYX bazat pe NAR Code of Ethics (17 articole / 3 categorii) + APAIM (asociația profesională RM). Sursă: NAR.realtor + APAIM.md + documentele de teren (metodologie profesională Riѐltor — misiunea „a reaprinde încrederea în serviciul profesional imobiliar"). Acoperă: §3 cele 3 categorii NAR + APAIM; §4 mapping complet 17 articole ↔ mecanisme REVYX; §5 entitatea `ethics_checkpoints` + 6 trigger-uri; §6 API; §7 append-only enforcement; §8 AUDIT_LOG events; §9 RBAC; §10 misiune „încredere" + disclosure; §11 test plan; §12 impact assessment + sign-off. |

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Context: NAR, APAIM și piața RM](#2-context-nar-apaim-și-piața-rm)
3. [Cele 3 categorii de datorii etice](#3-cele-3-categorii-de-datorii-etice)
4. [Mapping NAR 17 articole ↔ REVYX](#4-mapping-nar-17-articole--revyx)
5. [Entitatea `ethics_checkpoints` + 6 trigger-uri](#5-entitatea-ethics_checkpoints--6-trigger-uri)
6. [API Contracts](#6-api-contracts)
7. [Append-only enforcement](#7-append-only-enforcement)
8. [AUDIT_LOG events](#8-audit_log-events)
9. [RBAC](#9-rbac)
10. [Misiunea „încredere" + disclosure proactiv](#10-misiunea-încredere--disclosure-proactiv)
11. [Test Plan](#11-test-plan)
12. [Impact Assessment + Sign-off](#12-impact-assessment--sign-off)

---

## 1. Executive Summary

REVYX are conformitate **internă** (AUDIT_LOG append-only, RBAC, GDPR) dar nu avea un strat de **ghidare etică profesională proactivă** la momentele de decizie ale agentului. Acest spec operaționalizează etica profesională imobiliară așa cum este definită de:

- **NAR Code of Ethics** — 17 articole, 3 categorii (Datorii față de Clienți & Customers · față de Public · față de Colegi).
- **APAIM** — Asociația Profesională a Agenților Imobiliari din Moldova (fondată 2017, **modelată după NAR**; membrii obțin statut REALTOR® și adoptă Codul NAR). Valori centrale: **reprezentare exclusivă** · **cooperare între membri** · **loialitate totală** · **transparență completă**.
- **Misiunea de teren** (din metodologia profesională): „a reaprinde încrederea în serviciul profesional al Riѐltor-ului" — etica nu e „nu face rău", ci conduită proactivă (disclosure, gestionare conflict de interes, reprezentare corectă).

**Principiu de design (GDPR Art. 22):** toate mecanismele etice sunt **soft-prompt non-blocante** + **human-in-the-loop**. Sistemul informează și loghează; **nu decide automat** și **nu blochează** operația agentului.

---

## 2. Context: NAR, APAIM și piața RM

| Aspect | NAR (SUA) | APAIM (Moldova) |
|---|---|---|
| Fondare | 1908 (Code 1913) | 2017 |
| Cod de Etică | 17 articole / 3 categorii | adoptă Codul NAR (membru = REALTOR®) |
| Metodă de lucru promovată | reprezentare exclusivă + MLS | reprezentare exclusivă (mandat) + cooperare între membri |
| Obligație formare | Code of Ethics training periodic | curs inițiere + curs anual Statut + Reguli + Cod Etică |
| Aplicare în REVYX | mapping §4 | mandat §17.5 + MLS §18.10 + checkpoints §5 |

> **Notă scope:** REVYX nu este organism de certificare. Sistemul **asistă** conformitatea etică a agentului cu standardele asociației de care aparține (NAR/APAIM), fără a se substitui proceselor disciplinare ale acestora (NAR Art. 14/17 — investigații/arbitraj rămân la asociație).

---

## 3. Cele 3 categorii de datorii etice

```
NAR Code of Ethics
├── Datorii față de Clienți & Customers (Art. 1–9)
│     prioritatea interesului clientului · fără denaturare · cooperare · disclosure interes · documentare scrisă
├── Datorii față de Public (Art. 10–14)
│     non-discriminare · competență · reclamă adevărată · legalitate · cooperare la investigații
└── Datorii față de Colegi REALTORS® (Art. 15–17)
      fără afirmații false despre colegi · respectarea mandatelor exclusive · arbitraj dispute
```

---

## 4. Mapping NAR 17 articole ↔ REVYX

> Mapping autoritativ. Coloana „Mecanism REVYX" indică unde anume în platformă este operaționalizată (sau urmărită) datoria etică. „—" = datorie predominant culturală/disciplinară, fără mecanism software dedicat (rămâne la asociație).

### 4.1 Datorii față de Clienți & Customers

| Art. | Datorie | Mecanism REVYX |
|---|---|---|
| **1** | Protejează și promovează interesul clientului; tratează toate părțile onest | BR-01 Lead Firewall · Ethics `dual_representation` + `competing_offers` + `financing_gap` · fiduciary loyalty în mandat exclusiv (MLS §18.10) |
| **2** | Evită denaturarea, exagerarea, ascunderea faptelor materiale despre proprietate | Ethics `property_disclosure` · BR-30 Listing Price Discipline (`overpricing_risk`) · câmpuri defecte cunoscute pe PROPERTY |
| **3** | **Cooperează** cu alți agenți când e în interesul clientului | ★ MLS / Cooperation `cooperation_offers` (BR-29) — commission-sharing opt-in |
| **4** | Disclosure dacă agentul cumpără/vinde pentru interes propriu | Ethics `dual_representation` (extins logic la self-interest) |
| **5** | Nu oferă servicii profesionale pe o proprietate în care are interes fără disclosure | Ethics `dual_representation` + flag interes pe DEAL |
| **6** | Fără comisioane/rebate nedezvăluite; transparență recomandări | OFFER chain scrisă · commission split logat append-only (MLS) |
| **7** | Comision de la mai multe părți doar cu disclosure + consimțământ | Ethics `dual_representation` + `cooperation_offers.offered_split_pct` documentat |
| **8** | Păstrează fondurile clienților separate | — (proces contabil tenant; out of software scope) |
| **9** | Asigură că documentele/acordurile sunt în scris și clare | OFFER scrisă (оферта) · mandat semnat (`mandate_status`) · raportare scrisă periodică (MLS §18.10) |

### 4.2 Datorii față de Public

| Art. | Datorie | Mecanism REVYX |
|---|---|---|
| **10** | Non-discriminare în furnizarea serviciilor | RBAC + GDPR · marketplace PII-masked · fără filtrare pe criterii protejate |
| **11** | Servicii doar în limita competenței profesionale | Execution Guides (§18.3) — agentul are scripturi, nu improvizează |
| **12** | **Reclamă adevărată și neînșelătoare** | ★ Ethics `misleading_advertising` (nou) · BR-30 `overpricing_risk` · fotografii reale obligatorii |
| **13** | Nu practică drept/altă profesie fără licență; respectă legea | AUDIT_LOG legalitate · cross-ref legal RM (Legea 133/2011) |
| **14** | Cooperează la investigații/proceduri ale asociației | `ethics_checkpoints` append-only (probă) · AUDIT_LOG read-only export |

### 4.3 Datorii față de Colegi REALTORS®

| Art. | Datorie | Mecanism REVYX |
|---|---|---|
| **15** | Fără afirmații false/înșelătoare despre alți profesioniști | — (cultural; tracking AUDIT_LOG la nevoie) |
| **16** | **Nu solicita clienți aflați sub un acord exclusiv cu alt agent** | ★ Ethics `exclusive_listing_solicitation` (nou) · câmp `buyer_assessments.prior_agent_agreement` |
| **17** | Arbitraj pentru dispute între REALTORS® | escalation §6 BRD · manager override · `ethics_checkpoints` ca dovadă |

---

## 5. Entitatea `ethics_checkpoints` + 6 trigger-uri

### 5.1 Schema (extinde BRD §8.5)

```sql
CREATE TABLE ethics_checkpoints (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id),
  trigger_context   TEXT NOT NULL CHECK (trigger_context IN (
                      'dual_representation','competing_offers','property_disclosure',
                      'financing_gap','exclusive_listing_solicitation','misleading_advertising')),
  nar_article       TEXT NULL,                 -- 'Art.1' .. 'Art.16'
  prompt_text       TEXT NOT NULL,             -- localizabil (RO/RU/EN) la render
  is_acknowledged   BOOLEAN NOT NULL DEFAULT false,
  acknowledged_at   TIMESTAMPTZ NULL,
  acknowledged_by   UUID NULL REFERENCES users(id),
  deal_id           UUID NULL REFERENCES deals(id),
  lead_id           UUID NULL REFERENCES leads(id),
  property_id       UUID NULL REFERENCES properties(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ethics_tenant_created ON ethics_checkpoints (tenant_id, created_at DESC);
CREATE INDEX idx_ethics_unack ON ethics_checkpoints (tenant_id) WHERE is_acknowledged = false;
```

### 5.2 Cele 6 trigger-uri

| # | `trigger_context` | NAR | Condiție de declanșare | Prompt (RO) |
|---|---|---|---|---|
| 1 | `dual_representation` | Art. 1 | Agent = reprezentant al ambelor părți pe un deal (sau interes personal) | „Reprezentare dublă — ai informat în scris ambele părți și ai obținut consimțământul explicit?" |
| 2 | `competing_offers` | Art. 1 | ≥ 2 OFFER active pe aceeași proprietate | „Există oferte concurente. Clientul tău știe? Ești obligat să informezi corect ambele părți." |
| 3 | `property_disclosure` | Art. 2 | Prima listare a unei proprietăți (`SHOWCASE_PUBLISH`) | „Ai comunicat toate defectele cunoscute? Disclosure obligatoriu per Cod Etic." |
| 4 | `financing_gap` | Art. 1 | `confirmed_budget_eur < declared_budget_eur × 0.75` (BR-25) | „Discrepanță buget declarat vs confirmat. Ai clarificat realitatea financiară cu clientul?" |
| 5 | ★ `exclusive_listing_solicitation` | Art. 16 | `buyer_assessments.prior_agent_agreement IS NOT NULL` la prima asignare agent | „Clientul are deja un contract cu alt agent. NAR Art. 16: nu solicita clienți sub mandat exclusiv altul. Ai verificat statusul?" |
| 6 | ★ `misleading_advertising` | Art. 12 | `overpricing_risk = true` (BR-30) SAU listare fără fotografii reale | „NAR Art. 12: reclama trebuie să fie adevărată. Prețul/descrierea reflectă realitatea + analiza de piață?" |

### 5.3 Generare (service layer, pseudo-cod)

```typescript
// La evenimentul de business (ex: OFFER created, SHOWCASE_PUBLISH, agent assign)
async function maybeRaiseEthicsCheckpoint(ctx: BusinessEvent) {
  const trigger = detectTrigger(ctx);           // pure function, vezi §5.2
  if (!trigger) return;
  const cp = await db.insert(ethicsCheckpoints).values({
    tenantId: ctx.tenantId, triggerContext: trigger.key, narArticle: trigger.narArticle,
    promptText: i18n(trigger.key, ctx.locale),
    dealId: ctx.dealId, leadId: ctx.leadId, propertyId: ctx.propertyId,
  });
  await audit.log('ETHICS_CHECKPOINT_TRIGGERED', { severity: 'INFO', checkpointId: cp.id, trigger: trigger.key });
  // UI primește soft-prompt non-blocant; operația NU se blochează (return imediat)
}
```

---

## 6. API Contracts

| Metodă | Endpoint | Rol | Descriere |
|---|---|---|---|
| `GET` | `/ethics/checkpoints?status=unack` | agent (own) / manager (team) | Listă checkpoint-uri (filtrabil) |
| `POST` | `/ethics/checkpoints/:id/acknowledge` | agent | `is_acknowledged=true` + `acknowledged_at` + `acknowledged_by`; idempotent |
| `GET` | `/ethics/report?period=month` | manager / admin | Raport ack-rate + lista neacknowledge (proxy conformitate) |

- `acknowledge` este **singura** mutație permisă (vezi §7) — niciun UPDATE pe `trigger_context` / `prompt_text` / FK-uri.
- Neacknowledgement **nu** blochează nicio operație downstream (AC-AGI-04).

---

## 7. Append-only enforcement

Identic ca AUDIT_LOG (`audit-log` v1.1.1 §6):

```sql
-- Permite DOAR tranziția is_acknowledged false→true (+ timestamp/by); blochează orice altă modificare + DELETE
CREATE OR REPLACE FUNCTION ethics_checkpoint_guard() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'ethics_checkpoints is append-only'; END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.is_acknowledged = true THEN RAISE EXCEPTION 'checkpoint already acknowledged — immutable'; END IF;
    IF NEW.trigger_context <> OLD.trigger_context OR NEW.prompt_text <> OLD.prompt_text
       OR NEW.tenant_id <> OLD.tenant_id OR NEW.created_at <> OLD.created_at THEN
      RAISE EXCEPTION 'only acknowledgement fields are mutable';
    END IF;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ethics_guard BEFORE UPDATE OR DELETE ON ethics_checkpoints
  FOR EACH ROW EXECUTE FUNCTION ethics_checkpoint_guard();
-- + REVOKE DELETE ON ethics_checkpoints FROM revyx_app;
```

---

## 8. AUDIT_LOG events

| Event | Severity | Payload |
|---|---|---|
| `ETHICS_CHECKPOINT_TRIGGERED` | INFO | checkpoint_id · trigger_context · nar_article · agent_id · {deal/lead/property}_id |
| `ETHICS_CHECKPOINT_ACKNOWLEDGED` | LOW | checkpoint_id · acknowledged_by · latency_seconds |

> Catalogare: a se adăuga în `TECH_SPEC_REVYX_audit-log` §4.x la implementare M1.S3 (Regula 4 step 5).

---

## 9. RBAC

| Acțiune | agent | senior_agent | team_lead | manager | admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Vezi checkpoint-uri proprii | ✅ | ✅ | ✅ | ✅ | ✅ |
| Acknowledge propriu | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vezi checkpoint-uri echipă | ❌ | ❌ | echipa sa | ✅ | ✅ |
| Raport ack-rate lunar | ❌ | ❌ | echipa sa | ✅ | ✅ |
| Edit prompt-uri per tenant | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 10. Misiunea „încredere" + disclosure proactiv

Din metodologia de teren, misiunea profesională centrală: **„a reaprinde încrederea în serviciul profesional al Riѐltor-ului"**. Operaționalizare REVYX (non-blocant, educativ):

- **Disclosure proactiv** (Art. 2/12): la prima listare → prompt defecte + verificare fotografii reale + ACM justificat (anti-„хотелка").
- **Transparență comision** (Art. 6/7): în MLS, `offered_split_pct` documentat; cumpărătorul direct e informat că nu plătește comision agentului listării (comision plătit de proprietar prin mandat).
- **Reprezentare exclusivă onestă** (Art. 1): mandatul nu limitează dreptul proprietarului de a decide prețul final; agentul lucrează **pe maximizarea prețului în interesul proprietarului**, nu pe „a-i plăcea cumpărătorului".
- **Respectarea colegilor** (Art. 16): câmp `prior_agent_agreement` + checkpoint la solicitarea unui client deja sub mandat.

Aceste mesaje sunt servite ca **Execution Guides** etice (§18.3) — agentul are scriptul corect la momentul potrivit, ridicând calitatea și încrederea fără a bloca fluxul.

---

## 11. Test Plan

| ID | Test | Așteptat |
|---|---|---|
| ETH-T01 | OFFER #2 pe aceeași proprietate | `competing_offers` checkpoint generat + AUDIT event |
| ETH-T02 | `SHOWCASE_PUBLISH` proprietate nouă | `property_disclosure` generat |
| ETH-T03 | `confirmed_budget < declared × 0.75` | `financing_gap` generat |
| ETH-T04 | Asignare agent pe lead cu `prior_agent_agreement` setat | `exclusive_listing_solicitation` (Art.16) generat |
| ETH-T05 | Listare cu `overpricing_risk=true` | `misleading_advertising` (Art.12) generat |
| ETH-T06 | Acknowledge checkpoint | `is_acknowledged=true` + immutable după (trigger blochează re-update) |
| ETH-T07 | Neacknowledge | operația downstream NU se blochează (AC-AGI-04) |
| ETH-T08 | DELETE/UPDATE pe câmp non-ack | excepție BD (append-only) |

---

## 12. Impact Assessment + Sign-off

| Dimensiune | Impact |
|---|---|
| Scoring §7 | **Zero** — etica nu modifică nicio formulă (soft layer) |
| Entități existente | **Zero modificare** — `ethics_checkpoints` extins additive (2 enum + `nar_article` + `property_id`) |
| GDPR | Art. 22 respectat — niciun decizionalism automat; append-only = probă conformitate |
| Backwards compat | Cele 4 checkpoint-uri v1.3.0 INTACTE; 2 noi additive |
| Dependențe | M1.S4: `buyer_assessments` (§18.9) + `overpricing_risk` (§18.11) |

**Sign-off:** Senior Solution Architect ☐ · Senior Security Auditor ☐ · Senior Compliance Auditor ☐ · Senior QA ☐ · Senior PM ☐ (pending review M1.S3 entry).

---

*TECH_SPEC_REVYX_realtor-ethics_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
