import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import cx from 'classnames';

import { Typography } from '../typography/Typography';

export interface TooltipProps
  extends Pick<TooltipPrimitive.TooltipProps, 'defaultOpen' | 'open' | 'onOpenChange'> {
  placement?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
  triggerAsChild?: boolean;
  content: string;
}

export const Tooltip = (props: TooltipProps) => {
  const {
    placement,
    children,
    triggerAsChild,
    content,
    open,
    onOpenChange,
    defaultOpen,
  } = props;
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
      >
        <TooltipPrimitive.Trigger asChild={triggerAsChild ?? false}>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            arrowPadding={8}
            sideOffset={4}
            side={placement}
            className={cx(
              'radix-side-top:dfc-animate-slide-down-fade',
              'radix-side-right:dfc-animate-slide-left-fade',
              'radix-side-bottom:dfc-animate-slide-up-fade',
              'radix-side-left:dfc-animate-slide-right-fade',
              'dfc-inline-flex dfc-items-center dfc-rounded-lg dfc-px-3 dfc-py-2 dfc-shadow-sm',
              'dfc-bg-gray-900 dark:dfc-bg-gray-700 dfc-max-w-xs',
              Typography.leading.normal,
            )}
          >
            <TooltipPrimitive.Arrow
              height={6}
              width={14}
              className="dfc-fill-gray-900 dark:dfc-fill-gray-700"
            />
            <span
              className={cx(
                'dfc-block dfc-text-white',
                Typography.size.sm,
                Typography.weight.medium,
              )}
            >
              {content}
            </span>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

Tooltip.displayName = 'Checkbox';
