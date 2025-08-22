/**
 * Компонент для проверки аутентификации пользователя
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { ROUTES } from "../constants";

interface AuthGuardProps {
  children: React.ReactElement;
  fallbackPath?: string;
  requireAuth?: boolean;
}

/**
 * Компонент для проверки аутентификации
 * Может работать как для защищенных, так и для публичных маршрутов
 */
export function AuthGuard({
  children,
  fallbackPath = ROUTES.ROOT,
  requireAuth = true,
}: AuthGuardProps): React.ReactElement {
  const { isAuthenticated } = useSelector((state: RootState) => state.settings);

  // Для защищенных маршрутов - редирект если не аутентифицирован
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Для публичных маршрутов - редирект если уже аутентифицирован
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
