// M0.S7 · Daily task seeds — backed by the same `task_type` enum as the nba-engine spec
// (docs/tech-spec/TECH_SPEC_REVYX_nba-engine_v1.0.0.md §4.1). Demo only — persisted to
// localStorage on the client side via `lib/task-store.ts`. The MVP will replace this with
// apps/api/src/business/tasks (already scaffolded in M1.S2).

import { agents } from './agents';
import { leadsById } from './leads';
import { propertiesById } from './properties';

// P0-2 (ARCH_REVIEW F-ARCH-01): TaskType/TaskStatus partajate din @revyx/core.
import type { TaskType, TaskStatus } from '@revyx/core';
export type { TaskType, TaskStatus } from '@revyx/core';

export interface AgentTask {
  id: string;
  agentId: string;
  /** Lead id this task relates to (most tasks). May be null for `custom` tasks. */
  leadId: string | null;
  /** Property id, only relevant for schedule_showing / send_property. */
  propertyId: string | null;
  taskType: TaskType;
  /** Free-form one-liner the agent sees. */
  label: string;
  status: TaskStatus;
  /** When the task should be done (ISO local datetime, demo-friendly). */
  dueAt: string;
  /** Used for snooze re-eval; defaults to dueAt. */
  visibleAt: string;
  /** When the agent created the task (system tasks have iso-date). */
  createdAt: string;
  completedAt: string | null;
  /** Whether the task originated from the suggestion engine (NBA-style) vs manual entry. */
  source: 'system_suggestion' | 'manual';
}

function todayISO(hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}
function tomorrowISO(hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/**
 * Default seed for agent A-001 (the demo "logged-in" agent). Mix of statuses so the UI shows
 * realistic to-do progression.
 */
export function buildSeedTasks(): AgentTask[] {
  const me = agents[0];
  const lead1 = leadsById.get('L-1001') ?? null;
  const lead2 = leadsById.get('L-1003') ?? null;
  const lead3 = leadsById.get('L-1007') ?? null;
  const prop = propertiesById.get('P-1001') ?? null;

  const ids = (lead: typeof lead1) => (lead ? lead.id : null);

  return [
    {
      id: 'T-2001',
      agentId: me.id,
      leadId: ids(lead1),
      propertyId: null,
      taskType: 'first_contact',
      label: `Sună ${lead1?.name ?? 'lead urgent'} — primul contact`,
      status: 'ACTIVE',
      dueAt: todayISO(10, 0),
      visibleAt: todayISO(10, 0),
      createdAt: todayISO(8, 30),
      completedAt: null,
      source: 'system_suggestion',
    },
    {
      id: 'T-2002',
      agentId: me.id,
      leadId: ids(lead2),
      propertyId: prop?.id ?? null,
      taskType: 'schedule_showing',
      label: `Programează vizionare ${lead2?.name ?? 'lead'} pentru ${prop?.addr ?? 'P-1001'}`,
      status: 'ACTIVE',
      dueAt: todayISO(12, 30),
      visibleAt: todayISO(12, 30),
      createdAt: todayISO(9, 0),
      completedAt: null,
      source: 'system_suggestion',
    },
    {
      id: 'T-2003',
      agentId: me.id,
      leadId: ids(lead3),
      propertyId: null,
      taskType: 'follow_up',
      label: `Follow-up WhatsApp ${lead3?.name ?? 'lead'} — răspunde la întrebări`,
      status: 'PENDING',
      dueAt: todayISO(16, 0),
      visibleAt: todayISO(16, 0),
      createdAt: todayISO(9, 30),
      completedAt: null,
      source: 'system_suggestion',
    },
    {
      id: 'T-2004',
      agentId: me.id,
      leadId: 'L-1010',
      propertyId: null,
      taskType: 'send_property',
      label: 'Trimite 3 proprietăți similare clientului Maria Popescu',
      status: 'PENDING',
      dueAt: tomorrowISO(9, 30),
      visibleAt: tomorrowISO(9, 30),
      createdAt: todayISO(11, 0),
      completedAt: null,
      source: 'system_suggestion',
    },
    {
      id: 'T-2005',
      agentId: me.id,
      leadId: null,
      propertyId: null,
      taskType: 'custom',
      label: 'Pregătește prezentare săptămânală — slide-uri',
      status: 'COMPLETED',
      dueAt: todayISO(9, 0),
      visibleAt: todayISO(9, 0),
      createdAt: todayISO(7, 30),
      completedAt: todayISO(8, 45),
      source: 'manual',
    },
  ];
}
