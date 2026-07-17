'use client';

// M0.S7 · Reusable task list (used on /dashboard block A + /tasks page).
// Each row is a checkbox-style toggle (complete) with a quick action menu (snooze, activate, delete).

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useTaskActions, useTasks } from '@/lib/task-store';
import { taskTypeLabelKey } from '@/lib/mock/suggestions';
import { leadsById } from '@/lib/mock';
import type { AgentTask } from '@/lib/mock/tasks';

function formatTime(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleTimeString(locale === 'ru' ? 'ru-RU' : 'ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function statusVariant(status: AgentTask['status']): 'success' | 'info' | 'warning' | 'updated' | 'cold' {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'ACTIVE': return 'updated';
    case 'SNOOZED': return 'warning';
    case 'CANCELLED': return 'cold';
    default: return 'info';
  }
}

export function TaskList({
  agentId,
  filter = 'today',
  maxRows,
  emptyMessage,
}: {
  agentId: string;
  filter?: 'today' | 'all' | 'active' | 'completed';
  maxRows?: number;
  emptyMessage?: string;
}) {
  const { t, locale } = useT();
  const { toast } = useToast();
  const tasks = useTasks();
  const actions = useTaskActions();
  const [busyId, setBusyId] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filtered = tasks
    .filter((task) => task.agentId === agentId)
    .filter((task) => {
      if (filter === 'all') return true;
      if (filter === 'completed') return task.status === 'COMPLETED';
      if (filter === 'active') return task.status === 'ACTIVE' || task.status === 'PENDING';
      // 'today'
      const due = new Date(task.dueAt);
      return due >= today && due < tomorrow;
    })
    .sort((a, b) => {
      // Completed at the bottom, otherwise by dueAt asc
      const aDone = a.status === 'COMPLETED' ? 1 : 0;
      const bDone = b.status === 'COMPLETED' ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });

  const visible = typeof maxRows === 'number' ? filtered.slice(0, maxRows) : filtered;

  function handleToggle(task: AgentTask) {
    if (busyId) return;
    setBusyId(task.id);
    if (task.status === 'COMPLETED') {
      actions.activate(task.id);
    } else {
      actions.complete(task.id);
      toast({
        variant: 'success',
        title: t('task.toast.completed', { label: task.label }),
        description: t('task.toast.completedDesc'),
      });
    }
    setTimeout(() => setBusyId(null), 200);
  }

  function handleSnooze(task: AgentTask) {
    const until = new Date();
    until.setHours(until.getHours() + 2);
    actions.snooze(task.id, until.toISOString());
    toast({
      variant: 'info',
      title: t('task.toast.snoozed', { label: task.label }),
      description: t('task.toast.snoozedDesc'),
    });
  }

  function handleActivate(task: AgentTask) {
    const result = actions.activate(task.id);
    if (!result.ok && result.reason === 'BR_04_MAX_3_ACTIVE_TASKS') {
      toast({
        variant: 'warning',
        title: t('task.toast.maxActiveTitle'),
        description: t('task.toast.maxActiveDesc'),
      });
    }
  }

  if (visible.length === 0) {
    return (
      <p className="text-text-muted text-[12px] py-sp3 text-center">
        {emptyMessage ?? t('task.emptyToday')}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-sp2">
      {visible.map((task) => {
        const done = task.status === 'COMPLETED';
        const lead = task.leadId ? leadsById.get(task.leadId) : null;
        const typeLabel = t(taskTypeLabelKey(task.taskType));
        return (
          <li
            key={task.id}
            className={
              'border rounded-md px-sp3 py-sp2 flex flex-wrap items-start gap-x-sp3 gap-y-sp2 transition-colors duration-fast ' +
              (done ? 'border-border bg-navy-deep/60 opacity-75' : 'border-border bg-navy-card')
            }
          >
            <button
              type="button"
              aria-label={done ? t('task.action.uncomplete') : t('task.action.complete')}
              onClick={() => handleToggle(task)}
              disabled={busyId === task.id}
              className={
                'mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors duration-fast cursor-pointer focus-visible:outline-none focus-visible:border-gold ' +
                (done
                  ? 'bg-status-green border-status-green'
                  : 'border-border-light hover:border-gold')
              }
            >
              {done && <span className="text-navy-deep text-[12px] leading-none">✓</span>}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-sp2 flex-wrap">
                <span className={'text-[13px] ' + (done ? 'line-through text-text-muted' : 'text-text-h')}>
                  {task.label}
                </span>
                <Badge variant={statusVariant(task.status)} size="xs">
                  {t(`task.status.${task.status}`)}
                </Badge>
              </div>
              <div className="flex items-center gap-sp2 mt-0.5 text-[11px] text-text-muted">
                <span>{typeLabel}</span>
                <span aria-hidden>·</span>
                <span>{formatTime(task.dueAt, locale)}</span>
                {lead && (
                  <>
                    <span aria-hidden>·</span>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-text-secondary hover:text-gold underline-offset-2 hover:underline"
                    >
                      {lead.name}
                    </Link>
                  </>
                )}
              </div>
            </div>
            {!done && (
              <div className="flex items-center gap-sp1 flex-shrink-0 ml-auto">
                {task.status !== 'ACTIVE' && (
                  <button
                    type="button"
                    onClick={() => handleActivate(task)}
                    className="text-[11px] px-sp2 py-1 rounded border border-border-light text-text-secondary hover:text-gold hover:border-gold cursor-pointer transition-colors duration-fast"
                  >
                    {t('task.action.activate')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSnooze(task)}
                  className="text-[11px] px-sp2 py-1 rounded border border-border-light text-text-secondary hover:text-gold hover:border-gold cursor-pointer transition-colors duration-fast"
                >
                  {t('task.action.snooze')}
                </button>
                <InfoTooltip label={typeLabel} body={t(`task.typeHelp.${task.taskType}`)} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
