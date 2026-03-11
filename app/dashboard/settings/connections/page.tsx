import { getBankConnections } from './actions';
import { ConnectionsClient } from './connections-client';

export default async function ConnectionsPage() {
  const connections = await getBankConnections();

  const tellerAppId = process.env.NEXT_PUBLIC_TELLER_APP_ID || '';
  const tellerEnvironment = process.env.NEXT_PUBLIC_TELLER_ENVIRONMENT || 'sandbox';

  return (
    <ConnectionsClient
      connections={connections}
      tellerAppId={tellerAppId}
      tellerEnvironment={tellerEnvironment}
    />
  );
}
