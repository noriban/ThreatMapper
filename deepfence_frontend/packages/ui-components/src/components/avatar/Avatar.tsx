import cx from 'classnames';
import { IconContext } from 'react-icons';
import { HiOutlineUser } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../typography/Typography';

type AvatarType = {
  asChild?: boolean;
  alt?: string;
  src?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const Child = ({ children }: { children: AvatarType['children'] }) => {
  return (
    <>
      {children ? (
        children
      ) : (
        <IconContext.Provider
          value={{
            className: cx(`dfc-w-6 dfc-h-6`, {}),
          }}
        >
          <HiOutlineUser />
        </IconContext.Provider>
      )}
    </>
  );
};

export const Avatar = (props: AvatarType) => {
  const {
    asChild = false,
    children = undefined,
    src = '',
    alt = '',
    className = '',
    onClick,
  } = props;

  return (
    <button
      onClick={onClick}
      className={twMerge(
        cx(
          `dfc-inline-flex dfc-overflow-hidden dfc-relative dfc-justify-center dfc-items-center dfc-w-10 dfc-h-10 dfc-bg-gray-100 dfc-rounded-full dark:dfc-bg-gray-600`,
          `dfc-text-gray-700 dark:dfc-text-gray-100 ${Typography.size.lg}`,
        ),
        className,
      )}
    >
      {!asChild ? (
        <img src={src} alt={alt} className="dfc-p-2" />
      ) : (
        <Child>{children}</Child>
      )}
    </button>
  );
};
