// src/shared/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

// Создаем экземпляр QueryClient
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Настройки по умолчанию для запросов
            staleTime: 1000 * 60 * 5, // Данные считаются "свежими" в течение 5 минут
            cacheTime: 1000 * 60 * 10, // Данные будут храниться в кэше в течение 10 минут
            refetchOnWindowFocus: true, // Перезапрашивать данные при фокусировке окна
        },
    },
});