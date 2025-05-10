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
  puzzles: ChessPuzzle[];
}
