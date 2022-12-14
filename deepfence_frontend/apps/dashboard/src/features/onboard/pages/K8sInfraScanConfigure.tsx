import { Button, Checkbox, Switch, Typography } from 'ui-components';

import { usePageNavigation } from '../../../utils/navigation';

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

export const K8sInfraScanConfigure = () => {
  const { goBack } = usePageNavigation();
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
      <Button onClick={goBack} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </>
  );
};
