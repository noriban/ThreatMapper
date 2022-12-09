import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import { AWSConnection } from '../features/onboard/components/clouds/aws';
import { AzureConnection } from '../features/onboard/components/clouds/azure/AzureConnection';
import { GCPConnection } from '../features/onboard/components/clouds/gcp/GCPConnection';
import { OnboardLayout } from '../features/onboard/layouts/OnboardLayout';
import { Connector } from '../features/onboard/pages/Connector';

export const ROUTE_ADD_CONNECTORS = 'add-connectors';
export const ROUTE_ONBOARD = '/onboard';
export const ROUTE_HOME = '/dashboard';
export const ROUTE_SCAN_INFRASTRUCTURE = 'scan-infrastructure';
export const ROUTE_VIEW_SCAN_RESULT = 'view-scan-results';

export const privateRoutes: RouteObject[] = [
  {
    path: ROUTE_HOME,
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <Navigate replace to="/onboard" />,
      },
    ],
  },
  {
    path: ROUTE_ONBOARD,
    element: <OnboardLayout />,
    children: [
      {
        path: ROUTE_ADD_CONNECTORS,
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Connector />,
          },
          {
            path: 'cloud/aws',
            element: <AWSConnection />,
          },
          {
            path: 'cloud/gcp',
            element: <GCPConnection />,
          },
          {
            path: 'cloud/azure',
            element: <AzureConnection />,
          },
        ],
      },
      {
        path: ROUTE_SCAN_INFRASTRUCTURE,
        element: 'Scan Infrastructure',
      },
      {
        path: ROUTE_VIEW_SCAN_RESULT,
        element: 'View Scan Results',
      },
      // {
      //   path: 'start-scan',
      //   element:
      // }
    ],
  },
];
