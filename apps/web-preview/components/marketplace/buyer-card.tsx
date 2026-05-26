'use client';

// M0.S8 · Buyer profile card — listing-only view (PII masked) cu CTA contact request.

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';
import type { BuyerProfile, GrantStatus } from '@/lib/mock';

const tierColor: Record<BuyerProfile['tier'], 'info' | 'updated' | 'success'> = {
  FREE: 'info',
  PRO: 'updated',
  PREMIUM: 'success',
};

const urgencyColor: Record<BuyerProfile['urgency'], 'critical' | 'warning' | 'info'> = {
  high: 'critical',
  medium: 'warning',
  low: 'info',
};

export function BuyerCard({
  profile,
  grantStatus,
  onRequestContact,
}: {
  profile: BuyerProfile;
  grantStatus: GrantStatus | null;
  onRequestContact: () => void;
}) {
  const { t } = useT();
  const showRevealed = grantStatus === 'APPROVED';

  return (
    <Card variant="elevated">
      <CardContent className="pt-sp3 flex flex-col gap-sp2">
        <div className="flex items-start justify-between gap-sp2">
          <div className="min-w-0">
            <p className="font-mono text-[11px] text-text-muted">{profile.id}</p>
            <h3 className="text-[16px] font-semibold text-text-h">
              {showRevealed ? profile.fullName : profile.maskedName}
            </h3>
            <p className="text-[12px] text-text-muted">
              {showRevealed ? profile.phone : profile.maskedPhone}
            </p>
          </div>
          <div className="flex flex-col items-end gap-sp1">
            <Badge variant={tierColor[profile.tier]} size="xs">
              {profile.tier}
            </Badge>
            <Badge variant={urgencyColor[profile.urgency]} size="xs">
              {t(`marketplace.urgency.${profile.urgency}`)}
            </Badge>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-sp2 text-[12px] mt-sp1">
          <div>
            <dt className="text-text-muted">{t('marketplace.looking')}</dt>
            <dd className="text-text-h">
              {t(`property.kind${capitalize(profile.propertyKind)}`)}
              {profile.rooms !== '0' && ` · ${profile.rooms} ${t('property.rooms')}`}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">{t('marketplace.zone')}</dt>
            <dd className="text-text-h">{profile.city}, {profile.zone}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-text-muted">{t('marketplace.budget')}</dt>
            <dd className="text-text-h">
              €{profile.budgetMin.toLocaleString('ro-MD')} – €{profile.budgetMax.toLocaleString('ro-MD')}
            </dd>
          </div>
        </dl>

        {profile.features.length > 0 && (
          <div className="flex flex-wrap gap-sp1">
            {profile.features.map((f) => (
              <span
                key={f}
                className="px-sp2 py-px rounded-pill bg-navy-deep border border-border text-[11px] text-text-secondary"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="pt-sp2 border-t border-border flex items-center justify-between gap-sp2">
          {grantStatus === null && (
            <Button size="sm" onClick={onRequestContact}>
              {t('marketplace.requestContact')}
            </Button>
          )}
          {grantStatus === 'PENDING' && (
            <Badge variant="info" size="sm">
              {t('marketplace.grantPending')}
            </Badge>
          )}
          {grantStatus === 'APPROVED' && (
            <Badge variant="success" size="sm">
              {t('marketplace.grantApproved')}
            </Badge>
          )}
          {grantStatus === 'DENIED' && (
            <Badge variant="critical" size="sm">
              {t('marketplace.grantDenied')}
            </Badge>
          )}
          <span className="text-[11px] text-text-muted">
            {t('marketplace.expiresAt', { date: profile.expiresAt })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
