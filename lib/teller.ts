// Teller API client for read-only bank data
// Docs: https://teller.io/docs/api
//
// Required env vars:
//   TELLER_APP_ID          - from Teller dashboard
//   TELLER_ENVIRONMENT     - 'sandbox' | 'development' | 'production'
//   TELLER_API_BASE_URL    - https://api.teller.io (production) or sandbox URL
//
// Teller uses certificate-based auth (mTLS) for production.
// In sandbox/development, use the access token directly as Basic auth.

const TELLER_API_BASE = process.env.TELLER_API_BASE_URL || 'https://api.teller.io';

interface TellerRequestOptions {
  accessToken: string;
  path: string;
  method?: string;
}

async function tellerFetch<T>({ accessToken, path, method = 'GET' }: TellerRequestOptions): Promise<T> {
  const credentials = Buffer.from(`${accessToken}:`).toString('base64');

  const res = await fetch(`${TELLER_API_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Teller API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// Types based on Teller API responses
export interface TellerAccount {
  id: string;
  name: string;
  type: string;
  subtype: string;
  status: string;
  institution: {
    id: string;
    name: string;
  };
  enrollment_id: string;
  currency: string;
  last_four: string;
}

export interface TellerBalance {
  account_id: string;
  available: string;
  ledger: string;
}

export interface TellerInstitution {
  id: string;
  name: string;
}

// Fetch all accounts for an enrollment
export async function getAccounts(accessToken: string): Promise<TellerAccount[]> {
  return tellerFetch<TellerAccount[]>({
    accessToken,
    path: '/accounts',
  });
}

// Fetch balance for a specific account
export async function getAccountBalance(
  accessToken: string,
  accountId: string
): Promise<TellerBalance> {
  return tellerFetch<TellerBalance>({
    accessToken,
    path: `/accounts/${accountId}/balances`,
  });
}

// Fetch all balances for all accounts
export async function getAllBalances(
  accessToken: string
): Promise<Map<string, number>> {
  const accounts = await getAccounts(accessToken);
  const balances = new Map<string, number>();

  for (const account of accounts) {
    try {
      const balance = await getAccountBalance(accessToken, account.id);
      // Use ledger balance (actual balance, not available)
      balances.set(account.id, parseFloat(balance.ledger));
    } catch {
      // Skip accounts where balance fetch fails
    }
  }

  return balances;
}

// Delete enrollment (disconnect bank)
export async function deleteEnrollment(accessToken: string): Promise<void> {
  await tellerFetch<void>({
    accessToken,
    path: '/accounts',
    method: 'DELETE',
  });
}

// Verify webhook signature from Teller
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto') as typeof import('crypto');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
