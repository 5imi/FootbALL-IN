import { MatchEvent } from './types';
import { MatchState, MatchContext } from './matchState';

export function evaluateBenchClash(
  min: number,
  state: MatchState,
  context: MatchContext,
  rng: () => number
): MatchEvent | undefined {
  if (
    min >= 60 && min <= 80 &&
    Math.abs(state.homeGoals - state.awayGoals) <= 1 &&
    !state.benchClashOccurred &&
    rng() < 0.09
  ) {
    state.benchClashOccurred = true;
    return {
      id: `evt-${min}-bench`,
      minute: min,
      type: 'BENCH_CLASH',
      description: `🥊 SCÂNTEI LA MARGINEA TERENULUI! Antrenorii celor două echipe se contrează violent după o decizie la limită! Rezervele intervin să-i despartă, arbitrul ${context.referee.name} vine la margine și arată cartonaș galben pentru proteste!`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
    };
  }
  return undefined;
}

export function evaluateStandardEvents(
  min: number,
  state: MatchState,
  context: MatchContext,
  rng: () => number
): MatchEvent | undefined {
  const { homeTeam, awayTeam, homeRatings, awayRatings, referee, corruption, corruptionConfig, pickers } = context;
  const { pickAttacker, pickMidfielder, pickDefender, pickGoalkeeper } = pickers;

  // Tragere de timp pe final de meci sau prelungiri
  if (min >= 85) {
    const diff = state.homeGoals - state.awayGoals;
    if (Math.abs(diff) === 1 && rng() < 0.15) {
      const leadingTeam = diff > 0 ? homeTeam : awayTeam;
      const trailingTeam = diff > 0 ? awayTeam : homeTeam;
      const winder = pickDefender(leadingTeam);
      
      const giveCard = rng() < 0.3; // 30% șanse să ia galben pentru tragere de timp
      if (giveCard) {
        if (leadingTeam.id === homeTeam.id) state.homeYellow++;
        else state.awayYellow++;
      }

      return {
        id: `evt-${min}`,
        minute: min,
        type: 'TIME_WASTING',
        teamId: leadingTeam.id,
        playerName: winder,
        description: `⏱️ TRAGERE DE TIMP! ${winder} (${leadingTeam.shortName}) se tăvălește pe jos acuzând crampe musculare. Banca lui ${trailingTeam.shortName} protestează vehement!${giveCard ? ` Arbitrul ${referee.name} nu se lasă păcălit și îi arată cartonașul galben!` : ' Minute prețioase se scurg.'}`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
      };
    }
  }

  // 35% șansă de acțiune notabilă (restul sunt faze anonime de posesie)
  if (rng() >= 0.35) {
    return undefined;
  }

  // Posesia dinamică ajustată de momentum
  const dynamicHomePossession = Math.min(
    75,
    Math.max(25, state.homeBasePossession + Math.round(state.homeMomentum * 0.8) - Math.round(state.awayMomentum * 0.8))
  );

  const isHomeAttacking = (rng() * 100) < dynamicHomePossession;
  const attTeam = isHomeAttacking ? homeTeam : awayTeam;
  const defTeam = isHomeAttacking ? awayTeam : homeTeam;
  const attRating = isHomeAttacking ? homeRatings.attack : awayRatings.attack;
  const defRating = isHomeAttacking ? awayRatings.defense : homeRatings.defense;

  // Bonus de atac pentru echipa aflată în asalt / momentum
  const currentAttBonus = isHomeAttacking ? Math.round(state.homeMomentum * 0.5) : Math.round(state.awayMomentum * 0.5);
  const delta = (attRating + currentAttBonus) - defRating;
  const actionRoll = rng();

  // ─── 1. Fault / Cartonaș (20% din acțiuni) ───
  // ─── 1. Fault / Cartonaș (22% din acțiuni) ───
  if (actionRoll < 0.22) {
    if (isHomeAttacking) state.awayFouls++; else state.homeFouls++;
    const teamAggro = defTeam.tactics.aggressiveness;
    const strictFactor = referee.strictness / 100;
    const cardRoll = rng();

    // Alegem apărătorul/mijlocașul care a comis faultul
    const availablePlayers = defTeam.lineup.filter(p => !state.playerBookings[p.id]?.isSentOff);
    const defPlayers = availablePlayers.filter(p => ['LB', 'CB', 'RB', 'LM', 'CM', 'RM'].includes(p.position));
    const committedPlayer = defPlayers.length > 0 
      ? defPlayers[Math.floor(rng() * defPlayers.length)]
      : (availablePlayers[Math.floor(rng() * availablePlayers.length)] || defTeam.lineup[0]);

    const playerId = committedPlayer.id;
    const playerName = committedPlayer.name;
    const playerAggro = committedPlayer.aggression ?? teamAggro;
    const combinedAggro = (teamAggro * 0.5) + (playerAggro * 0.5);

    // Șansă realistă de cartonaș: 0.25 - 0.55 per fault
    let cardThreshold = 0.20 + (combinedAggro / 100) * 0.30 * (0.6 + strictFactor * 0.7);

    if (corruption.bribeAccepted && corruption.bribeEffectiveness !== 'SCAMMED') {
      const isBribingTeamDefending =
        (isHomeAttacking && corruptionConfig?.bribingTeamId === awayTeam.id) ||
        (!isHomeAttacking && corruptionConfig?.bribingTeamId === homeTeam.id);
      if (isBribingTeamDefending) {
        cardThreshold *= 0.75;
      } else {
        cardThreshold *= 1.30;
      }
    }

    if (!state.playerBookings[playerId]) {
      state.playerBookings[playerId] = { yellows: 0, isSentOff: false };
    }
    const currentBooking = state.playerBookings[playerId];

    // 1. Cartonaș ROȘU DIRECT (intrare violentă, atac la rupere)
    const directRedThreshold = (combinedAggro / 100) * 0.045 * (0.6 + strictFactor * 0.8);
    if (cardRoll < directRedThreshold) {
      currentBooking.isSentOff = true;
      if (isHomeAttacking) {
        state.awayRed++;
        state.awayMomentum = Math.max(0, state.awayMomentum - 15);
        state.homeMomentum = Math.min(30, state.homeMomentum + 15);
      } else {
        state.homeRed++;
        state.homeMomentum = Math.max(0, state.homeMomentum - 15);
        state.awayMomentum = Math.min(30, state.awayMomentum + 15);
      }

      return {
        id: `evt-${min}`,
        minute: min,
        type: 'RED_CARD',
        teamId: defTeam.id,
        playerName,
        description: `🟥 CARTONAȘ ROȘU DIRECT! ${playerName} (${defTeam.shortName}) comite o intrare criminală cu talpa la tibie! Arbitrul ${referee.name} scoate instantaneu cartonașul roșu! ${defTeam.shortName} rămâne în 10 oameni!`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
        isCorruption: corruption.bribeAccepted,
      };
    }

    // 2. Cartonaș GALBEN (sau AL DOILEA GALBEN -> ROȘU!)
    if (cardRoll < cardThreshold) {
      if (currentBooking.yellows === 1) {
        // AL DOILEA GALBEN -> ELIMINARE!
        currentBooking.yellows = 2;
        currentBooking.isSentOff = true;
        if (isHomeAttacking) {
          state.awayRed++;
          state.awayMomentum = Math.max(0, state.awayMomentum - 12);
          state.homeMomentum = Math.min(30, state.homeMomentum + 12);
        } else {
          state.homeRed++;
          state.homeMomentum = Math.max(0, state.homeMomentum - 12);
          state.awayMomentum = Math.min(30, state.awayMomentum + 12);
        }

        return {
          id: `evt-${min}`,
          minute: min,
          type: 'RED_CARD',
          teamId: defTeam.id,
          playerName,
          description: `🟨🟥 AL DOILEA CARTONAȘ GALBEN ȘI ELIMINARE! ${playerName} (${defTeam.shortName}) oprește un contraatac periculos printr-un fault cinic! Arbitrul ${referee.name} îi arată al doilea avertisment și cartonașul roșu!`,
          scoreAfter: [state.homeGoals, state.awayGoals],
          isHighlight: true,
          isCorruption: corruption.bribeAccepted,
        };
      } else {
        // PRIMUL GALBEN
        currentBooking.yellows = 1;
        if (isHomeAttacking) state.awayYellow++; else state.homeYellow++;

        return {
          id: `evt-${min}`,
          minute: min,
          type: 'YELLOW_CARD',
          teamId: defTeam.id,
          playerName,
          description: `🟨 Cartonaș galben pentru ${playerName} (${defTeam.shortName}) după o intrare întârziată. Arbitrul ${referee.name} avertizează ferm!`,
          scoreAfter: [state.homeGoals, state.awayGoals],
          isHighlight: true,
          isCorruption: corruption.bribeAccepted,
        };
      }
    }

    // 3. Duel Psihologic & Intimidare / Încăierare
    const attackerFouled = attTeam.lineup.find(p => !state.playerBookings[p.id]?.isSentOff) || attTeam.lineup[0];
    const attackerAggro = attackerFouled.aggression ?? attTeam.tactics.aggressiveness;

    // Scenariul A: BĂTAIE / ÎNCĂIERARE ÎNTRE DOI AGRESIVI (Doar dacă ambii sunt extrem de agresivi > 75%, șansă rară ~1.5%)
    if (playerAggro > 75 && attackerAggro > 75 && rng() < 0.025) {
      currentBooking.isSentOff = true;
      if (!state.playerBookings[attackerFouled.id]) {
        state.playerBookings[attackerFouled.id] = { yellows: 0, isSentOff: false };
      }
      state.playerBookings[attackerFouled.id].isSentOff = true;
      state.homeRed++;
      state.awayRed++;

      return {
        id: `evt-${min}`,
        minute: min,
        type: 'PLAYER_BRAWL',
        teamId: defTeam.id,
        playerName: `${playerName} & ${attackerFouled.name}`,
        description: `🟥🟥 BĂTAIE GENERALĂ PE TEREN! ${playerName} (${defTeam.shortName}) îl provoacă violent pe ${attackerFouled.name} (${attTeam.shortName}), iar acesta ripostează cu pumnii! Colegii abia îi despart! Arbitrul ${referee.name} elimină AMBII JUCĂTORI cu ROȘU DIRECT! Ambele echipe continuă în 10 oameni!`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: true,
      };
    }

    // Scenariul B: INTIMIDARE PURĂ (Război psihologic - cel mai frecvent, fără eliminare)
    // Apărătorul agresiv intimidează un atacant mai firav sau tânăr
    if (playerAggro > 65 && attackerAggro < playerAggro - 20 && rng() < 0.25) {
      if (isHomeAttacking) {
        state.homeMomentum = Math.max(0, state.homeMomentum - 5);
      } else {
        state.awayMomentum = Math.max(0, state.awayMomentum - 5);
      }

      return {
        id: `evt-${min}`,
        minute: min,
        type: 'INTIMIDATION',
        teamId: defTeam.id,
        playerName,
        description: `👀 RĂZBOI PSIHOLOGIC! ${playerName} (${defTeam.shortName}) îi suflă în ceafă lui ${attackerFouled.name} (${attTeam.shortName}) și îl intimidează fizic la limita regulamentului! Atacantul advers pare vizibil timorat și ezită la dueluri!`,
        scoreAfter: [state.homeGoals, state.awayGoals],
        isHighlight: false,
      };
    }

    return undefined; // Doar fault, fără cartonaș
  }



  // ─── 2. Corner (15% din acțiuni) ───
  if (actionRoll < 0.35) {
    if (isHomeAttacking) state.homeCorners++; else state.awayCorners++;
    const kicker = pickMidfielder(attTeam);
    const header = pickAttacker(attTeam);

    return {
      id: `evt-${min}`,
      minute: min,
      type: 'CORNER',
      description: `Corner periculos executat de ${kicker} (${attTeam.shortName})! ${header} reia periculos cu capul, mingea trece puțin peste poartă.`,
      scoreAfter: [state.homeGoals, state.awayGoals],
    };
  }

  // ─── 3. Fază Periculoasă de Șut / Ocazie (65% din acțiuni) ───
  if (isHomeAttacking) state.homeShots++; else state.awayShots++;

  let shotXG = Math.max(0.03, Math.min(0.45, 0.08 + (delta * 0.006)));
  if (isHomeAttacking ? state.homeMomentum > 0 : state.awayMomentum > 0) shotXG += 0.04;
  if (isHomeAttacking) state.homeXG += shotXG; else state.awayXG += shotXG;

  // Gol: baza 10%, max 28%, momentum +4%
  let goalThreshold = Math.max(0.04, Math.min(0.28, 0.10 + (delta * 0.008)));
  if (isHomeAttacking ? state.homeMomentum > 0 : state.awayMomentum > 0) goalThreshold += 0.04;

  // Varianță random organică: fiecare șut e unic, uneori norocul decide
  // Factorul oscilează între 0.6 și 1.4 — poate face un șut slab gol sau o ocazie clară ratare
  const luckFactor = 0.6 + rng() * 0.8;
  goalThreshold *= luckFactor;

  if (corruption.bribeAccepted && corruption.bribeEffectiveness === 'SUBTLE') {
    const isBribingTeamAttacking =
      (isHomeAttacking && corruptionConfig?.bribingTeamId === homeTeam.id) ||
      (!isHomeAttacking && corruptionConfig?.bribingTeamId === awayTeam.id);
    if (isBribingTeamAttacking) goalThreshold += 0.04;
  }

  const shotRoll = rng();

  // GOL MARCAT!
  if (shotRoll < goalThreshold) {
    if (isHomeAttacking) {
      state.homeGoals++;
      state.homeShotsOnTarget++;
      if (state.awayGoals > state.homeGoals - 1) state.homeEverTrailed = true;
    } else {
      state.awayGoals++;
      state.awayShotsOnTarget++;
      if (state.homeGoals > state.awayGoals - 1) state.awayEverTrailed = true;
    }

    const scorer = pickAttacker(attTeam);
    const assister = pickMidfielder(attTeam);

    let goalTitle = `⚽ GOOOL ${attTeam.name.toUpperCase()}!`;
    let goalDesc = `${scorer} finalizează impecabil la colțul lung după o pasă excelentă primită de la ${assister}!`;

    const diffBefore = isHomeAttacking ? (state.homeGoals - 1 - state.awayGoals) : (state.awayGoals - 1 - state.homeGoals);

    // Cazul 1: Răsturnare totală de scor (a fost condusă anterior și acum preia conducerea)
    if (diffBefore === 0 && (isHomeAttacking ? state.homeEverTrailed : state.awayEverTrailed)) {
      goalTitle = `🔥 RĂSTURNARE TOTALĂ DE SCOR!`;
      goalDesc = `${scorer} finalizează magistral! ${attTeam.name} a întors incredibil rezultatul partidei! Ce revenire de senzație!`;
      if (isHomeAttacking) state.homeMomentum = 18; else state.awayMomentum = 18;
    }
    // Cazul 2: Egalare de moral (era condusă și a egalat)
    else if (diffBefore === -1) {
      goalTitle = `⚡ EGALARE SPECTACULOASĂ!`;
      goalDesc = `${scorer} aduce egalarea cu o execuție splendidă! Meciul este relansat complet, răsturnare de dinamică!`;
      if (isHomeAttacking) state.homeMomentum = 20; else state.awayMomentum = 20;
    }
    // Cazul 3: Contraatac mortal imediat după ratare adversă
    else if (state.lastMissedChanceTeamId === defTeam.id) {
      goalTitle = `⚡ CONTRAATAC MORTAL!`;
      goalDesc = `La doar o fază după ce ${defTeam.shortName} a irosit o mare ocazie, ${attTeam.shortName} a plecat fulger pe contraatac și ${scorer} a înscris fără milă!`;
      if (isHomeAttacking) state.homeMomentum = 14; else state.awayMomentum = 14;
    }
    // Cazul 4: Gol pe final dramatic (minutul 87+)
    else if (min >= 87) {
      goalTitle = `🔥 DRAMĂ ÎN MINUTUL ${min}!`;
      goalDesc = `NEBUNIE TOTALĂ ÎN TRIBUNE! ${scorer} dă lovitura de grație pe final de meci! O răsturnare de scenariu memorabilă!`;
      if (isHomeAttacking) state.homeMomentum = 22; else state.awayMomentum = 22;
    }

    state.lastMissedChanceTeamId = null;

    return {
      id: `evt-${min}`,
      minute: min,
      type: 'GOAL',
      teamId: attTeam.id,
      playerName: scorer,
      assistName: assister,
      description: `${goalTitle} ${goalDesc} (${homeTeam.shortName} ${state.homeGoals} - ${state.awayGoals} ${awayTeam.shortName})`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
    };
  }
  // Bară!
  else if (shotRoll < goalThreshold + 0.06) {
    if (isHomeAttacking) state.homeShotsOnTarget++; else state.awayShotsOnTarget++;
    const shooter = pickAttacker(attTeam);
    state.lastMissedChanceTeamId = attTeam.id;

    return {
      id: `evt-${min}`,
      minute: min,
      type: 'WOODWORK',
      teamId: attTeam.id,
      playerName: shooter,
      description: `💥 BARĂ INCREDIBILĂ! Șutul violent expediat de ${shooter} (${attTeam.shortName}) zguduie transversala porții! Se aud oftaturi în tot stadionul!`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
    };
  }
  // Paradă de portar!
  else if (shotRoll < goalThreshold + 0.20) {
    if (isHomeAttacking) state.homeShotsOnTarget++; else state.awayShotsOnTarget++;
    const shooter = pickAttacker(attTeam);
    const defGK = pickGoalkeeper(defTeam);
    state.lastMissedChanceTeamId = attTeam.id;

    return {
      id: `evt-${min}`,
      minute: min,
      type: 'GREAT_SAVE',
      teamId: defTeam.id,
      playerName: defGK,
      description: `🧤 Paradă de zile mari! ${defGK} (${defTeam.shortName}) plonjează spectaculos și scoate din vinclu șutul periculos al lui ${shooter}!`,
      scoreAfter: [state.homeGoals, state.awayGoals],
      isHighlight: true,
    };
  }
  // Șut blocat de apărare
  else if (shotRoll < goalThreshold + 0.38) {
    const shooter = pickMidfielder(attTeam);
    const blocker = pickDefender(defTeam);
    const blockedVariants = [
      `🛡️ ȘUT BLOCAT! ${shooter} (${attTeam.shortName}) trage de la 20m, dar ${blocker} se aruncă exemplar și blochează cu pieptul! Degajare de salvare!`,
      `🛡️ ZID DEFENSIV! ${shooter} armează un șut violent, dar ${blocker} (${defTeam.shortName}) face ecran perfect. Mingea ricoșează în corner!`,
      `🛡️ BLOCAT ÎN ULTIMUL MOMENT! ${blocker} (${defTeam.shortName}) intervine la milimetru și deviază execuția lui ${shooter}! Apărare eroică!`,
    ];
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'CHANCE',
      description: blockedVariants[Math.floor(rng() * blockedVariants.length)],
      scoreAfter: [state.homeGoals, state.awayGoals],
    };
  }
  // Ofsaid
  else if (shotRoll < goalThreshold + 0.50) {
    const shooter = pickAttacker(attTeam);
    const offsidesVariants = [
      `🚩 OFSAID! ${shooter} (${attTeam.shortName}) pleacă o fracțiune de secundă prea devreme. Semnalizare imediată a tușierului!`,
      `🚩 FANION RIDICAT! Fază anulată pentru ${attTeam.shortName}! ${shooter} era cu un pas în spatele ultimului fundaș. Decizie milimetrică!`,
      `🚩 OFSAID CONTROVERSAT! ${shooter} crede că a fost pe linie, dar asistentul semnalizează imediat! Proteste scurte ale bancii ${attTeam.shortName}.`,
    ];
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'CHANCE',
      description: offsidesVariants[Math.floor(rng() * offsidesVariants.length)],
      scoreAfter: [state.homeGoals, state.awayGoals],
    };
  }
  // Ocazie ratată
  else {
    const shooter = pickAttacker(attTeam);
    const missVariants = [
      `Ocazie mare ratată! ${shooter} (${attTeam.shortName}) reia cu capul peste poartă dintr-o poziție favorabilă.`,
      `${shooter} (${attTeam.shortName}) trage din interiorul careului, dar mingea trece pe lângă bară! Ce ratare!`,
      `Poziție ideală pentru ${shooter}, dar execuția din prima e slabă. Mingea se duce mult alături de poartă.`,
      `${shooter} primește o pasă perfectă pe spațiu, dar centrarea în careu nu găsește pe nimeni! Ocazie irosită!`,
    ];
    return {
      id: `evt-${min}`,
      minute: min,
      type: 'CHANCE',
      description: missVariants[Math.floor(rng() * missVariants.length)],
      scoreAfter: [state.homeGoals, state.awayGoals],
    };
  }
}
