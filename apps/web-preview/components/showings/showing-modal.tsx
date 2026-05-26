'use client';

// M0.S8 · Showing schedule modal — invocable din lead-detail, property-detail, deal-detail.

import { useMemo, useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useShowingActions } from '@/lib/showing-store';
import { properties as allProps, leadsById } from '@/lib/mock';

function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function ShowingModal({
  open,
  onClose,
  leadId,
  propertyId,
  agentId,
}: {
  open: boolean;
  onClose: () => void;
  leadId: string;
  propertyId?: string;
  agentId: string;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const { add } = useShowingActions();

  const lead = leadsById.get(leadId);
  const [propId, setPropId] = useState<string>(propertyId ?? allProps[0].id);
  const [date, setDate] = useState<string>(defaultDate());
  const [time, setTime] = useState<string>('10:00');
  const [duration, setDuration] = useState<number>(45);
  const [notes, setNotes] = useState<string>('');

  const suggested = useMemo(() => {
    if (!lead) return allProps.slice(0, 6);
    return [...allProps]
      .filter((p) => p.kind === 'apartment' || p.kind === 'house')
      .sort((a, b) => b.ps - a.ps)
      .slice(0, 6);
  }, [lead]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const iso = new Date(`${date}T${time}:00`).toISOString();
    add({
      leadId,
      propertyId: propId,
      agentId,
      scheduledAt: iso,
      durationMin: duration,
      notes,
    });
    toast({
      variant: 'success',
      title: t('showing.toastScheduled'),
      description: t('showing.toastScheduledDesc'),
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('showing.modalTitle')}
      description={t('showing.modalDesc')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">
        <div>
          <label className="text-[12px] text-text-secondary font-medium">
            {t('showing.propertyLabel')}
          </label>
          <select
            value={propId}
            onChange={(e) => setPropId(e.target.value)}
            className="mt-sp1 w-full h-10 px-sp2 rounded-md bg-navy-deep border border-border text-text-primary focus:border-gold focus:outline-none"
          >
            {suggested.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.addr} · €{p.priceEur.toLocaleString('ro-MD')}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sp2">
          <Input
            type="date"
            label={t('showing.dateLabel')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            type="time"
            label={t('showing.timeLabel')}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <Input
            type="number"
            label={t('showing.durationLabel')}
            value={duration}
            onChange={(e) => setDuration(Math.max(15, Number(e.target.value) || 45))}
            min={15}
            max={180}
            step={15}
            hint={t('showing.durationHint')}
          />
        </div>
        <div>
          <label className="text-[12px] text-text-secondary font-medium">
            {t('showing.notesLabel')}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder={t('showing.notesPlaceholder')}
            className="mt-sp1 w-full px-sp2 py-sp2 rounded-md bg-navy-deep border border-border text-[13px] text-text-h placeholder:text-text-muted focus:border-gold focus:outline-none resize-y"
          />
        </div>
        <p className="text-[11px] text-text-muted">{t('showing.modalNotice')}</p>
        <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">{t('showing.submitCta')}</Button>
        </div>
      </form>
    </Modal>
  );
}
