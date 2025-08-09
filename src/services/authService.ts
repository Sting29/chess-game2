import httpClient from "./httpClient";
import tokenManager from "./tokenManager";
import errorHandler from "./errorHandler";
import tokenRefreshManager from "./tokenRefreshManager";
import { LoginRequest, AuthResponse, User } from "./types";
import { AxiosError } from "axios";

class AuthService {
  // Login user with credentials
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        "/user/login",
        credentials
      );

      // Store tokens after successful login
      tokenManager.setTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
        sessionId: response.session_id,
      });

      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "login");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Refresh access token using TokenRefreshManager
  public async refreshToken(): Promise<AuthResponse | null> {
    console.log("AuthService: Delegating token refresh to TokenRefreshManager");

    try {
      const success = await tokenRefreshManager.refreshToken();

      if (success) {
        // Return a mock response since TokenRefreshManager handles the actual refresh
        // In a real implementation, you might want to return the actual response
        const accessToken = tokenManager.getAccessToken();
        const refreshToken = tokenManager.getRefreshToken();
        const sessionId = tokenManager.getSessionId();

        if (accessToken && refreshToken && sessionId) {
          return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 3600, // This would come from the actual response
            token_type: "Bearer",
            session_id: sessionId,
            user: this.getCurrentUser() || ({} as User),
          };
        }
      }

      // Mark session as expired if refresh failed
      tokenManager.markSessionExpired();
      return null;
    } catch (error) {
      console.error("AuthService: Token refresh failed", error);
      tokenManager.markSessionExpired();
      return null;
    }
  }

  // Logout user and revoke session
  public async logout(): Promise<void> {
    console.log("AuthService: Starting logout process");

    try {
      // Call logout endpoint to revoke session on server
      await httpClient.post("/user/logout");
      console.log("AuthService: Server logout successful");
    } catch (error) {
      // Log error but don't throw - we still want to clear local tokens
      const axiosError = error as AxiosError;

      // Handle 401 errors gracefully during logout
      if (axiosError.response?.status === 401) {
        console.log(
          "AuthService: Logout received 401 - session already invalid on server"
        );
      } else {
        errorHandler.logError(axiosError, "logout");
      }
    } finally {
      // Always clear local tokens and refresh state
      tokenManager.clearAllTokensAndState();
      tokenRefreshManager.clearRefreshState();
      console.log("AuthService: Local tokens and state cleared");
    }
  }

  // Check if user is currently authenticated
  public isAuthenticated(): boolean {
    // Check if session is marked as expired
    if (tokenManager.isSessionExpired()) {
      return false;
    }

    return tokenManager.hasValidTokens();
  }

  // Get current user from stored token (basic check)
  public getCurrentUser(): User | null {
    // This is a simple implementation - in a real app you might decode JWT
    // For now, we'll rely on the user data stored during login
    if (!this.isAuthenticated()) {
      return null;
    }

    // User data should be stored separately or decoded from JWT
    // For now, return null - this will be enhanced when we integrate with Redux
    return null;
  }

  // Check if token needs refresh
  public needsTokenRefresh(): boolean {
    // Don't attempt refresh if session is marked as expired
    if (tokenManager.isSessionExpired()) {
      return false;
    }

    return tokenManager.isTokenExpired() && tokenManager.hasRefreshToken();
  }

  // Attempt automatic token refresh if needed using TokenRefreshManager
  public async ensureValidToken(): Promise<boolean> {
    try {
      // Check if session is expired
      if (tokenManager.isSessionExpired()) {
        console.log(
          "AuthService: Session is expired, cannot ensure valid token"
        );
        return false;
      }

      // Check if we have valid tokens
      if (this.isAuthenticated()) {
        return true;
      }

      // Check if we need and can refresh
      if (this.needsTokenRefresh()) {
        console.log("AuthService: Token needs refresh, attempting refresh");
        const refreshResult = await this.refreshToken();
        return refreshResult !== null;
      }

      return false;
    } catch (error) {
      console.error("AuthService: Failed to ensure valid token", error);
      return false;
    }
  }

  // Clear authentication state (for logout or errors)
  public clearAuthState(): void {
    console.log("AuthService: Clearing authentication state");
    tokenManager.clearAllTokensAndState();
    tokenRefreshManager.clearRefreshState();
  }

  // Handle authentication errors (called by HTTP interceptor)
  public handleAuthError(error: AxiosError): void {
    console.log("AuthService: Handling authentication error", {
      status: error.response?.status,
      url: error.config?.url,
    });

    // Mark session as expired for 401 errors
    if (error.response?.status === 401) {
      tokenManager.markSessionExpired();

      // Check if this is a refresh token error
      const isRefreshTokenError = error.config?.url?.includes("/user/refresh");
      if (isRefreshTokenError) {
        console.log(
          "AuthService: Refresh token is invalid, clearing all state"
        );
        this.clearAuthState();
      }
    }
  }

  // Get authentication status for debugging
  public getAuthStatus(): {
    isAuthenticated: boolean;
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isTokenExpired: boolean;
    isSessionExpired: boolean;
    refreshAttemptCount: number;
    timeUntilExpiry: number;
  } {
    return {
      isAuthenticated: this.isAuthenticated(),
      hasAccessToken: !!tokenManager.getAccessToken(),
      hasRefreshToken: !!tokenManager.getRefreshToken(),
      isTokenExpired: tokenManager.isTokenExpired(),
      isSessionExpired: tokenManager.isSessionExpired(),
      refreshAttemptCount: tokenManager.getRefreshAttemptCount(),
      timeUntilExpiry: tokenManager.getTimeUntilExpiry(),
    };
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
