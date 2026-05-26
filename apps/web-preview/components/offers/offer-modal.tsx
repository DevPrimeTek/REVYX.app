'use client';

// M0.S8 · Offer create/counter modal.

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useOfferActions } from '@/lib/offer-store';
import type { OfferSide } from '@/lib/mock';

export function OfferModal({
  open,
  onClose,
  dealId,
  parentId,
  side,
  currentAgentName,
}: {
  open: boolean;
  onClose: () => void;
  dealId: string;
  parentId: string | null;
  side: OfferSide;
  currentAgentName: string;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const { add } = useOfferActions();
  const [amount, setAmount] = useState<number>(0);
  const [conditions, setConditions] = useState<string>('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (amount <= 0) {
      toast({ variant: 'warning', title: t('offer.invalidAmount') });
      return;
    }
    const needsManager = amount > 200_000;
    add({
      dealId,
      parentId,
      side,
      amountEur: amount,
      conditions: conditions.trim() || t('offer.defaultConditions'),
      createdByName: currentAgentName,
      needsManagerApproval: needsManager,
    });
    toast({
      variant: 'success',
      title: parentId ? t('offer.toastCountered') : t('offer.toastCreated'),
      description: needsManager ? t('offer.toastNeedsManager') : t('offer.toastCreatedDesc'),
    });
    setAmount(0);
    setConditions('');
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={parentId ? t('offer.modalCounterTitle') : t('offer.modalCreateTitle')}
      description={t('offer.modalDesc', {
        side: side === 'buyer' ? t('offer.side.buyer') : t('offer.side.seller'),
      })}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">
        <Input
          type="number"
          label={t('offer.amountLabel')}
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          placeholder="75000"
          min={1}
          required
          hint={t('offer.amountHint')}
        />
        <div>
          <label className="text-[12px] text-text-secondary font-medium">
            {t('offer.conditionsLabel')}
          </label>
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            rows={3}
            placeholder={t('offer.conditionsPlaceholder')}
            className="mt-sp1 w-full px-sp2 py-sp2 rounded-md bg-navy-deep border border-border text-[13px] text-text-h placeholder:text-text-muted focus:border-gold focus:outline-none resize-y"
          />
        </div>
        <p className="text-[11px] text-text-muted">{t('offer.modalNotice')}</p>
        <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">{t('offer.submitCta')}</Button>
        </div>
      </form>
    </Modal>
  );
}
