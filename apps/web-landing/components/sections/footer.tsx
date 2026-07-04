'use client';

import { useI18n } from '@/lib/i18n';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-navy-deep">
      <div className="container-x flex flex-col gap-sp3 py-sp6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-1 font-mono text-xs uppercase tracking-badge text-gold">
            {t.footer.tagline}
          </p>
        </div>
        <div className="text-sm text-text-muted md:text-right">
          <p>{t.footer.confidential}</p>
          <p className="mt-1">
            © {year} {t.footer.company}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
