'use client';

// M0.S3 · T-M0.S3-04 · Lead queue wired to 100 mock leads · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-04 + T-M0.S3-06

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { LeadScoreBadge } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { leads } from '@/lib/mock';
import type { LeadStatus } from '@/lib/mock';

type Filter = 'all' | LeadStatus;
const filters: Filter[] = ['all', 'HOT', 'qualified', 'warm', 'nurturing'];

export default function LeadsPage() {
  const { t } = useT();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== 'all' && l.status !== filter) return false;
      if (q && !(l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filter, query]);

  return (
    <>
      <SiteNav active="/leads" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('lead.module')}</p>
          <h1 className="text-[28px] mt-sp1">{t('lead.queueTitle')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('lead.queueSubtitle')}</p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-sp3 flex-wrap">
              <div>
                <CardTitle>{t('lead.countTemplate', { count: filtered.length })}</CardTitle>
                <CardDescription>{t('lead.slaCaption')}</CardDescription>
              </div>
              <div className="flex items-center gap-sp2 flex-wrap">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('common.search')}
                  aria-label={t('common.search')}
                  className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h placeholder:text-text-muted focus-visible:outline-none focus-visible:border-gold"
                />
                <div
                  role="tablist"
                  aria-label={t('common.filter')}
                  className="flex items-center gap-1 rounded-md border border-border p-1 bg-navy-deep"
                >
                  {filters.map((f) => (
                    <button
                      key={f}
                      role="tab"
                      type="button"
                      aria-selected={filter === f}
                      onClick={() => setFilter(f)}
                      className={
                        'px-sp2 py-1 text-[11px] rounded font-mono uppercase tracking-wider transition-colors duration-fast ' +
                        (filter === f
                          ? 'bg-gold/10 text-gold'
                          : 'text-text-secondary hover:bg-navy-hover hover:text-text-h')
                      }
                    >
                      {f === 'all' ? t('common.all') : t(`lead.status.${f}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[640px] overflow-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>{t('lead.tableHeader.id')}</TH>
                    <TH>{t('lead.tableHeader.name')}</TH>
                    <TH>{t('lead.tableHeader.source')}</TH>
                    <TH>{t('lead.tableHeader.zone')}</TH>
                    <TH>{t('lead.tableHeader.sla')}</TH>
                    <TH>{t('lead.tableHeader.ls')}</TH>
                    <TH>{t('lead.tableHeader.status')}</TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((l) => (
                    <TR key={l.id}>
                      <TD className="font-mono text-text-secondary">{l.id}</TD>
                      <TD>
                        <Link
                          href={`/leads/${l.id}`}
                          className="text-text-h hover:text-gold underline-offset-4 hover:underline"
                        >
                          {l.name}
                        </Link>
                      </TD>
                      <TD className="text-text-secondary">{l.source}</TD>
                      <TD className="text-text-secondary text-[12px]">{l.zone}</TD>
                      <TD className="font-mono">{l.sla}</TD>
                      <TD><LeadScoreBadge ls={l.ls} /></TD>
                      <TD>
                        {l.status === 'nurturing' ? (
                          <span className="text-text-muted text-[12px]">{t('lead.status.nurturing')}</span>
                        ) : (
                          <Badge
                            variant={l.status === 'HOT' ? 'hot' : l.status === 'qualified' ? 'qualified' : 'warm'}
                            size="xs"
                          >
                            {t(`lead.status.${l.status}`)}
                          </Badge>
                        )}
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
