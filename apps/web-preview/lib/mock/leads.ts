// M0.S3 · T-M0.S3-04 · 100 mock leads with realistic LS distribution · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// BR-01 Lead Firewall: only LS >= 0.60 + valid contact reach agents.
// BR-02 LS_initial = 0.30 on creation.

import { makeRng } from './rng';
import type { Lead, LeadSource, LeadStatus, LeadUrgency, LeadType, PreferenceSnapshot } from './types';
import { agents } from './agents';

const firstNames = [
  'Maria', 'Andrei', 'Ion', 'Elena', 'Mihai', 'Olga', 'Vitalie', 'Cristina', 'Pavel', 'Tatiana',
  'Doina', 'Sergiu', 'Ana', 'Vlad', 'Diana', 'Nicolae', 'Irina', 'Alexandru', 'Natalia', 'Iurie',
  'Lilia', 'Petru', 'Aurelia', 'Radu', 'Veronica', 'Dorin', 'Stela', 'Eugen', 'Lidia', 'Octavian',
  'Liubov', 'Igor', 'Sofia', 'Boris', 'Galina', 'Roman', 'Svetlana', 'Dmitri', 'Liudmila', 'Anton',
];
const lastNames = [
  'Popescu', 'Bodiu', 'Cojocaru', 'Rusu', 'Țurcanu', 'Ciobanu', 'Mocanu', 'Lupu', 'Gîscă', 'Caraman',
  'Cebotari', 'Pîrlog', 'Movilă', 'Bostan', 'Rotari', 'Bejan', 'Ursu', 'Vrabie', 'Olaru', 'Stratan',
  'Munteanu', 'Botnari', 'Andronic', 'Ștefan', 'Iordan', 'Cernei', 'Crudu', 'Cazacu', 'Damian', 'Roșca',
];
const sources: LeadSource[] = ['Meta', 'OLX', 'Google', 'Referral', 'Walk-in', 'Website'];
const buyerFeatures = [
  'balcon', 'parcare', 'lift', 'încălzire autonomă', 'aproape de școală',
  'aproape de metrou', 'etaj superior', 'orientare sud', 'mobilat',
  'finisaj nou', 'curte proprie', 'liniștit', 'aproape de parc',
];
const sellerFeatures = [
  'apartament reabilitat 2024', 'mobilat complet', 'gata de mutat',
  'vedere panoramică', 'zonă liniștită', 'aer condiționat',
  'parchet stejar', 'încălzire în pardoseală', 'geamuri termopan',
];
// Regula 20 — chiriaș (tenant): preferințe orientate spre confort imediat + flexibilitate.
const tenantFeatures = [
  'mobilat complet', 'utilități incluse', 'permite animale', 'aproape de transport',
  'aproape de universitate', 'parcare proprie', 'internet inclus',
  'aer condiționat', 'mașină de spălat', 'aproape de centru',
];
// Regula 20 — proprietar (landlord): puncte forte ale ofertei de chirie.
const landlordFeatures = [
  'mobilat complet', 'utilități parțial incluse', 'parcare în curte',
  'liniștit · vecini calmi', 'apartament renovat 2025', 'aer condiționat',
  'mașină de spălat + uscător', 'aproape de școală + parc',
];
const urgencies: LeadUrgency[] = ['low', 'medium', 'high'];
const zones = [
  'Chișinău · Centru',
  'Chișinău · Botanica',
  'Chișinău · Rîșcani',
  'Chișinău · Buiucani',
  'Chișinău · Ciocana',
  'Chișinău · Telecentru',
  'Bălți',
  'Cahul',
];

function statusFromLs(ls: number): LeadStatus {
  if (ls >= 0.75) return 'HOT';
  if (ls >= 0.60) return 'qualified';
  if (ls >= 0.40) return 'warm';
  return 'nurturing';
}
function slaFromStatus(s: LeadStatus): string {
  switch (s) {
    case 'HOT': return '15m';
    case 'qualified': return '2h';
    case 'warm': return '24h';
    default: return '—';
  }
}

// Target distribution across 100 leads (calibrated for demo realism):
// - HOT (LS ≥ 0.75):      ~12%
// - qualified (0.60–0.75): ~22%
// - warm (0.40–0.60):     ~36%
// - nurturing (< 0.40):    ~30%  (BR-01 firewall: NOT routed to agents)

