'use client';

// M0.S8.2 · Workspace direction store — Regula 20/21.
// Demo: toggle global (sale | rent | both) stocat în localStorage, aplicat în toată platforma.
// Producție (documentat în Regula 20): model ierarhic companie → grup → agent (fiecare ≤ părinte).
//
// Când direcția = 'sale': ascunde tenant/landlord leads, rent properties, rent deals, tab Contracte chirie.
// Când direcția = 'rent': ascunde buyer/seller leads, sale properties, sale deals, tab Acte notariale.
// Când direcția = 'both': afișează tot (comportament implicit).

import { useSyncExternalStore } from 'react';
import type { TransactionIntent } from './mock';

export type WorkspaceDirection = 'sale' | 'rent' | 'both';

const STORAGE_KEY = 'revyx.workspace.direction.v1';
const DEFAULT: WorkspaceDirection = 'both';

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: WorkspaceDirection | null = null;

function load(): WorkspaceDirection {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'sale' || raw === 'rent' || raw === 'both') return raw;
    return DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function ensureCache(): WorkspaceDirection {
  if (cache === null) cache = load();
  return cache;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): WorkspaceDirection {
  return ensureCache();
}

function getServerSnapshot(): WorkspaceDirection {
  return DEFAULT;
}

export function setWorkspaceDirection(dir: WorkspaceDirection): void {
  cache = dir;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, dir);
    } catch {
      // quota / private mode — silent
    }
  }
  for (const l of listeners) l();
}

export function useWorkspaceDirection(): WorkspaceDirection {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True dacă un intent (sale|rent) este vizibil sub direcția curentă. */
export function isIntentVisible(direction: WorkspaceDirection, intent: TransactionIntent): boolean {
  if (direction === 'both') return true;
  return direction === intent;
}
