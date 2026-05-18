# VIDEO WALKTHROUGH — REVYX M0 (Script + Storyboard)
<!-- docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** M0.S4 — Video Walkthrough (T-M0.S4-05 storyboard, T-M0.S4-06 voice-over)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 AC-M0-03
**AC-M0-03:** video max **5 min** cu voice-over **RO + EN** (RU optional). 2 versiuni livrate.
**Brand ref:** `docs/brand-configs/revyx.md` §7 (ton profesional + executiv) + §3 (tipografie pentru intro/outro lower-thirds)

## 0.1 Platform Matrix

🌐 **WEB demo capture only** — `apps/web-preview/` Next.js demo (Vercel). Mobile companion menționat doar 2-3 secunde la final ca M2.S3 deliverable. Toate URL-uri folosite sunt routes confirmate `/login → /dashboard → /leads → /leads/L-0012 → /properties → /properties/new → /deals → /manager → /manager/escalations → /notifications → /profile`.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DOC + DESIGNER (Creative Director) + ARCHITECT + Senior PM | ★ INITIAL — 8 scene storyboard cu timing markers ± 5s, voice-over RO/RU/EN sincronizat, on-screen actions cu URL-uri exacte, target durată 5:00 ±10s. |

---

## 1. Filozofie & Producție

### 1.1 Durată

| Țintă | Min | Max | Buffer |
|---|---|---|---|
| AC-M0-03 | 4:30 | 5:00 | +0:10 outro (≤ 5:10) |

### 1.2 Format export

- Resoluție: **1920×1080 (16:9)** Full HD
- Frame rate: 30 fps
- Codec: H.264 MP4
- Audio: AAC 192 kbps stereo
- Subtitle: SRT track per limbă (RO/RU/EN burnt-in optional)

### 1.3 Tools sugerate

| Pas | Tool primar | Alternativă |
|---|---|---|
| Screen capture | **OBS Studio** (gratis, 60fps capable) | QuickTime (macOS) |
| Voice-over recording | **Audacity** (gratis, noise gate) | Reaper / GarageBand |
| Editing | **DaVinci Resolve** (gratis, color grading) | iMovie / Adobe Premiere |
| Lower-thirds + branding | Built-in titles cu paletă brand (`#0C1428` + `#C9870A`) | Motion (Apple) |

### 1.4 Distribuție

- Vimeo (link partajabil unlisted) — primar
- YouTube (unlisted) — backup
- Embed pe `demo.revyx.app/about` (post-T-M0.S3-14 DNS) — M0.S5+

---

## 2. Storyboard — 8 scene

### Scene 1 — Intro (0:00 → 0:25 · 25s)

**Visual:**
- 0:00-0:05 — Logo REVYX fade-in pe navy `#0C1428` + gold radial glow
- 0:05-0:15 — Lower-third: "REVYX — Real Estate Execution Intelligence" în Bebas Neue gold
- 0:15-0:25 — Tagline animat în Montserrat: "Not a CRM. An Agent Operating System."

**On-screen action:** static intro card; transition la mid-scroll preview al demo home page (`/`).

**Voice-over RO:**
> "REVYX este Agent Operating System pentru imobiliare. Nu un CRM. Un sistem care orchestrează lead-uri, deal-uri și echipe — în timp real. Vă invit într-un tur de 5 minute prin demo-ul nostru live."

**Voice-over RU:**
> "REVYX — это Agent Operating System для недвижимости. Не CRM. Это система, которая оркестрирует лиды, сделки и команды — в реальном времени. Приглашаю вас в 5-минутный тур по нашему live demo."

**Voice-over EN:**
> "REVYX is an Agent Operating System for real estate. Not a CRM. A system that orchestrates leads, deals, and teams — in real time. I'll take you on a 5-minute tour of our live demo."

---

### Scene 2 — Login → Dashboard (0:25 → 1:00 · 35s)

**Visual:**
- 0:25-0:30 — Navigate to `/login` în browser (URL bar visible) — Chrome window, 1440×900
- 0:30-0:40 — Click pe button "Login" (mock, fără credențiale) → redirect `/dashboard`
- 0:40-1:00 — Highlight zone (cursor hover): (a) **NBA widget** (top-3 acțiuni recomandate); (b) **Task slot indicator** "2 / 3" (BR-04); (c) **SLA timer** countdown pentru lead HOT

