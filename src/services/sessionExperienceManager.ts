import tokenManager from "./tokenManager";
import authService from "./authService";
import authLogger from "./authLogger";

// Types for session experience
export interface SessionExpirationNotification {
  type: "warning" | "expired" | "refreshing";
  message: string;
  timeRemaining?: number;
  canRefresh?: boolean;
  action?: "refresh" | "logout" | "login";
}

export interface SessionState {
  isAuthenticated: boolean;
  isExpired: boolean;
  isRefreshing: boolean;
  timeUntilExpiry: number;
  willExpireSoon: boolean;
  lastActivity: number;
}

class SessionExperienceManager {
  private listeners: Array<
    (notification: SessionExpirationNotification) => void
  > = [];
  private warningTimer: NodeJS.Timeout | null = null;
  private expiryCheckInterval: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private isRefreshing: boolean = false;

  // Configuration
  private readonly WARNING_THRESHOLD_MINUTES = 5; // Warn 5 minutes before expiry
  private readonly CHECK_INTERVAL_MS = 30000; // Check every 30 seconds
  private readonly ACTIVITY_TIMEOUT_MINUTES = 30; // Consider user inactive after 30 minutes

  constructor() {
    this.startExpiryMonitoring();
    this.setupActivityTracking();
  }

  // Start monitoring token expiry
  private startExpiryMonitoring(): void {
    if (this.expiryCheckInterval) {
      clearInterval(this.expiryCheckInterval);
    }

    this.expiryCheckInterval = setInterval(() => {
      this.checkTokenExpiry();
    }, this.CHECK_INTERVAL_MS);

    console.log("SessionExperienceManager: Started expiry monitoring");
  }

