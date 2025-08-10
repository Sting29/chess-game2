export type Square = string;
export type Piece = string;
export type Color = "w" | "b";
export type PromotionPiece = "q" | "r" | "n" | "b";

export interface ChessPuzzle {
  id: string;
  titleKey: string;
  descriptionKey: string;
  initialPosition: string;
  correctMoves: Array<{
    from: string;
    to: string;
    piece: string;
    isComputerMove?: boolean;
  }>;
  hintKey: string;
  playerColor: "w" | "b";
}

export interface PuzzleCategory {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  puzzles: ChessPuzzle[] | MazePuzzle[];
}

export interface ThreatInfo {
  threatSquares: Square[];
  showHints: boolean;
  kidsMode: boolean;
}
// Maze Puzzle Types
export interface MazePuzzle {
  id: string;
  titleKey: string;
  descriptionKey: string;
  initialPosition: string; // FEN-like notation: "E6C/WWWW1WWW/8/8/8/2W1W3/WWW1WWW1/R7 w - - 0 1"
  maxMoves?: number; // Maximum number of moves (optional)
  timeLimit?: number; // Time limit in seconds (optional)
  hintKey: string;
}

export interface MazeGameState {
  position: Map<Square, string>;
  playerPiece: { square: Square; type: string };
  walls: Set<Square>;
  exits: Set<Square>;
  checkpoints: Set<Square>;
  visitedCheckpoints: Set<Square>;
  remainingMoves?: number;
  remainingTime?: number;
  gameStatus: "playing" | "won" | "lost";
  turn: "w" | "b";
}

export interface MazeProgressState {
  completedPuzzles: Set<string>;
  currentPuzzleId: string | null;
  totalPuzzles: number;
  completionPercentage: number;
}

export type MazeElement = "wall" | "exit" | "checkpoint" | "empty";

export interface MoveResult {
  success: boolean;
  gameComplete?: boolean;
  gameFailed?: boolean;
  checkpointVisited?: boolean;
  remainingCheckpoints?: number;
}
