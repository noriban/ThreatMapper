import * as SelectPrimitive from '@radix-ui/react-select';
import cx from 'classnames';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface SelectProps extends SelectPrimitive.SelectProps {
  // Trigger passed as children
  children: React.ReactNode;
  // Content that will actually be rendered in the select
  // pass true if you want to merge passed children with default trigger button
  triggerAsChild?: boolean;
}

export const FlexibleSelect = (props: SelectProps) => {
  const { children, triggerAsChild } = props;
  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger asChild={triggerAsChild}>
        {children}
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal></SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

export const FlexibleSelectItem: React.ForwardRefExoticComponent<
  SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props, forwardedRef) => {
  const { children, className, ...rest } = props;
  const classes = twMerge(
    cx(
      'flex px-4 py-2.5 items-center gap-3 text-gray-500 dark:text-gray-300 cursor-pointer',
      'focus:outline-none dark:focus:bg-gray-600 focus:bg-gray-100',
      'text-sm font-medium',
    ),
    className,
  );
  return (
    <SelectPrimitive.Item className={classes} {...rest} ref={forwardedRef}>
      {children}
    </SelectPrimitive.Item>
  );
});
