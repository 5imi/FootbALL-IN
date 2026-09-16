'use client';

import React, { useState, useEffect } from 'react';
import { Team, Player, PositionType, TacticalStyle, FormationType } from '../engine/types';
import { ClubFinances } from '../engine/financeEngine';

export interface PreMatchSetupData {
  matchId: string;
  formation: FormationType;
  style: TacticalStyle;
  aggressiveness: number;
  tacticalFocus: string;
  captainId: string;
  lineupIds: string[]; // 11 players
  benchIds: string[];  // 5 players
  // Culise
  refereeBribe: number; // 0, 25000, 50000
  biscottoAgreed: boolean;
  pressStatement?: string;
  // Pariuri & Predicții (FootCoins)
  predictions?: {
    matchResult?: '1' | 'X' | '2';
    predictedScore?: string; // e.g. "2-1"
    firstScorerId?: string;
    willHaveRedCard?: boolean;
    willHavePenalty?: boolean;
    willHaveLateGoal?: boolean; // min 85+
    betStake: number; // FootCoins staked
  };
  isConfirmed: boolean;
  savedAt: string;
}

interface PreMatchSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: {
    id: string;
    round: string;
    home: string;
    away: string;
    date: string;
    stadium: string;
    referee: { name: string; strictness: number };
    opponentTacticsHint?: string;
  };
  userTeam: Team;
  finances: ClubFinances | null;
  onSaveSetup: (setup: PreMatchSetupData) => void;
  onOpenMindGames?: () => void;
}

const FORMATIONS: { type: FormationType; defs: number; mids: number; atts: number }[] = [
  { type: '4-3-3', defs: 4, mids: 3, atts: 3 },
  { type: '4-4-2', defs: 4, mids: 4, atts: 2 },
  { type: '3-5-2', defs: 3, mids: 5, atts: 2 },
  { type: '4-2-3-1', defs: 4, mids: 5, atts: 1 },
  { type: '5-3-2', defs: 5, mids: 3, atts: 2 },
  { type: '3-4-3', defs: 3, mids: 4, atts: 3 },
  { type: '5-4-1', defs: 5, mids: 4, atts: 1 },
];

const TACTICS_OPTIONS = [
  { id: 'none', label: 'Fără tactici speciale (Standard)' },
  { id: 'passing', label: 'Pase scurte & Posesie (Tiki-Taka)' },
  { id: 'wing_play', label: 'Atac susținut pe aripi (Wing Play)' },
  { id: 'counter', label: 'Contraatac fulger (Quick Break)' },
  { id: 'long_ball', label: 'Minge lungă pe pivot (Kick & Rush)' },
  { id: 'park_bus', label: 'Zid defensiv pe linia de 16m' },
];

const PRESS_STATEMENTS = [
  'Nicio declarație (Concentrare maximă în vestiar)',
  '„Mergem la victorie, adversarul are mari slăbiciuni defensive!” (+5% Moral atac)',
  '„Respectăm rivalul, ne mulțumim și cu un egal pe un teren greu.” (+8% Siguranță apărare)',
  '„Arbitrajul va fi sub mare presiune astăzi, cerem corectitudine!” (-5% Asprime arbitru)',
  '„Acesta este meciul sezonului, prima de victorie este dublată!” (+10% Determinare, risc accidentare)',
];

