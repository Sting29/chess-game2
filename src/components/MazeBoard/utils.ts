import { Square } from "../../types/types";

// Convert coordinates to square notation
export const coordsToSquare = (file: number, rank: number): Square => {
  return `${String.fromCharCode(97 + file)}${rank + 1}` as Square;
};

// Convert square notation to coordinates
export const squareToCoords = (square: Square) => {
  const file = square.charCodeAt(0) - 97; // 'a' = 0
  const rank = parseInt(square[1]) - 1; // '1' = 0
  return { file, rank };
};

// Get square color (light/dark)
export const getSquareColor = (
  file: number,
  rank: number
): "light" | "dark" => {
  return (file + rank) % 2 === 0 ? "dark" : "light";
};

// Generate status message based on game state
export const getStatusMessage = (
  isGameComplete: boolean,
  isGameFailed: boolean,
  currentTime: number | null,
  remainingMoves: number | null,
  checkpointsCount: number
): string => {
  if (isGameComplete) {
    return "Maze completed!";
  }

  if (isGameFailed) {
    return "Maze failed!";
  }

  if (currentTime !== null && currentTime <= 0) {
    return "Time's up!";
  }

  if (remainingMoves === 0) {
    return "No moves remaining!";
  }

  if (checkpointsCount > 0) {
    return `Visit ${checkpointsCount} checkpoint${
      checkpointsCount > 1 ? "s" : ""
    } first`;
  }

  return "Navigate to the exit";
};
