import tokenRefreshManager from "../tokenRefreshManager";
import tokenManager from "../tokenManager";

// Mock dependencies
jest.mock("../tokenManager");
jest.mock("../httpClient", () => ({
  default: {
    post: jest.fn(),
    getInstance: jest.fn(() => jest.fn()),
  },
}));

const mockTokenManager = tokenManager as jest.Mocked<typeof tokenManager>;

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
  });

  describe("refreshToken", () => {
    it("should successfully refresh token", async () => {
      // Mock successful HTTP response
      const mockHttpClient = await import("../httpClient");
      (mockHttpClient.default.post as jest.Mock).mockResolvedValue({
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
      const mockHttpClient = await import("../httpClient");
      (mockHttpClient.default.post as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const result = await tokenRefreshManager.refreshToken();

      expect(result).toBe(false);
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
    });

    it("should not attempt refresh when already in progress", async () => {
      // Start first refresh
      const mockHttpClient = await import("../httpClient");
      (mockHttpClient.default.post as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const firstRefresh = tokenRefreshManager.refreshToken();
      const secondRefresh = tokenRefreshManager.refreshToken();

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

    it("should return true after cooldown period", async () => {
      // Simulate max failures
      for (let i = 0; i < 3; i++) {
        tokenRefreshManager.recordFailure();
      }

      expect(tokenRefreshManager.canAttemptRefresh()).toBe(false);

      // Mock time passage (cooldown period is 30 seconds)
      jest.spyOn(Date, "now").mockReturnValue(Date.now() + 31000);

      expect(tokenRefreshManager.canAttemptRefresh()).toBe(true);
    });
  });

  describe("queueRequest", () => {
    it("should queue request and process after successful refresh", async () => {
      const mockHttpClient = await import("../httpClient");

      // Mock successful refresh
      (mockHttpClient.default.post as jest.Mock).mockResolvedValue({
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        session_id: "session-123",
      });

      // Mock successful retry of original request
      const mockAxiosInstance = jest
        .fn()
        .mockResolvedValue({ data: "success" });
      (mockHttpClient.default.getInstance as jest.Mock).mockReturnValue(
        mockAxiosInstance
      );

      const mockRequest = {
        originalRequest: { url: "/api/test", method: "GET", headers: {} },
        resolve: jest.fn(),
        reject: jest.fn(),
      };

      await tokenRefreshManager.queueRequest(mockRequest);

      expect(mockRequest.resolve).toHaveBeenCalledWith({ data: "success" });
      expect(mockRequest.reject).not.toHaveBeenCalled();
    });

    it("should reject queued requests when refresh fails", async () => {
      const mockHttpClient = await import("../httpClient");

      // Mock failed refresh
      (mockHttpClient.default.post as jest.Mock).mockRejectedValue(
        new Error("Refresh failed")
      );

      const mockRequest = {
        originalRequest: { url: "/api/test", method: "GET", headers: {} },
        resolve: jest.fn(),
        reject: jest.fn(),
      };

      await tokenRefreshManager.queueRequest(mockRequest);

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

      // Record max failures
      for (let i = 0; i < 3; i++) {
        tokenRefreshManager.recordFailure();
      }

      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(true);
    });

    it("should deactivate circuit breaker after cooldown", () => {
      // Record max failures
      for (let i = 0; i < 3; i++) {
        tokenRefreshManager.recordFailure();
      }

      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(true);

      // Mock time passage
      jest.spyOn(Date, "now").mockReturnValue(Date.now() + 31000);

      expect(tokenRefreshManager.isCircuitBreakerActive()).toBe(false);
    });
  });

  describe("state management", () => {
    it("should track refresh in progress state", async () => {
      expect(tokenRefreshManager.isRefreshInProgress()).toBe(false);

      const mockHttpClient = await import("../httpClient");
      (mockHttpClient.default.post as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const refreshPromise = tokenRefreshManager.refreshToken();
      expect(tokenRefreshManager.isRefreshInProgress()).toBe(true);

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
