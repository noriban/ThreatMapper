import { RouteObject } from 'react-router-dom';

import { OnboardLayout } from '../features/onboard/layouts/OnboardLayout';
import { toplogyLoader } from '../features/topology/loader/topologyLoader';
import { TopologyGraph } from '../features/topology/pages/TopologyGraph';

export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <OnboardLayout />,
    children: [
      {
        path: 'topology',
        element: <TopologyGraph />,
        loader: toplogyLoader,
      },
    ],
  },
];
