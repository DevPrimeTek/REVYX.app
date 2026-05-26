// M0.S3 · T-M0.S3-04 · 100 mock leads with realistic LS distribution · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// BR-01 Lead Firewall: only LS >= 0.60 + valid contact reach agents.
// BR-02 LS_initial = 0.30 on creation.

import { makeRng } from './rng';
import type { Lead, LeadSource, LeadStatus, LeadUrgency, LeadType } from './types';
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

    // Budget bands derived loosely from rooms preference.
    const roomsKey = rng.pick(['1', '2', '3', '3+']);
    const baseMin =
      roomsKey === '1' ? 30000 :
      roomsKey === '2' ? 50000 :
      roomsKey === '3' ? 70000 : 90000;
    const budgetMin = baseMin + rng.int(0, 10000);
    const budgetMax = budgetMin + rng.int(10000, 25000);

    // Agent assignment: only LS >= 0.60 routed to agents (BR-01 firewall).
    const agentId = status === 'nurturing' || status === 'warm' ? null :
      agents[rng.int(0, agents.length - 1)].id;

    const daysAgo = rng.int(0, 45);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const createdAt = d.toISOString().slice(0, 10);

    // Interaction Strength correlates loosely with LS.
    const is = Math.round((rng.clamp01(ls * 0.6 + rng.range(0, 0.35))) * 100) / 100;

    // ~70% buyers, 30% sellers (seller = vine cu o proprietate de vândut).
    const leadType: LeadType = rng.next() < 0.30 ? 'seller' : 'buyer';
    const urgency: LeadUrgency = rng.pick(urgencies);

    out.push({
      id: `L-${String(1000 + i).padStart(4, '0')}`,
      name: `${first} ${last}`,
      ls,
      status,
      source,
      sla,
      agentId,
      leadType,
      sellingPropertyId: leadType === 'seller' ? pickPropertyId(rng) : null,
      features: pickFeatures(leadType === 'seller' ? sellerFeatures : buyerFeatures, rng, rng.int(2, 4)),
      urgency,
      budgetMin,
      budgetMax,
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
