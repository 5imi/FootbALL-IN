import { Player, PositionType, TransferListing, TransferBid } from './types';
import { generateSPPlayer } from './playerGenerator';
import { generatePlayerNameForCountry, COUNTRIES } from './countries';
import { spendClubBudget, receiveClubBudget } from './financeEngine';

const STORAGE_KEY = 'footballin_transfer_market';

// Date inițiale autentice inspirate 1:1 din SoccerProject (spnewl_transfer_overview.php)
const INITIAL_MARKET_SEED: Array<{
  position: PositionType;
  name: string;
  sellerClub: string;
  sellerCountry: string;
  buyerClub: string | null;
  currentBid: number;
  quality: number;
  age: number;
  deadline: string;
  isFreeAgent: boolean;
}> = [
  { position: 'LM', name: 'Thomas De Schutter', sellerClub: 'C.U 1977', sellerCountry: 'BE', buyerClub: 'Mhyl Boyce', currentBid: 1800000, quality: 82, age: 29, deadline: '15 Sep (23:42)', isFreeAgent: false },
  { position: 'RB', name: 'William Adalberto Galdámez', sellerClub: 'Brengovenii', sellerCountry: 'RO', buyerClub: 'FC, Brazil', currentBid: 10000000, quality: 89, age: 25, deadline: '15 Sep (23:00)', isFreeAgent: false },
  { position: 'CB', name: 'Fabien Mulisa', sellerClub: 'FC Žďár nad Sázavou', sellerCountry: 'CZ', buyerClub: 'MDsports', currentBid: 10000000, quality: 79, age: 20, deadline: '15 Sep (22:56)', isFreeAgent: false },
  { position: 'CM', name: 'Licinio Sita', sellerClub: 'COMMODORS', sellerCountry: 'BE', buyerClub: 'Arsenal Liberca', currentBid: 15000000, quality: 35, age: 19, deadline: '15 Sep (22:48)', isFreeAgent: false },
  { position: 'RF', name: 'Peter Werner', sellerClub: 'FK Chmel Mutějovice', sellerCountry: 'CZ', buyerClub: 'Manchester United 1981', currentBid: 7500000, quality: 78, age: 19, deadline: '15 Sep (22:25)', isFreeAgent: false },
  { position: 'CF', name: 'Jeorgif Shostak', sellerClub: 'Los Celestes', sellerCountry: 'ES', buyerClub: 'zaibas', currentBid: 24900000, quality: 83, age: 22, deadline: '15 Sep (22:16)', isFreeAgent: false },
  { position: 'CB', name: 'Rade Savić', sellerClub: 'M.F.K', sellerCountry: 'SK', buyerClub: 'Covid19', currentBid: 27000000, quality: 81, age: 23, deadline: '15 Sep (21:33)', isFreeAgent: false },
  { position: 'CM', name: 'Vincent Reid', sellerClub: 'Korner', sellerCountry: 'GB', buyerClub: 'AC Luftaci', currentBid: 2000000, quality: 84, age: 30, deadline: '15 Sep (21:23)', isFreeAgent: false },
  { position: 'LM', name: 'Libor Rýdel', sellerClub: 'Viktoria Kostnice', sellerCountry: 'CZ', buyerClub: 'kuny borove', currentBid: 2000000, quality: 69, age: 21, deadline: '15 Sep (21:19)', isFreeAgent: false },
  { position: 'LB', name: 'Frank Casha', sellerClub: 'Doom Boys', sellerCountry: 'BE', buyerClub: 'henusky', currentBid: 12000000, quality: 87, age: 27, deadline: '15 Sep (21:16)', isFreeAgent: false },
  { position: 'CM', name: 'Zhang Feng', sellerClub: 'FC Chiang Mai', sellerCountry: 'BE', buyerClub: 'VK Motje', currentBid: 15000000, quality: 79, age: 24, deadline: '15 Sep (21:06)', isFreeAgent: false },
  { position: 'CF', name: 'Robbie Serpieters', sellerClub: 'VK Motje', sellerCountry: 'BE', buyerClub: 'Fk Napolis', currentBid: 10000000, quality: 46, age: 18, deadline: '15 Sep (18:40)', isFreeAgent: false },
  { position: 'CB', name: 'Catalin Muzac', sellerClub: 'Airborne FC', sellerCountry: 'RO', buyerClub: 'FC Outrijve', currentBid: 11000000, quality: 57, age: 22, deadline: '15 Sep (17:46)', isFreeAgent: false },
  { position: 'SW', name: 'Jaromír König', sellerClub: 'FC Lunk', sellerCountry: 'CZ', buyerClub: 'F.C. Cosmin', currentBid: 10000000, quality: 76, age: 29, deadline: '15 Sep (17:43)', isFreeAgent: false },
  { position: 'CM', name: 'Steven Pocognoli', sellerClub: 'Doom Boys', sellerCountry: 'BE', buyerClub: 'wc west', currentBid: 33000000, quality: 85, age: 26, deadline: '15 Sep (17:40)', isFreeAgent: false },
  { position: 'CM', name: 'Gorka Jiménez Ortiz', sellerClub: 'SKM LH', sellerCountry: 'ES', buyerClub: 'S.A.T', currentBid: 42500000, quality: 85, age: 25, deadline: '15 Sep (17:36)', isFreeAgent: false },
  { position: 'RB', name: 'Jeroen Van Damme', sellerClub: 'VK Motje', sellerCountry: 'BE', buyerClub: 'FC Svecova', currentBid: 10000000, quality: 77, age: 21, deadline: '15 Sep (16:51)', isFreeAgent: false },
  { position: 'GK', name: 'Stanislav Lobotka', sellerClub: 'FK TATRAN Turzovka', sellerCountry: 'SK', buyerClub: 'FC Marvel', currentBid: 14500000, quality: 84, age: 27, deadline: '15 Sep (16:45)', isFreeAgent: false },
  
  // ─── Jucători Liberi de Contract (Creați de Joc - Free Agents) ───
  { position: 'GK', name: 'Ionel Bratu', sellerClub: 'Liber de contract', sellerCountry: 'RO', buyerClub: null, currentBid: 0, quality: 73, age: 24, deadline: 'Permanent', isFreeAgent: true },
  { position: 'CB', name: 'Matteo Ferrari', sellerClub: 'Liber de contract', sellerCountry: 'IT', buyerClub: null, currentBid: 0, quality: 78, age: 28, deadline: 'Permanent', isFreeAgent: true },
  { position: 'SW', name: 'Karel Procházka', sellerClub: 'Liber de contract', sellerCountry: 'CZ', buyerClub: null, currentBid: 0, quality: 71, age: 31, deadline: 'Permanent', isFreeAgent: true },
  { position: 'LB', name: 'Dimitri Claes', sellerClub: 'Liber de contract', sellerCountry: 'BE', buyerClub: null, currentBid: 0, quality: 68, age: 20, deadline: 'Permanent', isFreeAgent: true },
  { position: 'CM', name: 'Gabriel Voinea', sellerClub: 'Liber de contract', sellerCountry: 'RO', buyerClub: null, currentBid: 0, quality: 81, age: 26, deadline: 'Permanent', isFreeAgent: true },
  { position: 'LM', name: 'Lukas Podolny', sellerClub: 'Liber de contract', sellerCountry: 'DE', buyerClub: null, currentBid: 0, quality: 75, age: 22, deadline: 'Permanent', isFreeAgent: true },
  { position: 'RM', name: 'Sérgio Conceição Jr.', sellerClub: 'Liber de contract', sellerCountry: 'PT', buyerClub: null, currentBid: 0, quality: 77, age: 23, deadline: 'Permanent', isFreeAgent: true },
  { position: 'CF', name: 'Andrei Moldovan', sellerClub: 'Liber de contract', sellerCountry: 'RO', buyerClub: null, currentBid: 0, quality: 82, age: 25, deadline: 'Permanent', isFreeAgent: true },
  { position: 'LF', name: 'Viktor Kováč', sellerClub: 'Liber de contract', sellerCountry: 'SK', buyerClub: null, currentBid: 0, quality: 74, age: 21, deadline: 'Permanent', isFreeAgent: true },
  { position: 'RF', name: 'Lucas Hernandez Garcia', sellerClub: 'Liber de contract', sellerCountry: 'ES', buyerClub: null, currentBid: 0, quality: 80, age: 27, deadline: 'Permanent', isFreeAgent: true },
  { position: 'CM', name: 'Bogdan Stanciu', sellerClub: 'Liber de contract', sellerCountry: 'RO', buyerClub: null, currentBid: 0, quality: 65, age: 19, deadline: 'Permanent', isFreeAgent: true },
  { position: 'CB', name: 'Jean-Luc Moreau', sellerClub: 'Liber de contract', sellerCountry: 'FR', buyerClub: null, currentBid: 0, quality: 83, age: 29, deadline: 'Permanent', isFreeAgent: true }
];

