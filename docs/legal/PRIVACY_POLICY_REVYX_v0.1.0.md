# Politica de Confidențialitate REVYX
<!-- PRIVACY_POLICY_REVYX_v0.1.0.md · v0.1.0 DRAFT · 2026-05 -->
<!-- ⚠️ DRAFT — necesită review legal extern pre-publicare. NU este document final. -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Status

⚠️ **DRAFT v0.1.0** — Acest document este un draft tehnic produs în M1.S1 Phase 0 Security Foundation. **Necesită review de la consultant juridic specializat GDPR + Legea 133/2011 RM înainte de publicare publică.** Versiunea finală va fi `v1.0.0` post-legal-sign-off (gating M1.S2 entry).

## 1. Identitate operator

**Operator de date:** ITPRO SYSTEM SRL · Republica Moldova · Chișinău
**Produs:** REVYX — Agent Operating System (AOS) pentru imobiliare
**DPO (Data Protection Officer):** [PENDING — appointment OD-legal-01]
**Contact privacy:** privacy@revyx.app

## 2. Temeiuri legale procesare (GDPR Art. 6)

| Activitate | Temei | Referință |
|---|---|---|
| Crearea cont agent imobiliar | Art. 6(1)(b) — contract | T&C de servicii |
| Procesare lead-uri (clienți potențiali) | Art. 6(1)(a) — consimțământ | Form web + WhatsApp opt-in |
| Procesare deal-uri închise | Art. 6(1)(f) — interes legitim | Operațional + retention legal |
| Marketing email | Art. 6(1)(a) — consimțământ | Opt-in dublu |
| Securitate + prevenire fraudă | Art. 6(1)(f) — interes legitim | AUDIT_LOG |
| Conformitate fiscală RM | Art. 6(1)(c) — obligație legală | Legea 1163-XIII contabilitate |

## 3. Categorii de date colectate

### 3.1 Date agent imobiliar (user)
- Identitate: nume, email, telefon
- Profesional: agenție, vechime, APS history
- Tehnice: IP, user-agent, ultima autentificare
- Securitate: hash parolă (argon2id, niciodată plaintext)

### 3.2 Date lead (client potențial)
- Contact: nume, telefon, email (capturate via form web / WhatsApp / webhook Meta/Google/OLX)
- Preferințe: zonă, buget, tip proprietate, camere
- Comportament: scoring LS/IS, interacțiuni înregistrate
- Sursă: web_form / whatsapp / phone / email / sms (`consent_channel`)

### 3.3 Date deal
- Tranzacție: stage, DP/DHI, comision generat (anonimizat post-erasure)
- Audit: toate evenimentele WRITE — Art. 5(1)(f) integritate

## 4. Drepturile dvs. (GDPR Art. 15-22)

| Drept | Art. | Endpoint API | Procedură |
|---|---|---|---|
| Acces | 15 | `GET /gdpr/access` | Export JSON propriile date în 30 zile |
| Rectificare | 16 | Manual (contact privacy@) | <30 zile |
| Ștergere | 17 | `POST /gdpr/erase` | Cascade LEAD→DEAL (anonimizat)→ACTIVITY (delete) în 30 zile |
| Restricție | 18 | `POST /gdpr/restrict` | Suspendare procesare temporară |
| Portabilitate | 20 | `GET /gdpr/portability` | JSON machine-readable structurat |
| Opoziție | 21 | Manual (contact privacy@) | <30 zile |
| Profilare automată | 22 | Niciun decizionalism automat — vezi BRD §9.4 + §10.1 | N/A |

**Reclamație:** la Centrul Național pentru Protecția Datelor cu Caracter Personal (CNPDCP) Moldova.

## 5. Retention

- **Date lead nesemnate:** 3 ani de la ultima activitate (NFR-10 BRD).
- **Date deal închise:** 10 ani (obligație fiscală RM Legea 1163-XIII).
- **AUDIT_LOG:** 7 ani hot+cold (per spec audit-log v1.1.0 §10).
- **Refresh tokens:** 7 zile (NFR-09).
- **Webhook signatures (dedup):** 90 zile rolling.

## 6. Transfer date

[PENDING — vendor list legal review · cross-ref `SCC_VENDORS_phase5_v1.0.2.md`]

## 7. Securitate

- JWT RS256 + RBAC 5 roluri
- TLS 1.3 minimum în transit
- Hash parolă argon2id
- AUDIT_LOG append-only PostgreSQL (BR-07)
- HMAC-SHA256 verificare webhook intake
- Rate limiting per BRD §9.2

## 8. Cookies

Vezi `COOKIE_POLICY_REVYX_v0.1.0.md`.

## 9. Modificări politică

Modificările materiale notifică prin email user-i activi cu 30 zile înainte. Versiunea curentă: `v0.1.0 DRAFT` · API expune versiunea în răspunsul `GET /gdpr/access`.

---

## Issues outstanding (legal review M1.S2 entry)

- [ ] OD-legal-01: numire DPO oficial (decizie ITPRO SYSTEM administrator)
- [ ] OD-legal-02: lista vendori procesatori SCC §6 (Hetzner, Vercel, Sendgrid, Twilio, etc.)
- [ ] OD-legal-03: traducere RO + RU + EN versiune finală
- [ ] OD-legal-04: review CNPDCP înregistrare operator (Legea 133/2011 RM Art. 17)
- [ ] OD-legal-05: alignement cu T&C servicii (separate doc)

---

*docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md · v0.1.0 DRAFT · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
