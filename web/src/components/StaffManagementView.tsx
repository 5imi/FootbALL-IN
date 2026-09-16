import React, { useState } from 'react';
import { 
  StaffMember, 
  StaffRole, 
  STAFF_ROLE_TITLES, 
  loadClubStaff, 
  saveClubStaff, 
  generateStaffMarketCandidates 
} from '../engine/staffEngine';
import { ClubFinances, spendClubBudget } from '../engine/financeEngine';
import { Language, getTranslation } from '../engine/i18n';
import { BankLoanModal } from './BankLoanModal';

interface StaffManagementViewProps {
  finances: ClubFinances;
  language: Language;
  onFinancesUpdate: (newFinances: ClubFinances) => void;
  isGuest?: boolean;
  onRequireAuth?: (message: string) => void;
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  finances,
  language,
  onFinancesUpdate,
  isGuest = false,
  onRequireAuth,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [staffList, setStaffList] = useState<StaffMember[]>(() => loadClubStaff());
  const [selectedRoleForMarket, setSelectedRoleForMarket] = useState<StaffRole | null>(null);
  const [marketCandidates, setMarketCandidates] = useState<StaffMember[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState<boolean>(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Deschide piața de candidați pentru un anumit rol
  const handleOpenMarket = (role: StaffRole) => {
    if (isGuest && onRequireAuth) {
      onRequireAuth('Pentru a căuta și angaja personal tehnic sau medical (antrenori, medici, fizioterapeuți), înregistrează-ți clubul!');
      return;
    }
    const candidates = generateStaffMarketCandidates(role);
    setMarketCandidates(candidates);
    setSelectedRoleForMarket(role);
  };

  // Angajare candidat din piață
  const handleHireCandidate = (candidate: StaffMember) => {
    if (isGuest && onRequireAuth) {
      setSelectedRoleForMarket(null);
      onRequireAuth('Pentru a angaja personal tehnic sau medical, trebuie să fii managerul unui club înregistrat!');
      return;
    }
    const signingBonus = candidate.salaryWeekly * 4; // Primă de instalare: 4 săptămâni de salariu
    const spendResult = spendClubBudget(
      signingBonus,
      'STAFF_HIRE',
      `Angajare ${candidate.roleTitle}: ${candidate.name} (Primă instalare €${signingBonus.toLocaleString()})`
    );

    if (!spendResult.success) {
      showNotification('❌ Fonduri insuficiente pentru prima de instalare a acestui membru de staff!');
      return;
    }

    // Înlocuim membrul de staff
    const updated = staffList.map(s => s.role === candidate.role ? candidate : s);
    setStaffList(updated);
    saveClubStaff(updated);
    onFinancesUpdate(spendResult.newFinances);
    setSelectedRoleForMarket(null);
    showNotification(`✔️ L-ai angajat pe ${candidate.name} în funcția de ${candidate.roleTitle}!`);
  };

  // Trimitere la curs de perfecționare (+2 - +4% calitate)
  const handleSendToCourse = (staff: StaffMember) => {
    if (isGuest && onRequireAuth) {
      onRequireAuth('Pentru a trimite personalul la cursuri de perfecționare, înregistrează-ți clubul gratuit!');
      return;
    }
    const courseFee = 8500;
    const spendResult = spendClubBudget(
      courseFee,
      'COURSE',
      `Curs de perfecționare pentru ${staff.roleTitle}: ${staff.name}`
    );

    if (!spendResult.success) {
      showNotification('❌ Fonduri insuficiente pentru taxa de curs (€8.500)!');
      return;
    }

    const updated = staffList.map(s => {
      if (s.id === staff.id) {
        const qualityBoost = 2 + Math.floor(Math.random() * 3);
        return {
          ...s,
          quality: Math.min(99, s.quality + qualityBoost),
          isOnCourse: true,
          courseDaysLeft: 14
        };
      }
      return s;
    });

    setStaffList(updated);
    saveClubStaff(updated);
    onFinancesUpdate(spendResult.newFinances);
    showNotification(`🎓 ${staff.name} a fost trimis la curs! Calitatea a crescut la noua valoare.`);
  };

  // Negociere prelungire contract (+60 zile)
  const handleExtendContract = (staff: StaffMember) => {
    if (isGuest && onRequireAuth) {
      onRequireAuth('Pentru a prelungi contractele membrilor din staff, trebuie să fii manager înregistrat!');
      return;
    }
    const extensionBonus = staff.salaryWeekly * 2;
    const spendResult = spendClubBudget(
      extensionBonus,
      'WAGE',
      `Prelungire contract ${staff.roleTitle}: ${staff.name} (+60 zile)`
    );

    if (!spendResult.success) {
      showNotification('❌ Fonduri insuficiente pentru prima de prelungire a contractului!');
      return;
    }

    const updated = staffList.map(s => {
      if (s.id === staff.id) {
        return {
          ...s,
          contractDays: s.contractDays + 60
        };
      }
      return s;
    });

    setStaffList(updated);
    saveClubStaff(updated);
    onFinancesUpdate(spendResult.newFinances);
    showNotification(`✍️ Contractul lui ${staff.name} a fost prelungit cu 60 de zile!`);
  };

  // Concediere membru de staff (Compensație de reziliere)
  const handleFireStaff = (staff: StaffMember) => {
    if (isGuest && onRequireAuth) {
      onRequireAuth('Pentru a gestiona personalul clubului, trebuie să deții un cont de manager înregistrat!');
      return;
    }
    const severancePay = Math.round(staff.salaryWeekly * 2.5);
    const spendResult = spendClubBudget(
      severancePay,
      'STAFF_SEVERANCE',
      `Compensație concediere ${staff.roleTitle}: ${staff.name}`
    );

    if (!spendResult.success) {
      showNotification('❌ Fonduri insuficiente pentru plata compensației de concediere!');
      return;
    }

    // Postul e preluat de un interimar de nivel începător
    const updated = staffList.map(s => {
      if (s.id === staff.id) {
        return {
          ...s,
          name: `Interimar ${s.roleTitle}`,
          country: 'România',
          flag: '🇷🇴',
          age: 35,
          quality: 50,
          salaryWeekly: 2000,
          contractDays: 30
        };
      }
      return s;
    });

    setStaffList(updated);
    saveClubStaff(updated);
    onFinancesUpdate(spendResult.newFinances);
    showNotification(`⚠️ L-ai concediat pe ${staff.name}. Postul a fost preluat temporar de un interimar.`);
  };

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Header Card Personal ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>👔 {t('staff_title')}</span>
              <span className="text-xs font-normal text-zinc-400">(SoccerProject Model)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {t('staff_desc')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoanModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-600/20 border border-amber-500/40 transition flex items-center gap-1.5"
            >
              <span>🏦</span>
              <span>Împrumută niște bani</span>
            </button>
            <div className="bg-zinc-950/80 border border-zinc-800 px-4 py-2 rounded-xl">
              <span className="text-[11px] text-zinc-400 block font-semibold">{t('staff_budget_label')}:</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                €{finances.balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertă Notificare */}
      {notification && (
        <div className="rounded-xl border border-blue-500/40 bg-blue-950/80 text-blue-200 text-xs px-4 py-3 shadow-xl flex items-center justify-between transition backdrop-blur-md">
          <span className="font-semibold">{notification}</span>
          <button onClick={() => setNotification(null)} className="text-blue-400 hover:text-white font-bold ml-3">✕</button>
        </div>
      )}

      {/* ─── Grilă Cele 7 Roluri Oficiale SoccerProject ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => {
          const roleInfo = STAFF_ROLE_TITLES[staff.role];
          return (
            <div 
              key={staff.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 transition p-5 flex flex-col justify-between space-y-4 shadow-lg"
            >
              {/* Antet Card Staff */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{staff.flag}</span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                        {language === 'ro' ? roleInfo.ro : roleInfo.en}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {staff.name}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    {staff.age} ani
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-snug">
                  {language === 'ro' ? roleInfo.descRo : roleInfo.descEn}
                </p>
              </div>

              {/* Statistici: Calitate, Salariu, Contract */}
              <div className="space-y-3 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 text-xs">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>{t('staff_quality')}:</span>
                    <span className="font-bold font-mono text-emerald-400">{staff.quality}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${staff.quality}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-400">{t('staff_salary')}:</span>
                  <span className="font-bold font-mono">€{staff.salaryWeekly.toLocaleString()} / săpt</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-400">{t('staff_contract_days')}:</span>
                  <span className={`font-bold font-mono ${staff.contractDays < 20 ? 'text-rose-400' : 'text-zinc-300'}`}>
                    {staff.contractDays} zile
                  </span>
                </div>

                {staff.isOnCourse && (
                  <div className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-800/50 px-2 py-1 rounded text-center">
                    🎓 La curs de perfecționare ({staff.courseDaysLeft} zile rămase)
                  </div>
                )}
              </div>

              {/* Butoane Acțiune */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleOpenMarket(staff.role)}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition text-center shadow"
                  title="Caută candidați disponibili pe piață"
                >
                  🔍 Înlocuiri
                </button>

                <button
                  onClick={() => handleSendToCourse(staff)}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold rounded-lg border border-zinc-700 transition text-center"
                  title="Trimite la curs de calificare (€8.500)"
                >
                  🎓 Curs (+Cal)
                </button>

                <button
                  onClick={() => handleExtendContract(staff)}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold rounded-lg border border-zinc-700 transition text-center"
                  title="Prelungește contractul cu 60 de zile"
                >
                  ✍️ Prelungește
                </button>

                <button
                  onClick={() => handleFireStaff(staff)}
                  className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[11px] font-semibold rounded-lg border border-rose-800/40 transition text-center"
                  title="Concediază membrul de staff (cu compensație)"
                >
                  🚫 Concediază
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ─── Modal Piață Recrutare Candidați (Staff Market) ─── */}
      {selectedRoleForMarket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 max-w-2xl w-full shadow-2xl text-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Piața de Recrutare: {STAFF_ROLE_TITLES[selectedRoleForMarket].ro}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Alege un candidat disponibil pentru a-ți întări echipa tehnică.
                </p>
              </div>
              <button
                onClick={() => setSelectedRoleForMarket(null)}
                className="text-zinc-400 hover:text-white bg-zinc-800 rounded-lg w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Listă Candidați */}
            <div className="space-y-3">
              {marketCandidates.map((cand) => {
                const signingFee = cand.salaryWeekly * 4;
                return (
                  <div 
                    key={cand.id}
                    className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/50 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cand.flag}</span>
                        <span className="font-bold text-white text-sm">{cand.name}</span>
                        <span className="text-xs text-zinc-500">({cand.age} ani, {cand.country})</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span>Calitate: <strong className="text-emerald-400 font-mono">{cand.quality}%</strong></span>
                        <span>Salariu: <strong className="text-zinc-200 font-mono">€{cand.salaryWeekly.toLocaleString()}</strong> / săpt</span>
                        <span>Primă instalare: <strong className="text-amber-400 font-mono">€{signingFee.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleHireCandidate(cand)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow border border-emerald-500/50 transition active:translate-y-0.5 flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>🤝</span>
                      <span>Angajează</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Împrumută niște bani (1-la-1 SoccerProject) ─── */}
      <BankLoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        finances={finances}
        onFinancesUpdate={onFinancesUpdate}
        isGuest={isGuest}
        onRequireAuth={onRequireAuth}
      />

    </div>
  );
};
