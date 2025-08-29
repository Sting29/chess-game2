import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface AuthError extends ApiError {
  isTokenExpired: boolean;
  isRefreshTokenInvalid: boolean;
  shouldLogout: boolean;
  retryAfter?: number;
}

export enum AuthErrorType {
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  REFRESH_TOKEN_INVALID = "REFRESH_TOKEN_INVALID",
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

class ErrorHandler {
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    retryCondition: (error: AxiosError) => {
      // Retry on network errors or 5xx server errors
      return !error.response || error.response.status >= 500;
    },
  };

  // Process API errors and convert to standardized format
  public processError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      return {
        message: this.getErrorMessage(status, data),
        status,
        code: this.getErrorCode(status),
        details: data,
      };
    } else if (error.request) {
      // Network error - no response received
      return {
        message: "network.connection_error",
        code: "NETWORK_ERROR",
        details: error.message,
      };
    } else {
      // Request setup error
      return {
        message: "network.request_error",
        code: "REQUEST_ERROR",
        details: error.message,
      };
    }
  }

  // Get user-friendly error message based on status code
  private getErrorMessage(status: number, data: any): string {
    // Try to get message from response data first
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    // Fallback to status-based messages
    switch (status) {
      case 400:
        return "api.validation_error";
      case 401:
        return "auth.invalid_credentials";
      case 403:
        return "auth.access_denied";
      case 404:
        return "api.not_found";
      case 409:
        return "api.conflict_error";
      case 429:
        return "auth.rate_limited";
      case 500:
        return "api.server_error";
      case 503:
        return "api.service_unavailable";
      default:
        return "api.unknown_error";
    }
  }

  // Get error code based on status
  private getErrorCode(status: number): string {
    switch (status) {
      case 400:
        return "VALIDATION_ERROR";
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      case 404:
        return "NOT_FOUND";
      case 409:
        return "CONFLICT";
      case 429:
        return "RATE_LIMITED";
      case 500:
        return "SERVER_ERROR";
      case 503:
        return "SERVICE_UNAVAILABLE";
      default:
        return "UNKNOWN_ERROR";
    }
  }

  // Check if error should trigger token refresh
  public shouldRefreshToken(error: AxiosError): boolean {
    return error.response?.status === 401;
  }

  // Check if error is retryable
  public isRetryableError(error: AxiosError, config?: RetryConfig): boolean {
    const retryConfig = config || this.defaultRetryConfig;
    return retryConfig.retryCondition
      ? retryConfig.retryCondition(error)
      : false;
  }

  // Implement exponential backoff delay
  public getRetryDelay(attempt: number, baseDelay: number = 1000): number {
    return baseDelay * Math.pow(2, attempt - 1);
  }

  // Check if user is offline
  public isOfflineError(error: AxiosError): boolean {
    return (
      !error.response &&
      (error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error") ||
        !navigator.onLine)
    );
  }

  // Get user-friendly error message for display
  public getDisplayMessage(apiError: ApiError): string {
    // Return the message key for i18next translation
    return apiError.message;
  }

  // Process authentication errors with detailed classification
  public processAuthError(error: AxiosError): AuthError {
    const baseError = this.processError(error);

    const authError: AuthError = {
      ...baseError,
      isTokenExpired: false,
      isRefreshTokenInvalid: false,
      shouldLogout: false,
    };

    // Classify authentication errors
    if (error.response?.status === 401) {
      const errorMessage = this.getErrorMessageFromResponse(
        error.response.data
      );

      // Check for specific error patterns
      if (this.isRefreshTokenError(error, errorMessage)) {
        authError.isRefreshTokenInvalid = true;
        authError.shouldLogout = true;
        authError.code = AuthErrorType.REFRESH_TOKEN_INVALID;
        console.warn("ErrorHandler: Refresh token is invalid or expired", {
          url: error.config?.url,
          message: errorMessage,
        });
      } else if (this.isTokenExpiredError(errorMessage)) {
        authError.isTokenExpired = true;
        authError.code = AuthErrorType.TOKEN_EXPIRED;
        console.log("ErrorHandler: Access token is expired", {
          url: error.config?.url,
          message: errorMessage,
        });
      } else {
        authError.code = AuthErrorType.UNAUTHORIZED;
        authError.shouldLogout = true;
        console.warn("ErrorHandler: Unauthorized access", {
          url: error.config?.url,
          message: errorMessage,
        });
      }
    }

    return authError;
  }

  // Check if error indicates refresh token is invalid
  private isRefreshTokenError(
    error: AxiosError,
    errorMessage: string
  ): boolean {
    const isRefreshEndpoint = error.config?.url?.includes("/user/refresh");
    const hasRefreshTokenErrorMessage =
      errorMessage.toLowerCase().includes("refresh token") ||
      errorMessage.toLowerCase().includes("invalid or expired refresh token");

    return isRefreshEndpoint || hasRefreshTokenErrorMessage;
  }

  // Check if error indicates token is expired
  private isTokenExpiredError(errorMessage: string): boolean {
    return (
      errorMessage.toLowerCase().includes("token expired") ||
      errorMessage.toLowerCase().includes("expired token")
    );
  }

  // Get error message from response data
  private getErrorMessageFromResponse(data: any): string {
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    return "";
  }

  // Determine if user should be logged out based on error
  public shouldLogoutUser(error: AxiosError): boolean {
    const authError = this.processAuthError(error);
    return authError.shouldLogout;
  }

  // Get authentication error type
  public getAuthErrorType(error: AxiosError): AuthErrorType {
    if (error.response?.status === 401) {
      const authError = this.processAuthError(error);
      return authError.code as AuthErrorType;
    }

    if (!error.response) {
      return AuthErrorType.NETWORK_ERROR;
    }

    if (error.response.status >= 500) {
      return AuthErrorType.SERVER_ERROR;
    }

    return AuthErrorType.UNAUTHORIZED;
  }

  // Enhanced logging for authentication errors
  public logAuthError(
    error: AxiosError,
    context?: string,
    additionalInfo?: any
  ): void {
    const authError = this.processAuthError(error);

    console.error(`Auth Error${context ? ` (${context})` : ""}:`, {
      message: authError.message,
      status: authError.status,
      code: authError.code,
      url: error.config?.url,
      method: error.config?.method,
      isTokenExpired: authError.isTokenExpired,
      isRefreshTokenInvalid: authError.isRefreshTokenInvalid,
      shouldLogout: authError.shouldLogout,
      details: authError.details,
      ...additionalInfo,
    });
  }

  // Log refresh attempt tracking
  public logRefreshAttempt(
    attemptNumber: number,
    success: boolean,
    error?: any
  ): void {
    const logLevel = success ? "log" : "error";
    const message = success
      ? "Token refresh successful"
      : "Token refresh failed";

    console[logLevel](`ErrorHandler: ${message}`, {
      attemptNumber,
      success,
      timestamp: new Date().toISOString(),
      error: error
        ? {
            message: error.message,
            status: error.response?.status,
            code: error.code,
          }
        : undefined,
    });
  }

  // Log infinite loop detection
  public logInfiniteLoopDetection(context: string, attemptCount: number): void {
    console.error("ErrorHandler: Infinite loop detected and prevented", {
      context,
      attemptCount,
      timestamp: new Date().toISOString(),
      action: "Circuit breaker activated",
    });
  }

  // Log token cleanup
  public logTokenCleanup(reason: string, additionalInfo?: any): void {
    console.log("ErrorHandler: Tokens cleared", {
      reason,
      timestamp: new Date().toISOString(),
      ...additionalInfo,
    });
  }

  // Log error for debugging (enhanced version)
  public logError(error: AxiosError, context?: string): void {
    // Use enhanced auth error logging for 401 errors
    if (error.response?.status === 401) {
      this.logAuthError(error, context);
      return;
    }

    // Use standard logging for other errors
    const apiError = this.processError(error);
    console.error(`API Error${context ? ` (${context})` : ""}:`, {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      url: error.config?.url,
      method: error.config?.method,
      details: apiError.details,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
const errorHandler = new ErrorHandler();
export default errorHandler;
