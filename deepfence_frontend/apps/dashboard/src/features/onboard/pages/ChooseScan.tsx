import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'ui-components';

import { ConnectorHeader } from '../components/ConnectorHeader';

export const ChooseScanLayout = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };
  return (
    <div>
      <ConnectorHeader
        title="Choose your scan type"
        description="Choose from the below options to perform your first scan."
      />
      <Outlet />
      <Button onClick={goback} outline size="xs" className="mt-16">
        Cancel
      </Button>
    </div>
  );
};
