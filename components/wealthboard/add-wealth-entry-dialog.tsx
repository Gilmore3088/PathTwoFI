'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createWealthEntry } from '@/app/dashboard/wealthboard/actions';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { WealthCategory } from '@/types/wealth.types';

export function AddWealthEntryDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const num = (key: string) => {
      const val = formData.get(key) as string;
      return val ? parseFloat(val) : 0;
    };

    startTransition(async () => {
      const result = await createWealthEntry({
        date: formData.get('date') as string,
        category: (formData.get('category') as WealthCategory) || 'Combined',
        net_worth: num('net_worth'),
        investments: num('investments'),
        cash: num('cash'),
        liabilities: num('liabilities'),
        savings_rate: num('savings_rate'),
        stocks: num('stocks'),
        bonds: num('bonds'),
        real_estate: num('real_estate'),
        crypto: num('crypto'),
        retirement_401k: num('retirement_401k'),
        retirement_ira: num('retirement_ira'),
        retirement_roth: num('retirement_roth'),
        hsa: num('hsa'),
        checking_accounts: num('checking_accounts'),
        savings_accounts: num('savings_accounts'),
        mortgage: num('mortgage'),
        credit_cards: num('credit_cards'),
        student_loans: num('student_loans'),
        auto_loans: num('auto_loans'),
        monthly_income: num('monthly_income'),
        monthly_expenses: num('monthly_expenses'),
        monthly_savings: num('monthly_savings'),
        notes: (formData.get('notes') as string) || null,
      });

      if (result.success) {
        toast.success('Wealth entry added');
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to add entry');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Wealth Snapshot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="Combined">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Combined">Combined</SelectItem>
                  <SelectItem value="His">His</SelectItem>
                  <SelectItem value="Her">Her</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Core Numbers */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Core Totals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="net_worth">Net Worth</Label>
                <Input id="net_worth" name="net_worth" type="number" step="0.01" required placeholder="816457" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="investments">Total Investments</Label>
                <Input id="investments" name="investments" type="number" step="0.01" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cash">Total Cash</Label>
                <Input id="cash" name="cash" type="number" step="0.01" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liabilities">Total Liabilities</Label>
                <Input id="liabilities" name="liabilities" type="number" step="0.01" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Asset Breakdown */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Asset Breakdown</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                ['stocks', 'Stocks'],
                ['bonds', 'Bonds'],
                ['real_estate', 'Real Estate'],
                ['crypto', 'Crypto'],
                ['retirement_401k', '401(k)'],
                ['retirement_ira', 'IRA'],
                ['retirement_roth', 'Roth'],
                ['hsa', 'HSA'],
                ['checking_accounts', 'Checking'],
                ['savings_accounts', 'Savings'],
              ].map(([name, label]) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} name={name} type="number" step="0.01" placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          {/* Debt Breakdown */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Debt Breakdown</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                ['mortgage', 'Mortgage'],
                ['credit_cards', 'Credit Cards'],
                ['student_loans', 'Student Loans'],
                ['auto_loans', 'Auto Loans'],
              ].map(([name, label]) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} name={name} type="number" step="0.01" placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Cash Flow */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Monthly Cash Flow</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_income">Income</Label>
                <Input id="monthly_income" name="monthly_income" type="number" step="0.01" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_expenses">Expenses</Label>
                <Input id="monthly_expenses" name="monthly_expenses" type="number" step="0.01" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_savings">Savings</Label>
                <Input id="monthly_savings" name="monthly_savings" type="number" step="0.01" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Optional notes about this snapshot..." />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
