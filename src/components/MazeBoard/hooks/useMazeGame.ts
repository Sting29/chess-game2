import { useState } from "react";
import { Square, PromotionPiece, MazePuzzle } from "../../../types/types";
import { MazeEngine } from "../../../utils/MazeEngine";

interface UseMazeGameProps {
  puzzle: MazePuzzle;
  onComplete?: (result: "success" | "failure") => void;
  currentTime: number | null;
}

export const useMazeGame = ({
  puzzle,
  onComplete,
  currentTime,
}: UseMazeGameProps) => {
  const [engine] = useState<MazeEngine>(() => {
    try {
      return new MazeEngine(puzzle);
    } catch (error) {
      console.error("Failed to initialize maze engine:", error);
      throw error;
    }
  });

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [promotionData, setPromotionData] = useState<{
    sourceSquare: Square;
    targetSquare: Square;
  } | null>(null);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const gameState = engine.getGameState();

  // Handle square click
  const handleSquareClick = (square: Square) => {
    const piece = gameState.position.get(square);

    // If no square is selected
    if (!selectedSquare) {
      // Only select if there's a player piece on this square
      if (piece && engine.isPlayerPiece(piece)) {
        const legalMoves = engine.getLegalMoves(square);
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

    // If clicking a valid move destination, make the move
    if (highlightSquares.includes(square)) {
      makeMove(selectedSquare, square);
      return;
    }

    // If clicking another player piece, switch selection
    if (piece && engine.isPlayerPiece(piece)) {
      const legalMoves = engine.getLegalMoves(square);
      setSelectedSquare(square);
      setHighlightSquares(legalMoves);
      return;
    }

    // If clicking on invalid square, deselect current piece
    setSelectedSquare(null);
    setHighlightSquares([]);
  };

  // Make a move
  const makeMove = (from: Square, to: Square, promotion?: PromotionPiece) => {
    // Check if this is a promotion move
    if (!promotion && engine.isPromotionMove(from, to)) {
      setPromotionData({ sourceSquare: from, targetSquare: to });
      return;
    }

    const result = engine.makeMove(from, to, promotion);

    if (result.success) {
      // Update the existing engine state
      if (currentTime !== null) {
        engine.updateRemainingTime(currentTime);
      }

      // Force re-render by incrementing the render trigger
      setRenderTrigger((prev) => prev + 1);

      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.gameComplete) {
        onComplete?.("success");
      } else if (result.gameFailed) {
        onComplete?.("failure");
      }
    } else {
      setErrorMessage("Invalid move");
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  // Handle promotion selection
  const handlePromotionSelection = (promotionPiece: PromotionPiece) => {
    if (!promotionData) return;

    const { sourceSquare, targetSquare } = promotionData;
    makeMove(sourceSquare, targetSquare, promotionPiece);
    setPromotionData(null);
  };

  return {
    engine,
    gameState,
    selectedSquare,
    highlightSquares,
    errorMessage,
    promotionData,
    renderTrigger,
    setSelectedSquare,
    setHighlightSquares,
    setPromotionData,
    handleSquareClick,
    makeMove,
    handlePromotionSelection,
  };
};
