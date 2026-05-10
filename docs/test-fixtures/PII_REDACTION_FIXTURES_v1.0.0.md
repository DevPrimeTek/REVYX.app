# LIB SPEC — `@revyx/test-fixtures-pii` (PII Redaction Test Library)
<!-- PII_REDACTION_FIXTURES_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior QA / Test Architect + Security Lead + DPO | ★ Initial — closes F-08 MED (AUDIT_REVYX_s8-external-pass v1.0.0) · spec lib `@revyx/test-fixtures-pii` cu funcția `assertNoPII(payload)` · regex-uri standard pentru emails, phone numbers (MD/RU/EN/intl), IBAN-uri, CNP-uri (RO/MD), passport patterns · CI guard usage examples · zero allowlist-uri ascunse |

---

## 1. Scop

Standardizează **detection-ul de PII** în payload-uri non-PII așteptate (push notifications, ML features, model cards, snapshot tests, log lines, exports raportare):

> Reguli core:
> 1. **`assertNoPII(payload)`** este apel-uită în CI tests pentru orice loc unde am declarat că zero PII e permis (ex: `mobile_push_log.payload`, `churn_features_snapshot.features`, `cs_notes` post-redaction, audit_log_compliance_view).
> 2. **Fail-closed**: orice match de regex PII → test **eșuează** cu mesaj structurat.
> 3. **Niciun allowlist** de string-uri specifice (anti-pattern: "test@example.com" exclus). Fixture data în teste folosește exclusiv valori fictive ne-PII (`anon-uuid-...`, `+0000000000000`).

---

## 2. Surse care impun această lib (cross-spec)

| Spec | Locație | Cerință |
|---|---|---|
| `mobile-rn` v1.0.0 §12.3 | `mobile_push_log.payload` | "no PII în push payload" |
| `mobile-rn` v1.0.0 §15.6 | snapshot tests push | "test snapshot regression" |
| `churn-ga` v1.0.0+ §12.4 | `cs_notes` post 365d retention redaction | "masking export raportare" |
| `audit-log` v1.1.0 §12.4 (compliance view) | `audit_log_compliance_view.old_value_safe` | "auditor fără PII unmask" (F-06) |
| `ml-pricing-ga` v1.0.0+ §12 | model card eval_metrics | "zero PII în features" |
| `marketplace-two-sided` v1.0.1 | `BUYER_PROFILE` factor exports | masking PII granted-but-not-yet-revealed |

---

## 3. API contract

### 3.1 Funcția primară

```typescript
// @revyx/test-fixtures-pii/index.ts

export type PIICategory =
  | 'EMAIL'
  | 'PHONE_MD'        // Moldova: +373 XX XXX XXX
  | 'PHONE_RU'        // Russia: +7 XXX XXX-XX-XX
  | 'PHONE_RO'        // Romania: +40 ...
  | 'PHONE_EN_US'     // US: +1 (XXX) XXX-XXXX
  | 'PHONE_INTL'      // E.164 generic: +[1-9]\d{1,14}
  | 'IBAN'            // ISO 13616 (any country)
  | 'CNP_RO'          // Romanian CNP: 13 digits
  | 'IDNP_MD'         // Moldovan IDNP: 13 digits (different validation)
  | 'PASSPORT_RO'     // Romanian passport: 8-9 alphanumeric
  | 'PASSPORT_MD'     // Moldovan passport: 8 alphanumeric
  | 'PASSPORT_INTL'   // ICAO MRZ-style heuristic
  | 'CREDIT_CARD'     // PAN with Luhn
  | 'IPV4'            // 0-255.0-255.0-255.0-255 (also masked at /24 in compliance views)
  | 'IPV6';

export type PIIMatch = {
  category: PIICategory;
  match: string;          // matched substring (truncated to first 8 chars + "...")
  path: string;           // JSONPath into payload, e.g. "data.user.contact"
  context: string;        // 30-char window around match for debugging
};

export interface AssertNoPIIOptions {
  /** Categories explicitly enabled (default: all). */
  categories?: PIICategory[];
  /** Property paths to skip (rare; document in PR). */
  ignorePaths?: string[];
  /** Custom regex extensions; rejected if overlaps with default categories. */
  customPatterns?: { name: string; regex: RegExp }[];
  /** When true, accept E.164 placeholder `+0000000000000` and similar all-zero anonymizations. */
  allowAnonymizedPlaceholders?: boolean;
}

/**
 * Asserts that the given payload contains NO PII matching the configured categories.
 * Throws AssertNoPIIError on first match (or aggregates all matches if `aggregate: true`).
 */
export function assertNoPII(
  payload: unknown,
  opts?: AssertNoPIIOptions
): void;

/**
 * Inspect-only variant; returns matches without throwing. Useful for telemetry tests.
 */
export function findPII(
  payload: unknown,
  opts?: AssertNoPIIOptions
): PIIMatch[];

export class AssertNoPIIError extends Error {
  matches: PIIMatch[];
}
```

