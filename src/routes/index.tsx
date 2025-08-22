import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { allRoutes } from "./routeGroups";
import { MetadataProvider } from "./components";

// Обертка для интеграции MetadataProvider внутри Router контекста
function RootLayout() {
  return (
    <MetadataProvider>
      <Outlet />
    </MetadataProvider>
  );
}

// Добавляем RootLayout как родительский маршрут
const routesWithMetadata = [
  {
    path: "/",
    element: <RootLayout />,
    children: allRoutes,
  },
];

const router = createBrowserRouter(routesWithMetadata);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

// Экспорт всех утилит для использования в компонентах
export * from "./types";
export * from "./constants";
export * from "./pathHelpers";
export * from "./navigationUtils";
export * from "./metadata";
export * from "./components";
