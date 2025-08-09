import { AxiosError } from "axios";
import { AuthErrorType } from "./errorHandler";

// Interfaces for logging
export interface AuthLogEntry {
  timestamp: string;
  type: AuthLogType;
  context: string;
  details: any;
  sessionId?: string;
  userId?: string;
}

export interface RefreshAttemptLog {
  attemptNumber: number;
  timestamp: string;
  success: boolean;
  duration?: number;
  error?: {
    message: string;
    status?: number;
    code?: string;
  };
  circuitBreakerActive?: boolean;
}

export interface TokenLifecycleLog {
  action: "created" | "refreshed" | "expired" | "cleared";
  timestamp: string;
  reason?: string;
  expiresIn?: number;
  timeUntilExpiry?: number;
}

export enum AuthLogType {
  TOKEN_REFRESH_ATTEMPT = "TOKEN_REFRESH_ATTEMPT",
  TOKEN_REFRESH_SUCCESS = "TOKEN_REFRESH_SUCCESS",
  TOKEN_REFRESH_FAILURE = "TOKEN_REFRESH_FAILURE",
  CIRCUIT_BREAKER_ACTIVATED = "CIRCUIT_BREAKER_ACTIVATED",
  CIRCUIT_BREAKER_RESET = "CIRCUIT_BREAKER_RESET",
  INFINITE_LOOP_DETECTED = "INFINITE_LOOP_DETECTED",
  TOKEN_LIFECYCLE = "TOKEN_LIFECYCLE",
  REQUEST_QUEUED = "REQUEST_QUEUED",
  REQUEST_PROCESSED = "REQUEST_PROCESSED",
  AUTH_ERROR = "AUTH_ERROR",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  USER_LOGOUT = "USER_LOGOUT",
}

class AuthLogger {
  private logs: AuthLogEntry[] = [];
  private maxLogEntries = 1000; // Keep last 1000 entries
  private refreshAttempts: RefreshAttemptLog[] = [];
  private tokenLifecycle: TokenLifecycleLog[] = [];

  // Core logging method
  private log(type: AuthLogType, context: string, details: any = {}): void {
    const entry: AuthLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      context,
      details,
      sessionId: this.getCurrentSessionId(),
      userId: this.getCurrentUserId(),
    };

    this.logs.push(entry);

