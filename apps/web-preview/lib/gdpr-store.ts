'use client';

// M0.S8 · GDPR consent + erasure request tracking per lead.

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { GdprConsent } from './mock/transactions-types';

const STORAGE_KEY = 'revyx.gdpr.v1';
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: GdprConsent[] | null = null;

function load(): GdprConsent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GdprConsent[];
  } catch {
    return [];
  }
}
function save(o: GdprConsent[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch {
    /* quota */
  }
}
function ensure(): GdprConsent[] {
  if (cache === null) cache = load();
  return cache;
}
function notify(): void {
  for (const l of listeners) l();
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getConsentForLead(leadId: string): GdprConsent | null {
  return ensure().find((c) => c.leadId === leadId) ?? null;
}

export function recordConsent(input: {
  leadId: string;
  baseConsent: boolean;
  marketingConsent: boolean;
  publicConsent: boolean;
  capturedSource: GdprConsent['capturedSource'];
}): GdprConsent {
  const cur = ensure();
  const c: GdprConsent = {
    leadId: input.leadId,
    baseConsent: input.baseConsent,
    marketingConsent: input.marketingConsent,
    publicConsent: input.publicConsent,
    capturedAt: new Date().toISOString(),
    capturedSource: input.capturedSource,
    erasureRequestedAt: null,
    erasureCompletedAt: null,
  };
  const existing = cur.findIndex((x) => x.leadId === input.leadId);
  if (existing === -1) cache = [...cur, c];
  else cache = cur.map((x, i) => (i === existing ? c : x));
  save(cache);
  notify();
  return c;
}

export function requestErasure(leadId: string): void {
  const cur = ensure();
  const found = cur.find((c) => c.leadId === leadId);
  const now = new Date().toISOString();
  if (!found) {
    cache = [
      ...cur,
      {
        leadId,
        baseConsent: true,
        marketingConsent: false,
        publicConsent: false,
        capturedAt: now,
        capturedSource: 'agent_form',
        erasureRequestedAt: now,
        erasureCompletedAt: null,
      },
    ];
  } else {
    cache = cur.map((c) => (c.leadId === leadId ? { ...c, erasureRequestedAt: now } : c));
  }
  save(cache);
  notify();
}

export function completeErasure(leadId: string): void {
  const cur = ensure();
  const now = new Date().toISOString();
  cache = cur.map((c) => (c.leadId === leadId ? { ...c, erasureCompletedAt: now } : c));
  save(cache);
  notify();
}

export function useGdprConsents(): GdprConsent[] {
  const g = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => [] as GdprConsent[],
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return g;
}

export function useGdprActions(): {
  record: typeof recordConsent;
  requestErase: typeof requestErasure;
  completeErase: typeof completeErasure;
} {
  return {
    record: useCallback(recordConsent, []),
    requestErase: useCallback(requestErasure, []),
    completeErase: useCallback(completeErasure, []),
  };
}
