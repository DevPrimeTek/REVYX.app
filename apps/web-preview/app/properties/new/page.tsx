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

export default function NewPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useT();
  const [submitting, setSubmitting] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  function onPhotoFakePick() {
    setPhotoCount((c) => Math.min(12, c + Math.max(1, Math.floor(Math.random() * 4))));
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
                <Input
                  label={t('property.form.priceLabel')}
                  name="price"
                  type="number"
                  min={1000}
                  step={500}
                  defaultValue={64000}
                  required
                />
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
