import { COUNTRIES_LIST } from './countries';

export type StaffRole = 
  | 'COACH'        // Antrenor (progres antrenamente)
  | 'SCOUT'        // Scout (găsește jucători pe piață)
  | 'DOCTOR'       // Doctor (vindecă accidentații mai repede)
  | 'GROUNDSMAN'   // Îngrijitor (calitatea gazonului)
  | 'ASSISTANT'    // Asistent (gestionează când managerul e absent)
  | 'PHYSIO'       // Maseor (previne accidentările și reface condiția)
  | 'YOUTH_COORD'; // Coordonator tineret (antrenarea și sosirea tineretului)

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  roleTitle: string;
  country: string;
  flag: string;
  age: number;
  quality: number; // 1 - 100%
  salaryWeekly: number; // € / săptămână
  contractDays: number; // zile rămase de contract
  isOnCourse?: boolean;
  courseDaysLeft?: number;
}

export const STAFF_ROLE_TITLES: Record<StaffRole, { ro: string; en: string; descRo: string; descEn: string }> = {
  COACH: {
    ro: 'Antrenor',
    en: 'Coach',
    descRo: 'Influențează direct viteza de creștere a atributelor la antrenamentul zilnic.',
    descEn: 'Directly influences the skill growth rate during daily training sessions.'
  },
  SCOUT: {
    ro: 'Scout',
    en: 'Scout',
    descRo: 'Găsește talente pe piața de transferuri și dezvăluie exactitatea calității jucătorilor.',
    descEn: 'Finds talents on the transfer market and reveals accurate player quality metrics.'
  },
  DOCTOR: {
    ro: 'Doctor',
    en: 'Doctor',
    descRo: 'Tratează jucătorii accidentați și reduce la jumătate zilele de spitalizare.',
    descEn: 'Treats injured players and significantly cuts down recovery days.'
  },
  GROUNDSMAN: {
    ro: 'Îngrijitor',
    en: 'Groundsman',
    descRo: 'Menține calitatea gazonului pe stadion pentru a preveni accidentările și terenul mocirlos.',
    descEn: 'Maintains pristine pitch quality to avoid mud and injury risks.'
  },
  ASSISTANT: {
    ro: 'Asistent',
    en: 'Assistant Manager',
    descRo: 'Preia deciziile tactice și rotația lotului atunci când managerul este absent.',
    descEn: 'Handles tactical adjustments and squad rotations when the manager is offline.'
  },
  PHYSIO: {
    ro: 'Maseor',
    en: 'Physio',
    descRo: 'Reface condiția fizică a jucătorilor după meciuri și previne epuizarea musculară.',
    descEn: 'Restores player fitness after matches and prevents fatigue.'
  },
  YOUTH_COORD: {
    ro: 'Coordonator tineret',
    en: 'Youth Coordinator',
    descRo: 'Formează juniorii la Centrul de Tineret și atrage tinere talente în club.',
    descEn: 'Nurtures academy prospects at the Youth Centre and scouts upcoming talents.'
  }
};

/**
 * Personalul inițial complet al clubului conform standardului SoccerProject
 */
export const DEFAULT_CLUB_STAFF: StaffMember[] = [
  {
    id: 'st-coach',
    name: 'Kuan Chun Hang',
    role: 'COACH',
    roleTitle: 'Antrenor',
    country: 'Hong Kong',
    flag: '🇭🇰',
    age: 52,
    quality: 94,
    salaryWeekly: 14500,
    contractDays: 86
  },
  {
    id: 'st-scout',
    name: 'Lucian Botoșani',
    role: 'SCOUT',
    roleTitle: 'Scout',
    country: 'România',
    flag: '🇷🇴',
    age: 44,
    quality: 88,
    salaryWeekly: 9200,
    contractDays: 64
  },
  {
    id: 'st-doctor',
    name: 'Dr. Pompiliu Popescu',
    role: 'DOCTOR',
    roleTitle: 'Doctor',
    country: 'România',
    flag: '🇷🇴',
    age: 61,
    quality: 91,
    salaryWeekly: 11000,
    contractDays: 112
  },
  {
    id: 'st-groundsman',
    name: 'Gheorghe Iarbă-Verde',
    role: 'GROUNDSMAN',
    roleTitle: 'Îngrijitor',
    country: 'România',
    flag: '🇷🇴',
    age: 58,
    quality: 85,
    salaryWeekly: 4500,
    contractDays: 95
  },
  {
    id: 'st-assistant',
    name: 'Costel Gâlcă',
    role: 'ASSISTANT',
    roleTitle: 'Asistent',
    country: 'România',
    flag: '🇷🇴',
    age: 50,
    quality: 87,
    salaryWeekly: 8500,
    contractDays: 48
  },
  {
    id: 'st-physio',
    name: 'Massimo Ambrosini',
    role: 'PHYSIO',
    roleTitle: 'Maseor',
    country: 'Italia',
    flag: '🇮🇹',
    age: 46,
    quality: 93,
    salaryWeekly: 12000,
    contractDays: 130
  },
  {
    id: 'st-youth',
    name: 'Patrick De Wilde',
    role: 'YOUTH_COORD',
    roleTitle: 'Coordonator tineret',
    country: 'Belgia',
    flag: '🇧🇪',
    age: 55,
    quality: 89,
    salaryWeekly: 10500,
    contractDays: 74
  }
];

/**
 * Încarcă personalul din localStorage sau returnează cel inițial
 */
export function loadClubStaff(): StaffMember[] {
  if (typeof window === 'undefined') return DEFAULT_CLUB_STAFF;
  try {
    const saved = localStorage.getItem('footballin_club_staff');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_CLUB_STAFF;
}

/**
 * Salvează personalul în localStorage
 */
export function saveClubStaff(staff: StaffMember[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('footballin_club_staff', JSON.stringify(staff));
  }
}

/**
 * Generează 3-4 candidați disponibili pe piață pentru un rol
 */
export function generateStaffMarketCandidates(role: StaffRole): StaffMember[] {
  const candidates: StaffMember[] = [];
  const count = 3;

  for (let i = 0; i < count; i++) {
    const randomCountry = COUNTRIES_LIST[Math.floor(Math.random() * COUNTRIES_LIST.length)];
    const firstName = randomCountry.firstNames[Math.floor(Math.random() * randomCountry.firstNames.length)];
    const lastName = randomCountry.lastNames[Math.floor(Math.random() * randomCountry.lastNames.length)];
    const quality = Math.min(99, Math.max(50, Math.round(65 + Math.random() * 32)));
    const age = 38 + Math.floor(Math.random() * 25);
    // Salariu proporțional cu calitatea
    const salaryWeekly = Math.round((2000 + Math.pow(quality / 10, 2.2) * 120) / 100) * 100;

    candidates.push({
      id: `cand-${role}-${Date.now()}-${i}`,
      name: `${firstName} ${lastName}`,
      role,
      roleTitle: STAFF_ROLE_TITLES[role].ro,
      country: randomCountry.nameRo,
      flag: randomCountry.flag,
      age,
      quality,
      salaryWeekly,
      contractDays: 60 + Math.floor(Math.random() * 60)
    });
  }

  return candidates;
}