**On-screen action:** URL bar `apps/web-preview` → `/login` → click "Conectează-te" / "Войти" / "Sign in" → `/dashboard`.

**Voice-over RO:**
> "Aici e dashboard-ul agentului. Trei zone-cheie: NBA — Next Best Action — sistemul recomandă cele mai profitabile trei acțiuni acum; slot-ul de task-uri — maximum trei deal-uri active simultan, regulă encoded în engine; și SLA timer pentru lead-uri HOT, cu countdown 15 minute."

**Voice-over RU:**
> "Это dashboard агента. Три ключевые зоны: NBA — Next Best Action — система рекомендует три самые прибыльные действия прямо сейчас; слот задач — максимум три активные сделки одновременно, правило зашитое в engine; и SLA timer для HOT лидов с обратным отсчётом 15 минут."

**Voice-over EN:**
> "Here is the agent dashboard. Three key zones: NBA — Next Best Action — the system recommends the three most profitable actions right now; the task slot indicator — maximum three active deals at once, a rule encoded in the engine; and the SLA timer for HOT leads with a 15-minute countdown."

---

### Scene 3 — Lead Queue + Scoring (1:00 → 1:45 · 45s)

**Visual:**
- 1:00-1:10 — Navigate `/leads`. Show queue cu 100 leads. Filter chips colorate "HOT (12) / Calificat (22) / Warm (36) / Nurturing (30)"
- 1:10-1:20 — Click filter chip "HOT" → 12 leads filtered cu LS badge red pulsing (`≥ 0.75`)
- 1:20-1:35 — Search input "Andrei" → results filtered live (3 leads)
- 1:35-1:45 — Cursor highlight pe LS badge mono (JetBrains Mono) "0.87" + amber chip "BR-01 firewall threshold ≥ 0.60"

**Voice-over RO:**
> "100 lead-uri în queue. Filtrate automat după Lead Score. Cele HOT — scor peste 0.75 — pulsează roșu, prioritare. Firewall-ul nostru, regula BR-01, oprește lead-urile sub 0.60 din a ajunge la agent — intră în nurturing automat WhatsApp. Agentul nu mai pierde timp cu calificare manuală."

**Voice-over RU:**
> "100 лидов в очереди. Авто-фильтрация по Lead Score. HOT — оценка выше 0.75 — пульсируют красным, приоритетные. Наш firewall, правило BR-01, останавливает лиды ниже 0.60, не давая им дойти до агента — они уходят в автоматический WhatsApp nurturing. Агент больше не тратит время на ручную квалификацию."

**Voice-over EN:**
> "100 leads in the queue. Automatically filtered by Lead Score. The HOT ones — score above 0.75 — pulse in red, prioritized. Our firewall, rule BR-01, prevents leads below 0.60 from reaching the agent — they enter automatic WhatsApp nurturing instead. The agent no longer wastes time on manual qualification."

---

### Scene 4 — Lead Detail + Assign (1:45 → 2:30 · 45s)

**Visual:**
- 1:45-1:55 — Click pe lead L-0012 (LS 0.78). Open `/leads/L-0012`
- 1:55-2:10 — Pan UI: LS badge mono "0.78 qualified" · GDPR consent ✓ · activity timeline (last 5) · side-panel "Match suggestions 3" cu Property cards
- 2:10-2:20 — Click button "Asignează agent" → modal opens. Show 4 agents cu APS score + busy state ("3/3" = grey out)
- 2:20-2:30 — Click agent disponibil "Maria Popescu APS 0.84" → toast verde "Lead asignat" → auto-redirect `/dashboard`

**Voice-over RO:**
> "Detaliul lead-ului. Score 0.78 calificat. GDPR consent capturat la intake — vedem în badge. În dreapta, 3 proprietăți match-uite automat din baza de 50. La asignare, sistemul propune doar agenți cu slot liber și APS ridicat. Un click, lead-ul e atribuit, agentul primește notificare. Totul audit-logged în AUDIT_LOG immutable."

