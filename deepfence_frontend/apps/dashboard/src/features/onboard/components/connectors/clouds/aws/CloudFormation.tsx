import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Select,
  SelectItem,
  Typography,
} from 'ui-components';

const AWS_REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'af-south-1',
  'ap-east-1',
  'ap-south-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-southeast-3',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-south-1',
  'eu-north-1',
  'me-south-1',
  'me-central-1',
  'sa-east-1',
  'us-gov-east-1',
  'us-gov-west-1',
];

export const CloudFormation = () => {
  const [region, setRegion] = useState('us-east-1');
  return (
    <div className="w-full sm:w-1/2">
      <Accordion type="multiple">
        <AccordionItem value={'Connect via Cloud Formation'}>
          <AccordionTrigger>Connect via Cloud Formation</AccordionTrigger>
          <AccordionContent
            className={`${Typography.size.base} ${Typography.weight.normal}`}
          >
            <p className="px-5 pt-5">
              Connect to your AWS Cloud Account via Cloud Formation.
            </p>
            <p className="px-5 pb-5">
              Find out more information by{' '}
              <Link to="/" className="text-blue-500">
                reading our documentation
              </Link>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={'Select a Region'}>
          <AccordionTrigger>Select a Region</AccordionTrigger>
          <AccordionContent>
            <div className="px-5">
              <Select
                value={region}
                name="region"
                onChange={(value) => {
                  setRegion(value);
                }}
                placeholder="Select a region"
              >
                {AWS_REGIONS.map((region) => (
                  <SelectItem value={region} key={region} />
                ))}
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={'Deploy'}>
          <AccordionTrigger>Deploy</AccordionTrigger>
          <AccordionContent></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
