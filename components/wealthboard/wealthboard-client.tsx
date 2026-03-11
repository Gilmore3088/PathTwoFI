'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FireProgressCard } from './fire-progress-card';
import { NetWorthChart } from './net-worth-chart';
import { AssetBreakdown } from './asset-breakdown';
import { CashFlowCard } from './cash-flow-card';
import { CategoryFilter } from './category-filter';
import { GoalsList } from './goals-list';
import { AddWealthEntryDialog } from './add-wealth-entry-dialog';
import { AddGoalDialog } from './add-goal-dialog';
import { FIRE_CONFIG } from '@/lib/fire-constants';
import { exportWealthDataCsv } from '@/app/dashboard/wealthboard/import/actions';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
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
  const [isExporting, startExport] = useTransition();

  function handleExport() {
    startExport(async () => {
      const csv = await exportWealthDataCsv();
      if (!csv) {
        toast.error('No data to export');
        return;
      }
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wealth-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported');
    });
  }

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
      {/* Header with filter and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/wealthboard/import/balance-sheet">
              <Upload className="h-4 w-4 mr-2" />
              Import Balance Sheet
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <AddWealthEntryDialog />
        </div>
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
          <div className="flex justify-end">
            <AddGoalDialog />
          </div>
          <GoalsList goals={filteredGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
