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
      <div
        className={cx({
          'dfc-h-[76px]': title,
          'dfc-h-[36px]': !title,
        })}
      >
        {title && (
          <>
            <DialogPrimitive.Title className={cx('dfc-p-6')} data-testid="modal-title">
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
            'dfc-top-[10px]': !title,
          },
        )}
        id={'modal-close-button'}
        data-testid={'modal-close-button'}
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
      <div className="dfc-p-6" data-testid="modal-footer">
        {children}
      </div>
    </>
  );
};

// TODO: To make modal body scrollable with fixed header and footer

export const Modal: FC<ModalProps> = ({
  title,
  children,
  footer,
  elementToFocusOnCloseRef,
  width = 'dfc-w-4/12', // 33.333333%
  open,
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
          className={cx(
            'dfc-fixed dfc-inset-0 dfc-bg-black/50 dark:dfc-bg-black/50 dfc-flex dfc-justify-center dfc-items-center',
            {
              'dfc-animate-opacity-in': wasOpen,
              // 'animate-opacity-out': !wasOpen, TODO: Add animation on close of modal
            },
          )}
        >
          <DialogPrimitive.Content
            className={cx(
              'dfc-max-h-[90vh] dfc-relative dfc-flex dfc-flex-col dfc-overflow-x-hidden focus:dfc-outline-none',
              'dfc-border dfc-rounded-lg dfc-border-gray-200 dfc-bg-white dfc-text-gray-900',
              'dark:dfc-bg-gray-700 dark:dfc-border-gray-600 dark:dfc-text-white',
              'dfc-max-w-[90%]',
              `${width}`,
              {
                'dfc-animate-pop-in': wasOpen,
                'dfc-animate-pop-out': !wasOpen,
              },
            )}
            onCloseAutoFocus={() => elementToFocusOnCloseRef?.current?.focus()}
          >
            <ModalHeader title={title} />
            <div className="dfc-p-6 dfc-overflow-y-auto dfc-h-full">{children}</div>
            <ModalFooter>{footer}</ModalFooter>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

Modal.displayName = 'Modal';

export default Modal;
