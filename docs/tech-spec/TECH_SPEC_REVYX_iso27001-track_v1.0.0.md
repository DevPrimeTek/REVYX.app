# TECH SPEC — ISO 27001:2022 CERTIFICATION TRACK
<!-- TECH_SPEC_REVYX_iso27001-track_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Security Lead + Compliance Auditor | ★ Spec inițială S8 — gap analysis ISO 27001:2022 Annex A · roadmap certificare (gap → remediation → internal audit → external audit) · controale deja implementate (RBAC, audit log, KMS, IR, DPIA, TIA) mapate · controale lipsă (asset inventory, ISMS scope, SoA, supplier security) · timeline 12-18 luni |

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview (ISMS)](#2-architecture-overview-isms)
3. [Stack & Documentation Set](#3-stack--documentation-set)
4. [Controls Mapping (Annex A 2022)](#4-controls-mapping-annex-a-2022)
5. [Gap Analysis](#5-gap-analysis)
6. [Remediation Plan](#6-remediation-plan)
7. [Internal Audit](#7-internal-audit)
8. [External Audit Stage 1+2](#8-external-audit-stage-12)
9. [Statement of Applicability (SoA)](#9-statement-of-applicability-soa)
10. [Supplier Security Assessment](#10-supplier-security-assessment)
11. [Asset Inventory](#11-asset-inventory)
12. [Risk Assessment & Treatment](#12-risk-assessment--treatment)
13. [Continuous Compliance & Surveillance](#13-continuous-compliance--surveillance)
14. [Metrics & KPIs](#14-metrics--kpis)
15. [Timeline & Milestones](#15-timeline--milestones)
16. [Roles & Responsibilities](#16-roles--responsibilities)
17. [Migration / Operational Changes](#17-migration--operational-changes)
18. [Risks & Mitigations](#18-risks--mitigations)
19. [Impact Assessment](#19-impact-assessment)

---

## 1. Executive Summary

★ **ISO 27001 Track** definește roadmap-ul de la stadiul curent (controale tehnice mature post-S5/S6/S7) la **certificare ISO/IEC 27001:2022** într-o fereastră estimată **12-18 luni**. Acest document NU este un Tech Spec de produs ci o **specificație de program de conformitate** care pune bazele documentare și operaționale ale unui ISMS (Information Security Management System).

| Atribut | Valoare |
|---|---|
| **Scope** | Gap analysis Annex A 2022 (93 controale) · plan remediation pentru gaps · ISMS scope document · SoA · supplier security · asset inventory · roadmap audit intern + extern |
| **Standard** | ISO/IEC 27001:2022 + Annex A controls 5/6/7/8 (organizational/people/physical/technological) |
| **Aria certificată** | Platforma REVYX SaaS · staff REVYX/ITPRO · medii dev/staging/prod · suppliers critici |
| **Phase** | 5 (Maturitate platformă) |
| **Owner program** | Security Lead (CISO interim) + Compliance Auditor + DPO |
| **Estimare timeline** | 12-18 luni (preferabil 14 luni pentru buffer audit) |
| **Buget estimat (out-of-scope spec)** | Audit firm Stage 1+2 · consultant external · tooling GRC |

**Rezultate țintă:**

1. **Gap analysis** completă cu severitate (CRIT/HIGH/MED/LOW) și owner per control.
2. **ISMS Manual** cu policies, procedures, scope, context.
3. **SoA** semnat de management cu justificare per control.
4. **Asset Inventory** complet (tehnic + informații + procese).
5. **Risk Assessment & Treatment Plan** revizuit anual.
6. **Internal audit pass** înainte de Stage 2 extern.
7. **Certificat ISO 27001:2022** emis de body acreditat (UKAS/IAF).

---

## 2. Architecture Overview (ISMS)

```
┌────────────────────────────────────────────────────────────────┐
│                  ISMS — REVYX                                  │
│                                                                │
│  Context (Cl. 4)         Leadership (Cl. 5)                    │
│  ├ Issues internal/ext    ├ Policy ISMS signed                 │
│  ├ Stakeholders           ├ Roles: CISO/DPO/IT/Eng             │
│  └ Scope (in/out)         └ Mgmt review trimestrial            │
│                                                                │
│  Planning (Cl. 6)         Support (Cl. 7)                      │
│  ├ Risk assessment        ├ Resources budget                   │
│  ├ Risk treatment plan    ├ Awareness (training annual)        │
│  ├ Objectives KPI         ├ Comm plan (internal/external)      │
│  └ Change planning        └ Documented info ctrl               │
│                                                                │
│  Operation (Cl. 8)        Performance (Cl. 9)                  │
│  ├ Controls Annex A       ├ Monitoring + measurement           │
│  ├ Risk treatment exec    ├ Internal audit                     │
│  └ Incident response      └ Mgmt review                        │
│                                                                │
│  Improvement (Cl. 10)                                          │
│  └ Continuous improvement, NC + corrective actions             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 2.1 Documentation set obligatoriu

| Document | Tip | Locație target |
|---|---|---|
| ISMS Manual | Policy framework | `docs/iso27001/ISMS_MANUAL_v1.0.0.md` |
| ISMS Scope Statement | Definire perimetru | `docs/iso27001/ISMS_SCOPE_v1.0.0.md` |
| Information Security Policy | High-level policy | `docs/iso27001/POL_INFOSEC_v1.0.0.md` |
| Acceptable Use Policy | Pentru staff | `docs/iso27001/POL_AUP_v1.0.0.md` |
| Access Control Policy | RBAC + provisioning | `docs/iso27001/POL_ACCESS_v1.0.0.md` |
| Cryptography Policy | KMS, ciphers approved | `docs/iso27001/POL_CRYPTO_v1.0.0.md` |
| Incident Response Procedure | IR plan | `docs/iso27001/PROC_IR_v1.0.0.md` |
| Business Continuity / DR | RPO/RTO definitions | `docs/iso27001/PROC_BCDR_v1.0.0.md` |
| Supplier Security Policy | Vendor mgmt | `docs/iso27001/POL_SUPPLIER_v1.0.0.md` |
| SoA (Statement of Applicability) | 93 controale tabel | `docs/iso27001/SoA_v1.0.0.md` |
| Risk Register | Living doc | `docs/iso27001/RISK_REGISTER_v1.0.0.md` |
| Asset Inventory | Living doc | `docs/iso27001/ASSET_INVENTORY_v1.0.0.md` |

---

## 3. Stack & Documentation Set

| Layer | Tehnologie | Rol |
|---|---|---|
| GRC tooling | Vanta / Drata / open-source (e.g. ComplianceTrak) | Continuous evidence collection |
| Asset inventory | combine cloud inventory (AWS Config) + manual register | CRIT |
| SIEM / Audit log | Existing `audit-log` v1.0.0 + log retention 365d | OK |
| Vulnerability scanning | Snyk / Dependabot + Trivy container | Tech control |
| Penetration testing | External pentest annual + ad-hoc | Required pre-audit |
| Awareness training | KnowBe4 / open-source LMS | People controls |
| Policy mgmt | Git versioned + review approvals | Documentation control |

---

## 4. Controls Mapping (Annex A 2022)

ISO 27001:2022 Annex A reorganizate în **4 grupe** (93 total): Organizational (37), People (8), Physical (14), Technological (34).

### 4.1 Controale **deja implementate** (S0-S7) — mapped

| Annex A # | Nume | Implementat în | Status |
|---|---|---|---|
| **A.5.1** | Policies for information security | Phase 0 + CLAUDE.md operating rules | OK partial — necesită formalizare |
| **A.5.7** | Threat intelligence | Sentry alerts + audit-log monitoring | OK partial |
| **A.5.10** | Acceptable use of information & assets | NEW (gap) | TODO |
| **A.5.12** | Classification of information | Tenant data classification CONFIDENȚIAL | OK |
| **A.5.13** | Labelling of information | Header docs CONFIDENȚIAL | OK |
| **A.5.15** | Access control | RBAC 5 roluri (`tenancy-roles-extension`) | OK |
| **A.5.16** | Identity management | Auth0/Supabase Auth JWT RS256 | OK |
| **A.5.17** | Authentication information | Refresh rotation + single session BR-12 | OK |
| **A.5.18** | Access rights | RBAC matrix · provisioning audit | OK |
| **A.5.19-22** | Supplier relationships | NEW (gap §10) | TODO |
| **A.5.23** | Cloud services | AWS shared responsibility documented | OK partial |
| **A.5.24-28** | Information security incident management | Incident Response procedure | OK partial — necesită procedure formal |
| **A.5.29-30** | Business continuity | NEW (gap) — RPO/RTO defined | TODO formal doc |
| **A.5.31-37** | Compliance, IP, privacy | DPIA + GDPR Privacy/Cookie Policy + Legea 133/2011 | OK |
| **A.6.1-8** | People controls (background, training, NDA, terms) | Partial (HR processes ITPRO) | OK partial |
| **A.7.1-14** | Physical & environmental | Cloud-native (AWS DC); office controls minimum | OK partial |
| **A.8.1** | User endpoint devices | MDM partial (Jamf/Intune) | TODO formalize |
| **A.8.2** | Privileged access | RBAC `admin` 4-eyes (`ml-pricing-ga`) · audit | OK |
| **A.8.3** | Information access restriction | RLS PostgreSQL · multi-tenant | OK |
| **A.8.5** | Secure authentication | JWT RS256 + MFA admin | OK partial — MFA all staff TODO |
| **A.8.6** | Capacity management | Monitoring + autoscaling | OK |
| **A.8.7** | Protection against malware | EDR endpoints + container scanning | OK partial |
| **A.8.8** | Management of technical vulnerabilities | Snyk + Dependabot + monthly review | OK partial — formalize SLA |
| **A.8.9** | Configuration management | IaC Terraform + Git | OK |
| **A.8.10** | Information deletion | GDPR erasure flows + retention 90d/365d | OK |
| **A.8.11** | Data masking | PII masking buyer profiles · structured logs no PII | OK |
| **A.8.12** | Data leakage prevention | Egress controls + secret scanning | OK partial |
| **A.8.13** | Information backup | Daily DB backup + 30d retention | OK partial — DR test obligatoriu |
| **A.8.14** | Redundancy | Multi-AZ Postgres + multi-region S3 | OK partial |
| **A.8.15** | Logging | `audit-log` v1.0.0 append-only | OK ✓ |
| **A.8.16** | Monitoring activities | Prometheus + alerting | OK |
| **A.8.17** | Clock synchronization | NTP servers AWS | OK |
| **A.8.18** | Use of privileged utility programs | Restricted shell access prod | OK partial |
| **A.8.19** | Installation of software | Allow-list endpoint software | TODO formalize |
| **A.8.20-22** | Network security | VPC + WAF + segmentation | OK |
| **A.8.23** | Web filtering | Egress proxy | OK partial |
| **A.8.24** | Use of cryptography | TLS 1.2+ · KMS · DKIM · password Argon2id | OK |
| **A.8.25-27** | Secure development | SAST + code review + threat modeling | OK partial |
| **A.8.28** | Secure coding | Standards CLAUDE.md + lint rules | OK |
| **A.8.29** | Security testing | Pentest annual + CI tests | TODO scheduling formal |
| **A.8.30** | Outsourced development | NEW (gap) | TODO |
| **A.8.31-32** | Separation of environments | dev/staging/prod isolated | OK |
| **A.8.33** | Test information | Synthetic data only | OK |
| **A.8.34** | Audit information protection | AUDIT_LOG append-only + KMS | OK ✓ |

(Lista completă Annex A 5/6/7/8 — total 93 controale — în SoA §9 cu mapping, justificare aplicabilitate, dovezi.)

---

## 5. Gap Analysis

### 5.1 Sumar gap-uri identificate (severitate)

| ID | Control | Gap | Severitate | Owner | Effort (zile) |
|---|---|---|---|---|---|
| G-01 | A.5.1 / 5.10 | Policies (InfoSec, AUP) lipsesc formal — există în pieces (CLAUDE.md) | HIGH | CISO | 10 |
| G-02 | A.5.19-22 | Supplier security assessment process lipsă | HIGH | CISO + Procurement | 15 |
| G-03 | A.5.24-28 | Incident Response procedure formală (run-book + tabletop annual) | HIGH | Security Lead | 10 |
| G-04 | A.5.29-30 | BCDR plan formal cu RPO/RTO test annual | HIGH | DevOps + Security | 12 |
| G-05 | A.6.3 | Awareness training pentru toți staff (annual) | HIGH | HR + CISO | 8 |
| G-06 | A.6.5 | Disciplinary process for security violations | MED | HR | 3 |
| G-07 | A.7.1-4 | Physical security policy (offices ITPRO) | MED | Office Mgr | 5 |
| G-08 | A.8.1 | MDM enrollment formalizat 100% staff | MED | IT | 7 |
| G-09 | A.8.5 | MFA mandatoriu pentru toți utilizatorii staff (acum doar admin) | HIGH | Security Lead | 5 |
| G-10 | A.8.8 | Vulnerability mgmt SLA (CRITICAL ≤7d, HIGH ≤30d) formal | HIGH | Eng Lead | 4 |
| G-11 | A.8.13 | DR test (restore from backup) annual | CRIT | DevOps | 8 |
| G-12 | A.8.19 | Software allow-list endpoint formal | LOW | IT | 5 |
| G-13 | A.8.29 | Pentest scheduling annual + remediation tracking | HIGH | Security Lead | 4 |
| G-14 | A.8.30 | Outsourced development security clauses (contracts) | MED | Legal + Security | 6 |
| **G-15** | Doc | **ISMS Scope Statement** (perimetru certificare) | **CRIT** | CISO | 5 |
| **G-16** | Doc | **Asset Inventory** complete (tech + info + processes) | **CRIT** | CISO + DevOps | 15 |
| **G-17** | Doc | **Statement of Applicability (SoA)** | **CRIT** | CISO + Compliance | 10 |
| **G-18** | Process | Risk Assessment formal (methodology + review annual) | HIGH | Security Lead | 8 |
| G-19 | Process | Internal audit program (anual + checklist) | HIGH | Compliance + extern auditor | 10 |
| G-20 | Process | Management Review trimestrial (board / CTO) | MED | CISO | 4 |
| G-21 | Process | Documented Information Control (versioning policy) | MED | CISO | 3 |
| G-22 | Process | Change management security review | MED | Eng Lead + Security | 5 |
| G-23 | Process | Cryptography Policy (approved ciphers/key lifetimes) | MED | Security Lead | 4 |

**Total effort estimat:** ~166 person-days = ~8 luni 1 FTE Security + part-time other roles.

### 5.2 Severity definitions

| Severitate | Descriere |
|---|---|
| **CRIT** | Blocator pentru certificare; fără asta, audit Stage 2 nu e fezabil |
| **HIGH** | Major non-conformity Stage 2; trebuie rezolvat înainte de audit |
| **MED** | Minor non-conformity; OK la Stage 2 cu plan corective |
| **LOW** | Observation / improvement opportunity |

---

## 6. Remediation Plan

### 6.1 Stream Documentation (CRIT/HIGH gaps G-01, G-15, G-16, G-17, G-23)

| Săpt | Output |
|---|---|
| 1-2 | ISMS Scope Statement (G-15) — boundary tehnic + organizational |
| 3-4 | InfoSec Policy + AUP + Access + Crypto policies (G-01, G-23) |
| 5-7 | Asset Inventory v1 (G-16) — discovery + classification |
| 8-9 | SoA draft (G-17) — toate 93 controale cu mapping |
| 10 | Mgmt review + sign-off documente |

### 6.2 Stream Process (G-02, G-03, G-04, G-13, G-18, G-19, G-20)

| Săpt | Output |
|---|---|
| 6-8 | Incident Response procedure + tabletop scenario library (G-03) |
| 9-11 | BCDR plan + RPO/RTO formal + DR test plan (G-04) |
| 12-14 | Supplier security assessment process + scoring + onboarding template (G-02) |
| 15-16 | Risk Assessment methodology + initial run (G-18) |
| 17-18 | Internal audit program + checklist Annex A (G-19) |
| 19 | Mgmt review process formal (G-20) |
| 20 | Pentest annual scheduled + RFP issued (G-13) |

### 6.3 Stream Tehnic (G-09, G-10, G-11)

| Săpt | Output |
|---|---|
| 4-5 | MFA mandatory all staff rollout (G-09) |
| 6-7 | Vulnerability mgmt SLA documentat + tooling tickets auto-create (G-10) |
| 12-14 | DR test execution (G-11) — restore în staging din backup |

### 6.4 Stream People (G-05, G-06, G-08)

| Săpt | Output |
|---|---|
| 8-12 | Awareness training rollout (G-05) — module RO/RU/EN + tracking |
| 10 | Disciplinary process (G-06) |
| 11-13 | MDM enrollment 100% (G-08) |

### 6.5 DR Test (G-11) detail

```
T0: Snapshot prod DB → restore staging (RTO target 4h, RPO target 1h)
T0+1h: Validate data integrity (row counts, checksums on key tables)
T0+2h: Smoke test app pointing at staging restored
T0+4h: Document timing + issues + lessons → BCDR doc updated
Frequency: bi-anual (March + September)
Pass criteria: RTO ≤4h, RPO ≤1h, zero data corruption.
```

---

## 7. Internal Audit

### 7.1 Program

- **Frecvență:** annual full Annex A · trimestrial sample-based.
- **Auditor:** independent față de team auditat — extern hire sau cross-team REVYX (CISO NU auditează policies CISO).
- **Output:** Audit report cu findings (NC major/minor/observation) + corrective actions tracker.

### 7.2 Checklist (extras)

- [ ] AUDIT_LOG access pentru sample 10 evenimente CRIT (no UPDATE/DELETE possible)?
- [ ] RBAC matrix corespunde implementării (test 5 roles × 10 endpoints)?
- [ ] MFA active 100% staff?
- [ ] Backup restore test în ultimele 6 luni?
- [ ] Pentest report cu remediation status?
- [ ] Awareness training completion rate ≥95%?
- [ ] SoA reflectă realitatea controalelor?
- [ ] Risk register reviewed în ultimele 12 luni?
- [ ] Supplier assessments la zi pentru top 10 vendors?
- [ ] Incident response — tabletop run în ultimele 12 luni?

### 7.3 Pre-Stage 2 readiness

Internal audit pass cu ≤3 minor NCs · zero major NC. Findings remediate sau cu plan formal acceptat de CISO.

---

## 8. External Audit Stage 1+2

### 8.1 Stage 1 (Documentation Review)

- **Durată:** 2-3 zile.
- **Scope:** ISMS docs, SoA, Risk register, Asset inventory, internal audit report, mgmt reviews.
- **Output:** Stage 1 report cu readiness assessment pentru Stage 2; gaps documentați.

### 8.2 Stage 2 (Implementation Audit)

- **Durată:** 5-8 zile (function of scope size).
- **Scope:** sample-based testing pe controale critice + interviuri staff + tehnice.
- **Output:** Stage 2 report cu findings:
  - **Major NC** → blochează certificare; corective + re-audit segment.
  - **Minor NC** → corective plan în 90 zile.
  - **Observations** → recommendations.
- **Pass criteria:** zero major NC; toate minor NCs cu plan acceptat.

### 8.3 Acreditare body

Selectie: BSI / DNV / TÜV / SGS — alegere bazată pe acreditare UKAS/IAF (international recognition).

### 8.4 Surveillance audits

- An 1: Stage 2 (certification audit).
- An 2: Surveillance audit (1-2 zile, sample).
- An 3: Surveillance audit (1-2 zile, sample).
- An 4: Re-certification audit (full).

---

## 9. Statement of Applicability (SoA)

### 9.1 Format

Tabel cu toate **93 controale** Annex A 2022. Fiecare rând:

| Coloană | Conținut |
|---|---|
| Control # | A.5.1 |
| Nume | Policies for information security |
| Aplicabil | YES / NO |
| Justificare aplicabilitate | Brief reason |
| Justificare neaplicabilitate (dacă NO) | Detailed reason cu risc reziduul accept |
| Implementare status | Implemented / Partial / Planned |
| Owner | Role |
| Evidence references | Path to docs / Jira tickets / system links |
| Last review | Date |

### 9.2 Reguli

- Toate controale "Aplicabil = NO" trebuie justificate (auditorii challenge fiecare).
- Default: REVYX SaaS B2B → majoritatea controalelor aplicabile.
- Probabil "NO" doar: A.7.6 (working in secure areas — dacă remote-first), A.8.27 (specific dezvoltare ICS — nu aplicabil), parte din physical (cloud-only DC).

### 9.3 Mgmt sign-off

Document semnat de CTO + CISO + DPO la fiecare versiune (annual minimum sau la schimbare scope).

---

## 10. Supplier Security Assessment

### 10.1 Categorii suppliers (tier-uri)

| Tier | Definiție | Frecvență assessment |
|---|---|---|
| **Tier 1 — Critical** | Procesare PII / hosting / auth (AWS, Auth0/Supabase, Postmark, Stripe, Sentry) | Annual + on contract change |
| **Tier 2 — High** | Tooling cu acces date dev (GitHub, Datadog/Prometheus host, monitoring) | Bi-anual |
| **Tier 3 — Medium** | SaaS productivitate (Slack, Notion) | Annual |
| **Tier 4 — Low** | Marketing/analytics fără PII | At onboarding |

### 10.2 Process

1. **Onboarding:** chestionar SIG Lite + DPA + sub-processor list + ISO27001/SOC2 attestation.
2. **Annual review:** re-attestation + incident history + access audit.
3. **Off-boarding:** data deletion attestation + access revocation.

### 10.3 Standard chestionar SIG Lite

50 întrebări acoperind: organizational security, asset mgmt, HR security, physical, ops, comm, access, dev, supplier, incident, compliance.

### 10.4 DPA & sub-processor list

Lista live publicată la `https://revyx.app/legal/sub-processors` cu update notification 30 zile înainte de modificare.

### 10.5 Critical suppliers — initial assessment în S8

| Supplier | Tier | Status assessment | Action |
|---|---|---|---|
| AWS | 1 | OK (ISO27001 + SOC2 + GDPR DPA) | refresh annual |
| Auth0 (sau Supabase) | 1 | OK | refresh annual |
| Postmark | 1 | OK (SOC2) | DPA review |
| Stripe | 1 | OK (PCI DSS L1 + SOC2) | DPA review |
| Sentry | 1 | OK (ISO27001) | DPA review |
| GitHub | 2 | OK (ISO27001 + SOC2) | confirm regions data |
| Datadog (eventual) | 2 | OK | DPA + region |
| Slack | 3 | OK | DPA review |

---

## 11. Asset Inventory

### 11.1 Categorii

| Categoria | Exemple | Owner | Update frequency |
|---|---|---|---|
| **Information assets** | Codebase, secrets, customer DB, audit log | CISO | Trimestrial |
| **Physical assets** | Laptopuri, servers (cloud), HSM | IT | Trimestrial |
| **Software assets** | OS, npm packages, OS-level deps | Eng Lead | Continuous (Dependabot) |
| **Service assets** | API endpoints, microservices, queues | Eng Lead | At deploy (auto) |
| **Process assets** | Lead intake, deal closure, payment | Product Lead | Bi-anual |
| **Personnel assets** | Roles staff cu acces sensitive | HR + CISO | Trimestrial |

### 11.2 Format inventory entry

```yaml
asset_id: AST-0042
name: "Production PostgreSQL (revyx-prod)"
category: information_asset
owner: DevOps Lead
criticality: CRITICAL
classification: CONFIDENTIAL
location: AWS eu-central-1 RDS
data_subjects: leads, agents, deals, audit_log
retention: per data type; audit_log 365d, lead.contact_pii GDPR aligned
controls_applied: ['A.5.15','A.8.3','A.8.10','A.8.13','A.8.15','A.8.24','A.8.34']
last_reviewed: 2026-05-09
notes: Multi-AZ; backups 30d S3 cross-region.
```

### 11.3 Stocare

`docs/iso27001/ASSET_INVENTORY_v1.0.0.md` (master) + automated discovery via AWS Config / Terraform state pentru tech assets.

### 11.4 Discovery & reconciliation

- AWS Config aggregate report săptămânal → diff vs inventory → ticketable.
- npm audit + SBOM (CycloneDX) generated la fiecare deploy → sub-asset of "Codebase".

---

## 12. Risk Assessment & Treatment

### 12.1 Methodology

**Likelihood × Impact** matrix 5×5; risk score = L × I.

| L | Impact (5 levels) |
|---|---|
| 1 — Very Low | 1-5 |
| 2 — Low | 2-10 |
| 3 — Med | 3-15 |
| 4 — High | 4-20 |
| 5 — Very High | 5-25 |

| Risk Score | Acțiune |
|---|---|
| 1-5 | Accept |
| 6-12 | Mitigate (treatment plan) |
| 13-19 | Mitigate (priority) sau Transfer |
| 20-25 | Avoid sau Treat aggressive |

### 12.2 Risk register columns

`risk_id, asset_ref, threat, vulnerability, existing_controls, likelihood, impact, score, treatment, owner, target_date, residual_score, last_review`.

### 12.3 Initial top risks REVYX

| ID | Risc | L | I | Score | Treatment |
|---|---|---|---|---|---|
| RR-01 | Lead PII breach via app vulnerability | 2 | 5 | 10 | Pentest + WAF + SAST/DAST + audit |
| RR-02 | Multi-tenant data leak (RLS bug) | 2 | 5 | 10 | Test snapshot tenancy isolation + RLS |
| RR-03 | Supplier breach (Auth provider) | 2 | 4 | 8 | DPA + monitoring breach notif + IR runbook |
| RR-04 | Insider threat — admin abuse | 2 | 4 | 8 | 4-eyes + AUDIT_LOG + RBAC review |
| RR-05 | Ransomware on backups | 2 | 5 | 10 | Immutable backups + isolated copy + DR test |
| RR-06 | DDoS public endpoints | 3 | 3 | 9 | Cloudflare + rate limit + autoscale |
| RR-07 | Compliance gap GDPR (DSAR fail) | 2 | 4 | 8 | DSAR runbook + tested + retention enforced |
| RR-08 | Phishing staff → credentials | 4 | 3 | 12 | MFA + awareness + EDR |
| RR-09 | Vulnerability in critical npm package | 3 | 3 | 9 | Dependabot + SLA + SBOM |
| RR-10 | Pricing model bias → discrimination claim | 2 | 3 | 6 | Bias check `ml-pricing-ga` §6.5 + DPIA |

### 12.4 Review cadence

- Full risk assessment: annual + on major change (new feature, new supplier tier 1, regulatory change).
- Top risks (score ≥10): review trimestrial.

---

## 13. Continuous Compliance & Surveillance

### 13.1 Evidence collection automation

| Evidence | Source | Frequency |
|---|---|---|
| MFA enrolled % | Auth provider API | Daily |
| Backup test success | DR test job | Bi-anual + on demand |
| Vuln scan reports | Snyk / Trivy | Continuous |
| Access reviews | RBAC audit script | Trimestrial |
| Awareness training completion | LMS API | Monthly |
| Pentest reports | Manual upload | Annual |
| Supplier attestations | Manual + GRC tool | Annual |
| AUDIT_LOG sample | Direct DB query | On demand auditor |

### 13.2 Dashboard

`REVYX / ISO 27001 Compliance` — gauges per cluster (Documentation, Process, Tehnic, People, Suppliers) cu drift detection.

### 13.3 KPIs guardrails

- Pentest critical findings open >7 zile → alert CISO.
- MFA enrollment <95% → alert weekly.
- Backup test miss → CRITICAL.
- AUDIT_LOG mutation attempt detected → CRITICAL (blocaj BD).

---

## 14. Metrics & KPIs

| KPI | Target |
|---|---|
| % gap-uri remediation completate (12-luni) | 100% CRIT, ≥95% HIGH |
| MFA enrollment staff | ≥99% |
| Awareness training completion | ≥95% annual |
| Pentest critical findings open >7d | 0 |
| DR test pass rate | 2/2 anual |
| Supplier assessments la zi (Tier 1) | 100% |
| Internal audit findings major NC | 0 (la Stage 2 readiness) |
| Mgmt review cadence | trimestrial 100% |
| Risk register reviewed last 12m | 100% top risks |
| AUDIT_LOG integrity violations | 0 |

---

## 15. Timeline & Milestones

| Lună | Milestone | Status target |
|---|---|---|
| **M1** | Kick-off · ISMS Scope · CISO formalized · gap analysis sign-off | DONE |
| **M2-3** | Documentation set v1 (policies + procedures) drafted | DONE |
| **M4** | SoA v1 + Asset Inventory v1 + Risk Register v1 | DONE |
| **M5** | Awareness training rolled · MFA all staff · MDM 100% | DONE |
| **M6** | First DR test executed; lessons documented | DONE |
| **M7** | Supplier assessments Tier 1 complete | DONE |
| **M8** | Internal audit pass 1 (full Annex A) | DONE |
| **M9** | Remediation findings interne | DONE |
| **M10** | Pentest annual executed + remediation | DONE |
| **M11** | Internal audit pass 2 (post-remediation) | PASS |
| **M12** | Stage 1 audit extern — readiness | PASS |
| **M13-14** | Stage 2 audit extern · certification issued | ★ Certified |
| **M15+** | Surveillance schedule annual · continuous improvement | Ongoing |

Buffer: 14 luni țintă (12 minim agresiv, 18 luni conservativ).

---

## 16. Roles & Responsibilities

| Rol | Responsabilități |
|---|---|
| **CTO** | Sponsor program · arbitru priorități · semnează ISMS Manual |
| **CISO** (Security Lead, interim) | Lead ISMS · risk owner · audit relations |
| **DPO** | GDPR/Legea 133/2011 alignment cu ISO 27001 |
| **Compliance Auditor** | Internal audit · evidence collection · SoA maintenance |
| **DevOps Lead** | Asset inventory tehnic · DR · backups · cloud controls |
| **Eng Lead** | Vulnerability mgmt · secure dev · change mgmt |
| **HR** | People controls · awareness training · disciplinary |
| **Procurement / Legal** | Supplier contracts · DPA · NDA |
| **All Staff** | AUP · awareness · incident reporting |

---

## 17. Migration / Operational Changes

### 17.1 Repo changes

- `docs/iso27001/` directory creat cu structură §2.1.
- `.github/CODEOWNERS` adăugat: orice modificare în `docs/iso27001/` necesită Security Lead + Compliance approval.
- `.github/PULL_REQUEST_TEMPLATE.md` extins: checkbox "ISO 27001 impact assessed?".
- CI step: validate Markdown links + reference integrity SoA ↔ controls implementations.

### 17.2 Code changes (minor)

- AUDIT_LOG events extension: `ISO_INTERNAL_AUDIT_RUN`, `ISO_RISK_REGISTER_REVIEWED`, `ISO_DR_TEST_EXECUTED`, `ISO_SUPPLIER_ASSESSED`.
- Endpoint protected `GET /admin/iso/evidence-bundle` (CISO only) → ZIP de evidence pentru auditor on-demand.

### 17.3 Migrations

Niciuna structurală nouă — folosim AUDIT_LOG existent.

---

## 18. Risks & Mitigations

| # | Risc program | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| R1 | Timeline slip (>18 luni) | MED | HIGH | Buffer 14 luni; consultant extern ramping early |
| R2 | Lipsă buget audit firm | LOW | HIGH | Quote vendors în M1; budget aprobat M0 |
| R3 | Major NC la Stage 2 | LOW | CRITICAL | 2 internal audits înainte de Stage 1 + remediation tracking |
| R4 | Staff churn CISO | LOW | HIGH | Knowledge mgmt + backup CISO + GRC tooling |
| R5 | Schimbare scope organizațional | MED | MED | Scope review trimestrial · re-issue ISMS Scope dacă necesar |
| R6 | Furnizor critic refuză assessment | LOW | HIGH | Switch threshold pre-defined (≤30 zile la non-respect) |
| R7 | Awareness training low adoption | MED | MED | Mandatory pentru access prod · LMS reminders · gamification |
| R8 | DR test descoperă gap CRIT (RPO/RTO neîndeplinit) | MED | HIGH | Plan remediation imediat · re-test în 90 zile · escalare CTO |
| R9 | Supplier major (AWS) certificate lapse | VERY LOW | CRITICAL | Monitoring sub-processors public registry · alert |
| R10 | Pentest descoperă vulnerability major în prod | MED | HIGH | SLA remediation ≤7d CRIT · re-test obligatoriu |

---

## 19. Impact Assessment

### 19.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_iso27001-track_v1.0.0.md |
| Tip | NEW (S8 deliverable #5) |
| Aria | Compliance program — ISMS · SoA · supplier · audit |
| Origine | S8 brief — ISO 27001 track |

### 19.2 Impact pe documente conexe

| Document | Impact | Acțiune |
|---|---|---|
| BRD | Minor | §9 Securitate extinsă cu referință ISO track ★ |
| `audit-log` v1.0.0 | Minor | Catalog event extins `ISO_*` |
| Toate Tech Specs anterioare | None directly | Mapping în SoA evidence |
| Privacy Policy / Cookie Policy | None | Aliniate deja GDPR |
| `tenancy-roles-extension` | None | RBAC matrix evidence pentru A.5.15 |
| `mobile-rn` (S8) | None | Privacy manifest evidence pentru A.5.34 |
| `marketplace-two-sided` (S8) | None | DPIA evidence |

### 19.3 Impact pe scoring

Niciunul (program de conformitate, nu engine).

### 19.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| AUDIT_LOG event types extended | Catalog only | minor |

(Nicio nouă tabelă în S8; tooling GRC extern stochează evidence. Optional: tabel `iso_evidence_pointer` viitor.)

### 19.5 Impact pe RBAC

| Rol | Permisiuni adăugate |
|---|---|
| `compliance_auditor` ★ rol nou | read-only access la evidence bundle + AUDIT_LOG |
| `admin` | endpoint `/admin/iso/evidence-bundle` |

### 19.6 Impact pe SLA & NFR

| Aspect | Detaliu |
|---|---|
| Backup retention | min 30 zile (existing); deal cu A.8.13 |
| Audit log retention | min 365 zile (existing); A.8.34 |
| Vulnerability SLA | CRIT ≤7d, HIGH ≤30d ★ formalizat |
| MFA enrollment | ≥99% staff ★ formalizat |
| DR test cadence | bi-anual ★ |

### 19.7 Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| GDPR alignment | DA | Art. 32 acoperit prin ISO 27001 controls |
| AUDIT events | DA | §17.2 |
| DPIA registry | DA | Va fi anexat la Risk Register |
| TIA (Transfer Impact Assessment) | DA | Pentru sub-processors out-of-EEA |

### 19.8 Test Plan

- Internal audit (2× anual) — full Annex A primul, sample-based al doilea.
- DR test bi-anual.
- Pentest annual.
- Supplier assessments per cadence §10.1.

### 19.9 Rollout & Rollback

Program 12-18 luni. Niciun rollback — se construiește incremental. Întârziere tolerată; abandon necesită decizie CTO.

### 19.10 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| CTO | Sponsor + budget |
| Senior PM | Aliniere business priorities |
| CISO | ISMS implementation |
| DPO | GDPR alignment |
| Compliance Auditor | Audit program |
| Legal | Supplier contracts + DPA |

---

*docs/tech-spec/TECH_SPEC_REVYX_iso27001-track_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
