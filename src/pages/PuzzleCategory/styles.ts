import styled from "styled-components";

// Main container for the puzzle map
export const PuzzleMapContainer = styled.div<{ $backgroundImage?: string }>`
  position: relative;
  width: 100%;
  height: calc(100vh - 96px);
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
    height: calc(100vh - 80px);
  }

  @media (max-width: 480px) {
    padding: 0 10px;
    height: calc(100vh - 70px);
  }

  @media (orientation: landscape) and (max-height: 600px) {
    height: calc(100vh - 60px);
    padding: 0 20px;
  }
`;

// Track container with configurable size and positioning
export const TrackContainer = styled.div<{
  $trackImage?: string;
  $trackSize?: { width: number; height: number };
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => props.$trackSize?.width || 1200}px;
  height: ${(props) => props.$trackSize?.height || 800}px;
  background-image: url(${(props) => props.$trackImage});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 2;

  @media (max-width: 1024px) {
    width: ${(props) => (props.$trackSize?.width || 1200) * 0.5}px;
    height: ${(props) => (props.$trackSize?.height || 800) * 0.5}px;
  }

  @media (max-width: 768px) and (orientation: portrait) {
    transform: translate(-50%, -50%) rotate(90deg);
    width: ${(props) => (props.$trackSize?.width || 1200) * 0.33}px;
    height: ${(props) => (props.$trackSize?.height || 800) * 0.33}px;
  }

  @media (max-width: 480px) and (orientation: portrait) {
    transform: translate(-50%, -50%) rotate(90deg);
    width: ${(props) => (props.$trackSize?.width || 1200) * 0.29}px;
    height: ${(props) => (props.$trackSize?.height || 800) * 0.29}px;
  }

  @media (orientation: landscape) and (max-height: 600px) {
    width: ${(props) => (props.$trackSize?.width || 1200) * 0.375}px;
    height: ${(props) => (props.$trackSize?.height || 800) * 0.375}px;
  }
`;

// Stone position interface
export interface StonePosition {
  x: number; // percentage from left
  y: number; // percentage from top
}

// Wrapper for individual stones with positioning relative to track
export const StoneWrapper = styled.div<{ $position: StonePosition }>`
  position: absolute;
  left: ${(props) => props.$position.x}%;
  top: ${(props) => props.$position.y}%;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease;
  z-index: 3;

  // Tablet adjustments
  @media (max-width: 1024px) {
    transform: translate(-50%, -50%) scale(0.9);
  }

  // Mobile adjustments - account for track rotation
  @media (max-width: 768px) and (orientation: portrait) {
    transform: translate(-50%, -50%) scale(0.8);
  }

  @media (max-width: 480px) and (orientation: portrait) {
    transform: translate(-50%, -50%) scale(0.7);
  }

  // Landscape orientation on mobile
  @media (orientation: landscape) and (max-height: 600px) {
    transform: translate(-50%, -50%) scale(0.7);
  }
`;

// Container for navigation buttons
export const NavigationContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 3;

  @media (max-width: 768px) {
    bottom: 20px;
    gap: 15px;
  }
`;

// Decorative elements container
export const DecorativeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* No fixed z-index - let individual elements control their own layering */
`;

// Individual decorative element wrapper
export const DecorativeWrapper = styled.div<{ position: StonePosition }>`
  position: absolute;
  left: ${(props) => props.position.x}%;
  top: ${(props) => props.position.y}%;
  transform: translate(-50%, -50%);

  img {
    max-width: 100%;
    height: auto;
  }

  // Responsive scaling for decorative elements
  @media (max-width: 768px) {
    transform: translate(-50%, -50%) scale(0.8);
  }

  @media (max-width: 480px) {
    transform: translate(-50%, -50%) scale(0.6);
  }
`;
