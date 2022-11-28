import { Label } from '@radix-ui/react-label';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { RadioGroupProps } from '@radix-ui/react-radio-group';
import cx from 'classnames';
import { FC, useState } from 'react';

type Direction = 'col' | 'row';
type Props = RadioGroupProps & {
  direction?: Direction;
  options: { value: string; label: string; disabled?: boolean; id?: string | number }[];
};

const isRow = (direction: Direction) => direction === 'row';

const Radio: FC<Props> = (props) => {
  const {
    options,
    name,
    direction = 'col',
    defaultValue,
    onValueChange,
    ...rest
  } = props;
  const [selected, setSelected] = useState(defaultValue);

  const onChange = (value: string) => {
    setSelected(value);
    onValueChange?.(value);
  };

  return (
    <RadioGroupPrimitive.Root
      onValueChange={onChange}
      data-testid={`radio-group-${name}`}
      value={selected}
      className={cx({
        'dfc-flex dfc-flex-col dfc-space-y-2': !isRow(direction),
        'dfc-flex dfc-flex-row dfc-space-x-2': isRow(direction),
      })}
      {...rest}
    >
      {options.map((option) => {
        if (option.value) {
          const { value, label, disabled, id } = option;
          const _id = id ? id : value;

          return (
            <div key={_id} className="dfc-flex dfc-items-center">
              <RadioGroupPrimitive.Item
                id={_id + ''}
                value={value}
                data-testid={`radio-item-${_id}`}
                disabled={disabled}
                className={cx(
                  'dfc-rounded-full dfc-py-2 dfc-w-4 dfc-h-4 dfc-flex dfc-shrink-0',
                  'radix-state-checked:dfc-bg-blue-600 dark:radix-state-checked:dfc-bg-blue-600',
                  'focus:dfc-outline-none focus:dfc-ring-2 focus:dfc-ring-blue-200 dark:focus:dfc-ring-2 dark:focus:dfc-ring-blue-800',
                  'radix-state-unchecked:dfc-ring-1 radix-state-unchecked:dfc-ring-inset dfc-ring-gray-300 dfc-bg-gray-50 dark:radix-state-unchecked:dfc-ring-1 dark:dfc-ring-gray-600 dark:dfc-bg-gray-700',
                  'radix-state-disabled:dfc-pointer-events-none',
                  'disabled:dfc-cursor-not-allowed',
                )}
              >
                <RadioGroupPrimitive.Indicator
                  className={cx(
                    'dfc-flex dfc-items-center dfc-justify-center dfc-w-full dfc-h-full dfc-relative dfc-shrink-0',
                    'after:dfc-bg-white after:dfc-content-[""] dark:after:dfc-bg-gray-900',
                    'after:dfc-block after:dfc-w-2 after:dfc-h-2 after:dfc-rounded-full',
                    'radix-state-checked:dfc-bg-blue-800',
                    'dark:radix-state-unchecked:dfc-bg-gray-700',
                    'radix-state-disabled:dfc-pointer-events-none',
                    'disabled:dfc-cursor-not-allowed',
                  )}
                />
              </RadioGroupPrimitive.Item>
              <Label
                htmlFor={_id + ''}
                className={cx(
                  'dfc-px-2 dfc-text-gray-500 dfc-text-xs dark:dfc-text-gray-400 dfc-cursor-default',
                  {
                    'dfc-cursor-not-allowed': disabled,
                  },
                )}
              >
                {label}
              </Label>
            </div>
          );
        }
      })}
    </RadioGroupPrimitive.Root>
  );
};

Radio.displayName = 'Radio';

export default Radio;
