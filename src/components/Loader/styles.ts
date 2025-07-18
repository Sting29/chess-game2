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

export const ChessIcon = styled.div`
  height: 125px;
  width: 125px;
  border: 8px solid #333;
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
`;
