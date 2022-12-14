import { Button } from 'ui-components';

import { usePageNavigation } from '../../../utils/navigation';
import { ConnectorHeader } from '../components/ConnectorHeader';
import { AmazonECRConnectorForm } from '../components/connectors/registries';

export const AmazonECRConnector = () => {
  const { goBack } = usePageNavigation();
  return (
    <div className="w-full">
      <ConnectorHeader
        title="Connect Registry Amazon ECR"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />
      <AmazonECRConnectorForm />
      <div className="flex mt-16">
        <Button onClick={goBack} outline size="xs">
          Cancel
        </Button>
        <Button onClick={goBack} color="primary" size="xs" className="ml-auto">
          Save Credentials And Go To Connectors
        </Button>
      </div>
    </div>
  );
};
