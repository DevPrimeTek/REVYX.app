#!/usr/bin/env node
/**
 * i18n integrity check (P0-4, ARCH_REVIEW F-ARCH-06).
 *
 * Usage: node .github/scripts/check-i18n.mjs <messages-dir>
 *
 * 1. FAIL (exit 1) on duplicate keys inside the same object scope of any
 *    messages/*.json — JSON.parse silently keeps the last value, which has
 *    already hidden translations once (en/ru duplicated "lead" blocks).
 * 2. WARN (exit 0) on key-parity gaps between ro.json (reference) and the
 *    other locales — becomes a hard fail at M1.S5 per debt item D-6.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: node check-i18n.mjs <messages-dir>');
  process.exit(2);
}

/** Scan raw JSON text and return duplicate key paths per object scope. */
function findDuplicateKeys(text) {
  const duplicates = [];
  const stack = []; // { type: 'object'|'array', keys: Set, pendingKey: string|null }
  let i = 0;
  const n = text.length;

  function readString() {
    // text[i] === '"' — returns the decoded-ish raw string, advances past closing quote
    let out = '';
    i++; // skip opening quote
    while (i < n) {
      const c = text[i];
      if (c === '\\') {
        out += text[i] + (text[i + 1] ?? '');
        i += 2;
        continue;
      }
      if (c === '"') {
        i++;
        return out;
      }
      out += c;
      i++;
    }
    throw new Error('Unterminated string literal');
  }

  let lastString = null; // most recent string, candidate for object key
  while (i < n) {
    const c = text[i];
    if (c === '"') {
      lastString = readString();
      continue;
    }
    if (c === '{') {
      stack.push({ type: 'object', keys: new Set(), path: currentPath() });
      lastString = null;
    } else if (c === '[') {
      stack.push({ type: 'array', keys: null, path: currentPath() });
      lastString = null;
    } else if (c === '}' || c === ']') {
      stack.pop();
      lastString = null;
    } else if (c === ':') {
      const top = stack[stack.length - 1];
      if (top && top.type === 'object' && lastString !== null) {
        const scopePath = top.path;
        const key = lastString;
        if (top.keys.has(key)) {
          duplicates.push(scopePath ? `${scopePath}.${key}` : key);
        }
        top.keys.add(key);
        top.pendingKey = key;
      }
      lastString = null;
    }
    i++;
  }

  function currentPath() {
    const top = stack[stack.length - 1];
    if (!top || top.type !== 'object') return top?.path ?? '';
    const base = top.path ? `${top.path}.` : '';
    return top.pendingKey ? `${base}${top.pendingKey}` : top.path;
  }

  return duplicates;
}

function flattenKeys(obj, prefix = '', out = new Set()) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) flattenKeys(v, path, out);
    else out.add(path);
  }
  return out;
}

const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
if (files.length === 0) {
  console.error(`No JSON files found in ${dir}`);
  process.exit(2);
}

let failed = false;
const parsed = {};

for (const f of files) {
  const text = readFileSync(join(dir, f), 'utf8');
  try {
    parsed[f] = JSON.parse(text);
  } catch (err) {
    console.error(`✖ ${f}: invalid JSON — ${err.message}`);
    failed = true;
    continue;
  }
  const dups = findDuplicateKeys(text);
  if (dups.length > 0) {
    failed = true;
    console.error(`✖ ${f}: ${dups.length} duplicate key(s) — last value silently wins:`);
    for (const d of dups) console.error(`    ${d}`);
  } else {
    console.log(`✓ ${f}: no duplicate keys`);
  }
}

// Parity report (warning only until M1.S5 — D-6).
const reference = 'ro.json';
if (parsed[reference]) {
  const roKeys = flattenKeys(parsed[reference]);
  for (const f of files) {
    if (f === reference || !parsed[f]) continue;
    const keys = flattenKeys(parsed[f]);
    const missing = [...roKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !roKeys.has(k));
    if (missing.length || extra.length) {
      console.log(`⚠ ${f}: parity vs ${reference} — ${missing.length} missing, ${extra.length} extra (warning until M1.S5 / D-6)`);
      for (const k of missing.slice(0, 10)) console.log(`    missing: ${k}`);
      if (missing.length > 10) console.log(`    … +${missing.length - 10} more missing`);
    } else {
      console.log(`✓ ${f}: full parity with ${reference}`);
    }
  }
}

process.exit(failed ? 1 : 0);
