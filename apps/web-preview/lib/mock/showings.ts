// M0.S8 · Seed showings — covers SCHEDULED/ATTENDED/NO_SHOW so the demo shows all states.

import type { Showing } from './transactions-types';
import { deals } from './deals';
import { agents } from './agents';

function isoOffset(days: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function buildSeedShowings(): Showing[] {
  const a = agents[0].id;
  // Pull 6 deals from various stages so showings hang off real deals.
  const sample = deals.slice(0, 8);

  return [
    {
      id: 'S-3001',
      leadId: sample[0].leadId,
      propertyId: sample[0].propertyId,
      agentId: a,
      scheduledAt: isoOffset(0, 11, 30),
      durationMin: 45,
      status: 'SCHEDULED',
      notes: 'Clientul a confirmat — preferă demo apartament etaj 5.',
      feedbackScore: null,
      feedbackBody: null,
      cancelReason: null,
      createdAt: isoOffset(-1, 9, 0),
    },
    {
      id: 'S-3002',
      leadId: sample[1].leadId,
      propertyId: sample[1].propertyId,
      agentId: a,
      scheduledAt: isoOffset(0, 16, 0),
      durationMin: 30,
      status: 'SCHEDULED',
      notes: '',
      feedbackScore: null,
      feedbackBody: null,
      cancelReason: null,
      createdAt: isoOffset(-2, 10, 30),
    },
    {
      id: 'S-3003',
      leadId: sample[2].leadId,
      propertyId: sample[2].propertyId,
      agentId: a,
      scheduledAt: isoOffset(1, 10, 0),
      durationMin: 60,
      status: 'SCHEDULED',
      notes: 'Vine cu soțul. Discuție despre finanțare după.',
      feedbackScore: null,
      feedbackBody: null,
      cancelReason: null,
      createdAt: isoOffset(-1, 14, 0),
    },
    {
      id: 'S-3004',
      leadId: sample[3].leadId,
      propertyId: sample[3].propertyId,
      agentId: a,
      scheduledAt: isoOffset(-1, 12, 0),
      durationMin: 40,
      status: 'ATTENDED',
      notes: '',
      feedbackScore: 5,
      feedbackBody: 'Clientul foarte interesat. Vrea să facă ofertă imediat.',
      cancelReason: null,
      createdAt: isoOffset(-3, 9, 0),
    },
    {
      id: 'S-3005',
      leadId: sample[4].leadId,
      propertyId: sample[4].propertyId,
      agentId: a,
      scheduledAt: isoOffset(-2, 15, 30),
      durationMin: 30,
      status: 'ATTENDED',
      notes: '',
      feedbackScore: 3,
      feedbackBody: 'Etajul prea jos, vrea ceva mai sus. Trimit alternative.',
      cancelReason: null,
      createdAt: isoOffset(-4, 11, 0),
    },
    {
      id: 'S-3006',
      leadId: sample[5].leadId,
      propertyId: sample[5].propertyId,
      agentId: a,
      scheduledAt: isoOffset(-3, 14, 0),
      durationMin: 0,
      status: 'NO_SHOW',
      notes: 'Nu a confirmat și nu a venit. Sun mâine să verific.',
      feedbackScore: null,
      feedbackBody: null,
      cancelReason: null,
      createdAt: isoOffset(-5, 10, 0),
    },
  ];
}
