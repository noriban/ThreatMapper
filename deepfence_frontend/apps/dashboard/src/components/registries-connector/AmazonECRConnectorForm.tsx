import { HiViewGridAdd } from 'react-icons/hi';
import { Card, Step, Stepper, Switch, TextInput, Typography } from 'ui-components';

import { DFLink } from '@/components/DFLink';

export const AmazonECRConnectorForm = () => {
  return (
    <Stepper>
      <Step indicator={<HiViewGridAdd />} title="Amazon Registry Connecton">
        <div className={`${Typography.size.sm} dark:text-gray-200`}>
          Connect to your Amazon Cloud Account. Find out more information by{' '}
          <DFLink
            href={`https://registry.terraform.io/modules/deepfence/cloud-scanner/gcp/latest/examples/single-project#usage`}
            target="_blank"
            rel="noreferrer"
          >
            reading our documentation
          </DFLink>
          .
        </div>
      </Step>
      <Step indicator="1" title="Region Selection">
        <Card className="w-full relative p-5 mt-2">
          <TextInput
            className="w-3/4 min-[200px] max-w-xs"
            label="Registry Name"
            type={'text'}
            sizing="sm"
            name="registryName"
            placeholder="Registry Name"
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
              placeholder="AWS Access Key"
            />
            <TextInput
              className="w-3/4 min-[200px] max-w-xs"
              label="AWS Secret Key"
              type={'text'}
              sizing="sm"
              name="awsSecretKey"
              placeholder="AWS Secret Key"
            />
            <TextInput
              className="w-3/4 min-[200px] max-w-xs"
              label="AWS Region"
              type={'text'}
              sizing="sm"
              name="awsRegion"
              placeholder="AWS Region"
            />
          </div>
        </Card>
      </Step>
    </Stepper>
  );
};
