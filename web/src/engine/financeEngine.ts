export interface BankLoan {
  amount: number;            // 500000 | 1500000 | 2500000
  totalWeeks: number;        // 18 | 36 | 54
  interestPercent: number;   // 5 | 10 | 15
  totalToRepay: number;      // amount * (1 + interestPercent / 100)
  weeklyInstallment: number; // totalToRepay / totalWeeks
  remainingWeeks: number;
  dateTaken: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'WAGE' | 'STAFF_HIRE' | 'STAFF_SEVERANCE' | 'COURSE' | 'TICKET_SALES' | 'TRANSFER' | 'BONUS' | 'FACILITY_UPGRADE' | 'LOAN';
  amount: number;
  description: string;
  date: string;
}

export interface ClubFinances {
  balance: number; // Sold curent club
  weeklyStaffWages: number;
  weeklyPlayerWages: number;
  activeLoan?: BankLoan | null;
  transactions: FinancialTransaction[];
}

export const INITIAL_CLUB_FINANCES: ClubFinances = {
  balance: 15000000, // €15.000.000
  weeklyStaffWages: 69700,
  weeklyPlayerWages: 185000,
  transactions: [
    {
      id: 'tx-init',
      type: 'INCOME',
      category: 'BONUS',
      amount: 15000000,
      description: 'Capital inițial de lansare club și preluare echipă',
      date: new Date().toLocaleDateString()
    }
  ]
};

export function loadClubFinances(): ClubFinances {
  if (typeof window === 'undefined') return INITIAL_CLUB_FINANCES;
  try {
    const saved = localStorage.getItem('footballin_club_finances');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CLUB_FINANCES;
}

export function saveClubFinances(finances: ClubFinances) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('footballin_club_finances', JSON.stringify(finances));
  }
}

/**
 * Cheltuiește bani din bugetul clubului dacă există fonduri suficiente
 */
export function spendClubBudget(
  amount: number,
  category: FinancialTransaction['category'],
  description: string
): { success: boolean; newFinances: ClubFinances } {
  const finances = loadClubFinances();
  if (finances.balance < amount) {
    return { success: false, newFinances: finances };
  }

  finances.balance -= amount;
  finances.transactions.unshift({
    id: `tx-${Date.now()}`,
    type: 'EXPENSE',
    category,
    amount,
    description,
    date: new Date().toLocaleDateString()
  });

  saveClubFinances(finances);
  return { success: true, newFinances: finances };
}

/**
 * Încasează bani în bugetul clubului
 */
export function receiveClubBudget(
  amount: number,
  category: FinancialTransaction['category'],
  description: string
): ClubFinances {
  const finances = loadClubFinances();
  finances.balance += amount;
  finances.transactions.unshift({
    id: `tx-${Date.now()}`,
    type: 'INCOME',
    category,
    amount,
    description,
    date: new Date().toLocaleDateString()
  });

  saveClubFinances(finances);
  return finances;
}
