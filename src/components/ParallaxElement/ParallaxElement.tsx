// Fix the image paths to ensure they load correctly
import styled from "styled-components";
import { useParallax } from "../../hooks/useParallax";
import { useIsMobile } from "../../hooks/useIsMobile";

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

const StyledParallaxElement = styled.div<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  translateX: number;
  translateY: number;
  width?: string;
  mobileWidth?: string;
  zIndex?: number;
  isMobile: boolean;
}>`
  position: absolute;
  top: ${(props) => props.top || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  left: ${(props) => props.left || "auto"};
  right: ${(props) => props.right || "auto"};
  transform: translate(
    ${(props) => props.translateX}px,
    ${(props) => props.translateY}px
  );
  width: ${(props) =>
    props.isMobile ? props.mobileWidth || props.width : props.width || "auto"};
  z-index: ${(props) => props.zIndex || 5};
  transition: transform 0.1s ease-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    transform: translate(
      ${(props) => props.translateX / 2}px,
      ${(props) => props.translateY / 2}px
    );
  }
`;

const ParallaxElement: React.FC<ParallaxElementProps> = ({
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
  //   const mobileAdjustedFactor = isMobile ? parallaxFactor / 2 : parallaxFactor;
  const adjustedParallax = {
    x: parallax.x / (isMobile ? 2 : 1),
    y: parallax.y / (isMobile ? 2 : 1),
  };

  // Fix image path by removing "public/" prefix if it exists
  const fixedImageSrc = imageSrc.startsWith("public/")
    ? imageSrc.substring(7)
    : imageSrc;

  return (
    <StyledParallaxElement
      {...position}
      translateX={adjustedParallax.x}
      translateY={adjustedParallax.y}
      width={width}
      mobileWidth={mobileWidth}
      zIndex={zIndex}
      isMobile={isMobile}
    >
      <img src={fixedImageSrc} alt="Parallax Element" />
    </StyledParallaxElement>
  );
};

export default ParallaxElement;
