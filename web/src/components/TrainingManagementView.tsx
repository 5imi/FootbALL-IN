import React, { useState } from 'react';
import { Player, SkillName, PositionType } from '../engine/types';
import { TrainerStaff, PhysioStaff, trainPlayerSession, getLowestUncappedSkill } from '../engine/trainingEngine';

interface TrainingManagementViewProps {
  players: Player[];
  onOpenPlayerCard: (player: Player) => void;
}

// Atribute jucători de câmp conform SoccerProject
const FIELD_SKILL_OPTIONS: { key: SkillName; label: string }[] = [
  { key: 'heading', label: 'Cap' },
  { key: 'tackling', label: 'Deposedări' },
  { key: 'strength', label: 'Forță' },
  { key: 'clearance', label: 'Intuiție' },
  { key: 'passing', label: 'Pase' },
  { key: 'stamina', label: 'Rezistență' },
  { key: 'shooting', label: 'Șuturi' },
  { key: 'technique', label: 'Tehnică' },
  { key: 'speed', label: 'Viteză' },
  { key: 'vision', label: 'Viziune' },
];

// Atribute portari conform SoccerProject
const GK_SKILL_OPTIONS: { key: SkillName; label: string }[] = [
  { key: 'heading', label: 'Curaj' },
  { key: 'clearance', label: 'Degajări' },
  { key: 'strength', label: 'Detentă' },
  { key: 'tackling', label: 'Joc de picior' },
  { key: 'vision', label: 'Reflex' },
  { key: 'stamina', label: 'Rezistență' },
  { key: 'speed', label: 'Viteză' },
  { key: 'technique', label: 'Tehnică' },
];

