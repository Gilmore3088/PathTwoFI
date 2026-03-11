'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Landmark } from 'lucide-react';
import { toast } from 'sonner';
import { saveBankConnection } from '@/app/dashboard/settings/connections/actions';

declare global {
  interface Window {
    TellerConnect?: {
      setup: (config: {
        applicationId: string;
        environment: string;
        onSuccess: (enrollment: { accessToken: string; enrollment: { id: string; institution: { name: string } } }) => void;
        onExit: () => void;
      }) => { open: () => void };
    };
  }
}

interface ConnectBankButtonProps {
  tellerAppId: string;
  tellerEnvironment: string;
}

export function ConnectBankButton({ tellerAppId, tellerEnvironment }: ConnectBankButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Teller Connect script
  useEffect(() => {
    if (document.getElementById('teller-connect-script')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'teller-connect-script';
    script.src = 'https://cdn.teller.io/connect/connect.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleConnect = useCallback(() => {
    if (!window.TellerConnect) {
      toast.error('Teller Connect is not loaded. Please refresh the page.');
      return;
    }

    if (!tellerAppId) {
      toast.error('Teller is not configured. Add NEXT_PUBLIC_TELLER_APP_ID to your environment.');
      return;
    }

    const tellerConnect = window.TellerConnect.setup({
      applicationId: tellerAppId,
      environment: ['sandbox', 'development', 'production'].includes(tellerEnvironment)
        ? tellerEnvironment
        : 'sandbox',
      onSuccess: async (enrollment) => {
        setIsLoading(true);
        try {
          const result = await saveBankConnection({
            accessToken: enrollment.accessToken,
            enrollmentId: enrollment.enrollment.id,
            institutionName: enrollment.enrollment.institution.name,
          });

          if (result.success) {
            toast.success(`Connected to ${enrollment.enrollment.institution.name}`);
            if (result.error) {
              toast.warning(result.error);
            }
          } else {
            toast.error(result.error || 'Failed to save connection');
          }
        } finally {
          setIsLoading(false);
        }
      },
      onExit: () => {
        // User closed the widget
      },
    });

    tellerConnect.open();
  }, [tellerAppId, tellerEnvironment]);

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading || !scriptLoaded}
    >
      <Landmark className="h-4 w-4 mr-2" />
      {isLoading ? 'Connecting...' : 'Connect Bank'}
    </Button>
  );
}
