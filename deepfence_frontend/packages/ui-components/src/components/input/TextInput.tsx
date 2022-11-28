import * as LabelPrimitive from '@radix-ui/react-label';
import cx from 'classnames';
import React, { ComponentProps, forwardRef, useId } from 'react';
import { IconContext } from 'react-icons';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../typography/Typography';
import HelperText from './HelperText';

export type SizeType = 'sm' | 'md';
export type ColorType = 'default' | 'error' | 'success';

export interface TextInputProps
  extends Omit<ComponentProps<'input'>, 'ref' | 'color' | 'className' | 'size'> {
  sizing?: SizeType;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  color?: ColorType;
  label?: string;
  helperText?: string;
  className?: string;
  required?: boolean;
}

type IconProps = {
  icon: React.ReactNode;
  id?: string;
  color?: ColorType;
  sizing?: SizeType;
};

export const classes = {
  color: {
    default: cx(
      'dfc-border-gray-300 dfc-text-gray-500',
      'focus:dfc-border-blue-600 focus:dfc-text-gray-900',
      'dark:dfc-border-gray-600 dark:dfc-text-gray-400',
      'dark:focus:dfc-border-blue-800 dark:focus:dfc-text-white dark:active:dfc-text-white',
    ),
    error: cx('dfc-border-red-500', 'focus:dfc-border-red-500'),
    success: cx(
      'dfc-border-green-500 dfc-text-green-700',
      'focus:dfc-border-green-500 focus:dfc-text-green-500',
    ),
  },
  size: {
    sm: `${Typography.size.sm} dfc-p-3`,
    md: `${Typography.size.base} dfc-py-3.5 dfc-px-4`,
  },
};

const COLOR_DEFAULT = 'default';
const SIZE_DEFAULT = 'sm';

export const LeftIcon = ({
  icon,
  id,
  color = COLOR_DEFAULT,
  sizing = SIZE_DEFAULT,
}: IconProps) => {
  return (
    <span
      className={cx(
        'dfc-pointer-events-none dfc-absolute dfc-inset-y-0 dfc-left-0 dfc-flex dfc-items-center dfc-pl-3',
      )}
      data-testid={`textinput-start-icon-${id}`}
    >
      <IconContext.Provider
        value={{
          className: cx(`${classes.color[color]}`, {
            'dfc-w-[18px] dfc-h-[18px]': sizing === 'sm',
            'dfc-w-[20px] dfc-h-[20px]': sizing === 'md',
          }),
        }}
      >
        {icon}
      </IconContext.Provider>
    </span>
  );
};

export const RightIcon = ({
  icon,
  id,
  color = COLOR_DEFAULT,
  sizing = SIZE_DEFAULT,
}: IconProps) => {
  return (
    <span
      className={cx(
        'dfc-pointer-events-none dfc-absolute dfc-inset-y-0 dfc-right-0 dfc-flex dfc-items-center dfc-pr-3',
      )}
      data-testid={`textinput-end-icon-${id}`}
    >
      <IconContext.Provider
        value={{
          className: cx(`${classes.color[color]}`, {
            'dfc-w-[18px] dfc-h-[18px]': sizing === 'sm',
            'dfc-w-[20px] dfc-h-[20px]': sizing === 'md',
          }),
        }}
      >
        {icon}
      </IconContext.Provider>
    </span>
  );
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      sizing = SIZE_DEFAULT,
      color = COLOR_DEFAULT,
      label,
      disabled,
      startIcon,
      endIcon,
      helperText,
      className = '',
      required,
      id,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId();
    const _id = id ? id : internalId;
    return (
      <div className={twMerge('dfc-flex dfc-flex-col dfc-gap-2 dfc-w-full', className)}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={_id}
            className={cx(
              `${Typography.weight.medium} dfc-text-gray-900 dark:dfc-text-white`,
            )}
          >
            {required && <span>*</span>}
            {label}
          </LabelPrimitive.Root>
        )}
        <div className="dfc-relative">
          {startIcon && (
            <LeftIcon icon={startIcon} sizing={sizing} color={color} id={_id} />
          )}
          {endIcon && <RightIcon icon={endIcon} sizing={sizing} color={color} id={_id} />}
          <input
            className={cx(
              'dfc-block dfc-w-full dfc-border dfc-box-border dfc-rounded-lg dfc-bg-gray-50 dark:dfc-bg-gray-700',
              'focus:dfc-outline-none',
              `${classes.color[color]}`,
              `${classes.size[sizing]}`,
              `${Typography.weight.normal}`,
              {
                'disabled:dfc-cursor-not-allowed': disabled,
                'dfc-pl-[38px]': startIcon,
                'dfc-pr-[38px]': endIcon,
                'dfc-h-[42px]': sizing === 'sm',
                'dfc-h-[52px]': sizing === 'md',
              },
            )}
            disabled={disabled}
            ref={ref}
            id={_id}
            data-testid={`textinput-${_id}`}
            {...rest}
          />
        </div>
        {helperText && (
          <HelperText
            sizing={sizing}
            color={color}
            text={helperText}
            className="dfc-mb-2.5"
          />
        )}
      </div>
    );
  },
);

export default TextInput;
