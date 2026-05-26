'use client';

// M0.S7 · Per-lead extras (free-text notes + simulated document attachments).
// localStorage persistence. M1.S5 will wire to apps/api/src/business/activities (note_added type)
// and the `documents` table (TECH_SPEC_REVYX_deal-closure §4.3).

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'revyx.leadExtras.v1';

export type DocumentType =
  | 'identity_proof'
  | 'cadastre_extract'
  | 'contract_preliminary'
  | 'energy_certificate'
  | 'other';

export interface LeadNote {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
}

export interface LeadDocument {
  id: string;
  filename: string;
  documentType: DocumentType;
  sizeBytes: number;
  uploadedAt: string;
  uploaderName: string;
}

/** Buyer-only — agent edited preferences (extends base lead fields). */
export interface BuyerPreferences {
  features: string[];
  urgency: 'low' | 'medium' | 'high';
  preferredFloor: string;   // free-text: "etaj superior", "1-3"
  rememberedNote: string;   // 1-line memory pin
}

/** Seller-only — agent curated benefits highlighted on the property listing. */
export interface SellerBenefits {
  /** Override / supplement to property-benefits-store for this specific lead. */
  highlights: string[];
}

export interface LeadExtras {
  notes: LeadNote[];
  documents: LeadDocument[];
  preferences?: BuyerPreferences;
  benefits?: SellerBenefits;
}

type Store = Record<string, LeadExtras>;
type Listener = () => void;
const listeners = new Set<Listener>();

const EMPTY: LeadExtras = { notes: [], documents: [] };

let cache: Store | null = null;

function load(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}
function save(s: Store): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}
function ensure(): Store {
  if (cache === null) cache = load();
  return cache;
}
function notify(): void {
  for (const l of listeners) l();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getExtrasForLead(leadId: string): LeadExtras {
  return ensure()[leadId] ?? EMPTY;
}

export function addNote(leadId: string, body: string, authorName: string): void {
  const cur = ensure();
  const next = { ...cur };
  const extras = next[leadId] ?? { notes: [], documents: [] };
  const note: LeadNote = {
    id: `N-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    body,
    authorName,
    createdAt: new Date().toISOString(),
  };
  next[leadId] = { ...extras, notes: [note, ...extras.notes] };
  cache = next;
  save(cache);
  notify();
}

export function removeNote(leadId: string, noteId: string): void {
  const cur = ensure();
  const next = { ...cur };
  const extras = next[leadId];
  if (!extras) return;
  next[leadId] = { ...extras, notes: extras.notes.filter((n) => n.id !== noteId) };
  cache = next;
  save(cache);
  notify();
}

export function addDocument(
  leadId: string,
  input: { filename: string; documentType: DocumentType; sizeBytes: number; uploaderName: string },
): void {
  const cur = ensure();
  const next = { ...cur };
  const extras = next[leadId] ?? { notes: [], documents: [] };
  const doc: LeadDocument = {
    id: `D-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    filename: input.filename,
    documentType: input.documentType,
    sizeBytes: input.sizeBytes,
    uploadedAt: new Date().toISOString(),
    uploaderName: input.uploaderName,
  };
  next[leadId] = { ...extras, documents: [doc, ...extras.documents] };
  cache = next;
  save(cache);
  notify();
}

export function removeDocument(leadId: string, docId: string): void {
  const cur = ensure();
  const next = { ...cur };
  const extras = next[leadId];
  if (!extras) return;
  next[leadId] = { ...extras, documents: extras.documents.filter((d) => d.id !== docId) };
  cache = next;
  save(cache);
  notify();
}

export function setBuyerPreferences(leadId: string, prefs: BuyerPreferences): void {
  const cur = ensure();
  const next = { ...cur };
  const extras = next[leadId] ?? { notes: [], documents: [] };
  next[leadId] = { ...extras, preferences: prefs };
  cache = next;
  save(cache);
  notify();
}

export function setSellerBenefits(leadId: string, b: SellerBenefits): void {
  const cur = ensure();
  const next = { ...cur };
  const extras = next[leadId] ?? { notes: [], documents: [] };
  next[leadId] = { ...extras, benefits: b };
  cache = next;
  save(cache);
  notify();
}

export function useLeadExtras(leadId: string): LeadExtras {
  const all = useSyncExternalStore(
    subscribe,
    () => ensure(),
    () => ({} as Store),
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    cache = load();
    notify();
  }, []);
  return all[leadId] ?? EMPTY;
}