/**
 * Generează obiectul complet de jucător Player pentru un listing
 */
function createPlayerForListing(seed: typeof INITIAL_MARKET_SEED[0], index: number): Player {
  const tier = seed.quality >= 82 ? 'STAR' : seed.quality >= 72 ? 'REGULAR' : seed.age <= 20 ? 'YOUTH' : 'VETERAN';
  return generateSPPlayer({
    id: `mkt-ply-${index}-${Date.now()}`,
    name: seed.name,
    number: Math.floor(Math.random() * 98) + 1,
    position: seed.position,
    age: seed.age,
    tier,
    squad: 'A'
  });
}

/**
 * Inițializează lista completă de transferuri
 */
export function initializeDefaultMarket(): TransferListing[] {
  return INITIAL_MARKET_SEED.map((seed, idx) => {
    const player = createPlayerForListing(seed, idx);
    // Asigurăm sincronizarea calității afișate
    const buyNowPrice = seed.isFreeAgent 
      ? Math.round(seed.quality * 25000) // Primă de instalare rezonabilă (€1.2m - €2m)
      : Math.round(seed.currentBid * 1.35); // Cumpărare instantă

    const bids: TransferBid[] = [];
    if (seed.buyerClub && seed.currentBid > 0) {
      bids.push({
        id: `bid-${idx}-1`,
        bidderClub: seed.buyerClub,
        amount: seed.currentBid,
        time: seed.deadline
      });
    }

    return {
      id: `mkt-${idx + 1}`,
      player,
      sellerClub: seed.sellerClub,
      sellerCountry: seed.sellerCountry,
      buyerClub: seed.buyerClub,
      currentBid: seed.currentBid,
      buyNowPrice,
      quality: seed.quality,
      age: seed.age,
      deadline: seed.deadline,
      isFreeAgent: seed.isFreeAgent,
      bids
    };
  });
}

