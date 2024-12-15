// src/shared/lib/react-router.ts
export const pathKeys = {
    home: () => '/',
    login: () => '/login',
    product: (id: string) => `/product/${id}`,
    // Добавьте другие пути по мере необходимости
};