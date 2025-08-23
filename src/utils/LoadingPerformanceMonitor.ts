/**
 * LoadingPerformanceMonitor - утилита для мониторинга производительности системы загрузки
 * Предоставляет метрики, диагностику и оптимизацию производительности
 */

export interface PerformanceMetrics {
  // Основные метрики
  activeOperations: number;
  totalOperationsStarted: number;
  totalOperationsCompleted: number;
  averageOperationDuration: number;

  // Метрики задержки
  operationsUnderThreshold: number;
  operationsOverThreshold: number;
  averageDelayBeforeShow: number;

  // Метрики памяти
  peakActiveOperations: number;
  estimatedMemoryUsageKB: number;

  // Метрики производительности
  averageStartTime: number;
  averageStopTime: number;
  renderCount: number;

  // Временные метрики
  monitoringStartTime: number;
  monitoringDuration: number;
}

export interface PerformanceAlert {
  type: "warning" | "error" | "info";
  message: string;
  metric: string;
  value: number;
  threshold: number;
  recommendation: string;
}

export class LoadingPerformanceMonitor {
  private metrics: PerformanceMetrics;
  private operationHistory: Array<{
    key: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    delayBeforeShow: number;
    wasVisible: boolean;
  }> = [];

  private renderHistory: number[] = [];
  private isMonitoring = false;
  private monitoringStartTime = 0;

  // Пороговые значения для алертов
  private readonly thresholds = {
    maxActiveOperations: 10,
    maxAverageOperationDuration: 5000, // 5 секунд
    maxMemoryUsageKB: 5, // 5KB
    maxRenderCount: 50,
    delayThreshold: 200, // 200ms
  };

