import { PositionType, Player, FootType, PlayerSkills, SkillName } from './types';

export type JuniorPersonality = 'AMBITIOUS' | 'BALANCED' | 'REBEL' | 'SHY' | 'ACADEMIC';

export interface YouthPlayer {
  id: string;
  name: string;
  age: number; // 15 - 18 ani
  position: PositionType;
  quality: number; // Calitate actuală 42 - 68%
  potential: number; // Potențial maxim 78 - 99%
  country: string;
  preferredFoot: FootType;
  personality: JuniorPersonality;
  
  // Triunghiul Echilibrului (Suma = 100%)
  schoolFocus: number; // Recomandat: 30%
  personalLifeFocus: number; // Recomandat: 30%
  trainingFocus: number; // Recomandat: 40%
  
  gbi: number; // Golden Balance Index (0 - 100%)
  destiny: string;
  destinyBadge: string;
  destinyColor: string;
  notes: string;
  promotedAt?: string;
}

export interface YouthAcademyState {
  juniors: YouthPlayer[];
  facilities: {
    trainingPitchesLevel: number; // 1 - 5
    dormitoryLevel: number;       // 1 - 5
    studyCenterLevel: number;     // 1 - 5
  };
  lastScoutedDay: number;
}

// Calculează GBI (Golden Balance Index) conform documentației oficiale
export function calculateGBI(school: number, life: number, training: number): {
  gbi: number;
  destiny: string;
  destinyBadge: string;
  destinyColor: string;
} {
  const diffSchool = Math.abs(school - 30);
  const diffLife = Math.abs(life - 30);
  const diffTraining = Math.abs(training - 40);
  const totalDev = diffSchool + diffLife + diffTraining;

  const gbi = Math.max(15, Math.min(100, Math.round(100 - totalDev * 0.95)));

  if (gbi >= 92) {
    return {
      gbi,
      destiny: 'Super-Vedetă Mondială (Generational Talent): Minte strălucită, suport emoțional solid și tehnică de elită. Șanse de 95% de a atinge potențialul maxim!',
      destinyBadge: '🌟 Super-Vedetă',
      destinyColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    };
  } else if (gbi >= 76) {
    return {
      gbi,
      destiny: 'Titular Solid de Divizia A: Jucător de bază, profesionist matur, rezistent la stres și accidentări rare.',
      destinyBadge: '🛡️ Titular Solid',
      destinyColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    };
  } else if (training >= 60) {
    return {
      gbi,
      destiny: 'Promisiune Măcinată de Accidentări: Forțat excesiv fizic în adolescență fără recuperare; risc ridicat de leziuni articulare.',
      destinyBadge: '⚠️ Risc Accidentări',
      destinyColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    };
  } else if (life >= 50) {
    return {
      gbi,
      destiny: 'Talent Irosit (Party Boy): Calități native impresionante, dar distras de tentații extra-fotbalistice și viață de noapte.',
      destinyBadge: '🍸 Party Boy',
      destinyColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    };
  } else if (school >= 50) {
    return {
      gbi,
      destiny: 'Tocilarul Fără Vlagă: Înțelege geometria jocului magistral, dar îi lipsește forța de impact în duelurile fizice.',
      destinyBadge: '📚 Teoretician',
      destinyColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    };
  }

  return {
    gbi,
    destiny: 'Jucător de Rotație: Talent modest cu evoluții inconstante, potrivit pentru meciurile de cupă sau ligi secunde.',
    destinyBadge: '🔄 Jucător Rotație',
    destinyColor: 'text-zinc-400 bg-zinc-800/40 border-zinc-700/50'
  };
}

