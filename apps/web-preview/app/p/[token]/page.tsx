'use client';

// M0.S8 · /p/[token] · public showcase — accesibil fără auth, link partajabil clienților.
// Token-ul în demo este pur și simplu ID-ul proprietății (P-XXXX) sau ultimii 6 chr.

import Link from 'next/link';
import { useT } from '@/components/i18n/provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { properties, propertiesById } from '@/lib/mock';

type Params = { params: { token: string } };

export default function PublicShowcasePage({ params }: Params) {
  const { t } = useT();
  // Demo: resolve "p-1003" / "1003" / a 6-char tail back to a property.
  const upper = params.token.toUpperCase();
  const direct = propertiesById.get(upper.startsWith('P-') ? upper : `P-${upper}`);
  const fuzzy = properties.find((p) => p.id.includes(params.token.toUpperCase()));
  const property = direct ?? fuzzy ?? properties[0];

  if (!property) {
    return (
      <main className="min-h-screen px-sp4 py-sp8 text-center">
        <p className="label-mono text-gold">410 Gone</p>
        <h1 className="text-[28px] mt-sp2">{t('showcase.gone')}</h1>
        <p className="text-text-secondary mt-sp2">{t('showcase.goneDesc')}</p>
      </main>
    );
  }

  return (
    <main id="main" className="min-h-screen bg-navy-deep">
      <header className="border-b border-border bg-navy-card px-sp4 py-sp3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-sp3">
          <Link href="/" className="font-display text-[22px] tracking-wide text-gold">REVYX</Link>
          <span className="badge-mono text-text-muted">{t('showcase.publicBadge')}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-sp4 py-sp4 lg:px-sp6 flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('showcase.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{property.addr}</h1>
          <p className="text-[14px] text-text-secondary mt-sp1">
            {property.city}, {property.zone} · {property.area} m²
          </p>
        </header>

        {/* Photo placeholder gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-sp2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-video rounded-md bg-gradient-to-br from-navy-card via-navy-mid to-navy-card border border-border flex items-center justify-center text-[40px] text-gold/30"
              aria-label={`Photo ${i + 1}`}
            >
              {i === 0 ? '🏠' : i === 1 ? '🛋️' : i === 2 ? '🍳' : i === 3 ? '🛏️' : i === 4 ? '🛁' : '🌳'}
            </div>
          ))}
        </div>

        <Card variant="elevated">
          <CardContent className="pt-sp3 grid grid-cols-1 sm:grid-cols-3 gap-sp3">
            <div>
              <p className="text-text-muted text-[11px]">{t('showcase.price')}</p>
              <p className="text-gold text-[32px] font-display">€{property.priceEur.toLocaleString('ro-MD')}</p>
              <p className="text-text-muted text-[11px]">
                €{Math.round(property.priceEur / property.area).toLocaleString('ro-MD')} / m²
              </p>
            </div>
            <div>
              <p className="text-text-muted text-[11px]">{t('showcase.kind')}</p>
              <p className="text-text-h">{t(`property.kind${capitalize(property.kind)}`)}</p>
              <p className="text-text-muted text-[11px]">{property.rooms} {t('property.rooms')}</p>
            </div>
            <div>
              <p className="text-text-muted text-[11px]">{t('showcase.status')}</p>
              <Badge variant="success" size="sm">{t('showcase.statusActive')}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('showcase.descriptionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {t('showcase.descriptionBody', {
                rooms: String(property.rooms),
                area: String(property.area),
                zone: property.zone,
                city: property.city,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('showcase.contactTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-sp2">
            <p className="text-[13px] text-text-secondary">{t('showcase.contactDesc')}</p>
            <div className="flex flex-wrap gap-sp2">
              <Button>{t('showcase.requestShowing')}</Button>
              <Button variant="secondary">{t('showcase.askQuestion')}</Button>
              <Button variant="ghost">{t('showcase.share')}</Button>
            </div>
            <p className="text-[11px] text-text-muted mt-sp2">{t('showcase.gdprNotice')}</p>
          </CardContent>
        </Card>

        <p className="text-[11px] text-text-muted text-center pt-sp2">
          {t('showcase.footerNotice', { token: property.id })}
        </p>
      </div>
    </main>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
