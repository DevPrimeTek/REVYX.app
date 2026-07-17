'use client';

// M0.S3 · T-M0.S3-08 · Notifications feed · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-08 + T-M0.S3-13

import { useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';

type N = {
  id: string;
  kind: 'escalation' | 'rematch' | 'won' | 'assigned' | 'system';
  title: string;
  body: string;
  ts: string;
  read: boolean;
};

const seed: N[] = [
  { id: 'N-001', kind: 'won',        title: 'Deal D-1015 închis ca Won',          body: 'Comision generat €1,950. APS recalculat → 0.84.', ts: '2026-05-17 14:21', read: false },
  { id: 'N-002', kind: 'escalation', title: 'Escalare L2 · Maria P.',              body: 'Lead L-1001 a depășit T+SLA+30m. Acțiune cerută.', ts: '2026-05-17 13:47', read: false },
  { id: 'N-003', kind: 'rematch',    title: 'Re-matching P-1942 → BR-05',          body: 'Proprietatea actualizată. 3 lead-uri afectate. Deal-urile NU s-au anulat.', ts: '2026-05-17 12:05', read: false },
  { id: 'N-004', kind: 'assigned',   title: 'Lead L-1023 asignat',                 body: 'Manager a reassign-uit cu prioritate HOT.', ts: '2026-05-17 10:33', read: true },
  { id: 'N-005', kind: 'system',     title: 'Întreținere planificată',             body: 'Fereastra de mentenanță: duminică 02:00–03:00 UTC.', ts: '2026-05-16 18:00', read: true },
  { id: 'N-006', kind: 'won',        title: 'Deal D-1011 închis ca Won',          body: 'Comision generat €2,300.', ts: '2026-05-16 11:14', read: true },
];

function kindMeta(kind: N['kind']) {
  switch (kind) {
    case 'escalation': return { variant: 'critical' as const, label: 'escalation' };
    case 'rematch':    return { variant: 'warning' as const,  label: 'rematch' };
    case 'won':        return { variant: 'success' as const,  label: 'won' };
    case 'assigned':   return { variant: 'info' as const,     label: 'assigned' };
    case 'system':     return { variant: 'updated' as const,  label: 'system' };
  }
}

export default function NotificationsPage() {
  const { t } = useT();
  const [items, setItems] = useState<N[]>(seed);
  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((cur) => cur.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <SiteNav active="/notifications" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-4xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('notifications.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('notifications.title')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">{t('notifications.subtitle')}</p>
          </div>
          <div className="flex items-center gap-sp2">
            <Badge variant={unread > 0 ? 'hot' : 'success'} size="sm">{unread} unread</Badge>
            <Button variant="ghost" onClick={markAllRead} disabled={unread === 0}>
              {t('notifications.markAllRead')}
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Feed</CardTitle>
            <CardDescription>{items.length} evenimente în ultimele 48h.</CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-text-muted text-[13px] text-center py-sp4">
                {t('notifications.empty')}
              </p>
            ) : (
              <ul className="flex flex-col gap-sp2">
                {items.map((n) => {
                  const meta = kindMeta(n.kind);
                  return (
                    <li
                      key={n.id}
                      className={
                        'border rounded-md px-sp3 py-sp2 transition-colors ' +
                        (n.read
                          ? 'border-border bg-navy-deep'
                          : 'border-gold/30 bg-navy-hover/60')
                      }
                    >
                      <div className="flex items-start justify-between gap-sp2">
                        <div className="flex flex-col gap-sp1 min-w-0 flex-1">
                          <div className="flex items-center gap-sp2">
                            <Badge variant={meta.variant} size="xs">{meta.label}</Badge>
                            <span className="text-[13px] text-text-h font-semibold">{n.title}</span>
                            {!n.read && <span className="text-gold text-[10px] font-mono">●</span>}
                          </div>
                          <p className="text-[12px] text-text-secondary">{n.body}</p>
                        </div>
                        <time className="font-mono text-[10px] text-text-muted whitespace-nowrap">{n.ts}</time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
