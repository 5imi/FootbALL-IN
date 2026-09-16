import { Player } from './types';

export type PenaltyDirection = 
  | 'Stânga sus'
  | 'Stânga jos'
  | 'Mijloc'
  | 'Dreapta sus'
  | 'Dreapta jos'
  | 'La întâmplare';

export const PENALTY_DIRECTIONS: PenaltyDirection[] = [
  'Stânga sus',
  'Stânga jos',
  'Mijloc',
  'Dreapta sus',
  'Dreapta jos',
  'La întâmplare',
];

export interface PenaltyConfig {
  kicks: PenaltyDirection[]; // 6 direcții lovituri
  saves: PenaltyDirection[]; // 6 direcții apărare portar
  takersOrder: string[];     // ID-urile tuturor jucătorilor din lot în ordinea executării
}

export const DEFAULT_PENALTY_KICKS: PenaltyDirection[] = [
  'Stânga sus',
  'Stânga sus',
  'Stânga sus',
  'Mijloc',
  'Dreapta sus',
  'La întâmplare',
];

export const DEFAULT_PENALTY_SAVES: PenaltyDirection[] = [
  'Stânga sus',
  'Dreapta jos',
  'Dreapta sus',
  'Stânga jos',
  'Dreapta sus',
  'La întâmplare',
];

const STORAGE_KEY = 'footballin_penalty_settings';

export function loadPenaltyConfig(teamId: string, squadPlayers: Player[]): PenaltyConfig {
  const fallbackOrder = squadPlayers.map(p => String(p.id));

  if (typeof window === 'undefined') {
    return {
      kicks: [...DEFAULT_PENALTY_KICKS],
      saves: [...DEFAULT_PENALTY_SAVES],
      takersOrder: fallbackOrder,
    };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${teamId}`) || localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: PenaltyConfig = JSON.parse(raw);
      
      // Asigurăm că toți jucătorii din lotul actual sunt prezenți în listă
      const existingIds = new Set(parsed.takersOrder || []);
      const mergedOrder = [...(parsed.takersOrder || [])];
      
      fallbackOrder.forEach(id => {
        if (!existingIds.has(id)) {
          mergedOrder.push(id);
        }
      });

      return {
        kicks: parsed.kicks?.length === 6 ? parsed.kicks : [...DEFAULT_PENALTY_KICKS],
        saves: parsed.saves?.length === 6 ? parsed.saves : [...DEFAULT_PENALTY_SAVES],
        takersOrder: mergedOrder,
      };
    }
  } catch (err) {
    console.error('Eroare la citire setări penalty:', err);
  }

  return {
    kicks: [...DEFAULT_PENALTY_KICKS],
    saves: [...DEFAULT_PENALTY_SAVES],
    takersOrder: fallbackOrder,
  };
}

export function savePenaltyConfig(teamId: string, config: PenaltyConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(config);
    localStorage.setItem(`${STORAGE_KEY}_${teamId}`, json);
    localStorage.setItem(STORAGE_KEY, json); // fallback global
  } catch (err) {
    console.error('Eroare la salvare setări penalty:', err);
  }
}
