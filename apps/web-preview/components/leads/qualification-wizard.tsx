'use client';

// Val 1 (AGI §18.3 — check-list „Prima intrare în apartament") · Wizard 10 pași pentru
// întâlnirea de calificare seller. VISUAL SKELETON: navigare pas cu pas + captură verdict +
// preț minim + motivație → toast la final. Structura avansată (datorie urmărită, M1.S3):
// persistă rezultatul pe LEAD + creează automat sugestia `request_mandate` la verdict „Da".

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { SELLER_MEETING_STEPS } from '@/lib/mock/execution-guides';
import type { Lead } from '@/lib/mock';

export function QualificationWizard({
  open,
  onClose,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  lead: Lead;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [motivation, setMotivation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [verdict, setVerdict] = useState<'yes' | 'no' | null>(null);

  const total = SELLER_MEETING_STEPS.length;
  const isLast = step === total - 1;
  const current = SELLER_MEETING_STEPS[step];

  function reset() {
    setStep(0);
    setMotivation('');
    setMinPrice('');
    setVerdict(null);
  }

  function finish() {
    toast({
      variant: verdict === 'yes' ? 'success' : 'info',
      title: t('qualification.toastDone'),
      description: verdict === 'yes' ? t('qualification.toastYes') : t('qualification.toastNo'),
    });
    onClose();
    reset();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      title={t('qualification.title')}
      description={t('qualification.subtitle', { name: lead.name })}
      size="lg"
    >
      <div className="flex flex-col gap-sp4">
        {/* Progres */}
        <div className="flex items-center gap-1">
          {SELLER_MEETING_STEPS.map((_, i) => (
            <span
              key={i}
              className={'h-1.5 flex-1 rounded-pill transition-colors ' + (i <= step ? 'bg-gold' : 'bg-border')}
            />
          ))}
        </div>
        <p className="text-[11px] text-text-muted">{t('qualification.stepCounter', { current: step + 1, total })}</p>

        {/* Pasul curent */}
        <div className="rounded-md border border-border bg-navy-deep/40 p-sp3">
          <div className="flex items-start gap-sp2">
            <span className="font-display text-gold text-[20px] leading-none w-7 flex-shrink-0">{step + 1}</span>
            <div>
              <h3 className="text-[15px] text-text-h font-medium">{current.title}</h3>
              <p className="text-[13px] text-text-secondary mt-sp1">{current.script}</p>
            </div>
          </div>
        </div>

        {/* Captură la pașii cheie */}
        {step === 1 && (
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder={t('qualification.motivationPlaceholder')}
            rows={2}
            className="w-full px-sp2 py-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h focus-visible:outline-none focus-visible:border-gold"
          />
        )}
        {step === 5 && (
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={t('qualification.minPricePlaceholder')}
            inputMode="numeric"
            className="w-full h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h focus-visible:outline-none focus-visible:border-gold"
          />
        )}
        {step === 6 && (
          <div className="flex gap-sp2">
            {(['yes', 'no'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVerdict(v)}
                aria-pressed={verdict === v}
                className={
                  'flex-1 h-10 rounded-md border text-[13px] font-medium transition-all cursor-pointer ' +
                  (verdict === v
                    ? v === 'yes'
                      ? 'bg-status-green/15 border-status-green text-status-green'
                      : 'bg-status-red/15 border-status-red text-status-red'
                    : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
                }
              >
                {t(`qualification.verdict.${v}`)}
              </button>
            ))}
          </div>
        )}

        {/* Navigare */}
        <div className="flex items-center justify-between pt-sp2 border-t border-border">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            {t('qualification.back')}
          </Button>
          {!isLast ? (
            <Button onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>{t('qualification.next')}</Button>
          ) : (
            <Button onClick={finish}>{t('qualification.finish')}</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
