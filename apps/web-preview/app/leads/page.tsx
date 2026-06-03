'use client';

// M0.S6 · Lead list with column info tooltips + friendly filter UI · 🌐 Web only

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { LeadPriorityBadge } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { leads } from '@/lib/mock';
import type { LeadStatus } from '@/lib/mock';
import { transactionIntent, isDemandSide } from '@/lib/transaction-intent';
import { useWorkspaceDirection, isIntentVisible } from '@/lib/workspace-store';
import { cn } from '@/lib/utils';

type Filter = 'all' | LeadStatus;
const filters: Filter[] = ['all', 'HOT', 'qualified', 'warm', 'nurturing'];
const filterHelpKey: Record<LeadStatus | 'all', string> = {
  all: 'lead.filters.all',
  HOT: 'lead.filters.urgentHelp',
  qualified: 'lead.filters.qualifiedHelp',
  warm: 'lead.filters.warmHelp',
  nurturing: 'lead.filters.nurturingHelp',
};

export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsPageInner />
    </Suspense>
  );
}

// Regula 20: 4 tipuri lead + 'all'. Hybrid (4 enum flat) + helper transactionIntent.
// UI grupează vizual pe intent: Vânzare (buyer+seller) vs Închiriere (tenant+landlord).
type TypeFilter = 'all' | 'buyer' | 'seller' | 'tenant' | 'landlord';

function leadTypeBadgeVariant(t: 'buyer' | 'seller' | 'tenant' | 'landlord'): 'info' | 'updated' | 'success' | 'warning' {
  if (t === 'buyer') return 'info';
  if (t === 'tenant') return 'success';
  if (t === 'seller') return 'updated';
  return 'warning'; // landlord
}

