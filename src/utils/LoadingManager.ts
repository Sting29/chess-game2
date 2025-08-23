/**
 * LoadingManager - класс для управления состояниями загрузки с умной логикой задержки
 */

import { LoadingState } from "../contexts/LoadingContext";

export class LoadingManager {
  private activeLoading: Map<string, LoadingState> = new Map();
  private readonly DEFAULT_DELAY = 200; // 200ms
  private readonly MAX_TIMEOUT = 30000; // 30 секунд максимум
  private listeners: Set<() => void> = new Set();

  /**
   * Запускает состояние загрузки с задержкой
   */
  startLoading(
    key: string,
    message?: string,
    delay: number = this.DEFAULT_DELAY
  ): void {
    // Очищаем предыдущее состояние если есть
    this.stopLoading(key);

    const loadingState: LoadingState = {
      key,
      startTime: Date.now(),
      message,
      delay,
      visible: false,
      timeoutId: setTimeout(() => {
        this.showLoading(key);
      }, delay),
    };

    // Добавляем автоматическую очистку через MAX_TIMEOUT
    setTimeout(() => {
      this.stopLoading(key);
    }, this.MAX_TIMEOUT);

    this.activeLoading.set(key, loadingState);
    this.notifyListeners();
  }

  /**
   * Останавливает состояние загрузки
   */
  stopLoading(key: string): void {
    const loadingState = this.activeLoading.get(key);
    if (loadingState) {
      if (loadingState.timeoutId) {
        clearTimeout(loadingState.timeoutId);
      }
      this.activeLoading.delete(key);
      this.notifyListeners();
    }
  }

  /**
   * Показывает загрузку (делает видимой)
   */
  private showLoading(key: string): void {
    const loadingState = this.activeLoading.get(key);
    if (loadingState) {
      this.activeLoading.set(key, { ...loadingState, visible: true });
      this.notifyListeners();
    }
  }

  /**
   * Проверяет активно ли состояние загрузки
   */
  isLoading(key?: string): boolean {
    if (key) {
      const state = this.activeLoading.get(key);
      return state?.visible || false;
    }
    // Проверяем есть ли хотя бы одно видимое состояние
    return Array.from(this.activeLoading.values()).some(
      (state) => state.visible
    );
  }

  /**
   * Получает все активные ключи загрузки
   */
  getActiveLoadingKeys(): string[] {
    return Array.from(this.activeLoading.keys());
  }

  /**
   * Получает все видимые состояния загрузки
   */
  getVisibleLoadingStates(): LoadingState[] {
    return Array.from(this.activeLoading.values()).filter(
      (state) => state.visible
    );
  }

  /**
   * Получает сообщение от первого видимого состояния
   */
  getCurrentMessage(): string | undefined {
    return this.getVisibleLoadingStates().find((state) => state.message)
      ?.message;
  }

  /**
   * Проверяет есть ли глобальная загрузка
   */
  isGlobalLoading(): boolean {
    return this.getVisibleLoadingStates().length > 0;
  }

  /**
   * Очищает все состояния загрузки
   */
  clearAll(): void {
    for (const [key] of this.activeLoading) {
      this.stopLoading(key);
    }
  }

  /**
   * Добавляет слушателя изменений
   */
  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  /**
   * Удаляет слушателя изменений
   */
  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Уведомляет всех слушателей об изменениях
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Получает метрики производительности
   */
  getPerformanceMetrics(): {
    activeOperations: number;
    totalOperations: number;
    averageDelay: number;
    longestRunningOperation: number;
    memoryUsage: {
      estimatedKB: number;
      activeStates: number;
    };
  } {
    const activeStates = Array.from(this.activeLoading.values());
    const currentTime = Date.now();

    const totalOperations = activeStates.length;
    const averageDelay =
      totalOperations > 0
        ? activeStates.reduce((sum, state) => sum + state.delay, 0) /
          totalOperations
        : 0;

    const longestRunningOperation =
      totalOperations > 0
        ? Math.max(
            ...activeStates.map((state) => currentTime - state.startTime)
          )
        : 0;

    return {
      activeOperations: this.getVisibleLoadingStates().length,
      totalOperations,
      averageDelay,
      longestRunningOperation,
      memoryUsage: {
        estimatedKB: totalOperations * 0.1, // ~100 bytes per state
        activeStates: totalOperations,
      },
    };
  }

  /**
   * Проверяет на потенциальные проблемы производительности
   */
  checkPerformanceHealth(): {
    isHealthy: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const metrics = this.getPerformanceMetrics();
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Проверка на слишком много активных операций
    if (metrics.totalOperations > 10) {
      warnings.push(
        `High number of active operations: ${metrics.totalOperations}`
      );
      recommendations.push(
        "Consider reviewing loading operations for proper cleanup"
      );
    }

    // Проверка на долго выполняющиеся операции
    if (metrics.longestRunningOperation > 30000) {
      warnings.push(
        `Long-running operation detected: ${metrics.longestRunningOperation}ms`
      );
      recommendations.push(
        "Consider adding timeout handling for long operations"
      );
    }

    // Проверка на использование памяти
    if (metrics.memoryUsage.estimatedKB > 1) {
      warnings.push(`High memory usage: ${metrics.memoryUsage.estimatedKB}KB`);
      recommendations.push("Consider optimizing loading state management");
    }

    return {
      isHealthy: warnings.length === 0,
      warnings,
      recommendations,
    };
  }

  /**
   * Оптимизирует производительность путем очистки старых операций
   */
  optimizePerformance(): {
    cleaned: number;
    remaining: number;
  } {
    const currentTime = Date.now();
    const maxAge = 60000; // 1 минута
    let cleaned = 0;

    for (const [key, state] of this.activeLoading) {
      if (currentTime - state.startTime > maxAge) {
        this.stopLoading(key);
        cleaned++;
      }
    }

    return {
      cleaned,
      remaining: this.activeLoading.size,
    };
  }
}
