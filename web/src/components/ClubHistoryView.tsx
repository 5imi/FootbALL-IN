'use client';

import React, { useState } from 'react';
import { 
  HistoryEvent, 
  loadManagerHistory, 
  loadTeamHistory 
} from '../engine/historyEngine';

interface ClubHistoryViewProps {
  managerName: string;
  teamName: string;
}

export const ClubHistoryView: React.FC<ClubHistoryViewProps> = ({
  managerName = 'cipriansimi',
  teamName = 'FC Foresta',
}) => {
  const [activeTab, setActiveTab] = useState<'manager' | 'team'>('manager');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const managerHistory = loadManagerHistory();
  const teamHistory = loadTeamHistory();

  const currentList = activeTab === 'manager' ? managerHistory : teamHistory;
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(currentList.length / itemsPerPage));
  const paginatedList = currentList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4 font-sans text-zinc-100">
      
      {/* ─── Comutator Tab Istorie Manager vs Istorie Echipă ─── */}
      <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 text-xs w-fit">
        <button
          onClick={() => {
            setActiveTab('manager');
            setCurrentPage(1);
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'manager'
              ? 'bg-blue-600 text-white shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          Istoria managerului ({managerName})
        </button>
        <button
          onClick={() => {
            setActiveTab('team');
            setCurrentPage(1);
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'team'
              ? 'bg-blue-600 text-white shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          Istoria echipei ({teamName})
        </button>
      </div>

      {/* ─── Cardul de Istoric 1-la-1 SoccerProject ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
        
        {/* Titlu cu linie punctată SP */}
        <div className="border-b border-dashed border-zinc-700 pb-2">
          <h2 className="text-base font-black text-white tracking-wide">
            {activeTab === 'manager' 
              ? `Istoria managerului (${managerName})`
              : `Istoria echipei (${teamName})`
            }
          </h2>
        </div>

        {/* Tabel Istoric */}
        <div className="overflow-x-auto rounded-xl border border-sky-900/60 bg-zinc-950/70">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-sky-900/60 bg-sky-950/20 text-sky-200 font-bold">
                <th className="py-2.5 px-4 w-32">Data</th>
                <th className="py-2.5 px-4 w-36">
                  {activeTab === 'manager' ? 'Club' : 'Manager'}
                </th>
                <th className="py-2.5 px-4 w-20 text-center">Sezon</th>
                <th className="py-2.5 px-4">Eveniment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {paginatedList.map((item) => (
                <tr key={item.id} className="hover:bg-sky-950/30 transition-colors">
                  <td className="py-2 px-4 whitespace-nowrap font-mono text-zinc-300">
                    {item.date}
                  </td>
                  <td className="py-2 px-4 font-semibold text-sky-400">
                    {activeTab === 'manager' ? item.clubName : item.managerName}
                  </td>
                  <td className="py-2 px-4 text-center font-mono text-zinc-300">
                    {item.season}
                  </td>
                  <td className="py-2 px-4 text-zinc-200">
                    {item.event}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Paginare fidelă SoccerProject (1 2 3 4 5 6 7 8 9 ... 28 Următor) ─── */}
        <div className="pt-2 flex items-center gap-1.5 text-xs text-sky-400 font-bold flex-wrap select-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-2 py-0.5 rounded border ${
                currentPage === pageNum 
                  ? 'bg-sky-600 text-white border-sky-500' 
                  : 'bg-zinc-900 border-zinc-700 text-sky-400 hover:bg-zinc-800'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <span className="px-1 text-zinc-500">...</span>
          <button
            onClick={() => setCurrentPage(28)}
            className={`px-2 py-0.5 rounded border ${
              currentPage === 28 
                ? 'bg-sky-600 text-white border-sky-500' 
                : 'bg-zinc-900 border-zinc-700 text-sky-400 hover:bg-zinc-800'
            }`}
          >
            28
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, 28))}
            className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-sky-400 hover:bg-zinc-800 ml-1"
          >
            Următor
          </button>
        </div>

      </div>

    </div>
  );
};
