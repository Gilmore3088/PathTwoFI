'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent, getFireProgress } from '@/lib/fire-constants';
import { Flame, Target, TrendingUp, Calendar } from 'lucide-react';

interface FireProgressCardProps {
  currentNetWorth: number;
}

export function FireProgressCard({ currentNetWorth }: FireProgressCardProps) {
  const progress = getFireProgress(currentNetWorth);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentNetWorth)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Excluding home equity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FIRE Progress</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercent(progress.progressPercent)}</div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500 transition-all"
              style={{ width: `${Math.min(progress.progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(currentNetWorth)} / {formatCurrency(progress.futureGoal)} (inflation-adjusted)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FIRE Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(progress.todayGoal)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(progress.futureGoal)} in future dollars
          </p>
          <p className="text-xs text-muted-foreground">
            Stretch: {formatCurrency(progress.todayStretchGoal)} ({formatPercent(progress.stretchProgressPercent)} done)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Years to FIRE</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.yearsToFire.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Target: {new Date(progress.fireTargetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPercent(progress.inflationRate * 100)} inflation ({progress.inflationMultiplier}x multiplier)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
