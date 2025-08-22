/**
 * Стили для страницы 404
 */

import { styled, keyframes } from "styled-components";

// Дополнительные анимации для интерактивности
export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

// Дополнительные компоненты для расширенной функциональности
export const FloatingElement = styled.div<{ $delay?: number }>`
  position: absolute;
  animation: ${bounceIn} 1s ease-out ${(props) => props.$delay || 0}s both;

  &:nth-child(odd) {
    animation-duration: 1.2s;
  }
`;

export const InteractiveArea = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    animation: ${shake} 0.5s ease-in-out;
  }
`;

export const HelpText = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  opacity: 0.6;
  text-align: center;
  max-width: 300px;
`;

// Медиа-запросы для адаптивности
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    padding: 1rem;

    h1 {
      font-size: 4rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 3rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
    }
  }
`;

// Дополнительные стили для темной/светлой темы
export const ThemedContainer = styled.div<{ $theme?: "light" | "dark" }>`
  ${(props) =>
    props.$theme === "light"
      ? `
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: #2d3436;
  `
      : `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  `}
`;

export default {
  bounceIn,
  shake,
  FloatingElement,
  InteractiveArea,
  HelpText,
  ResponsiveContainer,
  ThemedContainer,
};
