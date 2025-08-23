/**
 * useLoading - хук для работы с состояниями загрузки
 */

import { useCallback, useMemo, useEffect } from "react";
import { useLoadingContext } from "../contexts/LoadingContext";
import { performanceMonitor } from "../utils/LoadingPerformanceMonitor";

export interface UseLoadingReturn {
  // Состояния
  isGlobalLoading: boolean;
  loadingMessage?: string;

  // Методы управления
  startLoading: (key: string, message?: string, delay?: number) => void;
  stopLoading: (key: string) => void;

  // Утилитарные методы
  isLoading: (key?: string) => boolean;
  getActiveLoadingKeys: () => string[];

  // Удобные методы для типичных операций
  withLoading: <T>(
    key: string,
    operation: () => Promise<T>,
    message?: string
  ) => Promise<T>;
  withLoadingSync: <T>(key: string, operation: () => T, message?: string) => T;
}

/**
 * Хук для работы с загрузкой
 */
export function useLoading(): UseLoadingReturn {
  const context = useLoadingContext();

  // Записываем ре-рендеры для мониторинга производительности
  useEffect(() => {
    performanceMonitor.recordRender();
  });

  const withLoading = useCallback(
    async <T>(
      key: string,
      operation: () => Promise<T>,
      message?: string
    ): Promise<T> => {
      try {
        context.startLoading(key, message);
        const result = await operation();
        return result;
      } catch (error) {
        // Логируем ошибку для отладки
        console.error(`Loading operation failed for key "${key}":`, error);
        throw error;
      } finally {
        // Всегда очищаем состояние загрузки
        context.stopLoading(key);
      }
    },
    [context]
  );

  const withLoadingSync = useCallback(
    <T>(key: string, operation: () => T, message?: string): T => {
      try {
        context.startLoading(key, message);
        const result = operation();
        return result;
      } catch (error) {
        // Логируем ошибку для отладки
        console.error(`Sync loading operation failed for key "${key}":`, error);
        throw error;
      } finally {
        // Всегда очищаем состояние загрузки
        context.stopLoading(key);
      }
    },
    [context]
  );

  // Мемоизируем возвращаемый объект для предотвращения лишних ре-рендеров
  return useMemo(
    () => ({
      // Состояния из контекста
      isGlobalLoading: context.isGlobalLoading,
      loadingMessage: context.loadingMessage,

      // Методы из контекста
      startLoading: context.startLoading,
      stopLoading: context.stopLoading,
      isLoading: context.isLoading,
      getActiveLoadingKeys: context.getActiveLoadingKeys,

      // Удобные методы
      withLoading,
      withLoadingSync,
    }),
    [
      context.isGlobalLoading,
      context.loadingMessage,
      context.startLoading,
      context.stopLoading,
      context.isLoading,
      context.getActiveLoadingKeys,
      withLoading,
      withLoadingSync,
    ]
  );
}

// Константы для ключей загрузки
export const LOADING_KEYS = {
  INITIAL_AUTH: "initial_auth",
  LOGIN: "login",
  LOGOUT: "logout",
  PROFILE_LOAD: "profile_load",
  SETTINGS_UPDATE: "settings_update",
  LANGUAGE_UPDATE: "language_update",
  CHESS_SET_UPDATE: "chess_set_update",
  ROUTE_TRANSITION: "route_transition",
} as const;

export type LoadingKey = (typeof LOADING_KEYS)[keyof typeof LOADING_KEYS];