**Voice-over RU:**
> "Детали лида. Оценка 0.78 qualified. GDPR consent захвачен при поступлении — видно в badge. Справа — 3 объекта, авто-сопоставленных из базы 50. При назначении система предлагает только агентов со свободным слотом и высоким APS. Один клик — лид назначен, агент получает уведомление. Всё audit-logged в неизменяемом AUDIT_LOG."

**Voice-over EN:**
> "Lead details. Score 0.78 qualified. GDPR consent captured at intake — visible in the badge. On the right, 3 properties automatically matched from a base of 50. On assignment, the system suggests only agents with free slots and high APS. One click, the lead is assigned, the agent gets notified. Everything audit-logged in the immutable AUDIT_LOG."

---

### Scene 5 — Property + Match (2:30 → 3:05 · 35s)

**Visual:**
- 2:30-2:38 — Navigate `/properties`. Show 50 proprietăți, filter chips "Apartament (24) / Casă (12) / Teren (9) / Comercial (5)"
- 2:38-2:48 — Click "Adaugă proprietate" → `/properties/new`. Form 8 câmpuri parțial completat (Chișinău · Centru · 3 camere · 78m² · €95.000 · 2018 · etaj 4)
- 2:48-3:00 — Click button "Înregistrează" → toast "Proprietate salvată. 3 lead-uri match potențial."
- 3:00-3:05 — Auto-redirect `/leads/L-0001` cu side-panel match populated cu noul property

**Voice-over RO:**
> "Acum partea de proprietate. Agentul intră 8 câmpuri — adresă, oraș, cartier, camere, suprafață, preț. Sistemul calculează Property Score și caută automat în baza de lead-uri cele cu intent matching. Trei lead-uri primesc notificare. Match-ul e bidirecțional — și proprietatea sugerează lead-uri, și lead-ul sugerează proprietăți."

**Voice-over RU:**
> "Теперь часть про объекты. Агент вводит 8 полей — адрес, город, район, комнаты, площадь, цена. Система рассчитывает Property Score и автоматически ищет в базе лидов те, у которых совпадает intent. Три лида получают уведомление. Сопоставление двунаправленное — объект предлагает лиды, лид предлагает объекты."

**Voice-over EN:**
> "Now the property side. The agent enters 8 fields — address, city, district, rooms, area, price. The system computes Property Score and automatically searches the lead database for matching intent. Three leads get notified. Matching is bidirectional — the property suggests leads, and the lead suggests properties."

---

### Scene 6 — Deal Pipeline drag-drop (3:05 → 3:50 · 45s)

**Visual:**
- 3:05-3:15 — Navigate `/deals`. Show full-width kanban — 6 coloane (Inițial / Interes / Vizionare / Negociere / Acceptat / Notariat) cu 20 deal-uri
- 3:15-3:30 — Demo drag-drop: pick deal-ul `D-0007` din "Vizionare", drag în "Negociere". DragOverlay vizibil (rotire +1°, gold ring). Drop → toast "Deal D-0007 mutat în Negociere"
- 3:30-3:42 — Show DHI badges per card (verde 0.78, amber 0.52, red 0.34). Hover red → tooltip "BR-05 needs_review=true (deal NU se anulează)"
- 3:42-3:50 — Click "Avansează →" pe deal-ul `D-0014` în stage final → modal confirm "Close won?" → click "Confirmă" → toast verde "DEAL_WON" + AUDIT_LOG event vizibil

**Voice-over RO:**
> "Pipeline-ul de deal-uri. Șase stage-uri, 20 de deal-uri, kanban interactiv cu drag-drop. Și alternative — butoane Avansează pentru cei care preferă keyboard. Fiecare card are DHI — Deal Health Index — verde sănătos, amber review, roșu pericol. Important: când DHI scade, sistemul NU anulează automat — ridică flag pentru manager. Niciun decizionalism automat dăunător. Close-won — modal confirmare, AUDIT_LOG append-only."

