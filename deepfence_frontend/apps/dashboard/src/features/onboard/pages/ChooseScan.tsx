import { HiPlusCircle } from 'react-icons/hi';
import { Button, Card, Separator, Typography } from 'ui-components';

import { ConnectorHeader } from '../components/ConnectorHeader';

type ChooseScanProps = {
  connectorType: string;
  icon?: React.ReactNode;
};

type ScanTypeListProps = {
  scanType: string;
  description: string;
  lastScaned: string;
  buttonText: string;
};

const scanTypeList: ScanTypeListProps[] = [
  {
    scanType: 'Vulnerability Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
  },
  {
    scanType: 'Compliance Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
  },
  {
    scanType: 'Secrets Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
  },
  {
    scanType: 'Malware Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
  },
];

export const ChooseScan = ({ connectorType, icon }: ChooseScanProps) => {
  return (
    <div>
      <ConnectorHeader
        title="Choose your scan type"
        description="Choose from the below options to perform your first scan."
      />
      <Card className="flex w-fit p-3 items-center mb-8">
        {icon && <span className="mr-6">{icon}</span>}
        <div className="flex flex-col mr-20">
          <span className={`${Typography.size.lg} ${Typography.weight.medium}`}>
            {connectorType}
          </span>
          <span>Account Id: 22222</span>
        </div>
        <div>
          <Button className="ml-auto" color="primary" size="xs">
            Swith connector
          </Button>
        </div>
      </Card>
      <div className="flex gap-5">
        {scanTypeList.map((scan: ScanTypeListProps) => {
          return (
            <Card key={scan.scanType} className="p-5 w-1/4">
              <h2
                className={`${Typography.size['2xl']} ${Typography.weight.medium} pb-2`}
              >
                {scan.scanType}
              </h2>
              <Separator />
              <p className={`${Typography.size.lg} ${Typography.weight.normal} py-2`}>
                {scan.description}
              </p>
              <div className="mb-4 text-gray-500 dark:text-gray-400">
                Last scan:&nbsp;{scan.lastScaned}
              </div>
              <Button size="sm" color="primary">
                {scan.buttonText}&nbsp;{<HiPlusCircle />}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
