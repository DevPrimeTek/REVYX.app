#!/usr/bin/env node
// audit-catalog-lint
//
// Implements TECH_SPEC_REVYX_audit-log v1.1.0 §4.5 (CI guard) + §13 (metric).
// Closes F-04 HIGH (S9 audit) + F-S10-05 MED (S10 audit).
//
// Pipeline:
//   1) Read --spec markdown file. Extract event_type literals from §4.3 + §4.4 tables
//      and from the TS enum block in §5.1. Union = catalogued set.
//   2) Glob source files (--src multi). Grep for `auditLogger.record({ eventType: 'X' })`
//      and `eventType: 'X'` literals inside record() calls. Capture file:line.
//   3) Diff.
//      - uncatalogued (in code, not in spec) → exit 1, write report.
//      - orphans (in spec, not in code) → warn only (advisory).
//   4) Emit Prometheus-style line: `audit_event_uncatalogued_total{} <N>` to --metrics-out.

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { argv, exit } from 'node:process';
import path from 'node:path';

const args = parseArgs(argv.slice(2));
if (!args.spec) {
  console.error('FATAL: --spec required');
  exit(2);
}

// 1) Catalogued set from spec
const specText = readFileSync(args.spec, 'utf8');
const cataloged = extractCatalogedEvents(specText);
console.error(`[audit-catalog-lint] cataloged events: ${cataloged.size}`);

// 2) Code-side scan
const srcPatterns = Array.isArray(args.src) ? args.src : [args.src].filter(Boolean);
const codeMentions = []; // {eventType, file, line}
for (const pat of srcPatterns) {
  for await (const file of glob(pat)) {
    let txt;
    try {
      if (!statSync(file).isFile()) continue;
      txt = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    // Find auditLogger.record(...) call blocks (loose, single-line and multi-line).
    // We look for `eventType: '<UPPER_SNAKE>'` within ~400 chars after `auditLogger.record(`.
    const reCall = /auditLogger\.record\s*\(/g;
    let m;
    while ((m = reCall.exec(txt)) !== null) {
      const start = m.index;
      const slice = txt.slice(start, start + 800);
      const evMatch = slice.match(/eventType\s*:\s*['"]([A-Z][A-Z0-9_]+)['"]/);
      if (evMatch) {
        const upToHere = txt.slice(0, start + (evMatch.index ?? 0));
        const line = upToHere.split('\n').length;
        codeMentions.push({ eventType: evMatch[1], file, line });
      }
    }
  }
}
console.error(`[audit-catalog-lint] code mentions: ${codeMentions.length}`);

// 3) Diff
const codeSet = new Set(codeMentions.map((x) => x.eventType));
const uncatalogued = codeMentions.filter((x) => !cataloged.has(x.eventType));
const orphans = [...cataloged].filter((e) => !codeSet.has(e));

const report = {
  spec: args.spec,
  catalogedCount: cataloged.size,
  codeMentionCount: codeMentions.length,
  uncatalogued,
  orphans,
};

if (args['report-out']) {
  writeFileSync(args['report-out'], JSON.stringify(report, null, 2));
}

// 4) Metric
if (args['metrics-out']) {
  const metric =
    `# HELP audit_event_uncatalogued_total Number of audit event types referenced by code but not present in the canonical catalog.\n` +
    `# TYPE audit_event_uncatalogued_total counter\n` +
    `audit_event_uncatalogued_total ${uncatalogued.length}\n`;
  writeFileSync(args['metrics-out'], metric);
}

// Verdict
if (uncatalogued.length > 0) {
  console.error(`\n❌ ${uncatalogued.length} uncatalogued event type(s):`);
  for (const e of uncatalogued) {
    console.error(`   - ${e.eventType}  (${e.file}:${e.line})`);
  }
  console.error('\nFix: add each event to TECH_SPEC_REVYX_audit-log_v1.1.0.md §4.3 / §4.4 with severity, retention class, payload schema, alerting hook (per §4.4 conventions).');
  exit(1);
}

if (orphans.length > 0) {
  console.error(`\n⚠️  ${orphans.length} orphan catalog entries (in spec, not referenced by code):`);
  for (const e of orphans.slice(0, 20)) {
    console.error(`   - ${e}`);
  }
  if (orphans.length > 20) {
    console.error(`   ... +${orphans.length - 20} more`);
  }
  console.error('(advisory only — does not fail build; remove if no longer planned, or implement)');
}

console.error('\n✅ audit-catalog-lint passed');
exit(0);

// ---- helpers ---------------------------------------------------------------

function parseArgs(rawArgs) {
  const out = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const a = rawArgs[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = rawArgs[i + 1];
      if (val && !val.startsWith('--')) {
        if (out[key] === undefined) out[key] = val;
        else if (Array.isArray(out[key])) out[key].push(val);
        else out[key] = [out[key], val];
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

function extractCatalogedEvents(spec) {
  const set = new Set();

  // a) Markdown table cells: backtick'd UPPER_SNAKE event names in §4.3 / §4.4.
  // Match `EVENT_NAME` (allow trailing wildcard *) inside backticks.
  const reBacktick = /`([A-Z][A-Z0-9_]{2,}(?:_\*)?)`/g;
  let m;
  while ((m = reBacktick.exec(spec)) !== null) {
    const ev = m[1];
    if (ev.endsWith('_*')) continue; // family wildcard — ignore for exact diff
    if (looksLikeEventType(ev)) set.add(ev);
  }

  // b) TypeScript enum string literals in §5.1 fenced ```typescript block.
  // Match 'UPPER_SNAKE' inside the spec text (loose, ok across all fenced blocks).
  const reTsLiteral = /'([A-Z][A-Z0-9_]{2,})'/g;
  while ((m = reTsLiteral.exec(spec)) !== null) {
    const ev = m[1];
    if (looksLikeEventType(ev)) set.add(ev);
  }

  return set;
}

function looksLikeEventType(s) {
  // Heuristic: at least one underscore OR a known prefix; exclude obvious non-events.
  if (s.length < 5) return false;
  const blacklist = new Set([
    'TRUE','FALSE','NULL','UTF_8','SHA_256','HMAC_SHA256','RSA_2048','UUID','PII',
    'GDPR','CRIT','HIGH','MED','LOW','INFO','WARN','CRITICAL','PASS','FAIL',
    'STANDARD','EXTENDED','COMPLIANCE_84M','EVENT_TYPE','TENANT_ID','USER_ID',
    'DATABASE_URL','TODO','REVOKE','GRANT','CREATE','SELECT','INSERT','UPDATE',
    'DELETE','ALTER','TABLE','VIEW','INDEX','UNIQUE','CHECK','EXCEPTION',
    'DEFAULT','PRIMARY','KEY','REFERENCES','RANGE','EOF','HTTP','API','RBAC',
  ]);
  if (blacklist.has(s)) return false;
  // Must contain underscore or look like an event family prefix.
  return s.includes('_');
}
