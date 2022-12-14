import cx from 'classnames';
import { IconContext } from 'react-icons';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Button, Typography } from 'ui-components';

import { usePageNavigation } from '../../../../utils/navigation';

export const NoConnectors = () => {
  const { goBack } = usePageNavigation();
  return (
    <div className="flex flex-col items-center h-full w-full justify-center">
      <IconContext.Provider
        value={{
          className: 'dark:text-blue-500 text-gray-900 w-[70px] h-[70px]',
        }}
      >
        <HiOutlineExclamationCircle />
      </IconContext.Provider>
      <p
        className={`text-gray-900 dark:text-gray-400 ${Typography.size.base} ${Typography.weight.normal}`}
      >
        No Connectors are registered
      </p>
      <Button
        className={cx(
          'bg-transparent hover:bg-transparent outline-none',
          'text-blue-500 hover:text-blue-500 focus:text-blue-500 focus-visible:text-blue-500',
          `${Typography.size.sm} ${Typography.weight.normal}`,
        )}
        onClick={goBack}
      >
        Go Back
      </Button>
    </div>
  );
};
