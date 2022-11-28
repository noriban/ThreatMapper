import cx from 'classnames';
import { memo, useMemo } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

import { usePagination, UsePaginationOptions } from '../hooks/usePagination';
import { Typography } from '../typography/Typography';

export type SizeType = 'sm' | 'md';

type PageButtonProps = {
  label: string | number | JSX.Element;
  className: string;
  disabled: boolean;
  onPageChange?: () => void;
};

type OwnProps = {
  onPageChange: (page: number) => void;
  totalRows: number;
  pageSize?: number;
  sizing?: SizeType;
};
type Props = Partial<Pick<UsePaginationOptions, 'currentPage' | 'siblingCount'>> &
  OwnProps;

const PageButton = memo(
  ({ label, onPageChange, disabled, className, ...rest }: PageButtonProps) => {
    return (
      <button
        className={twMerge(
          // we donot want border to be overlap so we use border right here
          cx(
            'dfc-flex dfc-justify-center dfc-items-center dfc-outline-none',
            'dfc-px-3 dfc-py-1.5 dfc-border-r dfc-border-y dfc-border-gray-300 dark:dfc-border-gray-700',
            'hover:dfc-bg-gray-100 hover:dfc-text-gray-700',
            'dark:dfc-border-gray-700 dark:hover:dfc-bg-gray-700 dark:hover:dfc-text-white',
            'focus:dfc-outline-none focus:dfc-ring-1 focus:dfc-ring-inset foucs:dfc-ring-blue-600',
          ),
          className,
        )}
        onClick={() => {
          onPageChange?.();
        }}
        disabled={disabled}
        {...rest}
      >
        {label}
      </button>
    );
  },
);

export const Pagination = ({
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  totalRows,
  siblingCount = 2,
  sizing = 'sm',
}: Props) => {
  const totalPageCount = Math.ceil(totalRows / pageSize);
  const pagination = usePagination({
    currentPage,
    totalPageCount,
    siblingCount,
  });

  const currentShowing = useMemo(() => {
    /**
     * For page 1, start count will always be 1
     * end count can either be total available rows or calculated value
     * 
     * At page between first and last, start count will be cuurentPage * pageSize - pageSize + 1 because
     * eg: currentPage is 2, total page is 3, pageSize is 5
     * For first page start count is 1 and end count is 5. [1-5]
     * For second page start count must be 6 (2 * 5 - 5 + 1 = 10 - 5 + 1 = 6) [6-10]

     * At last page total rows can be lesser than total available rows, so end count is max set to total rows
     * At last page start count cannot go beyond total rows, so set to last page - 1 * pageSize
     * 
     * At page 1 total rows could be less than total available rows
     */
    let startCount = 1;
    let endCount = 1;

    startCount = currentPage * pageSize - pageSize + 1;
    endCount = currentPage * pageSize;

    if (endCount >= totalRows) {
      startCount = (currentPage - 1) * pageSize + 1;
      endCount = totalRows;
    }

    if (currentPage == 1) {
      startCount = 1;
      endCount = pageSize > totalRows ? totalRows : pageSize;
    }
    return [startCount, endCount];
  }, [currentPage, totalRows]);

  const onPrevious = () => {
    if (currentPage === 1) {
      return;
    }
    onPageChange(currentPage - 1);
  };

  const onNext = () => {
    if (currentPage === totalPageCount) {
      return;
    }
    onPageChange(currentPage + 1);
  };

  if (totalPageCount === 0) {
    return null;
  }

  return (
    <div className="dfc-flex dfc-justify-between dfc-items-center">
      <div
        className={`${Typography.weight.normal} ${
          Typography.size[sizing as keyof typeof Typography.size]
        } dfc-text-gray-500 dark:dfc-text-gray-400`}
      >
        Showing{' '}
        <span className="dfc-text-black dark:dfc-text-white">
          {currentShowing[0]}-{currentShowing[1]}
        </span>
        <span> of</span>
        <span className="dfc-text-black dark:dfc-text-white"> {totalRows}</span>
      </div>
      <div
        className={cx(
          `dfc-flex dfc-flex-row fdfc-lex-nowrap ${Typography.weight.medium} ${
            Typography.size[sizing as keyof typeof Typography.size]
          }`,
          'dfc-bg-white dfc-text-gray-500',
          'dark:dfc-bg-gray-800 dark:dfc-text-gray-400',
        )}
      >
        <PageButton
          label={'Previous'}
          key={'Previous'}
          onPageChange={onPrevious}
          disabled={false}
          className={cx('dfc-rounded-l dfc-border-l')}
        />

        {pagination?.map((page, index) => {
          if (page === 'DOTS') {
            return (
              <PageButton
                label={<HiDotsHorizontal />}
                key={page + index}
                disabled={true}
                className={
                  'dfc-px-2 dfc-py-1.5 focus:dfc-border-gray-300 focus:dark:dfc-border-gray-700'
                }
                data-testid="pagination-button-dots"
              />
            );
          }
          return (
            <PageButton
              label={page}
              key={page}
              onPageChange={() => {
                onPageChange(page);
              }}
              disabled={false}
              className={cx({
                'dfc-bg-blue-100 dfc-text-blue-600 dark:dfc-bg-gray-700 dark:dfc-text-white':
                  page === currentPage,
                'hover:dfc-bg-blue-100 hover:dfc-text-blue-600 hover:dark:dfc-bg-gray-700 dark:dfc-text-white':
                  page === currentPage,
              })}
            />
          );
        })}

        <PageButton
          label={'Next'}
          key={'Next'}
          onPageChange={onNext}
          disabled={false}
          className={cx('dfc-rounded-r')}
        />
      </div>
    </div>
  );
};

Pagination.displayName = 'Pagination';
export default Pagination;
