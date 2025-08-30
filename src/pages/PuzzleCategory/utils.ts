import { StonePosition } from "./styles";

// Stone positions following the S-curve path from the design
export const STONE_POSITIONS: StonePosition[] = [
  { x: 33, y: 32 }, // Stone 1 - Start of path, left side
  { x: 21, y: 42 }, // Stone 2 - Moving down left
  { x: 22, y: 60 }, // Stone 3 - Bottom left curve
  { x: 34, y: 67 }, // Stone 4 - Starting to curve right
  { x: 46, y: 58 }, // Stone 5 - Bottom center
  { x: 50, y: 40 }, // Stone 6 - Moving up right
  { x: 60, y: 32 }, // Stone 7 - Right side curve
  { x: 73, y: 38 }, // Stone 8 - Moving up right
  { x: 76, y: 52 }, // Stone 9 - Top right curve
  { x: 65, y: 63 }, // Stone 10 - End of path, top center
];

// Determine puzzle state based on index (0-based)
export const getPuzzleState = (
  puzzleIndex: number
): "completed" | "available" | "locked" => {
  if (puzzleIndex < 2) return "completed"; // Puzzles 1-2 (indices 0-1)
  if (puzzleIndex < 4) return "available"; // Puzzles 3-4 (indices 2-3)
  return "locked"; // Puzzles 5+ (indices 4+)
};

// Get stone position for a given puzzle index on current page
export const getStonePosition = (puzzleIndexOnPage: number): StonePosition => {
  // Ensure we don't exceed available positions
  const positionIndex = Math.min(puzzleIndexOnPage, STONE_POSITIONS.length - 1);
  return STONE_POSITIONS[positionIndex];
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
