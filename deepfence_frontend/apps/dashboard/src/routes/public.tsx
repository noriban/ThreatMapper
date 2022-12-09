import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { AuthLayout } from '../features/auth/layouts/AuthLayout';
import { loginAction } from '../features/auth/pages/Login';
import { registerAction } from '../features/auth/pages/Register';

const Login = lazy(() =>
  import('../features/auth/pages/Login').then((module) => ({
    default: module.Login,
  })),
);

const ForgotPassword = lazy(() =>
  import('../features/auth/pages/ForgotPassword').then((module) => ({
    default: module.ForgotPassword,
  })),
);

const Register = lazy(() =>
  import('../features/auth/pages/Register').then((module) => ({
    default: module.Register,
  })),
);

export const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
      },
    ],
  },
];
