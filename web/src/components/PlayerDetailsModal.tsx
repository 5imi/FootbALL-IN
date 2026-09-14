import React from 'react';
import { Player, SkillName } from '../engine/types';

interface PlayerDetailsModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  isForeignClub?: boolean; // Dacă e jucător de la alt club -> Fog of War (bare albastre, fără roșu de max cap)
}

const SKILL_LABELS: Record<SkillName, string> = {
  stamina: 'Rezistență',
  speed: 'Viteză',
  technique: 'Tehnică',
  passing: 'Pase',
  shooting: 'Șuturi',
  clearance: 'Respingeri',
  strength: 'Forță',
  heading: 'Cap',
  tackling: 'Deposedări',
  vision: 'Viziune / Reflexe'
};

export const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({
  player,
  isOpen,
  onClose,
  isForeignClub = false
}) => {
  if (!isOpen || !player) return null;

  const skills = player.skills;
  const skillOrder: SkillName[] = [
    'stamina', 'speed', 'technique', 'passing', 'shooting', 
    'clearance', 'strength', 'heading', 'tackling', 'vision'
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* Antet Modal */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 border-b border-slate-700 flex justify-between items-center">
          <div>
            <div className="text-xs text-blue-300 font-semibold tracking-wider uppercase">Detalii despre jucătorul</div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{player.number}. {player.name}</span>
              {player.nickname && (
                <span className="text-xs text-amber-400 font-normal italic">„{player.nickname}”</span>
              )}
              <span className="text-sm">🇷🇴</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[85vh] overflow-y-auto">
          
          {/* Tabel Date Biometrice */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <div className="flex justify-between border-b border-slate-700/40 pb-1">
              <span className="text-slate-400">Poziție:</span>
              <span className="font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[11px]">{player.position}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/40 pb-1">
              <span className="text-slate-400">Picior:</span>
              <span className="font-semibold">{player.preferredFoot}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/40 pb-1">
              <span className="text-slate-400">Greutate:</span>
              <span className="font-semibold">{player.weight} Kg</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/40 pb-1">
              <span className="text-slate-400">Aniversare:</span>
              <span className="font-semibold">{player.birthDate}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/40 pb-1">
              <span className="text-slate-400">Vârstă:</span>
              <span className="font-semibold text-amber-300">{player.age} ani</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/40 pb-1">
              <span className="text-slate-400">Lot:</span>
              <span className="font-bold text-blue-400">Echipa {player.squad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Înălțime:</span>
              <span className="font-semibold">{player.height} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Formă recentă:</span>
              <span className="font-mono text-emerald-400">{player.recentPerformances.join('-')}</span>
            </div>
          </div>

          {/* Statistici Sezon & Total */}
          <div className="bg-slate-800/40 rounded-lg border border-slate-700/40 overflow-hidden text-xs">
            <table className="w-full text-center">
              <thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-1 px-2 text-left">Meciuri</th>
                  <th>#</th>
                  <th>⚽</th>
                  <th>🟨</th>
                  <th>🟥</th>
                  <th>🚑</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 font-mono">
                <tr>
                  <td className="py-1 px-2 text-left text-slate-300">Sezonul curent</td>
                  <td>{player.seasonStats.appearances}</td>
                  <td>{player.seasonStats.goals}</td>
                  <td>{player.seasonStats.yellowCards}</td>
                  <td>{player.seasonStats.redCards}</td>
                  <td>{player.seasonStats.injuries}</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-left text-slate-400">Total carieră</td>
                  <td>{player.careerStats.appearances}</td>
                  <td>{player.careerStats.goals}</td>
                  <td>{player.careerStats.yellowCards}</td>
                  <td>{player.careerStats.redCards}</td>
                  <td>{player.careerStats.injuries}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Stare Dinamică (Condiție, Calitate Globală, Moral, Agresivitate, Experiență) */}
          <div className="space-y-1.5 text-xs bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            {/* Condiție */}
            <div className="flex items-center justify-between">
              <span className="w-28 text-slate-300">Condiție</span>
              <span className="w-12 font-mono font-bold text-right">{player.condition}%</span>
              <div className="flex-1 ml-3 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full ${player.condition < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${player.condition}%` }}
                />
              </div>
            </div>

            {/* Calitate Globală */}
            <div className="flex items-center justify-between">
              <span className="w-28 text-slate-300">Calitate Globală</span>
              <span className="w-12 font-mono font-bold text-right text-blue-400">{player.overallQuality}%</span>
              <div className="flex-1 ml-3 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-blue-500" style={{ width: `${player.overallQuality}%` }} />
              </div>
            </div>

            {/* Moral */}
            <div className="flex items-center justify-between">
              <span className="w-28 text-slate-300">Moral</span>
              <span className="w-12 font-mono font-bold text-right">{player.morale}%</span>
              <div className="flex-1 ml-3 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full ${player.morale === 100 ? 'bg-rose-600' : player.morale < 30 ? 'bg-slate-600' : 'bg-rose-500'}`} 
                  style={{ width: `${player.morale}%` }}
                />
              </div>
            </div>

            {/* Agresivitate (Bară roșie fixată) */}
            <div className="flex items-center justify-between">
              <span className="w-28 text-slate-300">Agresivitate</span>
              <span className="w-12 font-mono font-bold text-right text-rose-400">{player.aggression}%</span>
              <div className="flex-1 ml-3 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-rose-600" style={{ width: `${player.aggression}%` }} />
              </div>
            </div>

            {/* Experiență */}
            <div className="flex items-center justify-between">
              <span className="w-28 text-slate-300">Experiență</span>
              <span className="w-12 font-mono font-bold text-right text-amber-400">{player.experience}%</span>
              <div className="flex-1 ml-3 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full ${player.experience === 100 ? 'bg-rose-600' : 'bg-amber-500'}`} 
                  style={{ width: `${player.experience}%` }}
                />
              </div>
            </div>
          </div>

          {/* Barele de Atribute Antrenabile (SoccerProject Style) */}
          <div className="space-y-1 text-xs bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 flex justify-between">
              <span>ATRIBUTE TEHNICE & FIZICE</span>
              <span className="text-[10px] text-slate-500">
                {isForeignClub ? 'Club Străin (Fog of War)' : 'Roșu = Plafonat'}
              </span>
            </div>

            {skillOrder.map((key) => {
              const s = skills ? skills[key] : null;
              if (!s) return null;

              // Dacă e club străin -> NU arătăm roșu de plafonat, totul e albastru!
              const isRed = !isForeignClub && s.isTrainedMax;
              const isPrimary = s.isPrimary;

              return (
                <div key={key} className="flex items-center justify-between py-0.5">
                  <span className={`w-28 ${isPrimary ? 'font-bold text-white' : 'text-slate-400'}`}>
                    {SKILL_LABELS[key]}
                  </span>
                  <span className={`w-10 font-mono text-right text-xs ${isRed ? 'text-rose-400 font-bold' : isPrimary ? 'text-white font-semibold' : 'text-slate-300'}`}>
                    {s.value}%
                  </span>
                  <div className="flex-1 ml-3 bg-slate-950 h-3 rounded overflow-hidden border border-slate-700/80">
                    <div 
                      className={`h-full transition-all duration-300 ${isRed ? 'bg-rose-600' : 'bg-blue-500'}`}
                      style={{ width: `${s.value}%` }}
                      title={`Valoare: ${s.value}% ${!isForeignClub ? `(Plafon: ${s.maxCap}%)` : ''}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evenimente Personale de Viață (Life Events) */}
          {player.lifeEvents && player.lifeEvents.length > 0 && (
            <div className="bg-slate-850 p-3 rounded-lg border border-amber-500/30 text-xs space-y-2">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span>📰 Evenimente Recente din Viața Jucătorului</span>
              </div>
              {player.lifeEvents.slice(0, 2).map((ev) => (
                <div key={ev.id} className="bg-slate-900/80 p-2 rounded border border-slate-700 text-slate-300">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{ev.title}</span>
                    <span className={`text-[10px] ${ev.moraleChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      Moral {ev.moraleChange > 0 ? `+${ev.moraleChange}` : ev.moraleChange}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ev.description}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer cu butoane */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 flex justify-between items-center text-xs">
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition">
              Istoric
            </button>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition">
              Poreclă
            </button>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 font-semibold text-white rounded transition"
          >
            Închide
          </button>
        </div>

      </div>
    </div>
  );
};
