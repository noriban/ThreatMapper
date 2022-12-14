import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-components';

import { ConnectorHeader } from '../components/ConnectorHeader';
import { GCPConnectorForm } from '../components/connectors/clouds/gcp/GCPConnectorForm';

export const GCPConnector = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };

  return (
    <div className="w-full">
      <ConnectorHeader
        title="Connect Google Cloud Platform"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />
      <GCPConnectorForm />

      <Button onClick={goback} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </div>
  );
};
