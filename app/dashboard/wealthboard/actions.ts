'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  WealthData,
  WealthDataInsert,
  WealthCategory,
  FinancialGoal,
  GoalMilestone,
} from '@/types/wealth.types'

// ──────────────────────────────────────────────
// Wealth Data CRUD
// ──────────────────────────────────────────────

export async function getWealthEntries(
  category?: WealthCategory
): Promise<WealthData[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('wealth_data')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error || !data) return []
  return data as WealthData[]
}

export async function getLatestWealthEntry(
  category?: WealthCategory
): Promise<WealthData | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let query = supabase
    .from('wealth_data')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query.maybeSingle()
  if (error || !data) return null
  return data as WealthData
}

export async function createWealthEntry(
  input: WealthDataInsert
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('wealth_data')
    .insert({ ...input, user_id: user.id })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

export async function updateWealthEntry(
  id: string,
  input: Partial<WealthDataInsert>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('wealth_data')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

export async function deleteWealthEntry(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('wealth_data')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

// ──────────────────────────────────────────────
// Financial Goals CRUD
// ──────────────────────────────────────────────

export async function getFinancialGoals(
  category?: WealthCategory
): Promise<FinancialGoal[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('financial_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('priority', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error || !data) return []
  return data as FinancialGoal[]
}

export async function createFinancialGoal(input: {
  category?: WealthCategory;
  goal_type: string;
  title: string;
  description?: string;
  target_amount?: number;
  target_date?: string;
  priority?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('financial_goals')
    .insert({ ...input, user_id: user.id })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

export async function updateFinancialGoal(
  id: string,
  input: Partial<FinancialGoal>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { id: _, user_id: __, created_at: ___, ...updateData } = input as Record<string, unknown>

  const { error } = await supabase
    .from('financial_goals')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

export async function deleteFinancialGoal(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

// ──────────────────────────────────────────────
// Goal Milestones
// ──────────────────────────────────────────────

export async function getGoalMilestones(
  goalId: string
): Promise<GoalMilestone[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('goal_milestones')
    .select('*')
    .eq('goal_id', goalId)
    .order('target_amount', { ascending: true })

  if (error || !data) return []
  return data as GoalMilestone[]
}

export async function createGoalMilestone(input: {
  goal_id: string;
  title: string;
  target_amount: number;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('goal_milestones')
    .insert(input)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

export async function toggleMilestoneComplete(
  id: string,
  isCompleted: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('goal_milestones')
    .update({
      is_completed: isCompleted,
      achieved_at: isCompleted ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}

// ──────────────────────────────────────────────
// Wealth Summary (aggregated data for dashboard)
// ──────────────────────────────────────────────

export async function getWealthSummary(category?: WealthCategory) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let query = supabase
    .from('wealth_data')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(2)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error || !data || data.length === 0) return null

  const latest = data[0] as WealthData
  const previous = data.length > 1 ? (data[1] as WealthData) : null

  const netWorthChange = previous
    ? Number(latest.net_worth) - Number(previous.net_worth)
    : 0
  const netWorthChangePercent = previous && Number(previous.net_worth) > 0
    ? (netWorthChange / Number(previous.net_worth)) * 100
    : 0

  return {
    latestEntry: latest,
    previousEntry: previous,
    netWorthChange,
    netWorthChangePercent,
  }
}
