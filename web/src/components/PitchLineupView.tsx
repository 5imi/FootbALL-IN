'use client';

import React, { useState, useEffect } from 'react';
import { Team, Player, PositionType, TacticalStyle, FormationType } from '../engine/types';
import { PenaltySettingsView } from './PenaltySettingsView';

interface PitchLineupViewProps {
  homeTeam: Team;
  awayTeam: Team;
  onSelectPlayer?: (player: Player, isForeign: boolean) => void;
  isGuest?: boolean;
  onRequireAuth?: (message: string) => void;
  onUpdateSquad?: (updatedLineup: Player[], updatedBench: Player[]) => void;
}

export type PresetKey = 'A' | 'B' | 'C' | 'D' | 'PENALTIES';

interface PresetConfig {
  formation: FormationType;
  style: TacticalStyle;
  aggressiveness: number;
  tacticName: string;
  captainId: string;
  lineupIds: string[]; // 11 jucători
  benchIds: string[];  // 5 rezerve
  penaltyTakers: string[]; // 5 executanți
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

const TACTIC_OPTIONS = [
  'Fără tactici',
  'Pasa lungă',
  'Pe aripi (Wing Play)',
  'Pase scurte (Posesie)',
  'Contra-atac rapid',
  'Zid defensiv'
];

export const PitchLineupView: React.FC<PitchLineupViewProps> = ({ 
  homeTeam, 
  awayTeam, 
  onSelectPlayer,
  isGuest = false,
  onRequireAuth,
  onUpdateSquad,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const [activePreset, setActivePreset] = useState<PresetKey>('A');
  const [notification, setNotification] = useState<string | null>(null);

  const activeTeam = selectedTeam === 'home' ? homeTeam : awayTeam;
  const allSquadPlayers = [...activeTeam.lineup, ...activeTeam.bench];

  // Configurație preseturi stocată local (A, B, C, D)
  const [presets, setPresets] = useState<Record<'A' | 'B' | 'C' | 'D', PresetConfig>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('footballin_tactics_presets');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultFormation: FormationType = '4-3-3';
    const initIds = activeTeam.lineup.map(p => String(p.id));
    const benchIds = activeTeam.bench.slice(0, 5).map(p => String(p.id));

    const makeDefault = (): PresetConfig => ({
      formation: defaultFormation,
      style: activeTeam.tactics.style || 'PASSING',
      aggressiveness: activeTeam.tactics.aggressiveness || 50,
      tacticName: 'Fără tactici',
      captainId: initIds[0] || '',
      lineupIds: initIds,
      benchIds: benchIds,
      penaltyTakers: initIds.slice(0, 5)
    });

    return {
      A: makeDefault(),
      B: makeDefault(),
      C: makeDefault(),
      D: makeDefault(),
    };
  });

  const currentPresetConfig = activePreset !== 'PENALTIES' ? presets[activePreset] : presets.A;
  const [selectedFormation, setSelectedFormation] = useState<FormationType>(currentPresetConfig.formation);

  // Sincronizare la schimbarea presetului
  useEffect(() => {
    if (activePreset !== 'PENALTIES') {
      setSelectedFormation(presets[activePreset].formation);
    }
  }, [activePreset, presets]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Salvează configurația presetului curent
  const handleSavePreset = () => {
    if (isGuest && onRequireAuth) {
      onRequireAuth('Înregistrează-ți clubul ca manager pentru a salva garniturile oficiale A, B, C, D!');
      return;
    }

    const updated = {
      ...presets,
      [activePreset === 'PENALTIES' ? 'A' : activePreset]: {
        ...currentPresetConfig,
        formation: selectedFormation,
      }
    };
    setPresets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('footballin_tactics_presets', JSON.stringify(updated));
    }

    // Actualizăm lotul echipei dacă este Selecția A (sau presetul activ aplicat)
    if (onUpdateSquad) {
      const newLineup = currentPresetConfig.lineupIds
        .map(id => allSquadPlayers.find(p => String(p.id) === String(id)))
        .filter(Boolean) as Player[];
      const newBench = allSquadPlayers.filter(p => !currentPresetConfig.lineupIds.includes(String(p.id)));
      onUpdateSquad(newLineup, newBench);
    }

    showNotification(`💾 Selecția ${activePreset} a fost salvată cu succes! (Se va aplica automat la ora meciului).`);
  };

