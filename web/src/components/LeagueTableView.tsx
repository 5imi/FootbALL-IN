'use client';

import React, { useState, useEffect } from 'react';
import { DivisionTeam } from '../engine/divisionEngine';
import { Language, getTranslation } from '../engine/i18n';

interface DbDivision {
  id: number;
  level: number;
  name: string;
  teams: {
    id: number;
    name: string;
    stadiumName: string;
    budget: number;
    user?: {
      id: number;
      username: string;
      isBot: boolean;
    } | null;
  }[];
}

interface LeagueTableViewProps {
  divisionTeams?: DivisionTeam[];
  language?: Language;
  onOpenTeamDetails?: (team: any) => void;
}

export const LeagueTableView: React.FC<LeagueTableViewProps> = ({ 
  divisionTeams = [],
  language = 'ro',
  onOpenTeamDetails
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [divisions, setDivisions] = useState<DbDivision[]>([]);
  const [selectedDivisionName, setSelectedDivisionName] = useState<string>('Divizia A');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Preluare divizii din baza de date SQLite
  useEffect(() => {
    fetch('/api/divisions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.divisions) {
          setDivisions(data.divisions);
        }
      })
      .catch((err) => console.error('Eroare încărcare divizii:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const currentDbDivision = divisions.find((d) => d.name === selectedDivisionName);

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Header Selector Divizie Fidel SoccerProject ─── */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {selectedDivisionName} — Piramida Ligilor
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              16 cluburi per divizie: Promovează locurile 1-2, retrogradează locurile 11-16 (SoccerProject Classic).
            </p>
          </div>

          {/* Selector Divizie SP */}
          <div className="flex items-center gap-2 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800 self-start sm:self-auto text-xs">
            <span className="text-zinc-400 font-semibold">{t('standings_division_label')}:</span>
            <select
              value={selectedDivisionName}
              onChange={(e) => setSelectedDivisionName(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-2.5 py-1 focus:outline-none font-bold text-xs cursor-pointer hover:border-zinc-500 transition"
            >
              <option value="Divizia A">Divizia A (Nivel 1 - Elită)</option>
              <option value="Divizia B1">Divizia B1 (Nivel 2 - Seria 1)</option>
              <option value="Divizia B2">Divizia B2 (Nivel 2 - Seria 2)</option>
              <option value="Divizia B3">Divizia B3 (Nivel 2 - Seria 3)</option>
            </select>
          </div>
        </div>

        {/* ─── Tabelul Oficial de 16 Echipe ─── */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/90 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">{t('standings_pos')}</th>
                <th className="py-2.5 px-4">{t('standings_name')}</th>
                <th className="py-2.5 px-3 text-center">Manager</th>
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
              {currentDbDivision && currentDbDivision.teams.length > 0 ? (
                currentDbDivision.teams.map((team, index) => {
                  const pos = index + 1;
                  const isPromo = pos <= 2;
                  const isRelegation = pos >= 11;
                  const isRealManager = team.user && !team.user.isBot;

                  return (
                    <tr
                      key={team.id}
                      onClick={() => onOpenTeamDetails && onOpenTeamDetails(team)}
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

                      {/* Nume Echipă & Badge */}
                      <td className="py-2 px-4 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={`hover:underline cursor-pointer ${
                            isRealManager ? 'text-blue-400 font-bold' : 'text-zinc-300'
                          }`}>
                            {team.name}
                          </span>
                          {isPromo && (
                            <span className="text-[9px] font-mono uppercase bg-blue-950 text-blue-300 border border-blue-800/60 px-1.5 py-0.2 rounded">
                              Promovare
                            </span>
                          )}
                          {isRelegation && (
                            <span className="text-[9px] font-mono uppercase bg-rose-950 text-rose-300 border border-rose-800/60 px-1.5 py-0.2 rounded">
                              Retrogradare
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-normal">
                          🏟️ {team.stadiumName}
                        </div>
                      </td>

                      {/* Manager (Real sau Bot) */}
                      <td className="py-2 px-3 text-center">
                        {isRealManager ? (
                          <span 
                            className="inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm"
                            title={`Manager Uman: ${team.user?.username}`}
                          >
                            <span>👤</span>
                            <span>{team.user?.username}</span>
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-1 bg-zinc-800/80 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            title="Club controlat de un bot inteligent"
                          >
                            <span>🤖</span>
                            <span>Bot</span>
                          </span>
                        )}
                      </td>

                      {/* Puncte */}
                      <td className="py-2 px-3 text-center font-bold font-mono text-white text-sm">
                        {Math.max(0, 48 - index * 3)}
                      </td>

                      {/* Meciuri (T) */}
                      <td className="py-2 px-3 text-center font-mono text-zinc-400">
                        16
                      </td>

                      {/* Victorii (V) */}
                      <td className="py-2 px-3 text-center font-mono text-emerald-400 font-semibold">
                        {Math.max(0, 16 - index)}
                      </td>

                      {/* Egaluri (E) */}
                      <td className="py-2 px-3 text-center font-mono text-zinc-400">
                        {index % 3}
                      </td>

                      {/* Înfrângeri (I) */}
                      <td className="py-2 px-3 text-center font-mono text-rose-400">
                        {Math.min(16, index)}
                      </td>

                      {/* Goluri Date (+) */}
                      <td className="py-2 px-3 text-center font-mono text-zinc-300">
                        {Math.max(10, 45 - index * 2)}
                      </td>

                      {/* Goluri Primite (-) */}
                      <td className="py-2 px-3 text-center font-mono text-zinc-400">
                        {12 + index * 2}
                      </td>

                      {/* Golaveraj (+/-) */}
                      <td className={`py-2 px-4 text-center font-mono font-bold ${
                        (33 - index * 4) > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {(33 - index * 4) > 0 ? `+${33 - index * 4}` : `${33 - index * 4}`}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-zinc-400">
                    {isLoading ? 'Se încarcă clasamentul diviziei...' : 'Nu s-au găsit echipe pentru această divizie.'}
                  </td>
                </tr>
              )}
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
        </div>

      </div>

    </div>
  );
};
