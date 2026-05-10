# RUNBOOK — REVYX DKIM Rotation (selector `rvxYYYYMMDD`)
<!-- RUNBOOK_REVYX_dkim-rotation_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Security Lead + DevOps Lead + Senior PM | ★ Initial — closes F-S10-02 HIGH (AUDIT_REVYX_s10-external-pass v1.0.0) și gating item white-label din S9 audit §5 · selector calendar `rvxYYYYMMDD` · 90-day rotation · DNS automation Cloudflare/Route53 · DMARC verification post-rotation · rollback strategy dacă DMARC fails |

---

## 1. Scop

Acest runbook acoperă **rotația DKIM** pentru tenant-ii REVYX cu white-label email (sub `white-label` v1.0.1). DKIM (DomainKeys Identified Mail) este un mecanism de signing cryptografic al emailurilor outbound — necesar pentru livrare reliable la Gmail / Outlook / Yahoo (DMARC strict). Cheile DKIM trebuie rotate periodic pentru:

| Motiv | Detaliu |
|---|---|
| **Best practice de securitate** | NIST SP 800-57 recomandă rotație ≤1 an pentru chei email signing; REVYX adopta 90 zile (mai strict) |
| **Compliance ISO 27001 A.10.1.2** | Key Management Lifecycle |
| **Reducerea exposure** | Dacă o cheie e compromisă, fereastra de exploatare e limitată |
| **DMARC alignment** | Selector-uri rotate dovedesc disciplină key management în audit |

| Atribut | Valoare |
|---|---|
| Frecvență rotație | **90 zile** (calendar bazat pe selector `rvxYYYYMMDD`) |
| Algoritm | RSA-2048 (DKIM RFC 6376 §3.3.3) sau Ed25519 (RFC 8463) |
| Owner runbook | Security Lead + DevOps Lead |
| Trigger | Cron daily check + manual ad-hoc la incident |

---

## 2. Convenția selector `rvxYYYYMMDD`

Selector-ul DKIM e prefixul subdomain `<selector>._domainkey.<tenant_domain>`. REVYX folosește pattern:

```
rvx20260510._domainkey.tenant-acme.com
└──┬──┘└──┬───┘
   │       └─ Data activării (UTC, ISO compact: YYYYMMDD)
   └──────── Prefix REVYX (constant)
```

**Reguli:**
- Selector-ul e **immutable după activare** — nu actualizezi cheia pe același selector; creezi un nou selector cu data nouă.
- DNS TXT record vechi rămâne 7-14 zile post-rotație (overlap pentru emailuri în zbor / cached).
- Calendar de rotație: dacă activare la `2026-05-10`, următoarea rotație programată la `2026-08-08` (≈90 zile); selector nou `rvx20260808`.

---

## 3. Calendar de rotație (per tenant)

Un cron `dkim_rotation_calendar` planifică automat:

| Faza | T (relativ la activare) | Acțiune |
|---|---|---|
| **Generation** | T-7 zile | Generează cheia nouă; salvează în Vault (sealed) |
| **Pre-publish** | T-2 zile | Publică TXT DNS record nou (selector nou); valid 0/2 EOL pentru DKIM-Signature |
| **Activation** | **T (00:00 UTC)** | Switch outbound signing la noua cheie; emit `WL_EMAIL_DOMAIN_VERIFIED` cu `dkim_selector=rvxYYYYMMDD nou` |
| **Verification window** | T+0..T+24h | Test outbound + DMARC reports inbound (RUF + RUA) — verificat zero failure |
| **Old key sunset** | T+14 zile | Șterge TXT DNS record vechi; emit `WL_EMAIL_DOMAIN_REVOKED` pe selector vechi |
| **Old key destruction** | T+30 zile | Cheia veche purged din Vault (immutable history retained) |

> **Buffer:** 14 zile overlap acoperă emailuri queue-uite/retry-uite la mailbox provideri lente. 30 zile destruction face audit forensic posibil în caz de incident T+0..T+14.

---

## 4. Generare cheie (T-7)

### 4.1 Comenzi (RSA-2048)

