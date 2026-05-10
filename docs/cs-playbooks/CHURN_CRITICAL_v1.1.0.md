# CS PLAYBOOK — CHURN CRITICAL (P1 · 24h SLA · Escalare cs_lead) — RO + RU + EN
<!-- CHURN_CRITICAL_v1.1.0.md · v1.1.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | CS Lead + CTO + Compliance | Playbook inițial S9 — band CRITICAL (prob_30d ≥ 0.70) · escalare cs_lead obligatorie · referință `churn-ga` v1.0.0 §19.3 (RO templates) |
| 1.1.0 | 2026-05 | CS Lead + CTO + Compliance + CS RU + CS EN | ★ Closes F-S10-06 MED (AUDIT_REVYX_s10-external-pass v1.0.0) — adăugare templates RU + EN paralele cu cele RO existente · §3.2 senior approach script tradus · §4 discovery deep tri-lingvistic · §5 concession matrix labels traduse · §7 reason codes detailed cu coloane RO/RU/EN · zero schimbări la conținut RO · cross-ref `churn-ga` v1.0.1 |

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

(Identic cu v1.0.0 §2.)

### 2.1 Notificare automată

La crearea task-ului CRITICAL:
1. Slack DM la `cs_lead` + `cs_user` asignat
2. Email automat la `cs_lead@revyx.app`
3. PagerDuty incident dacă >€10k MRR account

### 2.2 War-room mindset (≤4h)

- cs_lead alocă **personal** sau senior CSM dedicat (ownership clar — un singur owner).
- Verifică: Stripe subscription · Tickets + CSAT · APS agency declin 90d · Communications log · Account history.
- Pregătește **deck custom 5-7 slide-uri**: valoare livrată, deal-uri închise via REVYX, comparativ pre/post.

---

## 3. Touch 1 — Senior outreach (T+24h max)

### 3.1 Canal preferat (universal)

```
Call → Meeting in-person (dacă local) → Video meeting → Email cu calendar
```

### 3.2 Approach script senior CSM — RO (v1.0.0)

```
{first_name}, sunt {senior_name} de la REVYX. Am observat semnale puternice
că ceva nu funcționează cum te așteptai. Vreau să fim direcți unul cu altul:
ce s-a schimbat și ce putem face concret în următoarele 7 zile pentru a
restabili încrederea? Am 30 min disponibili azi sau mâine — te sun?
```

### 3.3 ★ Approach script senior CSM — RU (NEW v1.1.0)

```
{first_name}, я {senior_name} из REVYX. Я заметил серьёзные сигналы того,
что что-то идёт не так, как вы ожидали. Хочу, чтобы мы были откровенны
друг с другом: что изменилось и что мы можем конкретно сделать за
следующие 7 дней, чтобы восстановить доверие? У меня есть 30 минут
сегодня или завтра — могу позвонить?
```

### 3.4 ★ Approach script senior CSM — EN (NEW v1.1.0)

```
{first_name}, this is {senior_name} from REVYX. I've seen strong signals
that something isn't working the way you expected. I want us to be direct
with each other: what's changed, and what concrete things can we do over
the next 7 days to rebuild trust? I have 30 minutes available today or
tomorrow — can I call you?
```

### 3.5 Reguli universale (toate limbile)

- NU defensive · NU justificare features lipsă · NU vânzare add-ons.
- Recunoaște problema înainte de a propune soluție.
- Întreabă "ce ar trebui să fie diferit pentru a continua" / "что должно быть иначе" / "what would need to be different" și ASCULTĂ.

---

## 4. Discovery deep (45-60 min) — tri-lingvistic

| Faza | Obiectiv | RO | RU | EN |
|---|---|---|---|---|
| Acknowledge | Validează nemulțumirea fără defensiveness | "Înțeleg frustrarea ta. Ce a fost cel mai dificil?" | "Я понимаю ваше разочарование. Что было сложнее всего?" | "I understand your frustration. What's been hardest?" |
| Trigger event | Identifică momentul declanșator | "Ce moment exact ți-a schimbat percepția?" | "Какой именно момент изменил ваше восприятие?" | "What specific moment changed your perception?" |
| Stakes pentru tenant | Ce se întâmplă în business-ul lor? | "Cum afectează situația actuală obiectivele voastre 2026?" | "Как текущая ситуация влияет на ваши цели на 2026?" | "How does this affect your 2026 goals?" |
| Decision criteria | Ce ar fi nevoie pentru save? | "Spune-mi explicit: ce trebuie să se întâmple pentru a continua?" | "Скажите прямо: что должно произойти, чтобы продолжить?" | "Tell me directly: what needs to happen to continue?" |
| Timeline | Când iau decizia finală? | "Ai un termen limită intern pentru această decizie?" | "Есть ли у вас внутренний дедлайн для этого решения?" | "Do you have an internal deadline for this decision?" |
| Competitive landscape | Au semnat? Au pipeline? | "Există un alt furnizor în discuție?" | "Рассматриваете ли другого поставщика?" | "Is there another vendor in discussion?" |
| Action plan co-creat | Cu ei, nu pentru ei | "Hai să schițăm împreună 3 pași concreți pentru următoarele 7 zile." | "Давайте вместе наметим 3 конкретных шага на следующие 7 дней." | "Let's draft 3 concrete steps together for the next 7 days." |

