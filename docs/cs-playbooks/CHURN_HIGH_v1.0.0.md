# CS PLAYBOOK — CHURN HIGH (P2 · 72h SLA)
<!-- CHURN_HIGH_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | CS Lead + Senior PM + Compliance | ★ Playbook inițial S9 — band HIGH (prob_30d 0.45–0.70) · referință `churn-ga` v1.0.0 §19.2 |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| Risk band | HIGH (prob_30d ∈ [0.45, 0.70)) |
| Priority | P2 |
| SLA | 72h |
| Eligibilitate CS user | Onboarding 2 săpt + shadow 5 task-uri MEDIUM |
| Obiectiv | Conversație directă · ofertă concrete · save attempt structurat |

---

## 2. Pre-contact prep (≤2h)

1. **Citește `churn_score.factors`** + istoric 30d activitate.
2. **Cross-reference:**
   - Tickets support deschise / recent CSAT
   - Billing — failed charges, downgrades
   - APS dacă agency — declin medie agenti?
   - Marketplace usage — buyer profiles inactive?
3. **Identifică decision-maker:** owner, manager senior, sau primary admin.
4. **Pregătește concession matrix** (vezi §6) — ce poți oferi fără cs_lead approval.
5. **Schedule call în 24h** — outreach inițial obligatoriu personal.

---

## 3. Touch 1 — Personal call (T0 → T+24h)

**Apel direct (preferat) către decision-maker.**

**Opening (RO):**

```
Bună {first_name}, sunt {cs_name} de la REVYX. Sun pentru a verifica dacă
totul merge bine cu platforma — am observat câteva schimbări de utilizare
și voiam să mă asigur că suntem pe aceeași pagină. Ai 15 minute acum sau
preferi mâine la oră fixă?
```

**Dacă nu răspunde la apel:** SMS imediat + email follow-up cu 3 sloturi de calendar în 48h.

---

## 4. Discovery script (15-30 min call)

### 4.1 Discovery — open & deep

| Faza | Întrebare | Obiectiv |
|---|---|---|
| Open | "Cum stăm cu REVYX după aceste luni de utilizare?" | Stabilire ton |
| Friction | "Ce 1-2 lucruri ar fi diferite dacă ai construi singur platforma?" | Identifică gap |
| Trigger event | "S-a schimbat ceva în business-ul tău în ultimele 60 zile?" | Cauza externă |
| Decision rationale | "Dacă ar trebui să decidem azi continuarea, ce ai zice?" | Direct check |
| Competitor | "Ai în minte alte instrumente?" | Concurență |
| Save signal | "Ce ar trebui să fie diferit pentru a recomanda REVYX cu încredere?" | Save lever |

### 4.2 Active listening flags

🔴 **Alarmă imediată — escaladare la cs_lead:** menționează concret "renunțare", "anulare", "competitor signed contract".
🟡 **Watchful:** "evaluăm opțiuni", "team feedback mixed".
🟢 **Recoverable:** "doar nu am avut timp", "training echipă insuficient".

---

## 5. Reason codes (extended față de MEDIUM)

| Code | Indicator |
|---|---|
| PRICE | Citează cost, buget |
| UX | Friction repetat, training fail |
| MISSING_FEATURE | Workflow gap concret |
| COMPETITOR | Numite competitor + evaluare activă |
| LOW_USAGE | <20% adoption / declin |
| LOW_VALUE_PERCEPTION | Folosesc dar nu văd ROI |
| TEAM_CHANGE | Manager nou, restructurare |
| INTEGRATION_GAP | Lipsă conectare cu unelte interne |
| OTHER | Documentează detaliat |

---

## 6. Concession matrix

| Concesia | Aprobare | Conditii |
|---|---|---|
| Training premium 1:1 (4h) | CS user single | Once-off · documentat |
| Discount 10% temporar 3 luni | CS user single | Customer history >6 luni |
| Discount 20% temporar 3 luni | cs_lead | După discovery clar PRICE |
| Multi-month freeze (subscription pause) | cs_lead | Cazuri force-majeure agency |
| Feature roadmap commitment (cu ETA) | cs_lead + Product Lead | Doar dacă deja în roadmap Q+1 |
| Custom integration scope | cs_lead + Eng Lead + Sales | RFP formal · contract addendum |
| Dedicated CSM (Premium) | cs_lead | Account >€2k MRR |
| Exec sponsor REVYX intro | cs_lead + CTO | Cazuri strategic accounts |

**Reguli:** NU oferi concesii fără reason_code clar. NICIODATĂ promitere features fără aprobare Product. NU acceptă escalări cross-tenant la pricing fără admin platform.

---

## 7. Action plan & follow-up cadence

Post-call obligatoriu:
1. **Document reason_code** în `cs_notes` (structured + narrative max 2000 chars).
2. **Action plan** cu 3-5 itemi concreți + ETA.
3. **Follow-up săptămânal 3 săpt:** check-in scurt (5-10 min sau email status).
4. **30d post-contact:** evaluează `outcome` provizoriu.
5. **90d post-contact:** retention auto-verified de cron.

---

## 8. Outcome decision tree

```
Action plan acceptat și executat 100%?
  ├─ YES + retention 30d stabilă → outcome=PREVENTED (provizoriu)
  └─ NO sau partial
     ├─ Confirma intenție anulare → outcome=NOT_PREVENTED
     ├─ Re-evaluare programată → outcome=DEFERRED
     └─ Nu răspunde follow-up 3× → outcome=UNREACHABLE

90d retention check (auto):
  ├─ Subscription active → outcome final = RETAINED
  └─ Subscription canceled → outcome final = NOT_PREVENTED (chiar dacă PREVENTED inițial)
```

---

## 9. Audit & escalare

| Trigger | Acțiune |
|---|---|
| Decision-maker menționează "competitor signed" | Escaladare cs_lead în ≤4h |
| Concesie > €1000 valoare anuală | Approval cs_lead obligatoriu |
| Account >€5k MRR | Notificare cs_lead automată la task open |
| 5 task-uri HIGH în 30 zile pentru același tenant | Escaladare auto la CRITICAL |

---

*docs/cs-playbooks/CHURN_HIGH_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
