'use client';

// M0.S7 · Per-lead suggested actions — click to push into the task list.
// Mirrors the NBA recommendation flow: for each lead surface 2-3 ordered next steps with
// rationale; "Adaugă în sarcini" turns the suggestion into a real PENDING task.

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useTaskActions } from '@/lib/task-store';
import { suggestionsForLead, taskTypeLabelKey, type Suggestion } from '@/lib/mock/suggestions';
import { GuideDrawer } from '@/components/leads/guide-drawer';
import type { TaskType } from '@/lib/mock/tasks';
import type { Lead } from '@/lib/mock';

function dueIsoFromHint(hint: Suggestion['due']): string {
  const d = new Date();
  if (hint === 'now') {
    d.setMinutes(d.getMinutes() + 15);
  } else if (hint === 'today') {
    d.setHours(17, 0, 0, 0);
  } else if (hint === 'tomorrow') {
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
  } else {
    d.setDate(d.getDate() + 5);
    d.setHours(10, 0, 0, 0);
  }
  return d.toISOString();
}

function urgencyVariant(u: Suggestion['urgency']): 'hot' | 'qualified' | 'warm' {
  return u === 'high' ? 'hot' : u === 'medium' ? 'qualified' : 'warm';
}

export function LeadSuggestions({
  lead,
  agentId,
  compact = false,
}: {
  lead: Lead;
  agentId: string;
  compact?: boolean;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const actions = useTaskActions();
  const [adding, setAdding] = useState<string | null>(null);
  const [guideFor, setGuideFor] = useState<TaskType | null>(null);

  const items = suggestionsForLead(lead);

  function handleAccept(s: Suggestion) {
    setAdding(s.id);
    const result = actions.add({
      agentId,
      taskType: s.taskType,
      label: t(taskTypeLabelKey(s.taskType)) + ` — ${lead.name}`,
      leadId: lead.id,
      dueAt: dueIsoFromHint(s.due),
      status: 'PENDING',
    });
    if (!result.ok) {
      toast({
        variant: 'warning',
        title: t('task.toast.maxActiveTitle'),
        description: t('task.toast.maxActiveDesc'),
      });
    } else {
      toast({
        variant: 'success',
        title: t('task.toast.created'),
        description: t(taskTypeLabelKey(s.taskType)) + ` · ${lead.name}`,
      });
    }
    setTimeout(() => setAdding(null), 200);
  }

  return (
    <ul className={'flex flex-col ' + (compact ? 'gap-sp1' : 'gap-sp2')}>
      {items.map((s, i) => (
        <li
          key={s.id}
          className="border border-border rounded-md px-sp3 py-sp2 bg-navy-card flex items-start gap-sp3"
        >
          <span className="font-display text-gold text-[18px] leading-none w-5 flex-shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-sp2 flex-wrap">
              <span className="text-[13px] text-text-h">{t(taskTypeLabelKey(s.taskType))}</span>
              <Badge variant={urgencyVariant(s.urgency)} size="xs">
                {t(`task.due.${s.due}`)}
              </Badge>
            </div>
            {!compact && s.rationale && (
              <p className="text-[12px] text-text-secondary mt-0.5">{s.rationale}</p>
            )}
            {!compact && (
              <button
                type="button"
                onClick={() => setGuideFor(s.taskType)}
                className="mt-sp1 text-[11px] text-text-secondary underline decoration-dotted underline-offset-2 hover:text-gold cursor-pointer transition-colors duration-fast"
              >
                {t('guide.howToCta')}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleAccept(s)}
            disabled={adding === s.id}
            className="flex-shrink-0 text-[11px] px-sp2 py-1 rounded border border-gold/40 text-gold hover:bg-gold/10 cursor-pointer transition-colors duration-fast disabled:opacity-50"
          >
            + {t('task.suggestion.accept')}
          </button>
        </li>
      ))}
      <GuideDrawer open={guideFor !== null} onClose={() => setGuideFor(null)} taskType={guideFor} lead={lead} />
    </ul>
  );
}
