'use client';

// Demo promotion · Ghid de bun-venit (auto-explorare).
// Apare o singură dată per browser (prima vizită) → testerul știe ce să apese și în ce ordine,
// fără apel de onboarding cu fondatorul. Cele 4 fluxuri = traseul din INTERVIEW_GUIDE §3.

import { usePathname } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';
import { useFeedbackFlags, markWelcomeSeen } from '@/lib/feedback-store';

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const;

// Splash-ul (/) și login-ul nu au bara de navigare → arătăm ghidul la primul ecran de aplicație.
const SKIP_ON = new Set(['/', '/login']);

export function WelcomeGuide() {
  const { t } = useT();
  const pathname = usePathname();
  const flags = useFeedbackFlags();

  if (flags.welcomeSeen || SKIP_ON.has(pathname ?? '/')) return null;

  return (
    <Modal
      open
      onClose={markWelcomeSeen}
      title={t('welcome.title')}
      description={t('welcome.subtitle')}
      size="md"
    >
      <div className="flex flex-col gap-sp3">
        <ol className="flex flex-col gap-sp2">
          {STEP_KEYS.map((key, i) => (
            <li key={key} className="flex items-start gap-sp2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-gold/15 text-gold font-body font-bold text-[12px] flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-text-h">{t(`welcome.${key}.title`)}</p>
                <p className="text-[12px] text-text-secondary">{t(`welcome.${key}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-[12px] text-text-muted">{t('welcome.langNote')}</p>
        <div className="flex justify-end">
          <Button onClick={markWelcomeSeen}>{t('welcome.start')}</Button>
        </div>
      </div>
    </Modal>
  );
}
