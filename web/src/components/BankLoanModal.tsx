'use client';

import React, { useState } from 'react';
import { ClubFinances, BankLoan, saveClubFinances } from '../engine/financeEngine';

interface BankLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  finances: ClubFinances;
  onFinancesUpdate: (newFinances: ClubFinances) => void;
  isGuest?: boolean;
  onRequireAuth?: (msg: string) => void;
}

const LOAN_AMOUNTS = [
  { value: 500000, label: '€ 500.000,00' },
  { value: 1500000, label: '€ 1.500.000,00' },
  { value: 2500000, label: '€ 2.500.000,00' },
];

const LOAN_DURATIONS = [
  { weeks: 18, interest: 5, label: '18 săptămâni => 5%' },
  { weeks: 36, interest: 10, label: '36 săptămâni => 10%' },
  { weeks: 54, interest: 15, label: '54 săptămâni => 15%' },
];

export const BankLoanModal: React.FC<BankLoanModalProps> = ({
  isOpen,
  onClose,
  finances,
  onFinancesUpdate,
  isGuest = false,
  onRequireAuth,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500000);
  const [selectedDurationIndex, setSelectedDurationIndex] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDuration = LOAN_DURATIONS[selectedDurationIndex];
  const activeLoan = finances.activeLoan;

  const handleTakeLoan = () => {
    if (isGuest && onRequireAuth) {
      onRequireAuth('Înregistrează-ți clubul ca manager oficial pentru a putea contracta un împrumut bancar!');
      return;
    }

    if (activeLoan && activeLoan.remainingWeeks > 0) {
      setErrorMsg('Ai deja un împrumut activ în derulare! Poți contracta un singur împrumut o dată.');
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const totalToRepay = selectedAmount * (1 + currentDuration.interest / 100);
    const weeklyInstallment = Math.round(totalToRepay / currentDuration.weeks);

    const newLoan: BankLoan = {
      amount: selectedAmount,
      totalWeeks: currentDuration.weeks,
      interestPercent: currentDuration.interest,
      totalToRepay,
      weeklyInstallment,
      remainingWeeks: currentDuration.weeks,
      dateTaken: new Date().toLocaleDateString(),
    };

    const updatedFinances: ClubFinances = {
      ...finances,
      balance: finances.balance + selectedAmount,
      activeLoan: newLoan,
      transactions: [
        {
          id: `tx-loan-${Date.now()}`,
          type: 'INCOME',
          category: 'LOAN',
          amount: selectedAmount,
          description: `Împrumut bancar aprobat: €${selectedAmount.toLocaleString()} (${currentDuration.label})`,
          date: new Date().toLocaleDateString(),
        },
        ...finances.transactions,
      ],
    };

    saveClubFinances(updatedFinances);
    onFinancesUpdate(updatedFinances);
    setSuccessMsg(`Banca ți-a virat cu succes suma de €${selectedAmount.toLocaleString()} în contul clubului!`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 2500);
  };

  const handleRepayEarly = () => {
    if (!activeLoan) return;
    const remainingToPay = activeLoan.weeklyInstallment * activeLoan.remainingWeeks;

    if (finances.balance < remainingToPay) {
      setErrorMsg(`Fonduri insuficiente pentru rambursarea anticipată de €${remainingToPay.toLocaleString()}!`);
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const updatedFinances: ClubFinances = {
      ...finances,
      balance: finances.balance - remainingToPay,
      activeLoan: null,
      transactions: [
        {
          id: `tx-repay-${Date.now()}`,
          type: 'EXPENSE',
          category: 'LOAN',
          amount: remainingToPay,
          description: `Rambursare anticipată totală împrumut bancar (€${remainingToPay.toLocaleString()})`,
          date: new Date().toLocaleDateString(),
        },
        ...finances.transactions,
      ],
    };

    saveClubFinances(updatedFinances);
    onFinancesUpdate(updatedFinances);
    setSuccessMsg('Ai rambursat integral împrumutul bancar! Clubul nu mai are datorii.');
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans text-zinc-100">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
        
        {/* Buton Închidere */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>

        {/* ─── Titlu Secțiune cu linie punctată clasică SoccerProject ─── */}
        <div className="border-b border-dashed border-zinc-700 pb-2">
          <h2 className="text-base font-black text-white tracking-wide">
            Împrumută nişte bani
          </h2>
        </div>

        {/* Notificări */}
        {successMsg && (
          <div className="text-xs font-bold text-sky-400 py-1 bg-sky-950/40 px-3 rounded border border-sky-600/40">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="text-xs font-bold text-rose-400 py-1 bg-rose-950/40 px-3 rounded border border-rose-600/40">
            {errorMsg}
          </div>
        )}

        {/* Dacă există deja împrumut activ */}
        {activeLoan && activeLoan.remainingWeeks > 0 ? (
          <div className="p-4 rounded-xl border border-amber-600/40 bg-amber-950/20 space-y-2 text-xs">
            <span className="text-amber-400 font-bold block uppercase tracking-wider">
              ⚠️ Împrumut bancar activ în derulare
            </span>
            <div className="space-y-1 text-zinc-300">
              <div className="flex justify-between">
                <span>Sumă inițială:</span>
                <strong className="text-white font-mono">€{activeLoan.amount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Rată săptămânală:</span>
                <strong className="text-rose-400 font-mono">€{activeLoan.weeklyInstallment.toLocaleString()} / săpt</strong>
              </div>
              <div className="flex justify-between">
                <span>Săptămâni rămase:</span>
                <strong className="text-white font-mono">{activeLoan.remainingWeeks} săptămâni</strong>
              </div>
              <div className="flex justify-between border-t border-amber-800/40 pt-1">
                <span>Total de rambursat:</span>
                <strong className="text-sky-300 font-mono">€{(activeLoan.weeklyInstallment * activeLoan.remainingWeeks).toLocaleString()}</strong>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleRepayEarly}
                className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow transition"
              >
                Rambursează Anticipat
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition"
              >
                Închide
              </button>
            </div>
          </div>
        ) : (
          /* Formular Contractare Împrumut Nou 1-la-1 SoccerProject */
          <div className="space-y-4">
            
            {/* 1. Selector Sumă */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="font-bold text-zinc-300 w-20">Sumă</span>
              <select
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
                className="flex-1 bg-zinc-950 text-sky-300 font-bold border border-sky-600/60 rounded px-3 py-1.5 focus:outline-none focus:border-sky-400 max-w-[280px]"
              >
                {LOAN_AMOUNTS.map(item => (
                  <option key={item.value} value={item.value} className="bg-zinc-900 text-white font-bold">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Selector Durată */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="font-bold text-zinc-300 w-20">Durată</span>
              <select
                value={selectedDurationIndex}
                onChange={(e) => setSelectedDurationIndex(Number(e.target.value))}
                className="flex-1 bg-zinc-950 text-sky-300 font-bold border border-sky-600/60 rounded px-3 py-1.5 focus:outline-none focus:border-sky-400 max-w-[280px]"
              >
                {LOAN_DURATIONS.map((dur, i) => (
                  <option key={i} value={i} className="bg-zinc-900 text-white font-bold">
                    {dur.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Text & Reguli oficiale SoccerProject */}
            <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
              <p className="font-semibold text-white">
                Ai nevoie de bani pe loc? Nici o problemă!
              </p>
              <p className="font-semibold text-zinc-400">
                Cateva observatii:
              </p>
              <ul className="space-y-0.5 text-zinc-400 list-disc list-inside">
                <li>poţi face un singur împrumut o data</li>
                <li>suma pentru fiecare rată este retrasa automat din contul tău</li>
                <li>ai grijă să ai mereu destui bani să plăteşti împrumutul.</li>
              </ul>
            </div>

            {/* Sumar Rambursare */}
            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Rată estimată / săptămână:</span>
              <span className="font-bold font-mono text-sky-300 text-sm">
                €{Math.round((selectedAmount * (1 + currentDuration.interest / 100)) / currentDuration.weeks).toLocaleString()}
              </span>
            </div>

            {/* Buton Continuă */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleTakeLoan}
                className="px-5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white font-bold text-xs border border-sky-600/80 shadow-md transition"
              >
                Continuă
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 font-bold text-xs transition"
              >
                Anulează
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
