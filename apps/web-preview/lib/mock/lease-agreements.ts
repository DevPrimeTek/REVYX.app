// M0.S8 · Regula 20 · Seed lease agreements pentru rental deals (chirie).
// Workflow simplificat (NU necesită notar real în RM pentru chirii sub 36 luni):
//   DRAFTED → REVIEWED → SIGNED_TENANT → SIGNED_LANDLORD → DEPOSIT_PAID → ACTIVE → ENDED.

import type { LeaseAgreement, LeaseAgreementStatus } from './transactions-types';
import { deals } from './deals';
import { leadsById } from './leads';
import { propertiesById } from './properties';

function iso(daysFromNow: number, hour = 14): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function addMonths(isoDate: string, months: number): string {
  const d = new Date(isoDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function buildSeedLeaseAgreements(): LeaseAgreement[] {
  const out: LeaseAgreement[] = [];

  for (const deal of deals) {
    const lead = leadsById.get(deal.leadId);
    const prop = propertiesById.get(deal.propertyId);
    if (!lead || !prop) continue;
    // Regula 20: lease agreements doar pentru rental deals (tenant/landlord).
    const isRent = lead.leadType === 'tenant' || lead.leadType === 'landlord';
    if (!isRent) continue;
    // Genereaza doar pentru deals avansate (negotiation/closing/won).
    if (deal.stage !== 'negotiation' && deal.stage !== 'closing' && deal.stage !== 'won') continue;

    const monthlyRentEur = prop.monthlyRentEur ?? 0;
    const depositEur = monthlyRentEur; // 1× chirie standard RM
    const periodMonths = lead.rentPeriodMonths ?? 12;

    if (deal.stage === 'negotiation') {
      // Contract pre-completat, în review.
      out.push({
        id: `LA-${deal.id.replace('D-', '')}`,
        dealId: deal.id,
        agentName: 'Andrei Cojocaru',
        draftedAt: iso(-3),
        signedAt: null,
        contractNumber: null,
        status: 'DRAFTED' as LeaseAgreementStatus,
        tenantName: lead.leadType === 'tenant' ? lead.name : 'Chiriaș interesat',
        landlordName: lead.leadType === 'landlord' ? lead.name : 'Proprietar',
        propertyAddr: prop.addr,
        monthlyRentEur,
        depositEur,
        periodMonths,
        startDate: null,
        endDate: null,
        depositPaidAt: null,
      });
    } else if (deal.stage === 'closing') {
      // Contract semnat de o parte, în așteptare depozit.
      const startDateIso = iso(7).slice(0, 10);
      out.push({
        id: `LA-${deal.id.replace('D-', '')}`,
        dealId: deal.id,
        agentName: 'Andrei Cojocaru',
        draftedAt: iso(-7),
        signedAt: iso(-2),
        contractNumber: `LA-2026-${5000 + Number(deal.id.slice(-3))}`,
        status: 'SIGNED_LANDLORD' as LeaseAgreementStatus,
        tenantName: lead.leadType === 'tenant' ? lead.name : 'Chiriaș Petrescu',
        landlordName: lead.leadType === 'landlord' ? lead.name : 'Familia Bostan',
        propertyAddr: prop.addr,
        monthlyRentEur,
        depositEur,
        periodMonths,
        startDate: startDateIso,
        endDate: addMonths(startDateIso, periodMonths),
        depositPaidAt: null,
      });
    } else {
      // won — contract activ, chiriaș s-a mutat.
      const startDateIso = iso(-10).slice(0, 10);
      out.push({
        id: `LA-${deal.id.replace('D-', '')}`,
        dealId: deal.id,
        agentName: 'Andrei Cojocaru',
        draftedAt: iso(-21),
        signedAt: iso(-14),
        contractNumber: `LA-2026-${5000 + Number(deal.id.slice(-3))}`,
        status: 'ACTIVE' as LeaseAgreementStatus,
        tenantName: lead.leadType === 'tenant' ? lead.name : 'Chiriaș Petrescu',
        landlordName: lead.leadType === 'landlord' ? lead.name : 'Familia Bostan',
        propertyAddr: prop.addr,
        monthlyRentEur,
        depositEur,
        periodMonths,
        startDate: startDateIso,
        endDate: addMonths(startDateIso, periodMonths),
        depositPaidAt: iso(-10),
      });
    }
  }

  return out;
}
