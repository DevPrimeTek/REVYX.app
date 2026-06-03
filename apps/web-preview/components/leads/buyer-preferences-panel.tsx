'use client';

// M0.S9 · Demand-side preferences — agent editează preferințele clientului care caută.
// Suportă DOUĂ intent-uri (Regula 20): buyer (sale) și tenant (rent). UI adaptiv la intent.

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { setBuyerPreferences, useLeadExtras } from '@/lib/lead-extras-store';
import { transactionIntent } from '@/lib/transaction-intent';
import type { Lead } from '@/lib/mock';

const BUYER_FEATURES = [
  'balcon', 'parcare', 'lift', 'încălzire autonomă', 'aproape de școală',
  'aproape de metrou', 'etaj superior', 'orientare sud', 'mobilat',
  'finisaj nou', 'curte proprie', 'liniștit', 'aproape de parc',
];
const TENANT_FEATURES = [
  'mobilat complet', 'utilități incluse', 'permite animale', 'aproape de transport',
  'aproape de universitate', 'parcare proprie', 'internet inclus',
  'aer condiționat', 'mașină de spălat', 'aproape de centru',
];

export function BuyerPreferencesPanel({ lead }: { lead: Lead }) {
  const { t } = useT();
  const { toast } = useToast();
  const extras = useLeadExtras(lead.id);

  const intent = transactionIntent(lead.leadType);
  const isRent = intent === 'rent';
  const FEATURE_POOL = isRent ? TENANT_FEATURES : BUYER_FEATURES;

  const prefs = extras.preferences ?? {
    features: lead.features ?? [],
    urgency: lead.urgency ?? 'medium',
    preferredFloor: '',
    rememberedNote: '',
  };

  const [features, setFeatures] = useState<string[]>(prefs.features);
  const [urgency, setUrgency] = useState<typeof prefs.urgency>(prefs.urgency);
  const [floor, setFloor] = useState<string>(prefs.preferredFloor);
  const [note, setNote] = useState<string>(prefs.rememberedNote);
  const [editing, setEditing] = useState(false);

  function toggle(f: string) {
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  function save(e: FormEvent) {
    e.preventDefault();
    setBuyerPreferences(lead.id, { features, urgency, preferredFloor: floor, rememberedNote: note });
    setEditing(false);
    toast({ variant: 'success', title: t('preferences.savedToast') });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-sp2">
        <div>
          <CardTitle>{t(isRent ? 'preferences.titleRent' : 'preferences.title')}</CardTitle>
          <CardDescription>{t(isRent ? 'preferences.descRent' : 'preferences.desc')}</CardDescription>
        </div>
        {!editing ? (
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            {t('preferences.editCta')}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {!editing ? (
          <dl className="flex flex-col gap-sp2 text-[13px]">
            {/* [MOLDOVA-SPECIFIC] Buget confirmat față-în-față vs declarat la telefon */}
            <div className="border border-border rounded-md px-sp2 py-sp2 bg-navy-deep/50">
              <dt className="text-text-muted text-[11px] inline-flex items-center gap-1">
                {t('preferences.confirmedBudget')}
                <InfoTooltip
                  label={t('preferences.confirmedBudget')}
                  body={t('preferences.confirmedBudgetMoldovaNote')}
                />
              </dt>
              <dd className="mt-sp1">
                {lead.confirmedBudgetMax != null ? (
                  <div className="flex items-center gap-sp2">
                    <span className="text-text-h font-semibold">
                      €{lead.confirmedBudgetMax.toLocaleString('ro-MD')}
                      {isRent ? <span className="text-text-secondary text-[11px] ml-1">/lună</span> : null}
                    </span>
                    <Badge variant="success" size="xs">{t('preferences.confirmedBudgetVerified')}</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-sp2">
                    <Badge variant="warning" size="xs">{t('preferences.confirmedBudgetUnconfirmed')}</Badge>
                    <span className="text-text-muted text-[11px]">— programează întâlnire</span>
                  </div>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted text-[11px]">{t('preferences.urgencyLabel')}</dt>
              <dd>
                <Badge
                  variant={urgency === 'high' ? 'critical' : urgency === 'medium' ? 'warning' : 'info'}
                  size="xs"
                >
                  {t(`preferences.urgency.${urgency}`)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-text-muted text-[11px]">{t('preferences.featuresLabel')}</dt>
              <dd className="flex flex-wrap gap-1 mt-sp1">
                {features.length === 0 ? (
                  <span className="text-text-muted text-[12px]">{t('preferences.featuresEmpty')}</span>
                ) : (
                  features.map((f) => (
                    <span
                      key={f}
                      className="px-sp2 py-px rounded-pill bg-navy-deep border border-border text-[11px] text-text-secondary"
                    >
                      {f}
                    </span>
                  ))
                )}
              </dd>
            </div>
            {floor && (
              <div>
                <dt className="text-text-muted text-[11px]">{t('preferences.floorLabel')}</dt>
                <dd className="text-text-h">{floor}</dd>
              </div>
            )}
            {note && (
              <div>
                <dt className="text-text-muted text-[11px]">{t('preferences.noteLabel')}</dt>
                <dd className="text-text-h italic">&ldquo;{note}&rdquo;</dd>
              </div>
            )}
          </dl>
        ) : (
          <form onSubmit={save} className="flex flex-col gap-sp3">
            <fieldset>
              <legend className="text-[12px] text-text-secondary font-medium mb-sp1">
                {t('preferences.urgencyLabel')}
              </legend>
              <div className="flex gap-sp1 flex-wrap">
                {(['low', 'medium', 'high'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    aria-pressed={urgency === u}
                    className={
                      'h-8 px-sp3 rounded-md border text-[12px] transition-all cursor-pointer ' +
                      (urgency === u
                        ? 'bg-gold/20 border-gold text-gold'
                        : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
                    }
                  >
                    {t(`preferences.urgency.${u}`)}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[12px] text-text-secondary font-medium mb-sp1">
                {t('preferences.featuresLabel')}
              </legend>
              <div className="flex gap-sp1 flex-wrap">
                {FEATURE_POOL.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggle(f)}
                    aria-pressed={features.includes(f)}
                    className={
                      'h-8 px-sp2 rounded-pill border text-[11px] transition-all cursor-pointer ' +
                      (features.includes(f)
                        ? 'bg-gold/20 border-gold text-gold'
                        : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </fieldset>
            <Input
              label={t('preferences.floorLabel')}
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="ex: etaj 3-7"
              hint={t('preferences.floorHint')}
            />
            <Input
              label={t('preferences.noteLabel')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('preferences.notePlaceholder')}
              hint={t('preferences.noteHint')}
            />
            <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.save')}</Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
