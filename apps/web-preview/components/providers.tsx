'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { I18nProvider } from '@/components/i18n/provider';
import { WelcomeGuide } from '@/components/feedback/welcome-guide';
import { FeedbackWidget } from '@/components/feedback/feedback-widget';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ToastProvider>
        {children}
        {/* Demo promotion · self-service onboarding + feedback capture pe toate ecranele */}
        <WelcomeGuide />
        <FeedbackWidget />
      </ToastProvider>
    </I18nProvider>
  );
}
