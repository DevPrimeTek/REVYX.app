# INDEX — REVYX Document Catalog
<!-- INDEX_REVYX_documents_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Audit Lead | ★ Initial — retrospectiva tuturor documentelor existente la S12 close · convenție: maximum 10 rânduri descriere per document · ★ marcaj pentru documente noi sau actualizate la sesiunea curentă · regulă CLAUDE.md §10b Regula 6 (NEW) cere update la fiecare document nou |

---

## 1. Convenție

- Toate documentele REVYX sunt listate aici cu **descriere scurtă (≤10 rânduri)**.
- La crearea oricărui document nou (spec, runbook, audit, playbook, checklist, etc.) — **obligatoriu** să se adauge intrare în acest INDEX (CLAUDE.md §10b Regula 6).
- La bump versiune MAJOR/MINOR pentru un document existent — actualizare descrierii (PATCH-urile pot fi grupate în descrierea aceeași intrare).
- Sortare per categorie → alfabetică. `★` înaintea numelui = adăugat/actualizat la S12 (sesiunea curentă).

---

## 2. Documente foundation (CLAUDE.md + brand)

| Document | Descriere |
|---|---|
| `CLAUDE.md` | Agent Operating System cheat-sheet pentru Claude Code la fiecare sesiune. Conține identitate proiect REVYX, documente referință, semantic versioning, stack tehnic, reguli critice business (BR-XX), SLA-uri, Phase 0 Security checklist, sistem skill-uri, limbă & ton, convenții cod + git, reguli operaționale §10b (Regula 1-7) — INCL. ★ Regula 4 (verificare post-commit), ★ Regula 5 (prompt next session), ★ Regula 6 (update INDEX), do's & don'ts, glosar minim. |
| `docs/brand-configs/revyx.md` | Brand system canonical: paletă culori, font, componente UI, ton voce. Citit de toate skill-urile la generare document. Lege pentru orice UI / document. |

---

## 3. Business / Product Requirements

| Document | Descriere |
|---|---|
| `docs/BRD_REVYX_v1.0.0.md` | Business Requirements Document v1.0 — piloni, formule scoring (LS/PS/IS/DP/NBA/TS/APS/DHI), RBAC 5 roluri, roadmap Phase 0-5, fișa T01-T07 valori test scoring. |
| `docs/BRD_REVYX_v1.1.0.md` | BRD bump MINOR — adaugă Pilon Retention §6.4 cu BR-13..BR-18 + KPI Prevention Rate ≥30% + entity BUYER_PROFILE §8.3 + White-Label/Mobile §10.2-10.3. Backwards compat header explicit. |

---

## 4. Tech Specs (engines + platform)

### 4.1 Phase 0-4 (lead/property/deal core)

| Document | Descriere |
|---|---|
| `TECH_SPEC_REVYX_lead-scoring_v1.0.0.md` | Lead Score (LS) engine. Formulele §7.1 BRD, intake throttling, redis cache, tests T01-T03. |
| `TECH_SPEC_REVYX_property_v1.0.0.md` | PROPERTY entity, PS scoring §7.2, listing freshness LF, GIS indexing. |
| `TECH_SPEC_REVYX_match-engine_v1.0.0.md` | Match (Lead × Property) baseline cu PS+LS+IS combined. |
| `TECH_SPEC_REVYX_match-engine_v2.0.0.md` | Match v2 cu pgvector HNSW (Phase 3) + buyer profile matching. |
| `TECH_SPEC_REVYX_interaction-strength_v1.0.0.md` | Interaction Strength (IS) §7.3 + decay function. |
| `TECH_SPEC_REVYX_nba-engine_v1.0.0.md` | Next Best Action (NBA ∈ [0, 2.0]) — singura excepție de scală scoring. |
| `TECH_SPEC_REVYX_aps-engine_v1.0.0.md` | Agent Performance Score §7.7 + APS_default 0.65. |
| `TECH_SPEC_REVYX_dhi-engine_v1.0.0.md` | Deal Health Index §7.8 + TF default 0.70. |
| `TECH_SPEC_REVYX_offer-engine_v1.0.0.md` | OFFER state machine + chain de contraoferte. |
| `TECH_SPEC_REVYX_deal-closure_v1.0.0.md` | DEAL closure flow + commission split + audit. |
| `TECH_SPEC_REVYX_showing_v1.0.0.md` | SHOWING entity + scheduling + outcome capture. |
| `TECH_SPEC_REVYX_pricing-ai_v1.0.0.md` | Pricing AI baseline (Phase 0-4); precursor `ml-pricing-ga`. |
| `TECH_SPEC_REVYX_audit-log_v1.0.0.md` | AUDIT_LOG append-only — Phase 0 BLOCANT. Schema partitioned, RLS, GDPR redaction §6.5. |
| `TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md` | RBAC 5 sistem + 4 custom roluri (baseline). |
| `TECH_SPEC_REVYX_webhook-intake_v1.0.0.md` | Webhook Meta/Google/OLX HMAC-SHA256 + idempotență. |
| `TECH_SPEC_REVYX_concurrency-hardening_v1.0.0.md` | Optimistic locking + version field + concurrency tests pe scoring. |
| `TECH_SPEC_REVYX_showcase-links_v1.0.0.md` | Public showcase links (signed URL TTL) pentru property pe canale externe. |