export const PreMatchSetupModal: React.FC<PreMatchSetupModalProps> = ({
  isOpen,
  onClose,
  fixture,
  userTeam,
  finances,
  onSaveSetup,
  onOpenMindGames,
}) => {
  const allSquad = [...userTeam.lineup, ...userTeam.bench];

  // Taburi modal: PITCH | TACTICS | CULISE | BETS
  const [activeTab, setActiveTab] = useState<'pitch' | 'tactics' | 'culise' | 'bets'>('pitch');

  // Load existing or default setup
  const [formation, setFormation] = useState<FormationType>('4-3-3');
  const [tacticalFocus, setTacticalFocus] = useState('passing');
  const [style, setStyle] = useState<TacticalStyle>('PASSING');
  const [aggressiveness, setAggressiveness] = useState(50);
  const [captainId, setCaptainId] = useState<string>(String(userTeam.lineup[0]?.id || allSquad[0]?.id || ''));

  // 11 Lineup + 5 Bench
  const [lineupIds, setLineupIds] = useState<string[]>(() => {
    return userTeam.lineup.slice(0, 11).map(p => String(p.id));
  });
  const [benchIds, setBenchIds] = useState<string[]>(() => {
    return userTeam.bench.slice(0, 5).map(p => String(p.id));
  });

  // Culise
  const [refereeBribe, setRefereeBribe] = useState<number>(0);
  const [biscottoAgreed, setBiscottoAgreed] = useState<boolean>(false);
  const [pressStatement, setPressStatement] = useState<string>(PRESS_STATEMENTS[0]);

  // Pariuri pre-meci
  const [footCoins, setFootCoins] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('footballin_footcoins');
      return saved ? parseInt(saved, 10) : 100;
    }
    return 100;
  });

  const [betResult, setBetResult] = useState<'1' | 'X' | '2' | undefined>('1');
  const [predictedScore, setPredictedScore] = useState<string>('2-1');
  const [firstScorerId, setFirstScorerId] = useState<string>('');
  const [betRedCard, setBetRedCard] = useState<boolean>(false);
  const [betPenalty, setBetPenalty] = useState<boolean>(false);
  const [betLateGoal, setBetLateGoal] = useState<boolean>(false);
  const [betStake, setBetStake] = useState<number>(10);

  // Status notificare
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && fixture?.id) {
      const saved = localStorage.getItem(`footballin_prematch_${fixture.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as PreMatchSetupData;
          setFormation(parsed.formation || '4-3-3');
          setStyle(parsed.style || 'PASSING');
          setAggressiveness(parsed.aggressiveness ?? 50);
          setTacticalFocus(parsed.tacticalFocus || 'passing');
          setCaptainId(parsed.captainId || '');
          if (parsed.lineupIds?.length === 11) setLineupIds(parsed.lineupIds);
          if (parsed.benchIds?.length) setBenchIds(parsed.benchIds);
          setRefereeBribe(parsed.refereeBribe || 0);
          setBiscottoAgreed(parsed.biscottoAgreed || false);
          if (parsed.pressStatement) setPressStatement(parsed.pressStatement);
          if (parsed.predictions) {
            setBetResult(parsed.predictions.matchResult);
            setPredictedScore(parsed.predictions.predictedScore || '2-1');
            setFirstScorerId(parsed.predictions.firstScorerId || '');
            setBetRedCard(parsed.predictions.willHaveRedCard || false);
            setBetPenalty(parsed.predictions.willHavePenalty || false);
            setBetLateGoal(parsed.predictions.willHaveLateGoal || false);
            setBetStake(parsed.predictions.betStake || 10);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [fixture?.id]);

  if (!isOpen) return null;

  const currentFormDef = FORMATIONS.find(f => f.type === formation) || FORMATIONS[0];

  // Helper jucători
  const getPlayerById = (id: string) => allSquad.find(p => String(p.id) === String(id));
  const starterPlayers = lineupIds.map(id => getPlayerById(id)).filter(Boolean) as Player[];
  const benchPlayers = benchIds.map(id => getPlayerById(id)).filter(Boolean) as Player[];

  // Schimbă jucătorul pe slot
  const handleAssignPlayer = (slotIndex: number, newId: string, isBench = false) => {
    if (isBench) {
      const updated = [...benchIds];
      updated[slotIndex] = newId;
      setBenchIds(updated);
    } else {
      const updated = [...lineupIds];
      // Dacă jucătorul e deja pe alt slot din teren, facem swap
      const existingIdx = updated.findIndex(id => id === newId);
      if (existingIdx !== -1 && existingIdx !== slotIndex) {
        updated[existingIdx] = updated[slotIndex];
      }
      updated[slotIndex] = newId;
      setLineupIds(updated);
    }
  };

  // Re-ordonare automată a titularilor pe compartimente conform formației
  const handleExecuteFormation = () => {
    const gk = allSquad.filter(p => p.position === 'GK');
    const defs = allSquad.filter(p => ['LB', 'CB', 'RB', 'SW'].includes(p.position));
    const mids = allSquad.filter(p => ['LM', 'CM', 'RM'].includes(p.position));
    const atts = allSquad.filter(p => ['LF', 'CF', 'RF'].includes(p.position));

    const newLineup: Player[] = [
      gk[0] || allSquad[0],
      ...defs.slice(0, currentFormDef.defs),
      ...mids.slice(0, currentFormDef.mids),
      ...atts.slice(0, currentFormDef.atts),
    ];

    // Asigură exact 11 jucători unici
    const usedIds = new Set(newLineup.map(p => String(p.id)));
    for (const p of allSquad) {
      if (newLineup.length >= 11) break;
      if (!usedIds.has(String(p.id))) {
        newLineup.push(p);
        usedIds.add(String(p.id));
      }
    }

    setLineupIds(newLineup.map(p => String(p.id)));
    setNotification(`⚙️ Formația ${formation} a fost aplicată și jucătorii au fost așezați pe posturi!`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Salvare & Confirmare oficială
  const handleSaveAndConfirm = () => {
    // Verifică FootCoins dacă pariază
    if (betStake > footCoins) {
      alert('Nu ai suficienți FootCoins pentru a plasa această miză!');
      return;
    }

    // Scade FootCoins pariați dacă există predicție
    let currentCoins = footCoins;
    if (betResult || predictedScore || firstScorerId || betRedCard || betPenalty || betLateGoal) {
      currentCoins = Math.max(0, footCoins - betStake);
      setFootCoins(currentCoins);
      if (typeof window !== 'undefined') {
        localStorage.setItem('footballin_footcoins', currentCoins.toString());
      }
    }

    const payload: PreMatchSetupData = {
      matchId: fixture.id,
      formation,
      style,
      aggressiveness,
      tacticalFocus,
      captainId: captainId || lineupIds[0],
      lineupIds,
      benchIds,
      refereeBribe,
      biscottoAgreed,
      pressStatement,
      predictions: {
        matchResult: betResult,
        predictedScore,
        firstScorerId,
        willHaveRedCard: betRedCard,
        willHavePenalty: betPenalty,
        willHaveLateGoal: betLateGoal,
        betStake,
      },
      isConfirmed: true,
      savedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`footballin_prematch_${fixture.id}`, JSON.stringify(payload));
      // Salvează și ca ultimul setup confirmat global pentru meciul zilei
      localStorage.setItem('footballin_latest_confirmed_prematch', JSON.stringify(payload));
    }

    onSaveSetup(payload);
    setNotification(`✅ Echipa și tactica au fost confirmate oficial pentru ${fixture.round}! Meciul este gata de simulare.`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const recommendedMaxAggression = Math.max(20, Math.min(95, 100 - (fixture.referee?.strictness || 50)));

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  Pregătire Pre-Meci &bull; {fixture.round}
                </h2>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                  SP CLASSIC SETUP
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                <strong className="text-zinc-200">{fixture.home}</strong> vs <strong className="text-zinc-200">{fixture.away}</strong> &bull; 🏟️ {fixture.stadium} &bull; 🕒 {fixture.date}
              </p>
            </div>
          </div>

          {/* Sold FootCoins & Închide */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-300">
              <span>🪙</span>
              <span>FootCoins:</span>
              <strong className="text-amber-200 font-black">{footCoins}</strong>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sub-Header cu Arbitru & Hint Tactic */}
        <div className="px-6 py-2.5 bg-zinc-900/30 border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-sky-400">⚖️ Arbitru delegat:</span>
            <strong className="text-white">{fixture.referee?.name || 'Salim Al Harrasi'}</strong>
            <span className="px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/50 font-mono text-[11px]">
              Strictețe: {fixture.referee?.strictness || 44}%
            </span>
          </div>

          <div className="text-[11px] text-amber-300 flex items-center gap-1">
            <span>💡 Sfat Spion:</span>
            <span>Nu depăși <strong className="text-white">{recommendedMaxAggression}%</strong> agresivitate pentru a evita cartonașele roșii!</span>
          </div>
        </div>

        {/* Bară de Tab-uri */}
        <div className="flex border-b border-zinc-800/80 bg-zinc-900/40 px-6 shrink-0 gap-2 overflow-x-auto">
          {[
            { id: 'pitch', label: '🏟️ Teren & Selecție SP', badge: '11+5' },
            { id: 'tactics', label: '🎯 Tactică & Stil', badge: `${aggressiveness}%` },
            { id: 'culise', label: '🕵️ Culise & Presă', badge: refereeBribe > 0 || biscottoAgreed ? 'ACTIV' : undefined },
            { id: 'bets', label: '🎰 Pariuri & FootCoins', badge: `Miză: ${betStake} FC` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  tab.id === 'culise' && (refereeBribe > 0 || biscottoAgreed)
                    ? 'bg-amber-500 text-black font-black'
                    : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notificare interactivă */}
        {notification && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Corp Modal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ═══════════ TAB 1: PITCH & SELECȚIE SP ═══════════ */}
          {activeTab === 'pitch' && (
            <div className="space-y-5">
              {/* Formatie & Executa Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-300">Formație Meci:</span>
                  <select
                    value={formation}
                    onChange={(e) => setFormation(e.target.value as FormationType)}
                    className="bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold font-mono focus:border-blue-500 focus:outline-none"
                  >
                    {FORMATIONS.map(f => (
                      <option key={f.type} value={f.type}>
                        {f.type} ({f.defs} DEF - {f.mids} MID - {f.atts} ATT)
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleExecuteFormation}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    Execută Formația
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>Căpitan:</span>
                  <select
                    value={captainId}
                    onChange={(e) => setCaptainId(e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 text-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    {starterPlayers.map(p => (
                      <option key={p.id} value={p.id}>
                        © {p.name} ({p.position}, Cal: {p.overallQuality}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Terenul Verde SP (Graphic Field Pitch) */}
              <div className="relative rounded-3xl bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 p-6 shadow-2xl border-4 border-emerald-950 overflow-hidden min-h-[480px] flex flex-col justify-between">
                
                {/* Linii teren marcaj fotbal */}
                <div className="absolute inset-4 border-2 border-white/25 rounded-2xl pointer-events-none"></div>
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/25 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/25 rounded-full pointer-events-none"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-44 h-20 border-2 border-white/25 rounded-b-2xl pointer-events-none"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-20 border-2 border-white/25 rounded-t-2xl pointer-events-none"></div>

                {/* ATACANȚI (ATT) - Top */}
                <div className="relative z-10 flex justify-around items-center pt-2">
                  {starterPlayers.slice(1 + currentFormDef.defs + currentFormDef.mids, 11).map((player, idx) => {
                    const slotIndex = 1 + currentFormDef.defs + currentFormDef.mids + idx;
                    return (
                      <PlayerPitchSlot
                        key={slotIndex}
                        slotIndex={slotIndex}
                        player={player}
                        isCaptain={String(player?.id) === String(captainId)}
                        allSquad={allSquad}
                        onSelect={(newId) => handleAssignPlayer(slotIndex, newId, false)}
                        color="blue"
                      />
                    );
                  })}
                </div>

                {/* MIJLOCAȘI (MID) - Center */}
                <div className="relative z-10 flex justify-around items-center py-4">
                  {starterPlayers.slice(1 + currentFormDef.defs, 1 + currentFormDef.defs + currentFormDef.mids).map((player, idx) => {
                    const slotIndex = 1 + currentFormDef.defs + idx;
                    return (
                      <PlayerPitchSlot
                        key={slotIndex}
                        slotIndex={slotIndex}
                        player={player}
                        isCaptain={String(player?.id) === String(captainId)}
                        allSquad={allSquad}
                        onSelect={(newId) => handleAssignPlayer(slotIndex, newId, false)}
                        color="green"
                      />
                    );
                  })}
                </div>

                {/* FUNDAȘI (DEF) - Bottom-Middle */}
                <div className="relative z-10 flex justify-around items-center py-2">
                  {starterPlayers.slice(1, 1 + currentFormDef.defs).map((player, idx) => {
                    const slotIndex = 1 + idx;
                    return (
                      <PlayerPitchSlot
                        key={slotIndex}
                        slotIndex={slotIndex}
                        player={player}
                        isCaptain={String(player?.id) === String(captainId)}
                        allSquad={allSquad}
                        onSelect={(newId) => handleAssignPlayer(slotIndex, newId, false)}
                        color="yellow"
                      />
                    );
                  })}
                </div>

                {/* PORTAR (GK) - Bottom Center */}
                <div className="relative z-10 flex justify-center items-center pb-2">
                  <PlayerPitchSlot
                    slotIndex={0}
                    player={starterPlayers[0]}
                    isCaptain={String(starterPlayers[0]?.id) === String(captainId)}
                    allSquad={allSquad}
                    onSelect={(newId) => handleAssignPlayer(0, newId, false)}
                    color="orange"
                  />
                </div>
              </div>

              {/* Banca de Rezerve (5 Sloturi SP) */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span className="flex items-center gap-2">
                    🪑 Banca de Rezerve (5 Jucători)
                  </span>
                  <span className="text-[10px] text-zinc-500">Click pentru schimbare</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[0, 1, 2, 3, 4].map(idx => {
                    const benchPlayer = benchPlayers[idx];
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition space-y-1 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-zinc-500 font-bold">R{idx + 1}</span>
                          {benchPlayer && (
                            <span className="text-[10px] font-mono font-bold text-emerald-400">
                              {benchPlayer.overallQuality}% ★
                            </span>
                          )}
                        </div>

                        <select
                          value={benchPlayer?.id || ''}
                          onChange={(e) => handleAssignPlayer(idx, e.target.value, true)}
                          className="w-full bg-zinc-900 text-white text-[11px] font-bold rounded p-1 border border-zinc-700 focus:outline-none"
                        >
                          <option value="">-- Alege rezervă --</option>
                          {allSquad.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.position} - {p.name} ({p.overallQuality}%)
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TAB 2: TACTICĂ & STIL ═══════════ */}
          {activeTab === 'tactics' && (
            <div className="space-y-6">
              {/* Sistem Tactic Principal */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                  <span>🎯</span> Sistem Tactic Oficial (Tactici SP)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TACTICS_OPTIONS.map(opt => (
                    <label
                      key={opt.id}
                      onClick={() => setTacticalFocus(opt.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        tacticalFocus === opt.id
                          ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.label}</span>
                      <input
                        type="radio"
                        name="tactics_focus"
                        checked={tacticalFocus === opt.id}
                        onChange={() => setTacticalFocus(opt.id)}
                        className="accent-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Slider Agresivitate & Strictețe Arbitru */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <span>⚡</span> Agresivitate Echipă
                  </h3>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`text-sm font-black px-2.5 py-0.5 rounded-lg border ${
                      aggressiveness > recommendedMaxAggression
                        ? 'bg-red-950/80 text-red-400 border-red-800/80'
                        : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                    }`}>
                      {aggressiveness}%
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aggressiveness}
                  onChange={(e) => setAggressiveness(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>0% (Non-combativ)</span>
                  <span>50% (Echilibrat)</span>
                  <span className="text-amber-400">Prag arbitru: {recommendedMaxAggression}%</span>
                  <span className="text-red-400">100% (La rupere)</span>
                </div>

                {aggressiveness > recommendedMaxAggression && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    <span>
                      Atenție! Arbitrul <strong>{fixture.referee?.name}</strong> este strict ({fixture.referee?.strictness}%). Agresivitatea de {aggressiveness}% riscă <strong>cartonaș roșu</strong> direct!
                    </span>
                  </div>
                )}
              </div>

              {/* Stil Ofensiv / Defensiv Slider (Stil SP) */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                  <span>🛡️</span> Stilul de Joc (Modulul Echipei)
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { styleKey: 'DEFENSIVE' as TacticalStyle, label: 'Defensiv (Autobaza)', desc: 'Blocaj jos, minimizare goluri primite' },
                    { styleKey: 'PASSING' as TacticalStyle, label: 'Echilibrat (Posesie)', desc: 'Control al ritmului și construcție de la fundași' },
                    { styleKey: 'WING_PLAY' as TacticalStyle, label: 'Ultra-Ofensiv', desc: 'Presing avansat și atac în valuri' },
                  ].map(s => (
                    <button
                      key={s.styleKey}
                      type="button"
                      onClick={() => setStyle(s.styleKey)}
                      className={`p-4 rounded-xl border text-left transition space-y-1 ${
                        style === s.styleKey
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-[10px] text-zinc-500 leading-tight">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TAB 3: CULISE & PRESĂ ═══════════ */}
          {activeTab === 'culise' && (
            <div className="space-y-6">
              {/* Mită Arbitru */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    <span>💼</span> Mită Arbitru (Manevre de Culise)
                  </h3>
                  <span className="text-[10px] text-zinc-500">OPȚIONAL &bull; RISC DE SUSPENDARE</span>
                </div>

                <p className="text-xs text-zinc-400">
                  Trimite un emisar discret la hotelul arbitrului <strong>{fixture.referee?.name}</strong>. Dacă acceptă, va trece cu vederea faulturile dure și va acorda penalty la contacte ușoare.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { amount: 0, label: 'Joc Curat (€0)' },
                    { amount: 25000, label: 'Pachet protocol (€25.000)' },
                    { amount: 50000, label: 'Comision arbitraj (€50.000)' },
                  ].map(b => (
                    <button
                      key={b.amount}
                      type="button"
                      onClick={() => setRefereeBribe(b.amount)}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        refereeBribe === b.amount
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blat / Biscotto */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2">
                    <span>🤝</span> Înțelegere Tacită cu Adversarul (Blat / Biscotto)
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={biscottoAgreed}
                      onChange={(e) => setBiscottoAgreed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <p className="text-xs text-zinc-400">
                  Dacă ambele echipe se mulțumesc cu un punct pentru menținere sau calificare, meciul se va desfășura în ritm scăzut fără faulturi sau ocazii majore.
                </p>
              </div>

              {/* Război Psihologic & Mind Games */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
                      <span>🧠</span> Război Psihologic (Mind Games)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Destabilizează moralul antrenorului advers și induce teamă în rândul vedetelor rivale.
                    </p>
                  </div>

                  {onOpenMindGames && (
                    <button
                      type="button"
                      onClick={onOpenMindGames}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shrink-0"
                    >
                      Deschide Mind Games Modal &rarr;
                    </button>
                  )}
                </div>
              </div>

              {/* Declarație de Presă */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                  <span>📰</span> Conferință de Presă Pre-Meci
                </h3>

                <select
                  value={pressStatement}
                  onChange={(e) => setPressStatement(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                >
                  {PRESS_STATEMENTS.map((st, i) => (
                    <option key={i} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ═══════════ TAB 4: PARIURI & FOOTCOINS ═══════════ */}
          {activeTab === 'bets' && (
            <div className="space-y-6">
              {/* Card Explicativ FootCoins */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎰</span>
                  <div>
                    <h3 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                      Mini-Joc de Pariuri Pre-Meci &bull; Câștigă FootCoins!
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Plasează predicțiile tale înainte de fluierul de start. La finalul meciului, simularea validează rezultatele și îți creditează automat câștigurile!
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-zinc-500 font-mono">Disponibil:</div>
                  <div className="text-base font-black font-mono text-amber-400">{footCoins} FC</div>
                </div>
              </div>

              {/* Predicție 1: Rezultat Final 1X2 */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider">
                  1. Rezultat Final (1X2) &bull; Cotă 2.50x
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: '1' as const, label: `1 (Victorie ${fixture.home})` },
                    { key: 'X' as const, label: 'X (Egalitate)' },
                    { key: '2' as const, label: `2 (Victorie ${fixture.away})` },
                  ].map(b => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setBetResult(b.key)}
                      className={`py-3 rounded-xl border text-xs font-bold transition ${
                        betResult === b.key
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Predicție 2: Scor Exact & Primul Marcator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider">
                    2. Scor Exact &bull; Cotă 8.00x
                  </h4>

                  <select
                    value={predictedScore}
                    onChange={(e) => setPredictedScore(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl p-2.5 text-xs font-bold font-mono focus:outline-none"
                  >
                    {['1-0', '2-0', '2-1', '3-0', '3-1', '0-0', '1-1', '2-2', '0-1', '0-2', '1-2'].map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider">
                    3. Primul Marcator &bull; Cotă 4.00x
                  </h4>

                  <select
                    value={firstScorerId}
                    onChange={(e) => setFirstScorerId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="">-- Oricare / Fără marcator --</option>
                    {starterPlayers.filter(p => p.position !== 'GK').map(p => (
                      <option key={p.id} value={p.id}>
                        {p.position} - {p.name} ({p.overallQuality}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Predicții Bonus Creative */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider">
                  4. Pariuri Speciale de Suspans (Bonus Multiplicator)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { state: betRedCard, setter: setBetRedCard, label: 'Cartonaș Roșu în Meci?', quota: '+30 FC' },
                    { state: betPenalty, setter: setBetPenalty, label: 'Penalty Acordat?', quota: '+25 FC' },
                    { state: betLateGoal, setter: setBetLateGoal, label: 'Gol după Minutul 85?', quota: '+20 FC' },
                  ].map((b, idx) => (
                    <label
                      key={idx}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        b.state
                          ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{b.label}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold">{b.quota}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={b.state}
                        onChange={(e) => b.setter(e.target.checked)}
                        className="accent-amber-500 w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Miza de FootCoins */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Miză Totală (FootCoins):</span>
                <div className="flex items-center gap-2">
                  {[5, 10, 25, 50].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBetStake(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                        betStake === val
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {val} FC
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Butoane Acțiune */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-zinc-400 text-center sm:text-left">
            Configurația se va aplica automat meciului <strong className="text-white">{fixture.round}</strong>.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition"
            >
              Anulează
            </button>

            <button
              onClick={handleSaveAndConfirm}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
            >
              <span>💾</span>
              <span>Confirmă & Salvează Echipa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Componentă auxiliară pentru slotul de jucător pe pitch (SP-Style)
interface PlayerPitchSlotProps {
  slotIndex: number;
  player: Player | undefined;
  isCaptain: boolean;
  allSquad: Player[];
  onSelect: (newId: string) => void;
  color: 'orange' | 'yellow' | 'green' | 'blue';
}

const PlayerPitchSlot: React.FC<PlayerPitchSlotProps> = ({
  slotIndex,
  player,
  isCaptain,
  allSquad,
  onSelect,
  color,
}) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const colorClasses = {
    orange: 'bg-amber-500/90 text-black border-amber-400',
    yellow: 'bg-yellow-400/90 text-black border-yellow-300',
    green: 'bg-emerald-500/90 text-black border-emerald-400',
    blue: 'bg-sky-500/90 text-black border-sky-400',
  }[color];

  return (
    <div className="flex flex-col items-center group relative">
      {/* Siluetă / Icon Jucător */}
      <div 
        onClick={() => setIsDropdown(!isDropdown)}
        className="cursor-pointer transition-transform hover:scale-105 flex flex-col items-center"
      >
        <div className="relative">
          {/* Siluetă grafică */}
          <div className="w-10 h-10 rounded-full bg-zinc-900/80 border-2 border-white/80 shadow-lg flex items-center justify-center text-base backdrop-blur-sm">
            {color === 'orange' ? '🧤' : '🏃'}
          </div>

          {/* Badge Rating în colț (SP Style: 70, 06, 14, 01) */}
          <div className={`absolute -top-1.5 -right-2 px-1 py-0.2 rounded font-mono text-[9px] font-black shadow border ${colorClasses}`}>
            {player?.number ? String(player.number).padStart(2, '0') : '00'}
          </div>

          {/* Badge Căpitan */}
          {isCaptain && (
            <div className="absolute -top-1.5 -left-2 w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[9px] flex items-center justify-center border border-black shadow">
              C
            </div>
          )}
        </div>

        {/* Nume Jucător Badge */}
        <div className={`mt-1 px-2 py-0.5 rounded shadow-md border text-[10px] font-bold truncate max-w-[90px] text-center ${colorClasses}`}>
          {player ? player.name.split(' ').pop() : 'Liber'}
        </div>
      </div>

      {/* Dropdown la click */}
      {isDropdown && (
        <div className="absolute top-14 z-50 bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800 text-[10px] text-zinc-400 font-bold uppercase">
            <span>Alege Jucător</span>
            <button onClick={() => setIsDropdown(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {allSquad.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(String(p.id));
                  setIsDropdown(false);
                }}
                className={`w-full text-left p-1.5 rounded text-[11px] font-semibold flex items-center justify-between transition ${
                  String(player?.id) === String(p.id)
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <span>{p.position} - {p.name}</span>
                <span className="font-mono text-[10px] text-emerald-400">{p.overallQuality}%</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
