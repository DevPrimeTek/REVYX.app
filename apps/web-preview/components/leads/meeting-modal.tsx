'use client';

// [MOLDOVA-SPECIFIC] Modal „Programează discuție" — calificare față-în-față.
// Tipul locației influențează fluxul: on_site = calificare + vizionare simultane.

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useShowingActions } from '@/lib/showing-store';
import { properties as allProps } from '@/lib/mock';
import type { MeetingLocationType } from '@/lib/mock/transactions-types';
import { cn } from '@/lib/utils';

function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const LOCATION_TYPES: MeetingLocationType[] = ['office', 'public_place', 'on_site'];

export function MeetingModal({
  open,
  onClose,
  leadId,
  agentId,
}: {
  open: boolean;
  onClose: () => void;
  leadId: string;
  agentId: string;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const { add } = useShowingActions();

  const [locationType, setLocationType] = useState<MeetingLocationType>('office');
  const [date, setDate] = useState<string>(defaultDate());
  const [time, setTime] = useState<string>('10:00');
  const [notes, setNotes] = useState<string>('');
  const [propId, setPropId] = useState<string>(allProps[0]?.id ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const iso = new Date(`${date}T${time}:00`).toISOString();
    add({
      leadId,
      propertyId: locationType === 'on_site' ? propId : `virtual-${leadId}`,
      agentId,
      scheduledAt: iso,
      durationMin: 45,
      notes,
      isQualificationMeeting: true,
      meetingLocationType: locationType,
    });
    toast({
      variant: 'success',
      title: t('meeting.toastScheduled'),
      description: locationType === 'on_site'
        ? t('meeting.toastScheduledOnSite')
        : t('meeting.toastScheduledGeneric'),
    });
    onClose();
    setNotes('');
    setLocationType('office');
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('meeting.modalTitle')}
      description={t('meeting.modalDesc')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">

        {/* Locația întâlnirii */}
        <fieldset>
          <legend className="text-[12px] text-text-secondary font-medium mb-sp2 flex items-center gap-1">
            {t('meeting.locationLabel')}
            <InfoTooltip
              label={t('meeting.locationLabel')}
              body={t('meeting.locationHelp')}
            />
          </legend>
          <div className="flex flex-col gap-sp2">
            {LOCATION_TYPES.map((lt) => (
              <label
                key={lt}
                className={cn(
                  'flex items-start gap-sp2 p-sp2 rounded-md border cursor-pointer transition-colors',
                  locationType === lt
                    ? 'border-gold bg-gold/5'
                    : 'border-border hover:border-border-light'
                )}
              >
                <input
                  type="radio"
                  name="locationType"
                  value={lt}
                  checked={locationType === lt}
                  onChange={() => setLocationType(lt)}
                  className="mt-0.5 accent-gold"
                />
                <div>
                  <p className="text-[13px] text-text-h font-medium">
                    {t(`showing.meetingLocationType.${lt}`)}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {t(`meeting.locationDesc.${lt}`)}
                  </p>
                  {lt === 'on_site' && (
                    <p className="text-[11px] text-gold mt-0.5">
                      {t('showing.onSiteNote')}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Proprietate — doar pentru on_site */}
        {locationType === 'on_site' && (
          <div>
            <label className="text-[12px] text-text-secondary font-medium block mb-sp1">
              {t('meeting.propertyLabel')}
            </label>
            <select
              value={propId}
              onChange={(e) => setPropId(e.target.value)}
              className="w-full h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h focus-visible:outline-none focus-visible:border-gold"
            >
              {allProps.slice(0, 20).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.addr} — {p.city} · €{p.priceEur > 0 ? p.priceEur.toLocaleString('ro-MD') : `${p.monthlyRentEur}/lună`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Data și ora */}
        <div className="grid grid-cols-2 gap-sp2">
          <Input
            label={t('showing.dateLabel')}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label={t('showing.timeLabel')}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <Input
          label={t('showing.notesLabel')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('meeting.notesPlaceholder')}
        />

        <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">{t('meeting.submitCta')}</Button>
        </div>
      </form>
    </Modal>
  );
}
