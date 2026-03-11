-- Privacy settings for controlling public data visibility
CREATE TABLE privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,

  -- Per-section visibility: 'hidden' | 'percentage' | 'exact'
  show_net_worth TEXT DEFAULT 'exact' CHECK (show_net_worth IN ('hidden', 'percentage', 'exact')),
  show_assets TEXT DEFAULT 'percentage' CHECK (show_assets IN ('hidden', 'percentage', 'exact')),
  show_debts TEXT DEFAULT 'hidden' CHECK (show_debts IN ('hidden', 'percentage', 'exact')),
  show_cash_flow TEXT DEFAULT 'hidden' CHECK (show_cash_flow IN ('hidden', 'percentage', 'exact')),
  show_goals TEXT DEFAULT 'percentage' CHECK (show_goals IN ('hidden', 'percentage', 'exact')),
  show_his_category BOOLEAN DEFAULT FALSE,
  show_her_category BOOLEAN DEFAULT FALSE,
  show_combined_category BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

-- Owner full access
CREATE POLICY "Users manage own privacy" ON privacy_settings
  FOR ALL USING (auth.uid() = user_id);

-- Anon can read (needed to check is_public and render public page)
CREATE POLICY "Public can read privacy settings" ON privacy_settings
  FOR SELECT TO anon USING (true);

-- Auto-update updated_at
CREATE TRIGGER on_privacy_settings_updated
  BEFORE UPDATE ON privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
