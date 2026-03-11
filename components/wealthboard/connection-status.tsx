'use client';

import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  stale: {
    label: 'Stale',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  disconnected: {
    label: 'Disconnected',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  },
};

interface ConnectionStatusProps {
  status: string;
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.disconnected;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