  // Schimbă jucătorul de pe un slot
  const handleAssignPlayerToSlot = (slotIndex: number, newPlayerId: string, isBench = false) => {
    if (activePreset === 'PENALTIES') return;

    const presetKey = activePreset;
    const config = { ...presets[presetKey] };

    if (isBench) {
      const newBench = [...config.benchIds];
      newBench[slotIndex] = newPlayerId;
      config.benchIds = newBench;
    } else {
      const newLineup = [...config.lineupIds];
      newLineup[slotIndex] = newPlayerId;
      config.lineupIds = newLineup;
    }

    setPresets(prev => ({ ...prev, [presetKey]: config }));
  };

  // Execută schimbarea formației
  const handleExecuteFormation = () => {
    if (activePreset === 'PENALTIES') return;
    const presetKey = activePreset;
    const config = { ...presets[presetKey], formation: selectedFormation };
    setPresets(prev => ({ ...prev, [presetKey]: config }));
    showNotification(`⚙️ Formația ${selectedFormation} a fost aplicată pe teren pentru Selecția ${presetKey}!`);
  };

  // Jucători grupați pe poziție naturală pentru dropdown
  const getPlayersByNaturalPosition = () => {
    const groups: Record<string, Player[]> = {
      'Atacanți (RF/CF/LF)': allSquadPlayers.filter(p => ['RF', 'CF', 'LF'].includes(p.position)),
      'Mijlocași (RM/CM/LM)': allSquadPlayers.filter(p => ['RM', 'CM', 'LM'].includes(p.position)),
      'Fundași (RB/CB/LB/SW)': allSquadPlayers.filter(p => ['RB', 'CB', 'LB', 'SW'].includes(p.position)),
      'Portari (GK)': allSquadPlayers.filter(p => p.position === 'GK'),
    };
    return groups;
  };

  // Obține compartimentul pentru un jucător din primul 11
  const getPlayerCompartmentColor = (player: Player): 'orange' | 'yellow' | 'green' | 'blue' | null => {
    const isStarter = currentPresetConfig.lineupIds.includes(String(player.id));
    if (!isStarter) return null;

    if (player.position === 'GK') return 'orange';
    if (['LB', 'CB', 'RB', 'SW'].includes(player.position)) return 'yellow';
    if (['LM', 'CM', 'RM'].includes(player.position)) return 'green';
    return 'blue';
  };

  // Titularii ordonați conform formației curente
  const currentFormationDef = FORMATIONS.find(f => f.type === selectedFormation) || FORMATIONS[0];
  const starterPlayers = currentPresetConfig.lineupIds
    .map(id => allSquadPlayers.find(p => String(p.id) === String(id)))
    .filter(Boolean) as Player[];

  const gkPlayer = starterPlayers[0] || allSquadPlayers.find(p => p.position === 'GK') || allSquadPlayers[0];
  const defPlayers = starterPlayers.slice(1, 1 + currentFormationDef.defs);
  const midPlayers = starterPlayers.slice(1 + currentFormationDef.defs, 1 + currentFormationDef.defs + currentFormationDef.mids);
  const attPlayers = starterPlayers.slice(1 + currentFormationDef.defs + currentFormationDef.mids, 11);

  const benchPlayers = currentPresetConfig.benchIds
    .map(id => allSquadPlayers.find(p => String(p.id) === String(id)))
    .filter(Boolean) as Player[];

