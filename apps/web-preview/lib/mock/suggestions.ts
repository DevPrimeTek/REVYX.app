// M0.S7 · Per-lead action suggestions — UI demo of the NBA recommendation flow.
// Logic mirrors the spec: pick the next-best action based on lead status, time since
// last touch, and budget validation state. M1.S3 will replace this with the real
// nba-engine outputs (apps/api/src/business/tasks/* + scoring/fixtures.ts).

import type { Lead, LeadStatus, LeadType } from './types';
import type { TaskType } from './tasks';

export interface Suggestion {
  /** Stable id so React keys are predictable. */
  id: string;
  taskType: TaskType;
  /** Human label shown to the agent — must be friendly, no acronyms. */
  label: string;
  /** Optional one-line rationale shown beneath the label. */
  rationale: string;
  /** Recommended timeframe to act, e.g. "în 15 min" / "azi" / "mâine". */
  due: 'now' | 'today' | 'tomorrow' | 'thisWeek';
  /** Visual urgency — same scale as priority badge so it composes well. */
  urgency: 'high' | 'medium' | 'low';
}

// Regula 20: rules per (status, leadType). Supply-side (seller/landlord) primesc sugestii
// orientate spre marketing + acte. Demand-side (buyer/tenant) primesc contact + vizionare.
const RULES_DEMAND: Record<LeadStatus, TaskType[]> = {
  HOT: ['first_contact', 'schedule_showing'],
  qualified: ['follow_up', 'send_property'],
  warm: ['send_property', 'follow_up'],
  nurturing: ['follow_up'],
};
const RULES_SUPPLY: Record<LeadStatus, TaskType[]> = {
  HOT: ['request_documents', 'first_contact'],
  qualified: ['request_documents', 'follow_up'],
  warm: ['follow_up', 'send_property'],
  nurturing: ['follow_up'],
};

function rulesForLeadType(leadType: LeadType): Record<LeadStatus, TaskType[]> {
  return leadType === 'seller' || leadType === 'landlord' ? RULES_SUPPLY : RULES_DEMAND;
}

const TYPE_LABEL_KEY: Record<TaskType, string> = {
  first_contact: 'task.types.first_contact',
  follow_up: 'task.types.follow_up',
  schedule_showing: 'task.types.schedule_showing',
  send_property: 'task.types.send_property',
  request_documents: 'task.types.request_documents',
  draft_offer: 'task.types.draft_offer',
  close_deal: 'task.types.close_deal',
  review_no_show: 'task.types.review_no_show',
  custom: 'task.types.custom',
};

export function taskTypeLabelKey(t: TaskType): string {
  return TYPE_LABEL_KEY[t];
}

/**
 * Produce 2-3 ordered suggestions for a given lead. The first one is "primary"
 * (highest urgency), the rest are alternatives.
 */
export function suggestionsForLead(lead: Lead): Suggestion[] {
  const types = rulesForLeadType(lead.leadType)[lead.status];
  const baseDue: Suggestion['due'] = lead.status === 'HOT' ? 'now' : lead.status === 'qualified' ? 'today' : 'thisWeek';
  const baseUrgency: Suggestion['urgency'] = lead.status === 'HOT' ? 'high' : lead.status === 'qualified' ? 'medium' : 'low';
  const isRent = lead.leadType === 'tenant' || lead.leadType === 'landlord';
  const isSupply = lead.leadType === 'seller' || lead.leadType === 'landlord';

  // Rationale adaptat per tip lead.
  const budgetSuffix = isRent ? '/lună' : '';
  const rationaleByType: Record<TaskType, string> = {
    first_contact: isSupply
      ? `Lead venit prin ${lead.source}. Contactează în primele 15 min pentru a confirma listarea și a colecta beneficii / fotografii.`
      : `Lead venit prin ${lead.source}. Contactează în primele 15 min ca să nu se răcească.`,
    schedule_showing: `Clientul are buget €${lead.budgetMin.toLocaleString('ro-MD')}-${lead.budgetMax.toLocaleString('ro-MD')}${budgetSuffix} și caută în ${lead.zone}. Programează o vizionare azi.`,
    follow_up: 'Nu a mai fost activitate de 2 zile. Un mesaj scurt menține interesul.',
    send_property: isRent
      ? 'Trimite 3-5 oferte de chirie care se potrivesc cu cerințele și data dorită de mutare.'
      : 'Trimite 3-5 proprietăți care se potrivesc cu cerințele declarate.',
    request_documents: isSupply
      ? (isRent
          ? 'Cere actele proprietății (extras cadastral) + acord proprietar pentru închiriere + 6-8 fotografii recente.'
          : 'Cere actele proprietății (extras cadastral) + mandat de vânzare + 6-8 fotografii recente.')
      : 'Cere acte de identitate și dovada bugetului ca să poți avansa.',
    draft_offer: isRent
      ? 'Pregătește contractul de închiriere cu termenii agreați (chirie, perioadă, depozit).'
      : 'Pregătește o ofertă scrisă cu termenii agreați verbal.',
    close_deal: isRent
      ? 'Confirmă semnarea contractului de chirie și transferul depozitului.'
      : 'Confirmă programarea la notar și verifică actele.',
    review_no_show: 'Clientul nu s-a prezentat — investighează motivul înainte de a închide.',
    custom: '',
  };

  return types.map(
    (tt, i): Suggestion => ({
      id: `${lead.id}-${tt}`,
      taskType: tt,
      label: '', // filled by the consumer via i18n (TYPE_LABEL_KEY)
      rationale: rationaleByType[tt],
      due: i === 0 ? baseDue : 'thisWeek',
      urgency: i === 0 ? baseUrgency : 'low',
    }),
  );
}
