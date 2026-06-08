# ARCH — Agent Routine → Capability Map (REVYX)
<!-- ARCH_REVYX_agent-routine-capability-map_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX -->

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | Solution Architect + Senior PM | Inițial — model conceptual „Operating Loop" + maparea cunoașterii de teren (BRD §17/§18) la funcționalități de aplicație. Val 1 livrat ca **schelet vizual** în demo; Val 2-4 + structura avansată planificate. |

## 0. Stage Master Plan
Aparține `M0.S9 — Demo AGI Layer (Val 1 schelet)`. Pregătește implementarea backend reală la `M1.S3-M1.S6` (vezi §6 Datorie tehnică). Conform Regula 8 + Regula 21.

> **Sursă conceptuală:** BRD §17 (6 specific-RM) + §18 (AGI Layer, 9 module) + workflows (property-onboarding §5.0, buyer-profile-lifecycle §4.1.1) + 7 documente de teren ale clientului. Acest document NU introduce cerințe noi — traduce cerințele existente în **plan de implementare pe rutina agentului**.

---

## 1. Teza de arhitectură — „Operating Loop"

Cunoașterea de teren descrie un singur lucru: **ciclul repetitiv de lucru al agentului**. Modelat explicit, fiecare etapă devine un loc unde aplicația preia rutina.

```
SOURCING → CALIFICARE → MANDAT → PREȚ → PROMOVARE → MATCH/SHOWING
    → OFERTĂ → ÎNCHIDERE → ALUMNI → (referral înapoi în SOURCING)
                      ↑
       peste tot: GHID („cum fac asta") + ETICĂ + SCOR auto-recalculat
```

**3 principii de consistență (scopul: agentul lucrează maximal comod):**
1. **Niciodată pagină goală** — fiecare ecran spune *următoarea acțiune* + *cum se face* (script/ghid). (Gitomer/Lukic → §18.3)
2. **Datele se completează din muncă, nu din formulare** — fiecare interacțiune actualizează scoruri/preferințe/FRS. (§17.4, §7.9)
3. **Sistemul apără agentul** — de buget fals (§17.1), mandat expirat (§17.5), supra-preț (§18.11), greșeli etice (§18.4), lead-uri nepregătite financiar (§18.7).

---

## 2. Mapare rutină → funcționalitate (catalog complet)

Legendă status: ✅ schelet vizual livrat · ◐ planificat structură avansată · ○ backlog.

