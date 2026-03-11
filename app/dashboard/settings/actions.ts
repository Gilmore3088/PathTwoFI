'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PrivacySettings, PrivacyGranularity } from '@/types/wealth.types'

export async function getPrivacySettings(): Promise<PrivacySettings | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('privacy_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !data) return null
  return data as PrivacySettings
}

export async function upsertPrivacySettings(input: {
  is_public: boolean;
  show_net_worth: PrivacyGranularity;
  show_assets: PrivacyGranularity;
  show_debts: PrivacyGranularity;
  show_cash_flow: PrivacyGranularity;
  show_goals: PrivacyGranularity;
  show_his_category: boolean;
  show_her_category: boolean;
  show_combined_category: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('privacy_settings')
    .upsert(
      { ...input, user_id: user.id },
      { onConflict: 'user_id' }
    )

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings')
  revalidatePath('/wealthboard')
  return { success: true }
}

export async function updateDisplayName(
  displayName: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings')
  revalidatePath('/wealthboard')
  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !data) return null
  return data
}
