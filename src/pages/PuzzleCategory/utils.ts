import { StonePosition } from "./styles";
import type { BackgroundConfig } from "./config";

// Determine puzzle state based on progress data
export const getPuzzleState = (
  puzzleIndex: number,
  completedPuzzles: string[] = []
): "completed" | "available" | "locked" => {
  const puzzleId = (puzzleIndex + 1).toString(); // Convert 0-based index to 1-based puzzle ID

  // Check if this puzzle is completed
  if (completedPuzzles.includes(puzzleId)) {
    return "completed";
  }

  // First puzzle is always available
  if (puzzleIndex === 0) {
    return "available";
  }

  // Other puzzles are available only if previous puzzle is completed
  const previousPuzzleId = puzzleIndex.toString(); // Previous puzzle ID (1-based becomes 0-based + 1)
  if (completedPuzzles.includes(previousPuzzleId)) {
    return "available";
  }

  return "locked";
};

// Get stone position for a given puzzle index on current page
export const getStonePosition = (
  puzzleIndexOnPage: number,
  backgroundConfig: BackgroundConfig
): StonePosition => {
  // Use positions from configuration
  const positions = backgroundConfig.stonePositions;

  // Ensure we don't exceed available positions
  const positionIndex = Math.min(puzzleIndexOnPage, positions.length - 1);
  return positions[positionIndex];
};

// Calculate visible puzzles for current page
export const getVisiblePuzzles = (
  allPuzzles: any[],
  currentPage: number,
  puzzlesPerPage: number = 10
) => {
  const startIndex = currentPage * puzzlesPerPage;
  const endIndex = startIndex + puzzlesPerPage;
  return allPuzzles.slice(startIndex, endIndex);
};

// Calculate total pages needed
export const getTotalPages = (
  totalPuzzles: number,
  puzzlesPerPage: number = 10
): number => {
  return Math.ceil(totalPuzzles / puzzlesPerPage);
};

// Get actual puzzle number (1-based) from page and index
export const getPuzzleNumber = (
  currentPage: number,
  indexOnPage: number,
  puzzlesPerPage: number = 10
): number => {
  return currentPage * puzzlesPerPage + indexOnPage + 1;
};

// Constants
export const PUZZLES_PER_PAGE = 10;
