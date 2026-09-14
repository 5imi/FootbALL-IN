import { Team, LineRatings, Player, WeatherType, PitchCondition } from './types';


/**
 * Calculează performanța individuală a unui jucător pe baza atributelor SP:
 * - Atributele principale (Bold) au 50% pondere
 * - Atributele secundare au 30% pondere
 * - Restul au 20% pondere
 * - Multiplicat cu factorul de condiție fizică (stamina) și moral
 * - Bonus de experiență (până la +15% pentru jucătorii veterani/experimentați)
 */
export function calculatePlayerPerformance(player: Player): number {
  const cond = (player.condition ?? player.fitness ?? 100) / 100;
  const mor = ((player.morale ?? 100) + 50) / 150; // 0% moral -> 0.33x factor, 100% moral -> 1.0x factor
  const expFactor = 1 + ((player.experience ?? 0) / 100) * 0.15; // până la +15% boost de la EXP

  if (!player.skills) {
    // Fallback retroactiv dacă nu există skills detaliate
    const base = player.overallQuality ?? player.overall ?? 70;
    return Math.round(base * cond * mor * expFactor);
  }

  const s = player.skills;
  let primarySum = 0;
  let primaryCount = 0;
  let secondarySum = 0;
  let secondaryCount = 0;
  let otherSum = 0;
  let otherCount = 0;

  for (const key of Object.keys(s) as (keyof typeof s)[]) {
    const skill = s[key];
    if (skill.isPrimary) {
      primarySum += skill.value;
      primaryCount++;
    } else if (skill.isSecondary) {
      secondarySum += skill.value;
      secondaryCount++;
    } else {
      otherSum += skill.value;
      otherCount++;
    }
  }

  const pAvg = primaryCount > 0 ? primarySum / primaryCount : 60;
  const sAvg = secondaryCount > 0 ? secondarySum / secondaryCount : 50;
  const oAvg = otherCount > 0 ? otherSum / otherCount : 40;

  // Formula ponderată SP
  const rawSkillPerformance = (pAvg * 0.50) + (sAvg * 0.30) + (oAvg * 0.20);
  const effectiveScore = rawSkillPerformance * cond * mor * expFactor;

  return Math.max(20, Math.min(99, Math.round(effectiveScore)));
}

export function calculateLineRatings(
  team: Team,
  weather: WeatherType = 'SUNNY',
  pitch: PitchCondition = 'PRISTINE'
): LineRatings {
  const starters = team.lineup;

  const defPlayers = starters.filter((p) => ['LB', 'CB', 'RB'].includes(p.position));
  const midPlayers = starters.filter((p) => ['LM', 'CM', 'RM'].includes(p.position));
  const attPlayers = starters.filter((p) => ['LF', 'CF', 'RF'].includes(p.position));
  const gk = starters.find((p) => p.position === 'GK');

  const avgPerf = (players: Player[], defaultVal: number) => {
    if (players.length === 0) return defaultVal;
    const sum = players.reduce((acc, p) => acc + calculatePlayerPerformance(p), 0);
    return Math.round(sum / players.length);
  };

  const gkScore = gk ? calculatePlayerPerformance(gk) : 65;
  const defScore = Math.round(avgPerf(defPlayers, 68) * 0.75 + gkScore * 0.25);
  const midScore = avgPerf(midPlayers, 70);
  const attScore = avgPerf(attPlayers, 70);


  let defBonus = 0;
  let midBonus = 0;
  let attBonus = 0;

  if (team.tactics.style === 'DEFENSIVE') defBonus += 4;
  if (team.tactics.style === 'PASSING') midBonus += 3;
  if (team.tactics.style === 'WING_PLAY') attBonus += 3;
  if (team.tactics.style === 'KICK_AND_RUSH') {
    attBonus += 2;
    defBonus -= 1;
  }

  // ─── IMPACT MEDIU & TEREN (conform documentației) ───
  // Teren mocirlos (MUDDY) sau ploaie torențială (RAIN):
  // Tiki-Taka / Passing suferă din cauza bălților, în timp ce jocul direct (Kick and Rush) devine mai eficient
  if (pitch === 'MUDDY' || weather === 'RAIN') {
    if (team.tactics.style === 'PASSING') {
      midBonus -= 3; // Pasele scurte sunt blocate în noroi
    } else if (team.tactics.style === 'KICK_AND_RUSH') {
      attBonus += 3; // Mingea lungă sare peste bălți
    }
  }

  // Zăpadă / Teren înghețat (SNOW / FROZEN):
  // Viteza pe extreme scade, apărarea și jocul de forță domină
  if (weather === 'SNOW' || pitch === 'FROZEN') {
    if (team.tactics.style === 'WING_PLAY') {
      attBonus -= 2; // Alunecă pe bandă
    }
    defBonus += 2; // Spațiile sunt închise mai ușor
  }

  // Ceață densă (FOG):
  // Portarii și fundașii văd greu mingea
  if (weather === 'FOG') {
    defBonus -= 2;
  }

  const finalDef = Math.max(40, defScore + defBonus);
  const finalMid = Math.max(40, midScore + midBonus);
  const finalAtt = Math.max(40, attScore + attBonus);

  return {
    defense: finalDef,
    midfield: finalMid,
    attack: finalAtt,
    total: Math.round((finalDef + finalMid + finalAtt) / 3),
  };
}
