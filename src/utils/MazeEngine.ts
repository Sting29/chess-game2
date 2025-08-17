import {
  Square,
  MazePuzzle,
  MazeGameState,
  MoveResult,
  PromotionPiece,
} from "../types/types";

export class MazeEngine {
  private gameState: MazeGameState;
  private puzzle: MazePuzzle;

  constructor(puzzle: MazePuzzle) {
    try {
      this.puzzle = puzzle;
      this.gameState = this.initializeGameState(puzzle.initialPosition);
    } catch (error) {
      console.error("Failed to initialize MazeEngine:", error);
      throw new Error("Invalid puzzle configuration");
    }
  }

  private initializeGameState(initialPosition: string): MazeGameState {
    const gameState: MazeGameState = {
      position: new Map(),
      playerPiece: { square: "" as Square, type: "" },
      walls: new Set(),
      exits: new Set(),
      checkpoints: new Set(),
      visitedCheckpoints: new Set(),
      remainingMoves: this.puzzle.maxMoves,
      remainingTime: this.puzzle.timeLimit,
      gameStatus: "playing",
      turn: "w",
    };

    this.parseFenLikePosition(initialPosition, gameState);
    return gameState;
  }

  private parseFenLikePosition(position: string, gameState: MazeGameState) {
    try {
      const parts = position.split(" ");
      if (parts.length < 2) {
        throw new Error("Invalid FEN-like position format");
      }

      const [boardPosition, turn] = parts;
      gameState.turn = turn as "w" | "b";

      let rank = 7;
      let file = 0;
      let playerPieceFound = false;

      for (const char of boardPosition) {
        if (char === "/") {
          rank--;
          file = 0;
          if (rank < 0) {
            throw new Error("Invalid board position: too many ranks");
          }
        } else if (/\d/.test(char)) {
          file += parseInt(char);
          if (file > 8) {
            throw new Error("Invalid board position: file overflow");
          }
        } else {
          const square = this.algebraic(file, rank);
          if (!square) {
            throw new Error(
              `Invalid square coordinates: file=${file}, rank=${rank}`
            );
          }

          switch (char) {
            case "E":
              gameState.exits.add(square);
              break;
            case "C":
              gameState.checkpoints.add(square);
              break;
            case "W":
              gameState.walls.add(square);
              break;
            default:
              // Chess piece
              if (playerPieceFound) {
                throw new Error("Multiple player pieces found in maze");
              }
              gameState.position.set(square, char);
              gameState.playerPiece = { square, type: char };
              playerPieceFound = true;
              break;
          }
          file++;
        }
      }

      if (!playerPieceFound) {
        throw new Error("No player piece found in maze");
      }

      if (gameState.exits.size === 0) {
        throw new Error("No exits found in maze");
      }

      // Validate that player piece is not on checkpoint or exit
      if (gameState.checkpoints.has(gameState.playerPiece.square)) {
        throw new Error("Player piece cannot start on a checkpoint");
      }

      if (gameState.exits.has(gameState.playerPiece.square)) {
        throw new Error("Player piece cannot start on an exit");
      }
    } catch (error) {
      console.error("Error parsing FEN-like position:", error);
      throw error;
    }
  }

