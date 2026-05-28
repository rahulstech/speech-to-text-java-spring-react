import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import STTChat from './pages/STTChat';
import Registration from './pages/Registration';
import LogIn from './pages/LogIn';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import ProtectedRouter from './routers/ProtectedRouter';

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

export default function App() {
  return (
    <AppContextProvider>

      <QueryClientProvider client={queryClient}>

        <RouterProvider router={router} />

      </QueryClientProvider>

    </AppContextProvider>

  );
}