import { Team, Referee, CorruptionConfig, CorruptionResult } from './types';

/**
 * Evaluează tentativa de corupție înainte de startul partidei:
 * - Arbitrul integru (>82) refuză mita sau o denunță oficial la federație.
 * - Arbitrul coruptibil acceptă mita (cu 25% risc de țeapă / fluierat neutru).
 * - Înțelegerea de blat (biscotto) setează starea de non-combat, cu 18% risc inițial de trădare.
 */
export function evaluateCorruption(
  rng: () => number,
  referee: Referee,
  config?: CorruptionConfig
): CorruptionResult {
  const result: CorruptionResult = {
    bribeAccepted: false,
    bribeReported: false,
    bribeTeamId: config?.bribingTeamId,
    moneySpent: config?.bribeAmount || 0,
    bribeEffectiveness: 'NONE',
    adjustedCallFavor: 0,
    biscottoActive: false,
    biscottoBroken: false,
    investigationScore: 0,
    isDiscovered: false,
  };

  if (!config) return result;

  // ─── Evaluare mită ───
  if (config.bribingTeamId && config.bribeAmount) {
    const bribeStrength = config.bribeAmount / 100000; // Normalizare (100k = 1.0)
    const roll = rng() * 100;

    // Arbitru foarte integru (Integritate >= 82)
    if (referee.integrity >= 82) {
      if (roll < 45) {
        // 45% șansă să denunțe direct tentativa la Federație / Comisia de Integritate
        result.bribeReported = true;
        result.bribeEffectiveness = 'NONE';
        result.adjustedCallFavor = -6; // Fluieră strict împotriva clubului mituitor
        result.investigationScore += 50;
      } else {
        // Refuză mita demn, dar nu raportează oficial
        result.bribeEffectiveness = 'NONE';
        result.adjustedCallFavor = 0;
        result.investigationScore += 10;
      }
    } else {
      // Arbitru coruptibil (Integritate < 82)
      const acceptThreshold = referee.integrity - bribeStrength * 15;
      if (roll > acceptThreshold) {
        result.bribeAccepted = true;

        // 25% șansă ca arbitrul să dea "țeapă" patronului: ia banii, dar de frica observatorului fluieră 100% neutru!
        if (rng() < 0.25) {
          result.bribeEffectiveness = 'SCAMMED';
          result.adjustedCallFavor = 1; // Fără impact real
          result.investigationScore += 8;
        } else {
          // Influență subtilă (nu uriașă): mici avantaje la faze 50-50
          result.bribeEffectiveness = 'SUBTLE';
          result.adjustedCallFavor = Math.min(10, Math.round(4 + bribeStrength * 5)); // bias discret: +4..+10
          result.investigationScore += 14 + rng() * 10;
        }
      } else {
        // Arbitrul a refuzat mita
        result.bribeEffectiveness = 'NONE';
        result.adjustedCallFavor = 0;
      }
    }
  }

  // ─── Evaluare Blat (Biscotto) ───
  if (config.isBiscottoAgreed) {
    result.biscottoActive = true;
    result.investigationScore += 12; // Meciurile anoste atrag atenția

    // Există un risc de 35% ca un jucător ambițios să refuze blatul și să atace
    if (rng() < 0.35) {
      result.biscottoBroken = true;
    }
  }

  return result;
}

/**
 * Investigația comisiei de disciplină și bilanțul financiar post-meci:
 * - Evaluează dacă banii au fost risipiți (țeapă, meci pierdut, remiză insuficientă).
 * - Calculează suspiciunea meciului și posibilele sancțiuni (amendă, depunctare, retrogradare).
 */
