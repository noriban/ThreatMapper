import * as DialogPrimitive from '@radix-ui/react-dialog';
import cx from 'classnames';
import React, { FC, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { HiX } from 'react-icons/hi';

import { useUpdateStateIfMounted } from '../hooks/useUpdateStateIfMounted';
import Separator from '../separator/Separator';

interface FocusableElement {
  focus(options?: FocusOptions): void;
}

type ChildrenType = {
  children: React.ReactNode;
};
export interface ModalProps extends DialogPrimitive.DialogProps {
  width?: string;
  title?: string;
  footer?: React.ReactNode;
  elementToFocusOnCloseRef?: React.RefObject<FocusableElement>;
}

const ModalHeader: FC<{ title?: string }> = ({ title }) => {
  return (
    <>
      <div className={'dfc-w-full'}>
        {title && (
          <>
            <DialogPrimitive.Title
              className={cx('dfc-p-6')}
              data-testid="sliding-modal-title"
            >
              {title}
            </DialogPrimitive.Title>
            <Separator className="dfc-h-px dfc-block dfc-bg-gray-200 dark:dfc-bg-gray-600" />
          </>
        )}
      </div>
      <DialogPrimitive.Close
        aria-label="Close"
        className={cx(
          'dfc-h-36px dfc-rounded-lg dfc-cursor-pointer',
          'dfc-text-gray-400 hover:dfc-text-gray-900 dark:hover:dfc-text-white',
          'hover:dfc-bg-gray-200 dark:hover:dfc-bg-gray-600',
          'dfc-absolute dfc-right-3.5 dfc-inline-flex dfc-items-center dfc-justify-center dfc-p-1',
          'focus:dfc-outline-none focus:dfc-ring-1 foucs:dfc-ring-blue-800',
          {
            'dfc-top-[22px]': title,
            'dfc-top-[8px]': !title,
          },
        )}
        id={'sliding-modal-close-button'}
        data-testid={'sliding-modal-close-button'}
      >
        <IconContext.Provider
          value={{
            size: '20px',
          }}
        >
          <HiX />
        </IconContext.Provider>
      </DialogPrimitive.Close>
    </>
  );
};

const ModalFooter: FC<ChildrenType> = ({ children }) => {
  if (children === undefined) {
    return null;
  }
  return (
    <>
      <Separator className="dfc-h-px dfc-block dfc-bg-gray-200 dark:dfc-bg-gray-600" />
      <div className="dfc-p-6" data-testid="sliding-modal-footer">
        {children}
      </div>
    </>
  );
};

export const SlidingModal: FC<ModalProps> = ({
  title,
  children,
  footer,
  elementToFocusOnCloseRef,
  open,
  width = 'dfc-w-9/12', // 33.333333%
  ...rest
}) => {
  const state = useUpdateStateIfMounted(open);
  const wasOpen = state[0];
  const setWasOpen = state[1];

  useEffect(() => {
    setWasOpen(open);
  }, [open]);

  return (
    <DialogPrimitive.Root open={wasOpen} {...rest}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cx('dfc-inset-0 dfc-bg-black/50 dark:dfc-bg-black/50 dfc-fixed', {
            'dfc-animate-opacity-in': wasOpen,
            'dfc-animate-slide-opacity-out': !wasOpen,
          })}
        >
          <DialogPrimitive.Content
            className={cx(
              'dfc-flex dfc-flex-col dfc-h-[100vh] dfc-fixed dfc--right-[100%]',
              'dfc-overflow-hidden focus:dfc-outline-none',
              'dfc-bg-white dfc-text-gray-900',
              'dark:dfc-bg-gray-700 dark:dfc-text-white',
              `${width}`,
              {
                'dfc-animate-slide-right-out': !wasOpen,
                'dfc-animate-slide-right-in': wasOpen,
              },
            )}
            onCloseAutoFocus={() => elementToFocusOnCloseRef?.current?.focus()}
          >
            <ModalHeader title={title} />
            <div className="dfc-p-6 dfc-overflow-y-auto dfc-flex-auto">{children}</div>
            <ModalFooter>{footer}</ModalFooter>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

SlidingModal.displayName = 'SlidingModal';

export default SlidingModal;
