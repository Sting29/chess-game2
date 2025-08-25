import { Square, PromotionPiece } from "../types/types";

export class SimplifiedChessEngine {
  private position: Map<Square, string>;
  private turn: "w" | "b" = "w"; // Always white's turn

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
      case "p": // Pawn
        if (isWhite) {
          // Only for white pawns
          // Move one square forward
          const oneStep = this.algebraic(fromFile, fromRank + 1);
          if (oneStep && !this.position.has(oneStep)) {
            moves.push(oneStep);

            // Move two squares from starting position
            if (fromRank === 1) {
              const twoStep = this.algebraic(fromFile, fromRank + 2);
              if (twoStep && !this.position.has(twoStep)) {
                moves.push(twoStep);
              }
            }
          }

          // Diagonal captures
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

      case "r": // Rook
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

      case "n": // Knight
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

      case "b": // Bishop
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

      case "q": // Queen (combination of rook and bishop moves)
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

      case "k": // King
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
    if (piece.toLowerCase() !== "p") return false;
    const [, toRank] = targetSquare.split("");
    return (
      (piece === "P" && toRank === "8") || (piece === "p" && toRank === "1")
    );
  }

  private isSquareAttackedByBlack(square: Square): boolean {
    const [targetFile, targetRank] = this.parseSquare(square);

    // Check pawn attacks
    for (const dx of [-1, 1]) {
      const x = targetFile + dx;
      const y = targetRank + 1;
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const attackSquare = this.algebraic(x, y);
        const piece = this.position.get(attackSquare);
        if (piece === "p") {
          return true;
        }
      }
    }

    // Check knight attacks
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
      const x = targetFile + dx;
      const y = targetRank + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const attackSquare = this.algebraic(x, y);
        const piece = this.position.get(attackSquare);
        if (piece === "n") {
          return true;
        }
      }
    }

    // Check diagonal attacks (bishop/queen)
    const diagonalDirections = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    for (const [dx, dy] of diagonalDirections) {
      let x = targetFile + dx;
      let y = targetRank + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const attackSquare = this.algebraic(x, y);
        const piece = this.position.get(attackSquare);
        if (piece) {
          if (piece === "b" || piece === "q") {
            return true;
          }
          break;
        }
        x += dx;
        y += dy;
      }
    }

    // Check straight attacks (rook/queen)
    const straightDirections = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for (const [dx, dy] of straightDirections) {
      let x = targetFile + dx;
      let y = targetRank + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const attackSquare = this.algebraic(x, y);
        const piece = this.position.get(attackSquare);
        if (piece) {
          if (piece === "r" || piece === "q") {
            return true;
          }
          break;
        }
        x += dx;
        y += dy;
      }
    }

    // Check king attacks
    const kingMoves = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    for (const [dx, dy] of kingMoves) {
      const x = targetFile + dx;
      const y = targetRank + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const attackSquare = this.algebraic(x, y);
        const piece = this.position.get(attackSquare);
        if (piece === "k") {
          return true;
        }
      }
    }

    return false;
  }

  private findWhiteKing(): Square | null {
    for (const [square, piece] of this.position.entries()) {
      if (piece === "K") {
        return square;
      }
    }
    return null;
  }

  private isKingInCheck(): boolean {
    const kingSquare = this.findWhiteKing();
    if (!kingSquare) return false;
    return this.isSquareAttackedByBlack(kingSquare);
  }

  private wouldMoveLeaveKingInCheck(from: Square, to: Square): boolean {
    // Create a new position with the move applied
    const newPosition = new Map(this.position);
    const piece = newPosition.get(from);
    newPosition.delete(from);
    newPosition.set(to, piece!);

    // Create a temporary engine with the new position
    const tempEngine = new SimplifiedChessEngine(this.fen());
    tempEngine.position = newPosition;

    // Check if the king is in check in the new position
    return tempEngine.isKingInCheck();
  }

  move(
    from: Square,
    to: Square,
    promotion?: PromotionPiece
  ): { captured?: boolean; promotion?: boolean } | null {
    const piece = this.position.get(from);
    if (!piece) return null;

    // Check that only white pieces can move
    const isWhite = piece === piece.toUpperCase();
    if (!isWhite) {
      return null;
    }

    const validMoves = this.getLegalMoves(from);
    if (!validMoves.includes(to)) {
      return null;
    }

    const captured = this.position.has(to);
    const isPromotion = this.isPawnPromotion(from, to, piece);

    // Create new position
    const newPosition = new Map(this.position);

    // Remove piece from source square
    newPosition.delete(from);

    if (isPromotion && promotion) {
      // Set promoted piece on target square
      newPosition.set(to, promotion.toUpperCase());
    } else {
      // Move piece to target square
      newPosition.set(to, piece);
    }

    // Update position
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
    // Simplified check: game ends when no black pieces remain
    for (const piece of this.position.values()) {
      if (piece.toLowerCase() === piece) return false;
    }
    return true;
  }

  getLegalMoves(square: Square): Square[] {
    const piece = this.position.get(square);
    if (!piece) return [];

    // Allow moves only for white pieces
    const isWhite = piece === piece.toUpperCase();
    if (!isWhite) {
      return [];
    }

    // Get all possible moves without considering check
    const possibleMoves = this.getPieceMoves(square);

    // Filter out moves that would leave the king in check
    return possibleMoves.filter(
      (move) => !this.wouldMoveLeaveKingInCheck(square, move)
    ) as Square[];
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
    // 1. Check for victory - are there any black pieces left
    if (!this.hasBlackPieces()) {
      return "white_wins";
    }
    // 2. Check for victory - has white pawn reached 8th rank (promotion)
    if (this.hasWhitePawnOnEighthRank()) {
      return "white_wins";
    }
    // 3. Check for stalemate - are there any legal moves
    if (!this.hasLegalMoves()) {
      return "draw";
    }
    // 4. If neither condition is met - game continues
    return "playing";
  }

  hasLegalMoves(): boolean {
    // Check all white pieces for possible moves
    for (const [square, piece] of this.position.entries()) {
      if (piece === piece.toUpperCase()) {
        // Only white pieces
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

  getPiece(square: Square): string | undefined {
    return this.position.get(square);
  }

  hasWhitePawnOnEighthRank(): boolean {
    // Check if there's a white pawn or promoted piece on the 8th rank
    for (let file = 0; file < 8; file++) {
      const square = this.algebraic(file, 7); // 8th rank (index 7)
      const piece = this.position.get(square);
      if (piece && piece === piece.toUpperCase() && piece !== "K") {
        // Any white piece (except king) on 8th rank means promotion occurred
        return true;
      }
    }
    return false;
  }
}
