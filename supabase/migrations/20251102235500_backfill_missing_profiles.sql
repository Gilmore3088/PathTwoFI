-- Backfill profiles for any existing users who don't have one
-- This handles cases where users were created before the trigger was set up

INSERT INTO public.profiles (id, email, first_name, avatar_url)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'first_name' as first_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

