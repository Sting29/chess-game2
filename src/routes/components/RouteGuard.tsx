/**
 * Компонент для обработки состояния загрузки аутентификации
 */

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Loader } from "src/components/Loader/Loader";

interface RouteGuardProps {
  children: React.ReactElement;
  loadingFallback?: React.ReactElement;
}

/**
 * Компонент-защитник, который показывает загрузку пока проверяется аутентификация
 */
export function RouteGuard({
  children,
  loadingFallback = <Loader />,
}: RouteGuardProps): React.ReactElement {
  const { loading } = useSelector((state: RootState) => state.settings);

  if (loading) {
    return loadingFallback;
  }

  return children;
}
