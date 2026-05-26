// M0.S8 · Seed offers — multi-round chains so demo shows accept/counter/reject.

import type { Offer } from './transactions-types';
import { deals } from './deals';

function isoOffset(days: number, hour = 12): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function buildSeedOffers(): Offer[] {
  const offer = deals.find((d) => d.stage === 'offer');
  const neg = deals.find((d) => d.stage === 'negotiation');
  const closing = deals.find((d) => d.stage === 'closing');
  const won = deals.find((d) => d.stage === 'won');
  const out: Offer[] = [];

  if (offer) {
    out.push({
      id: 'O-5001',
      dealId: offer.id,
      parentId: null,
      side: 'buyer',
      amountEur: 78_000,
      conditions: 'Plata integrală în 30 zile. Mobilier inclus.',
      status: 'PENDING',
      expiresAt: isoOffset(3),
      createdAt: isoOffset(-1),
      createdByName: 'Andrei Cojocaru',
      needsManagerApproval: false,
    });
  }
  if (neg) {
    out.push(
      {
        id: 'O-5010',
        dealId: neg.id,
        parentId: null,
        side: 'buyer',
        amountEur: 92_000,
        conditions: 'Avans 10%. Restul prin credit ipotecar.',
        status: 'COUNTER',
        expiresAt: isoOffset(-3),
        createdAt: isoOffset(-7),
        createdByName: 'Andrei Cojocaru',
        needsManagerApproval: false,
      },
      {
        id: 'O-5011',
        dealId: neg.id,
        parentId: 'O-5010',
        side: 'seller',
        amountEur: 96_500,
        conditions: 'Avans 15% în 5 zile. Mobilier neinclus.',
        status: 'COUNTER',
        expiresAt: isoOffset(-1),
        createdAt: isoOffset(-5),
        createdByName: 'Maria Stoian',
        needsManagerApproval: false,
      },
      {
        id: 'O-5012',
        dealId: neg.id,
        parentId: 'O-5011',
        side: 'buyer',
        amountEur: 94_500,
        conditions: 'Avans 12% în 5 zile. Cu mobilier de bucătărie.',
        status: 'PENDING',
        expiresAt: isoOffset(2),
        createdAt: isoOffset(-1),
        createdByName: 'Andrei Cojocaru',
        needsManagerApproval: true,
      },
    );
  }
  if (closing) {
    out.push(
      {
        id: 'O-5020',
        dealId: closing.id,
        parentId: null,
        side: 'buyer',
        amountEur: 105_000,
        conditions: 'Plata integrală. Predare în 60 zile.',
        status: 'COUNTER',
        expiresAt: isoOffset(-8),
        createdAt: isoOffset(-15),
        createdByName: 'Andrei Cojocaru',
        needsManagerApproval: false,
      },
      {
        id: 'O-5021',
        dealId: closing.id,
        parentId: 'O-5020',
        side: 'seller',
        amountEur: 108_000,
        conditions: 'Predare în 45 zile.',
        status: 'ACCEPTED',
        expiresAt: null,
        createdAt: isoOffset(-10),
        createdByName: 'Maria Stoian',
        needsManagerApproval: false,
      },
    );
  }
  if (won) {
    out.push({
      id: 'O-5030',
      dealId: won.id,
      parentId: null,
      side: 'buyer',
      amountEur: 145_000,
      conditions: 'Plata integrală cash + verificare cadastrală inclusă.',
      status: 'ACCEPTED',
      expiresAt: null,
      createdAt: isoOffset(-30),
      createdByName: 'Andrei Cojocaru',
      needsManagerApproval: false,
    });
  }

  return out;
}
