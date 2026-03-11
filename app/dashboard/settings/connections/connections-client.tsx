'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConnectBankButton } from '@/components/wealthboard/connect-bank-button';
import { AccountMapper } from '@/components/wealthboard/account-mapper';
import { ConnectionStatus } from '@/components/wealthboard/connection-status';
import {
  disconnectBank,
  applyBankBalancesToWealth,
} from './actions';
import type { BankConnection, BankAccount } from './actions';
import { Landmark, Trash2, RefreshCw, ArrowLeft, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ConnectionsClientProps {
  connections: (BankConnection & { accounts: BankAccount[] })[];
  tellerAppId: string;
  tellerEnvironment: string;
}

export function ConnectionsClient({
  connections,
  tellerAppId,
  tellerEnvironment,
}: ConnectionsClientProps) {
  const [isPending, startTransition] = useTransition();

  function handleDisconnect(connectionId: string, name: string) {
    if (!confirm(`Disconnect ${name}? This will remove all linked accounts.`)) return;

    startTransition(async () => {
      const result = await disconnectBank(connectionId);
      if (result.success) {
        toast.success(`Disconnected ${name}`);
      } else {
        toast.error(result.error || 'Failed to disconnect');
      }
    });
  }

  function handleApplyBalances(connectionId: string) {
    startTransition(async () => {
      const result = await applyBankBalancesToWealth(connectionId);
      if (result.success) {
        toast.success('Bank balances applied to wealthboard');
      } else {
        toast.error(result.error || 'Failed to apply balances');
      }
    });
  }

  const isTellerConfigured = !!tellerAppId;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Bank Connections</h1>
            <p className="text-muted-foreground mt-2">
              Connect your bank accounts for automatic balance updates.
              Read-only access only -- we never move money.
            </p>
          </div>
          {isTellerConfigured && (
            <ConnectBankButton
              tellerAppId={tellerAppId}
              tellerEnvironment={tellerEnvironment}
            />
          )}
        </div>
      </div>

      {!isTellerConfigured && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Landmark className="h-8 w-8 text-muted-foreground shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Teller Not Configured</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  To connect bank accounts, add these environment variables to Vercel:
                </p>
                <div className="bg-muted p-3 rounded-lg text-sm font-mono space-y-1">
                  <p>NEXT_PUBLIC_TELLER_APP_ID=your_app_id</p>
                  <p>NEXT_PUBLIC_TELLER_ENVIRONMENT=sandbox</p>
                  <p>TELLER_SIGNING_SECRET=your_signing_secret</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sign up at teller.io (free for 100 connections).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {connections.length === 0 && isTellerConfigured && (
        <Card>
          <CardContent className="p-12 text-center">
            <Landmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Banks Connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your first bank to start pulling balances automatically.
            </p>
            <ConnectBankButton
              tellerAppId={tellerAppId}
              tellerEnvironment={tellerEnvironment}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {connections.map((conn) => (
          <Card key={conn.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Landmark className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{conn.institution_name}</CardTitle>
                    <CardDescription>
                      {conn.accounts.length} account{conn.accounts.length !== 1 ? 's' : ''}
                      {conn.last_synced_at && (
                        <> -- Last synced {new Date(conn.last_synced_at).toLocaleDateString()}</>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ConnectionStatus status={conn.status} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyBalances(conn.id)}
                    disabled={isPending}
                    title="Apply current balances to wealthboard"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Apply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnect(conn.id, conn.institution_name)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="text-sm font-medium mb-3">Account Mapping</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Map each bank account to a wealth_data field. When you click &quot;Apply&quot;,
                these balances update your wealthboard entry for the current month.
              </p>
              <AccountMapper accounts={conn.accounts} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
