import { useEffect } from 'react';
import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Home } from './pages/Home';
import { MonthSelect } from './pages/MonthSelect';
import { WeekSelect } from './pages/WeekSelect';
import { GameShell } from './components/GameShell';
import { GamePage } from './pages/GamePage';
import { Settings } from './pages/Settings';
import { useVocabStore } from './stores/useVocabStore';

function RootLayout() {
  const { isLoaded, loadAll } = useVocabStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="font-heading text-xl text-text-light">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      <Outlet />
    </div>
  );
}

const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/game/:gameId/month', element: <MonthSelect /> },
      { path: '/game/:gameId/week/:m', element: <WeekSelect /> },
      {
        path: '/game/:gameId/play/:uid',
        element: <GameShell />,
        children: [{ index: true, element: <GamePage /> }],
      },
      { path: '/settings', element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
