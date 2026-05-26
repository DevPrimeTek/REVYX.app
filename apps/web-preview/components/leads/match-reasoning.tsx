'use client';

// M0.S8 · Match reasoning — explică DE CE o proprietate se potrivește unui lead.
// Demo-only — calcule pe baza câmpurilor lead/property fără ML real.

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import type { Lead, Property } from '@/lib/mock';

function budgetFit(lead: Lead, property: Property): { ok: boolean; reason: string } {
  if (property.priceEur >= lead.budgetMin && property.priceEur <= lead.budgetMax) {
    return { ok: true, reason: 'inside' };
  }
  if (property.priceEur < lead.budgetMin) return { ok: true, reason: 'below' };
  if (property.priceEur <= lead.budgetMax * 1.1) return { ok: false, reason: 'above_10' };
  return { ok: false, reason: 'above_30' };
}

function zoneFit(lead: Lead, property: Property): 'exact' | 'city' | 'mismatch' {
  if (lead.zone.toLowerCase().includes(property.zone.toLowerCase()) ||
      property.zone.toLowerCase().includes(lead.zone.toLowerCase())) return 'exact';
  if (lead.zone.toLowerCase().includes(property.city.toLowerCase())) return 'city';
  return 'mismatch';
}

function roomsFit(lead: Lead, property: Property): boolean {
  const target = parseInt(lead.rooms, 10);
  if (lead.rooms === '3+') return property.rooms >= 3;
  return property.rooms === target;
}

export function MatchReasoning({
  lead,
  property,
}: {
  lead: Lead;
  property: Property;
}) {
  const { t } = useT();
  const bf = budgetFit(lead, property);
  const zf = zoneFit(lead, property);
  const rf = roomsFit(lead, property);

  const positives = [bf.ok, zf !== 'mismatch', rf].filter(Boolean).length;

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>{t('matchReason.title')}</CardTitle>
        <p className="text-[12px] text-text-secondary mt-sp1">
          {t('matchReason.scoreLine', { positives, total: 3 })}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp2">
        <div className="flex items-start gap-sp2">
          <Badge variant={bf.ok ? 'success' : 'warning'} size="xs">
            {bf.ok ? t('matchReason.ok') : t('matchReason.alert')}
          </Badge>
          <div className="text-[12px] text-text-h">
            <p className="font-semibold">{t('matchReason.budgetTitle')}</p>
            <p className="text-text-secondary">
              {t(`matchReason.budget.${bf.reason}`, {
                price: `€${property.priceEur.toLocaleString('ro-MD')}`,
                min: `€${lead.budgetMin.toLocaleString('ro-MD')}`,
                max: `€${lead.budgetMax.toLocaleString('ro-MD')}`,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-sp2">
          <Badge
            variant={zf === 'exact' ? 'success' : zf === 'city' ? 'info' : 'warning'}
            size="xs"
          >
            {zf === 'mismatch' ? t('matchReason.alert') : t('matchReason.ok')}
          </Badge>
          <div className="text-[12px] text-text-h">
            <p className="font-semibold">{t('matchReason.zoneTitle')}</p>
            <p className="text-text-secondary">
              {t(`matchReason.zone.${zf}`, {
                leadZone: lead.zone,
                propZone: property.zone,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-sp2">
          <Badge variant={rf ? 'success' : 'warning'} size="xs">
            {rf ? t('matchReason.ok') : t('matchReason.alert')}
          </Badge>
          <div className="text-[12px] text-text-h">
            <p className="font-semibold">{t('matchReason.roomsTitle')}</p>
            <p className="text-text-secondary">
              {t(rf ? 'matchReason.rooms.ok' : 'matchReason.rooms.diff', {
                wanted: lead.rooms,
                actual: property.rooms,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
