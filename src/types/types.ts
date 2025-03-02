export type Square = string;
export type Piece = string;
export type Color = "w" | "b";
export type PromotionPiece = "q" | "r" | "n" | "b";

export interface ChessPuzzle {
  id: string;
  title: string;
  description: string;
  initialPosition: string;
  correctMoves: Array<{
    from: string;
    to: string;
    piece: string;
    isComputerMove?: boolean;
  }>;
  hint: string;
  playerColor: "w" | "b";
}

export interface PuzzleCategory {
  id: string;
  title: string;
  description: string;
  puzzles: ChessPuzzle[];
}
