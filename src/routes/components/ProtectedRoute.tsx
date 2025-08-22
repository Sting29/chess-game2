/**
 * Улучшенный компонент для защищенных маршрутов
 * Комбинирует все необходимые проверки и обертки
 */

import React from "react";
import { RouteGuard } from "./RouteGuard";
import { AuthGuard } from "./AuthGuard";
import { LazyRoute } from "./LazyRoute";
import { LayoutWrapper } from "./LayoutWrapper";

interface ProtectedRouteProps {
  children: React.ReactElement;
  fallbackPath?: string;
  useLayout?: boolean;
  requireAuth?: boolean;
}

/**
 * Композитный компонент для защищенных маршрутов
 * Объединяет RouteGuard, AuthGuard, LazyRoute и LayoutWrapper
 */
export function ProtectedRoute({
  children,
  fallbackPath,
  useLayout = true,
  requireAuth = true,
}: ProtectedRouteProps): React.ReactElement {
  return (
    <RouteGuard>
      <AuthGuard fallbackPath={fallbackPath} requireAuth={requireAuth}>
        <LayoutWrapper useLayout={useLayout}>
          <LazyRoute>{children}</LazyRoute>
        </LayoutWrapper>
      </AuthGuard>
    </RouteGuard>
  );
}
