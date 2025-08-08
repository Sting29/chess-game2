// Token storage keys
const ACCESS_TOKEN_KEY = "chess_access_token";
const REFRESH_TOKEN_KEY = "chess_refresh_token";
const TOKEN_EXPIRY_KEY = "chess_token_expiry";
const SESSION_ID_KEY = "chess_session_id";
const REFRESH_ATTEMPT_COUNT_KEY = "chess_refresh_attempt_count";
const SESSION_EXPIRED_KEY = "chess_session_expired";

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string;
}

class TokenManager {
  // Store tokens securely
  public setTokens(tokenData: TokenData): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);
      localStorage.setItem(SESSION_ID_KEY, tokenData.sessionId);

      // Calculate expiry timestamp
      const expiryTime = Date.now() + tokenData.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

      // Clear session expired flag when setting new tokens
      this.clearSessionExpiredFlag();

      // Reset refresh attempts on successful token storage
      this.resetRefreshAttempts();
    } catch (error) {
      console.error("Failed to store tokens:", error);
    }
  }

  // Get access token
  public getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  }

  // Get refresh token
  public getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get refresh token:", error);
      return null;
    }
  }

  // Get session ID
  public getSessionId(): string | null {
    try {
      return localStorage.getItem(SESSION_ID_KEY);
    } catch (error) {
      console.error("Failed to get session ID:", error);
      return null;
    }
  }

  // Check if access token is expired
  public isTokenExpired(): boolean {
    try {
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiryTime) {
        return true;
      }

      const expiry = parseInt(expiryTime, 10);
      const now = Date.now();

      // Add 5 minute buffer before expiry
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      return now >= expiry - bufferTime;
    } catch (error) {
      console.error("Failed to check token expiry:", error);
      return true;
    }
  }

  // Check if user has valid tokens
  public hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    return !!(accessToken && refreshToken && !this.isTokenExpired());
  }

  // Check if refresh token exists (for token refresh)
  public hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  // Clear all tokens (logout)
  public clearTokens(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(SESSION_ID_KEY);
      // Also clear refresh attempt tracking when clearing tokens
      localStorage.removeItem(REFRESH_ATTEMPT_COUNT_KEY);
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  }

  // Get authorization header
  public getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  // Update only access token (for refresh)
  public updateAccessToken(accessToken: string, expiresIn: number): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

      // Update expiry time
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error("Failed to update access token:", error);
    }
  }

  // Refresh attempt tracking
  public getRefreshAttemptCount(): number {
    try {
      const count = localStorage.getItem(REFRESH_ATTEMPT_COUNT_KEY);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.error("Failed to get refresh attempt count:", error);
      return 0;
    }
  }

  public incrementRefreshAttempts(): void {
    try {
      const currentCount = this.getRefreshAttemptCount();
      localStorage.setItem(
        REFRESH_ATTEMPT_COUNT_KEY,
        (currentCount + 1).toString()
      );
      console.log("TokenManager: Refresh attempt incremented", {
        count: currentCount + 1,
      });
    } catch (error) {
      console.error("Failed to increment refresh attempts:", error);
    }
  }

  public resetRefreshAttempts(): void {
    try {
      localStorage.removeItem(REFRESH_ATTEMPT_COUNT_KEY);
      console.log("TokenManager: Refresh attempts reset");
    } catch (error) {
      console.error("Failed to reset refresh attempts:", error);
    }
  }

  // Session state management
  public markSessionExpired(): void {
    try {
      localStorage.setItem(SESSION_EXPIRED_KEY, "true");
      console.log("TokenManager: Session marked as expired");
    } catch (error) {
      console.error("Failed to mark session as expired:", error);
    }
  }

  public isSessionExpired(): boolean {
    try {
      const expired = localStorage.getItem(SESSION_EXPIRED_KEY);
      return expired === "true";
    } catch (error) {
      console.error("Failed to check session expiration:", error);
      return false;
    }
  }

  public clearSessionExpiredFlag(): void {
    try {
      localStorage.removeItem(SESSION_EXPIRED_KEY);
    } catch (error) {
      console.error("Failed to clear session expired flag:", error);
    }
  }

  // Token validation
  public validateTokenStructure(token: string): boolean {
    if (!token || typeof token !== "string") {
      return false;
    }

    // Basic JWT structure validation (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Check if each part is base64 encoded
    try {
      for (const part of parts) {
        if (!part || part.length === 0) {
          return false;
        }
        // Try to decode base64 (will throw if invalid)
        atob(part.replace(/-/g, "+").replace(/_/g, "/"));
      }
      return true;
    } catch (error) {
      console.warn("TokenManager: Invalid token structure", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  // Enhanced token validation
  public hasValidAccessToken(): boolean {
    const accessToken = this.getAccessToken();
    return !!(
      accessToken &&
      this.validateTokenStructure(accessToken) &&
      !this.isTokenExpired()
    );
  }

  public hasValidRefreshToken(): boolean {
    const refreshToken = this.getRefreshToken();
    return !!(refreshToken && this.validateTokenStructure(refreshToken));
  }

  // Enhanced clear tokens with state cleanup
  public clearAllTokensAndState(): void {
    try {
      // Clear all token-related data
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem(REFRESH_ATTEMPT_COUNT_KEY);
      localStorage.removeItem(SESSION_EXPIRED_KEY);

      console.log("TokenManager: All tokens and state cleared");
    } catch (error) {
      console.error("Failed to clear all tokens and state:", error);
    }
  }

  // Get token expiry timestamp for debugging
  public getTokenExpiryTimestamp(): number | null {
    try {
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
      return expiryTime ? parseInt(expiryTime, 10) : null;
    } catch (error) {
      console.error("Failed to get token expiry timestamp:", error);
      return null;
    }
  }

  // Get time until token expires (in milliseconds)
  public getTimeUntilExpiry(): number {
    const expiryTimestamp = this.getTokenExpiryTimestamp();
    if (!expiryTimestamp) {
      return 0;
    }
    return Math.max(0, expiryTimestamp - Date.now());
  }

  // Check if token will expire soon (within specified minutes)
  public willExpireSoon(minutesThreshold: number = 5): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    const thresholdMs = minutesThreshold * 60 * 1000;
    return timeUntilExpiry > 0 && timeUntilExpiry <= thresholdMs;
  }
}

// Export singleton instance
const tokenManager = new TokenManager();
export default tokenManager;
