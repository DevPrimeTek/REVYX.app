# CS PLAYBOOK — CHURN MEDIUM (P3 · 7d SLA) — RO + RU + EN
<!-- CHURN_MEDIUM_v1.1.0.md · v1.1.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | CS Lead + Senior PM | Playbook inițial S9 — band MEDIUM (prob_30d 0.20–0.45) · referință `churn-ga` v1.0.0 §19.1 (RO templates) |
| 1.1.0 | 2026-05 | CS Lead + Senior PM + CS RU + CS EN | ★ Closes F-S10-06 MED (AUDIT_REVYX_s10-external-pass v1.0.0) — adăugare templates RU + EN paralele cu cele RO existente · zero schimbări la conținut RO · §3.x extins cu sub-secțiuni RO/RU/EN · §4 sub-secțiuni paralele · §5 discovery questions tradus · cross-ref `churn-ga` v1.0.1 |

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

(Identic cu v1.0.0 §2 — proces independent de limba template-ului.)

1. **Citește `churn_score.factors`** — top 3 features cu shap value cel mai negativ.
2. **Identifică pattern dominant:** `usage_drop` / `support_tickets_recent` / `billing_issue` / `engagement_decline` / `team_member_churned`.
3. **Verifică context account:** plan + MRR · APS dacă agency · ultimul login admin (>14d = warning).
4. **Selectează template** RO/RU/EN bazat pe `tenant.locale_primary`.

---

## 3. Touch 1 — Email (T0)

### 3.1 RO (v1.0.0 — neschimbat)

**Subject:** `{tenant_name}, hai să verificăm cum decurge cu REVYX`

**Body (RO):**

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

### 3.2 ★ RU (NEW v1.1.0)

**Subject:** `{tenant_name}, давайте проверим, как идут дела с REVYX`

**Body (RU):**

```
Здравствуйте, {first_name},

Меня зовут {cs_name}, я представляю REVYX. Связываюсь с вами для короткой
проверки — хочу убедиться, что платформа покрывает ваши потребности, и есть
ли что-то, что мы можем улучшить для вашей команды.

Я заметил, что за последние недели {pattern_observation_neutral_ru}, и
хотел бы уточнить, могу ли быть полезен:
  • Короткий тренинг (30 мин) по функционалу {top_features}
  • Ответы на технические вопросы
  • Структурированный фидбек по тому, что у вас не работает или вызывает
    трения

Может, проведём 20-минутный звонок на следующей неделе? Вот мой календарь:
{link}

С уважением,
{cs_name}
```

### 3.3 ★ EN (NEW v1.1.0)

**Subject:** `{tenant_name}, let's check in on your REVYX experience`

**Body (EN):**

```
Hi {first_name},

I'm {cs_name} from REVYX. I'm reaching out for a quick check-in — I want
to make sure the platform is meeting your team's needs and identify
anything we can improve.

I've noticed in recent weeks {pattern_observation_neutral_en}, and I'm
wondering if I can help with any of the following:
  • A short training session (30 min) on {top_features}
  • Answering open technical questions
  • Structured feedback on gaps or friction your team is experiencing

How about a 20-minute call next week? Here's my calendar: {link}

Best,
{cs_name}
```

### 3.4 Reguli aplicabile tuturor limbilor

- Tone consultativ, NU vânzător (toate trei limbi).
- NICIODATĂ menționa "churn" / "уход" / "leaving" — focus pe valoare.
- `{pattern_observation_neutral_*}` mascat: NU "ai folosit mai puțin" → "echipa a avut un pattern diferit" (RO) / "у команды был другой паттерн" (RU) / "your team had a different usage pattern" (EN).
- Personalizare: 1-2 detalii specifice (nume, oraș, plan).

---

## 4. Touch 2 — Slack DM / LinkedIn (T+5d)

Dacă nu răspunde:

### 4.1 RO

```
Salut {first_name}, am revenit cu un mesaj scurt — ai văzut email-ul de
săptămâna trecută? Sunt aici dacă există orice (chiar și 5 min) — mai bine
să prevenim decât să corectăm târziu. {cs_name}
```

### 4.2 ★ RU (NEW)

```
Здравствуйте, {first_name}, я повторно пишу — видели мой email на прошлой
неделе? Я доступен в любой момент (даже 5 минут) — лучше предупредить, чем
исправлять потом. {cs_name}
```

### 4.3 ★ EN (NEW)

```
Hi {first_name}, just a quick follow-up — did you catch my email from last
week? I'm available anytime (even 5 minutes) — better to prevent than to
correct later. {cs_name}
```

