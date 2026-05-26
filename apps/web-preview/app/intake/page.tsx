'use client';

// M0.S8 · /intake · pagina manager pentru simulare intake lead (webhook nou) + GDPR consent + firewall.

import { useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { LeadIntakeModal } from '@/components/intake/lead-intake-modal';
import { useGdprConsents, useGdprActions } from '@/lib/gdpr-store';

function fmtDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleString(locale === 'ru' ? 'ru-RU' : 'ro-RO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function IntakePage() {
  const { t, locale } = useT();
  const [modalOpen, setModalOpen] = useState(false);
  const consents = useGdprConsents();
  const { requestErase, completeErase } = useGdprActions();

  const recent = [...consents].sort((a, b) => b.capturedAt.localeCompare(a.capturedAt)).slice(0, 10);

  return (
    <>
      <SiteNav active="/intake" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-5xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('intake.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('intake.pageTitle')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1 max-w-3xl">{t('intake.pageSubtitle')}</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>{t('intake.openCta')}</Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
          <Card>
            <CardHeader>
              <CardTitle>{t('intake.firewallExpTitle')}</CardTitle>
              <CardDescription>{t('intake.firewallExpDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-sp2 text-[12px] text-text-secondary">
                <li className="flex items-start gap-sp2">
                  <Badge variant="success" size="xs">1</Badge>
                  <span><strong className="text-text-h">{t('intake.rule1')}</strong> — {t('intake.rule1Desc')}</span>
                </li>
                <li className="flex items-start gap-sp2">
                  <Badge variant="success" size="xs">2</Badge>
                  <span><strong className="text-text-h">{t('intake.rule2')}</strong> — {t('intake.rule2Desc')}</span>
                </li>
                <li className="flex items-start gap-sp2">
                  <Badge variant="success" size="xs">3</Badge>
                  <span><strong className="text-text-h">{t('intake.rule3')}</strong> — {t('intake.rule3Desc')}</span>
                </li>
                <li className="flex items-start gap-sp2">
                  <Badge variant="success" size="xs">4</Badge>
                  <span><strong className="text-text-h">{t('intake.rule4')}</strong> — {t('intake.rule4Desc')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('intake.gdprExpTitle')}</CardTitle>
              <CardDescription>{t('intake.gdprExpDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-sp2 text-[12px] text-text-secondary">
                <li><strong className="text-text-h">{t('intake.gdpr1')}</strong> — {t('intake.gdpr1Desc')}</li>
                <li><strong className="text-text-h">{t('intake.gdpr2')}</strong> — {t('intake.gdpr2Desc')}</li>
                <li><strong className="text-text-h">{t('intake.gdpr3')}</strong> — {t('intake.gdpr3Desc')}</li>
                <li><strong className="text-text-h">{t('intake.gdpr4')}</strong> — {t('intake.gdpr4Desc')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('intake.recentTitle')}</CardTitle>
            <CardDescription>{t('intake.recentDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-text-muted text-[12px]">{t('intake.recentEmpty')}</p>
            ) : (
              <ul className="flex flex-col gap-sp2">
                {recent.map((c) => (
                  <li
                    key={c.leadId}
                    className="border border-border rounded-md bg-navy-deep px-sp3 py-sp2 flex items-center justify-between gap-sp2 flex-wrap"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-text-muted">{c.leadId}</p>
                      <p className="text-[12px] text-text-h">
                        {fmtDate(c.capturedAt, locale)} · {c.capturedSource}
                      </p>
                      <div className="flex flex-wrap gap-sp1 mt-sp1">
                        {c.baseConsent && <Badge variant="success" size="xs">{t('intake.tagBase')}</Badge>}
                        {c.marketingConsent && <Badge variant="info" size="xs">{t('intake.tagMarketing')}</Badge>}
                        {c.publicConsent && <Badge variant="updated" size="xs">{t('intake.tagPublic')}</Badge>}
                        {c.erasureRequestedAt && <Badge variant="warning" size="xs">{t('intake.tagErasure')}</Badge>}
                        {c.erasureCompletedAt && <Badge variant="critical" size="xs">{t('intake.tagErased')}</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-sp1">
                      {!c.erasureRequestedAt && (
                        <Button size="sm" variant="ghost" onClick={() => requestErase(c.leadId)}>
                          {t('intake.requestErase')}
                        </Button>
                      )}
                      {c.erasureRequestedAt && !c.erasureCompletedAt && (
                        <Button size="sm" variant="secondary" onClick={() => completeErase(c.leadId)}>
                          {t('intake.completeErase')}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>

      <LeadIntakeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
