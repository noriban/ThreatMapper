import { useCopyToClipboard } from 'react-use';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Switch,
  TextInput,
} from 'ui-components';

export const AmazonECRConnectorForm = () => {
  const [clipboardCopied, copyToClipboard] = useCopyToClipboard();

  return (
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
  );
};
