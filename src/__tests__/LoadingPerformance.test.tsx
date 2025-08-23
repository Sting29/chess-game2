/**
 * Performance tests for loading system
 * Tests loading delay thresholds, re-render optimization, and performance characteristics
 *
 * Requirements tested:
 * - 1.3: Loading delay thresholds work correctly (200ms)
 * - 2.4: Performance optimization and cleanup
 * - 5.4: Centralized loading state management performance
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { LoadingProvider } from "../contexts/LoadingProvider";
import { useLoading, LOADING_KEYS } from "../hooks/useLoading";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay";

// Component to test loading delay thresholds
function LoadingDelayTestComponent() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [testResults, setTestResults] = React.useState<{
    quickTest: { shown: boolean; duration: number };
    slowTest: { shown: boolean; duration: number };
  }>({
    quickTest: { shown: false, duration: 0 },
    slowTest: { shown: false, duration: 0 },
  });

  const testQuickOperation = () => {
    const startTime = performance.now();
    startLoading(LOADING_KEYS.INITIAL_AUTH, "Quick test", 200);

    // Complete operation in 50ms (under threshold)
    setTimeout(() => {
      const endTime = performance.now();
      stopLoading(LOADING_KEYS.INITIAL_AUTH);
      setTestResults((prev) => ({
        ...prev,
        quickTest: {
          shown: isLoading(LOADING_KEYS.INITIAL_AUTH),
          duration: endTime - startTime,
        },
      }));
    }, 50);
  };

  const testSlowOperation = () => {
    const startTime = performance.now();
    startLoading(LOADING_KEYS.PROFILE_LOAD, "Slow test", 200);

    // Complete operation in 300ms (over threshold)
    setTimeout(() => {
      const endTime = performance.now();
      stopLoading(LOADING_KEYS.PROFILE_LOAD);
      setTestResults((prev) => ({
        ...prev,
        slowTest: {
          shown: isLoading(LOADING_KEYS.PROFILE_LOAD),
          duration: endTime - startTime,
        },
      }));
    }, 300);
  };

  return (
    <div data-testid="delay-test">
      <button data-testid="quick-test-btn" onClick={testQuickOperation}>
        Quick Test
      </button>
      <button data-testid="slow-test-btn" onClick={testSlowOperation}>
        Slow Test
      </button>
      <div data-testid="current-loading">
        Loading: {isLoading() ? "true" : "false"}
      </div>
      <div data-testid="quick-result">
        Quick: {testResults.quickTest.shown ? "shown" : "not-shown"} (
        {testResults.quickTest.duration.toFixed(2)}ms)
      </div>
      <div data-testid="slow-result">
        Slow: {testResults.slowTest.shown ? "shown" : "not-shown"} (
        {testResults.slowTest.duration.toFixed(2)}ms)
      </div>
    </div>
  );
}

// Component to test re-render performance
function RenderCountTestComponent() {
  const { isGlobalLoading, startLoading, stopLoading } = useLoading();
  const renderCountRef = React.useRef(0);
  const [renderCount, setRenderCount] = React.useState(0);

  // Count renders
  React.useEffect(() => {
    renderCountRef.current += 1;
    setRenderCount(renderCountRef.current);
  });

  const triggerMultipleOperations = () => {
    // Start multiple operations rapidly
    startLoading(LOADING_KEYS.LOGIN, "Login");
    startLoading(LOADING_KEYS.PROFILE_LOAD, "Profile");
    startLoading(LOADING_KEYS.SETTINGS_UPDATE, "Settings");

    // Stop them after delays
    setTimeout(() => stopLoading(LOADING_KEYS.LOGIN), 100);
    setTimeout(() => stopLoading(LOADING_KEYS.PROFILE_LOAD), 200);
    setTimeout(() => stopLoading(LOADING_KEYS.SETTINGS_UPDATE), 300);
  };

  return (
    <div data-testid="render-count-test">
      <div data-testid="render-count">Renders: {renderCount}</div>
      <div data-testid="global-loading">
        Global Loading: {isGlobalLoading ? "true" : "false"}
      </div>
      <button
        data-testid="trigger-multiple"
        onClick={triggerMultipleOperations}
      >
        Trigger Multiple Operations
      </button>
    </div>
  );
}

// Component to test memory usage and cleanup
function MemoryTestComponent() {
  const { startLoading, stopLoading, getActiveLoadingKeys } = useLoading();
  const [activeKeys, setActiveKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveKeys(getActiveLoadingKeys());
    }, 50);

    return () => clearInterval(interval);
  }, [getActiveLoadingKeys]);

  const createManyOperations = () => {
    // Create many loading operations
    for (let i = 0; i < 100; i++) {
      startLoading(`test-operation-${i}`, `Operation ${i}`);
    }
  };

  const cleanupOperations = () => {
    // Cleanup all operations
    for (let i = 0; i < 100; i++) {
      stopLoading(`test-operation-${i}`);
    }
  };

  return (
    <div data-testid="memory-test">
      <div data-testid="active-count">
        Active Operations: {activeKeys.length}
      </div>
      <button data-testid="create-many" onClick={createManyOperations}>
        Create Many Operations
      </button>
      <button data-testid="cleanup-all" onClick={cleanupOperations}>
        Cleanup All
      </button>
    </div>
  );
}

describe("Loading Performance Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Loading Delay Threshold Performance", () => {
    it("should not show loading for operations under 200ms threshold", async () => {
      render(
        <LoadingProvider>
          <LoadingDelayTestComponent />
        </LoadingProvider>
      );

      const quickButton = screen.getByTestId("quick-test-btn");

      // Start quick operation
      act(() => {
        quickButton.click();
      });

      // Should not show loading immediately
      expect(screen.getByTestId("current-loading")).toHaveTextContent(
        "Loading: false"
      );

      // Fast-forward 50ms (operation completes before 200ms threshold)
      act(() => {
        jest.advanceTimersByTime(50);
      });

      // Should still not show loading
      expect(screen.getByTestId("current-loading")).toHaveTextContent(
        "Loading: false"
      );

      // Fast-forward past threshold to ensure no loading appears
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Verify quick operation never showed loading
      expect(screen.getByTestId("quick-result")).toHaveTextContent(
        "Quick: not-shown"
      );
    });

    it("should show loading for operations over 200ms threshold", async () => {
      render(
        <LoadingProvider>
          <LoadingDelayTestComponent />
        </LoadingProvider>
      );

      const slowButton = screen.getByTestId("slow-test-btn");

      // Start slow operation
      act(() => {
        slowButton.click();
      });

      // Should not show loading immediately
      expect(screen.getByTestId("current-loading")).toHaveTextContent(
        "Loading: false"
      );

      // Fast-forward to 200ms threshold
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should now show loading
      expect(screen.getByTestId("current-loading")).toHaveTextContent(
        "Loading: true"
      );

      // Fast-forward to operation completion (300ms total)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Loading should be cleared
      expect(screen.getByTestId("current-loading")).toHaveTextContent(
        "Loading: false"
      );
    });

    it("should handle precise timing around 200ms threshold", async () => {
      const TestPreciseTimingComponent = () => {
        const { startLoading, stopLoading, isLoading } = useLoading();
        const [results, setResults] = React.useState<{
          at199ms: boolean;
          at200ms: boolean;
          at201ms: boolean;
        }>({ at199ms: false, at200ms: false, at201ms: false });

        const testPreciseTiming = () => {
          // Test operation that completes at exactly 199ms
          startLoading("test-199", "Test 199ms", 200);
          setTimeout(() => {
            setResults((prev) => ({ ...prev, at199ms: isLoading("test-199") }));
            stopLoading("test-199");
          }, 199);

          // Test operation that completes at exactly 200ms
          startLoading("test-200", "Test 200ms", 200);
          setTimeout(() => {
            setResults((prev) => ({ ...prev, at200ms: isLoading("test-200") }));
            stopLoading("test-200");
          }, 200);

          // Test operation that completes at exactly 201ms
          startLoading("test-201", "Test 201ms", 200);
          setTimeout(() => {
            setResults((prev) => ({ ...prev, at201ms: isLoading("test-201") }));
            stopLoading("test-201");
          }, 201);
        };

        return (
          <div data-testid="precise-timing-test">
            <button data-testid="test-precise" onClick={testPreciseTiming}>
              Test Precise Timing
            </button>
            <div data-testid="result-199">
              199ms: {results.at199ms ? "shown" : "not-shown"}
            </div>
            <div data-testid="result-200">
              200ms: {results.at200ms ? "shown" : "not-shown"}
            </div>
            <div data-testid="result-201">
              201ms: {results.at201ms ? "shown" : "not-shown"}
            </div>
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestPreciseTimingComponent />
        </LoadingProvider>
      );

      const testButton = screen.getByTestId("test-precise");

      act(() => {
        testButton.click();
      });

      // Fast-forward through all timing tests
      act(() => {
        jest.advanceTimersByTime(250);
      });

      // 199ms should not show loading (under threshold)
      expect(screen.getByTestId("result-199")).toHaveTextContent(
        "199ms: not-shown"
      );

      // 200ms should show loading (at threshold)
      expect(screen.getByTestId("result-200")).toHaveTextContent(
        "200ms: shown"
      );

      // 201ms should show loading (over threshold)
      expect(screen.getByTestId("result-201")).toHaveTextContent(
        "201ms: shown"
      );
    });
  });

  describe("Re-render Performance Optimization", () => {
    it("should minimize re-renders during loading state changes", async () => {
      render(
        <LoadingProvider>
          <RenderCountTestComponent />
        </LoadingProvider>
      );

      // Get initial render count
      const initialRenderCount = parseInt(
        screen.getByTestId("render-count").textContent?.split(": ")[1] || "0"
      );

      const triggerButton = screen.getByTestId("trigger-multiple");

      // Trigger multiple operations
      act(() => {
        triggerButton.click();
      });

      // Fast-forward through all operations
      act(() => {
        jest.advanceTimersByTime(400);
      });

      // Get final render count
      const finalRenderCount = parseInt(
        screen.getByTestId("render-count").textContent?.split(": ")[1] || "0"
      );

      // Should have minimal re-renders (less than 10 for 3 operations)
      const renderDifference = finalRenderCount - initialRenderCount;
      expect(renderDifference).toBeLessThan(10);
    });

    it("should not cause unnecessary re-renders when loading states don't change", async () => {
      const TestStableComponent = () => {
        const { isGlobalLoading } = useLoading();
        const renderCountRef = React.useRef(0);
        const [renderCount, setRenderCount] = React.useState(0);

        React.useEffect(() => {
          renderCountRef.current += 1;
          setRenderCount(renderCountRef.current);
        }, []);

        return (
          <div data-testid="stable-test">
            <div data-testid="stable-render-count">Renders: {renderCount}</div>
            <div data-testid="stable-loading">
              Loading: {isGlobalLoading ? "true" : "false"}
            </div>
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestStableComponent />
        </LoadingProvider>
      );

      // Get initial render count
      const initialRenderCount = parseInt(
        screen.getByTestId("stable-render-count").textContent?.split(": ")[1] ||
          "0"
      );

      // Wait without any loading operations
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Render count should remain stable
      const finalRenderCount = parseInt(
        screen.getByTestId("stable-render-count").textContent?.split(": ")[1] ||
          "0"
      );

      expect(finalRenderCount).toBe(initialRenderCount);
    });
  });

  describe("Memory Usage and Cleanup Performance", () => {
    it("should handle many concurrent operations without memory leaks", async () => {
      render(
        <LoadingProvider>
          <MemoryTestComponent />
        </LoadingProvider>
      );

      const createButton = screen.getByTestId("create-many");
      const cleanupButton = screen.getByTestId("cleanup-all");

      // Create many operations
      act(() => {
        createButton.click();
      });

      // Should track all operations
      expect(screen.getByTestId("active-count")).toHaveTextContent(
        "Active Operations: 100"
      );

      // Cleanup all operations
      act(() => {
        cleanupButton.click();
      });

      // Should clear all operations
      expect(screen.getByTestId("active-count")).toHaveTextContent(
        "Active Operations: 0"
      );
    });

    it("should automatically cleanup operations after timeout", async () => {
      const TestTimeoutComponent = () => {
        const { startLoading, getActiveLoadingKeys } = useLoading();
        const [activeCount, setActiveCount] = React.useState(0);

        React.useEffect(() => {
          const interval = setInterval(() => {
            setActiveCount(getActiveLoadingKeys().length);
          }, 100);

          return () => clearInterval(interval);
        }, [getActiveLoadingKeys]);

        const createLongOperation = () => {
          startLoading("long-operation", "Long operation", 200);
          // Don't manually stop it - let timeout handle it
        };

        return (
          <div data-testid="timeout-test">
            <div data-testid="timeout-active-count">Active: {activeCount}</div>
            <button data-testid="create-long" onClick={createLongOperation}>
              Create Long Operation
            </button>
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestTimeoutComponent />
        </LoadingProvider>
      );

      const createButton = screen.getByTestId("create-long");

      // Create long operation
      act(() => {
        createButton.click();
      });

      // Should have active operation
      expect(screen.getByTestId("timeout-active-count")).toHaveTextContent(
        "Active: 1"
      );

      // Fast-forward to timeout (30 seconds)
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      // Should be cleaned up automatically
      expect(screen.getByTestId("timeout-active-count")).toHaveTextContent(
        "Active: 0"
      );
    });
  });

  describe("LoadingOverlay Performance", () => {
    it("should not re-render when props don't change", async () => {
      let overlayRenderCount = 0;

      const TestOverlayComponent = () => {
        const { isGlobalLoading, loadingMessage } = useLoading();
        const [unrelatedState, setUnrelatedState] = React.useState(0);

        // Track overlay renders
        const OverlayWithCounter = React.memo(() => {
          overlayRenderCount++;
          return (
            <LoadingOverlay
              show={isGlobalLoading}
              message={loadingMessage}
              data-testid="performance-overlay"
            />
          );
        });

        return (
          <div data-testid="overlay-performance-test">
            <OverlayWithCounter />
            <button
              data-testid="update-unrelated"
              onClick={() => setUnrelatedState((prev) => prev + 1)}
            >
              Update Unrelated State
            </button>
            <div data-testid="unrelated-state">State: {unrelatedState}</div>
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestOverlayComponent />
        </LoadingProvider>
      );

      const initialRenderCount = overlayRenderCount;
      const updateButton = screen.getByTestId("update-unrelated");

      // Update unrelated state multiple times
      act(() => {
        updateButton.click();
        updateButton.click();
        updateButton.click();
      });

      // Overlay should not re-render due to unrelated state changes
      expect(overlayRenderCount).toBe(initialRenderCount);
    });
  });

  describe("Performance Benchmarks", () => {
    it("should complete loading operations within performance thresholds", async () => {
      const TestBenchmarkComponent = () => {
        const { startLoading, stopLoading } = useLoading();
        const [benchmarkResults, setBenchmarkResults] = React.useState<{
          startTime: number;
          stopTime: number;
          duration: number;
        } | null>(null);

        const runBenchmark = () => {
          const startTime = performance.now();

          startLoading(LOADING_KEYS.PROFILE_LOAD, "Benchmark test");

          setTimeout(() => {
            stopLoading(LOADING_KEYS.PROFILE_LOAD);
            const stopTime = performance.now();

            setBenchmarkResults({
              startTime,
              stopTime,
              duration: stopTime - startTime,
            });
          }, 100);
        };

        return (
          <div data-testid="benchmark-test">
            <button data-testid="run-benchmark" onClick={runBenchmark}>
              Run Benchmark
            </button>
            {benchmarkResults && (
              <div data-testid="benchmark-results">
                Duration: {benchmarkResults.duration.toFixed(2)}ms
              </div>
            )}
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestBenchmarkComponent />
        </LoadingProvider>
      );

      const benchmarkButton = screen.getByTestId("run-benchmark");

      act(() => {
        benchmarkButton.click();
      });

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Should complete within reasonable time (less than 200ms overhead)
      const resultsElement = screen.getByTestId("benchmark-results");
      const duration = parseFloat(
        resultsElement.textContent?.match(/(\d+\.\d+)ms/)?.[1] || "0"
      );

      expect(duration).toBeLessThan(200); // Should have minimal overhead
    });
  });
});
