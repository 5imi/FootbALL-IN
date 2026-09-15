import React from 'react';
import { ManagerProfile } from '../engine/divisionEngine';
import { ClubFinances } from '../engine/financeEngine';
import { Language, getTranslation } from '../engine/i18n';
import { COUNTRIES } from '../engine/countries';

interface ControlPanelViewProps {
  manager: ManagerProfile | null;
  finances: ClubFinances;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenRegistration: () => void;
  onNavigateTab: (tab: 'match' | 'tactics' | 'training' | 'standings' | 'staff') => void;
}

export const ControlPanelView: React.FC<ControlPanelViewProps> = ({
  manager,
  finances,
  language,
  onLanguageChange,
  onOpenRegistration,
  onNavigateTab
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  const country = manager ? (COUNTRIES[manager.countryCode] || COUNTRIES.RO) : COUNTRIES.RO;

  const totalWeeklyWages = finances.weeklyPlayerWages + finances.weeklyStaffWages;

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Header Card Profil Manager & Club ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-5">
        {/* Glow fundal */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-2xl shadow-lg border border-blue-500/30">
              {country.flag}
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                {t('cp_title')}
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{manager ? manager.teamName : 'Echipă Neînregistrată'}</span>
                {manager && <span className="text-sm font-normal text-zinc-400">({manager.username})</span>}
              </h2>
              <p className="text-xs text-zinc-400">
                🏟️ {manager ? manager.stadiumName : 'Stadion Municipal'} • {country.nameRo} • <span className="text-blue-400 font-semibold font-mono">Divizia A</span>
              </p>
            </div>
          </div>

          {/* Selector Limbă Internațională */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800">
            <span className="text-xs text-zinc-400 px-2 font-medium">🌐 {t('cp_language')}:</span>
            <button
              onClick={() => onLanguageChange('ro')}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition flex items-center gap-1 ${
                language === 'ro' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🇷🇴</span> RO
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition flex items-center gap-1 ${
                language === 'en' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🇬🇧</span> EN
            </button>
          </div>
        </div>

        {/* ─── Metrici Financiare & Buget ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Buget Total Club</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              €{finances.balance.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 block">Lichidități disponibile</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Salarii Jucători / Săpt</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              €{finances.weeklyPlayerWages.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 block">24 contracte active</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Salarii Personal (Staff)</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              €{finances.weeklyStaffWages.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 block">7 posturi oficiale SP</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Cheltuieli Săptămânale</span>
            <span className="text-lg font-bold text-rose-400 font-mono">
              €{totalWeeklyWages.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 block">Deducere automată săptămânală</span>
          </div>
        </div>

        {/* Buton Înregistrare / Preluare Alt Club Bot */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400">
            Dorești să preiei o altă echipă bot din Divizia A sau să schimbi datele clubului?
          </div>
          <button
            onClick={onOpenRegistration}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md border border-blue-500/40 transition active:translate-y-0.5 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>🔄</span>
            <span>{t('cp_takeover_another')}</span>
          </button>
        </div>
      </div>

      {/* ─── Grilă Navigație Rapidă ─── */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          {t('cp_quick_actions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('match')}
            className="p-4 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition text-left space-y-1 shadow-md group"
          >
            <span className="text-xl">🏟️</span>
            <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">Meciul Zilei</h4>
            <p className="text-[11px] text-zinc-400">Simulator live minut cu minut & arbitraj</p>
          </button>

          <button
            onClick={() => onNavigateTab('tactics')}
            className="p-4 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition text-left space-y-1 shadow-md group"
          >
            <span className="text-xl">📋</span>
            <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">Așezare Tactică</h4>
            <p className="text-[11px] text-zinc-400">Teren tactiv 2D, stil de joc & prim 11</p>
          </button>

          <button
            onClick={() => onNavigateTab('training')}
            className="p-4 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition text-left space-y-1 shadow-md group"
          >
            <span className="text-xl">🏃</span>
            <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">Antrenament SP</h4>
            <p className="text-[11px] text-zinc-400">Planificare compartimente & mod automat</p>
          </button>

          <button
            onClick={() => onNavigateTab('staff')}
            className="p-4 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition text-left space-y-1 shadow-md group"
          >
            <span className="text-xl">👔</span>
            <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">Personal & Staff</h4>
            <p className="text-[11px] text-zinc-400">Cele 7 roluri, recrutare candidați & cursuri</p>
          </button>
        </div>
      </div>

      {/* ─── Registru Tranzacții Financiare Recente ─── */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-xl">
        <div className="border-b border-zinc-800 px-5 py-3 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Registru Contabil & Tranzacții Recente
          </h4>
          <span className="text-[11px] text-zinc-400 font-mono">Double-Entry Ledger</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-4">Dată</th>
                <th className="py-2.5 px-4">Tip</th>
                <th className="py-2.5 px-4">Descriere Operațiune</th>
                <th className="py-2.5 px-4 text-right">Sumă (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {finances.transactions.slice(0, 8).map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-2.5 px-4 font-mono text-zinc-400">{tx.date}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'INCOME' 
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                    }`}>
                      {tx.type === 'INCOME' ? 'VENIT' : 'CHELTUIALĂ'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-zinc-300">{tx.description}</td>
                  <td className={`py-2.5 px-4 text-right font-mono font-bold ${
                    tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'INCOME' ? '+' : '-'}€{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
