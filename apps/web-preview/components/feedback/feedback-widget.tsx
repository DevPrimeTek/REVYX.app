'use client';

// Demo promotion · Global feedback widget.
// Rendat o singură dată în AppProviders → apare pe toate cele 20 ecrane fără să atingem fiecare pagină.
//  1) Buton plutitor mereu vizibil (jos-dreapta) → deschide modal cu link către formularul Tally.
//  2) Nudge automat după ce testerul a explorat ≥ NUDGE_AFTER_PAGES ecrane distincte
//     (ca feedback-ul să nu poată fi ratat), o singură dată per browser.
// Regula 12: elementele sunt interactive (buton/link) → hover permis.

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';
import { TALLY_FEEDBACK_URL, NUDGE_AFTER_PAGES } from '@/lib/feedback-config';
import {
  useFeedbackFlags,
  markFeedbackOpened,
  dismissNudge,
} from '@/lib/feedback-store';

export function FeedbackWidget() {
  const { t } = useT();
  const pathname = usePathname();
  const flags = useFeedbackFlags();
  const [modalOpen, setModalOpen] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const visited = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;
    visited.current.add(pathname);
    if (visited.current.size >= NUDGE_AFTER_PAGES && flags.promptStatus === 'idle') {
      setNudgeVisible(true);
    }
  }, [pathname, flags.promptStatus]);

  function openForm() {
    markFeedbackOpened();
    setNudgeVisible(false);
    setModalOpen(false);
    if (typeof window !== 'undefined') {
      window.open(TALLY_FEEDBACK_URL, '_blank', 'noopener,noreferrer');
    }
  }

  function closeNudge() {
    dismissNudge();
    setNudgeVisible(false);
  }

  return (
    <>
      {/* Nudge automat post-explorare */}
      {nudgeVisible && (
        <div className="fixed bottom-20 right-4 z-40 w-[280px] max-w-[calc(100vw-2rem)] bg-navy-card border border-gold/50 rounded-lg shadow-lg card-accent-top p-sp3">
          <div className="flex items-start justify-between gap-sp2">
            <p className="text-[13px] font-semibold text-text-h">{t('feedback.nudgeTitle')}</p>
            <button
              onClick={closeNudge}
              aria-label={t('feedback.dismiss')}
              className="text-text-muted hover:text-text-h transition-colors shrink-0 -mt-1 -mr-1 px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-[12px] text-text-secondary mt-sp1">{t('feedback.nudgeBody')}</p>
          <div className="mt-sp2 flex gap-sp2">
            <Button size="sm" onClick={openForm}>
              {t('feedback.cta')}
            </Button>
            <Button size="sm" variant="ghost" onClick={closeNudge}>
              {t('feedback.later')}
            </Button>
          </div>
        </div>
      )}

      {/* Buton plutitor persistent */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-sp1 h-12 px-sp3 rounded-full bg-gold text-navy-deep font-body font-semibold text-[14px] shadow-gold hover:bg-gold-light transition-all duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
        aria-label={t('feedback.buttonLabel')}
      >
        <span aria-hidden="true">💬</span>
        <span className="hidden sm:inline">{t('feedback.buttonLabel')}</span>
      </button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('feedback.modalTitle')}
        description={t('feedback.modalSubtitle')}
        size="sm"
      >
        <div className="flex flex-col gap-sp3">
          <ul className="flex flex-col gap-sp1 text-[13px] text-text-secondary">
            <li>• {t('feedback.point1')}</li>
            <li>• {t('feedback.point2')}</li>
            <li>• {t('feedback.point3')}</li>
          </ul>
          <div className="flex flex-col gap-sp2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              {t('feedback.later')}
            </Button>
            <Button onClick={openForm}>{t('feedback.openForm')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
