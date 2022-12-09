import { useState } from 'react';
import { IconContext } from 'react-icons';
import { HiOutlineArrowCircleRight } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Tabs, Typography } from 'ui-components';

import LogoAws from '../../../assets/logo-aws.svg';
import LogoAzure from '../../../assets/logo-azure.svg';
import LogoAzureRegistry from '../../../assets/logo-azure-registry.svg';
import LogoCloudConnector from '../../../assets/logo-cloud-connector.svg';
import LogoDocker from '../../../assets/logo-docker.svg';
import LogoGoogle from '../../../assets/logo-google.svg';
import LogoHostConnector from '../../../assets/logo-host-connector.svg';
import LogoK8 from '../../../assets/logo-k8.svg';
import LogoLinux from '../../../assets/logo-linux.svg';
import LogoRegistryConnector from '../../../assets/logo-registry-connector.svg';
import { ConnectorHeader } from '../components/ConnectorHeader';

interface CardConnectProps {
  path: string;
  label: string;
  icon: SVGElement;
}

const CardConnect = ({ label, path, icon }: CardConnectProps) => {
  const navigate = useNavigate();
  const handleSelection = () => {
    navigate(`cloud/${path}`);
  };
  return (
    <button
      className="py-5 text-sm bg-white text-left flex items-center border-b dark:border-gray-700 border-gray-200 h-[72px] dark:text-gray-300 dark:bg-transparent"
      onClick={handleSelection}
    >
      <img src={icon} alt="Cloud Connector" height="32" className="mr-6" />
      {label}
      <IconContext.Provider
        value={{
          className: 'ml-auto text-blue-500',
        }}
      >
        <HiOutlineArrowCircleRight />
      </IconContext.Provider>
    </button>
  );
};

const connectors = {
  cloud: [
    {
      icon: LogoAws,
      label: 'Amazon Web Services (AWS)',
      path: 'aws',
    },
    {
      icon: LogoGoogle,
      label: 'Google Cloud Platform',
      path: 'gcp',
    },
    {
      icon: LogoAzure,
      label: 'Microsoft Azure',
      path: 'azure',
    },
  ],
  host: [
    {
      icon: LogoK8,
      label: 'Kubernetes Clusters',
      path: 'host-k8',
    },
    {
      icon: LogoDocker,
      label: 'Docker Container',
      path: 'host-docker',
    },
    {
      icon: LogoLinux,
      label: 'Linux Bare-Metal/VM',
      path: 'host-linux',
    },
  ],
  registries: [
    {
      icon: LogoAws,
      label: 'Amazon Elastic Container Registry',
      path: 'registry-k8',
    },
    {
      icon: LogoAzureRegistry,
      label: 'Azure Container Registry',
      path: 'registry-azure',
    },
    {
      icon: LogoGoogle,
      label: 'Container Registry | Google Cloud',
      path: 'registry-linux',
    },
    {
      icon: LogoAws,
      label: 'Amazon Elastic Container Registry',
      path: 'registry-k8',
    },
    {
      icon: LogoAzureRegistry,
      label: 'Azure Container Registry',
      path: 'registry-azure',
    },
    {
      icon: LogoGoogle,
      label: 'Container Registry | Google Cloud',
      path: 'registry-linux',
    },
  ],
};

const Cloud = () => {
  return (
    <Card className="w-full sm:w-1/3 h-[552px] mb-[44px] pb-5 relative">
      <div className="py-4 bg-gray-50 dark:bg-[#3D3D3D] items-center flex justify-center">
        <img
          src={LogoCloudConnector}
          alt="Cloud Connector"
          width="28"
          height="28"
          className="pr-2"
        />
        <span
          className={`${Typography.size['2xl']} ${Typography.weight.medium} leading-[29px] dark:text-gray-50`}
        >
          Cloud
        </span>
      </div>
      <div className="mt-6 absolute top-0 w-full h-full overflow-y-scroll">
        <p
          className={`p-6 text-center ${Typography.size.base} ${Typography.weight.normal} leading-6 text-gray-700 dark:text-gray-300 mt-14`}
        >
          Connect an AWS, GCP, or Azure cloud account to check for compliance
          misconfigurations.
        </p>
        <div className="flex flex-col  mx-6">
          {connectors.cloud.map((connector) => {
            return <CardConnect {...connector} key={connector.label} />;
          })}
        </div>
      </div>
    </Card>
  );
};
const Host = () => {
  return (
    <Card className="w-full sm:w-1/3 h-[552px] mb-[44px] pb-5 relative">
      <div className="py-4 bg-gray-50 dark:bg-[#3D3D3D] items-center flex justify-center">
        <img
          src={LogoHostConnector}
          alt="Cloud Connector"
          width="28"
          height="28"
          className="pr-2"
        />
        <span
          className={`${Typography.size['2xl']} ${Typography.weight.medium} leading-[29px] dark:text-gray-50`}
        >
          Host
        </span>
      </div>
      <div className="mt-6 absolute top-0 w-full h-full overflow-y-scroll">
        <p
          className={`p-6 text-center ${Typography.size.base} ${Typography.weight.normal} leading-6 text-gray-700 dark:text-gray-300 mt-14`}
        >
          Connect a K8s cluster, Docker container, or Linux host to check for
          vulnerabilities, secrets, malware, and compliance misconfigurations.
        </p>
        <div className="flex flex-col mx-6">
          {connectors.host.map((connector) => {
            return <CardConnect {...connector} key={connector.label} />;
          })}
        </div>
      </div>
    </Card>
  );
};
const Registries = () => {
  return (
    <Card className="w-full sm:w-1/3 h-[552px] mb-[40px] pb-5 relative">
      <div className="py-4 bg-gray-50 dark:bg-[#3D3D3D] items-center flex justify-center">
        <img
          src={LogoRegistryConnector}
          alt="Cloud Connector"
          width="28"
          height="28"
          className="pr-2"
        />
        <span
          className={`${Typography.size['2xl']} ${Typography.weight.medium} leading-[29px] dark:text-gray-50`}
        >
          Registry
        </span>
      </div>
      <div className="mt-6 absolute top-0 w-full h-full overflow-y-scroll">
        <p
          className={`p-6 text-center ${Typography.size.base} ${Typography.weight.normal} leading-6 text-gray-700 dark:text-gray-300 mt-14`}
        >
          Connect a registry to scan images for vulnerabilities.
          <br></br>
          &nbsp;
        </p>
        <div className="flex flex-col mx-6">
          {connectors.registries.map((connector) => {
            return <CardConnect {...connector} key={connector.label} />;
          })}
        </div>
      </div>
    </Card>
  );
};

const tabs = [
  {
    label: 'Add Connectors',
    value: 'add',
  },
  {
    label: 'My Connectors',
    value: 'connected',
  },
];

export const AddConnector = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-x-2">
      <Cloud />
      <Host />
      <Registries />
    </div>
  );
};

export const Connector = () => {
  const [tab, setTab] = useState('add');

  return (
    <>
      <ConnectorHeader
        title="Let's Get Started"
        description="ThreatMapper’s unique approach learns the active topology of your application and classifies vulnerabilities based on the attack surfaces that your application presents."
      />
      <Tabs
        value={tab}
        defaultValue={tab}
        tabs={tabs}
        onValueChange={(tab) => setTab(tab)}
        size="xs"
      >
        <div className="h-full dark:text-white mt-8">
          {tab === 'add' && <AddConnector />}
          {tab === 'connected' && <>connected tabs</>}
        </div>
      </Tabs>
    </>
  );
};
