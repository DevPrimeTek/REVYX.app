'use client';

// M0.S8 · /showings · agentul vede toate programările sale.

import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShowingList } from '@/components/showings/showing-list';
import { ShowingModal } from '@/components/showings/showing-modal';
import { useT } from '@/components/i18n/provider';
import { useShowings } from '@/lib/showing-store';
import { agents, leadsById } from '@/lib/mock';

export default function ShowingsPage() {
  const { t, locale } = useT();
  const showings = useShowings();
  const [open, setOpen] = useState(false);
  const me = agents[0];

  const mine = useMemo(() => showings.filter((s) => s.agentId === me.id), [showings, me.id]);
  const upcoming = mine.filter((s) => s.status === 'SCHEDULED' && new Date(s.scheduledAt) >= new Date());
  const today = mine.filter((s) => {
    const d = new Date(s.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const past = mine.filter((s) => s.status === 'ATTENDED' || s.status === 'NO_SHOW' || s.status === 'CANCELLED');

  const sampleLead = leadsById.get('L-1003') ?? Array.from(leadsById.values())[0];

  return (
    <>
      <SiteNav active="/showings" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-6xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('showing.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('showing.pageTitle')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">{t('showing.pageSubtitle')}</p>
          </div>
          <Button onClick={() => setOpen(true)}>{t('showing.addCta')}</Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card>
            <CardHeader>
              <CardTitle>{t('showing.kpiToday')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[32px] font-display text-gold">{today.length}</p>
              <p className="text-[12px] text-text-secondary mt-sp1">{t('showing.kpiTodayDesc')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('showing.kpiUpcoming')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[32px] font-display text-gold">{upcoming.length}</p>
              <p className="text-[12px] text-text-secondary mt-sp1">{t('showing.kpiUpcomingDesc')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('showing.kpiAttendance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[32px] font-display text-gold">
                {past.length === 0
                  ? '—'
                  : Math.round(
                      (past.filter((s) => s.status === 'ATTENDED').length / past.length) * 100,
                    ) + '%'}
              </p>
              <p className="text-[12px] text-text-secondary mt-sp1">{t('showing.kpiAttendanceDesc')}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('showing.upcomingTitle')}</CardTitle>
            <CardDescription>{t('showing.upcomingDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ShowingList showings={upcoming} locale={locale} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('showing.pastTitle')}</CardTitle>
            <CardDescription>{t('showing.pastDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ShowingList showings={past} locale={locale} />
          </CardContent>
        </Card>
      </main>

      <ShowingModal
        open={open}
        onClose={() => setOpen(false)}
        leadId={sampleLead?.id ?? 'L-1001'}
        agentId={me.id}
      />
    </>
  );
}
