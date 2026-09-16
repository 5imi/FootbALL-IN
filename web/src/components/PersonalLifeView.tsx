'use client';

import React, { useState } from 'react';
import { Player, PlayerLifeEvent } from '../engine/types';
import { triggerLifeEventsForTeam, LIFE_EVENT_TEMPLATES } from '../engine/lifeEvents';
import { ClubFinances } from '../engine/financeEngine';

interface PersonalLifeViewProps {
  players: Player[];
  finances: ClubFinances;
  onUpdateSquad: (updatedPlayers: Player[]) => void;
  onFinancesUpdate: (newFinances: ClubFinances) => void;
  onOpenPlayerCard: (player: Player) => void;
}

interface PersonalProfile {
  status: 'Necăsătorit' | 'Într-o relație' | 'Logodit' | 'Căsătorit' | 'Divorțat';
  children: number;
  lifestyle: 'Liniștit / Familist' | 'Moderat' | 'Petrecăreț / VIP' | 'Pasionat Gaming / Stream';
  stressLevel: number; // 0 - 100%
  happiness: number;   // 0 - 100%
}

// Generare profil personal stabil bazat pe id-ul jucătorului
function getPlayerPersonalProfile(player: Player): PersonalProfile {
  const playerIdStr = String(player?.id ?? player?.name ?? 'player-1');
  const playerAge = Number(player?.age) || 22;
  const seed = playerIdStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + playerAge;
  const statuses: PersonalProfile['status'][] = ['Necăsătorit', 'Într-o relație', 'Căsătorit', 'Căsătorit', 'Divorțat'];
  const lifestyles: PersonalProfile['lifestyle'][] = [
    'Liniștit / Familist',
    'Moderat',
    'Petrecăreț / VIP',
    'Pasionat Gaming / Stream'
  ];

  const statusIdx = player.age < 21 ? 0 : seed % statuses.length;
  const status = statuses[statusIdx];
  const children = (status === 'Căsătorit' || status === 'Divorțat') ? (seed % 3) + 1 : (player.age > 26 && seed % 2 === 0 ? 1 : 0);
  const lifestyle = lifestyles[seed % lifestyles.length];
  const playerMorale = typeof player?.morale === 'number' ? player.morale : 75;
  const stressLevel = Math.min(95, Math.max(15, 100 - playerMorale + (lifestyle === 'Petrecăreț / VIP' ? 20 : 0)));
  const happiness = Math.min(100, Math.max(20, playerMorale));

  return { status, children, lifestyle, stressLevel, happiness };
}

