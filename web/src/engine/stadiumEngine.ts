/**
 * Stadium Engine — Calcul venituri, costuri upgrade, rating infrastructură
 * Inspirat din SoccerProject Classic
 */

export type StadiumCategory = 'SEATS' | 'PARKING' | 'TOILETS' | 'BARS' | 'PITCH' | 'ADS';

export interface StadiumData {
  id: number;
  teamId: number;
  capacity: number;
  seats: number;
  parking: number;
  toilets: number;
  bars: number;
  pitchQuality: number;
  pitchType?: string;
  advertisingBoards: number;
  ticketPrice: number;
}

export interface DetailedUpgradeOption {
  label: string;
  durationDays: number;
  cost: number;
  increaseAmount?: number;
  newPitchType?: string;
  newPitchQuality?: number;
}

export const PITCH_UPGRADE_OPTIONS: DetailedUpgradeOption[] = [
  { label: 'Doar iarbă naturală', durationDays: 1, cost: 2500, newPitchType: 'Doar iarbă naturală', newPitchQuality: 100 },
  { label: 'Iarbă naturală cu scurgere', durationDays: 3, cost: 7500, newPitchType: 'Iarbă naturală cu scurgere', newPitchQuality: 100 },
  { label: 'Iarbă naturală cu scurgere și încălzire', durationDays: 5, cost: 15000, newPitchType: 'Iarbă naturală cu scurgere și încălzire', newPitchQuality: 100 },
  { label: 'Combinaţie HiTech de iarbă naturală şi artificială', durationDays: 10, cost: 100000, newPitchType: 'Combinaţie HiTech de iarbă naturală şi artificială', newPitchQuality: 100 },
];

export const STANDS_UPGRADE_OPTIONS: DetailedUpgradeOption[] = [
  { label: '+ 1000', durationDays: 10, cost: 1125000, increaseAmount: 1000 },
  { label: '+ 1000', durationDays: 5, cost: 1500000, increaseAmount: 1000 },
  { label: '+ 3000', durationDays: 26, cost: 3250000, increaseAmount: 3000 },
  { label: '+ 3000', durationDays: 13, cost: 4400000, increaseAmount: 3000 },
  { label: '+ 5000', durationDays: 40, cost: 5000000, increaseAmount: 5000 },
  { label: '+ 5000', durationDays: 20, cost: 6600000, increaseAmount: 5000 },
];

export const PARKING_UPGRADE_OPTIONS: DetailedUpgradeOption[] = [
  { label: '+ 250', durationDays: 7, cost: 12500, increaseAmount: 250 },
  { label: '+ 750', durationDays: 15, cost: 37000, increaseAmount: 750 },
  { label: '+ 1250', durationDays: 25, cost: 60000, increaseAmount: 1250 },
];

export const TOILETS_UPGRADE_OPTIONS: DetailedUpgradeOption[] = [
  { label: '+ 10', durationDays: 2, cost: 1000, increaseAmount: 10 },
  { label: '+ 30', durationDays: 5, cost: 2750, increaseAmount: 30 },
  { label: '+ 50', durationDays: 10, cost: 4500, increaseAmount: 50 },
];

export const BARS_UPGRADE_OPTIONS: DetailedUpgradeOption[] = [
  { label: '+ 2', durationDays: 5, cost: 10000, increaseAmount: 2 },
  { label: '+ 6', durationDays: 15, cost: 27500, increaseAmount: 6 },
  { label: '+ 10', durationDays: 25, cost: 45000, increaseAmount: 10 },
];

export interface UpgradeInfo {
  category: StadiumCategory;
  label: string;
  icon: string;
  currentValue: number;
  maxValue: number;
  upgradeAmount: number;
  upgradeCost: number;
  unit: string;
  description: string;
  effect: string;
}

export interface MatchRevenueEstimate {
  attendance: number;
  ticketRevenue: number;
  barRevenue: number;
  sponsorRevenue: number;
  totalRevenue: number;
  attendancePercent: number;
}

export interface StadiumRating {
  stars: number;       // 1-5
  comfortScore: number; // 0-100
  label: string;
}

// ─── Constante de Upgrade ─────────────────────────────────────────────────────