**Voice-over RU:**
> "Pipeline сделок. Шесть стадий, 20 сделок, интерактивный kanban с drag-drop. И альтернатива — кнопки «Продвинуть» для тех, кто предпочитает клавиатуру. Каждая карточка имеет DHI — Deal Health Index — зелёный здоров, янтарь review, красный опасность. Важно: когда DHI падает, система НЕ отменяет автоматически — поднимает flag для менеджера. Никаких вредных автоматических решений. Close-won — modal подтверждения, AUDIT_LOG append-only."

**Voice-over EN:**
> "The deal pipeline. Six stages, 20 deals, interactive kanban with drag-drop. And an alternative — Advance buttons for those who prefer keyboard navigation. Each card has a DHI — Deal Health Index — green healthy, amber review, red danger. Crucially, when DHI drops, the system does NOT auto-cancel — it raises a flag for the manager. No harmful automated decisions. Close-won — confirm modal, AUDIT_LOG append-only."

---

### Scene 7 — Manager Command (3:50 → 4:25 · 35s)

**Visual:**
- 3:50-4:00 — Navigate `/manager`. Show APS leaderboard 8 agenți sorted desc, escalations count "6 active", conversion rate widget
- 4:00-4:15 — Click "Vezi toate escalări" → `/manager/escalations`. Show 6 escalations queue cu BR-03 chips colorate (T+SLA amber / T+SLA+30 red / T+SLA+2h red pulsing)
- 4:15-4:25 — Bulk-select 3 escalări (checkbox header + 2 row checkbox). Click "Bulk reassign (3)" → modal cu 4 agenți țintă. Click target → toast "3 escalări reasignate"

**Voice-over RO:**
> "Vederea managerului. APS leaderboard sortat descrescător — promovare merit-based. Șase escalări active, alocate pe trei niveluri conform BR-03 — SLA missed, plus 30 minute, plus două ore. Bulk reassign cu un click. Toate acțiunile semnate în AUDIT_LOG — niciun UPDATE sau DELETE permis la nivel de bază de date. Compliance GDPR Art. 22: managerul rămâne human-in-the-loop."

**Voice-over RU:**
> "Вид менеджера. APS leaderboard отсортирован по убыванию — merit-based продвижение. Шесть активных эскалаций, распределены по трём уровням согласно BR-03 — SLA missed, плюс 30 минут, плюс два часа. Bulk reassign одним кликом. Все действия подписаны в AUDIT_LOG — никаких UPDATE или DELETE на уровне БД. Compliance GDPR Art. 22: менеджер остаётся human-in-the-loop."

**Voice-over EN:**
> "The manager view. APS leaderboard sorted descending — merit-based promotion. Six active escalations, distributed across three levels per BR-03 — SLA missed, plus 30 minutes, plus two hours. Bulk reassign in one click. All actions signed in AUDIT_LOG — no UPDATE or DELETE allowed at the database level. GDPR Art. 22 compliant: the manager stays human-in-the-loop."

---

### Scene 8 — i18n switch + Closing (4:25 → 5:00 · 35s)

**Visual:**
- 4:25-4:32 — Navigate `/notifications`. Show audit-log feed cu 8-10 evenimente recente cronologic. Mark-read interaction
- 4:32-4:40 — Click language switcher în nav (dropdown RO/RU/EN). Switch RO → RU live. UI re-renders în rusă în <1s (no page reload)
- 4:40-4:48 — Switch RU → EN. Show same `/notifications` în engleză
- 4:48-5:00 — Cut la outro card: logo REVYX + tagline + URL `demo.revyx.app` + contact

**Voice-over RO:**
> "Și ultimul aspect — internaționalizare nativă. Switch limbă RO, RU, EN live, fără reload. Toate cele 16 routes vorbesc trei limbi. Demo-ul e live acum, accesibil online. REVYX — Real Estate Execution Intelligence. Mulțumim."

**Voice-over RU:**
> "И последний аспект — нативная интернационализация. Переключение языка RO, RU, EN на лету, без перезагрузки. Все 16 routes говорят на трёх языках. Demo доступен online прямо сейчас. REVYX — Real Estate Execution Intelligence. Спасибо."

**Voice-over EN:**
> "And the final aspect — native internationalization. Language switch RO, RU, EN live, no reload. All 16 routes speak three languages. The demo is live online right now. REVYX — Real Estate Execution Intelligence. Thank you."

