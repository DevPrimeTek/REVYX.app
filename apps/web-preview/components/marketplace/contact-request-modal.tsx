'use client';

// M0.S8 · Contact request modal — agent solicită grant pentru un buyer profile.

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useMarketplaceActions } from '@/lib/marketplace-store';
import type { BuyerProfile } from '@/lib/mock';

export function ContactRequestModal({
  open,
  onClose,
  profile,
  agentId,
}: {
  open: boolean;
  onClose: () => void;
  profile: BuyerProfile;
  agentId: string;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const { request } = useMarketplaceActions();
  const [message, setMessage] = useState<string>('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      toast({ variant: 'warning', title: t('marketplace.messageRequired') });
      return;
    }
    request({ buyerProfileId: profile.id, agentId, message: message.trim() });
    toast({
      variant: 'success',
      title: t('marketplace.requestSent'),
      description: t('marketplace.requestSentDesc'),
    });
    setMessage('');
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('marketplace.modalTitle', { name: profile.maskedName })}
      description={t('marketplace.modalDesc')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">
        <div>
          <label className="text-[12px] text-text-secondary font-medium">
            {t('marketplace.messageLabel')}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={t('marketplace.messagePlaceholder')}
            className="mt-sp1 w-full px-sp2 py-sp2 rounded-md bg-navy-deep border border-border text-[13px] text-text-h focus:border-gold focus:outline-none resize-y"
          />
        </div>
        <p className="text-[11px] text-text-muted">{t('marketplace.gdprNotice')}</p>
        <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">{t('marketplace.submitCta')}</Button>
        </div>
      </form>
    </Modal>
  );
}
