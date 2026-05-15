# INDEX — REVYX Document Catalog
<!-- INDEX_REVYX_documents_v1.0.9.md · v1.0.9 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Audit Lead | Initial — retrospectiva tuturor documentelor existente la S12 close |
| 1.0.1 | 2026-05 | Senior PM + Audit Lead | PATCH — adăugare 4 documente S13 + extensie audit-catalog-lint |
| 1.0.2 | 2026-05 | Senior PM + Audit Lead | PATCH — post-Stage 1 launch + S13 audit pass (3 docs S14) |
| 1.0.3 | 2026-06 | Senior PM + Audit Lead | PATCH — post-Stage 2 launch + S14 audit pass (4 docs S15) |
| 1.0.4 | 2026-06 | Senior PM + Senior PO + Solution Architect + Audit Lead | PATCH — strategic backbone (MASTER_PLAN v1.0.0) |
| 1.0.5 | 2026-06 | Senior PM + Senior PO + Frontend Lead + Solution Architect | PATCH — dual-platform restructure (MASTER_PLAN v1.1.0 + CLAUDE.md v1.2.1) |
| 1.0.6 | 2026-06 | Senior Architect + Senior PM + Senior PO + Frontend Lead + Mobile Lead + Audit Lead | MINOR (7 docs noi) — Trio canonical introduction (PLATFORM_MATRIX v1.0.0 + ROADMAP-detailed v1.0.0 + 5 PATCH bumps) |
| 1.0.7 | 2026-06 | Senior PM + Audit Lead | PATCH — post-Stage 3 launch (T+56 close) + S15 audit pass · 4 documente S16 (AUDIT_s15 + RUNBOOK stage4-churn + READINESS v1.0.4 + mobile-rn v1.0.1) |
| 1.0.8 | 2026-06 | Senior PM + Audit Lead | PATCH — post-Stage 4 launch (T+77 close) + S16 audit pass · adăugare 4 documente S17 (AUDIT_s16 + RUNBOOK stage5-white-label + READINESS v1.0.5 + ml-pricing-ga v1.0.4); bump count summary (96 → 100 documente) |
| 1.0.9 | 2026-07 | Senior PM + Audit Lead | ★ PATCH — post-Stage 5 launch (T+91 close) + Master Phase 5 GA decision GO unanimous + S17 audit pass · adăugare 4 documente S18: (`AUDIT_REVYX_s17-external-pass` v1.0.0 audit Stage 5 exit gates 5/5 PASS + first DKIM rotation production cycle T+84 PASS + plan-tier downgrade test T+88 PASS + tenant NPS +47 + BSI post-signing verification + Master Phase 5 GA decision GO 6-eyes unanimous · `DPIA_REVYX_phase5` v1.0.1 PATCH F-S14-04 LOW CLOSED doc-side + F-S15-01 §5.3 cross-ref (`min_sample_district_n=50`) + §5.5 white-label sub-processor minimal Stage 5 verified + BSI DPA signed cross-ref · `SCC_VENDORS_phase5` v1.0.2 PATCH BSI Group MD §3.6 Status 🟢 ON FILE (signed 2026-07-13 BSI-M4 complete) + §4 summary all green + §3.6.2 post-signing operational verification · `READINESS_REVYX_phase5` v1.1.0 **MINOR — GA close** §7.2 Stage 5 exit 5/5 PASS measured + §8 Master Phase 5 GA decision T+91 sign-off 6-eyes (VP+CTO+CISO+DPO+Audit+CFO) + §8.1 cumulative metrics 7/7 PASS) · re-marcaj `★` pe entries S18; entries S17 mențin marker în istoric · bump count summary §12 (100 → 104 documente totale post-S18) · F-S14-04 LOW CLOSED doc-side (DPIA v1.0.1 PATCH) · F-S14-03 LOW + F-S15-01..03 toate CLOSED FULL (Stage 5 production stable) · F-S14-02 + F-S16-01 + F-S11-07 TRACKED unchanged · **Phase 5 = oficial GA-ready** |

---

## 1. Convenție

- Toate documentele REVYX sunt listate aici cu **descriere scurtă (≤10 rânduri, target ~5 rânduri pentru claritate)**.
- La crearea oricărui document nou — **obligatoriu** să se adauge intrare în acest INDEX (CLAUDE.md §10b Regula 6).
- La bump versiune MAJOR/MINOR pentru un document existent — actualizare descrierii.
- Sortare per categorie → alfabetică/cronologică. `★` înaintea numelui = adăugat/actualizat la sesiunea curentă (S18 acum).
- Stil descriere: 5 rânduri în română — (1) ce e · (2) findings/feature · (3) cross-ref · (4) gating · (5) versiune+owner.

---

## 2. Documente foundation (CLAUDE.md + brand)