  private algebraic(file: number, rank: number): Square {
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      return `${"abcdefgh"[file]}${rank + 1}` as Square;
    }
    return "" as Square;
  }

  isValidMove(from: Square, to: Square): boolean {
    // Check if move is within board bounds
    if (!this.isValidSquare(to)) return false;

    // Cannot move to walls
    if (this.isWall(to)) return false;

    // Must be player's piece
    if (from !== this.gameState.playerPiece.square) return false;

    // Check chess piece movement rules
    return this.isValidPieceMove(from, to, this.gameState.playerPiece.type);
  }

  private isValidSquare(square: Square): boolean {
    const file = square.charCodeAt(0) - 97; // 'a' = 97
    const rank = parseInt(square[1]) - 1;
    return file >= 0 && file < 8 && rank >= 0 && rank < 8;
  }

  private isValidPieceMove(from: Square, to: Square, piece: string): boolean {
    const fromFile = from.charCodeAt(0) - 97;
    const fromRank = parseInt(from[1]) - 1;
    const toFile = to.charCodeAt(0) - 97;
    const toRank = parseInt(to[1]) - 1;

    const deltaFile = Math.abs(toFile - fromFile);
    const deltaRank = Math.abs(toRank - fromRank);
    const fileDirection = toFile > fromFile ? 1 : toFile < fromFile ? -1 : 0;
    const rankDirection = toRank > fromRank ? 1 : toRank < fromRank ? -1 : 0;

    const pieceType = piece.toLowerCase();

    switch (pieceType) {
      case "r": // Rook
        if (deltaFile === 0 || deltaRank === 0) {
          return this.isPathClear(from, to, fileDirection, rankDirection);
        }
        return false;

      case "n": // Knight
        return (
          (deltaFile === 2 && deltaRank === 1) ||
          (deltaFile === 1 && deltaRank === 2)
        );

      case "b": // Bishop
        if (deltaFile === deltaRank) {
          return this.isPathClear(from, to, fileDirection, rankDirection);
        }
        return false;

      case "q": // Queen
        if (deltaFile === 0 || deltaRank === 0 || deltaFile === deltaRank) {
          return this.isPathClear(from, to, fileDirection, rankDirection);
        }
        return false;

      case "k": // King
        return deltaFile <= 1 && deltaRank <= 1;

      case "p": // Pawn
        const isWhite = piece === piece.toUpperCase();
        const direction = isWhite ? 1 : -1;

        // Forward move
        if (
          fileDirection === 0 &&
          rankDirection === direction &&
          deltaRank === 1
        ) {
          return true;
        }

        // Diagonal move (for checkpoints)
        if (deltaFile === 1 && rankDirection === direction && deltaRank === 1) {
          return this.isCheckpoint(to);
        }

        return false;

      default:
        return false;
    }
  }

  private isPathClear(
    from: Square,
    to: Square,
    fileDirection: number,
    rankDirection: number
  ): boolean {
    const fromFile = from.charCodeAt(0) - 97;
    const fromRank = parseInt(from[1]) - 1;
    const toFile = to.charCodeAt(0) - 97;
    const toRank = parseInt(to[1]) - 1;

    let currentFile = fromFile + fileDirection;
    let currentRank = fromRank + rankDirection;

    while (currentFile !== toFile || currentRank !== toRank) {
      const currentSquare = this.algebraic(currentFile, currentRank);
      if (this.isWall(currentSquare)) {
        return false;
      }
      currentFile += fileDirection;
      currentRank += rankDirection;
    }

    return true;
  }

  getLegalMoves(square: Square): Square[] {
    if (square !== this.gameState.playerPiece.square) {
      return [];
    }

    const legalMoves: Square[] = [];

    // Check all possible squares on the board
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const targetSquare = this.algebraic(file, rank);
        if (this.isValidMove(square, targetSquare)) {
          legalMoves.push(targetSquare);
        }
      }
    }

    return legalMoves;
  }

  makeMove(from: Square, to: Square, promotion?: PromotionPiece): MoveResult {
    if (!this.isValidMove(from, to)) {
      return { success: false };
    }

    // Handle checkpoint visit
    let checkpointVisited = false;
    if (this.isCheckpoint(to)) {
      this.gameState.checkpoints.delete(to);
      this.gameState.visitedCheckpoints.add(to);
      checkpointVisited = true;
    }

    // Check for pawn promotion before moving the piece
    const isPromotion = promotion && this.isPromotionMove(from, to);

    // Move the piece
    this.gameState.position.delete(from);
    let pieceToPlace = this.gameState.playerPiece.type;

    // Handle pawn promotion
    if (isPromotion) {
      const isWhite =
        this.gameState.playerPiece.type ===
        this.gameState.playerPiece.type.toUpperCase();
      pieceToPlace = isWhite
        ? promotion.toUpperCase()
        : promotion.toLowerCase();
    }

    this.gameState.position.set(to, pieceToPlace);
    this.gameState.playerPiece = { square: to, type: pieceToPlace };

    // Update move count
    if (this.gameState.remainingMoves !== undefined) {
      this.gameState.remainingMoves--;
    }

    // Check win condition
    if (this.areExitsActive() && this.isExit(to)) {
      this.gameState.gameStatus = "won";
      return {
        success: true,
        gameComplete: true,
        checkpointVisited,
        remainingCheckpoints: this.gameState.checkpoints.size,
      };
    }

    // Check lose conditions
    if (this.gameState.remainingMoves === 0) {
      this.gameState.gameStatus = "lost";
      return { success: true, gameFailed: true };
    }

    if (this.getLegalMoves(to).length === 0) {
      this.gameState.gameStatus = "lost";
      return { success: true, gameFailed: true };
    }

    return {
      success: true,
      checkpointVisited,
      remainingCheckpoints: this.gameState.checkpoints.size,
    };
  }

  isWall(square: Square): boolean {
    return this.gameState.walls.has(square);
  }

  isExit(square: Square): boolean {
    return this.gameState.exits.has(square);
  }

  isCheckpoint(square: Square): boolean {
    return this.gameState.checkpoints.has(square);
  }

  areExitsActive(): boolean {
    return this.gameState.checkpoints.size === 0;
  }

  isGameComplete(): boolean {
    return this.gameState.gameStatus === "won";
  }

  isGameFailed(): boolean {
    return this.gameState.gameStatus === "lost";
  }

  getRemainingCheckpoints(): number {
    return this.gameState.checkpoints.size;
  }

  getRemainingMoves(): number | null {
    return this.gameState.remainingMoves ?? null;
  }

  getRemainingTime(): number | null {
    return this.gameState.remainingTime ?? null;
  }

  updateRemainingTime(time: number): void {
    this.gameState.remainingTime = time;
    if (time <= 0) {
      this.gameState.gameStatus = "lost";
    }
  }

  fen(): string {
    let fen = "";
    for (let rank = 7; rank >= 0; rank--) {
      let empty = 0;
      for (let file = 0; file < 8; file++) {
        const square = this.algebraic(file, rank);

        if (this.isWall(square)) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += "W";
        } else if (this.isExit(square)) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += "E";
        } else if (this.isCheckpoint(square)) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += "C";
        } else if (this.gameState.position.has(square)) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += this.gameState.position.get(square);
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

    return `${fen} ${this.gameState.turn} - - 0 1`;
  }

  isPromotionMove(from: Square, to: Square): boolean {
    const piece = this.gameState.position.get(from);
    if (!piece || piece.toLowerCase() !== "p") return false;

    const toRank = parseInt(to[1]);
    return toRank === 8 || toRank === 1;
  }

  canPromote(square: Square): boolean {
    const piece = this.gameState.position.get(square);
    if (!piece || piece.toLowerCase() !== "p") return false;

    const rank = parseInt(square[1]);
    const isWhite = piece === piece.toUpperCase();

    // White pawns promote on rank 8, black pawns on rank 1
    return (isWhite && rank === 7) || (!isWhite && rank === 2);
  }

  getPromotionSquares(from: Square): Square[] {
    const piece = this.gameState.position.get(from);
    if (!piece || piece.toLowerCase() !== "p") return [];

    const promotionSquares: Square[] = [];
    const legalMoves = this.getLegalMoves(from);

    for (const move of legalMoves) {
      if (this.isPromotionMove(from, move)) {
        promotionSquares.push(move);
      }
    }

    return promotionSquares;
  }

  getGameState(): MazeGameState {
    return { ...this.gameState };
  }

  isPlayerPiece(piece: string): boolean {
    // In maze puzzles, the player controls the piece that matches the current turn
    // White pieces are uppercase, black pieces are lowercase
    if (this.gameState.turn === "w") {
      return piece === piece.toUpperCase();
    } else {
      return piece === piece.toLowerCase();
    }
  }
}
