'use client';

// [MOLDOVA-SPECIFIC] Panel evoluție preferințe — ~90% din clienții RM modifică preferințele
// după primele vizionări. Agentul poate adăuga manual intrări; seed-ul vine din mock Lead.

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { addPreferenceHistoryEntry, useLeadExtras } from '@/lib/lead-extras-store';
import type { PreferenceSnapshot } from '@/lib/mock/types';
import type { PreferenceHistoryEntry } from '@/lib/lead-extras-store';

type AnyEntry = (PreferenceSnapshot & { _type: 'seed' }) | (PreferenceHistoryEntry & { _type: 'extra' });

export function PreferenceHistoryPanel({
  lead,
}: {
  lead: { id: string; budgetMax: number; zone: string; rooms: string; preferenceHistory: PreferenceSnapshot[] };
}) {
  const { t } = useT();
  const { toast } = useToast();
  const extras = useLeadExtras(lead.id);

  const [adding, setAdding] = useState(false);
  const [budgetMax, setBudgetMax] = useState<string>(String(lead.budgetMax));
  const [zone, setZone] = useState<string>(lead.zone);
  const [rooms, setRooms] = useState<string>(lead.rooms);
  const [note, setNote] = useState<string>('');

  // Combine seed history + extra history, sorted by date desc
  const allEntries: AnyEntry[] = [
    ...(extras.preferenceHistory ?? []).map((e) => ({ ...e, _type: 'extra' as const })),
    ...lead.preferenceHistory.map((s) => ({ ...s, _type: 'seed' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    addPreferenceHistoryEntry(lead.id, {
      date: new Date().toISOString().slice(0, 10),
      budgetMax: Number(budgetMax) || lead.budgetMax,
      zone: zone || lead.zone,
      rooms: rooms || lead.rooms,
      changeNote: note.trim(),
    });
    toast({ variant: 'success', title: t('leadDetail.preferenceHistoryAdded') });
    setNote('');
    setAdding(false);
  }

  const totalCount = allEntries.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-sp2">
        <div>
          <CardTitle className="flex items-center gap-sp2">
            {t('leadDetail.preferenceHistory')}
            {totalCount > 0 && (
              <span className="text-[11px] font-normal text-text-muted bg-navy-deep border border-border px-sp2 py-px rounded-pill">
                {t('leadDetail.preferenceHistoryCount', { n: totalCount })}
              </span>
            )}
            <InfoTooltip
              label={t('leadDetail.preferenceHistory')}
              body={t('leadDetail.preferenceHistoryMoldovaNote')}
            />
          </CardTitle>
          <CardDescription>{t('leadDetail.preferenceHistoryDesc')}</CardDescription>
        </div>
        {!adding && (
          <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
            + {t('leadDetail.preferenceHistoryAdd')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">

        {/* Formular adăugare */}
        {adding && (
          <form onSubmit={handleAdd} className="flex flex-col gap-sp2 p-sp3 rounded-md border border-gold/30 bg-gold/5">
            <p className="text-[12px] text-gold font-medium">{t('leadDetail.preferenceHistoryNewEntry')}</p>
            <div className="grid grid-cols-2 gap-sp2">
              <Input
                label={t('preferences.budgetMaxLabel')}
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="ex: 65000"
              />
              <Input
                label={t('preferences.zoneLabel')}
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="ex: Botanica"
              />
            </div>
            <Input
              label={t('preferences.roomsLabel')}
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              placeholder="ex: 2, 3+"
            />
            <Input
              label={t('leadDetail.preferenceHistoryNoteLabel')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('leadDetail.preferenceHistoryNotePlaceholder')}
              hint={t('leadDetail.preferenceHistoryNoteHint')}
              required
            />
            <div className="flex items-center justify-end gap-sp2 pt-sp1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" size="sm">{t('common.save')}</Button>
            </div>
          </form>
        )}

        {/* Timeline */}
        {allEntries.length === 0 ? (
          <p className="text-text-muted text-[13px]">{t('leadDetail.preferenceHistoryEmpty')}</p>
        ) : (
          <ol className="flex flex-col gap-0">
            {allEntries.map((entry, idx) => (
              <li key={'id' in entry ? entry.id : `${entry.date}-${idx}`} className="flex gap-sp2">
                {/* timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${entry._type === 'extra' ? 'bg-gold' : 'bg-border-light'}`} />
                  {idx < allEntries.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="pb-sp3 flex-1 min-w-0">
                  <p className="text-[11px] text-text-muted font-mono">{entry.date}</p>
                  <p className="text-[13px] text-text-h mt-px">{entry.changeNote}</p>
                  <p className="text-[11px] text-text-secondary mt-px">
                    €{entry.budgetMax.toLocaleString('ro-MD')} · {entry.zone} · {entry.rooms} {t('property.rooms')}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
