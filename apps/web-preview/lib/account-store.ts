'use client';

// Val 3 (AGI §18.10 MLS / Cooperation · BR-32 Partner Registry Governance) · Tip de cont + rol.
// DEMO ONLY toggle — în producție vine din JWT/RBAC (tenant solo = individual; tenant cu ≥2 agenți
// = agency; rolul din user_role enum). VISUAL SKELETON.

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.account.v1';

export type AccountType = 'agency' | 'individual';
// RBAC aditiv (BRD §10): agent → senior_agent → team_lead → manager → admin.
export type Role = 'agent' | 'senior_agent' | 'team_lead' | 'manager' | 'admin';

export interface AccountState {
  type: AccountType;
  role: Role;
}

export const DEFAULT_ACCOUNT: AccountState = { type: 'agency', role: 'manager' };

/**
 * BR-32 — cine poate edita registry-ul de parteneri:
 * - cont agency  → DOAR team_lead / manager / admin (agent + senior_agent = read-only)
 * - cont individual → owner-ul (orice rol, fiindcă e contul lui)
 */
export function canEditPartners(account: AccountState): boolean {
  if (account.type === 'individual') return true;
  return account.role === 'team_lead' || account.role === 'manager' || account.role === 'admin';
}

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: AccountState | null = null;

function load(): AccountState {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_ACCOUNT, ...(JSON.parse(raw) as Partial<AccountState>) } : DEFAULT_ACCOUNT;
  } catch {
    return DEFAULT_ACCOUNT;
  }
}
function ensure(): AccountState {
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

export function setAccount(next: AccountState): void {
  cache = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }
  notify();
}

export function useAccount(): AccountState {
  const acc = useSyncExternalStore(subscribe, () => ensure(), () => DEFAULT_ACCOUNT);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return acc;
}
