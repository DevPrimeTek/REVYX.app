# REVYX — Pitch Deck (RU)
<!-- docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ru.md · v1.0.0 · 2026-05 -->
<!-- КОНФИДЕНЦИАЛЬНО · Внутреннее использование · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** M0.S4 — Pitch Deck (T-M0.S4-03 RU)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 AC-M0-04
**Brand ref:** `docs/brand-configs/revyx.md`

## 0.1 Platform Matrix

🌐 **Только WEB demo.** Все скриншоты из `apps/web-preview/` (Next.js 14). Mobile companion упомянут только на slide 11 (Roadmap) как M2.S3 livrable.

## Changelog

| Версия | Дата | Автор | Заметки |
|---|---|---|---|
| 1.0.0 | 2026-05 | DOC + DESIGNER + ARCHITECT + Senior PM | ★ INITIAL — 16 slides RU, перевод с канонической версии RO. |

---

## SLIDE 01 — Cover

**Headline:** REVYX
**Subheadline:** Real Estate Execution Intelligence
**Tagline:** Это не CRM. Это Agent Operating System для недвижимости.
**CTA:** Demo live → `demo.revyx.app`
**Visual:** Logo REVYX по центру на navy `#0C1428` + gold radial glow.

---

## SLIDE 02 — Проблема

**Headline:** Агенты по недвижимости перегружены. Потери замаскированы.

**Три ключевых проблемы:**

1. **Поток лидов без квалификации** — Агент получает 80-150 лидов/месяц из 8 источников (Meta, Google, OLX, рекомендации, walk-in). Только 12-18% — реальные. Остальное = потерянное время.
2. **Pipeline непрозрачный для менеджера** — Ни один менеджер не знает в реальном времени, какая сделка здорова, а какая на грани провала. Решения об эскалации принимаются слишком поздно.
3. **Производительность агента неизмерима корректно** — APS (Agent Performance Score) отсутствует. Бонусы + распределение лидов = субъективно, зависит от менеджера.

**Footer:** ~70% pipeline value теряется на лидах, не доставленных вовремя (SLA > 24h), или на сделках, брошенных без структурированного follow-up.

---

## SLIDE 03 — Решение: REVYX AOS

**Headline:** Agent Operating System для недвижимости

| 🛡️ **Lead Firewall** | 🤖 **NBA Layer** |
|---|---|
| Только лиды с LS ≥ 0.60 + валидный контакт доходят до агента (BR-01). Остальные — в авто-nurturing. | Next-Best-Action в реальном времени для каждого лида/сделки: звонок, WhatsApp, показ, follow-up. NBA ∈ [0, 2.0]. |

| ⏱️ **Max 3 активных задач** | 🔥 **Эскалация 3 уровня** |
|---|---|
| Принудительная фокусировка: ни один агент не работает более чем над 3 сделками одновременно (BR-04). | T+SLA → T+SLA+30 мин → T+SLA+2h. Ни один HOT лид (LS ≥ 0.75) не остаётся без контакта более 15 минут. |

**Footer claim:** *REVYX не спрашивает агента, что делать. Он говорит.*

---

## SLIDE 04 — Рынок

**Headline:** Республика Молдова — недо-цифровизованный рынок, агентства готовы к скачку

**Ключевые цифры:**

- **~400 агентств недвижимости** активных в RM (оценка 2025, фокус Кишинёв + Бельцы + Кагул)
- **~2 800 лицензированных индивидуальных агентов**
- **0 специализированных AOS платформ.** Текущая конкуренция: Excel + WhatsApp + 1-2 неадаптированных русско-румынских CRM
- **TAM RM (SaaS):** ~€5M/год при полной пенетрации

**Расширения Phase 5:** Румыния (Бухарест + Клуж + Тимишоара) · Украина пост-стабилизация · Buyer-side marketplace · White-Label Enterprise

---

## SLIDE 05 — 5 AI движков

**Headline:** Одна платформа. Пять оркестрованных AI движков.

```
[ Lead Score (LS) ]  →  [ Property Score + Match (PS + IS) ]  →  [ NBA Layer ]  →  [ Deal Probability + Health (DP + DHI) ]  →  [ Agent Performance (APS) ]
```

1. **LS — Lead Score [0,1]** — рассчитывается при поступлении, пересчёт при каждом touchpoint. Firewall: ≥ 0.60.
2. **PS + IS — Property + Interaction Strength** — сопоставление через embeddings (pgvector HNSW, Phase 3).
3. **NBA — Next Best Action [0, 2.0]** — единственное исключение шкалы. Вес urgency × revenue impact.
4. **DP + DHI — Deal Probability + Health Index** — реал-тайм вероятность закрытия + здоровье pipeline.
5. **APS — Agent Performance Score [0,1]** — меритократический. Основа распределения лидов + бонус.

