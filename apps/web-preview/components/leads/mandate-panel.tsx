'use client';

// Val 2 (AGI §17.5) · Mandat de exclusivitate pentru seller/landlord — apără relația agentului.
// VISUAL SKELETON (localStorage). Structura avansată (datorie urmărită): câmpuri pe LEAD +
// cron expiry + NBA renew + AUDIT_LOG.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { formatDate } from '@/lib/format';
import {
  useMandate,
  requestMandate,
  signMandate,
  daysUntilExpiry,
  effectiveStatus,
} from '@/lib/mandate-store';
import type { Lead } from '@/lib/mock';

const DURATIONS = [30, 60, 90];

export function MandatePanel({ lead }: { lead: Lead }) {
  const { t } = useT();
  const { toast } = useToast();
  const m = useMandate(lead.id);
  const status = effectiveStatus(m);
  const daysLeft = daysUntilExpiry(m);
  const expiringSoon = status === 'signed' && daysLeft != null && daysLeft <= 7;

  const statusVariant =
    status === 'signed' ? (expiringSoon ? 'warning' : 'success') : status === 'expired' ? 'critical' : status === 'pending' ? 'updated' : 'warning';

  function handleSign(days: number) {
    signMandate(lead.id, days);
    toast({ variant: 'success', title: t('mandate.toastSigned'), description: t('mandate.toastSignedDesc', { days }) });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-sp2">
        <div>
          <div className="flex items-center gap-sp1">
            <CardTitle>{t('mandate.title')}</CardTitle>
            <InfoTooltip label={t('mandate.title')} body={t('mandate.help')} />
          </div>
          <CardDescription>{t('mandate.desc')}</CardDescription>
        </div>
        <Badge variant={statusVariant} size="sm">{t(`mandate.status.${status}`)}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        {/* Stare semnat — date + countdown */}
        {status === 'signed' || status === 'expired' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-sp3 text-[13px]">
            <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
              <span className="text-[11px] text-text-muted block">{t('mandate.signedAt')}</span>
              <span className="text-text-h">{formatDate(m.signedAt)}</span>
            </div>
            <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
              <span className="text-[11px] text-text-muted block">{t('mandate.expiresAt')}</span>
              <span className="text-text-h">{formatDate(m.expiresAt)}</span>
            </div>
            <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
              <span className="text-[11px] text-text-muted block">{t('mandate.daysLeft')}</span>
              <span className={daysLeft != null && daysLeft < 0 ? 'text-status-red' : expiringSoon ? 'text-status-amber' : 'text-status-green'}>
                {daysLeft != null && daysLeft >= 0 ? t('mandate.daysValue', { n: daysLeft }) : t('mandate.expiredValue')}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[12px] text-text-secondary">{t('mandate.noneHint')}</p>
        )}

        {/* Avertizare expirare / expirat — apără agentul */}
        {expiringSoon && (
          <div className="rounded-md bg-status-amber/10 border border-status-amber/30 px-sp2 py-sp1 text-[11px] text-status-amber">
            {t('mandate.renewWarning', { n: daysLeft ?? 0 })}
          </div>
        )}
        {status === 'expired' && (
          <div className="rounded-md bg-status-red/10 border border-status-red/30 px-sp2 py-sp1 text-[11px] text-status-red">
            {t('mandate.expiredWarning')}
          </div>
        )}

        {/* Acțiuni */}
        <div className="flex items-center gap-sp2 flex-wrap pt-sp2 border-t border-border">
          {status === 'none' && (
            <Button size="sm" variant="secondary" onClick={() => { requestMandate(lead.id); toast({ variant: 'info', title: t('mandate.toastRequested') }); }}>
              {t('mandate.requestCta')}
            </Button>
          )}
          {(status === 'pending' || status === 'expired') && (
            <div className="flex items-center gap-sp2 flex-wrap">
              <span className="text-[12px] text-text-secondary">{status === 'expired' ? t('mandate.renewPick') : t('mandate.signPick')}</span>
              {DURATIONS.map((d) => (
                <Button key={d} size="sm" variant={d === 60 ? 'primary' : 'secondary'} onClick={() => handleSign(d)}>
                  {t('mandate.daysOption', { n: d })}
                </Button>
              ))}
            </div>
          )}
          {status === 'signed' && (
            <div className="flex items-center gap-sp2 flex-wrap">
              <span className="text-[12px] text-text-secondary">{t('mandate.renewPick')}</span>
              {DURATIONS.map((d) => (
                <Button key={d} size="sm" variant="ghost" onClick={() => handleSign(d)}>
                  {t('mandate.daysOption', { n: d })}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
