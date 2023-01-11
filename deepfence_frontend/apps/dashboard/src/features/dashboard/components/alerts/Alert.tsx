import { HiOutlineChevronRight } from 'react-icons/hi';
import { Button, Separator, Typography } from 'ui-components';

import PlaceholderAlert from '../../../../assets/alert.png';
import IconAttackPath from '../../../../assets/icon-attackpath.svg';

export const Alert = () => {
  return (
    <>
      <div className="flex flex-row items-center gap-2 py-2">
        <img src={IconAttackPath} alt="Registries Logo" width="20" height="20" />
        <span className={`${Typography.size.base} ${Typography.weight.semibold}`}>
          Runtime Incidents
        </span>
        <div className="flex justify-end absolute right-2">
          <Button color="normal" size="xs">
            Details&nbsp;
            <HiOutlineChevronRight />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-4">
        <img src={PlaceholderAlert} alt="Registries Logo" />
      </div>
    </>
  );
};
