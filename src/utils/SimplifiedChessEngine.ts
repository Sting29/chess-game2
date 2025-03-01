export type Square = string;
export type Piece = string;
export type Color = "w" | "b";
export type PromotionPiece = "q" | "r" | "n" | "b";

export class SimplifiedChessEngine {
  private position: Map<Square, string>;
  private turn: "w" | "b" = "w"; // Всегда ход белых

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

  private algebraic(file: number, rank: number): Square {
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      return `${"abcdefgh"[file]}${rank + 1}` as Square;
    }
    return "" as Square;
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
        if (isWhite) {
          // Только для белых пешек
          // Ход вперед на одну клетку
          const oneStep = this.algebraic(fromFile, fromRank + 1);
          if (oneStep && !this.position.has(oneStep)) {
            moves.push(oneStep);

            // Ход на две клетки с начальной позиции
            if (fromRank === 1) {
              const twoStep = this.algebraic(fromFile, fromRank + 2);
              if (twoStep && !this.position.has(twoStep)) {
                moves.push(twoStep);
              }
            }
          }

          // Взятие по диагонали
          [-1, 1].forEach((offset) => {
            const captureSquare = this.algebraic(
              fromFile + offset,
              fromRank + 1
            );
            if (captureSquare && this.position.has(captureSquare)) {
              const targetPiece = this.position.get(captureSquare);
              if (targetPiece && targetPiece === targetPiece.toLowerCase()) {
                moves.push(captureSquare);
              }
            }
          });
        }
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

    return moves.filter((move) => move !== "");
  }

  private isPawnPromotion(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    if (!piece.endsWith("P")) return false;
    const [, toRank] = targetSquare.split("");
    return (
      (piece.startsWith("P") && toRank === "8") ||
      (piece.startsWith("p") && toRank === "1")
    );
  }

  move(
    from: Square,
    to: Square,
    promotion?: PromotionPiece
  ): { captured?: boolean; promotion?: boolean } | null {
    const piece = this.position.get(from);
    if (!piece) return null;

    // Проверяем, что ходят только белые фигуры
    const isWhite = piece === piece.toUpperCase();
    if (!isWhite) {
      return null;
    }

    const validMoves = this.getPieceMoves(from);
    if (!validMoves.includes(to)) {
      return null;
    }

    const captured = this.position.has(to);
    const isPromotion = this.isPawnPromotion(from, to, piece);

    // Создаем новую позицию
    const newPosition = new Map(this.position);

    // Удаляем пешку с исходной позиции
    newPosition.delete(from);

    if (isPromotion && promotion) {
      // Устанавливаем новую фигуру на целевую позицию
      newPosition.set(to, promotion.toUpperCase());
    } else {
      // Перемещаем исходную фигуру
      newPosition.set(to, piece);
    }

    // Обновляем позицию
    this.position = newPosition;
    this.turn = "w";

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
    const piece = this.position.get(square);
    if (!piece) return [];

    // Разрешаем ходы только белым фигурам
    const isWhite = piece === piece.toUpperCase();
    if (!isWhite) {
      return [];
    }

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
    // 1. Проверяем победу - остались ли черные фигуры
    if (!this.hasBlackPieces()) {
      return "white_wins";
    }

    // 2. Проверяем пат - есть ли возможные ходы
    if (!this.hasLegalMoves()) {
      return "draw";
    }

    // 3. Если ни одно из условий не выполнено - игра продолжается
    return "playing";
  }

  hasLegalMoves(): boolean {
    // Проверяем все белые фигуры на наличие возможных ходов
    for (const [square, piece] of this.position.entries()) {
      if (piece === piece.toUpperCase()) {
        // Только белые фигуры
        if (this.getLegalMoves(square).length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  hasPiece(square: Square): boolean {
    return this.position.has(square);
  }
}