**Footer:** *Все скоры [0,1] (исключение NBA). Валидированы на 7 тестовых векторах (T01-T07).*

---

## SLIDE 06 — Demo · J1: Lead Score & Firewall

**Headline:** Лид поступает. Через 3 секунды агент знает, что делать.

- **Слева:** скриншот `/leads` (queue с LS badges)
- **Справа:** скриншот `/leads/[id]` (детали лида + match suggestions + кнопка «Назначить агента»)

**3 буллета:**
- Auto-scoring при поступлении — Meta / Google / OLX / direct (HMAC-verified webhooks)
- Firewall BR-01: < 0.60 → авто-nurturing через WhatsApp (5 шаблонов Meta-pre-approved)
- 1-click assign с APS фильтром — только агенты со свободным слотом (max 3)

---

## SLIDE 07 — Demo · J2: Property & Match

**Headline:** Объект внесён. Мгновенное сопоставление с подходящими лидами.

- **Слева:** скриншот `/properties` (50 объектов с PS + LF)
- **Справа:** скриншот `/properties/new` (форма 8 полей) + toast «3 потенциальных лида»

**3 буллета:**
- Match engine: embeddings pgvector HNSW (Phase 3) с fallback на rule-based
- Точность target ≥ 70% на тестовом наборе (AC-M1-03)
- Двунаправленные авто-предложения: property → leads + lead → properties

---

## SLIDE 08 — Demo · J3: Deal Pipeline

**Headline:** 6 стадий. Drag-drop. Deal Health под постоянным мониторингом.

- Скриншот `/deals` kanban — 6 колонок · 20 сделок · DHI badges · DragOverlay rotire +1°

**3 буллета:**
- Drag-drop accessible (PointerSensor 6px + KeyboardSensor + click-to-advance permanent)
- DHI рассчитывается непрерывно: TF · UF · RF — re-matching trigger только `needs_review=true`, сделки НЕ отменяются автоматически (BR-05)
- Close-won → confirm modal → DEAL_WON event audit-logged

---

## SLIDE 09 — Demo · J4: Manager Command

**Headline:** Менеджер видит всё. Действует одним кликом.

- **Слева:** скриншот `/manager` (APS leaderboard · escalations · conversion · today actions)
- **Справа:** скриншот `/manager/escalations` (6 эскалаций · bulk-select · «Bulk reassign»)

**3 буллета:**
- APS leaderboard sorted desc — merit-based, без bias
- Escalation Protocol BR-03 — авто-эскалация через SLA timer; manager может override + bulk reassign
- Audit-log immutable: любое действие mgr → AUDIT_LOG APPEND-ONLY (BR-07)

---

## SLIDE 10 — Архитектура Web + Mobile

**Headline:** Web primary. Mobile companion.

```
┌─────────────────────────────────────────────────────────┐
│  WEB ~80%  (apps/web — Next.js 14 + TS strict + Tailwind)│  ← agent + manager + admin (DP-01 Web-first)
│  MOBILE ~20% (apps/mobile — React Native + NativeWind)   │  ← agent in-field (M2.S3)
├─────────────────────────────────────────────────────────┤
│  API REST + WebSocket (single backend, DP-03)            │
│  Auth: Supabase / Auth0 · JWT RS256 · 15min + 7d refresh │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL + pgvector HNSW · Redis · AUDIT_LOG          │
└─────────────────────────────────────────────────────────┘
```

