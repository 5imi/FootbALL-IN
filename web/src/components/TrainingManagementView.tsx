import React, { useState } from 'react';
import { Player, SkillName } from '../engine/types';
import { TrainerStaff, PhysioStaff, TrainingProgressReport, trainWholeSquad } from '../engine/trainingEngine';
import { recoverSquadFitness, RecoveryReport, calculateInjuryRisk } from '../engine/recoveryEngine';

interface TrainingManagementViewProps {
  players: Player[];
  onOpenPlayerCard: (player: Player) => void;
}

const SKILL_OPTIONS: { key: SkillName; label: string }[] = [
  { key: 'stamina', label: 'Rezistență' },
  { key: 'speed', label: 'Viteză' },
  { key: 'technique', label: 'Tehnică' },
  { key: 'passing', label: 'Pase' },
  { key: 'shooting', label: 'Șuturi' },
  { key: 'clearance', label: 'Respingeri' },
  { key: 'strength', label: 'Forță' },
  { key: 'heading', label: 'Cap' },
  { key: 'tackling', label: 'Deposedări' },
  { key: 'vision', label: 'Viziune / Reflexe' },
];

export const TrainingManagementView: React.FC<TrainingManagementViewProps> = ({
  players,
  onOpenPlayerCard
}) => {
  // Staff Club
  const [trainer, setTrainer] = useState<TrainerStaff>({
    id: 'tr-1',
    name: 'Gheorghe Hagi (Antrenor Principal)',
    quality: 92, // 92% calitate
    salaryWeekly: 12500
  });

  const [physio, setPhysio] = useState<PhysioStaff>({
    id: 'ph-1',
    name: 'Dr. Pompiliu Popescu (Kinetoterapeut)',
    quality: 88, // 88% calitate
    salaryWeekly: 8500
  });

  // Filtru pe loturi: ALL | A | B | C | D
  const [squadFilter, setSquadFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');

  // Selecție skill per jucător
  const [playerTargets, setPlayerTargets] = useState<Record<string, SkillName>>({});

  // Rapoarte recente
  const [trainingReports, setTrainingReports] = useState<TrainingProgressReport[]>([]);
  const [recoveryReports, setRecoveryReports] = useState<RecoveryReport[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredPlayers = players.filter(
    p => squadFilter === 'ALL' || p.squad === squadFilter
  );

  const handleTrainSquad = () => {
    const reports = trainWholeSquad(players, trainer, playerTargets);
    setTrainingReports(reports);
    setNotification(`🏋️ Antrenament finalizat! ${reports.length} jucători au progresat în atribute.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRecoverSquad = () => {
    const reports = recoverSquadFitness(players, physio, 12);
    setRecoveryReports(reports);
    setNotification(`💆 Sesiune maseur finalizată! Condiția fizică a întregului lot a fost refăcută.`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Panou Staff & Acțiuni Rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card Antrenor */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-blue-400 font-bold">Staff Tehnic • Antrenor</div>
            <h4 className="text-base font-bold text-white mt-1">{trainer.name}</h4>
            <div className="flex items-center justify-between text-xs mt-3">
              <span className="text-slate-400">Calitate Antrenament:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{trainer.quality}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${trainer.quality}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Salariu: €{trainer.salaryWeekly.toLocaleString()}/săpt</div>
          </div>
          <button 
            onClick={handleTrainSquad}
            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition shadow-md hover:shadow-blue-500/20"
          >
            🏋️ Simulează Antrenament Lot
          </button>
        </div>

        {/* Card Maseur / Physio */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-teal-400 font-bold">Staff Medical • Maseur / Physio</div>
            <h4 className="text-base font-bold text-white mt-1">{physio.name}</h4>
            <div className="flex items-center justify-between text-xs mt-3">
              <span className="text-slate-400">Eficiență Recuperare:</span>
              <span className="font-bold text-teal-400 font-mono text-sm">{physio.quality}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-1 overflow-hidden">
              <div className="bg-teal-500 h-full" style={{ width: `${physio.quality}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Salariu: €{physio.salaryWeekly.toLocaleString()}/săpt</div>
          </div>
          <button 
            onClick={handleRecoverSquad}
            className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition shadow-md hover:shadow-teal-500/20"
          >
            💆 Sesiune Refacere Maseur (12h)
          </button>
        </div>

        {/* Card Sumar Rotație & Loturi */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Strategie Rotație • SP System</div>
            <h4 className="text-base font-bold text-white mt-1">Echipe Presetate (A, B, C, D)</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Jucătorii obosiți sub <span className="text-amber-400 font-semibold">75% condiție</span> riscă rupturi musculare. Folosește Lotul C/D pentru amicale și tineret.
            </p>
          </div>
          <div className="flex gap-1.5 mt-4">
            {(['ALL', 'A', 'B', 'C', 'D'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSquadFilter(s)}
                className={`flex-1 py-1.5 rounded text-xs font-bold transition border ${
                  squadFilter === s
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {s === 'ALL' ? 'Toți' : `Lot ${s}`}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Alertă Notificare Progres */}
      {notification && (
        <div className="bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 text-xs px-4 py-2.5 rounded-lg shadow animate-fade-in flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Tabel Jucători și Setare Antrenamente */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Registru Jucători & Focare de Antrenament</h3>
            <span className="text-xs text-slate-400">Apasă pe oricare jucător pentru a-i deschide fișa completă SoccerProject cu bare roșii</span>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full font-mono">
            {filteredPlayers.length} jucători afișați
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th>Nume Jucător</th>
                <th>Vârstă</th>
                <th>Post</th>
                <th>Lot</th>
                <th>Condiție (Fitness)</th>
                <th>Moral</th>
                <th>Calitate</th>
                <th>EXP</th>
                <th>Atribut Antrenat</th>
                <th className="text-right px-4">Acțiune</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {filteredPlayers.map((player) => {
                const injuryRisk = calculateInjuryRisk(player);
                const currentTarget = playerTargets[player.id];

                return (
                  <tr key={player.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{player.number}</td>
                    <td className="font-bold text-white flex items-center gap-1.5 py-2.5">
                      <span 
                        onClick={() => onOpenPlayerCard(player)} 
                        className="cursor-pointer hover:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {player.name}
                        {player.nickname && <span className="text-[10px] text-amber-400 font-normal italic">„{player.nickname}”</span>}
                      </span>
                    </td>
                    <td className="text-slate-300">{player.age} ani</td>
                    <td>
                      <span className="bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] border border-amber-400/30">
                        {player.position}
                      </span>
                    </td>
                    <td>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        player.squad === 'A' ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' :
                        player.squad === 'B' ? 'bg-indigo-600/30 text-indigo-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        Lot {player.squad}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${
                          injuryRisk.riskLevel === 'DANGER' ? 'text-rose-400 animate-pulse' :
                          injuryRisk.riskLevel === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {player.condition}%
                        </span>
                        {injuryRisk.riskLevel === 'DANGER' && <span title="Risc mare de accidentare!">⚠️</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`font-mono ${player.morale > 70 ? 'text-rose-400' : 'text-slate-500'}`}>
                        {player.morale}%
                      </span>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-blue-400">{player.overallQuality}%</span>
                    </td>
                    <td>
                      <span className="font-mono text-amber-400 font-semibold">{player.experience}%</span>
                    </td>
                    <td>
                      <select
                        value={currentTarget || ''}
                        onChange={(e) => setPlayerTargets({ ...playerTargets, [player.id]: e.target.value as SkillName })}
                        className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Auto (Cel mai mic)</option>

                        {SKILL_OPTIONS.map(opt => {
                          const s = player.skills ? player.skills[opt.key] : null;
                          const isCapped = s?.isTrainedMax;
                          return (
                            <option key={opt.key} value={opt.key} disabled={isCapped}>
                              {opt.label} ({s ? `${s.value}%` : ''} {isCapped ? '🔒 ROȘU' : ''})
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="text-right px-4">
                      <button
                        onClick={() => onOpenPlayerCard(player)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] font-semibold transition"
                      >
                        Fișă SP 🔍
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
