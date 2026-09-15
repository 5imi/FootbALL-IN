import React, { useState } from 'react';
import { Player, SkillName, PositionType } from '../engine/types';
import { TrainerStaff, PhysioStaff, TrainingProgressReport, trainWholeSquad } from '../engine/trainingEngine';
import { recoverSquadFitness } from '../engine/recoveryEngine';

interface TrainingManagementViewProps {
  players: Player[];
  onOpenPlayerCard: (player: Player) => void;
}

const FIELD_SKILL_OPTIONS: { key: SkillName; label: string }[] = [
  { key: 'stamina', label: 'Rezistență' },
  { key: 'speed', label: 'Viteză' },
  { key: 'technique', label: 'Tehnică' },
  { key: 'passing', label: 'Pase' },
  { key: 'shooting', label: 'Șuturi' },
  { key: 'clearance', label: 'Respingeri' },
  { key: 'strength', label: 'Forță' },
  { key: 'heading', label: 'Cap' },
  { key: 'tackling', label: 'Deposedări' },
  { key: 'vision', label: 'Viziune' },
];

const GK_SKILL_OPTIONS: { key: SkillName; label: string }[] = [
  { key: 'stamina', label: 'Rezistență' },
  { key: 'speed', label: 'Viteză' },
  { key: 'technique', label: 'Tehnică' },
  { key: 'clearance', label: 'Degajări' },
  { key: 'strength', label: 'Detentă' },
  { key: 'heading', label: 'Curaj' },
  { key: 'tackling', label: 'Joc de picior' },
  { key: 'vision', label: 'Reflex' },
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

  const physio: PhysioStaff = {
    id: 'ph-1',
    name: 'Dr. Pompiliu Popescu',
    quality: 90,
    salaryWeekly: 9000
  };

  // State: id-urile jucătorilor expandati (accordion stil SP)
  const [expandedPlayerIds, setExpandedPlayerIds] = useState<Record<string, boolean>>({});

  // Selecții atribute din localStorage
  const [playerTargets, setPlayerTargets] = useState<Record<string, SkillName | 'NONE'>>(() => {
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

  const toggleExpand = (id: string) => {
    setExpandedPlayerIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateTarget = (playerId: string, skill: SkillName | 'NONE' | '') => {
    const updated = { ...playerTargets };
    if (!skill) {
      delete updated[playerId];
    } else {
      updated[playerId] = skill;
    }
    setPlayerTargets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('footballin_training_targets', JSON.stringify(updated));
    }
  };

  const handleTrainAutomatic = () => {
    // În modul automat, antrenorul selectează cel mai mic atribut neplafonat
    const reports = trainWholeSquad(players, trainer, {});
    setNotification(`✔️ Antrenorul ${trainer.name} a generat sesiunea automată pentru ${reports.length} jucători!`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleManualSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('footballin_training_targets', JSON.stringify(playerTargets));
    }
    setNotification('💾 Planul de antrenament a fost salvat cu succes!');
    setTimeout(() => setNotification(null), 4000);
  };

  // Separare pe categorii exacte SP
  const gks = players.filter(p => p.position === 'GK');
  const defs = players.filter(p => ['LB', 'CB', 'RB'].includes(p.position));
  const mids = players.filter(p => ['LM', 'CM', 'RM'].includes(p.position));
  const atts = players.filter(p => ['LF', 'CF', 'RF'].includes(p.position));

  const renderPlayerRow = (p: Player) => {
    const isExpanded = !!expandedPlayerIds[p.id];
    const isInjured = (p.seasonStats?.injuries ?? 0) > 0 && p.condition < 40;
    const isGk = p.position === 'GK';
    const skillList = isGk ? GK_SKILL_OPTIONS : FIELD_SKILL_OPTIONS;
    const currentTarget = playerTargets[p.id];

    return (
      <div key={p.id} className="border border-slate-700/60 bg-slate-900/90 rounded-md overflow-hidden text-xs">
        {/* Bara compactă a jucătorului */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 hover:bg-slate-850 transition">
          {/* Poziție și Nume */}
          <div 
            onClick={() => toggleExpand(p.id)}
            className="flex items-center gap-2 cursor-pointer flex-1 select-none"
          >
            <span className={`font-bold text-[11px] px-2 py-0.5 rounded ${
              isGk ? 'bg-amber-600 text-white' :
              p.position.startsWith('C') ? 'bg-amber-500/80 text-slate-950 font-black' :
              'bg-amber-400 text-slate-950 font-black'
            }`}>
              {p.position}
            </span>
            <span className="text-blue-400 hover:text-blue-300 font-semibold">
              {p.number}. {p.name}
            </span>
            {p.nickname && <span className="text-[10px] text-slate-400 italic">„{p.nickname}”</span>}
            <span className="text-[10px] text-slate-500 ml-1">
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>

          {/* Stare medicală / Validare și Selector Atribut */}
          <div className="flex items-center gap-2">
            {isInjured ? (
              <span className="text-rose-500 font-bold" title="Accidentat">❌ 🚑</span>
            ) : (
              <span className="text-emerald-400 font-bold" title="Apt de antrenament">✔️</span>
            )}

            <select
              value={currentTarget ?? ''}
              onChange={(e) => handleUpdateTarget(p.id, e.target.value as SkillName | 'NONE')}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              <option value="">Auto (Cel mai mic)</option>
              <option value="NONE">Nimic</option>
              {skillList.map(opt => {
                const s = p.skills ? p.skills[opt.key] : null;
                const isCapped = s?.isTrainedMax;
                return (
                  <option 
                    key={opt.key} 
                    value={opt.key}
                    className={isCapped ? 'text-rose-500 font-bold bg-slate-950' : 'text-slate-200 bg-slate-950'}
                  >
                    {opt.label} {isCapped ? '(ROȘU 🔒)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Mini-Fișa Detaliată SP (când este apăsat rândul) */}
        {isExpanded && (
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-start gap-4">
            {/* Lupa pentru fișa completă */}
            <button
              onClick={() => onOpenPlayerCard(p)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition flex flex-col items-center gap-1 text-[10px] text-slate-300 mt-1"
              title="Deschide fișa completă a jucătorului"
            >
              <span className="text-base">🔍</span>
              <span>Fișă SP</span>
            </button>

            {/* Grilă 4 Coloane Identică cu SoccerProject */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 text-[11px]">
              
              {/* Coloana 1: Date generale */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Aniversare:</span>
                  <span className="font-semibold text-slate-200">{p.birthDate} [{p.age}]</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Echipă:</span>
                  <span className="font-bold text-blue-400">Lot {p.squad}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Formă:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{p.recentPerformances.join('-')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cea mai bună:</span>
                  <span className="font-mono text-amber-400 font-bold">{p.bestPerformance}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Calitate Globală:</span>
                  <span className="font-mono font-bold text-white">{p.overallQuality}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Agresivitate:</span>
                  <span className="font-mono text-rose-400 font-bold">{p.aggression}%</span>
                </div>
              </div>

              {/* Coloana 2: Stare fizică & Atribute Bază */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Experiență:</span>
                  <span className="font-mono text-amber-400 font-semibold">{p.experience}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Moral:</span>
                  <span className={`font-mono font-semibold ${p.morale > 70 ? 'text-rose-400' : 'text-slate-400'}`}>{p.morale}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Condiție:</span>
                  <span className={`font-mono font-bold ${p.condition < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.condition}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className={p.skills.stamina.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Rezistență:</span>
                  <span className={`font-mono ${p.skills.stamina.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.stamina.value}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className={p.skills.speed.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Viteză:</span>
                  <span className={`font-mono ${p.skills.speed.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.speed.value}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className={p.skills.technique.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Tehnică:</span>
                  <span className={`font-mono ${p.skills.technique.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.technique.value}%</span>
                </div>
              </div>

              {/* Coloana 3 & 4: Atribute specifice postului */}
              {isGk ? (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.heading.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Curaj:</span>
                      <span className={`font-mono ${p.skills.heading.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.heading.value}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Flexibilitate:</span>
                      <span className="font-mono text-slate-200">{Math.round(p.skills.technique.value * 0.9)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.strength.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Detentă:</span>
                      <span className={`font-mono ${p.skills.strength.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.strength.value}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.clearance.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Degajări:</span>
                      <span className={`font-mono ${p.skills.clearance.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.clearance.value}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.tackling.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Joc de picior:</span>
                      <span className={`font-mono ${p.skills.tackling.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.tackling.value}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.vision.isTrainedMax ? 'text-rose-400 font-bold' : 'font-bold text-white'}>Reflex:</span>
                      <span className={`font-mono font-bold ${p.skills.vision.isTrainedMax ? 'text-rose-400' : 'text-white'}`}>{p.skills.vision.value}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.passing.isTrainedMax ? 'text-rose-400 font-bold' : p.skills.passing.isPrimary ? 'font-bold text-white' : ''}>Pase:</span>
                      <span className={`font-mono ${p.skills.passing.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.passing.value}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.shooting.isTrainedMax ? 'text-rose-400 font-bold' : p.skills.shooting.isPrimary ? 'font-bold text-white' : ''}>Șuturi:</span>
                      <span className={`font-mono ${p.skills.shooting.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.shooting.value}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.clearance.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Respingeri:</span>
                      <span className={`font-mono ${p.skills.clearance.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.clearance.value}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.strength.isTrainedMax ? 'text-rose-400 font-bold' : ''}>Forță:</span>
                      <span className={`font-mono ${p.skills.strength.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.strength.value}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.heading.isTrainedMax ? 'text-rose-400 font-bold' : p.skills.heading.isPrimary ? 'font-bold text-white' : ''}>Cap:</span>
                      <span className={`font-mono ${p.skills.heading.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.heading.value}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className={p.skills.tackling.isTrainedMax ? 'text-rose-400 font-bold' : p.skills.tackling.isPrimary ? 'font-bold text-white' : ''}>Deposedări:</span>
                      <span className={`font-mono ${p.skills.tackling.isTrainedMax ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{p.skills.tackling.value}%</span>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-200">
      
      {/* Header Pagina SP */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
          Antrenament condus de <span className="text-blue-400">{trainer.name}</span> (Calitate: {trainer.quality}%)
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Pe această pagină poți antrena jucătorii, ceea ce este foarte important pentru echipa ta. Îi poți antrena manual alegând atributul sau poți lăsa pe antrenor să o facă. Un jucător se antrenează de 5 ori pe zi și va crește la calitatea selectată în acel moment.
        </p>

        {/* Modul Automatic */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-white block">Automatic</span>
            <span className="text-xs text-slate-400">Poți să-l pui pe {trainer.name} să genereze o sesiune de antrenament automată (țintind cel mai mic atribut).</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTrainAutomatic}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs transition shadow"
            >
              Automatic
            </button>
            <button
              onClick={handleManualSave}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition shadow flex items-center gap-1"
            >
              <span>💾</span> Salvează
            </button>
          </div>
        </div>
      </div>

      {/* Alertă Notificare */}
      {notification && (
        <div className="bg-emerald-900/90 border border-emerald-500/50 text-emerald-200 text-xs px-4 py-2 rounded shadow flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Secțiuni SP: Portari, Fundași, Mijlocași, Atacanți */}
      <div className="space-y-5">
        {/* Portari */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portari</h4>
          <div className="space-y-1.5">
            {gks.map(renderPlayerRow)}
          </div>
        </div>

        {/* Fundași */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fundași</h4>
          <div className="space-y-1.5">
            {defs.map(renderPlayerRow)}
          </div>
        </div>

        {/* Mijlocași */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mijlocași</h4>
          <div className="space-y-1.5">
            {mids.map(renderPlayerRow)}
          </div>
        </div>

        {/* Atacanți */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atacanți</h4>
          <div className="space-y-1.5">
            {atts.map(renderPlayerRow)}
          </div>
        </div>
      </div>

    </div>
  );
};
