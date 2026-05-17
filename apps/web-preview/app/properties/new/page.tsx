'use client';

// M0.S2 · T-M0.S2-02 · J2 Property creation → Match · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S2)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md §3.2

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

export default function NewPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const propertyId = 'P-2042';

    setTimeout(() => {
      toast({
        variant: 'success',
        title: `Proprietatea ${propertyId} creată`,
        description: 'Match engine: 4 lead-uri candidate (top: Maria P. score 0.84). Re-matching emis pentru deal-urile afectate (BR-05).',
        duration: 5500,
      });
      setTimeout(() => router.push('/leads/L-0001'), 700);
    }, 400);
  }

  return (
    <>
      <SiteNav active="/properties" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-3xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/properties" className="hover:text-text-h">Portofoliu</Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h">Adaugă</span>
        </nav>

        <header>
          <div className="flex items-center gap-sp2">
            <p className="label-mono text-gold">Modul 3 · Property Intake</p>
            <Badge variant="info" size="xs">Match auto la submit</Badge>
          </div>
          <h1 className="text-[28px] mt-sp1">Proprietate nouă</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            Câmpurile minime pentru calcul PS + LF + emitere match suggestions. Property Score complet
            se recalculează după upload poze (M1.S5).
          </p>
        </header>

        <Card variant="elevated" accentTop>
          <CardHeader>
            <CardTitle>Detalii esențiale</CardTitle>
            <CardDescription>8 câmpuri minim · validare client-side (M0 demo).</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-sp3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sp3">
                <Input
                  label="Adresă completă"
                  name="address"
                  placeholder="Str. Mitropolit G. Bănulescu 24, ap. 17"
                  required
                />
                <Input
                  label="Oraș"
                  name="city"
                  placeholder="Chișinău"
                  defaultValue="Chișinău"
                  required
                />
                <Input
                  label="Cartier"
                  name="district"
                  placeholder="Centru"
                  hint="Folosit la matching geo (raza 2 km)."
                  required
                />
                <Input
                  label="Camere"
                  name="rooms"
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={2}
                  required
                />
                <Input
                  label="Suprafață (m²)"
                  name="area"
                  type="number"
                  min={10}
                  defaultValue={58}
                  required
                />
                <Input
                  label="Preț (€)"
                  name="price"
                  type="number"
                  min={1000}
                  step={500}
                  defaultValue={64000}
                  required
                />
                <Input
                  label="An construcție"
                  name="year"
                  type="number"
                  min={1900}
                  max={2030}
                  defaultValue={2018}
                />
                <Input
                  label="Etaj / Etaje totale"
                  name="floor"
                  placeholder="3/9"
                  defaultValue="3/9"
                />
              </div>

              <div className="bg-navy-deep border border-border rounded-md px-sp3 py-sp2 text-[12px] text-text-secondary">
                După submit: <span className="text-text-h">Property Score</span> calculat automat,
                emis eveniment <span className="font-mono text-gold">PROPERTY_CREATED</span> +
                <span className="font-mono text-gold"> MATCH_SUGGESTED</span> (audit-log).
              </div>

              <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
                <Link href="/properties">
                  <Button type="button" variant="ghost">Anulează</Button>
                </Link>
                <Button type="submit" loading={submitting}>
                  Salvează &amp; rulează match
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