  // Setup user activity tracking
  private setupActivityTracking(): void {
    // Track user activity events
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const updateActivity = () => {
      this.lastActivity = Date.now();
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    console.log("SessionExperienceManager: Activity tracking setup complete");
  }

  // Check token expiry and send appropriate notifications
  private checkTokenExpiry(): void {
    if (!authService.isAuthenticated()) {
      return;
    }

    const timeUntilExpiry = tokenManager.getTimeUntilExpiry();
    const willExpireSoon = tokenManager.willExpireSoon(
      this.WARNING_THRESHOLD_MINUTES
    );

    // Check if user has been inactive
    const timeSinceActivity = Date.now() - this.lastActivity;
    const isUserActive =
      timeSinceActivity < this.ACTIVITY_TIMEOUT_MINUTES * 60 * 1000;

    if (timeUntilExpiry <= 0) {
      // Token has expired
      this.handleTokenExpired();
    } else if (willExpireSoon && isUserActive && !this.isRefreshing) {
      // Token will expire soon and user is active
      this.handleTokenExpiringSoon(timeUntilExpiry);
    }
  }

  // Handle token expiration
  private handleTokenExpired(): void {
    console.log("SessionExperienceManager: Token has expired");

    authLogger.logSessionExpired("Token expired during monitoring");

    const notification: SessionExpirationNotification = {
      type: "expired",
      message: "session.expired.message",
      canRefresh: tokenManager.hasRefreshToken(),
      action: tokenManager.hasRefreshToken() ? "refresh" : "login",
    };

    this.notifyListeners(notification);

    // Attempt automatic refresh if possible
    if (tokenManager.hasRefreshToken() && !this.isRefreshing) {
      this.attemptAutomaticRefresh();
    } else {
      // Redirect to login after a delay
      setTimeout(() => {
        this.redirectToLogin("session_expired");
      }, 3000);
    }
  }

  // Handle token expiring soon
  private handleTokenExpiringSoon(timeUntilExpiry: number): void {
    const minutesRemaining = Math.ceil(timeUntilExpiry / (60 * 1000));

    console.log("SessionExperienceManager: Token expiring soon", {
      minutesRemaining,
      timeUntilExpiry,
    });

    const notification: SessionExpirationNotification = {
      type: "warning",
      message: "session.expiring_soon.message",
      timeRemaining: minutesRemaining,
      canRefresh: true,
      action: "refresh",
    };

    this.notifyListeners(notification);

    // Set timer to check again closer to expiry
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    this.warningTimer = setTimeout(() => {
      this.checkTokenExpiry();
    }, Math.min(timeUntilExpiry - 60000, 60000)); // Check again 1 minute before expiry or in 1 minute
  }

  // Attempt automatic token refresh
  private async attemptAutomaticRefresh(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    console.log("SessionExperienceManager: Attempting automatic token refresh");

    // Notify that refresh is in progress
    const refreshingNotification: SessionExpirationNotification = {
      type: "refreshing",
      message: "session.refreshing.message",
    };

    this.notifyListeners(refreshingNotification);

    try {
      const refreshResult = await authService.refreshToken();

      if (refreshResult) {
        console.log("SessionExperienceManager: Automatic refresh successful");

        // Notify success (optional - could be silent)
        const successNotification: SessionExpirationNotification = {
          type: "warning", // Use warning type for success message
          message: "session.refreshed.message",
        };

        this.notifyListeners(successNotification);

        // Clear any warning timers
        if (this.warningTimer) {
          clearTimeout(this.warningTimer);
          this.warningTimer = null;
        }
      } else {
        console.error("SessionExperienceManager: Automatic refresh failed");
        this.handleRefreshFailure();
      }
    } catch (error) {
      console.error("SessionExperienceManager: Automatic refresh error", error);
      this.handleRefreshFailure();
    } finally {
      this.isRefreshing = false;
    }
  }

  // Handle refresh failure
  private handleRefreshFailure(): void {
    const notification: SessionExpirationNotification = {
      type: "expired",
      message: "session.refresh_failed.message",
      canRefresh: false,
      action: "login",
    };

    this.notifyListeners(notification);

    // Redirect to login
    setTimeout(() => {
      this.redirectToLogin("refresh_failed");
    }, 2000);
  }

  // Redirect to login page
  private redirectToLogin(reason: string): void {
    console.log("SessionExperienceManager: Redirecting to login", { reason });

    // Clear all authentication state
    authService.clearAuthState();

    // Log the logout
    authLogger.logUserLogout("automatic");

    // In a real React app, you would use React Router or similar
    // For now, we'll use window.location
    const currentPath = window.location.pathname;
    const loginUrl = `/login?redirect=${encodeURIComponent(
      currentPath
    )}&reason=${reason}`;

    window.location.href = loginUrl;
  }

  // Public methods for manual refresh
  public async manualRefresh(): Promise<boolean> {
    console.log("SessionExperienceManager: Manual refresh requested");

    try {
      const result = await authService.refreshToken();

      if (result) {
        const notification: SessionExpirationNotification = {
          type: "warning",
          message: "session.manually_refreshed.message",
        };
        this.notifyListeners(notification);
        return true;
      } else {
        this.handleRefreshFailure();
        return false;
      }
    } catch (error) {
      console.error("SessionExperienceManager: Manual refresh failed", error);
      this.handleRefreshFailure();
      return false;
    }
  }

  // Get current session state
  public getSessionState(): SessionState {
    return {
      isAuthenticated: authService.isAuthenticated(),
      isExpired: tokenManager.isSessionExpired(),
      isRefreshing: this.isRefreshing,
      timeUntilExpiry: tokenManager.getTimeUntilExpiry(),
      willExpireSoon: tokenManager.willExpireSoon(
        this.WARNING_THRESHOLD_MINUTES
      ),
      lastActivity: this.lastActivity,
    };
  }

  // Subscribe to session notifications
  public subscribe(
    listener: (notification: SessionExpirationNotification) => void
  ): () => void {
    this.listeners.push(listener);

    console.log("SessionExperienceManager: New listener subscribed", {
      totalListeners: this.listeners.length,
    });

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
        console.log("SessionExperienceManager: Listener unsubscribed", {
          totalListeners: this.listeners.length,
        });
      }
    };
  }

  // Notify all listeners
  private notifyListeners(notification: SessionExpirationNotification): void {
    console.log("SessionExperienceManager: Notifying listeners", {
      type: notification.type,
      message: notification.message,
      listenerCount: this.listeners.length,
    });

    this.listeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (error) {
        console.error(
          "SessionExperienceManager: Error in notification listener",
          error
        );
      }
    });
  }

  // Manual logout
  public async logout(): Promise<void> {
    console.log("SessionExperienceManager: Manual logout requested");

    // Clear timers
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }

    try {
      await authService.logout();
      this.redirectToLogin("manual_logout");
    } catch (error) {
      console.error("SessionExperienceManager: Logout error", error);
      // Still redirect even if server logout fails
      this.redirectToLogin("manual_logout");
    }
  }

  // Update activity timestamp (can be called manually)
  public updateActivity(): void {
    this.lastActivity = Date.now();
  }

  // Check if user is considered active
  public isUserActive(): boolean {
    const timeSinceActivity = Date.now() - this.lastActivity;
    return timeSinceActivity < this.ACTIVITY_TIMEOUT_MINUTES * 60 * 1000;
  }

  // Get time since last activity
  public getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivity;
  }

  // Cleanup method
  public cleanup(): void {
    if (this.expiryCheckInterval) {
      clearInterval(this.expiryCheckInterval);
      this.expiryCheckInterval = null;
    }

    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }

    this.listeners = [];

    console.log("SessionExperienceManager: Cleanup completed");
  }

  // Force check (for testing or manual triggers)
  public forceExpiryCheck(): void {
    this.checkTokenExpiry();
  }

  // Get configuration
  public getConfiguration(): {
    warningThresholdMinutes: number;
    checkIntervalMs: number;
    activityTimeoutMinutes: number;
  } {
    return {
      warningThresholdMinutes: this.WARNING_THRESHOLD_MINUTES,
      checkIntervalMs: this.CHECK_INTERVAL_MS,
      activityTimeoutMinutes: this.ACTIVITY_TIMEOUT_MINUTES,
    };
  }
}

// Export singleton instance
const sessionExperienceManager = new SessionExperienceManager();
export default sessionExperienceManager;
