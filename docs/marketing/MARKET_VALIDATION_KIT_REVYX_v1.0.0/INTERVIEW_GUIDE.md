# Ghid interviu de validare + script demo 10 min
<!-- docs/marketing/MARKET_VALIDATION_KIT_REVYX_v1.0.0/INTERVIEW_GUIDE.md · v1.0.0 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan
**Stage:** VAL-01 — Kit validare de piață (doc-only, paralel M1.S3) · `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2
**Brand ref:** `docs/brand-configs/revyx.md` §7 · **BRD ref:** §5 (piloni), §17 (specific RM)

## 0.1 Platform Matrix
🌐 **WEB** — scriptul demo folosește exclusiv ecrane confirmate din `apps/web-preview/` (26 ecrane, live Vercel).

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-07 | Senior PM + DOC | ★ INITIAL — 12 întrebări deschise + script demo 10 min pe 4 fluxuri. |

---

## 1. Cum se conduce interviul (pentru PM)

**Regula de aur: nu vinde. Ascultă.** Scopul e să afli cum lucrează agentul azi și unde pierde, NU să convingi.

- **Durată țintă:** ~30 min discuție + 10 min demo. Total ≤ 45 min.
- **Raport ~80/20:** agentul vorbește 80%, tu 20%. După fiecare răspuns, tăcere 3 secunde — de multe ori completează singur cu cel mai valoros detaliu.
- **Întrebări deschise, nu de tip da/nu.** „Povestește-mi despre…", „Cum arată…", „Ce se întâmplă când…".
- **Nu sugera răspunsul.** Nu spune „deci pierzi lead-uri pentru că răspunzi târziu?" — întreabă „ce se întâmplă cu un lead pe care nu apuci să-l suni azi?".
- **Notează cifre exacte** (câte lead-uri, ce %, ce comision, câte zile). Sunt aurul validării.
- **Nu prezenta produsul în timpul întrebărilor.** Demo-ul vine DUPĂ, ca modul separat.
- **Consimțământ:** cere voie să notezi/înregistrezi la început.

---

## 2. Cele 12 întrebări deschise

### Blocul A — Rutina zilnică cu lead-uri (piloni 01 Lead + 04 Execuție)
1. **Descrie-mi o zi obișnuită de lucru — de dimineață până seara. Cu ce începi?**
2. **De unde îți vin lead-urile și cam câte pe lună? Care sursă îți aduce cele mai bune contacte?**
3. **Când primești un lead nou, cum decizi pe cine suni primul? Ce te face să spui „ăsta e serios"?**
4. **Ce se întâmplă cu un lead pe care nu apuci să-l contactezi în aceeași zi?**

### Blocul B — Rata de pierdere (piloni 05 Negociere + 06 Deal)
5. **Din 10 lead-uri care intră, cu câți ajungi la o vizionare? Și din câți iese o tranzacție?**
6. **Când o tranzacție „cade", de obicei de ce? Când îți dai seama că e pierdută — din timp sau prea târziu?**
7. **Cine urmărește tranzacțiile în lucru — tu, un manager, un tabel? Cum arată asta acum?**

### Blocul C — Comision sale/rent + mandat (BRD §17.5 + Regula 20)
8. **Cum lucrezi diferența dintre vânzare și chirie? Comisionul, actele, efortul — se schimbă mult?**
9. **Lucrezi cu mandat de exclusivitate cu vânzătorii? Pe cât timp de obicei, și ce se întâmplă când expiră?**
10. **Cooperezi cu alți agenți pe o proprietate (împărțire de comision)? Cum se întâmplă azi?**

### Blocul D — Dispoziție de plată + instrument (fără a vinde)
11. **Ce instrumente folosești acum ca să ții totul sub control (Excel, WhatsApp, un CRM)? Ce te enervează cel mai tare la ele?**
12. **Dacă ar exista ceva care îți filtrează lead-urile slabe și îți spune pe cine să suni primul — cât ar valora pentru tine? Ai plăti pentru asta lunar, și cam în ce interval?**

> **Notă întrebarea 12:** las-o la final, pune-o relaxat, ca ipoteză. Nu insista pe cifră exactă — reține banda (ex: „ceva până în X€/lună") și reacția emoțională (interes real vs politețe).

**Întrebare de închidere (bonus):** *„Dacă am construi asta și te-am invita într-un pilot de 30 de zile, gratuit, pe fluxul tău real — ai fi interesat?"* → notează răspunsul exact în formularul de feedback.

---

## 3. Script demo live — 10 minute

**Când:** doar DUPĂ ce ai terminat întrebările. **Unde:** `demo.revyx.app` (sau `apps/web-preview/` local). **Cum:** tu conduci, agentul privește și comentează. Oprește-te des și întreabă *„asta ți-ar folosi?"*.

> **Regulă:** arată doar ce EXISTĂ în demo. Formulele de scoring sunt ascunse intenționat în UI — vorbește în beneficii („prioritate", „calitate ofertă", „stare"), nu în acronime.

| Timp | Flux (ecran demo) | Ce arăți | Ce spui / ce întrebi |
|---|---|---|---|
| **0:00–1:00** | Intro + Panou de bord (`/dashboard`) | Sarcinile de azi, lead-urile urgente, sugestiile per client | „Dimineața, sistemul îți spune deja pe cine să suni și ce urmează. Nu tu cauți — el îți dă." |
| **1:00–3:30** | **① Calificarea ghidată** (`/leads/[id]`) | Profilul de nevoi al cumpărătorului (buget declarat vs confirmat, bancă, must-sell) + badge de pregătire financiară + ghidul „Cum fac asta?" (scenariu apel + obiecții) | „Aici agentul e ghidat pas cu pas la calificare. Dacă un vânzător — apare un wizard de 10 pași. Ai avea nevoie de un astfel de ghid?" |
| **3:30–5:30** | **② Potriviri** (`/leads/[id]` → podium + `/properties`) | Top 3 proprietăți potrivite cu motivul potrivirii dezvăluit inline; pentru o proprietate — clienții compatibili | „Introduci un cumpărător, primești top 3 potriviri, cu motivul. Introduci o proprietate, primești clienții. În ambele sensuri." |
| **5:30–7:30** | **③ Kanban tranzacții** (`/deals`) | Fluxul pe etape, cardul cu tip (vânzare/chirie), client, adresă, comision, stare (Merge bine / De verificat / Risc mare); drag-drop între etape | „Aici vezi toate tranzacțiile dintr-o privire. Culoarea îți spune care e sănătoasă și care are nevoie de atenție. Managerul vede același lucru în timp real." |
| **7:30–9:00** | **④ Cabinet** (`/cabinet/agent`) | Profil, istoric, obiective lunare selectabile, parteneri de cooperare, direcția de lucru (sale/rent/both) | „Cabinetul tău: obiectivele lunare, partenerii cu care cooperezi și pe ce piață lucrezi. Tu îl controlezi." |
| **9:00–10:00** | Închidere + cererea pilot | Revii la panou · menționezi RO/RU/EN · treci la formular | „Asta e demo-ul. Ce ți-a atras atenția cel mai mult? Ce ți-ar lipsi ca să-l folosești zilnic?" → **completați împreună formularul de feedback.** |

**Ecrane de rezervă** (dacă agentul cere mai mult): `/tasks` (programul zilei), `/manager` (vederea managerului), `/notary` (acte notariale vânzare vs contracte chirie), `/properties/new` (adăugare proprietate cu comision).

---

## 4. După interviu (pentru PM)
1. Completează **FEEDBACK_FORM.md** împreună cu agentul (sau imediat după).
2. Transferă rezultatele în tabelul din **SUCCESS_CRITERIA.md** §3.
3. Notează 1 citat memorabil (verbatim) — folosește-l la sinteza VAL-02.

---

## 5. Cross-references
- `ONE_PAGER.md` — de înmânat/trimis înainte de întâlnire
- `FEEDBACK_FORM.md` — de completat după demo
- `SUCCESS_CRITERIA.md` — criterii + tabel de centralizare
- `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — variantă lungă (5 min, 8 scene) pentru referință
- `docs/BRD_REVYX_v1.5.0.md` §5 piloni + §17 specific RM (bază pentru întrebări)

---

*docs/marketing/MARKET_VALIDATION_KIT_REVYX_v1.0.0/INTERVIEW_GUIDE.md · v1.0.0 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
