// Token storage keys
const ACCESS_TOKEN_KEY = "chess_access_token";
const REFRESH_TOKEN_KEY = "chess_refresh_token";
const TOKEN_EXPIRY_KEY = "chess_token_expiry";
const SESSION_ID_KEY = "chess_session_id";

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
}

// Export singleton instance
const tokenManager = new TokenManager();
export default tokenManager;
