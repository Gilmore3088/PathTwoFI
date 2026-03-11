-- SECURITY DEFINER function to serve public wealth data
-- Bypasses RLS to return only what privacy_settings allow
CREATE OR REPLACE FUNCTION get_public_wealth_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  settings RECORD;
  entries JSONB;
  goals JSONB;
BEGIN
  -- Get the first user's privacy settings (single-user app)
  SELECT * INTO settings FROM privacy_settings LIMIT 1;

  IF settings IS NULL OR NOT settings.is_public THEN
    RETURN jsonb_build_object('is_public', false);
  END IF;

  -- Get entries for allowed categories
  SELECT jsonb_agg(row_to_json(w.*)::jsonb ORDER BY w.date ASC)
  INTO entries
  FROM wealth_data w
  WHERE (
    (settings.show_combined_category AND w.category = 'Combined') OR
    (settings.show_his_category AND w.category = 'His') OR
    (settings.show_her_category AND w.category = 'Her')
  );

  -- Get goals for allowed categories
  SELECT jsonb_agg(row_to_json(g.*)::jsonb ORDER BY g.priority ASC)
  INTO goals
  FROM financial_goals g
  WHERE (
    (settings.show_combined_category AND g.category = 'Combined') OR
    (settings.show_his_category AND g.category = 'His') OR
    (settings.show_her_category AND g.category = 'Her')
  );

  RETURN jsonb_build_object(
    'is_public', true,
    'display_name', (SELECT display_name FROM profiles LIMIT 1),
    'show_net_worth', settings.show_net_worth,
    'show_assets', settings.show_assets,
    'show_debts', settings.show_debts,
    'show_cash_flow', settings.show_cash_flow,
    'show_goals', settings.show_goals,
    'entries', COALESCE(entries, '[]'::jsonb),
    'goals', COALESCE(goals, '[]'::jsonb)
  );
END;
$$;
