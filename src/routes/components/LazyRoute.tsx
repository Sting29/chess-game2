/**
 * Компонент для обертки lazy-загружаемых маршрутов
 */

import React, { Suspense } from "react";
import { LazyErrorBoundary } from "./LazyErrorBoundary";
import FullScreenLoader from "src/components/FullScreenLoader/FullScreenLoader";

interface LazyRouteProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
}

/**
 * Компонент-обертка для lazy компонентов с Suspense
 * Использует FullScreenLoader для полноэкранной загрузки
 */
export function LazyRoute({
  children,
  fallback,
}: LazyRouteProps): React.ReactElement {
  const defaultFallback = fallback || <FullScreenLoader size="medium" />;

  return (
    <LazyErrorBoundary>
      <Suspense fallback={defaultFallback}>{children}</Suspense>
    </LazyErrorBoundary>
  );
}
