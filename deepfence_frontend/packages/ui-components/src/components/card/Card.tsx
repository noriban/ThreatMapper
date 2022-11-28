import cx from 'classnames';
import { twMerge } from 'tailwind-merge';

type CardType = {
  children: React.ReactNode;
  className?: string;
};
export const Card = (props: CardType) => {
  const { className = '' } = props;
  return (
    <div
      className={twMerge(
        cx(
          `dfc-inline-flex dfc-flex-col dfc-items-center dfc-justify-center dfc-rounded-lg
        dfc-bg-white dfc-shadow-[0px_4px_6px_-1px_rgba(0,_0,_0,_0.01),_0px_2px+4px_-2px_rgba(0,_0,_0,_0.05)] 
          dark:dfc-bg-gray-800 dark:dfc-shadow-[0px_4px_6px_-1px_rgba(0,_0,_0,_0.01),_0px_2px+4px_-2px_rgba(0,_0,_0,_0.05)] 
         ${props.className}`,
        ),
        className,
      )}
    >
      {props.children}
    </div>
  );
};
