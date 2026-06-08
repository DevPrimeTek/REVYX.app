'use client';

// Val 1 (AGI §18.9 Buyer Needs Assessment + §17.3 pre-aprobare bancară) · localStorage.
// VISUAL SKELETON. Structura avansată (datorie urmărită, M1.S3): entitate `buyer_assessments`
// 1-1 cu lead-ul + `assessment_completeness` GENERATED + BR-31 task la <0.50 + wire backend.

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.buyerAssessment.v1';

/** [MOLDOVA-SPECIFIC §17.3] — pre-aprobarea bancară e excepție, nu regulă în RM. */
export type BankPreapproval = 'none' | 'in_progress' | 'approved';

export interface BuyerAssessment {
  /** Pre-aprobare bancară (MoldIndConBank / Victoriabank / Mobiasbancă). */
  bankPreapproval: BankPreapproval;
  /** Buget confirmat față-în-față (editat de agent). null = neconfirmat încă. */
  confirmedBudget: number | null;
  /** Trebuie să-și vândă o proprietate înainte de a cumpăra? (afectează lichiditatea). */
  mustSellFirst: boolean;
  /** Data dorită de intrare în posesie / mutare (ISO YYYY-MM-DD) — driver de urgență. */
  possessionDate: string;
  /** Criterii necompromisabile (deal-breakers) — filtre hard la match. */
  dealBreakers: string[];
  /** Zone de flexibilitate (compromise) — soft la match. */
  compromiseAreas: string[];
}

export const EMPTY_ASSESSMENT: BuyerAssessment = {
  bankPreapproval: 'none',
  confirmedBudget: null,
  mustSellFirst: false,
  possessionDate: '',
  dealBreakers: [],
  compromiseAreas: [],
};

type Store = Record<string, BuyerAssessment>;
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
function save(s: Store): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
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

export function setBuyerAssessment(leadId: string, a: BuyerAssessment): void {
  const next = { ...ensure(), [leadId]: a };
  cache = next;
  save(cache);
  notify();
}

/** Câte câmpuri sunt completate, [0,1] — proxy pentru `assessment_completeness` (BR-31). */
export function assessmentCompleteness(a: BuyerAssessment): number {
  let filled = 0;
  const total = 5;
  if (a.bankPreapproval !== 'none') filled += 1;
  if (a.confirmedBudget != null) filled += 1;
  if (a.possessionDate) filled += 1;
  if (a.dealBreakers.length > 0) filled += 1;
  if (a.compromiseAreas.length > 0) filled += 1;
  return filled / total;
}

export function useBuyerAssessment(leadId: string): BuyerAssessment {
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
  return all[leadId] ?? EMPTY_ASSESSMENT;
}