export const PersonalLifeView: React.FC<PersonalLifeViewProps> = ({
  players = [],
  finances,
  onUpdateSquad,
  onFinancesUpdate,
  onOpenPlayerCard,
}) => {
  const safePlayers = Array.isArray(players) ? players.filter(Boolean) : [];
  const [filter, setFilter] = useState<'ALL' | 'PARTY' | 'FAMILY' | 'STRESSED'>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Declanșează eveniment aleatoriu din viața personală
  const handleTriggerLifeEvents = () => {
    const newEvents = triggerLifeEventsForTeam(players, 24);
    if (newEvents.length === 0) {
      // Forțăm măcar un eveniment pentru a vedea efectul
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const template = LIFE_EVENT_TEMPLATES[Math.floor(Math.random() * LIFE_EVENT_TEMPLATES.length)];
      const manualEvent: PlayerLifeEvent = {
        id: `ev-${Date.now()}`,
        date: `Astăzi`,
        seasonDay: 24,
        type: template.type,
        title: template.title,
        description: template.descriptionTemplate(randomPlayer.name),
        moraleChange: template.moraleChange,
        fitnessChange: template.fitnessChange || 0,
        aggressionChange: template.aggressionChange || 0,
      };

      const updatedSquad = players.map(p => {
        if (p.id === randomPlayer.id) {
          const events = p.lifeEvents ? [manualEvent, ...p.lifeEvents] : [manualEvent];
          return {
            ...p,
            morale: Math.min(100, Math.max(10, p.morale + manualEvent.moraleChange)),
            condition: Math.min(100, Math.max(20, p.condition + (manualEvent.fitnessChange || 0))),
            aggression: Math.min(100, Math.max(5, p.aggression + (manualEvent.aggressionChange || 0))),
            lifeEvents: events
          };
        }
        return p;
      });

      onUpdateSquad(updatedSquad);
      showNotification(`📰 Can-Can Nou: ${randomPlayer.name} a fost implicat într-un eveniment: „${manualEvent.title}”!`);
      return;
    }

    // Actualizăm lotul cu evenimentele generate
    let updatedSquad = [...players];
    newEvents.forEach(({ player, event }) => {
      updatedSquad = updatedSquad.map(p => {
        if (p.id === player.id) {
          const events = p.lifeEvents ? [event, ...p.lifeEvents] : [event];
          return {
            ...p,
            morale: Math.min(100, Math.max(10, p.morale + event.moraleChange)),
            condition: Math.min(100, Math.max(20, p.condition + (event.fitnessChange || 0))),
            aggression: Math.min(100, Math.max(5, p.aggression + (event.aggressionChange || 0))),
            lifeEvents: events
          };
        }
        return p;
      });
    });

    onUpdateSquad(updatedSquad);
    showNotification(`⚡ ${newEvents.length} evenimente de viață personală au apărut în lot!`);
  };

  // Acțiune Manager: Acordă 2 zile libere de familie
  const handleGiveFamilyLeave = (player: Player) => {
    const updated = players.map(p => {
      if (p.id === player.id) {
        return {
          ...p,
          morale: Math.min(100, p.morale + 15),
          condition: Math.max(30, p.condition - 5), // pierde puțin din ritmul fizic
        };
      }
      return p;
    });
    onUpdateSquad(updated);
    showNotification(`🌴 I-ai acordat 2 zile libere lui ${player.name}. Moralul a crescut la ${Math.min(100, player.morale + 15)}%!`);
  };

  // Acțiune Manager: Consiliere Psihologică (Costă €2,500)
  const handleCounseling = (player: Player) => {
    if (finances.balance < 2500) {
      showNotification(`❌ Fonduri insuficiente! Clubul are nevoie de €2,500.`);
      return;
    }
    const updatedFinances = {
      ...finances,
      balance: finances.balance - 2500,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'EXPENSE' as const,
          category: 'COURSE' as const,
          amount: 2500,
          description: `Consiliere psihologică pentru ${player.name}`,
          date: new Date().toLocaleDateString()
        },
        ...finances.transactions
      ]
    };
    onFinancesUpdate(updatedFinances);

    const updated = players.map(p => {
      if (p.id === player.id) {
        return {
          ...p,
          morale: Math.min(100, p.morale + 20),
          aggression: Math.max(10, p.aggression - 8),
        };
      }
      return p;
    });
    onUpdateSquad(updated);
    showNotification(`🧠 ${player.name} a finalizat ședința cu psihologul clubului (+20 Moral, -8 Agresivitate).`);
  };

  // Acțiune Manager: Amendă pentru viață de noapte
  const handleFinePlayer = (player: Player) => {
    const updatedFinances = {
      ...finances,
      balance: finances.balance + 5000,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'INCOME' as const,
          category: 'BONUS' as const,
          amount: 5000,
          description: `Amendă disciplinară încasată de la ${player.name}`,
          date: new Date().toLocaleDateString()
        },
        ...finances.transactions
      ]
    };
    onFinancesUpdate(updatedFinances);

    const updated = players.map(p => {
      if (p.id === player.id) {
        return {
          ...p,
          morale: Math.max(10, p.morale - 15), // Se supără
          aggression: Math.min(100, p.aggression + 12),
        };
      }
      return p;
    });
    onUpdateSquad(updated);
    showNotification(`⚠️ L-ai amendat pe ${player.name} cu €5,000 pentru nerespectarea disciplinei sportive.`);
  };

  const filteredPlayers = safePlayers.filter(p => {
    if (!p) return false;
    const profile = getPlayerPersonalProfile(p);
    if (filter === 'PARTY') return profile.lifestyle === 'Petrecăreț / VIP';
    if (filter === 'FAMILY') return profile.children > 0 || profile.status === 'Căsătorit';
    if (filter === 'STRESSED') return profile.stressLevel > 60 || (p.morale || 70) < 60;
    return true;
  });

  const averageMorale = safePlayers.length > 0 
    ? Math.round(safePlayers.reduce((acc, p) => acc + (p.morale || 75), 0) / safePlayers.length) 
    : 75;
  const nightLifeCount = safePlayers.filter(p => p && getPlayerPersonalProfile(p).lifestyle === 'Petrecăreț / VIP').length;

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Banner Notificare Acțiune ─── */}
      {notification && (
        <div className="rounded-xl border border-blue-500/40 bg-blue-950/80 p-4 text-blue-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <span className="text-sm font-semibold">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs text-blue-400 hover:text-white">Închide</button>
        </div>
      )}

      {/* ─── Antet Modul Viață Personală & Culise ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-5">
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-rose-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-indigo-800 flex items-center justify-center text-2xl shadow-lg border border-rose-500/30">
              ❤️
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-400 tracking-wider uppercase">
                Modulul Extins &bull; Vestiar &amp; Viață Privată
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>Viața Personală a Jucătorilor</span>
                <span className="rounded bg-rose-900/50 text-rose-300 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-rose-700/40">
                  Impact Real Meci
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Starea civilă, nopțile pierdute, familia și scandalurile tabloide afectează direct Moralul, Condiția Fizică și Agresivitatea în meciuri.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerLifeEvents}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 hover:scale-[1.02] active:scale-[0.98] transition border border-rose-400/30"
              title="Simulează o rundă de evenimente mondene sau private"
            >
              <span>🎲</span>
              <span>Simulează Eveniment Can-Can</span>
            </button>
          </div>
        </div>

        {/* Metrici Globale Vestiar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
            <div className="text-[11px] font-semibold text-zinc-400">Moral Mediu Lot</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">{averageMorale}%</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Determină randamentul în teren</div>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
            <div className="text-[11px] font-semibold text-zinc-400">Risc Viață Nocturnă</div>
            <div className="text-xl font-black text-rose-400 font-mono mt-1">{nightLifeCount} jucători</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Predispuși la scandaluri mondene</div>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
            <div className="text-[11px] font-semibold text-zinc-400">Buget Club Disponibil</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-1">€{finances.balance.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Pentru consiliere sau amenzi</div>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
            <div className="text-[11px] font-semibold text-zinc-400">Armonie în Vestiar</div>
            <div className="text-xl font-black text-blue-400 font-mono mt-1">
              {averageMorale > 80 ? 'Excelentă 🏆' : averageMorale > 60 ? 'Stabilă ⚖️' : 'Tensiuni ⚠️'}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Influențează coeziunea tacticilor</div>
          </div>
        </div>
      </div>

      {/* ─── Filtre Listă Jucători ─── */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Toți Jucătorii ({players.length})
          </button>
          <button
            onClick={() => setFilter('PARTY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'PARTY'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            🍸 Club &amp; Nopți Albe
          </button>
          <button
            onClick={() => setFilter('FAMILY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'FAMILY'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            👨‍👩‍👧 Familiști &amp; Căsătoriți
          </button>
          <button
            onClick={() => setFilter('STRESSED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'STRESSED'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            ⚠️ Stresați / Moral Scăzut
          </button>
        </div>
      </div>

      {/* ─── Lista Cartonașelor Jucătorilor ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => {
          const profile = getPlayerPersonalProfile(player);
          const latestEvent = player.lifeEvents && player.lifeEvents.length > 0 ? player.lifeEvents[0] : null;

          return (
            <div
              key={player.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-xl hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
            >
              {/* Info Jucător */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => onOpenPlayerCard(player)}
                      className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center font-mono font-bold text-white shadow cursor-pointer hover:scale-105 transition"
                      title="Vezi fișa completă SoccerProject"
                    >
                      {player.number}
                    </div>
                    <div>
                      <h4 
                        onClick={() => onOpenPlayerCard(player)}
                        className="font-bold text-white text-sm hover:text-blue-400 cursor-pointer transition flex items-center gap-1.5"
                      >
                        <span>{player.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {player.position}
                        </span>
                      </h4>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span>🎂 {player.age} ani</span>
                        <span>&bull;</span>
                        <span className="text-zinc-300 font-semibold">{profile.status}</span>
                        {profile.children > 0 && <span>({profile.children} {profile.children === 1 ? 'copil' : 'copii'})</span>}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    profile.lifestyle === 'Petrecăreț / VIP'
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                      : profile.lifestyle === 'Liniștit / Familist'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                      : 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                  }`}>
                    {profile.lifestyle}
                  </span>
                </div>

                {/* Indicatori Psihologici & Fitness */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="rounded-lg bg-zinc-950/70 p-2 border border-zinc-850">
                    <div className="text-[10px] text-zinc-400 font-semibold">Moral</div>
                    <div className={`text-sm font-bold font-mono mt-0.5 ${player.morale >= 80 ? 'text-emerald-400' : player.morale >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {player.morale}%
                    </div>
                  </div>

                  <div className="rounded-lg bg-zinc-950/70 p-2 border border-zinc-850">
                    <div className="text-[10px] text-zinc-400 font-semibold">Condiție</div>
                    <div className="text-sm font-bold font-mono text-blue-400 mt-0.5">
                      {player.condition}%
                    </div>
                  </div>

                  <div className="rounded-lg bg-zinc-950/70 p-2 border border-zinc-850">
                    <div className="text-[10px] text-zinc-400 font-semibold">Agresivitate</div>
                    <div className={`text-sm font-bold font-mono mt-0.5 ${player.aggression > 70 ? 'text-rose-400 font-black' : 'text-zinc-300'}`}>
                      {player.aggression}%
                    </div>
                  </div>
                </div>

                {/* Ultimul Eveniment de Viață Personală */}
                <div className="mt-3.5 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>📰 Can-Can &amp; Culise</span>
                    {latestEvent && <span className="text-[9px] text-zinc-500">{latestEvent.date}</span>}
                  </div>
                  {latestEvent ? (
                    <div className="mt-1.5 text-xs text-zinc-300">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <span>{latestEvent.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{latestEvent.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] font-mono font-semibold">
                        <span className={latestEvent.moraleChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          Moral: {latestEvent.moraleChange >= 0 ? `+${latestEvent.moraleChange}` : latestEvent.moraleChange}%
                        </span>
                        {latestEvent.fitnessChange ? (
                          <span className={latestEvent.fitnessChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            Condiție: {latestEvent.fitnessChange}%
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-500 mt-1 italic">
                      Nu sunt incidente raportate. Jucătorul are o viață liniștită.
                    </p>
                  )}
                </div>
              </div>

              {/* Acțiuni de Management (Intervenții Manager) */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                <button
                  onClick={() => handleGiveFamilyLeave(player)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition text-center"
                  title="Acordă 2 zile de concediu de familie (+15 Moral, -5 Condiție)"
                >
                  🌴 Zi Liberă
                </button>

                <button
                  onClick={() => handleCounseling(player)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-blue-300 text-[11px] font-semibold transition text-center"
                  title="Trimite jucătorul la psihologul clubului (€2,500)"
                >
                  🧠 Psiholog (€2.5k)
                </button>

                <button
                  onClick={() => handleFinePlayer(player)}
                  className="py-1.5 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-[11px] font-semibold transition text-center"
                  title="Amendă disciplinară (+€5,000 la club, -15 Moral)"
                >
                  ⚠️ Amendă
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
