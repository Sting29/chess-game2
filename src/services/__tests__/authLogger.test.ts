import authLogger, { AuthLogType } from "../authLogger";
import { AuthErrorType } from "../errorHandler";
import { AxiosError } from "axios";

// Mock tokenManager
jest.mock("../tokenManager", () => ({
  default: {
    getSessionId: jest.fn(() => "session-123"),
  },
}));

describe("AuthLogger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    // Clear logs before each test
    authLogger.clearLogs();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("refresh attempt logging", () => {
    it("should log refresh attempt", () => {
      const startTime = Date.now();
      authLogger.logRefreshAttempt(1, startTime);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.TOKEN_REFRESH_ATTEMPT);
      expect(logs[0].context).toBe("Token refresh started");
      expect(logs[0].details.attemptNumber).toBe(1);
    });

    it("should log successful refresh", () => {
      const startTime = Date.now() - 1000;
      authLogger.logRefreshSuccess(2, startTime, 3600);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.TOKEN_REFRESH_SUCCESS);
      expect(logs[0].details.attemptNumber).toBe(2);
      expect(logs[0].details.duration).toBeGreaterThan(900);
      expect(logs[0].details.expiresIn).toBe(3600);
    });

    it("should log failed refresh", () => {
      const startTime = Date.now() - 500;
      const mockError = {
        message: "Refresh failed",
        response: { status: 401 },
        code: "UNAUTHORIZED",
      };

      authLogger.logRefreshFailure(3, startTime, mockError, true);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.TOKEN_REFRESH_FAILURE);
      expect(logs[0].details.attemptNumber).toBe(3);
      expect(logs[0].details.circuitBreakerActive).toBe(true);
      expect(logs[0].details.error.message).toBe("Refresh failed");
      expect(logs[0].details.error.status).toBe(401);
    });
  });

  describe("circuit breaker logging", () => {
    it("should log circuit breaker activation", () => {
      authLogger.logCircuitBreakerActivated(3, 3, 30000);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.CIRCUIT_BREAKER_ACTIVATED);
      expect(logs[0].details.failureCount).toBe(3);
      expect(logs[0].details.maxRetries).toBe(3);
      expect(logs[0].details.cooldownPeriod).toBe(30000);
      expect(logs[0].details.nextAttemptAllowedAt).toBeDefined();
    });

    it("should log circuit breaker reset", () => {
      authLogger.logCircuitBreakerReset(2);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.CIRCUIT_BREAKER_RESET);
      expect(logs[0].details.previousFailureCount).toBe(2);
    });
  });

  describe("request queuing logging", () => {
    it("should log queued requests", () => {
      authLogger.logRequestQueued("/api/test", "GET", 3);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.REQUEST_QUEUED);
      expect(logs[0].details.url).toBe("/api/test");
      expect(logs[0].details.method).toBe("GET");
      expect(logs[0].details.queueLength).toBe(3);
    });

    it("should log processed requests", () => {
      authLogger.logRequestProcessed("/api/test", "POST", true, 250);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.REQUEST_PROCESSED);
      expect(logs[0].details.url).toBe("/api/test");
      expect(logs[0].details.method).toBe("POST");
      expect(logs[0].details.success).toBe(true);
      expect(logs[0].details.duration).toBe(250);
    });
  });

  describe("token lifecycle logging", () => {
    it("should log token creation", () => {
      authLogger.logTokenLifecycle("created", "User login", 3600);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.TOKEN_LIFECYCLE);
      expect(logs[0].details.action).toBe("created");
      expect(logs[0].details.reason).toBe("User login");
      expect(logs[0].details.expiresIn).toBe(3600);

      const lifecycle = authLogger.getTokenLifecycleHistory();
      expect(lifecycle).toHaveLength(1);
      expect(lifecycle[0].action).toBe("created");
    });

    it("should log token expiration", () => {
      authLogger.logTokenLifecycle("expired", "Token timeout", undefined, 0);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.TOKEN_LIFECYCLE);
      expect(logs[0].details.action).toBe("expired");
      expect(logs[0].details.timeUntilExpiry).toBe(0);
    });
  });

  describe("authentication error logging", () => {
    it("should log authentication errors", () => {
      const mockError: AxiosError = {
        response: { status: 401, data: { message: "Unauthorized" } } as any,
        config: { url: "/api/test", method: "GET" },
        message: "Request failed",
        isAxiosError: true,
        name: "AxiosError",
        toJSON: () => ({}),
      };

      authLogger.logAuthError(mockError, AuthErrorType.UNAUTHORIZED, true);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.AUTH_ERROR);
      expect(logs[0].details.errorType).toBe(AuthErrorType.UNAUTHORIZED);
      expect(logs[0].details.status).toBe(401);
      expect(logs[0].details.shouldLogout).toBe(true);
    });
  });

  describe("session management logging", () => {
    it("should log session expiration", () => {
      authLogger.logSessionExpired("Token refresh failed");

      const logs = authLogger.getRecentLogs(2); // Should have 2 logs (session + lifecycle)
      const sessionLog = logs.find(
        (log) => log.type === AuthLogType.SESSION_EXPIRED
      );
      const lifecycleLog = logs.find(
        (log) => log.type === AuthLogType.TOKEN_LIFECYCLE
      );

      expect(sessionLog).toBeDefined();
      expect(sessionLog!.details.reason).toBe("Token refresh failed");

      expect(lifecycleLog).toBeDefined();
      expect(lifecycleLog!.details.action).toBe("expired");
    });

    it("should log user logout", () => {
      authLogger.logUserLogout("manual");

      const logs = authLogger.getRecentLogs(2); // Should have 2 logs (logout + lifecycle)
      const logoutLog = logs.find(
        (log) => log.type === AuthLogType.USER_LOGOUT
      );
      const lifecycleLog = logs.find(
        (log) => log.type === AuthLogType.TOKEN_LIFECYCLE
      );

      expect(logoutLog).toBeDefined();
      expect(logoutLog!.details.reason).toBe("manual");

      expect(lifecycleLog).toBeDefined();
      expect(lifecycleLog!.details.action).toBe("cleared");
    });
  });

  describe("analytics and monitoring", () => {
    beforeEach(() => {
      // Add some test data
      authLogger.logRefreshSuccess(1, Date.now() - 100, 3600);
      authLogger.logRefreshFailure(
        2,
        Date.now() - 200,
        new Error("Failed"),
        false
      );
      authLogger.logRefreshSuccess(3, Date.now() - 150, 3600);
    });

    it("should calculate refresh attempt stats", () => {
      const stats = authLogger.getRefreshAttemptStats();

      expect(stats.totalAttempts).toBe(3);
      expect(stats.successfulAttempts).toBe(2);
      expect(stats.failedAttempts).toBe(1);
      expect(stats.averageDuration).toBeGreaterThan(0);
      expect(stats.recentFailures).toHaveLength(1);
    });

    it("should get logs by type", () => {
      const refreshLogs = authLogger.getLogsByType(
        AuthLogType.TOKEN_REFRESH_SUCCESS
      );
      expect(refreshLogs).toHaveLength(2);
      expect(
        refreshLogs.every(
          (log) => log.type === AuthLogType.TOKEN_REFRESH_SUCCESS
        )
      ).toBe(true);
    });

    it("should get health status", () => {
      const health = authLogger.getHealthStatus();

      expect(health.isHealthy).toBe(true); // Only 1 error, less than threshold
      expect(health.recentErrors).toBe(1);
      expect(health.circuitBreakerActive).toBe(false);
      expect(health.lastRefreshAttempt).toBeDefined();
    });

    it("should detect unhealthy status with many errors", () => {
      // Add many errors
      for (let i = 0; i < 6; i++) {
        authLogger.logAuthError(
          { response: { status: 401 } } as any,
          AuthErrorType.UNAUTHORIZED,
          false
        );
      }

      const health = authLogger.getHealthStatus();
      expect(health.isHealthy).toBe(false);
      expect(health.recentErrors).toBeGreaterThanOrEqual(6);
    });
  });

  describe("infinite loop detection", () => {
    it("should log infinite loop detection", () => {
      authLogger.logInfiniteLoopDetection("token-refresh", 10, 5000);

      const logs = authLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(AuthLogType.INFINITE_LOOP_DETECTED);
      expect(logs[0].details.context).toBe("token-refresh");
      expect(logs[0].details.attemptCount).toBe(10);
      expect(logs[0].details.timeWindow).toBe(5000);
    });
  });

  describe("log management", () => {
    it("should limit log entries to max count", () => {
      // Add more than max entries (1000)
      for (let i = 0; i < 1100; i++) {
        authLogger.logRefreshAttempt(i, Date.now());
      }

      const logs = authLogger.getRecentLogs(2000);
      expect(logs.length).toBeLessThanOrEqual(1000);
    });

    it("should export all logs", () => {
      authLogger.logRefreshSuccess(1, Date.now() - 100, 3600);
      authLogger.logTokenLifecycle("created", "test");

      const exported = authLogger.exportLogs();

      expect(exported.logs.length).toBeGreaterThan(0);
      expect(exported.refreshAttempts.length).toBeGreaterThan(0);
      expect(exported.tokenLifecycle.length).toBeGreaterThan(0);
      expect(exported.stats).toBeDefined();
    });

    it("should clear all logs", () => {
      authLogger.logRefreshAttempt(1, Date.now());
      authLogger.logTokenLifecycle("created", "test");

      expect(authLogger.getRecentLogs().length).toBeGreaterThan(0);

      authLogger.clearLogs();

      expect(authLogger.getRecentLogs().length).toBe(0);
      expect(authLogger.getRefreshAttemptStats().totalAttempts).toBe(0);
      expect(authLogger.getTokenLifecycleHistory().length).toBe(0);
    });
  });

  describe("console logging", () => {
    it("should use error level for critical events", () => {
      authLogger.logRefreshFailure(
        1,
        Date.now() - 100,
        new Error("Failed"),
        false
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("TOKEN_REFRESH_FAILURE"),
        expect.any(Object)
      );
    });

    it("should use warn level for warnings", () => {
      authLogger.logSessionExpired("Test reason");

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("SESSION_EXPIRED"),
        expect.any(Object)
      );
    });

    it("should use log level for normal events", () => {
      authLogger.logRefreshSuccess(1, Date.now() - 100, 3600);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("TOKEN_REFRESH_SUCCESS"),
        expect.any(Object)
      );
    });
  });
});
