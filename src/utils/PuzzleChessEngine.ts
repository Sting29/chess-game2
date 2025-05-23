import { Square } from "../types/types";

export class PuzzleChessEngine {
  private position: Map<Square, string>;
  private turn!: "w" | "b";
  private correctMoves: Array<{
    from: string;
    to: string;
    piece: string;
    isComputerMove?: boolean;
  }>;
  private currentMoveIndex: number;
  private puzzleFailed: boolean;

  constructor(
    fen: string,
    correctMoves: Array<{
      from: string;
      to: string;
      piece: string;
      isComputerMove?: boolean;
    }>,
    currentMoveIndex: number = 0
  ) {
    this.position = new Map();
    this.correctMoves = correctMoves;
    this.currentMoveIndex = currentMoveIndex;
    this.puzzleFailed = false;
    this.parseFen(fen);
  }

  private parseFen(fen: string) {
    const [position, turn] = fen.split(" ");
    this.turn = turn as "w" | "b";

    let rank = 7;
    let file = 0;

    for (const char of position) {
      if (char === "/") {
        rank--;
        file = 0;
      } else if (/\d/.test(char)) {
        file += parseInt(char);
      } else {
        const square = this.algebraic(file, rank);
        this.position.set(square, char);
        file++;
      }
    }
  }

  makeMove(
    from: Square,
    to: Square
  ): { success: boolean; puzzleComplete?: boolean; computerMove?: boolean } {
    const expectedMove = this.correctMoves[this.currentMoveIndex];

    if (expectedMove.isComputerMove) {
      return { success: false };
    }

    if (
      from === expectedMove.from &&
      to === expectedMove.to &&
      this.position.get(from) === expectedMove.piece
    ) {
      // Ход правильный
      this.position.delete(from);
      this.position.set(to, expectedMove.piece);
      this.currentMoveIndex++;
      this.turn = this.turn === "w" ? "b" : "w";

      const nextMove = this.correctMoves[this.currentMoveIndex];
      return {
        success: true,
        puzzleComplete: this.currentMoveIndex >= this.correctMoves.length,
        computerMove: nextMove?.isComputerMove,
      };
    }

    // Ход неправильный
    this.puzzleFailed = true;
    return { success: false };
  }

  makeComputerMove(): { success: boolean } {
    const computerMove = this.correctMoves[this.currentMoveIndex];
    if (!computerMove?.isComputerMove) {
      return { success: false };
    }

    this.position.delete(computerMove.from);
    this.position.set(computerMove.to, computerMove.piece);
    this.currentMoveIndex++;
    this.turn = this.turn === "w" ? "b" : "w";

    return { success: true };
  }

  getLegalMoves(square: Square): Square[] {
    const piece = this.position.get(square);
    if (!piece) return [];

    const expectedMove = this.correctMoves[this.currentMoveIndex];
    if (expectedMove.from === square) {
      return [expectedMove.to];
    }

    return [];
  }

  isPuzzleComplete(): boolean {
    return this.currentMoveIndex >= this.correctMoves.length;
  }

  isPuzzleFailed(): boolean {
    return this.puzzleFailed;
  }

  getCurrentMoveIndex(): number {
    return this.currentMoveIndex;
  }

  hasPiece(square: Square): boolean {
    return this.position.has(square);
  }

  fen(): string {
    let fen = "";
    for (let rank = 7; rank >= 0; rank--) {
      let empty = 0;
      for (let file = 0; file < 8; file++) {
        const square = this.algebraic(file, rank);
        const piece = this.position.get(square);

        if (!piece) {
          empty++;
        } else {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += piece;
        }
      }
      if (empty > 0) {
        fen += empty;
      }
      if (rank > 0) {
        fen += "/";
      }
    }

    return `${fen} ${this.turn} - - 0 1`;
  }

  private algebraic(file: number, rank: number): Square {
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      return `${"abcdefgh"[file]}${rank + 1}` as Square;
    }
    return "" as Square;
  }
}
