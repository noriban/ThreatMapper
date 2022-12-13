import { Navigate, Outlet, RouteObject } from 'react-router-dom';

// Update this import
import LogoAws from '../assets/logo-aws.svg';
import LogoK8 from '../assets/logo-k8.svg';
import { AWSConnection } from '../features/onboard/components/clouds/aws';
import { AzureConnection } from '../features/onboard/components/clouds/azure/AzureConnection';
import { DockerConnection } from '../features/onboard/components/clouds/docker/DockerConnection';
import { GCPConnection } from '../features/onboard/components/clouds/gcp/GCPConnection';
import { K8sConnection } from '../features/onboard/components/k8s';
import { AmazonECRConnection } from '../features/onboard/components/registries';
import { AWSChooseScan } from '../features/onboard/components/start-scan/AWSChooseScan';
import { AWSConfigureScan } from '../features/onboard/components/start-scan/AWSConfigureScan';
import { K8ChooseScan } from '../features/onboard/components/start-scan/K8ChooseScan';
import { K8sConfigureScan } from '../features/onboard/components/start-scan/K8sConfigureScan';
import {
  OnboardLayout,
  rootOnboardLoader,
} from '../features/onboard/layouts/OnboardLayout';
import { ChooseScanLayout } from '../features/onboard/pages/ChooseScan';
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
            path: 'host/k8s',
            element: <K8sConnection />,
          },
          {
            path: 'docker',
            element: <DockerConnection />,
          },
          {
            path: 'registry/amazon-ecr',
            element: <AmazonECRConnection />,
          },
        ],
      },
      {
        path: 'choose-scan',
        element: <ChooseScanLayout />,
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
            element: <AWSConfigureScan />,
          },
          {
            path: 'k8s/configure',
            element: <K8sConfigureScan />,
          },
        ],
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
