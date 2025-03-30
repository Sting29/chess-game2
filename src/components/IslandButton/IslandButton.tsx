import { useState } from "react";
import styled from "styled-components";
import { useParallax } from "src/hooks/useParallax";
import { useIsMobile } from "src/hooks/useIsMobile";

interface IslandButtonProps {
  imageSrc: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  mobilePosition?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  parallaxFactor?: number;
  width?: string;
  mobileWidth?: string;
  onClick?: () => void;
}

const StyledIslandButton = styled.button
  .withConfig({
    shouldForwardProp: (prop) => !prop.startsWith("$"),
  })
  .attrs<{
    $top?: string;
    $bottom?: string;
    $left?: string;
    $right?: string;
    $translateX: number;
    $translateY: number;
    $scale: number;
    $width?: string;
    $isMobile: boolean;
  }>((props) => ({
    style: {
      top: props.$top || "auto",
      bottom: props.$bottom || "auto",
      left: props.$left || "auto",
      right: props.$right || "auto",
      transform: props.$isMobile
        ? `translate(${props.$translateX / 2}px, ${
            props.$translateY / 2
          }px) scale(${props.$scale})`
        : `translate(${props.$translateX}px, ${props.$translateY}px) scale(${props.$scale})`,
      width: props.$width || "auto",
    },
  }))`
  position: absolute;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  transition: transform 0.5s ease-out;
  z-index: 10;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const IslandButton: React.FC<IslandButtonProps> = ({
  imageSrc,
  position,
  mobilePosition,
  parallaxFactor = 5,
  width = "15%",
  mobileWidth = "20%",
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const parallax = useParallax(parallaxFactor);
  const isMobile = useIsMobile();

  // Adjust parallax for mobile
  const adjustedParallax = {
    x: parallax.x / (isMobile ? 2 : 1),
    y: parallax.y / (isMobile ? 2 : 1),
  };

  // Determine which position object to use based on screen size
  const activePosition = isMobile && mobilePosition ? mobilePosition : position;
  const activeWidth = isMobile ? mobileWidth : width;

  return (
    <StyledIslandButton
      $top={activePosition.top}
      $bottom={activePosition.bottom}
      $left={activePosition.left}
      $right={activePosition.right}
      $translateX={adjustedParallax.x}
      $translateY={adjustedParallax.y}
      $scale={isHovered ? 1.05 : 1}
      $width={activeWidth}
      $isMobile={isMobile}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img src={imageSrc} alt="Island" />
    </StyledIslandButton>
  );
};

export default IslandButton;
