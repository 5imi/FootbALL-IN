export type SponsorCategory = 'SHIRT' | 'STADIUM_BILLBOARD' | 'NAMING_RIGHTS';

export interface ClubSponsor {
  id: string;
  name: string;
  category: SponsorCategory;
  weeklyIncome: number;    // Venit săptămânal garantat (€)
  perMatchBonus: number;   // Bonus pe fiecare meci disputat acasă (€)
  durationWeeks: number;   // Durată contract (săptămâni)
  remainingWeeks: number;
  signed: boolean;
  signedAt?: string;
  logo: string;
  description: string;
}

const STORAGE_KEY = 'footballin_club_sponsors';

export const INITIAL_AVAILABLE_SPONSORS: ClubSponsor[] = [
  {
    id: 'sp-1',
    name: 'Fly Emirates',
    category: 'SHIRT',
    weeklyIncome: 250000,
    perMatchBonus: 50000,
    durationWeeks: 34,
    remainingWeeks: 34,
    signed: true, // Activ ca sponsor implicit
    signedAt: new Date().toISOString(),
    logo: '✈️',
    description: 'Sponsor principal pe pieptul tricoului oficial.'
  },
  {
    id: 'sp-2',
    name: 'Panouri Reclame LED Stadion (Top Ads)',
    category: 'STADIUM_BILLBOARD',
    weeklyIncome: 80000,
    perMatchBonus: 40000,
    durationWeeks: 34,
    remainingWeeks: 34,
    signed: true,
    signedAt: new Date().toISOString(),
    logo: '📺',
    description: 'Spații publicitare LED dinamice pe marginea suprafeței de joc.'
  },
  {
    id: 'sp-3',
    name: 'Nike Football Elite',
    category: 'SHIRT',
    weeklyIncome: 280000,
    perMatchBonus: 60000,
    durationWeeks: 50,
    remainingWeeks: 50,
    signed: false,
    logo: '✔️',
    description: 'Partener tehnic oficial de echipament și branding.'
  },
  {
    id: 'sp-4',
    name: 'Allianz Global Arena',
    category: 'NAMING_RIGHTS',
    weeklyIncome: 350000,
    perMatchBonus: 75000,
    durationWeeks: 68,
    remainingWeeks: 68,
    signed: false,
    logo: '🏛️',
    description: 'Drepturi de denumire comercială pentru stadionul echipei.'
  },
  {
    id: 'sp-5',
    name: 'Betano Sport România',
    category: 'STADIUM_BILLBOARD',
    weeklyIncome: 110000,
    perMatchBonus: 45000,
    durationWeeks: 34,
    remainingWeeks: 34,
    signed: false,
    logo: '⚽',
    description: 'Panouri publicitare premium în spatele porților și la băncile tehnice.'
  }
];

export function loadClubSponsors(): ClubSponsor[] {
  if (typeof window === 'undefined') return INITIAL_AVAILABLE_SPONSORS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Eroare la încărcarea sponsorilor:', e);
  }
  return INITIAL_AVAILABLE_SPONSORS;
}

export function saveClubSponsors(sponsors: ClubSponsor[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sponsors));
  }
}

/**
 * Semnează un contract de sponsorizare pentru club
 */
export function signSponsorContract(sponsorId: string): ClubSponsor[] {
  const sponsors = loadClubSponsors();
  const updated = sponsors.map(s => {
    if (s.id === sponsorId) {
      return {
        ...s,
        signed: true,
        signedAt: new Date().toISOString(),
        remainingWeeks: s.durationWeeks
      };
    }
    return s;
  });
  saveClubSponsors(updated);
  return updated;
}

/**
 * Calculează totalul veniturilor săptămânale din toți sponsorii activi
 */
export function calculateWeeklySponsorshipIncome(sponsors: ClubSponsor[]): number {
  return sponsors
    .filter(s => s.signed)
    .reduce((sum, s) => sum + s.weeklyIncome, 0);
}
