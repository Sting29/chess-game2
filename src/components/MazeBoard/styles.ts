import styled from "styled-components";

export const MazeBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const MazeStatus = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
`;

export const MazeCountersContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
`;

export const MazeCounter = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  min-width: 120px;

  &.checkpoints {
    color: #4a90e2;
  }

  &.moves {
    color: #f5a623;
  }

  &.time {
    color: #d0021b;
  }
`;

// Board components
export const BoardWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const ChessBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 68px);
  grid-template-rows: repeat(8, 68px);
  border: 10px solid #2a80bd;
  border-radius: 4px;
  width: 564px;
  height: 564px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    grid-template-columns: repeat(8, 45px);
    grid-template-rows: repeat(8, 45px);
    width: 376px;
    height: 376px;
  }
`;

interface BoardSquareProps {
  $color: "light" | "dark";
  $selected: boolean;
  $highlighted: boolean;
  $contentType: "piece" | "wall" | "exit" | "checkpoint" | "empty";
  $active?: boolean;
}

export const BoardSquare = styled.div<BoardSquareProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  background-color: ${({ $color, $contentType, $active }) => {
    if ($contentType === "wall") return "#8B4513";
    if ($contentType === "exit") return $active ? "#90EE90" : "#FFB6C1";
    if ($contentType === "checkpoint") return "#87CEEB";
    return $color === "light" ? "#dededc" : "#438dce";
  }};

  ${({ $selected }) =>
    $selected &&
    `
    background: rgba(255, 255, 0, 0.4) !important;
  `}

  &:hover {
    ${({ $contentType }) =>
      $contentType !== "wall" &&
      `
      filter: brightness(1.1);
      transform: scale(1.02);
    `}
  }
`;

export const PieceElement = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

interface HintDotProps {
  $hasPiece: boolean;
}

export const HintDot = styled.div<HintDotProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;

  ${({ $hasPiece }) =>
    $hasPiece
      ? `
        background: radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%);
      `
      : `
        background: radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%);
      `}
`;
