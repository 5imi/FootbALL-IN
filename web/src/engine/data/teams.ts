import { Team } from '../types';
import { generateSPPlayer } from '../playerGenerator';

export const teamProgresul: Team = {
  id: 'progresul',
  name: 'FC Progresul București',
  shortName: 'PRO',
  primaryColor: '#2563eb', // Albastru intens
  secondaryColor: '#38bdf8', // Cyan
  stadium: 'Arena Dr. Mircea Luca (15.000 locuri)',
  tactics: {
    formation: '4-4-2',
    style: 'PASSING',
    aggressiveness: 55,
  },
  lineup: [
    generateSPPlayer({ id: 'p1', name: 'Radu Popa', number: 1, position: 'GK', age: 26, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'p2', name: 'Cristian Manea', number: 2, position: 'RB', age: 27, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'p3', name: 'Florin Bejan', number: 4, position: 'CB', age: 31, tier: 'VETERAN', squad: 'A' }),
    generateSPPlayer({ id: 'p4', name: 'Bogdan Mitrea', number: 5, position: 'CB', age: 33, tier: 'VETERAN', squad: 'A' }),
    generateSPPlayer({ id: 'p5', name: 'Andrei Radu', number: 3, position: 'LB', age: 25, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'p6', name: 'Dennis Man', nickname: 'Star Winger', number: 7, position: 'RM', age: 26, tier: 'STAR', squad: 'A' }),
    generateSPPlayer({ id: 'p7', name: 'Alex Cicâldău', number: 8, position: 'CM', age: 27, tier: 'STAR', squad: 'A' }),
    generateSPPlayer({ id: 'p8', name: 'Răzvan Marin', number: 6, position: 'CM', age: 28, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'p9', name: 'Valentin Mihăilă', number: 11, position: 'LM', age: 24, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'p10', name: 'Denis Alibec', nickname: 'Magicianul', number: 9, position: 'CF', age: 33, tier: 'STAR', squad: 'A' }),
    generateSPPlayer({ id: 'p11', name: 'George Pușcaș', number: 19, position: 'CF', age: 28, tier: 'REGULAR', squad: 'A' }),
  ],
  bench: [
    generateSPPlayer({ id: 'p12', name: 'Laurențiu Popescu', number: 12, position: 'GK', age: 28, tier: 'REGULAR', squad: 'B' }),
    generateSPPlayer({ id: 'p13', name: 'Denis Ciobotariu', number: 14, position: 'CB', age: 26, tier: 'REGULAR', squad: 'B' }),
    generateSPPlayer({ id: 'p14', name: 'Ionuț Croitoru', number: 54, position: 'CM', age: 21, tier: 'YOUTH', squad: 'C' }),
    generateSPPlayer({ id: 'p15', name: 'Ionuț Iacob', number: 18, position: 'LB', age: 18, tier: 'YOUTH', squad: 'C' }),
    generateSPPlayer({ id: 'p16', name: 'Daniel Bîrligea', number: 21, position: 'CF', age: 24, tier: 'REGULAR', squad: 'B' }),
  ]
};

export const teamGloria: Team = {
  id: 'gloria',
  name: 'CS Gloria Rivalii',
  shortName: 'GLO',
  primaryColor: '#dc2626', // Roșu intens
  secondaryColor: '#facc15', // Galben
  stadium: 'Stadionul Municipal Gloria (14.500 locuri)',
  tactics: {
    formation: '4-3-3',
    style: 'WING_PLAY',
    aggressiveness: 60,
  },
  lineup: [
    generateSPPlayer({ id: 'g1', name: 'Ciprian Tătăruș', number: 12, position: 'GK', age: 36, tier: 'VETERAN', squad: 'A' }),
    generateSPPlayer({ id: 'g2', name: 'Paul Papp', number: 2, position: 'RB', age: 34, tier: 'VETERAN', squad: 'A' }),
    generateSPPlayer({ id: 'g3', name: 'Ionuț Nedelcearu', number: 4, position: 'CB', age: 28, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'g4', name: 'Vlad Chiricheș', nickname: 'Il Capitano', number: 5, position: 'CB', age: 34, tier: 'VETERAN', squad: 'A' }),
    generateSPPlayer({ id: 'g5', name: 'Iasmin Latovlevici', number: 3, position: 'LB', age: 36, tier: 'VETERAN', squad: 'A' }),
    generateSPPlayer({ id: 'g6', name: 'Nicolae Stanciu', nickname: 'Maestrul', number: 10, position: 'CM', age: 31, tier: 'STAR', squad: 'A' }),
    generateSPPlayer({ id: 'g7', name: 'Darius Olaru', number: 27, position: 'CM', age: 26, tier: 'STAR', squad: 'A' }),
    generateSPPlayer({ id: 'g8', name: 'Adrian Șut', number: 8, position: 'CM', age: 25, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'g9', name: 'Florinel Coman', nickname: 'Mbappé de România', number: 7, position: 'LF', age: 26, tier: 'STAR', squad: 'A' }),
    generateSPPlayer({ id: 'g10', name: 'Andrei Ivan', number: 9, position: 'CF', age: 27, tier: 'REGULAR', squad: 'A' }),
    generateSPPlayer({ id: 'g11', name: 'Ianis Hagi', number: 11, position: 'RF', age: 25, tier: 'STAR', squad: 'A' }),
  ],
  bench: [
    generateSPPlayer({ id: 'g12', name: 'Eduard Pap', number: 1, position: 'GK', age: 29, tier: 'REGULAR', squad: 'B' }),
    generateSPPlayer({ id: 'g13', name: 'Igor Kurtanovic', number: 3, position: 'CB', age: 20, tier: 'YOUTH', squad: 'C' }),
    generateSPPlayer({ id: 'g14', name: 'Octavian Popescu', number: 17, position: 'LF', age: 21, tier: 'YOUTH', squad: 'B' }),
    generateSPPlayer({ id: 'g15', name: 'Jovan Markovic', number: 20, position: 'CF', age: 23, tier: 'REGULAR', squad: 'B' }),
  ]
};

// Căpitan setat
teamProgresul.lineup[2].isCaptain = true;
teamGloria.lineup[0].isCaptain = true;

export const initialTeams: Team[] = [teamProgresul, teamGloria];
