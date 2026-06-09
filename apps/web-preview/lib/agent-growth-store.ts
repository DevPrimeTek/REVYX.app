'use client';

// Val 4 (AGI §18.2 Agent Goals + §18.5 Value Communication Toolkit) · localStorage per agent.
// VISUAL SKELETON. Structura avansată (datorie urmărită): entitate `agent_goals` + actuals din
// cron batch + `value_proposition_card` JSONB pe users + statistici reale din APS.

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.agentGrowth.v1';

export interface AgentGrowth {
  /** Obiectiv lunar — număr de tranzacții. */
  targetDeals: number;
  /** Obiectiv lunar — comision (EUR). */
  targetCommissionEur: number;
  /** „De ce să lucrezi cu mine" — max 5 bullet-uri. */
  valueBullets: string[];
}

export const DEFAULT_GROWTH: AgentGrowth = {
  targetDeals: 4,
  targetCommissionEur: 8000,
  valueBullets: [
    'Răspund la fiecare lead în mai puțin de 15 minute.',
    'Aduc cumpărători verificați, nu curioși.',
    'Preț corect de la început — vânzare mai rapidă, rezultat mai bun.',
  ],
};

type Store = Record<string, AgentGrowth>;
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

export function setAgentGrowth(agentId: string, g: AgentGrowth): void {
  cache = { ...ensure(), [agentId]: g };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }
  notify();
}

export function useAgentGrowth(agentId: string): AgentGrowth {
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
  return all[agentId] ?? DEFAULT_GROWTH;
}
