// M0.S7 · Per-lead action suggestions — UI demo of the NBA recommendation flow.
// Logic mirrors the spec: pick the next-best action based on lead status, time since
// last touch, and budget validation state. M1.S3 will replace this with the real
// nba-engine outputs (apps/api/src/business/tasks/* + scoring/fixtures.ts).

import type { Lead, LeadStatus } from './types';
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

const RULES: Record<LeadStatus, TaskType[]> = {
  HOT: ['first_contact', 'schedule_showing'],
  qualified: ['follow_up', 'send_property'],
  warm: ['send_property', 'follow_up'],
  nurturing: ['follow_up'],
};

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
  const types = RULES[lead.status];
  const baseDue: Suggestion['due'] = lead.status === 'HOT' ? 'now' : lead.status === 'qualified' ? 'today' : 'thisWeek';
  const baseUrgency: Suggestion['urgency'] = lead.status === 'HOT' ? 'high' : lead.status === 'qualified' ? 'medium' : 'low';

  const rationaleByType: Record<TaskType, string> = {
    first_contact: `Lead venit prin ${lead.source}. Contactează în primele 15 min ca să nu se răcească.`,
    schedule_showing: `Clientul are buget €${lead.budgetMin.toLocaleString('ro-MD')}-${lead.budgetMax.toLocaleString('ro-MD')} și caută în ${lead.zone}. Programează o vizionare azi.`,
    follow_up: 'Nu a mai fost activitate de 2 zile. Un mesaj scurt menține interesul.',
    send_property: 'Trimite 3-5 proprietăți care se potrivesc cu cerințele declarate.',
    request_documents: 'Cere acte de identitate și dovada bugetului ca să poți avansa.',
    draft_offer: 'Pregătește o ofertă scrisă cu termenii agreați verbal.',
    close_deal: 'Confirmă programarea la notar și verifică actele.',
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
