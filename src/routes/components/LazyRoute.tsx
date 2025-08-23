/**
 * Компонент для обертки lazy-загружаемых маршрутов
 */

import React, { Suspense } from "react";
import styled from "styled-components";
import { LazyErrorBoundary } from "./LazyErrorBoundary";
import { Loader } from "src/components/Loader/Loader";

const LoadingContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

interface LazyRouteProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
}

/**
 * Компонент-обертка для lazy компонентов с Suspense
 */
export function LazyRoute({
  children,
  fallback,
}: LazyRouteProps): React.ReactElement {
  const defaultFallback = fallback || (
    <LoadingContainer>
      <Loader />
    </LoadingContainer>
  );

  return (
    <LazyErrorBoundary>
      <Suspense fallback={defaultFallback}>{children}</Suspense>
    </LazyErrorBoundary>
  );
}
