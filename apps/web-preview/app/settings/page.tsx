'use client';

// M0.S3 · T-M0.S3-06 · Settings stub (tenant config) · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-06

import { useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useT, SUPPORTED_LOCALES, type Locale } from '@/components/i18n/provider';

const sections = ['general', 'notifications', 'integrations', 'security'] as const;
type Section = (typeof sections)[number];

export default function SettingsPage() {
  const { t, locale, setLocale } = useT();
  const { toast } = useToast();
  const [active, setActive] = useState<Section>('general');
  const [tz] = useState('Europe/Chisinau · UTC+2');
  const [currency, setCurrency] = useState<'EUR' | 'MDL' | 'USD'>('EUR');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWa, setNotifWa] = useState(true);
  const [notifEsc, setNotifEsc] = useState(true);

  function save() {
    toast({ variant: 'success', title: t('settings.saveOk') });
  }

  return (
    <>
      <SiteNav active="/settings" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <div className="flex items-center gap-sp2">
            <p className="label-mono text-gold">{t('settings.moduleLabel')}</p>
            <Badge variant="critical" size="xs">{t('settings.webOnly')}</Badge>
          </div>
          <h1 className="text-[28px] mt-sp1">{t('settings.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('settings.subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-sp4">
          <nav aria-label={t('settings.sectionsAria')} className="flex flex-wrap lg:flex-col gap-1">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                aria-current={active === s ? 'page' : undefined}
                onClick={() => setActive(s)}
                className={
                  'text-left px-sp3 py-sp2 rounded-md text-[13px] transition-colors duration-fast ' +
                  (active === s
                    ? 'bg-navy-hover text-gold border border-gold/30'
                    : 'text-text-secondary hover:bg-navy-hover hover:text-text-h border border-transparent')
                }
              >
                {t(`settings.sections.${s}`)}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-sp3">
            {active === 'general' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.sections.general')}</CardTitle>
                  <CardDescription>{t('settings.generalDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-sp3">
                  <div>
                    <label className="label-mono text-text-secondary block mb-sp1">{t('settings.locale')}</label>
                    <div className="flex items-center gap-1 rounded-md border border-border p-1 bg-navy-deep self-start w-fit">
                      {SUPPORTED_LOCALES.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLocale(l as Locale)}
                          aria-pressed={locale === l}
                          className={
                            'px-sp3 py-1 text-[12px] rounded font-mono uppercase tracking-wider transition-colors duration-fast ' +
                            (locale === l
                              ? 'bg-gold/10 text-gold'
                              : 'text-text-secondary hover:bg-navy-hover hover:text-text-h')
                          }
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label-mono text-text-secondary block mb-sp1">{t('settings.timezone')}</label>
                    <p className="text-[13px] text-text-h font-mono">{tz}</p>
                  </div>
                  <div>
                    <label htmlFor="ccy" className="label-mono text-text-secondary block mb-sp1">
                      {t('settings.currency')}
                    </label>
                    <select
                      id="ccy"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as 'EUR' | 'MDL' | 'USD')}
                      className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h focus-visible:outline-none focus-visible:border-gold"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="MDL">MDL (L)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                  <div className="pt-sp3 border-t border-border">
                    <Button onClick={save}>{t('common.save')}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {active === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.sections.notifications')}</CardTitle>
                  <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-sp2">
                  {[
                    { id: 'email', label: t('settings.notifEmailLabel'), state: notifEmail, set: setNotifEmail },
                    { id: 'wa', label: t('settings.notifWhatsAppLabel'), state: notifWa, set: setNotifWa },
                    { id: 'esc', label: t('settings.notifEscalationsLabel'), state: notifEsc, set: setNotifEsc },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center justify-between gap-sp3 border border-border rounded-md px-sp3 py-sp2 cursor-pointer hover:bg-navy-hover transition-colors"
                    >
                      <span className="text-[13px] text-text-h">{opt.label}</span>
                      <input
                        type="checkbox"
                        checked={opt.state}
                        onChange={(e) => opt.set(e.target.checked)}
                        className="accent-gold w-4 h-4"
                      />
                    </label>
                  ))}
                  <div className="pt-sp3 border-t border-border">
                    <Button onClick={save}>{t('common.save')}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {active === 'integrations' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.sections.integrations')}</CardTitle>
                  <CardDescription>{t('settings.integrationsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-sp2 text-[13px]">
                  {[
                    { label: t('settings.intWaApi'), stateKey: 'intStateConnected' as const, color: 'success' as const },
                    { label: t('settings.intMetaWebhook'), stateKey: 'intStateConnected' as const, color: 'success' as const },
                    { label: t('settings.intOlxWebhook'), stateKey: 'intStateConnected' as const, color: 'success' as const },
                    { label: t('settings.intGoogleWebhook'), stateKey: 'intStatePending' as const, color: 'warning' as const },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border border-border rounded-md px-sp3 py-sp2"
                    >
                      <span className="text-text-h">{row.label}</span>
                      <Badge variant={row.color} size="xs">{t(`settings.${row.stateKey}`)}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {active === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.sections.security')}</CardTitle>
                  <CardDescription>{t('settings.securityDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-sp2 text-[13px] text-text-secondary">
                  <p>{t('settings.securityJwt')}</p>
                  <p>{t('settings.securityRetention')}</p>
                  <p>{t('settings.securityWebhook')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
