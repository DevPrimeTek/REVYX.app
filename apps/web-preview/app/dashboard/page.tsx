import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadScoreBadge, ScorePill } from '@/components/ui/score-badge';

export default function DashboardPage() {
  return (
    <>
      <SiteNav active="/dashboard" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3">
          <div>
            <p className="label-mono text-gold">Modul 4 · NBA · Modul 2 · Lead Queue</p>
            <h1 className="text-[28px] mt-sp1">Bună dimineața, Andrei</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">
              Ai <span className="font-mono text-text-h">2 / 3</span> task-uri active (BR-04). 4 lead-uri
              așteaptă decizie în următoarele 15 min (SLA HOT).
            </p>
          </div>
          <div className="flex items-center gap-sp2">
            <Badge variant="hot" size="sm">SLA HOT · 12:34</Badge>
            <Link href="/leads">
              <Button>Deschide queue</Button>
            </Link>
          </div>
        </header>

        <section aria-labelledby="nba" className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <h2 id="nba" className="sr-only">Next Best Action</h2>
          {[
            { actor: 'Sună Maria P.', score: 1.84, note: 'Lead calificat · proprietate match LS=0.82', urgency: 'hot' },
            { actor: 'Trimite WhatsApp Andrei B.', score: 1.42, note: 'Re-engagement template T2', urgency: 'warm' },
            { actor: 'Programează vizionare Ion C.', score: 1.18, note: 'Match nou · raza 2km', urgency: 'info' },
          ].map((nba, i) => (
            <Card key={i} variant="elevated" accentTop>
              <CardHeader>
                <p className="label-mono text-text-secondary">NBA · {String(i + 1).padStart(2, '0')}</p>
                <CardTitle>{nba.actor}</CardTitle>
                <CardDescription>{nba.note}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="font-mono text-[18px] text-gold">{nba.score.toFixed(2)}</span>
                <Badge variant={nba.urgency as 'hot' | 'warm' | 'info'}>{nba.urgency}</Badge>
              </CardContent>
            </Card>
          ))}
        </section>

        <section aria-labelledby="queue-preview" className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
          <Card>
            <CardHeader>
              <h2 id="queue-preview" className="text-[16px] text-text-h font-semibold">Queue de azi</h2>
              <CardDescription>Lead Firewall (BR-01) filtrează lead-urile sub LS 0.60.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {[
                { name: 'Maria P.', ls: 0.82, sla: '15 min' },
                { name: 'Andrei B.', ls: 0.71, sla: '2h' },
                { name: 'Ion C.', ls: 0.64, sla: '2h' },
              ].map((l) => (
                <div key={l.name} className="flex items-center justify-between border border-border rounded-md px-sp3 py-sp2">
                  <div>
                    <p className="text-text-h">{l.name}</p>
                    <p className="text-[12px] text-text-muted">SLA · {l.sla}</p>
                  </div>
                  <LeadScoreBadge ls={l.ls} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-[16px] text-text-h font-semibold">Scoruri proprii</h2>
              <CardDescription>APS_default 0.65 până la 5 deal-uri/30 zile (BR-11).</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-sp4">
              <ScorePill label="APS" value={0.71} />
              <ScorePill label="Trust" value={0.68} />
              <ScorePill label="Conv. 30d" value={0.42} />
              <ScorePill label="DHI med" value={0.74} />
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
