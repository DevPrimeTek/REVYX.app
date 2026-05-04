# POLITICA DE COOKIES — REVYX
<!-- cookie-policy.md · v0.1.0 · 2026-05 -->
<!-- LEGAL_REVIEW_PENDING · CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> ⚠️ **STATUS: DRAFT v0.1 — LEGAL_REVIEW_PENDING**
> Listele de cookies de mai jos sunt **provizorii** și trebuie validate față de implementarea finală a aplicației. Necesită review legal + scan automat al cookies-urilor reale (ex: prin OneTrust, Cookiebot) înainte de publicare. Versiune semnată de Legal va deveni v1.0.0.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 0.1.0 | 2026-05 | Senior PM (draft) | Schiță inițială bazată pe stack-ul planificat (Auth, CMP, analytics) |

---

## Cuprins

1. [Ce sunt cookies-urile](#1-ce-sunt-cookies-urile)
2. [Tipuri de cookies utilizate](#2-tipuri-de-cookies-utilizate)
3. [Lista cookies (provizorie)](#3-lista-cookies-provizorie)
4. [Bază legală & consimțământ](#4-bază-legală--consimțământ)
5. [Gestionarea preferințelor](#5-gestionarea-preferințelor)
6. [Cookies de la terți](#6-cookies-de-la-terți)
7. [Showcase Links — tracking specific](#7-showcase-links--tracking-specific)
8. [Modificări ale politicii](#8-modificări-ale-politicii)
9. [Contact](#9-contact)

---

## 1. Ce sunt cookies-urile

Cookies sunt fișiere text mici stocate în browser-ul utilizatorului. Pot fi:
- **Cookies de sesiune** — șterse la închiderea browser-ului
- **Cookies persistente** — rămân pentru o durată specificată
- **First-party** — setate de domeniul vizitat (revyx.app)
- **Third-party** — setate de terți (Google, Meta etc.)

REVYX utilizează cookies + tehnologii similare (localStorage, sessionStorage, IndexedDB) pentru funcționarea aplicației și — cu consimțământ — pentru analytics și marketing.

---

## 2. Tipuri de cookies utilizate

| Tip | Necesar consimțământ? | Bază legală |
|---|---|---|
| **Strict necesare** | NU | Interes legitim — funcționarea serviciului |
| **Funcționale** | DA (opt-in soft) | Consimțământ |
| **Analytics** | DA (opt-in explicit) | Consimțământ |
| **Marketing** | DA (opt-in explicit) | Consimțământ |

---

## 3. Lista cookies (provizorie)

### 3.1 Strict necesare

| Cookie | Furnizor | Scop | Durată |
|---|---|---|---|
| `revyx_session` | revyx.app | Identificator de sesiune autentificat | Sesiune |
| `revyx_csrf` | revyx.app | Protecție CSRF | Sesiune |
| `revyx_locale` | revyx.app | Limba interfeței (RO/RU/EN) | 1 an |
| `revyx_tenant` | revyx.app | Tenant context post-login | Sesiune |
| `cf_clearance` *(de validat)* | Cloudflare | Anti-bot WAF | 30 min |

### 3.2 Funcționale

| Cookie | Furnizor | Scop | Durată |
|---|---|---|---|
| `revyx_theme` | revyx.app | Preferință temă (forțat dark navy în brand) | 1 an |
| `revyx_layout` | revyx.app | Preferință layout dashboard agent | 1 an |

### 3.3 Analytics *(de validat după alegere provider)*

| Cookie | Furnizor | Scop | Durată |
|---|---|---|---|
| `_ga` | [LEGAL_REVIEW_PENDING — Google Analytics 4 sau Plausible] | Trafic agregat | 2 ani |
| `_ga_<ID>` | Google Analytics | Statistici sesiune | 2 ani |

> Recomandare arhitectură: preferăm Plausible/Matomo (privacy-first, fără cookies) sau GA4 cu Consent Mode v2 + IP anonymization.

### 3.4 Marketing *(opțional, doar dacă activat)*

| Cookie | Furnizor | Scop | Durată |
|---|---|---|---|
| `_fbp` | Meta | Atribuire Facebook Lead Ads | 90 zile |
| `_gcl_au` | Google | Atribuire Google Ads | 90 zile |

---

## 4. Bază legală & consimțământ

| Categorie | Bază legală |
|---|---|
| Strict necesare | Art. 6(1)(f) GDPR — interes legitim · neoptabilă |
| Funcționale | Art. 6(1)(a) GDPR — consimțământ (poate fi opt-in soft, prin folosire continuă) |
| Analytics | Art. 6(1)(a) — consimțământ explicit prin CMP banner |
| Marketing | Art. 6(1)(a) — consimțământ explicit, granular per furnizor |

CMP (Consent Management Platform) afișează banner la prima vizită, conform GDPR + ePrivacy.

---

## 5. Gestionarea preferințelor

Utilizatorul poate:
- Modifica preferințele în orice moment prin **link „Setări cookies"** în footer
- Bloca/șterge cookies din browser (Settings → Privacy)
- Folosi opțiunea „Do Not Track" — REVYX respectă semnalul unde este tehnic posibil

**Atenție:** blocarea cookies-urilor strict necesare poate face aplicația inutilizabilă.

---

## 6. Cookies de la terți

| Terț | Cookie-uri setate | Scop | Politica lor |
|---|---|---|---|
| Meta Platforms Ireland | `_fbp`, `fr` | Atribuire Lead Ads, WhatsApp Business widget | https://www.facebook.com/policy.php |
| Google Ireland | `_ga`, `_gcl_au` | Analytics, Lead Ads | https://policies.google.com/privacy |
| Cloudflare | `cf_clearance`, `__cf_bm` | WAF, anti-bot | https://www.cloudflare.com/privacypolicy/ |

REVYX nu are control direct asupra cookies-urilor terților. Utilizatorul poate refuza prin CMP la prima vizită.

---

## 7. Showcase Links — tracking specific

[Property Showcase Links](../BRD_REVYX_v1.0.0.md) (link-uri publice unice cu token 6 caractere) implementează tracking pentru calculul **Interaction Strength (IS)** componenta `RF_show` (Return visits Showcase).

| Mecanism | Detaliu |
|---|---|
| **First-party only** | Niciun terț pe pagina showcase |
| **Cookie** `revyx_showcase_visit_<token>` | Detectare vizite repetate · 30 zile |
| **Pixel-free** | Fără pixel-uri Meta/Google pe pagina showcase |
| **Rate limit** | 20 req/oră per IP (NFR-07) |
| **Consimțământ** | Banner condensat afișat la prima încărcare a fiecărui showcase unic |

Vizitatorii showcase NU sunt înregistrați automat ca lead-uri — doar dacă completează un formular cu consent explicit GDPR.

---

## 8. Modificări ale politicii

Versiunea curentă: **v0.1.0 (DRAFT)** · Data: **2026-05**

Lista cookies-urilor poate fi actualizată fără notificare prealabilă atunci când:
- Adăugăm/eliminăm un sub-procesator
- Modificăm un cookie strict necesar pentru funcționarea aplicației

Modificările care afectează cookies-urile cu consimțământ vor declanșa **re-afișarea CMP**.

---

## 9. Contact

| Pentru | Email |
|---|---|
| Întrebări despre cookies | privacy@revyx.app |
| DPO | dpo@revyx.app |

Vezi și: [`docs/legal/privacy-policy.md`](./privacy-policy.md)

---

## Anexă A — Mapping spec tehnică

| Tracking | Implementare |
|---|---|
| `revyx_showcase_visit_<token>` → IS.RF_show | BRD §7.3 (formula IS) |
| `revyx_session` → AUTH | TECH_SPEC tenancy-roles-extension §6.2 (JWT) |
| `revyx_csrf` | Stack standard (Fastify CSRF middleware) |
| Rate limit Cloudflare | TECH_SPEC webhook-intake §12.1 + NFR-05 |

---

*docs/legal/cookie-policy.md · v0.1.0 · 2026-05 · LEGAL_REVIEW_PENDING · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
