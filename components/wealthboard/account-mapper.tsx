'use client';

import { useTransition } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { updateAccountMapping } from '@/app/dashboard/settings/connections/actions';
import type { BankAccount } from '@/app/dashboard/settings/connections/actions';
import { formatCurrency } from '@/lib/fire-constants';
import { WEALTH_FIELDS } from '@/lib/csv-parser';

const MAPPABLE_FIELDS = WEALTH_FIELDS.filter((f) =>
  [
    'checking_accounts', 'savings_accounts',
    'stocks', 'bonds', 'retirement_401k', 'retirement_ira', 'retirement_roth',
    'hsa', 'crypto',
    'mortgage', 'credit_cards', 'student_loans', 'auto_loans', 'personal_loans',
    'investments', 'cash', 'liabilities',
  ].includes(f.key)
);

interface AccountMapperProps {
  accounts: BankAccount[];
}

export function AccountMapper({ accounts }: AccountMapperProps) {
  const [isPending, startTransition] = useTransition();

  function handleMappingChange(accountId: string, value: string) {
    const [field, category] = value === '_none'
      ? [null, 'Combined']
      : value.split('|');

    startTransition(async () => {
      const result = await updateAccountMapping(accountId, field || null, category || 'Combined');
      if (result.success) {
        toast.success('Mapping updated');
      } else {
        toast.error(result.error || 'Failed to update mapping');
      }
    });
  }

  if (accounts.length === 0) {
    return <p className="text-sm text-muted-foreground">No accounts found.</p>;
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => {
        const currentValue = account.mapped_field
          ? `${account.mapped_field}|${account.mapped_category}`
          : '_none';

        return (
          <div
            key={account.id}
            className="flex items-center justify-between gap-4 p-3 border rounded-lg"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{account.account_name}</p>
                <Badge variant="outline" className="text-xs shrink-0">
                  {account.account_type}
                  {account.subtype ? ` / ${account.subtype}` : ''}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {account.institution_name}
                {account.last_balance !== null && (
                  <> -- {formatCurrency(account.last_balance)}</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Label className="text-xs text-muted-foreground sr-only">
                Map to
              </Label>
              <Select
                value={currentValue}
                onValueChange={(val) => handleMappingChange(account.id, val)}
                disabled={isPending}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Not mapped" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">-- Not mapped --</SelectItem>
                  {['Combined', 'His', 'Her'].map((cat) => (
                    MAPPABLE_FIELDS.map((f) => (
                      <SelectItem key={`${f.key}|${cat}`} value={`${f.key}|${cat}`}>
                        {f.label} ({cat})
                      </SelectItem>
                    ))
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