```bash
# Generare în Vault (recomandat) sau local cu protocol clar de import
openssl genrsa -out /tmp/dkim_rvx${DATE}.private.pem 2048
openssl rsa -in /tmp/dkim_rvx${DATE}.private.pem -pubout -out /tmp/dkim_rvx${DATE}.public.pem

# Convert public key la format DNS TXT (single line, base64)
PUBKEY=$(grep -v -e "^-" /tmp/dkim_rvx${DATE}.public.pem | tr -d '\n')
echo "v=DKIM1; k=rsa; p=${PUBKEY}"
```

### 4.2 Stocare în Vault

```bash
vault kv put -mount=secret revyx/dkim/${TENANT_ID}/rvx${DATE} \
  private_key=@/tmp/dkim_rvx${DATE}.private.pem \
  public_key=@/tmp/dkim_rvx${DATE}.public.pem \
  algorithm=rsa-2048 \
  generated_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Imediat după store, șterge from local:
shred -u /tmp/dkim_rvx${DATE}.private.pem /tmp/dkim_rvx${DATE}.public.pem
```

### 4.3 Audit event

```typescript
await auditLogger.record({
  eventType: 'WL_EMAIL_DOMAIN_VERIFIED', // pre-activation marker; final WL_EMAIL_DOMAIN_VERIFIED la T0
  tenantId: tenant.id,
  metadata: {
    email_domain: tenant.emailDomain,
    dkim_selector: `rvx${DATE}`,
    spf_ok: null, dmarc_ok: null,
    phase: 'GENERATED',
  },
});
```

---

## 5. Publicare DNS (T-2)

REVYX gestionează DNS pentru tenant-ii white-label fie:
- **Self-managed** (REVYX deține zona) — automation directă.
- **Tenant-managed** (CNAME delegation la subdomain `*.email.revyx.app`) — automation indirectă; tenant scoate DNS noi conform documentației.

### 5.1 Self-managed: Cloudflare API

```bash
SELECTOR="rvx${DATE}"
TXT_VALUE="v=DKIM1; k=rsa; p=${PUBKEY}"

curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\":\"TXT\",
    \"name\":\"${SELECTOR}._domainkey.${TENANT_DOMAIN}\",
    \"content\":\"${TXT_VALUE}\",
    \"ttl\":300
  }"
```

### 5.2 Self-managed: AWS Route53

```bash
aws route53 change-resource-record-sets --hosted-zone-id "${R53_ZONE_ID}" --change-batch "{
  \"Changes\": [{
    \"Action\": \"CREATE\",
    \"ResourceRecordSet\": {
      \"Name\": \"${SELECTOR}._domainkey.${TENANT_DOMAIN}\",
      \"Type\": \"TXT\",
      \"TTL\": 300,
      \"ResourceRecords\": [{\"Value\": \"\\\"${TXT_VALUE}\\\"\"}]
    }
  }]
}"
```

### 5.3 Tenant-managed: instructive email automatat

Emit notificare la `tenant_admin` (per `tenancy-roles-extension` v1.1.0 §6.5 permission map → `wl.email.dkim.configure`):

```
Subject: DKIM Key Rotation - Action Required by ${ROTATION_DATE}

Dear ${TENANT_ADMIN_NAME},

REVYX has generated a new DKIM key for ${TENANT_DOMAIN} for the rotation
scheduled at ${ROTATION_DATE} 00:00 UTC.

Please add the following DNS TXT record:

  Name:  ${SELECTOR}._domainkey.${TENANT_DOMAIN}
  Type:  TXT
  TTL:   300
  Value: ${TXT_VALUE}

Confirmation deadline: ${ROTATION_DATE} - 24 hours (pre-publish window).

We will switch outbound signing automatically. No action required after DNS publish.
```

### 5.4 Verificare propagare DNS (T-1)

```bash
# Multi-resolver check (Google + Cloudflare + Quad9)
for RESOLVER in 8.8.8.8 1.1.1.1 9.9.9.9; do
  echo "--- Resolver $RESOLVER ---"
  dig @$RESOLVER TXT "${SELECTOR}._domainkey.${TENANT_DOMAIN}" +short
done
```

Dacă oricare resolver NU returnează TXT-ul corect → escalează: nu trecem la T0 fără DNS coherent.

---

## 6. Activare (T0 = 00:00 UTC selectorului)

### 6.1 Switch outbound signing