function LeadsPageInner() {
  const { t } = useT();
  const params = useSearchParams();
  const direction = useWorkspaceDirection();
  const [filter, setFilter] = useState<Filter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [query, setQuery] = useState('');

  // Allow deep links like /leads?priority=urgent (from dashboard hot-leads card).
  useEffect(() => {
    const p = params.get('priority');
    if (p === 'urgent') setFilter('HOT');
    else if (p === 'qualified') setFilter('qualified');
    else if (p === 'warm') setFilter('warm');
    else if (p === 'nurturing') setFilter('nurturing');

    const ty = params.get('type');
    if (ty === 'buyer' || ty === 'seller' || ty === 'tenant' || ty === 'landlord') setTypeFilter(ty);
  }, [params]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      // Regula 20/21: workspace direction ascunde lead-urile care nu corespund direcției.
      if (!isIntentVisible(direction, transactionIntent(l.leadType))) return false;
      if (filter !== 'all' && l.status !== filter) return false;
      if (typeFilter !== 'all' && l.leadType !== typeFilter) return false;
      if (q && !(l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filter, typeFilter, query, direction]);

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
                {/* Lead type filter (Regula 20: grupare vizuală pe transactionIntent — Vânzare vs Închiriere) */}
                <div
                  role="tablist"
                  aria-label={t('lead.typeFilterLabel')}
                  className="flex items-center gap-sp1 flex-wrap"
                >
                  <button
                    role="tab"
                    type="button"
                    aria-selected={typeFilter === 'all'}
                    onClick={() => setTypeFilter('all')}
                    className={cn(
                      'h-9 px-sp3 rounded-md border text-[12px] transition-colors duration-fast',
                      typeFilter === 'all'
                        ? 'bg-gold text-navy-deep border-gold font-semibold'
                        : 'border-border bg-navy-deep text-text-secondary hover:bg-navy-hover hover:text-text-h',
                    )}
                  >
                    {t('common.all')}
                  </button>
                  {/* Grup Vânzare: buyer + seller (ascuns când direcția workspace e rent) */}
                  {isIntentVisible(direction, 'sale') && (
                  <div className="inline-flex items-center gap-sp1 rounded-md border border-border-light p-1 bg-navy-deep">
                    <span className="label-mono text-[10px] text-text-muted px-sp1 select-none">
                      {t('transactionIntent.sale')}
                    </span>
                    {(['buyer', 'seller'] as const).map((tf) => (
                      <button
                        key={tf}
                        role="tab"
                        type="button"
                        aria-selected={typeFilter === tf}
                        onClick={() => setTypeFilter(tf)}
                        className={cn(
                          'px-sp3 py-1 text-[12px] rounded transition-colors duration-fast',
                          typeFilter === tf
                            ? 'bg-gold/10 text-gold'
                            : 'text-text-secondary hover:bg-navy-hover hover:text-text-h',
                        )}
                      >
                        {t(`leadType.${tf}`)}
                      </button>
                    ))}
                  </div>
                  )}
                  {/* Grup Închiriere: tenant + landlord (ascuns când direcția workspace e sale) */}
                  {isIntentVisible(direction, 'rent') && (
                  <div className="inline-flex items-center gap-sp1 rounded-md border border-border-light p-1 bg-navy-deep">
                    <span className="label-mono text-[10px] text-text-muted px-sp1 select-none">
                      {t('transactionIntent.rent')}
                    </span>
                    {(['tenant', 'landlord'] as const).map((tf) => (
                      <button
                        key={tf}
                        role="tab"
                        type="button"
                        aria-selected={typeFilter === tf}
                        onClick={() => setTypeFilter(tf)}
                        className={cn(
                          'px-sp3 py-1 text-[12px] rounded transition-colors duration-fast',
                          typeFilter === tf
                            ? 'bg-gold/10 text-gold'
                            : 'text-text-secondary hover:bg-navy-hover hover:text-text-h',
                        )}
                      >
                        {t(`leadType.${tf}`)}
                      </button>
                    ))}
                  </div>
                  )}
                </div>
                <div
                  role="tablist"
                  aria-label={t('common.filter')}
                  className="flex items-center gap-1 rounded-md border border-border-light p-1 bg-navy-deep"
                >
                  {filters.map((f) => {
                    const isAll = f === 'all';
                    const selected = filter === f;
                    return (
                      <button
                        key={f}
                        role="tab"
                        type="button"
                        aria-selected={selected}
                        onClick={() => setFilter(f)}
                        className={cn(
                          'px-sp3 py-1 text-[12px] rounded transition-colors duration-fast',
                          selected
                            ? isAll
                              ? 'bg-gold text-navy-deep font-semibold'
                              : 'bg-gold/10 text-gold'
                            : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
                        )}
                      >
                        {isAll ? t('lead.filters.all') : t(`lead.status.${f}`)}
                      </button>
                    );
                  })}
                  <InfoTooltip
                    label={t('common.filter')}
                    body={`${t('lead.filters.urgentHelp')} · ${t('lead.filters.qualifiedHelp')} · ${t('lead.filters.warmHelp')} · ${t('lead.filters.nurturingHelp')}`}
                    className="ml-sp1"
                  />
                </div>
              </div>
            </div>
            {filter !== 'all' && (
              <p className="text-[12px] text-text-muted mt-sp2">
                {t(filterHelpKey[filter])}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="max-h-[640px] overflow-auto">
              <Table>
                <THead>
                  <TR>
                    {(['id', 'name', 'source', 'zone', 'sla', 'priority', 'status'] as const).map((col) => (
                      <TH key={col}>
                        <span className="inline-flex items-center gap-sp1">
                          {t(`lead.tableHeader.${col}`)}
                          <InfoTooltip
                            label={t(`lead.tableHeader.${col}`)}
                            body={t(`lead.tableHelp.${col}`)}
                          />
                        </span>
                      </TH>
                    ))}
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
                        <Badge
                          variant={leadTypeBadgeVariant(l.leadType)}
                          size="xs"
                          className="ml-sp2"
                        >
                          {t(`leadType.${l.leadType}`)}
                        </Badge>
                        {/* [MOLDOVA-SPECIFIC] indicatori vizibili în listing */}
                        {isDemandSide(l.leadType) && (l.confirmedBudgetMax != null || l.preferenceHistory.length > 0) && (
                          <span className="flex items-center gap-1 mt-0.5">
                            {l.confirmedBudgetMax != null && (
                              <span className="text-[10px] text-green-400 font-medium leading-none">
                                ✓ {t('preferences.confirmedBudgetVerified')}
                              </span>
                            )}
                            {l.preferenceHistory.length > 0 && (
                              <span className="text-[10px] text-text-muted leading-none">
                                {t('leadDetail.preferenceHistoryCount', { n: l.preferenceHistory.length })}
                              </span>
                            )}
                          </span>
                        )}
                      </TD>
                      <TD className="text-text-secondary">{l.source}</TD>
                      <TD className="text-text-secondary text-[12px]">{l.zone}</TD>
                      <TD className="font-mono text-[12px]">{l.sla}</TD>
                      <TD><LeadPriorityBadge ls={l.ls} t={t} size="xs" /></TD>
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
