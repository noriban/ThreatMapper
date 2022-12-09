import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Typography,
} from 'ui-components';

import { ConnectorHeader } from '../../components/ConnectorHeader';

export const K8 = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };
  return (
    <div className="w-full">
      <ConnectorHeader
        title="Connect Google Azure Account"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />

      <Button onClick={goback} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </div>
  );
};
