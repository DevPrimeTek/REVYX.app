'use client';

// M0.S7 · Task store — localStorage persistence + React hook.
// Demo only. Replace with apps/api/src/business/tasks endpoints in M1.S5.

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { buildSeedTasks, type AgentTask, type TaskStatus, type TaskType } from './mock/tasks';

const STORAGE_KEY = 'revyx.tasks.v1';
type Listener = () => void;
const listeners = new Set<Listener>();

function loadFromStorage(): AgentTask[] {
  if (typeof window === 'undefined') return buildSeedTasks();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeedTasks();
    const parsed = JSON.parse(raw) as AgentTask[];
    if (!Array.isArray(parsed)) return buildSeedTasks();
    return parsed;
  } catch {
    return buildSeedTasks();
  }
}

function saveToStorage(tasks: AgentTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // quota or private mode — silent
  }
}

// In-memory cache so consumers reading via getSnapshot get a stable reference.
let cache: AgentTask[] | null = null;

function ensureCache(): AgentTask[] {
  if (cache === null) cache = loadFromStorage();
  return cache;
}

function notify(): void {
  for (const l of listeners) l();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAllTasks(): AgentTask[] {
  return ensureCache();
}

export function getActiveCount(agentId: string): number {
  return ensureCache().filter((t) => t.agentId === agentId && t.status === 'ACTIVE').length;
}

export function addTask(input: {
  agentId: string;
  taskType: TaskType;
  label: string;
  leadId: string | null;
  propertyId?: string | null;
  dueAt: string;
  status?: TaskStatus;
}): { ok: boolean; reason?: 'BR_04_MAX_3_ACTIVE_TASKS' } {
  const next = ensureCache();
  const status: TaskStatus = input.status ?? 'PENDING';

  if (status === 'ACTIVE') {
    const activeNow = next.filter((t) => t.agentId === input.agentId && t.status === 'ACTIVE').length;
    if (activeNow >= 3) return { ok: false, reason: 'BR_04_MAX_3_ACTIVE_TASKS' };
  }

  const now = new Date().toISOString();
  const id = `T-${Math.floor(2_000 + Math.random() * 8_000)}`;
  const task: AgentTask = {
    id,
    agentId: input.agentId,
    leadId: input.leadId,
    propertyId: input.propertyId ?? null,
    taskType: input.taskType,
    label: input.label,
    status,
    dueAt: input.dueAt,
    visibleAt: input.dueAt,
    createdAt: now,
    completedAt: null,
    source: input.taskType === 'custom' ? 'manual' : 'system_suggestion',
  };
  cache = [...next, task];
  saveToStorage(cache);
  notify();
  return { ok: true };
}

export function updateTask(taskId: string, patch: Partial<AgentTask>): void {
  const cur = ensureCache();
  cache = cur.map((t) => (t.id === taskId ? { ...t, ...patch } : t));
  saveToStorage(cache);
  notify();
}

export function completeTask(taskId: string): void {
  updateTask(taskId, { status: 'COMPLETED', completedAt: new Date().toISOString() });
}

export function snoozeTask(taskId: string, untilISO: string): void {
  updateTask(taskId, { status: 'SNOOZED', visibleAt: untilISO });
}

export function activateTask(taskId: string): { ok: boolean; reason?: 'BR_04_MAX_3_ACTIVE_TASKS' } {
  const cur = ensureCache();
  const task = cur.find((t) => t.id === taskId);
  if (!task) return { ok: true };
  const activeNow = cur.filter((t) => t.agentId === task.agentId && t.status === 'ACTIVE' && t.id !== taskId).length;
  if (activeNow >= 3) return { ok: false, reason: 'BR_04_MAX_3_ACTIVE_TASKS' };
  updateTask(taskId, { status: 'ACTIVE' });
  return { ok: true };
}

export function deleteTask(taskId: string): void {
  cache = ensureCache().filter((t) => t.id !== taskId);
  saveToStorage(cache);
  notify();
}

export function resetTasks(): void {
  cache = buildSeedTasks();
  saveToStorage(cache);
  notify();
}

/**
 * React hook for components. Returns the full task list; consumers filter as needed.
 * Uses useSyncExternalStore so SSR snapshot is deterministic (seed list).
 */
export function useTasks(): AgentTask[] {
  const tasks = useSyncExternalStore(
    subscribe,
    () => ensureCache(),
    () => buildSeedTasks(),
  );
  // Force a re-read after mount so localStorage values land in the cache once on the client.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = loadFromStorage();
    notify();
  }, []);
  return tasks;
}

export function useTaskActions(): {
  add: typeof addTask;
  complete: typeof completeTask;
  snooze: typeof snoozeTask;
  activate: typeof activateTask;
  remove: typeof deleteTask;
  reset: typeof resetTasks;
} {
  return {
    add: useCallback(addTask, []),
    complete: useCallback(completeTask, []),
    snooze: useCallback(snoozeTask, []),
    activate: useCallback(activateTask, []),
    remove: useCallback(deleteTask, []),
    reset: useCallback(resetTasks, []),
  };
}
