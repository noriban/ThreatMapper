import { IconContext } from 'react-icons';
import { HiLogout, HiMoon, HiOutlineBell } from 'react-icons/hi';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Separator,
} from 'ui-components';

import LogoDeepfenceDarkBlue from '../assets/logo-deepfence-dark-blue.svg';
import LogoDeepfenceWhite from '../assets/logo-deepfence-white.svg';
import NavIcon from '../assets/nav-icon.svg';
import { useTheme } from '../theme/ThemeContext';
import storage from '../utils/storage';

export const AppHeader = () => {
  const { toggleMode, mode } = useTheme();

  const logout = () => {
    storage.clearAuth();
  };

  return (
    <div className="bg-white dark:bg-gray-90 h-[64px] fixed top-0 w-full">
      <div className="h-full flex items-center mx-2">
        <div className="mr-auto flex">
          <img
            src={mode === 'dark' ? NavIcon : NavIcon}
            alt="Nav Icon"
            width="20"
            height="18"
            className="m-auto mr-8"
          />
          <img
            src={mode === 'dark' ? LogoDeepfenceWhite : LogoDeepfenceDarkBlue}
            alt="Deefence Logo"
            width="46.95"
            height="29"
            className="m-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <IconContext.Provider
            value={{
              className: 'w-6 h-6 p-1 text-blue-600 dark:text-white',
            }}
          >
            <HiOutlineBell />
          </IconContext.Provider>
          <Dropdown
            triggerAsChild
            align="end"
            content={
              <>
                <DropdownItem onClick={toggleMode}>
                  <HiMoon />
                  Toggle Theme
                </DropdownItem>

                <DropdownSeparator />
                <DropdownItem onClick={logout} className="text-red-700 dark:text-red-500">
                  <HiLogout />
                  Logout
                </DropdownItem>
              </>
            }
          >
            <div>
              <Avatar />
            </div>
          </Dropdown>
        </div>
      </div>
      <Separator />
    </div>
  );
};
