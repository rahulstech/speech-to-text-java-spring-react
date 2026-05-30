import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import STTChat from './pages/STTChat';
import Registration from './pages/Registration';
import LogIn from './pages/LogIn';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './context/AppContext';
import ProtectedRouter from './routers/ProtectedRouter';
import { useEffect } from 'react';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/register",
    element: (
      <ProtectedRouter requireAuth={false}>
        <Registration />
      </ProtectedRouter>
    )
  },
  {
    path: "/login",
    element: (
      <ProtectedRouter requireAuth={false}>
        <LogIn />
      </ProtectedRouter>
    )
  },
  {
    path: "/",
    element: (
      <ProtectedRouter>
        <STTChat />
      </ProtectedRouter>
    )
  }
])

function TitleUpdater() {
  const { pageTitle } = useAppContext()

  useEffect(()=> {
    if (pageTitle) {
      document.title = pageTitle
    }
  }, [pageTitle])

  return null;
}

export default function App() {
  return (
    <AppContextProvider>
      <TitleUpdater />

      <QueryClientProvider client={queryClient}>

        <RouterProvider router={router} />

      </QueryClientProvider>

    </AppContextProvider>

  );
}