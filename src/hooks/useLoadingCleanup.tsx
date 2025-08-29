/**
 * useLoadingCleanup - хук для автоматической очистки состояний загрузки
 * Обеспечивает правильную очистку при размонтировании компонентов
 */

import React, { useEffect, useRef } from "react";
import { useLoading } from "./useLoading";

export interface UseLoadingCleanupOptions {
  // Ключи загрузки для автоматической очистки
  keys?: string[];
  // Очищать все состояния при размонтировании
  cleanupAll?: boolean;
  // Таймаут для принудительной очистки (в мс)
  timeout?: number;
}

/**
 * Хук для автоматической очистки состояний загрузки
 * Предотвращает утечки памяти и зависшие состояния загрузки
 */
export function useLoadingCleanup(options: UseLoadingCleanupOptions = {}) {
  const { keys = [], cleanupAll = false, timeout = 30000 } = options;
  const { stopLoading, getActiveLoadingKeys } = useLoading();
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const mountedRef = useRef(true);

  // Функция для очистки конкретного ключа
  const cleanupKey = (key: string) => {
    if (mountedRef.current) {
      stopLoading(key);
    }

    const timeoutId = timeoutRefs.current.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(key);
    }
  };

  // Функция для очистки всех ключей
  const cleanupAllKeys = () => {
    if (cleanupAll) {
      const activeKeys = getActiveLoadingKeys();
      activeKeys.forEach(cleanupKey);
    } else {
      keys.forEach(cleanupKey);
    }
  };

  // Функция для установки таймаута принудительной очистки
  const setCleanupTimeout = (key: string) => {
    const timeoutId = setTimeout(() => {
      cleanupKey(key);
    }, timeout);

    timeoutRefs.current.set(key, timeoutId);
  };

  // Очистка при размонтировании
  useEffect(() => {
    mountedRef.current = true;

    // Сохраняем ссылку на timeoutRefs внутри эффекта
    const timeoutsRef = timeoutRefs.current;

    return () => {
      mountedRef.current = false;
      cleanupAllKeys();

      // Очищаем все таймауты
      timeoutsRef.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutsRef.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Устанавливаем таймауты для указанных ключей
  useEffect(() => {
    keys.forEach(setCleanupTimeout);

    // Сохраняем ссылку на timeoutRefs внутри эффекта
    const timeoutsRef = timeoutRefs.current;

    return () => {
      keys.forEach((key) => {
        const timeoutId = timeoutsRef.get(key);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutsRef.delete(key);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, timeout]);

  return {
    // Ручная очистка
    cleanup: cleanupKey,
    cleanupAll: cleanupAllKeys,

    // Установка таймаута для ключа
    setCleanupTimeout,

    // Проверка состояния монтирования
    isMounted: () => mountedRef.current,
  };
}

/**
 * HOC для автоматической очистки загрузки
 */
export function withLoadingCleanup<P extends object>(
  Component: React.ComponentType<P>,
  options: UseLoadingCleanupOptions = {}
) {
  const WrappedComponent = (props: P) => {
    useLoadingCleanup(options);
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withLoadingCleanup(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

/**
 * Утилита для проверки состояния загрузки системы
 */
export function useLoadingSystemHealth() {
  const { getActiveLoadingKeys } = useLoading();

  return {
    // Получить диагностическую информацию
    getDiagnostics: () => {
      const activeKeys = getActiveLoadingKeys();

      return {
        activeOperations: activeKeys.length,
        activeKeys,
        timestamp: new Date().toISOString(),
        memoryUsage: {
          // Приблизительная оценка использования памяти
          estimatedKeys: activeKeys.length,
          estimatedMemoryKB: activeKeys.length * 0.1, // ~100 bytes per key
        },
      };
    },

    // Проверить на потенциальные утечки памяти
    checkForLeaks: () => {
      const activeKeys = getActiveLoadingKeys();
      const suspiciousThreshold = 10; // Более 10 активных операций может быть подозрительно

      return {
        hasPotentialLeaks: activeKeys.length > suspiciousThreshold,
        activeCount: activeKeys.length,
        suspiciousKeys:
          activeKeys.length > suspiciousThreshold ? activeKeys : [],
        recommendation:
          activeKeys.length > suspiciousThreshold
            ? "Consider reviewing loading operations for proper cleanup"
            : "Loading system appears healthy",
      };
    },
  };
}
