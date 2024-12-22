// src/shared/lib/react-router.ts
export const pathKeys = {
    home: () => '/home',
    login: () => '/login',
    vendorLogin: () => '/vendorLogin',
    homeVendor: () => '/homeVendor',
    product: (id: string) => `/product/${id}`,
    // Добавьте другие пути по мере необходимости
};