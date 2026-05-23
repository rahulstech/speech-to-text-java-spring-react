import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import STTChat from './pages/STTChat';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <STTChat />
    </QueryClientProvider>
  );
}