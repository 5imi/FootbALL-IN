import { Team, Referee, CorruptionResult, CorruptionConfig, LineRatings } from './types';
import { PlayerPickers } from './commentary';

export interface MatchState {
  homeGoals: number;
  awayGoals: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
  homeYellow: number;
  awayYellow: number;
  homeRed: number;
  awayRed: number;
  homeXG: number;
  awayXG: number;

  homeMomentum: number;
  awayMomentum: number;
  homeEverTrailed: boolean;
  awayEverTrailed: boolean;
  lastMissedChanceTeamId: string | null;
  benchClashOccurred: boolean;

  bribedPenaltyGiven: boolean;
  bribedGoalCancelled: boolean;
  biscottoBetrayalMinute: number;

  scoutSpottedMinute: number;
  weatherCondition: 'SUNNY' | 'RAIN' | 'SNOW' | 'FOG';
  pitchCondition: 'PRISTINE' | 'MUDDY' | 'FROZEN' | 'WET';
  tacticalSubsDone: number;
  fanInvasionOccurred: boolean;
  heatedProtestOccurred: boolean;
  agreedDrawScore: [number, number];

  extraTime: number;
  extraTimeAnnounced: boolean;

  homeBasePossession: number;
  awayBasePossession: number;

  /** Monitorizare cartonașe individuale pentru al 2-lea galben -> roșu */
  playerBookings: Record<string, { yellows: number; isSentOff: boolean }>;
}


export interface MatchContext {
  homeTeam: Team;
  awayTeam: Team;
  homeRatings: LineRatings;
  awayRatings: LineRatings;
  referee: Referee;
  corruption: CorruptionResult;
  corruptionConfig?: CorruptionConfig;
  pickers: PlayerPickers;
}
