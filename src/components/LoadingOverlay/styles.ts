import styled from "styled-components";

export const OverlayContainer = styled.div`
  position: relative;
`;

export const OverlayBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: none;
    border: 2px solid #000000;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    backdrop-filter: none;
  }

  /* Focus styles for keyboard navigation */
  &:focus {
    outline: 2px solid #0066cc;
    outline-offset: -2px;
  }

  @media (prefers-contrast: high) {
    &:focus {
      outline: 3px solid #000000;
    }
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const Message = styled.div`
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    color: #000000;
    background-color: #ffffff;
    padding: 8px 16px;
    border-radius: 4px;
    text-shadow: none;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ScreenReaderOnly = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