export const TrainingManagementView: React.FC<TrainingManagementViewProps> = ({
  players,
  onOpenPlayerCard
}) => {
  const trainer: TrainerStaff = {
    id: 'tr-1',
    name: 'Kuan Chun Hang',
    quality: 94,
    salaryWeekly: 14500
  };

  // State: selecții atribute per jucător din localStorage
  const [playerTargets, setPlayerTargets] = useState<Record<string, SkillName>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('footballin_training_targets');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdateTarget = (playerId: string, skill: SkillName) => {
    setPlayerTargets(prev => {
      const updated = { ...prev, [playerId]: skill };
      if (typeof window !== 'undefined') {
        localStorage.setItem('footballin_training_targets', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleTrainAutomatic = () => {
    // În modul automat, antrenorul selectează cel mai mic atribut neplafonat pentru fiecare jucător apt
    const updated: Record<string, SkillName> = { ...playerTargets };
    let assignedCount = 0;

    for (const p of players) {
      const isInjured = (p.seasonStats?.injuries ?? 0) > 0 && p.condition < 40;
      if (!isInjured) {
        const lowestSkill = getLowestUncappedSkill(p);
        if (lowestSkill) {
          updated[p.id] = lowestSkill;
          assignedCount++;
        }
      }
    }

    setPlayerTargets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('footballin_training_targets', JSON.stringify(updated));
    }

    setNotification(`✔️ Antrenorul ${trainer.name} a setat automat cel mai mic atribut neplafonat pentru ${assignedCount} jucători apți!`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleManualSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('footballin_training_targets', JSON.stringify(playerTargets));
    }
    setNotification('💾 Planul de antrenament a fost salvat cu succes!');
    setTimeout(() => setNotification(null), 4000);
  };

  // Separare pe categorii exacte SoccerProject
  const gks = players.filter(p => p.position === 'GK');
  const defs = players.filter(p => ['LB', 'CB', 'RB'].includes(p.position));
  const mids = players.filter(p => ['LM', 'CM', 'RM'].includes(p.position));
  const atts = players.filter(p => ['LF', 'CF', 'RF'].includes(p.position));

  // Culoare insignă poziție SoccerProject
  const getPositionBadgeStyle = (pos: PositionType) => {
    if (pos === 'GK') {
      return 'bg-[#d35400] text-white'; // Portocaliu / Cărămiziu SP
    }
    if (['LB', 'CB', 'RB'].includes(pos)) {
      return 'bg-[#d4ac0d] text-slate-950 font-bold'; // Galben-muștar / Kaki SP
    }
    if (['LM', 'CM', 'RM'].includes(pos)) {
      return 'bg-[#27ae60] text-white'; // Verde aprins SP
    }
    return 'bg-[#2980b9] text-white'; // Albastru atacant SP
  };

  const renderPlayerTable = (title: string, groupPlayers: Player[]) => {
    if (groupPlayers.length === 0) return null;

    return (
      <div className="space-y-1">
        {/* Titlu Compartiment */}
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">{title}</h4>

        {/* Tabel autentic SoccerProject */}
        <div className="border border-blue-400/50 dark:border-blue-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              {groupPlayers.map((p, idx) => {
                const isInjured = (p.seasonStats?.injuries ?? 0) > 0 && p.condition < 40;
                const isGk = p.position === 'GK';
                const skillList = isGk ? GK_SKILL_OPTIONS : FIELD_SKILL_OPTIONS;

                // Dacă nu are încă o selecție manuală salvată, afișează automat cel mai mic atribut
                const currentTarget = playerTargets[p.id] || getLowestUncappedSkill(p) || (isGk ? 'heading' : 'stamina');

                return (
                  <tr 
                    key={p.id}
                    className={`border-b border-blue-200/40 dark:border-blue-900/40 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition ${
                      idx % 2 === 1 ? 'bg-slate-50/40 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* 1. Badge Poziție */}
                    <td className="w-12 px-2 py-1.5 align-middle">
                      <span className={`inline-block w-8 text-center text-[10px] font-bold py-0.5 rounded-sm shadow-sm ${getPositionBadgeStyle(p.position)}`}>
                        {p.position}
                      </span>
                    </td>

                    {/* 2. Număr și Nume jucător (Click deschide fișa SP) */}
                    <td className="px-3 py-1.5 align-middle">
                      <button
                        onClick={() => onOpenPlayerCard(p)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline font-semibold text-left transition cursor-pointer"
                        title="Apasă pentru a deschide fișa detaliată SoccerProject"
                      >
                        {p.number}. {p.name}
                      </button>
                      {p.nickname && (
                        <span className="text-[10px] text-slate-400 italic ml-1.5">„{p.nickname}”</span>
                      )}
                    </td>

                    {/* 3. Stare medicală */}
                    <td className="w-10 px-2 py-1.5 text-center align-middle">
                      {isInjured ? (
                        <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold" title="Accidentat (Inapt)">
                          <span>❌</span>
                          <span className="text-[10px] bg-rose-500 text-white px-1 rounded">➕</span>
                        </span>
                      ) : (
                        <span className="text-emerald-500 font-bold text-sm" title="Apt de antrenament">
                          ✔️
                        </span>
                      )}
                    </td>

                    {/* 4. Selector Atribut Antrenat */}
                    <td className="w-48 px-3 py-1.5 text-right align-middle">
                      {isInjured ? (
                        <span className="inline-flex items-center gap-1 text-rose-500 text-xs font-semibold px-2 py-0.5 bg-rose-500/10 rounded">
                          <span>❌</span>
                          <span>Accidentat</span>
                        </span>
                      ) : (
                        <select
                          value={currentTarget}
                          onChange={(e) => handleUpdateTarget(p.id, e.target.value as SkillName)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500 transition shadow-inner"
                        >
                          {skillList.map(opt => {
                            const s = p.skills ? p.skills[opt.key] : null;
                            const isCapped = s?.isTrainedMax;
                            return (
                              <option 
                                key={opt.key} 
                                value={opt.key}
                                className={isCapped ? 'text-rose-500 font-bold dark:bg-slate-900' : 'text-slate-800 dark:text-slate-200 dark:bg-slate-900'}
                              >
                                {opt.label} {isCapped ? '(Plafonat 🔒)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans text-slate-800 dark:text-slate-200">
      
      {/* ─── Header Stil SoccerProject ─── */}
      <div className="space-y-2 border-b border-slate-300 dark:border-slate-700 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Antrenament de</span>
          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            {trainer.name}
          </span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            (Calitate: {trainer.quality}%)
          </span>
        </h3>
        
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
          Pe această pagină poţi antrena jucătorii, ceea ce este foarte important pentru echipa ta. Îi poţi antrena tu, sau îl poţi lăsa pe antrenor s-o facă. Un jucător se antrenează de 5 ori pe zi, se va antrena la calitatea selectată în acel moment.
        </p>
      </div>

      {/* ─── Secțiunea Automatic ─── */}
      <div className="space-y-1.5 pt-1">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Automatic</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Poţi să-l pui pe <span className="text-blue-600 dark:text-blue-400 cursor-pointer">{trainer.name}</span> să genereze o sesiune de antrenament automată.
        </p>
        <div>
          <button
            onClick={handleTrainAutomatic}
            className="px-4 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded border border-slate-300 dark:border-slate-600 shadow-sm transition active:translate-y-0.5"
          >
            Automatic
          </button>
        </div>
      </div>

      {/* Alertă Notificare Salvare / Succes */}
      {notification && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-500/50 text-emerald-800 dark:text-emerald-200 text-xs px-3 py-2 rounded shadow-sm flex items-center justify-between transition">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* ─── Secțiunea Manual ─── */}
      <div className="space-y-4 pt-1">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Manual</h4>

        {/* 1. Portari */}
        {renderPlayerTable('Portari', gks)}

        {/* 2. Fundaşi */}
        {renderPlayerTable('Fundaşi', defs)}

        {/* 3. Mijlocaşi */}
        {renderPlayerTable('Mijlocaşi', mids)}

        {/* 4. Atacanţi */}
        {renderPlayerTable('Atacanţi', atts)}

        {/* Buton Salvează */}
        <div className="pt-2">
          <button
            onClick={handleManualSave}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow border border-blue-700 transition active:translate-y-0.5 flex items-center gap-1.5"
          >
            <span>Salvează</span>
          </button>
        </div>
      </div>

    </div>
  );
};
