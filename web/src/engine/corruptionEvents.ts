import { MatchEvent } from './types';
import { MatchState, MatchContext } from './matchState';

export function evaluateCorruptionEvents(
  min: number,
  state: MatchState,
  context: MatchContext,
  rng: () => number
): MatchEvent | undefined {
  const { homeTeam, awayTeam, referee, corruption, corruptionConfig, pickers } = context;
  const { pickAttacker, pickDefender, pickGoalkeeper } = pickers;

  // 1. TRĂDAREA BLATULUI (Biscotto Betrayal)
  if (corruption.biscottoActive && corruption.biscottoBroken && min === state.biscottoBetrayalMinute) {
    const betrayTeam = rng() < 0.5 ? homeTeam : awayTeam;
    const traitor = pickAttacker(betrayTeam);
    corruption.biscottoTraitorName = traitor;

    if (betrayTeam.id === homeTeam.id) { state.homeGoals++; state.homeShotsOnTarget++; state.homeShots++; }
    else { state.awayGoals++; state.awayShotsOnTarget++; state.awayShots++; }

    const scoutNote = (state.scoutSpottedMinute > 0 && min >= state.scoutSpottedMinute)
      ? ` A aflat că în tribună este un scout important și refuză să facă figurație!`
      : ` Ignoră complet indicațiile tactice de non-combat primite de pe bancă!`;

    corruption.investigationScore += 30;
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'BISCOTTO_BETRAYAL',
      teamId: betrayTeam.id,
      playerName: traitor,
      description: `🔥 SCANDAL PE TEREN! ${traitor} (${betrayTeam.shortName}) rupe înțelegerea tacită!${scoutNote} Prinde un șut devastator de la 22 de metri direct în vinclu! GOL DE SENZAȚIE! Ambele bănci sunt în stare de șoc! (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName})`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
      isCorruption: true,
    };
  }

  // 2. BLAT CU GOLURI CONVENITE (1-1 sau 2-2) — Golul gazdelor
  if (
    corruption.biscottoActive &&
    !corruption.biscottoBroken &&
    state.homeGoals < state.agreedDrawScore[0] &&
    min >= 22 && min <= 44 &&
    rng() < 0.22
  ) {
    state.homeGoals++; state.homeShotsOnTarget++; state.homeShots++;
    const scorer = pickAttacker(homeTeam);
    corruption.investigationScore += 8;
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'GOAL',
      teamId: homeTeam.id,
      playerName: scorer,
      description: `⚽ GOL REGIZAT! Defensiva oaspeților lasă spații inexplicabil de generoase, iar ${scorer} împinge mingea în poartă din 6 metri! (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName}) — primul pas din scenariul convenit.`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
      isCorruption: true,
    };
  }

  // 3. BLAT CU GOLURI CONVENITE — Golul oaspeților (Egalare regizată)
  if (
    corruption.biscottoActive &&
    !corruption.biscottoBroken &&
    state.awayGoals < state.agreedDrawScore[1] &&
    state.homeGoals > state.awayGoals &&
    min >= 52 && min <= 76 &&
    rng() < 0.24
  ) {
    state.awayGoals++; state.awayShotsOnTarget++; state.awayShots++;
    const scorer = pickAttacker(awayTeam);
    corruption.investigationScore += 8;
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'GOAL',
      teamId: awayTeam.id,
      playerName: scorer,
      description: `⚽ EGALARE CONVENITĂ! ${scorer} (${awayTeam.shortName}) finalizează nestingherit după o pasă filtrantă prin centrul apărării gazdelor! Nimeni nu a încercat să-l blocheze! (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName})`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
      isCorruption: true,
    };
  }

  // 4. GAFĂ / ACCIDENT ÎN BLAT 0-0
  if (
    corruption.biscottoActive &&
    !corruption.biscottoBroken &&
    state.homeGoals === 0 && state.awayGoals === 0 &&
    state.agreedDrawScore[0] === 0 &&
    min >= 35 && min <= 68 &&
    rng() < 0.05
  ) {
    const luckyTeam = rng() < 0.5 ? homeTeam : awayTeam;
    const unluckyTeam = luckyTeam.id === homeTeam.id ? awayTeam : homeTeam;
    const unluckyGK = pickGoalkeeper(unluckyTeam);
    const luckyPlayer = pickAttacker(luckyTeam);

    if (luckyTeam.id === homeTeam.id) { state.homeGoals++; state.homeShots++; state.homeShotsOnTarget++; }
    else { state.awayGoals++; state.awayShots++; state.awayShotsOnTarget++; }

    corruption.investigationScore += 12;
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'GOAL',
      teamId: luckyTeam.id,
      playerName: luckyPlayer,
      description: `⚽🤦 GAFĂ MONUMENTALĂ ÎN BLAT! ${unluckyGK} scapă printre picioare o centrare inofensivă trimisă de ${luckyPlayer}! GOL incredibil! Jucătorii lui ${unluckyTeam.shortName} își pun mâinile în cap — planul de 0-0 s-a năruit! (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName})`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
    };
  }

  // 5. EGALARE SALVATOARE ÎN BLAT DUPĂ GAFĂ
  if (
    corruption.biscottoActive &&
    !corruption.biscottoBroken &&
    state.homeGoals !== state.awayGoals &&
    min >= 76 && min <= 86 &&
    rng() < 0.35
  ) {
    const trailingTeam = state.homeGoals < state.awayGoals ? homeTeam : awayTeam;
    const leadingTeam = trailingTeam.id === homeTeam.id ? awayTeam : homeTeam;
    const eqPlayer = pickAttacker(trailingTeam);

    if (trailingTeam.id === homeTeam.id) { state.homeGoals++; state.homeShots++; state.homeShotsOnTarget++; }
    else { state.awayGoals++; state.awayShots++; state.awayShotsOnTarget++; }

    corruption.investigationScore += 14;
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'GOAL',
      teamId: trailingTeam.id,
      playerName: eqPlayer,
      description: `⚽ EGALARE SALVATOARE PE FINAL! Defensiva lui ${leadingTeam.shortName} ezită bizar la o minge simplă, iar ${eqPlayer} împinge mingea în poartă din 2 metri! Se reface egalitatea convenită! (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName})`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
      isCorruption: true,
    };
  }

  // 6. PASIVITATE SUSPECTĂ
  if (corruption.biscottoActive && !corruption.biscottoBroken && rng() < 0.12 && min > 20) {
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'SUSPICIOUS_PASSIVITY',
      description: [
        `😴 Min ${min}: Publicul fluieră din ce în ce mai tare! Fundașii plimbă mingea la portar fără nicio intenție de atac.`,
        `😤 Min ${min}: Jurnaliștii de pe margine notează frenetic. Niciun duel aerian, nicio intrare la minge... Parcă s-au înțeles!`,
        `🥱 Min ${min}: Posesie leneșă în propria jumătate. Atacanții stau pe la centrul terenului, fără a presa.`,
      ][Math.floor(rng() * 3)],
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: false,
      isCorruption: true,
    };
  }

  // 7. PENALTY INVENTAT DE ARBITRU MITUIT (CU ȘANSĂ DE RATARE!)
  if (
    corruption.bribeAccepted &&
    corruption.bribeEffectiveness !== 'SCAMMED' &&
    !state.bribedPenaltyGiven &&
    min >= 78 && min <= 87 &&
    rng() < 0.20
  ) {
    state.bribedPenaltyGiven = true;
    const favTeam = corruptionConfig?.bribingTeamId === homeTeam.id ? homeTeam : awayTeam;
    const defTeam = favTeam.id === homeTeam.id ? awayTeam : homeTeam;
    const penaltyTaker = pickAttacker(favTeam);
    const fouledBy = pickDefender(defTeam);

    if (favTeam.id === homeTeam.id) state.awayYellow++;
    else state.homeYellow++;

    const isMissed = rng() < 0.25;
    corruption.investigationScore += 16;

    if (isMissed) {
      if (favTeam.id === homeTeam.id) { state.homeShots++; state.homeXG += 0.76; }
      else { state.awayShots++; state.awayXG += 0.76; }
      corruption.bribeEffectiveness = 'FAILED_PENALTY';

      return {
        id: `evt-${min}`,
        minute: min,
        type: 'PENALTY',
        teamId: favTeam.id,
        playerName: penaltyTaker,
        description: `🧤 PENALTY RATAT! Arbitrul ${referee.name} a acordat un penalty controversat la o cădere ușoară a lui ${penaltyTaker}, dar portarul ${defTeam.shortName} are un reflex uluitor și respinge în corner! Cadou irosit! (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName})`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
        isCorruption: true,
      };
    } else {
      if (favTeam.id === homeTeam.id) { state.homeGoals++; state.homeShotsOnTarget++; state.homeShots++; state.homeXG += 0.76; }
      else { state.awayGoals++; state.awayShotsOnTarget++; state.awayShots++; state.awayXG += 0.76; }

      return {
        id: `evt-${min}`,
        minute: min,
        type: 'BRIBED_DECISION',
        teamId: favTeam.id,
        playerName: penaltyTaker,
        description: `⚖️ PENALTY CONTROVERSAT! Arbitrul ${referee.name} indică punctul cu var la un contact suspect în careu! ${fouledBy} (${defTeam.shortName}) vede galben pentru proteste! ${penaltyTaker} transformă cu sânge rece! (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName})`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
        isCorruption: true,
      };
    }
  }

  // 8. GOL ANULAT PE NEDREPT DE ARBITRU MITUIT
  if (
    corruption.bribeAccepted &&
    corruption.bribeEffectiveness === 'SUBTLE' &&
    !state.bribedGoalCancelled &&
    min >= 60 &&
    rng() < 0.03
  ) {
    const victimTeam = corruptionConfig?.bribingTeamId === homeTeam.id ? awayTeam : homeTeam;
    const scorer = pickAttacker(victimTeam);
    state.bribedGoalCancelled = true;
    corruption.investigationScore += 12;

    return {
      id: `evt-${min}`,
      minute: min,
      type: 'BRIBED_DECISION',
      teamId: victimTeam.id,
      playerName: scorer,
      description: `📺🚫 GOL ANULAT CONTROVERSAT! ${scorer} (${victimTeam.shortName}) trimite mingea în plasă, dar arbitrul ${referee.name} anulează pentru un presupus fault în atac! Repetările nu arată nicio atingere! Banca ${victimTeam.shortName} este furioasă!`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
      isCorruption: true,
    };
  }

  // 9. SIMULARE PENIBILĂ ÎN CAREU (De disperare, în prelungiri)
  if (
    corruption.bribeAccepted &&
    min > 90 &&
    rng() < 0.25
  ) {
    const bribingTeam = corruptionConfig?.bribingTeamId === homeTeam.id ? homeTeam : awayTeam;
    const isLosingOrDrawing = bribingTeam.id === homeTeam.id 
      ? state.homeGoals <= state.awayGoals 
      : state.awayGoals <= state.homeGoals;
    
    if (isLosingOrDrawing) {
      const diver = pickAttacker(bribingTeam);
      corruption.investigationScore += 8;

      return {
        id: `evt-${min}`,
        minute: min,
        type: 'SIMULATION',
        teamId: bribingTeam.id,
        playerName: diver,
        description: `🏊 SIMULARE GROTESCĂ! ${diver} (${bribingTeam.shortName}) cade în careu fără să fie atins de nimeni! Se uită disperat spre arbitrul ${referee.name}, dar acesta face semn ca jocul să continue pentru a nu bate prea tare la ochi!`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
        isCorruption: true,
      };
    }
  }

  return undefined;
}
