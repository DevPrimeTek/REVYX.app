# INDEX — REVYX Document Catalog
<!-- INDEX_REVYX_documents_v1.0.1.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Audit Lead | Initial — retrospectiva tuturor documentelor existente la S12 close · convenție: maximum 10 rânduri descriere per document · ★ marcaj pentru documente noi sau actualizate la sesiunea curentă · regulă CLAUDE.md §10b Regula 6 (NEW) cere update la fiecare document nou |
| 1.0.1 | 2026-05 | Senior PM + Audit Lead | ★ PATCH — adăugare 4 documente S13 + extensie audit-catalog-lint (`AUDIT_REVYX_s12-external-pass` v1.0.0 · `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0 · `SCC_VENDORS_phase5` v1.0.0 · `READINESS_REVYX_phase5` v1.0.1 PATCH) · descrieri ajustate la 5-5 rânduri în română pentru claritate operațională · re-marcaj `★` pe entries S13; entries S12 mențin marker în istoric · bump count summary §12 (76 documente totale post-S13) · cross-ref nou §0.14 SCC + §3.1 Stage 1 launch runbook |

---

## 1. Convenție

- Toate documentele REVYX sunt listate aici cu **descriere scurtă (≤10 rânduri, target ~5 rânduri pentru claritate)**.
- La crearea oricărui document nou (spec, runbook, audit, playbook, checklist, etc.) — **obligatoriu** să se adauge intrare în acest INDEX (CLAUDE.md §10b Regula 6).
- La bump versiune MAJOR/MINOR pentru un document existent — actualizare descrierii (PATCH-urile pot fi grupate în descrierea aceeași intrare).
- Sortare per categorie → alfabetică/cronologică. `★` înaintea numelui = adăugat/actualizat la sesiunea curentă (S13 acum).
- Stil descriere: 5 rânduri descriptive în română — (1) ce e documentul · (2) ce findings/feature acoperă · (3) cross-ref-uri majore · (4) gating/dependency · (5) versiune și autor primary.

---

## 2. Documente foundation (CLAUDE.md + brand)

| Document | Descriere |
|---|---|
| `CLAUDE.md` | Agent Operating System cheat-sheet pentru Claude Code la fiecare sesiune. Conține identitate proiect REVYX, documente referință, semantic versioning, stack tehnic, reguli critice business (BR-XX), SLA-uri, Phase 0 Security checklist, sistem skill-uri, limbă & ton, convenții cod + git, reguli operaționale §10b (Regula 1-7) — INCL. ★ Regula 4 (verificare post-commit), ★ Regula 5 (prompt next session), ★ Regula 6 (update INDEX), do's & don'ts, glosar minim. |
| `docs/brand-configs/revyx.md` | Brand system canonical: paletă culori, font (Inter), componente UI, ton voce. Citit de toate skill-urile la generare document. Lege pentru orice UI sau document nou. Definește header/footer brandat obligatoriu pe orice spec. Owner: Senior Designer + PM. |

---

## 3. Business / Product Requirements

| Document | Descriere |
|---|---|
| `docs/BRD_REVYX_v1.0.0.md` | Business Requirements Document v1.0 — piloni, formule scoring (LS/PS/IS/DP/NBA/TS/APS/DHI), RBAC 5 roluri, roadmap Phase 0-5, fișa T01-T07 valori test scoring. Sursa de adevăr inițială pentru toate cerințele de business. Owner: PM Lead. |
| `docs/BRD_REVYX_v1.1.0.md` | BRD bump MINOR — adaugă Pilon Retention §6.4 cu BR-13..BR-18 + KPI Prevention Rate ≥30% + entity BUYER_PROFILE §8.3 + White-Label/Mobile §10.2-10.3. Backwards compat header explicit. Cross-ref Phase 5 maturity §11.5 cu toate stages. Owner: PM Lead + VP Product. |

---

## 4. Tech Specs (engines + platform)

### 4.1 Phase 0-4 (lead/property/deal core)

| Document | Descriere |
|---|---|
| `TECH_SPEC_REVYX_lead-scoring_v1.0.0.md` | Lead Score (LS) engine. Implementează formulele §7.1 BRD pentru scor [0,1] cu intake throttling și redis cache. Acoperă tests T01-T03 cu valori canonice. Cross-ref BRD §7.1, BR-01 firewall LS≥0.60, BR-02 LS_initial=0.30. Owner: Backend Lead + DS. |
| `TECH_SPEC_REVYX_property_v1.0.0.md` | PROPERTY entity completă cu PS scoring §7.2, listing freshness LF (1−min(1, days/90)), GIS indexing PostGIS, Cluster mosaic. Acoperă BR-09 listing decay. Cross-ref BRD §7.2 + match-engine. Owner: Backend Lead. |
| `TECH_SPEC_REVYX_match-engine_v1.0.0.md` | Match (Lead × Property) baseline cu PS+LS+IS combined scoring. Algoritm v1 fără pgvector. Cross-ref lead-scoring + property + interaction-strength. Suportă BR-04 max 3 task active. Owner: Backend Lead + DS. |
| `TECH_SPEC_REVYX_match-engine_v2.0.0.md` | Match v2 cu pgvector HNSW (Phase 3) + buyer profile matching marketplace. Bump MAJOR datorită schemă nouă vector embeddings. Cross-ref marketplace-two-sided. Acoperă re-matching trigger BR-05. Owner: Backend Lead + DS. |
| `TECH_SPEC_REVYX_interaction-strength_v1.0.0.md` | Interaction Strength (IS) §7.3 BRD — quantifică intensitatea contactelor agent-lead cu decay function. Scoring [0,1] cu bucket-uri pe tip activitate. Cross-ref activity entity + match-engine. Owner: Backend Lead. |
| `TECH_SPEC_REVYX_nba-engine_v1.0.0.md` | Next Best Action (NBA ∈ [0, 2.0]) — singura excepție de scală scoring. Recomandă action-uri pentru agent (call, email, WhatsApp, schedule showing). Cross-ref aps-engine + lead-scoring. Owner: DS Lead. |
| `TECH_SPEC_REVYX_aps-engine_v1.0.0.md` | Agent Performance Score §7.7 + APS_default 0.65 pentru agenți cu <5 deal-uri sau <30 zile vechime (BR-11). Scoring lunar cu rolling window. Cross-ref deal-closure + showing. Owner: DS Lead + PM. |
| `TECH_SPEC_REVYX_dhi-engine_v1.0.0.md` | Deal Health Index §7.8 BRD + TF default 0.70 când expected_close_date NULL (BR-10). Combină Time/Urgency/Risk Factor pentru deal in-flight. Cross-ref deal-closure. Owner: DS Lead. |
| `TECH_SPEC_REVYX_offer-engine_v1.0.0.md` | OFFER state machine + chain de contraoferte cu audit trail. State diagram complet: PENDING → COUNTER → ACCEPTED/REJECTED. Cross-ref deal-closure + audit-log. Owner: Backend Lead. |
| `TECH_SPEC_REVYX_deal-closure_v1.0.0.md` | DEAL closure flow + commission split + audit complet. Acoperă pipeline-ul de la accept ofertă la closed-won. Cross-ref dhi-engine + aps-engine. Owner: Backend Lead + Senior DBA. |
| `TECH_SPEC_REVYX_showing_v1.0.0.md` | SHOWING entity + scheduling + outcome capture. Calendar integration + reminders. Cross-ref aps-engine + lead-scoring (IS boost post-showing). Owner: Backend Lead. |
| `TECH_SPEC_REVYX_pricing-ai_v1.0.0.md` | Pricing AI baseline (Phase 0-4); precursor `ml-pricing-ga`. Heuristic-based cu data tenant. Cross-ref property + ml-pricing-ga (Phase 5 evolution). Owner: DS Lead. |
| `TECH_SPEC_REVYX_audit-log_v1.0.0.md` | AUDIT_LOG append-only — Phase 0 BLOCANT. Schema partitioned monthly, RLS per tenant, GDPR redaction §6.5. Cross-ref BR-07 audit append-only. Owner: Senior DBA + Senior Security Auditor. |
| `TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md` | RBAC 5 sistem + 4 custom roluri (baseline). Multi-tenancy hierarchy + scope inheritance. Cross-ref BR (RBAC matrix). Owner: Security Lead + Backend Lead. |
| `TECH_SPEC_REVYX_webhook-intake_v1.0.0.md` | Webhook Meta/Google/OLX HMAC-SHA256 + idempotență. Acoperă BR (HMAC verification obligatoriu). Cross-ref lead-scoring intake. Owner: Backend Lead + Security Lead. |
| `TECH_SPEC_REVYX_concurrency-hardening_v1.0.0.md` | Optimistic locking + version field + concurrency tests pe scoring. Acoperă race conditions pe LS/DP recomputări. Cross-ref toate scoring engines. Owner: Solution Architect. |
| `TECH_SPEC_REVYX_showcase-links_v1.0.0.md` | Public showcase links (signed URL TTL) pentru property pe canale externe. Acoperă tracking + GDPR consent capture la lead generation extern. Cross-ref webhook-intake. Owner: Backend Lead. |

### 4.2 Phase 5 (S8/S9/S10/S11/S12)

| Document | Descriere |
|---|---|
| `TECH_SPEC_REVYX_mobile-rn_v1.0.0.md` | React Native mobile app — push notifications, OT auth, MOBILE_DEVICE_*/AUTH_MOBILE_OT_* events. Zero PII validare via @revyx/test-fixtures-pii. Stage 1 rollout 8 săpt cu 30 agenți pilot. Owner: Mobile Lead + Solution Architect. |
| `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.0.md` | Buyer self-service profile + contact-grant flow cu rate-limiting. Acoperă entity BUYER_PROFILE (BRD §8.3) + GDPR consent flow. Initial v1.0.0; bump v1.0.1 inclus în S10 cross-spec. Owner: Backend Lead + DPO. |
| `TECH_SPEC_REVYX_white-label_v1.0.0.md` | Custom domain per tenant (Enterprise tier), DKIM, edge HMAC Cloudflare. v1.0.1 a îmbunătățit edge HMAC skew + plan-tier gating. Cross-ref dkim-rotation runbook. Owner: DevOps + Security Lead. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.0.md` | ML Pricing GA initial — model registry, SHADOW/CANARY/GA gates, 4-eyes approval pentru promote. Cross-ref pricing-ai (precursor) + audit-log §4.4.1. Stage 3 rollout (T+35..T+56). Owner: DS Lead + Solution Architect. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md` | PATCH — closes F-03 HIGH (S9 audit). RENAME `pricing_model_registry` → `ml_model_registry` cu view backwards-compat read-only. Migrare 0600. Cross-ref churn-ga v1.0.1 (FK aliniat). Owner: DS Lead + Senior DBA. |
| `TECH_SPEC_REVYX_churn-ga_v1.0.0.md` | Churn scoring + CS task generation + retention KPI Prevention Rate ≥30%. 14 events `CHURN_*` catalogate (audit-log §4.4.5). Stage 4 rollout dry-run T+56..T+77. Owner: DS Lead + CS Lead. |
| `TECH_SPEC_REVYX_churn-ga_v1.0.1.md` | PATCH — closes F-03 follow-up. FK `model_id REFERENCES ml_model_registry` aliniat post-rename ml-pricing-ga v1.0.2. Cross-ref migrare 0600. Owner: DS Lead + Senior DBA. |
| `TECH_SPEC_REVYX_iso27001-track_v1.0.0.md` | ISO 27001 controls tracking, risk register, internal audit cycle, supplier assessment. Acoperă pre-RFP cu BSI Group MD pentru Stage 1 audit firm. Cross-ref incident-response + dr-test runbook. Owner: CISO + Compliance Lead. |
| `TECH_SPEC_REVYX_audit-log_v1.1.0.md` | MINOR — closes F-04 HIGH. 75 events Phase 5 catalogați (8 familii) cu severity, retention class, alerting hook explicit. CI guard `audit-catalog-lint` definit §4.5. Cross-ref toate Phase 5 specs. Owner: Senior Security Auditor + Backend Lead. |
| `TECH_SPEC_REVYX_audit-log_v1.1.1.md` | PATCH — closes F-S10-09 (CHURN_CS_TASK_OPENED alerting clarifying) + F-S11-02 (familia §4.4.9 PHASE5_* cu 4 events oficiali). Total 79 events Phase 5. Cross-ref phase5-rollout-sequence stage events. Owner: Senior Security Auditor. |
| `TECH_SPEC_REVYX_tenancy-roles-extension_v1.1.0.md` | MINOR — closes F-05 + F-06. 6 roluri custom Phase 5 (data_science_lead, cs_user, cs_lead, compliance_auditor, buyer, tenant_admin). View `audit_log_compliance_view` PII-safe §6.5. Migrare 0610. Owner: Security Lead + Senior DBA. |
| `TECH_SPEC_REVYX_pii-field-registry_v1.0.0.md` | NEW S12 — closes F-S10-04 HIGH (gating Stage 5 entry). Schema `pii_field_registry` + 80 path-uri seed canonical pe 10 entități + funcții SQL `redact_pii_jsonb` + `apply_redaction` + migrare idempotentă 0611 + E2E `assertNoPII` coverage matrix toate familii audit-log §4.4. Owner: Senior DBA + DPO + Senior Security Auditor. |

---

## 5. Workflows

| Document | Descriere |
|---|---|
| `docs/workflow/WORKFLOW_REVYX_lead-lifecycle_v1.0.0.md` | Lead intake → scoring → firewall → assignment → outcome. State diagram complet cu BR-01 firewall LS≥0.60 + BR-03 escalation 3 niveluri. Cross-ref lead-scoring + nba-engine. Owner: PM Lead + Backend Lead. |
| `docs/workflow/WORKFLOW_REVYX_property-onboarding_v1.0.0.md` | Property listing creation, PS compute, GIS indexing, freshness decay LF. State machine: DRAFT → ACTIVE → STALE → ARCHIVED. Cross-ref property + match-engine. Owner: Backend Lead + Senior Designer. |
| `docs/workflow/WORKFLOW_REVYX_offer-chain_v1.0.0.md` | OFFER → counter-offer → accept/reject + audit chain complet. State machine cu round-trip până la SETTLED. Cross-ref offer-engine + deal-closure. Owner: Backend Lead. |
| `docs/workflow/WORKFLOW_REVYX_deal-closure_v1.0.0.md` | DEAL pipeline closure + commission split + DHI tracking. Acoperă transition NEGOTIATION → CONTRACT → CLOSED-WON. Cross-ref dhi-engine + aps-engine. Owner: Backend Lead + PM. |
| `docs/workflow/WORKFLOW_REVYX_showing-flow_v1.0.0.md` | SHOWING schedule, attendance, outcome record. Reminders 24h + 1h. Cross-ref showing + lead-scoring (IS boost post-attended). Owner: Backend Lead + CS Lead. |
| `docs/workflow/WORKFLOW_REVYX_escalation_v1.0.0.md` | Escalation Protocol BR-03 — 3 niveluri T+SLA / +30min / +2h. Cuprinde re-assignment + manager notification + audit trail. Cross-ref nba-engine + lead-scoring. Owner: PM Lead + CS Lead. |
| `docs/workflow/WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md` | Tenant onboarding → active → downgrade → suspended. Plan-tier gating GROWTH/BUSINESS/ENTERPRISE. Cross-ref white-label + marketplace-two-sided. Owner: PM Lead + Sales. |
| `docs/workflow/WORKFLOW_REVYX_buyer-profile-lifecycle_v1.0.0.md` | Buyer self-publish → contact-grant → expire/revoke. Marketplace flow cu GDPR consent + auto-EXPIRE pe `last_active_at`. Cross-ref marketplace-two-sided. Owner: Backend Lead + DPO. |
| `docs/workflow/WORKFLOW_REVYX_white-label-onboarding_v1.0.0.md` | DOMAIN_CLAIMED → VERIFIED → TLS_PROVISIONED → CONFIG_UPDATED → EMAIL_VERIFIED. State machine cu DKIM + TLS Let's Encrypt. Cross-ref white-label + dkim-rotation runbook. Owner: DevOps + Security Lead. |

---

## 6. Runbooks (operational)

| Document | Descriere |
|---|---|
| `docs/runbook/RUNBOOK_REVYX_incident-response_v1.0.0.md` | Incident lifecycle (P1-P4), IC role, GDPR breach notification 72h, post-mortem template. Events `INC_*` (8) catalogați audit-log §4.4.7. Cross-ref dpia + iso27001-track. Owner: CISO + IC pool. |
| `docs/runbook/RUNBOOK_REVYX_dr-test_v1.0.0.md` | DR test scenarios + RPO/RTO measurement + ISO 27001 evidence. Events `DR_TEST_*` (7) catalogați audit-log §4.4.8. Cadență trimestrială. Cross-ref iso27001-track. Owner: SRE Lead + CISO. |
| `docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.0.md` | pg_partman + plpgsql cron template pentru `mobile_push_log` (90d) / `churn_features_snapshot` (365d) / `pricing_prediction_audit` (365d). Health check + alert pipeline. Cross-ref toate spec-uri Phase 5 cu retention. Owner: Senior DBA + DevOps. |
| `docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.1.md` | PATCH — closes F-S10-08 LOW. Refactor `revyx_drop_partition_older_than` la API stabil PostgreSQL: pg_partition_root_bound + partman.show_partitions ≥4.7 fallback. Eliminat string regex pe `pg_get_expr`. Owner: Senior DBA. |
| `docs/runbook/RUNBOOK_REVYX_dkim-rotation_v1.0.0.md` | DKIM selector calendar `rvxYYYYMMDD`, 90-day rotation cycle, DNS Cloudflare/Route53 automation, DMARC verification, rollback decision tree. Stage 5 dependency. Cross-ref white-label + audit-log §4.4.3. Owner: Security Lead + DevOps. |
| `docs/runbook/RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md` | Master gate Phase 5 — 5 stages T+0..T+91 (Mobile → Marketplace → ML Pricing → Churn → White-Label) cu entry/exit gates per stage + rollback decision tree + GA decision T+91. Cross-ref toate Phase 5 specs + DPIA. Owner: VP Product + CTO + Audit Lead. |
| ★ `docs/runbook/RUNBOOK_REVYX_stage1-mobile-launch_v1.0.0.md` | NEW S13 — operational day-by-day Stage 1 (T+0 → T+14). Detaliază pre-flight T-7 verificare entry gates (10 items), sequence T+0/T+3/T+7/T+14 cu owner + audit events așteptate, daily health check protocol Senior QA, rollback decision tree expandat (5 branches), cohort selection criteria 25 interni REVYX + 25 externi, audit events expected cumulative §6 (10 event types). Cross-ref phase5-rollout-sequence §4 + mobile-rn §16 + scc-vendors §3.1+§3.2. Owner: Mobile Lead + Senior QA + CS Lead + Solution Architect + Audit Lead. |

---

## 7. Audit + Readiness

| Document | Descriere |
|---|---|
| `docs/audit/AUDIT_REVYX_s8-external-pass_v1.0.0.md` | S9 audit pass pe S8 deliverables. Findings F-01..F-09 cu severitate. Verificare initial Phase 5 coverage. Cross-ref toate spec-urile S8. Owner: Audit Lead + echipa virtuală. |
| `docs/audit/AUDIT_REVYX_s10-external-pass_v1.0.0.md` | S10 audit pass — verifică F-03..F-09 closed; introducere F-S10-01..10. Cuprinde reclasificare F-S10-04 MED→HIGH (BLOCANT Stage 5 entry). Cross-ref toate spec-urile S9-S10. Owner: Audit Lead + echipa virtuală. |
| `docs/audit/AUDIT_REVYX_s11-external-pass_v1.0.0.md` | S12 audit pass pe S11 deliverables. Verificare F-S10-01..03/05/06/10 closed; tracked F-S10-04 (HIGH gating)/07-09; 8 noi findings F-S11-01..08 (3 MED + 5 LOW). Inline-fixed S12 fix table §7. Owner: Audit Lead. |
| ★ `docs/audit/AUDIT_REVYX_s12-external-pass_v1.0.0.md` | NEW S13 — audit pass pe S12 deliverables (`pii-field-registry` + `audit-log v1.1.1` + `partition-maintenance v1.0.1` + `CHECKLIST_pre-pilot` + `READINESS_REVYX_phase5`). Verifică F-S10-04/08/09 + F-S11-01/02/04/05/08 closed. F-S11-01 verificat operațional cu extension multi-spec; 1 nou finding F-S12-01 LOW inline-fixed. Cross-ref `READINESS_REVYX_phase5` §0 + `SCC_VENDORS_phase5` §3. Owner: Audit Lead + echipa virtuală. |
| `docs/audit/READINESS_REVYX_phase5_v1.0.0.md` | Initial — closes F-S11-05/03/08. Single-page sign-off matrix per stage (Pre-flight + 5 stages + GA decision) cu gate status (🟢/🟡/🔴), owner, blocker findings, sign-off date placeholder pentru board pre-T0. Cross-ref toate documente S11+S12 + phase5-rollout-sequence. Owner: Audit Lead + Senior PM + board (VP Product + CTO + CISO + DPO). |
| ★ `docs/audit/READINESS_REVYX_phase5_v1.0.1.md` | PATCH S13 — post S12 audit pass + Stage 1 launch prep. Adaugă §0.14 cross-ref `SCC_VENDORS_phase5` v1.0.0 (F-S11-03 doc-closed) + §0.15 cross-ref `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0; §3.1 Stage 1 entry gate 1.8 status 🟡 PENDING SIGNATURE pre-T-7; §3.1 noi gates 1.9 (Sentry+Slack) + 1.10 (`PHASE5_STAGE_ENTRY` event); §10 cross-ref nou audit S12 + stage1-mobile-launch + scc-vendors. Owner: Audit Lead + Senior PM. |

---

## 8. CS Playbooks + Checklists

| Document | Descriere |
|---|---|
| `docs/cs-playbooks/CHURN_MEDIUM_v1.0.0.md` | Playbook MEDIUM (P3, SLA 168h). Email + Slack DM + discovery questions. Reason codes 8 standard. Templates RO. Cross-ref churn-ga §6 task lifecycle. Owner: CS Lead. |
| `docs/cs-playbooks/CHURN_HIGH_v1.0.0.md` | Playbook HIGH (P2, SLA 72h). Personal call + concession matrix 3 tiers. Discovery questions §4.1. Templates RO. Cross-ref churn-ga + escalation. Owner: CS Lead. |
| `docs/cs-playbooks/CHURN_CRITICAL_v1.0.0.md` | Playbook CRITICAL (P1, SLA 24h). PD + emergency call + executive escalation. Templates RO. Cross-ref incident-response + churn-ga. Owner: CS Lead + VP Product. |
| `docs/cs-playbooks/CHURN_MEDIUM_v1.1.0.md` | MINOR — closes F-S10-06. Adăugare RU + EN templates paralele cu RO existent. Zero schimbare conținut RO. Cross-ref MEDIUM v1.0.0 (origine). Owner: CS Lead + Senior PM. |
| `docs/cs-playbooks/CHURN_HIGH_v1.1.0.md` | MINOR — closes F-S10-06. RU + EN sub-secțiuni paralele cu RO. Identică structură cu MEDIUM v1.1.0. Cross-ref HIGH v1.0.0. Owner: CS Lead + Senior PM. |
| `docs/cs-playbooks/CHURN_CRITICAL_v1.1.0.md` | MINOR — closes F-S10-06. RU + EN paralele cu RO. Identică structură cu MEDIUM/HIGH v1.1.0. Cross-ref CRITICAL v1.0.0. Owner: CS Lead + Senior PM. |
| `docs/cs-playbooks/CHECKLIST_pre-pilot_v1.0.0.md` | NEW S12 — closes F-S11-04 MED. Tri-lingual operational checklist Stage 4 dry-run: 5 task-uri MEDIUM + 3 HIGH + 1 CRITICAL cu pași checkbox per task, aggregate verifications, sign-off post dry-run. Cross-ref CHURN playbooks v1.1.0 + churn-ga §6. Owner: CS Lead + Senior QA. |

---

## 9. Legal + Compliance

| Document | Descriere |
|---|---|
| `docs/legal/privacy-policy.md` | Privacy Policy publică (RO + RU + EN). Sub legal review pre-Phase 5. Acoperă GDPR Art. 13/14 + Legea 133/2011 RM. Cross-ref cookie-policy + DPIA. Owner: DPO + Legal. |
| `docs/legal/cookie-policy.md` | Cookie Policy (RO + RU + EN). Categorii cookie + consent management + retention. Cross-ref privacy-policy. Owner: DPO + Legal. |
| `docs/legal/DPIA_REVYX_phase5_v1.0.0.md` | Data Protection Impact Assessment Phase 5. Single-source pentru toate features (churn-ga, marketplace, ml-pricing, mobile, white-label). Risk register, balancing test (Art. 22 + legitimate interest), sign-off triple DPO + Security Lead + CISO §10. Cross-ref toate Phase 5 specs + iso27001-track. Owner: DPO + Security Lead + CISO. |
| ★ `docs/legal/SCC_VENDORS_phase5_v1.0.0.md` | NEW S13 — closes F-S11-03 LOW. Register central SCC pentru toate procesoarele US-based + non-EU implicate Phase 5: Apple APNS §3.1 (🔴 PENDING), Google FCM §3.2 (🔴 PENDING), Cloudflare §3.3 (🟢 ON FILE), AWS eu-west-1 §3.4 (🟢 ON FILE), Stripe §3.5 (🟢 ON FILE), BSI Group MD §3.6 (🟡 PENDING). Plan operațional T-14→T-0 §5 + DPO checklist §6 + re-review trimestrial §7. Cross-ref DPIA §3.1 Art. 44+ + §6.2 + READINESS §0.14 + stage1-mobile-launch §1. Owner: DPO + Legal Lead + CISO + Senior Compliance Auditor. |

---

## 10. Test fixtures + Templates

| Document | Descriere |
|---|---|
| `docs/test-fixtures/PII_REDACTION_FIXTURES_v1.0.0.md` | Lib `@revyx/test-fixtures-pii` cu `assertNoPII(payload)` + 14 categorii regex (EMAIL/PHONE/IBAN/CNP/IDNP/PASSPORT/CC/IP). Coverage targets ≥99% per regex; perf budget 50ms/100KB. Cross-ref pii-field-registry + audit-log §4.4. Owner: Senior QA + DPO. |
| `docs/templates/HEADER_STANDARD.md` | Header obligatoriu pentru orice document nou — title + filename + version + copyright + changelog. Cf. CLAUDE.md §2. Cross-ref toate template-urile spec/runbook/audit. Owner: Senior PM. |
| `docs/templates/IMPACT_ASSESSMENT.md` | Template pentru §19 Impact Assessment în orice tech spec — scope of change + impact pe documente conexe + scoring + entități + RBAC + SLA + securitate + risks + test plan + rollout + approval gate. Cross-ref toate spec-urile §19. Owner: Senior Solution Architect. |

---

## 11. Skills (DOC_MASTER orchestrator)

| Document | Descriere |
|---|---|
| `docs/skills/DOC_MASTER.md` | Orchestrator skill — Claude execută documentation tasks via skill-uri specializate. Acoperă routing pe tipuri document (BRD/PRD/spec/workflow). Cross-ref brand-configs + template-uri. Owner: Senior PM. |
| `docs/skills/SKILL_BRD.md` | Skill generare BRD — citește brand-configs, urmează template + changelog. Header obligatoriu + glosar minim. Cross-ref BRD existent. Owner: Senior PM. |
| `docs/skills/SKILL_PRD.md` | Skill generare PRD — analog BRD pentru Product Requirements. Acoperă user stories + success metrics + acceptance criteria. Cross-ref PRD-uri existente. Owner: Senior PM + PM Lead. |
| `docs/skills/SKILL_TECH_SPEC.md` | Skill generare Tech Spec — include §19 Impact Assessment obligatoriu + brand header. Cross-ref toate spec-uri existente. Owner: Senior Solution Architect. |
| `docs/skills/SKILL_WORKFLOW.md` | Skill generare Workflow — process maps + state machines + RACI. Cross-ref workflow-uri existente. Owner: Senior PM + Solution Architect. |

---

## 12. Document count summary (S13 close)

| Categorie | Count |
|---|---|
| Foundation (CLAUDE.md + brand) | 2 |
| BRD | 2 |
| Tech Specs (Phase 0-4 + Phase 5) | 31 |
| Workflows | 9 |
| Runbooks | 7 (★ +1 stage1-mobile-launch) |
| Audit + Readiness | 6 (★ +2: AUDIT_s12 + READINESS v1.0.1) |
| CS Playbooks + Checklists | 7 |
| Legal | 4 (★ +1 SCC_VENDORS_phase5) |
| Test fixtures + Templates | 3 |
| Skills | 5 |
| **Total** | **76 documente** (incl. patch + minor versions) |

> **Notă:** documente duplicate prin versiuni (v1.0.0 + v1.1.0 + v1.0.1) sunt listate separat — fiecare versiune e document distinct istoric. Total **active** (deprecate excluse): **~62** post-S13.

---

## 13. Maintenance protocol

1. La crearea unui document **nou**: update obligatoriu §3-§11 categoria respectivă; bump versiunea acestui INDEX cu PATCH (sau MINOR la ≥3 docs noi în sesiune).
2. La bump versiune document existent: actualizare descriere; mențin entry vechi (istoric).
3. La deprecare document: append `[DEPRECATED]` în descriere + cross-ref la successor.
4. Refresh manual la fiecare audit checkpoint (post-S12, S13 — acum, S14, etc.).
5. ★ Stil descriere: target 5 rânduri în română — (1) ce e · (2) findings/feature · (3) cross-ref · (4) gating · (5) versiune+owner.

---

## 14. Approval

| Aprobator | Sign-off |
|---|---|
| Senior PM | ✅ |
| Audit Lead | ✅ |
| Solution Architect | ✅ |

---

*docs/INDEX_REVYX_documents_v1.0.1.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
