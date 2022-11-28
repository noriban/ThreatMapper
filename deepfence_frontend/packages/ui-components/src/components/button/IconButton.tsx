import cx from 'classnames';
import { ComponentProps, forwardRef, useId } from 'react';
import { IconContext } from 'react-icons';

import { classes as buttonClasses, ColorType, SizeType } from './Button';

interface Props extends Omit<ComponentProps<'button'>, 'className' | 'color'> {
  size?: SizeType;
  icon?: React.ReactNode;
  outline?: boolean;
  color?: ColorType;
}

const classes = {
  ...buttonClasses,
  size: {
    xs: `dfc-p-1 dfc-w-7 dfc-h-7`,
    sm: `dfc-p-2 dfc-w-9 dfc-h-9`,
    md: `dfc-p-2.5 dfc-w-10 dfc-h-10`,
    lg: `dfc-p-3 dfc-w-12 dfc-h-12`,
    xl: `dfc-p-3.5 dfc-w-[52px] dfc-h-[52px]`,
  },
  icon: {
    xs: 'dfc-w-2.5 dfc-h-2.5',
    sm: 'dfc-w-2.5 dfc-h-2.5',
    md: 'dfc-w-2.5 dfc-h-2.5',
    lg: 'dfc-w-3 dfc-h-3',
    xl: 'dfc-w-3 dfc-h-3',
  },
};

const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ size = 'md', color, disabled, outline, icon, id, ...props }, ref) => {
    const internalId = useId();
    const _id = id ? id : internalId;

    return (
      <button
        ref={ref}
        id={_id}
        data-testid={`icon-button-${_id}`}
        disabled={disabled}
        className={cx(
          'dfc-flex dfc-flex-row dfc-items-center dfc-justify-center',
          `${classes.size[size]}`,
          'dfc-rounded-full focus:dfc-outline-none dfc-select-none',
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
        )}
        {...props}
      >
        {icon && (
          <IconContext.Provider value={{ className: cx(classes.icon[size]) }}>
            {icon}
          </IconContext.Provider>
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
