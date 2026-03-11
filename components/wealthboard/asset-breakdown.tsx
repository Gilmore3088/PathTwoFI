'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/fire-constants';
import type { WealthData } from '@/types/wealth.types';

interface AssetBreakdownProps {
  data: WealthData | null;
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  if (value === 0) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{formatCurrency(value)}</span>
    </div>
  );
}

export function AssetBreakdown({ data }: AssetBreakdownProps) {
  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Assets</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Liabilities</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assets = [
    { label: 'Stocks', value: Number(data.stocks) },
    { label: 'Bonds', value: Number(data.bonds) },
    { label: 'Real Estate', value: Number(data.real_estate) },
    { label: 'Crypto', value: Number(data.crypto) },
    { label: 'Commodities', value: Number(data.commodities) },
    { label: 'Alternative Investments', value: Number(data.alternative_investments) },
    { label: '401(k)', value: Number(data.retirement_401k) },
    { label: 'IRA', value: Number(data.retirement_ira) },
    { label: 'Roth', value: Number(data.retirement_roth) },
    { label: 'HSA', value: Number(data.hsa) },
    { label: 'Checking', value: Number(data.checking_accounts) },
    { label: 'Savings', value: Number(data.savings_accounts) },
  ];

  const debts = [
    { label: 'Mortgage', value: Number(data.mortgage) },
    { label: 'Credit Cards', value: Number(data.credit_cards) },
    { label: 'Student Loans', value: Number(data.student_loans) },
    { label: 'Auto Loans', value: Number(data.auto_loans) },
    { label: 'Personal Loans', value: Number(data.personal_loans) },
    { label: 'Other Debts', value: Number(data.other_debts) },
  ];

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalDebts = debts.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Assets</span>
            <span className="text-green-600">{formatCurrency(totalAssets)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {assets.map((a) => (
            <BreakdownRow key={a.label} label={a.label} value={a.value} />
          ))}
          {totalAssets === 0 && (
            <p className="text-sm text-muted-foreground">No asset data</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Liabilities</span>
            <span className="text-red-600">{formatCurrency(totalDebts)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {debts.map((d) => (
            <BreakdownRow key={d.label} label={d.label} value={d.value} />
          ))}
          {totalDebts === 0 && (
            <p className="text-sm text-muted-foreground">No liability data</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
