import cx from 'classnames';
import { IconContext } from 'react-icons';
import { Separator } from 'ui-components';

type CardLayoutProps = {
  title: string;
  icon?: React.ReactNode;
};

export const CardHeader = ({ title, icon }: CardLayoutProps) => {
  return (
    <>
      <div className="flex flex-row gap-2 px-2 py-3">
        {icon && (
          <IconContext.Provider
            value={{
              className: cx(`w-6 h-6`, {}),
            }}
          >
            {icon}
          </IconContext.Provider>
        )}
        <span>{title}</span>
      </div>
      <Separator />
    </>
  );
};
