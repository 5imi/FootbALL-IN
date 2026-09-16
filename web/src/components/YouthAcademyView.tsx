'use client';

import React, { useState } from 'react';
import { 
  YouthPlayer, 
  YouthAcademyState, 
  loadYouthAcademyState, 
  saveYouthAcademyState, 
  calculateGBI, 
  convertJuniorToSeniorPlayer,
  JuniorPersonality
} from '../engine/academyEngine';
import { ClubFinances } from '../engine/financeEngine';
import { Player, PositionType } from '../engine/types';

interface YouthAcademyViewProps {
  finances: ClubFinances;
  userSquad: Player[];
  onSquadUpdated: (newSquad: Player[]) => void;
  onFinancesUpdated: (newFinances: ClubFinances) => void;
  isGuest?: boolean;
  onRequireAuth?: (message: string) => void;
}

export const YouthAcademyView: React.FC<YouthAcademyViewProps> = ({
  finances,
  userSquad,
  onSquadUpdated,
  onFinancesUpdated,
  isGuest = false,
  onRequireAuth
}) => {
  const [academyState, setAcademyState] = useState<YouthAcademyState>(() => loadYouthAcademyState());
  const [selectedJuniorId, setSelectedJuniorId] = useState<string | null>(() => academyState.juniors[0]?.id || null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const selectedJunior = academyState.juniors.find(j => j.id === selectedJuniorId) || academyState.juniors[0];

  // Ajustare focus Triunghiul Echilibrului cu menținerea sumei de 100%
  const handleFocusChange = (juniorId: string, axis: 'school' | 'life' | 'training', rawValue: number) => {
    const val = Math.max(5, Math.min(85, rawValue));
    
    setAcademyState(prev => {
      const updated = prev.juniors.map(j => {
        if (j.id !== juniorId) return j;

        let s = j.schoolFocus;
        let l = j.personalLifeFocus;
        let t = j.trainingFocus;

        if (axis === 'school') {
          s = val;
          const remaining = 100 - s;
          const ratio = (l + t) === 0 ? 0.5 : l / (l + t);
          l = Math.max(5, Math.round(remaining * ratio));
          t = Math.max(5, 100 - s - l);
        } else if (axis === 'life') {
          l = val;
          const remaining = 100 - l;
          const ratio = (s + t) === 0 ? 0.5 : s / (s + t);
          s = Math.max(5, Math.round(remaining * ratio));
          t = Math.max(5, 100 - l - s);
        } else {
          t = val;
          const remaining = 100 - t;
          const ratio = (s + l) === 0 ? 0.5 : s / (s + l);
          s = Math.max(5, Math.round(remaining * ratio));
          l = Math.max(5, 100 - t - s);
        }

        const gbiResult = calculateGBI(s, l, t);

        return {
          ...j,
          schoolFocus: s,
          personalLifeFocus: l,
          trainingFocus: t,
          ...gbiResult
        };
      });

      const newState = { ...prev, juniors: updated };
      saveYouthAcademyState(newState);
      return newState;
    });
  };

  // Promovarea juniorului în prima echipă (Seniori)
  const handlePromoteToSenior = (junior: YouthPlayer) => {
    if (isGuest) {
      onRequireAuth?.('Pentru a semna primul contract profesionist cu un junior, te rugăm să îți înregistrezi contul gratuit!');
      return;
    }

    const seniorPlayer = convertJuniorToSeniorPlayer(junior, userSquad.length);
    const updatedSquad = [...userSquad, seniorPlayer];
    onSquadUpdated(updatedSquad);

    // Elimină din lista de juniori a academiei
    setAcademyState(prev => {
      const remaining = prev.juniors.filter(j => j.id !== junior.id);
      const newState = { ...prev, juniors: remaining };
      saveYouthAcademyState(newState);
      return newState;
    });

    if (selectedJuniorId === junior.id) {
      const nextOne = academyState.juniors.find(j => j.id !== junior.id);
      setSelectedJuniorId(nextOne?.id || null);
    }

    showNotification(
      `🎉 FELICITĂRI! ${junior.name} (${junior.position}, ${junior.age} ani) a semnat contractul de senior și a fost inclus în lotul primei echipe! Moralul lui este 100%!`,
      'success'
    );
  };

  // Acordare bursă de merit
  const handleAwardScholarship = (junior: YouthPlayer) => {
    const cost = 10000;
    if (finances.balance < cost) {
      showNotification('Fonduri insuficiente în trezoreria clubului (€10.000 necesari)!', 'error');
      return;
    }

    const updatedFinances = { ...finances, balance: finances.balance - cost };
    onFinancesUpdated(updatedFinances);

    // Setăm juniorul pe echilibrul de aur
    setAcademyState(prev => {
      const updated = prev.juniors.map(j => {
        if (j.id !== junior.id) return j;
        const gbiResult = calculateGBI(30, 30, 40);
        return {
          ...j,
          schoolFocus: 30,
          personalLifeFocus: 30,
          trainingFocus: 40,
          potential: Math.min(99, j.potential + 2),
          ...gbiResult
        };
      });
      const newState = { ...prev, juniors: updated };
      saveYouthAcademyState(newState);
      return newState;
    });

    showNotification(
      `🎓 Bursă de Excelență acordată lui ${junior.name}! Familia a primit suport financiar, iar programul de studiu a fost calibrat pe Triunghiul de Aur (GBI 97%). Potențial crescut la ${Math.min(99, junior.potential + 2)}%!`,
      'success'
    );
  };

  // Tabără intensivă de pregătire
  const handleSendToCamp = (junior: YouthPlayer) => {
    const cost = 25000;
    if (finances.balance < cost) {
      showNotification('Fonduri insuficiente în trezoreria clubului (€25.000 necesari)!', 'error');
      return;
    }

    const updatedFinances = { ...finances, balance: finances.balance - cost };
    onFinancesUpdated(updatedFinances);

    setAcademyState(prev => {
      const updated = prev.juniors.map(j => {
        if (j.id !== junior.id) return j;
        return {
          ...j,
          quality: Math.min(j.potential, j.quality + 3)
        };
      });
      const newState = { ...prev, juniors: updated };
      saveYouthAcademyState(newState);
      return newState;
    });

    showNotification(
      `⚽ ${junior.name} s-a întors din tabăra intensivă de dezvoltare tehnică La Masia! Calitate crescută cu +3% (Acum ${Math.min(junior.potential, junior.quality + 3)}%).`,
      'success'
    );
  };

  // Recrutare nou junior (Trial)
  const handleScoutTrial = () => {
    const cost = 15000;
    if (finances.balance < cost) {
      showNotification('Fonduri insuficiente pentru organizarea trialului (€15.000)!', 'error');
      return;
    }

    if (academyState.juniors.length >= 8) {
      showNotification('Academia a atins capacitatea maximă de 8 juniori! Promovează un junior la echipa mare pentru a elibera un loc.', 'warning');
      return;
    }

    const updatedFinances = { ...finances, balance: finances.balance - cost };
    onFinancesUpdated(updatedFinances);

    const positions: PositionType[] = ['GK', 'CB', 'LB', 'RB', 'CM', 'LM', 'RM', 'CF'];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    const names = [
      'David Enache', 'Iulian Voinea', 'Vlad Munteanu', 'Cosmin Dobre',
      'Bogdan Ilie', 'Alexandru Nistor', 'Tudor Gherman', 'Sergiu Barbu'
    ];
    const pickedName = names[Math.floor(Math.random() * names.length)];
    const personalities: JuniorPersonality[] = ['AMBITIOUS', 'BALANCED', 'REBEL', 'SHY', 'ACADEMIC'];
    const pickedPers = personalities[Math.floor(Math.random() * personalities.length)];

    const baseQ = 45 + Math.floor(Math.random() * 18);
    const basePot = Math.min(99, baseQ + 22 + Math.floor(Math.random() * 15));

    const newJunior: YouthPlayer = {
      id: `yp-${Date.now()}`,
      name: pickedName,
      age: 15,
      position: randomPos,
      quality: baseQ,
      potential: basePot,
      country: 'RO',
      preferredFoot: Math.random() > 0.3 ? 'R' : 'L',
      personality: pickedPers,
      schoolFocus: 30,
      personalLifeFocus: 30,
      trainingFocus: 40,
      ...calculateGBI(30, 30, 40),
      notes: `Descoperit la selecția regională de tineret. Are un control nativ al balonului remarcabil.`
    };

    setAcademyState(prev => {
      const newState = {
        ...prev,
        juniors: [...prev.juniors, newJunior]
      };
      saveYouthAcademyState(newState);
      return newState;
    });

    setSelectedJuniorId(newJunior.id);
    showNotification(
      `🌟 UN NOU TALENT DESCOPERIT! ${newJunior.name} (${newJunior.position}, 15 ani) s-a alăturat Academiei cu un potențial de ${newJunior.potential}%!`,
      'success'
    );
  };

  // Upgrade facilități academie
  const handleUpgradeFacility = (facility: 'trainingPitchesLevel' | 'dormitoryLevel' | 'studyCenterLevel') => {
    const currentLvl = academyState.facilities[facility];
    if (currentLvl >= 5) {
      showNotification('Această facilitate se află deja la nivelul maxim (Nivel 5)!', 'warning');
      return;
    }

    const cost = currentLvl * 35000;
    if (finances.balance < cost) {
      showNotification(`Fonduri insuficiente pentru upgrade (€${cost.toLocaleString()})!`, 'error');
      return;
    }

    const updatedFinances = { ...finances, balance: finances.balance - cost };
    onFinancesUpdated(updatedFinances);

    setAcademyState(prev => {
      const newState = {
        ...prev,
        facilities: {
          ...prev.facilities,
          [facility]: currentLvl + 1
        }
      };
      saveYouthAcademyState(newState);
      return newState;
    });

    showNotification(`🏗️ Facilitate modernizată cu succes la Nivelul ${currentLvl + 1}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* ─── Notificări Feedback ─── */}
      {notification && (
        <div className={`p-4 rounded-xl text-sm font-semibold border shadow-lg flex items-center justify-between ${
          notification.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
            : notification.type === 'warning'
            ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs opacity-75 hover:opacity-100 px-2 py-1 bg-black/40 rounded-lg"
          >
            Închide
          </button>
        </div>
      )}

      {/* ─── Banner Antet & Filosofie Triunghiul de Aur ─── */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-blue-950/30 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
                ACADEMIA DE FOTBAL & TINERET
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                La Masia &bull; Ajax Model &bull; GBI System
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              🎓 Centrul de Copii & Juniori &bull; Triunghiul Echilibrului
            </h1>
            <p className="text-xs text-zinc-400 max-w-3xl">
              Un junior nu devine o super-vedetă mondială dacă este tratat ca o mașinărie oarbă de antrenament.
              Echilibrul de Aur (<strong className="text-blue-300">GBI</strong>) armonizează{' '}
              <span className="text-sky-400 font-semibold">Școala (30%)</span>,{' '}
              <span className="text-rose-400 font-semibold">Viața Personală (30%)</span> și{' '}
              <span className="text-emerald-400 font-semibold">Antrenamentul (40%)</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleScoutTrial}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all border border-blue-400/30"
            >
              <span>🔍</span>
              <span>Organizează Trial (€15.000)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Grid Principal: Lista Juniori & Detalii Triunghi ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coloana Stânga: Lista Tinerilor Prospecți (5 coloane) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span>👥</span> Lotul Academiei ({academyState.juniors.length} / 8 juniori)
            </h2>
            <span className="text-[11px] text-zinc-500">Selectează pentru calibrare</span>
          </div>

          <div className="space-y-2">
            {academyState.juniors.map(junior => {
              const isSelected = junior.id === selectedJunior?.id;
              return (
                <div
                  key={junior.id}
                  onClick={() => setSelectedJuniorId(junior.id)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                    isSelected 
                      ? 'bg-zinc-900 border-blue-500/80 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30' 
                      : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        junior.position === 'CF' ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40' :
                        junior.position === 'CM' || junior.position === 'RM' || junior.position === 'LM' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' :
                        junior.position === 'GK' ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40' :
                        'bg-yellow-900/60 text-yellow-300 border border-yellow-500/40'
                      }`}>
                        {junior.position}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-100">{junior.name}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">({junior.age} ani)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          <span>Calitate: <strong className="text-white">{junior.quality}%</strong></span>
                          <span>&bull;</span>
                          <span>Potențial: <strong className="text-amber-400">{junior.potential}% ★</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${junior.destinyColor}`}>
                        {junior.destinyBadge}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        GBI: <strong className="text-blue-400">{junior.gbi}%</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {academyState.juniors.length === 0 && (
              <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950 text-zinc-500 text-xs">
                Nu există juniori în Academie. Organizează un trial pentru a recruta tineri talentați!
              </div>
            )}
          </div>

          {/* ─── Facilitățile Bazei de Juniori ─── */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-3 mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <span>🏗️</span> Facilitățile Academiei (Investiții)
            </h3>
            
            <div className="space-y-2.5 text-xs">
              {/* Terenuri Iarbă */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div>
                  <div className="font-bold text-zinc-200">Terenuri & Sală de Forță (Tineret)</div>
                  <div className="text-[10px] text-zinc-400">Nivel {academyState.facilities.trainingPitchesLevel} / 5 &bull; +Calitate noilor juniori</div>
                </div>
                <button
                  onClick={() => handleUpgradeFacility('trainingPitchesLevel')}
                  className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[10px] transition"
                >
                  Upgrade (€{(academyState.facilities.trainingPitchesLevel * 35000).toLocaleString()})
                </button>
              </div>

              {/* Cămine & Suport */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div>
                  <div className="font-bold text-zinc-200">Cămin & Suport Psihologic</div>
                  <div className="text-[10px] text-zinc-400">Nivel {academyState.facilities.dormitoryLevel} / 5 &bull; Stabilitate emoțională</div>
                </div>
                <button
                  onClick={() => handleUpgradeFacility('dormitoryLevel')}
                  className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[10px] transition"
                >
                  Upgrade (€{(academyState.facilities.dormitoryLevel * 35000).toLocaleString()})
                </button>
              </div>

              {/* Meditații Școlare */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div>
                  <div className="font-bold text-zinc-200">Centru de Meditații & Școală Parteneră</div>
                  <div className="text-[10px] text-zinc-400">Nivel {academyState.facilities.studyCenterLevel} / 5 &bull; Disciplină & Viziune tactică</div>
                </div>
                <button
                  onClick={() => handleUpgradeFacility('studyCenterLevel')}
                  className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[10px] transition"
                >
                  Upgrade (€{(academyState.facilities.studyCenterLevel * 35000).toLocaleString()})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coloana Dreapta: Calibrare Triunghi & Destin (7 coloane) */}
        {selectedJunior && (
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-5">
              {/* Header Jucător Selectat */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-xl font-bold text-blue-400">
                    {selectedJunior.position}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{selectedJunior.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        {selectedJunior.age} ani
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30">
                        {selectedJunior.personality}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedJunior.notes}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-zinc-400">Potențial Genetic:</div>
                  <div className="text-xl font-black text-amber-400">{selectedJunior.potential}% ★</div>
                </div>
              </div>

              {/* Triunghiul Echilibrului: Barometru GBI */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚖️</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Indexul Echilibrului de Aur (GBI):
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${selectedJunior.destinyColor}`}>
                      {selectedJunior.destinyBadge}
                    </span>
                  </div>
                  <span className="font-mono font-black text-base text-blue-400">{selectedJunior.gbi}%</span>
                </div>

                {/* Bară Progres GBI */}
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${selectedJunior.gbi}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-300 pt-1 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-zinc-800/80">
                  {selectedJunior.destiny}
                </p>
              </div>

              {/* Slidere Interactive de Distribuție a Timpului Săptămânal */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Alocarea Timpului Săptămânal (Total 100%)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Recomandat de Aur: 30% / 30% / 40%</span>
                </h4>

                {/* Axa 1: Școală & Educație */}
                <div className="space-y-1.5 p-3 rounded-xl bg-sky-950/20 border border-sky-500/20">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-sky-400 flex items-center gap-1.5">
                      <span>📚</span> Școală & Educație (Viziune & Disciplină Tactică)
                    </span>
                    <span className="font-mono font-bold text-sky-300">{selectedJunior.schoolFocus}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={selectedJunior.schoolFocus}
                    onChange={(e) => handleFocusChange(selectedJunior.id, 'school', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>5% (Pericol indisciplină)</span>
                    <span className="text-sky-400 font-bold">Țintă de Aur: 30%</span>
                    <span>70% (Teoretician fără forță)</span>
                  </div>
                </div>

                {/* Axa 2: Viață Personală & Familie */}
                <div className="space-y-1.5 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-rose-400 flex items-center gap-1.5">
                      <span>🏠</span> Viață Personală & Familie (Stabilitate Mentală)
                    </span>
                    <span className="font-mono font-bold text-rose-300">{selectedJunior.personalLifeFocus}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={selectedJunior.personalLifeFocus}
                    onChange={(e) => handleFocusChange(selectedJunior.id, 'life', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>5% (Risc Burnout / Anxietate)</span>
                    <span className="text-rose-400 font-bold">Țintă de Aur: 30%</span>
                    <span>70% (Tentația Party Boy)</span>
                  </div>
                </div>

                {/* Axa 3: Antrenament pe Teren */}
                <div className="space-y-1.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>⚽</span> Antrenament Fotbal (Calități Tehnice & Motrice)
                    </span>
                    <span className="font-mono font-bold text-emerald-300">{selectedJunior.trainingFocus}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={selectedJunior.trainingFocus}
                    onChange={(e) => handleFocusChange(selectedJunior.id, 'training', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>15% (Fizic insuficient)</span>
                    <span className="text-emerald-400 font-bold">Țintă de Aur: 40%</span>
                    <span>80% (Uzură prematură)</span>
                  </div>
                </div>
              </div>

              {/* ─── Butoane de Acțiune Manager ─── */}
              <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAwardScholarship(selectedJunior)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sky-300 border border-sky-500/30 text-xs font-bold transition"
                  >
                    <span>🎓</span>
                    <span>Bursă de Merit (€10.000)</span>
                  </button>
                  <button
                    onClick={() => handleSendToCamp(selectedJunior)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
                  >
                    <span>⚡</span>
                    <span>Tabără La Masia (€25.000)</span>
                  </button>
                </div>

                <button
                  onClick={() => handlePromoteToSenior(selectedJunior)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all border border-emerald-400/40"
                >
                  <span>🚀</span>
                  <span>PROMOVEAZĂ LA SENIORI (Botezul Focului)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
