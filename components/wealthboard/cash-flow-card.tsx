'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/fire-constants';
import type { WealthData } from '@/types/wealth.types';

interface CashFlowCardProps {
  data: WealthData | null;
}

export function CashFlowCard({ data }: CashFlowCardProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader><CardTitle>Monthly Cash Flow</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data yet</p>
        </CardContent>
      </Card>
    );
  }

  const income = Number(data.monthly_income);
  const expenses = Number(data.monthly_expenses);
  const savings = Number(data.monthly_savings);
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Cash Flow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Income</span>
          <span className="font-medium text-green-600">{formatCurrency(income)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Expenses</span>
          <span className="font-medium text-red-600">{formatCurrency(expenses)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between items-center">
          <span className="text-sm font-medium">Net Savings</span>
          <span className={`font-bold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(savings)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Savings Rate</span>
          <span className="font-medium">{formatPercent(savingsRate, 1)}</span>
        </div>
        {savingsRate > 0 && (
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
