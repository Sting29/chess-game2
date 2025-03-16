import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Square } from "../types/types";
import { PuzzleChessEngine } from "../utils/PuzzleChessEngine";

interface ChessPuzzleBoardProps {
  initialPosition: string;
  correctMoves: Array<{
    from: string;
    to: string;
    piece: string;
    isComputerMove?: boolean;
  }>;
  onComplete?: (result: "success" | "failure") => void;
}

export function ChessPuzzleBoard({
  initialPosition,
  correctMoves,
  onComplete,
}: ChessPuzzleBoardProps) {
  const [game, setGame] = useState<PuzzleChessEngine>(
    new PuzzleChessEngine(initialPosition, correctMoves)
  );
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentTurn = game.fen().split(" ")[1];
  let turnMessage = currentTurn === "w" ? "White's move" : "Black's move";

  if (game.isPuzzleComplete()) {
    turnMessage = "Puzzle solved!";
  } else if (game.isPuzzleFailed()) {
    turnMessage = "Wrong solution. Try again!";
  }

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    const result = game.makeMove(sourceSquare, targetSquare);

    if (result.success) {
      const newGame = new PuzzleChessEngine(
        game.fen(),
        correctMoves,
        game.getCurrentMoveIndex()
      );
      setGame(newGame);
      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.puzzleComplete) {
        onComplete?.("success");
      } else if (result.computerMove) {
        // Make computer move after a short delay
        setTimeout(() => {
          const computerResult = newGame.makeComputerMove();
          if (computerResult.success) {
            setGame(
              new PuzzleChessEngine(
                newGame.fen(),
                correctMoves,
                newGame.getCurrentMoveIndex()
              )
            );
          }
        }, 500);
      }
      return true;
    }

    setErrorMessage("Invalid move");
    setTimeout(() => setErrorMessage(null), 2000);
    return false;
  }

  function onSquareClick(square: Square) {
    const legalMoves = game.getLegalMoves(square);
    if (legalMoves.length > 0) {
      setSelectedSquare(square);
      setHighlightSquares(legalMoves);
    } else {
      setSelectedSquare(null);
      setHighlightSquares([]);
    }
  }

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <div
        className="move-message"
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
          color: errorMessage ? "red" : "black",
        }}
      >
        {errorMessage || turnMessage}
      </div>

      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        }}
        customSquareStyles={{
          ...(selectedSquare && {
            [selectedSquare]: { background: "rgba(255, 255, 0, 0.4)" },
          }),
          ...Object.fromEntries(
            highlightSquares.map((square) => [
              square,
              {
                background: game.hasPiece(square)
                  ? "radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%)"
                  : "radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%)",
                borderRadius: "50%",
              },
            ])
          ),
        }}
      />
    </div>
  );
}
