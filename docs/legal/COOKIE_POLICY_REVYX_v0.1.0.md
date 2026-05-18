# Politica de Cookies REVYX
<!-- COOKIE_POLICY_REVYX_v0.1.0.md · v0.1.0 DRAFT · 2026-05 -->
<!-- ⚠️ DRAFT — necesită review legal extern pre-publicare. -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Status

⚠️ **DRAFT v0.1.0** — Necesită review consultant juridic + alignement cu Banner Consent UI (M1.S5 implementare). Versiunea finală `v1.0.0` post-legal sign-off.

## 1. Ce sunt cookies

Fișiere mici stocate de browser pentru funcționalitate și măsurare. REVYX folosește categoriile:

| Categorie | Necesar | Procesat | Durată | Temei legal |
|---|---|---|---|---|
| **Strict necesare** | ✅ | Sesiune REVYX (JWT access token în memorie, NU cookie persistent) | Sesiune | Art. 6(1)(b) — contract |
| **Funcționale** | ❌ | `revyx.locale` (RO/RU/EN preference) | 1 an | Consimțământ Art. 6(1)(a) |
| **Analitice** | ❌ | [PENDING — Plausible/PostHog decision M1.S5] | 12 luni | Consimțământ Art. 6(1)(a) |
| **Marketing** | ❌ | Nu folosim | — | N/A |

## 2. Cookie banner

Banner-ul cu opt-in granular per categorie (necesar/funcțional/analitic) este implementat în Web frontend (apps/web M1.S5+). Refuzul cookie-urilor non-necesare nu degradează funcționalitatea de bază AOS.

## 3. Cookies de la terți

| Furnizor | Scop | Cookie | Politica |
|---|---|---|---|
| Vercel | Hosting + edge analytics | `_vercel_*` | https://vercel.com/legal/privacy-policy |
| Hetzner | Hosting BD (M1.S2+) | — (server-side only) | https://www.hetzner.com/legal/privacy-policy |

[PENDING — lista finală post legal review · OD-legal-02]

## 4. Managementul cookie-urilor

User poate revoca consimțământul prin banner re-trigger (`?cookies=manage`) sau prin setări browser. Revocarea **NU** afectează datele deja procesate cu consimțământul anterior.

## 5. Conformitate

- GDPR Art. 6(1)(a) — consimțământ explicit, granular, revocabil
- Directive ePrivacy (compliance via banner UI granular)
- Legea 133/2011 RM Art. 5 — temei legal procesare

## 6. Contact

privacy@revyx.app

---

## Issues outstanding (legal review M1.S2 entry)

- [ ] OD-cookie-01: decizie tool analytics (Plausible self-host vs PostHog vs Vercel native)
- [ ] OD-cookie-02: implementare banner UI granular în `apps/web/` (M1.S5)
- [ ] OD-cookie-03: cookie audit completion + adăugare la INDEX vendori SCC

---

*docs/legal/COOKIE_POLICY_REVYX_v0.1.0.md · v0.1.0 DRAFT · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