const UPGRADE_CONFIG: Record<StadiumCategory, {
  costPerUnit: number;
  amountPerUpgrade: number;
  maxValue: number;
  unit: string;
}> = {
  SEATS:   { costPerUnit: 50,    amountPerUpgrade: 1000, maxValue: 80000, unit: 'locuri' },
  PARKING: { costPerUnit: 60,    amountPerUpgrade: 500,  maxValue: 25000, unit: 'parcări' },
  TOILETS: { costPerUnit: 600,   amountPerUpgrade: 25,   maxValue: 500,   unit: 'toalete' },
  BARS:    { costPerUnit: 4000,  amountPerUpgrade: 5,    maxValue: 100,   unit: 'baruri' },
  PITCH:   { costPerUnit: 1000,  amountPerUpgrade: 10,   maxValue: 100,   unit: '%' },
  ADS:     { costPerUnit: 4000,  amountPerUpgrade: 10,   maxValue: 200,   unit: 'panouri' },
};

// ─── Funcții de Calcul ────────────────────────────────────────────────────────

/**
 * Returnează costul și detaliile upgrade-ului pentru o categorie
 */
export function getUpgradeInfo(stadium: StadiumData, category: StadiumCategory, lang: 'ro' | 'en' = 'ro'): UpgradeInfo {
  const config = UPGRADE_CONFIG[category];
  const currentValue = getCategoryValue(stadium, category);
  const upgradeCost = config.costPerUnit * config.amountPerUpgrade;

  const labels: Record<StadiumCategory, { ro: string; en: string; icon: string; desc: { ro: string; en: string }; effect: { ro: string; en: string } }> = {
    SEATS: {
      ro: 'Locuri', en: 'Seats', icon: '💺',
      desc: { ro: 'Capacitate tribune', en: 'Tribune capacity' },
      effect: { ro: `+${config.amountPerUpgrade} locuri → mai mulți spectatori`, en: `+${config.amountPerUpgrade} seats → more spectators` },
    },
    PARKING: {
      ro: 'Parcări', en: 'Parking', icon: '🅿️',
      desc: { ro: 'Locuri de parcare', en: 'Parking spots' },
      effect: { ro: `+${config.amountPerUpgrade} parcări → acces mai ușor`, en: `+${config.amountPerUpgrade} spots → easier access` },
    },
    TOILETS: {
      ro: 'Toalete', en: 'Toilets', icon: '🚻',
      desc: { ro: 'Grupuri sanitare', en: 'Restrooms' },
      effect: { ro: `+${config.amountPerUpgrade} toalete → confort spectatori`, en: `+${config.amountPerUpgrade} toilets → spectator comfort` },
    },
    BARS: {
      ro: 'Baruri & Chioșcuri', en: 'Bars & Kiosks', icon: '🍺',
      desc: { ro: 'Puncte vânzare mâncare/băuturi', en: 'Food & drink stands' },
      effect: { ro: `+${config.amountPerUpgrade} baruri → venituri suplimentare`, en: `+${config.amountPerUpgrade} bars → extra revenue` },
    },
    PITCH: {
      ro: 'Calitate Teren', en: 'Pitch Quality', icon: '🌱',
      desc: { ro: 'Gazon și suprafață de joc', en: 'Grass and playing surface' },
      effect: { ro: `+${config.amountPerUpgrade}% → mai puține accidentări`, en: `+${config.amountPerUpgrade}% → fewer injuries` },
    },
    ADS: {
      ro: 'Panouri Publicitare', en: 'Ad Boards', icon: '📺',
      desc: { ro: 'Bannere sponsorizare', en: 'Sponsorship banners' },
      effect: { ro: `+${config.amountPerUpgrade} panouri → €${(config.amountPerUpgrade * 500).toLocaleString()}/săpt`, en: `+${config.amountPerUpgrade} boards → €${(config.amountPerUpgrade * 500).toLocaleString()}/wk` },
    },
  };

  const info = labels[category];

  return {
    category,
    label: info[lang],
    icon: info.icon,
    currentValue,
    maxValue: config.maxValue,
    upgradeAmount: config.amountPerUpgrade,
    upgradeCost,
    unit: config.unit,
    description: info.desc[lang],
    effect: info.effect[lang],
  };
}

/**
 * Returnează valoarea curentă a unei categorii de stadion
 */
function getCategoryValue(stadium: StadiumData, category: StadiumCategory): number {
  switch (category) {
    case 'SEATS':   return stadium.seats;
    case 'PARKING': return stadium.parking;
    case 'TOILETS': return stadium.toilets;
    case 'BARS':    return stadium.bars;
    case 'PITCH':   return stadium.pitchQuality;
    case 'ADS':     return stadium.advertisingBoards;
  }
}

/**
 * Calculează estimarea veniturilor pe zi de meci
 */
