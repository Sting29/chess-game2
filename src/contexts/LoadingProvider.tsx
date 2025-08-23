/**
 * LoadingProvider - провайдер для управления состояниями загрузки
 */

import React, {
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import {
  LoadingContext,
  LoadingState,
  LoadingContextType,
} from "./LoadingContext";
import { performanceMonitor } from "../utils/LoadingPerformanceMonitor";

interface LoadingProviderProps {
  children: ReactNode;
}

const DEFAULT_DELAY = 200; // 200ms задержка по умолчанию

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [activeLoading, setActiveLoading] = useState<Map<string, LoadingState>>(
    new Map()
  );

  // Очистка всех таймеров при размонтировании
  useEffect(() => {
    return () => {
      activeLoading.forEach((state) => {
        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
        }
      });
    };
  }, [activeLoading]);

  const startLoading = useCallback(
    (key: string, message?: string, delay: number = DEFAULT_DELAY) => {
      // Записываем начало операции для мониторинга производительности
      performanceMonitor.recordOperationStart(key, delay);

      const loadingState: LoadingState = {
        key,
        startTime: Date.now(),
        message,
        delay,
        visible: false,
        timeoutId: setTimeout(() => {
          setActiveLoading((prev) => {
            const newMap = new Map(prev);
            const state = newMap.get(key);
            if (state) {
              newMap.set(key, { ...state, visible: true });
            }
            return newMap;
          });
        }, delay),
      };

      setActiveLoading((prev) => {
        const newMap = new Map(prev);
        // Очищаем предыдущий таймер если есть
        const existingState = newMap.get(key);
        if (existingState?.timeoutId) {
          clearTimeout(existingState.timeoutId);
        }
        newMap.set(key, loadingState);
        return newMap;
      });
    },
    []
  );

  const stopLoading = useCallback((key: string) => {
    setActiveLoading((prev) => {
      const newMap = new Map(prev);
      const state = newMap.get(key);
      if (state) {
        // Записываем завершение операции для мониторинга производительности
        performanceMonitor.recordOperationEnd(key, state.visible);

        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
        }
        newMap.delete(key);
      }
      return newMap;
    });
  }, []);

  const isLoading = useCallback(
    (key?: string) => {
      if (key) {
        const state = activeLoading.get(key);
        return state?.visible || false;
      }
      // Проверяем есть ли хотя бы одно видимое состояние загрузки
      return Array.from(activeLoading.values()).some((state) => state.visible);
    },
    [activeLoading]
  );

  const getActiveLoadingKeys = useCallback(() => {
    return Array.from(activeLoading.keys());
  }, [activeLoading]);

  // Мемоизируем вычисления для предотвращения лишних ре-рендеров
  const { isGlobalLoading, loadingMessage } = useMemo(() => {
    const visibleStates = Array.from(activeLoading.values()).filter(
      (state) => state.visible
    );

    return {
      isGlobalLoading: visibleStates.length > 0,
      loadingMessage: visibleStates.find((state) => state.message)?.message,
    };
  }, [activeLoading]);

  // Мемоизируем контекстное значение с оптимизацией для предотвращения лишних ре-рендеров
  const contextValue: LoadingContextType = useMemo(
    () => ({
      isGlobalLoading,
      loadingMessage,
      startLoading,
      stopLoading,
      isLoading,
      getActiveLoadingKeys,
    }),
    [
      isGlobalLoading,
      loadingMessage,
      startLoading,
      stopLoading,
      isLoading,
      getActiveLoadingKeys,
    ]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