### 3.2 Behavior contract

1. Walk recursively prin orice tip serializabil JSON: `string | number | boolean | null | array | object`. Treat `Date` ca string ISO.
2. Pentru `string`: rulează **fiecare** regex enabled; primul match → record + (opțional throw early).
3. Pentru `number`: convertit la string și verificat doar pentru CNP_RO/IDNP_MD/CREDIT_CARD (lungime minimă 13/16).
4. `null`/`undefined`/`boolean`: ignorate.
5. **Path tracking** prin `JSONPath` (`$.data.user.contact[0]`) pentru raport eroare ușor de localizat.
6. **Fail-closed**: dacă o categorie nouă apare în `customPatterns` și un match — error chiar dacă nu e built-in.

---

## 4. Pattern catalog (regex canonical)

> Toate regex-urile sunt **case-insensitive** unde aplicabil și **anchored** doar la level token (`\b`) pentru a permite găsirea în context.

### 4.1 EMAIL

```typescript
// RFC 5322-lite (suficient pentru detection, nu validation)
const EMAIL = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i;
```

### 4.2 Phone numbers

```typescript
const PHONE_MD     = /\+?\b373\s?-?\s?\d{2}\s?-?\s?\d{3}\s?-?\s?\d{3}\b/;
const PHONE_RU     = /\+?\b7\s?-?\(?\s?\d{3}\s?\)?\s?-?\s?\d{3}\s?-?\s?\d{2}\s?-?\s?\d{2}\b/;
const PHONE_RO     = /\+?\b40\s?-?\s?\d{2,3}\s?-?\s?\d{3}\s?-?\s?\d{3,4}\b/;
const PHONE_EN_US  = /\+?\b1?\s?-?\(?\s?\d{3}\s?\)?\s?-?\s?\d{3}\s?-?\s?\d{4}\b/;
// E.164 generic: + then 1-15 digits (rejects 0-leading)
const PHONE_INTL   = /(?<![+\d])\+[1-9]\d{1,14}(?![\d])/;
```

> **Notă:** ordering critical — `PHONE_MD` rulat înainte de `PHONE_INTL` (mai specific întâi). Loc de potențial fals pozitiv la PHONE_INTL pe IDs lungi: mitigat prin lookahead `(?![\d])`.

### 4.3 IBAN (ISO 13616 — any country)

```typescript
// 2 alpha country + 2 check digits + 11..30 alphanumerics
const IBAN = /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/;
// Validation suplimentară: mod-97 = 1 (only when context-sensitive; opt-in)
```

### 4.4 CNP_RO (Romanian Personal Numeric Code)

```typescript
// 13 digits with structural validation (sex+year+month+day+county+seq+control)
const CNP_RO = /\b[1-8]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{6}\b/;
// Optional: control digit Luhn-like check (mod 11)
```

### 4.5 IDNP_MD (Moldovan IDNP)

```typescript
// 13 digits; first digit is 0 (or 2 for legal entities IDNO — different but adjacent)
const IDNP_MD = /\b[02]\d{12}\b/;
```

> **Discriminator IDNP_MD vs CNP_RO:** prefix digit diferă; ambele rulate, false positive rezolvat prin context window verificat manual la PR review.

### 4.6 Passport patterns