export function calculateMatchRevenue(stadium: StadiumData, popularity: number = 60): MatchRevenueEstimate {
  const attendance = calculateAttendance(stadium, popularity);
  const ticketRevenue = attendance * stadium.ticketPrice;
  
  // Fiecare bar generează €2/spectator (max ~30% din spectatori consumă)
  const barRevenue = Math.round(attendance * 0.3 * (stadium.bars / 10) * 2);
  
  // Fiecare panou publicirar generează €500/meci
  const sponsorRevenue = stadium.advertisingBoards * 500;
  
  const totalRevenue = ticketRevenue + barRevenue + sponsorRevenue;
  const attendancePercent = stadium.seats > 0 ? Math.round((attendance / stadium.seats) * 100) : 0;

  return {
    attendance,
    ticketRevenue: Math.round(ticketRevenue),
    barRevenue,
    sponsorRevenue,
    totalRevenue: Math.round(totalRevenue),
    attendancePercent: Math.min(attendancePercent, 100),
  };
}

/**
 * Calculează nr. spectatori estimați pe baza capacității, parcărilor, toaletelor și popularității
 */
function calculateAttendance(stadium: StadiumData, popularity: number): number {
  // Baza: popularitate × capacitate
  let baseAttendance = Math.round(stadium.seats * (popularity / 100));
  
  // Penalizare dacă parcările sunt insuficiente (sub 1 parcare / 3 spectatori)
  const parkingRatio = stadium.seats > 0 ? (stadium.parking * 3) / stadium.seats : 1;
  const parkingFactor = Math.min(parkingRatio, 1.0);
  
  // Penalizare dacă toaletele sunt insuficiente (sub 1 toaletă / 100 spectatori)
  const toiletRatio = stadium.seats > 0 ? (stadium.toilets * 100) / stadium.seats : 1;
  const toiletFactor = Math.min(toiletRatio, 1.0);
  
  // Comfort multiplier (parcări + toalete contribuie la confort)
  const comfortMultiplier = 0.7 + (parkingFactor * 0.15) + (toiletFactor * 0.15);
  
  const finalAttendance = Math.round(baseAttendance * comfortMultiplier);
  
  return Math.min(finalAttendance, stadium.seats);
}

/**
 * Calculează ratingul stadionului (1-5 stele)
 */
export function getStadiumRating(stadium: StadiumData, lang: 'ro' | 'en' = 'ro'): StadiumRating {
  // Score din fiecare categorie (0-100 normalizat)
  const seatsScore = Math.min((stadium.seats / 40000) * 100, 100);
  const parkingScore = Math.min((stadium.parking / 12000) * 100, 100);
  const toiletScore = Math.min((stadium.toilets / 250) * 100, 100);
  const barScore = Math.min((stadium.bars / 50) * 100, 100);
  const pitchScore = stadium.pitchQuality;
  const adScore = Math.min((stadium.advertisingBoards / 100) * 100, 100);
  
  // Comfort general (medie ponderată)
  const comfortScore = Math.round(
    seatsScore * 0.30 +
    parkingScore * 0.15 +
    toiletScore * 0.15 +
    barScore * 0.15 +
    pitchScore * 0.15 +
    adScore * 0.10
  );
  
  // Stele: 0-20 = 1⭐, 21-40 = 2⭐, 41-60 = 3⭐, 61-80 = 4⭐, 81-100 = 5⭐
  const stars = Math.max(1, Math.min(5, Math.ceil(comfortScore / 20)));
  
  const labels: Record<number, { ro: string; en: string }> = {
    1: { ro: 'Teren de Mahala', en: 'Backyard Pitch' },
    2: { ro: 'Stadion Modest', en: 'Modest Ground' },
    3: { ro: 'Arenă Decentă', en: 'Decent Arena' },
    4: { ro: 'Arenă Modernă', en: 'Modern Arena' },
    5: { ro: 'Templu al Fotbalului', en: 'Football Temple' },
  };
  
  return {
    stars,
    comfortScore,
    label: labels[stars][lang],
  };
}

/**
 * Toate categoriile disponibile pentru iterare
 */
export const ALL_CATEGORIES: StadiumCategory[] = ['SEATS', 'PARKING', 'TOILETS', 'BARS', 'PITCH', 'ADS'];

/**
 * Stadion default (pentru echipe noi)
 */
export const DEFAULT_STADIUM: StadiumData = {
  id: 0,
  teamId: 0,
  capacity: 5000,
  seats: 5000,
  parking: 1650,
  toilets: 50,
  bars: 10,
  pitchQuality: 100,
  advertisingBoards: 0,
  ticketPrice: 10.0,
};
