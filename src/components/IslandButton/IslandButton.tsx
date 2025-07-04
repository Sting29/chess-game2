import { useState, memo, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
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
  width?: string;
  mobileWidth?: string;
  onClick?: () => void;
  animationType?: "default" | "gentle" | "swing" | "bounce";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
}

const islandFloatAnimation = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(2px, -3px) rotate(0.5deg);
  }
  50% {
    transform: translate(0, -5px) rotate(0deg);
  }
  75% {
    transform: translate(-2px, -3px) rotate(-0.5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
`;

const gentleFloatAnimation = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(1px, -2px) rotate(0.2deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
`;

const swingAnimation = keyframes`
  0% {
    transform: translate(0, 0) rotate(-1deg);
  }
  50% {
    transform: translate(3px, -2px) rotate(1deg);
  }
  100% {
    transform: translate(0, 0) rotate(-1deg);
  }
`;

const bounceAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, -3px);
  }
  50% {
    transform: translate(0, 0);
  }
  75% {
    transform: translate(0, -2px);
  }
  100% {
    transform: translate(0, 0);
  }
`;

const getAnimation = (type: IslandButtonProps["animationType"]) => {
  switch (type) {
    case "gentle":
      return gentleFloatAnimation;
    case "swing":
      return swingAnimation;
    case "bounce":
      return bounceAnimation;
    default:
      return islandFloatAnimation;
  }
};

const StyledIslandButton = styled.button
  .withConfig({
    shouldForwardProp: (prop) => !prop.startsWith("$"),
  })
  .attrs<{
    $top?: string;
    $bottom?: string;
    $left?: string;
    $right?: string;
    $scale: number;
    $width?: string;
    $isMobile: boolean;
    $animationType: IslandButtonProps["animationType"];
  }>((props) => ({
    style: {
      top: props.$top || "auto",
      bottom: props.$bottom || "auto",
      left: props.$left || "auto",
      right: props.$right || "auto",
      transform: `scale(${props.$scale})`,
      width: props.$width || "auto",
    },
  }))`
  position: absolute;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  transition: transform 0.3s ease-out, box-shadow 0.2s, border 0.2s;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    ${(props) => {
      const duration =
        props.$animationType === "swing" || props.$animationType === "gentle"
          ? "8s"
          : "4s";
      return css`
        animation: ${getAnimation(props.$animationType)} ${duration} ease-in-out
          infinite;
      `;
    }}
    border-radius: 12px;
  }

  // Белая обводка и увеличение только при фокусе с клавиатуры
  &:focus-visible img {
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px #fff;
    transform: scale(1.05);
    transition: transform 0.2s, box-shadow 0.2s, border 0.2s;
  }
`;

const IslandButton = memo(function IslandButton({
  imageSrc,
  position,
  mobilePosition,
  width = "15%",
  mobileWidth = "20%",
  onClick,
  animationType = "default",
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: IslandButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  // Memoize active position and width
  const { activePosition, activeWidth } = useMemo(
    () => ({
      activePosition: isMobile && mobilePosition ? mobilePosition : position,
      activeWidth: isMobile ? mobileWidth : width,
    }),
    [isMobile, mobilePosition, position, mobileWidth, width]
  );

  // Memoize scale value
  const scale = useMemo(() => (isHovered ? 1.05 : 1), [isHovered]);

  const handleEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  const handleFocus = () => {
    setIsHovered(true);
    onFocus?.();
  };

  return (
    <StyledIslandButton
      $top={activePosition.top}
      $bottom={activePosition.bottom}
      $left={activePosition.left}
      $right={activePosition.right}
      $scale={scale}
      $width={activeWidth}
      $isMobile={isMobile}
      $animationType={animationType}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleFocus}
    >
      <img src={imageSrc} alt="Island" />
    </StyledIslandButton>
  );
});

IslandButton.displayName = "IslandButton";

export default IslandButton;
