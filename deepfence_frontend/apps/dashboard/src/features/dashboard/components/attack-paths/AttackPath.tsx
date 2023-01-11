import { HiOutlineChevronRight } from 'react-icons/hi';
import { Button, Card, Separator, Typography } from 'ui-components';

import IconAttackPath from '../../../../assets/icon-attackpath.svg';
import PlaceholderAttackPath from '../../../../assets/placeholder-attack-path.svg';

export const AttackPath = () => {
  return (
    <Card className="p-2">
      <div className="flex flex-row items-center gap-2 pb-2">
        <img src={IconAttackPath} alt="Registries Logo" width="20" height="20" />
        <span className={`${Typography.size.base} ${Typography.weight.semibold}`}>
          Attack Paths
        </span>
        <div className="flex ml-auto">
          <Button color="normal" size="xs">
            Details Graph&nbsp;
            <HiOutlineChevronRight />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-4 px-2 flex justify-center">
        <img src={PlaceholderAttackPath} alt="Registries Logo" />
      </div>
    </Card>
  );
};