```typescript
// services/email/signing.ts (extras, contractul real în mailer)
await db.transaction().execute(async (trx) => {
  await trx.updateTable('tenant_dkim_active')
    .set({ active_selector: `rvx${DATE}`, activated_at: new Date() })
    .where('tenant_id', '=', tenantId)
    .execute();
});

// Mailer reads tenant_dkim_active.active_selector la fiecare send → fetch private key from Vault
```

### 6.2 Audit event final

```typescript
await auditLogger.record({
  eventType: 'WL_EMAIL_DOMAIN_VERIFIED',
  tenantId,
  metadata: {
    email_domain: tenant.emailDomain,
    dkim_selector: `rvx${DATE}`,
    spf_ok: await verifySPF(tenant.emailDomain),
    dmarc_ok: await verifyDMARC(tenant.emailDomain),
    phase: 'ACTIVATED',
    rotated_from: previousSelector,
  },
});
```

### 6.3 Smoke-test outbound

```bash
# Trimite email test la inbox-ul intern REVYX (DKIM verifier)
node scripts/send-dkim-smoke.js \
  --tenant ${TENANT_ID} \
  --to dkim-validator@revyx.app

# Verifică în 5 min:
# - DKIM-Signature header prezent cu d=${TENANT_DOMAIN}, s=rvx${DATE}
# - Authentication-Results: dkim=pass
# - DMARC: pass cu aligned d=
```

---

## 7. Verificare DMARC post-rotation (T0..T+24h)

DMARC reports vin la `mailto:rua@revyx.app` (RUA — aggregate) și `mailto:ruf@revyx.app` (RUF — forensic) configurat în DNS DMARC record `_dmarc.${TENANT_DOMAIN}`.

### 7.1 Daily DMARC parser

```bash
# Cron: 0 6 * * *  /opt/revyx/scripts/dmarc-parser.sh
psql $DATABASE_URL -c "
  SELECT
    tenant_id,
    SUM(count) FILTER (WHERE dkim_result='pass' AND spf_result='pass') AS aligned_pass,
    SUM(count) FILTER (WHERE dkim_result='fail' OR spf_result='fail')  AS fail
  FROM dmarc_aggregate_report
  WHERE report_date >= NOW() - INTERVAL '24 hours'
    AND selector = 'rvx${DATE}'
  GROUP BY tenant_id;
"
```

### 7.2 Acceptance criteria post-rotation (T+24h)

| Metric | Target |
|---|---|
| DKIM pass rate | ≥ 99.5% |
| Aligned DMARC pass | ≥ 99% |
| Fail rate (dkim=fail) | < 0.5% |
| Fail rate spike vs pre-rotation baseline | < 0.2% delta |

Dacă criteriile nu sunt îndeplinite → §8 rollback.

### 7.3 Alerting

| Metric | Tip | Alert |
|---|---|---|
| `dkim_post_rotation_fail_rate{tenant}` | gauge | >2% în 4h post-T0 → PD security-on-call |
| `dmarc_aligned_pass_rate{tenant}` | gauge | <95% în 4h post-T0 → Slack #wl-ops HIGH |
| `wl_email_domain_failed_total{tenant}` | counter | >0 → Slack #wl-ops |

---

## 8. Rollback dacă DMARC fails

### 8.1 Decision tree

```
Post-rotation fail rate >2% sustained 4h?
  ├─ YES → ROLLBACK
  └─ NO → continue verification window

Rollback steps (în ordine):
  1) Revert active_selector la cel vechi:
     UPDATE tenant_dkim_active SET active_selector='${OLD_SELECTOR}' WHERE tenant_id='${TENANT_ID}';
  2) Emit WL_EMAIL_DOMAIN_REVOKED pe selectorul nou (rvx${DATE}) cu reason='DMARC_FAIL_POST_ROTATION'
  3) Mențin TXT DNS pentru noul selector (NU șterge — pentru forensic + retry post-fix)
  4) PD security-on-call (HIGH) + Slack #wl-ops cu RCA template
  5) Email tenant_admin notificat: "DKIM rotation reverted; outbound signing continues with previous key"
```

### 8.2 Audit event rollback

