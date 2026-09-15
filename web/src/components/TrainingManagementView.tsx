import React, { useState } from 'react';
import { Player, SkillName, PositionType } from '../engine/types';
import { TrainerStaff, PhysioStaff, getLowestUncappedSkill } from '../engine/trainingEngine';

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
      return 'bg-[#d35400] text-white';
    }
    if (['LB', 'CB', 'RB'].includes(pos)) {
      return 'bg-[#d4ac0d] text-zinc-950 font-black';
    }
    if (['LM', 'CM', 'RM'].includes(pos)) {
      return 'bg-[#27ae60] text-white font-bold';
    }
    return 'bg-[#2980b9] text-white font-bold';
  };

  const renderPlayerTable = (title: string, groupPlayers: Player[]) => {
    if (groupPlayers.length === 0) return null;

    return (
      <div className="space-y-2">
        {/* Titlu Compartiment */}
        <div className="flex items-center gap-2 px-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">{title}</h4>
          <span className="text-[11px] text-zinc-500 font-mono">({groupPlayers.length} jucători)</span>
        </div>

        {/* Tabel Dark Theme unificat cu restul aplicației */}
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3 w-14 text-center">Post</th>
                <th className="py-2.5 px-4">Jucător</th>
                <th className="py-2.5 px-3 w-20 text-center">Stare</th>
                <th className="py-2.5 px-4 w-60 text-right">Atribut Antrenat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {groupPlayers.map((p, idx) => {
                const isInjured = (p.seasonStats?.injuries ?? 0) > 0 && p.condition < 40;
                const isGk = p.position === 'GK';
                const skillList = isGk ? GK_SKILL_OPTIONS : FIELD_SKILL_OPTIONS;
                const currentTarget = playerTargets[p.id] || getLowestUncappedSkill(p) || (isGk ? 'heading' : 'stamina');

                return (
                  <tr 
                    key={p.id}
                    className={`hover:bg-zinc-800/50 transition-colors ${
                      idx % 2 === 1 ? 'bg-zinc-950/30' : 'bg-zinc-900/40'
                    }`}
                  >
                    {/* 1. Badge Poziție */}
                    <td className="py-2 px-3 text-center align-middle">
                      <span className={`inline-block w-9 text-center text-[10px] py-0.5 rounded shadow-sm ${getPositionBadgeStyle(p.position)}`}>
                        {p.position}
                      </span>
                    </td>

                    {/* 2. Număr și Nume jucător (Click deschide fișa SP) */}
                    <td className="py-2 px-4 align-middle">
                      <button
                        onClick={() => onOpenPlayerCard(p)}
                        className="text-blue-400 hover:text-blue-300 hover:underline font-semibold text-left transition cursor-pointer flex items-center gap-1.5"
                        title="Apasă pentru a deschide fișa completă SoccerProject"
                      >
                        <span>{p.number}. {p.name}</span>
                        {p.nickname && (
                          <span className="text-[10px] text-amber-400/80 font-normal italic">„{p.nickname}”</span>
                        )}
                      </button>
                    </td>

                    {/* 3. Stare medicală */}
                    <td className="py-2 px-3 text-center align-middle">
                      {isInjured ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]" title="Accidentat (Inapt)">
                          <span>❌</span>
                          <span>Inapt</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]" title="Apt de antrenament">
                          <span>✔️</span>
                          <span>Apt</span>
                        </span>
                      )}
                    </td>

                    {/* 4. Selector Atribut Antrenat */}
                    <td className="py-2 px-4 text-right align-middle">
                      {isInjured ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-semibold px-2.5 py-1 bg-rose-950/40 border border-rose-800/40 rounded-lg">
                          <span>🏥</span>
                          <span>La Infirmerie</span>
                        </span>
                      ) : (
                        <select
                          value={currentTarget}
                          onChange={(e) => handleUpdateTarget(p.id, e.target.value as SkillName)}
                          className="w-full max-w-[220px] bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 transition shadow-inner font-sans"
                        >
                          {skillList.map(opt => {
                            const s = p.skills ? p.skills[opt.key] : null;
                            const isCapped = s?.isTrainedMax;
                            return (
                              <option 
                                key={opt.key} 
                                value={opt.key}
                                className={isCapped ? 'text-rose-400 font-bold bg-zinc-950' : 'text-zinc-200 bg-zinc-950'}
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
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Header Card — Dark Theme unificat cu ScoreBoard și LeagueTable ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
        {/* Glow discret albastru */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Antrenament condus de</span>
              <span className="text-blue-400 font-semibold">{trainer.name}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Calitate staff: <span className="text-emerald-400 font-bold font-mono">{trainer.quality}%</span> • Salariu săptămânal: <span className="font-mono text-zinc-300">€{trainer.salaryWeekly.toLocaleString()}</span>
            </p>
          </div>
          <span className="self-start sm:self-auto rounded bg-blue-950 border border-blue-800/60 px-2.5 py-1 text-xs font-semibold text-blue-300">
            Sesiune Activă (5x / zi)
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
          Pe această pagină poți stabili planul de antrenament pentru fiecare jucător. Poți alege manual atributul vizat sau poți lăsa antrenorul să decidă automat cel mai slab atribut neplafonat. Un jucător se antrenează de 5 ori pe zi și progresează în funcție de calitatea antrenorului și condiția fizică.
        </p>

        {/* Secțiunea Automatic & Salvează */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Generare Automată</span>
            <span className="text-xs text-zinc-400">
              Setează automat pentru toți jucătorii apți atributul cu valoarea cea mai mică neplafonată.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTrainAutomatic}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md border border-blue-500/40 transition active:translate-y-0.5 flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Automatic</span>
            </button>

            <button
              onClick={handleManualSave}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md border border-emerald-500/40 transition active:translate-y-0.5 flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>Salvează</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alertă Notificare Salvare / Succes */}
      {notification && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/80 text-emerald-200 text-xs px-4 py-3 shadow-xl flex items-center justify-between transition backdrop-blur-md">
          <span className="font-semibold">{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white font-bold ml-3">✕</button>
        </div>
      )}

      {/* ─── Secțiunea Manual — Compartimentele SP ─── */}
      <div className="space-y-6">
        <div className="border-b border-zinc-800 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Planificare Manuală pe Compartimente
          </h3>
          <p className="text-xs text-zinc-400">
            Apasă pe numele oricărui jucător pentru a-i deschide fișa completă SoccerProject.
          </p>
        </div>

        {/* 1. Portari */}
        {renderPlayerTable('Portari', gks)}

        {/* 2. Fundaşi */}
        {renderPlayerTable('Fundaşi', defs)}

        {/* 3. Mijlocaşi */}
        {renderPlayerTable('Mijlocaşi', mids)}

        {/* 4. Atacanţi */}
        {renderPlayerTable('Atacanţi', atts)}

        {/* Buton Salvează Final */}
        <div className="pt-3 flex justify-end">
          <button
            onClick={handleManualSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg border border-emerald-500/50 transition active:translate-y-0.5 flex items-center gap-2"
          >
            <span>💾</span>
            <span>Salvează Modificările</span>
          </button>
        </div>
      </div>

    </div>
  );
};
