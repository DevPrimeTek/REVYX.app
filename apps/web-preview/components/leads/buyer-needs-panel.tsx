'use client';

// Val 1 (AGI §18.9 Buyer Needs Assessment + §17.1 buget + §17.3 pre-aprobare) ·
// Panou structurat de calificare a cererii (buyer/tenant). Cuvinte de BUGET explicite,
// fără ambiguitate (cerință PM): toți participanții văd clar că se discută despre bani.
// VISUAL SKELETON — persistă în buyer-assessment-store (localStorage). Structura avansată
// (datorie urmărită, M1.S3): entitate `buyer_assessments` + completeness GENERATED + match wire.

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import {
  useBuyerAssessment,
  setBuyerAssessment,
  assessmentCompleteness,
  type BankPreapproval,
  type BuyerAssessment,
} from '@/lib/buyer-assessment-store';
import { transactionIntent } from '@/lib/transaction-intent';
import type { Lead } from '@/lib/mock';

const BANK_OPTIONS: BankPreapproval[] = ['none', 'in_progress', 'approved'];

function ChipEditor({
  items,
  onChange,
  placeholder,
  tone,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  tone: 'breaker' | 'compromise';
}) {
  const [draft, setDraft] = useState('');
  const chipClass =
    tone === 'breaker'
      ? 'bg-status-red/10 border-status-red/30 text-status-red'
      : 'bg-status-green/10 border-status-green/30 text-status-green';
  function add() {
    const v = draft.trim();
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
    setDraft('');
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-sp1">
        {items.map((it) => (
          <span key={it} className={`inline-flex items-center gap-1 px-sp2 py-px rounded-pill border text-[11px] ${chipClass}`}>
            {it}
            <button type="button" onClick={() => onChange(items.filter((x) => x !== it))} className="cursor-pointer hover:opacity-70" aria-label="remove">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-sp1">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 h-8 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold"
        />
      </div>
    </div>
  );
}

export function BuyerNeedsPanel({ lead }: { lead: Lead }) {
  const { t } = useT();
  const a = useBuyerAssessment(lead.id);
  const isRent = transactionIntent(lead.leadType) === 'rent';
  const perMonth = isRent ? ` ${t('needs.perMonth')}` : '';

  function patch(p: Partial<BuyerAssessment>) {
    setBuyerAssessment(lead.id, { ...a, ...p });
  }

  const declared = lead.budgetMax;
  const confirmed = lead.confirmedBudgetMax;
  // §17.1 — gap declarat vs confirmat. RM: divergență tipică 15-25%.
  const budgetGap = confirmed != null && confirmed < declared * 0.85;
  const completeness = Math.round(assessmentCompleteness(a) * 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-sp2">
        <div>
          <CardTitle>{t('needs.title')}</CardTitle>
          <CardDescription>{t('needs.desc')}</CardDescription>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[11px] text-text-muted block">{t('needs.completeness')}</span>
          <span className="text-[15px] font-display text-gold">{completeness}%</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp4">

        {/* ===== BUGET (cuvinte esențiale, fără ambiguitate) ===== */}
        <section className="rounded-md border border-border bg-navy-deep/40 p-sp3">
          <h3 className="text-[12px] uppercase tracking-wide text-gold mb-sp2 flex items-center gap-1">
            {t('needs.budgetSection')}
            <InfoTooltip label={t('needs.budgetSection')} body={t('needs.budgetSectionHelp')} />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp3">
            <div>
              <p className="text-[11px] text-text-muted">{t('needs.budgetDeclared')}</p>
              <p className="text-[15px] text-text-h font-semibold">€{declared.toLocaleString('ro-MD')}{perMonth}</p>
              <p className="text-[10px] text-text-muted">{t('needs.budgetDeclaredHint')}</p>
            </div>
            <div>
              <p className="text-[11px] text-text-muted">{t('needs.budgetConfirmed')}</p>
              {confirmed != null ? (
                <p className="text-[15px] text-text-h font-semibold">€{confirmed.toLocaleString('ro-MD')}{perMonth}</p>
              ) : (
                <Badge variant="warning" size="xs">{t('needs.budgetUnconfirmed')}</Badge>
              )}
              <p className="text-[10px] text-text-muted">{t('needs.budgetConfirmedHint')}</p>
            </div>
          </div>
          {budgetGap && (
            <div className="mt-sp2 rounded-md bg-status-amber/10 border border-status-amber/30 px-sp2 py-sp1 text-[11px] text-status-amber">
              {t('needs.budgetGapWarning')}
            </div>
          )}
        </section>

        {/* ===== PREGĂTIRE FINANCIARĂ ===== */}
        <section>
          <h3 className="text-[12px] uppercase tracking-wide text-text-muted mb-sp2">{t('needs.financeSection')}</h3>
          <p className="text-[11px] text-text-secondary mb-sp1">{t('needs.bankLabel')}</p>
          <div className="flex gap-sp1 flex-wrap mb-sp2">
            {BANK_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => patch({ bankPreapproval: opt })}
                aria-pressed={a.bankPreapproval === opt}
                className={
                  'h-8 px-sp3 rounded-md border text-[12px] transition-all cursor-pointer ' +
                  (a.bankPreapproval === opt ? 'bg-gold/20 border-gold text-gold' : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
                }
              >
                {t(`needs.bank.${opt}`)}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-sp2 text-[12px] text-text-h cursor-pointer">
            <input type="checkbox" checked={a.mustSellFirst} onChange={(e) => patch({ mustSellFirst: e.target.checked })} className="accent-gold" />
            {t('needs.mustSellFirst')}
            <InfoTooltip label={t('needs.mustSellFirst')} body={t('needs.mustSellFirstHelp')} />
          </label>
        </section>

        {/* ===== POSESIE ===== */}
        <section>
          <h3 className="text-[12px] uppercase tracking-wide text-text-muted mb-sp2">{t('needs.possessionSection')}</h3>
          <label className="text-[11px] text-text-secondary block mb-sp1">{t('needs.possessionDate')}</label>
          <input
            type="date"
            value={a.possessionDate}
            onChange={(e) => patch({ possessionDate: e.target.value })}
            className="h-8 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold"
          />
        </section>

        {/* ===== CRITERII (necompromisabil vs flexibil) ===== */}
        <section>
          <h3 className="text-[12px] uppercase tracking-wide text-text-muted mb-sp2">{t('needs.criteriaSection')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp3">
            <div>
              <p className="text-[11px] text-status-red mb-sp1">{t('needs.dealBreakers')}</p>
              <ChipEditor items={a.dealBreakers} onChange={(next) => patch({ dealBreakers: next })} placeholder={t('needs.dealBreakersPlaceholder')} tone="breaker" />
            </div>
            <div>
              <p className="text-[11px] text-status-green mb-sp1">{t('needs.compromiseAreas')}</p>
              <ChipEditor items={a.compromiseAreas} onChange={(next) => patch({ compromiseAreas: next })} placeholder={t('needs.compromisePlaceholder')} tone="compromise" />
            </div>
          </div>
        </section>

      </CardContent>
    </Card>
  );
}