/**
 * Încarcă piața de transferuri din localStorage
 */
export function loadTransferMarket(): TransferListing[] {
  if (typeof window === 'undefined') return initializeDefaultMarket();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Eroare la încărcarea pieței de transferuri:', e);
  }
  const initial = initializeDefaultMarket();
  saveTransferMarket(initial);
  return initial;
}

/**
 * Salvează piața de transferuri în localStorage
 */
export function saveTransferMarket(listings: TransferListing[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }
}

/**
 * Filtrează piața conform controalelor din SoccerProject
 */
export function filterTransferMarket(
  listings: TransferListing[],
  positionFilter: string,      // 'ALL' sau 'GK', 'LB', etc.
  ageFilter: string,           // 'ALL' sau '<=20', '21..23', '24..26', '27..29', '30..32', '33..'
  categoryFilter: 'ALL' | 'CLUBS' | 'FREE_AGENTS' | 'MY_LISTED',
  myClubName?: string
): TransferListing[] {
  return listings.filter(item => {
    // Filtru Categorie Tab
    if (categoryFilter === 'FREE_AGENTS' && !item.isFreeAgent) return false;
    if (categoryFilter === 'CLUBS' && item.isFreeAgent) return false;
    if (categoryFilter === 'MY_LISTED') {
      if (!myClubName || item.sellerClub !== myClubName) return false;
    }

    // Filtru Poziție (exact dropdown SP)
    if (positionFilter !== 'ALL' && item.player.position !== positionFilter) {
      return false;
    }

    // Filtru Vârstă (exact dropdown SP)
    if (ageFilter !== 'ALL') {
      if (ageFilter === '.. 20' || ageFilter === '<=20') {
        if (item.age > 20) return false;
      } else if (ageFilter === '21 .. 23' || ageFilter === '21-23') {
        if (item.age < 21 || item.age > 23) return false;
      } else if (ageFilter === '24 .. 26' || ageFilter === '24-26') {
        if (item.age < 24 || item.age > 26) return false;
      } else if (ageFilter === '27 .. 29' || ageFilter === '27-29') {
        if (item.age < 27 || item.age > 29) return false;
      } else if (ageFilter === '30 .. 32' || ageFilter === '30-32') {
        if (item.age < 30 || item.age > 32) return false;
      } else if (ageFilter === '33 ..' || ageFilter === '33+') {
        if (item.age < 33) return false;
      }
    }

    return true;
  });
}

/**
 * Plasează o ofertă de licitație pe un jucător listat de un alt club
 */
