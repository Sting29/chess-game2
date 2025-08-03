import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Square, PromotionPiece } from "../../types/types";
import { PuzzleChessEngine } from "../../utils/PuzzleChessEngine";
import { useCustomPieces } from "../CustomPieces/CustomPieces";
import { boardStyles } from "src/data/boardSettings";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";

interface ChessPuzzleBoardProps {
  initialPosition: string;
  correctMoves: Array<{
    from: string;
    to: string;
    piece: string;
    isComputerMove?: boolean;
  }>;
  onComplete?: (result: "success" | "failure") => void;
  playerColor: "w" | "b";
}

export function ChessPuzzleBoard({
  initialPosition,
  correctMoves,
  onComplete,
  playerColor,
}: ChessPuzzleBoardProps) {
  const [game, setGame] = useState<PuzzleChessEngine>(
    new PuzzleChessEngine(initialPosition, correctMoves)
  );
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);
  const [promotionData, setPromotionData] = useState<{
    sourceSquare: Square;
    targetSquare: Square;
  } | null>(null);

  const currentTurn = game.fen().split(" ")[1];
  let turnMessage = currentTurn === "w" ? "White's move" : "Black's move";

  if (game.isPuzzleComplete()) {
    turnMessage = "Puzzle solved!";
  } else if (game.isPuzzleFailed()) {
    turnMessage = "Wrong solution. Try again!";
  }

  function isPromotionMove(
    sourceSquare: Square,
    targetSquare: Square
  ): boolean {
    // Get the piece from the source square
    const fen = game.fen();
    const position = fen.split(" ")[0];
    
    // Parse FEN to find the piece at source square
    let piece = "";
    let rank = 7;
    let file = 0;

    for (const char of position) {
      if (char === "/") {
        rank--;
        file = 0;
      } else if (/\d/.test(char)) {
        file += parseInt(char);
      } else {
        const square = `${"abcdefgh"[file]}${rank + 1}`;
        if (square === sourceSquare) {
          piece = char;
          break;
        }
        file++;
      }
    }

    // Check if piece is a pawn
    if (piece.toLowerCase() !== "p") return false;

    // Check if pawn reaches promotion rank
    const [, toRank] = targetSquare.split("");
    return toRank === "8" || toRank === "1";
  }

  function handlePromotionSelection(promotionPiece: PromotionPiece) {
    if (!promotionData) return;

    const { sourceSquare, targetSquare } = promotionData;
    const result = game.makeMove(sourceSquare, targetSquare, promotionPiece);

    if (result.success) {
      const newGame = new PuzzleChessEngine(
        game.fen(),
        correctMoves,
        game.getCurrentMoveIndex()
      );
      setGame(newGame);
      setHighlightSquares([]);
      setSelectedSquare(null);
      setPromotionData(null);

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
    } else {
      setPromotionData(null);
      setErrorMessage("Invalid promotion move");
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    // Check if this is a promotion move
    if (isPromotionMove(sourceSquare, targetSquare)) {
      setPromotionData({ sourceSquare, targetSquare });
      return true;
    }

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
    // If no square is selected, select this square and show legal moves
    if (!selectedSquare) {
      const legalMoves = game.getLegalMoves(square);
      if (legalMoves.length > 0) {
        setSelectedSquare(square);
        setHighlightSquares(legalMoves);
      }
      return;
    }

    // If clicking the same square, deselect
    if (square === selectedSquare) {
      setSelectedSquare(null);
      setHighlightSquares([]);
      return;
    }

    // If clicking a highlighted square, make the move
    if (highlightSquares.includes(square)) {
      // Check if this is a promotion move
      if (isPromotionMove(selectedSquare, square)) {
        setPromotionData({
          sourceSquare: selectedSquare,
          targetSquare: square,
        });
        return;
      }

      // Make normal move
      const result = game.makeMove(selectedSquare, square);
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
      } else {
        setErrorMessage("Invalid move");
        setTimeout(() => setErrorMessage(null), 2000);
      }
    } else {
      // If clicking a different square, select it if it has legal moves
      const legalMoves = game.getLegalMoves(square);
      if (legalMoves.length > 0) {
        setSelectedSquare(square);
        setHighlightSquares(legalMoves);
      } else {
        setSelectedSquare(null);
        setHighlightSquares([]);
      }
    }
  }

  function onMouseOverSquare({ square }: { square: string }) {
    setHoveredSquare(square as Square);
  }

  function onMouseOutSquare() {
    setHoveredSquare(null);
  }

  const customPieces = useCustomPieces();

  return (
    <BoardContainer>
      <GameStatus>{errorMessage || turnMessage}</GameStatus>

      <Chessboard
        options={{
          position: game.fen(),
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            targetSquare ? onDrop(sourceSquare, targetSquare) : false,
          onSquareClick: ({ square }) => onSquareClick(square as Square),
          onMouseOverSquare: onMouseOverSquare,
          onMouseOutSquare: onMouseOutSquare,
          ...boardStyles,
          squareStyles: {
            ...(selectedSquare && {
              [selectedSquare]: { background: "rgba(255, 255, 0, 0.4)" },
            }),
            ...(hoveredSquare &&
              hoveredSquare !== selectedSquare && {
                [hoveredSquare]: { background: "rgba(200, 200, 200, 0.3)" },
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
          },
          pieces: customPieces,
          boardOrientation: playerColor === "w" ? "white" : "black",
        }}
      />

      <PromotionDialog
        isOpen={!!promotionData}
        onSelect={handlePromotionSelection}
        onClose={() => setPromotionData(null)}
      />
    </BoardContainer>
  );
}