```typescript
const PASSPORT_RO   = /\b[A-Z]{2}\d{7}\b/;             // 2 alpha + 7 digits (e.g. AB1234567)
const PASSPORT_MD   = /\b[A-Z]\d{7}\b/;                // 1 alpha + 7 digits
const PASSPORT_INTL = /\b[A-Z0-9]{6,9}\b(?=.*passport|.*paşaport|.*паспорт)/i;  // heuristic, requires context word
```

### 4.7 Credit card (PAN — Luhn-checked)

```typescript
const CC_LIKE = /\b(?:\d[ -]?){13,19}\b/;   // candidates; final accept only if Luhn passes
function luhnPass(s: string): boolean { /* standard Luhn */ }
```

### 4.8 IP addresses

```typescript
const IPV4 = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/;
const IPV6 = /(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}|::|(?:[A-F0-9]{1,4}:){1,7}:|:(?::[A-F0-9]{1,4}){1,7}/i;
```

> **Notă mobile push:** mobile-rn §12.3 cere zero PII; IP-uri client-side **nu** trebuie incluse în payload push (sunt PII per GDPR Art. 4(1)). `assertNoPII` cu `categories=['IPV4','IPV6',...]` enabled implicit.

### 4.9 Anonymized placeholders accepted (opt-in)

Când `allowAnonymizedPlaceholders=true`:

| Pattern | Significație |
|---|---|
| `+0000000000000` (10–15 zerouri) | E.164 placeholder |
| `noreply@example.com`, `test@example.com`, `*@example.test` | RFC 2606 reserved domain |
| `0000000000000` (13 zerouri) | CNP/IDNP placeholder |
| `0.0.0.0`, `127.0.0.1`, `::1` | localhost / null IP |
| `XXXX-XXXX-XXXX-XXXX` | Card mask vizual (după redaction) |

---

## 5. Usage examples

### 5.1 În snapshot test (mobile push)

```typescript
import { assertNoPII } from '@revyx/test-fixtures-pii';
import { buildPushPayload } from '@/services/mobile/push';

test('push payload has zero PII', async () => {
  const lead = makeLead({ email: 'real@user.example', phone: '+37369123456' });
  const payload = await buildPushPayload({ leadId: lead.id, templateId: 'lead.qualified' });

  // Should never include the lead's email/phone — only opaque IDs + template anchor
  assertNoPII(payload);
  expect(payload).toMatchSnapshot();
});
```

### 5.2 În audit_log_compliance_view test (compliance auditor)

```typescript
import { assertNoPII, findPII } from '@revyx/test-fixtures-pii';

test('audit_log_compliance_view exposes no PII', async () => {
  const rows = await db.selectFrom('audit_log_compliance_view').limit(500).execute();
  for (const r of rows) {
    assertNoPII(r, { categories: ['EMAIL','PHONE_MD','PHONE_RU','PHONE_RO','PHONE_INTL','IBAN','CNP_RO','IDNP_MD'] });
  }
});
```

### 5.3 În cs_notes export test

```typescript
test('cs_notes export after 365d retention is fully redacted', async () => {
  const exported = await exportCsNotesAfterRetention(taskId);
  // Only structured fields remain; free-text redacted
  expect(exported.cs_notes).toEqual('[REDACTED_RETENTION_365D]');
  // Defense in depth: scan everything else
  assertNoPII(exported);
});
```

### 5.4 În model card / ML features audit

```typescript
test('pricing model card features contain no PII', async () => {
  const card = await loadModelCard('pricing-gbm', 'v2.1.0');
  assertNoPII(card.features, {
    // Whitelist exception: mod_card include `district_code` which is not PII (≥1k inhabitants)
    ignorePaths: ['$.features[*].district_code'],
  });
});
```

### 5.5 Ca CI guard (Jest globalSetup)

```typescript
// jest.setup.ts
import { setupPIIGuard } from '@revyx/test-fixtures-pii/jest';

setupPIIGuard({
  // Auto-scan all snapshot files; any change introducing PII fails CI immediately
  autoScanSnapshots: true,
  failOnAnyMatch: true,
});
```

```yaml
# .github/workflows/ci.yml (excerpt)
- name: Test (with PII guard)
  run: pnpm test --ci
- name: Cross-validate audit_log_compliance_view fixtures
  run: pnpm exec node ./scripts/validate-compliance-view-fixtures.ts
```

---

## 6. Distribution

### 6.1 Packaging