  constructor() {
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      activeOperations: 0,
      totalOperationsStarted: 0,
      totalOperationsCompleted: 0,
      averageOperationDuration: 0,
      operationsUnderThreshold: 0,
      operationsOverThreshold: 0,
      averageDelayBeforeShow: 0,
      peakActiveOperations: 0,
      estimatedMemoryUsageKB: 0,
      averageStartTime: 0,
      averageStopTime: 0,
      renderCount: 0,
      monitoringStartTime: 0,
      monitoringDuration: 0,
    };
  }

  /**
   * Начинает мониторинг производительности
   */
  startMonitoring(): void {
    this.isMonitoring = true;
    this.monitoringStartTime = performance.now();
    this.metrics.monitoringStartTime = this.monitoringStartTime;
    this.operationHistory = [];
    this.renderHistory = [];
  }

  /**
   * Останавливает мониторинг производительности
   */
  stopMonitoring(): PerformanceMetrics {
    this.isMonitoring = false;
    this.metrics.monitoringDuration =
      performance.now() - this.monitoringStartTime;
    this.calculateFinalMetrics();
    return this.metrics;
  }

  /**
   * Записывает начало операции загрузки
   */
  recordOperationStart(key: string, delay: number): void {
    if (!this.isMonitoring) return;

    const startTime = performance.now();

    this.operationHistory.push({
      key,
      startTime,
      delayBeforeShow: delay,
      wasVisible: false,
    });

    this.metrics.totalOperationsStarted++;
    this.metrics.activeOperations++;
    this.metrics.peakActiveOperations = Math.max(
      this.metrics.peakActiveOperations,
      this.metrics.activeOperations
    );

    this.updateAverageStartTime(startTime - this.monitoringStartTime);
  }

  /**
   * Записывает завершение операции загрузки
   */
  recordOperationEnd(key: string, wasVisible: boolean): void {
    if (!this.isMonitoring) return;

    const endTime = performance.now();
    const operation = this.operationHistory.find(
      (op) => op.key === key && !op.endTime
    );

    if (operation) {
      operation.endTime = endTime;
      operation.duration = endTime - operation.startTime;
      operation.wasVisible = wasVisible;

      this.metrics.totalOperationsCompleted++;
      this.metrics.activeOperations = Math.max(
        0,
        this.metrics.activeOperations - 1
      );

      // Классифицируем операцию по времени выполнения
      if (operation.duration < this.thresholds.delayThreshold) {
        this.metrics.operationsUnderThreshold++;
      } else {
        this.metrics.operationsOverThreshold++;
      }

      this.updateAverageStopTime(endTime - this.monitoringStartTime);
    }
  }

  /**
   * Записывает ре-рендер компонента
   */
  recordRender(): void {
    if (!this.isMonitoring) return;

    const renderTime = performance.now();
    this.renderHistory.push(renderTime);
    this.metrics.renderCount++;
  }

  /**
   * Получает текущие метрики производительности
   */
  getCurrentMetrics(): PerformanceMetrics {
    if (this.isMonitoring) {
      this.calculateCurrentMetrics();
    }
    return { ...this.metrics };
  }

  /**
   * Анализирует производительность и возвращает алерты
   */
  analyzePerformance(): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];
    const currentMetrics = this.getCurrentMetrics();

    // Проверка количества активных операций
    if (currentMetrics.activeOperations > this.thresholds.maxActiveOperations) {
      alerts.push({
        type: "warning",
        message: "High number of active loading operations",
        metric: "activeOperations",
        value: currentMetrics.activeOperations,
        threshold: this.thresholds.maxActiveOperations,
        recommendation:
          "Review loading operations for proper cleanup and consider batching operations",
      });
    }

    // Проверка средней продолжительности операций
    if (
      currentMetrics.averageOperationDuration >
      this.thresholds.maxAverageOperationDuration
    ) {
      alerts.push({
        type: "error",
        message: "Operations taking too long to complete",
        metric: "averageOperationDuration",
        value: currentMetrics.averageOperationDuration,
        threshold: this.thresholds.maxAverageOperationDuration,
        recommendation:
          "Optimize API calls and add timeout handling for long operations",
      });
    }

    // Проверка использования памяти
    if (
      currentMetrics.estimatedMemoryUsageKB > this.thresholds.maxMemoryUsageKB
    ) {
      alerts.push({
        type: "warning",
        message: "High memory usage by loading system",
        metric: "estimatedMemoryUsageKB",
        value: currentMetrics.estimatedMemoryUsageKB,
        threshold: this.thresholds.maxMemoryUsageKB,
        recommendation:
          "Implement more aggressive cleanup and consider operation pooling",
      });
    }

    // Проверка количества ре-рендеров
    if (currentMetrics.renderCount > this.thresholds.maxRenderCount) {
      alerts.push({
        type: "warning",
        message: "High number of component re-renders",
        metric: "renderCount",
        value: currentMetrics.renderCount,
        threshold: this.thresholds.maxRenderCount,
        recommendation:
          "Optimize React component memoization and reduce unnecessary state updates",
      });
    }

    // Проверка эффективности задержки
    const delayEfficiency =
      currentMetrics.operationsUnderThreshold /
      (currentMetrics.operationsUnderThreshold +
        currentMetrics.operationsOverThreshold);

    if (delayEfficiency < 0.7) {
      // Менее 70% операций завершаются быстро
      alerts.push({
        type: "info",
        message: "Many operations exceed delay threshold",
        metric: "delayEfficiency",
        value: delayEfficiency * 100,
        threshold: 70,
        recommendation:
          "Consider adjusting delay threshold or optimizing operation performance",
      });
    }

    return alerts;
  }

  /**
   * Генерирует отчет о производительности
   */
  generatePerformanceReport(): {
    summary: string;
    metrics: PerformanceMetrics;
    alerts: PerformanceAlert[];
    recommendations: string[];
  } {
    const metrics = this.getCurrentMetrics();
    const alerts = this.analyzePerformance();

    const summary = this.generateSummary(metrics, alerts);
    const recommendations = this.generateRecommendations(alerts);

    return {
      summary,
      metrics,
      alerts,
      recommendations,
    };
  }

  /**
   * Сбрасывает все метрики
   */
  reset(): void {
    this.metrics = this.initializeMetrics();
    this.operationHistory = [];
    this.renderHistory = [];
    this.isMonitoring = false;
    this.monitoringStartTime = 0;
  }

  private calculateCurrentMetrics(): void {
    const completedOperations = this.operationHistory.filter(
      (op) => op.endTime
    );

    if (completedOperations.length > 0) {
      // Средняя продолжительность операций
      const totalDuration = completedOperations.reduce(
        (sum, op) => sum + (op.duration || 0),
        0
      );
      this.metrics.averageOperationDuration =
        totalDuration / completedOperations.length;

      // Средняя задержка перед показом
      const visibleOperations = completedOperations.filter(
        (op) => op.wasVisible
      );
      if (visibleOperations.length > 0) {
        const totalDelay = visibleOperations.reduce(
          (sum, op) => sum + op.delayBeforeShow,
          0
        );
        this.metrics.averageDelayBeforeShow =
          totalDelay / visibleOperations.length;
      }
    }

    // Оценка использования памяти
    this.metrics.estimatedMemoryUsageKB = this.metrics.activeOperations * 0.1;

    // Обновление времени мониторинга
    if (this.isMonitoring) {
      this.metrics.monitoringDuration =
        performance.now() - this.monitoringStartTime;
    }
  }

  private calculateFinalMetrics(): void {
    this.calculateCurrentMetrics();

    // Финальные расчеты после завершения мониторинга
    const completedOperations = this.operationHistory.filter(
      (op) => op.endTime
    );

    if (completedOperations.length > 0) {
      // Обновляем финальные метрики
      this.metrics.totalOperationsCompleted = completedOperations.length;
    }
  }

  private updateAverageStartTime(relativeTime: number): void {
    const count = this.metrics.totalOperationsStarted;
    this.metrics.averageStartTime =
      (this.metrics.averageStartTime * (count - 1) + relativeTime) / count;
  }

  private updateAverageStopTime(relativeTime: number): void {
    const count = this.metrics.totalOperationsCompleted;
    this.metrics.averageStopTime =
      (this.metrics.averageStopTime * (count - 1) + relativeTime) / count;
  }

  private generateSummary(
    metrics: PerformanceMetrics,
    alerts: PerformanceAlert[]
  ): string {
    const errorCount = alerts.filter((a) => a.type === "error").length;
    const warningCount = alerts.filter((a) => a.type === "warning").length;

    if (errorCount > 0) {
      return `Performance issues detected: ${errorCount} errors, ${warningCount} warnings. Immediate attention required.`;
    } else if (warningCount > 0) {
      return `Performance concerns detected: ${warningCount} warnings. Consider optimization.`;
    } else {
      return `Loading system performance is healthy. ${metrics.totalOperationsCompleted} operations completed successfully.`;
    }
  }

  private generateRecommendations(alerts: PerformanceAlert[]): string[] {
    const recommendations = new Set<string>();

    alerts.forEach((alert) => {
      recommendations.add(alert.recommendation);
    });

    // Добавляем общие рекомендации
    if (alerts.length === 0) {
      recommendations.add(
        "Continue monitoring performance during peak usage periods"
      );
      recommendations.add(
        "Consider implementing performance budgets for loading operations"
      );
    }

    return Array.from(recommendations);
  }
}

// Глобальный экземпляр монитора производительности
export const performanceMonitor = new LoadingPerformanceMonitor();

/**
 * Хук для мониторинга производительности загрузки
 */
export function useLoadingPerformanceMonitor() {
  return {
    startMonitoring: () => performanceMonitor.startMonitoring(),
    stopMonitoring: () => performanceMonitor.stopMonitoring(),
    getCurrentMetrics: () => performanceMonitor.getCurrentMetrics(),
    analyzePerformance: () => performanceMonitor.analyzePerformance(),
    generateReport: () => performanceMonitor.generatePerformanceReport(),
    reset: () => performanceMonitor.reset(),
  };
}
