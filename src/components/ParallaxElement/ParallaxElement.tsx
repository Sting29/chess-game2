// Fix the image paths to ensure they load correctly
import styled from "styled-components";
import { useParallax } from "../../hooks/useParallax";
import { useIsMobile } from "../../hooks/useIsMobile";
import { memo } from "react";

interface ParallaxElementProps {
  imageSrc: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  parallaxFactor?: number;
  width?: string;
  mobileWidth?: string;
  zIndex?: number;
}

const ParallaxContainer = styled.div.attrs<{
  $top?: string;
  $bottom?: string;
  $left?: string;
  $right?: string;
  $transform: string;
  $width?: string;
  $zIndex?: number;
}>((props) => ({
  style: {
    top: props.$top || "auto",
    bottom: props.$bottom || "auto",
    left: props.$left || "auto",
    right: props.$right || "auto",
    transform: props.$transform,
    width: props.$width || "auto",
    zIndex: props.$zIndex || 5,
  },
}))`
  position: absolute;
  will-change: transform;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ParallaxElement: React.FC<ParallaxElementProps> = memo(
  ({
    imageSrc,
    position,
    parallaxFactor = 10,
    width = "auto",
    mobileWidth,
    zIndex = 5,
  }) => {
    const parallax = useParallax(parallaxFactor);
    const isMobile = useIsMobile();

    // Reduce parallax effect on mobile
    const adjustedParallax = {
      x: parallax.x / (isMobile ? 2 : 1),
      y: parallax.y / (isMobile ? 2 : 1),
    };

    // Fix image path by removing "public/" prefix if it exists
    const fixedImageSrc = imageSrc.startsWith("public/")
      ? imageSrc.substring(7)
      : imageSrc;

    return (
      <ParallaxContainer
        $top={position.top}
        $bottom={position.bottom}
        $left={position.left}
        $right={position.right}
        $transform={`translate(${adjustedParallax.x}px, ${adjustedParallax.y}px)`}
        $width={isMobile ? mobileWidth || width : width}
        $zIndex={zIndex}
      >
        <img src={fixedImageSrc} alt="Parallax Element" />
      </ParallaxContainer>
    );
  }
);

ParallaxElement.displayName = "ParallaxElement";

export default ParallaxElement;
