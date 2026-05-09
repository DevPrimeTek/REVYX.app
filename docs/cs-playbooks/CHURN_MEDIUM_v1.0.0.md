# CS PLAYBOOK — CHURN MEDIUM (P3 · 7d SLA)
<!-- CHURN_MEDIUM_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | CS Lead + Senior PM | ★ Playbook inițial S9 — band MEDIUM (prob_30d 0.20–0.45) · referință `churn-ga` v1.0.0 §19.1 |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| Risk band | MEDIUM (prob_30d ∈ [0.20, 0.45)) |
| Priority | P3 |
| SLA | 168h (7 zile) |
| Eligibilitate CS user | Onboarding 1 săpt + role-play complete |
| Obiectiv | Re-engagement light · proactive check-in · feedback discovery |

---

## 2. Pre-contact prep (≤30 min)

1. **Citește `churn_score.factors`** — top 3 features cu shap value cel mai negativ.
2. **Identifică pattern dominant:**
   - `usage_drop` → low feature adoption
   - `support_tickets_recent` → frustration pending
   - `billing_issue` → friction PAY
   - `engagement_decline` → comportament natural sezonier
   - `team_member_churned` → semnal social
3. **Verifică context account:**
   - Plan curent + MRR
   - Date de pe APS dacă agency (avg agent score)
   - Ultimul login admin (>14d = warning)
4. **Selectează template** RO/RU/EN bazat pe `tenant.locale_primary`.

---

## 3. Touch 1 — Email (T0)

**Subject template:**
- RO: `{tenant_name}, hai să verificăm cum decurge cu REVYX`
- RU: `{tenant_name}, давайте проверим, как идут дела с REVYX`
- EN: `{tenant_name}, let's check in on your REVYX experience`

**Body framework (RO exemplu):**

```
Bună {first_name},

Sunt {cs_name} de la REVYX. Te contactez pentru un check-in scurt — vreau
să verific dacă platforma îți acoperă nevoile și dacă există ceva ce putem
îmbunătăți pentru echipa ta.

Am observat că în ultimele săptămâni {pattern_observation_neutral} și mă
întreb dacă pot fi util cu:
  • O sesiune scurtă de training (30 min) pentru funcționalitățile {top_features}
  • Răspuns la întrebări tehnice deschise
  • Feedback structurat pe lipsuri / friction pe care le simțiți

Ce zici de un call de 20 min săptămâna viitoare? Iată calendarul meu: {link}

Mulțumesc,
{cs_name}
```

**Reguli:**
- Tone consultativ, NU vânzător.
- NICIODATĂ menționa "churn" sau "părăsire" — focus pe valoare.
- `{pattern_observation_neutral}` mascat: NU "ai folosit mai puțin" → "echipa a avut un pattern diferit".
- Personalizare: 1-2 detalii specifice (nume, oraș, plan).

---

## 4. Touch 2 — Slack DM / LinkedIn (T+5d)

Dacă nu răspunde:

```
Salut {first_name}, am revenit cu un mesaj scurt — ai văzut email-ul de
săptămâna trecută? Sunt aici dacă există orice (chiar și 5 min) — mai bine
să prevenim decât să corectăm târziu. {cs_name}
```

LinkedIn doar dacă consent în profilul lead-ului = `LINKEDIN_OK`.

---

## 5. Discovery questions (call 20 min)

Dacă răspunde și acceptă call:

1. **Open:** "Cum ți se pare REVYX la 90+ zile? Ce funcționează bine, ce nu?"
2. **Specific friction:** "Există un pas zilnic care îți ia mai mult timp decât te aștepți?"
3. **Team adoption:** "Câți agenți din echipă folosesc activ săptămânal? Dacă <50%, de ce?"
4. **Competitor signal:** "Ați evaluat alte soluții recent?" (nu push-y, doar entry)
5. **Roadmap match:** "Ce feature ar dubla valoarea pentru voi?"
6. **Open close:** "Mai e ceva ce nu am întrebat?"

---

## 6. Outcome decision tree

```
Engagement restored (acceptă training/call/feedback)? 
  ├─ YES → outcome=PREVENTED, reason_code=identified, schedule follow-up 30d
  └─ NO
     ├─ Programează re-evaluare în 30d → outcome=DEFERRED
     └─ Nu răspunde 3 atingeri → outcome=UNREACHABLE
```

---

## 7. Reason codes

| Code | Definiție |
|---|---|
| LOW_USAGE | <30% feature adoption echipă |
| MISSING_FEATURE | Solicită funcționalitate inexistentă |
| UX | Friction repetat în UI |
| PRICE | Buget restrictiv (escalează la HIGH dacă explicit) |
| COMPETITOR | Evaluează alternative |
| TEAM_CHANGE | Schimbare manageriat / churn agenti |
| OTHER | Documentează în notes |

---

## 8. Audit & data hygiene

| Action | Audit event |
|---|---|
| Email sent | `CHURN_CS_TASK_CONTACTED` (channel=EMAIL) |
| Call held | `CHURN_CS_TASK_CONTACTED` (channel=CALL) |
| Outcome recorded | `CHURN_OUTCOME_RECORDED` |
| Notes saved | redactare PII automatic la 365d retention |

`cs_notes`: max 2000 chars · NU paste-uri din chat private · NU PII direct (preferă redactare).

---

*docs/cs-playbooks/CHURN_MEDIUM_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
