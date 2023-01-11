import { HiArrowRight } from 'react-icons/hi';
import { Button, Card, Separator, Typography } from 'ui-components';

import IconRuntimeIncidents from '../../../../assets/icon-runtime-incidents.svg';
import PlacehoderRuntimeIncidents from '../../../../assets/placeholder-runtime-incidents.svg';

export const RuntimeIncidents = () => {
  return (
    <Card className="p-2">
      <div className="flex flex-row items-center gap-x-2 pb-2">
        <img src={IconRuntimeIncidents} alt="Registries Logo" width="20" height="20" />
        <span className={`${Typography.size.base} ${Typography.weight.semibold}`}>
          Runtime Incidents
        </span>
        <div className="flex ml-auto">
          <Button color="normal" size="xs" disabled>
            &nbsp;
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-2 px-2 grid place-items-center">
        <img
          src={PlacehoderRuntimeIncidents}
          alt="Runtime Incidents"
          width={140}
          height={140}
        />
        <p className={`${Typography.size.sm} ${Typography.weight.semibold}`}>
          Upgrade to{' '}
          <span
            className={`${Typography.size.base} ${Typography.weight.bold} tracking-wide`}
          >
            ThreatStryker
          </span>{' '}
          to get runtime information.
        </p>
        <p>
          <a
            href="https://deepfence.io/threatstryker/"
            rel="noreferrer"
            className={`${Typography.size.sm} ${Typography.weight.semibold} text-blue-600 underline`}
          >
            Find out more
          </a>
          .
        </p>
        <div className="mt-3">
          <Button color="success" size="md">
            Grab ThreatStryker&nbsp;
            <HiArrowRight />
          </Button>
        </div>
      </div>
    </Card>
  );
};
