import { Player, SkillName, PlayerSkills } from './types';

export interface TrainerStaff {
  id: string;
  name: string;
  quality: number; // 1 - 100% (influențează viteza de creștere a atributelor)
  salaryWeekly: number;
}

export interface PhysioStaff {
  id: string;
  name: string;
  quality: number; // 1 - 100% (influențează recuperarea condiției fizice)
  salaryWeekly: number;
}

export interface TrainingProgressReport {
  playerId: string;
  playerName: string;
  skillTrained: SkillName;
  oldValue: number;
  newValue: number;
  hasCapped: boolean; // a atins plafonul roșu în această sesiune!
  trainerBonus: number;
}

/**
 * Calculează și aplică o sesiune de antrenament pentru un jucător
 */
export function trainPlayerSession(
  player: Player,
  trainer: TrainerStaff,
  targetedSkill?: SkillName
): TrainingProgressReport | null {
  if (!player.skills) return null;

  // Dacă nu este specificat un atribut (modul Auto), antrenăm ÎNTOTDEAUNA cel mai mic atribut neplafonat!
  let skillToTrain: SkillName = targetedSkill || 'stamina';
  
  if (!targetedSkill) {
    // Găsim toate atributele neplafonate și îl selectăm pe cel cu valoarea minimă absolută
    const uncappedSkills = (Object.keys(player.skills) as SkillName[])
      .filter(k => !player.skills[k].isTrainedMax)
      .sort((a, b) => player.skills[a].value - player.skills[b].value);

    if (uncappedSkills.length > 0) {
      skillToTrain = uncappedSkills[0]; // Cel mai mic atribut neplafonat!
    } else {
      // Jucătorul este 100% complet plafonat pe toate cele 10 atribute (toate barele roșii)
      return null;
    }
  }


  const skillDetail = player.skills[skillToTrain];
  if (skillDetail.isTrainedMax) {
    // Atributul selectat e deja plafonat roșu
    return null;
  }

  const oldValue = skillDetail.value;
  const maxCap = skillDetail.maxCap;

  // ─── FORMULA MATEMATICĂ DE PROGRES (SoccerProject Style) ───
  // 1. Randament antrenor (0.4x la antrenor de 40%, 1.0x la antrenor de 100%)
  const trainerFactor = 0.3 + (trainer.quality / 100) * 0.7;

  // 2. Condiție fizică (jucătorul obosit învață mai greu)
  const conditionFactor = Math.max(0.4, player.condition / 100);

  // 3. Curbă de învățare: valorile mici (juniori 0-40%) cresc mai accelerat (+2.0 - +2.8%)
  // Pe când valorile mari (70-85%) cresc cu migală (+0.6 - +1.0%)
  let baseGain = 1.0;
  if (oldValue < 30) {
    baseGain = 2.4;
  } else if (oldValue < 50) {
    baseGain = 1.8;
  } else if (oldValue < 75) {
    baseGain = 1.1;
  } else {
    baseGain = 0.7;
  }

  const totalGain = baseGain * trainerFactor * conditionFactor;
  let newValue = Math.round((oldValue + totalGain) * 10) / 10;

  let hasCapped = false;
  if (newValue >= maxCap) {
    newValue = maxCap;
    skillDetail.isTrainedMax = true;
    hasCapped = true;
  }

  skillDetail.value = newValue;

  // Recalculăm Calitatea Globală
  const allValues = Object.values(player.skills).map(s => s.value);
  const avgSkill = allValues.reduce((a, b) => a + b, 0) / allValues.length;
  player.overallQuality = Math.round(avgSkill * 0.85 + player.experience * 0.15);
  player.overall = player.overallQuality;

  return {
    playerId: player.id,
    playerName: player.name,
    skillTrained: skillToTrain,
    oldValue,
    newValue,
    hasCapped,
    trainerBonus: Math.round(totalGain * 10) / 10
  };
}

/**
 * Antrenează întreaga echipă (toți jucătorii din lot)
 */
export function trainWholeSquad(
  players: Player[],
  trainer: TrainerStaff,
  customTargets?: Record<string, SkillName>
): TrainingProgressReport[] {
  const reports: TrainingProgressReport[] = [];

  for (const p of players) {
    const target = customTargets ? customTargets[p.id] : undefined;
    const report = trainPlayerSession(p, trainer, target);
    if (report) {
      reports.push(report);
    }
  }

  return reports;
}
