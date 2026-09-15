'use client';

import React, { useState, useEffect } from 'react';
import { Player, PositionType, TransferListing } from '../engine/types';
import { 
  loadTransferMarket, 
  filterTransferMarket, 
  placeTransferBid, 
  signFreeAgent, 
  listPlayerForSale, 
  cancelPlayerListing 
} from '../engine/transferEngine';
import { ManagerProfile } from '../engine/divisionEngine';
import { ClubFinances } from '../engine/financeEngine';
import { Language, getTranslation } from '../engine/i18n';
import { PlayerDetailsModal } from './PlayerDetailsModal';

interface TransferMarketViewProps {
  language: Language;
  activeManager: ManagerProfile | null;
  finances: ClubFinances;
  userSquad: Player[];
  onPlayerAcquired?: (player: Player) => void;
  onFinancesUpdated?: () => void;
}

export function TransferMarketView({
  language,
  activeManager,
  finances,
  userSquad,
  onPlayerAcquired,
  onFinancesUpdated
}: TransferMarketViewProps) {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [listings, setListings] = useState<TransferListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<TransferListing[]>([]);

  // Filtre conform SoccerProject
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedAge, setSelectedAge] = useState<string>('ALL');
  const [categoryTab, setCategoryTab] = useState<'ALL' | 'CLUBS' | 'FREE_AGENTS' | 'MY_LISTED'>('ALL');

  // Modal Detalii Jucător
  const [inspectingPlayer, setInspectingPlayer] = useState<Player | null>(null);

  // Modal Licitare Transfer
  const [biddingListing, setBiddingListing] = useState<TransferListing | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);

  // Modal Semnare Liber de Contract
  const [signingListing, setSigningListing] = useState<TransferListing | null>(null);
  const [signingBonus, setSigningBonus] = useState<number>(0);

  // Modal Listare Jucător din Lot la Vânzare
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedPlayerToSell, setSelectedPlayerToSell] = useState<Player | null>(null);
  const [sellPrice, setSellPrice] = useState<number>(1000000);

  // Notificări
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const market = loadTransferMarket();
    setListings(market);
  }, []);

  useEffect(() => {
    const myClub = activeManager?.teamName || '';
    const res = filterTransferMarket(listings, selectedPosition, selectedAge, categoryTab, myClub);
    setFilteredListings(res);
  }, [listings, selectedPosition, selectedAge, categoryTab, activeManager]);

  const handleShowNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Plasează ofertă de licitație
  const handleConfirmBid = () => {
    if (!biddingListing) return;
    const myClub = activeManager?.teamName || 'Clubul Meu';
    
    if (bidAmount > finances.balance) {
      handleShowNotification('error', 'Fonduri insuficiente în bugetul clubului pentru această ofertă!');
      return;
    }

    const res = placeTransferBid(biddingListing.id, bidAmount, myClub);
    if (res.success) {
      setListings(res.updatedListings);
      setBiddingListing(null);
      handleShowNotification('success', res.message);
      if (onFinancesUpdated) onFinancesUpdated();
    } else {
      handleShowNotification('error', res.message);
    }
  };

  // Semnează liber de contract
  const handleConfirmSignFreeAgent = () => {
    if (!signingListing) return;
    const myClub = activeManager?.teamName || 'Clubul Meu';

    if (signingBonus > finances.balance) {
      handleShowNotification('error', 'Fonduri insuficiente în buget pentru prima de instalare!');
      return;
    }

    const res = signFreeAgent(signingListing.id, myClub, signingBonus);
    if (res.success && res.player) {
      setListings(res.updatedListings);
      setSigningListing(null);
      handleShowNotification('success', res.message);
      if (onPlayerAcquired) onPlayerAcquired(res.player);
      if (onFinancesUpdated) onFinancesUpdated();
    } else {
      handleShowNotification('error', res.message);
    }
  };

  // Pune un jucător din lot pe lista de transferuri
  const handleConfirmSell = () => {
    if (!selectedPlayerToSell) return;
    const myClub = activeManager?.teamName || 'Clubul Meu';
    const myCountry = activeManager?.countryCode || 'RO';

    const res = listPlayerForSale(selectedPlayerToSell, sellPrice, myClub, myCountry);
    if (res.success) {
      setListings(res.updatedListings);
      setIsSellModalOpen(false);
      setSelectedPlayerToSell(null);
      handleShowNotification('success', res.message);
    }
  };

  // Retrage jucător de la vânzare
  const handleCancelListing = (listingId: string) => {
    const res = cancelPlayerListing(listingId);
    if (res.success) {
      setListings(res.updatedListings);
      handleShowNotification('success', 'Jucătorul a fost retras de pe lista de transferuri!');
    }
  };

  // Culoare badge poziție fidelă SoccerProject
  const getPositionBadgeClass = (pos: PositionType) => {
    switch (pos) {
      case 'GK':
        return 'bg-zinc-700 text-zinc-200 border-zinc-600';
      case 'LB':
      case 'CB':
      case 'SW':
      case 'RB':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LM':
      case 'CM':
      case 'RM':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'LF':
      case 'CF':
      case 'RF':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* ─── Antet Fidel SoccerProject (spnewl_transfer_overview.php) ─── */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>🤝</span> Priveliște transferuri
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Puteți semnala foarte ușor un transfer care vi se pare suspect, trebuie doar să dați click pe preț.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs">
              <span className="text-zinc-500 font-semibold">Buget Transferuri:</span>
              <span className="font-extrabold text-emerald-400">€{finances.balance.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setIsSellModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-md whitespace-nowrap active:scale-95"
            >
              <span>➕</span> Pune Jucător la Vânzare
            </button>
          </div>
        </div>

        {/* Notificare Toast */}
        {notification && (
          <div className={`mt-3 rounded-lg border px-4 py-2.5 text-xs font-semibold animate-in fade-in duration-200 ${
            notification.type === 'success' 
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
          }`}>
            {notification.message}
          </div>
        )}

        {/* ─── Bara de Filtre (Dropdown Poziție & Vârstă - Capturi SP) ─── */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Dropdown Poziție */}
            <div className="flex items-center gap-1.5">
              <label className="font-semibold text-zinc-400">Poziție:</label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs font-bold text-zinc-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">Toate</option>
                <option value="GK">GK (Portar)</option>
                <option value="LB">LB (Fundaș Stânga)</option>
                <option value="CB">CB (Fundaș Central)</option>
                <option value="SW">SW (Libero / Sweeper)</option>
                <option value="RB">RB (Fundaș Dreapta)</option>
                <option value="LM">LM (Mijlocaș Stânga)</option>
                <option value="CM">CM (Mijlocaș Central)</option>
                <option value="RM">RM (Mijlocaș Dreapta)</option>
                <option value="LF">LF (Atacant Stânga)</option>
                <option value="CF">CF (Atacant Central)</option>
                <option value="RF">RF (Atacant Dreapta)</option>
              </select>
            </div>

            {/* Dropdown Vârstă */}
            <div className="flex items-center gap-1.5">
              <label className="font-semibold text-zinc-400">Vârstă:</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs font-bold text-zinc-100 focus:border-blue-500 focus:outline-none font-mono"
              >
                <option value="ALL">Toate</option>
                <option value=".. 20">.. 20</option>
                <option value="21 .. 23">21 .. 23</option>
                <option value="24 .. 26">24 .. 26</option>
                <option value="27 .. 29">27 .. 29</option>
                <option value="30 .. 32">30 .. 32</option>
                <option value="33 ..">33 ..</option>
              </select>
            </div>

            <button
              onClick={() => {
                const myClub = activeManager?.teamName || '';
                setFilteredListings(filterTransferMarket(listings, selectedPosition, selectedAge, categoryTab, myClub));
              }}
              className="rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 font-bold text-zinc-200 transition shadow-sm"
            >
              Arată
            </button>
          </div>

          {/* Tab-uri Categorii */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setCategoryTab('ALL')}
              className={`rounded-lg px-2.5 py-1 font-bold transition text-xs ${
                categoryTab === 'ALL' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Toate ({listings.length})
            </button>
            <button
              onClick={() => setCategoryTab('CLUBS')}
              className={`rounded-lg px-2.5 py-1 font-bold transition text-xs ${
                categoryTab === 'CLUBS' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              De la Echipe
            </button>
            <button
              onClick={() => setCategoryTab('FREE_AGENTS')}
              className={`rounded-lg px-2.5 py-1 font-bold transition text-xs ${
                categoryTab === 'FREE_AGENTS' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ✨ Liberi de Contract
            </button>
            <button
              onClick={() => setCategoryTab('MY_LISTED')}
              className={`rounded-lg px-2.5 py-1 font-bold transition text-xs ${
                categoryTab === 'MY_LISTED' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Listările Mele
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tabelul Oficial al Transferurilor (SoccerProject) ─── */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/90 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-2 w-14 text-center">Poz</th>
                <th className="py-3 px-4">Nume</th>
                <th className="py-3 px-4">Vânzător</th>
                <th className="py-3 px-4">Cumpărător</th>
                <th className="py-3 px-4 text-right">Ofertă</th>
                <th className="py-3 px-3 text-center">Calitate</th>
                <th className="py-3 px-3 text-center">Vârstă</th>
                <th className="py-3 px-4 text-center">Data / Termen</th>
                <th className="py-3 px-4 text-center">Acțiune</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-500 font-medium">
                    Nu s-au găsit transferuri conform filtrelor selectate.
                  </td>
                </tr>
              ) : (
                filteredListings.map((item, index) => {
                  const isMyPlayer = activeManager?.teamName && item.sellerClub === activeManager.teamName;
                  const isCurrentBidMine = activeManager?.teamName && item.buyerClub === activeManager.teamName;

                  return (
                    <tr
                      key={item.id}
                      className={`transition hover:bg-zinc-900/70 ${
                        item.isFreeAgent 
                          ? 'bg-emerald-950/10' 
                          : isMyPlayer 
                          ? 'bg-blue-950/15' 
                          : index % 2 === 1 
                          ? 'bg-zinc-900/30' 
                          : ''
                      }`}
                    >
                      {/* 1. Nr. */}
                      <td className="py-2.5 px-3 text-center text-zinc-500 font-mono">
                        {index + 1})
                      </td>

                      {/* 2. Badge Poziție */}
                      <td className="py-2.5 px-2 text-center">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-black border uppercase font-mono ${getPositionBadgeClass(item.player.position)}`}>
                          {item.player.position}
                        </span>
                      </td>

                      {/* 3. Nume (Clickabil pentru Fișa Jucătorului) */}
                      <td className="py-2.5 px-4 font-semibold text-white">
                        <button
                          onClick={() => setInspectingPlayer(item.player)}
                          className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1.5 text-left"
                          title="Click pentru detaliile complete ale jucătorului"
                        >
                          <span>{item.player.name}</span>
                          {item.isFreeAgent && (
                            <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                              LIBER
                            </span>
                          )}
                        </button>
                      </td>

                      {/* 4. Vânzător */}
                      <td className="py-2.5 px-4 text-zinc-300 font-medium truncate max-w-[150px]">
                        {item.isFreeAgent ? (
                          <span className="text-emerald-400 font-semibold italic">Liber de contract</span>
                        ) : (
                          <span>{item.sellerClub}</span>
                        )}
                      </td>

                      {/* 5. Cumpărător */}
                      <td className="py-2.5 px-4 text-zinc-400 truncate max-w-[150px]">
                        {item.buyerClub ? (
                          <span className={isCurrentBidMine ? 'text-amber-400 font-bold' : 'text-zinc-300'}>
                            {item.buyerClub} {isCurrentBidMine && '★ (Tu)'}
                          </span>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>

                      {/* 6. Ofertă */}
                      <td className="py-2.5 px-4 text-right font-mono font-bold">
                        {item.isFreeAgent ? (
                          <span className="text-emerald-400">€0 (Liber)</span>
                        ) : (
                          <span className="text-amber-400">€ {item.currentBid.toLocaleString()},00</span>
                        )}
                      </td>

                      {/* 7. Calitate */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-mono font-bold ${
                          item.quality >= 80 ? 'text-emerald-400' : item.quality >= 70 ? 'text-blue-400' : 'text-zinc-400'
                        }`}>
                          {item.quality}
                        </span>
                      </td>

                      {/* 8. Vârstă */}
                      <td className="py-2.5 px-3 text-center font-mono text-zinc-300">
                        {item.age}
                      </td>

                      {/* 9. Data / Termen */}
                      <td className="py-2.5 px-4 text-center font-mono text-zinc-400 text-[11px]">
                        {item.deadline}
                      </td>

                      {/* 10. Acțiune */}
                      <td className="py-2.5 px-4 text-center">
                        {isMyPlayer ? (
                          <button
                            onClick={() => handleCancelListing(item.id)}
                            className="rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 px-2.5 py-1 text-[11px] font-bold transition"
                          >
                            Retrage
                          </button>
                        ) : item.isFreeAgent ? (
                          <button
                            onClick={() => {
                              setSigningListing(item);
                              setSigningBonus(item.buyNowPrice || 500000);
                            }}
                            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 text-[11px] font-bold transition shadow-sm"
                          >
                            Semnează
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setBiddingListing(item);
                              setBidAmount(Math.round(item.currentBid * 1.1));
                            }}
                            className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-[11px] font-bold transition shadow-sm"
                          >
                            Licitează
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginare fidelă SoccerProject */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs text-zinc-400">
          <div>
            Afișate <strong>{filteredListings.length}</strong> din <strong>{listings.length}</strong> transferuri active
          </div>
          <div className="flex items-center gap-1 font-mono">
            <span className="rounded bg-blue-600 px-2 py-0.5 font-bold text-white">1</span>
            <span className="px-2 py-0.5 hover:text-white cursor-pointer">2</span>
            <span className="px-2 py-0.5 hover:text-white cursor-pointer">3</span>
            <span className="px-2 py-0.5 hover:text-white cursor-pointer">4</span>
            <span className="px-2 py-0.5 hover:text-white cursor-pointer">5</span>
            <span className="px-1 text-zinc-600">...</span>
            <span className="px-2 py-0.5 hover:text-white cursor-pointer">Următor</span>
          </div>
        </div>
      </div>

      {/* ─── Modal Licitare Transfer ─── */}
      {biddingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>💰</span> Plasare Ofertă Transfer
              </h3>
              <button onClick={() => setBiddingListing(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="rounded-xl bg-zinc-900 p-3.5 border border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Jucător:</span>
                <span className="font-bold text-white">{biddingListing.player.name} ({biddingListing.player.position})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Vânzător:</span>
                <span className="text-zinc-200">{biddingListing.sellerClub}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Oferta Curentă:</span>
                <span className="font-bold text-amber-400">€{biddingListing.currentBid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Bugetul Tău Disponibil:</span>
                <span className="font-bold text-emerald-400">€{finances.balance.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Oferta Ta (€):</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={biddingListing.currentBid + 10000}
                step={50000}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-amber-400 font-mono focus:border-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500">
                Oferta minimă admisă: €{(biddingListing.currentBid + 10000).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setBiddingListing(null)}
                className="w-1/2 rounded-xl border border-zinc-700 bg-zinc-900 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition"
              >
                Anulează
              </button>
              <button
                onClick={handleConfirmBid}
                className="w-1/2 rounded-xl bg-blue-600 hover:bg-blue-500 py-2 text-xs font-bold text-white transition shadow-md"
              >
                Confirmă Oferta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Semnare Jucător Liber de Contract ─── */}
      {signingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>✍️</span> Semnare Jucător Liber de Contract
              </h3>
              <button onClick={() => setSigningListing(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="rounded-xl bg-zinc-900 p-3.5 border border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Jucător:</span>
                <span className="font-bold text-white">{signingListing.player.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Poziție & Calitate:</span>
                <span className="font-bold text-blue-400">{signingListing.player.position} • {signingListing.quality}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Statut:</span>
                <span className="font-semibold text-emerald-400">Fără club (Transfer Gratuit)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Primă de Instalare (€):</label>
              <input
                type="number"
                value={signingBonus}
                onChange={(e) => setSigningBonus(Number(e.target.value))}
                min={0}
                step={50000}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-emerald-400 font-mono focus:border-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500">
                Suma va fi retrasă imediat din bugetul clubului la semnarea contractului.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSigningListing(null)}
                className="w-1/2 rounded-xl border border-zinc-700 bg-zinc-900 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition"
              >
                Anulează
              </button>
              <button
                onClick={handleConfirmSignFreeAgent}
                className="w-1/2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white transition shadow-md"
              >
                Semnează Contractul
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Pune Jucător la Vânzare ─── */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>📋</span> Pune un Jucător din Lot la Vânzare
              </h3>
              <button onClick={() => setIsSellModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Alege Jucătorul din Lot:</label>
                <select
                  value={selectedPlayerToSell?.id || ''}
                  onChange={(e) => {
                    const ply = userSquad.find(p => p.id === e.target.value);
                    setSelectedPlayerToSell(ply || null);
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Selectează un jucător --</option>
                  {userSquad.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.position}] {p.name} (Vârstă: {p.age})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPlayerToSell && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Preț de Pornire Licitație (€):</label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                    min={50000}
                    step={100000}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-amber-400 font-mono focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Celelalte cluburi din campionat vor putea licita pentru jucătorul tău.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="w-1/2 rounded-xl border border-zinc-700 bg-zinc-900 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition"
              >
                Anulează
              </button>
              <button
                disabled={!selectedPlayerToSell}
                onClick={handleConfirmSell}
                className="w-1/2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-2 text-xs font-bold text-white transition shadow-md"
              >
                Listează pe Piață
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Detalii Jucător (Click pe Nume) ─── */}
      <PlayerDetailsModal
        player={inspectingPlayer}
        isOpen={!!inspectingPlayer}
        onClose={() => setInspectingPlayer(null)}
        isForeignClub={true}
      />
    </div>
  );
}