### 4.2 Phase 5 (S8/S9/S10/S11/S12)

| Document | Descriere |
|---|---|
| `TECH_SPEC_REVYX_mobile-rn_v1.0.0.md` | React Native mobile app — push notifications, OT auth, MOBILE_DEVICE_*/AUTH_MOBILE_OT_* events. Zero PII validare via @revyx/test-fixtures-pii. Stage 1 rollout. |
| `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.0.md` | Buyer self-service profile + contact-grant flow. Initial v1.0.0; bump v1.0.1 inclus în S10 cross-spec. |
| `TECH_SPEC_REVYX_white-label_v1.0.0.md` | Custom domain per tenant (Enterprise tier), DKIM, edge HMAC. v1.0.1 a îmbunătățit edge HMAC skew + plan-tier gating. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.0.md` | ML Pricing GA initial — model registry, SHADOW/CANARY/GA gates, 4-eyes approval. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md` | PATCH — closes F-03 HIGH (S9 audit). RENAME `pricing_model_registry` → `ml_model_registry` cu view backwards-compat read-only. Migrare 0600. |
| `TECH_SPEC_REVYX_churn-ga_v1.0.0.md` | Churn scoring + CS task generation + retention KPI; 14 events `CHURN_*`. |
| `TECH_SPEC_REVYX_churn-ga_v1.0.1.md` | PATCH — closes F-03 follow-up. FK `model_id REFERENCES ml_model_registry` aliniat post-rename. |
| `TECH_SPEC_REVYX_iso27001-track_v1.0.0.md` | ISO 27001 controls tracking, risk register, internal audit cycle, supplier assessment. |
| `TECH_SPEC_REVYX_audit-log_v1.1.0.md` | MINOR — closes F-04 HIGH. 75 events Phase 5 catalogați (8 familii) cu severity, retention class, alerting hook. CI guard `audit-catalog-lint`. |
| ★ `TECH_SPEC_REVYX_audit-log_v1.1.1.md` | PATCH — closes F-S10-09 (CHURN_CS_TASK_OPENED alerting clarifying) + F-S11-02 (familia §4.4.9 PHASE5_* cu 4 events oficiale). Total 79 events Phase 5. |
| `TECH_SPEC_REVYX_tenancy-roles-extension_v1.1.0.md` | MINOR — closes F-05 + F-06. 6 roluri custom Phase 5 (data_science_lead, cs_user, cs_lead, compliance_auditor, buyer, tenant_admin). View `audit_log_compliance_view` PII-safe. Migrare 0610. |
| ★ `TECH_SPEC_REVYX_pii-field-registry_v1.0.0.md` | NEW — closes F-S10-04 HIGH (gating Stage 5 entry). Schema + 80 path-uri seed canonical pe 10 entități + funcții SQL `redact_pii_jsonb` + `apply_redaction` + migrare idempotentă 0611 + E2E `assertNoPII` coverage matrix. |

---

## 5. Workflows

