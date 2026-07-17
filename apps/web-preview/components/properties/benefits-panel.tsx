'use client';

// M0.S9 · Property benefits panel — agent editează bullet-uri „de ce să cumperi" pentru un anunț.
// Vizibile pe pagina proprietății (lead-ul seller vede ce promovează agentul pentru vânzare).

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useBenefits, useBenefitActions } from '@/lib/property-benefits-store';
import type { Property } from '@/lib/mock';

export function PropertyBenefitsPanel({ property }: { property: Property }) {
  const { t } = useT();
  const { toast } = useToast();
  const benefits = useBenefits(property.id, property.kind);
  const { set } = useBenefitActions();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(benefits);
  const [newItem, setNewItem] = useState('');

  function add(e: FormEvent) {
    e.preventDefault();
    const item = newItem.trim();
    if (!item) return;
    setDraft((d) => [...d, item]);
    setNewItem('');
  }

  function remove(idx: number) {
    setDraft((d) => d.filter((_, i) => i !== idx));
  }

  function save() {
    set(property.id, draft);
    setEditing(false);
    toast({ variant: 'success', title: t('benefits.savedToast') });
  }

  function cancelEdit() {
    setDraft(benefits);
    setEditing(false);
    setNewItem('');
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-sp2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{t('benefits.title')}</CardTitle>
          <CardDescription>{t('benefits.desc')}</CardDescription>
        </div>
        {!editing && (
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            {t('benefits.editCta')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!editing ? (
          benefits.length === 0 ? (
            <p className="text-text-muted text-[12px]">{t('benefits.empty')}</p>
          ) : (
            <ul className="flex flex-col gap-sp1">
              {benefits.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-sp2 text-[13px] text-text-h"
                >
                  <span aria-hidden className="text-gold mt-px">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )
        ) : (
          <div className="flex flex-col gap-sp3">
            <ul className="flex flex-col gap-sp1">
              {draft.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-sp2 border border-border rounded-md bg-navy-deep px-sp2 py-sp1"
                >
                  <span className="flex items-start gap-sp2 text-[13px] text-text-h min-w-0">
                    <span aria-hidden className="text-gold mt-px">✓</span>
                    <span className="truncate">{b}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-[11px] text-text-muted hover:text-status-red cursor-pointer"
                  >
                    {t('common.remove')}
                  </button>
                </li>
              ))}
              {draft.length === 0 && (
                <li className="text-text-muted text-[12px]">{t('benefits.empty')}</li>
              )}
            </ul>
            <form onSubmit={add} className="flex items-end gap-sp2">
              <Input
                label={t('benefits.addLabel')}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={t('benefits.addPlaceholder')}
                className="flex-1 min-w-0"
              />
              <Button type="submit" size="sm">
                + {t('common.add')}
              </Button>
            </form>
            <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
              <Button variant="ghost" onClick={cancelEdit}>
                {t('common.cancel')}
              </Button>
              <Button onClick={save}>{t('common.save')}</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
