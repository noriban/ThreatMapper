import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-components';

import { ConnectorHeader } from '../components/ConnectorHeader';
import { CloudFormation } from '../components/connectors/clouds/aws/CloudFormation';
import { Terraform } from '../components/connectors/clouds/aws/Terraform';

export const AWSConnector = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };
  return (
    <div>
      <ConnectorHeader
        title="Connect an AWS Account"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />
      <div className="flex gap-x-2 flex-col sm:flex-row flex-1">
        <CloudFormation />
        <Terraform />
      </div>
      <Button onClick={goback} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </div>
  );
};