| Document | Descriere |
|---|---|
| `docs/workflow/WORKFLOW_REVYX_lead-lifecycle_v1.0.0.md` | Lead intake → scoring → firewall → assignment → outcome. |
| `docs/workflow/WORKFLOW_REVYX_property-onboarding_v1.0.0.md` | Property listing creation, PS compute, GIS, freshness decay. |
| `docs/workflow/WORKFLOW_REVYX_offer-chain_v1.0.0.md` | OFFER → counter-offer → accept/reject + audit chain. |
| `docs/workflow/WORKFLOW_REVYX_deal-closure_v1.0.0.md` | DEAL pipeline closure + commission split + DHI track. |
| `docs/workflow/WORKFLOW_REVYX_showing-flow_v1.0.0.md` | SHOWING schedule, attendance, outcome record. |
| `docs/workflow/WORKFLOW_REVYX_escalation_v1.0.0.md` | Escalation Protocol BR-03 — 3 niveluri T+SLA / +30min / +2h. |
| `docs/workflow/WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md` | Tenant onboarding → active → downgrade → suspended. Plan-tier gating. |
| `docs/workflow/WORKFLOW_REVYX_buyer-profile-lifecycle_v1.0.0.md` | Buyer self-publish → contact-grant → expire/revoke. Marketplace flow. |
| `docs/workflow/WORKFLOW_REVYX_white-label-onboarding_v1.0.0.md` | DOMAIN_CLAIMED → VERIFIED → TLS_PROVISIONED → CONFIG_UPDATED → EMAIL_VERIFIED. |

---

## 6. Runbooks (operational)

| Document | Descriere |
|---|---|
| `docs/runbook/RUNBOOK_REVYX_incident-response_v1.0.0.md` | Incident lifecycle (P1-P4), IC role, GDPR breach notification, post-mortem. Events `INC_*` (8). |
| `docs/runbook/RUNBOOK_REVYX_dr-test_v1.0.0.md` | DR test scenarios + RPO/RTO measurement + ISO 27001 evidence. Events `DR_TEST_*` (7). |
| `docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.0.md` | pg_partman + plpgsql cron template pentru `mobile_push_log` (90d) / `churn_features_snapshot` (365d) / `pricing_prediction_audit` (365d). Health check + alert pipeline. |
| ★ `docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.1.md` | PATCH — closes F-S10-08 LOW. Refactor `revyx_drop_partition_older_than` la API stabil PostgreSQL: pg_partition_root_bound + partman.show_partitions ≥4.7 fallback. No string regex pe `pg_get_expr`. |
| `docs/runbook/RUNBOOK_REVYX_dkim-rotation_v1.0.0.md` | DKIM selector calendar `rvxYYYYMMDD`, 90-day rotation, DNS Cloudflare/Route53 automation, DMARC verification, rollback. Stage 5 dependency. |
| `docs/runbook/RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md` | Master gate Phase 5 — 5 stages T+0..T+91 (Mobile → Marketplace → ML Pricing → Churn → White-Label) cu entry/exit gates per stage + rollback decision tree + GA decision T+91. |

---

## 7. Audit + Readiness

| Document | Descriere |
|---|---|
| `docs/audit/AUDIT_REVYX_s8-external-pass_v1.0.0.md` | S9 audit pass pe S8 deliverables. Findings F-01..F-09. |
| `docs/audit/AUDIT_REVYX_s10-external-pass_v1.0.0.md` | S10 audit pass — verifică F-03..F-09 closed; introducere F-S10-01..10. |
| ★ `docs/audit/AUDIT_REVYX_s11-external-pass_v1.0.0.md` | NEW — S12 audit pass pe S11 deliverables. Verificare F-S10-01..03/05/06/10 closed; tracked F-S10-04 (HIGH gating)/07-09; 8 noi findings F-S11-01..08. Inline-fixed S12 fix table §7. |
| ★ `docs/audit/READINESS_REVYX_phase5_v1.0.0.md` | NEW — closes F-S11-05/03/08. Single-page sign-off matrix per stage (Pre-flight + 5 stages + GA decision) cu gate status (🟢/🟡/🔴), owner, blocker findings, sign-off date placeholder pentru board pre-T0. |

---

## 8. CS Playbooks + Checklists

| Document | Descriere |
|---|---|
| `docs/cs-playbooks/CHURN_MEDIUM_v1.0.0.md` | Playbook MEDIUM (P3, SLA 168h). Email + Slack DM + discovery questions. RO templates. |
| `docs/cs-playbooks/CHURN_HIGH_v1.0.0.md` | Playbook HIGH (P2, SLA 72h). Personal call + concession matrix. RO. |
| `docs/cs-playbooks/CHURN_CRITICAL_v1.0.0.md` | Playbook CRITICAL (P1, SLA 24h). PD + emergency call. RO. |
| `docs/cs-playbooks/CHURN_MEDIUM_v1.1.0.md` | MINOR — closes F-S10-06. Adăugare RU + EN templates paralele cu RO existent. |
| `docs/cs-playbooks/CHURN_HIGH_v1.1.0.md` | MINOR — closes F-S10-06. RU + EN sub-secțiuni paralele. |
| `docs/cs-playbooks/CHURN_CRITICAL_v1.1.0.md` | MINOR — closes F-S10-06. RU + EN. |
| ★ `docs/cs-playbooks/CHECKLIST_pre-pilot_v1.0.0.md` | NEW — closes F-S11-04 MED. Tri-lingual operational checklist Stage 4 dry-run: 5 task-uri MEDIUM + 3 HIGH + 1 CRITICAL cu pași checkbox per task, aggregate verifications, sign-off post dry-run. |

