import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LeadScoreBadge, ScorePill } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Params = { params: { id: string } };

export default function LeadDetailPage({ params }: Params) {
  return (
    <>
      <SiteNav active="/leads" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/leads" className="hover:text-text-h">Queue</Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h font-mono">{params.id}</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3">
          <div>
            <p className="label-mono text-gold">Modul 2 · Lead Detail</p>
            <h1 className="text-[28px] mt-sp1">Maria Popescu</h1>
            <div className="flex items-center gap-sp2 mt-sp2">
              <LeadScoreBadge ls={0.82} />
              <Badge variant="updated">Match needs review</Badge>
            </div>
          </div>
          <div className="flex items-center gap-sp2">
            <Button variant="secondary">WhatsApp</Button>
            <Button>Sună acum</Button>
          </div>
        </header>

        <div className="bg-status-amber/10 border border-status-amber/30 rounded-lg px-sp3 py-sp2 text-[13px] text-text-h">
          <strong className="text-status-amber">Re-matching:</strong> proprietatea P-2041 a fost actualizată — match-urile au
          fost re-evaluate. Deal-ul existent NU se anulează automat (BR-05).
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detalii lead</CardTitle>
              <CardDescription>GDPR consent capturat 2026-05-12 14:21 (BRD §9.4).</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-sp3 text-[13px]">
                <div>
                  <dt className="label-mono text-text-muted">Sursă</dt>
                  <dd className="text-text-h">Meta Lead Ads · Campania "Apartament 2 cam Centru"</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">Buget</dt>
                  <dd className="text-text-h">€55,000 – €75,000</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">Zonă preferată</dt>
                  <dd className="text-text-h">Chișinău · Centru, Botanica</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">Camere</dt>
                  <dd className="text-text-h">2 – 3</dd>
                </div>
              </dl>

              <div className="mt-sp4 flex flex-wrap gap-sp3">
                <ScorePill label="LS" value={0.82} />
                <ScorePill label="IS" value={0.54} />
                <ScorePill label="Trust" value={0.71} />
                <ScorePill label="DP" value={0.66} />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-gold">Modul 4 · Match suggestions</p>
              <CardTitle>Top 3 proprietăți</CardTitle>
              <CardDescription>PS+LS+IS combined (match v1).</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {[
                { id: 'P-2041', addr: 'Str. București 14, ap. 23', score: 0.84 },
                { id: 'P-2008', addr: 'Str. Mihai Eminescu 7, ap. 5', score: 0.76 },
                { id: 'P-1992', addr: 'Bd. Ștefan cel Mare 91, ap. 12', score: 0.71 },
              ].map((p) => (
                <div key={p.id} className="flex items-start justify-between border border-border rounded-md px-sp2 py-sp2">
                  <div>
                    <p className="font-mono text-[11px] text-text-secondary">{p.id}</p>
                    <p className="text-text-h text-[13px]">{p.addr}</p>
                  </div>
                  <span className="font-mono text-gold">{p.score.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
