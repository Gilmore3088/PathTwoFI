// Parser for the PathTwoFI balance sheet format
// Two columns: labels in A, values in B
// Extracts His (James), Her (Nikoly), and Combined totals

export interface BalanceSheetResult {
  date: string;
  his: Record<string, number>;
  her: Record<string, number>;
  combined: Record<string, number>;
  raw: Record<string, string | number>;
}

// Clean currency strings: "$4,532" -> 4532, "$-" -> 0
function parseAmount(val: string | number | null | undefined): number {
  if (val === null || val === undefined) return 0;
  const str = String(val).replace(/[$,\s]/g, '');
  if (str === '-' || str === '') return 0;
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Parse date: "3/11/26" -> "2026-03-11"
function parseDate(val: string | number | null | undefined): string {
  if (!val) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }

  const str = String(val).trim();

  // Handle Date objects from Excel
  if (typeof val === 'object' && val !== null && 'toISOString' in (val as object)) {
    return (val as Date).toISOString().split('T')[0];
  }

  // M/D/YY or M/D/YYYY
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (match) {
    const month = match[1].padStart(2, '0');
    const day = match[2].padStart(2, '0');
    let year = match[3];
    if (year.length === 2) {
      year = `20${year}`;
    }
    return `${year}-${month}-${day}`;
  }

  return str;
}

interface RowPair {
  label: string;
  value: string | number;
}

export function parseBalanceSheet(rows: RowPair[]): BalanceSheetResult {
  const raw: Record<string, string | number> = {};
  const his: Record<string, number> = {};
  const her: Record<string, number> = {};
  const combined: Record<string, number> = {};

  let date = '';
  let section = '';
  let subsection = '';

  for (const { label, value } of rows) {
    const l = label.trim();
    const lLower = l.toLowerCase();

    // Store raw for debugging
    if (l && value !== undefined && value !== null && String(value).trim() !== '') {
      raw[l] = value;
    }

    // Extract date
    if (lLower === 'date' || lLower.startsWith('date')) {
      date = parseDate(value);
      continue;
    }

    // Track sections
    if (lLower === 'assets') { section = 'assets'; continue; }
    if (lLower === 'liabilities') { section = 'liabilities'; continue; }
    if (lLower.includes('bank accounts')) { subsection = 'bank'; continue; }
    if (lLower.includes('brokerage')) { subsection = 'brokerage'; continue; }
    if (lLower.includes('hsa cash')) { subsection = 'hsa_cash'; continue; }
    if (lLower.includes('hsa investment')) { subsection = 'hsa_invest'; continue; }
    if (lLower === 'crypto') { subsection = 'crypto'; continue; }
    if (lLower === 'retirement') { subsection = 'retirement'; continue; }
    if (lLower.includes('credit accounts') || lLower.includes('payables')) { subsection = 'credit_cards'; continue; }
    if (lLower.includes('other payables')) { subsection = 'other_payables'; continue; }
    if (lLower.includes('loans - mortgage') || lLower.includes('mortgage')) {
      if (!lLower.includes('total')) { subsection = 'mortgage'; }
      continue;
    }
    if (lLower.includes('loans - student')) { subsection = 'student_loans'; continue; }

    const amount = parseAmount(value);
    if (amount === 0 && !String(value).includes('$')) continue;

    // Map James = His, Nikoly = Her
    const isJames = lLower.startsWith('james');
    const isNikoly = lLower.startsWith('nikoly') || lLower.startsWith('nikol');

    if (isJames || isNikoly) {
      const target = isJames ? his : her;

      if (subsection === 'bank') {
        target.checking_accounts = (target.checking_accounts || 0) + amount;
      } else if (subsection === 'brokerage') {
        target.stocks = (target.stocks || 0) + amount;
      } else if (subsection === 'hsa_cash' || subsection === 'hsa_invest') {
        target.hsa = (target.hsa || 0) + amount;
      } else if (subsection === 'crypto') {
        target.crypto = (target.crypto || 0) + amount;
      } else if (subsection === 'retirement') {
        target.retirement_401k = (target.retirement_401k || 0) + amount;
      } else if (subsection === 'credit_cards') {
        target.credit_cards = (target.credit_cards || 0) + Math.abs(amount);
      } else if (subsection === 'other_payables') {
        target.other_debts = (target.other_debts || 0) + Math.abs(amount);
      } else if (subsection === 'student_loans') {
        target.student_loans = (target.student_loans || 0) + Math.abs(amount);
      }
      continue;
    }

    // Combined/total values
    if (lLower === 'house') {
      combined.savings_accounts = amount; // House cash stored separately
      continue;
    }
    if (lLower === 'home equity') {
      combined.real_estate = amount;
      continue;
    }
    if (lLower.includes('physical gold')) {
      combined.commodities = (combined.commodities || 0) + amount;
      continue;
    }
    if (lLower.includes('physical silver')) {
      combined.commodities = (combined.commodities || 0) + amount;
      continue;
    }
    if (lLower.includes('3522 mortgage') || (subsection === 'mortgage' && amount > 10000)) {
      combined.mortgage = Math.abs(amount);
      continue;
    }
    if (lLower === 'total cash') {
      combined.cash = amount;
      continue;
    }
    if (lLower === 'total investments') {
      combined.investments = amount;
      continue;
    }
    if (lLower === 'total liabilities') {
      combined.liabilities = Math.abs(amount);
      continue;
    }
    if (lLower === 'net worth') {
      combined.net_worth = amount;
      continue;
    }
    if (lLower.includes('net worth excluding home') && !lLower.includes('goal')) {
      // This is the primary metric the user tracks
      raw['net_worth_excl_home'] = amount;
      continue;
    }
    if (lLower === 'total retirement') {
      combined.retirement_401k = amount;
      continue;
    }
    if (lLower === 'total credit card debt') {
      combined.credit_cards = Math.abs(amount);
      continue;
    }
  }

  // Build combined from His + Her where combined doesn't have totals
  const fields = [
    'checking_accounts', 'stocks', 'hsa', 'crypto',
    'retirement_401k', 'credit_cards', 'student_loans', 'other_debts',
  ];

  for (const field of fields) {
    if (!combined[field]) {
      combined[field] = (his[field] || 0) + (her[field] || 0);
    }
  }

  // Calculate His/Her net worth and totals
  for (const person of [his, her]) {
    const assets = (person.checking_accounts || 0) + (person.stocks || 0) +
      (person.hsa || 0) + (person.crypto || 0) + (person.retirement_401k || 0);
    const debts = (person.credit_cards || 0) + (person.student_loans || 0) +
      (person.other_debts || 0);
    person.investments = (person.stocks || 0) + (person.hsa || 0) +
      (person.crypto || 0) + (person.retirement_401k || 0);
    person.cash = person.checking_accounts || 0;
    person.liabilities = debts;
    person.net_worth = assets - debts;
  }

  // Ensure combined has net_worth
  if (!combined.net_worth) {
    combined.net_worth = (combined.investments || 0) + (combined.cash || 0) -
      (combined.liabilities || 0);
  }

  if (!date) {
    const now = new Date();
    date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }

  return { date, his, her, combined, raw };
}
