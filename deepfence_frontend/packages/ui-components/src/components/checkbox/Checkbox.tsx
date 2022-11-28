import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as LabelPrimitive from '@radix-ui/react-label';
import cx from 'classnames';
import { isNil } from 'lodash-es';
import React, { useEffect, useId } from 'react';
import { FaCheck, FaMinus } from 'react-icons/fa';

import { Typography } from '../typography/Typography';

export type CheckboxProps = CheckboxPrimitive.CheckboxProps & {
  label?: string;
};

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { className, id, label, checked, onCheckedChange, ...rest } = props;

  const [internalChecked, setInternalChecked] =
    React.useState<CheckboxPrimitive.CheckedState>(checked ?? false);

  useEffect(() => {
    if (!isNil(checked)) {
      setInternalChecked(checked);
    }
  }, [checked]);

  const internalId = useId();
  const _id = id ? id : internalId;

  return (
    <div className="dfc-flex dfc-items-center">
      <CheckboxPrimitive.Root
        id={_id}
        className={cx(
          'dfc-flex dfc-h-4 dfc-w-4 dfc-shrink-0 dfc-items-center dfc-justify-center dfc-rounded',
          'focus:dfc-outline-none focus:dfc-ring-blue-200 focus:dfc-ring-2 dark:focus:dfc-ring-blue-800',
          'radix-state-unchecked:dfc-bg-gray-50 radix-state-unchecked:dark:dfc-bg-gray-700 radix-state-unchecked:dfc-border dfc-border-gray-300 dark:dfc-border-gray-600',
          'radix-state-checked:dfc-bg-blue-600',
          {
            'dfc-bg-blue-600': internalChecked === 'indeterminate',
          },
          'dfc-transition-colors',
          className,
        )}
        data-testid={`checkbox-${_id}`}
        checked={checked}
        onCheckedChange={(state) => {
          if (onCheckedChange) {
            onCheckedChange(state);
            return;
          }
          setInternalChecked(state);
        }}
        {...rest}
      >
        <CheckboxPrimitive.Indicator>
          {internalChecked === 'indeterminate' && (
            <FaMinus className="dfc-h-2.5 dfc-w-2.5 dfc-self-center dfc-text-white" />
          )}
          {internalChecked === true && (
            <FaCheck className="dfc-h-2 dfc-w-2 dfc-self-center dfc-text-white" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label?.length ? (
        <LabelPrimitive.Label
          htmlFor={_id}
          className={cx(
            Typography.size.xs,
            Typography.weight.normal,
            'dfc-ml-2 dfc-text-gray-500 dark:dfc-text-gray-400 dfc-cursor-default',
          )}
        >
          {label}
        </LabelPrimitive.Label>
      ) : null}
    </div>
  );
};

Checkbox.displayName = 'Checkbox';
