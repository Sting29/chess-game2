/**
 * Компонент для плавных переходов между страницами
 */

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { styled, keyframes } from "styled-components";

interface PageTransitionProps {
  children: React.ReactNode;
  duration?: number;
  type?: "fade" | "slide" | "scale";
}

// Анимации
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

// Стилизованные компоненты
const TransitionWrapper = styled.div<{
  $animationType: "fade" | "slide" | "scale";
  $duration: number;
}>`
  animation: ${(props) => {
      switch (props.$animationType) {
        case "slide":
          return slideIn;
        case "scale":
          return scaleIn;
        default:
          return fadeIn;
      }
    }}
    ${(props) => props.$duration}ms ease-out;

  animation-fill-mode: both;
  width: 100%;
  min-height: 100%;
`;

/**
 * Компонент для создания плавных переходов между страницами
 */
export function PageTransition({
  children,
  duration = 300,
  type = "fade",
}: PageTransitionProps): React.ReactElement {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("entering");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("exiting");

      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("entering");
      }, duration / 2);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation, duration]);

  return (
    <TransitionWrapper
      key={displayLocation.pathname}
      $animationType={type}
      $duration={duration}
      style={{
        opacity: transitionStage === "exiting" ? 0 : 1,
        transition:
          transitionStage === "exiting"
            ? `opacity ${duration / 2}ms ease-out`
            : "none",
      }}
    >
      {children}
    </TransitionWrapper>
  );
}
