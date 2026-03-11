-- Add display_name and bio to profiles for anonymous public display
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT 'Anonymous',
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- Allow anon to read display_name for public wealthboard
CREATE POLICY "Public can read display name"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);
