import './index.css';

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes';
import { ThemeProvider, useThemeMode } from './theme/ThemeContext';

const Fallback = () => {
  return <div>.....</div>;
};

function App() {
  const { toggleMode, mode } = useThemeMode(true);
  return (
    <ThemeProvider value={{ toggleMode, mode }}>
      <div className="dark:bg-gray-900 bg-white">
        <Suspense fallback={<Fallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;
