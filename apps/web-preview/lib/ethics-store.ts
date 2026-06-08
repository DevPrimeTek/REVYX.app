'use client';

// Val 2 (AGI §18.4 Ethics Checkpoints) · localStorage — set de checkpoint-uri confirmate.
// VISUAL SKELETON. Structura avansată (datorie urmărită): entitate `ethics_checkpoints`
// append-only (analog AUDIT_LOG) + 6 trigger-uri + raport manager + AUDIT_LOG events.

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.ethicsAck.v1';

type Store = Record<string, boolean>;
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

export function acknowledge(key: string): void {
  cache = { ...ensure(), [key]: true };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }
  notify();
}

export function useAcknowledged(key: string): boolean {
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
  return all[key] ?? false;
}
