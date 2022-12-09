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

import { ConnectorHeader } from '../../ConnectorHeader';

export const AzureConnection = () => {
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
      <Accordion type="multiple">
        <AccordionItem value="Connect Cloud Formation">
          <AccordionTrigger>Connect Cloud Formation</AccordionTrigger>
          <AccordionContent className={`${Typography.size.base}`}>
            <p>Connect to your Google Cloud Account.</p>
            <p>
              Find out more information by{' '}
              <a
                href="https://registry.terraform.io/modules/deepfence/cloud-scanner/aws/latest/examples/single-account-ecs#usage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                reading our documentation
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="Copy Code">
          <AccordionTrigger>Copy Code</AccordionTrigger>
          <AccordionContent>
            <div className="m-5">
              <p className="mb-2.5">
                Copy the following code and paste it into a .tf file on your local
                machine:
              </p>
              <pre
                className={cx(
                  'bg-gray-100 p-4 rounded-lg border border-gray-200 overflow-scroll',
                  'text-black',
                  `${Typography.weight.normal} ${Typography.size.sm} `,
                )}
              >
                {`provider "azurerm" {
  features {}
  subscription_id = "<SUBSCRIPTION_ID eg. XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX>"
}

module "cloud-scanner_example_single-subscription" {
  source              = "deepfence/cloud-scanner/azure//examples/single-subscription"
  version             = "0.1.0"
  mgmt-console-url    = "<Console URL> eg. XXX.XXX.XX.XXX"
  mgmt-console-port   = "443"
  deepfence-key       = "<Deepfence-key> eg. XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}
            `}
              </pre>
              <Button size="xs" color="primary" className="ml-auto mt-6">
                Copy Code
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="Run Commands">
          <AccordionTrigger>Run Commands</AccordionTrigger>
          <AccordionContent>
            <div className="m-4">
              <p className="mb-2.5">
                Copy the following commands and paste them into your shell.
              </p>
              <pre
                className={cx(
                  'bg-gray-100 p-4 rounded-lg border border-gray-200 overflow-scroll',
                  'text-black h-fit',
                  `${Typography.weight.normal} ${Typography.size.sm} `,
                )}
              >
                {`$ terraform init
$ terraform plan
$ terraform apply`}
              </pre>
              <Button size="xs" color="primary" className="ml-auto mt-6">
                Copy Code
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button onClick={goback} outline size="xs" className="absolute left-5 bottom-5">
        Cancel
      </Button>
    </div>
  );
};
