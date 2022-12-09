import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Separator } from 'ui-components';

import { ROUTE_ADD_CONNECTORS, ROUTE_ONBOARD } from '../../../routes/private';
import { OnboardAppHeader } from '../components/OnboardAppHeader';

export const OnboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === ROUTE_ONBOARD) {
      navigate(`${ROUTE_ONBOARD}/${ROUTE_ADD_CONNECTORS}`);
    }
  }, []);

  return (
    <div>
      <OnboardAppHeader />
      <div className="mx-16 pt-[80px] pb-8 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};
