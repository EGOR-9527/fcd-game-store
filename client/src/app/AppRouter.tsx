import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import { PageLogin } from "../pages/ui/PageLogin.tsx";
import { PageHome } from "../pages/ui/PageHome.tsx";
import { pathKeys } from '../shared/lib/react-router.ts'; // Убедитесь, что путь правильный

const routes = [
    {
        path: '/',
        loader: () => redirect(pathKeys.login()), // Перенаправление на страницу входа
    },
    {
        path: pathKeys.login(), // Путь для страницы входа
        element: <PageLogin />,
    },
    {
        path: pathKeys.home(), // Путь для домашней страницы
        element: <PageHome />,
    }
];

export function AppRouter() {
    const router = createBrowserRouter(routes); // Создаем маршрутизатор
    return <RouterProvider router={router} />;
}