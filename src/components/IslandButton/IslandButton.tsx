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

const StyledIslandButton = styled.button<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  translateX: number;
  translateY: number;
  scale: number;
  width?: string;
  isMobile: boolean;
}>`
  position: absolute;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  top: ${(props) => props.top || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  left: ${(props) => props.left || "auto"};
  right: ${(props) => props.right || "auto"};
  transform: translate(
      ${(props) => props.translateX}px,
      ${(props) => props.translateY}px
    )
    scale(${(props) => props.scale});
  transition: transform 0.15s ease-out;
  z-index: 10;
  width: ${(props) => props.width || "auto"};

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    transform: translate(
        ${(props) => props.translateX / 2}px,
        ${(props) => props.translateY / 2}px
      )
      scale(${(props) => props.scale});
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
      {...activePosition}
      translateX={adjustedParallax.x}
      translateY={adjustedParallax.y}
      scale={isHovered ? 1.05 : 1}
      width={activeWidth}
      isMobile={isMobile}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img src={imageSrc} alt="Island" />
    </StyledIslandButton>
  );
};

export default IslandButton;
