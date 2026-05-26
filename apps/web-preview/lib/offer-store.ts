'use client';

// M0.S8 · Offer store — chain of offers per deal. localStorage backed.

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { buildSeedOffers } from './mock/offers';
import type { Offer, OfferSide, OfferStatus } from './mock/transactions-types';

const STORAGE_KEY = 'revyx.offers.v1';
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: Offer[] | null = null;

function load(): Offer[] {
  if (typeof window === 'undefined') return buildSeedOffers();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeedOffers();
    const p = JSON.parse(raw) as Offer[];
    if (!Array.isArray(p)) return buildSeedOffers();
    return p;
  } catch {
    return buildSeedOffers();
  }
}
function save(o: Offer[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch {
    /* quota */
  }
}
function ensure(): Offer[] {
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

export function getOffersForDeal(dealId: string): Offer[] {
  return ensure()
    .filter((o) => o.dealId === dealId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function addOffer(input: {
  dealId: string;
  parentId: string | null;
  side: OfferSide;
  amountEur: number;
  conditions: string;
  createdByName: string;
  needsManagerApproval?: boolean;
}): Offer {
  const cur = ensure();
  const id = `O-${Math.floor(5_500 + Math.random() * 4_499)}`;
  const exp = new Date();
  exp.setDate(exp.getDate() + 7);
  const o: Offer = {
    id,
    dealId: input.dealId,
    parentId: input.parentId,
    side: input.side,
    amountEur: input.amountEur,
    conditions: input.conditions,
    status: 'PENDING',
    expiresAt: exp.toISOString(),
    createdAt: new Date().toISOString(),
    createdByName: input.createdByName,
    needsManagerApproval: input.needsManagerApproval ?? false,
  };
  // mark parent as COUNTER if it was pending
  cache = cur.map((x) =>
    x.id === input.parentId && x.status === 'PENDING' ? { ...x, status: 'COUNTER' as const } : x,
  );
  cache = [...cache, o];
  save(cache);
  notify();
  return o;
}

export function setOfferStatus(id: string, status: OfferStatus): void {
  const cur = ensure();
  cache = cur.map((o) => (o.id === id ? { ...o, status } : o));
  save(cache);
  notify();
}

export function resetOffers(): void {
  cache = buildSeedOffers();
  save(cache);
  notify();
}

export function useOffers(): Offer[] {
  const o = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => buildSeedOffers(),
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return o;
}

export function useOfferActions(): {
  add: typeof addOffer;
  setStatus: typeof setOfferStatus;
  reset: typeof resetOffers;
} {
  return {
    add: useCallback(addOffer, []),
    setStatus: useCallback(setOfferStatus, []),
    reset: useCallback(resetOffers, []),
  };
}
