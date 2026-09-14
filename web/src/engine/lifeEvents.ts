import { Player, PlayerLifeEvent } from './types';

export interface LifeEventTemplate {
  type: PlayerLifeEvent['type'];
  title: string;
  descriptionTemplate: (name: string) => string;
  moraleChange: number;
  fitnessChange?: number;
  aggressionChange?: number;
  probability: number; // 0 - 1
  minAge?: number;
}

export const LIFE_EVENT_TEMPLATES: LifeEventTemplate[] = [
  {
    type: 'CHILD_BORN',
    title: 'Nașterea unui Copil 👶',
    descriptionTemplate: (name) => `${name} a devenit tată noaptea trecută! Familia și suporterii îl felicită cu căldură.`,
    moraleChange: +35,
    fitnessChange: -6, // Noapte nedormită la maternitate
    aggressionChange: -5,
    probability: 0.05,
    minAge: 21
  },
  {
    type: 'WEDDING',
    title: 'Căsătorie / Nuntă 💍',
    descriptionTemplate: (name) => `${name} a spus „DA” în fața ofițerului stării civile într-o ceremonie restrânsă.`,
    moraleChange: +25,
    fitnessChange: -4,
    aggressionChange: -4,
    probability: 0.04,
    minAge: 22
  },
  {
    type: 'DIVORCE',
    title: 'Divorț Scandalos 💔',
    descriptionTemplate: (name) => `${name} trece printr-o despărțire dureroasă și un partaj intens acoperit de presa tabloidă.`,
    moraleChange: -45,
    fitnessChange: -5,
    aggressionChange: +10,
    probability: 0.03,
    minAge: 24
  },
  {
    type: 'NIGHTCLUB_SCANDAL',
    title: 'Scandal în Clubul de Noapte 🍸',
    descriptionTemplate: (name) => `${name} a fost fotografiat de fani petrecând într-un club până la ora 04:00 dimineața.`,
    moraleChange: -10,
    fitnessChange: -15, // Mahmureală severă
    aggressionChange: +8,
    probability: 0.06,
    minAge: 18
  },
  {
    type: 'CASINO_WIN',
    title: 'Câștig Neașteptat la Cazinou 🎰',
    descriptionTemplate: (name) => `${name} a nimerit un pot uriaș și a sărbătorit cumpărând un bolid de lux.`,
    moraleChange: +15,
    fitnessChange: -8,
    aggressionChange: +5,
    probability: 0.04,
    minAge: 19
  },
  {
    type: 'TRANSFER_RUMOR',
    title: 'Zvon de Transfer din Străinătate ✈️',
    descriptionTemplate: (name) => `Presa sportivă vuiește: un club din Golf pregătește o ofertă fabuloasă pentru ${name}.`,
    moraleChange: +10,
    fitnessChange: 0,
    aggressionChange: 0,
    probability: 0.08,
    minAge: 20
  }
];

/**
 * Declanșează evenimente neprevăzute din viața jucătorilor între etape
 */
export function triggerLifeEventsForTeam(players: Player[], currentSeasonDay: number): { player: Player; event: PlayerLifeEvent }[] {
  const triggered: { player: Player; event: PlayerLifeEvent }[] = [];

  for (const player of players) {
    // Șansă mică per jucător la fiecare simulare de rotație
    if (Math.random() < 0.12) {
      const eligibleTemplates = LIFE_EVENT_TEMPLATES.filter(
        t => !t.minAge || player.age >= t.minAge
      );

      if (eligibleTemplates.length === 0) continue;

      const template = eligibleTemplates[Math.floor(Math.random() * eligibleTemplates.length)];

      const newEvent: PlayerLifeEvent = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        date: `Ziua ${currentSeasonDay} Sezon`,
        seasonDay: currentSeasonDay,
        type: template.type,
        title: template.title,
        description: template.descriptionTemplate(player.name),
        moraleChange: template.moraleChange,
        fitnessChange: template.fitnessChange,
        aggressionChange: template.aggressionChange
      };

      // Aplicăm efectul pe starea jucătorului
      player.morale = Math.max(0, Math.min(100, player.morale + template.moraleChange));
      if (template.fitnessChange) {
        player.condition = Math.max(10, Math.min(100, player.condition + template.fitnessChange));
      }
      if (template.aggressionChange) {
        player.aggression = Math.max(10, Math.min(99, player.aggression + template.aggressionChange));
      }

      if (!player.lifeEvents) player.lifeEvents = [];
      player.lifeEvents.unshift(newEvent);

      triggered.push({ player, event: newEvent });
    }
  }

  return triggered;
}
