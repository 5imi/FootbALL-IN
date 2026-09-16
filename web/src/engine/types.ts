export type PositionType = 'GK' | 'LB' | 'CB' | 'SW' | 'RB' | 'LM' | 'CM' | 'RM' | 'LF' | 'CF' | 'RF';

export type TacticalStyle = 'PASSING' | 'WING_PLAY' | 'KICK_AND_RUSH' | 'DEFENSIVE';

export type FormationType = '4-4-2' | '4-3-3' | '3-5-2' | '4-2-3-1' | '5-3-2' | '3-4-3' | '5-4-1';

export type WeatherType = 'SUNNY' | 'RAIN' | 'SNOW' | 'FOG';

export type PitchCondition = 'PRISTINE' | 'MUDDY' | 'FROZEN' | 'WET';

export type SquadAssignment = 'A' | 'B' | 'C' | 'D';

export type FootType = 'L' | 'R' | 'B';

export type SkillName = 
  | 'stamina'       // Rezistență
  | 'speed'         // Viteză
  | 'technique'     // Tehnică
  | 'passing'       // Pase
  | 'shooting'      // Șuturi
  | 'clearance'     // Respingeri
  | 'strength'      // Forță
  | 'heading'       // Cap
  | 'tackling'      // Deposedări
  | 'vision';       // Viziune (jucători de câmp) / Reflexe (GK)

export interface SkillDetail {
  value: number;        // 0 - 100% curent
  maxCap: number;       // Plafon genetic minim 50% (50 - 99%)
  isTrainedMax: boolean;// Devine true când value >= maxCap (Bara devine ROȘIE)
  isPrimary?: boolean;  // Atribut cheie (Bold în UI, bonus major)
  isSecondary?: boolean;// Al 3-lea / al 4-lea atribut de superstar (bonus secundar)
}

export type PlayerSkills = Record<SkillName, SkillDetail>;

export interface PlayerLifeEvent {
  id: string;
  date: string;
  type: 'CHILD_BORN' | 'WEDDING' | 'DIVORCE' | 'NIGHTCLUB_SCANDAL' | 'FAMILY_TRAGEDY' | 'CASINO_WIN' | 'TRANSFER_RUMOR';
  title: string;
  description: string;
  moraleChange: number;    // ex: +30, -50
  fitnessChange?: number;  // ex: -10
  aggressionChange?: number;
  seasonDay: number;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  injuries: number;
}

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  number: number;
  position: PositionType;
  secondaryPosition?: PositionType;
  preferredFoot: FootType;
  height: number;        // metri (ex: 1.96)
  weight: number;        // kg (ex: 98)
  age: number;           // 17 - 38
  birthDate: string;     // ex: "11 Noi 2026"
  birthSeasonDay: number;// Ziua din sezonul de 63 zile (1 - 63)
  
  // Stare dinamică SP
  condition: number;     // 0 - 100% (Condiție / Fitness)
  overallQuality: number;// 0 - 100% (Calitate Globală calculată din skills + EXP)
  morale: number;        // 0 - 100%
  aggression: number;    // 0 - 100% (Fixat genetic, nu se antrenează, bară roșie)
  experience: number;    // 0 - 100% (crește cu minutele jucate, nu scade)
  
  // Atribute antrenabile (cele 10 de bază)
  skills: PlayerSkills;
  
  // Sistem de Echipe Presetate SP
  squad: SquadAssignment;// 'A' | 'B' | 'C' | 'D'
  
  // Formă recentă (note din ultimele 5 meciuri)
  recentPerformances: number[]; // ex: [34, 33, 34, 31, 36]
  bestPerformance: number;      // ex: 46 sau 75
  
  // Statistici
  seasonStats: PlayerStats;
  careerStats: PlayerStats;
  
  // Evenimente din viața reală
  lifeEvents?: PlayerLifeEvent[];

  isCaptain?: boolean;
  
  // Câmpuri de compatibilitate retroactivă
  overall?: number;
  fitness?: number;
  form?: number;
}


export interface TeamTactics {
  formation: FormationType;
  style: TacticalStyle;
  aggressiveness: number; // 0 - 100%
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  tactics: TeamTactics;
  lineup: Player[];      // 11 titulari
  bench: Player[];       // rezerve
}

// ─── SISTEMUL DE ARBITRAJ ────────────────────────────────────────────────────

export interface Referee {
  id: string;
  name: string;
  strictness: number;      // 1-100 — cât de dur penalizează (cartonașe, faulturi)
  integrity: number;       // 1-100 — rezistența la mită (90+ = incoruptibil)
  homeBias: number;        // 0-100 — tendința de a favoriza gazdele sub presiunea tribunelor
  accuracy: number;        // 1-100 — precizia deciziilor (ofsaiduri limită, henț)
  experience: number;      // 0-100 — experiența la meciuri de presiune
}

// ─── MECANICA CORUPȚIEI ──────────────────────────────────────────────────────

export interface CorruptionConfig {
  /** Dacă o echipă încearcă să mituiască arbitrul */
  bribingTeamId?: string;
  bribeAmount?: number;         // Suma plătită (€50k - €200k)

  /** Blatul / Biscotto — ambele echipe acceptă egalitate */
  isBiscottoAgreed?: boolean;
}

