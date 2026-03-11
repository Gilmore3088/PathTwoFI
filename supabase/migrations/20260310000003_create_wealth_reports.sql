-- Periodic wealth reports (monthly/quarterly/annual summaries)
CREATE TABLE wealth_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('monthly', 'quarterly', 'annual')),
  category TEXT NOT NULL DEFAULT 'Combined' CHECK (category IN ('His', 'Her', 'Combined')),

  -- Calculated Metrics
  total_assets NUMERIC(12,2) NOT NULL,
  total_liabilities NUMERIC(12,2) NOT NULL,
  net_worth_change NUMERIC(12,2),
  net_worth_change_percent NUMERIC(8,4),
  savings_rate_actual NUMERIC(5,2),

  -- Performance
  investment_return NUMERIC(8,4),
  debt_paydown_amount NUMERIC(12,2),
  fire_progress_percent NUMERIC(5,2),

  -- Goals
  goals_completed INTEGER DEFAULT 0,
  milestones_reached INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_user ON wealth_reports(user_id);
CREATE INDEX idx_reports_date ON wealth_reports(report_date DESC);
CREATE INDEX idx_reports_type ON wealth_reports(report_type);

-- RLS
ALTER TABLE wealth_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON wealth_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON wealth_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON wealth_reports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON wealth_reports FOR DELETE
  USING (auth.uid() = user_id);
