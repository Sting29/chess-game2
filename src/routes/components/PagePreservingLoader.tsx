/**
 * Лоадер, который показывается поверх предыдущей страницы
 * Предотвращает белое мигание при переходах
 */

import React from "react";
import { styled } from "styled-components";
import { Loader } from "src/components/Loader/Loader";

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

interface PagePreservingLoaderProps {
  isVisible: boolean;
  message?: string;
}

/**
 * Компонент лоадера, который показывается поверх текущего контента
 * Предотвращает белое мигание при переходах между страницами
 */
export function PagePreservingLoader({
  isVisible,
  message,
}: PagePreservingLoaderProps): React.ReactElement | null {
  if (!isVisible) {
    return null;
  }

  return (
    <LoaderOverlay>
      <Loader />
    </LoaderOverlay>
  );
}
