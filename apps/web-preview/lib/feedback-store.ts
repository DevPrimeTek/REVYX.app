'use client';

// Demo promotion · Feedback flags store (localStorage, useSyncExternalStore).
// Ține minte per-browser dacă:
//   - testerul a văzut ghidul de bun-venit (welcomeSeen)
//   - a deschis formularul de feedback (promptStatus='opened' → nu mai insistăm)
//   - a închis nudge-ul (promptStatus='dismissed' → nu mai insistăm)
// Zero backend — la fel ca celelalte store-uri din demo (workspace-store etc.).

import { useSyncExternalStore } from 'react';

export type PromptStatus = 'idle' | 'dismissed' | 'opened';

type FeedbackFlags = {
  welcomeSeen: boolean;
  promptStatus: PromptStatus;
};

const STORAGE_KEY = 'revyx.feedback.flags.v1';
const DEFAULT: FeedbackFlags = { welcomeSeen: false, promptStatus: 'idle' };

const listeners = new Set<() => void>();
let cache: FeedbackFlags | null = null;

function load(): FeedbackFlags {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<FeedbackFlags>;
    return {
      welcomeSeen: parsed.welcomeSeen === true,
      promptStatus:
        parsed.promptStatus === 'dismissed' || parsed.promptStatus === 'opened'
          ? parsed.promptStatus
          : 'idle',
    };
  } catch {
    return DEFAULT;
  }
}

function ensureCache(): FeedbackFlags {
  if (cache === null) cache = load();
  return cache;
}

function persist(next: FeedbackFlags): void {
  cache = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // quota / private mode — silent
    }
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFeedbackFlags(): FeedbackFlags {
  return useSyncExternalStore(
    subscribe,
    () => ensureCache(),
    () => DEFAULT
  );
}

export function markWelcomeSeen(): void {
  persist({ ...ensureCache(), welcomeSeen: true });
}

export function markFeedbackOpened(): void {
  persist({ ...ensureCache(), promptStatus: 'opened' });
}

export function dismissNudge(): void {
  const cur = ensureCache();
  if (cur.promptStatus === 'opened') return; // nu retrograda un 'opened'
  persist({ ...cur, promptStatus: 'dismissed' });
}
