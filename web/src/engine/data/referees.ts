import { Referee } from '../types';

/**
 * Pool de arbitri cu atribute variate.
 * La fiecare meci, motorul alege aleatoriu un arbitru din acest pool.
 * 
 * Atribute:
 *   strictness  — Severitate (cartonașe, faulturi penalizate)
 *   integrity   — Rezistență la mită (90+ = incoruptibil)
 *   homeBias    — Tendința de a favoriza gazda sub presiunea tribunelor
 *   accuracy    — Precizia deciziilor (ofsaid limită, henț)
 *   experience  — Experiență la meciuri de presiune
 */
export const refereePool: Referee[] = [
  {
    id: 'ref-1',
    name: 'Ion Crăciunescu',
    strictness: 78,
    integrity: 95,    // Incoruptibil — veteran cu principii
    homeBias: 8,
    accuracy: 88,
    experience: 95,
  },
  {
    id: 'ref-2',
    name: 'Ovidiu Hațegan',
    strictness: 72,
    integrity: 88,
    homeBias: 12,
    accuracy: 85,
    experience: 85,
  },
  {
    id: 'ref-3',
    name: 'István Kovács',
    strictness: 80,
    integrity: 92,
    homeBias: 6,
    accuracy: 90,
    experience: 80,
  },
  {
    id: 'ref-4',
    name: 'Radu Petrescu',
    strictness: 65,
    integrity: 70,    // Șovăielnic — poate fi convins cu sume mari
    homeBias: 22,
    accuracy: 72,
    experience: 60,
  },
  {
    id: 'ref-5',
    name: 'Sebastian Colțescu',
    strictness: 58,
    integrity: 55,    // Vulnerabil — susceptibil la presiune
    homeBias: 35,
    accuracy: 65,
    experience: 50,
  },
  {
    id: 'ref-6',
    name: 'Marcel Bîrsan',
    strictness: 70,
    integrity: 62,
    homeBias: 28,
    accuracy: 68,
    experience: 55,
  },
  {
    id: 'ref-7',
    name: 'Horea Mladinovici',
    strictness: 50,
    integrity: 38,    // Cumpărabil — integritate foarte scăzută
    homeBias: 40,
    accuracy: 55,
    experience: 35,
  },
  {
    id: 'ref-8',
    name: 'Andrei Florin Chivulete',
    strictness: 85,
    integrity: 82,
    homeBias: 10,
    accuracy: 80,
    experience: 45,
  },
];

/**
 * Selectează un arbitru aleatoriu din pool pe baza RNG-ului deterministic.
 */
export function pickReferee(rngValue: number): Referee {
  const index = Math.floor(rngValue * refereePool.length);
  return refereePool[Math.min(index, refereePool.length - 1)];
}
