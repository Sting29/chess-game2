/**
 * Компонент для обертки lazy-загружаемых маршрутов
 */

import React, { Suspense } from "react";
import { LazyErrorBoundary } from "./LazyErrorBoundary";
import { Loader } from "src/components/Loader/Loader";

interface LazyRouteProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
  loadingMessage?: string;
  showProgress?: boolean;
}

/**
 * Компонент-обертка для lazy компонентов с Suspense
 */
export function LazyRoute({
  children,
  fallback,
  loadingMessage = "Loading page...",
  showProgress = true,
}: LazyRouteProps): React.ReactElement {
  const defaultFallback = fallback || <Loader />;

  return (
    <LazyErrorBoundary>
      <Suspense fallback={defaultFallback}>{children}</Suspense>
    </LazyErrorBoundary>
  );
}
