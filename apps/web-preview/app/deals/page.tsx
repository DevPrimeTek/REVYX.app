import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScorePill } from '@/components/ui/score-badge';

const stages = [
  { key: 'discovery',  label: 'Discovery',      deals: [{ id: 'D-1001', name: 'Maria P. · P-2041', dp: 0.42, dhi: 0.71 }] },
  { key: 'qualified',  label: 'Calificat',      deals: [{ id: 'D-1002', name: 'Andrei B. · P-2008', dp: 0.48, dhi: 0.65 }] },
  { key: 'offer',      label: 'Ofertă',         deals: [{ id: 'D-1003', name: 'Ion C. · P-1992', dp: 0.58, dhi: 0.69 }, { id: 'D-1004', name: 'Elena R. · P-2041', dp: 0.51, dhi: 0.62 }] },
  { key: 'negotiation',label: 'Negociere',      deals: [{ id: 'D-1005', name: 'Mihai T. · P-2008', dp: 0.71, dhi: 0.78 }] },
  { key: 'closing',    label: 'Notariat',       deals: [{ id: 'D-1006', name: 'Olga C. · P-1978', dp: 0.85, dhi: 0.84 }] },
  { key: 'won',        label: 'Won',            deals: [{ id: 'D-0995', name: 'Vitalie B. · P-1942', dp: 1.00, dhi: 0.91 }] },
];

export default function DealsPage() {
  return (
    <>
      <SiteNav active="/deals" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">Modul 5 · Deal Pipeline</p>
          <h1 className="text-[28px] mt-sp1">Pipeline kanban</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            6 stages · DP (Deal Probability) și DHI (Deal Health Index) sub fiecare card. Drag-drop între
            coloane livrabil la M0.S3.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-sp2">
          {stages.map((s) => (
            <div key={s.key} className="flex flex-col gap-sp2 min-h-[280px]">
              <header className="flex items-center justify-between px-sp2 py-sp1 bg-navy-card border border-border rounded-md">
                <h2 className="label-mono text-gold">{s.label}</h2>
                <span className="font-mono text-[11px] text-text-secondary">{s.deals.length}</span>
              </header>
              <div className="flex flex-col gap-sp2">
                {s.deals.map((d) => (
                  <Card key={d.id} variant="elevated">
                    <CardHeader>
                      <p className="label-mono text-text-secondary">{d.id}</p>
                      <CardTitle className="text-[14px]">{d.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex gap-sp2">
                        <ScorePill label="DP" value={d.dp} />
                        <ScorePill label="DHI" value={d.dhi} />
                      </div>
                      <Badge
                        variant={d.dhi > 0.75 ? 'success' : d.dhi > 0.55 ? 'warning' : 'critical'}
                        size="xs"
                      >
                        {d.dhi > 0.75 ? 'healthy' : d.dhi > 0.55 ? 'review' : 'risk'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Legendă DHI</CardTitle>
            <CardDescription>TF default 0.70 (BR-10) când expected_close_date e necunoscut.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-sp4 text-[12px] text-text-secondary">
            <span><Badge variant="success" size="xs">healthy</Badge> &nbsp;DHI ≥ 0.75</span>
            <span><Badge variant="warning" size="xs">review</Badge> &nbsp;0.55 ≤ DHI &lt; 0.75</span>
            <span><Badge variant="critical" size="xs">risk</Badge> &nbsp;DHI &lt; 0.55</span>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
