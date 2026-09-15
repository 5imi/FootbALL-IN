import { COUNTRIES, Country } from './countries';
import { Player, Team } from './types';
import { generateRealisticSquad } from './playerGenerator';

export interface DivisionTeam {
  id: string;
  name: string;
  stadiumName: string;
  countryCode: string;
  flag: string;
  isBot: boolean;
  points: number;
  matches: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
}

export interface ManagerProfile {
  id: string;
  username: string;
  email: string;
  teamId: string;
  teamName: string;
  stadiumName: string;
  countryCode: string;
  registeredAt: string;
  budget: number; // e.g. €15,000,000
}

// Cele 16 echipe autentice inițiale conform modelului SoccerProject Divizia F.9
export const INITIAL_DIVISION_A_TEAMS: DivisionTeam[] = [
  { id: 'div-1', name: 'FC Marvel', stadiumName: 'Marvel Arena', countryCode: 'BE', flag: '🇧🇪', isBot: false, points: 72, matches: 24, won: 24, drawn: 0, lost: 0, goalsFor: 131, goalsAgainst: 20, goalDiff: 111 },
  { id: 'div-2', name: 'UFC Ellezelles', stadiumName: 'Stade Ellezelles', countryCode: 'BE', flag: '🇧🇪', isBot: false, points: 67, matches: 24, won: 22, drawn: 1, lost: 1, goalsFor: 113, goalsAgainst: 17, goalDiff: 96 },
  { id: 'div-3', name: 'RONTAITOARELE', stadiumName: 'Arena Rozătoarelor', countryCode: 'RO', flag: '🇷🇴', isBot: false, points: 56, matches: 24, won: 18, drawn: 2, lost: 4, goalsFor: 99, goalsAgainst: 24, goalDiff: 75 },
  { id: 'div-4', name: 'UTA ARAD70', stadiumName: 'Francisc von Neuman', countryCode: 'RO', flag: '🇷🇴', isBot: false, points: 54, matches: 24, won: 17, drawn: 3, lost: 4, goalsFor: 102, goalsAgainst: 22, goalDiff: 80 },
  { id: 'div-5', name: 'F. C. RADAUTI 2023', stadiumName: 'Municipal Rădăuți', countryCode: 'RO', flag: '🇷🇴', isBot: false, points: 46, matches: 24, won: 15, drawn: 1, lost: 8, goalsFor: 97, goalsAgainst: 29, goalDiff: 68 },
  { id: 'div-6', name: 'FC Foresta', stadiumName: 'Areni', countryCode: 'RO', flag: '🇷🇴', isBot: false, points: 44, matches: 24, won: 14, drawn: 2, lost: 8, goalsFor: 77, goalsAgainst: 31, goalDiff: 46 },
  { id: 'div-7', name: 'Polabiny FC', stadiumName: 'Polabiny Park', countryCode: 'CZ', flag: '🇨🇿', isBot: false, points: 43, matches: 24, won: 14, drawn: 1, lost: 9, goalsFor: 70, goalsAgainst: 40, goalDiff: 30 },
  { id: 'div-8', name: 'FC BUZDEA', stadiumName: 'Buzdea Stadium', countryCode: 'RO', flag: '🇷🇴', isBot: false, points: 40, matches: 24, won: 13, drawn: 1, lost: 10, goalsFor: 73, goalsAgainst: 39, goalDiff: 34 },
  { id: 'div-9', name: 'FK TATRAN Turzovka', stadiumName: 'Turzovka Arena', countryCode: 'SK', flag: '🇸🇰', isBot: false, points: 39, matches: 24, won: 12, drawn: 3, lost: 9, goalsFor: 59, goalsAgainst: 32, goalDiff: 27 },
  { id: 'div-10', name: 'Washington D.C.', stadiumName: 'Capital Stadium', countryCode: 'US', flag: '🇺🇸', isBot: false, points: 36, matches: 24, won: 12, drawn: 0, lost: 12, goalsFor: 73, goalsAgainst: 49, goalDiff: 24 },
  
  // Echipe Boți (cu iconiță bot SP - siluetă albastră pe fundal)
  { id: 'div-11', name: 'Hertha Sankt Pauli', stadiumName: 'Sankt Pauli Ground', countryCode: 'DE', flag: '🤖', isBot: true, points: 20, matches: 24, won: 6, drawn: 2, lost: 16, goalsFor: 30, goalsAgainst: 84, goalDiff: -54 },
  { id: 'div-12', name: 'SV Kiev', stadiumName: 'Kiev Municipal', countryCode: 'UA', flag: '🤖', isBot: true, points: 12, matches: 24, won: 3, drawn: 3, lost: 18, goalsFor: 26, goalsAgainst: 119, goalDiff: -93 },
  { id: 'div-13', name: 'NY/NJ Tirana', stadiumName: 'Tirana Park', countryCode: 'US', flag: '🤖', isBot: true, points: 11, matches: 24, won: 3, drawn: 2, lost: 19, goalsFor: 23, goalsAgainst: 172, goalDiff: -149 },
  { id: 'div-14', name: 'IF Nástic', stadiumName: 'Nou Estadi', countryCode: 'ES', flag: '🤖', isBot: true, points: 10, matches: 24, won: 3, drawn: 1, lost: 20, goalsFor: 19, goalsAgainst: 93, goalDiff: -74 },
  { id: 'div-15', name: 'Sporting Boavista', stadiumName: 'Estádio do Bessa', countryCode: 'PT', flag: '🤖', isBot: true, points: 7, matches: 24, won: 1, drawn: 4, lost: 19, goalsFor: 21, goalsAgainst: 167, goalDiff: -146 },
  { id: 'div-16', name: 'Bayer Donetsk', stadiumName: 'Donbass Arena Bot', countryCode: 'UA', flag: '🤖', isBot: true, points: 5, matches: 24, won: 1, drawn: 2, lost: 21, goalsFor: 25, goalsAgainst: 100, goalDiff: -75 },
];

