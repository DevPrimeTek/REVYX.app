'use client';

// M0.S8 · Showing store — schedule, attend, no-show, feedback. localStorage backed.

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { buildSeedShowings } from './mock/showings';
import type { Showing, ShowingStatus, MeetingLocationType } from './mock/transactions-types';

const STORAGE_KEY = 'revyx.showings.v1';
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: Showing[] | null = null;

function load(): Showing[] {
  if (typeof window === 'undefined') return buildSeedShowings();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeedShowings();
    const p = JSON.parse(raw) as Showing[];
    if (!Array.isArray(p)) return buildSeedShowings();
    return p;
  } catch {
    return buildSeedShowings();
  }
}
function save(list: Showing[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota */
  }
}
function ensure(): Showing[] {
  if (cache === null) cache = load();
  return cache;
}
function notify(): void {
  for (const l of listeners) l();
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getAllShowings(): Showing[] {
  return ensure();
}

export function getShowingsForLead(leadId: string): Showing[] {
  return ensure().filter((s) => s.leadId === leadId);
}

export function getShowingsForProperty(propertyId: string): Showing[] {
  return ensure().filter((s) => s.propertyId === propertyId);
}

export function getShowingsForDeal(leadId: string, propertyId: string): Showing[] {
  return ensure().filter((s) => s.leadId === leadId && s.propertyId === propertyId);
}

export function addShowing(input: {
  leadId: string;
  propertyId: string;
  agentId: string;
  scheduledAt: string;
  durationMin: number;
  notes: string;
  isQualificationMeeting?: boolean;
  meetingLocationType?: MeetingLocationType;
}): Showing {
  const cur = ensure();
  const id = `S-${Math.floor(3000 + Math.random() * 6999)}`;
  const s: Showing = {
    id,
    leadId: input.leadId,
    propertyId: input.propertyId,
    agentId: input.agentId,
    scheduledAt: input.scheduledAt,
    durationMin: input.durationMin,
    status: 'SCHEDULED',
    notes: input.notes,
    feedbackScore: null,
    feedbackBody: null,
    cancelReason: null,
    createdAt: new Date().toISOString(),
    isQualificationMeeting: input.isQualificationMeeting ?? false,
    meetingLocationType: input.meetingLocationType,
  };
  cache = [s, ...cur];
  save(cache);
  notify();
  return s;
}

export function updateShowingStatus(
  id: string,
  status: ShowingStatus,
  extra?: { cancelReason?: string },
): void {
  const cur = ensure();
  cache = cur.map((s) => (s.id === id ? { ...s, status, cancelReason: extra?.cancelReason ?? s.cancelReason } : s));
  save(cache);
  notify();
}

export function setShowingFeedback(
  id: string,
  feedbackScore: number,
  feedbackBody: string,
): void {
  const cur = ensure();
  cache = cur.map((s) =>
    s.id === id ? { ...s, status: 'ATTENDED' as const, feedbackScore, feedbackBody } : s,
  );
  save(cache);
  notify();
}

export function resetShowings(): void {
  cache = buildSeedShowings();
  save(cache);
  notify();
}

export function useShowings(): Showing[] {
  const s = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => buildSeedShowings(),
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return s;
}

export function useShowingActions(): {
  add: typeof addShowing;
  setStatus: typeof updateShowingStatus;
  setFeedback: typeof setShowingFeedback;
  reset: typeof resetShowings;
} {
  return {
    add: useCallback(addShowing, []),
    setStatus: useCallback(updateShowingStatus, []),
    setFeedback: useCallback(setShowingFeedback, []),
    reset: useCallback(resetShowings, []),
  };
}