LinkedIn doar dacă consent în profilul lead-ului = `LINKEDIN_OK`.

---

## 5. Discovery questions (call 20 min)

Dacă răspunde și acceptă call:

### 5.1 RO (v1.0.0 — neschimbat)

1. **Open:** "Cum ți se pare REVYX la 90+ zile? Ce funcționează bine, ce nu?"
2. **Specific friction:** "Există un pas zilnic care îți ia mai mult timp decât te aștepți?"
3. **Team adoption:** "Câți agenți din echipă folosesc activ săptămânal? Dacă <50%, de ce?"
4. **Competitor signal:** "Ați evaluat alte soluții recent?" (nu push-y, doar entry)
5. **Roadmap match:** "Ce feature ar dubla valoarea pentru voi?"
6. **Open close:** "Mai e ceva ce nu am întrebat?"

### 5.2 ★ RU (NEW)

1. **Open:** "Как вам REVYX после 90+ дней использования? Что работает хорошо, что нет?"
2. **Specific friction:** "Есть ли ежедневная задача, которая занимает больше времени, чем ожидалось?"
3. **Team adoption:** "Сколько агентов из команды активно используют платформу еженедельно? Если <50%, почему?"
4. **Competitor signal:** "Оценивали ли вы другие решения недавно?" (не продавая, а просто как открытие темы)
5. **Roadmap match:** "Какая функциональность удвоила бы ценность для вас?"
6. **Open close:** "Есть ли что-то, что я не спросил?"

### 5.3 ★ EN (NEW)

1. **Open:** "How has REVYX been after 90+ days? What's working, what's not?"
2. **Specific friction:** "Is there a daily step taking more time than you'd expect?"
3. **Team adoption:** "How many of your agents are actively using REVYX weekly? If <50%, why?"
4. **Competitor signal:** "Have you evaluated other solutions recently?" (not pushy, just an opener)
5. **Roadmap match:** "What feature would double the value for you?"
6. **Open close:** "Anything I didn't ask?"

---

## 6. Outcome decision tree

(Identic cu v1.0.0 §6 — independent de limba template.)

```
Engagement restored (acceptă training/call/feedback)? 
  ├─ YES → outcome=PREVENTED, reason_code=identified, schedule follow-up 30d
  └─ NO
     ├─ Programează re-evaluare în 30d → outcome=DEFERRED
     └─ Nu răspunde 3 atingeri → outcome=UNREACHABLE
```

---

## 7. Reason codes

(Identic cu v1.0.0 §7 — coduri sunt EN-canonical, etichete UI traduse.)

| Code | RO | RU | EN |
|---|---|---|---|
| LOW_USAGE | <30% adopție echipă | <30% использование команды | <30% team adoption |
| MISSING_FEATURE | Solicită funcționalitate inexistentă | Запрашивает отсутствующую функцию | Requests missing feature |
| UX | Friction repetat în UI | Повторяющиеся UI проблемы | Repeated UI friction |
| PRICE | Buget restrictiv | Бюджетные ограничения | Budget constraint |
| COMPETITOR | Evaluează alternative | Рассматривает альтернативы | Evaluating alternatives |
| TEAM_CHANGE | Schimbare manageriat / churn agenti | Смена руководства / уход агентов | Management / agent churn |
| OTHER | Documentează în notes | Документировать в заметках | Document in notes |

---

## 8. Audit & data hygiene

(Identic cu v1.0.0 §8.)

| Action | Audit event |
|---|---|
| Email sent | `CHURN_CS_TASK_CONTACTED` (channel=EMAIL) |
| Call held | `CHURN_CS_TASK_CONTACTED` (channel=CALL) |
| Outcome recorded | `CHURN_OUTCOME_RECORDED` |
| Notes saved | redactare PII automatic la 365d retention |

`cs_notes`: max 2000 chars · NU paste-uri din chat private · NU PII direct (preferă redactare). Aplicabil identic indiferent de limba conversației.

---

## 9. Cross-references

- `churn-ga` v1.0.1 §19.1 — playbook MEDIUM canonical reference
- `audit-log` v1.1.0 §4.4.5 — events catalog `CHURN_*`
- `tenancy-roles-extension` v1.1.0 §6.5 — `cs_user` permissions
- `DPIA_REVYX_phase5` v1.0.0 §5.1.5 — risk register churn-ga (cs_notes redaction)
- `PII_REDACTION_FIXTURES` v1.0.0 §5.3 — cs_notes export PII test

---

*docs/cs-playbooks/CHURN_MEDIUM_v1.1.0.md · v1.1.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
