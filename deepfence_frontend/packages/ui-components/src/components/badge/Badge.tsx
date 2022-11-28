import * as LabelPrimitive from '@radix-ui/react-label';
import cx from 'classnames';
import { ComponentProps, forwardRef, useId } from 'react';
import { IconContext } from 'react-icons';
import { HiX } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../typography/Typography';

export type SizeType = 'sm' | 'md';
export type ColorType = 'default' | 'primary' | 'success' | 'danger';
export type SelectedBadgeProps = {
  id: string | number | undefined;
  value: string | number | undefined;
};
export interface BadgeProps extends Omit<ComponentProps<'span'>, 'ref' | 'color'> {
  label?: string;
  value?: string;
  sizing?: SizeType;
  color?: ColorType;
  icon?: React.ReactNode;
  isRemove?: boolean;
  onRemove?: (badge: SelectedBadgeProps) => void;
}

const classes = {
  color: {
    default: 'dfc-bg-gray-200 dfc-text-gray-900 dark:dfc-text-gray-900',
    primary: 'dfc-bg-blue-200 dfc-text-blue-900 dark:dfc-text-blue-900',
    success: 'dfc-bg-green-200 dfc-text-green-900 dark:dfc-text-green-900',
    danger: 'dfc-bg-red-200 dfc-text-red-900 dark:dfc-text-red-900',
  },
  size: {
    sm: `${Typography.size.sm} dfc-py-0.5 dfc-px-2.5`,
    md: `${Typography.size.base} dfc-py-0.5 dfc-px-3`,
  },
  icon: {
    sm: 'dfc-w-3.5 dfc-h-3.5',
    md: 'dfc-w-4 dfc-h-4',
  },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      label,
      value,
      id,
      icon,
      sizing = 'sm',
      color = 'default',
      className,
      onRemove,
      isRemove = false,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId();
    const _id = id ? id : internalId;

    return (
      <>
        <LabelPrimitive.Root
          className={twMerge(
            cx(
              `${Typography.weight.normal} dfc-inline-flex dfc-gap-1.5 dfc-justify-center dfc-items-center dfc-rounded-md`,
              `${classes.size[sizing]}`,
              `${classes.color[color]}`,
            ),
            className,
          )}
          id={_id}
          data-testid={`badge-${_id}`}
        >
          {icon && (
            <IconContext.Provider
              value={{
                className: cx(`${classes.icon[sizing]}`),
              }}
            >
              {icon}
            </IconContext.Provider>
          )}
          <LabelPrimitive.Label ref={ref} {...rest}>
            {label}
          </LabelPrimitive.Label>
          {isRemove && (
            <button
              className="dfc-rounded dfc-ml-0.5 dfc-p-px hover:text-black hover:scale-105 focus:dfc-ring-1 focus:dfc-ring-blue-600 focus:dfc-outline-none "
              onClick={() => onRemove?.({ id: _id, value: value })}
              name={label}
              aria-label={label}
            >
              <HiX />
            </button>
          )}
        </LabelPrimitive.Root>
      </>
    );
  },
);
Badge.displayName = 'Badge';
export default Badge;
