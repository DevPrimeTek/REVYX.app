'use client';

// Val 2 (AGI §18.11 Listing Price Discipline) · Disciplinează prețul de listare — avertizează
// agentul când proprietarul cere un preț nerealist („хотелка"). Compară prețul de listare cu
// o estimare de piață (€/m² per clasă RM §17.6). overpricing_risk = preț > estimare × 1.15.
// La risc → link etic Art. 12 (reclamă neînșelătoare). VISUAL SKELETON.
// Structura avansată (datorie urmărită): pricing AI real + LF degradare accelerată + AUDIT_LOG.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { EthicsCheckpoint } from '@/components/ui/ethics-checkpoint';
import { useT } from '@/components/i18n/provider';
import type { Property } from '@/lib/mock';

/** [MOLDOVA-SPECIFIC §17.6] estimare €/m² Chișinău per clasă fond locativ (skeleton). */
const PRICE_PER_SQM: Record<Property['propertyClass'], number> = {
  soviet_era: 900,
  post_soviet: 1000,
  new_build: 1150,
  premium: 1650,
};

export function PriceDisciplinePanel({ property }: { property: Property }) {
  const { t } = useT();
  // Disciplina de preț se aplică prețului de vânzare (sale/both). Pentru rent pur — nu.
  if (property.listingType === 'rent' || property.priceEur <= 0) return null;

  const estimate = Math.round(property.area * PRICE_PER_SQM[property.propertyClass]);
  const ratio = property.priceEur / estimate;
  const overpriced = ratio > 1.15;
  const diffPct = Math.round((ratio - 1) * 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-sp2">
        <div>
          <div className="flex items-center gap-sp1">
            <CardTitle>{t('priceDiscipline.title')}</CardTitle>
            <InfoTooltip label={t('priceDiscipline.title')} body={t('priceDiscipline.help')} />
          </div>
          <CardDescription>{t('priceDiscipline.desc')}</CardDescription>
        </div>
        <Badge variant={overpriced ? 'critical' : 'success'} size="sm">
          {t(overpriced ? 'priceDiscipline.flagOver' : 'priceDiscipline.flagOk')}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp3 text-[13px]">
          <div className="rounded-md border border-border bg-navy-deep/40 p-sp3">
            <span className="text-[11px] text-text-muted block">{t('priceDiscipline.listPrice')}</span>
            <span className="text-[16px] text-text-h font-semibold">€{property.priceEur.toLocaleString('ro-MD')}</span>
          </div>
          <div className="rounded-md border border-border bg-navy-deep/40 p-sp3">
            <span className="text-[11px] text-text-muted block">{t('priceDiscipline.marketEstimate')}</span>
            <span className="text-[16px] text-text-h font-semibold">€{estimate.toLocaleString('ro-MD')}</span>
            <span className="text-[10px] text-text-muted block mt-sp1">
              {t('priceDiscipline.estimateBasis', { sqm: property.area, ppsqm: PRICE_PER_SQM[property.propertyClass].toLocaleString('ro-MD') })}
            </span>
          </div>
        </div>

        {overpriced ? (
          <>
            <div className="rounded-md bg-status-red/10 border border-status-red/30 px-sp3 py-sp2 text-[12px] text-status-red">
              {t('priceDiscipline.overWarning', { pct: diffPct })}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-text-muted mb-sp1">{t('priceDiscipline.scriptLabel')}</p>
              <p className="text-[12px] text-text-secondary italic border-l-2 border-gold/40 pl-sp2">{t('priceDiscipline.script')}</p>
            </div>
            {/* §18.11 → link etic Art. 12 reclamă neînșelătoare */}
            <EthicsCheckpoint
              storageKey={`prop-${property.id}-misleading_advertising`}
              trigger="misleading_advertising"
              narArticle={t('ethics.nar12')}
            />
          </>
        ) : (
          <p className="text-[12px] text-status-green">{t('priceDiscipline.okNote')}</p>
        )}
      </CardContent>
    </Card>
  );
}