---

## 3. Timing summary

| Scene | Start | End | Duration | Cumulative |
|---|---|---|---|---|
| 1 Intro | 0:00 | 0:25 | 25s | 0:25 |
| 2 Login + Dashboard | 0:25 | 1:00 | 35s | 1:00 |
| 3 Lead queue + scoring | 1:00 | 1:45 | 45s | 1:45 |
| 4 Lead detail + assign | 1:45 | 2:30 | 45s | 2:30 |
| 5 Property + match | 2:30 | 3:05 | 35s | 3:05 |
| 6 Deal pipeline drag-drop | 3:05 | 3:50 | 45s | 3:50 |
| 7 Manager command | 3:50 | 4:25 | 35s | 4:25 |
| 8 i18n + closing | 4:25 | 5:00 | 35s | **5:00** |

**Total:** **5:00** (within AC-M0-03 ≤ 5 min target). Buffer 10s for outro fade.

---

## 4. Voice-over production checklist

| Item | Spec |
|---|---|
| Locație | Cameră liniștită · noise floor < -50dB · carpet/foam pe pereți |
| Microfon | Condenser USB (Blue Yeti / Audio-Technica AT2020) sau XLR |
| Distanța mic | 15-25cm de la gură · pop filter obligatoriu |
| Tempo RO | ~150 cuvinte/min (Conversational profesional) |
| Tempo RU | ~140 cuvinte/min (slightly slower datorită lungimii cuvintelor) |
| Tempo EN | ~160 cuvinte/min (clearer enunciation) |
| Process audio | Noise gate -45dB · compressor 3:1 · EQ low-cut 80Hz |
| Output | WAV 48kHz 24-bit master · MP3 192kbps preview |

---

## 5. Subtitle (SRT) generation

Pentru fiecare scenă, exportă SRT cu timestamps din §2. Folosește:
- Whisper (`openai/whisper-large-v3`) pentru transcriere automată cu alignment timestamps
- Manual review pentru terminologie specifică (NBA, DHI, APS, BR-XX, AC-M0-XX)
- Format SRT standard 2-line max per cue · max 42 caractere/linie

3 fișiere SRT livrate: `video-walkthrough-ro.srt` · `video-walkthrough-ru.srt` · `video-walkthrough-en.srt`

---

## 6. Acceptance criteria self-check

| AC | Spec | Status post-livrare |
|---|---|---|
| AC-M0-03 duration | ≤ 5 min | ✅ 5:00 exact |
| AC-M0-03 voice-over RO | 1 versiune | ✅ scene 1-8 RO VO scrise |
| AC-M0-03 voice-over EN | 1 versiune | ✅ scene 1-8 EN VO scrise |
| AC-M0-03 voice-over RU | optional | ✅ scene 1-8 RU VO scrise (bonus livrare) |
| Recording + editing | tracked T-M0.S4-06 (post-script) | ⬜ DESIGNER + DOC action post-deck approval |

**Notă production:** Script + storyboard = T-M0.S4-05 ☑ (acest doc). Recording + editing fizic = T-M0.S4-06 (separat de M0.S4 conform Roadmap v1.0.0 §3.4) — depinde de finalizare DNS demo.revyx.app (T-M0.S3-14) și de aprobare deck content M0.S5.

---

## 7. Cross-references

- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ro.md` — deck canonical (slides 6-9 = scenes 3-7)
- `docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md` — screenshot capture for storyboard reference frames
- `apps/web-preview/` — demo source (16 routes)
- `docs/BRD_REVYX_v1.1.0.md` §5-§7 — voice-over content basis (piloni + BR-XX)
- `docs/brand-configs/revyx.md` — ton "profesional · precis · executiv" applied to VO
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 AC-M0-03

---

## 8. Approval gate

| Aprobator | Sign-off | Data |
|---|---|---|
| Senior PM | ⬜ pending | — |
| Senior Architect | ⬜ pending | — |
| DESIGNER (Creative Director) | ⬜ pending | — |
| DOC | ⬜ pending (auto self-review Regula 4) | 2026-05 |

---

*docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
