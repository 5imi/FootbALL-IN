export interface HistoryEvent {
  id: string;
  date: string;
  season: number;
  clubName: string;
  managerName: string;
  event: string;
  category: 'STAFF' | 'YOUTH' | 'PROMOTION' | 'CUP' | 'CAREER' | 'TRANSFER' | 'SEASON_END';
}

export const INITIAL_MANAGER_HISTORY: HistoryEvent[] = [
  {
    id: 'h-1',
    date: '14 Sep 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Cian Jenkins a fost angajat ca noul scout.',
    category: 'STAFF',
  },
  {
    id: 'h-2',
    date: '19 Aug 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Haim Lewis a fost angajat ca noul îngrijitor.',
    category: 'STAFF',
  },
  {
    id: 'h-3',
    date: '19 Aug 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Elvedin Huseinagic a fost angajat ca noul coordonator de tineret.',
    category: 'STAFF',
  },
  {
    id: 'h-4',
    date: '19 Aug 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'cipriansimi nu a supravieţuit runda 2 a cupei SoccerProject.',
    category: 'CUP',
  },
  {
    id: 'h-5',
    date: '1 Aug 2026',
    season: 128,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'cipriansimi a fost campion în divizia G.25 (şi a primit promoţia).',
    category: 'PROMOTION',
  },
  {
    id: 'h-6',
    date: '7 Iun 2026',
    season: 128,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Sajjad Chaudrey a fost angajat ca noul maseor.',
    category: 'STAFF',
  },
  {
    id: 'h-7',
    date: '7 Iun 2026',
    season: 128,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Hervé Nzelo Tamukini a fost angajat ca noul doctor.',
    category: 'STAFF',
  },
  {
    id: 'h-8',
    date: '7 Iun 2026',
    season: 128,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Kuan Chun Hang a fost angajat ca noul antrenor.',
    category: 'STAFF',
  },
  {
    id: 'h-9',
    date: '7 Iun 2026',
    season: 128,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'cipriansimi devine managerul clubului FC Foresta.',
    category: 'CAREER',
  },
  {
    id: 'h-10',
    date: '7 Iun 2026',
    season: 128,
    clubName: 'N.N.',
    managerName: 'cipriansimi',
    event: 'cipriansimi îşi începe cariera SoccerProject.com.',
    category: 'CAREER',
  },
];

export const INITIAL_TEAM_HISTORY: HistoryEvent[] = [
  {
    id: 'th-1',
    date: '14 Sep 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Cian Jenkins a fost angajat ca noul scout.',
    category: 'STAFF',
  },
  {
    id: 'th-2',
    date: '25 Aug 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Jucătorul Igor Kurtanovic a fost promovat din echipa de tineret şi a devenit jucător profesionist de fotbal.',
    category: 'YOUTH',
  },
  {
    id: 'th-3',
    date: '19 Aug 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Haim Lewis a fost angajat ca noul îngrijitor.',
    category: 'STAFF',
  },
  {
    id: 'th-4',
    date: '19 Aug 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'Elvedin Huseinagic a fost angajat ca noul coordonator de tineret.',
    category: 'STAFF',
  },
  {
    id: 'th-5',
    date: '19 Aug 2026',
    season: 129,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'FC Foresta nu a supravieţuit rundei 2 a cupei SoccerProject.',
    category: 'CUP',
  },
  {
    id: 'th-6',
    date: '1 Aug 2026',
    season: 128,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'FC Foresta a câştigat divizia G.25 (şi a promovat).',
    category: 'PROMOTION',
  },
  {
    id: 'th-7',
    date: '7 Iun 2026',
    season: 128,
    clubName: 'FC Foresta',
    managerName: 'cipriansimi',
    event: 'cipriansimi a devenit managerul clubului şi i-a schimbat numele în FC Foresta.',
    category: 'CAREER',
  },
  {
    id: 'th-8',
    date: '30 Mai 2026',
    season: 127,
    clubName: 'FC Foresta',
    managerName: 'N.N.',
    event: 'FC Foresta a avut un sezon slab în divizia F.9, şi a atins poziţia 14 (cu retrogradare).',
    category: 'SEASON_END',
  },
  {
    id: 'th-9',
    date: '28 Mar 2026',
    season: 126,
    clubName: 'FC Foresta',
    managerName: 'N.N.',
    event: 'FC Foresta a terminat pe locul 2 în divizia G.27 (şi a promovat).',
    category: 'SEASON_END',
  },
  {
    id: 'th-10',
    date: '24 Ian 2026',
    season: 125,
    clubName: 'FC Foresta',
    managerName: 'N.N.',
    event: 'FC Foresta a avut un sezon mediocru în divizia G.27, şi a atins poziţia 4.',
    category: 'SEASON_END',
  },
  {
    id: 'th-11',
    date: '22 Noi 2025',
    season: 124,
    clubName: 'FC Foresta',
    managerName: 'N.N.',
    event: 'FC Foresta a avut un sezon mediocru în divizia G.27, şi a atins poziţia 3.',
    category: 'SEASON_END',
  },
  {
    id: 'th-12',
    date: '20 Sep 2025',
    season: 123,
    clubName: 'FC Foresta',
    managerName: 'N.N.',
    event: 'FC Foresta a avut un sezon slab în divizia F.9, şi a atins poziţia 11 (cu retrogradare).',
    category: 'SEASON_END',
  },
];

const STORAGE_MANAGER_KEY = 'footballin_manager_history';
const STORAGE_TEAM_KEY = 'footballin_team_history';

export function loadManagerHistory(): HistoryEvent[] {
  if (typeof window === 'undefined') return INITIAL_MANAGER_HISTORY;
  try {
    const raw = localStorage.getItem(STORAGE_MANAGER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_MANAGER_HISTORY;
}

export function loadTeamHistory(): HistoryEvent[] {
  if (typeof window === 'undefined') return INITIAL_TEAM_HISTORY;
  try {
    const raw = localStorage.getItem(STORAGE_TEAM_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_TEAM_HISTORY;
}

export function addHistoryEvent(event: Omit<HistoryEvent, 'id'>) {
  if (typeof window === 'undefined') return;
  try {
    const newEvent: HistoryEvent = {
      ...event,
      id: `he-${Date.now()}`,
    };
    const mgrHistory = loadManagerHistory();
    mgrHistory.unshift(newEvent);
    localStorage.setItem(STORAGE_MANAGER_KEY, JSON.stringify(mgrHistory));

    const teamHistory = loadTeamHistory();
    teamHistory.unshift(newEvent);
    localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(teamHistory));
  } catch (e) {
    console.error(e);
  }
}
