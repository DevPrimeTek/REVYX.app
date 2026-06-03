'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useT } from '@/components/i18n/provider';

export default function LoginPage() {
  const { t } = useT();
  return (
    <main id="main" className="min-h-screen flex items-center justify-center px-sp4 py-sp8">
      <div className="w-full max-w-md">
        <Card variant="elevated" accentTop>
          <CardHeader>
            <p className="label-mono text-gold">{t('login.moduleLabel')}</p>
            <CardTitle>REVYX</CardTitle>
            <CardDescription>{t('login.demoNotice')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-sp3" action="/dashboard">
              <Input
                label={t('login.emailLabel')}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="agent@agentie.md"
                required
              />
              <Input
                label={t('login.passwordLabel')}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
              <Button type="submit" size="lg" className="w-full">
                {t('login.continue')}
              </Button>
              <p className="text-[12px] text-text-muted text-center">{t('login.footer')}</p>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-[12px] text-text-muted mt-sp3">
          <Link href="/" className="hover:text-text-secondary">
            ← {t('common.back')}
          </Link>
        </p>
      </div>
    </main>
  );
}
