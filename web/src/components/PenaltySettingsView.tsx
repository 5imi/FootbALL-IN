'use client';

import React, { useState, useEffect } from 'react';
import { Player, PositionType } from '../engine/types';
import { 
  PenaltyDirection, 
  PENALTY_DIRECTIONS, 
  loadPenaltyConfig, 
  savePenaltyConfig,
  DEFAULT_PENALTY_KICKS,
  DEFAULT_PENALTY_SAVES
} from '../engine/penaltyEngine';

interface PenaltySettingsViewProps {
  teamName: string;
  teamId: string;
  squadPlayers: Player[];
  onSelectPlayer?: (player: Player) => void;
}

export const PenaltySettingsView: React.FC<PenaltySettingsViewProps> = ({
  teamName,
  teamId,
  squadPlayers,
  onSelectPlayer,
}) => {
  // Vizualizare activă: 'directions' (Setare penaltyuri) sau 'takers' (Executanți penalty)
  const [activeView, setActiveView] = useState<'directions' | 'takers'>('directions');

  // Direcțiile loviturilor (1-6)
  const [kicks, setKicks] = useState<PenaltyDirection[]>(() => [...DEFAULT_PENALTY_KICKS]);
  // Direcțiile de oprire / plonjon portar (1-6)
  const [saves, setSaves] = useState<PenaltyDirection[]>(() => [...DEFAULT_PENALTY_SAVES]);
  // Ordinea executanților (ID-uri jucători)
  const [takersOrder, setTakersOrder] = useState<string[]>([]);

  // Jucătorul selectat pentru fișa detaliată din subsol
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Notificare salvare în stil SoccerProject
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Încărcare dinamică din storage la montare / schimbare echipă
  useEffect(() => {
    const config = loadPenaltyConfig(teamId, squadPlayers);
    setKicks(config.kicks);
    setSaves(config.saves);
    setTakersOrder(config.takersOrder);
    if (config.takersOrder.length > 0 && !selectedPlayerId) {
      setSelectedPlayerId(config.takersOrder[0]);
    }
  }, [teamId, squadPlayers]);

  // Lista ordonată a jucătorilor conform `takersOrder`
  const orderedPlayers: Player[] = takersOrder
    .map(id => squadPlayers.find(p => String(p.id) === String(id)))
    .filter(Boolean) as Player[];

  // Asigurăm că avem un jucător inspectat
  const inspectedPlayer = squadPlayers.find(p => String(p.id) === String(selectedPlayerId)) || orderedPlayers[0] || squadPlayers[0];

  // Reordonare: urcă jucătorul cu un rând (index - 1)
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newOrder = [...takersOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setTakersOrder(newOrder);
  };

  // Reordonare: coboară jucătorul cu un rând (index + 1)
  const handleMoveDown = (index: number) => {
    if (index >= takersOrder.length - 1) return;
    const newOrder = [...takersOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setTakersOrder(newOrder);
  };

  // Salvare setări
  const handleSave = () => {
    savePenaltyConfig(teamId, {
      kicks,
      saves,
      takersOrder,
    });
    setSuccessNotice('Setarile pentru penalty au fost setate cu succes.');
    setTimeout(() => {
      setSuccessNotice(null);
    }, 5000);
  };

  // Badge culori poziții fidele SoccerProject
  const getPositionBadgeClass = (pos: PositionType) => {
    if (pos === 'GK') return 'bg-[#ff7043] text-white'; // Portocaliu GK
    if (['LB', 'CB', 'SW', 'RB'].includes(pos)) return 'bg-[#38bdf8] text-slate-950 font-bold'; // Cyan Fundași
    if (['LM', 'CM', 'RM'].includes(pos)) return 'bg-[#4ade80] text-slate-950 font-bold'; // Verde Mijlocași
    return 'bg-[#60a5fa] text-white font-bold'; // Albastru Atacanți
  };

  // Render bară segmentată de calitate fidelă SoccerProject (30 de celule pătrățele)
  const renderQualityBar = (qualityPercent: number) => {
    const totalSegments = 28;
    const filledCount = Math.round((Math.max(0, Math.min(100, qualityPercent)) / 100) * totalSegments);

    return (
      <div className="flex items-center gap-[1px] p-[2px] bg-zinc-950/80 rounded border border-zinc-700/60 w-fit">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={`w-[4.5px] h-[9px] rounded-[0.5px] ${
              i < filledCount 
                ? 'bg-gradient-to-t from-[#2563eb] to-[#60a5fa] shadow-[0_0_2px_rgba(96,165,250,0.5)]' 
                : 'bg-zinc-800/80'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans text-zinc-100">
      
      {/* ─── ECRAN 1: SETARE PENALTYURI (Lovituri & Oprire 1-6) ─── */}
      {activeView === 'directions' ? (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-6">
          
          {/* Titlu Secțiune cu linie punctată clasică SP */}
          <div className="border-b border-dashed border-zinc-700 pb-2">
            <h2 className="text-base font-black text-white tracking-wide">
              Setare penaltyuri
            </h2>
          </div>

          {/* Notificare Salvare */}
          {successNotice && (
            <div className="text-xs font-bold text-sky-400 py-1">
              {successNotice}
            </div>
          )}

          {/* 1. Lovituri penaltyuri (1 la 6) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-300">
              Lovituri penaltyuri
            </h3>

            {/* Rândul 1 (1, 2, 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-zinc-400 w-4 font-mono">{idx + 1} :</span>
                  <select
                    value={kicks[idx] || 'Stânga sus'}
                    onChange={(e) => {
                      const next = [...kicks];
                      next[idx] = e.target.value as PenaltyDirection;
                      setKicks(next);
                    }}
                    className="flex-1 bg-zinc-950 text-sky-300 font-semibold border border-sky-600/50 rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                  >
                    {PENALTY_DIRECTIONS.map((dir) => (
                      <option key={dir} value={dir} className="bg-zinc-900 text-white">
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Rândul 2 (4, 5, 6) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[3, 4, 5].map((idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-zinc-400 w-4 font-mono">{idx + 1} :</span>
                  <select
                    value={kicks[idx] || 'Stânga sus'}
                    onChange={(e) => {
                      const next = [...kicks];
                      next[idx] = e.target.value as PenaltyDirection;
                      setKicks(next);
                    }}
                    className="flex-1 bg-zinc-950 text-sky-300 font-semibold border border-sky-600/50 rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                  >
                    {PENALTY_DIRECTIONS.map((dir) => (
                      <option key={dir} value={dir} className="bg-zinc-900 text-white">
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Oprire penaltyuri (1 la 6 - Portar) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-zinc-300">
              Oprire penaltyuri
            </h3>

            {/* Rândul 1 (1, 2, 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-zinc-400 w-4 font-mono">{idx + 1} :</span>
                  <select
                    value={saves[idx] || 'Stânga sus'}
                    onChange={(e) => {
                      const next = [...saves];
                      next[idx] = e.target.value as PenaltyDirection;
                      setSaves(next);
                    }}
                    className="flex-1 bg-zinc-950 text-sky-300 font-semibold border border-sky-600/50 rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                  >
                    {PENALTY_DIRECTIONS.map((dir) => (
                      <option key={dir} value={dir} className="bg-zinc-900 text-white">
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Rândul 2 (4, 5, 6) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[3, 4, 5].map((idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-zinc-400 w-4 font-mono">{idx + 1} :</span>
                  <select
                    value={saves[idx] || 'Stânga sus'}
                    onChange={(e) => {
                      const next = [...saves];
                      next[idx] = e.target.value as PenaltyDirection;
                      setSaves(next);
                    }}
                    className="flex-1 bg-zinc-950 text-sky-300 font-semibold border border-sky-600/50 rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                  >
                    {PENALTY_DIRECTIONS.map((dir) => (
                      <option key={dir} value={dir} className="bg-zinc-900 text-white">
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Butoane Acțiune (Salvează | Jucători) */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white font-bold text-xs border border-sky-600/80 shadow-md transition"
            >
              Salvează
            </button>
            <button
              onClick={() => setActiveView('takers')}
              className="px-5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white font-bold text-xs border border-sky-600/80 shadow-md transition"
            >
              Jucători
            </button>
          </div>

        </div>
      ) : (
        /* ─── ECRAN 2: EXECUTANȚI PENALTY (Ordonare cu Săgeți & Fișă SP) ─── */
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
          
          {/* Text instrucțiuni deasupra butoanelor */}
          <p className="text-xs text-zinc-300">
            Mai jos ii poti vedea pe executantii penalty-urilor in ordinea lor actuala. Poti schimba ordinea cu ajutorul sagetilor. Nu uita sa si salvezi modificarile.
          </p>

          {/* Notificare Salvare */}
          {successNotice && (
            <div className="text-xs font-bold text-sky-400 py-0.5">
              {successNotice}
            </div>
          )}

          {/* Butoane Acțiune (Salvează | Setare penaltyuri) */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white font-bold text-xs border border-sky-600/80 shadow-sm transition"
            >
              Salvează
            </button>
            <button
              onClick={() => setActiveView('directions')}
              className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white font-bold text-xs border border-sky-600/80 shadow-sm transition"
            >
              Setare penaltyuri
            </button>
          </div>

          {/* Titlu Executanți Penalty cu linie punctată */}
          <div className="border-b border-dashed border-zinc-700 pb-1.5 pt-2">
            <h2 className="text-sm font-black text-white tracking-wide">
              Executanti penalty ({teamName || 'FC Foresta'})
            </h2>
          </div>

          {/* Tabel Lot Executanți */}
          <div className="overflow-x-auto rounded-xl border border-sky-900/60 bg-zinc-950/70">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sky-900/60 bg-sky-950/20 text-sky-200">
                  <th className="py-2 px-3 w-16 text-center font-semibold"></th>
                  <th className="py-2 px-3 w-16 text-center font-bold">Poz</th>
                  <th className="py-2 px-4 font-bold">Nume</th>
                  <th className="py-2 px-4 font-bold">Calitate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {orderedPlayers.map((player, idx) => {
                  const isSelected = String(player.id) === String(selectedPlayerId);
                  const isFirst = idx === 0;
                  const isLast = idx === orderedPlayers.length - 1;

                  return (
                    <tr
                      key={player.id}
                      onClick={() => {
                        setSelectedPlayerId(String(player.id));
                        if (onSelectPlayer) onSelectPlayer(player);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-sky-950/40 border-l-2 border-sky-400' 
                          : 'hover:bg-zinc-900/80'
                      }`}
                    >
                      {/* Coloana Săgeți ⬆️ ⬇️ */}
                      <td className="py-1 px-2 text-center select-none" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            title="Urcă în ordinea de executare"
                            disabled={isFirst}
                            onClick={() => handleMoveUp(idx)}
                            className={`p-0.5 rounded text-sky-400 hover:text-white hover:bg-sky-900/50 transition ${
                              isFirst ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          >
                            ⬆️
                          </button>
                          <button
                            title="Coboară în ordinea de executare"
                            disabled={isLast}
                            onClick={() => handleMoveDown(idx)}
                            className={`p-0.5 rounded text-sky-400 hover:text-white hover:bg-sky-900/50 transition ${
                              isLast ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          >
                            ⬇️
                          </button>
                        </div>
                      </td>

                      {/* Coloana Poz */}
                      <td className="py-1 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${getPositionBadgeClass(player.position)}`}>
                          {player.position}
                        </span>
                      </td>

                      {/* Coloana Nume */}
                      <td className="py-1 px-4 font-semibold text-sky-300 hover:underline">
                        {player.name}
                      </td>

                      {/* Coloana Calitate (Bară segmentată SP) */}
                      <td className="py-1 px-4">
                        {renderQualityBar(player.overallQuality || 65)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─── Fișa Tehnică Detaliată a Jucătorului Selectat (Captura 3) ─── */}
          {inspectedPlayer && (
            <div className="pt-4 border-t border-dashed border-zinc-700/80 flex flex-col md:flex-row items-start gap-4 text-xs">
              {/* Lupa 🔍 */}
              <div className="text-2xl pt-1 select-none text-zinc-400">
                🔍
              </div>

              {/* Grilă 3 Coloane Atribute exacte SP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-1.5 flex-1 text-zinc-300">
                
                {/* Coloana 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Aniversare</span>
                    <span className="font-semibold text-white">
                      {inspectedPlayer.birthDate || '14 Oct 2026'} [{inspectedPlayer.age || 19}]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Echipă</span>
                    <span className="font-semibold text-sky-400">{teamName || 'FC Foresta'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Formă</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.recentPerformances?.length 
                        ? inspectedPlayer.recentPerformances.join('–') 
                        : '48–45–45–50–46'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Cea mai buna performanță</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.bestPerformance || 50}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Calitate Globală</span>
                    <span className="font-bold text-white font-mono">
                      {inspectedPlayer.overallQuality || 67}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Agresivitate</span>
                    <span className="font-semibold font-mono text-rose-400">
                      {inspectedPlayer.aggression || 97}%
                    </span>
                  </div>
                </div>

                {/* Coloana 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Experiență</span>
                    <span className="font-semibold font-mono text-white">
                      {inspectedPlayer.experience || 11}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Moral</span>
                    <span className="font-semibold font-mono text-emerald-400">
                      {inspectedPlayer.morale || 100}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Condiție</span>
                    <span className="font-semibold font-mono text-sky-400">
                      {inspectedPlayer.condition || 85}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Rezistență</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.stamina?.value || 41}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Viteza</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.speed?.value || 78}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tehnica</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.technique?.value || 52}%
                    </span>
                  </div>
                </div>

                {/* Coloana 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Pase</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.passing?.value || 49}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Deposedări</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.tackling?.value || 46}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Intuiție</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.vision?.value || 44}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Forța</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.strength?.value || 94}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Cap</span>
                    <span className="font-semibold font-mono text-zinc-200">
                      {inspectedPlayer.skills?.heading?.value || 82}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Șuturi</span>
                    <span className="font-bold font-mono text-sky-400">
                      {inspectedPlayer.skills?.shooting?.value || 91}%
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
