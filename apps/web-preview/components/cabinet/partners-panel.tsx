'use client';

// Val 3 (AGI §18.10 · BR-32) · Registry de parteneri de cooperare. Editabil condiționat de
// canEditPartners(account): agency → team_lead/manager/admin; individual → owner.
// VISUAL SKELETON (localStorage). Vezi lib/partners-store.ts + lib/account-store.ts.

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useAccount, canEditPartners } from '@/lib/account-store';
import { usePartners, addPartner, removePartner, type PartnerScope, type PartnerKind } from '@/lib/partners-store';

const SPLITS = [40, 50, 60];

export function PartnersPanel() {
  const { t } = useT();
  const { toast } = useToast();
  const account = useAccount();
  const partners = usePartners(account.type);
  const canEdit = canEditPartners(account);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [kind, setKind] = useState<PartnerKind>('agency');
  const [scope, setScope] = useState<PartnerScope>('inter_agency');
  const [split, setSplit] = useState(50);

  function reset() {
    setName(''); setContact(''); setPhone(''); setEmail('');
    setKind('agency'); setScope('inter_agency'); setSplit(50);
    setAdding(false);
  }

  function save() {
    if (!name.trim()) return;
    addPartner(account.type, {
      name: name.trim(), contactPerson: contact.trim(), phone: phone.trim(), email: email.trim(),
      kind, scope, defaultSplitPct: split,
    });
    reset();
    toast({ variant: 'success', title: t('partners.toastAdded') });
  }

  function remove(id: string) {
    removePartner(account.type, id);
    toast({ variant: 'info', title: t('partners.toastRemoved') });
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-sp2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-sp1">
            <CardTitle>{t('partners.title')}</CardTitle>
            <InfoTooltip label={t('partners.title')} body={t('partners.help')} />
          </div>
          <CardDescription>
            {account.type === 'agency' ? t('partners.descAgency') : t('partners.descIndividual')}
          </CardDescription>
        </div>
        {canEdit ? (
          <Button variant="secondary" size="sm" onClick={() => setAdding((v) => !v)}>
            {adding ? t('common.cancel') : t('partners.addCta')}
          </Button>
        ) : (
          <Badge variant="info" size="sm">{t('partners.readOnly')}</Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        {/* Governance note — cine poate edita */}
        {!canEdit && (
          <p className="rounded-md bg-status-blue/10 border border-status-blue/30 px-sp3 py-sp2 text-[12px] text-status-blue">
            {t('partners.governanceNote')}
          </p>
        )}

        {/* Add form */}
        {canEdit && adding && (
          <div className="rounded-md border border-border bg-navy-deep/40 p-sp3 flex flex-col gap-sp2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('partners.fieldName')} className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold" />
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t('partners.fieldContact')} className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('partners.fieldPhone')} className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('partners.fieldEmail')} className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold" />
            </div>
            <div className="flex flex-wrap items-center gap-sp3">
              <div className="flex items-center gap-sp1">
                <span className="text-[11px] text-text-muted">{t('partners.fieldKind')}:</span>
                {(['agency', 'individual'] as PartnerKind[]).map((k) => (
                  <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k}
                    className={'h-7 px-sp2 rounded border text-[11px] cursor-pointer ' + (kind === k ? 'bg-gold/20 border-gold text-gold' : 'border-border bg-navy-deep text-text-secondary')}>
                    {t(`partners.kind.${k}`)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-sp1">
                <span className="text-[11px] text-text-muted">{t('partners.fieldScope')}:</span>
                {(['inter_agency', 'public_mls'] as PartnerScope[]).map((s) => (
                  <button key={s} type="button" onClick={() => setScope(s)} aria-pressed={scope === s}
                    className={'h-7 px-sp2 rounded border text-[11px] cursor-pointer ' + (scope === s ? 'bg-gold/20 border-gold text-gold' : 'border-border bg-navy-deep text-text-secondary')}>
                    {t(`partners.scope.${s}`)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-sp1">
                <span className="text-[11px] text-text-muted">{t('partners.fieldSplit')}:</span>
                {SPLITS.map((s) => (
                  <button key={s} type="button" onClick={() => setSplit(s)} aria-pressed={split === s}
                    className={'h-7 px-sp2 rounded border text-[11px] cursor-pointer ' + (split === s ? 'bg-gold/20 border-gold text-gold' : 'border-border bg-navy-deep text-text-secondary')}>
                    {s}%
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-sp2">
              <Button variant="ghost" size="sm" onClick={reset}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={save}>{t('common.save')}</Button>
            </div>
          </div>
        )}

        {/* Partner list */}
        {partners.length === 0 ? (
          <p className="text-[12px] text-text-muted">{t('partners.empty')}</p>
        ) : (
          <ul className="flex flex-col gap-sp2">
            {partners.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-sp2 border border-border rounded-md px-sp3 py-sp2">
                <div className="min-w-0">
                  <div className="flex items-center gap-sp2 flex-wrap">
                    <span className="text-[13px] text-text-h font-medium">{p.name}</span>
                    <Badge variant={p.kind === 'agency' ? 'info' : 'updated'} size="xs">{t(`partners.kind.${p.kind}`)}</Badge>
                    <Badge variant="warning" size="xs">{t(`partners.scope.${p.scope}`)}</Badge>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {p.contactPerson}{p.phone ? ` · ${p.phone}` : ''}{p.email ? ` · ${p.email}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-sp2 flex-shrink-0">
                  <span className="text-[11px] font-mono text-gold whitespace-nowrap">{t('partners.splitShort', { pct: p.defaultSplitPct })}</span>
                  {canEdit && (
                    <button type="button" onClick={() => remove(p.id)} aria-label={t('partners.remove')} className="text-[14px] text-text-muted hover:text-status-red cursor-pointer leading-none">×</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
