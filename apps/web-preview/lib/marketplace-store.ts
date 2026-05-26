'use client';

// M0.S8 · Buyer profile marketplace — contact grants tracked per agent-buyer pair.

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { ContactGrant, GrantStatus } from './mock/transactions-types';

const STORAGE_KEY = 'revyx.grants.v1';
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: ContactGrant[] | null = null;

function load(): ContactGrant[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as ContactGrant[];
    if (!Array.isArray(p)) return [];
    return p;
  } catch {
    return [];
  }
}
function save(o: ContactGrant[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch {
    /* quota */
  }
}
function ensure(): ContactGrant[] {
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

export function getGrant(buyerProfileId: string, agentId: string): ContactGrant | null {
  return ensure().find((g) => g.buyerProfileId === buyerProfileId && g.agentId === agentId) ?? null;
}

export function getGrantsForAgent(agentId: string): ContactGrant[] {
  return ensure().filter((g) => g.agentId === agentId);
}

export function requestContact(input: {
  buyerProfileId: string;
  agentId: string;
  message: string;
}): ContactGrant {
  const cur = ensure();
  const existing = cur.find(
    (g) => g.buyerProfileId === input.buyerProfileId && g.agentId === input.agentId,
  );
  if (existing) return existing;
  const grant: ContactGrant = {
    id: `G-${Date.now().toString(36)}`,
    buyerProfileId: input.buyerProfileId,
    agentId: input.agentId,
    message: input.message,
    status: 'PENDING',
    requestedAt: new Date().toISOString(),
    decidedAt: null,
  };
  cache = [grant, ...cur];
  save(cache);
  notify();
  return grant;
}

export function setGrantStatus(grantId: string, status: GrantStatus): void {
  const cur = ensure();
  cache = cur.map((g) =>
    g.id === grantId ? { ...g, status, decidedAt: new Date().toISOString() } : g,
  );
  save(cache);
  notify();
}

export function useGrants(): ContactGrant[] {
  const g = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => [] as ContactGrant[],
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return g;
}

export function useMarketplaceActions(): {
  request: typeof requestContact;
  decide: typeof setGrantStatus;
} {
  return {
    request: useCallback(requestContact, []),
    decide: useCallback(setGrantStatus, []),
  };
}
