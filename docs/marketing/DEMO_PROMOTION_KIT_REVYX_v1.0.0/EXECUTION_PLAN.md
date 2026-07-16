# PLAN DE EXECUȚIE — Promovare demo + colectare feedback
<!-- docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/EXECUTION_PLAN.md · v1.0.0 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Obiectiv
Maximum de testeri + maximum de feedback, cu **minimum de timp al fondatorului**. Fondatorul face doar setup-ul unic (conturile pe care doar el le poate crea) + lipește conținutul pe canale. Restul e produs și gestionat de Directorul Marketing.

**Țintă inițială (primele 2 săptămâni):** 30–50 vizite pe demo · 10+ răspunsuri de feedback · 3+ contacte lăsate (Î8).

---

## 1. Ce face fondatorul — o singură dată (~30 min total)

| # | Acțiune | Timp | Referință |
|---|---|---|---|
| 1 | Confirmă link-ul public al demo-ului (Vercel) | 2 min | — |
| 2 | Creează formularul Tally + lipește întrebările | 10 min | `FEEDBACK_FORM_TALLY.md` §1-§2 |
| 3 | Setează `NEXT_PUBLIC_TALLY_FEEDBACK_URL` în Vercel + redeploy | 5 min | `FEEDBACK_FORM_TALLY.md` §1 pct.5 |
| 4 | Verifică: buton „Feedback" din demo deschide formularul | 2 min | — |
| 5 | (dacă nu există) creează pagina LinkedIn + Telegram + FB REVYX | 10 min | opțional; poate lipsi la start |

> Conturile de social/WhatsApp și Tally necesită credențialele fondatorului — de aceea sunt singurele lui sarcini. Nu pot fi automatizate din exterior.

---

## 2. Ce face Directorul Marketing (Claude) — continuu

- Produce/actualizează tot conținutul promo (`PROMO_CONTENT_PACK.md`) + formularul (`FEEDBACK_FORM_TALLY.md`).
- Menține mecanismul de feedback din demo (widget + ghid + nudge) — deja în cod.
- La cerere, generează liste de prospecți (cross-ref `MARKET_VALIDATION_KIT/PROSPECTING_KIT.md`) + mesaje personalizate.
- Sintetizează răspunsurile Tally → priorități (`MARKET_VALIDATION_KIT/SUCCESS_CRITERIA.md`).

---

## 3. Secvența de lansare (după setup)

```
Ziua 0  — Setup unic (fondator, §1). Demo + feedback legate.
Ziua 1  — Val 1 caldă: 10-15 mesaje WhatsApp către cunoștințe/recomandări (PROMO §2).
          → cel mai mare rată de răspuns, validează că mecanismul merge.
Ziua 2  — Postare în 2-3 grupuri Facebook (PROMO §3) + pagina FB/IG (PROMO §4).
Ziua 3  — Telegram (canal + contacte) (PROMO §5) + LinkedIn pagina companiei (PROMO §6).
Ziua 4-7— Val 2 rece: 15-25 prospecți noi din PROSPECTING_KIT, mesaj WhatsApp rece (PROMO §1).
Ziua 8+ — Follow-up celor fără răspuns (PROMO §7) + repostare/refresh unde e permis.
```

Regula de aur: **întotdeauna trimite link-ul + ceri feedback**. Nu programa apeluri; demo-ul se explică singur.

---

## 4. Cadență săptămânală (după lansare)

| Zi | Acțiune | Cine | Timp |
|---|---|---|---|
| Luni | 10-15 mesaje noi de prospectare (WhatsApp/DM) | Fondator lipește | 20 min |
| Miercuri | 1 postare refresh (grup FB permis / Telegram / IG) | Fondator lipește | 10 min |
| Vineri | Sinteză răspunsuri Tally + update SUCCESS_CRITERIA + praguri | Director Marketing | — |
| Vineri | Follow-up la cei fără răspuns din săptămână | Fondator lipește | 15 min |

**Total timp fondator: ~45 min/săptămână.** Restul e pe Directorul Marketing.

---

## 5. Cum se maximizează feedback-ul (deja construit în demo)
1. **Ghid de bun-venit** la prima vizită → testerul știe ce să apese (nu abandonează confuz).
2. **Buton feedback mereu vizibil** → poate lăsa feedback oricând.
3. **Nudge automat** după ≥ 4 ecrane → prinde testerul angajat, exact când are ce spune.
4. **Formular scurt (~2 min)** + opțiune anonimă → barieră minimă.
5. **Î8 (contact opțional)** → transformă testerul anonim în lead cald.

---

## 6. Măsurare (fără unelte plătite)
- **Vizite demo:** Vercel Analytics (free) sau numărul de răspunsuri Tally ca proxy.
- **Feedback:** Tally Responses (count + medii Î3/Î4/Î7).
- **Contacte:** Î8 completat (listă de re-contactare la lansare).
- Prag de decizie: dacă Î4 (utilitate) media < 3/5 după 10 răspunsuri → ecranele confuze se refac înainte de a scala promovarea.

---

## 7. Limite oneste (ce NU pot face autonom)
- Nu pot posta pe conturile de social/WhatsApp ale fondatorului (nu am acces la credențiale) — de aceea lipirea rămâne la fondator (2 min/canal, conținut gata scris).
- Nu pot crea contul Tally în numele lui (necesită email-ul lui).
- Tot ce ține de **producție de conținut, mecanism, sinteză** — le fac eu integral.

---

*docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/EXECUTION_PLAN.md · v1.0.0 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
