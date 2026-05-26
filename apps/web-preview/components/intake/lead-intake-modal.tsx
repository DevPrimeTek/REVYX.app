'use client';

// M0.S8 · Lead intake modal — simulează webhook nou (Meta/Google/OLX/Walk-in)
// cu Lead Firewall vizibil + GDPR consent capture.

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useGdprActions } from '@/lib/gdpr-store';
import type { LeadSource } from '@/lib/mock';

const SOURCES: LeadSource[] = ['Meta', 'Google', 'OLX', 'Referral', 'Walk-in', 'Website'];

export function LeadIntakeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useT();
  const { toast } = useToast();
  const { record } = useGdprActions();
  const [source, setSource] = useState<LeadSource>('Meta');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [budgetMax, setBudgetMax] = useState<number>(70_000);
  const [baseConsent, setBaseConsent] = useState<boolean>(true);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [publicConsent, setPublicConsent] = useState<boolean>(false);

  // Lead Firewall preview: needs valid name + phone + base consent.
  const hasValidContact = phone.trim().length >= 8 && fullName.trim().length >= 3;
  const firewallPass = hasValidContact && baseConsent;
  const initialLs = 0.30 + (source === 'Referral' ? 0.20 : 0) + (budgetMax > 50_000 ? 0.10 : 0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firewallPass) {
      toast({
        variant: 'warning',
        title: t('intake.firewallBlock'),
        description: t('intake.firewallBlockDesc'),
      });
      return;
    }
    // Generate a synthetic leadId so we can record consent against it.
    const leadId = `L-NEW-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    record({
      leadId,
      baseConsent,
      marketingConsent,
      publicConsent,
      capturedSource: 'webhook_intake',
    });
    toast({
      variant: 'success',
      title: t('intake.toastCreated', { id: leadId }),
      description: t('intake.toastCreatedDesc'),
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('intake.modalTitle')}
      description={t('intake.modalDesc')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp3">
        <div>
          <label className="text-[12px] text-text-secondary font-medium">
            {t('intake.sourceLabel')}
          </label>
          <div className="mt-sp1 flex flex-wrap gap-sp1">
            {SOURCES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSource(s)}
                aria-pressed={source === s}
                className={
                  'px-sp3 h-9 rounded-md border text-[12px] transition-all cursor-pointer ' +
                  (source === s
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp2">
          <Input
            label={t('intake.nameLabel')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Maria Popescu"
            required
          />
          <Input
            label={t('intake.phoneLabel')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+373 79 123 456"
            required
          />
          <Input
            type="email"
            label={t('intake.emailLabel')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="maria@example.md"
          />
          <Input
            type="number"
            label={t('intake.budgetLabel')}
            value={budgetMax}
            onChange={(e) => setBudgetMax(Number(e.target.value) || 0)}
            min={0}
            step={5000}
          />
        </div>

        {/* GDPR consent block */}
        <fieldset className="border border-border rounded-md p-sp3 flex flex-col gap-sp2">
          <legend className="text-[12px] font-semibold text-gold px-sp1">
            {t('intake.gdprTitle')}
          </legend>
          <label className="flex items-start gap-sp2 cursor-pointer">
            <input
              type="checkbox"
              checked={baseConsent}
              onChange={(e) => setBaseConsent(e.target.checked)}
              className="accent-gold mt-1"
              required
            />
            <span className="text-[12px] text-text-h">
              <strong>{t('intake.consentBaseLabel')}</strong>
              <br />
              <span className="text-text-secondary">{t('intake.consentBaseDesc')}</span>
            </span>
          </label>
          <label className="flex items-start gap-sp2 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="accent-gold mt-1"
            />
            <span className="text-[12px] text-text-h">
              <strong>{t('intake.consentMarketingLabel')}</strong>
              <br />
              <span className="text-text-secondary">{t('intake.consentMarketingDesc')}</span>
            </span>
          </label>
          <label className="flex items-start gap-sp2 cursor-pointer">
            <input
              type="checkbox"
              checked={publicConsent}
              onChange={(e) => setPublicConsent(e.target.checked)}
              className="accent-gold mt-1"
            />
            <span className="text-[12px] text-text-h">
              <strong>{t('intake.consentPublicLabel')}</strong>
              <br />
              <span className="text-text-secondary">{t('intake.consentPublicDesc')}</span>
            </span>
          </label>
        </fieldset>

        {/* Lead Firewall preview */}
        <div
          className={
            'border rounded-md px-sp3 py-sp2 ' +
            (firewallPass
              ? 'border-status-green/30 bg-status-green/10'
              : 'border-status-amber/30 bg-status-amber/10')
          }
        >
          <div className="flex items-center justify-between gap-sp2 flex-wrap">
            <div>
              <p className="text-[13px] font-semibold text-text-h">
                {t('intake.firewallTitle')}
              </p>
              <p className="text-[11px] text-text-secondary">
                {firewallPass
                  ? t('intake.firewallPass')
                  : t('intake.firewallReason')}
              </p>
            </div>
            <Badge variant={firewallPass ? 'success' : 'warning'} size="sm">
              {firewallPass ? t('intake.firewallOk') : t('intake.firewallBlocked')}
            </Badge>
          </div>
          <div className="mt-sp2 flex flex-wrap gap-sp2 text-[11px]">
            <span className="text-text-muted">
              {t('intake.initialPriority')}: <span className="text-text-h">
                {initialLs >= 0.6 ? t('lead.priorityLabel.qualified') : t('lead.priorityLabel.warm')}
              </span>
            </span>
            <span className="text-text-muted">
              {t('intake.estSla')}: <span className="text-text-h">
                {initialLs >= 0.75 ? '15m' : initialLs >= 0.60 ? '2h' : '24h'}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={!firewallPass}>
            {t('intake.submitCta')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
