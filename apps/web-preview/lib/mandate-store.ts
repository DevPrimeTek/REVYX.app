'use client';

// Val 2 (AGI §17.5 Mandat de exclusivitate) · localStorage.
// Agentul semnează mandat de exclusivitate cu vânzătorul (30/60/90 zile). La expirare →
// reminder. VISUAL SKELETON. Structura avansată (datorie urmărită, M1.S3): câmpuri pe LEAD
// (`mandate_status` enum + dates + FK document) + cron `mandate-expiry-checker` + NBA
// `request_mandate`/`renew_mandate` + AUDIT_LOG (MANDATE_REQUESTED/SIGNED/EXPIRED/RENEWED).

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.mandate.v1';

export type MandateStatus = 'none' | 'pending' | 'signed' | 'expired';

export interface MandateState {
  status: MandateStatus;
  /** ISO YYYY-MM-DD — data semnării. */
  signedAt: string | null;
  /** ISO YYYY-MM-DD — data expirării (signedAt + durata). */
  expiresAt: string | null;
  /** Durata aleasă: 30/60/90 zile. */
  durationDays: number | null;
}

export const EMPTY_MANDATE: MandateState = { status: 'none', signedAt: null, expiresAt: null, durationDays: null };

type Store = Record<string, MandateState>;
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

function isoPlusDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Zile rămase până la expirare (negativ = expirat). null dacă nu e semnat. */
export function daysUntilExpiry(m: MandateState): number | null {
  if (!m.expiresAt) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(m.expiresAt + 'T00:00:00');
  return Math.round((exp.getTime() - today.getTime()) / 86400000);
}

/** Status efectiv ținând cont de expirare (skeleton: derivat la citire, fără cron). */
export function effectiveStatus(m: MandateState): MandateStatus {
  if (m.status === 'signed') {
    const d = daysUntilExpiry(m);
    if (d != null && d < 0) return 'expired';
  }
  return m.status;
}

export function requestMandate(leadId: string): void {
  setMandate(leadId, { status: 'pending', signedAt: null, expiresAt: null, durationDays: null });
}

export function signMandate(leadId: string, durationDays: number): void {
  const signedAt = new Date().toISOString().slice(0, 10);
  setMandate(leadId, { status: 'signed', signedAt, expiresAt: isoPlusDays(signedAt, durationDays), durationDays });
}

export function renewMandate(leadId: string, durationDays: number): void {
  signMandate(leadId, durationDays);
}

function setMandate(leadId: string, m: MandateState): void {
  cache = { ...ensure(), [leadId]: m };
  save(cache);
  notify();
}

export function useMandate(leadId: string): MandateState {
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
  return all[leadId] ?? EMPTY_MANDATE;
}
