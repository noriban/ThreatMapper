import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="h-screen bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 overflow-y-scroll">
      <Outlet />
    </div>
  );
};
