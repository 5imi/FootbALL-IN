'use client';

import React, { useState } from 'react';
import { DivisionTeam } from '../engine/divisionEngine';
import { Language, getTranslation } from '../engine/i18n';

interface LeagueTableViewProps {
  divisionTeams: DivisionTeam[];
  language?: Language;
  onOpenTeamDetails?: (team: DivisionTeam) => void;
}

export const LeagueTableView: React.FC<LeagueTableViewProps> = ({ 
  divisionTeams,
  language = 'ro',
  onOpenTeamDetails
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [selectedDivisionLetter, setSelectedDivisionLetter] = useState('A');
  const [selectedDivisionNumber, setSelectedDivisionNumber] = useState('1');

  // Sortare după puncte, golaveraj, goluri marcate
  const sorted = [...divisionTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Header Selector Divizie Fidel SoccerProject ─── */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t('standings_title')}
            </h3>
            <p className="text-xs text-zinc-400">
              Piramida ligilor SoccerProject: 16 cluburi per divizie, promovare (locurile 1-2) și retrogradare (11-16).
            </p>
          </div>

          {/* Selector Divizie SP */}
          <div className="flex items-center gap-2 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800 self-start sm:self-auto text-xs">
            <span className="text-zinc-400 font-semibold">{t('standings_division_label')}:</span>
            <select
              value={selectedDivisionLetter}
              onChange={(e) => setSelectedDivisionLetter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white rounded px-2 py-0.5 focus:outline-none font-bold"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>
            <select
              value={selectedDivisionNumber}
              onChange={(e) => setSelectedDivisionNumber(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white rounded px-2 py-0.5 focus:outline-none font-mono"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="9">9</option>
            </select>
            <button className="px-3 py-0.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs transition">
              {t('standings_show')}
            </button>
          </div>
        </div>

        {/* ─── Tabelul Oficial SP de 16 Echipe ─── */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/90 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">{t('standings_pos')}</th>
                <th className="py-2.5 px-4">{t('standings_name')}</th>
                <th className="py-2.5 px-3 w-20 text-center">{t('standings_flag')}</th>
                <th className="py-2.5 px-3 text-center font-bold text-white">{t('standings_p')}</th>
                <th className="py-2.5 px-3 text-center">{t('standings_t')}</th>
                <th className="py-2.5 px-3 text-center">{t('standings_v')}</th>
                <th className="py-2.5 px-3 text-center">{t('standings_e')}</th>
                <th className="py-2.5 px-3 text-center">{t('standings_i')}</th>
                <th className="py-2.5 px-3 text-center">{t('standings_plus')}</th>
                <th className="py-2.5 px-3 text-center">{t('standings_minus')}</th>
                <th className="py-2.5 px-4 text-center">{t('standings_diff')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {sorted.map((team, index) => {
                const pos = index + 1;
                const isPromo = pos <= 2;
                const isRelegation = pos >= 11;

                return (
                  <tr
                    key={team.id}
                    className={`hover:bg-zinc-800/50 transition-colors ${
                      isPromo ? 'bg-blue-950/20' : isRelegation ? 'bg-rose-950/10' : (index % 2 === 1 ? 'bg-zinc-950/30' : 'bg-zinc-900/40')
                    }`}
                  >
                    {/* Poziție */}
                    <td className="py-2 px-3 text-center font-bold font-mono">
                      <span className={`inline-block w-6 text-center py-0.5 rounded text-[11px] ${
                        isPromo ? 'bg-blue-600 text-white shadow' : isRelegation ? 'text-rose-400' : 'text-zinc-400'
                      }`}>
                        {pos}
                      </span>
                    </td>

                    {/* Nume Echipă */}
                    <td className="py-2 px-4 font-semibold">
                      <span className={`hover:underline cursor-pointer ${
                        team.isBot ? 'text-zinc-300' : 'text-blue-400 hover:text-blue-300'
                      }`}>
                        {team.name}
                      </span>
                      {isPromo && (
                        <span className="ml-2 text-[9px] font-mono uppercase bg-blue-950 text-blue-300 border border-blue-800/60 px-1.5 py-0.2 rounded">
                          Promovare
                        </span>
                      )}
                    </td>

                    {/* Steag sau Iconiță Bot SP */}
                    <td className="py-2 px-3 text-center">
                      {team.isBot ? (
                        <span 
                          className="inline-flex items-center justify-center w-6 h-4.5 bg-blue-900/80 border border-blue-500/40 rounded text-[11px] shadow-sm"
                          title="Echipă Bot / Inactivă (SoccerProject Model)"
                        >
                          🤖
                        </span>
                      ) : (
                        <span className="text-base" title={`Țară: ${team.countryCode}`}>
                          {team.flag}
                        </span>
                      )}
                    </td>

                    {/* Puncte */}
                    <td className="py-2 px-3 text-center font-bold font-mono text-white text-sm">
                      {team.points}
                    </td>

                    {/* Meciuri (T) */}
                    <td className="py-2 px-3 text-center font-mono text-zinc-400">
                      {team.matches}
                    </td>

                    {/* Victorii (V) */}
                    <td className="py-2 px-3 text-center font-mono text-emerald-400 font-semibold">
                      {team.won}
                    </td>

                    {/* Egaluri (E) */}
                    <td className="py-2 px-3 text-center font-mono text-zinc-400">
                      {team.drawn}
                    </td>

                    {/* Înfrângeri (I) */}
                    <td className="py-2 px-3 text-center font-mono text-rose-400">
                      {team.lost}
                    </td>

                    {/* Goluri Date (+) */}
                    <td className="py-2 px-3 text-center font-mono text-zinc-300">
                      {team.goalsFor}
                    </td>

                    {/* Goluri Primite (-) */}
                    <td className="py-2 px-3 text-center font-mono text-zinc-400">
                      {team.goalsAgainst}
                    </td>

                    {/* Golaveraj (+/-) */}
                    <td className={`py-2 px-4 text-center font-mono font-bold ${
                      team.goalDiff > 0 ? 'text-emerald-400' : team.goalDiff < 0 ? 'text-rose-400' : 'text-zinc-400'
                    }`}>
                      {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Legendă Oficială SoccerProject ─── */}
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 text-xs space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {t('standings_legend_title')}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-300">
            <div><strong className="text-white font-mono">V:</strong> {t('standings_legend_v')}</div>
            <div><strong className="text-white font-mono">E:</strong> {t('standings_legend_e')}</div>
            <div><strong className="text-white font-mono">I:</strong> {t('standings_legend_i')}</div>
            <div><strong className="text-white font-mono">T:</strong> {t('standings_legend_t')}</div>
            <div><strong className="text-white font-mono">+:</strong> {t('standings_legend_plus')}</div>
            <div><strong className="text-white font-mono">-:</strong> {t('standings_legend_minus')}</div>
            <div><strong className="text-white font-mono">+/-:</strong> {t('standings_legend_diff')}</div>
            <div><strong className="text-white font-mono">P:</strong> {t('standings_legend_p')}</div>
          </div>
        </div>

        {/* ─── Butoane Sub-meniu SoccerProject ─── */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80">
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700 transition">
            {t('standings_btn_matches')}
          </button>
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700 transition">
            {t('standings_btn_scorers')}
          </button>
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700 transition">
            {t('standings_btn_cards')}
          </button>
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700 transition">
            {t('standings_btn_history')}
          </button>
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700 transition">
            {t('standings_btn_diagram')}
          </button>
        </div>

      </div>

    </div>
  );
};
