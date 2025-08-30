import React from "react";
import styled from "styled-components";
import stone1 from "src/assets/background/puzzles/common/stone_1.png";
import stone2 from "src/assets/background/puzzles/common/stone_2.png";
import stone3 from "src/assets/background/puzzles/common/stone_3.png";
import stoneLock from "src/assets/background/puzzles/common/stone-lock.png";

interface PuzzleStoneProps {
  puzzleNumber: number;
  state: "completed" | "available" | "locked";
  onClick: () => void;
}

const StoneContainer = styled.button<{ clickable: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  user-select: none;
  transition: transform 0.2s ease;
  background: transparent;
  border: none;

  ${(props) =>
    props.clickable &&
    `
    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  `}
`;

const StoneImage = styled.img`
  width: 80px;
  height: 80px;
  display: block;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const StoneNumber = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "RubikOne", sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const CheckmarkOverlay = styled.div`
  position: absolute;
  top: -5px;
  left: -5px;
  width: 20px;
  height: 20px;
  background-color: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;

  &::after {
    content: "✓";
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    top: -4px;
    left: -4px;

    &::after {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
    top: -3px;
    left: -3px;

    &::after {
      font-size: 10px;
    }
  }
`;

const LockOverlay = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  z-index: 3;

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const PuzzleStone: React.FC<PuzzleStoneProps> = ({
  puzzleNumber,
  state,
  onClick,
}) => {
  // Select stone image based on puzzle number (cycle through 3 variants)
  const getStoneImage = () => {
    const stoneVariant = (puzzleNumber - 1) % 3;
    switch (stoneVariant) {
      case 0:
        return stone1;
      case 1:
        return stone2;
      case 2:
        return stone3;
      default:
        return stone1;
    }
  };

  const handleClick = () => {
    // Only allow clicks for completed and available stones
    if (state !== "locked") {
      onClick();
    }
  };

  const isClickable = state !== "locked";

  return (
    <StoneContainer clickable={isClickable} onClick={handleClick}>
      <StoneImage src={getStoneImage()} alt={`Puzzle ${puzzleNumber}`} />

      {/* Show number for available and completed stones */}
      {state !== "locked" && <StoneNumber>{puzzleNumber}</StoneNumber>}

      {/* Show checkmark for completed puzzles */}
      {state === "completed" && <CheckmarkOverlay />}

      {/* Show lock for locked puzzles */}
      {state === "locked" && (
        <LockOverlay src={stoneLock} alt="Locked puzzle" />
      )}
    </StoneContainer>
  );
};

export default PuzzleStone;
