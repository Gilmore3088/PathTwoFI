-- Financial Goals with milestone tracking
CREATE TABLE financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'Combined' CHECK (category IN ('His', 'Her', 'Combined')),
  goal_type TEXT NOT NULL CHECK (goal_type IN ('net_worth', 'savings_rate', 'debt_payoff', 'investment', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC(12,2),
  current_amount NUMERIC(12,2) DEFAULT 0,
  target_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal Milestones
CREATE TABLE goal_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES financial_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_goals_user ON financial_goals(user_id);
CREATE INDEX idx_goals_category ON financial_goals(category);
CREATE INDEX idx_milestones_goal ON goal_milestones(goal_id);

-- Auto-update
CREATE TRIGGER set_goals_updated_at
  BEFORE UPDATE ON financial_goals
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- RLS for financial_goals
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON financial_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON financial_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON financial_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON financial_goals FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for goal_milestones (via goal ownership)
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own milestones"
  ON goal_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM financial_goals
    WHERE financial_goals.id = goal_milestones.goal_id
    AND financial_goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own milestones"
  ON goal_milestones FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM financial_goals
    WHERE financial_goals.id = goal_milestones.goal_id
    AND financial_goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own milestones"
  ON goal_milestones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM financial_goals
    WHERE financial_goals.id = goal_milestones.goal_id
    AND financial_goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own milestones"
  ON goal_milestones FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM financial_goals
    WHERE financial_goals.id = goal_milestones.goal_id
    AND financial_goals.user_id = auth.uid()
  ));
