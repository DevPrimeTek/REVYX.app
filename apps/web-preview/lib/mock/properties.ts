// M0.S3 · T-M0.S3-04 · 50 mock properties with realistic PS/LF · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// LF (Listing Freshness) = 1 - min(1, days / 90)  per BRD §7.

import { makeRng } from './rng';
import type { Property, PropertyKind, ListingType } from './types';
import { agents } from './agents';

const streets = [
  'Str. București', 'Str. Mihai Eminescu', 'Bd. Ștefan cel Mare', 'Str. Pușkin',
  'Str. Alexandru cel Bun', 'Bd. Decebal', 'Bd. Dacia', 'Str. Tighina',
  'Str. Vasile Alecsandri', 'Str. Vlaicu Pîrcălab', 'Str. Columna', 'Bd. Renașterii',
  'Str. Armenească', 'Str. Sfatul Țării', 'Str. Bulgară',
];
const cities = ['Chișinău', 'Bălți', 'Cahul'];
const zones: Record<string, string[]> = {
  'Chișinău': ['Centru', 'Botanica', 'Rîșcani', 'Buiucani', 'Ciocana', 'Telecentru'],
  'Bălți':    ['Centru', 'Pămîntean', 'Slobozia'],
  'Cahul':    ['Centru', 'Periferie'],
};
const kinds: PropertyKind[] = ['apartment', 'apartment', 'apartment', 'house', 'land', 'commercial'];

function buildProperties(): Property[] {
  const rng = makeRng('revyx.properties.v1');
  const out: Property[] = [];

  for (let i = 1; i <= 50; i++) {
    const kind = rng.pick(kinds);
    const city = rng.pick(cities);
    const zone = rng.pick(zones[city]);
    const rooms =
      kind === 'land' || kind === 'commercial' ? 0 :
      kind === 'house' ? rng.int(3, 5) :
      rng.int(1, 4);
    const area =
      kind === 'land' ? rng.int(300, 1200) :
      kind === 'commercial' ? rng.int(60, 220) :
      kind === 'house' ? rng.int(90, 220) :
      rng.int(35, 120);

    // Price band per kind + city.
    const pricePerSqm =
      kind === 'land' ? rng.range(80, 250) :
      kind === 'commercial' ? rng.range(900, 1600) :
      city === 'Chișinău' ? rng.range(800, 1400) :
      rng.range(450, 800);
    const priceEur = Math.round((area * pricePerSqm) / 100) * 100;

    const daysOnMarket = rng.int(0, 180);
    const lf = Math.round((1 - Math.min(1, daysOnMarket / 90)) * 100) / 100;

    // PS distribution: 70% in [0.55, 0.90], 20% in [0.40, 0.55], 10% > 0.90.
    const psBucket = rng.next();
    const psRaw =
      psBucket < 0.10 ? rng.range(0.88, 0.96) :
      psBucket < 0.80 ? rng.range(0.55, 0.88) :
      rng.range(0.40, 0.55);
    const ps = Math.round(psRaw * 100) / 100;

    const street = rng.pick(streets);
    const num = rng.int(1, 120);
    const ap = kind === 'apartment' ? `, ap. ${rng.int(1, 80)}` : '';
    const addr = `${street} ${num}${ap}`;

    // Regula 20 — listingType distribution: 60% sale, 25% rent, 15% both.
    // Land + commercial gravitează spre sale; apartment + house pot fi orice.
    const ltRoll = rng.next();
    let listingType: ListingType;
    if (kind === 'land') {
      listingType = 'sale';
    } else if (kind === 'commercial') {
      listingType = ltRoll < 0.55 ? 'sale' : ltRoll < 0.90 ? 'rent' : 'both';
    } else {
      listingType = ltRoll < 0.60 ? 'sale' : ltRoll < 0.85 ? 'rent' : 'both';
    }

    // Chirie lunară estimată ~0.7% din preț (heuristic RM); ajustat per zonă.
    // Aplicăm doar dacă listingType include rent.
    const monthlyRentEur = (listingType === 'rent' || listingType === 'both')
      ? Math.round((priceEur * 0.0065 + rng.int(-30, 50)) / 10) * 10
      : null;

    // Regula 20: commission % negociat de agent la create (vizibil agent + client).
    // Sale|both → 2.0/2.5/3.0% mix. Rent → 50/75/100/125/150% din chirie lunară (100% = 1× chirie standard RM).
    const pctRoll = rng.next();
    const commissionPct =
      listingType === 'rent'
        ? (pctRoll < 0.15 ? 50 : pctRoll < 0.35 ? 75 : pctRoll < 0.80 ? 100 : pctRoll < 0.95 ? 125 : 150)
        : (pctRoll < 0.25 ? 2.0 : pctRoll < 0.80 ? 2.5 : 3.0);

    out.push({
      id: `P-${String(1900 + i).padStart(4, '0')}`,
      addr,
      city,
      zone,
      kind,
      rooms,
      area,
      priceEur: listingType === 'rent' ? 0 : priceEur,
      monthlyRentEur,
      commissionPct,
      listingType,
      ps,
      lf,
      daysOnMarket,
      ownerId: `O-${String(500 + i).padStart(4, '0')}`,
      agentId: agents[rng.int(0, agents.length - 1)].id,
    });
  }
  return out;
}

export const properties: readonly Property[] = buildProperties();
export const propertiesById = new Map(properties.map((p) => [p.id, p]));
