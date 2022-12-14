import cx from 'classnames';
import { useCopyToClipboard } from 'react-use';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  Typography,
} from 'ui-components';

import { CopyToClipboardIcon } from '../../../../../../components/CopyToClipboardIcon';

export const AzureConnectorForm = () => {
  const [clipboardCopied, copyToClipboard] = useCopyToClipboard();

  const code = `provider "azurerm" {
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
  `;

  const command = `$ terraform init
  $ terraform plan
  $ terraform apply`;

  return (
    <Accordion type="multiple">
      <AccordionItem value="Connect Cloud Formation">
        <AccordionTrigger>Connect Cloud Formation</AccordionTrigger>
        <AccordionContent className={`${Typography.size.base}`}>
          <p className="px-5 pt-5">Connect to your Google Cloud Account.</p>
          <p className="px-5 pb-5">
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
          <div className="p-5">
            <p className="mb-2.5">
              Copy the following code and paste it into a .tf file on your local machine:
            </p>
            <Card className="w-full relative">
              <pre
                className={cx(
                  'p-4',
                  `${Typography.weight.normal} ${Typography.size.sm} `,
                )}
              >
                {code}
              </pre>
              <CopyToClipboardIcon
                onClick={() => {
                  copyToClipboard(code);
                }}
              />
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Run Commands">
        <AccordionTrigger>Run Commands</AccordionTrigger>
        <AccordionContent>
          <div className="p-5">
            <p className="mb-2.5">
              Copy the following commands and paste them into your shell.
            </p>
            <Card className="w-full relative">
              <pre
                className={cx(
                  'p-4',
                  'h-fit',
                  `${Typography.weight.normal} ${Typography.size.sm} `,
                )}
              >
                {command}
              </pre>
              <CopyToClipboardIcon
                onClick={() => {
                  copyToClipboard(command);
                }}
              />
            </Card>
            <div className="flex mt-6">
              <Button size="xs" color="primary" className="" outline>
                Add another connector
              </Button>
              <Button size="xs" color="primary" className="ml-auto">
                Go to connectors
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
