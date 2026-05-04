# POLITICA DE CONFIDENȚIALITATE — REVYX
<!-- privacy-policy.md · v0.1.0 · 2026-05 -->
<!-- LEGAL_REVIEW_PENDING · CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> ⚠️ **STATUS: DRAFT v0.1 — LEGAL_REVIEW_PENDING**
> Acest document NU este publicabil. Necesită review de un avocat specializat în GDPR + dreptul de protecție a datelor personale din Republica Moldova (Legea nr. 133/2011 privind protecția datelor cu caracter personal) înainte de orice publicare. Versiune semnată de Legal va deveni v1.0.0.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 0.1.0 | 2026-05 | Senior PM (draft) | Schiță inițială bazată pe arhitectura tehnică REVYX (BRD, audit-log, webhook-intake, tenant-lifecycle) |

---

## Cuprins

1. [Operatorul de date](#1-operatorul-de-date)
2. [Categorii de date prelucrate](#2-categorii-de-date-prelucrate)
3. [Scopurile prelucrării](#3-scopurile-prelucrării)
4. [Temeiuri juridice](#4-temeiuri-juridice)
5. [Surse de date](#5-surse-de-date)
6. [Destinatari și împuterniciți](#6-destinatari-și-împuterniciți)
7. [Transferuri internaționale](#7-transferuri-internaționale)
8. [Termenele de păstrare](#8-termenele-de-păstrare)
9. [Drepturile persoanelor vizate](#9-drepturile-persoanelor-vizate)
10. [Securitatea datelor](#10-securitatea-datelor)
11. [Decizii automate & profilare](#11-decizii-automate--profilare)
12. [Cookies & tehnologii similare](#12-cookies--tehnologii-similare)
13. [Modificări ale politicii](#13-modificări-ale-politicii)
14. [Contact](#14-contact)

---

## 1. Operatorul de date

| Atribut | Detaliu |
|---|---|
| Operator | **ITPRO SYSTEM SRL** |
| Sediu | [LEGAL_REVIEW_PENDING — adresă oficială] |
| IDNO | [LEGAL_REVIEW_PENDING] |
| Email DPO | dpo@revyx.app *(de validat)* |
| Email general | privacy@revyx.app *(de validat)* |
| Telefon | [LEGAL_REVIEW_PENDING] |

REVYX este produsul operat de ITPRO SYSTEM SRL pentru agenți și agenții imobiliare din Republica Moldova.

---

## 2. Categorii de date prelucrate

### 2.1 Date despre lead-uri și clienți

| Categorie | Exemple | Sursă |
|---|---|---|
| Identificare | nume, prenume | formular web, Meta/Google/OLX, agent |
| Contact | telefon, email | idem |
| Intent imobiliar | tip proprietate, buget (interval), timeline, locație preferată | formular, conversație agent |
| Comportament | interacțiuni cu showcase link, clicks, vizionări programate | tracking intern (cu consimțământ) |
| Comunicații | mesaje WhatsApp/email schimb cu agentul | log sistem |

### 2.2 Date despre proprietăți

Date publice ale proprietăților (adresă generică, suprafață, preț) NU sunt date personale per se, dar pot fi asociate proprietarului (vânzător) — în acest caz datele acestuia sunt tratate la fel ca lead-urile (§2.1).

### 2.3 Date despre agenți & utilizatori interni

| Categorie | Exemple | Sursă |
|---|---|---|
| Cont utilizator | email, hash parolă, rol | înregistrare la angajator |
| Activitate profesională | task-uri, scoruri performanță (APS), istoric deal-uri | sistem |
| Audit & securitate | IP, user-agent, timestamp acțiuni | AUDIT_LOG |

### 2.4 Date tehnice

| Categorie | Exemple | Bază |
|---|---|---|
| Log-uri tehnice | IP, user-agent, request ID | interes legitim (securitate) |
| Cookies necesare | session ID, CSRF token | strict necesare — fără consimțământ |
| Cookies analytics/marketing | după caz | consimțământ explicit (vezi Cookie Policy) |

---

## 3. Scopurile prelucrării

| Scop | Descriere | Categorii de date implicate |
|---|---|---|
| S1. Calificare lead | Calculul Lead Score (LS) pentru a determina dacă lead-ul ajunge la un agent | identificare, contact, intent, comportament |
| S2. Matching buyer-property | Sugerare proprietăți relevante (Match Engine, DP) | intent, comportament |
| S3. Gestiune tranzacție | Programare vizionări, oferte, semnare la notar | toate categoriile §2.1 |
| S4. Comunicare | WhatsApp/email cu agentul (templates pre-aprobate Meta) | contact, comunicații |
| S5. Performanță agenți | Calcul APS, raportare către management | activitate agent |
| S6. Audit & securitate | AUDIT_LOG append-only pentru toate acțiunile WRITE (BR-07) | audit & securitate |
| S7. Conformitate legală | Răspuns la cereri autorități, dovedire consimțământ | toate, după caz |

---

## 4. Temeiuri juridice

| Temei (GDPR / Legea 133/2011) | Aplicabil pentru |
|---|---|
| **Consimțământ** (art. 6(1)(a) GDPR) | S1, S2, S4 când lead-ul este captat din canal cu consent flow (Meta/Google/OLX) |
| **Executarea contractului** (art. 6(1)(b)) | S3 — clienți/vânzători cu mandat semnat |
| **Interes legitim** (art. 6(1)(f)) | S6 securitate, prevenirea fraudei (echilibrare cu drepturile vizatului) |
| **Obligație legală** (art. 6(1)(c)) | S7 — păstrare AUDIT_LOG 7 ani conform legislației aplicabile |

---

## 5. Surse de date

| Sursă | Detaliu | Verificare |
|---|---|---|
| Direct de la persoana vizată | formular web, conversație agent | obligatorie |
| Meta Lead Ads (Facebook/Instagram) | webhook HMAC-SHA256 verificat | webhook-intake §6.1 |
| Google Lead Ads | webhook semnat | webhook-intake §6.2 |
| OLX | webhook HMAC-SHA256 | webhook-intake §6.3 |
| Indirect (referral) | recomandare de la alt client | declarat de agent |

---

## 6. Destinatari și împuterniciți

### 6.1 Destinatari

- Agenții și agenții imobiliare client REVYX (în limita rolului RBAC: agent, senior_agent, team_lead, manager, admin · plus rolurile custom owner, network_lead, network_member, franchise_admin)
- Notari publici, băncile finanțatoare — doar la cerere explicită a clientului pentru semnare/credit

### 6.2 Împuterniciți (sub-procesatori)

| Sub-procesator | Serviciu | Locație | Notă |
|---|---|---|---|
| [LEGAL_REVIEW_PENDING — provider Auth] (Supabase / Auth0) | Autentificare | UE / SUA | DPA semnat |
| [LEGAL_REVIEW_PENDING — provider DB] (PostgreSQL hosted) | Bază de date | UE | DPA semnat |
| Meta Platforms Ireland Ltd. | WhatsApp Business API · Meta Lead Ads | UE / SUA | DPA Meta + SCC |
| Google Ireland Ltd. | Google Lead Ads | UE / SUA | DPA Google + SCC |
| OLX Group | OLX Webhooks | UE | DPA OLX |
| [LEGAL_REVIEW_PENDING — provider cold storage] (S3) | Backup imutabil + arhivare audit log | UE | DPA + SCC |
| Cloudflare / [provider WAF] | Edge security, rate limiting | global | DPA + SCC |

Lista completă și actualizată: disponibilă la cerere · privacy@revyx.app

---

## 7. Transferuri internaționale

Unele sub-procesatori pot stoca/prelucra date în afara Spațiului Economic European (SEE):
- **Meta**, **Google** — bazat pe Standard Contractual Clauses (SCC) ale Comisiei Europene + masuri suplimentare (TIA — Transfer Impact Assessment în curs).
- Backup-uri preferențial în UE (de validat per provider).

---

## 8. Termenele de păstrare

| Tip date | Durată | Sursă |
|---|---|---|
| Lead activ | Pe durata relației + **3 ani** de la ultima activitate | NFR-10 BRD §6.2 |
| Lead inactiv (rece) | 3 ani de la creare dacă nicio interacțiune | NFR-10 |
| Date contractuale (deal închis) | **10 ani** (obligație legală) | Legea contabilității RM |
| AUDIT_LOG | **7 ani** | TECH_SPEC audit-log §10.3 + obligații conformitate |
| Backup-uri imutabile (post-erasure tenant) | **7 ani** legal hold | WORKFLOW tenant-lifecycle §7 |
| Webhook payload raw | **90 zile** | TECH_SPEC webhook-intake §10.3 |
| Cookies analytics | conform Cookie Policy | — |

La cererea de ștergere, ne conformăm cu termenele legale superioare (ex: 10 ani date contractuale).

---

## 9. Drepturile persoanelor vizate

Conform GDPR art. 15-22 și Legea 133/2011 RM:

| Drept | Cum se exercită |
|---|---|
| Acces | Cerere la `privacy@revyx.app` · răspuns ≤ 30 zile |
| Rectificare | Cerere către agentul responsabil sau privacy@ |
| Ștergere („dreptul de a fi uitat") | privacy@revyx.app · cascade GDPR documentată în WORKFLOW tenant-lifecycle §7 |
| Restricționarea prelucrării | privacy@revyx.app |
| Portabilitate | Export structurat (JSON/CSV) · privacy@revyx.app |
| Opoziție | Pentru prelucrări bazate pe interes legitim |
| Retragere consimțământ | În orice moment, fără afectarea legalității prelucrării anterioare |
| Plângere la autoritatea de supraveghere | **Centrul Național pentru Protecția Datelor cu Caracter Personal (CNPDCP)** — RM · sau autoritatea competentă din statul de reședință |

---

## 10. Securitatea datelor

Măsuri implementate:

| Categorie | Măsură |
|---|---|
| Autentificare | JWT RS256 · access 15 min · refresh 7 zile cu rotație · single session per agent (BR-12) |
| Autorizare | RBAC 5 system roles + 4 custom roles · last-owner protection |
| Criptare în tranzit | TLS 1.3 obligatoriu pe toate endpoint-urile |
| Criptare la rest | KMS-managed pentru secrete · encrypted column pentru webhook secrets |
| Audit | AUDIT_LOG append-only la nivel BD (trigger BLOCK UPDATE/DELETE) |
| Webhook intake | HMAC-SHA256 verificat înainte de parse · replay protection ±5 min |
| Backup | PITR 35 zile · backup imutabil semnat GPG · arhivare cold storage |
| Acces personal | Privilegii minim necesare · 4-eyes pentru acțiuni critice (delete tenant, transfer ownership) |
| Monitoring | Alertare automată pe pattern-uri suspecte (HMAC fail, append-only violation) |

---

## 11. Decizii automate & profilare

REVYX folosește **scoring AI** (LS, PS, IS, DP, NBA, TS, APS, DHI) pentru:

| Decizie automată | Impact pentru persoană | Drept de revizuire umană |
|---|---|---|
| Lead Firewall (LS < 0.60 nu ajunge la agent) | Lead-ul intră în nurturing automat fără agent | Manager Override disponibil (BR-01) · cerere review pe canal direct |
| Match Engine sugerează proprietăți | Sugestie, nu obligație — agentul decide | Lead poate cere alte sugestii agentului |
| NBA ordonează task-urile agentului | Agent poate reordona manual | Nu afectează direct lead-ul |

**Persoanele vizate au dreptul de a:**
- Solicita intervenție umană
- Exprima punctul de vedere
- Contesta decizia

Pentru contestații: privacy@revyx.app

---

## 12. Cookies & tehnologii similare

Detalii complete în [`docs/legal/cookie-policy.md`](./cookie-policy.md).

Pe scurt:
- **Cookies necesare** (session, CSRF) — fără consimțământ
- **Cookies analytics** — cu consimțământ explicit
- **Cookies marketing** — cu consimțământ explicit
- Banner CMP (Consent Management Platform) afișat la prima vizită

---

## 13. Modificări ale politicii

Versiunea curentă: **v0.1.0 (DRAFT)** · Data: **2026-05**

Modificările materiale vor fi notificate cu **30 zile înainte** de intrarea în vigoare prin:
- Email către utilizatorii înregistrați
- Banner în aplicație
- Versionare semantică pe acest document

Istoric versiuni: vezi Changelog la începutul documentului.

---

## 14. Contact

| Pentru | Email |
|---|---|
| Cereri privind datele personale | privacy@revyx.app |
| DPO (Data Protection Officer) | dpo@revyx.app |
| Securitate (vulnerabilități) | security@revyx.app |
| Suport general | support@revyx.app |

**Adresă poștală:** ITPRO SYSTEM SRL · [LEGAL_REVIEW_PENDING]

---

## Anexă A — Mapping spec tehnică

| Cerință din politică | Implementare tehnică |
|---|---|
| Consent capturat la intake | TECH_SPEC webhook-intake §12.2 |
| AUDIT_LOG append-only | TECH_SPEC audit-log §6 |
| Erasure cascade | WORKFLOW tenant-lifecycle §7 |
| HMAC-SHA256 webhooks | TECH_SPEC webhook-intake §6 |
| RBAC 5+4 roluri | BRD §10 + TECH_SPEC tenancy-roles-extension |
| Scoring AI (decizii automate) | BRD §7 (8 formule) |

---

*docs/legal/privacy-policy.md · v0.1.0 · 2026-05 · LEGAL_REVIEW_PENDING · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
