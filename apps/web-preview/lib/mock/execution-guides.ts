// Val 1 (AGI §18.3) · Execution Guides — „Cum fac asta?" scripturi de teren.
// VISUAL SKELETON: conținut RO seed din documentele de teren (scenariu apel vânzători,
// check-list prima intrare, justificare comision). RU/EN deferred (ca M0.S8).
// STRUCTURĂ AVANSATĂ (datorie urmărită): mutare conținut în entitate `execution_guides`
// editabilă per tenant + variabile completate din context real (M1.S4 NBA engine).

import type { TaskType } from './tasks';
import type { LeadType } from './types';

export interface GuideObjection {
  /** Ce spune clientul (obiecția). */
  says: string;
  /** Răspunsul recomandat al agentului. */
  reply: string;
}

export interface ExecutionGuide {
  /** O frază: ce urmărim cu această acțiune. */
  goal: string;
  /** Pașii concreți, în ordine. */
  steps: string[];
  /** Obiecții frecvente + răspuns (ex: apel vânzători). Optional. */
  objections?: GuideObjection[];
  /** Notă de timing / ton. */
  tip?: string;
}

/** Cele 5 obiecții clasice la apelul către vânzători (scenariu de teren). */
const SELLER_CALL_OBJECTIONS: GuideObjection[] = [
  {
    says: '„Nu vreau să lucrez cu agenți."',
    reply:
      'Vă înțeleg perfect. Tocmai de aceea vreau să vă arăt concret ce fac diferit: aduc cumpărători verificați, nu curioși. Pot trece pe la dvs. 15 minute, fără nicio obligație?',
  },
  {
    says: '„Nu sunt interesat acum."',
    reply:
      'Corect, nu vă grăbesc. Vă las datele și o scurtă analiză de preț pentru zona dvs. — când decideți, aveți deja cifrele reale în mână.',
  },
  {
    says: '„Vând singur, fără agent."',
    reply:
      'Mulți încep așa. Întrebarea reală e: la ce preț și în cât timp? Vă arăt cu ce preț s-au vândut efectiv apartamentele similare — nu cu ce preț au fost listate.',
  },
  {
    says: '„Comisionul e prea mare."',
    reply:
      'Plătiți după ce vă rezolv nevoia, nu înainte. Un preț de listare corect + concentrarea cererii recuperează de obicei comisionul prin prețul final mai bun.',
  },
  {
    says: '„Nu am timp acum."',
    reply: 'De aceea sun scurt. Două minute: confirmăm doar dacă proprietatea e încă disponibilă și care e termenul dvs.',
  },
];

/** Check-list „Prima intrare în apartament" — cei 10 pași ai întâlnirii de calificare seller. */
export const SELLER_MEETING_STEPS: { title: string; script: string }[] = [
  { title: 'Unde ne așezăm + cine decide', script: 'Identifică decision-makerul real și notează datele exacte ale apartamentului.' },
  { title: 'Motivația reală', script: 'De ce vinde? De cât timp? Cine a mai văzut? Au fost oferte refuzate?' },
  { title: 'Experiența cu agenți', script: 'Ce așteaptă de la un agent? Ce nu i-a plăcut data trecută?' },
  { title: 'Formarea nevoii', script: 'Clarifică exact de ce are nevoie de la tine — nu presupune.' },
  { title: 'Diferențierea („Бабочка продаж")', script: 'Arată graficul Cerere–Ofertă + planul de marketing + comparația Agenți vs Cumpărători + poziționarea de preț.' },
  { title: 'Întrebări-catalizator', script: 'Prețul minim acceptat? Cum a ajuns la concluzie? Ce se întâmplă dacă nu primește banii la termen?' },
  { title: 'Verdict (Da / Nu)', script: 'Da → „suntem o echipă!". Nu → „nu vă pot ajuta în condițiile acestea".' },
  { title: 'Reputație profesională', script: 'Profesionalismul = cunoaștere impecabilă a pieței. Demonstreaz-o cu cifre reale.' },
  { title: 'Inspecția ca un cumpărător', script: 'Parcurge apartamentul din ochii cumpărătorului — notează ce respinge / ce atrage.' },
  { title: 'La ieșire', script: '„Voi vinde la cel mai bun preț!" → pregătești analiza de piață + planul de marketing + programezi semnarea mandatului la oficiu.' },
];

