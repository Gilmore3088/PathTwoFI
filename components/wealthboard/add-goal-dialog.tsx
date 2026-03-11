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
import { createFinancialGoal } from '@/app/dashboard/wealthboard/actions';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { WealthCategory } from '@/types/wealth.types';

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createFinancialGoal({
        title: formData.get('title') as string,
        description: (formData.get('description') as string) || undefined,
        goal_type: formData.get('goal_type') as string,
        category: (formData.get('category') as WealthCategory) || 'Combined',
        target_amount: formData.get('target_amount')
          ? parseFloat(formData.get('target_amount') as string)
          : undefined,
        target_date: (formData.get('target_date') as string) || undefined,
        priority: (formData.get('priority') as string) || 'medium',
      });

      if (result.success) {
        toast.success('Goal created');
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to create goal');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Financial Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="e.g., Pay off student loans"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional details..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal_type">Type</Label>
              <Select name="goal_type" defaultValue="net_worth">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net_worth">Net Worth</SelectItem>
                  <SelectItem value="savings_rate">Savings Rate</SelectItem>
                  <SelectItem value="debt_payoff">Debt Payoff</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount</Label>
              <Input
                id="target_amount"
                name="target_amount"
                type="number"
                step="0.01"
                placeholder="e.g., 3500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date</Label>
              <Input
                id="target_date"
                name="target_date"
                type="date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
