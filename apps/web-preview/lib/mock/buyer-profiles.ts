// M0.S8 · Seed buyer profiles for the public marketplace (alongside lead intake).

import type { BuyerProfile } from './transactions-types';

function iso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function mask(s: string): string {
  if (s.length <= 2) return s + '****';
  return s[0] + '****' + s.slice(-1);
}

function maskPhone(p: string): string {
  return p.slice(0, 6) + '*** ' + p.slice(-3);
}

export const buyerProfiles: readonly BuyerProfile[] = [
  {
    id: 'BUY-7001',
    city: 'Chișinău',
    zone: 'Centru',
    propertyKind: 'apartment',
    rooms: '2',
    budgetMin: 55_000,
    budgetMax: 75_000,
    urgency: 'high',
    features: ['balcon', 'parcare', 'lift'],
    tier: 'PREMIUM',
    status: 'ACTIVE',
    publishedAt: iso(-12),
    expiresAt: iso(18),
    maskedName: 'M****a',
    maskedPhone: '+373 7** *** 432',
    fullName: 'Maria Popescu',
    phone: '+373 79 123 432',
    email: 'maria.popescu@example.md',
  },
  {
    id: 'BUY-7002',
    city: 'Chișinău',
    zone: 'Botanica',
    propertyKind: 'apartment',
    rooms: '3',
    budgetMin: 75_000,
    budgetMax: 100_000,
    urgency: 'medium',
    features: ['încălzire autonomă', 'parcare'],
    tier: 'PRO',
    status: 'ACTIVE',
    publishedAt: iso(-25),
    expiresAt: iso(5),
    maskedName: 'A****e',
    maskedPhone: '+373 6** *** 718',
    fullName: 'Andrei Ciobanu',
    phone: '+373 60 555 718',
    email: 'andrei.ciobanu@example.md',
  },
  {
    id: 'BUY-7003',
    city: 'Chișinău',
    zone: 'Rîșcani',
    propertyKind: 'house',
    rooms: '4',
    budgetMin: 140_000,
    budgetMax: 180_000,
    urgency: 'low',
    features: ['curte', 'garaj', 'gradină mare'],
    tier: 'PREMIUM',
    status: 'ACTIVE',
    publishedAt: iso(-5),
    expiresAt: iso(25),
    maskedName: 'I****n',
    maskedPhone: '+373 7** *** 091',
    fullName: 'Ion Munteanu',
    phone: '+373 79 802 091',
    email: 'ion.munteanu@example.md',
  },
  {
    id: 'BUY-7004',
    city: 'Chișinău',
    zone: 'Buiucani',
    propertyKind: 'apartment',
    rooms: '1',
    budgetMin: 35_000,
    budgetMax: 48_000,
    urgency: 'high',
    features: ['lift', 'aproape de metrou'],
    tier: 'FREE',
    status: 'ACTIVE',
    publishedAt: iso(-2),
    expiresAt: iso(28),
    maskedName: 'E****a',
    maskedPhone: '+373 7** *** 224',
    fullName: 'Elena Rotari',
    phone: '+373 78 410 224',
    email: 'elena.rotari@example.md',
  },
  {
    id: 'BUY-7005',
    city: 'Bălți',
    zone: 'Centru',
    propertyKind: 'commercial',
    rooms: '0',
    budgetMin: 90_000,
    budgetMax: 130_000,
    urgency: 'medium',
    features: ['fațadă stradală', 'parcare proprie'],
    tier: 'PREMIUM',
    status: 'ACTIVE',
    publishedAt: iso(-9),
    expiresAt: iso(21),
    maskedName: 'V****e',
    maskedPhone: '+373 6** *** 567',
    fullName: 'Vitalie Stratan',
    phone: '+373 69 877 567',
    email: 'vitalie.stratan@example.md',
  },
  {
    id: 'BUY-7006',
    city: 'Chișinău',
    zone: 'Ciocana',
    propertyKind: 'land',
    rooms: '0',
    budgetMin: 25_000,
    budgetMax: 45_000,
    urgency: 'low',
    features: ['intravilan', 'utilități la limită'],
    tier: 'PRO',
    status: 'ACTIVE',
    publishedAt: iso(-18),
    expiresAt: iso(12),
    maskedName: 'D****n',
    maskedPhone: '+373 7** *** 901',
    fullName: 'Dorin Caraman',
    phone: '+373 78 220 901',
    email: 'dorin.caraman@example.md',
  },
];

export const buyerProfilesById = new Map(buyerProfiles.map((b) => [b.id, b]));
