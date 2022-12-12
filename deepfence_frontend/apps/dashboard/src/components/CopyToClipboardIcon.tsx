import { IconContext } from 'react-icons';
import { HiOutlineDuplicate } from 'react-icons/hi';

type CopyToClipboardIconProps = {
  onClick: () => void;
};
export const CopyToClipboardIcon = ({ onClick }: CopyToClipboardIconProps) => {
  const onCopy = (_: any) => {
    onClick();
  };
  return (
    <IconContext.Provider
      value={{
        className: 'top-3 right-3 absolute w-5 h-5',
      }}
    >
      <button onClick={onCopy}>
        <HiOutlineDuplicate />
      </button>
    </IconContext.Provider>
  );
};
