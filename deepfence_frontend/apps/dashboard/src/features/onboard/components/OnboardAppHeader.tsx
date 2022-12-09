import { IconContext } from 'react-icons';
import { HiLogout, HiMoon, HiOutlineBell } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Separator,
} from 'ui-components';

import LogoDeepfenceDarkBlue from '../../../assets/logo-deepfence-dark-blue.svg';
import LogoDeepfenceWhite from '../../../assets/logo-deepfence-white.svg';
import { useThemeMode } from '../../../theme/ThemeContext';
import storage from '../../../utils/storage';

export const OnboardAppHeader = () => {
  const navigate = useNavigate();
  const { toggleMode, mode } = useThemeMode(true);

  const logout = () => {
    storage.clearAuth();
    navigate('/login');
  };

  return (
    <div className="bg-white dark:bg-gray-90 h-[80px] fixed top-0 w-full">
      <div className="h-full flex items-center mx-16">
        <div className="mr-auto">
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
              className: 'w-6 h-6 p-1 text-gray-600 dark:text-white cursor-pointer',
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
                <DropdownItem onClick={logout} className="text-red-700">
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
      <Separator className="h-px bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};
