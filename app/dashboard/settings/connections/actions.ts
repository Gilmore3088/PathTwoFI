'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAccounts, getAccountBalance } from '@/lib/teller'
import type { TellerAccount } from '@/lib/teller'

export interface BankConnection {
  id: string;
  user_id: string;
  provider: string;
  enrollment_id: string;
  institution_name: string;
  status: string;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  id: string;
  connection_id: string;
  external_account_id: string;
  account_name: string;
  account_type: string;
  subtype: string | null;
  institution_name: string;
  mapped_field: string | null;
  mapped_category: string;
  last_balance: number | null;
  last_synced_at: string | null;
  created_at: string;
}

// Get all connections with their accounts
export async function getBankConnections(): Promise<
  (BankConnection & { accounts: BankAccount[] })[]
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: connections, error } = await supabase
    .from('bank_connections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !connections) return []

  const result = []
  for (const conn of connections) {
    const { data: accounts } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('connection_id', conn.id)
      .order('account_name', { ascending: true })

    result.push({
      ...(conn as BankConnection),
      accounts: (accounts || []) as BankAccount[],
    })
  }

  return result
}

// Save a new bank connection after Teller Connect
export async function saveBankConnection(input: {
  accessToken: string;
  enrollmentId: string;
  institutionName: string;
  provider?: string;
}): Promise<{ success: boolean; error?: string; connectionId?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Store the connection
  const { data: connection, error: connError } = await supabase
    .from('bank_connections')
    .upsert(
      {
        user_id: user.id,
        provider: input.provider || 'teller',
        enrollment_id: input.enrollmentId,
        institution_name: input.institutionName,
        status: 'active',
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,enrollment_id' }
    )
    .select('id')
    .single()

  if (connError || !connection) {
    return { success: false, error: connError?.message || 'Failed to save connection' }
  }

  // Fetch accounts from Teller and store them
  try {
    const accounts: TellerAccount[] = await getAccounts(input.accessToken)

    for (const account of accounts) {
      // Fetch initial balance
      let balance: number | null = null
      try {
        const bal = await getAccountBalance(input.accessToken, account.id)
        balance = parseFloat(bal.ledger)
      } catch {
        // Balance fetch can fail for some account types
      }

      await supabase
        .from('bank_accounts')
        .upsert(
          {
            connection_id: connection.id,
            external_account_id: account.id,
            account_name: account.name,
            account_type: account.type,
            subtype: account.subtype,
            institution_name: account.institution.name,
            last_balance: balance,
            last_synced_at: new Date().toISOString(),
          },
          { onConflict: 'external_account_id' }
        )
    }
  } catch (err) {
    // Connection saved but account fetch failed -- mark as stale
    await supabase
      .from('bank_connections')
      .update({ status: 'stale' })
      .eq('id', connection.id)

    return {
      success: true,
      connectionId: connection.id,
      error: 'Connection saved but failed to fetch accounts. Try syncing later.',
    }
  }

  revalidatePath('/dashboard/settings/connections')
  return { success: true, connectionId: connection.id }
}

// Update account mapping (which wealth_data field this account maps to)
export async function updateAccountMapping(
  accountId: string,
  mappedField: string | null,
  mappedCategory: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('bank_accounts')
    .update({ mapped_field: mappedField, mapped_category: mappedCategory })
    .eq('id', accountId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings/connections')
  return { success: true }
}

// Sync balances for a connection
export async function syncBankConnection(
  connectionId: string,
  accessToken: string
): Promise<{ success: boolean; error?: string; synced: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized', synced: 0 }

  const { data: accounts } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('connection_id', connectionId)

  if (!accounts || accounts.length === 0) {
    return { success: false, error: 'No accounts found', synced: 0 }
  }

  let synced = 0
  for (const account of accounts) {
    try {
      const balance = await getAccountBalance(accessToken, account.external_account_id)
      await supabase
        .from('bank_accounts')
        .update({
          last_balance: parseFloat(balance.ledger),
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', account.id)
      synced++
    } catch {
      // Individual account sync failure -- continue with others
    }
  }

  // Update connection sync timestamp
  await supabase
    .from('bank_connections')
    .update({
      status: 'active',
      last_synced_at: new Date().toISOString(),
    })
    .eq('id', connectionId)

  revalidatePath('/dashboard/settings/connections')
  return { success: true, synced }
}

// Disconnect a bank
export async function disconnectBank(
  connectionId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('bank_connections')
    .delete()
    .eq('id', connectionId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings/connections')
  return { success: true }
}

// Apply bank balances to wealth_data
// Creates or updates a wealth_data entry for the current month
export async function applyBankBalancesToWealth(
  connectionId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Get mapped accounts with balances
  const { data: accounts } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('connection_id', connectionId)
    .not('mapped_field', 'is', null)

  if (!accounts || accounts.length === 0) {
    return { success: false, error: 'No mapped accounts found. Map accounts to fields first.' }
  }

  // Group by category
  const categoryUpdates: Record<string, Record<string, number>> = {}

  for (const account of accounts) {
    const cat = account.mapped_category || 'Combined'
    if (!categoryUpdates[cat]) categoryUpdates[cat] = {}
    const field = account.mapped_field as string
    categoryUpdates[cat][field] = (categoryUpdates[cat][field] || 0) + (account.last_balance || 0)
  }

  const today = new Date()
  const monthDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`

  for (const [category, fields] of Object.entries(categoryUpdates)) {
    // Get existing entry for this month or latest entry for carry-forward
    const { data: existing } = await supabase
      .from('wealth_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', category)
      .eq('date', monthDate)
      .maybeSingle()

    const { data: latest } = await supabase
      .from('wealth_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', category)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Start from existing entry or carry forward from latest
    const base = existing || latest || {}
    const record: Record<string, unknown> = {
      user_id: user.id,
      date: monthDate,
      category,
      // Carry forward all fields from base
      net_worth: base.net_worth || 0,
      investments: base.investments || 0,
      cash: base.cash || 0,
      liabilities: base.liabilities || 0,
      savings_rate: base.savings_rate || 0,
      stocks: base.stocks || 0,
      bonds: base.bonds || 0,
      real_estate: base.real_estate || 0,
      crypto: base.crypto || 0,
      commodities: base.commodities || 0,
      alternative_investments: base.alternative_investments || 0,
      retirement_401k: base.retirement_401k || 0,
      retirement_ira: base.retirement_ira || 0,
      retirement_roth: base.retirement_roth || 0,
      hsa: base.hsa || 0,
      checking_accounts: base.checking_accounts || 0,
      savings_accounts: base.savings_accounts || 0,
      mortgage: base.mortgage || 0,
      credit_cards: base.credit_cards || 0,
      student_loans: base.student_loans || 0,
      auto_loans: base.auto_loans || 0,
      personal_loans: base.personal_loans || 0,
      other_debts: base.other_debts || 0,
      monthly_income: base.monthly_income || 0,
      monthly_expenses: base.monthly_expenses || 0,
      monthly_savings: base.monthly_savings || 0,
    }

    // Overwrite only bank-mapped fields
    for (const [field, value] of Object.entries(fields)) {
      record[field] = value
    }

    // Recalculate net_worth
    const inv = Number(record.investments) || 0
    const cash = Number(record.cash) || 0
    const liab = Number(record.liabilities) || 0
    record.net_worth = inv + cash - liab

    await supabase
      .from('wealth_data')
      .upsert(record, { onConflict: 'user_id,date,category' })
  }

  revalidatePath('/dashboard/wealthboard')
  return { success: true }
}
