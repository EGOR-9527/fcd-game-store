import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import { lazy } from 'react';
import { pathKeys } from '../shared/lib/react-router.ts';
import { PageLogin } from "../pages/ui/PageLogin.tsx";

const routes = [
    {
        path: '/', // Корневой путь
        loader: () => redirect(pathKeys.login()), // Перенаправление на страницу входа
    },
    {
        children: [
            { path: pathKeys.login(), element: <PageLogin /> }
        ]
    }
];

export function AppRouter() {
    const router = createBrowserRouter(routes); // Создаем маршрутизатор
    return <RouterProvider router={router} />;
}