import { Square, PromotionPiece } from "../types/types";

export class BattleChessEngine {
  private position: Map<Square, string>;
  private turn!: "w" | "b";

  constructor(fen: string) {
    this.position = new Map();
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

  move(
    from: Square,
    to: Square,
    promotion?: PromotionPiece
  ): { captured?: boolean; promotion?: boolean } | null {
    const piece = this.position.get(from);
    if (!piece) return null;

    // Проверяем, чей ход
    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (this.turn === "w" && !isWhitePiece) ||
      (this.turn === "b" && isWhitePiece)
    ) {
      return null;
    }

    const validMoves = this.getLegalMoves(from);
    if (!validMoves.includes(to)) {
      return null;
    }

    const captured = this.position.has(to);
    const isPromotion =
      piece.toUpperCase() === "P" &&
      ((isWhitePiece && to[1] === "8") || (!isWhitePiece && to[1] === "1"));

    if (isPromotion && !promotion) {
      return null;
    }

    const newPosition = new Map(this.position);
    newPosition.delete(from);

    if (isPromotion && promotion) {
      newPosition.set(
        to,
        this.turn === "w" ? promotion.toUpperCase() : promotion.toLowerCase()
      );
    } else {
      newPosition.set(to, piece);
    }

    this.position = newPosition;
    this.turn = this.turn === "w" ? "b" : "w";

    return { captured, promotion: isPromotion };
  }

  getLegalMoves(square: Square): Square[] {
    const piece = this.position.get(square);
    if (!piece) return [];

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (this.turn === "w" && !isWhitePiece) ||
      (this.turn === "b" && isWhitePiece)
    ) {
      return [];
    }

    return this.getPieceMoves(square);
  }

  private getPieceMoves(from: Square): Square[] {
    const piece = this.position.get(from);
    if (!piece) return [];

    const [fromFile, fromRank] = this.parseSquare(from);
    const moves: Square[] = [];
    const isWhite = piece === piece.toUpperCase();

    switch (piece.toLowerCase()) {
      case "p": // Пешка
        const direction = isWhite ? 1 : -1;
        const startRank = isWhite ? 1 : 6;

        // Ход вперед
        const oneStep = this.algebraic(fromFile, fromRank + direction);
        if (oneStep && !this.position.has(oneStep)) {
          moves.push(oneStep);

          if (fromRank === startRank) {
            const twoStep = this.algebraic(fromFile, fromRank + 2 * direction);
            if (twoStep && !this.position.has(twoStep)) {
              moves.push(twoStep);
            }
          }
        }

        // Взятие
        [-1, 1].forEach((offset) => {
          const captureSquare = this.algebraic(
            fromFile + offset,
            fromRank + direction
          );
          if (captureSquare && this.position.has(captureSquare)) {
            const targetPiece = this.position.get(captureSquare);
            if (
              targetPiece &&
              (isWhite
                ? targetPiece === targetPiece.toLowerCase()
                : targetPiece === targetPiece.toUpperCase())
            ) {
              moves.push(captureSquare);
            }
          }
        });
        break;

      case "r": // Ладья
        for (const [fileOffset, rankOffset] of [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]) {
          let currentFile = fromFile + fileOffset;
          let currentRank = fromRank + rankOffset;

          while (true) {
            const square = this.algebraic(currentFile, currentRank);
            if (!square) break;

            const targetPiece = this.position.get(square);
            if (!targetPiece) {
              moves.push(square);
            } else {
              if (
                isWhite
                  ? targetPiece === targetPiece.toLowerCase()
                  : targetPiece === targetPiece.toUpperCase()
              ) {
                moves.push(square);
              }
              break;
            }

            currentFile += fileOffset;
            currentRank += rankOffset;
          }
        }
        break;

      case "n": // Конь
        const knightMoves = [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1],
        ];

        for (const [fileOffset, rankOffset] of knightMoves) {
          const square = this.algebraic(
            fromFile + fileOffset,
            fromRank + rankOffset
          );
          if (square) {
            const targetPiece = this.position.get(square);
            if (
              !targetPiece ||
              (isWhite
                ? targetPiece === targetPiece.toLowerCase()
                : targetPiece === targetPiece.toUpperCase())
            ) {
              moves.push(square);
            }
          }
        }
        break;

      case "b": // Слон
        for (const [fileOffset, rankOffset] of [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]) {
          let currentFile = fromFile + fileOffset;
          let currentRank = fromRank + rankOffset;

          while (true) {
            const square = this.algebraic(currentFile, currentRank);
            if (!square) break;

            const targetPiece = this.position.get(square);
            if (!targetPiece) {
              moves.push(square);
            } else {
              if (
                isWhite
                  ? targetPiece === targetPiece.toLowerCase()
                  : targetPiece === targetPiece.toUpperCase()
              ) {
                moves.push(square);
              }
              break;
            }

            currentFile += fileOffset;
            currentRank += rankOffset;
          }
        }
        break;
    }

    return moves;
  }

  private parseSquare(square: Square): [number, number] {
    const file = square.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(square[1]) - 1;
    return [file, rank];
  }

  private algebraic(file: number, rank: number): Square {
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      return `${"abcdefgh"[file]}${rank + 1}` as Square;
    }
    return "" as Square;
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

  hasPiece(square: Square): boolean {
    return this.position.has(square);
  }

  getGameStatus(): "playing" | "white_wins" | "black_wins" | "draw" {
    const whitePieces = Array.from(this.position.values()).filter(
      (p) => p === p.toUpperCase()
    );
    const blackPieces = Array.from(this.position.values()).filter(
      (p) => p === p.toLowerCase()
    );

    if (blackPieces.length === 0) return "white_wins";
    if (whitePieces.length === 0) return "black_wins";

    // Проверка на пат
    let hasLegalMoves = false;
    for (const [square, piece] of this.position.entries()) {
      const isWhitePiece = piece === piece.toUpperCase();
      if (
        (this.turn === "w" && isWhitePiece) ||
        (this.turn === "b" && !isWhitePiece)
      ) {
        if (this.getLegalMoves(square).length > 0) {
          hasLegalMoves = true;
          break;
        }
      }
    }

    if (!hasLegalMoves) return "draw";
    return "playing";
  }
}
