'use client';

// Val 1 (AGI §18.3 — check-list „Prima intrare") · Rezultatul întâlnirii de calificare seller.
// Persistă verdictul + prețul minim + motivația, ca să nu fie efemer. VISUAL SKELETON.
// Structura avansată (datorie urmărită): persistă pe LEAD + creează NBA `request_mandate`.

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.qualification.v1';

export interface QualificationResult {
  verdict: 'yes' | 'no';
  /** Prețul minim acceptat declarat de vânzător (text liber). */
  minPrice: string;
  /** Motivația reală a vânzării. */
  motivation: string;
  /** ISO timestamp finalizare. */
  completedAt: string;
}

type Store = Record<string, QualificationResult>;
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

export function saveQualification(leadId: string, r: QualificationResult): void {
  cache = { ...ensure(), [leadId]: r };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }
  notify();
}

export function useQualification(leadId: string): QualificationResult | null {
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
  return all[leadId] ?? null;
}
