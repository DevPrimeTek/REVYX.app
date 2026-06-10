'use client';

// Val 3 (AGI §18.10 MLS / Cooperation · BR-32) · Registry de parteneri de cooperare.
// Două domenii de stocare după accountType: 'agency' (partajat de echipă) vs 'individual' (personal).
// VISUAL SKELETON (localStorage). Structura avansată (datorie urmărită): entitate `partners` cu
// FK tenant_id + scope + acord inter-agency la nivel tenant (config admin).

import { useEffect, useSyncExternalStore } from 'react';
import type { AccountType } from '@/lib/account-store';

const STORAGE_KEY = 'revyx.partners.v1';

/** Aliniat cooperation_offers.scope: cooperare cu altă agenție vs rețea deschisă MLS. */
export type PartnerScope = 'inter_agency' | 'public_mls';
export type PartnerKind = 'agency' | 'individual';

export interface Partner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  kind: PartnerKind;
  scope: PartnerScope;
  defaultSplitPct: number;
}

// Cheile de domeniu — în demo o singură agenție + un singur agent individual.
const AGENCY_KEY = 'agency';
const INDIVIDUAL_KEY = 'individual';

function domainKey(type: AccountType): string {
  return type === 'agency' ? AGENCY_KEY : INDIVIDUAL_KEY;
}

const SEED: Record<string, Partner[]> = {
  [AGENCY_KEY]: [
    { id: 'PT-01', name: 'Imobil Grup', contactPerson: 'Vasile Popa', phone: '+373 22 100 200', email: 'office@imobilgrup.md', kind: 'agency', scope: 'inter_agency', defaultSplitPct: 50 },
    { id: 'PT-02', name: 'RE/MAX Moldova', contactPerson: 'Diana Rusu', phone: '+373 22 300 400', email: 'chisinau@remax.md', kind: 'agency', scope: 'inter_agency', defaultSplitPct: 50 },
    { id: 'PT-03', name: 'MaxiImob', contactPerson: 'Sergiu Ene', phone: '+373 60 700 800', email: 'contact@maxiimob.md', kind: 'agency', scope: 'public_mls', defaultSplitPct: 40 },
  ],
  [INDIVIDUAL_KEY]: [
    { id: 'PT-11', name: 'Andrei Croitoru', contactPerson: 'Andrei Croitoru', phone: '+373 69 111 222', email: 'andrei.croitoru@gmail.com', kind: 'individual', scope: 'inter_agency', defaultSplitPct: 50 },
  ],
};

type Store = Record<string, Partner[]>;
type Listener = () => void;
const listeners = new Set<Listener>();
let cache: Store | null = null;

function load(): Store {
  if (typeof window === 'undefined') return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as Store;
    return { [AGENCY_KEY]: parsed[AGENCY_KEY] ?? SEED[AGENCY_KEY], [INDIVIDUAL_KEY]: parsed[INDIVIDUAL_KEY] ?? SEED[INDIVIDUAL_KEY] };
  } catch {
    return SEED;
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
function persist(): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }
}

export function addPartner(type: AccountType, p: Omit<Partner, 'id'>): void {
  const k = domainKey(type);
  const store = ensure();
  const next: Partner = { ...p, id: `PT-${Date.now().toString().slice(-6)}` };
  cache = { ...store, [k]: [...(store[k] ?? []), next] };
  persist();
  notify();
}

export function removePartner(type: AccountType, id: string): void {
  const k = domainKey(type);
  const store = ensure();
  cache = { ...store, [k]: (store[k] ?? []).filter((p) => p.id !== id) };
  persist();
  notify();
}

/** Lista de parteneri rezolvată pentru contul curent (BR-32 resolver). */
export function usePartners(type: AccountType): Partner[] {
  const store = useSyncExternalStore(subscribe, () => ensure(), () => SEED);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return store[domainKey(type)] ?? [];
}
