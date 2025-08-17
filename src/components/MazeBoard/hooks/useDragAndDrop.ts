import { useState } from "react";
import { Square } from "../../../types/types";
import { MazeEngine } from "../../../utils/MazeEngine";

interface UseDragAndDropProps {
  engine: MazeEngine;
  onMove: (from: Square, to: Square) => void;
  setHighlightSquares: (squares: Square[]) => void;
  setSelectedSquare: (square: Square | null) => void;
}

export const useDragAndDrop = ({
  engine,
  onMove,
  setHighlightSquares,
  setSelectedSquare,
}: UseDragAndDropProps) => {
  const [draggedPiece, setDraggedPiece] = useState<{
    square: Square;
    piece: string;
  } | null>(null);

  const getPieceOnSquare = (square: Square) => {
    return engine.getGameState().position.get(square);
  };

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    const piece = getPieceOnSquare(square);
    if (piece) {
      setDraggedPiece({ square, piece });
      e.dataTransfer.effectAllowed = "move";

      // Show legal moves when dragging starts
      const legalMoves = engine.getLegalMoves(square);
      setHighlightSquares(legalMoves);
      setSelectedSquare(square);
    }
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    setHighlightSquares([]);
    setSelectedSquare(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (draggedPiece) {
      onMove(draggedPiece.square, targetSquare);
    }
  };

  return {
    draggedPiece,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
