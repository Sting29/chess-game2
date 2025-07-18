import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
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

  // Log error for debugging
  public logError(error: AxiosError, context?: string): void {
    const apiError = this.processError(error);
    console.error(`API Error${context ? ` (${context})` : ""}:`, {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      url: error.config?.url,
      method: error.config?.method,
      details: apiError.details,
    });
  }
}

// Export singleton instance
const errorHandler = new ErrorHandler();
export default errorHandler;
