/**
 * FullScreenLoader - компонент для полноэкранной загрузки
 * Используется для Suspense fallback и начальной загрузки приложения
 */

import { Loader } from "../Loader/Loader";
import { FullScreenContainer, LoadingMessage } from "./styles";

export interface FullScreenLoaderProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

/**
 * Компонент полноэкранной загрузки
 * Занимает весь экран и показывает Loader по центру
 */
function FullScreenLoader({ message, size = "medium" }: FullScreenLoaderProps) {
  return (
    <FullScreenContainer
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    >
      <Loader size={size} ariaLabel={message || "Loading"} />
      {message && <LoadingMessage>{message}</LoadingMessage>}
    </FullScreenContainer>
  );
}

export default FullScreenLoader;
