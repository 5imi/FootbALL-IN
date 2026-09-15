import { Player } from './types';
import { PhysioStaff } from './trainingEngine';

export interface RecoveryReport {
  playerId: string;
  playerName: string;
  oldCondition: number;
  newCondition: number;
  recoveredAmount: number;
  isFatigued: boolean;    // Condiție sub 80% (risc mic)
  isCriticalInjuryRisk: boolean; // Condiție sub 70% (risc major!)
}

/**
 * Consumă condiție fizică în urma disputării unui meci
 */
export function depletePlayerMatchFitness(
  player: Player,
  minutesPlayed: number = 90,
  tacticalAggressiveness: number = 50
): number {
  // Bază: un meci de 90 min consumă între 10% și 15%
  const timeFactor = minutesPlayed / 90;
  const aggroFactor = 1 + (tacticalAggressiveness / 100) * 0.3; // agresivitate mare obosește mai tare
  const baseDepletion = 11.5 * timeFactor * aggroFactor;

  // Jucătorii cu rezistență mare (Stamina skill) obosesc mai greu
  const staminaSkill = player.skills?.stamina?.value ?? 50;
  const staminaMitigation = 1 - (staminaSkill / 100) * 0.25; // reduce consumul cu până la 25%

  const actualDepletion = Math.round(baseDepletion * staminaMitigation);
  player.condition = Math.max(10, player.condition - actualDepletion);
  player.fitness = player.condition;

  return actualDepletion;
}

/**
 * Aplică recuperarea fizică între meciuri/simulări cu ajutorul maseurului
 */
export function recoverSquadFitness(
  players: Player[],
  physio: PhysioStaff,
  intervalHours: number = 12
): RecoveryReport[] {
  const reports: RecoveryReport[] = [];

  // Calitatea maseurului dictează rata de recuperare:
  // Maseur 100%: recuperează ~8% la 12 ore, ~15% la 24 ore
  // Maseur 40%: recuperează doar ~3% la 12 ore
  const hourlyRate = 0.35 + (physio.quality / 100) * 0.45; // 0.35% - 0.80% pe oră
  const baseRecovery = hourlyRate * intervalHours;

  for (const player of players) {
    const oldCondition = player.condition;
    
    // Dacă jucătorul a stat pe bară (lot C/D) și nu a jucat, se recuperează mai rapid
    const benchBonus = player.squad === 'C' || player.squad === 'D' ? 1.25 : 1.0;
    const finalRecovery = Math.round(baseRecovery * benchBonus);

    const newCondition = Math.min(100, oldCondition + finalRecovery);
    player.condition = newCondition;
    player.fitness = newCondition;

    reports.push({
      playerId: player.id,
      playerName: player.name,
      oldCondition,
      newCondition,
      recoveredAmount: newCondition - oldCondition,
      isFatigued: newCondition < 80,
      isCriticalInjuryRisk: newCondition < 70
    });
  }

  return reports;
}

/**
 * Calculează riscul matematic de accidentare înainte de meci
 */
export function calculateInjuryRisk(player: Player): { riskPercent: number; riskLevel: 'SAFE' | 'WARNING' | 'DANGER' } {
  const cond = player.condition;

  if (cond >= 85) {
    return { riskPercent: 1, riskLevel: 'SAFE' };
  } else if (cond >= 75) {
    return { riskPercent: 6, riskLevel: 'WARNING' };
  } else if (cond >= 65) {
    return { riskPercent: 22, riskLevel: 'DANGER' };
  } else {
    return { riskPercent: 55, riskLevel: 'DANGER' };
  }
}
