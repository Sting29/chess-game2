import React from "react";
import { useTranslation } from "react-i18next";
import { useSessionExperience } from "../../hooks/useSessionExperience";
import {
  NotificationContainer,
  NotificationContent,
  NotificationActions,
  RefreshButton,
  DismissButton,
} from "./styles";

interface SessionNotificationProps {
  className?: string;
}

const SessionNotification: React.FC<SessionNotificationProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const { notification, isRefreshing, manualRefresh, dismissNotification } =
    useSessionExperience();

  // Don't render if no notification
  if (!notification) {
    return null;
  }

  const handleRefresh = async () => {
    await manualRefresh();
    dismissNotification();
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case "expired":
        return "error";
      case "warning":
        return "warning";
      case "refreshing":
        return "info";
      default:
        return "info";
    }
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 1) {
      return t("session.less_than_minute");
    }
    return t("session.minutes_remaining", { count: minutes });
  };

  return (
    <NotificationContainer className={className} color={getNotificationColor()}>
      <NotificationContent>
        <div>
          <strong>
            {notification.type === "expired" && t("session.expired.title")}
            {notification.type === "warning" &&
              t("session.expiring_soon.title")}
            {notification.type === "refreshing" &&
              t("session.refreshing.title")}
          </strong>
        </div>
        <div>
          {t(notification.message)}
          {notification.timeRemaining && (
            <span> {formatTimeRemaining(notification.timeRemaining)}</span>
          )}
        </div>
      </NotificationContent>

      <NotificationActions>
        {notification.canRefresh && notification.action === "refresh" && (
          <RefreshButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label={t("session.refresh_button")}
          >
            {isRefreshing ? t("session.refreshing") : t("session.refresh")}
          </RefreshButton>
        )}

        {notification.type !== "expired" && (
          <DismissButton
            onClick={dismissNotification}
            aria-label={t("session.dismiss_button")}
          >
            {t("session.dismiss")}
          </DismissButton>
        )}
      </NotificationActions>
    </NotificationContainer>
  );
};

export default SessionNotification;
