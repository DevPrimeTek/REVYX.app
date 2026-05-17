import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main id="main" className="min-h-screen flex flex-col items-center justify-center px-sp4 py-sp8">
      <div className="absolute inset-0 grid-overlay pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl text-center flex flex-col gap-sp4">
        <p className="label-mono text-gold">M0.S1 · Design System Preview</p>
        <h1 className="font-display text-[clamp(56px,10vw,120px)] leading-none text-text-h">
          REVYX
        </h1>
        <p className="text-[18px] text-text-secondary">
          Agent Operating System (AOS) pentru imobiliare —{' '}
          <span className="text-text-h">Real Estate Execution Intelligence</span>.
        </p>
        <p className="text-[13px] text-text-muted">
          Această previzualizare livrează design system-ul direct în cod (tokens.json + Tailwind +
          shadcn-style primitives) pentru reuse în M0.S3, M1.S5+ și M2.S2.
        </p>
        <div className="flex items-center justify-center gap-sp2 pt-sp2">
          <Link href="/login">
            <Button size="lg">Intră în demo</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Sari la dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
