export type WealthCategory = 'His' | 'Her' | 'Combined';

export interface WealthData {
  id: string;
  user_id: string;
  date: string;
  category: WealthCategory;
  net_worth: number;
  investments: number;
  cash: number;
  liabilities: number;
  savings_rate: number;
  stocks: number;
  bonds: number;
  real_estate: number;
  crypto: number;
  commodities: number;
  alternative_investments: number;
  retirement_401k: number;
  retirement_ira: number;
  retirement_roth: number;
  hsa: number;
  checking_accounts: number;
  savings_accounts: number;
  mortgage: number;
  credit_cards: number;
  student_loans: number;
  auto_loans: number;
  personal_loans: number;
  other_debts: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_savings: number;
  notes: string | null;
  is_quarterly: boolean;
  created_at: string;
  updated_at: string;
}

export interface WealthDataInsert {
  date: string;
  category?: WealthCategory;
  net_worth: number;
  investments?: number;
  cash?: number;
  liabilities?: number;
  savings_rate?: number;
  stocks?: number;
  bonds?: number;
  real_estate?: number;
  crypto?: number;
  commodities?: number;
  alternative_investments?: number;
  retirement_401k?: number;
  retirement_ira?: number;
  retirement_roth?: number;
  hsa?: number;
  checking_accounts?: number;
  savings_accounts?: number;
  mortgage?: number;
  credit_cards?: number;
  student_loans?: number;
  auto_loans?: number;
  personal_loans?: number;
  other_debts?: number;
  monthly_income?: number;
  monthly_expenses?: number;
  monthly_savings?: number;
  notes?: string | null;
  is_quarterly?: boolean;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  category: WealthCategory;
  goal_type: 'net_worth' | 'savings_rate' | 'debt_payoff' | 'investment' | 'custom';
  title: string;
  description: string | null;
  target_amount: number | null;
  current_amount: number;
  target_date: string | null;
  priority: 'high' | 'medium' | 'low';
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  title: string;
  target_amount: number;
  is_completed: boolean;
  achieved_at: string | null;
  created_at: string;
}

export interface WealthReport {
  id: string;
  user_id: string;
  report_date: string;
  report_type: 'monthly' | 'quarterly' | 'annual';
  category: WealthCategory;
  total_assets: number;
  total_liabilities: number;
  net_worth_change: number | null;
  net_worth_change_percent: number | null;
  savings_rate_actual: number | null;
  investment_return: number | null;
  debt_paydown_amount: number | null;
  fire_progress_percent: number | null;
  goals_completed: number;
  milestones_reached: number;
  created_at: string;
}

export interface WealthSummary {
  latestEntry: WealthData | null;
  previousEntry: WealthData | null;
  netWorthChange: number;
  netWorthChangePercent: number;
  fireProgress: FireProgress;
  totalAssets: number;
  totalLiabilities: number;
}

export interface FireProgress {
  currentNetWorth: number;
  todayGoal: number;
  todayStretchGoal: number;
  fireTargetDate: string;
  yearsToFire: number;
  inflationRate: number;
  futureGoal: number;
  futureStretchGoal: number;
  progressPercent: number;
  stretchProgressPercent: number;
}

export interface AssetAllocation {
  label: string;
  value: number;
  color: string;
}

export interface DebtBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface CashFlow {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}
