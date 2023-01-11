import { RouteObject } from 'react-router-dom';

import { DashboardLayout } from '../features/dashboard/layouts/DashboardLayout';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { OnboardLayout } from '../features/onboard/layouts/OnboardLayout';

export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/onboard',
    element: <OnboardLayout />,
  },
];
