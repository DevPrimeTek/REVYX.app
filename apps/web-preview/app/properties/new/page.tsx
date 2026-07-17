'use client';

// M0.S6 · New property form · photo / video / public link sections + agent-friendly copy.

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';

type ListingChoice = 'sale' | 'rent' | 'both';

export default function NewPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useT();
  const [submitting, setSubmitting] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  // Regula 20: listing type obligatoriu la create.
  const [listingType, setListingType] = useState<ListingChoice>('sale');
  // Punct 5: lista beneficii la create (sync cu PropertyBenefitsPanel logic).
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitDraft, setBenefitDraft] = useState('');
  // M0.S8.3 · Regula 20+21: commission % negociat de agent la create (vizibil client + agent).
  const [priceEur, setPriceEur] = useState(64000);
  const [monthlyRentEur, setMonthlyRentEur] = useState(420);
  // Sale|both: 0.5-6% din priceEur (default 2.5%). Rent: 25-200% din chirie (default 100% = 1× chirie).
  const isRentOnly = listingType === 'rent';
  const [saleCommissionPct, setSaleCommissionPct] = useState(2.5);
  const [rentCommissionPct, setRentCommissionPct] = useState(100);
  const commissionPct = isRentOnly ? rentCommissionPct : saleCommissionPct;
  const setCommissionPct = isRentOnly ? setRentCommissionPct : setSaleCommissionPct;
  const commissionBase = isRentOnly ? monthlyRentEur : priceEur;
  const commissionAmount = Math.round((commissionBase * commissionPct) / 100 / 10) * 10;

  function onPhotoFakePick() {
    setPhotoCount((c) => Math.min(12, c + Math.max(1, Math.floor(Math.random() * 4))));
  }

  function addBenefit() {
    const v = benefitDraft.trim();
    if (!v) return;
    setBenefits((cur) => (cur.includes(v) ? cur : [...cur, v]));
    setBenefitDraft('');
  }
  function removeBenefit(b: string) {
    setBenefits((cur) => cur.filter((x) => x !== b));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const propertyId = 'P-1951';

    setTimeout(() => {
      toast({
        variant: 'success',
        title: `${t('common.save')} · ${propertyId}`,
        description: t('property.form.successInfo'),
        duration: 5500,
      });
      setTimeout(() => router.push('/leads/L-1001'), 700);
    }, 400);
  }

  return (
    <>
      <SiteNav active="/properties" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-3xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/properties" className="hover:text-text-h">{t('property.portfolioTitle')}</Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h">{t('property.addCta')}</span>
        </nav>

        <header>
          <div className="flex items-center gap-sp2">
            <p className="label-mono text-gold">{t('property.moduleLabel')}</p>
            <Badge variant="info" size="xs">demo</Badge>
          </div>
          <h1 className="text-[28px] mt-sp1">{t('property.newFormTitle')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('property.newFormSubtitle')}</p>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col gap-sp4">
          {/* Regula 20: Listing type selector (sale / rent / both) la create. */}
          <Card variant="elevated" accentTop>
            <CardHeader>
              <CardTitle>{t('property.form.listingTypeTitle')}</CardTitle>
              <CardDescription>{t('property.form.listingTypeDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <fieldset className="flex flex-wrap gap-sp2">
                <legend className="sr-only">{t('property.form.listingTypeTitle')}</legend>
                {(['sale', 'rent', 'both'] as ListingChoice[]).map((lt) => {
                  const selected = listingType === lt;
                  return (
                    <button
                      key={lt}
                      type="button"
                      onClick={() => setListingType(lt)}
                      aria-pressed={selected}
                      className={
                        'flex flex-col items-start gap-1 rounded-md border-2 px-sp3 py-sp2 transition-all cursor-pointer min-w-[180px] ' +
                        (selected
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-border bg-navy-deep text-text-secondary hover:border-border-light')
                      }
                    >
                      <span className="text-[13px] font-semibold">{t(`property.listingType.${lt}`)}</span>
                      <span className="text-[11px] text-text-muted">{t(`property.form.listingTypeHelp.${lt}`)}</span>
                    </button>
                  );
                })}
              </fieldset>
            </CardContent>
          </Card>

          <Card variant="elevated" accentTop>
            <CardHeader>
              <CardTitle>{t('property.form.essentials')}</CardTitle>
              <CardDescription>{t('property.form.essentialsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sp3">
                <Input
                  label={t('property.form.addressLabel')}
                  name="address"
                  placeholder="Str. Mitropolit G. Bănulescu 24, ap. 17"
                  required
                />
                <Input
                  label={t('property.form.cityLabel')}
                  name="city"
                  placeholder="Chișinău"
                  defaultValue="Chișinău"
                  required
                />
                <Input
                  label={t('property.form.districtLabel')}
                  name="district"
                  placeholder="Centru"
                  hint={t('property.form.districtHelp')}
                  required
                />
                <Input
                  label={t('property.form.roomsLabel')}
                  name="rooms"
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={2}
                  required
                />
                <Input
                  label={t('property.form.areaLabel')}
                  name="area"
                  type="number"
                  min={10}
                  defaultValue={58}
                  required
                />
                {/* Regula 20: preț de vânzare condiționat de listingType */}
                {(listingType === 'sale' || listingType === 'both') && (
                  <Input
                    label={t('property.form.priceLabel')}
                    name="price"
                    type="number"
                    min={1000}
                    max={10000000}
                    step={500}
                    value={priceEur}
                    onChange={(e) => setPriceEur(Math.max(0, Number(e.target.value) || 0))}
                    required
                  />
                )}
                {/* Regula 20: chirie lunară condiționată de listingType */}
                {(listingType === 'rent' || listingType === 'both') && (
                  <Input
                    label={t('property.form.monthlyRentLabel')}
                    name="monthlyRent"
                    type="number"
                    min={50}
                    step={10}
                    value={monthlyRentEur}
                    onChange={(e) => setMonthlyRentEur(Math.max(0, Number(e.target.value) || 0))}
                    hint={t('property.form.monthlyRentHelp')}
                    required
                  />
                )}
                <Input
                  label={t('property.form.yearLabel')}
                  name="year"
                  type="number"
                  min={1900}
                  max={2030}
                  defaultValue={2018}
                />
                <Input
                  label={t('property.form.floorLabel')}
                  name="floor"
                  placeholder="3/9"
                  defaultValue="3/9"
                />
              </div>
            </CardContent>
          </Card>

          {/* M0.S8.3+ · Regula 20+21: comision negociat la create — aplicabil sale (% preț) ȘI rent (% chirie). */}
          <Card>
            <CardHeader>
              <CardTitle>{t('property.form.commissionPctTitle')}</CardTitle>
              <CardDescription>
                {isRentOnly
                  ? t('property.form.commissionPctDescRent')
                  : t('property.form.commissionPctDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sp3 items-end">
                <Input
                  label={t('property.form.commissionPctLabel')}
                  name="commissionPct"
                  type="number"
                  min={isRentOnly ? 25 : 0.5}
                  max={isRentOnly ? 200 : 6}
                  step={isRentOnly ? 5 : 0.1}
                  value={commissionPct}
                  onChange={(e) => {
                    const raw = Number(e.target.value) || 0;
                    const lo = isRentOnly ? 25 : 0.5;
                    const hi = isRentOnly ? 200 : 6;
                    setCommissionPct(Math.min(hi, Math.max(lo, raw)));
                  }}
                  hint={
                    isRentOnly
                      ? t('property.form.commissionPctHintRent')
                      : t('property.form.commissionPctHint')
                  }
                  required
                />
                <div className="bg-navy-deep border border-border rounded-md px-sp3 py-sp2">
                  <p className="text-[12px] text-text-muted">
                    {t('property.form.commissionPctAmount')}
                  </p>
                  <p className="text-[20px] text-gold font-mono font-semibold mt-sp1">
                    €{commissionAmount.toLocaleString('ro-MD')}
                    {isRentOnly && <span className="text-text-muted text-[12px] ml-1">{t('deal.perMonth')}</span>}
                  </p>
                  <p className="text-[11px] text-text-muted mt-sp1">
                    {commissionPct}% × €{commissionBase.toLocaleString('ro-MD')}
                    {isRentOnly && <span> {t('deal.perMonth')}</span>}
                  </p>
                </div>
              </div>
              {listingType === 'both' && (
                <p className="text-[11px] text-text-muted mt-sp2">
                  {t('property.form.commissionPctRentNote')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Punct 5: lista de beneficii la create — agentul evidențiază punctele forte. */}
          <Card>
            <CardHeader>
              <CardTitle>{t('property.form.benefitsTitle')}</CardTitle>
              <CardDescription>{t('property.form.benefitsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {benefits.length === 0 ? (
                <p className="text-text-muted text-[12px]">{t('property.form.benefitsEmpty')}</p>
              ) : (
                <ul className="flex flex-col gap-sp1">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-center justify-between gap-sp2 px-sp3 py-sp1 bg-navy-deep border border-border rounded-md">
                      <span className="flex items-center gap-sp2 text-[13px] text-text-h">
                        <span aria-hidden className="text-gold">✓</span>{b}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(b)}
                        className="text-[11px] text-text-muted hover:text-status-amber cursor-pointer"
                      >
                        {t('common.remove')}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-end gap-sp2">
                <Input
                  label={t('property.form.benefitAddLabel')}
                  value={benefitDraft}
                  onChange={(e) => setBenefitDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addBenefit(); }
                  }}
                  placeholder={t('benefits.addPlaceholder')}
                  className="flex-1 min-w-0"
                />
                <Button type="button" size="sm" variant="secondary" onClick={addBenefit}>
                  {t('common.add')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('property.form.mediaTitle')}</CardTitle>
              <CardDescription>{t('property.form.mediaDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp3">
              <div>
                <p className="text-[12px] text-text-secondary mb-sp1">{t('property.form.uploadPhotos')}</p>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={onPhotoFakePick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onPhotoFakePick();
                  }}
                  className="border-2 border-dashed border-border-light hover:border-gold rounded-lg px-sp4 py-sp4 cursor-pointer transition-colors duration-fast text-center bg-navy-deep focus-visible:outline-none focus-visible:border-gold"
                >
                  <p className="text-[28px]">🖼️</p>
                  <p className="text-[13px] text-text-h mt-sp1">{t('property.form.uploadPhotos')}</p>
                  <p className="text-[11px] text-text-muted mt-sp1">{t('property.form.uploadPhotosHelp')}</p>
                  {photoCount > 0 && (
                    <p className="text-[12px] text-gold mt-sp2">
                      {photoCount} {t('property.rooms') === 'camere' ? 'foto' : photoCount === 1 ? 'photo' : 'фото'}
                    </p>
                  )}
                </div>
              </div>

              <Input
                label={t('property.form.uploadVideo')}
                name="video"
                placeholder="https://youtu.be/…"
                hint={t('property.form.uploadVideoHelp')}
              />

              <Input
                label={t('property.form.linkTitle')}
                name="externalLink"
                placeholder="https://999.md/…"
                hint={t('property.form.linkHelp')}
              />
            </CardContent>
          </Card>

          <div className="bg-navy-deep border border-border rounded-md px-sp3 py-sp2 text-[12px] text-text-secondary">
            {t('property.form.successInfo')}
          </div>

          <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
            <Link href="/properties">
              <Button type="button" variant="ghost">{t('common.cancel')}</Button>
            </Link>
            <Button type="submit" loading={submitting}>
              {t('property.form.submitCta')}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