const DEMAND_GUIDES: Partial<Record<TaskType, ExecutionGuide>> = {
  first_contact: {
    goal: 'Stabilește contactul în primele 15 minute și califică rapid nevoia reală.',
    steps: [
      'Salută + prezintă-te + confirmă de unde a venit cererea.',
      'Întreabă ce caută concret: zonă, număr de camere, termen de mutare.',
      'Verifică bugetul real (nu doar cel declarat) — vezi „Profil de nevoi".',
      'Propune un pas concret: o vizionare sau trimiterea a 3-5 proprietăți.',
    ],
    tip: 'Tonul: prietenos și sigur. Primele 15 minute decid dacă lead-ul rămâne cald.',
  },
  schedule_showing: {
    goal: 'Transformă interesul în vizionare programată la proprietăți potrivite.',
    steps: [
      'Alege 2-3 proprietăți care se potrivesc cu bugetul confirmat + criteriile necompromisabile.',
      'Propune 2 intervale orare concrete (nu „când puteți").',
      'Confirmă adresa + ce documente să aducă clientul.',
      'Pregătește pentru fiecare proprietate 3 argumente cheie de prezentat la fața locului.',
    ],
  },
  send_property: {
    goal: 'Trimite o selecție scurtă și relevantă, nu o listă lungă.',
    steps: [
      'Maxim 3-5 proprietăți — calitate, nu cantitate.',
      'Pentru fiecare, scrie o frază: de ce se potrivește acestui client.',
      'Cere feedback rapid: „Care vă atrage cel mai mult?" — calibrează preferințele.',
    ],
  },
  follow_up: {
    goal: 'Menține relația caldă fără să fii intruziv.',
    steps: ['Un mesaj scurt, personal — referă-te la ultima discuție.', 'Adu o noutate utilă (proprietate nouă, schimbare de preț în zonă).', 'Închide cu o întrebare deschisă.'],
  },
};

const SUPPLY_GUIDES: Partial<Record<TaskType, ExecutionGuide>> = {
  first_contact: {
    goal: 'Confirmă listarea, stabilește intenția reală de vânzare și propune întâlnirea de evaluare.',
    steps: [
      'Salută + identifică proprietatea exactă din anunț.',
      'Confirmă dacă mai e disponibilă și care e termenul vânzătorului.',
      'Califică nevoia: de ce vinde, de cât timp, ce preț are în minte.',
      'Propune o întâlnire cu analiză de piață (ACM) la fața locului.',
    ],
    objections: SELLER_CALL_OBJECTIONS,
    tip: 'Obiecțiile sunt normale — ai răspunsul pregătit pentru fiecare (vezi mai jos).',
  },
  request_documents: {
    goal: 'Colectează tot ce e nevoie pentru a putea promova legal și eficient.',
    steps: [
      'Mandat de exclusivitate semnat (fără mandat → fără cooperare MLS).',
      'Extras cadastral + actele de proprietate.',
      'Acordul scris pentru fotografie profesională.',
      '6-8 fotografii recente, apartament curat și aranjat.',
    ],
  },
  draft_offer: {
    goal: 'Pune termenii agreați verbal într-o ofertă scrisă clară.',
    steps: ['Preț + condiții + termen, scrise explicit.', 'Confirmă cine semnează și când.', 'Trimite în scris și păstrează o copie în dosarul tranzacției.'],
  },
  close_deal: {
    goal: 'Gestionează obiecția de preț fără să pierzi tranzacția (anti-torg).',
    steps: [
      '„Este dreptul dvs. să negociați, dar permiteți-mi să vă arăt de ce acesta e cel mai bun raport preț-calitate."',
      'Concentrează-te pe pierderea oportunității, nu pe cedarea prețului.',
      'Folosește comparativul vânzări reale vs prețuri listate.',
    ],
  },
  follow_up: {
    goal: 'Raportează vânzătorului progresul (obligație din mandat).',
    steps: ['Câte vizionări + ce feedback.', 'Ce ajustare propui (preț / prezentare).', 'Următorul pas concret.'],
  },
};

const FALLBACK: ExecutionGuide = {
  goal: 'Acțiunea recomandată de sistem pentru acest lead.',
  steps: ['Pregătește contextul lead-ului.', 'Execută acțiunea.', 'Notează rezultatul în „Note despre client".'],
};

export function guideFor(taskType: TaskType, leadType: LeadType): ExecutionGuide {
  const isSupply = leadType === 'seller' || leadType === 'landlord';
  const table = isSupply ? SUPPLY_GUIDES : DEMAND_GUIDES;
  return table[taskType] ?? FALLBACK;
}
