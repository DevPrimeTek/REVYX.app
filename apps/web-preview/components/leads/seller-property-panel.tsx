'use client';

// M0.S9 · Seller view — pagina lead-ului vânzător arată proprietatea pe care o vinde +
// beneficiile promovate + programările de vizionări existente pe acea proprietate.

import Link from 'next/link';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { useBenefits } from '@/lib/property-benefits-store';
import { useShowings } from '@/lib/showing-store';
import { propertiesById, type Lead } from '@/lib/mock';
import { ShowingList } from '@/components/showings/showing-list';

export function SellerPropertyPanel({ lead, locale }: { lead: Lead; locale: string }) {
  const { t } = useT();
  const property = lead.sellingPropertyId ? propertiesById.get(lead.sellingPropertyId) : undefined;
  const benefits = useBenefits(property?.id ?? '', property?.kind ?? 'apartment');
  const showings = useShowings();

  const propertyShowings = useMemo(
    () => (property ? showings.filter((s) => s.propertyId === property.id) : []),
    [showings, property],
  );

  if (!property) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('seller.noPropertyTitle')}</CardTitle>
          <CardDescription>{t('seller.noPropertyDesc')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-sp3">
      <Card variant="elevated" accentTop>
        <CardHeader>
          <p className="label-mono text-gold">{t('seller.sellingPropertyLabel')}</p>
          <CardTitle>{property.addr}</CardTitle>
          <CardDescription>
            {property.city}, {property.zone} · {property.area} m² · {property.rooms} {t('property.rooms')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-sp3 text-[13px]">
            <div>
              <p className="text-text-muted text-[11px]">{t('seller.priceLabel')}</p>
              <p className="text-gold text-[20px] font-display">€{property.priceEur.toLocaleString('ro-MD')}</p>
            </div>
            <div>
              <p className="text-text-muted text-[11px]">{t('seller.daysOnMarketLabel')}</p>
              <p className="text-text-h">{property.daysOnMarket} {t('seller.days')}</p>
            </div>
            <div>
              <p className="text-text-muted text-[11px]">{t('seller.kindLabel')}</p>
              <Badge variant="info" size="xs">
                {t(`property.kind${capitalize(property.kind)}`)}
              </Badge>
            </div>
          </div>
          <div className="mt-sp3 pt-sp2 border-t border-border">
            <Link
              href={`/properties/${property.id}`}
              className="text-[12px] text-gold hover:underline underline-offset-4"
            >
              {t('seller.openProperty')} →
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('seller.benefitsTitle')}</CardTitle>
          <CardDescription>{t('seller.benefitsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {benefits.length === 0 ? (
            <p className="text-text-muted text-[12px]">
              {t('seller.benefitsEmpty')}{' '}
              <Link href={`/properties/${property.id}`} className="text-gold hover:underline">
                {t('seller.editBenefitsLink')}
              </Link>
            </p>
          ) : (
            <ul className="flex flex-col gap-sp1">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-sp2 text-[13px] text-text-h">
                  <span aria-hidden className="text-gold mt-px">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('seller.showingsTitle')}</CardTitle>
          <CardDescription>{t('seller.showingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ShowingList showings={propertyShowings} locale={locale} compact />
        </CardContent>
      </Card>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
