'use client';

// M0.S8 · Closure phase store per deal. localStorage backed.

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { buildSeedClosureStates } from './mock/closure-states';
import type { ClosurePhase, ClosureState } from './mock/transactions-types';

const STORAGE_KEY = 'revyx.closure.v1';
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: ClosureState[] | null = null;

function load(): ClosureState[] {
  if (typeof window === 'undefined') return buildSeedClosureStates();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeedClosureStates();
    const p = JSON.parse(raw) as ClosureState[];
    if (!Array.isArray(p)) return buildSeedClosureStates();
    return p;
  } catch {
    return buildSeedClosureStates();
  }
}
function save(o: ClosureState[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch {
    /* quota */
  }
}
function ensure(): ClosureState[] {
  if (cache === null) cache = load();
  return cache;
}
function notify(): void {
  for (const l of listeners) l();
}

const EMPTY: ClosureState = {
  dealId: '',
  phase: 'NOT_STARTED',
  avansEur: null,
  avansPaidAt: null,
  financingStatus: 'NONE',
  financingBank: null,
  notaryName: null,
  notaryScheduledAt: null,
  notaryActNumber: null,
  notarizedAt: null,
  cadastreRegNumber: null,
  cadastreRegisteredAt: null,
  npsScore: null,
  npsComment: null,
  npsSubmittedAt: null,
  updatedAt: '',
};

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getClosureForDeal(dealId: string): ClosureState {
  const found = ensure().find((c) => c.dealId === dealId);
  return found ?? { ...EMPTY, dealId };
}

export function patchClosure(dealId: string, patch: Partial<ClosureState>): void {
  const cur = ensure();
  const idx = cur.findIndex((c) => c.dealId === dealId);
  const now = new Date().toISOString();
  if (idx === -1) {
    cache = [...cur, { ...EMPTY, dealId, phase: 'STARTED', ...patch, updatedAt: now }];
  } else {
    cache = cur.map((c) => (c.dealId === dealId ? { ...c, ...patch, updatedAt: now } : c));
  }
  save(cache);
  notify();
}

export function advanceClosure(dealId: string, phase: ClosurePhase): void {
  patchClosure(dealId, { phase });
}

export function resetClosure(): void {
  cache = buildSeedClosureStates();
  save(cache);
  notify();
}

export function useClosure(dealId: string): ClosureState {
  const all = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => buildSeedClosureStates(),
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return all.find((c) => c.dealId === dealId) ?? { ...EMPTY, dealId };
}

export function useClosureActions(): {
  patch: typeof patchClosure;
  advance: typeof advanceClosure;
  reset: typeof resetClosure;
} {
  return {
    patch: useCallback(patchClosure, []),
    advance: useCallback(advanceClosure, []),
    reset: useCallback(resetClosure, []),
  };
}
