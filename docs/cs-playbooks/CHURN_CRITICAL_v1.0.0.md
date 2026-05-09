# CS PLAYBOOK — CHURN CRITICAL (P1 · 24h SLA · Escalare cs_lead)
<!-- CHURN_CRITICAL_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | CS Lead + CTO + Compliance | ★ Playbook inițial S9 — band CRITICAL (prob_30d ≥ 0.70) · escalare cs_lead obligatorie · referință `churn-ga` v1.0.0 §19.3 |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| Risk band | CRITICAL (prob_30d ≥ 0.70) |
| Priority | P1 |
| SLA contact | 24h (escaladare cs_lead în 4h de la flag) |
| Eligibilitate | **Doar cs_lead sau senior CS cu ≥6 luni vechime** |
| Obiectiv | Save attempt cu intervenție senior · concesii business · action plan executat în 7 zile |

---

## 2. Pre-contact prep (≤4h de la flag)

### 2.1 Notificare automată

La crearea task-ului CRITICAL:
1. Slack DM la `cs_lead` + `cs_user` asignat
2. Email automat la `cs_lead@revyx.app`
3. PagerDuty incident dacă >€10k MRR account

### 2.2 War-room mindset (≤4h)

- cs_lead alocă **personal** sau senior CSM dedicat (ownership clar — un singur owner).
- Verifică:
  - Stripe subscription status (any past_due signals?)
  - Tickets support open + CSAT recent
  - APS agency: declin săptămânal pe 90d
  - Communications log (orice email outreach REVYX recent)
  - Account history: deal wins, MRR trend, contract terms
- Pregătește **deck custom 5-7 slide-uri**: valoare livrată, deal-uri închise via REVYX, comparativ pre/post.

---

## 3. Touch 1 — Senior outreach (T+24h max)

### 3.1 Canal preferat

```
Call → Meeting in-person (dacă local) → Video meeting → Email cu calendar
```

### 3.2 Approach script senior CSM

**Direct, transparent, fără filtre:**

```
{first_name}, sunt {senior_name} de la REVYX. Am observat semnale puternice
că ceva nu funcționează cum te așteptai. Vreau să fim direcți unul cu altul:
ce s-a schimbat și ce putem face concret în următoarele 7 zile pentru a
restabili încrederea? Am 30 min disponibili azi sau mâine — te sun?
```

**Reguli:**
- NU defensive · NU justificare features lipsă · NU vânzare add-ons.
- Recunoaște problema înainte de a propune soluție.
- Întreabă "ce ar trebui să fie diferit pentru a continua" și ASCULTĂ.

---

## 4. Discovery deep (45-60 min)

| Faza | Obiectiv |
|---|---|
| Acknowledge | Validează nemulțumirea fără defensiveness |
| Trigger event | Identifică momentul/evenimentul declanșator |
| Stakes pentru tenant | Ce se întâmplă în business-ul lor dacă rămân/pleacă? |
| Decision criteria | Ce ar fi nevoie pentru save? |
| Timeline | Când iau decizia finală? |
| Competitive landscape | Au semnat ceva? Au în pipeline? |
| Action plan co-creat | Cu ei, nu pentru ei |

---

## 5. Concession matrix CRITICAL

| Concesie | Aprobare necesară | Note |
|---|---|---|
| Discount 30% temporar 6 luni | cs_lead | Documentat reason_code |
| Multi-month freeze (3-6 luni) | cs_lead + Billing | Subscription pause în Stripe |
| Custom contract (annual prepay cu discount) | cs_lead + CTO + Legal | RFP intern |
| Custom integration / dedicated dev | cs_lead + Eng Lead + CTO | Scope + ETA explicit |
| Exec sponsor 1:1 (CTO/CEO call) | cs_lead + exec | Strategic accounts only |
| Roadmap commitment formal (SLA features) | cs_lead + Product Lead | Contract amendment |
| Account credit (compensare incident) | cs_lead + Billing | Cazuri unde incident REVYX a contribuit |
| Tier downgrade fără penalty | cs_lead | Dacă sustainable la lower tier |
| Co-marketing / case study în schimbul retenției | cs_lead + Marketing | Win-win |

**Veto:**
- NICIODATĂ pricing sub costul nostru variabil per-seat (CTO check).
- NICIODATĂ commitments features cu ETA <Q+1 fără Product Lead semn.
- NU compensare cu data acces extra-tenant (RBAC inviolabil).

---

## 6. Action plan execution (7 zile)

| Day | Action |
|---|---|
| D0 | Call held + action plan documentat (3-5 items, owner + ETA) |
| D1 | Confirm acceptance via email (signed-off action plan) |
| D2 | Kickoff first item (training session / config / etc.) |
| D3 | Status check 15 min |
| D5 | Status check 15 min |
| D7 | Recap meeting — adjust dacă necesar |

cs_lead primește status update săptămânal pentru 30 zile post-D7.

---

## 7. Reason codes detailed

CRITICAL adaugă față de HIGH:

| Code | Indicator concret |
|---|---|
| OUTAGE_TRUST_LOST | Incident REVYX recent fără response adequate |
| BILLING_DISPUTE | Charge contestat fără rezoluție |
| DATA_LOSS_CONCERN | Probleme percepute privind data integrity |
| LEGAL_COMPLIANCE | GDPR/Legea concerns ridicate |
| KEY_PERSON_LEAVING | Sponsor intern pleacă din agency |
| ACQUISITION | Agency acquisitionată / merger |
| MARKET_DOWNTURN | Macro factors business |

---

## 8. Outcome decision tree

```
Action plan signed-off în 24h post-call?
  ├─ NO → outcome=NOT_PREVENTED · close task · notify cs_lead
  └─ YES
     ├─ Action items 100% executate în 7d?
     │   ├─ YES → outcome=PREVENTED (provizoriu)
     │   └─ NO partial → outcome=DEFERRED · re-evaluare în 14d
     └─ 90d retention check auto:
         ├─ Active → outcome final = RETAINED ★ (success)
         └─ Canceled → outcome final = NOT_PREVENTED · post-mortem cs_lead
```

---

## 9. Post-mortem obligatoriu

**Dacă outcome final = NOT_PREVENTED sau LOST:**
- Post-mortem 30 min cu cs_lead + cs_user + Product (dacă feature gap) + Eng (dacă incident).
- Document `lessons_learned` în Notion runbook.
- Update playbook dacă pattern nou descoperit.

---

## 10. Privacy & compliance

| Aspect | Regulă |
|---|---|
| `cs_notes` CRITICAL | Acces strict cs_lead + cs_user assigned + DPO la cerere |
| Comm log | Audit `CHURN_CS_TASK_CONTACTED` per fiecare touch |
| Concesii financiare | AUDIT_LOG event nou `CHURN_CONCESSION_GRANTED` (cu valoare + reason) |
| Date PII din cs_notes | Redactate la 365d retention |
| Extern share post-mortem | Anonimizat înainte de share inter-departamental |

---

*docs/cs-playbooks/CHURN_CRITICAL_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
