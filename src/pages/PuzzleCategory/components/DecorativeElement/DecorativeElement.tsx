import React from "react";
import styled from "styled-components";
import { getDecorativeImage } from "../../imageImports";
import anchor from "src/assets/background/puzzles/puzzle_5/anchor.png";
import compass from "src/assets/background/puzzles/common/compass.png";
import stoneLeft from "src/assets/background/puzzles/puzzle_5/stone_left.png";
import stoneRight from "src/assets/background/puzzles/puzzle_5/stone_right.png";
import bone from "src/assets/background/puzzles/puzzle_5/bone.png";
import coins from "src/assets/background/puzzles/puzzle_5/coins.png";
import map from "src/assets/background/puzzles/puzzle_5/map.png";

interface DecorativeElementProps {
  type:
    | "anchor"
    | "compass"
    | "stone_left"
    | "stone_right"
    | "bone"
    | "coins"
    | "map";
  position: { x: number; y: number };
  size?: { width: number; height: number };
  customImage?: string; // For category images
  puzzleId?: string; // For dynamic image loading
  imageName?: string; // Actual image filename
  zIndex?: number; // For layering control
}

const ElementWrapper = styled.div<{
  $position: { x: number; y: number };
  $size?: { width: number; height: number };
  $zIndex?: number;
}>`
  position: absolute;
  left: ${(props) => props.$position.x}%;
  top: ${(props) => props.$position.y}%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: ${(props) => props.$zIndex || 1};
  ${(props) =>
    props.$size &&
    `
    width: ${props.$size.width}px;
    height: ${props.$size.height}px;
  `}

  @media (max-width: 768px) {
    transform: translate(-50%, -50%) scale(0.8);
  }

  @media (max-width: 480px) {
    transform: translate(-50%, -50%) scale(0.6);
  }
`;

const ElementImage = styled.img<{
  $elementType: string;
  $hasCustomSize?: boolean;
}>`
  ${(props) =>
    props.$hasCustomSize
      ? `
    width: 100%;
    height: 100%;
    object-fit: contain;
  `
      : `
    max-width: 100%;
    height: auto;
  `}
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

  ${(props) => {
    if (props.$hasCustomSize) return "";
    switch (props.$elementType) {
      case "anchor":
        return `
          width: 80px;
          height: auto;
        `;
      case "compass":
        return `
          width: 70px;
          height: auto;
        `;
      case "stone_left":
      case "stone_right":
        return `
          width: 60px;
          height: auto;
        `;
      case "bone":
        return `
          width: 50px;
          height: auto;
        `;
      case "coins":
        return `
          width: 45px;
          height: auto;
        `;
      case "map":
        return `
          width: 55px;
          height: auto;
        `;
      default:
        return `
          width: 60px;
          height: auto;
        `;
    }
  }}

  @media (max-width: 768px) {
    ${(props) => {
      switch (props.$elementType) {
        case "anchor":
          return `width: 60px;`;
        case "compass":
          return `width: 50px;`;
        case "stone_left":
        case "stone_right":
          return `width: 45px;`;
        case "bone":
          return `width: 38px;`;
        case "coins":
          return `width: 34px;`;
        case "map":
          return `width: 42px;`;
        default:
          return `width: 45px;`;
      }
    }}
  }

  @media (max-width: 480px) {
    ${(props) => {
      switch (props.$elementType) {
        case "anchor":
          return `width: 40px;`;
        case "compass":
          return `width: 35px;`;
        case "stone_left":
        case "stone_right":
          return `width: 30px;`;
        case "bone":
          return `width: 25px;`;
        case "coins":
          return `width: 23px;`;
        case "map":
          return `width: 28px;`;
        default:
          return `width: 30px;`;
      }
    }}
  }
`;

const DecorativeElement: React.FC<DecorativeElementProps> = ({
  type,
  position,
  size,
  customImage,
  puzzleId,
  imageName,
  zIndex,
}) => {
  const getImageSource = () => {
    // Use custom image if provided
    if (customImage) {
      return customImage;
    }

    // Try to get image from dynamic imports first
    if (puzzleId && imageName) {
      const dynamicImage = getDecorativeImage(puzzleId, imageName);
      if (dynamicImage) {
        return dynamicImage;
      }
    }

    // Fallback to hardcoded images
    switch (type) {
      case "anchor":
        return anchor;
      case "compass":
        return compass;
      case "stone_left":
        return stoneLeft;
      case "stone_right":
        return stoneRight;
      case "bone":
        return bone;
      case "coins":
        return coins;
      case "map":
        return map;
      default:
        return anchor;
    }
  };

  const getAltText = () => {
    switch (type) {
      case "anchor":
        return "Decorative anchor";
      case "compass":
        return "Decorative compass";
      case "stone_left":
        return "Decorative stone left";
      case "stone_right":
        return "Decorative stone right";
      case "bone":
        return "Decorative bone";
      case "coins":
        return "Decorative coins";
      case "map":
        return "Decorative map";
      default:
        return "Decorative element";
    }
  };

  return (
    <ElementWrapper $position={position} $size={size} $zIndex={zIndex}>
      <ElementImage
        src={getImageSource()}
        alt={getAltText()}
        $elementType={type}
        $hasCustomSize={!!size}
      />
    </ElementWrapper>
  );
};

export default DecorativeElement;
