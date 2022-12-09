import cx from 'classnames';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Typography,
} from 'ui-components';

export const Terraform = () => {
  return (
    <div className="w-full sm:w-1/2">
      <Accordion type="multiple">
        <AccordionItem value="Connect via Terraform">
          <AccordionTrigger>Connect via Cloud Formation</AccordionTrigger>
          <AccordionContent className={`${Typography.size.base}`}>
            <p>Connect to your AWS Cloud Account via Terraform.</p>
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
                {`provider "aws" {
  region = "<AWS-REGION>; eg. us-east-1"
}

module "cloud-scanner_example_single-account-ecs" {
  source                        = "deepfence/cloud-scanner/aws//examples/single-account-ecs"
  version                       = "0.1.0"
  mgmt-console-url              = "<Console URL> eg. XXX.XXX.XX.XXX"
  mgmt-console-port             = "443"
  deepfence-key                 = "<Deepfence-key> eg. XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
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
    </div>
  );
};
