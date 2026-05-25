'use client';

// M0.S7 · Modal for creating a custom task (or accepting a suggested one).
// The form mirrors the task entity from apps/api/src/business/tasks (M1.S2 backend).

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useTaskActions } from '@/lib/task-store';
import { taskTypeLabelKey } from '@/lib/mock/suggestions';
import type { TaskType } from '@/lib/mock/tasks';

const TYPES: TaskType[] = [
  'first_contact',
  'follow_up',
  'schedule_showing',
  'send_property',
  'request_documents',
  'draft_offer',
  'close_deal',
  'custom',
];

export function TaskModal({
  open,
  onClose,
  agentId,
  presetLeadId,
  presetType,
  presetLabel,
}: {
  open: boolean;
  onClose: () => void;
  agentId: string;
  presetLeadId?: string | null;
  presetType?: TaskType;
  presetLabel?: string;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const actions = useTaskActions();
  const [type, setType] = useState<TaskType>(presetType ?? 'custom');
  const [label, setLabel] = useState(presetLabel ?? '');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [dueTime, setDueTime] = useState('17:00');
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setType(presetType ?? 'custom');
    setLabel(presetLabel ?? '');
    setDueTime('17:00');
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const trimmed = label.trim();
    if (!trimmed) {
      toast({ variant: 'warning', title: t('task.modal.errorLabel') });
      return;
    }
    setSubmitting(true);
    const dueIso = new Date(`${dueDate}T${dueTime}:00`).toISOString();
    const result = actions.add({
      agentId,
      taskType: type,
      label: trimmed,
      leadId: presetLeadId ?? null,
      dueAt: dueIso,
      status: 'PENDING',
    });
    setSubmitting(false);
    if (!result.ok) {
      toast({
        variant: 'warning',
        title: t('task.toast.maxActiveTitle'),
        description: t('task.toast.maxActiveDesc'),
      });
      return;
    }
    toast({
      variant: 'success',
      title: t('task.toast.created'),
      description: trimmed,
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={t('task.modal.title')}
      description={t('task.modal.description')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">
        <div>
          <label className="block text-[12px] text-text-secondary mb-sp1">{t('task.modal.typeLabel')}</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            className="w-full h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h focus-visible:outline-none focus-visible:border-gold"
          >
            {TYPES.map((tt) => (
              <option key={tt} value={tt}>
                {t(taskTypeLabelKey(tt))}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t('task.modal.descriptionLabel')}
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t('task.modal.descriptionPlaceholder')}
          required
        />

        <div className="grid grid-cols-2 gap-sp2">
          <Input
            label={t('task.modal.dueDateLabel')}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <Input
            label={t('task.modal.dueTimeLabel')}
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            required
          />
        </div>

        <p className="text-[11px] text-text-muted">{t('task.modal.maxRule')}</p>

        <div className="flex items-center justify-end gap-sp2 mt-sp2 pt-sp3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={submitting}>
            {t('task.modal.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
