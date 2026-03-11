import { createClient } from '@/lib/supabase/server';
import { WealthboardClient } from '@/components/wealthboard/wealthboard-client';
import type { WealthData, FinancialGoal } from '@/types/wealth.types';

export default async function WealthboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let allEntries: WealthData[] = [];
  let combinedEntries: WealthData[] = [];
  let hisEntries: WealthData[] = [];
  let herEntries: WealthData[] = [];
  let goals: FinancialGoal[] = [];

  if (user) {
    const [allRes, combinedRes, hisRes, herRes, goalsRes] = await Promise.all([
      supabase
        .from('wealth_data')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true }),
      supabase
        .from('wealth_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', 'Combined')
        .order('date', { ascending: true }),
      supabase
        .from('wealth_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', 'His')
        .order('date', { ascending: true }),
      supabase
        .from('wealth_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', 'Her')
        .order('date', { ascending: true }),
      supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: true }),
    ]);

    allEntries = (allRes.data || []) as WealthData[];
    combinedEntries = (combinedRes.data || []) as WealthData[];
    hisEntries = (hisRes.data || []) as WealthData[];
    herEntries = (herRes.data || []) as WealthData[];
    goals = (goalsRes.data || []) as FinancialGoal[];
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Wealthboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your journey to financial independence with real-time metrics and insights.
        </p>
      </div>

      <WealthboardClient
        allEntries={allEntries}
        combinedEntries={combinedEntries}
        hisEntries={hisEntries}
        herEntries={herEntries}
        goals={goals}
      />
    </div>
  );
}
