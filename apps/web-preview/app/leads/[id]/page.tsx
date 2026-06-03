'use client';

// M0.S9 · Lead detail rework — separare buyer/seller, MatchPodium Top1/2/3 cu reveal inline,
// suggestions ca bloc separat, recompute clarificat cu explicație.

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LeadPriorityBadge } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { agents, leadsById, properties } from '@/lib/mock';
import { LeadSuggestions } from '@/components/tasks/lead-suggestions';
import { NotesPanel } from '@/components/leads/notes-panel';
import { DocumentsPanel } from '@/components/leads/documents-panel';
import { ShowingModal } from '@/components/showings/showing-modal';
import { ShowingList } from '@/components/showings/showing-list';
import { MeetingModal } from '@/components/leads/meeting-modal';
import { MatchPodium } from '@/components/leads/match-podium';
import { BuyerPreferencesPanel } from '@/components/leads/buyer-preferences-panel';
import { SellerPropertyPanel } from '@/components/leads/seller-property-panel';
import { PreferenceHistoryPanel } from '@/components/leads/preference-history-panel';
import { useShowings } from '@/lib/showing-store';
import { isDemandSide, transactionIntent, isListingMatchForLead } from '@/lib/transaction-intent';

type Params = { params: { id: string } };

export default function LeadDetailPage({ params }: Params) {
  const router = useRouter();
  const { t, locale } = useT();
  const { toast } = useToast();
  const lead = leadsById.get(params.id);
  const showings = useShowings();

  const [assignOpen, setAssignOpen] = useState(false);
  const [showingOpen, setShowingOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0].id);
  const baseLs = lead?.ls ?? 0.30;
  const [ls, setLs] = useState(baseLs);
  const [recomputing, setRecomputing] = useState(false);

  // Top matches — pentru demand-side leads (buyer + tenant). Supply-side (seller/landlord) nu primesc match-uri.
  // Regula 20: comparăm pe priceEur pentru sale și pe monthlyRentEur pentru rent.
  const matches = useMemo(() => {
    if (!lead) return [];
    if (!isDemandSide(lead.leadType)) return [];
    const isRent = transactionIntent(lead.leadType) === 'rent';
    return [...properties]
      .filter((p) => isListingMatchForLead(lead, p.listingType))
      .filter((p) => {
        const amount = isRent ? (p.monthlyRentEur ?? 0) : p.priceEur;
        return amount >= lead.budgetMin * 0.85 && amount <= lead.budgetMax * 1.15;
      })
      .sort((a, b) => b.ps - a.ps)
      .slice(0, 6);
  }, [lead]);

  const leadShowings = useMemo(
    () => (lead ? showings.filter((s) => s.leadId === lead.id) : []),
    [lead, showings],
  );

  function recomputeScore() {
    if (recomputing) return;
    setRecomputing(true);
    const target = Math.min(0.95, baseLs + 0.03 + Math.random() * 0.04);
    const steps = 18;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLs((cur) => cur + (target - cur) / Math.max(1, steps - i));
      if (i >= steps) {
        clearInterval(id);
        setLs(target);
        setRecomputing(false);
        toast({
          variant: 'success',
          title: t('leadDetail.toastRecompute'),
          description: t('leadDetail.toastRecomputeDesc'),
        });
      }
    }, 40);
  }

  function confirmAssign() {
    const agent = agents.find((a) => a.id === selectedAgent);
    setAssignOpen(false);
    toast({
      variant: 'success',
      title: t('leadDetail.toastAssign', { id: params.id, name: agent?.name ?? selectedAgent }),
      description: t('leadDetail.toastAssignDesc'),
      duration: 5000,
    });
    setTimeout(() => router.push('/dashboard'), 600);
  }

  if (!lead) {
    return (
      <>
        <SiteNav active="/leads" />
        <main id="main" className="px-sp4 py-sp8 max-w-3xl mx-auto text-center">
          <p className="label-mono text-gold">404</p>
          <h1 className="text-[28px] mt-sp2">Lead {params.id} inexistent.</h1>
          <p className="text-text-secondary mt-sp2">
            <Link href="/leads" className="text-gold hover:underline">← {t('leadDetail.breadcrumbQueue')}</Link>
          </p>
        </main>
      </>
    );
  }

  const agentSlotState = (a: typeof agents[number]) => {
    if (a.activeTasks >= 3) return 'busy';
    if (a.aps >= 0.80) return 'top';
    if (a.activeTasks === 0) return 'available';
    return 'good';
  };

  const isDemand = isDemandSide(lead.leadType);
  const isRent = transactionIntent(lead.leadType) === 'rent';
  const typeBadgeVariant =
    lead.leadType === 'buyer' ? 'info' :
    lead.leadType === 'tenant' ? 'success' :
    lead.leadType === 'seller' ? 'updated' :
    'warning'; // landlord

  return (
    <>
      <SiteNav active="/leads" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/leads" className="hover:text-text-h focus-visible:text-gold rounded-sm">
            {t('leadDetail.breadcrumbQueue')}
          </Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h font-mono">{params.id}</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('leadDetail.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{lead.name}</h1>
            <div className="flex items-center gap-sp2 mt-sp2 flex-wrap">
              <Badge variant={typeBadgeVariant} size="sm">
                {t(`leadType.${lead.leadType}`)}
              </Badge>
              <Badge variant={isRent ? 'success' : 'info'} size="xs">
                {t(`transactionIntent.${transactionIntent(lead.leadType)}`)}
              </Badge>
              <LeadPriorityBadge ls={ls} t={t} />
              {lead.needsReview && <Badge variant="updated">{t('leadDetail.matchNeedsReview')}</Badge>}
              {recomputing && <Badge variant="info" size="xs">{t('leadDetail.recomputing')}</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-sp2 flex-wrap">
            <div className="flex items-center gap-1">
              <Button variant="ghost" onClick={recomputeScore} disabled={recomputing}>
                {t('leadDetail.recompute')}
              </Button>
              <InfoTooltip
                label={t('leadDetail.recompute')}
                body={t('leadDetail.recomputeHelp')}
              />
            </div>
            <Button variant="secondary">{t('leadDetail.whatsapp')}</Button>
            {/* [MOLDOVA-SPECIFIC] Programează discuție față-în-față (calificare) */}
            <Button variant="secondary" onClick={() => setMeetingOpen(true)}>
              {t('meeting.scheduleCta')}
            </Button>
            {isDemand && (
              <Button variant="secondary" onClick={() => setShowingOpen(true)}>
                {t('showing.addCta')}
              </Button>
            )}
            <Button onClick={() => setAssignOpen(true)}>{t('leadDetail.assignAgent')}</Button>
          </div>
        </header>

        {lead.needsReview && (
          <div
            className="bg-status-amber/10 border border-status-amber/30 rounded-lg px-sp3 py-sp2 text-[13px] text-text-h"
            dangerouslySetInnerHTML={{ __html: t('leadDetail.rematchBanner') }}
          />
        )}

        {/* Summary (cleaner — fără suggestions inline; suggestions este bloc separat mai jos) */}
        <Card>
          <CardHeader>
            <CardTitle>{t('leadDetail.summaryTitle')}</CardTitle>
            <CardDescription>{t('leadDetail.gdprNote')} · {lead.createdAt}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-4 gap-sp3 text-[13px]">
              <div>
                <dt className="label-mono text-text-muted">{t('leadDetail.source')}</dt>
                <dd className="text-text-h">{lead.source}</dd>
              </div>
              <div>
                <dt className="label-mono text-text-muted">{t(isRent ? 'leadDetail.budgetRent' : 'leadDetail.budget')}</dt>
                <dd className="text-text-h">
                  €{lead.budgetMin.toLocaleString('ro-MD')} – €{lead.budgetMax.toLocaleString('ro-MD')}
                  {isRent && <span className="text-text-secondary text-[11px] ml-1">/{t('landlord.month')}</span>}
                </dd>
              </div>
              <div>
                <dt className="label-mono text-text-muted">{t('leadDetail.zone')}</dt>
                <dd className="text-text-h">{lead.zone}</dd>
              </div>
              <div>
                <dt className="label-mono text-text-muted">{t('leadDetail.rooms')}</dt>
                <dd className="text-text-h">{lead.rooms}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Suggestions — bloc separat per PM feedback (2.1) */}
        <Card variant="elevated" accentTop>
          <CardHeader>
            <div className="flex items-center gap-sp1">
              <CardTitle>{t('leadDetail.suggestionsBlockTitle')}</CardTitle>
              <InfoTooltip
                label={t('dashboard.blocks.suggestionsTitle')}
                body={t('dashboard.blocks.suggestionsDesc')}
              />
            </div>
            <CardDescription>{t('leadDetail.suggestionsBlockDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadSuggestions lead={lead} agentId={agents[0].id} />
          </CardContent>
        </Card>

        {/* Demand vs Supply split (Regula 19 + Regula 20 — buyer/tenant vs seller/landlord) */}
        {isDemand ? (
          <>
            {/* Demand side (buyer + tenant): preferințe + Top3 match podium */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
              <div className="lg:col-span-1">
                <BuyerPreferencesPanel lead={lead} />
              </div>
              <Card className="lg:col-span-2" variant="elevated" accentTop>
                <CardHeader>
                  <p className="label-mono text-gold">{t('leadDetail.matchModule')}</p>
                  <CardTitle>{t('leadDetail.matchTitle')}</CardTitle>
                  <CardDescription>{t(isRent ? 'leadDetail.matchSubtitleTenant' : 'leadDetail.matchSubtitleBuyer')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <MatchPodium lead={lead} candidates={matches} />
                </CardContent>
              </Card>
            </div>
            {/* [MOLDOVA-SPECIFIC] Evoluția preferințelor — panel editabil */}
            {isDemand && (
              <PreferenceHistoryPanel lead={lead} />
            )}
            <Card>
              <CardHeader>
                <CardTitle>{t('dealDetail.showingsTitle')}</CardTitle>
                <CardDescription>{t('showing.upcomingDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ShowingList showings={leadShowings} locale={locale} compact />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Supply side (seller + landlord): proprietatea + beneficii + vizionări programate */}
            <SellerPropertyPanel lead={lead} locale={locale} />
          </>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-sp1">
                <CardTitle>{t('leadExtras.notesTitle')}</CardTitle>
                <InfoTooltip label={t('leadExtras.notesTitle')} body={t('leadExtras.notesDesc')} />
              </div>
              <CardDescription>{t('leadExtras.notesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <NotesPanel leadId={lead.id} authorName={agents[0].name} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-sp1">
                <CardTitle>{t('leadExtras.documentsTitle')}</CardTitle>
                <InfoTooltip label={t('leadExtras.documentsTitle')} body={t('leadExtras.documentsDesc')} />
              </div>
              <CardDescription>{t('leadExtras.documentsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentsPanel leadId={lead.id} uploaderName={agents[0].name} />
            </CardContent>
          </Card>
        </section>
      </main>

      <ShowingModal
        open={showingOpen}
        onClose={() => setShowingOpen(false)}
        leadId={lead.id}
        agentId={agents[0].id}
      />

      <MeetingModal
        open={meetingOpen}
        onClose={() => setMeetingOpen(false)}
        leadId={lead.id}
        agentId={agents[0].id}
      />

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={t('leadDetail.assignModalTitle', { id: params.id })}
        description={t('leadDetail.assignModalDesc')}
        size="md"
      >
        <fieldset className="flex flex-col gap-sp2">
          <legend className="sr-only">{t('leadDetail.assignAgent')}</legend>
          {agents.map((a) => {
            const state = agentSlotState(a);
            const disabled = state === 'busy';
            const checked = selectedAgent === a.id;
            return (
              <label
                key={a.id}
                className={
                  'flex items-center justify-between gap-sp3 border rounded-md px-sp3 py-sp2 transition-all cursor-pointer ' +
                  (disabled
                    ? 'border-border opacity-50 cursor-not-allowed'
                    : checked
                    ? 'border-gold bg-navy-hover'
                    : 'border-border hover:border-border-light hover:bg-navy-hover')
                }
              >
                <span className="flex items-center gap-sp2 min-w-0">
                  <input
                    type="radio"
                    name="agent"
                    value={a.id}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => setSelectedAgent(a.id)}
                    className="accent-gold"
                  />
                  <span className="flex flex-col">
                    <span className="text-text-h text-[13px]">{a.name}</span>
                    <span className="text-text-muted text-[11px]">
                      {t('leadDetail.agentInfo', { tasks: a.activeTasks })}
                    </span>
                  </span>
                </span>
                <Badge
                  variant={
                    state === 'top'
                      ? 'success'
                      : state === 'good'
                      ? 'info'
                      : state === 'available'
                      ? 'updated'
                      : 'critical'
                  }
                  size="xs"
                >
                  {state === 'top'
                    ? t('leadDetail.agentStateTop')
                    : state === 'good'
                    ? t('leadDetail.agentStateGood')
                    : state === 'available'
                    ? t('leadDetail.agentStateAvailable')
                    : t('leadDetail.agentStateBusy')}
                </Badge>
              </label>
            );
          })}
        </fieldset>

        <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
          <Button variant="ghost" onClick={() => setAssignOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmAssign}>{t('common.confirm')}</Button>
        </div>
      </Modal>
    </>
  );
}