export function placeTransferBid(
  listingId: string,
  amount: number,
  myClubName: string
): { success: boolean; message: string; updatedListings: TransferListing[] } {
  const listings = loadTransferMarket();
  const index = listings.findIndex(l => l.id === listingId);

  if (index === -1) {
    return { success: false, message: 'Transferul nu a fost găsit!', updatedListings: listings };
  }

  const listing = listings[index];
  if (amount <= listing.currentBid) {
    return { 
      success: false, 
      message: `Oferta trebuie să fie mai mare decât oferta curentă (€${listing.currentBid.toLocaleString()})!`,
      updatedListings: listings
    };
  }

  const newBid: TransferBid = {
    id: `bid-${Date.now()}`,
    bidderClub: myClubName,
    amount,
    time: 'Acum (În curs)'
  };

  const updated: TransferListing = {
    ...listing,
    currentBid: amount,
    buyerClub: myClubName,
    bids: [newBid, ...listing.bids]
  };

  listings[index] = updated;
  saveTransferMarket(listings);

  // Înregistrare tranzacție garanție în buget
  spendClubBudget(
    amount,
    'TRANSFER',
    `Garanție ofertă transfer pentru ${listing.player.name} (${listing.sellerClub})`
  );

  return {
    success: true,
    message: `Ai plasat cu succes oferta de €${amount.toLocaleString()} pentru ${listing.player.name}!`,
    updatedListings: listings
  };
}

/**
 * Semnează direct un jucător liber de contract (Free Agent)
 */
export function signFreeAgent(
  listingId: string,
  myClubName: string,
  signingBonus: number
): { success: boolean; message: string; player?: Player; updatedListings: TransferListing[] } {
  const listings = loadTransferMarket();
  const listing = listings.find(l => l.id === listingId);

  if (!listing || !listing.isFreeAgent) {
    return { success: false, message: 'Jucătorul nu este liber de contract!', updatedListings: listings };
  }

  // Scădere primă de instalare din buget
  if (signingBonus > 0) {
    spendClubBudget(
      signingBonus,
      'TRANSFER',
      `Primă de instalare semnare liber de contract: ${listing.player.name}`
    );
  }

  // Adăugăm jucătorul în lotul salvat
  if (typeof window !== 'undefined') {
    try {
      const savedSquad = localStorage.getItem('footballin_user_squad');
      const squad: Player[] = savedSquad ? JSON.parse(savedSquad) : [];
      squad.push(listing.player);
      localStorage.setItem('footballin_user_squad', JSON.stringify(squad));
    } catch (e) {
      console.error('Eroare la adăugarea jucătorului în lot:', e);
    }
  }

  // Eliminăm din piața de transferuri
  const updatedListings = listings.filter(l => l.id !== listingId);
  saveTransferMarket(updatedListings);

  return {
    success: true,
    message: `Felicitări! L-ai semnat pe ${listing.player.name} liber de contract! A fost adăugat în lot.`,
    player: listing.player,
    updatedListings
  };
}

/**
 * Pune un jucător din lotul propriu pe lista de transferuri
 */
export function listPlayerForSale(
  player: Player,
  askingPrice: number,
  myClubName: string,
  myCountryCode: string
): { success: boolean; message: string; updatedListings: TransferListing[] } {
  const listings = loadTransferMarket();

  const newListing: TransferListing = {
    id: `mkt-user-${Date.now()}`,
    player,
    sellerClub: myClubName,
    sellerCountry: myCountryCode,
    buyerClub: null,
    currentBid: askingPrice,
    buyNowPrice: Math.round(askingPrice * 1.3),
    quality: Math.round(Object.values(player.skills).reduce((s, sk) => s + sk.value, 0) / 10),
    age: player.age,
    deadline: 'În 24 ore',
    isFreeAgent: false,
    bids: []
  };

  const updatedListings = [newListing, ...listings];
  saveTransferMarket(updatedListings);

  return {
    success: true,
    message: `${player.name} a fost pus pe lista de transferuri la prețul de pornire de €${askingPrice.toLocaleString()}!`,
    updatedListings
  };
}

/**
 * Retrage un jucător propriu de pe lista de transferuri
 */
export function cancelPlayerListing(listingId: string): { success: boolean; updatedListings: TransferListing[] } {
  const listings = loadTransferMarket();
  const updatedListings = listings.filter(l => l.id !== listingId);
  saveTransferMarket(updatedListings);
  return { success: true, updatedListings };
}
