'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/lib/fire-constants';
import type { FinancialGoal } from '@/types/wealth.types';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface GoalsListProps {
  goals: FinancialGoal[];
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function GoalsList({ goals }: GoalsListProps) {
  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Financial Goals</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Target className="h-8 w-8 mb-2" />
            <p>No goals set yet</p>
            <p className="text-sm">Create goals to track your FIRE journey</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Financial Goals</span>
          <span className="text-sm font-normal text-muted-foreground">
            {goals.filter((g) => g.is_completed).length}/{goals.length} completed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = goal.target_amount && Number(goal.target_amount) > 0
            ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100
            : 0;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {goal.is_completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${goal.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={PRIORITY_COLORS[goal.priority]}>
                    {goal.priority}
                  </Badge>
                  <Badge variant="outline">{goal.category}</Badge>
                </div>
              </div>

              {goal.target_amount && Number(goal.target_amount) > 0 && (
                <div className="ml-7 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(Number(goal.current_amount))}</span>
                    <span>{formatCurrency(Number(goal.target_amount))}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {formatPercent(progress, 1)}
                  </p>
                </div>
              )}

              {goal.target_date && (
                <p className="ml-7 text-xs text-muted-foreground">
                  Target: {new Date(goal.target_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