---

## 5. Concession matrix CRITICAL

| Concesie (EN canonical) | RO | RU | Aprobare | Note |
|---|---|---|---|---|
| Discount 30% temporary 6mo | Discount 30% temporar 6 luni | Скидка 30% временно на 6 месяцев | cs_lead | Documentat reason_code |
| Multi-month freeze (3-6mo) | Multi-month freeze (3-6 luni) | Заморозка на 3-6 месяцев | cs_lead + Billing | Subscription pause în Stripe |
| Custom contract (annual prepay + discount) | Custom contract (annual prepay cu discount) | Кастомный контракт (годовая предоплата со скидкой) | cs_lead + CTO + Legal | RFP intern |
| Custom integration / dedicated dev | Custom integration / dedicated dev | Кастомная интеграция / выделенный разработчик | cs_lead + Eng Lead + CTO | Scope + ETA explicit |
| Exec sponsor 1:1 (CTO/CEO call) | Exec sponsor 1:1 (CTO/CEO call) | Звонок 1:1 с CTO/CEO | cs_lead + exec | Strategic accounts only |
| Roadmap commitment formal (SLA features) | Roadmap commitment formal (SLA features) | Формальное обязательство по roadmap (SLA features) | cs_lead + Product Lead | Contract amendment |
| Account credit (incident compensation) | Credit cont (compensare incident) | Кредит на аккаунт (компенсация инцидента) | cs_lead + Billing | Cazuri unde incident REVYX a contribuit |
| Tier downgrade fără penalty | Tier downgrade fără penalty | Понижение тира без штрафа | cs_lead | Dacă sustainable la lower tier |
| Co-marketing / case study | Co-marketing / case study | Co-маркетинг / case study | cs_lead + Marketing | Win-win |

**Veto (universal):**
- NICIODATĂ pricing sub costul nostru variabil per-seat (CTO check).
- NICIODATĂ commitments features cu ETA <Q+1 fără Product Lead semn.
- NU compensare cu data acces extra-tenant (RBAC inviolabil).

---

## 6. Action plan execution (7 zile)

(Identic cu v1.0.0 §6.)

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

## 7. Reason codes detailed (CRITICAL — extended față de HIGH)

| Code | RO | RU | EN |
|---|---|---|---|
| OUTAGE_TRUST_LOST | Incident REVYX recent fără response adequate | Недавний инцидент REVYX без адекватного ответа | Recent REVYX incident without adequate response |
| BILLING_DISPUTE | Charge contestat fără rezoluție | Спор о платеже без решения | Disputed charge without resolution |
| DATA_LOSS_CONCERN | Probleme percepute privind data integrity | Воспринимаемые проблемы целостности данных | Perceived data integrity concerns |
| LEGAL_COMPLIANCE | GDPR / Legea concerns ridicate | GDPR / законодательные опасения | GDPR / regulatory concerns raised |
| KEY_PERSON_LEAVING | Sponsor intern pleacă din agency | Внутренний спонсор покидает агентство | Internal champion leaving agency |
| ACQUISITION | Agency acquisitionată / merger | Агентство приобретено / слияние | Agency acquired / merged |
| MARKET_DOWNTURN | Macro factors business | Макроэкономические факторы | Macroeconomic factors |

---

## 8. Outcome decision tree

(Identic cu v1.0.0 §8.)

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

(Identic cu v1.0.0 §9.)

**Dacă outcome final = NOT_PREVENTED sau LOST:**
- Post-mortem 30 min cu cs_lead + cs_user + Product (dacă feature gap) + Eng (dacă incident).
- Document `lessons_learned` în Notion runbook.
- Update playbook dacă pattern nou descoperit.

---

## 10. Privacy & compliance

(Identic cu v1.0.0 §10.)

| Aspect | Regulă |
|---|---|
| `cs_notes` CRITICAL | Acces strict cs_lead + cs_user assigned + DPO la cerere |
| Comm log | Audit `CHURN_CS_TASK_CONTACTED` per fiecare touch |
| Concesii financiare | AUDIT_LOG event nou `CHURN_CONCESSION_GRANTED` (cu valoare + reason) — propunere `audit-log` v1.1.1 |
| Date PII din cs_notes | Redactate la 365d retention |
| Extern share post-mortem | Anonimizat înainte de share inter-departamental |

---

## 11. Cross-references

- `churn-ga` v1.0.1 §19.3 — playbook CRITICAL canonical reference
- `audit-log` v1.1.0 §4.4.5 — events catalog `CHURN_*`
- `tenancy-roles-extension` v1.1.0 §6.5 — `cs_user`/`cs_lead` permissions
- `DPIA_REVYX_phase5` v1.0.0 §5.1 — churn-ga risk register
- `RUNBOOK_REVYX_incident-response` v1.0.0 — INC_DECLARED P1 escalation pentru >€10k MRR
- `CHURN_MEDIUM` v1.1.0 + `CHURN_HIGH` v1.1.0 — escalation paths

---

*docs/cs-playbooks/CHURN_CRITICAL_v1.1.0.md · v1.1.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
