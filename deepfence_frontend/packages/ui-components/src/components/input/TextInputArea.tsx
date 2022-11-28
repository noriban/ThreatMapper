import * as LabelPrimitive from '@radix-ui/react-label';
import cx from 'classnames';
import { ComponentProps, forwardRef, useId } from 'react';

import { Typography } from '../typography/Typography';
import HelperText from './HelperText';

export type SizeType = 'sm' | 'md';
export type ColorType = 'default' | 'error' | 'success';
export interface TextInputAreaProps
  extends Omit<ComponentProps<'textarea'>, 'ref' | 'color' | 'className'> {
  label?: string;
  width?: string;
  helperText?: string;
  sizing?: SizeType;
  color?: ColorType;
}

const classes = {
  size: {
    sm: `${Typography.size.sm} dfc-p-3`,
    md: `${Typography.size.base} dfc-py-3.5 dfc-px-4`,
  },
};

const COLOR_DEFAULT = 'default';

export const TextInputArea = forwardRef<HTMLTextAreaElement, TextInputAreaProps>(
  (
    {
      label,
      id,
      sizing = 'sm',
      cols,
      disabled,
      helperText,
      color = COLOR_DEFAULT,
      width = '',
      ...rest
    },
    ref,
  ) => {
    const internalId = useId();
    const _id = id ? id : internalId;

    return (
      <div className={cx('dfc-flex dfc-flex-col dfc-gap-2')}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={_id}
            className={cx(
              `${Typography.weight.medium} dfc-text-gray-900 dark:dfc-text-white`,
            )}
          >
            {label}
          </LabelPrimitive.Root>
        )}
        <div>
          <textarea
            className={cx(
              'dfc-border dfc-box-border dfc-rounded-lg dfc-bg-gray-50 dark:dfc-bg-gray-700',
              'focus:dfc-outline-none',
              'dfc-border-gray-200 dfc-text-gray-500 focus:dfc-text-gray-900 dark:dfc-border-gray-600 dark:dfc-text-gray-400',
              'focus:dfc-border-blue-600 dark:focus:dfc-border-blue-800 dark:focus:dfc-text-white dark:active:dfc-text-white',
              `${Typography.weight.normal}`,
              `${classes.size[sizing]}`,
              {
                'disabled:dfc-cursor-not-allowed': disabled,
                'dfc-w-full': !width && !cols,
              },
              `${width}`,
            )}
            disabled={disabled}
            id={_id}
            ref={ref}
            data-testid={`textinputarea-${_id}`}
            cols={cols}
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
TextInputArea.displayName = 'TextInputArea';
export default TextInputArea;
