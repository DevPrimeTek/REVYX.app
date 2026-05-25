'use client';

// M0.S7 · Lead notes panel — free-text notes per lead, persisted in localStorage.

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { addNote, removeNote, useLeadExtras } from '@/lib/lead-extras-store';

function formatWhen(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(locale === 'ru' ? 'ru-RU' : 'ro-RO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function NotesPanel({ leadId, authorName }: { leadId: string; authorName: string }) {
  const { t, locale } = useT();
  const { toast } = useToast();
  const extras = useLeadExtras(leadId);
  const [body, setBody] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    addNote(leadId, trimmed, authorName);
    setBody('');
    toast({ variant: 'success', title: t('leadExtras.noteSavedToast') });
  }

  return (
    <div className="flex flex-col gap-sp3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-sp2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t('leadExtras.notePlaceholder')}
          rows={3}
          className="w-full px-sp2 py-sp2 bg-navy-deep border border-border rounded-md text-[13px] text-text-h placeholder:text-text-muted focus-visible:outline-none focus-visible:border-gold resize-y"
        />
        <div className="flex items-center justify-end">
          <Button type="submit" size="sm" disabled={!body.trim()}>
            {t('leadExtras.noteAddCta')}
          </Button>
        </div>
      </form>
      <ul className="flex flex-col gap-sp2">
        {extras.notes.length === 0 && (
          <li className="text-text-muted text-[12px]">{t('leadExtras.notesEmpty')}</li>
        )}
        {extras.notes.map((note) => (
          <li key={note.id} className="border border-border rounded-md bg-navy-deep px-sp3 py-sp2">
            <p className="text-[13px] text-text-h whitespace-pre-wrap">{note.body}</p>
            <div className="flex items-center justify-between mt-sp1">
              <p className="text-[11px] text-text-muted">
                {t('leadExtras.noteAuthor', {
                  author: note.authorName,
                  when: formatWhen(note.createdAt, locale),
                })}
              </p>
              <button
                type="button"
                onClick={() => removeNote(leadId, note.id)}
                className="text-[11px] text-text-muted hover:text-status-red transition-colors duration-fast cursor-pointer"
              >
                {t('leadExtras.noteRemove')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
