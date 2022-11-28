import * as LabelPrimitive from '@radix-ui/react-label';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import cx from 'classnames';
import React from 'react';
import { IconContext } from 'react-icons';

import { Typography } from '../typography/Typography';

export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TabProps = TabsPrimitive.TabsProps & {
  size?: SizeType;
  tabs: {
    label: string;
    value: string;
    id?: string | number;
    icon?: React.ReactNode;
  }[];
  value: string;
  children: React.ReactNode;
};

const classes = {
  size: {
    xs: `${Typography.size.xs} ${Typography.weight.medium}`,
    sm: `${Typography.size.sm} ${Typography.weight.medium}`,
    md: `${Typography.size.base} ${Typography.weight.medium}`,
    lg: `${Typography.size.lg} ${Typography.weight.medium}`,
    xl: `${Typography.size.xl} ${Typography.weight.medium}`,
  },
};

const Tabs = (props: TabProps) => {
  const { tabs, value, defaultValue, size = 'sm', children, ...rest } = props;
  return (
    <TabsPrimitive.Root defaultValue={defaultValue} {...rest} data-testid={'tabs-testid'}>
      <TabsPrimitive.List
        className={cx(
          'dfc-inline-flex dfc-gap-x-8 dfc-border-b dfc-bg-white dfc-border-gray-200 dark:dfc-border-gray-700 dfc-text-gray-500 dark:dfc-text-gray-400 dark:dfc-bg-gray-900',
        )}
      >
        {tabs.map(({ label, value, id, icon }) => {
          const _id = id ? id.toString() : value;
          return (
            <TabsPrimitive.Trigger
              key={`tab-trigger-${value}`}
              value={value}
              data-testid={`tab-item-${_id}`}
              className={cx(
                'dfc-group',
                'focus:dfc-outline-none dfc-py-4 dfc-px-3',
                'radix-state-active:dfc-border-b radix-state-active:dfc--mb-px radix-state-active:dfc-text-blue-600 radix-state-active:dfc-border-blue-600',
                'dark:radix-state-active:dfc-border-blue-600',
                'focus:radix-state-active:dfc-ring-1 focus:radix-state-active:dfc-ring-blue-200',
                'dark:focus:radix-state-active:dfc-ring-blue-800',
              )}
            >
              {icon && (
                <IconContext.Provider
                  value={{ className: cx('dfc-w-4 dfc-h-4 dfc-mr-2 dfc-inline') }}
                >
                  {icon}
                </IconContext.Provider>
              )}
              <LabelPrimitive.Label htmlFor={_id} className={cx(`${classes.size[size]}`)}>
                {label}
              </LabelPrimitive.Label>
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
      <TabsPrimitive.Content value={value}>{children}</TabsPrimitive.Content>
    </TabsPrimitive.Root>
  );
};

export default Tabs;
