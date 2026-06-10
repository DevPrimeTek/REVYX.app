'use client';

// Val 3 (AGI §18.10 MLS / Cooperation) · Publicarea unei proprietăți în rețeaua de parteneri,
// cu împărțirea comisionului. Gate BR-29: necesită mandat semnat. VISUAL SKELETON.
// Structura avansată (datorie urmărită): entitate `cooperation_offers` + split logat append-only
// + AUDIT_LOG (MLS_OFFER_PUBLISHED / ENGAGED / COMMISSION_SPLIT_LOGGED / WITHDRAWN).

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.cooperation.v1';

export interface CooperationState {
  published: boolean;
  /** Cota din comision oferită agentului partener (%). */
  splitPct: number;
  /** Eveniment de concentrare a cererii — Ziua Ușilor Deschise (ДОД). */
  openHouse: boolean;
  /** BR-32: partenerii din registry către care se trimite oferta de cooperare. */
  partnerIds: string[];
}

export const EMPTY_COOPERATION: CooperationState = { published: false, splitPct: 50, openHouse: false, partnerIds: [] };

type Store = Record<string, CooperationState>;
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

export function setCooperation(propertyId: string, s: CooperationState): void {
  cache = { ...ensure(), [propertyId]: s };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }
  notify();
}

export function useCooperation(propertyId: string): CooperationState {
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
  return all[propertyId] ?? EMPTY_COOPERATION;
}
