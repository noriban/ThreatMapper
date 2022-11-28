import cx from 'classnames';
import React, { ComponentProps, useId } from 'react';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../typography/Typography';

export type ButtonShape = 'default';
export type ColorType = 'default' | 'primary' | 'danger' | 'success';
export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<ComponentProps<'button'>, 'color'> {
  size?: SizeType;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  shape?: ButtonShape;
  outline?: boolean;
  color?: ColorType;
  className?: string;
}

export const classes = {
  disabled: 'dfc-cursor-not-allowed',
  pill: 'dfc-rounded-full',
  size: {
    xs: `${Typography.size.xs} dfc-px-3 dfc-py-2`,
    sm: `${Typography.size.sm} dfc-px-3 dfc-py-2`,
    md: `${Typography.size.base} dfc-px-5 dfc-py-2.5`,
    lg: `${Typography.size.lg} dfc-px-5 dfc-py-3`,
    xl: `${Typography.size.xl} dfc-px-6 dfc-py-3.5`,
  },
  color: {
    default:
      'dfc-bg-gray-200 dfc-text-gray-700 hover:dfc-bg-gray-300 hover:dfc-text-gray-900 focus:dfc-text-gray-900 focus:dfc-ring-2 focus:dfc-ring-gray-100',
    primary:
      'dfc-bg-blue-600 dfc-text-white hover:dfc-bg-blue-800 focus:dfc-ring-2 focus:dfc-ring-blue-500',
    danger:
      'dfc-bg-red-500 dfc-text-white hover:dfc-bg-red-800 focus:dfc-ring-2 focus:dfc-ring-red-300',
    success:
      'dfc-bg-green-500 dfc-text-white hover:dfc-bg-green-700 focus:dfc-ring-2 focus:dfc-ring-green-300',
  },
  outline: {
    default:
      'dfc-bg-white dfc-text-gray-800 dfc-ring-1 dfc-ring-gray-900 hover:dfc-bg-gray-800 hover:dfc-text-white focus:dfc-ring-1 focus:dfc-ring-gray-200 dark:dfc-ring-white',
    primary:
      'dfc-bg-white dfc-ring-1 dfc-ring-blue-600 dfc-text-blue-600 hover:dfc-bg-blue-600 hover:dfc-text-white focus:dfc-ring-2 focus:dfc-ring-blue-300',
    danger:
      'dfc-text-red-600 dfc-ring-1 dfc-ring-red-600 hover:dfc-bg-red-700 hover:dfc-text-white focus:dfc-ring-2 focus:dfc-ring-red-300',
    success:
      'dfc-text-green-500 dfc-ring-1 dfc-ring-green-500  hover:dfc-bg-green-500 hover:dfc-text-white focus:dfc-ring-2 focus:dfc-ring-green-300',
  },
  startIcon: {
    xs: 'dfc-mr-[10.4px]',
    sm: 'dfc-mr-[10.4px]',
    md: 'dfc-mr-[11px]',
    lg: 'dfc-mr-[15px]',
    xl: 'dfc-mr-[15px]',
  },
  endIcon: {
    xs: 'dfc-ml-[10.4px]',
    sm: 'dfc-ml-[10.4px]',
    md: 'dfc-ml-[11px]',
    lg: 'dfc-ml-[15px]',
    xl: 'dfc-ml-[15px]',
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      id,
      size = 'md',
      color,
      disabled,
      outline,
      startIcon,
      endIcon,
      className,
      ...props
    },
    ref,
  ) => {
    const internalId = useId();
    const _id = id ? id : internalId;

    return (
      <button
        ref={ref}
        id={_id}
        data-testid={`button-${_id}`}
        disabled={disabled}
        className={twMerge(
          cx(
            'dfc-flex dfc-flex-row dfc-items-center dfc-justify-center',
            `${Typography.weight.medium}`,
            `${classes.size[size]}`,
            'dfc-rounded-lg dfc-focus:dfc-outline-none dfc-select-none',
            {
              [classes.color.primary]: color === 'primary' && !outline,
              [classes.outline.primary]: outline && color === 'primary',

              [classes.color.default]:
                (color === undefined && !outline) || (color === 'default' && !outline),
              [classes.outline.default]:
                (color === undefined && outline) || (color === 'default' && outline),

              [classes.color.danger]: color === 'danger' && !outline,
              [classes.outline.danger]: color === 'danger' && outline,

              [classes.color.success]: color === 'success' && !outline,
              [classes.outline.success]: color === 'success' && outline,

              [classes.disabled]: disabled,
              'dark:dfc-text-white dark:dfc-bg-gray-900 dark:hover:dfc-bg-gray-800 dark:focus:dfc-ring-2 dark:focus:dfc-ring-gray-400':
                outline,
            },
          ),
          className,
        )}
        {...props}
      >
        {startIcon && (
          <span
            className={cx(classes.startIcon[size])}
            data-testid={`button-icon-start-${_id}`}
          >
            {startIcon}
          </span>
        )}
        {children}
        {endIcon && (
          <span
            className={cx(classes.endIcon[size])}
            data-testid={`button-icon-end-${_id}`}
          >
            {endIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
