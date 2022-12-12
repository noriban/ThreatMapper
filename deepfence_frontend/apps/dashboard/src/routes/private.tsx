import { Navigate, Outlet, RouteObject } from 'react-router-dom';

// Update this import
import LogoAws from '../assets/logo-aws.svg';
import { AWSConnection } from '../features/onboard/components/clouds/aws';
import { AzureConnection } from '../features/onboard/components/clouds/azure/AzureConnection';
import { GCPConnection } from '../features/onboard/components/clouds/gcp/GCPConnection';
import { K8sConnection } from '../features/onboard/components/clouds/k8s';
import {
  OnboardLayout,
  rootOnboardLoader,
} from '../features/onboard/layouts/OnboardLayout';
import { ChooseScan } from '../features/onboard/pages/ChooseScan';
import { Connector } from '../features/onboard/pages/Connector';

export const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <Navigate replace to="/onboard" />,
      },
    ],
  },
  {
    path: '/onboard',
    element: <OnboardLayout />,
    loader: rootOnboardLoader,
    children: [
      {
        path: 'add-connectors',
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
          {
            path: 'cloud/host-k8',
            element: <K8sConnection />,
          },
        ],
      },
      {
        path: 'choose-scan',
        element: (
          <ChooseScan
            connectorType="Amazon Web Service (AWS)"
            icon={<img src={LogoAws} alt="aws" />}
          />
        ),
      },
      {
        path: 'scan-infrastructure',
        element: 'Scan Infrastructure',
      },
      {
        path: 'view-scan-results',
        element: 'View Scan Results',
      },
      // {
      //   path: 'start-scan',
      //   element:
      // }
    ],
  },
];
