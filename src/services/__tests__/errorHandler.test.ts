import errorHandler, { AuthErrorType } from "../errorHandler";
import { AxiosError } from "axios";

describe("ErrorHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("processAuthError", () => {
    it("should classify refresh token errors correctly", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Invalid or expired refresh token" },
        } as any,
        config: { url: "/user/refresh" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const authError = errorHandler.processAuthError(mockError);

      expect(authError.isRefreshTokenInvalid).toBe(true);
      expect(authError.shouldLogout).toBe(true);
      expect(authError.code).toBe(AuthErrorType.REFRESH_TOKEN_INVALID);
    });

    it("should classify token expired errors correctly", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Token expired" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const authError = errorHandler.processAuthError(mockError);

      expect(authError.isTokenExpired).toBe(true);
      expect(authError.shouldLogout).toBe(false);
      expect(authError.code).toBe(AuthErrorType.TOKEN_EXPIRED);
    });

    it("should classify general unauthorized errors correctly", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const authError = errorHandler.processAuthError(mockError);

      expect(authError.isTokenExpired).toBe(false);
      expect(authError.isRefreshTokenInvalid).toBe(false);
      expect(authError.shouldLogout).toBe(true);
      expect(authError.code).toBe(AuthErrorType.UNAUTHORIZED);
    });

    it("should handle errors without response data", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: null,
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const authError = errorHandler.processAuthError(mockError);

      expect(authError.code).toBe(AuthErrorType.UNAUTHORIZED);
      expect(authError.shouldLogout).toBe(true);
    });
  });

  describe("shouldLogoutUser", () => {
    it("should return true for refresh token errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Invalid or expired refresh token" },
        } as any,
        config: { url: "/user/refresh" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      expect(errorHandler.shouldLogoutUser(mockError)).toBe(true);
    });

    it("should return false for token expired errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Token expired" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      expect(errorHandler.shouldLogoutUser(mockError)).toBe(false);
    });

    it("should return true for general unauthorized errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      expect(errorHandler.shouldLogoutUser(mockError)).toBe(true);
    });
  });

  describe("getAuthErrorType", () => {
    it("should return REFRESH_TOKEN_INVALID for refresh token errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Invalid or expired refresh token" },
        } as any,
        config: { url: "/user/refresh" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      expect(errorHandler.getAuthErrorType(mockError)).toBe(
        AuthErrorType.REFRESH_TOKEN_INVALID
      );
    });

    it("should return TOKEN_EXPIRED for token expired errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Token expired" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      expect(errorHandler.getAuthErrorType(mockError)).toBe(
        AuthErrorType.TOKEN_EXPIRED
      );
    });

    it("should return NETWORK_ERROR for network errors", () => {
      const mockError: AxiosError = {
        request: {},
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Network Error",
        toJSON: () => ({}),
      };

      expect(errorHandler.getAuthErrorType(mockError)).toBe(
        AuthErrorType.NETWORK_ERROR
      );
    });

    it("should return SERVER_ERROR for 5xx errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 500,
          data: { message: "Internal Server Error" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 500",
        toJSON: () => ({}),
      };

      expect(errorHandler.getAuthErrorType(mockError)).toBe(
        AuthErrorType.SERVER_ERROR
      );
    });
  });

  describe("logging methods", () => {
    it("should log authentication errors with detailed information", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Token expired" },
        } as any,
        config: { url: "/api/test", method: "GET" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      errorHandler.logAuthError(mockError, "test-context", { userId: "123" });

      expect(console.error).toHaveBeenCalledWith(
        "Auth Error (test-context):",
        expect.objectContaining({
          status: 401,
          code: AuthErrorType.TOKEN_EXPIRED,
          url: "/api/test",
          method: "GET",
          isTokenExpired: true,
          isRefreshTokenInvalid: false,
          shouldLogout: false,
          userId: "123",
        })
      );
    });

    it("should log refresh attempts", () => {
      errorHandler.logRefreshAttempt(2, true);

      expect(console.log).toHaveBeenCalledWith(
        "ErrorHandler: Token refresh successful",
        expect.objectContaining({
          attemptNumber: 2,
          success: true,
          timestamp: expect.any(String),
        })
      );
    });

    it("should log failed refresh attempts", () => {
      const mockError = new Error("Refresh failed");
      errorHandler.logRefreshAttempt(3, false, mockError);

      expect(console.error).toHaveBeenCalledWith(
        "ErrorHandler: Token refresh failed",
        expect.objectContaining({
          attemptNumber: 3,
          success: false,
          timestamp: expect.any(String),
          error: {
            message: "Refresh failed",
          },
        })
      );
    });

    it("should log infinite loop detection", () => {
      errorHandler.logInfiniteLoopDetection("token-refresh", 5);

      expect(console.error).toHaveBeenCalledWith(
        "ErrorHandler: Infinite loop detected and prevented",
        expect.objectContaining({
          context: "token-refresh",
          attemptCount: 5,
          timestamp: expect.any(String),
          action: "Circuit breaker activated",
        })
      );
    });

    it("should log token cleanup", () => {
      errorHandler.logTokenCleanup("refresh-failed", { sessionId: "abc123" });

      expect(console.log).toHaveBeenCalledWith(
        "ErrorHandler: Tokens cleared",
        expect.objectContaining({
          reason: "refresh-failed",
          timestamp: expect.any(String),
          sessionId: "abc123",
        })
      );
    });

    it("should use enhanced logging for 401 errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      errorHandler.logError(mockError, "test-context");

      expect(console.error).toHaveBeenCalledWith(
        "Auth Error (test-context):",
        expect.objectContaining({
          status: 401,
          isTokenExpired: false,
          isRefreshTokenInvalid: false,
          shouldLogout: true,
        })
      );
    });

    it("should use standard logging for non-401 errors", () => {
      const mockError: AxiosError = {
        response: {
          status: 500,
          data: { message: "Server Error" },
        } as any,
        config: { url: "/api/test", method: "GET" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 500",
        toJSON: () => ({}),
      };

      errorHandler.logError(mockError, "test-context");

      expect(console.error).toHaveBeenCalledWith(
        "API Error (test-context):",
        expect.objectContaining({
          status: 500,
          url: "/api/test",
          method: "GET",
          timestamp: expect.any(String),
        })
      );
    });
  });

  describe("error classification helpers", () => {
    it("should identify refresh token errors by URL", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        } as any,
        config: { url: "/user/refresh" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const authError = errorHandler.processAuthError(mockError);
      expect(authError.isRefreshTokenInvalid).toBe(true);
    });

    it("should identify refresh token errors by message content", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "refresh token is invalid" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const authError = errorHandler.processAuthError(mockError);
      expect(authError.isRefreshTokenInvalid).toBe(true);
    });

    it("should identify token expired errors by message content", () => {
      const mockError: AxiosError = {
        response: {
          status: 401,
          data: { message: "expired token detected" },
        } as any,
        config: { url: "/api/test" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const authError = errorHandler.processAuthError(mockError);
      expect(authError.isTokenExpired).toBe(true);
    });
  });
});
