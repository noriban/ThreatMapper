import { Button } from 'ui-components';

import { usePageNavigation } from '../../../utils/navigation';
import { ConnectorHeader } from '../components/ConnectorHeader';
import { GCPConnectorForm } from '../components/connectors/clouds/gcp/GCPConnectorForm';

export const GCPConnector = () => {
  const { goBack } = usePageNavigation();

  return (
    <div className="w-full">
      <ConnectorHeader
        title="Connect Google Cloud Platform"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />
      <GCPConnectorForm />

      <Button onClick={goBack} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </div>
  );
};
