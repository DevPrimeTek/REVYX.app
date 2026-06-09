'use client';

// Val 4 (AGI §18.2 Agent Goals + §18.5 Value Communication Toolkit) · localStorage per agent.
// VISUAL SKELETON. Structura avansată (datorie urmărită): entitate `agent_goals` + actuals din
// cron batch + `value_proposition_card` JSONB pe users + statistici reale din APS.

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.agentGrowth.v1';

// Catalog of predefined professional growth objectives (BRD §18.2 + field knowledge).
export type ObjectiveUnit = 'count' | 'eur' | 'hours' | 'pct';

export interface CatalogItem {
  id: string;
  unit: ObjectiveUnit;
  defaultTarget: number;
}

export const CATALOG: CatalogItem[] = [
  { id: 'closedDeals', unit: 'count', defaultTarget: 4 },
  { id: 'commission', unit: 'eur', defaultTarget: 8000 },
  { id: 'showings', unit: 'count', defaultTarget: 12 },
  { id: 'newLeads', unit: 'count', defaultTarget: 20 },
  { id: 'mandates', unit: 'count', defaultTarget: 3 },
  { id: 'referrals', unit: 'count', defaultTarget: 2 },
  { id: 'reviews', unit: 'count', defaultTarget: 5 },
  { id: 'training', unit: 'hours', defaultTarget: 10 },
  { id: 'partnerCollabs', unit: 'count', defaultTarget: 3 },
  { id: 'correctPrice', unit: 'pct', defaultTarget: 80 },
];

interface AgentStats {
  closedDeals30d: number;
  trust: number;
  aps: number;
}

/** Mock actual values for skeleton — real values come from M1.S3-S6 scoring service. */
export function getActualValue(id: string, agent: AgentStats): number {
  switch (id) {
    case 'closedDeals': return agent.closedDeals30d;
    case 'commission': return agent.closedDeals30d * 7000;
    case 'showings': return agent.closedDeals30d * 3;
    case 'mandates': return Math.max(0, agent.closedDeals30d - 1);
    case 'reviews': return agent.closedDeals30d > 0 ? 2 : 0;
    default: return 0;
  }
}

export function formatObjectiveValue(v: number, unit: ObjectiveUnit): string {
  if (unit === 'eur') return `€${v.toLocaleString('ro-MD')}`;
  if (unit === 'pct') return `${v}%`;
  if (unit === 'hours') return `${v}h`;
  return String(v);
}

export interface AgentObjective {
  id: string;
  target: number;
}

export interface AgentGrowth {
  objectives: AgentObjective[];
  valueBullets: string[];
}

export const DEFAULT_GROWTH: AgentGrowth = {
  objectives: [
    { id: 'closedDeals', target: 4 },
    { id: 'commission', target: 8000 },
  ],
  valueBullets: [
    'Răspund la fiecare lead în mai puțin de 15 minute.',
    'Aduc cumpărători verificați, nu curioși.',
    'Preț corect de la început — vânzare mai rapidă, rezultat mai bun.',
  ],
};

/** Migrate from legacy format (targetDeals + targetCommissionEur) to new objectives[]. */
function migrate(stored: unknown): AgentGrowth {
  if (!stored || typeof stored !== 'object') return DEFAULT_GROWTH;
  const s = stored as Record<string, unknown>;
  if ('targetDeals' in s && !('objectives' in s)) {
    return {
      objectives: [
        { id: 'closedDeals', target: Number(s.targetDeals) || 4 },
        { id: 'commission', target: Number(s.targetCommissionEur) || 8000 },
      ],
      valueBullets: Array.isArray(s.valueBullets) ? (s.valueBullets as string[]) : DEFAULT_GROWTH.valueBullets,
    };
  }
  return stored as AgentGrowth;
}

type Store = Record<string, AgentGrowth>;
type Listener = () => void;
const listeners = new Set<Listener>();
let cache: Store | null = null;

function load(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const result: Store = {};
    for (const [k, v] of Object.entries(parsed)) {
      result[k] = migrate(v);
    }
    return result;
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
