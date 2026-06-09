'use client';

// Val 3.1 · Editarea caracteristicilor unei proprietăți — overrides per proprietate (localStorage).
// VISUAL SKELETON. Structura avansată (datorie urmărită): PATCH real pe entitatea PROPERTY
// (apps/api) cu optimistic locking + recalcul PS/LF.

import { useEffect, useSyncExternalStore } from 'react';
import type { Property, ListingType, PropertyClass } from '@/lib/mock';

const STORAGE_KEY = 'revyx.propertyEdits.v1';

/** Câmpurile editabile de agent (subset din Property). */
export interface PropertyEdits {
  addr?: string;
  zone?: string;
  area?: number;
  rooms?: number;
  priceEur?: number;
  monthlyRentEur?: number | null;
  commissionPct?: number | null;
  listingType?: ListingType;
  propertyClass?: PropertyClass;
}

type Store = Record<string, PropertyEdits>;
type Listener = () => void;
const listeners = new Set<Listener>();
let cache: Store | null = null;

function load(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}
function ensure(): Store {
  if (cache === null) cache = load();
  return cache;
}
function notify(): void {
  for (const l of listeners) l();
}
function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setPropertyEdits(propertyId: string, edits: PropertyEdits): void {
  cache = { ...ensure(), [propertyId]: edits };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }
  notify();
}

/** Aplică overrides peste proprietatea de bază. */
export function applyEdits(base: Property, edits: PropertyEdits | undefined): Property {
  if (!edits) return base;
  return { ...base, ...edits };
}

export function usePropertyEdits(propertyId: string): PropertyEdits | undefined {
  const all = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => ({}) as Store,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return all[propertyId];
}
