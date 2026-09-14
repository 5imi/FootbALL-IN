import {
  Team,
  CorruptionConfig,
  MatchSimulationResult,
  MatchEvent,
  MatchStats,
  WeatherType,
  PitchCondition,
} from './types';
import { pickReferee } from './data/referees';
import { createRNG } from './rng';
import { calculateLineRatings } from './ratings';
import { evaluateCorruption, runPostMatchInvestigation } from './corruption';
import { createPlayerPickers, generateAtmosphericComment } from './commentary';
import { MatchState, MatchContext } from './matchState';
import { evaluateCorruptionEvents } from './corruptionEvents';
import { evaluateStandardEvents, evaluateBenchClash } from './matchEvents';

export { createRNG } from './rng';
export { calculateLineRatings } from './ratings';

export function simulateMatch(
  homeTeam: Team,
  awayTeam: Team,
  seed: number = Date.now(),
  corruptionConfig?: CorruptionConfig
): MatchSimulationResult {
  const rng = createRNG(seed);
  const referee = pickReferee(rng());
  let corruption = evaluateCorruption(rng, referee, corruptionConfig);
  
  // Determinare meteo & stare teren
  const weatherRoll = rng();
  const weather: WeatherType = weatherRoll < 0.60 ? 'SUNNY' : (weatherRoll < 0.85 ? 'RAIN' : (weatherRoll < 0.93 ? 'SNOW' : 'FOG'));
  
  const pitchRoll = rng();
  let pitch: PitchCondition = 'PRISTINE';
  if (weather === 'RAIN') {
    pitch = pitchRoll < 0.70 ? 'MUDDY' : 'WET';
  } else if (weather === 'SNOW') {
    pitch = pitchRoll < 0.65 ? 'FROZEN' : 'MUDDY';
  } else {
    pitch = pitchRoll < 0.15 ? 'MUDDY' : (pitchRoll < 0.30 ? 'WET' : 'PRISTINE');
  }

  const homeRatings = calculateLineRatings(homeTeam, weather, pitch);
  const awayRatings = calculateLineRatings(awayTeam, weather, pitch);

  const midDiff = homeRatings.midfield - awayRatings.midfield;
  let homeBasePossession = Math.min(65, Math.max(35, Math.round(50 + midDiff * 1.5)));
  const homeBiasBonus = Math.round(referee.homeBias * 0.05);
  homeBasePossession = Math.min(68, homeBasePossession + homeBiasBonus);
  if (corruption.biscottoActive && !corruption.biscottoBroken) {
    homeBasePossession = 50;
  }
  const awayBasePossession = 100 - homeBasePossession;

  const state: MatchState = {
    homeGoals: 0, awayGoals: 0,
    homeShots: 0, awayShots: 0,
    homeShotsOnTarget: 0, awayShotsOnTarget: 0,
    homeCorners: 0, awayCorners: 0,
    homeFouls: 0, awayFouls: 0,
    homeYellow: 0, awayYellow: 0,
    homeRed: 0, awayRed: 0,
    homeXG: 0.0, awayXG: 0.0,
    homeMomentum: 0, awayMomentum: 0,
    homeEverTrailed: false, awayEverTrailed: false,
    lastMissedChanceTeamId: null,
    benchClashOccurred: false,
    bribedPenaltyGiven: false,
    bribedGoalCancelled: false,
    biscottoBetrayalMinute: 0,
    scoutSpottedMinute: rng() < 0.35 ? 25 + Math.floor(rng() * 45) : 0,
    weatherCondition: weather,
    pitchCondition: pitch,
    tacticalSubsDone: 0,
    fanInvasionOccurred: false,
    heatedProtestOccurred: false,
    agreedDrawScore: [0, 0],
    extraTime: 0, // Calculated later
    extraTimeAnnounced: false,
    homeBasePossession,
    awayBasePossession,
    playerBookings: {}
  };


  const pickers = createPlayerPickers(rng);

  const context: MatchContext = {
    homeTeam, awayTeam,
    homeRatings, awayRatings,
    referee, corruption, corruptionConfig,
    pickers
  };

  if (corruption.biscottoActive) {
    const drawRoll = rng();
    if (drawRoll < 0.45) state.agreedDrawScore = [0, 0];
    else if (drawRoll < 0.85) state.agreedDrawScore = [1, 1];
    else state.agreedDrawScore = [2, 2];

    if (state.scoutSpottedMinute > 0 && !corruption.biscottoBroken && rng() < 0.80) {
      corruption.biscottoBroken = true;
    }
  }

  if (corruption.biscottoBroken) {
    if (state.scoutSpottedMinute > 0) {
      state.biscottoBetrayalMinute = Math.min(88, Math.max(state.scoutSpottedMinute + 5, 55 + Math.floor(rng() * 32)));
    } else {
      state.biscottoBetrayalMinute = 70 + Math.floor(rng() * 18);
    }
  }

  const allEvents: MatchEvent[] = [];
  const timelineEvents: MatchEvent[] = [];
  const minuteSnapshots: MatchSimulationResult['minuteSnapshots'] = [];

  const addEvent = (event: MatchEvent) => {
    allEvents.push(event);
    if (event.isHighlight) timelineEvents.push(event);
  };

  addEvent({
    id: `evt-0`,
    minute: 1,
    type: 'KICKOFF',
    description: `Arbitrul ${referee.name} fluieră startul partidei pe ${homeTeam.stadium}! Gazdele în echipament ${homeTeam.name} au lovitura de începere.`,
    scoreAfter: [0, 0],
    isHighlight: false,
  });

  // Calculăm prelungirile teoretice, dar pot fi extinse de arbitru dacă este mituit și are nevoie de timp!
  let baseExtraTime = 2 + Math.floor(rng() * 4); // 2-5 minute normal
  if (corruption.bribeAccepted && corruption.bribeEffectiveness !== 'SCAMMED') {
    const bribingTeam = corruptionConfig?.bribingTeamId === homeTeam.id ? homeTeam : awayTeam;
    const isLosingOrDrawing = bribingTeam.id === homeTeam.id 
      ? state.homeGoals <= state.awayGoals 
      : state.awayGoals <= state.homeGoals;
    
    if (isLosingOrDrawing) {
      // Arbitrul acordă prelungiri uriașe (6-10 minute) dacă echipa care a dat mita nu câștigă!
      state.extraTime = 6 + Math.floor(rng() * 5);
    } else {
      // Dacă conduc, dă doar 1-2 minute ca să fluiere mai repede
      state.extraTime = 1 + Math.floor(rng() * 2);
    }
  } else {
    state.extraTime = baseExtraTime;
  }

  for (let min = 1; min <= 90 + state.extraTime; min++) {
    if (state.homeMomentum > 0) state.homeMomentum--;
    if (state.awayMomentum > 0) state.awayMomentum--;

    let currentEvent: MatchEvent | undefined = undefined;

    if (min === 45) {
      currentEvent = {
        id: `evt-45`,
        minute: 45,
        type: 'HALF_TIME',
        description: `Pauză pe tabelă! Scorul după primele 45 de minute este ${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName}. Arbitrul: ${referee.name}.`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
      };
      addEvent(currentEvent);
    } else if (min === 90 && !state.extraTimeAnnounced) {
      state.extraTimeAnnounced = true;
      const suspiciousExtraTime = state.extraTime > 5 && corruption.bribeAccepted;
      currentEvent = {
        id: `evt-90-extratime`,
        minute: 90,
        type: 'EXTRA_TIME',
        description: `⏱️ De la margine se arată ${state.extraTime} minute de prelungire! ${suspiciousExtraTime ? 'Timp adițional uriaș dictat de arbitru, publicul fluieră copios!' : ''}`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
      };
      addEvent(currentEvent);
    } else {
      currentEvent = evaluateCorruptionEvents(min, state, context, rng);
      if (currentEvent) addEvent(currentEvent);
      
      if (!currentEvent) {
        currentEvent = evaluateBenchClash(min, state, context, rng);
        if (currentEvent) addEvent(currentEvent);
      }

      if (!currentEvent) {
        if (corruption.biscottoActive && !corruption.biscottoBroken) {
          const skipChance = (state.scoutSpottedMinute > 0 && min >= state.scoutSpottedMinute) ? 0.35 : 0.52;
          if (rng() >= skipChance) {
            currentEvent = evaluateStandardEvents(min, state, context, rng);
            if (currentEvent) addEvent(currentEvent);
          }
        } else {
          currentEvent = evaluateStandardEvents(min, state, context, rng);
          if (currentEvent) addEvent(currentEvent);
        }
      }
    }

    const isScoutMin = state.scoutSpottedMinute > 0 && min === state.scoutSpottedMinute;
    if (!currentEvent && (isScoutMin || rng() < 0.70)) {
      currentEvent = generateAtmosphericComment(
        min, homeTeam, awayTeam, state.homeGoals, state.awayGoals,
        state.homeMomentum, state.awayMomentum, referee, rng, pickers,
        {
          biscottoActive: corruption.biscottoActive && !corruption.biscottoBroken,
          scoutSpottedMinute: state.scoutSpottedMinute,
          weatherCondition: state.weatherCondition,
          pitchCondition: state.pitchCondition,
          fanInvasionOccurred: state.fanInvasionOccurred,
          tacticalSubsDone: state.tacticalSubsDone,
          heatedProtestOccurred: state.heatedProtestOccurred,
        }
      );
      if (currentEvent) {
        if (currentEvent.type === 'TACTICAL_SUB') state.tacticalSubsDone++;
        if (currentEvent.type === 'FAN_INVASION') state.fanInvasionOccurred = true;
        if (currentEvent.type === 'HEATED_PROTEST') state.heatedProtestOccurred = true;
        addEvent(currentEvent);
      }
    }

    minuteSnapshots.push({
      minute: min,
      score: [state.homeGoals, state.awayGoals],
      stats: buildCurrentStats(state, homeRatings, awayRatings),
      currentEvent,
    });
  }

  addEvent({
    id: `evt-ft`,
    minute: 90 + state.extraTime,
    type: 'FULL_TIME',
    description: `Fluier final! Meciul se încheie: ${homeTeam.name} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.name}. Arbitru: ${referee.name}.`,
    scoreAfter: [state.homeGoals, state.awayGoals],
    isHighlight: true,
  });

  const totalShots = state.homeShots + state.awayShots;
  const totalFouls = state.homeFouls + state.awayFouls;
  corruption = runPostMatchInvestigation(
    rng, corruption, totalShots, totalFouls,
    state.homeGoals, state.awayGoals, homeTeam, awayTeam, corruptionConfig
  );

  if (corruption.biscottoVerdict) {
    addEvent({
      id: `evt-post-biscotto`,
      minute: 90 + state.extraTime,
      type: 'COMMENT',
      description: `📝 RAPORT MANAGER: ${corruption.biscottoVerdict}`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
      isCorruption: true,
    });
  }

  if (corruption.financialVerdict) {
    addEvent({
      id: `evt-post-bribe`,
      minute: 90 + state.extraTime,
      type: 'COMMENT',
      description: `📝 RAPORT MANAGER: ${corruption.financialVerdict}`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
      isCorruption: true,
    });
  }

  return {
    matchId: `match-${seed}`,
    homeTeam, awayTeam,
    finalScore: [state.homeGoals, state.awayGoals],
    allEvents, timelineEvents,
    finalStats: buildCurrentStats(state, homeRatings, awayRatings),
    minuteSnapshots, referee,
    corruption: corruptionConfig ? corruption : undefined,
    weather: state.weatherCondition,
    pitch: state.pitchCondition,
    extraTime: state.extraTime,
  };
}

function buildCurrentStats(state: MatchState, homeRatings: any, awayRatings: any): MatchStats {
  return {
    possession: [state.homeBasePossession, state.awayBasePossession],
    shots: [state.homeShots, state.awayShots],
    shotsOnTarget: [state.homeShotsOnTarget, state.awayShotsOnTarget],
    corners: [state.homeCorners, state.awayCorners],
    fouls: [state.homeFouls, state.awayFouls],
    yellowCards: [state.homeYellow, state.awayYellow],
    redCards: [state.homeRed, state.awayRed],
    xG: [Number(state.homeXG.toFixed(2)), Number(state.awayXG.toFixed(2))],
    lineRatings: { home: homeRatings, away: awayRatings },
  };
}
