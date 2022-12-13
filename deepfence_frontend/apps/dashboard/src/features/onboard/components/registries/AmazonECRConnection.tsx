import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Switch,
  TextInput,
} from 'ui-components';

import { ConnectorHeader } from '../ConnectorHeader';

export const AmazonECRConnection = () => {
  const navigate = useNavigate();
  const [clipboardCopied, copyToClipboard] = useCopyToClipboard();
  const goback = () => {
    navigate(-1);
  };

  return (
    <div className="w-full">
      <ConnectorHeader
        title="Connect Registry Amazon ECR"
        description="Deploy all modules for Deepfence Compliance Scanner for a single account. For information on AWS Organization and account types, see AWS docs."
      />
      <Accordion type="single">
        <AccordionItem value="Add Registry Credentials">
          <AccordionTrigger>Add Registry Credentials</AccordionTrigger>
          <AccordionContent>
            <div className="p-5">
              <TextInput
                className="w-3/4 min-[200px] max-w-xs"
                label="Registry Name"
                type={'text'}
                sizing="sm"
                name="registryName"
              />
              <div className="flex flex-col gap-4 mt-4">
                <Switch label="Public Registry Information" />
                <Switch label="Use AWS IAM Role" />
              </div>
              <div className="mt-5 flex flex-row gap-4">
                <TextInput
                  className="w-3/4 min-[200px] max-w-xs"
                  label="AWS Access Key"
                  type={'text'}
                  sizing="sm"
                  name="awsAccessKey"
                />
                <TextInput
                  className="w-3/4 min-[200px] max-w-xs"
                  label="AWS Secret Key"
                  type={'text'}
                  sizing="sm"
                  name="awsSecretKey"
                />
                <TextInput
                  className="w-3/4 min-[200px] max-w-xs"
                  label="AWS Region"
                  type={'text'}
                  sizing="sm"
                  name="awsRegion"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex mt-16">
        <Button onClick={goback} outline size="xs">
          Cancel
        </Button>
        <Button onClick={goback} color="primary" size="xs" className="ml-auto">
          Save Credentials And Go To Connectors
        </Button>
      </div>
    </div>
  );
};
