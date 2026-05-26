'use client';

// M0.S9 · Property benefits store — agent-curated USPs per property.
// Persistent localStorage. Each property has a list of benefit bullets shown on /properties/[id].

import { useCallback, useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.propertyBenefits.v1';

type Store = Record<string, string[]>;
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: Store | null = null;

/** Default seed benefits per property kind (so demo always has something visible). */
const SEED_BY_KIND: Record<string, string[]> = {
  apartment: ['Aer condiționat instalat', 'Mobilat parțial', 'Geamuri termopan'],
  house: ['Curte 200 m²', 'Garaj 2 mașini', 'Încălzire pe gaz'],
  land: ['Intravilan', 'Utilități la limită', 'Acces drum asfaltat'],
  commercial: ['Fațadă stradală', 'Vitrină mare', 'Parcare proprie'],
};

function load(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}
function save(s: Store): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}
function ensure(): Store {
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

export function getBenefits(propertyId: string, propertyKind: string): string[] {
  const stored = ensure()[propertyId];
  if (stored && stored.length > 0) return stored;
  return SEED_BY_KIND[propertyKind] ?? [];
}

export function setBenefits(propertyId: string, benefits: string[]): void {
  const cur = ensure();
  cache = { ...cur, [propertyId]: benefits };
  save(cache);
  notify();
}

export function useBenefits(propertyId: string, propertyKind: string): string[] {
  const all = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => ({} as Store),
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  const stored = all[propertyId];
  if (stored && stored.length > 0) return stored;
  return SEED_BY_KIND[propertyKind] ?? [];
}

export function useBenefitActions(): { set: typeof setBenefits } {
  return { set: useCallback(setBenefits, []) };
}
