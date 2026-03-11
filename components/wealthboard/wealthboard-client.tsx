'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FireProgressCard } from './fire-progress-card';
import { NetWorthChart } from './net-worth-chart';
import { AssetBreakdown } from './asset-breakdown';
import { CashFlowCard } from './cash-flow-card';
import { CategoryFilter } from './category-filter';
import { GoalsList } from './goals-list';
import { AddWealthEntryDialog } from './add-wealth-entry-dialog';
import { FIRE_CONFIG } from '@/lib/fire-constants';
import type { WealthData, WealthCategory, FinancialGoal } from '@/types/wealth.types';

interface WealthboardClientProps {
  allEntries: WealthData[];
  combinedEntries: WealthData[];
  hisEntries: WealthData[];
  herEntries: WealthData[];
  goals: FinancialGoal[];
}

export function WealthboardClient({
  allEntries,
  combinedEntries,
  hisEntries,
  herEntries,
  goals,
}: WealthboardClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<WealthCategory | 'All'>('All');

  const filteredEntries = categoryFilter === 'All'
    ? allEntries
    : categoryFilter === 'Combined'
      ? combinedEntries
      : categoryFilter === 'His'
        ? hisEntries
        : herEntries;

  const latestEntry = filteredEntries.length > 0
    ? filteredEntries[filteredEntries.length - 1]
    : null;

  const currentNetWorth = latestEntry
    ? Number(latestEntry.net_worth)
    : FIRE_CONFIG.currentNetWorth;

  const filteredGoals = categoryFilter === 'All'
    ? goals
    : goals.filter((g) => g.category === categoryFilter);

  return (
    <div className="space-y-8">
      {/* Header with filter and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        <AddWealthEntryDialog />
      </div>

      {/* FIRE Progress KPI Cards */}
      <FireProgressCard currentNetWorth={currentNetWorth} />

      {/* Tabbed Content */}
      <Tabs defaultValue="networth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="networth">Net Worth</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="networth" className="space-y-6">
          <NetWorthChart data={filteredEntries} />
          <AssetBreakdown data={latestEntry} />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <CashFlowCard data={latestEntry} />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalsList goals={filteredGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