  return (
    <div className="space-y-6 font-sans text-zinc-200">

      {/* ─── Notificare Salvare ─── */}
      {notification && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/80 p-4 text-emerald-200 shadow-xl backdrop-blur-md flex items-center justify-between text-xs font-bold">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ─── Antet Modul Tactici & Selecții ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
              Schimbă setările tactice și selecția echipei
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <span>Selecție Activă &rArr; {activePreset === 'PENALTIES' ? 'Executanți Penalty' : `Garnitura (${activePreset})`}</span>
              {activePreset === 'A' && (
                <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                  Selecție Inițială (Implicită)
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Dacă managerul nu se loghează înainte de ora meciului oficial (04:00 CET), se va aplica automat <strong>Selecția A</strong>.
            </p>
          </div>

          {/* Comutator Garnituri (A, B, C, D, Penaltyuri) */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 text-xs self-start lg:self-auto flex-wrap">
            {(['A', 'B', 'C', 'D', 'PENALTIES'] as PresetKey[]).map((key) => {
              const isActive = activePreset === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePreset(key)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>{key === 'PENALTIES' ? '🎯' : 'Selecția'}</span>
                  <span>{key === 'PENALTIES' ? 'Penaltyuri' : key}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bară Selector Formație cu buton Execută (Captura 1) */}
        {activePreset !== 'PENALTIES' && (
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 font-bold uppercase text-[11px]">Formație:</span>
              <select
                value={selectedFormation}
                onChange={(e) => setSelectedFormation(e.target.value as FormationType)}
                className="bg-zinc-950 text-white border border-zinc-700 rounded-lg px-3 py-1.5 font-bold font-mono text-xs focus:outline-none focus:border-blue-500"
              >
                {FORMATIONS.map(f => (
                  <option key={f.type} value={f.type}>{f.type}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExecuteFormation}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 text-white text-xs font-bold transition shadow"
            >
              Execută
            </button>
          </div>
        )}
      </div>

      {/* ─── Terenul Vizual Verde 1-la-1 SoccerProject ─── */}
      {activePreset !== 'PENALTIES' ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-2xl space-y-4">
          <div className="relative w-full rounded-2xl border-4 border-emerald-700/60 bg-gradient-to-b from-[#2e7d32] via-[#246b28] to-[#2e7d32] p-4 sm:p-6 shadow-2xl overflow-hidden min-h-[580px] flex flex-col justify-between">
            
            {/* Linii Albe Teren Gazon */}
            <div className="pointer-events-none absolute inset-4 rounded-xl border-2 border-white/40" />
            <div className="pointer-events-none absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-white/40" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
            
            {/* Careu Sus (Atac) */}
            <div className="pointer-events-none absolute left-1/2 top-4 h-24 w-52 -translate-x-1/2 border-2 border-t-0 border-white/40" />
            
            {/* Careu Jos (Poartă) */}
            <div className="pointer-events-none absolute left-1/2 bottom-4 h-24 w-52 -translate-x-1/2 border-2 border-b-0 border-white/40" />
            <div className="pointer-events-none absolute left-1/2 bottom-4 h-10 w-28 -translate-x-1/2 border-2 border-b-0 border-white/40" />

            {/* 1. Rând Atacanți (🟦 Bare Albastre) */}
            <div className="relative z-10 flex justify-around items-center pt-2">
              {attPlayers.map((player, idx) => {
                const slotIndex = 1 + currentFormationDef.defs + currentFormationDef.mids + idx;
                return (
                  <div key={idx} className="flex flex-col items-center group">
                    <div className="text-2xl filter drop-shadow">🏃</div>
                    <span className="text-[10px] font-bold font-mono bg-blue-900 text-white px-1.5 rounded -mt-2 shadow border border-blue-400">
                      {player?.number || '70'}
                    </span>
                    <select
                      value={String(player?.id || '')}
                      onChange={(e) => handleAssignPlayerToSlot(slotIndex, e.target.value)}
                      className="mt-1 bg-[#4285f4] hover:bg-[#3367d6] text-white font-bold text-xs px-2 py-1 rounded shadow-lg border border-blue-300 max-w-[130px] truncate cursor-pointer text-center"
                    >
                      {Object.entries(getPlayersByNaturalPosition()).map(([groupName, groupPlayers]) => (
                        <optgroup key={groupName} label={groupName} className="bg-zinc-900 text-zinc-300">
                          {groupPlayers.map(p => (
                            <option key={p.id} value={String(p.id)}>
                              {p.number}. {p.name} ({p.position})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* 2. Rând Mijlocași (🟩 Bare Verzi) */}
            <div className="relative z-10 flex justify-around items-center py-4">
              {midPlayers.map((player, idx) => {
                const slotIndex = 1 + currentFormationDef.defs + idx;
                return (
                  <div key={idx} className="flex flex-col items-center group">
                    <div className="text-2xl filter drop-shadow">🏃</div>
                    <span className="text-[10px] font-bold font-mono bg-emerald-900 text-white px-1.5 rounded -mt-2 shadow border border-emerald-400">
                      {player?.number || '06'}
                    </span>
                    <select
                      value={String(player?.id || '')}
                      onChange={(e) => handleAssignPlayerToSlot(slotIndex, e.target.value)}
                      className="mt-1 bg-[#5bb75b] hover:bg-[#469b46] text-white font-bold text-xs px-2 py-1 rounded shadow-lg border border-emerald-300 max-w-[130px] truncate cursor-pointer text-center"
                    >
                      {Object.entries(getPlayersByNaturalPosition()).map(([groupName, groupPlayers]) => (
                        <optgroup key={groupName} label={groupName} className="bg-zinc-900 text-zinc-300">
                          {groupPlayers.map(p => (
                            <option key={p.id} value={String(p.id)}>
                              {p.number}. {p.name} ({p.position})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* 3. Rând Fundași (🟨 Bare Galbene) */}
            <div className="relative z-10 flex justify-around items-center py-2">
              {defPlayers.map((player, idx) => {
                const slotIndex = 1 + idx;
                return (
                  <div key={idx} className="flex flex-col items-center group">
                    <div className="text-2xl filter drop-shadow">🏃</div>
                    <span className="text-[10px] font-bold font-mono bg-amber-900 text-white px-1.5 rounded -mt-2 shadow border border-amber-400">
                      {player?.number || '14'}
                    </span>
                    <select
                      value={String(player?.id || '')}
                      onChange={(e) => handleAssignPlayerToSlot(slotIndex, e.target.value)}
                      className="mt-1 bg-[#f0ad4e] hover:bg-[#ec971f] text-slate-950 font-bold text-xs px-2 py-1 rounded shadow-lg border border-amber-300 max-w-[130px] truncate cursor-pointer text-center"
                    >
                      {Object.entries(getPlayersByNaturalPosition()).map(([groupName, groupPlayers]) => (
                        <optgroup key={groupName} label={groupName} className="bg-zinc-900 text-zinc-300">
                          {groupPlayers.map(p => (
                            <option key={p.id} value={String(p.id)}>
                              {p.number}. {p.name} ({p.position})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* 4. Rând Portar (🟧 Bară Portocalie) */}
            <div className="relative z-10 flex justify-center items-center pb-2">
              <div className="flex flex-col items-center group">
                <div className="text-2xl filter drop-shadow">🧤</div>
                <span className="text-[10px] font-bold font-mono bg-orange-950 text-orange-200 px-1.5 rounded -mt-2 shadow border border-orange-400">
                  {gkPlayer?.number || '01'}
                </span>
                <select
                  value={String(gkPlayer?.id || '')}
                  onChange={(e) => handleAssignPlayerToSlot(0, e.target.value)}
                  className="mt-1 bg-[#ff7043] hover:bg-[#f4511e] text-white font-bold text-xs px-3 py-1 rounded shadow-lg border border-orange-300 max-w-[140px] truncate cursor-pointer text-center"
                >
                  {allSquadPlayers.map(p => (
                    <option key={p.id} value={String(p.id)} className="bg-zinc-900 text-white">
                      {p.number}. {p.name} ({p.position})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Banca de Rezerve (5 Sloturi Gri) */}
            <div className="relative z-10 border-t border-white/20 pt-3 mt-2 flex justify-around items-center bg-black/20 rounded-xl p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 absolute -top-2.5 left-4 bg-emerald-900 px-2 rounded border border-white/20">
                Banca de Rezerve
              </span>
              {[0, 1, 2, 3, 4].map((benchIdx) => {
                const subPlayer = benchPlayers[benchIdx];
                return (
                  <div key={benchIdx} className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-zinc-300">R{benchIdx + 1}</span>
                    <select
                      value={String(subPlayer?.id || '')}
                      onChange={(e) => handleAssignPlayerToSlot(benchIdx, e.target.value, true)}
                      className="mt-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px] px-1.5 py-0.5 rounded shadow border border-zinc-600 max-w-[110px] truncate cursor-pointer"
                    >
                      <option value="">- Alege -</option>
                      {allSquadPlayers.map(p => (
                        <option key={p.id} value={String(p.id)} className="bg-zinc-900 text-white">
                          {p.number}. {p.name} ({p.position})
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ─── Panou de Setări Tactice sub Teren (Captura 1) ─── */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Schimbă Setările Tactice &bull; Selecția {activePreset}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-400 font-semibold mb-1">Agresivitate:</label>
                <select
                  value={currentPresetConfig.aggressiveness}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPresets(prev => ({
                      ...prev,
                      [activePreset]: { ...prev[activePreset], aggressiveness: val }
                    }));
                  }}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg p-2 font-bold font-mono"
                >
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                    <option key={v} value={v}>{v}%</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 font-semibold mb-1">Stil (Ofensiv):</label>
                <select
                  value={currentPresetConfig.style === 'PASSING' ? 100 : 50}
                  onChange={(e) => {
                    const st: TacticalStyle = Number(e.target.value) >= 70 ? 'PASSING' : 'DEFENSIVE';
                    setPresets(prev => ({
                      ...prev,
                      [activePreset]: { ...prev[activePreset], style: st }
                    }));
                  }}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg p-2 font-bold font-mono"
                >
                  <option value={100}>100 (Ultra Ofensiv)</option>
                  <option value={75}>75 (Ofensiv)</option>
                  <option value={50}>50 (Echilibrat)</option>
                  <option value={25}>25 (Prudent)</option>
                  <option value={0}>0 (Ultra Defensiv)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 font-semibold mb-1">Tactici:</label>
                <select
                  value={currentPresetConfig.tacticName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPresets(prev => ({
                      ...prev,
                      [activePreset]: { ...prev[activePreset], tacticName: val }
                    }));
                  }}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg p-2 font-semibold"
                >
                  {TACTIC_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 font-semibold mb-1">Căpitan Echipă:</label>
                <select
                  value={currentPresetConfig.captainId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPresets(prev => ({
                      ...prev,
                      [activePreset]: { ...prev[activePreset], captainId: val }
                    }));
                  }}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg p-2 font-bold truncate"
                >
                  {starterPlayers.map(p => (
                    <option key={p.id} value={String(p.id)}>
                      {p.number}. {p.name} ({p.position})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSavePreset}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
              >
                <span>💾</span>
                <span>Salvează Selecția {activePreset}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Ecran Executanți & Setare Penaltyuri (1-la-1 SoccerProject) ─── */
        <PenaltySettingsView
          teamName={activeTeam.name}
          teamId={activeTeam.id}
          squadPlayers={allSquadPlayers}
          onSelectPlayer={(p) => {
            if (onSelectPlayer) onSelectPlayer(p, selectedTeam === 'away');
          }}
        />
      )}

      {/* ─── Tabelul Sincronizat de Lot (Sub Teren pentru Selecțiile A, B, C, D) ─── */}
      {activePreset !== 'PENALTIES' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden space-y-2">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Lot Jucători &bull; Sincronizare Primul 11</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Rândurile colorate reprezintă titularii de pe teren (Portocaliu = GK, Galben = DEF, Verde = MID, Albastru = ATT).
              </p>
            </div>

            {/* Legendă Culori */}
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-[#ff7043] text-white">GK</span>
              <span className="px-2 py-0.5 rounded bg-[#f0ad4e] text-slate-950">DEF</span>
              <span className="px-2 py-0.5 rounded bg-[#5bb75b] text-white">MID</span>
              <span className="px-2 py-0.5 rounded bg-[#4285f4] text-white">ATT</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">Rezervă</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 w-[50px]">Poz</th>
                  <th className="py-2.5 px-4">Nume</th>
                  <th className="py-2.5 px-3 text-center w-[70px]">Moral</th>
                  <th className="py-2.5 px-3 text-center w-[75px]">Condiție</th>
                  <th className="py-2.5 px-4 text-center w-[150px]">Formă Recentă</th>
                  <th className="py-2.5 px-4 text-left w-[180px]">Calitate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {allSquadPlayers.map((player) => {
                  const compColor = getPlayerCompartmentColor(player);
                  const isSelected = compColor !== null;

                  // Stilul rândului colorat exact ca în captura SoccerProject
                  let rowBgClass = 'hover:bg-zinc-800/40 transition cursor-pointer';
                  if (compColor === 'orange') rowBgClass = 'bg-[#ff7043]/20 hover:bg-[#ff7043]/30 text-orange-200 border-l-4 border-[#ff7043]';
                  if (compColor === 'yellow') rowBgClass = 'bg-[#f0ad4e]/20 hover:bg-[#f0ad4e]/30 text-amber-200 border-l-4 border-[#f0ad4e]';
                  if (compColor === 'green') rowBgClass = 'bg-[#5bb75b]/20 hover:bg-[#5bb75b]/30 text-emerald-200 border-l-4 border-[#5bb75b]';
                  if (compColor === 'blue') rowBgClass = 'bg-[#4285f4]/20 hover:bg-[#4285f4]/30 text-blue-200 border-l-4 border-[#4285f4]';

                  const quality = player.overallQuality || player.overall || 70;
                  const segmentsCount = Math.round((quality / 100) * 10);

                  return (
                    <tr
                      key={player.id}
                      onClick={() => onSelectPlayer && onSelectPlayer(player, false)}
                      className={`${rowBgClass} transition`}
                      title="Click pentru a deschide fișa completă SoccerProject"
                    >
                      <td className="py-2.5 px-3 font-bold font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          compColor === 'orange' ? 'bg-[#ff7043] text-white' :
                          compColor === 'yellow' ? 'bg-[#f0ad4e] text-slate-950' :
                          compColor === 'green' ? 'bg-[#5bb75b] text-white' :
                          compColor === 'blue' ? 'bg-[#4285f4] text-white' :
                          'bg-zinc-800 text-zinc-300'
                        }`}>
                          {player.position}
                        </span>
                      </td>

                      <td className="py-2.5 px-4 font-bold text-white">
                        <span>{player.number}. {player.name}</span>
                        {isSelected && <span className="ml-2 text-[9px] font-mono uppercase bg-white/20 px-1 rounded">Titular</span>}
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        <span className={player.morale < 50 ? 'text-rose-400' : 'text-zinc-200'}>
                          {player.morale}%
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        <span className={player.condition < 40 ? 'text-rose-400 animate-pulse font-black' : 'text-zinc-200'}>
                          {player.condition}%
                        </span>
                      </td>

                      <td className="py-2.5 px-4 text-center font-mono text-[11px] text-zinc-300 whitespace-nowrap">
                        {player.recentPerformances && player.recentPerformances.length > 0
                          ? player.recentPerformances.join('-')
                          : '45-48-42-50-46'}
                      </td>

                      <td className="py-2.5 px-4">
                        {/* Bare segmentate albastre fidel capturii SoccerProject */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2.5 w-3 rounded-xs border border-zinc-900 ${
                                i < segmentsCount ? 'bg-[#4285f4]' : 'bg-zinc-800'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] font-mono font-bold text-zinc-400 ml-1.5">{quality}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
