# CS PLAYBOOK — CHURN HIGH (P2 · 72h SLA) — RO + RU + EN
<!-- CHURN_HIGH_v1.1.0.md · v1.1.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | CS Lead + Senior PM + Compliance | Playbook inițial S9 — band HIGH (prob_30d 0.45–0.70) · referință `churn-ga` v1.0.0 §19.2 (RO templates) |
| 1.1.0 | 2026-05 | CS Lead + Senior PM + CS RU + CS EN | ★ Closes F-S10-06 MED (AUDIT_REVYX_s10-external-pass v1.0.0) — adăugare templates RU + EN paralele cu cele RO existente · §3 opening script tradus · §4.1 discovery table tri-lingvistic · §5 reason codes tri-lingvistic · §6 concession matrix labels traduse · zero schimbări la conținut RO · cross-ref `churn-ga` v1.0.1 |

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

(Identic cu v1.0.0 §2.)

1. Citește `churn_score.factors` + istoric 30d activitate.
2. Cross-reference: tickets, billing, APS, marketplace usage.
3. Identifică decision-maker: owner, manager senior, sau primary admin.
4. Pregătește concession matrix (vezi §6).
5. Schedule call în 24h — outreach inițial obligatoriu personal.

---

## 3. Touch 1 — Personal call (T0 → T+24h)

**Apel direct (preferat) către decision-maker.**

### 3.1 Opening (RO) — v1.0.0

```
Bună {first_name}, sunt {cs_name} de la REVYX. Sun pentru a verifica dacă
totul merge bine cu platforma — am observat câteva schimbări de utilizare
și voiam să mă asigur că suntem pe aceeași pagină. Ai 15 minute acum sau
preferi mâine la oră fixă?
```

### 3.2 ★ Opening (RU) — NEW v1.1.0

```
Здравствуйте, {first_name}, я {cs_name} из REVYX. Звоню, чтобы убедиться,
что всё в порядке с платформой — заметил несколько изменений в
использовании и хотел убедиться, что мы на одной волне. У вас есть 15
минут сейчас или предпочитаете завтра в фиксированное время?
```

### 3.3 ★ Opening (EN) — NEW v1.1.0

```
Hi {first_name}, this is {cs_name} from REVYX. I'm calling to check that
everything is going well with the platform — I noticed some usage changes
and wanted to make sure we're on the same page. Do you have 15 minutes now
or would you prefer a fixed time tomorrow?
```

### 3.4 Fallback escalation (toate limbile)

**Dacă nu răspunde la apel:** SMS imediat + email follow-up cu 3 sloturi de calendar în 48h. Folosește limba conform `tenant.locale_primary`.

---

## 4. Discovery script (15-30 min call)

### 4.1 Discovery — open & deep — tri-lingvistic

| Faza | RO | RU | EN | Obiectiv |
|---|---|---|---|---|
| Open | "Cum stăm cu REVYX după aceste luni de utilizare?" | "Как обстоят дела с REVYX за эти месяцы использования?" | "How are things with REVYX after these months?" | Stabilire ton |
| Friction | "Ce 1-2 lucruri ar fi diferite dacă ai construi singur platforma?" | "Что 1-2 вещи вы бы сделали иначе, если бы строили платформу сами?" | "What 1-2 things would be different if you built the platform yourself?" | Identifică gap |
| Trigger event | "S-a schimbat ceva în business-ul tău în ultimele 60 zile?" | "Что-то изменилось в вашем бизнесе за последние 60 дней?" | "Has anything changed in your business in the last 60 days?" | Cauza externă |
| Decision rationale | "Dacă ar trebui să decidem azi continuarea, ce ai zice?" | "Если бы мы должны были решить сегодня о продолжении, что бы вы сказали?" | "If we had to decide on continuing today, what would you say?" | Direct check |
| Competitor | "Ai în minte alte instrumente?" | "Рассматриваете ли другие инструменты?" | "Do you have any other tools in mind?" | Concurență |
| Save signal | "Ce ar trebui să fie diferit pentru a recomanda REVYX cu încredere?" | "Что должно быть иначе, чтобы рекомендовать REVYX с уверенностью?" | "What would need to be different for you to confidently recommend REVYX?" | Save lever |

### 4.2 Active listening flags (universal — color coding)

🔴 **Alarmă imediată** — escaladare la cs_lead:
- RO: "renunțare", "anulare", "competitor signed contract"
- RU: "отказ", "отмена", "конкурент подписал контракт"
- EN: "leaving", "canceling", "competitor signed contract"

🟡 **Watchful:**
- RO: "evaluăm opțiuni", "team feedback mixed"
- RU: "оцениваем варианты", "смешанные отзывы команды"
- EN: "evaluating options", "team feedback mixed"

