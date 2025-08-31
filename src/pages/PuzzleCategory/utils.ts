import { StonePosition } from "./styles";
import type { BackgroundConfig } from "./config";

// Determine puzzle state based on index (0-based)
export const getPuzzleState = (
  puzzleIndex: number
): "completed" | "available" | "locked" => {
  if (puzzleIndex < 2) return "completed"; // Puzzles 1-2 (indices 0-1)
  if (puzzleIndex < 4) return "available"; // Puzzles 3-4 (indices 2-3)
  return "locked"; // Puzzles 5+ (indices 4+)
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
