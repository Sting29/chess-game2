/**
 * Tests for LoadingPerformanceMonitor
 * Verifies performance monitoring, metrics collection, and optimization features
 */

import { LoadingPerformanceMonitor } from "../utils/LoadingPerformanceMonitor";

describe("LoadingPerformanceMonitor", () => {
  let monitor: LoadingPerformanceMonitor;

  beforeEach(() => {
    monitor = new LoadingPerformanceMonitor();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Basic Monitoring", () => {
    it("should initialize with default metrics", () => {
      const metrics = monitor.getCurrentMetrics();

      expect(metrics.activeOperations).toBe(0);
      expect(metrics.totalOperationsStarted).toBe(0);
      expect(metrics.totalOperationsCompleted).toBe(0);
      expect(metrics.averageOperationDuration).toBe(0);
      expect(metrics.renderCount).toBe(0);
    });

    it("should start and stop monitoring correctly", () => {
      monitor.startMonitoring();

      // Record some operations
      monitor.recordOperationStart("test-1", 200);
      monitor.recordRender();

      jest.advanceTimersByTime(100);

      monitor.recordOperationEnd("test-1", true);

      const finalMetrics = monitor.stopMonitoring();

      expect(finalMetrics.totalOperationsStarted).toBe(1);
      expect(finalMetrics.totalOperationsCompleted).toBe(1);
      expect(finalMetrics.renderCount).toBe(1);
      expect(finalMetrics.monitoringDuration).toBeGreaterThan(0);
    });

    it("should track active operations correctly", () => {
      monitor.startMonitoring();

      // Start multiple operations
      monitor.recordOperationStart("op-1", 200);
      monitor.recordOperationStart("op-2", 200);
      monitor.recordOperationStart("op-3", 200);

      let metrics = monitor.getCurrentMetrics();
      expect(metrics.activeOperations).toBe(3);
      expect(metrics.peakActiveOperations).toBe(3);

      // Complete one operation
      monitor.recordOperationEnd("op-1", true);

      metrics = monitor.getCurrentMetrics();
      expect(metrics.activeOperations).toBe(2);
      expect(metrics.peakActiveOperations).toBe(3); // Peak should remain

      // Complete remaining operations
      monitor.recordOperationEnd("op-2", false);
      monitor.recordOperationEnd("op-3", true);

      metrics = monitor.getCurrentMetrics();
      expect(metrics.activeOperations).toBe(0);
      expect(metrics.totalOperationsCompleted).toBe(3);
    });
  });

  describe("Performance Metrics Calculation", () => {
    it("should calculate average operation duration correctly", () => {
      monitor.startMonitoring();

      // Start operations with different durations
      monitor.recordOperationStart("fast-op", 200);
      jest.advanceTimersByTime(100);
      monitor.recordOperationEnd("fast-op", false); // 100ms, under threshold

      monitor.recordOperationStart("slow-op", 200);
      jest.advanceTimersByTime(300);
      monitor.recordOperationEnd("slow-op", true); // 300ms, over threshold

      const metrics = monitor.getCurrentMetrics();

      expect(metrics.averageOperationDuration).toBe(200); // (100 + 300) / 2
      expect(metrics.operationsUnderThreshold).toBe(1);
      expect(metrics.operationsOverThreshold).toBe(1);
    });

    it("should track delay efficiency correctly", () => {
      monitor.startMonitoring();

      // Multiple quick operations (under threshold)
      for (let i = 0; i < 7; i++) {
        monitor.recordOperationStart(`quick-${i}`, 200);
        jest.advanceTimersByTime(150);
        monitor.recordOperationEnd(`quick-${i}`, false);
      }

      // Few slow operations (over threshold)
      for (let i = 0; i < 3; i++) {
        monitor.recordOperationStart(`slow-${i}`, 200);
        jest.advanceTimersByTime(250);
        monitor.recordOperationEnd(`slow-${i}`, true);
      }

      const metrics = monitor.getCurrentMetrics();

      expect(metrics.operationsUnderThreshold).toBe(7);
      expect(metrics.operationsOverThreshold).toBe(3);

      // Delay efficiency should be 70% (7 out of 10 operations under threshold)
      const efficiency =
        metrics.operationsUnderThreshold /
        (metrics.operationsUnderThreshold + metrics.operationsOverThreshold);
      expect(efficiency).toBe(0.7);
    });

    it("should estimate memory usage correctly", () => {
      monitor.startMonitoring();

      // Start 5 operations
      for (let i = 0; i < 5; i++) {
        monitor.recordOperationStart(`mem-test-${i}`, 200);
      }

      const metrics = monitor.getCurrentMetrics();

      expect(metrics.activeOperations).toBe(5);
      expect(metrics.estimatedMemoryUsageKB).toBe(0.5); // 5 * 0.1KB
    });

    it("should track render count correctly", () => {
      monitor.startMonitoring();

      // Simulate multiple renders
      for (let i = 0; i < 15; i++) {
        monitor.recordRender();
      }

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.renderCount).toBe(15);
    });
  });

  describe("Performance Analysis", () => {
    it("should detect high number of active operations", () => {
      monitor.startMonitoring();

      // Start more operations than threshold (10)
      for (let i = 0; i < 12; i++) {
        monitor.recordOperationStart(`overload-${i}`, 200);
      }

      const alerts = monitor.analyzePerformance();
      const activeOpsAlert = alerts.find(
        (a) => a.metric === "activeOperations"
      );

      expect(activeOpsAlert).toBeDefined();
      expect(activeOpsAlert?.type).toBe("warning");
      expect(activeOpsAlert?.value).toBe(12);
      expect(activeOpsAlert?.threshold).toBe(10);
    });

    it("should detect long-running operations", () => {
      monitor.startMonitoring();

      // Start operation that runs longer than threshold (5000ms)
      monitor.recordOperationStart("long-op", 200);
      jest.advanceTimersByTime(6000);
      monitor.recordOperationEnd("long-op", true);

      const alerts = monitor.analyzePerformance();
      const durationAlert = alerts.find(
        (a) => a.metric === "averageOperationDuration"
      );

      expect(durationAlert).toBeDefined();
      expect(durationAlert?.type).toBe("error");
      expect(durationAlert?.value).toBe(6000);
      expect(durationAlert?.threshold).toBe(5000);
    });

    it("should detect high memory usage", () => {
      monitor.startMonitoring();

      // Start enough operations to exceed memory threshold (5KB = 50 operations)
      for (let i = 0; i < 60; i++) {
        monitor.recordOperationStart(`memory-${i}`, 200);
      }

      const alerts = monitor.analyzePerformance();
      const memoryAlert = alerts.find(
        (a) => a.metric === "estimatedMemoryUsageKB"
      );

      expect(memoryAlert).toBeDefined();
      expect(memoryAlert?.type).toBe("warning");
      expect(memoryAlert?.value).toBe(6); // 60 * 0.1KB
      expect(memoryAlert?.threshold).toBe(5);
    });

    it("should detect excessive re-renders", () => {
      monitor.startMonitoring();

      // Simulate excessive renders (more than threshold of 50)
      for (let i = 0; i < 60; i++) {
        monitor.recordRender();
      }

      const alerts = monitor.analyzePerformance();
      const renderAlert = alerts.find((a) => a.metric === "renderCount");

      expect(renderAlert).toBeDefined();
      expect(renderAlert?.type).toBe("warning");
      expect(renderAlert?.value).toBe(60);
      expect(renderAlert?.threshold).toBe(50);
    });

    it("should detect poor delay efficiency", () => {
      monitor.startMonitoring();

      // Create scenario with poor delay efficiency (less than 70%)
      // 2 quick operations, 8 slow operations = 20% efficiency
      for (let i = 0; i < 2; i++) {
        monitor.recordOperationStart(`quick-${i}`, 200);
        jest.advanceTimersByTime(150);
        monitor.recordOperationEnd(`quick-${i}`, false);
      }

      for (let i = 0; i < 8; i++) {
        monitor.recordOperationStart(`slow-${i}`, 200);
        jest.advanceTimersByTime(250);
        monitor.recordOperationEnd(`slow-${i}`, true);
      }

      const alerts = monitor.analyzePerformance();
      const efficiencyAlert = alerts.find(
        (a) => a.metric === "delayEfficiency"
      );

      expect(efficiencyAlert).toBeDefined();
      expect(efficiencyAlert?.type).toBe("info");
      expect(efficiencyAlert?.value).toBe(20); // 20% efficiency
      expect(efficiencyAlert?.threshold).toBe(70);
    });
  });

  describe("Performance Report Generation", () => {
    it("should generate comprehensive performance report", () => {
      monitor.startMonitoring();

      // Create mixed performance scenario
      monitor.recordOperationStart("test-op", 200);
      jest.advanceTimersByTime(300);
      monitor.recordOperationEnd("test-op", true);

      for (let i = 0; i < 5; i++) {
        monitor.recordRender();
      }

      const report = monitor.generatePerformanceReport();

      expect(report.summary).toContain("healthy");
      expect(report.metrics).toBeDefined();
      expect(report.metrics.totalOperationsCompleted).toBe(1);
      expect(report.metrics.renderCount).toBe(5);
      expect(report.alerts).toBeInstanceOf(Array);
      expect(report.recommendations).toBeInstanceOf(Array);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });

    it("should generate error summary when performance issues exist", () => {
      monitor.startMonitoring();

      // Create performance issues
      monitor.recordOperationStart("long-op", 200);
      jest.advanceTimersByTime(6000); // Exceeds duration threshold
      monitor.recordOperationEnd("long-op", true);

      const report = monitor.generatePerformanceReport();

      expect(report.summary).toContain("Performance issues detected");
      expect(report.summary).toContain("errors");
      expect(report.alerts.some((a) => a.type === "error")).toBe(true);
    });

    it("should generate warning summary when performance concerns exist", () => {
      monitor.startMonitoring();

      // Create performance concerns (not critical errors)
      for (let i = 0; i < 12; i++) {
        monitor.recordOperationStart(`warning-${i}`, 200);
      }

      const report = monitor.generatePerformanceReport();

      expect(report.summary).toContain("Performance concerns detected");
      expect(report.summary).toContain("warnings");
      expect(report.alerts.some((a) => a.type === "warning")).toBe(true);
    });
  });

  describe("Monitor Reset and Cleanup", () => {
    it("should reset all metrics correctly", () => {
      monitor.startMonitoring();

      // Generate some activity
      monitor.recordOperationStart("reset-test", 200);
      monitor.recordRender();
      jest.advanceTimersByTime(100);
      monitor.recordOperationEnd("reset-test", true);

      // Verify activity was recorded
      let metrics = monitor.getCurrentMetrics();
      expect(metrics.totalOperationsStarted).toBe(1);
      expect(metrics.renderCount).toBe(1);

      // Reset and verify clean state
      monitor.reset();
      metrics = monitor.getCurrentMetrics();

      expect(metrics.totalOperationsStarted).toBe(0);
      expect(metrics.totalOperationsCompleted).toBe(0);
      expect(metrics.renderCount).toBe(0);
      expect(metrics.activeOperations).toBe(0);
      expect(metrics.peakActiveOperations).toBe(0);
    });

    it("should handle monitoring state correctly after reset", () => {
      monitor.startMonitoring();
      expect(monitor.getCurrentMetrics().monitoringStartTime).toBeGreaterThan(
        0
      );

      monitor.reset();
      expect(monitor.getCurrentMetrics().monitoringStartTime).toBe(0);

      // Should be able to start monitoring again
      monitor.startMonitoring();
      expect(monitor.getCurrentMetrics().monitoringStartTime).toBeGreaterThan(
        0
      );
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle operations that end without starting", () => {
      monitor.startMonitoring();

      // Try to end operation that was never started
      monitor.recordOperationEnd("non-existent", true);

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.totalOperationsCompleted).toBe(0);
      expect(metrics.activeOperations).toBe(0);
    });

    it("should handle multiple ends for same operation", () => {
      monitor.startMonitoring();

      monitor.recordOperationStart("double-end", 200);
      jest.advanceTimersByTime(100);

      // End operation twice
      monitor.recordOperationEnd("double-end", true);
      monitor.recordOperationEnd("double-end", true);

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.totalOperationsCompleted).toBe(1); // Should only count once
    });

    it("should handle monitoring when not started", () => {
      // Don't start monitoring
      monitor.recordOperationStart("no-monitoring", 200);
      monitor.recordRender();
      monitor.recordOperationEnd("no-monitoring", true);

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.totalOperationsStarted).toBe(0);
      expect(metrics.renderCount).toBe(0);
    });

    it("should handle zero-duration operations", () => {
      monitor.startMonitoring();

      monitor.recordOperationStart("instant", 200);
      // End immediately without advancing time
      monitor.recordOperationEnd("instant", false);

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.averageOperationDuration).toBe(0);
      expect(metrics.operationsUnderThreshold).toBe(1);
    });
  });
});
