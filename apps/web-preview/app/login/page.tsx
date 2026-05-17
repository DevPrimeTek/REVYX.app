import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main id="main" className="min-h-screen flex items-center justify-center px-sp4 py-sp8">
      <div className="w-full max-w-md">
        <Card variant="elevated" accentTop>
          <CardHeader>
            <p className="label-mono text-gold">Modul 1 · Auth</p>
            <CardTitle>Conectare REVYX</CardTitle>
            <CardDescription>
              Single session per agent (BR-12). Sesiunea expiră după 15 minute fără activitate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-sp3" action="/dashboard">
              <Input
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="agent@agentie.md"
                required
              />
              <Input
                label="Parolă"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                hint="Magic link disponibil doar pe Web (Platform Matrix §2.1.3)."
                required
              />
              <Button type="submit" size="lg" className="w-full">
                Continuă
              </Button>
              <p className="text-[12px] text-text-muted text-center">
                Demo: orice credențiale → redirecționează spre dashboard.
              </p>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-[12px] text-text-muted mt-sp3">
          <Link href="/" className="hover:text-text-secondary">
            ← Înapoi la landing
          </Link>
        </p>
      </div>
    </main>
  );
}
