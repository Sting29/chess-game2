import { AxiosRequestConfig } from "axios";
import tokenManager from "./tokenManager";
import authLogger from "./authLogger";
import { AuthResponse } from "../services/auth/types";

// Interfaces for TokenRefreshManager
export interface PendingRequest {
  originalRequest: AxiosRequestConfig;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export interface RefreshState {
  isRefreshing: boolean;
  failureCount: number;
  lastFailureTime: number;
  maxRetries: number;
  cooldownPeriod: number;
  pendingRequests: PendingRequest[];
}

class TokenRefreshManager {
  private refreshState: RefreshState = {
    isRefreshing: false,
    failureCount: 0,
    lastFailureTime: 0,
    maxRetries: 3,
    cooldownPeriod: 30000, // 30 seconds
    pendingRequests: [],
  };

  // Core refresh functionality
  public async refreshToken(): Promise<boolean> {
    // Check if we can attempt refresh
    if (!this.canAttemptRefresh()) {
      console.warn(
        "TokenRefreshManager: Cannot attempt refresh - circuit breaker active"
      );
      return false;
    }

    // Check if refresh is already in progress
    if (this.refreshState.isRefreshing) {
      console.log("TokenRefreshManager: Refresh already in progress");
      return false;
    }

    this.refreshState.isRefreshing = true;
    const startTime = Date.now();
    const attemptNumber = this.refreshState.failureCount + 1;

    console.log("TokenRefreshManager: Starting token refresh attempt", {
      failureCount: this.refreshState.failureCount,
      attempt: attemptNumber,
    });

    // Log refresh attempt
    authLogger.logRefreshAttempt(attemptNumber, startTime);

    try {
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Import httpClient dynamically to avoid circular dependency
      const { default: httpClient } = await import("./httpClient");

      const response = await httpClient.post<AuthResponse>("/user/refresh", {
        refresh_token: refreshToken,
      });

      // Update stored tokens
      tokenManager.setTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
        sessionId: response.session_id,
      });

      // Reset failure count on success
      this.resetFailureCount();

      console.log("TokenRefreshManager: Token refresh successful");

      // Log successful refresh
      authLogger.logRefreshSuccess(
        attemptNumber,
        startTime,
        response.expires_in
      );

