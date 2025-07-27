import { Chess, Square } from "chess.js";

export class PersonsChessEngine {
  private game: Chess;

  constructor(fen?: string) {
    this.game = new Chess(fen);
  }

  move(
    from: Square,
    to: Square
  ): { valid: boolean; captured?: boolean; gameOver?: boolean } {
    try {
      const move = this.game.move({
        from,
        to,
        promotion: "q", // Автоматически превращаем в ферзя
      });

      if (move) {
        return {
          valid: true,
          captured: move.captured !== undefined,
          gameOver: this.isGameOver(),
        };
      }
    } catch (e) {
      console.error("Invalid move:", e);
    }

    return { valid: false };
  }

  fen(): string {
    return this.game.fen();
  }

  isGameOver(): boolean {
    return this.game.isGameOver();
  }

  isDraw(): boolean {
    return this.game.isDraw();
  }

  isCheckmate(): boolean {
    return this.game.isCheckmate();
  }

  isStalemate(): boolean {
    return this.game.isStalemate();
  }

  isThreefoldRepetition(): boolean {
    return this.game.isThreefoldRepetition();
  }

  isInsufficientMaterial(): boolean {
    return this.game.isInsufficientMaterial();
  }

  turn(): "w" | "b" {
    return this.game.turn() as "w" | "b";
  }

  getLegalMoves(square: Square): Square[] {
    return this.game
      .moves({
        square,
        verbose: true,
      })
      .map((move) => move.to as Square);
  }

  getGameStatus(): string {
    if (this.isCheckmate()) {
      return this.turn() === "w" ? "Black wins!" : "White wins!";
    }
    if (this.isDraw()) {
      if (this.isStalemate()) {
        return "Draw by stalemate!";
      }
      if (this.isThreefoldRepetition()) {
        return "Draw by repetition!";
      }
      if (this.isInsufficientMaterial()) {
        return "Draw by insufficient material!";
      }
      return "Draw!";
    }
    return this.turn() === "w" ? "White's move" : "Black's move";
  }

  getPieceColor(square: Square): "w" | "b" | null {
    const piece = this.game.get(square);
    return piece ? piece.color : null;
  }

  getPiece(square: Square): string | null {
    const piece = this.game.get(square);
    return piece ? piece.type : null;
  }
}
