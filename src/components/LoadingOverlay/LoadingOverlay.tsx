/**
 * LoadingOverlay - компонент для отображения загрузки поверх контента
 */

import React from "react";
import { Loader } from "../Loader/Loader";
import { OverlayContainer, LoadingMessage } from "./styles";

export interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  backdrop?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

/**
 * Компонент overlay для загрузки
 * Показывает Loader поверх текущего контента
 * Мемоизирован для предотвращения лишних ре-рендеров
 */
const LoadingOverlay = React.memo<LoadingOverlayProps>(
  ({ show, message, backdrop = true, className, size = "medium" }) => {
    if (!show) return null;

    return (
      <OverlayContainer
        $backdrop={backdrop}
        className={className}
        role="status"
        aria-live="polite"
        aria-label={message || "Loading"}
      >
        <Loader size={size} ariaLabel={message || "Loading"} />
        {message && <LoadingMessage>{message}</LoadingMessage>}
      </OverlayContainer>
    );
  }
);

LoadingOverlay.displayName = "LoadingOverlay";

export default LoadingOverlay;