      return true;
    } catch (error: any) {
      console.error("TokenRefreshManager: Token refresh failed", {
        error: error.message,
        failureCount: this.refreshState.failureCount + 1,
      });

      // Record failure
      this.recordFailure();

      // Log failed refresh
      authLogger.logRefreshFailure(
        attemptNumber,
        startTime,
        error,
        this.isCircuitBreakerActive()
      );

      // Clear tokens if refresh fails
      tokenManager.clearTokens();

      return false;
    } finally {
      this.refreshState.isRefreshing = false;
    }
  }

  // State management
  public isRefreshInProgress(): boolean {
    return this.refreshState.isRefreshing;
  }

  public canAttemptRefresh(): boolean {
    // Check if we've exceeded max retries
    if (this.refreshState.failureCount >= this.refreshState.maxRetries) {
      // Check if cooldown period has passed
      const timeSinceLastFailure =
        Date.now() - this.refreshState.lastFailureTime;
      if (timeSinceLastFailure < this.refreshState.cooldownPeriod) {
        return false;
      }
      // Reset failure count after cooldown
      this.resetFailureCount();
    }

    // Check if we have a refresh token
    return tokenManager.hasRefreshToken();
  }

  // Request queuing
  public async queueRequest(request: PendingRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      // Add request to pending queue
      this.refreshState.pendingRequests.push({
        originalRequest: request.originalRequest,
        resolve,
        reject,
      });

      console.log("TokenRefreshManager: Request queued", {
        url: request.originalRequest.url,
        queueLength: this.refreshState.pendingRequests.length,
      });

      // Log request queuing
      authLogger.logRequestQueued(
        request.originalRequest.url || "unknown",
        request.originalRequest.method || "unknown",
        this.refreshState.pendingRequests.length
      );

      // If refresh is not in progress, start it
      if (!this.refreshState.isRefreshing) {
        this.processQueuedRequests();
      }
    });
  }

  // Process all queued requests after refresh
  private async processQueuedRequests(): Promise<void> {
    const refreshSuccess = await this.refreshToken();

    const pendingRequests = [...this.refreshState.pendingRequests];
    this.refreshState.pendingRequests = [];

    console.log("TokenRefreshManager: Processing queued requests", {
      refreshSuccess,
      requestCount: pendingRequests.length,
    });

    if (refreshSuccess) {
      // Retry all pending requests with new token
      for (const pendingRequest of pendingRequests) {
        try {
          // Import httpClient dynamically to avoid circular dependency
          const { default: httpClient } = await import("./httpClient");

          // Update authorization header with new token
          const newAuthHeader = tokenManager.getAuthHeader();
          if (newAuthHeader) {
            pendingRequest.originalRequest.headers = {
              ...pendingRequest.originalRequest.headers,
              Authorization: newAuthHeader,
            };
          }

          // Retry the original request
          const response = await httpClient.getInstance()(
            pendingRequest.originalRequest
          );
          pendingRequest.resolve(response);
        } catch (error) {
          pendingRequest.reject(error);
        }
      }
    } else {
      // Reject all pending requests if refresh failed
      for (const pendingRequest of pendingRequests) {
        pendingRequest.reject(new Error("Token refresh failed"));
      }
    }
  }

  // Circuit breaker
  public recordFailure(): void {
    this.refreshState.failureCount++;
    this.refreshState.lastFailureTime = Date.now();

    console.warn("TokenRefreshManager: Failure recorded", {
      failureCount: this.refreshState.failureCount,
      maxRetries: this.refreshState.maxRetries,
      circuitBreakerActive:
        this.refreshState.failureCount >= this.refreshState.maxRetries,
    });

    // Log circuit breaker activation
    if (this.refreshState.failureCount >= this.refreshState.maxRetries) {
      console.error(
        "TokenRefreshManager: Circuit breaker activated - max retries exceeded",
        {
          failureCount: this.refreshState.failureCount,
          maxRetries: this.refreshState.maxRetries,
          cooldownPeriod: this.refreshState.cooldownPeriod,
        }
      );

      // Log circuit breaker activation
      authLogger.logCircuitBreakerActivated(
        this.refreshState.failureCount,
        this.refreshState.maxRetries,
        this.refreshState.cooldownPeriod
      );
    }
  }

  public resetFailureCount(): void {
    const previousFailureCount = this.refreshState.failureCount;
    this.refreshState.failureCount = 0;
    this.refreshState.lastFailureTime = 0;

    if (previousFailureCount > 0) {
      console.log("TokenRefreshManager: Failure count reset", {
        previousFailureCount,
      });

      // Log circuit breaker reset
      authLogger.logCircuitBreakerReset(previousFailureCount);
    }
  }

  // Cleanup
  public clearRefreshState(): void {
    // Reject all pending requests
    for (const pendingRequest of this.refreshState.pendingRequests) {
      pendingRequest.reject(new Error("Refresh state cleared"));
    }

    // Reset state
    this.refreshState = {
      isRefreshing: false,
      failureCount: 0,
      lastFailureTime: 0,
      maxRetries: 3,
      cooldownPeriod: 30000,
      pendingRequests: [],
    };

    console.log("TokenRefreshManager: Refresh state cleared");
  }

  // Get current state for debugging
  public getRefreshState(): Readonly<RefreshState> {
    return { ...this.refreshState };
  }

  // Check if circuit breaker is active
  public isCircuitBreakerActive(): boolean {
    if (this.refreshState.failureCount < this.refreshState.maxRetries) {
      return false;
    }

    const timeSinceLastFailure = Date.now() - this.refreshState.lastFailureTime;
    return timeSinceLastFailure < this.refreshState.cooldownPeriod;
  }
}

// Export singleton instance
const tokenRefreshManager = new TokenRefreshManager();
export default tokenRefreshManager;
