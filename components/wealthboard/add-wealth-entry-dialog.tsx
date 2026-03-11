'use client';

import { useState, useTransition, useEffect } from 'react';
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
import { createWealthEntry, getLatestEntryForCarryForward } from '@/app/dashboard/wealthboard/actions';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { WealthCategory, WealthData } from '@/types/wealth.types';

const NUMERIC_FIELDS = [
  'net_worth', 'investments', 'cash', 'liabilities', 'savings_rate',
  'stocks', 'bonds', 'real_estate', 'crypto',
  'retirement_401k', 'retirement_ira', 'retirement_roth', 'hsa',
  'checking_accounts', 'savings_accounts',
  'mortgage', 'credit_cards', 'student_loans', 'auto_loans',
  'monthly_income', 'monthly_expenses', 'monthly_savings',
] as const;

function firstOfMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

export function AddWealthEntryDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<WealthCategory>('Combined');
  const [values, setValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Carry-forward: load latest entry when dialog opens or category changes
  useEffect(() => {
    if (!open) return;

    setIsLoading(true);
    getLatestEntryForCarryForward(category).then((entry) => {
      if (entry) {
        const carried: Record<string, number> = {};
        for (const field of NUMERIC_FIELDS) {
          const val = Number(entry[field as keyof WealthData]);
          if (val) carried[field] = val;
        }
        setValues(carried);
      } else {
        setValues({});
      }
      setIsLoading(false);
    });
  }, [open, category]);

  function updateValue(field: string, raw: string) {
    const num = parseFloat(raw);
    setValues((prev) => {
      const next = { ...prev, [field]: isNaN(num) ? 0 : num };

      // Auto-calculate net_worth from sub-fields
      const investments = next.investments || 0;
      const cash = next.cash || 0;
      const liabilities = next.liabilities || 0;
      if (field !== 'net_worth') {
        next.net_worth = investments + cash - liabilities;
      }

      // Auto-calculate monthly_savings
      const income = next.monthly_income || 0;
      const expenses = next.monthly_expenses || 0;
      if (field === 'monthly_income' || field === 'monthly_expenses') {
        next.monthly_savings = income - expenses;
      }

      // Auto-calculate savings_rate
      if (field === 'monthly_income' || field === 'monthly_expenses' || field === 'monthly_savings') {
        const savings = next.monthly_savings || 0;
        if (income > 0) {
          next.savings_rate = Math.round((savings / income) * 100 * 100) / 100;
        }
      }

      return next;
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createWealthEntry({
        date: formData.get('date') as string,
        category,
        net_worth: values.net_worth || 0,
        investments: values.investments || 0,
        cash: values.cash || 0,
        liabilities: values.liabilities || 0,
        savings_rate: values.savings_rate || 0,
        stocks: values.stocks || 0,
        bonds: values.bonds || 0,
        real_estate: values.real_estate || 0,
        crypto: values.crypto || 0,
        retirement_401k: values.retirement_401k || 0,
        retirement_ira: values.retirement_ira || 0,
        retirement_roth: values.retirement_roth || 0,
        hsa: values.hsa || 0,
        checking_accounts: values.checking_accounts || 0,
        savings_accounts: values.savings_accounts || 0,
        mortgage: values.mortgage || 0,
        credit_cards: values.credit_cards || 0,
        student_loans: values.student_loans || 0,
        auto_loans: values.auto_loans || 0,
        monthly_income: values.monthly_income || 0,
        monthly_expenses: values.monthly_expenses || 0,
        monthly_savings: values.monthly_savings || 0,
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

  function field(name: string, label: string) {
    return (
      <div className="space-y-2" key={name}>
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          type="number"
          step="0.01"
          placeholder="0"
          value={values[name] || ''}
          onChange={(e) => updateValue(name, e.target.value)}
        />
      </div>
    );
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
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading previous entry...
          </div>
        ) : (
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
                  defaultValue={firstOfMonth()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as WealthCategory)}>
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

            <p className="text-xs text-muted-foreground">
              Fields are pre-filled from your latest {category} entry. Net worth, savings, and savings rate auto-calculate.
            </p>

            {/* Core Numbers */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Core Totals</h3>
              <div className="grid grid-cols-2 gap-4">
                {field('net_worth', 'Net Worth (auto)')}
                {field('investments', 'Total Investments')}
                {field('cash', 'Total Cash')}
                {field('liabilities', 'Total Liabilities')}
              </div>
            </div>

            {/* Asset Breakdown */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Asset Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                {field('stocks', 'Stocks')}
                {field('bonds', 'Bonds')}
                {field('real_estate', 'Real Estate')}
                {field('crypto', 'Crypto')}
                {field('retirement_401k', '401(k)')}
                {field('retirement_ira', 'IRA')}
                {field('retirement_roth', 'Roth')}
                {field('hsa', 'HSA')}
                {field('checking_accounts', 'Checking')}
                {field('savings_accounts', 'Savings')}
              </div>
            </div>

            {/* Debt Breakdown */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Debt Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                {field('mortgage', 'Mortgage')}
                {field('credit_cards', 'Credit Cards')}
                {field('student_loans', 'Student Loans')}
                {field('auto_loans', 'Auto Loans')}
              </div>
            </div>

            {/* Monthly Cash Flow */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Monthly Cash Flow</h3>
              <div className="grid grid-cols-2 gap-4">
                {field('monthly_income', 'Income')}
                {field('monthly_expenses', 'Expenses')}
                {field('monthly_savings', 'Savings (auto)')}
                {field('savings_rate', 'Savings Rate % (auto)')}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
