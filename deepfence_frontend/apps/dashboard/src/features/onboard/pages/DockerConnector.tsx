import { Button } from 'ui-components';

import { usePageNavigation } from '../../../utils/navigation';
import { ConnectorHeader } from '../components/ConnectorHeader';
import { DockerConnectorForm } from '../components/connectors/docker/DockerConnectorForm';

export const DockerConnector = () => {
  const { goBack } = usePageNavigation();

  return (
    <div className="w-full">
      <ConnectorHeader
        title="Connect with Docker"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />
      <DockerConnectorForm />

      <Button onClick={goBack} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </div>
  );
};
