import {
  Select as AriaKitSelect,
  SelectItem as AriakitSelectItem,
  SelectItemProps,
  SelectLabel as AriakitSelectLabel,
  SelectPopover as AriakitSelectPopover,
  SelectState,
  useSelectState,
} from 'ariakit/select';
import cx from 'classnames';
import React, { useContext, useMemo } from 'react';
import { IconContext } from 'react-icons';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../typography/Typography';

export type SizeType = 'sm' | 'md';
export type ColorType = 'default' | 'error' | 'success';

type Value = string | string[];
type MutableValue<T extends Value = Value> = T extends string ? string : T;

export interface SelectProps<T extends Value = Value> {
  defaultValue?: T;
  label?: string;
  children: React.ReactNode;
  name?: string;
  value?: MutableValue<T>;
  onChange?: (value: MutableValue<T>) => void;
  sizing?: SizeType;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  color?: ColorType;
  helperText?: string;
  placeholder?: string;
}

type IconProps = {
  icon: React.ReactNode;
  name?: string;
  color?: ColorType;
  sizing?: SizeType;
};

export const LeftIcon = ({
  icon,
  color = COLOR_DEFAULT,
  sizing = SIZE_DEFAULT,
  name,
}: IconProps) => {
  return (
    <span
      className={cx(
        'dfc-pointer-events-none dfc-absolute dfc-inset-y-0 dfc-left-0 dfc-flex dfc-items-center dfc-pl-3',
      )}
      data-testid={`ariakit-select-icon-${name}`}
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

const SelectArrow = ({
  color = COLOR_DEFAULT,
  sizing = SIZE_DEFAULT,
}: Omit<IconProps, 'icon'>) => {
  return (
    <span
      className={cx(
        'dfc-pointer-events-none dfc-absolute dfc-inset-y-0 dfc-right-0 dfc-flex dfc-items-center dfc-pr-3',
        `${classes.color[color]}`,
      )}
    >
      <IconContext.Provider
        value={{
          className: cx(`${classes.color[color]}`, {
            'dfc-w-[18px] dfc-h-[18px]': sizing === 'sm',
            'dfc-w-[20px] dfc-h-[20px]': sizing === 'md',
          }),
        }}
      >
        <HiOutlineChevronDown />
      </IconContext.Provider>
    </span>
  );
};

export const classes = {
  color: {
    default: cx(
      'dfc-border-gray-300 dfc-text-gray-500',
      'focus:dfc-border-blue-600 focus:dfc-text-gray-900',
      'dark:dfc-border-gray-600 dark:dfc-text-gray-400',
      'dark:focus:dfc-border-blue-800 dark:focus:dfc-text-white dark:active:dfc-text-white',
    ),
    error: cx(
      'dfc-border-red-500 dfc-text-red-700',
      'focus:dfc-border-red-500 focus:dfc-text-red-500',
    ),
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

const SelectStateContext = React.createContext<SelectState | null>(null);

export function Select<T extends Value>({
  defaultValue,
  label,
  children,
  name,
  value,
  onChange,
  sizing = SIZE_DEFAULT,
  color = COLOR_DEFAULT,
  placeholder,
  startIcon,
}: SelectProps<T>) {
  const select = useSelectState<T>({
    defaultValue: defaultValue ?? ((Array.isArray(value) ? [] : '') as T),
    sameWidth: true,
    gutter: 8,
    value,
    setValue: (value) => {
      onChange?.(value);
    },
  });

  const placeholderValue = useMemo(() => {
    if (!select?.value?.length) {
      return placeholder ?? '';
    } else if (Array.isArray(select.value)) {
      return `${select.value.length} ${
        select.value.length > 1 ? 'items' : 'item'
      } selected`;
    }
    return select.value;
  }, [select.value, placeholder]);

  return (
    <SelectStateContext.Provider value={select}>
      <div className="dfc-flex dfc-flex-col dfc-gap-2">
        <AriakitSelectLabel
          state={select}
          className={cx(
            `${Typography.weight.medium} dfc-text-gray-900 dark:dfc-text-white`,
          )}
          data-testid={`ariakit-label-${name}`}
        >
          {label}
        </AriakitSelectLabel>
        <div className="dfc-relative">
          <AriaKitSelect
            state={select}
            name={name}
            className={cx(
              'dfc-w-full dfc-border dfc-box-border dfc-rounded-lg dfc-bg-gray-50 dark:dfc-bg-gray-700',
              'dfc-block dfc-text-left dfc-relative',
              'focus:dfc-outline-none dfc-select-none dfc-overscroll-contain',
              `${classes.color[color]}`,
              `${classes.size[sizing]}`,
              `${Typography.weight.normal}`,
              `${Typography.leading.none}`,
              {
                'dfc-pl-[38px]': startIcon,
                'dfc-h-[42px]': sizing === 'sm',
                'dfc-h-[52px]': sizing === 'md',
              },
            )}
            data-testid={`ariakit-select-${name}`}
          >
            {placeholderValue}
            <SelectArrow sizing={sizing} color={color} />
          </AriaKitSelect>
          {startIcon && (
            <LeftIcon icon={startIcon} sizing={sizing} color={color} name={name} />
          )}
        </div>
        <AriakitSelectPopover
          portal
          state={select}
          className={cx(
            'dfc-shadow-sm dfc-bg-white dark:dfc-bg-gray-700 dfc-py-1',
            'dfc-rounded-md',
            'dfc-border dfc-border-gray-200 dark:dfc-border-gray-600',
            'focus:dfc-outline-none dfc-select-none',
            'dfc-max-h-[min(var(--popover-available-height,315px),315px)] dfc-overflow-y-auto',
            'dfc-animate-slide-down',
          )}
          data-testid={`ariakit-portal-${name}`}
        >
          {defaultValue === '' ? <AriakitSelectItem value="" /> : null}
          {children}
        </AriakitSelectPopover>
      </div>
    </SelectStateContext.Provider>
  );
}

export const SelectItem = (props: SelectItemProps<'div'>) => {
  const selectStateContext = useContext(SelectStateContext);
  const isSelected = useMemo(() => {
    if (Array.isArray(selectStateContext?.value) && props?.value) {
      return selectStateContext?.value.includes(props.value);
    } else if (selectStateContext?.value === props?.value) {
      return true;
    }
    return false;
  }, [selectStateContext?.value, props.value]);

  const classes = twMerge(
    cx(
      'dfc-flex dfc-px-4 dfc-py-2 dfc-items-center dfc-gap-3 dfc-text-gray-500 dark:dfc-text-gray-300 dfc-cursor-pointer',
      'focus:dfc-outline-none dark:focus:dfc-bg-gray-600 focus:dfc-bg-gray-100',
      'data-active-item:dark:dfc-bg-gray-600 data-active-item:dfc-bg-gray-100',
      'data-focus-visible:dark:dfc-bg-gray-600 data-focus-visible:dfc-bg-gray-100',
      Typography.size.sm,
      Typography.weight.medium,
      {
        [`dfc-text-blue-600 dark:dfc-text-blue-400 ${Typography.weight.semibold}`]:
          isSelected,
      },
    ),
    props?.className,
  );
  return (
    <AriakitSelectItem
      {...props}
      className={classes}
      data-testid={`ariakit-selectitem-${props.value}`}
    />
  );
};
