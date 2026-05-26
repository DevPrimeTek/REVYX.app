'use client';

// M0.S8 · Showing list — used standalone on /showings and inline on lead/property detail.

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';
import { useShowingActions } from '@/lib/showing-store';
import { ShowingFeedbackModal } from './showing-feedback-modal';
import { leadsById, propertiesById } from '@/lib/mock';
import type { Showing } from '@/lib/mock';

function formatDateTime(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(locale === 'ru' ? 'ru-RU' : 'ro-RO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function statusVariant(s: Showing['status']): 'success' | 'info' | 'warning' | 'critical' {
  switch (s) {
    case 'SCHEDULED':
      return 'info';
    case 'ATTENDED':
      return 'success';
    case 'NO_SHOW':
      return 'critical';
    case 'CANCELLED':
      return 'warning';
    default:
      return 'info';
  }
}

export function ShowingList({
  showings,
  locale,
  compact = false,
}: {
  showings: Showing[];
  locale: string;
  compact?: boolean;
}) {
  const { t } = useT();
  const { setStatus } = useShowingActions();
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  if (showings.length === 0) {
    return <p className="text-text-muted text-[12px]">{t('showing.emptyList')}</p>;
  }

  const sorted = [...showings].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  return (
    <>
      <ul className="flex flex-col gap-sp2">
        {sorted.map((s) => {
          const lead = leadsById.get(s.leadId);
          const prop = propertiesById.get(s.propertyId);
          const past = new Date(s.scheduledAt).getTime() < Date.now();
          return (
            <li
              key={s.id}
              className="border border-border rounded-md bg-navy-deep px-sp3 py-sp2 flex flex-col gap-sp2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-sp1 min-w-0">
                <div className="flex items-center gap-sp2 flex-wrap">
                  <span className="font-mono text-[11px] text-text-muted">{s.id}</span>
                  <Badge variant={statusVariant(s.status)} size="xs">
                    {t(`showing.status.${s.status}`)}
                  </Badge>
                  {s.feedbackScore !== null && (
                    <span className="text-gold text-[12px]">
                      {'★'.repeat(s.feedbackScore)}
                      <span className="text-text-muted">{'★'.repeat(5 - s.feedbackScore)}</span>
                    </span>
                  )}
                </div>
                <div className="text-[13px] text-text-h">
                  <span className="font-semibold">{formatDateTime(s.scheduledAt, locale)}</span>
                  <span className="text-text-muted"> · {s.durationMin} {t('showing.minutes')}</span>
                </div>
                <div className="text-[12px] text-text-secondary truncate">
                  {!compact && (
                    <>
                      <Link href={`/leads/${s.leadId}`} className="hover:text-gold">
                        {lead?.name ?? s.leadId}
                      </Link>
                      {' · '}
                    </>
                  )}
                  <Link href={`/properties/${s.propertyId}`} className="hover:text-gold">
                    {prop?.addr ?? s.propertyId}
                  </Link>
                </div>
                {s.notes && <p className="text-[11px] text-text-muted italic">{s.notes}</p>}
                {s.feedbackBody && (
                  <p className="text-[11px] text-text-secondary italic">&ldquo;{s.feedbackBody}&rdquo;</p>
                )}
              </div>
              {s.status === 'SCHEDULED' && (
                <div className="flex items-center gap-sp1 flex-wrap">
                  {past && (
                    <>
                      <Button size="sm" onClick={() => setFeedbackId(s.id)}>
                        {t('showing.markAttended')}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setStatus(s.id, 'NO_SHOW')}
                      >
                        {t('showing.markNoShow')}
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStatus(s.id, 'CANCELLED', { cancelReason: 'manual' })}
                  >
                    {t('showing.cancel')}
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {feedbackId && (
        <ShowingFeedbackModal
          open
          onClose={() => setFeedbackId(null)}
          showingId={feedbackId}
        />
      )}
    </>
  );
}