🟢 **Recoverable:**
- RO: "doar nu am avut timp", "training echipă insuficient"
- RU: "просто не было времени", "недостаточно тренинга"
- EN: "just didn't have time", "insufficient team training"

---

## 5. Reason codes (extended)

| Code | RO | RU | EN |
|---|---|---|---|
| PRICE | Citează cost, buget | Упоминает стоимость, бюджет | Cost / budget concerns |
| UX | Friction repetat, training fail | Повторяющиеся UI проблемы | Repeated friction, failed training |
| MISSING_FEATURE | Workflow gap concret | Конкретный пробел в workflow | Concrete workflow gap |
| COMPETITOR | Numite competitor + evaluare activă | Конкурент назван + активная оценка | Named competitor + active evaluation |
| LOW_USAGE | <20% adoption / declin | <20% adoption / снижение | <20% adoption / decline |
| LOW_VALUE_PERCEPTION | Folosesc dar nu văd ROI | Используют, но не видят ROI | Using but no ROI perceived |
| TEAM_CHANGE | Manager nou, restructurare | Новый менеджер, реструктуризация | New manager, restructuring |
| INTEGRATION_GAP | Lipsă conectare cu unelte interne | Нет интеграции с внутренними инструментами | Missing integration with internal tools |
| OTHER | Documentează detaliat | Документировать подробно | Document in detail |

---

## 6. Concession matrix

| Concesia (EN canonical) | RO | RU | Aprobare | Conditii |
|---|---|---|---|---|
| Premium 1:1 training (4h) | Training premium 1:1 (4h) | Премиум 1:1 тренинг (4ч) | CS user single | Once-off · documentat |
| Discount 10% temporary 3mo | Discount 10% temporar 3 luni | Скидка 10% временно на 3 месяца | CS user single | Customer history >6 luni |
| Discount 20% temporary 3mo | Discount 20% temporar 3 luni | Скидка 20% временно на 3 месяца | cs_lead | După discovery clar PRICE |
| Multi-month freeze | Multi-month freeze (subscription pause) | Заморозка подписки на несколько месяцев | cs_lead | Cazuri force-majeure agency |
| Feature roadmap commitment | Feature roadmap commitment (cu ETA) | Обязательство по roadmap (с ETA) | cs_lead + Product Lead | Doar dacă deja în roadmap Q+1 |
| Custom integration scope | Custom integration scope | Кастомная интеграция | cs_lead + Eng Lead + Sales | RFP formal · contract addendum |
| Dedicated CSM (Premium) | Dedicated CSM (Premium) | Выделенный CSM (Premium) | cs_lead | Account >€2k MRR |
| Exec sponsor REVYX intro | Exec sponsor REVYX intro | Знакомство с топ-менеджером REVYX | cs_lead + CTO | Cazuri strategic accounts |

**Reguli (universal):** NU oferi concesii fără reason_code clar. NICIODATĂ promitere features fără aprobare Product. NU acceptă escalări cross-tenant la pricing fără admin platform.

---

## 7. Action plan & follow-up cadence

(Identic cu v1.0.0 §7. Aplicabil identic în orice limbă; documentation rămâne EN în Notion + `cs_notes` adaptat la limba conversației.)

1. **Document reason_code** în `cs_notes` (structured + narrative max 2000 chars).
2. **Action plan** cu 3-5 itemi concreți + ETA.
3. **Follow-up săptămânal 3 săpt:** check-in scurt (5-10 min sau email status).
4. **30d post-contact:** evaluează `outcome` provizoriu.
5. **90d post-contact:** retention auto-verified de cron.

---

## 8. Outcome decision tree

(Identic cu v1.0.0 §8.)

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

(Identic cu v1.0.0 §9.)

| Trigger | Acțiune |
|---|---|
| Decision-maker menționează "competitor signed" / "конкурент подписал" / "competitor signed" | Escaladare cs_lead în ≤4h |
| Concesie > €1000 valoare anuală | Approval cs_lead obligatoriu |
| Account >€5k MRR | Notificare cs_lead automată la task open |
| 5 task-uri HIGH în 30 zile pentru același tenant | Escaladare auto la CRITICAL |

---

## 10. Cross-references

- `churn-ga` v1.0.1 §19.2 — playbook HIGH canonical reference
- `audit-log` v1.1.0 §4.4.5 — events catalog `CHURN_*`
- `tenancy-roles-extension` v1.1.0 §6.5 — `cs_user`/`cs_lead` permissions
- `DPIA_REVYX_phase5` v1.0.0 §5.1 — churn-ga risk register
- `CHURN_MEDIUM` v1.1.0 — escalare path
- `CHURN_CRITICAL` v1.1.0 — auto-escalation path la 5 HIGH/30d

---

*docs/cs-playbooks/CHURN_HIGH_v1.1.0.md · v1.1.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
