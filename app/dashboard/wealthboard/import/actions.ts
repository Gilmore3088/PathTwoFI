'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WealthCategory } from '@/types/wealth.types'

interface ImportRow {
  date: string;
  category: WealthCategory;
  [key: string]: string | number;
}

interface ImportResult {
  success: boolean;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export async function importWealthData(
  rows: ImportRow[]
): Promise<ImportResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, inserted: 0, updated: 0, skipped: 0, errors: ['Unauthorized'] }

  let inserted = 0
  let updated = 0
  let skipped = 0
  const errors: string[] = []

  // Process in chunks of 50 to avoid timeouts
  const CHUNK_SIZE = 50
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE)

    const records = chunk.map((row) => ({
      user_id: user.id,
      date: row.date,
      category: row.category || 'Combined',
      net_worth: Number(row.net_worth) || 0,
      investments: Number(row.investments) || 0,
      cash: Number(row.cash) || 0,
      liabilities: Number(row.liabilities) || 0,
      savings_rate: Number(row.savings_rate) || 0,
      stocks: Number(row.stocks) || 0,
      bonds: Number(row.bonds) || 0,
      real_estate: Number(row.real_estate) || 0,
      crypto: Number(row.crypto) || 0,
      commodities: Number(row.commodities) || 0,
      alternative_investments: Number(row.alternative_investments) || 0,
      retirement_401k: Number(row.retirement_401k) || 0,
      retirement_ira: Number(row.retirement_ira) || 0,
      retirement_roth: Number(row.retirement_roth) || 0,
      hsa: Number(row.hsa) || 0,
      checking_accounts: Number(row.checking_accounts) || 0,
      savings_accounts: Number(row.savings_accounts) || 0,
      mortgage: Number(row.mortgage) || 0,
      credit_cards: Number(row.credit_cards) || 0,
      student_loans: Number(row.student_loans) || 0,
      auto_loans: Number(row.auto_loans) || 0,
      personal_loans: Number(row.personal_loans) || 0,
      other_debts: Number(row.other_debts) || 0,
      monthly_income: Number(row.monthly_income) || 0,
      monthly_expenses: Number(row.monthly_expenses) || 0,
      monthly_savings: Number(row.monthly_savings) || 0,
      notes: row.notes ? String(row.notes) : null,
    }))

    const { error, count } = await supabase
      .from('wealth_data')
      .upsert(records, {
        onConflict: 'user_id,date,category',
        count: 'exact',
      })

    if (error) {
      errors.push(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error.message}`)
      skipped += chunk.length
    } else {
      // upsert doesn't distinguish insert vs update, count them all as processed
      inserted += count ?? chunk.length
    }
  }

  revalidatePath('/dashboard/wealthboard')
  return {
    success: errors.length === 0,
    inserted,
    updated,
    skipped,
    errors,
  }
}

export async function exportWealthDataCsv(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return ''

  const { data, error } = await supabase
    .from('wealth_data')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error || !data || data.length === 0) return ''

  // Build CSV
  const exclude = ['id', 'user_id', 'created_at', 'updated_at']
  const headers = Object.keys(data[0]).filter((k) => !exclude.includes(k))
  const lines = [headers.join(',')]

  for (const row of data) {
    const values = headers.map((h) => {
      const val = (row as Record<string, unknown>)[h]
      if (val === null || val === undefined) return ''
      const str = String(val)
      return str.includes(',') ? `"${str}"` : str
    })
    lines.push(values.join(','))
  }

  return lines.join('\n')
}
