'use client';

// Val 3 (AGI §18.10 MLS / Cooperation) · Publică proprietatea în rețeaua de parteneri cu
// împărțirea comisionului. Gate BR-29: publicarea necesită mandat semnat pe lead-ul vânzător.
// Se leagă de Val 2 (mandat). VISUAL SKELETON.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useCooperation, setCooperation } from '@/lib/cooperation-store';
import { useMandate, effectiveStatus } from '@/lib/mandate-store';
import { useAccount } from '@/lib/account-store';
import { usePartners } from '@/lib/partners-store';
import { leads } from '@/lib/mock';
import type { Property } from '@/lib/mock';

const SPLITS = [40, 50, 60];

export function CooperationPanel({ property }: { property: Property }) {
  const { t } = useT();
  const { toast } = useToast();
  const coop = useCooperation(property.id);
  const account = useAccount();
  const partners = usePartners(account.type);

  // BR-29: mandatul e pe lead-ul vânzător legat de proprietate.
  const sellerLead = leads.find((l) => l.sellingPropertyId === property.id) ?? null;
  const mandate = useMandate(sellerLead?.id ?? '__none__');
  // Gate: dacă există lead vânzător legat, cerem mandat semnat; altfel (demo, fără lead legat) permitem.
  const mandateSigned = sellerLead ? effectiveStatus(mandate) === 'signed' : true;

  // Comisionul partener estimat (din comisionul listării).
  const baseCommission = property.commissionPct != null ? Math.round((property.priceEur * property.commissionPct) / 100) : null;
  const partnerShare = baseCommission != null ? Math.round((baseCommission * coop.splitPct) / 100) : null;

  function patch(p: Partial<typeof coop>) {
    setCooperation(property.id, { ...coop, ...p });
  }

  function publish() {
    patch({ published: true });
    toast({ variant: 'success', title: t('cooperation.toastPublished'), description: t('cooperation.toastPublishedDesc', { pct: coop.splitPct }) });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-sp2">
        <div>
          <div className="flex items-center gap-sp1">
            <CardTitle>{t('cooperation.title')}</CardTitle>
            <InfoTooltip label={t('cooperation.title')} body={t('cooperation.help')} />
          </div>
          <CardDescription>{t('cooperation.desc')}</CardDescription>
        </div>
        <Badge variant={coop.published ? 'success' : 'updated'} size="sm">
          {t(coop.published ? 'cooperation.published' : 'cooperation.notPublished')}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        {/* Gate BR-29 — mandat necesar */}
        {!mandateSigned ? (
          <div className="rounded-md bg-status-amber/10 border border-status-amber/30 px-sp3 py-sp2 text-[12px] text-status-amber">
            {t('cooperation.mandateGate')}
          </div>
        ) : !coop.published ? (
          <>
            {/* BR-32: selectare parteneri din registry-ul rezolvat după contul curent */}
            <div>
              <div className="flex items-center justify-between gap-sp2 mb-sp1">
                <p className="text-[11px] text-text-muted">{t('cooperation.partnersLabel')}</p>
                <a href={account.type === 'agency' ? '/cabinet/agency' : '/cabinet/agent'} className="text-[11px] text-gold hover:text-gold-dark">
                  {t('cooperation.managePartners')} →
                </a>
              </div>
              {partners.length === 0 ? (
                <p className="text-[12px] text-text-muted rounded-md border border-border bg-navy-deep/40 px-sp2 py-sp2">
                  {t('cooperation.noPartners')}
                </p>
              ) : (
                <div className="flex flex-col gap-sp1">
                  {partners.map((p) => {
                    const selected = (coop.partnerIds ?? []).includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-sp2 text-[12px] text-text-h cursor-pointer rounded-md border border-border bg-navy-deep/40 px-sp2 py-1.5">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const cur = coop.partnerIds ?? [];
                            patch({ partnerIds: e.target.checked ? [...cur, p.id] : cur.filter((x) => x !== p.id) });
                          }}
                          className="accent-gold"
                        />
                        <span className="flex-1">{p.name}</span>
                        <Badge variant="warning" size="xs">{t(`partners.scope.${p.scope}`)}</Badge>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <p className="text-[11px] text-text-muted mb-sp1">{t('cooperation.splitLabel')}</p>
              <div className="flex gap-sp1 flex-wrap items-center">
                {SPLITS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => patch({ splitPct: s })}
                    aria-pressed={coop.splitPct === s}
                    className={
                      'h-9 px-sp3 rounded-md border text-[12px] transition-all cursor-pointer ' +
                      (coop.splitPct === s ? 'bg-gold/20 border-gold text-gold' : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
                    }
                  >
                    {s}%
                  </button>
                ))}
                {partnerShare != null && (
                  <span className="text-[12px] text-text-secondary ml-sp2">
                    {t('cooperation.partnerShare', { amount: partnerShare.toLocaleString('ro-MD') })}
                  </span>
                )}
              </div>
            </div>
            <label className="flex items-center gap-sp2 text-[12px] text-text-h cursor-pointer">
              <input type="checkbox" checked={coop.openHouse} onChange={(e) => patch({ openHouse: e.target.checked })} className="accent-gold" />
              {t('cooperation.openHouse')}
              <InfoTooltip label={t('cooperation.openHouse')} body={t('cooperation.openHouseHelp')} />
            </label>
            <div>
              <Button onClick={publish} disabled={(coop.partnerIds ?? []).length === 0}>{t('cooperation.publishCta')}</Button>
              {(coop.partnerIds ?? []).length === 0 && (
                <p className="text-[11px] text-text-muted mt-sp1">{t('cooperation.selectPartnerHint')}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-sp3 text-[13px]">
              <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
                <dt className="text-[11px] text-text-muted">{t('cooperation.splitLabel')}</dt>
                <dd className="text-text-h">{coop.splitPct}%</dd>
              </div>
              <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
                <dt className="text-[11px] text-text-muted">{t('cooperation.partnerShareLabel')}</dt>
                <dd className="text-text-h">{partnerShare != null ? `€${partnerShare.toLocaleString('ro-MD')}` : '—'}</dd>
              </div>
              <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
                <dt className="text-[11px] text-text-muted">{t('cooperation.openHouse')}</dt>
                <dd className="text-text-h">{coop.openHouse ? t('common.yes') : t('common.no')}</dd>
              </div>
            </dl>
            {(coop.partnerIds ?? []).length > 0 && (
              <div className="flex flex-wrap items-center gap-sp1">
                <span className="text-[11px] text-text-muted">{t('cooperation.partnersLabel')}:</span>
                {partners.filter((p) => (coop.partnerIds ?? []).includes(p.id)).map((p) => (
                  <Badge key={p.id} variant="info" size="xs">{p.name}</Badge>
                ))}
              </div>
            )}
            <p className="text-[12px] text-text-secondary">{t('cooperation.engagedNote', { n: 2 + (property.daysOnMarket % 4) })}</p>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => { patch({ published: false }); toast({ variant: 'info', title: t('cooperation.toastWithdrawn') }); }}>
                {t('cooperation.withdrawCta')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
