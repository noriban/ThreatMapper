import { HiOutlineChevronRight } from 'react-icons/hi';
import { Button, Card, Separator, Typography } from 'ui-components';

import IconAws from '../../../../assets/icon-aws.svg';
import IconAzure from '../../../../assets/icon-azure.svg';
import IconDocker from '../../../../assets/icon-docker.svg';
import IconGcp from '../../../../assets/icon-gcloud.svg';
import IconGitlab from '../../../../assets/icon-gitlab.svg';
import IconHarbor from '../../../../assets/icon-harbor.svg';
import IconJfrog from '../../../../assets/icon-jfrog.svg';
import IconQuay from '../../../../assets/icon-quay.svg';
import IconRegistries from '../../../../assets/icon-registries.svg';

const color_low = '#0080ff';
const ICON_MAP: {
  [k: string]: string;
} = {
  aws: IconAws,
  azure: IconAzure,
  gcp: IconGcp,
  docker: IconDocker,
  harbor: IconHarbor,
  jfrog: IconJfrog,
  gitlab: IconGitlab,
  quay: IconQuay,
};

const CONNECTORS = [
  {
    label: 'AWS',
    id: 'aws',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'GCP',
    id: 'gcp',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'Azure',
    id: 'azure',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'Quay',
    id: 'quay',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'Docker',
    id: 'docker',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'Docker Hub',
    id: 'docker',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'Harbor',
    id: 'harbor',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'GitLab',
    id: 'gitlab',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
  {
    label: 'JFrog',
    id: 'jfrog',
    percent: '93%',
    accounts: 6,
    color: color_low,
  },
];

export const Registries = () => {
  return (
    <Card className="p-2">
      <div className="flex flex-row items-center gap-2 pb-2">
        <img src={IconRegistries} alt="Registries Logo" width="20" height="20" />
        <span className={`${Typography.size.base} ${Typography.weight.semibold}`}>
          Registries
        </span>
        <div className="flex ml-auto">
          <Button color="normal" size="xs">
            More&nbsp;
            <HiOutlineChevronRight />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,_minmax(30%,_1fr))] gap-x-2 gap-y-4 px-2 place-items-center">
        {CONNECTORS.map((connector) => {
          return (
            <div className={`flex flex-col pb-4 w-full border-b`} key={connector.label}>
              <img
                src={ICON_MAP[connector.id]}
                alt="Deefence Logo"
                width="30"
                height="20"
              />
              <div className={`flex flex-col min-w-[80px]`}>
                <span className={`${Typography.size.base} ${Typography.weight.medium}`}>
                  {connector.label}
                </span>
                <span className={`${Typography.size.sm} text-blue-500 cursor-pointer`}>
                  {connector.accounts} Registries
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
