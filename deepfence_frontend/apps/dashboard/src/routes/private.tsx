import { Navigate, Outlet, RouteObject } from 'react-router-dom';

// Update this import
import LogoAws from '../assets/logo-aws.svg';
import LogoK8 from '../assets/logo-k8.svg';
import { InfraScanLayout } from '../features/onboard/layouts/InfraScanLayout';
import {
  OnboardLayout,
  rootOnboardLoader,
} from '../features/onboard/layouts/OnboardLayout';
import { AmazonECRConnector } from '../features/onboard/pages/AmazonECRConnector';
import { AWSChooseScan } from '../features/onboard/pages/AWSChooseScan';
import { AWSConnector } from '../features/onboard/pages/AWSConnector';
import { AWSInfraScanConfigure } from '../features/onboard/pages/AWSInfraScanConfigure';
import { AzureConnector } from '../features/onboard/pages/AzureConnector';
import { Connector } from '../features/onboard/pages/Connector';
import { DockerConnector } from '../features/onboard/pages/DockerConnector';
import { GCPConnector } from '../features/onboard/pages/GCPConnector';
import { K8ChooseScan } from '../features/onboard/pages/K8ChooseScan';
import { K8sConnector } from '../features/onboard/pages/K8sConnector';
import { K8sInfraScanConfigure } from '../features/onboard/pages/K8sInfraScanConfigure';

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
            element: <AWSConnector />,
          },
          {
            path: 'cloud/gcp',
            element: <GCPConnector />,
          },
          {
            path: 'cloud/azure',
            element: <AzureConnector />,
          },
          {
            path: 'host/k8s',
            element: <K8sConnector />,
          },
          {
            path: 'docker',
            element: <DockerConnector />,
          },
          {
            path: 'registry/amazon-ecr',
            element: <AmazonECRConnector />,
          },
        ],
      },
      {
        path: 'scan-infrastructure',
        element: <InfraScanLayout />,
        children: [
          {
            path: 'cloud/aws',
            element: (
              <AWSChooseScan
                connectorType="Amazon Web Services (AWS)"
                icon={<img src={LogoAws} alt="logo" />}
              />
            ),
          },
          {
            path: 'k8s',
            element: (
              <K8ChooseScan
                connectorType="Kubernetes"
                icon={<img src={LogoK8} alt="logo" />}
              />
            ),
          },
          {
            path: 'cloud/aws/configure',
            element: <AWSInfraScanConfigure />,
          },
          {
            path: 'k8s/configure',
            element: <K8sInfraScanConfigure />,
          },
        ],
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
