import { 
  Player, 
  PositionType, 
  SkillName, 
  PlayerSkills, 
  SkillDetail,
  SquadAssignment,
  FootType
} from './types';

/**
 * Atribute principale (Key Skills) pe fiecare post conform SoccerProject:
 * Fiecare post are 2 atribute primare majore (Bold) și până la 2 secundare.
 */
export const POSITION_PRIMARY_SKILLS: Record<PositionType, { primary: SkillName[]; secondary: SkillName[] }> = {
  GK: {
    primary: ['vision', 'clearance'], // vision = reflexe, clearance = respingeri/plonjon
    secondary: ['strength', 'stamina']
  },
  LB: {
    primary: ['tackling', 'heading'],
    secondary: ['speed', 'passing']
  },
  CB: {
    primary: ['tackling', 'heading'],
    secondary: ['strength', 'clearance']
  },
  RB: {
    primary: ['tackling', 'heading'],
    secondary: ['speed', 'passing']
  },
  LM: {
    primary: ['passing', 'speed'],
    secondary: ['technique', 'vision']
  },
  CM: {
    primary: ['passing', 'vision'],
    secondary: ['tackling', 'shooting']
  },
  RM: {
    primary: ['passing', 'speed'],
    secondary: ['technique', 'vision']
  },
  LF: {
    primary: ['shooting', 'speed'],
    secondary: ['technique', 'heading']
  },
  CF: {
    primary: ['shooting', 'heading'],
    secondary: ['speed', 'strength']
  },
  RF: {
    primary: ['shooting', 'speed'],
    secondary: ['technique', 'heading']
  }
};

/**
 * Generează un jucător conform standardelor SoccerProject:
 * - maxCap garantat >= 50% pentru oricare atribut
 * - Tinerii (17-19 ani) încep cu atribute mici (0-15%), dar au potențial de creștere
 * - Veteranii (28-32 ani) au atributele aproape de plafon sau plafonate (roșii)
 */
