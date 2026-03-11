import Papa from 'papaparse';

export interface ParsedRow {
  [key: string]: string;
}

export interface ParseResult {
  headers: string[];
  rows: ParsedRow[];
  errors: string[];
}

export function parseCsvText(text: string): ParseResult {
  const result = Papa.parse<ParsedRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  return {
    headers: result.meta.fields || [],
    rows: result.data,
    errors: result.errors.map((e) => `Row ${e.row}: ${e.message}`),
  };
}

// All wealth_data numeric fields that can be mapped
export const WEALTH_FIELDS = [
  { key: 'net_worth', label: 'Net Worth' },
  { key: 'investments', label: 'Total Investments' },
  { key: 'cash', label: 'Total Cash' },
  { key: 'liabilities', label: 'Total Liabilities' },
  { key: 'savings_rate', label: 'Savings Rate' },
  { key: 'stocks', label: 'Stocks' },
  { key: 'bonds', label: 'Bonds' },
  { key: 'real_estate', label: 'Real Estate' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'alternative_investments', label: 'Alternative Investments' },
  { key: 'retirement_401k', label: '401(k)' },
  { key: 'retirement_ira', label: 'IRA' },
  { key: 'retirement_roth', label: 'Roth IRA' },
  { key: 'hsa', label: 'HSA' },
  { key: 'checking_accounts', label: 'Checking' },
  { key: 'savings_accounts', label: 'Savings Accounts' },
  { key: 'mortgage', label: 'Mortgage' },
  { key: 'credit_cards', label: 'Credit Cards' },
  { key: 'student_loans', label: 'Student Loans' },
  { key: 'auto_loans', label: 'Auto Loans' },
  { key: 'personal_loans', label: 'Personal Loans' },
  { key: 'other_debts', label: 'Other Debts' },
  { key: 'monthly_income', label: 'Monthly Income' },
  { key: 'monthly_expenses', label: 'Monthly Expenses' },
  { key: 'monthly_savings', label: 'Monthly Savings' },
] as const;

// Map of common column name variations to our field keys
const COLUMN_ALIASES: Record<string, string> = {
  'net worth': 'net_worth',
  'networth': 'net_worth',
  'net_worth': 'net_worth',
  'total investments': 'investments',
  'investments': 'investments',
  'total cash': 'cash',
  'cash': 'cash',
  'total liabilities': 'liabilities',
  'liabilities': 'liabilities',
  'savings rate': 'savings_rate',
  'savings_rate': 'savings_rate',
  'stocks': 'stocks',
  'bonds': 'bonds',
  'real estate': 'real_estate',
  'real_estate': 'real_estate',
  'crypto': 'crypto',
  'cryptocurrency': 'crypto',
  '401k': 'retirement_401k',
  '401(k)': 'retirement_401k',
  'retirement_401k': 'retirement_401k',
  'ira': 'retirement_ira',
  'retirement_ira': 'retirement_ira',
  'roth': 'retirement_roth',
  'roth ira': 'retirement_roth',
  'retirement_roth': 'retirement_roth',
  'hsa': 'hsa',
  'checking': 'checking_accounts',
  'checking_accounts': 'checking_accounts',
  'checking accounts': 'checking_accounts',
  'savings': 'savings_accounts',
  'savings_accounts': 'savings_accounts',
  'savings accounts': 'savings_accounts',
  'mortgage': 'mortgage',
  'credit cards': 'credit_cards',
  'credit_cards': 'credit_cards',
  'student loans': 'student_loans',
  'student_loans': 'student_loans',
  'auto loans': 'auto_loans',
  'auto_loans': 'auto_loans',
  'monthly income': 'monthly_income',
  'monthly_income': 'monthly_income',
  'income': 'monthly_income',
  'monthly expenses': 'monthly_expenses',
  'monthly_expenses': 'monthly_expenses',
  'expenses': 'monthly_expenses',
  'monthly savings': 'monthly_savings',
  'monthly_savings': 'monthly_savings',
  'date': 'date',
  'category': 'category',
  'notes': 'notes',
};

export function autoDetectMappings(
  headers: string[]
): Record<string, string> {
  const mappings: Record<string, string> = {};

  for (const header of headers) {
    const normalized = header.toLowerCase().trim();
    const match = COLUMN_ALIASES[normalized];
    if (match) {
      mappings[header] = match;
    }
  }

  return mappings;
}
