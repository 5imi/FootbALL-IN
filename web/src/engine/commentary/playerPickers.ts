import { Team } from '../types';

export interface PlayerPickers {
  pickAttacker: (team: Team) => string;
  pickMidfielder: (team: Team) => string;
  pickDefender: (team: Team) => string;
  pickGoalkeeper: (team: Team) => string;
}

/**
 * Creează funcții helper de selecție aleatorie a jucătorilor pe baza postului ocupat în primul 11.
 */
export function createPlayerPickers(rng: () => number): PlayerPickers {
  const pickAttacker = (team: Team): string => {
    const attacking = team.lineup.filter((p) =>
      ['CF', 'LF', 'RF', 'LM', 'RM'].includes(p.position)
    );
    if (attacking.length === 0) return team.lineup[0]?.name || 'Atacantul';
    return attacking[Math.floor(rng() * attacking.length)].name;
  };

  const pickMidfielder = (team: Team): string => {
    const mids = team.lineup.filter((p) =>
      ['CM', 'LM', 'RM'].includes(p.position)
    );
    if (mids.length === 0) return team.lineup[0]?.name || 'Mijlocașul';
    return mids[Math.floor(rng() * mids.length)].name;
  };

  const pickDefender = (team: Team): string => {
    const defs = team.lineup.filter((p) =>
      ['CB', 'LB', 'RB'].includes(p.position)
    );
    if (defs.length === 0) return team.lineup[0]?.name || 'Fundașul';
    return defs[Math.floor(rng() * defs.length)].name;
  };

  const pickGoalkeeper = (team: Team): string => {
    const gk = team.lineup.find((p) => p.position === 'GK');
    return gk ? gk.name : 'Portarul';
  };

  return { pickAttacker, pickMidfielder, pickDefender, pickGoalkeeper };
}
