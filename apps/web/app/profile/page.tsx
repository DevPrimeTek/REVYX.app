'use client';

// M0.S3 · T-M0.S3-07 · Agent profile · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-07 + T-M0.S3-13

import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScorePill } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { agents, deals, leads } from '@/lib/mock';

export default function ProfilePage() {
  const { t } = useT();
  const me = agents[0];
  const myDeals = deals.filter((d) => d.agentId === me.id);
  const myLeads = leads.filter((l) => l.agentId === me.id);

  // Synthetic 6-month APS sparkline (just numeric chips, no chart lib in M0).
  const apsHistory = [0.62, 0.66, 0.70, 0.73, 0.78, me.aps];

  return (
    <>
      <SiteNav active="/profile" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('profile.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{me.name}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            {me.id} · {t('profile.tenure')} {Math.round(me.tenure / 30)} luni · {t('profile.subtitle')}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-sp3">
          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-text-secondary">APS</p>
              <CardTitle>{me.aps.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScorePill label="now" value={me.aps} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('profile.trust')}</p>
              <CardTitle>{me.trust.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScorePill label="TS" value={me.trust} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('profile.activeTasks')}</p>
              <CardTitle>{me.activeTasks}/3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[12px] text-text-secondary">BR-04 cap</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('profile.closed30d')}</p>
              <CardTitle>{me.closedDeals30d}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="success" size="xs">peste target 5+</Badge>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>APS · 6 luni</CardTitle>
            <CardDescription>Trend lunar (mock M0 — chart lib M1.S5).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-sp2 h-[120px]">
              {apsHistory.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-sp1 flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-gold-dark to-gold rounded-t"
                    style={{ height: `${v * 100}px` }}
                    aria-label={`Luna ${i + 1}: APS ${v.toFixed(2)}`}
                  />
                  <span className="font-mono text-[10px] text-text-muted">{v.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
          <Card>
            <CardHeader>
              <CardTitle>Lead-uri asignate</CardTitle>
              <CardDescription>{myLeads.length} lead-uri active la nivel firewall.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-sp1 text-[13px]">
                {myLeads.slice(0, 6).map((l) => (
                  <li key={l.id} className="flex items-center justify-between border border-border rounded-md px-sp2 py-sp1">
                    <span>
                      <span className="font-mono text-text-secondary text-[11px]">{l.id}</span>{' '}
                      <span className="text-text-h">{l.name}</span>
                    </span>
                    <span className="font-mono text-gold">{l.ls.toFixed(2)}</span>
                  </li>
                ))}
                {myLeads.length === 0 && (
                  <li className="text-text-muted text-[12px]">Niciun lead asignat curent.</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deal-uri în pipeline</CardTitle>
              <CardDescription>{myDeals.length} deal-uri (incl. Won).</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-sp1 text-[13px]">
                {myDeals.slice(0, 6).map((d) => (
                  <li key={d.id} className="flex items-center justify-between border border-border rounded-md px-sp2 py-sp1">
                    <span>
                      <span className="font-mono text-text-secondary text-[11px]">{d.id}</span>{' '}
                      <span className="text-text-h">{t(`deal.stages.${d.stage}`)}</span>
                    </span>
                    <span className="font-mono text-gold">{d.dp.toFixed(2)}</span>
                  </li>
                ))}
                {myDeals.length === 0 && (
                  <li className="text-text-muted text-[12px]">Niciun deal activ.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
