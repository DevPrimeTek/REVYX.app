// M0.S3 · T-M0.S3-03 · Mock agents (8) · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)

import type { Agent } from './types';

export const agents: readonly Agent[] = [
  { id: 'A-001', name: 'Andrei Caraman',  aps: 0.84, trust: 0.81, activeTasks: 2, closedDeals30d: 7,  tenure: 730 },
  { id: 'A-002', name: 'Doina Cebotari',  aps: 0.79, trust: 0.74, activeTasks: 1, closedDeals30d: 5,  tenure: 540 },
  { id: 'A-003', name: 'Sergiu Pîrlog',   aps: 0.71, trust: 0.68, activeTasks: 3, closedDeals30d: 4,  tenure: 410 },
  { id: 'A-004', name: 'Tatiana Movilă',  aps: 0.65, trust: 0.62, activeTasks: 0, closedDeals30d: 2,  tenure: 90  },
  { id: 'A-005', name: 'Vitalie Bostan',  aps: 0.77, trust: 0.72, activeTasks: 2, closedDeals30d: 6,  tenure: 620 },
  { id: 'A-006', name: 'Cristina Lupu',   aps: 0.69, trust: 0.66, activeTasks: 1, closedDeals30d: 3,  tenure: 180 },
  { id: 'A-007', name: 'Pavel Rotari',    aps: 0.58, trust: 0.55, activeTasks: 2, closedDeals30d: 1,  tenure: 45  }, // BR-11 APS_default 0.65 floor (here higher tenure but lower perf)
  { id: 'A-008', name: 'Mihaela Gîscă',   aps: 0.82, trust: 0.79, activeTasks: 1, closedDeals30d: 8,  tenure: 850 },
];
