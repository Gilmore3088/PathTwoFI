-- Enable moddatetime extension for auto-updating updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- Wealth Data: Core financial tracking snapshots
-- Supports His/Her/Combined categories for household tracking
CREATE TABLE wealth_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Combined' CHECK (category IN ('His', 'Her', 'Combined')),

  -- Core Totals
  net_worth NUMERIC(12,2) NOT NULL,
  investments NUMERIC(12,2) NOT NULL DEFAULT 0,
  cash NUMERIC(12,2) NOT NULL DEFAULT 0,
  liabilities NUMERIC(12,2) NOT NULL DEFAULT 0,
  savings_rate NUMERIC(5,2) DEFAULT 0,

  -- Asset Breakdown
  stocks NUMERIC(12,2) DEFAULT 0,
  bonds NUMERIC(12,2) DEFAULT 0,
  real_estate NUMERIC(12,2) DEFAULT 0,
  crypto NUMERIC(12,2) DEFAULT 0,
  commodities NUMERIC(12,2) DEFAULT 0,
  alternative_investments NUMERIC(12,2) DEFAULT 0,

  -- Retirement Accounts
  retirement_401k NUMERIC(12,2) DEFAULT 0,
  retirement_ira NUMERIC(12,2) DEFAULT 0,
  retirement_roth NUMERIC(12,2) DEFAULT 0,
  hsa NUMERIC(12,2) DEFAULT 0,

  -- Cash Accounts
  checking_accounts NUMERIC(12,2) DEFAULT 0,
  savings_accounts NUMERIC(12,2) DEFAULT 0,

  -- Debt Breakdown
  mortgage NUMERIC(12,2) DEFAULT 0,
  credit_cards NUMERIC(12,2) DEFAULT 0,
  student_loans NUMERIC(12,2) DEFAULT 0,
  auto_loans NUMERIC(12,2) DEFAULT 0,
  personal_loans NUMERIC(12,2) DEFAULT 0,
  other_debts NUMERIC(12,2) DEFAULT 0,

  -- Monthly Cash Flow
  monthly_income NUMERIC(10,2) DEFAULT 0,
  monthly_expenses NUMERIC(10,2) DEFAULT 0,
  monthly_savings NUMERIC(10,2) DEFAULT 0,

  -- Metadata
  notes TEXT,
  is_quarterly BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_wealth_data_user ON wealth_data(user_id);
CREATE INDEX idx_wealth_data_date ON wealth_data(date DESC);
CREATE INDEX idx_wealth_data_category ON wealth_data(category);

-- Auto-update updated_at
CREATE TRIGGER set_wealth_data_updated_at
  BEFORE UPDATE ON wealth_data
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- RLS
ALTER TABLE wealth_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wealth data"
  ON wealth_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wealth data"
  ON wealth_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wealth data"
  ON wealth_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wealth data"
  ON wealth_data FOR DELETE
  USING (auth.uid() = user_id);
