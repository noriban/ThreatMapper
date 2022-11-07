import cx from 'classnames';
import { IconContext } from 'react-icons';
import { HiChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../typography/Typography';

type CrumbType = {
  path: string;
  label: string;
  onClick: (path: string) => void;
  icon?: React.ReactNode;
};

type BreadCrumbType = {
  crumbs: CrumbType[];
  separator?: React.ReactNode;
  className?: string;
};

export const BreadCrumb = (props: BreadCrumbType) => {
  const { crumbs, separator, className = '' } = props;

  return (
    <>
      {crumbs.map(({ path, label, onClick }: CrumbType, index: number) => {
        return (
          <Link
            key={path}
            to={path}
            onClick={() => {
              if (index === crumbs.length - 1) {
                return;
              }
              onClick(path);
            }}
            className={twMerge(
              cx(
                `inline-flex items-center`,
                `text-gray-700 dark:text-gray-400 ${Typography.size.sm}`,
                {
                  [`text-gray-500 dark:text-gray-300`]: index === crumbs.length - 1,
                },
              ),
              className,
            )}
          >
            {label}
            {index < crumbs.length - 1 && (
              <IconContext.Provider
                value={{
                  className: cx(`mx-2 text-gray-500`, {}),
                }}
              >
                {separator ? separator : <HiChevronRight />}
              </IconContext.Provider>
            )}
          </Link>
        );
      })}
    </>
  );
};