    // Keep only the most recent entries
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries);
    }

    // Console logging for development
    this.consoleLog(entry);
  }

  // Console logging with appropriate levels
  private consoleLog(entry: AuthLogEntry): void {
    const logMessage = `AuthLogger [${entry.type}] ${entry.context}`;
    const logData = {
      timestamp: entry.timestamp,
      sessionId: entry.sessionId,
      userId: entry.userId,
      ...entry.details,
    };

    switch (entry.type) {
      case AuthLogType.TOKEN_REFRESH_FAILURE:
      case AuthLogType.CIRCUIT_BREAKER_ACTIVATED:
      case AuthLogType.INFINITE_LOOP_DETECTED:
      case AuthLogType.AUTH_ERROR:
        console.error(logMessage, logData);
        break;

      case AuthLogType.SESSION_EXPIRED:
      case AuthLogType.USER_LOGOUT:
        console.warn(logMessage, logData);
        break;

      default:
        console.log(logMessage, logData);
        break;
    }
  }

  // Get current session ID (from token manager or other source)
  private getCurrentSessionId(): string | undefined {
    try {
      // Import tokenManager dynamically to avoid circular dependency
      const tokenManager = require("./tokenManager").default;
      return tokenManager.getSessionId() || undefined;
    } catch (error) {
      return undefined;
    }
  }

  // Get current user ID (placeholder - would be implemented based on app structure)
  private getCurrentUserId(): string | undefined {
    // This would be implemented based on how user data is stored
    // For now, return undefined
    return undefined;
  }

  // Token refresh logging
  public logRefreshAttempt(attemptNumber: number, startTime?: number): void {
    this.log(AuthLogType.TOKEN_REFRESH_ATTEMPT, "Token refresh started", {
      attemptNumber,
      startTime: startTime || Date.now(),
    });
  }

  public logRefreshSuccess(
    attemptNumber: number,
    startTime: number,
    expiresIn?: number
  ): void {
    const duration = Date.now() - startTime;

    const refreshLog: RefreshAttemptLog = {
      attemptNumber,
      timestamp: new Date().toISOString(),
      success: true,
      duration,
    };

    this.refreshAttempts.push(refreshLog);

    this.log(AuthLogType.TOKEN_REFRESH_SUCCESS, "Token refresh successful", {
      attemptNumber,
      duration,
      expiresIn,
    });

    // Log token lifecycle
    this.logTokenLifecycle("refreshed", "Token refresh successful", expiresIn);
  }

  public logRefreshFailure(
    attemptNumber: number,
    startTime: number,
    error: any,
    circuitBreakerActive = false
  ): void {
    const duration = Date.now() - startTime;

    const refreshLog: RefreshAttemptLog = {
      attemptNumber,
      timestamp: new Date().toISOString(),
      success: false,
      duration,
      error: {
        message: error.message || "Unknown error",
        status: error.response?.status,
        code: error.code,
      },
      circuitBreakerActive,
    };

    this.refreshAttempts.push(refreshLog);

    this.log(AuthLogType.TOKEN_REFRESH_FAILURE, "Token refresh failed", {
      attemptNumber,
      duration,
      error: refreshLog.error,
      circuitBreakerActive,
    });
  }

  // Circuit breaker logging
  public logCircuitBreakerActivated(
    failureCount: number,
    maxRetries: number,
    cooldownPeriod: number
  ): void {
    this.log(
      AuthLogType.CIRCUIT_BREAKER_ACTIVATED,
      "Circuit breaker activated",
      {
        failureCount,
        maxRetries,
        cooldownPeriod,
        nextAttemptAllowedAt: new Date(
          Date.now() + cooldownPeriod
        ).toISOString(),
      }
    );
  }

  public logCircuitBreakerReset(previousFailureCount: number): void {
    this.log(AuthLogType.CIRCUIT_BREAKER_RESET, "Circuit breaker reset", {
      previousFailureCount,
    });
  }

  // Infinite loop detection
  public logInfiniteLoopDetection(
    context: string,
    attemptCount: number,
    timeWindow: number
  ): void {
    this.log(
      AuthLogType.INFINITE_LOOP_DETECTED,
      "Infinite loop detected and prevented",
      {
        context,
        attemptCount,
        timeWindow,
        action: "Circuit breaker activated",
      }
    );
  }

  // Request queuing logging
  public logRequestQueued(
    url: string,
    method: string,
    queueLength: number
  ): void {
    this.log(AuthLogType.REQUEST_QUEUED, "Request queued for token refresh", {
      url,
      method,
      queueLength,
    });
  }

  public logRequestProcessed(
    url: string,
    method: string,
    success: boolean,
    duration?: number
  ): void {
    this.log(AuthLogType.REQUEST_PROCESSED, "Queued request processed", {
      url,
      method,
      success,
      duration,
    });
  }

  // Token lifecycle logging
  public logTokenLifecycle(
    action: TokenLifecycleLog["action"],
    reason?: string,
    expiresIn?: number,
    timeUntilExpiry?: number
  ): void {
    const lifecycleLog: TokenLifecycleLog = {
      action,
      timestamp: new Date().toISOString(),
      reason,
      expiresIn,
      timeUntilExpiry,
    };

    this.tokenLifecycle.push(lifecycleLog);

    this.log(AuthLogType.TOKEN_LIFECYCLE, `Token ${action}`, {
      action,
      reason,
      expiresIn,
      timeUntilExpiry,
    });
  }

  // Authentication error logging
  public logAuthError(
    error: AxiosError,
    errorType: AuthErrorType,
    shouldLogout: boolean
  ): void {
    this.log(AuthLogType.AUTH_ERROR, "Authentication error occurred", {
      errorType,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      shouldLogout,
      responseData: error.response?.data,
    });
  }

  // Session management logging
  public logSessionExpired(reason: string): void {
    this.log(AuthLogType.SESSION_EXPIRED, "Session expired", {
      reason,
    });

    // Log token lifecycle
    this.logTokenLifecycle("expired", reason);
  }

  public logUserLogout(reason: "manual" | "automatic" | "error"): void {
    this.log(AuthLogType.USER_LOGOUT, "User logged out", {
      reason,
    });

    // Log token lifecycle
    this.logTokenLifecycle("cleared", `User logout: ${reason}`);
  }

  // Analytics and monitoring methods
  public getRefreshAttemptStats(): {
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    averageDuration: number;
    recentFailures: RefreshAttemptLog[];
  } {
    const totalAttempts = this.refreshAttempts.length;
    const successfulAttempts = this.refreshAttempts.filter(
      (a) => a.success
    ).length;
    const failedAttempts = totalAttempts - successfulAttempts;

    const durationsWithValues = this.refreshAttempts
      .filter((a) => a.duration !== undefined)
      .map((a) => a.duration!);

    const averageDuration =
      durationsWithValues.length > 0
        ? durationsWithValues.reduce((sum, duration) => sum + duration, 0) /
          durationsWithValues.length
        : 0;

    const recentFailures = this.refreshAttempts
      .filter((a) => !a.success)
      .slice(-5); // Last 5 failures

    return {
      totalAttempts,
      successfulAttempts,
      failedAttempts,
      averageDuration,
      recentFailures,
    };
  }

  public getRecentLogs(count = 50): AuthLogEntry[] {
    return this.logs.slice(-count);
  }

  public getLogsByType(type: AuthLogType, count = 20): AuthLogEntry[] {
    return this.logs.filter((log) => log.type === type).slice(-count);
  }

  public getTokenLifecycleHistory(): TokenLifecycleLog[] {
    return [...this.tokenLifecycle];
  }

  // Debug methods
  public exportLogs(): {
    logs: AuthLogEntry[];
    refreshAttempts: RefreshAttemptLog[];
    tokenLifecycle: TokenLifecycleLog[];
    stats: {
      totalAttempts: number;
      successfulAttempts: number;
      failedAttempts: number;
      averageDuration: number;
      recentFailures: RefreshAttemptLog[];
    };
  } {
    return {
      logs: [...this.logs],
      refreshAttempts: [...this.refreshAttempts],
      tokenLifecycle: [...this.tokenLifecycle],
      stats: this.getRefreshAttemptStats(),
    };
  }

  public clearLogs(): void {
    this.logs = [];
    this.refreshAttempts = [];
    this.tokenLifecycle = [];
    console.log("AuthLogger: All logs cleared");
  }

  // Health check method
  public getHealthStatus(): {
    isHealthy: boolean;
    recentErrors: number;
    circuitBreakerActive: boolean;
    lastRefreshAttempt?: string;
  } {
    const recentTimeThreshold = Date.now() - 5 * 60 * 1000; // 5 minutes ago
    const recentErrors = this.logs.filter(
      (log) =>
        new Date(log.timestamp).getTime() > recentTimeThreshold &&
        [
          AuthLogType.TOKEN_REFRESH_FAILURE,
          AuthLogType.AUTH_ERROR,
          AuthLogType.INFINITE_LOOP_DETECTED,
        ].includes(log.type)
    ).length;

    const circuitBreakerActive = this.logs.some(
      (log) =>
        log.type === AuthLogType.CIRCUIT_BREAKER_ACTIVATED &&
        new Date(log.timestamp).getTime() > recentTimeThreshold
    );

    const lastRefreshAttempt =
      this.refreshAttempts.length > 0
        ? this.refreshAttempts[this.refreshAttempts.length - 1].timestamp
        : undefined;

    return {
      isHealthy: recentErrors < 5 && !circuitBreakerActive,
      recentErrors,
      circuitBreakerActive,
      lastRefreshAttempt,
    };
  }
}

// Export singleton instance
const authLogger = new AuthLogger();
export default authLogger;
