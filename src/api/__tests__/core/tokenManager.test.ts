import tokenManager, { TokenData } from "../tokenManager";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("TokenManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("basic token operations", () => {
    const mockTokenData: TokenData = {
      accessToken: "access-token-123",
      refreshToken: "refresh-token-456",
      expiresIn: 3600,
      sessionId: "session-789",
    };

    it("should store tokens correctly", () => {
      const mockNow = 1640995200000; // Fixed timestamp
      jest.spyOn(Date, "now").mockReturnValue(mockNow);

      tokenManager.setTokens(mockTokenData);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "chess_access_token",
        "access-token-123"
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "chess_refresh_token",
        "refresh-token-456"
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "chess_session_id",
        "session-789"
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "chess_token_expiry",
        (mockNow + 3600 * 1000).toString()
      );
    });

    it("should retrieve tokens correctly", () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case "chess_access_token":
            return "access-token-123";
          case "chess_refresh_token":
            return "refresh-token-456";
          case "chess_session_id":
            return "session-789";
          default:
            return null;
        }
      });

      expect(tokenManager.getAccessToken()).toBe("access-token-123");
      expect(tokenManager.getRefreshToken()).toBe("refresh-token-456");
      expect(tokenManager.getSessionId()).toBe("session-789");
    });

    it("should clear tokens correctly", () => {
      tokenManager.clearTokens();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_access_token"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_refresh_token"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_token_expiry"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_session_id"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_refresh_attempt_count"
      );
    });
  });

  describe("refresh attempt tracking", () => {
    it("should track refresh attempts correctly", () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(tokenManager.getRefreshAttemptCount()).toBe(0);

      mockLocalStorage.getItem.mockReturnValue("2");
      expect(tokenManager.getRefreshAttemptCount()).toBe(2);
    });

    it("should increment refresh attempts", () => {
      mockLocalStorage.getItem.mockReturnValue("1");

      tokenManager.incrementRefreshAttempts();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "chess_refresh_attempt_count",
        "2"
      );
    });

    it("should reset refresh attempts", () => {
      tokenManager.resetRefreshAttempts();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_refresh_attempt_count"
      );
    });

    it("should handle localStorage errors gracefully", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      expect(tokenManager.getRefreshAttemptCount()).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("session state management", () => {
    it("should mark session as expired", () => {
      tokenManager.markSessionExpired();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "chess_session_expired",
        "true"
      );
    });

    it("should check if session is expired", () => {
      mockLocalStorage.getItem.mockReturnValue("true");
      expect(tokenManager.isSessionExpired()).toBe(true);

      mockLocalStorage.getItem.mockReturnValue(null);
      expect(tokenManager.isSessionExpired()).toBe(false);
    });

    it("should clear session expired flag", () => {
      tokenManager.clearSessionExpiredFlag();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_session_expired"
      );
    });
  });

  describe("token validation", () => {
    it("should validate JWT token structure", () => {
      // Valid JWT structure (3 parts separated by dots)
      const validToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
      expect(tokenManager.validateTokenStructure(validToken)).toBe(true);

      // Invalid tokens
      expect(tokenManager.validateTokenStructure("")).toBe(false);
      expect(tokenManager.validateTokenStructure("invalid")).toBe(false);
      expect(tokenManager.validateTokenStructure("part1.part2")).toBe(false);
      expect(tokenManager.validateTokenStructure("part1..part3")).toBe(false);
    });

    it("should validate access token", () => {
      const validToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";

      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === "chess_access_token") return validToken;
        if (key === "chess_token_expiry")
          return (Date.now() + 3600000).toString();
        return null;
      });

      expect(tokenManager.hasValidAccessToken()).toBe(true);
    });

    it("should validate refresh token", () => {
      const validToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";

      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === "chess_refresh_token") return validToken;
        return null;
      });

      expect(tokenManager.hasValidRefreshToken()).toBe(true);
    });
  });

  describe("token expiry management", () => {
    it("should get token expiry timestamp", () => {
      const expiryTime = "1640995200000";
      mockLocalStorage.getItem.mockReturnValue(expiryTime);

      expect(tokenManager.getTokenExpiryTimestamp()).toBe(1640995200000);
    });

    it("should calculate time until expiry", () => {
      const futureTime = Date.now() + 3600000; // 1 hour from now
      mockLocalStorage.getItem.mockReturnValue(futureTime.toString());

      const timeUntilExpiry = tokenManager.getTimeUntilExpiry();
      expect(timeUntilExpiry).toBeGreaterThan(3590000); // Should be close to 1 hour
      expect(timeUntilExpiry).toBeLessThanOrEqual(3600000);
    });

    it("should check if token will expire soon", () => {
      // Token expires in 3 minutes
      const soonExpiry = Date.now() + 3 * 60 * 1000;
      mockLocalStorage.getItem.mockReturnValue(soonExpiry.toString());

      expect(tokenManager.willExpireSoon(5)).toBe(true); // Within 5 minutes
      expect(tokenManager.willExpireSoon(2)).toBe(false); // Not within 2 minutes
    });

    it("should handle expired tokens", () => {
      // Token expired 1 hour ago
      const pastTime = Date.now() - 3600000;
      mockLocalStorage.getItem.mockReturnValue(pastTime.toString());

      expect(tokenManager.getTimeUntilExpiry()).toBe(0);
      expect(tokenManager.willExpireSoon()).toBe(false);
    });
  });

  describe("enhanced clear operations", () => {
    it("should clear all tokens and state", () => {
      tokenManager.clearAllTokensAndState();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_access_token"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_refresh_token"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_token_expiry"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_session_id"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_refresh_attempt_count"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_session_expired"
      );
    });
  });

  describe("integration with setTokens", () => {
    it("should reset state when setting new tokens", () => {
      const mockTokenData: TokenData = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        expiresIn: 3600,
        sessionId: "new-session",
      };

      tokenManager.setTokens(mockTokenData);

      // Should clear session expired flag
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_session_expired"
      );
      // Should reset refresh attempts
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "chess_refresh_attempt_count"
      );
    });
  });

  describe("error handling", () => {
    it("should handle localStorage errors gracefully", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      expect(tokenManager.getAccessToken()).toBe(null);
      expect(tokenManager.getRefreshToken()).toBe(null);
      expect(tokenManager.getSessionId()).toBe(null);
      expect(tokenManager.isTokenExpired()).toBe(true);
      expect(tokenManager.getRefreshAttemptCount()).toBe(0);
      expect(tokenManager.isSessionExpired()).toBe(false);

      expect(console.error).toHaveBeenCalledTimes(6);
    });

    it("should handle setItem errors gracefully", () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      const mockTokenData: TokenData = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
        sessionId: "session",
      };

      tokenManager.setTokens(mockTokenData);
      tokenManager.incrementRefreshAttempts();
      tokenManager.markSessionExpired();

      expect(console.error).toHaveBeenCalledTimes(3);
    });
  });
});