export const INITIAL_YOUTH_PLAYERS: YouthPlayer[] = [
  {
    id: 'yp-1',
    name: 'Andrei Vlăduț',
    age: 16,
    position: 'CF',
    quality: 61,
    potential: 94,
    country: 'RO',
    preferredFoot: 'R',
    personality: 'AMBITIOUS',
    schoolFocus: 30,
    personalLifeFocus: 30,
    trainingFocus: 40,
    ...calculateGBI(30, 30, 40),
    notes: 'Viteză fulgerătoare și calm remarcabil în fața porții. Provine dintr-o familie de sportivi disciplinată.'
  },
  {
    id: 'yp-2',
    name: 'Matei Moldovan',
    age: 17,
    position: 'CM',
    quality: 58,
    potential: 89,
    country: 'RO',
    preferredFoot: 'L',
    personality: 'BALANCED',
    schoolFocus: 35,
    personalLifeFocus: 25,
    trainingFocus: 40,
    ...calculateGBI(35, 25, 40),
    notes: 'Stil Hagi: viziune tactică de excepție, pase filtrante teleghidate la 40 de metri.'
  },
  {
    id: 'yp-3',
    name: 'Rareș Bucur',
    age: 15,
    position: 'CB',
    quality: 52,
    potential: 88,
    country: 'RO',
    preferredFoot: 'R',
    personality: 'REBEL',
    schoolFocus: 15,
    personalLifeFocus: 20,
    trainingFocus: 65,
    ...calculateGBI(15, 20, 65),
    notes: 'Tackling necruțător, dar își pierde ușor cumpătul când este provocat. Are nevoie de consiliere educațională.'
  },
  {
    id: 'yp-4',
    name: 'Bogdan Stanciu',
    age: 16,
    position: 'GK',
    quality: 55,
    potential: 91,
    country: 'RO',
    preferredFoot: 'R',
    personality: 'ACADEMIC',
    schoolFocus: 30,
    personalLifeFocus: 30,
    trainingFocus: 40,
    ...calculateGBI(30, 30, 40),
    notes: 'Reflexe excelente pe linia porții. Premiant la matematică și fizică mecanică la liceu.'
  },
  {
    id: 'yp-5',
    name: 'Denis Ciobanu',
    age: 17,
    position: 'RM',
    quality: 56,
    potential: 86,
    country: 'RO',
    preferredFoot: 'R',
    personality: 'SHY',
    schoolFocus: 20,
    personalLifeFocus: 45,
    trainingFocus: 35,
    ...calculateGBI(20, 45, 35),
    notes: 'Centrări perfecte pe contra-atac. Emotiv în fața publicului mare.'
  }
];

const STORAGE_KEY_ACADEMY = 'footballin_youth_academy';

export function loadYouthAcademyState(): YouthAcademyState {
  if (typeof window === 'undefined') {
    return {
      juniors: INITIAL_YOUTH_PLAYERS,
      facilities: {
        trainingPitchesLevel: 2,
        dormitoryLevel: 2,
        studyCenterLevel: 2
      },
      lastScoutedDay: 1
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACADEMY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Eroare la încărcarea academiei de tineret:', err);
  }

  return {
    juniors: INITIAL_YOUTH_PLAYERS,
    facilities: {
      trainingPitchesLevel: 2,
      dormitoryLevel: 2,
      studyCenterLevel: 2
    },
    lastScoutedDay: 1
  };
}

export function saveYouthAcademyState(state: YouthAcademyState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ACADEMY, JSON.stringify(state));
  }
}

// Convertește un junior promovat într-un jucător complet din echipa mare (Senior)
export function convertJuniorToSeniorPlayer(junior: YouthPlayer, squadLength: number): Player {
  const skillNames: SkillName[] = [
    'stamina', 'speed', 'technique', 'passing', 'shooting', 
    'clearance', 'strength', 'heading', 'tackling', 'vision'
  ];

  const baseVal = Math.round(junior.quality);
  const skillsObj = {} as PlayerSkills;

  skillNames.forEach((s) => {
    skillsObj[s] = {
      value: Math.max(30, Math.min(95, baseVal + Math.floor(Math.random() * 9) - 4)),
      maxCap: Math.min(99, Math.max(baseVal + 15, junior.potential)),
      isTrainedMax: false,
      isPrimary: ['technique', 'passing', 'speed'].includes(s)
    };
  });

  return {
    id: `p-acad-${Date.now()}-${junior.id}`,
    name: junior.name,
    number: Math.min(99, squadLength + 12),
    position: junior.position,
    preferredFoot: junior.preferredFoot,
    height: 1.76 + Math.round(Math.random() * 15) / 100,
    weight: 68 + Math.round(Math.random() * 12),
    age: junior.age,
    birthDate: '15 Martie',
    birthSeasonDay: 15,
    condition: 100,
    overallQuality: junior.quality,
    morale: 100, // Moral maxim la semnarea primului contract!
    aggression: junior.personality === 'REBEL' ? 75 : 40,
    experience: 15,
    form: 95,
    skills: skillsObj,
    squad: 'A',
    recentPerformances: [junior.quality, junior.quality - 2, junior.quality + 1],
    bestPerformance: junior.quality + 3,
    seasonStats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      injuries: 0
    },
    careerStats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      injuries: 0
    },
    lifeEvents: [
      {
        id: `debut-senior-${Date.now()}`,
        date: new Date().toLocaleDateString('ro-RO'),
        type: 'CHILD_BORN',
        title: 'Promovare Istorică la Echipa de Seniori',
        description: `A semnat primul său contract de profesionist la vârsta de doar ${junior.age} ani, direct din Academia clubului!`,
        moraleChange: 35,
        seasonDay: 24
      }
    ]
  };
}
