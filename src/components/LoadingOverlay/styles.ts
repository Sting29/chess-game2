/**
 * Стили для LoadingOverlay компонента
 */

import styled from "styled-components";

export const OverlayContainer = styled.div<{ $backdrop: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Backdrop с размытием */
  background-color: ${(props) =>
    props.$backdrop ? "rgba(102, 126, 234, 0.9)" : "transparent"};
  backdrop-filter: ${(props) => (props.$backdrop ? "blur(4px)" : "none")};

  /* Плавное появление */
  animation: overlayFadeIn 0.2s ease-in-out;

  @keyframes overlayFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Поддержка reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    backdrop-filter: none;
  }

  /* Высокий контраст */
  @media (prefers-contrast: high) {
    background-color: ${(props) =>
      props.$backdrop ? "rgba(0, 0, 0, 0.8)" : "transparent"};
  }
`;

export const LoadingMessage = styled.div`
  margin-top: 16px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  /* Высокий контраст */
  @media (prefers-contrast: high) {
    color: white;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  }
`;
