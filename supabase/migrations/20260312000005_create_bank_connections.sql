-- Bank connections for read-only account linking via Teller/Plaid
CREATE TABLE bank_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'teller' CHECK (provider IN ('teller', 'plaid')),
  enrollment_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stale', 'expired', 'disconnected')),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, enrollment_id)
);

CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES bank_connections(id) ON DELETE CASCADE,
  external_account_id TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  subtype TEXT,
  institution_name TEXT NOT NULL,
  mapped_field TEXT,
  mapped_category TEXT DEFAULT 'Combined' CHECK (mapped_category IN ('His', 'Her', 'Combined')),
  last_balance NUMERIC(12,2),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own connections" ON bank_connections
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own accounts" ON bank_accounts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM bank_connections
    WHERE bank_connections.id = bank_accounts.connection_id
    AND bank_connections.user_id = auth.uid()
  ));

-- Auto-update timestamps
CREATE TRIGGER on_bank_connections_updated
  BEFORE UPDATE ON bank_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