| Aspect | Detaliu |
|---|---|
| Name | `@revyx/test-fixtures-pii` |
| Registry | privat (npm enterprise) |
| Versioning | SemVer; major bump dacă regex catalog change → potențial breaking pentru teste existente |
| TypeScript | DA (strict) |
| Side effects | none (pure functions) |
| Bundle target | Node 20+ (CJS + ESM dual) |

### 6.2 Versioning policy

- Adăugare categorie regex nouă = MINOR (additive în default set, dar opt-in via `categories` per call rămâne stabil).
- Schimbare regex existent care ar putea cauza match-uri noi în payload-uri pre-aprobate = **MAJOR** (CI tests vor eșua → forțăm review intenționat).
- Bug fix regex (false positive eliminat) = PATCH.

### 6.3 Release sign-off

| Rol | Sign-off |
|---|---|
| Senior QA | Catalog regex + coverage |
| Security Lead | False negative review (penetration test extern al fixture lib) |
| DPO | GDPR Art. 4(1) "personal data" categories acoperite |

---

## 7. Coverage cerută

| Layer | Coverage |
|---|---|
| Regex match per categorie | ≥ 99% (incl. obfuscation common: spaces, dashes, dots) |
| `assertNoPII` walker (objects, arrays, nested) | ≥ 95% |
| Anonymized placeholders bypass | ≥ 95% |
| Path tracking accuracy | 100% (deterministic) |
| Performance: 100 KB payload | p95 < 50 ms |

### 7.1 Test corpus

| Tip date | Sursă |
|---|---|
| Email valid | RFC 5322 corner cases (encoded local parts, IDN domains) |
| Phone numbers MD/RU/RO/US | E.164 official examples + obfuscated forms (spaces, dashes, parens) |
| IBAN | Per-country mod-97-validated samples |
| CNP_RO | Generator official + obfuscated |
| IDNP_MD | Generator official |
| Passport intl | OCR-ed MRZ samples (synthetic) |
| Credit card | Luhn-valid synthetic (Stripe test PANs) |
| IPv4/IPv6 | Loopback, link-local, public range mix |
| Anonymized placeholders | All listed in §4.9 |
| **Negative corpus** (must not match) | UUIDs, hex hashes, SQL primary keys, domain names without @ |

---

## 8. Risks & Mitigations

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| R1 | False positive (UUID matches PHONE_INTL) | MED | LOW | Negative corpus + lookahead `(?![\d])` |
| R2 | False negative (encoded email `user [at] example.com`) | MED | HIGH | Adăugare pattern `[at]` / `(at)` în EMAIL regex; documentat ca know limitation |
| R3 | Regex performance pe payload mare (>1MB) | LOW | MED | Streaming walker + early exit pe match; perf budget §7 (50ms / 100KB) |
| R4 | Categorii regulatorii noi (de ex. EU DAC7 tax IDs) | LOW | MED | Versionare MINOR la fiecare adăugare; review trimestrial CISO + DPO |
| R5 | Allowlist abuziv (developer adaugă `ignorePaths` ca shortcut) | MED | HIGH | PR review obligatoriu cu DPO label-add; CI lint care raportează `ignorePaths` count > N → review |
| R6 | Anonymized placeholders accidental real PII (ex `+0000000000000` e număr real undeva) | LOW | LOW | Documentat ca opt-in; default `false` |

---

## 9. Cross-references

- `mobile-rn` v1.0.0 §12.3 + §15.6
- `churn-ga` v1.0.0+ §12.4 (cs_notes redaction)
- `audit-log` v1.1.0 §6.5 (GDPR redaction script) + §12.4 (compliance view)
- `tenancy-roles-extension` v1.1.0 §12.3 (compliance auditor PII unmask DENIED)
- `ml-pricing-ga` v1.0.0+ §12 (zero PII features)
- `marketplace-two-sided` v1.0.1 (buyer profile contact-grant flow)

---

## 10. Approval

| Aprobator | Sign-off |
|---|---|
| Senior QA / Test Architect | ✅ |
| Security Lead | ✅ |
| DPO | ✅ |
| Solution Architect (CI integration) | ✅ |

---

*docs/test-fixtures/PII_REDACTION_FIXTURES_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
