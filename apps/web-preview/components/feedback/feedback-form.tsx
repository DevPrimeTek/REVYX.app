'use client';

// Demo promotion · Formular de feedback NATIV (stilul demo-ului).
// Înlocuiește redirect-ul către un serviciu extern. Trimite răspunsurile la `/api/feedback`
// → stocate în Supabase (Postgres). Vezi FEEDBACK_DB_SETUP.md.

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { cn } from '@/lib/utils';
import { ROLE_OPTIONS, RATING_SCALE, type FeedbackRole } from '@/lib/feedback-config';
import type { FeedbackPayload } from '@/lib/feedback-payload';

function Rating({
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  value: number | null;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div className="flex flex-col gap-sp1">
      <div className="flex gap-sp1">
        {RATING_SCALE.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            onClick={() => onChange(n)}
            className={cn(
              'h-9 w-9 rounded-md border font-body font-semibold text-[14px] transition-all duration-fast ease-standard',
              value === n
                ? 'bg-gold text-navy-deep border-gold'
                : 'bg-navy-deep text-text-secondary border-border hover:border-gold/60 hover:text-text-h'
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-text-muted">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-sp1">
      <span className="text-[12px] text-text-secondary font-medium">{label}</span>
      {children}
    </div>
  );
}

export function FeedbackForm({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const { t, locale } = useT();
  const { toast } = useToast();

  const [role, setRole] = useState<FeedbackRole | null>(null);
  const [city, setCity] = useState('');
  const [clarity, setClarity] = useState<number | null>(null);
  const [utility, setUtility] = useState<number | null>(null);
  const [pilotIntent, setPilotIntent] = useState<number | null>(null);
  const [liked, setLiked] = useState('');
  const [missing, setMissing] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const valid = role !== null && clarity !== null && utility !== null && pilotIntent !== null;

  async function submit() {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    setSubmitting(true);
    const payload: FeedbackPayload = {
      role,
      city: city.trim() || null,
      clarity,
      utility,
      pilotIntent,
      liked: liked.trim() || null,
      missing: missing.trim() || null,
      contact: contact.trim() || null,
      locale,
    };
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast({ variant: 'success', title: t('feedback.successToast') });
        onSubmitted();
        onClose();
      } else {
        toast({ variant: 'error', title: t('feedback.errorToast') });
      }
    } catch {
      toast({ variant: 'error', title: t('feedback.errorToast') });
    } finally {
      setSubmitting(false);
    }
  }

  const textareaCls =
    'w-full min-h-[64px] px-sp2 py-sp1 rounded-md bg-navy-deep border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors duration-fast text-[13px]';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('feedback.formTitle')}
      description={t('feedback.formSubtitle')}
      size="lg"
    >
      <div className="flex flex-col gap-sp3 max-h-[68vh] overflow-y-auto pr-sp1">
        <Field label={t('feedback.roleLabel')}>
          <div className="flex flex-wrap gap-sp1">
            {ROLE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={role === r}
                onClick={() => setRole(r)}
                className={cn(
                  'px-sp2 h-9 rounded-md border text-[13px] transition-all duration-fast ease-standard',
                  role === r
                    ? 'bg-gold text-navy-deep border-gold font-semibold'
                    : 'bg-navy-deep text-text-secondary border-border hover:border-gold/60 hover:text-text-h'
                )}
              >
                {t(`feedback.roleOptions.${r}`)}
              </button>
            ))}
          </div>
          {showErrors && role === null && (
            <p className="text-[12px] text-status-red">{t('feedback.required')}</p>
          )}
        </Field>

        <Input
          label={t('feedback.cityLabel')}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('feedback.cityPlaceholder')}
        />

        <Field label={t('feedback.clarityLabel')}>
          <Rating
            value={clarity}
            onChange={setClarity}
            lowLabel={t('feedback.scaleLowClarity')}
            highLabel={t('feedback.scaleHighClarity')}
          />
          {showErrors && clarity === null && (
            <p className="text-[12px] text-status-red">{t('feedback.required')}</p>
          )}
        </Field>

        <Field label={t('feedback.utilityLabel')}>
          <Rating
            value={utility}
            onChange={setUtility}
            lowLabel={t('feedback.scaleLowUtility')}
            highLabel={t('feedback.scaleHighUtility')}
          />
          {showErrors && utility === null && (
            <p className="text-[12px] text-status-red">{t('feedback.required')}</p>
          )}
        </Field>

        <Field label={t('feedback.pilotLabel')}>
          <Rating
            value={pilotIntent}
            onChange={setPilotIntent}
            lowLabel={t('feedback.scaleLowPilot')}
            highLabel={t('feedback.scaleHighPilot')}
          />
          {showErrors && pilotIntent === null && (
            <p className="text-[12px] text-status-red">{t('feedback.required')}</p>
          )}
        </Field>

        <Field label={t('feedback.likedLabel')}>
          <textarea
            className={textareaCls}
            value={liked}
            onChange={(e) => setLiked(e.target.value)}
            placeholder={t('feedback.likedPlaceholder')}
          />
        </Field>

        <Field label={t('feedback.missingLabel')}>
          <textarea
            className={textareaCls}
            value={missing}
            onChange={(e) => setMissing(e.target.value)}
            placeholder={t('feedback.missingPlaceholder')}
          />
        </Field>

        <Input
          label={t('feedback.contactLabel')}
          hint={t('feedback.contactHint')}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t('feedback.contactPlaceholder')}
        />
      </div>

      <div className="mt-sp3 flex flex-col-reverse gap-sp2 sm:flex-row sm:justify-end border-t border-border pt-sp3">
        <Button variant="ghost" onClick={onClose} disabled={submitting}>
          {t('feedback.later')}
        </Button>
        <Button onClick={submit} loading={submitting} disabled={submitting}>
          {t('feedback.submit')}
        </Button>
      </div>
    </Modal>
  );
}
