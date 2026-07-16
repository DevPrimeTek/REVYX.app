# FORMULAR FEEDBACK — Tally (gata de lipit)
<!-- docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/FEEDBACK_FORM_TALLY.md · v1.0.0 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Scop
Formularul pe care testerul îl completează din demo (buton „Feedback" / nudge automat). Colectare **automată**, fără apel. Întrebările sunt scurte (~2 min) și mapate pe piloni ca răspunsurile să se traducă direct în priorități (cross-ref `MARKET_VALIDATION_KIT/SUCCESS_CRITERIA.md`).

---

## 1. Setup Tally (fondator, ~10 min, o singură dată)

1. Cont pe [tally.so](https://tally.so) (gratuit) → **Create form** → „REVYX — Feedback demo".
2. Adaugă întrebările din §2 (copiază titlurile + opțiunile). Tipurile sunt notate în paranteză.
3. **Settings → Language** = Romanian (interfața Tally). Textele de mai jos sunt deja RO; adaugă varianta RU în descrierea fiecărei întrebări dacă vrei bilingv (opțional).
4. **Publish** → copiază link-ul public (formă `https://tally.so/r/xxxxxx`).
5. Legare la demo (fără schimbare de cod):
   - Vercel → proiectul demo → **Settings → Environment Variables** → adaugă
     `NEXT_PUBLIC_TALLY_FEEDBACK_URL` = link-ul Tally · scope: Production (și Preview).
   - **Redeploy** (Deployments → ultimul → Redeploy).
6. Verificare: intră pe demo → apasă butonul „Feedback" → trebuie să se deschidă formularul Tally.

> Notă: până setezi env var-ul, butonul deschide un placeholder (`/r/REPLACE_ME`). Nimic nu se strică — doar formularul nu e legat încă.

---

## 2. Întrebări (copiază în Tally)

**Intro (text sus în formular):**
> Mulțumim că ai testat demo-ul REVYX. 6 întrebări scurte, ~2 minute. Poți răspunde și anonim — dar dacă vrei să te anunțăm când e gata, lasă un contact la final.

**Î1. Ce descrie cel mai bine rolul tău?** *(Multiple choice, obligatoriu)*
- Agent imobiliar independent
- Broker / proprietar de agenție mică (până la ~15 agenți)
- Agent într-o rețea / agenție mare
- Manager / coordonator de echipă
- Altceva

**Î2. În ce oraș lucrezi?** *(Short text, opțional)*

**Î3. Cât de clar ți s-a părut demo-ul?** *(Linear scale 1–5; 1 = confuz, 5 = foarte clar; obligatoriu)*

**Î4. Cât de util ar fi în munca ta de zi cu zi?** *(Linear scale 1–5; 1 = deloc, 5 = foarte util; obligatoriu)*

**Î5. Ce ți-a plăcut cel mai mult? Ce te-ar face să-l folosești?** *(Long text, opțional)*

**Î6. Ce lipsește sau ce te-ar face să NU-l folosești?** *(Long text, opțional)*

**Î7. Cât de probabil ai testa varianta reală cu propriile lead-uri?** *(Linear scale 1–5; 1 = deloc, 5 = sigur; obligatoriu)*

**Î8. Vrei să te anunțăm când e gata? Lasă email sau telefon.** *(Short text, opțional)*
> Descriere: *Îl folosim doar ca să te anunțăm despre REVYX. Nu-l dăm nimănui. Poți cere oricând ștergerea (GDPR / Legea 133).*

**Mesaj final (thank-you):**
> Mulțumim! Feedback-ul tău intră direct în lista de priorități. Dacă ai lăsat contact, revenim când e gata varianta reală.

---

## 3. Cum se mapează pe decizii

| Întrebare | Semnal | Prag (cf. SUCCESS_CRITERIA) |
|---|---|---|
| Î1 | Segment ICP (P1 / P2 / P3) | echilibru între segmente |
| Î3 claritate | UX demo — dacă < 3 des, ecranul confuz se reface | media ≥ 4/5 |
| Î4 utilitate | Product-message fit (pilon Direcție M2) | ≥ 3 din 5 dau ≥ 4 |
| Î6 | Backlog features → re-prioritizare M1.S4-S6 | catalog obiecții |
| Î7 pilot intent | Cerere reală de testare | ≥ 2 din 5 dau ≥ 4 |
| Î8 | Conversie tester → lead (contact) | orice contact = win |

---

## 4. Colectare & sinteză (Director Marketing)
- Răspunsurile apar automat în Tally → **Responses** (export CSV oricând).
- La fiecare 5 răspunsuri noi: transferă în tabelul din `MARKET_VALIDATION_KIT/SUCCESS_CRITERIA.md` §3 + verifică pragurile §1.
- Zero timp al fondatorului în colectare.

---

*docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/FEEDBACK_FORM_TALLY.md · v1.0.0 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