| Document | Descriere |
|---|---|
| ★ `CLAUDE.md` v1.2.2 | Agent Operating System cheat-sheet pentru Claude Code la fiecare sesiune. Identitate proiect REVYX, documente referință (priority 0 Master Plan v1.1.1 + priority 0.1 Platform Matrix + priority 0.2 Detailed Roadmap), semantic versioning, stack tehnic, reguli critice business (BR-XX), SLA-uri, Phase 0 Security checklist, reguli operaționale §10b (Regula 1-9 incl. Regula 9 Platform Matrix compliance). **§0a Status Execuție LIVE actualizat S18 ✅ CLOSED** (Phase 5 GA close ✅ unanimous T+91; Master Phase 5 GA-ready). |
| `docs/brand-configs/revyx.md` | Brand system canonical: paletă culori, font (Inter), componente UI, ton voce. Citit de toate skill-urile la generare document. Lege pentru orice UI sau document nou. Owner: Senior Designer + PM. |

---

## 2a. Strategic Planning (v1.0.4+v1.0.5+v1.0.6)

| Document | Descriere |
|---|---|
| `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.0.0.md` [HISTORY] | INITIAL S15-bis — 3 macro-milestones (M0/M1/M2) cu 10 hats. SUPERSEDED de v1.1.0+v1.1.1. |
| `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` [HISTORY] | MINOR S15-bis-2 — Dual-platform restructure (11 hats; M1 8 sub-stages; M2 8 sub-stages). SUPERSEDED de v1.1.1. |
| ★ `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` | PATCH S15-bis-3 — Trio canonical introduction. §0 Status Tracker ★ S18 update (S17 ✅ → S18 ✅; next S19). Backwards compat full cu v1.1.0. Versiunea **activă**. |

---

## 2b. Platform & Detailed Roadmap (Trio canonical, v1.0.6)

| Document | Descriere |
|---|---|
| `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | NEW S15-bis-3 — **Single source of truth feature × platform mapping**. 15 module + 119 features. Statistici §17: 41% Web only, 4% Mobile only, 55% Both, 12% backend. §18 Mobile JUSTIFIED features (4). §19 Cross-references. Owner: Senior Architect + Senior PM + Senior PO + Frontend Lead + Mobile Lead + Audit Lead + CTO. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.0.md` | NEW S15-bis-3 — **Descompunere atomică Master Plan §4-§6 în atomic tasks** (T-XXX) cu owner hat + effort + dependencies + platform tag. ~308 tasks total · ~125-165 sesiuni Claude estimate Pro plan. Critical Path Analysis §6. Cross-ref Platform Matrix per task. Owner: Senior Architect + Senior PM + Senior PO + CTO + Audit Lead. |

---

## 3. Business / Product Requirements

| Document | Descriere |
|---|---|
| `docs/BRD_REVYX_v1.0.0.md` | Business Requirements Document v1.0 — piloni, formule scoring, RBAC 5 roluri, roadmap Phase 0-5, T01-T07 valori test. Owner: PM Lead. |
| `docs/BRD_REVYX_v1.1.0.md` | BRD bump MINOR — Pilon Retention §6.4 cu BR-13..BR-18 + KPI Prevention Rate ≥30% + entity BUYER_PROFILE §8.3 + White-Label/Mobile §10.2-10.3. Owner: PM Lead + VP Product. |

---

## 4. Tech Specs (engines + platform)

### 4.1 Phase 0-4 (lead/property/deal core)

| Document | Descriere |
|---|---|
| `TECH_SPEC_REVYX_lead-scoring_v1.0.0.md` | Lead Score (LS) engine §7.1 BRD. T01-T03 valori canonice. BR-01 firewall + BR-02 LS_initial=0.30. Owner: Backend Lead + DS. |
| `TECH_SPEC_REVYX_property_v1.0.0.md` | PROPERTY + PS §7.2 + LF freshness + GIS PostGIS. BR-09 listing decay. Owner: Backend Lead. |
| `TECH_SPEC_REVYX_match-engine_v1.0.0.md` | Match Lead × Property baseline. PS+LS+IS combined. BR-04 max 3 active. Owner: Backend Lead + DS. |
| `TECH_SPEC_REVYX_match-engine_v2.0.0.md` | Match v2 pgvector HNSW (Phase 3) + buyer profile matching marketplace. BR-05 re-matching trigger. Owner: Backend Lead + DS. |
| `TECH_SPEC_REVYX_interaction-strength_v1.0.0.md` | IS §7.3 BRD — decay function. Owner: Backend Lead. |
| `TECH_SPEC_REVYX_nba-engine_v1.0.0.md` | NBA ∈ [0, 2.0] — singura excepție de scală. Owner: DS Lead. |
| `TECH_SPEC_REVYX_aps-engine_v1.0.0.md` | APS §7.7 + APS_default 0.65 (BR-11). Owner: DS Lead + PM. |
| `TECH_SPEC_REVYX_dhi-engine_v1.0.0.md` | DHI §7.8 + TF default 0.70 (BR-10). Owner: DS Lead. |
| `TECH_SPEC_REVYX_offer-engine_v1.0.0.md` | OFFER state machine + counter chain audit. Owner: Backend Lead. |
| `TECH_SPEC_REVYX_deal-closure_v1.0.0.md` | DEAL closure flow + commission split. Owner: Backend Lead + Senior DBA. |
| `TECH_SPEC_REVYX_showing_v1.0.0.md` | SHOWING entity + scheduling + outcome. Owner: Backend Lead. |
| `TECH_SPEC_REVYX_pricing-ai_v1.0.0.md` | Pricing AI baseline (Phase 0-4); precursor ml-pricing-ga. Owner: DS Lead. |
| `TECH_SPEC_REVYX_audit-log_v1.0.0.md` | AUDIT_LOG append-only — Phase 0 BLOCANT. Partitioned monthly, RLS, redaction. BR-07. Owner: Senior DBA + Senior Security Auditor. |
| `TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md` | RBAC 5 + 4 custom roles baseline. Owner: Security Lead + Backend Lead. |
| `TECH_SPEC_REVYX_webhook-intake_v1.0.0.md` | Webhook Meta/Google/OLX HMAC + idempotență. Owner: Backend Lead + Security Lead. |
| `TECH_SPEC_REVYX_concurrency-hardening_v1.0.0.md` | Optimistic locking + version field. Owner: Solution Architect. |
| `TECH_SPEC_REVYX_showcase-links_v1.0.0.md` | Public showcase + signed URL TTL. Owner: Backend Lead. |

