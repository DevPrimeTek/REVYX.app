import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScorePill } from '@/components/ui/score-badge';

const props = [
  { id: 'P-2041', addr: 'Str. București 14, ap. 23', rooms: 2, area: 58, price: 64000, ps: 0.84, lf: 0.92 },
  { id: 'P-2008', addr: 'Str. Mihai Eminescu 7, ap. 5', rooms: 3, area: 72, price: 78000, ps: 0.76, lf: 0.81 },
  { id: 'P-1992', addr: 'Bd. Ștefan cel Mare 91, ap. 12', rooms: 2, area: 55, price: 59000, ps: 0.71, lf: 0.66 },
  { id: 'P-1978', addr: 'Str. Pușkin 22, ap. 8',         rooms: 3, area: 80, price: 92000, ps: 0.68, lf: 0.55 },
];

export default function PropertiesPage() {
  return (
    <>
      <SiteNav active="/properties" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">Modul 3 · Property</p>
          <h1 className="text-[28px] mt-sp1">Portofoliu proprietăți</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            Property Score (PS) §7.2 BRD · Listing Freshness LF = 1 − min(1, zile/90).
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-sp3">
          {props.map((p) => (
            <Card key={p.id} variant="elevated" accentTop>
              <CardHeader>
                <p className="label-mono text-text-secondary">{p.id}</p>
                <CardTitle>{p.addr}</CardTitle>
                <CardDescription>
                  {p.rooms} camere · {p.area} m² · €{p.price.toLocaleString('ro-MD')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex gap-sp3">
                  <ScorePill label="PS" value={p.ps} />
                  <ScorePill label="LF" value={p.lf} />
                </div>
                <Badge variant={p.lf > 0.75 ? 'success' : p.lf > 0.5 ? 'warning' : 'critical'}>
                  {p.lf > 0.75 ? 'Fresh' : p.lf > 0.5 ? 'Aging' : 'Stale'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
