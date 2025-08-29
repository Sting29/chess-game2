import tokenRefreshManager from "../tokenRefreshManager";
import tokenManager from "../tokenManager";

// Mock dependencies
jest.mock("../tokenManager");
jest.mock("../httpClient", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    getInstance: jest.fn(),
  },
}));

import httpClient from "../httpClient";

const mockTokenManager = tokenManager as jest.Mocked<typeof tokenManager>;
const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe("TokenRefreshManager", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Clear refresh state
    tokenRefreshManager.clearRefreshState();

    // Setup default mock implementations
    mockTokenManager.hasRefreshToken.mockReturnValue(true);
    mockTokenManager.getRefreshToken.mockReturnValue("mock-refresh-token");
    mockTokenManager.getAuthHeader.mockReturnValue("Bearer mock-access-token");
    mockTokenManager.setTokens.mockImplementation(() => {});
    mockTokenManager.clearTokens.mockImplementation(() => {});

    // Setup default HTTP client mocks
    mockHttpClient.post.mockResolvedValue({
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
      expires_in: 3600,
      session_id: "session-123",
    });

    // Mock getInstance to return a mock axios instance function
    const mockAxiosInstance = jest.fn().mockResolvedValue({ data: "success" });
    mockHttpClient.getInstance.mockReturnValue(mockAxiosInstance as any);
  });

  afterEach(() => {
    // Clean up any remaining timers or async operations
    jest.clearAllTimers();
    jest.useRealTimers();

    // Clear refresh state to prevent test interference
    tokenRefreshManager.clearRefreshState();
  });

  describe("refreshToken", () => {
    it("should successfully refresh token", async () => {
      // Mock successful HTTP response
      mockHttpClient.post.mockResolvedValue({
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        session_id: "session-123",
      });

      const result = await tokenRefreshManager.refreshToken();

      expect(result).toBe(true);
      expect(mockTokenManager.setTokens).toHaveBeenCalledWith({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        expiresIn: 3600,
        sessionId: "session-123",
      });
    });

    it("should fail when no refresh token available", async () => {
      mockTokenManager.getRefreshToken.mockReturnValue(null);

      const result = await tokenRefreshManager.refreshToken();

      expect(result).toBe(false);
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
    });

    it("should fail when HTTP request fails", async () => {
      mockHttpClient.post.mockRejectedValue(new Error("Network error"));

      const result = await tokenRefreshManager.refreshToken();

      expect(result).toBe(false);
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
    });

    it("should not attempt refresh when already in progress", async () => {
      jest.setTimeout(15000); // Increase timeout for this test

      let resolveFirstRefresh: (value: any) => void = () => {};

      // Start first refresh with a promise that we control
      mockHttpClient.post.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFirstRefresh = resolve;
          })
      );

      const firstRefresh = tokenRefreshManager.refreshToken();
      const secondRefresh = tokenRefreshManager.refreshToken();

      // Resolve the first refresh immediately
      setTimeout(() => {
        resolveFirstRefresh({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_in: 3600,
          session_id: "session-123",
        });
      }, 0);

      const [firstResult, secondResult] = await Promise.all([
        firstRefresh,
        secondRefresh,
      ]);

      expect(firstResult).toBe(true);
      expect(secondResult).toBe(false);
    });
  });

  describe("canAttemptRefresh", () => {
    it("should return true when conditions are met", () => {
      expect(tokenRefreshManager.canAttemptRefresh()).toBe(true);
    });

    it("should return false when no refresh token", () => {
      mockTokenManager.hasRefreshToken.mockReturnValue(false);

      expect(tokenRefreshManager.canAttemptRefresh()).toBe(false);
    });

    it("should return false when max retries exceeded", () => {
      // Simulate max failures
      for (let i = 0; i < 3; i++) {
        tokenRefreshManager.recordFailure();
      }

      expect(tokenRefreshManager.canAttemptRefresh()).toBe(false);
    });

    it("should return true after cooldown period", () => {
      // Mock Date.now to return a valid timestamp
      const mockNow = 1640995200000; // Fixed timestamp: 2022-01-01 00:00:00
      const dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(mockNow);

      // Simulate max failures
      for (let i = 0; i < 3; i++) {
        tokenRefreshManager.recordFailure();
      }

      expect(tokenRefreshManager.canAttemptRefresh()).toBe(false);

      // Mock time passage (cooldown period is 30 seconds)
      dateNowSpy.mockReturnValue(mockNow + 31000);

      expect(tokenRefreshManager.canAttemptRefresh()).toBe(true);

      // Restore the spy
      dateNowSpy.mockRestore();
    });
  });

  describe("queueRequest", () => {
    it("should queue request and process after successful refresh", async () => {
      // Mock successful refresh
      mockHttpClient.post.mockResolvedValue({
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        session_id: "session-123",
      });

      // Mock successful retry of original request
      const mockAxiosInstance = jest
        .fn()
        .mockResolvedValue({ data: "success" });
      mockHttpClient.getInstance.mockReturnValue(mockAxiosInstance as any);

      const mockRequest = {
        originalRequest: { url: "/api/test", method: "GET", headers: {} },
        resolve: jest.fn(),
        reject: jest.fn(),
      };

      // Queue the request and wait for it to process
      await tokenRefreshManager.queueRequest(mockRequest);

      // Wait a bit for async processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify the axios instance was called and request was resolved
      expect(mockAxiosInstance).toHaveBeenCalledWith(
        mockRequest.originalRequest
      );
      expect(mockRequest.resolve).toHaveBeenCalledWith({ data: "success" });
      expect(mockRequest.reject).not.toHaveBeenCalled();
    });

    it("should reject queued requests when refresh fails", async () => {
      // Mock failed refresh
      mockHttpClient.post.mockRejectedValue(new Error("Refresh failed"));

      const mockRequest = {
        originalRequest: { url: "/api/test", method: "GET", headers: {} },
        resolve: jest.fn(),
        reject: jest.fn(),
      };

      // Queue the request and wait for it to process
      await tokenRefreshManager.queueRequest(mockRequest);

      // Wait a bit for async processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify the request was rejected with the correct error
      expect(mockRequest.reject).toHaveBeenCalledWith(
        new Error("Token refresh failed")
      );
      expect(mockRequest.resolve).not.toHaveBeenCalled();
    });
  });

  describe("circuit breaker", () => {
    it("should record failures correctly", () => {
      expect(tokenRefreshManager.getRefreshState().failureCount).toBe(0);

      tokenRefreshManager.recordFailure();
      expect(tokenRefreshManager.getRefreshState().failureCount).toBe(1);

      tokenRefreshManager.recordFailure();
      expect(tokenRefreshManager.getRefreshState().failureCount).toBe(2);
    });

    it("should reset failure count", () => {
      tokenRefreshManager.recordFailure();
      tokenRefreshManager.recordFailure();
      expect(tokenRefreshManager.getRefreshState().failureCount).toBe(2);

      tokenRefreshManager.resetFailureCount();
      expect(tokenRefreshManager.getRefreshState().failureCount).toBe(0);
    });

    it("should activate circuit breaker after max failures", () => {
      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(false);

      // Mock Date.now to return a valid timestamp
      const mockNow = 1640995200000; // Fixed timestamp: 2022-01-01 00:00:00
      const dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(mockNow);

      // Record max failures
      for (let i = 0; i < 3; i++) {
        tokenRefreshManager.recordFailure();
      }

      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(true);

      // Restore the spy
      dateNowSpy.mockRestore();
    });

    it("should deactivate circuit breaker after cooldown", () => {
      // Mock Date.now to return a valid timestamp
      const mockNow = 1640995200000; // Fixed timestamp: 2022-01-01 00:00:00
      const dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(mockNow);

      // Record max failures
      for (let i = 0; i < 3; i++) {
        tokenRefreshManager.recordFailure();
      }

      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(true);

      // Mock time passage (31 seconds later)
      dateNowSpy.mockReturnValue(mockNow + 31000);

      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(false);

      // Restore the spy
      dateNowSpy.mockRestore();
    });
  });

  describe("state management", () => {
    it("should track refresh in progress state", async () => {
      jest.setTimeout(15000); // Increase timeout for this test

      expect(tokenRefreshManager.isRefreshInProgress()).toBe(false);

      let resolveRefresh: (value: any) => void = () => {};

      mockHttpClient.post.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveRefresh = resolve;
          })
      );

      const refreshPromise = tokenRefreshManager.refreshToken();
      expect(tokenRefreshManager.isRefreshInProgress()).toBe(true);

      // Resolve the refresh immediately
      setTimeout(() => {
        resolveRefresh({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_in: 3600,
          session_id: "session-123",
        });
      }, 0);

      await refreshPromise;
      expect(tokenRefreshManager.isRefreshInProgress()).toBe(false);
    });

    it("should clear refresh state", () => {
      // Add some state
      tokenRefreshManager.recordFailure();

      const mockRequest = {
        originalRequest: { url: "/api/test" },
        resolve: jest.fn(),
        reject: jest.fn(),
      };

      // Add to queue (synchronously for testing)
      tokenRefreshManager.getRefreshState().pendingRequests.push(mockRequest);

      expect(tokenRefreshManager.getRefreshState().failureCount).toBe(1);
      expect(tokenRefreshManager.getRefreshState().pendingRequests.length).toBe(
        1
      );

      tokenRefreshManager.clearRefreshState();

      expect(tokenRefreshManager.getRefreshState().failureCount).toBe(0);
      expect(tokenRefreshManager.getRefreshState().pendingRequests.length).toBe(
        0
      );
      expect(mockRequest.reject).toHaveBeenCalledWith(
        new Error("Refresh state cleared")
      );
    });
  });
});