/** Generate 4 distinct property IDs from the same seeded pool used by properties.ts (P-1901..P-1950). */
function pickPropertyId(rng: ReturnType<typeof makeRng>): string {
  return `P-${String(1900 + rng.int(1, 50)).padStart(4, '0')}`;
}

function pickFeatures(pool: string[], rng: ReturnType<typeof makeRng>, count: number): string[] {
  const picked = new Set<string>();
  let guard = 0;
  while (picked.size < count && guard < 30) {
    picked.add(rng.pick(pool));
    guard += 1;
  }
  return Array.from(picked);
}

function buildLeads(): Lead[] {
  const rng = makeRng('revyx.leads.v1');
  const out: Lead[] = [];
  const today = new Date('2026-05-17');

  for (let i = 1; i <= 100; i++) {
    const bucket = rng.next();
    let ls: number;
    if (bucket < 0.12) ls = rng.range(0.75, 0.95);
    else if (bucket < 0.34) ls = rng.range(0.60, 0.749);
    else if (bucket < 0.70) ls = rng.range(0.40, 0.599);
    else ls = rng.range(0.20, 0.399);
    ls = Math.round(ls * 100) / 100;

    const status = statusFromLs(ls);
    const sla = slaFromStatus(status);
    const first = rng.pick(firstNames);
    const last = rng.pick(lastNames);
    const source = rng.pick(sources);
    const zone = rng.pick(zones);

    // Lead type distribution (Regula 20):
    //   buyer    ~48%  · seller  ~22%  · tenant ~22%  · landlord ~8%
    // Sale market e mai mare în piața RM; chiria reprezintă ~30% din volum total.
    const typeRoll = rng.next();
    const leadType: LeadType =
      typeRoll < 0.48 ? 'buyer' :
      typeRoll < 0.70 ? 'seller' :
      typeRoll < 0.92 ? 'tenant' :
      'landlord';

    const isRent = leadType === 'tenant' || leadType === 'landlord';

    // Budget bands derived from rooms preference. Semantics:
    //   sale (buyer/seller):   preț total EUR
    //   rent (tenant/landlord): chirie lunară EUR/lună
    const roomsKey = rng.pick(['1', '2', '3', '3+']);
    let budgetMin: number;
    let budgetMax: number;
    if (isRent) {
      const baseRent =
        roomsKey === '1' ? 250 :
        roomsKey === '2' ? 380 :
        roomsKey === '3' ? 520 : 700;
      budgetMin = baseRent + rng.int(0, 100);
      budgetMax = budgetMin + rng.int(80, 250);
    } else {
      const baseMin =
        roomsKey === '1' ? 30000 :
        roomsKey === '2' ? 50000 :
        roomsKey === '3' ? 70000 : 90000;
      budgetMin = baseMin + rng.int(0, 10000);
      budgetMax = budgetMin + rng.int(10000, 25000);
    }

    // Agent assignment: only LS >= 0.60 routed to agents (BR-01 firewall).
    const agentId = status === 'nurturing' || status === 'warm' ? null :
      agents[rng.int(0, agents.length - 1)].id;

    const daysAgo = rng.int(0, 45);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const createdAt = d.toISOString().slice(0, 10);

    // Interaction Strength correlates loosely with LS.
    const is = Math.round((rng.clamp01(ls * 0.6 + rng.range(0, 0.35))) * 100) / 100;

    const urgency: LeadUrgency = rng.pick(urgencies);

    // Pick feature pool per lead kind.
    const featurePool =
      leadType === 'buyer' ? buyerFeatures :
      leadType === 'seller' ? sellerFeatures :
      leadType === 'tenant' ? tenantFeatures :
      landlordFeatures;

    // sellingPropertyId obligatoriu pentru supply (seller/landlord).
    const isSupply = leadType === 'seller' || leadType === 'landlord';

    // Rent period (luni): tenant alege 6/12/24; landlord oferă tipic 12.
    const rentPeriodMonths: number | null =
      leadType === 'tenant' ? rng.pick([6, 12, 12, 24]) :
      leadType === 'landlord' ? 12 :
      null;

    // [MOLDOVA-SPECIFIC] confirmedBudgetMax — buget confirmat față-în-față vs declarat la telefon.
    // HOT demand-side: confirmat ~85-95% din budgetMax (au discutat deja față-în-față).
    // qualified demand-side: ~50% au confirmat; warm/nurturing/supply: null.
    let confirmedBudgetMax: number | null = null;
    if (status === 'HOT' && !isSupply) {
      confirmedBudgetMax = Math.round(budgetMax * (0.85 + (i % 10) * 0.01));
    } else if (status === 'qualified' && !isSupply && i % 2 === 0) {
      confirmedBudgetMax = Math.round(budgetMax * (0.88 + (i % 5) * 0.015));
    }

    // [MOLDOVA-SPECIFIC] preferenceHistory — ~90% din clienți modifică preferințele după vizionări.
    // Populăm leads HOT și qualified selectate cu 2-3 modificări realiste.
    let preferenceHistory: PreferenceSnapshot[] = [];
    if (!isSupply && status === 'HOT' && i <= 15) {
      const d0 = new Date(createdAt);
      const d1 = new Date(d0); d1.setDate(d1.getDate() + 6);
      const d2 = new Date(d0); d2.setDate(d2.getDate() + 13);
      preferenceHistory = [
        {
          date: d0.toISOString().slice(0, 10),
          budgetMax,
          zone,
          rooms: roomsKey,
          features: pickFeatures(featurePool, rng, 2),
          changeNote: 'La telefon — preferințe inițiale',
        },
        {
          date: d1.toISOString().slice(0, 10),
          budgetMax: Math.round(budgetMax * 0.92),
          zone,
          rooms: roomsKey,
          features: pickFeatures(featurePool, rng, 2),
          changeNote: 'După vizionare — buget redus, acceptă altă zonă',
        },
        {
          date: d2.toISOString().slice(0, 10),
          budgetMax: Math.round(budgetMax * 0.95),
          zone: i % 3 === 0 ? 'Chișinău · Ciocana' : zone,
          rooms: i % 4 === 0 ? '3' : roomsKey,
          features: pickFeatures(featurePool, rng, 3),
          changeNote: 'Discuție financiară — credit ipotecar aprobat parțial',
        },
      ];
    } else if (!isSupply && status === 'qualified' && i >= 25 && i <= 40) {
      const d0 = new Date(createdAt);
      const d1 = new Date(d0); d1.setDate(d1.getDate() + 8);
      preferenceHistory = [
        {
          date: d0.toISOString().slice(0, 10),
          budgetMax,
          zone,
          rooms: roomsKey,
          features: pickFeatures(featurePool, rng, 2),
          changeNote: 'La telefon — preferințe inițiale',
        },
        {
          date: d1.toISOString().slice(0, 10),
          budgetMax: Math.round(budgetMax * 0.90),
          zone: i % 2 === 0 ? 'Chișinău · Botanica' : zone,
          rooms: roomsKey,
          features: pickFeatures(featurePool, rng, 3),
          changeNote: 'A văzut 4 apartamente — schimbă zona după vizionări',
        },
      ];
    }

    out.push({
      id: `L-${String(1000 + i).padStart(4, '0')}`,
      name: `${first} ${last}`,
      ls,
      status,
      source,
      sla,
      agentId,
      leadType,
      sellingPropertyId: isSupply ? pickPropertyId(rng) : null,
      features: pickFeatures(featurePool, rng, rng.int(2, 4)),
      urgency,
      budgetMin,
      budgetMax,
      rentPeriodMonths,
      confirmedBudgetMax,
      preferenceHistory,
      rooms: roomsKey,
      zone,
      createdAt,
      gdprConsent: true,
      is,
      needsReview: rng.next() < 0.08, // ~8% flagged after re-matching (BR-05)
    });
  }
  return out;
}

export const leads: readonly Lead[] = buildLeads();

export const leadsById = new Map(leads.map((l) => [l.id, l]));

export function leadsByStatus(): Record<LeadStatus, Lead[]> {
  const acc: Record<LeadStatus, Lead[]> = { HOT: [], qualified: [], warm: [], nurturing: [] };
  for (const l of leads) acc[l.status].push(l);
  return acc;
}