/**
 * Încarcă echipele diviziei din localStorage sau inițializează
 */
export function loadDivisionTeams(): DivisionTeam[] {
  if (typeof window === 'undefined') return INITIAL_DIVISION_A_TEAMS;
  try {
    const saved = localStorage.getItem('footballin_division_a_teams');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DIVISION_A_TEAMS;
}

/**
 * Salvează echipele diviziei în localStorage
 */
export function saveDivisionTeams(teams: DivisionTeam[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('footballin_division_a_teams', JSON.stringify(teams));
  }
}

/**
 * Încarcă profilul managerului activ
 */
export function loadActiveManager(): ManagerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('footballin_active_manager');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return null;
}

/**
 * Salvează profilul managerului activ
 */
export function saveActiveManager(manager: ManagerProfile | null) {
  if (typeof window !== 'undefined') {
    if (manager) {
      localStorage.setItem('footballin_active_manager', JSON.stringify(manager));
    } else {
      localStorage.removeItem('footballin_active_manager');
    }
  }
}

/**
 * Transformă o echipă bot într-o echipă umană aleasă de manager (SoccerProject Model)
 */
export function takeoverBotTeam(
  botTeamId: string,
  username: string,
  teamName: string,
  stadiumName: string,
  email: string,
  countryCode: string
): { manager: ManagerProfile; teams: DivisionTeam[]; squad: Player[] } {
  const currentTeams = loadDivisionTeams();
  const country = COUNTRIES[countryCode] || COUNTRIES.RO;

  const updatedTeams = currentTeams.map(team => {
    if (team.id === botTeamId) {
      return {
        ...team,
        name: teamName,
        stadiumName: stadiumName,
        countryCode: countryCode,
        flag: country.flag,
        isBot: false // Devine echipă umană!
      };
    }
    return team;
  });

  saveDivisionTeams(updatedTeams);

  const manager: ManagerProfile = {
    id: 'mgr-' + Date.now(),
    username,
    email,
    teamId: botTeamId,
    teamName,
    stadiumName,
    countryCode,
    registeredAt: new Date().toISOString(),
    budget: 15000000 // Buget de pornire: €15.000.000
  };

  saveActiveManager(manager);

  // Generăm lotul proaspăt de 24 jucători conform SP
  const squad = generateRealisticSquad(countryCode);
  if (typeof window !== 'undefined') {
    localStorage.setItem('footballin_user_squad', JSON.stringify(squad));
  }

  return { manager, teams: updatedTeams, squad };
}
