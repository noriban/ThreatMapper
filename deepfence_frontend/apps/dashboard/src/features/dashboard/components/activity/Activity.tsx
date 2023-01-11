import { useMemo, useState } from 'react';
import { HiArrowNarrowRight, HiOutlineChevronRight } from 'react-icons/hi';
import {
  Button,
  Card,
  createColumnHelper,
  Separator,
  Table,
  Tabs,
  Typography,
} from 'ui-components';

import IconActivity from '../../../../assets/icon-activity.svg';
const tabs = [
  {
    label: 'To Do List',
    value: 'to-do',
  },
  {
    label: 'Recent Activity',
    value: 'recent-activity',
  },
];

type Fruit = {
  id: number;
  name: string;
  taste: string;
};

export const Activity = () => {
  const [tab, setTab] = useState('to-do');
  const columnHelper = createColumnHelper<Fruit>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: (info) => info.getValue(),
        header: () => 'ACTION',
      }),
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        cell: (info) => info.getValue(),
        header: () => <span>IMPACT</span>,
      }),
      columnHelper.accessor('taste', {
        header: () => 'DETAILS',
        cell: (info) => info.renderValue(),
      }),
    ],
    [],
  );

  return (
    <Card className="p-2">
      <div className="flex flex-row items-center gap-2 pb-2">
        <img src={IconActivity} alt="Registries Logo" width="20" height="20" />
        <span className={`${Typography.size.base} ${Typography.weight.medium}`}>
          Activity
        </span>
        <div className="flex ml-auto">
          <Button color="normal" size="xs">
            More&nbsp;
            <HiOutlineChevronRight />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-4 px-2">
        <Tabs
          value={tab}
          defaultValue={tab}
          tabs={tabs}
          onValueChange={(v) => setTab(v)}
          size="xs"
        >
          <div className="mt-4 mb-2">
            <Table
              size="sm"
              data={[
                {
                  id: 'Patck Vulnerability #124',
                  name: 'M',
                  taste: (
                    <Button size="xs" color="normal" className="text-blue-600 p-0">
                      <HiArrowNarrowRight /> &nbsp;Start
                    </Button>
                  ),
                },
                {
                  id: 'Fix secret #235 in production',
                  name: 'M',
                  taste: (
                    <Button size="xs" color="normal" className="text-blue-600 p-0">
                      <HiArrowNarrowRight /> &nbsp;Start
                    </Button>
                  ),
                },
                {
                  id: 'Fix secret #182 in production',
                  name: 'M',
                  taste: (
                    <Button size="xs" color="normal" className="text-blue-600 p-0">
                      <HiArrowNarrowRight /> &nbsp;Start
                    </Button>
                  ),
                },
              ]}
              columns={columns}
            />
          </div>
        </Tabs>
      </div>
    </Card>
  );
};
