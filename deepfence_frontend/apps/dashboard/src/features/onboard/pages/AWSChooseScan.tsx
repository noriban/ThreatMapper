import { HiPlusCircle } from 'react-icons/hi';
import { Button, Card, Separator, Typography } from 'ui-components';

import { usePageNavigation } from '../../../utils/navigation';

type ChooseScanProps = {
  connectorType: string;
  icon?: React.ReactNode;
};

type ScanTypeListProps = {
  scanType: string;
  description: string;
  lastScaned: string;
  buttonText: string;
  redirect: string;
};

const scanTypeList: ScanTypeListProps[] = [
  {
    scanType: 'Vulnerability Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
    redirect: '/onboard/scan-infrastructure/cloud/aws/configure',
  },
  {
    scanType: 'Compliance Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
    redirect: '/onboard/scan-infrastructure/cloud/aws/configure',
  },
  {
    scanType: 'Secrets Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
    redirect: 'cloud/aws/configure',
  },
  {
    scanType: 'Malware Scan',
    description: `A few words about the compliance scan and why you need to use it.`,
    lastScaned: '3:00pm on 11/22/2022',
    buttonText: 'Configure Compliance Scan',
    redirect: 'cloud/aws/configure',
  },
];

const SelectedAccountCard = ({ icon, connectorType }: ChooseScanProps) => {
  return (
    <Card className="flex w-fit p-3 items-center mb-8">
      {icon && <span className="mr-6">{icon}</span>}
      <div className="flex flex-col mr-20">
        <span className={`${Typography.size.lg} ${Typography.weight.medium}`}>
          {connectorType}
        </span>
        <span
          className={`${Typography.size.base} ${Typography.weight.medium} text-gray-500`}
        >
          Account Id: 22222
        </span>
      </div>
      <div>
        <Button className="ml-auto" color="primary" size="xs" outline>
          Swith connector
        </Button>
      </div>
    </Card>
  );
};

const ScanList = () => {
  const { navigate } = usePageNavigation();
  const goNext = (path: string) => {
    navigate(path);
  };
  return (
    <div className="flex gap-5">
      {scanTypeList.map(
        ({
          scanType,
          description,
          lastScaned,
          buttonText,
          redirect,
        }: ScanTypeListProps) => {
          return (
            <Card key={scanType} className="p-5 w-1/4">
              <h2
                className={`${Typography.size['2xl']} ${Typography.weight.medium} pb-2`}
              >
                {scanType}
              </h2>
              <Separator />
              <p className={`${Typography.size.base} ${Typography.weight.normal} py-2`}>
                {description}
              </p>
              <div
                className={`mb-4 text-gray-500 dark:text-gray-400 ${Typography.size.sm} ${Typography.weight.normal}`}
              >
                Last scan:&nbsp;{lastScaned}
              </div>
              <Button
                size="sm"
                color="primary"
                onClick={() => {
                  goNext(redirect);
                }}
              >
                {buttonText}&nbsp;{<HiPlusCircle />}
              </Button>
            </Card>
          );
        },
      )}
    </div>
  );
};
export const AWSChooseScan = ({ connectorType, icon }: ChooseScanProps) => {
  const { goBack } = usePageNavigation();
  return (
    <>
      <SelectedAccountCard connectorType={connectorType} icon={icon} />
      <ScanList />
      <Button onClick={goBack} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </>
  );
};