```typescript
await auditLogger.record({
  eventType: 'WL_EMAIL_DOMAIN_REVOKED',
  tenantId,
  metadata: {
    email_domain: tenant.emailDomain,
    reason: 'DMARC_FAIL_POST_ROTATION',
    failed_selector: `rvx${DATE}`,
    reverted_to_selector: previousSelector,
    fail_rate_pct: 2.4,
  },
});
```

### 8.3 RCA & re-rotation

- Investigare în 7 zile: DNS propagation issue? Public key truncation? Vault wrong key fetched?
- Fix root cause; re-genera selector nou cu data fix-date (`rvxYYYYMMDD` actualizat); reia §4-§7.
- DMARC report-only mode aplicat 7 zile pre-rotation pe re-attempt (preventiv).

---

## 9. Sunset key vechi (T+14)

```bash
# Șterge TXT DNS pentru selectorul vechi
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records/${OLD_RECORD_ID}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}"

# Emit WL_EMAIL_DOMAIN_REVOKED pe selector vechi
```

```typescript
await auditLogger.record({
  eventType: 'WL_EMAIL_DOMAIN_REVOKED',
  tenantId,
  metadata: {
    email_domain: tenant.emailDomain,
    reason: 'KEY_LIFECYCLE_SUNSET',
    sunset_selector: previousSelector,
  },
});
```

---

## 10. Destruction key (T+30)

```bash
# Vault: șterge versiunea (păstrăm metadata pentru audit, dar șterge material cheie)
vault kv metadata delete -mount=secret revyx/dkim/${TENANT_ID}/${OLD_SELECTOR}
```

> **Notă:** Vault delete păstrează metadata path; doar materialul cheie (private_key) e dispărut. Audit forensic post-incident poate confirma "cheia X exista la momentul Y".

---

## 11. Procedură incident: DKIM compromisat

### 11.1 Trigger

- DKIM private key leak detected (Vault audit log + secret scan repos public)
- Mass spam reports cu DKIM=pass aliniat la noi

### 11.2 Response (≤30 min)

1. **Containment imediat:** rotate cheia URGENT (skip §3 timeline; rulează §4-§7 în 30 min)
2. `INC_DECLARED` cu severity P1 + `INC_CONTAINMENT_APPLIED`
3. Notificare tenant_admin tenant afectat + DPO
4. CISO: review key management procedure (Vault access logs)

### 11.3 Post-incident

- Post-mortem 30 min cu Security + DevOps + DPO
- DMARC report-only 14 zile pe noua cheie (în loc de 7 default)
- Audit firm notificat (dacă în derulare ISO 27001)

---

## 12. RACI

| Rol | Responsabilitate |
|---|---|
| Security Lead | Owner runbook · review trimestrial · decision rollback / RCA |
| DevOps Lead | DNS automation · scripts cron · key vault management |
| On-call SRE | Răspuns la PD security-on-call (§8.1) |
| DPO | Compliance review (rotation cadence vs ISO A.10.1.2) |
| `tenant_admin` (Enterprise) | DNS publish dacă tenant-managed delegation |
| Compliance Auditor (extern) | Audit trail review în `audit_log_compliance_view` (events `WL_EMAIL_DOMAIN_*`) |

---

## 13. Cross-references

- `white-label` v1.0.1 §6 (DKIM selector cerință) și §10.2 (BRD v1.1.0)
- `audit-log` v1.1.0 §4.4.3 (events `WL_EMAIL_DOMAIN_VERIFIED` / `WL_EMAIL_DOMAIN_REVOKED`)
- `tenancy-roles-extension` v1.1.0 §6.5 (`tenant_admin` permission `wl.email.dkim.configure`)
- `iso27001-track` v1.0.0 (control A.10.1.2 Key Management)
- `RUNBOOK_REVYX_incident-response` v1.0.0 (§11 escalation)
- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §8 (Stage 5 pre-flight: DKIM rehearsal)
- `DPIA_REVYX_phase5` v1.0.0 (impact analysis email white-label)

---

## 14. Approval

| Aprobator | Sign-off |
|---|---|
| Security Lead | ✅ |
| DevOps Lead | ✅ |
| DPO | ✅ |
| Compliance Auditor (review cadence) | ✅ |
| Solution Architect (cross-spec alignment) | ✅ |

---

*docs/runbook/RUNBOOK_REVYX_dkim-rotation_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