export function runPostMatchInvestigation(
  rng: () => number,
  result: CorruptionResult,
  totalShots: number,
  totalFouls: number,
  homeGoals: number,
  awayGoals: number,
  homeTeam: Team,
  awayTeam: Team,
  corruptionConfig?: CorruptionConfig
): CorruptionResult {
  const updated = { ...result };

  // Meciuri cu foarte puține faze sunt suspecte
  if (totalShots < 6) updated.investigationScore += 15;
  if (totalFouls < 4 && result.biscottoActive) updated.investigationScore += 20;

  // ─── Evaluare post-meci Biscotto ───
  if (updated.biscottoActive) {
    if (updated.biscottoBroken) {
      const traitor = updated.biscottoTraitorName || 'Un jucător';
      updated.biscottoVerdict = `📉 BLAT EȘUAT: Managerii au aranjat un 0-0 liniștit, dar ${traitor} a stricat totul din dorința de afirmare, ruinând înțelegerea! Managerii vor lua măsuri drastice împotriva lui.`;
    } else {
      updated.biscottoVerdict = `🤝 BLAT REUȘIT: Ambele echipe și-au respectat cuvântul și au mimat fotbalul pentru un egal de salon. Totuși, fanii și presa suspectează non-combatul.`;
    }
  }

  // ─── Evaluare financiară a mitei (Clubul poate pierde și banii!) ───
  if (corruptionConfig?.bribingTeamId && updated.moneySpent > 0) {
    const isHomeBribing = corruptionConfig.bribingTeamId === homeTeam.id;
    const opponentShort = isHomeBribing ? awayTeam.shortName : homeTeam.shortName;
    const teamGoals = isHomeBribing ? homeGoals : awayGoals;
    const oppGoals = isHomeBribing ? awayGoals : homeGoals;

    if (updated.bribeReported) {
      updated.financialVerdict = `🚨 DEZASTRU FINANCIAR: Banii (€${updated.moneySpent.toLocaleString()}) au fost confiscați de procuratură! Arbitrul a denunțat tentativa, iar clubul e anchetat penal.`;
    } else if (!updated.bribeAccepted) {
      updated.financialVerdict = `💸 BANI PIERDUȚI: Suma de €${updated.moneySpent.toLocaleString()} a fost înmânată prin intermediari, dar arbitrul a refuzat plicul! Banii au rămas pierduți în buzunarele intermediarilor.`;
    } else if (updated.bribeEffectiveness === 'SCAMMED') {
      updated.financialVerdict = `🤡 ȚEAPĂ DE ARBITRU: Arbitrul a încasat cei €${updated.moneySpent.toLocaleString()}, dar de frica observatorului a fluierat 100% curat! Banii au fost aruncați pe geam.`;
    } else if (updated.bribeEffectiveness === 'FAILED_PENALTY') {
      updated.financialVerdict = `🤦‍♂️ AJUTOR IROSIT: Arbitrul a acordat penalty-ul cumpărat, dar atacantul a ratat! €${updated.moneySpent.toLocaleString()} cheltuiți degeaba.`;
    } else if (teamGoals < oppGoals) {
      // Echipa a plătit mita, dar adversarul a fost mai bun și a bătut pe teren!
      updated.financialVerdict = `💸 DUBLĂ PAGUBĂ: Clubul a plătit €${updated.moneySpent.toLocaleString()}, dar ${opponentShort} a fost mai bună și a câștigat (${oppGoals}-${teamGoals})! Meci pierdut și conturi golite.`;
    } else if (teamGoals === oppGoals) {
      updated.financialVerdict = `📉 REZULTAT INSUFICIENT: Mita de €${updated.moneySpent.toLocaleString()} a adus doar o remiză (${teamGoals}-${oppGoals}). Raport investiție/rezultat slab.`;
    } else {
      // Echipa a câștigat
      if (teamGoals - oppGoals >= 2) {
        updated.financialVerdict = `⚠️ CHELTUIALĂ INUTILĂ: Echipa a dominat clar și a câștigat categoric (${teamGoals}-${oppGoals}). Banii (€${updated.moneySpent.toLocaleString()}) au fost risipiți inutil!`;
      } else {
        updated.financialVerdict = `💼 VICTORIE LA LIMITĂ: Meci strâns (${teamGoals}-${oppGoals}). Arbitrul a oferit mici avantaje la fazele 50-50, dar banii (€${updated.moneySpent.toLocaleString()}) au părăsit definitiv visteria.`;
      }
    }
  }

  // Dacă arbitrul a raportat mita → deconspirare garantată
  if (result.bribeReported) {
    updated.isDiscovered = true;
    updated.penalty = 'POINTS_DEDUCTION';
    updated.pointsDeducted = 9 + Math.floor(rng() * 6); // 9-14 puncte
    updated.fineAmount = 350000;
    return updated;
  }

  // Investigație bazată pe scor de suspiciune
  const discoveryThreshold = 55 + rng() * 25; // 55-80
  if (updated.investigationScore > discoveryThreshold) {
    updated.isDiscovered = true;

    // Severitatea pedepsei
    if (updated.investigationScore > 80) {
      updated.penalty = 'RELEGATION';
      updated.pointsDeducted = 15;
      updated.fineAmount = 800000;
    } else if (updated.investigationScore > 65) {
      updated.penalty = 'POINTS_DEDUCTION';
      updated.pointsDeducted = 6 + Math.floor(rng() * 4);
      updated.fineAmount = 350000;
    } else {
      updated.penalty = 'FINE';
      updated.fineAmount = 100000 + Math.floor(rng() * 150000);
    }
  }

  return updated;
}
