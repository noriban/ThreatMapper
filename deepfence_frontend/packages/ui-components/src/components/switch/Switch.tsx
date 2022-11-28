import * as LabelPrimitive from '@radix-ui/react-label';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import cx from 'classnames';
import { useId } from 'react';

export type SwitchProps = SwitchPrimitive.SwitchProps & {
  label?: string;
};

const Switch = (props: SwitchProps) => {
  const { label, disabled, id, ...rest } = props;
  const internalId = useId();
  const _id = id ? id : internalId;
  return (
    <div className={cx('dfc-flex dfc-items-center')}>
      <SwitchPrimitive.Root
        id={_id}
        disabled={disabled}
        className={cx(
          'dfc-group dfc-items-center',
          'radix-state-checked:dfc-bg-blue-600',
          'radix-state-unchecked:dfc-bg-gray-200 dark:radix-state-unchecked:dfc-bg-gray-600',
          'dfc-relative dfc-inline-flex dfc-h-5 dfc-w-9 dfc-flex-shrink-0 dfc-cursor-pointer dfc-rounded-[40px] dfc-transition-colors dfc-duration-200 dfc-ease-in-out',
          'focus:dfc-outline-none',
          'focus:dfc-ring-2 focus:dfc-ring-blue-200 dark:focus:dfc-ring-blue-800',
          'disabled:dfc-cursor-not-allowed',
        )}
        data-testid={`switch-${_id}`}
        {...rest}
      >
        <SwitchPrimitive.Thumb
          className={cx(
            'group-radix-state-checked:dfc-translate-x-[1.125rem]',
            'group-radix-state-unchecked:dfc-ring-1 dfc-ring-blue-200 dfc-translate-x-[0.125rem] dark:group-radix-state-unchecked:dfc-ring-0',
            'dfc-pointer-events-none dfc-inline-block dfc-h-4 dfc-w-4 dfc-transform dfc-rounded-full dfc-bg-white dfc-shadow-lg dfc-transition dfc-duration-200 dfc-ease-in-out',
            'dark:group-radix-state-unchecked:dfc-bg-gray-400 dark:group-radix-state-checked:dfc-bg-white',
          )}
        />
      </SwitchPrimitive.Root>
      {label?.length && (
        <LabelPrimitive.Label
          htmlFor={_id}
          className={cx(
            'dfc-pl-2 dfc-text-xs dfc-font-normal dfc-text-gray-500 dark:dfc-text-gray-400 dfc-cursor-default',
            {
              'dfc-cursor-not-allowed': disabled,
            },
          )}
        >
          {label}
        </LabelPrimitive.Label>
      )}
    </div>
  );
};

export default Switch;
