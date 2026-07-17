'use client';

// Val 1 (AGI §18.9 Buyer Needs Assessment + §17.1 buget + §17.3 pre-aprobare) ·
// Panou structurat de calificare a cererii (buyer/tenant). Cuvinte de BUGET explicite.
// Redesign M0.S9.1: layout simetric (grid 2 coloane), stil de secțiune consistent,
// toate câmpurile editabile, criterii ca listă cu buton „+ Adaugă".
// VISUAL SKELETON — persistă în buyer-assessment-store (localStorage). Structura avansată
// (datorie urmărită, M1.S3): entitate `buyer_assessments` + completeness GENERATED + match wire.

import { useState, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

/** Etichetă de secțiune — stil unic, consistent în tot panoul. */
function SectionLabel({ children }: { children: ReactNode }) {
  return <h3 className="text-[11px] uppercase tracking-wide text-text-muted mb-sp1">{children}</h3>;
}

/** Listă editabilă cu buton „+ Adaugă" + chip-uri removable. */
function ListEditor({
  items,
  onChange,
  placeholder,
  addLabel,
  emptyLabel,
  tone,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  addLabel: string;
  emptyLabel: string;
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
    <div className="flex flex-col gap-sp2">
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
          className="flex-1 min-w-0 h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold"
        />
        <button
          type="button"
          onClick={add}
          className="flex-shrink-0 h-9 px-sp3 rounded-md border border-gold/40 text-gold text-[12px] hover:bg-gold/10 cursor-pointer transition-colors duration-fast"
        >
          + {addLabel}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-[11px] text-text-muted italic">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-wrap gap-1">
          {items.map((it) => (
            <li key={it} className={`inline-flex items-center gap-1 px-sp2 py-1 rounded-pill border text-[11px] ${chipClass}`}>
              {it}
              <button type="button" onClick={() => onChange(items.filter((x) => x !== it))} className="cursor-pointer hover:opacity-70 text-[13px] leading-none" aria-label="remove">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BuyerNeedsPanel({ lead }: { lead: Lead }) {
  const { t } = useT();
  const a = useBuyerAssessment(lead.id);
  const isRent = transactionIntent(lead.leadType) === 'rent';
  const unit = isRent ? ` ${t('needs.perMonth')}` : '';

  function patch(p: Partial<BuyerAssessment>) {
    setBuyerAssessment(lead.id, { ...a, ...p });
  }

  const declared = lead.budgetMax;
  const confirmed = a.confirmedBudget ?? lead.confirmedBudgetMax;
  const budgetGap = confirmed != null && confirmed < declared * 0.85;
  const completeness = Math.round(assessmentCompleteness(a) * 100);

  const fieldBox = 'rounded-md border border-border bg-navy-deep/40 p-sp2';
  const fieldLabel = 'text-[11px] text-text-muted block mb-0.5';

  return (
    <Card>
      <CardHeader className="flex flex-col gap-sp2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{t('needs.title')}</CardTitle>
          <CardDescription>{t('needs.desc')}</CardDescription>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[11px] text-text-muted block">{t('needs.completeness')}</span>
          <span className="text-[18px] font-display text-gold leading-none">{completeness}%</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        {/* ===== BUGET (cuvinte esențiale, stil consistent) ===== */}
        <section>
          <SectionLabel>{t('needs.budgetSection')}</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp2">
            <div className={fieldBox}>
              <span className={fieldLabel}>{t('needs.budgetDeclared')}</span>
              <p className="text-[16px] text-text-h font-semibold">€{declared.toLocaleString('ro-MD')}{unit}</p>
              <p className="text-[10px] text-text-muted mt-sp1">{t('needs.budgetDeclaredHint')}</p>
            </div>
            <div className={fieldBox}>
              <label className={fieldLabel} htmlFor={`cb-${lead.id}`}>{t('needs.budgetConfirmed')}</label>
              <div className="flex items-baseline gap-1">
                <span className="text-text-muted text-[14px]">€</span>
                <input
                  id={`cb-${lead.id}`}
                  type="number"
                  inputMode="numeric"
                  value={a.confirmedBudget ?? ''}
                  onChange={(e) => patch({ confirmedBudget: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder={t('needs.budgetConfirmedEdit')}
                  className="flex-1 min-w-0 h-8 bg-transparent border-b border-border text-[16px] text-text-h font-semibold focus-visible:outline-none focus-visible:border-gold"
                />
              </div>
              <p className="text-[10px] text-text-muted mt-sp1">{t('needs.budgetConfirmedHint')}</p>
            </div>
          </div>
          <p className="text-[11px] text-text-secondary mt-sp2">{t('needs.budgetSectionHelp')}</p>
          {budgetGap && (
            <div className="mt-sp2 rounded-md bg-status-amber/10 border border-status-amber/30 px-sp2 py-sp1 text-[11px] text-status-amber">
              {t('needs.budgetGapWarning')}
            </div>
          )}
        </section>

        {/* ===== PREGĂTIRE FINANCIARĂ + POSESIE (grid simetric) ===== */}
        <section>
          <SectionLabel>{t('needs.financeSection')}</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp2">
            <div className={fieldBox}>
              <span className={fieldLabel}>{t('needs.bankLabel')}</span>
              <div className="flex gap-sp1 flex-wrap">
                {BANK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => patch({ bankPreapproval: opt })}
                    aria-pressed={a.bankPreapproval === opt}
                    className={
                      'h-8 px-sp2 rounded-md border text-[11px] transition-all cursor-pointer ' +
                      (a.bankPreapproval === opt ? 'bg-gold/20 border-gold text-gold' : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
                    }
                  >
                    {t(`needs.bank.${opt}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className={fieldBox}>
              <span className={fieldLabel}>{t('needs.possessionSection')}</span>
              <input
                type="date"
                value={a.possessionDate}
                onChange={(e) => patch({ possessionDate: e.target.value })}
                className="h-8 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold"
              />
              <p className="text-[10px] text-text-muted mt-sp1">{t('needs.possessionHint')}</p>
            </div>
          </div>
          <label className="flex items-center gap-sp2 text-[12px] text-text-h cursor-pointer mt-sp2">
            <input type="checkbox" checked={a.mustSellFirst} onChange={(e) => patch({ mustSellFirst: e.target.checked })} className="accent-gold" />
            {t('needs.mustSellFirst')}
          </label>
        </section>

        {/* ===== CRITERII (liste editabile, simetrice) ===== */}
        <section>
          <SectionLabel>{t('needs.criteriaSection')}</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp2">
            <div className={fieldBox}>
              <span className="text-[11px] text-status-red block mb-sp2">{t('needs.dealBreakers')}</span>
              <ListEditor
                items={a.dealBreakers}
                onChange={(next) => patch({ dealBreakers: next })}
                placeholder={t('needs.dealBreakersPlaceholder')}
                addLabel={t('needs.addCta')}
                emptyLabel={t('needs.dealBreakersEmpty')}
                tone="breaker"
              />
            </div>
            <div className={fieldBox}>
              <span className="text-[11px] text-status-green block mb-sp2">{t('needs.compromiseAreas')}</span>
              <ListEditor
                items={a.compromiseAreas}
                onChange={(next) => patch({ compromiseAreas: next })}
                placeholder={t('needs.compromisePlaceholder')}
                addLabel={t('needs.addCta')}
                emptyLabel={t('needs.compromiseEmpty')}
                tone="compromise"
              />
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
