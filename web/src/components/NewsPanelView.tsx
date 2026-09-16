'use client';

import React, { useState } from 'react';

export interface GameNewsItem {
  id: string;
  date: string;
  title: string;
  category: 'UPDATE' | 'EVENT' | 'COMMUNITY' | 'MAINTENANCE';
  badge: string;
  author: string;
  summary: string;
  content: string[];
}

export const OFFICIAL_GAME_NEWS: GameNewsItem[] = [
  {
    id: 'news-youth-academy',
    date: '16 Sep 2026 (19:30 CET)',
    title: 'Lansare Oficială: Academia de Tineret & Triunghiul Echilibrului (GBI)',
    category: 'UPDATE',
    badge: 'Versiunea 1.5.0',
    author: 'Departamentul de Dezvoltare & Juniorat',
    summary: 'Formăm oameni, nu doar atleți: sistemul La Masia / Ajax integrat cu Golden Balance Index (GBI) pentru descoperirea de super-vedete.',
    content: [
      'Am implementat modelul Triunghiul Echilibrului: Școală & Educație (30%), Viață Personală (30%) și Antrenament Fotbal (40%).',
      'Indexul GBI calculează matematic destinul fiecărui junior de 15-18 ani: de la Super-Vedetă Mondială până la Titular Solid de Divizia A.',
      'Managerul poate calibra timpul săptămânal prin slidere interactive, poate acorda Burse de Excelență sau tabere la La Masia.',
      'Funcția „Botezul Focului”: managerul poate promova oricând un junior talentat direct în lotul primei echipe de seniori, cu moral maxim (100%) și contract profesionist!',
      'Posibilitate de modernizare a facilităților: Terenuri sintetice de tineret, Cămine și Centru de meditații școlare.'
    ]
  },
  {
    id: 'news-mind-games',
    date: '16 Sep 2026 (19:15 CET)',
    title: 'Mecanică Nouă de Meci: Războiul Psihologic, Conferințe de Presă & Manevre de Culise',
    category: 'UPDATE',
    badge: 'MIND GAMES',
    author: 'Comitetul de Competiții & Relații Publice',
    summary: 'Meciul se dispută și în afara terenului: declarații incendiare în presă, drone de spionaj Spygate și șicane nocturne de hotel.',
    content: [
      'Conferințe de Presă Pre-Meci interactive: jurnaliștii îți pun întrebări incomode înainte de meci, iar răspunsul tău (Războinic, Diplomat sau Atac la Arbitri) schimbă starea psihică a vestiarului.',
      'Drona Spion Spygate (€15.000): spionează antrenamentul secret advers pentru +20% apărare la faze fixe.',
      'Artificii la hotelul oaspeților la 03:00 (€10.000): reduce rezistența fizică a rivalilor în prima repriză.',
      'Zvon otrăvit de transfer în tabloide (€8.000): destabilizează căpitanul advers înainte de derby.',
      'Valiza cu bani (€50.000): stimulează o echipă din campionat să lupte pe viață și pe moarte împotriva liderului diviziei.'
    ]
  },
  {
    id: 'news-tactics-presets',
    date: '16 Sep 2026 (19:00 CET)',
    title: 'Actualizare Majora: Tactici Predefinite (Selecția A, B, C, D) & Teren Interactiv',
    category: 'UPDATE',
    badge: 'Versiunea 1.4.0',
    author: 'Echipa de Dezvoltare FootbALL-IN',
    summary: 'Managerii au acum la dispoziție 4 garnituri predefinite pentru a nu rata meciul dacă nu pot intra online înainte de simulare.',
    content: [
      'Am adăugat sistemul de selecții predefinite exact ca în SoccerProject: dacă managerul nu intră înainte de ora meciului, se aplică automat Selecția A (Inițială).',
      'Terenul de joc permite acum plasarea jucătorilor pe posturi prin dropdown-uri inteligente grupate pe posturile naturale (RF, CF, LF, RM, CM, LM, RB, CB, LB, GK).',
      'Tabelul de lot este sincronizat în timp real cu terenul: titularii sunt evidențiați colorat pe rânduri (Portocaliu GK, Galben Fundași, Verde Mijlocași, Albastru Atacanți), facilitând identificarea jucătorilor obosiți sau fără moral.',
      'S-a adăugat panoul complet de setări tactice: Agresivitate (0-100%), Stil ofensiv/defensiv (0-100%), Tactică specifică și desemnarea Căpitanului.'
    ]
  },
  {
    id: 'news-personal-life',
    date: '16 Sep 2026 (18:30 CET)',
    title: 'Modul Nou: Viața Personală & Vestiar (Impact Real în Simularea Meciului)',
    category: 'UPDATE',
    badge: 'Funcție Nouă',
    author: 'Departamentul Psihologic & Culise',
    summary: 'Viața privată a fotbaliștilor produce evenimente neprevăzute: nunți, nașteri, scandaluri nocturne sau divorțuri.',
    content: [
      'Jucătorii au acum profiluri personale cu stare civilă, număr de copii și stil de viață (Familist, Petrecăreț / VIP, etc.).',
      'Evenimentele de can-can influențează direct Moralul, Condiția Fizică și Agresivitatea pe teren.',
      'Managerul poate interveni acordând zile libere, plătind consiliere psihologică sau amendând jucătorii indisciplinați.'
    ]
  },
  {
    id: 'news-results-history',
    date: '15 Sep 2026 (12:00 CET)',
    title: 'Tabelul de Rezultate & Calendar Etape Divizia A',
    category: 'UPDATE',
    badge: 'Optimizare',
    author: 'Liga Diviziei A',
    summary: 'Istoricul meciurilor și etapele viitoare sunt acum arhivate într-un tabel dedicat, cu acces la rapoartele tehnice.',
    content: [
      'Fiecare meci disputat în campionat este salvat cu data, tipul competiției (Ligă, Cupă, Amical) și scorul final.',
      'Managerii pot consulta meciurile viitoare din calendarul etapei curente și arhiva sezoanelor anterioare.'
    ]
  },
  {
    id: 'news-welcome',
    date: '10 Sep 2026 (08:00 CET)',
    title: 'Bun venit în FootbALL-IN &bull; Reîntoarcerea Legendei SoccerProject',
    category: 'COMMUNITY',
    badge: 'Anunț Oficial',
    author: 'Administrator',
    summary: 'Lansarea proiectului dedicat fanilor fotbalului pur, matematic și fără mecanici Pay-to-Win.',
    content: [
      'FootbALL-IN readuce spiritul clasic al jocurilor de management sportiv din anii 2000, cu o interfață modernă, rapidă și sigură.',
      'Banii reali nu pot cumpăra goluri: succesul depinde exclusiv de tactică, scouting, antrenament și managementul resurselor.'
    ]
  }
];