### A. CALIFICARE (Val 1)
| Funcționalitate | Rutina descărcată | Mecanism (entitate/trigger/UI) | Sursă | Status |
|---|---|---|---|---|
| Buyer Needs Assessment (Profil de nevoi) | Worksheet structurat — agentul nu uită/improvizează | `buyer_assessments` (demo: localStorage) · completeness · UI panou 4 secțiuni | §18.9 | ✅ |
| Buget declarat vs confirmat | Sistemul ține minte gap-ul + avertizează | câmpuri buget · hint la `<declared×0.85` · RF→DHI | §17.1 | ✅ |
| Financial Readiness (Pregătire financiară) | Vede în 1s dacă lead-ul e „real" | derivat buget+bancă · badge 3 niveluri · BR-25 task | §18.7 | ✅ |
| Execution Guides („Cum fac asta?") | Scriptul e pe task, nu improvizat | `execution_guides` · drawer inline · 9 ghiduri seed RO | §18.3 | ✅ |
| Check-list 10 pași (wizard seller) | Întâlnirea critică structurată | wizard modal · captură verdict/preț/motivație | §18.3 | ✅ |

### B-F. Restul loop-ului (Val 2-4)
| Funcționalitate | Rutina descărcată | Sursă | Val | Status |
|---|---|---|---|---|
| Mandate tracking + expiry | Nu pierde relații prin mandate expirate | §17.5 | 2 | ◐ |
| Listing Price Discipline | Sistemul poartă conversația de preț | §18.11 | 2 | ◐ |
| Ethics Checkpoints (6) | Soft-prompt la decizii sensibile | §18.4 | 2 | ◐ |
| MLS / Cooperation + Open House | Listing-ul ajunge la parteneri, split comision | §18.10 | 3 | ○ |
| Feedback post-vizionare (5 dim) | Preferințele se calibrează singure | §17.4 | 3 | ◐ (parțial există) |
| property_class RM filtrare | Match realist soviet/post/new/premium | §17.6 | 3 | ◐ |
| Client Alumni Lifecycle | 70% business din referrals — cultivat automat | §18.6 | 4 | ○ |
| Agent Goals + Value Proposition | Progres vs țintă + demonstrare valoare | §18.2/§18.5 | 4 | ○ |

---

## 3. Prioritizare (impact rutină × efort)

1. **Val 1 — Calificarea ghidată** ✅ (livrat schelet) — etapa cu cea mai mare pierdere de timp; alimentează tot.
2. **Val 2 — Apărarea agentului** — efort mic (câmp+cron+modal), previne pierderi.
3. **Val 3 — Amplificarea** — depinde de Match Engine (M1.S4).
4. **Val 4 — Termen lung** — M1.S5-S6.

---

## 4. Val 1 — ce s-a livrat ca schelet vizual (M0.S9)

`apps/web-preview/`:
- `lib/mock/execution-guides.ts` — 9 ghiduri seed RO (scenariu apel + 5 obiecții + 10 pași).
- `components/leads/guide-drawer.tsx` — drawer „Cum fac asta?" inline pe sugestii.
- `lib/buyer-assessment-store.ts` — localStorage (bancă, must-sell, posesie, deal-breakers/compromise) + completeness.
- `components/leads/buyer-needs-panel.tsx` — Profil de nevoi cu **buget explicit** (declarat vs confirmat) + gap warning.
- `components/leads/financial-readiness-badge.tsx` — FRS prietenos (înlocuiește blocul vechi care expunea `BR-25`).
- `components/leads/qualification-wizard.tsx` — wizard 10 pași seller.
- Wire: `app/leads/[id]/page.tsx` (demand → needs panel + FRS; supply → wizard) + `lead-suggestions.tsx` („Cum fac asta?").
- i18n RO: `needs.*` · `guide.*` · `qualification.*` + fix `lead.financialReadinessHelp` (eliminat leak `BR-25`).

**Cerință PM aplicată:** toate etichetele de buget conțin explicit cuvântul „buget" + sumă de bani, fără ambiguitate.

---

## 5. Cum lucrează (flux agent, end-to-end Val 1)

1. Agent deschide lead cumpărător → **Profil de nevoi** îl ghidează ce să întrebe (buget real, posesie, necompromisabil).
2. **Pregătire financiară** se aprinde din buget confirmat + pre-aprobare → dacă „Neconfirmat", sistemul cere clarificarea finanțării înainte de vizionare.
3. La fiecare sugestie, **„Cum fac asta?"** dă scriptul gata (cu obiecții pentru apeluri seller).
4. Pentru lead vânzător → **wizard 10 pași** structurează întâlnirea critică → verdict Da → pasul următor: mandat.

Consistență: profil → FRS → sugestii prioritizate → ghid → verdict → etapa următoare. Agentul simte un coleg senior, nu un formular.

---

## ★ 6. Datorie tehnică — RETURN TO ADVANCED STRUCTURE (urmărit)

> **Decizie PM (M0.S9):** livrăm acum **schelet vizual** (localStorage, fără backend) pentru validare rapidă cu agenți reali. **Revenim cât mai curând** la structura avansată. Această datorie NU se acumulează tăcut — e urmărită aici + în CLAUDE.md §0a + Roadmap.

| # | De la (schelet) | La (avansat) | Stage țintă |
|---|---|---|---|
| D-1 | `buyer-assessment-store` localStorage | entitate `buyer_assessments` + `assessment_completeness` GENERATED + BR-31 task | M1.S3 |
| D-2 | FRS derivat în componentă | FRS computed în service layer din câmpuri §17.1/§17.3 + BR-25 enforce | M1.S3 |
| D-3 | execution-guides mock RO | entitate `execution_guides` editabilă per tenant + variabile context + tracking acces | M1.S4 |
| D-4 | wizard captură locală | persistă pe LEAD + auto-creează sugestia `request_mandate` la verdict „Da" | M1.S3 |
| D-5 | FRS doar pe lead detail | badge FRS compact și în lista `/leads` | M1.S5 |
| D-6 | i18n RO doar | RU + EN complete | M1.S5 |
| D-7 | Val 2-4 nelivrate | mandate / price discipline / ethics / MLS / alumni / goals | M1.S3-S6 |

---

*ARCH_REVYX_agent-routine-capability-map_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
