import { IconContext } from 'react-icons';
import { HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Switch, Typography } from 'ui-components';

const scanType = [
  {
    name: 'CIS',
  },
  {
    name: 'GDPR',
  },
  {
    name: 'HIPPA',
  },
  {
    name: 'PIC',
  },
  {
    name: 'SOC2',
  },
  {
    name: 'NIST',
  },
];

const packages = [
  {
    name: 'OS Packages',
  },
  {
    name: 'Java',
  },
  {
    name: 'Javascript',
  },
  {
    name: 'Rust',
  },
  {
    name: 'GoLang',
  },
  {
    name: 'Ruby',
  },
  {
    name: 'Python',
  },
  {
    name: 'PHP',
  },
  {
    name: 'Dotnet',
  },
];

export const K8sConfigureScan = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };
  return (
    <>
      <section>
        <h6
          className={`${Typography.size.lg} ${Typography.weight.medium} mt-4 dark:text-white`}
        >
          Packages
        </h6>
        <div className="mt-4">
          <Switch label="Select All" />
        </div>

        <div className="flex flex-row mt-4 gap-5">
          {packages.map((pkg) => {
            return <Checkbox label={pkg.name} key={pkg.name} />;
          })}
        </div>
      </section>

      <section className="mt-8">
        <h6
          className={`${Typography.size.lg} ${Typography.weight.medium} mt-4 dark:text-white`}
        >
          Advanced Options
        </h6>

        <div className="flex flex-col mt-4 gap-4">
          <Checkbox
            label={
              'Scan Entire Cluster (All hosts and container images of all pods in the cluster)'
            }
          />
          <Checkbox label={'Priority Scan'} />
        </div>
      </section>
      <Button onClick={goback} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </>
  );
};
