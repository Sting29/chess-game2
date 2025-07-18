import httpClient from "./httpClient";
import tokenManager from "./tokenManager";
import errorHandler from "./errorHandler";
import { LoginRequest, RefreshTokenRequest, AuthResponse, User } from "./types";
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

  // Refresh access token using refresh token
  public async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const refreshRequest: RefreshTokenRequest = {
        refresh_token: refreshToken,
      };

      const response = await httpClient.post<AuthResponse>(
        "/user/refresh",
        refreshRequest
      );

      // Update stored tokens
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

      // Clear tokens if refresh fails
      tokenManager.clearTokens();

      // Log the error
      errorHandler.logError(axiosError, "refresh-token");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Logout user and revoke session
  public async logout(): Promise<void> {
    try {
      // Call logout endpoint to revoke session on server
      await httpClient.post("/user/logout");
    } catch (error) {
      // Log error but don't throw - we still want to clear local tokens
      const axiosError = error as AxiosError;
      errorHandler.logError(axiosError, "logout");
    } finally {
      // Always clear local tokens
      tokenManager.clearTokens();
    }
  }

  // Check if user is currently authenticated
  public isAuthenticated(): boolean {
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
    return tokenManager.isTokenExpired() && tokenManager.hasRefreshToken();
  }

  // Attempt automatic token refresh if needed
  public async ensureValidToken(): Promise<boolean> {
    try {
      if (this.needsTokenRefresh()) {
        await this.refreshToken();
        return true;
      }
      return this.isAuthenticated();
    } catch (error) {
      return false;
    }
  }

  // Clear authentication state (for logout or errors)
  public clearAuthState(): void {
    tokenManager.clearTokens();
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
