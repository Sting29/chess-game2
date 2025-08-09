import { useState, useEffect, useCallback } from "react";
import sessionExperienceManager, {
  SessionExpirationNotification,
  SessionState,
} from "../services/sessionExperienceManager";

// Hook for managing session experience in React components
export const useSessionExperience = () => {
  const [sessionState, setSessionState] = useState<SessionState>(() =>
    sessionExperienceManager.getSessionState()
  );
  const [notification, setNotification] =
    useState<SessionExpirationNotification | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update session state
  const updateSessionState = useCallback(() => {
    setSessionState(sessionExperienceManager.getSessionState());
  }, []);

  // Handle session notifications
  const handleNotification = useCallback(
    (notif: SessionExpirationNotification) => {
      setNotification(notif);

      // Update refreshing state
      if (notif.type === "refreshing") {
        setIsRefreshing(true);
      } else {
        setIsRefreshing(false);
      }

      // Auto-clear notification after some time (except for expired)
      if (notif.type !== "expired") {
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
    },
    []
  );

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const success = await sessionExperienceManager.manualRefresh();
      updateSessionState();
      return success;
    } finally {
      setIsRefreshing(false);
    }
  }, [updateSessionState]);

  // Manual logout function
  const logout = useCallback(async () => {
    await sessionExperienceManager.logout();
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Update activity
  const updateActivity = useCallback(() => {
    sessionExperienceManager.updateActivity();
    updateSessionState();
  }, [updateSessionState]);

  // Force expiry check
  const forceExpiryCheck = useCallback(() => {
    sessionExperienceManager.forceExpiryCheck();
    updateSessionState();
  }, [updateSessionState]);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = sessionExperienceManager.subscribe(handleNotification);

    // Update session state periodically
    const stateUpdateInterval = setInterval(updateSessionState, 10000); // Every 10 seconds

    // Cleanup
    return () => {
      unsubscribe();
      clearInterval(stateUpdateInterval);
    };
  }, [handleNotification, updateSessionState]);

  return {
    // State
    sessionState,
    notification,
    isRefreshing,

    // Actions
    manualRefresh,
    logout,
    dismissNotification,
    updateActivity,
    forceExpiryCheck,

    // Computed values
    isAuthenticated: sessionState.isAuthenticated,
    isExpired: sessionState.isExpired,
    timeUntilExpiry: sessionState.timeUntilExpiry,
    willExpireSoon: sessionState.willExpireSoon,
    isUserActive: sessionExperienceManager.isUserActive(),
    timeSinceLastActivity: sessionExperienceManager.getTimeSinceLastActivity(),
  };
};
