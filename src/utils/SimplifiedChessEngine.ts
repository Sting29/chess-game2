export type Square = string;
export type Piece = string;
export type Color = "w" | "b";
export type PromotionPiece = "q" | "r" | "n" | "b";

export class SimplifiedChessEngine {
  private position: Map<Square, Piece>;
  private turn: Color;

  constructor(fen: string) {
    this.position = new Map();
    this.turn = "w";
    this.loadPosition(fen);
  }

  private loadPosition(fen: string) {
    const [position] = fen.split(" ");
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

  private algebraic(file: number, rank: number): Square {
    return `${"abcdefgh"[file]}${rank + 1}`;
  }

  private parseSquare(square: Square): [number, number] {
    const file = square.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(square[1]) - 1;
    return [file, rank];
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

        // Ход вперед на одну клетку
        const oneStep = this.algebraic(fromFile, fromRank + direction);
        if (!this.position.has(oneStep)) {
          moves.push(oneStep);

          // Ход на две клетки с начальной позиции
          if (fromRank === startRank) {
            const twoStep = this.algebraic(fromFile, fromRank + 2 * direction);
            if (!this.position.has(twoStep)) {
              moves.push(twoStep);
            }
          }
        }

        // Взятие по диагонали
        [-1, 1].forEach((offset) => {
          const captureSquare = this.algebraic(
            fromFile + offset,
            fromRank + direction
          );
          if (this.position.has(captureSquare)) {
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
        for (const [dx, dy] of [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]) {
          let x = fromFile + dx;
          let y = fromRank + dy;
          while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const square = this.algebraic(x, y);
            if (!this.position.has(square)) {
              moves.push(square);
            } else {
              const targetPiece = this.position.get(square);
              if (
                targetPiece &&
                (isWhite
                  ? targetPiece === targetPiece.toLowerCase()
                  : targetPiece === targetPiece.toUpperCase())
              ) {
                moves.push(square);
              }
              break;
            }
            x += dx;
            y += dy;
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
        for (const [dx, dy] of knightMoves) {
          const x = fromFile + dx;
          const y = fromRank + dy;
          if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const square = this.algebraic(x, y);
            if (
              !this.position.has(square) ||
              (this.position.has(square) &&
                (isWhite
                  ? this.position.get(square)?.toLowerCase() ===
                    this.position.get(square)
                  : this.position.get(square)?.toUpperCase() ===
                    this.position.get(square)))
            ) {
              moves.push(square);
            }
          }
        }
        break;

      case "b": // Слон
        for (const [dx, dy] of [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]) {
          let x = fromFile + dx;
          let y = fromRank + dy;
          while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const square = this.algebraic(x, y);
            if (!this.position.has(square)) {
              moves.push(square);
            } else {
              const targetPiece = this.position.get(square);
              if (
                targetPiece &&
                (isWhite
                  ? targetPiece === targetPiece.toLowerCase()
                  : targetPiece === targetPiece.toUpperCase())
              ) {
                moves.push(square);
              }
              break;
            }
            x += dx;
            y += dy;
          }
        }
        break;

      case "q": // Ферзь (комбинация ходов ладьи и слона)
        for (const [dx, dy] of [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]) {
          let x = fromFile + dx;
          let y = fromRank + dy;
          while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const square = this.algebraic(x, y);
            if (!this.position.has(square)) {
              moves.push(square);
            } else {
              const targetPiece = this.position.get(square);
              if (
                targetPiece &&
                (isWhite
                  ? targetPiece === targetPiece.toLowerCase()
                  : targetPiece === targetPiece.toUpperCase())
              ) {
                moves.push(square);
              }
              break;
            }
            x += dx;
            y += dy;
          }
        }
        break;

      case "k": // Король
        for (const [dx, dy] of [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]) {
          const x = fromFile + dx;
          const y = fromRank + dy;
          if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const square = this.algebraic(x, y);
            if (
              !this.position.has(square) ||
              (this.position.has(square) &&
                (isWhite
                  ? this.position.get(square)?.toLowerCase() ===
                    this.position.get(square)
                  : this.position.get(square)?.toUpperCase() ===
                    this.position.get(square)))
            ) {
              moves.push(square);
            }
          }
        }
        break;
    }

    return moves;
  }

  private isPawnPromotion(from: Square, to: Square): boolean {
    const piece = this.position.get(from);
    if (!piece || piece.toLowerCase() !== "p") return false;

    const [, toRank] = this.parseSquare(to);
    return toRank === 0 || toRank === 7;
  }

  move(
    from: Square,
    to: Square,
    promotion?: PromotionPiece
  ): { captured?: boolean; promotion?: boolean } {
    const piece = this.position.get(from);
    if (!piece) return { captured: false };

    const isWhite = piece === piece.toUpperCase();
    if ((isWhite && this.turn !== "w") || (!isWhite && this.turn !== "b")) {
      return { captured: false };
    }

    const validMoves = this.getPieceMoves(from);
    if (!validMoves.includes(to)) {
      return { captured: false };
    }

    const isPromotion = this.isPawnPromotion(from, to);
    if (isPromotion && !promotion) {
      return { captured: false, promotion: true };
    }

    const captured = this.position.has(to);
    this.position.delete(from);

    if (isPromotion && promotion) {
      this.position.set(to, isWhite ? promotion.toUpperCase() : promotion);
    } else {
      this.position.set(to, piece);
    }

    this.turn = this.turn === "w" ? "b" : "w";

    return { captured, promotion: isPromotion };
  }

  fen(): string {
    let fen = "";
    for (let rank = 7; rank >= 0; rank--) {
      let empty = 0;
      for (let file = 0; file < 8; file++) {
        const square = this.algebraic(file, rank);
        const piece = this.position.get(square);

        if (piece) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += piece;
        } else {
          empty++;
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

  isGameOver(): boolean {
    // Упрощенная проверка: игра заканчивается, когда не осталось черных фигур
    for (const piece of this.position.values()) {
      if (piece.toLowerCase() === piece) return false;
    }
    return true;
  }

  getLegalMoves(square: Square): Square[] {
    return this.getPieceMoves(square);
  }

  hasWhitePieces(): boolean {
    for (const piece of this.position.values()) {
      if (piece === piece.toUpperCase() && piece !== ".") {
        return true;
      }
    }
    return false;
  }

  hasBlackPieces(): boolean {
    for (const piece of this.position.values()) {
      if (piece === piece.toLowerCase() && piece !== ".") {
        return true;
      }
    }
    return false;
  }

  getGameStatus(): "playing" | "white_wins" | "draw" {
    // Сначала проверяем, остались ли черные фигуры
    if (!this.hasBlackPieces()) {
      return "white_wins";
    }

    // Проверяем ничью только если есть фигуры обоих цветов
    if (
      this.hasBlackPieces() &&
      this.hasWhitePieces() &&
      !this.hasLegalMoves()
    ) {
      return "draw";
    }

    return "playing";
  }

  hasLegalMoves(): boolean {
    for (const [square, piece] of this.position.entries()) {
      const isWhitePiece = piece === piece.toUpperCase();
      if (
        (this.turn === "w" && isWhitePiece) ||
        (this.turn === "b" && !isWhitePiece)
      ) {
        if (this.getLegalMoves(square).length > 0) {
          return true;
        }
      }
    }
    return false;
  }
}