export interface CorruptionResult {
  /** Mită */
  bribeAccepted: boolean;
  bribeReported: boolean;       // Arbitrul a raportat tentativa la Federație
  bribeTeamId?: string;
  moneySpent: number;           // Suma pierdută din visteria clubului
  bribeEffectiveness: 'NONE' | 'SUBTLE' | 'FAILED_PENALTY' | 'SCAMMED' | 'DECISIVE';
  financialVerdict?: string;    // Mesaj privind paguba sau eficiența banilor
  adjustedCallFavor: number;    // -15 la +15 — bias subtil pe decizii

  /** Blat */
  biscottoActive: boolean;
  biscottoBroken: boolean;      // Un jucător ambițios a trădat pactul
  biscottoTraitorName?: string;
  biscottoVerdict?: string;     // Explicație de ce a eșuat sau reușit blatul

  /** Investigație post-meci */
  investigationScore: number;   // 0-100 — cât de suspect a fost meciul
  isDiscovered: boolean;        // Federația a descoperit manevra
  penalty?: 'POINTS_DEDUCTION' | 'FINE' | 'RELEGATION' | 'MATCH_VOID';
  pointsDeducted?: number;
  fineAmount?: number;
}

// ─── TIPURI DE EVENIMENTE ────────────────────────────────────────────────────

export type EventType = 
  | 'KICKOFF' 
  | 'GOAL' 
  | 'PENALTY'
  | 'CORNER'
  | 'YELLOW_CARD' 
  | 'RED_CARD' 
  | 'WOODWORK' 
  | 'GREAT_SAVE' 
  | 'CHANCE' 
  | 'VAR_DECISION' 
  | 'BRIBED_DECISION'      // Decizie viciată de arbitru (penalty inventat, gol anulat)
  | 'SUSPICIOUS_PASSIVITY'  // Semn de blat — pasivitate pe teren
  | 'BISCOTTO_BETRAYAL'     // Jucătorul ambițios trădează blatul
  | 'MOMENTUM_SHIFT'        // Răsturnare de ritm / Asalt furibund
  | 'COUNTER_ATTACK'        // Contraatac tăios
  | 'INJURY_STOPPAGE'       // Joc întrerupt, intervenția medicilor
  | 'INTIMIDATION'         // Război psihologic, intimidare directă adversar
  | 'PLAYER_BRAWL'         // Încăierare între jucători agresivi (posibil dublu roșu)
  | 'BENCH_CLASH'           // Scântei între bănci / cartonaș antrenor


  | 'CROWD_CHANT'           // Atmosferă peluză, torțe, scandări
  | 'SCOUT_SPOTTED'         // Scout de la un club mare în tribună — jucătorii reacționează
  | 'TACTICAL_SUB'          // Schimbare tactică spectaculoasă
  | 'HEATED_PROTEST'        // Proteste vehemente ale jucătorilor / capitanului
  | 'WEATHER_INCIDENT'      // Ploaie, vânt, teren greu — influențează jocul
  | 'FAN_INVASION'          // Suporter intră pe teren / incident tribună
  | 'DRAMA_LASTMIN'         // Moment dramatic de ultim minut (non-gol)
  | 'EXTRA_TIME'
  | 'TIME_WASTING'
  | 'SIMULATION'
  | 'HALF_TIME' 
  | 'FULL_TIME'
  | 'COMMENT';

export interface MatchEvent {
  id: string;
  minute: number;
  type: EventType;
  teamId?: string;
  playerName?: string;
  assistName?: string;
  description: string;
  scoreAfter?: [number, number];
  isHighlight?: boolean;
  isCorruption?: boolean;   // Marchează evenimentul ca rezultat al corupției
}

export interface LineRatings {
  defense: number;
  midfield: number;
  attack: number;
  total: number;
}

export interface MatchStats {
  possession: [number, number];       // [home%, away%]
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  xG: [number, number];
  lineRatings: {
    home: LineRatings;
    away: LineRatings;
  };
}

export interface MatchSimulationResult {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  finalScore: [number, number];
  allEvents: MatchEvent[];
  timelineEvents: MatchEvent[]; // Doar cele majore (gol, cartonas, bara, VAR)
  finalStats: MatchStats;
  minuteSnapshots: {
    minute: number;
    score: [number, number];
    stats: MatchStats;
    currentEvent?: MatchEvent;
  }[];
  // ─── Arbitraj & Corupție ───
  referee: Referee;
  corruption?: CorruptionResult;
  // ─── Mediu & Teren ───
  weather: WeatherType;
  pitch: PitchCondition;
  // ─── Prelungiri ───
  extraTime: number;
}

export interface LeagueStandingRow {
  teamId: string;
  teamName: string;
  shortName: string;
  primaryColor: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

// ─── Piață Transferuri (SoccerProject Style) ───
export interface TransferBid {
  id: string;
  bidderClub: string;
  amount: number;
  time: string;
}

export interface TransferListing {
  id: string;
  player: Player;
  sellerClub: string;        // Numele clubului vânzător sau "Liber de contract"
  sellerCountry: string;     // ISO code (ex: 'RO', 'BE', 'DE')
  buyerClub: string | null;  // Clubul cu cea mai mare ofertă activă sau null
  currentBid: number;        // Valoarea ofertei maxime curente în EUR
  buyNowPrice?: number;      // Preț opțional de cumpărare instantă
  quality: number;           // Calitate globală (ex: 82%)
  age: number;               // Vârstă (18 - 35)
  deadline: string;          // Ex: "15 Sep (23:45)"
  isFreeAgent: boolean;      // true dacă jucătorul e liber de contract
  bids: TransferBid[];       // Istoricul ofertelor plasate
}