---

## 9. Legal + Compliance

| Document | Descriere |
|---|---|
| `docs/legal/privacy-policy.md` | Privacy Policy publică (RO + RU + EN). Sub legal review pre-Phase 5. |
| `docs/legal/cookie-policy.md` | Cookie Policy (RO + RU + EN). |
| `docs/legal/DPIA_REVYX_phase5_v1.0.0.md` | Data Protection Impact Assessment Phase 5. Single-source pentru toate features (churn-ga, marketplace, ml-pricing, mobile, white-label). Risk register, balancing test (Art. 22 + legitimate interest), sign-off triple DPO + Security Lead + CISO. |

---

## 10. Test fixtures + Templates

| Document | Descriere |
|---|---|
| `docs/test-fixtures/PII_REDACTION_FIXTURES_v1.0.0.md` | Lib `@revyx/test-fixtures-pii` cu `assertNoPII(payload)` + 14 categorii regex (EMAIL/PHONE/IBAN/CNP/IDNP/PASSPORT/CC/IP). Coverage targets ≥99% per regex; perf budget 50ms/100KB. |
| `docs/templates/HEADER_STANDARD.md` | Header obligatoriu pentru orice document nou — title + filename + version + copyright + changelog. Cf. CLAUDE.md §2. |
| `docs/templates/IMPACT_ASSESSMENT.md` | Template pentru §19 Impact Assessment în orice tech spec — scope of change + impact pe documente conexe + scoring + entități + RBAC + SLA + securitate + risks + test plan + rollout + approval gate. |

---

## 11. Skills (DOC_MASTER orchestrator)

| Document | Descriere |
|---|---|
| `docs/skills/DOC_MASTER.md` | Orchestrator skill — Claude execută documentation tasks via skill-uri specializate. |
| `docs/skills/SKILL_BRD.md` | Skill generare BRD — citește brand-configs, urmează template + changelog. |
| `docs/skills/SKILL_PRD.md` | Skill generare PRD — analog BRD pentru Product Requirements. |
| `docs/skills/SKILL_TECH_SPEC.md` | Skill generare Tech Spec — include §19 Impact Assessment obligatoriu. |
| `docs/skills/SKILL_WORKFLOW.md` | Skill generare Workflow — process maps + state machines. |

---

## 12. Document count summary (S12 close)

| Categorie | Count |
|---|---|
| Foundation (CLAUDE.md + brand) | 2 |
| BRD | 2 |
| Tech Specs (Phase 0-4 + Phase 5) | 31 |
| Workflows | 9 |
| Runbooks | 6 |
| Audit + Readiness | 4 |
| CS Playbooks + Checklists | 7 |
| Legal | 3 |
| Test fixtures + Templates | 3 |
| Skills | 5 |
| **Total** | **72 documente** (incl. patch + minor versions) |

> **Notă:** documente duplicate prin versiuni (v1.0.0 + v1.1.0 + v1.0.1) sunt listate separat — fiecare versiune e document distinct istoric. Total **active** (deprecate excluse): **~58**.

---

## 13. Maintenance protocol

1. La crearea unui document **nou**: update obligatoriu §3-§11 categoria respectivă; bump versiunea acestui INDEX cu PATCH (sau MINOR la ≥3 docs noi în sesiune).
2. La bump versiune document existent: actualizare descriere; mențin entry vechiu (istoric).
3. La deprecare document: append `[DEPRECATED]` în descriere + cross-ref la successor.
4. Refresh manual la fiecare audit checkpoint (post-S12, S13, etc.).

---

## 14. Approval

| Aprobator | Sign-off |
|---|---|
| Senior PM | ✅ |
| Audit Lead | ✅ |
| Solution Architect | ✅ |

---

*docs/INDEX_REVYX_documents_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
