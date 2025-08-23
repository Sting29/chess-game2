import styled, { keyframes } from "styled-components";

// CSS variables
const darkColor = "#550000";
const lightColor = "#f1d874";

// Keyframes for loading animation
const loadingAnimation = keyframes`
  20% {
    transform: rotate(90deg);
  }
  40% {
    transform: rotate(180deg);
  }
  60% {
    transform: rotate(270deg);
  }
  80% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const PreloaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface ChessIconProps {
  $size?: "small" | "medium" | "large";
}

const getSizeStyles = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return { height: "75px", width: "75px", border: "4px solid #333" };
    case "large":
      return { height: "175px", width: "175px", border: "12px solid #333" };
    default:
      return { height: "125px", width: "125px", border: "8px solid #333" };
  }
};

export const ChessIcon = styled.div<ChessIconProps>`
  ${({ $size = "medium" }) => {
    const { height, width, border } = getSizeStyles($size);
    return `
      height: ${height};
      width: ${width};
      border: ${border};
    `;
  }}
  border-radius: 20px;
  background-image: conic-gradient(
    ${darkColor} 0,
    ${darkColor} 90deg,
    ${lightColor} 90deg,
    ${lightColor} 180deg,
    ${darkColor} 180deg,
    ${darkColor} 270deg,
    ${lightColor} 270deg,
    ${lightColor} 360deg
  );
  animation: ${loadingAnimation} 5s infinite;

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    background-image: conic-gradient(
      #000000 0,
      #000000 90deg,
      #ffffff 90deg,
      #ffffff 180deg,
      #000000 180deg,
      #000000 270deg,
      #ffffff 270deg,
      #ffffff 360deg
    );
    border-color: #000000;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    /* Show a static pattern for reduced motion */
    background-image: linear-gradient(
      45deg,
      ${darkColor} 25%,
      ${lightColor} 25%,
      ${lightColor} 50%,
      ${darkColor} 50%,
      ${darkColor} 75%,
      ${lightColor} 75%
    );
    background-size: 20px 20px;
  }

  @media (prefers-reduced-motion: reduce) and (prefers-contrast: high) {
    background-image: linear-gradient(
      45deg,
      #000000 25%,
      #ffffff 25%,
      #ffffff 50%,
      #000000 50%,
      #000000 75%,
      #ffffff 75%
    );
  }
`;