- Web ✅ M0 demo live · M1 функциональный · M2 GA · Mobile 📱 companion M2.S3
- Single backend → API идентичен Web + Mobile (DP-03)
- Admin = Web only (DP-05): RBAC mgmt · ML promote · billing · white-label · audit log
- 15 модулей × 119 features — `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §17

---

## SLIDE 11 — Безопасность & GDPR

**Headline:** Phase 0 Security — блокирующая. Ни одной строчки кода приложения без неё.

- ⬜ JWT RS256 + RBAC 5 ролей (agent · senior_agent · team_lead · manager · admin)
- ⬜ GDPR consent capture при intake любого лида + авто-retention
- ⬜ AUDIT_LOG append-only — никаких UPDATE/DELETE на уровне БД (BR-07)
- ⬜ Webhook HMAC-SHA256 verification (Meta · Google · OLX)
- ⬜ Rate limiting на публичных endpoints
- ⬜ Privacy Policy + Cookie Policy legal review (Legea 133/2011 RM)

**Footer:**
- Compliance: GDPR EU + Legea 133/2011 RM + Legea 142/2018 SaaS
- AUDIT_LOG включает события ISO 27001 + INC + DR_TEST (zero PII unmask для auditors)
- Pilon Retention (Phase 5) — churn score human-in-the-loop (Art. 22 GDPR)

---

## SLIDE 12 — Бизнес-модель

**Headline:** SaaS multi-tier. Per-seat pricing.

| Tier | Целевая аудитория | Цена /агент /месяц | Ключевые фичи |
|---|---|---|---|
| **Starter** | Малые агентства (1-5 агентов) | **€29** | LS + NBA + Pipeline + только Web |
| **Pro** | Средние агентства (6-25) | **€49** | Всё Starter + Manager dashboard + Mobile companion + WhatsApp |
| **Enterprise** | 25+ агентов + corporate | **€79** | Всё Pro + White-Label + приоритетный SLA + API access + Compliance seat |

**Footer:**
- Setup fee €0 · Annual commit −15% · Pilot 30 дней free
- ARR target год 1: **€80K** (~150 платных агентов) · Год 3: **€800K** (~1 500 агентов)
- CAC target < €120/агент · LTV target > €1 200 (LTV/CAC > 10×)

---

## SLIDE 13 — Roadmap M0 → M1 → M2

**Headline:** Три milestone. Чёткий ритм исполнения.

```
2026 Q2 ─────── Q3 ─────── Q4 ─────── 2027 Q1 ────── Q2 ────── H2
   │                            │                       │
   ▼ M0 MVP Презентация ✅      ▼ M1 MVP Функциональный  ▼ M2 FULL Release GA
   • Demo live demo.revyx.app   • Phase 0 Security ✅   • Web Complete
   • 16 routes Next.js          • Phase A Foundation    • Mobile RN Companion
   • Mock 100/50/20             • Phase B Lead+Score    • Marketplace 2-sided
   • i18n RO/RU/EN              • Pilot 2-3 tenants     • Retention Pilon
   • Pitch deck + видео ★       • HST M1 0 CRIT/HIGH    • White-Label Enterprise
```

**Milestone gates:**
- M0 exit: AC-M0-01..07 ☑ + HST M0 0 CRIT/HIGH ✅
- M1 exit: AC-M1-01..10 ☑ + Pilot live ≥ 7 дней без P1 + HST M1 PASS
- M2 exit: GA public + Mobile iOS/Android + Marketplace ≥ 1 000 buyer profiles + Prevention Rate ≥ 30%

---

## SLIDE 14 — Traction & Команда

**Headline:** Быстрое исполнение, lean команда, непрерывный audit.

**M0 traction:**
- ✅ M0.S1 Design System direct-to-code (tokens.json + 18 screens inventory)
- ✅ M0.S2 Clickable prototype — 4 user journeys end-to-end
- ✅ M0.S3 Web Static Demo (16 routes Next.js · mock 100/50/20 · i18n RO/RU/EN · drag-drop)

**Core команда (placeholder TBD):**

| Роль | Имя |
|---|---|
| Founder / PM | {{TBD}} |
| Solution Architect | {{TBD}} |
| Frontend Lead | {{TBD}} |
| Backend / DBA | {{TBD}} |
| DPO + Security | {{TBD}} |

**Виртуальная AI команда (11 hats Claude Code):** ARCHITECT · BACKEND DEV · FRONTEND WEB DEV · MOBILE DEV · DBA · TESTER · SECURITY · DEVOPS · ML ENGINEER · DESIGNER · DOC — условная активация per stage.

---

## SLIDE 15 — Запрос

**Headline:** Мы здесь для двух разговоров.

### 🤝 Pilot client (агентства недвижимости RM)
- **30 дней pilot бесплатно** Pro tier (€49/агент/месяц после)
- Onboarding с Customer Success Lead
- Прямой доступ к roadmap backlog M1
- Target: **3 pilot агентства к Q3 2026**

### 💰 Инвесторы (seed / pre-seed)
- **Инвестиция: €{{XXXk}}** для M1 (Phase 0..C, 10 месяцев)
- Use of funds: 60% dev · 20% sales · 15% compliance · 5% buffer
- Equity: {{X}}% · Pre-money: €{{YYY}}k
- Target: **€{{XXX}}k closed к Q3 2026**

**Footer:** *Contact PM: {{email}} · Demo live: `demo.revyx.app`*

---

## SLIDE 16 — Спасибо & Q&A

**Headline:** Спасибо.

- Logo REVYX
- *Real Estate Execution Intelligence*
- **Demo live:** `demo.revyx.app`
- **Контакт:** {{email PM}} · {{LinkedIn}} · {{телефон RM}}

---

## Cross-references

- `deck-ro.md` — канонический оригинал (RO)
- `deck-en.md` — английский перевод
- `VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — companion video walkthrough

---

*docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ru.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
