'use client';

// M0.S8 · Feedback modal post-attended showing.

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useShowingActions } from '@/lib/showing-store';

export function ShowingFeedbackModal({
  open,
  onClose,
  showingId,
}: {
  open: boolean;
  onClose: () => void;
  showingId: string;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const { setFeedback } = useShowingActions();
  const [score, setScore] = useState<number>(4);
  const [body, setBody] = useState<string>('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(showingId, score, body);
    toast({
      variant: 'success',
      title: t('showing.feedbackToast'),
      description: t('showing.feedbackToastDesc'),
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('showing.feedbackTitle')}
      description={t('showing.feedbackDesc')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">
        <fieldset>
          <legend className="text-[12px] text-text-secondary font-medium mb-sp2">
            {t('showing.feedbackScoreLabel')}
          </legend>
          <div className="flex items-center gap-sp1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                aria-pressed={score === n}
                className={
                  'h-12 w-12 rounded-md border-2 text-[20px] transition-all duration-fast cursor-pointer ' +
                  (score >= n
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-navy-deep border-border text-text-muted hover:border-border-light')
                }
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-[12px] text-text-muted mt-sp2">
            {score >= 5
              ? t('showing.scoreHelp5')
              : score === 4
              ? t('showing.scoreHelp4')
              : score === 3
              ? t('showing.scoreHelp3')
              : score === 2
              ? t('showing.scoreHelp2')
              : t('showing.scoreHelp1')}
          </p>
        </fieldset>
        <div>
          <label className="text-[12px] text-text-secondary font-medium">
            {t('showing.feedbackBodyLabel')}
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder={t('showing.feedbackBodyPlaceholder')}
            className="mt-sp1 w-full px-sp2 py-sp2 rounded-md bg-navy-deep border border-border text-[13px] text-text-h placeholder:text-text-muted focus:border-gold focus:outline-none resize-y"
          />
        </div>
        <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">{t('showing.submitFeedback')}</Button>
        </div>
      </form>
    </Modal>
  );
}
