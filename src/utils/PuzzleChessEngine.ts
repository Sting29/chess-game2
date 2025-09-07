import { Square, PromotionPiece } from "../types/types";

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
    to: Square,
    promotion?: PromotionPiece
  ): { success: boolean; puzzleComplete?: boolean; computerMove?: boolean } {
    const expectedMove = this.correctMoves[this.currentMoveIndex];

    if (expectedMove.isComputerMove) {
      return { success: false };
    }

    // Check if move matches expected move
    if (
      from === expectedMove.from &&
      to === expectedMove.to &&
      this.position.get(from) === expectedMove.piece
    ) {
      // Handle promotion moves
      let finalPiece = expectedMove.piece;
      if (promotion && this.isPromotionMove(from, to, expectedMove.piece)) {
        // Convert promotion piece to correct color
        const isWhite = expectedMove.piece === expectedMove.piece.toUpperCase();
        finalPiece = isWhite
          ? promotion.toUpperCase()
          : promotion.toLowerCase();
      }

      // Execute the move
      this.position.delete(from);
      this.position.set(to, finalPiece);
      this.currentMoveIndex++;
      this.turn = this.turn === "w" ? "b" : "w";

      const nextMove = this.correctMoves[this.currentMoveIndex];
      return {
        success: true,
        puzzleComplete: this.currentMoveIndex >= this.correctMoves.length,
        computerMove: nextMove?.isComputerMove,
      };
    }

    // Move is incorrect
    this.puzzleFailed = true;
    return { success: false };
  }

  makeComputerMove(): { success: boolean } {
    const computerMove = this.correctMoves[this.currentMoveIndex];
    if (!computerMove?.isComputerMove) {
      return { success: false };
    }

    // For computer moves, use the piece specified in correctMoves
    // (which should already include promotion if needed)
    this.position.delete(computerMove.from);
    this.position.set(computerMove.to, computerMove.piece);
    this.currentMoveIndex++;
    this.turn = this.turn === "w" ? "b" : "w";

    return { success: true };
  }

  getLegalMoves(square: Square): Square[] {
    const piece = this.position.get(square);
    if (!piece) return [];

    // Check if it's the correct player's turn
    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (this.turn === "w" && !isWhitePiece) ||
      (this.turn === "b" && isWhitePiece)
    ) {
      return [];
    }

    return this.getPieceMoves(square);
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

  private getPieceMoves(from: Square): Square[] {
    const piece = this.position.get(from);
    if (!piece) return [];

    const [fromFile, fromRank] = this.parseSquare(from);
    const moves: Square[] = [];
    const isWhite = piece === piece.toUpperCase();

    switch (piece.toLowerCase()) {
      case "p": // Pawn
        const direction = isWhite ? 1 : -1;
        const startRank = isWhite ? 1 : 6;

        // Move forward
        const oneStep = this.algebraic(fromFile, fromRank + direction);
        if (oneStep && !this.position.has(oneStep)) {
          moves.push(oneStep);

          // Two squares from starting position
          if (fromRank === startRank) {
            const twoStep = this.algebraic(fromFile, fromRank + 2 * direction);
            if (twoStep && !this.position.has(twoStep)) {
              moves.push(twoStep);
            }
          }
        }

        // Diagonal captures
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

      case "r": // Rook
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

      case "b": // Bishop
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

      case "q": // Queen (combination of rook and bishop)
        // Straight moves (like rook)
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

        // Diagonal moves (like bishop)
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

      case "k": // King
        for (const [fileOffset, rankOffset] of [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]) {
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
    }

    return moves.filter((move) => move !== "");
  }

  private parseSquare(square: Square): [number, number] {
    const file = square.charCodeAt(0) - "a".charCodeAt(0);
    const rank = parseInt(square[1]) - 1;
    return [file, rank];
  }

  private isPromotionMove(from: Square, to: Square, piece: string): boolean {
    // Check if piece is a pawn
    if (piece.toLowerCase() !== "p") return false;

    // Check if pawn reaches promotion rank
    const [, toRank] = to.split("");
    return toRank === "8" || toRank === "1";
  }

  private algebraic(file: number, rank: number): Square {
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      return `${"abcdefgh"[file]}${rank + 1}` as Square;
    }
    return "" as Square;
  }
}