export const NewsPanelView: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'UPDATE' | 'EVENT' | 'COMMUNITY'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('news-tactics-presets');

  const filteredNews = OFFICIAL_GAME_NEWS.filter(item => {
    if (filter === 'ALL') return true;
    return item.category === filter;
  });

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Antet Știri & Anunțuri ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-2xl shadow-lg border border-blue-500/30">
              📢
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                Gazeta Oficială FootbALL-IN &bull; SoccerProject Classic
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>Știri &amp; Noutăți de la Dezvoltatori</span>
                <span className="rounded bg-blue-900/60 text-blue-300 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-blue-700/40">
                  Live Feed
                </span>
              </h2>
            </div>
          </div>

          {/* Filtre Categorie */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Toate
            </button>
            <button
              onClick={() => setFilter('UPDATE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filter === 'UPDATE' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🚀 Actualizări
            </button>
            <button
              onClick={() => setFilter('COMMUNITY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filter === 'COMMUNITY' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              💬 Comunitate
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-400">
          Urmărește aici toate actualizările motorului de joc, îmbunătățirile aduse simulării și noile funcționalități inspirate din SoccerProject pe măsură ce sunt lansate!
        </p>
      </div>

      {/* ─── Lista de Știri / Anunțuri ─── */}
      <div className="space-y-4">
        {filteredNews.map((news) => {
          const isExpanded = expandedId === news.id;

          return (
            <div
              key={news.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-xl transition hover:border-zinc-700"
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : news.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-zinc-400">
                      📅 {news.date}
                    </span>
                    <span className="rounded bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 text-[10px] font-bold">
                      {news.badge}
                    </span>
                    <span className="text-xs text-zinc-500">
                      &bull; Autor: <strong className="text-zinc-300">{news.author}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white hover:text-blue-400 transition">
                    {news.title}
                  </h3>
                </div>

                <div className="text-zinc-400 hover:text-white text-sm shrink-0 self-end sm:self-center font-bold">
                  {isExpanded ? '▲ Ascunde' : '▼ Citește tot'}
                </div>
              </div>

              {/* Rezumat vizibil mereu */}
              <p className="text-xs text-zinc-300 mt-2">
                {news.summary}
              </p>

              {/* Conținut extins */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-300 animate-in fade-in duration-200">
                  <ul className="space-y-2 list-disc list-inside text-zinc-300">
                    {news.content.map((paragraph, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {paragraph}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
