import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/lib/react-query.ts'; // Импортируем queryClient
import { AppRouter } from './app/AppRouter.tsx';

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}