### 4.2 Phase 5 (S8/S9/S10/S11/S12/...)

| Document | Descriere |
|---|---|
| `TECH_SPEC_REVYX_mobile-rn_v1.0.0.md` | React Native mobile app — push notifications, OT auth, MOBILE_DEVICE_*/AUTH_MOBILE_OT_* events. S14: executat closed PASS T+14 cu 9/9 exit gates. Owner: Mobile Lead + Solution Architect. |
| `TECH_SPEC_REVYX_mobile-rn_v1.0.1.md` | S16 PATCH F-S13-01 LOW CLOSED FULL (op deploy TestFlight T+60 verified S17). §5 API contract `push_payload.deep_link_url` field + APNS `aps.url` + FCM `data.click_action`. §6 algorithm "Push deep-link routing" cu allowlist regex + auth gate + pending storage. Backwards compat full. Cross-ref Platform Matrix §2.5+§4.5+§6.3+§12.5+§14.7. Owner: Senior PM + Solution Architect + Mobile Lead + Audit Lead. |
| `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.0.md` | Buyer self-service + contact-grant cu rate-limiting. S15: closed PASS T+14..T+35 cu 9/9 exit gates (NPS +28, buyer profiles 14, grants 6, PII match 100%). Owner: Backend Lead + DPO. |
| `TECH_SPEC_REVYX_marketplace-two-sided_v1.0.1.md` | PATCH platform clarification PER PLATFORM MATRIX §13. Buyer self-publish + agent search = WEB ONLY inițial. F-S14-01 L10n RU email template CLOSED FULL S17 (CMS deploy T+62). Owner: Senior Architect + Frontend Lead + Mobile Lead + DPO. |
| `TECH_SPEC_REVYX_white-label_v1.0.0.md` | Custom domain per tenant Enterprise, DKIM, edge HMAC. Data model `tenant_domain` + `white_label_config` + `tenant_email_domain` + `tenant_wl_audit`. 12 WL_* events. **S18: Stage 5 executed CLOSED PASS T+91 cu 5/5 exit gates (DKIM rotation rehearsal T+84 + plan-tier downgrade T+88 + NPS +47 + DMARC 100%)**. Owner: DevOps + Security Lead. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.0.md` | ML Pricing GA initial — model registry, SHADOW/CANARY/GA gates, 4-eyes promote. Owner: DS Lead + Solution Architect. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md` | PATCH F-03 HIGH (S9 audit). RENAME `pricing_model_registry → ml_model_registry`. Migrare 0600. Owner: DS Lead + Senior DBA. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.3.md` | PATCH platform clarification PER PLATFORM MATRIX §15. 4-eyes promote UI = WEB ONLY (DP-05); Bias monitoring dashboard = WEB ONLY; Pricing display per property = BOTH. Owner: Senior Architect + DS Lead + SECURITY + Frontend Lead. |
| `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.4.md` | S17 PATCH F-S15-01 MED CLOSED spec-side. `min_sample_district_n: 30 → 50` config flag bump. Backwards compat full. **S18: production stable post-deploy (Stage 5 zero bias alert post-tightening)**. Owner: DS Lead + DPO + Senior Compliance Auditor + Senior Architect. |
| `TECH_SPEC_REVYX_churn-ga_v1.0.0.md` | Churn scoring + CS task generation + Prevention Rate ≥30%. 14 events CHURN_*. S17: Stage 4 dry-run T+56..T+77 CLOSED PASS (7/7 exit gates). Owner: DS Lead + CS Lead. |
| `TECH_SPEC_REVYX_churn-ga_v1.0.1.md` | PATCH FK alignment post ml-pricing-ga v1.0.2. Owner: DS Lead + Senior DBA. |
| `TECH_SPEC_REVYX_churn-ga_v1.0.2.md` | PATCH platform clarification PER PLATFORM MATRIX §15 (Modul 14). Churn analytics dashboard = WEB ONLY (cs_lead + manager DP-05); CS task list — Web full, Mobile cs_user limited. Owner: Senior Architect + CS Lead + Frontend Lead. |
| `TECH_SPEC_REVYX_iso27001-track_v1.0.0.md` | ISO 27001 controls + risk register + internal audit. **S18: BSI Group MD engaged (DPA signed T+77); Stage 1 audit firm engagement RFP formal kick-off post-GA M+1**. Owner: CISO + Compliance Lead. |
| `TECH_SPEC_REVYX_audit-log_v1.1.0.md` | MINOR — closes F-04 HIGH. 75 events Phase 5 catalogați. CI guard `audit-catalog-lint`. Owner: Senior Security Auditor + Backend Lead. |
| `TECH_SPEC_REVYX_audit-log_v1.1.1.md` | PATCH — closes F-S10-09 + F-S11-02. Total 79 events Phase 5. S15-S18 verified: BUYER_* 13 (Stage 2) + PRICING_MODEL_* (Stage 3) + CHURN_* 14 (Stage 4) + WL_* 12 (Stage 5) emise conform; assertNoPII PASS 100%; **PHASE5_* 4/4 events emise (Stage 1-5 entry + exit + GA decision)**. Owner: Senior Security Auditor. |
| `TECH_SPEC_REVYX_tenancy-roles-extension_v1.1.0.md` | MINOR — closes F-05 + F-06. 6 roluri custom Phase 5 (cs_user, cs_lead, tenant_admin, compliance_auditor, data_science_lead, etc). View `audit_log_compliance_view`. Migrare 0610. S17: §4.5 cs_user/cs_lead RLS BR-18 verified 6/6 PASS × 2 cicluri. **S18: §4.7 plan-tier validation trigger verified Stage 5 T+88 PASS**. Owner: Security Lead + Senior DBA. |
| `TECH_SPEC_REVYX_pii-field-registry_v1.0.0.md` | NEW S12 — closes F-S10-04 HIGH. Schema + 80 path-uri seed + funcții SQL + migrare 0611 + E2E `assertNoPII`. S17: deployed prod T+75 cu 84 rows active (above target 80). Owner: Senior DBA + DPO + Senior Security Auditor. |

---

## 5. Workflows

| Document | Descriere |
|---|---|
| `docs/workflow/WORKFLOW_REVYX_lead-lifecycle_v1.0.0.md` | Lead intake → scoring → firewall → assignment → outcome. BR-01 + BR-03. Owner: PM Lead + Backend Lead. |
| `docs/workflow/WORKFLOW_REVYX_lead-lifecycle_v1.0.1.md` | PATCH platform clarification PER PLATFORM MATRIX §3. Manager queue + reassignment = WEB ONLY DP-05. Owner: Senior Architect + Frontend Lead. |
| `docs/workflow/WORKFLOW_REVYX_property-onboarding_v1.0.0.md` | Property listing creation, PS compute, GIS, LF decay. Owner: Backend Lead + Senior Designer. |
| `docs/workflow/WORKFLOW_REVYX_offer-chain_v1.0.0.md` | OFFER → counter → accept/reject + audit chain. Owner: Backend Lead. |
| `docs/workflow/WORKFLOW_REVYX_offer-chain_v1.0.1.md` | PATCH platform clarification PER PLATFORM MATRIX §8. Manager review queue = WEB ONLY DP-05. Owner: Senior Architect + Frontend Lead. |
| `docs/workflow/WORKFLOW_REVYX_deal-closure_v1.0.0.md` | DEAL pipeline + commission + DHI tracking. Owner: Backend Lead + PM. |
| `docs/workflow/WORKFLOW_REVYX_showing-flow_v1.0.0.md` | SHOWING schedule + outcome + reminders. Owner: Backend Lead + CS Lead. |
| `docs/workflow/WORKFLOW_REVYX_escalation_v1.0.0.md` | Escalation Protocol BR-03 — 3 niveluri. Owner: PM Lead + CS Lead. |
| `docs/workflow/WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md` | Tenant onboarding → active → downgrade → suspended. Owner: PM Lead + Sales. |
| `docs/workflow/WORKFLOW_REVYX_buyer-profile-lifecycle_v1.0.0.md` | Buyer self-publish → contact-grant → expire/revoke. Owner: Backend Lead + DPO. |
| `docs/workflow/WORKFLOW_REVYX_white-label-onboarding_v1.0.0.md` | Domain claim → verified → TLS → config. **S18: workflow verified Stage 5 production cycle T+78 PASS**. Owner: DevOps + Security Lead. |

---

## 6. Runbooks (operational)

| Document | Descriere |
|---|---|
| `docs/runbook/RUNBOOK_REVYX_incident-response_v1.0.0.md` | Incident lifecycle P1-P4, IC role, GDPR breach 72h. Owner: CISO + IC pool. |
| `docs/runbook/RUNBOOK_REVYX_dr-test_v1.0.0.md` | DR test scenarios + RPO/RTO + ISO 27001 evidence. Owner: SRE Lead + CISO. |
| `docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.0.md` | pg_partman cron template. Owner: Senior DBA + DevOps. |
| `docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.1.md` | PATCH closes F-S10-08. Cron T+30 validation PASS (F-S13-02 closed). S17: deployed prod T+75 cu migrare 0612. Owner: Senior DBA. |
| `docs/runbook/RUNBOOK_REVYX_dkim-rotation_v1.0.0.md` | DKIM 90-day rotation cycle + DMARC. S17: staging rehearsal PASS T+72. **S18: first production rotation cycle T+84 PASS pe tenant pilot TENANT-ENT-PILOT-01 (selector rvx20260801 → rvx20260814; DMARC 100% sustained 9d post-rotation; rollback NOT invoked)**. Owner: Security Lead + DevOps. |
| `docs/runbook/RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md` | Master gate Phase 5 — 5 stages T+0..T+91 cu entry/exit gates + GA decision T+91. **S18: Master Phase 5 GA decision = GO unanimous T+91 (6/6 aprobatori VP+CTO+CISO+DPO+Audit+CFO)**. Owner: VP Product + CTO + Audit Lead. |
| `docs/runbook/RUNBOOK_REVYX_stage1-mobile-launch_v1.0.0.md` | Operational day-by-day Stage 1 (T+0 → T+14). S14: executat CLOSED PASS T+14 cu 9/9 exit gates. Owner: Mobile Lead + Senior QA + CS Lead + Solution Architect + Audit Lead. |
| `docs/runbook/RUNBOOK_REVYX_stage2-marketplace-launch_v1.0.0.md` | Operational day-by-day Stage 2 (T+14 → T+35). S15: executat CLOSED PASS T+35 cu 9/9 exit gates. Owner: Marketplace Lead + Senior QA + CS Lead + DPO + Security Lead + Audit Lead. |
| `docs/runbook/RUNBOOK_REVYX_stage3-ml-pricing-launch_v1.0.0.md` | Operational day-by-day Stage 3 (T+35 → T+56) ML Pricing CANARY 5%→25%. S16: executat CLOSED PASS T+56 cu 6/6 exit gates. Owner: DS Lead + Solution Architect + Senior QA + Security Lead + Backend Lead + DPO + Audit Lead + CTO. |
| `docs/runbook/RUNBOOK_REVYX_stage4-churn-launch_v1.0.0.md` | Operational day-by-day Stage 4 (T+56 → T+77) Churn pilot CS dry-run intern. S17: executat CLOSED PASS T+77 cu 7/7 exit gates. Owner: DS Lead + CS Lead + Solution Architect + Senior QA + Security Lead + Backend Lead + DPO + Audit Lead + VP Product. |
| `docs/runbook/RUNBOOK_REVYX_stage5-white-label-launch_v1.0.0.md` | NEW S17 — operational day-by-day Stage 5 (T+77 → T+91) White-Label first Enterprise tenant. **S18: executat CLOSED PASS T+91 cu 5/5 exit gates (TLS auto-renew + DMARC 100% sustained 9d + plan-tier downgrade PASS T+88 + edge HMAC defensive + tenant NPS +47); zero rollback invocations; first production DKIM rotation rehearsal T+84 PASS**. Owner: DevOps + Security Lead + Backend Lead + DPO + Audit Lead + VP Product + CTO + CISO + Sales Lead + Legal. |

---

## 7. Audit + Readiness

| Document | Descriere |
|---|---|
| `docs/audit/AUDIT_REVYX_s8-external-pass_v1.0.0.md` | S9 audit pe S8. Findings F-01..F-09. Owner: Audit Lead + echipa virtuală. |
| `docs/audit/AUDIT_REVYX_s10-external-pass_v1.0.0.md` | S10 audit — F-03..F-09 closed; F-S10-01..10 introducere. Owner: Audit Lead. |
| `docs/audit/AUDIT_REVYX_s11-external-pass_v1.0.0.md` | S12 audit pe S11. F-S11-01..08 introduse. Owner: Audit Lead. |
| `docs/audit/AUDIT_REVYX_s12-external-pass_v1.0.0.md` | S13 audit pe S12. F-S10-04/08/09 + F-S11 verificate closed. F-S12-01 inline-fixed. Owner: Audit Lead. |
| `docs/audit/AUDIT_REVYX_s13-external-pass_v1.0.0.md` | S14 audit post-Stage 1 Mobile. 9/9 exit gates PASS. F-S11-03 closed. 4 noi findings F-S13-01..04. Owner: Audit Lead + echipa 7-rol. |
| `docs/audit/AUDIT_REVYX_s14-external-pass_v1.0.0.md` | S15 audit post-Stage 2 Marketplace. 9/9 exit gates PASS. F-S11-08 CLOSED FULL; F-S13-02/03/04 CLOSED. 4 noi findings F-S14-01..04. Owner: Audit Lead + echipa 7-rol. |
| `docs/audit/AUDIT_REVYX_s15-external-pass_v1.0.0.md` | S16 audit post Phase 5 Stage 3 (ML Pricing CANARY 5%→25%). Verifică 6/6 exit gates PASS + bias monitoring report 28d SHADOW + 21d CANARY (4 LOW auto-resolved). F-S13-01 CLOSED doc-side. F-S14-01 PARTIAL closed. F-S15-01..03 noi findings. Stage 4 entry gates 9/9 GREEN. Owner: Audit Lead + echipa virtuală 7-rol. |
| `docs/audit/AUDIT_REVYX_s16-external-pass_v1.0.0.md` | S17 audit post Phase 5 Stage 4 (Churn pilot CS dry-run intern) execuție T+56..T+77. Verifică 7/7 exit gates §6.2 READINESS PASS (task SLA 9/9 + 0 PII leak + BR-18 RLS 6/6 × 2 cicluri + AUC drift 0.9% + outcome flow time-skip + tri-lingual playbook 3/3 + CHECKLIST 100%). §3 BR-18 RLS test E2E + §4 outcome flow. F-S14-01 + F-S15-01..03 closed. F-S16-01 LOW new TRACKED. Stage 5 entry gates 17/17 GREEN. Owner: Audit Lead + echipa virtuală 7-rol. |
| ★ `docs/audit/AUDIT_REVYX_s17-external-pass_v1.0.0.md` | NEW S18 — audit pass post Phase 5 Stage 5 (White-Label first Enterprise tenant) execuție T+77..T+91. Verifică **5/5 exit gates** §7.2 READINESS PASS (TLS auto-renew T+87 staging + DMARC 100% sustained 9d post-rotation + plan-tier downgrade test T+88 PASS + edge HMAC defensive + tenant Enterprise NPS +47). §3 first DKIM production rotation rehearsal report T+84 (selector rvx20260801 → rvx20260814 cycle complete; rollback NOT invoked; 8 milestones la timp). §4 plan-tier downgrade test T+88 report (cron suspends domain corect cu `WL_DOMAIN_SUSPENDED`; rollback restore <1h 15min; zero data leak). §5 NPS aggregation T+91 (+47 above target +40). §6 BSI DPA post-signing verification (Anexa I/II/III + RLS + meta-audit). §8 Master Phase 5 GA decision input cumulative metrics 7/7 PASS. **F-S14-04 CLOSED doc-side (DPIA v1.0.1 PATCH delivered S18). F-S14-02 + F-S16-01 + F-S11-07 TRACKED unchanged. Zero new finding S18. Master Phase 5 GA decision = GO unanimous T+91 (6/6 aprobatori)**. Cross-ref READINESS v1.1.0 + DPIA v1.0.1 + SCC v1.0.2 + RUNBOOK stage5. Owner: Audit Lead + echipa virtuală 7-rol. |
| `docs/audit/READINESS_REVYX_phase5_v1.0.0.md` | Initial — sign-off matrix per stage. Owner: Audit Lead + Senior PM + board. |
| `docs/audit/READINESS_REVYX_phase5_v1.0.1.md` | PATCH S13 — pre-Stage 1 prep. Owner: Audit Lead + Senior PM. |
| `docs/audit/READINESS_REVYX_phase5_v1.0.2.md` | PATCH S14 — post-Stage 1 + pre-Stage 2. Stage 1 9/9 PASS. Owner: Audit Lead + Senior PM. |
| `docs/audit/READINESS_REVYX_phase5_v1.0.3.md` | PATCH S15 — post-Stage 2 + pre-Stage 3. Stage 2 9/9 PASS. Stage 3 entry 9/9 GREEN. Owner: Audit Lead + Senior PM. |
| `docs/audit/READINESS_REVYX_phase5_v1.0.4.md` | PATCH S16 — post-Stage 3 + pre-Stage 4. Stage 3 6/6 PASS. Stage 4 entry 9/9 GREEN. Owner: Audit Lead + Senior PM. |
| `docs/audit/READINESS_REVYX_phase5_v1.0.5.md` | PATCH S17 — post-Stage 4 (T+77 close) + pre-Stage 5. §6.2 exit gates 7 metrici PASS. §7.1 Stage 5 entry gates 5.1-5.17 toate 🟢 GREEN. Owner: Audit Lead + Senior PM. |
| ★ `docs/audit/READINESS_REVYX_phase5_v1.1.0.md` | NEW S18 — **MINOR — Phase 5 GA CLOSE**. §7.2 Stage 5 exit gates **5 metrici măsurate (5/5 PASS)** cu sign-off ☑ data 2026-07-27 (TLS auto-renew + DMARC 100% + plan-tier downgrade + edge HMAC + NPS +47). §8 Master Phase 5 GA decision T+91 sign-off complet **6-eyes** (VP Product + CTO + CISO + DPO + Audit Lead + CFO toți ☑ 2026-07-27). §8.1 cumulative metrics review **7/7 PASS** (DAU mobile 42% · buyer profiles 73 · ML MAE 3.2% degradare · churn Prevention Rate 24% · WL Enterprise 1 active · ISO 27001 BSI engaged · PHASE5_* 4/4). §8.2 GA approval gate GO unanimous. §11 update protocol bump explicat (PATCH vs MINOR vs MAJOR semver). §0.19 Stage 5 runbook executed CLOSED PASS. Cross-ref AUDIT_s17 + DPIA v1.0.1 + SCC v1.0.2. Owner: Audit Lead + Senior PM + VP Product + CTO + CISO + DPO + CFO. |

---

## 8. CS Playbooks + Checklists

| Document | Descriere |
|---|---|
| `docs/cs-playbooks/CHURN_MEDIUM_v1.0.0.md` | Playbook MEDIUM (P3, SLA 168h). Templates RO. Owner: CS Lead. |
| `docs/cs-playbooks/CHURN_HIGH_v1.0.0.md` | Playbook HIGH (P2, SLA 72h). Personal call + concession matrix. Templates RO. Owner: CS Lead. |
| `docs/cs-playbooks/CHURN_CRITICAL_v1.0.0.md` | Playbook CRITICAL (P1, SLA 24h). PD + emergency call. Templates RO. Owner: CS Lead + VP Product. |
| `docs/cs-playbooks/CHURN_MEDIUM_v1.1.0.md` | MINOR — closes F-S10-06. RU + EN templates paralele. S17: Stage 4 dry-run validated tri-lingual adoption. Owner: CS Lead + Senior PM. |
| `docs/cs-playbooks/CHURN_HIGH_v1.1.0.md` | MINOR — closes F-S10-06. RU + EN paralele. S17: Stage 4 dry-run validated. Owner: CS Lead + Senior PM. |
| `docs/cs-playbooks/CHURN_CRITICAL_v1.1.0.md` | MINOR — closes F-S10-06. RU + EN paralele. S17: Stage 4 dry-run CRITICAL injection T+70 simulated CLOSE successfully. Owner: CS Lead + Senior PM. |
| `docs/cs-playbooks/CHECKLIST_pre-pilot_v1.0.0.md` | NEW S12 — closes F-S11-04 MED. Tri-lingual operational checklist Stage 4 dry-run: 5 MED + 3 HIGH + 1 CRITICAL cu pași checkbox. S17: 100% verde aggregate 2026-07-13. Owner: CS Lead + Senior QA. |

---

## 9. Legal + Compliance

| Document | Descriere |
|---|---|
| `docs/legal/privacy-policy.md` | Privacy Policy (RO + RU + EN). S15: §marketplace update merged 2026-05-11. Owner: DPO + Legal. |
| `docs/legal/cookie-policy.md` | Cookie Policy (RO + RU + EN). Owner: DPO + Legal. |
| `docs/legal/DPIA_REVYX_phase5_v1.0.0.md` | DPIA Phase 5 single-source. Sign-off triple DPO + Security Lead + CISO §10. S17: §5.4 churn-ga Art. 22 + balancing test verified Stage 4 (1 human override invocation T+68). F-S14-04 + F-S15-01 §5.3 cross-ref → v1.0.1 PATCH livrat S18. Owner: DPO + Security Lead + CISO. |
| ★ `docs/legal/DPIA_REVYX_phase5_v1.0.1.md` | NEW S18 — **PATCH closes F-S14-04 LOW doc-side**. §5.2 verbiage clarification BUYER_PROFILE contact-grant flow (audit event `BUYER_CONTACT_GRANT_APPROVED` severity HIGH explicit + retention 72h pending requests + cron timeout auto-DENIED). §5.3 ml-pricing-ga cross-ref update minor (`min_sample_district_n=50` post v1.0.4 PATCH; tighter bias gate documented). §5.5 white-label expansion (sub-processor minimal Stage 5 verified CNAME+TLS only; BSI Group MD DPA signed T+77 BSI-M4 cross-ref). §6.1 compliance_auditor pre-condiție status update (pii_field_registry 84 rows; compliance_auditor user provisionat T+76 BSI access path). §6.2 international transfers BSI row 🟢 ON FILE. Zero schimbare semantică risk register. Cross-ref AUDIT_s17 + READINESS v1.1.0 GA close. Owner: DPO + Security Lead + CISO + Senior Compliance Auditor + Audit Lead. |
| `docs/legal/SCC_VENDORS_phase5_v1.0.0.md` | Register central SCC Phase 5. S14: status §3.1+§3.2 OPERATIONAL ON FILE. Owner: DPO + Legal Lead + CISO + Senior Compliance Auditor. |
| `docs/legal/SCC_VENDORS_phase5_v1.0.1.md` | S15 PATCH — closes F-S13-03 LOW. Apple+Google ON FILE + BSI §3.6 expandat pre-Stage 5 (BSI-M1..M4 plan). S17: BSI-M4 milestone completat T+77 (DPA dual-signed); SCC v1.0.2 PATCH planificat S18. Owner: DPO + Legal Lead + Senior Compliance Auditor + CISO + Audit Lead. |
| ★ `docs/legal/SCC_VENDORS_phase5_v1.0.2.md` | NEW S18 — **PATCH BSI Group MD §3.6 Status 🟡 PENDING → 🟢 ON FILE** (DPA dual-signed 2026-07-13 T+77 BSI-M4 milestone complete per AUDIT_s17 §6). §3.6 Data semnare 2026-07-13. §3.6 Data expirare 2027-07-13. §3.6.1 plan operațional BSI-M1..M4 toate ✅ executate. §3.6.2 NEW post-signing operational verification (compliance_auditor user provisionat T+76 BSI access path; PDF dual-signed în vault verified; ISO 27001 Stage 1 RFP formal post-GA M+1). §4 summary table all green: 6/6 vendor SCC ON FILE; **Stage 5 blocker = NU**. §7 re-review anniversar BSI 2027-07-13 adăugat. Cross-ref AUDIT_s17 + DPIA v1.0.1 §6.2 BSI row 🟢 + READINESS v1.1.0 GA close. Owner: DPO + Legal Lead + Senior Compliance Auditor + CISO + Audit Lead. |

---

## 10. Test fixtures + Templates

| Document | Descriere |
|---|---|
| `docs/test-fixtures/PII_REDACTION_FIXTURES_v1.0.0.md` | Lib `@revyx/test-fixtures-pii` cu `assertNoPII(payload)` + 14 categorii regex. S16: extension snapshot fixture `deep_link_url` UUID-only verify. S17: extension `CHURN_*` 14 events assertNoPII PASS + `WL_*` 12 events smoke staging PASS. **S18: Stage 5 production verified daily T+78/80/84/88/91 zero PII leak în WL_* + PHASE5_* + RBAC_PII_REGISTRY_DEPLOYED + DKIM rotation event metadata**. Owner: Senior QA + DPO. |
| `docs/templates/HEADER_STANDARD.md` | Header obligatoriu pentru orice document nou. Owner: Senior PM. |
| `docs/templates/IMPACT_ASSESSMENT.md` | Template pentru §19 Impact Assessment în tech spec. Owner: Senior Solution Architect. |

---

## 11. Skills (DOC_MASTER orchestrator)

| Document | Descriere |
|---|---|
| `docs/skills/DOC_MASTER.md` | Orchestrator skill. Owner: Senior PM. |
| `docs/skills/SKILL_BRD.md` | Skill generare BRD. Owner: Senior PM. |
| `docs/skills/SKILL_PRD.md` | Skill generare PRD. Owner: Senior PM + PM Lead. |
| `docs/skills/SKILL_TECH_SPEC.md` | Skill generare Tech Spec + §19 Impact Assessment. Owner: Senior Solution Architect. |
| `docs/skills/SKILL_WORKFLOW.md` | Skill generare Workflow + state machines. Owner: Senior PM + Solution Architect. |

---

## 12. Document count summary (S18 close, v1.0.9)

| Categorie | Count |
|---|---|
| Foundation (CLAUDE.md + brand) | 2 (CLAUDE.md v1.2.2) |
| Strategic Planning | 3 (MASTER_PLAN v1.0.0 [history] + v1.1.0 [history] + v1.1.1 active) |
| Platform & Detailed Roadmap | 2 (PLATFORM_MATRIX v1.0.0 + ROADMAP-detailed v1.0.0) |
| BRD | 2 |
| Tech Specs (Phase 0-4 + Phase 5) | 35 |
| Workflows | 11 |
| Runbooks | 11 |
| Audit + Readiness | 16 (★ +2: AUDIT_s17 v1.0.0 + READINESS v1.1.0 MINOR) |
| CS Playbooks + Checklists | 7 |
| Legal | 7 (★ +2: DPIA v1.0.1 + SCC v1.0.2) |
| Test fixtures + Templates | 3 |
| Skills | 5 |
| **Total** | **104 documente** (incl. patch + minor versions; +4 vs v1.0.8 = 1 AUDIT + 1 DPIA PATCH + 1 SCC PATCH + 1 READINESS MINOR GA close) |

> **Notă:** documente duplicate prin versiuni sunt listate separat — fiecare versiune e document distinct istoric. Total **active** (deprecate excluse, MASTER_PLAN v1.0.0+v1.1.0 supersedat de v1.1.1): **~85** post-S18.

---

## 13. Maintenance protocol

1. La creare document **nou**: update obligatoriu §3-§11 categoria respectivă; bump PATCH (sau MINOR la ≥3 docs noi în sesiune).
2. La bump versiune existent: actualizare descriere; mențin entry vechi (istoric).
3. La deprecare: append `[DEPRECATED]` + cross-ref successor.
4. Refresh manual la fiecare audit checkpoint (post-S12, S13, S14, S15, S16, S17, S18 — acum, S19+).
5. Stil descriere: target 5 rânduri română.
6. La GA close (post-S18) — bump MINOR v1.1.0 planificat S19 raport final board (sau bump v1.1.0 direct dacă consolidat).

---

## 14. Approval

| Aprobator | Sign-off |
|---|---|
| Senior PM | ✅ |
| Senior PO | ✅ (v1.0.4) |
| Audit Lead | ✅ |
| Solution Architect | ✅ |
| CTO | ⬜ pending (S20 close) |
| DPO | ⬜ pending (S20 close) |

---

*docs/INDEX_REVYX_documents_v1.0.9.md · v1.0.9 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