export function generateSPPlayer(params: {
  id: string;
  name: string;
  nickname?: string;
  number: number;
  position: PositionType;
  age: number;
  tier: 'YOUTH' | 'REGULAR' | 'STAR' | 'VETERAN';
  squad?: SquadAssignment;
  foot?: FootType;
  height?: number;
  weight?: number;
}): Player {
  const { id, name, nickname, number, position, age, tier } = params;
  const squad = params.squad || (tier === 'YOUTH' ? 'C' : tier === 'STAR' ? 'A' : 'B');
  const preferredFoot = params.foot || (Math.random() > 0.25 ? 'R' : 'L');
  const height = params.height || (position === 'GK' || position === 'CB' ? 1.90 + Math.random() * 0.08 : 1.75 + Math.random() * 0.14);
  const weight = params.weight || Math.round(height * height * (22 + Math.random() * 3));

  const config = POSITION_PRIMARY_SKILLS[position];
  const allSkills: SkillName[] = [
    'stamina', 'speed', 'technique', 'passing', 'shooting', 
    'clearance', 'strength', 'heading', 'tackling', 'vision'
  ];

  const skills = {} as PlayerSkills;

  for (const skill of allSkills) {
    const isPrimary = config.primary.includes(skill);
    const isSecondary = config.secondary.includes(skill);

    // 1. Plafon genetic ascuns: MINIM 50% GARANTAT!
    let minCap = 50;
    let maxCapLimit = 75;

    if (tier === 'STAR') {
      minCap = isPrimary ? 88 : 75;
      maxCapLimit = isPrimary ? 99 : 92;
    } else if (tier === 'REGULAR') {
      minCap = isPrimary ? 70 : 55;
      maxCapLimit = isPrimary ? 86 : 78;
    } else if (tier === 'YOUTH') {
      minCap = isPrimary ? 65 : 50;
      maxCapLimit = isPrimary ? 88 : 74;
    } else if (tier === 'VETERAN') {
      minCap = isPrimary ? 78 : 60;
      maxCapLimit = isPrimary ? 92 : 82;
    }

    // Calcul plafon genetic
    const maxCap = Math.max(50, Math.min(99, Math.round(minCap + Math.random() * (maxCapLimit - minCap))));

    // 2. Valoare curentă în funcție de vârstă / antrenament
    let value = 0;
    if (tier === 'YOUTH') {
      // Tinerii încep de foarte jos (0 - 15%), dar atributele principale pot avea o bază nativă (până la 50-65%)
      value = isPrimary ? Math.round(30 + Math.random() * 35) : Math.round(Math.random() * 12);
    } else if (tier === 'STAR' || tier === 'VETERAN') {
      // Vedetele sunt aproape de plafon sau plafonate
      value = Math.min(maxCap, Math.round(maxCap - (Math.random() > 0.6 ? 0 : Math.random() * 5)));
    } else {
      // Jucător obișnuit în formare
      value = Math.min(maxCap, Math.round(maxCap * (0.65 + Math.random() * 0.35)));
    }

    const isTrainedMax = value >= maxCap;

    skills[skill] = {
      value,
      maxCap,
      isTrainedMax,
      isPrimary,
      isSecondary
    };
  }

  // Agresivitate nativă (Fixată genetic)
  const aggression = Math.round(15 + Math.random() * 75);

  // Experiență în funcție de vârstă și meciuri
  let experience = 0;
  if (age <= 18) {
    experience = Math.round(Math.random() * 5);
  } else if (age <= 21) {
    experience = Math.round(10 + Math.random() * 20);
  } else if (age <= 25) {
    experience = Math.round(35 + Math.random() * 40);
  } else {
    experience = Math.min(100, Math.round(75 + Math.random() * 25));
  }

  // Calitate Globală calculată din atribute ponderate + experiență
  const primaryAvg = config.primary.reduce((sum, s) => sum + skills[s].value, 0) / config.primary.length;
  const secondaryAvg = config.secondary.reduce((sum, s) => sum + skills[s].value, 0) / config.secondary.length;
  const otherSkills = allSkills.filter(s => !config.primary.includes(s) && !config.secondary.includes(s));
  const otherAvg = otherSkills.reduce((sum, s) => sum + skills[s].value, 0) / otherSkills.length;

  const weightedSkill = (primaryAvg * 0.50) + (secondaryAvg * 0.30) + (otherAvg * 0.20);
  const overallQuality = Math.round((weightedSkill * 0.85) + (experience * 0.15));

  const appearances = age < 20 ? Math.round(Math.random() * 15) : Math.round((age - 18) * 30 + Math.random() * 40);
  const goals = position === 'CF' || position === 'LF' || position === 'RF' 
    ? Math.round(appearances * (0.4 + Math.random() * 0.4)) 
    : Math.round(appearances * 0.05);

  return {
    id,
    name,
    nickname,
    number,
    position,
    preferredFoot,
    height: Number(height.toFixed(2)),
    weight,
    age,
    birthDate: `${Math.floor(1 + Math.random() * 28)} Oct 2026`,
    birthSeasonDay: Math.floor(1 + Math.random() * 63),
    condition: tier === 'YOUTH' ? 100 : Math.round(85 + Math.random() * 15),
    overallQuality,
    morale: tier === 'YOUTH' ? 60 : 100,
    aggression,
    experience,
    skills,
    squad,
    recentPerformances: [
      Math.round(overallQuality * 0.7 - 2 + Math.random() * 5),
      Math.round(overallQuality * 0.7 - 2 + Math.random() * 5),
      Math.round(overallQuality * 0.7 - 2 + Math.random() * 5),
      Math.round(overallQuality * 0.7 - 2 + Math.random() * 5),
      Math.round(overallQuality * 0.7 - 2 + Math.random() * 5),
    ],
    bestPerformance: Math.round(overallQuality * 0.8),
    seasonStats: {
      appearances: Math.min(appearances, 25),
      goals: Math.min(goals, 18),
      assists: Math.round(goals * 0.4),
      yellowCards: Math.round(Math.random() * 3),
      redCards: 0,
      injuries: Math.random() > 0.8 ? 1 : 0
    },
    careerStats: {
      appearances,
      goals,
      assists: Math.round(goals * 0.5),
      yellowCards: Math.round(appearances * 0.15),
      redCards: Math.round(appearances * 0.01),
      injuries: Math.round(appearances * 0.02)
    },
    lifeEvents: [],
    // Compatibilitate retroactivă
    overall: overallQuality,
    fitness: 100,
    form: 8
  };
}
