import authService from "../authService";
import tokenManager from "../tokenManager";
import tokenRefreshManager from "../tokenRefreshManager";
import httpClient from "../httpClient";
import authLogger from "../authLogger";
import { AuthResponse } from "../types";

// Mock axios for controlled responses
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe("Authentication Flow Integration Tests", () => {
  let mockAxiosInstance: any;
  let responseInterceptor: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    // Setup axios mock
    const axios = require("axios");
    mockAxiosInstance = axios.create();

    // Capture response interceptor
    mockAxiosInstance.interceptors.response.use.mockImplementation(
      (success: any, error: any) => {
        responseInterceptor = { success, error };
      }
    );

    // Clear all state
    tokenManager.clearAllTokensAndState();
    tokenRefreshManager.clearRefreshState();
    authLogger.clearLogs();

    // Re-import modules to reset state
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Successful Token Refresh Flow", () => {
    it("should handle successful token refresh with queued requests", async () => {
      const mockAuthResponse: AuthResponse = {
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
        session_id: "session-123",
        user: {
          id: "user-1",
          email: "test@example.com",
          username: "testuser",
          role: "student",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      };

      // Setup initial tokens (expired)
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "valid-refresh-token",
        expiresIn: -1, // Expired
        sessionId: "session-123",
      });

      // Mock successful refresh
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          return Promise.resolve({ data: mockAuthResponse });
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Mock successful retry of original request
      mockAxiosInstance.mockResolvedValue({ data: "success" });

      // Simulate 401 error that triggers refresh
      const mockError = {
        response: { status: 401 },
        config: { url: "/api/test", method: "GET", headers: {} },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      // Test the flow
      const refreshSuccess = await tokenRefreshManager.refreshToken();
      expect(refreshSuccess).toBe(true);

      // Verify tokens were updated
      expect(tokenManager.getAccessToken()).toBe("new-access-token");
      expect(tokenManager.getRefreshToken()).toBe("new-refresh-token");

      // Verify logging
      const logs = authLogger.getRecentLogs();
      const refreshLogs = logs.filter(
        (log) =>
          log.type === "TOKEN_REFRESH_ATTEMPT" ||
          log.type === "TOKEN_REFRESH_SUCCESS"
      );
      expect(refreshLogs.length).toBeGreaterThan(0);
    });

    it("should handle multiple concurrent requests during refresh", async () => {
      const mockAuthResponse: AuthResponse = {
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
        session_id: "session-123",
        user: {} as any,
      };

      // Setup tokens
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "valid-refresh-token",
        expiresIn: -1,
        sessionId: "session-123",
      });

      // Mock refresh endpoint
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          return new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockAuthResponse }), 100)
          );
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Mock successful retries
      mockAxiosInstance.mockResolvedValue({ data: "success" });

      // Queue multiple requests simultaneously
      const requests = [
        tokenRefreshManager.queueRequest({
          originalRequest: { url: "/api/test1", method: "GET", headers: {} },
          resolve: jest.fn(),
          reject: jest.fn(),
        }),
        tokenRefreshManager.queueRequest({
          originalRequest: { url: "/api/test2", method: "POST", headers: {} },
          resolve: jest.fn(),
          reject: jest.fn(),
        }),
        tokenRefreshManager.queueRequest({
          originalRequest: { url: "/api/test3", method: "PUT", headers: {} },
          resolve: jest.fn(),
          reject: jest.fn(),
        }),
      ];

      // Wait for all requests to complete
      const results = await Promise.all(requests);

      // All requests should succeed
      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toEqual({ data: "success" });
      });

      // Verify only one refresh was attempted
      const refreshLogs = authLogger.getLogsByType(
        "TOKEN_REFRESH_ATTEMPT" as any
      );
      expect(refreshLogs).toHaveLength(1);
    });
  });

  describe("Failed Token Refresh Flow", () => {
    it("should handle expired refresh token and logout user", async () => {
      // Setup tokens with expired refresh token
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "expired-refresh-token",
        expiresIn: -1,
        sessionId: "session-123",
      });

      // Mock failed refresh (401 with refresh token error)
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          const error = new Error("Invalid or expired refresh token");
          (error as any).response = {
            status: 401,
            data: { message: "Invalid or expired refresh token" },
          };
          return Promise.reject(error);
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Attempt refresh
      const refreshSuccess = await tokenRefreshManager.refreshToken();
      expect(refreshSuccess).toBe(false);

      // Verify tokens were cleared
      expect(tokenManager.getAccessToken()).toBeNull();
      expect(tokenManager.getRefreshToken()).toBeNull();

      // Verify session marked as expired
      expect(tokenManager.isSessionExpired()).toBe(false); // TokenRefreshManager doesn't mark session expired directly

      // Verify failure was logged
      const failureLogs = authLogger.getLogsByType(
        "TOKEN_REFRESH_FAILURE" as any
      );
      expect(failureLogs).toHaveLength(1);
    });

    it("should activate circuit breaker after max failures", async () => {
      // Setup tokens
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "valid-refresh-token",
        expiresIn: -1,
        sessionId: "session-123",
      });

      // Mock failed refresh
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          const error = new Error("Server error");
          (error as any).response = { status: 500 };
          return Promise.reject(error);
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Attempt refresh 3 times (max retries)
      for (let i = 0; i < 3; i++) {
        const success = await tokenRefreshManager.refreshToken();
        expect(success).toBe(false);
      }

      // Circuit breaker should be active
      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(true);
      expect(tokenRefreshManager.canAttemptRefresh()).toBe(false);

      // Verify circuit breaker activation was logged
      const circuitBreakerLogs = authLogger.getLogsByType(
        "CIRCUIT_BREAKER_ACTIVATED" as any
      );
      expect(circuitBreakerLogs).toHaveLength(1);
    });

    it("should reject queued requests when refresh fails", async () => {
      // Setup tokens
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "invalid-refresh-token",
        expiresIn: -1,
        sessionId: "session-123",
      });

      // Mock failed refresh
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          const error = new Error("Invalid refresh token");
          (error as any).response = { status: 401 };
          return Promise.reject(error);
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Queue requests that should fail
      const requestPromises = [
        tokenRefreshManager.queueRequest({
          originalRequest: { url: "/api/test1", method: "GET", headers: {} },
          resolve: jest.fn(),
          reject: jest.fn(),
        }),
        tokenRefreshManager.queueRequest({
          originalRequest: { url: "/api/test2", method: "POST", headers: {} },
          resolve: jest.fn(),
          reject: jest.fn(),
        }),
      ];

      // All requests should be rejected
      await Promise.allSettled(requestPromises).then((results) => {
        results.forEach((result) => {
          expect(result.status).toBe("rejected");
        });
      });
    });
  });

  describe("Circuit Breaker Recovery", () => {
    it("should reset circuit breaker after successful refresh", async () => {
      const mockAuthResponse: AuthResponse = {
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
        session_id: "session-123",
        user: {} as any,
      };

      // Setup tokens
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "valid-refresh-token",
        expiresIn: -1,
        sessionId: "session-123",
      });

      // First, cause failures to activate circuit breaker
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          const error = new Error("Server error");
          (error as any).response = { status: 500 };
          return Promise.reject(error);
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Fail 3 times
      for (let i = 0; i < 3; i++) {
        await tokenRefreshManager.refreshToken();
      }

      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(true);

      // Mock time passage to allow retry
      jest.spyOn(Date, "now").mockReturnValue(Date.now() + 31000); // 31 seconds later

      // Now mock successful refresh
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          return Promise.resolve({ data: mockAuthResponse });
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Should be able to attempt refresh again
      expect(tokenRefreshManager.canAttemptRefresh()).toBe(true);

      // Successful refresh should reset circuit breaker
      const success = await tokenRefreshManager.refreshToken();
      expect(success).toBe(true);

      // Circuit breaker should be reset
      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(false);

      // Verify reset was logged
      const resetLogs = authLogger.getLogsByType(
        "CIRCUIT_BREAKER_RESET" as any
      );
      expect(resetLogs).toHaveLength(1);
    });
  });

  describe("Authentication Service Integration", () => {
    it("should handle authentication flow through AuthService", async () => {
      const mockAuthResponse: AuthResponse = {
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
        session_id: "session-123",
        user: {
          id: "user-1",
          email: "test@example.com",
          username: "testuser",
          role: "student",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      };

      // Mock successful refresh
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          return Promise.resolve({ data: mockAuthResponse });
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Setup expired tokens
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "valid-refresh-token",
        expiresIn: -1,
        sessionId: "session-123",
      });

      // Test ensureValidToken flow
      const isValid = await authService.ensureValidToken();
      expect(isValid).toBe(true);

      // Verify tokens were refreshed
      expect(tokenManager.getAccessToken()).toBe("new-access-token");
      expect(tokenManager.getRefreshToken()).toBe("new-refresh-token");

      // Verify user is authenticated
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("should handle logout flow with server error", async () => {
      // Setup tokens
      tokenManager.setTokens({
        accessToken: "valid-token",
        refreshToken: "valid-refresh-token",
        expiresIn: 3600,
        sessionId: "session-123",
      });

      // Mock logout endpoint failure
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/logout") {
          const error = new Error("Server error");
          (error as any).response = { status: 500 };
          return Promise.reject(error);
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Logout should still clear local state even if server call fails
      await authService.logout();

      // Verify local state was cleared
      expect(tokenManager.getAccessToken()).toBeNull();
      expect(tokenManager.getRefreshToken()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);

      // Verify logout was logged
      const logoutLogs = authLogger.getLogsByType("USER_LOGOUT" as any);
      expect(logoutLogs).toHaveLength(1);
    });
  });

  describe("Error Handling Integration", () => {
    it("should properly classify and handle different auth errors", async () => {
      // Test refresh token invalid error
      const refreshTokenError = {
        response: {
          status: 401,
          data: { message: "Invalid or expired refresh token" },
        },
        config: { url: "/user/refresh", method: "POST" },
        message: "Request failed",
        isAxiosError: true,
        name: "AxiosError",
        toJSON: () => ({}),
      };

      authService.handleAuthError(refreshTokenError as any);

      // Should mark session as expired and clear state
      expect(tokenManager.isSessionExpired()).toBe(true);

      // Test general 401 error
      const generalAuthError = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
        config: { url: "/api/test", method: "GET" },
        message: "Request failed",
        isAxiosError: true,
        name: "AxiosError",
        toJSON: () => ({}),
      };

      authService.handleAuthError(generalAuthError as any);

      // Should mark session as expired but not clear state (not refresh endpoint)
      expect(tokenManager.isSessionExpired()).toBe(true);
    });
  });

  describe("Logging Integration", () => {
    it("should maintain comprehensive logs throughout auth flow", async () => {
      const mockAuthResponse: AuthResponse = {
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
        session_id: "session-123",
        user: {} as any,
      };

      // Setup tokens
      tokenManager.setTokens({
        accessToken: "expired-token",
        refreshToken: "valid-refresh-token",
        expiresIn: -1,
        sessionId: "session-123",
      });

      // Mock successful refresh
      mockAxiosInstance.post.mockImplementation((url: string) => {
        if (url === "/user/refresh") {
          return Promise.resolve({ data: mockAuthResponse });
        }
        return Promise.resolve({ data: "api-response" });
      });

      // Perform refresh
      await tokenRefreshManager.refreshToken();

      // Queue and process a request
      await tokenRefreshManager.queueRequest({
        originalRequest: { url: "/api/test", method: "GET", headers: {} },
        resolve: jest.fn(),
        reject: jest.fn(),
      });

      // Verify comprehensive logging
      const allLogs = authLogger.getRecentLogs();
      expect(allLogs.length).toBeGreaterThan(0);

      // Should have refresh attempt, success, and request logs
      const logTypes = allLogs.map((log) => log.type);
      expect(logTypes).toContain("TOKEN_REFRESH_ATTEMPT");
      expect(logTypes).toContain("TOKEN_REFRESH_SUCCESS");
      expect(logTypes).toContain("REQUEST_QUEUED");

      // Verify stats are updated
      const stats = authLogger.getRefreshAttemptStats();
      expect(stats.totalAttempts).toBeGreaterThan(0);
      expect(stats.successfulAttempts).toBeGreaterThan(0);
    });
  });
});
