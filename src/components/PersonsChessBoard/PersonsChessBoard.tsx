import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Square } from "chess.js";
import { PersonsChessEngine } from "../../utils/PersonsChessEngine";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
import { useCustomPieces } from "../CustomPieces/CustomPieces";
import { boardStyles } from "src/data/boardSettings";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";
import { PromotionPiece } from "../../types/types";
interface PersonsChessBoardProps {
  onGameEnd?: (result: string) => void;
}

export function PersonsChessBoard({ onGameEnd }: PersonsChessBoardProps) {
  const [game, setGame] = useState<PersonsChessEngine>(
    new PersonsChessEngine()
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [promotionData, setPromotionData] = useState<{
    sourceSquare: Square;
    targetSquare: Square;
  } | null>(null);

  function handlePromotionSelection(promotionPiece: PromotionPiece) {
    if (!promotionData) return;

    const { sourceSquare, targetSquare } = promotionData;
    const result = game.move(sourceSquare, targetSquare, promotionPiece);

    if (result.valid) {
      setGame(new PersonsChessEngine(game.fen()));
      if (result.gameOver) {
        onGameEnd?.(game.getGameStatus());
      }
    }

    setPromotionData(null);
    setSelectedSquare(null);
    setHighlightSquares([]);
  }

  function onSquareClick(square: Square) {
    if (!selectedSquare) {
      const pieceColor = game.getPieceColor(square);
      if (pieceColor === game.turn()) {
        const moves = game.getLegalMoves(square);
        if (moves.length > 0) {
          setSelectedSquare(square);
          setHighlightSquares(moves);
        }
      }
      return;
    }

    if (highlightSquares.includes(square)) {
      // Check if this is a promotion move
      if (game.isPromotionMove(selectedSquare, square)) {
        setPromotionData({
          sourceSquare: selectedSquare,
          targetSquare: square,
        });
        return;
      }

      // Make normal move
      const result = game.move(selectedSquare, square);
      if (result.valid) {
        setGame(new PersonsChessEngine(game.fen()));

        if (result.gameOver) {
          onGameEnd?.(game.getGameStatus());
        }
      }
    }

    setSelectedSquare(null);
    setHighlightSquares([]);
  }

  function onPieceDrop(sourceSquare: Square, targetSquare: Square) {
    // Check if this is a promotion move
    if (game.isPromotionMove(sourceSquare, targetSquare)) {
      setPromotionData({ sourceSquare, targetSquare });
      return true;
    }

    const result = game.move(sourceSquare, targetSquare);

    if (result.valid) {
      setGame(new PersonsChessEngine(game.fen()));
      if (result.gameOver) {
        onGameEnd?.(game.getGameStatus());
      }
      setSelectedSquare(null);
      setHighlightSquares([]);
      return true;
    }
    return false;
  }

  const customPieces = useCustomPieces();

  return (
    <BoardContainer>
      <GameStatus>{game.getGameStatus()}</GameStatus>
      <Chessboard
        options={{
          position: game.fen(),
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            targetSquare
              ? onPieceDrop(sourceSquare as Square, targetSquare as Square)
              : false,
          onSquareClick: ({ square }) => onSquareClick(square as Square),
          ...boardStyles,
          squareStyles: {
            ...(selectedSquare && {
              [selectedSquare]: { background: "rgba(255, 255, 0, 0.4)" },
            }),
            ...Object.fromEntries(
              highlightSquares.map((square) => [
                square,
                {
                  background: game.getPiece(square)
                    ? "radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%)"
                    : "radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%)",
                  borderRadius: "50%",
                },
              ])
            ),
          },
          pieces: customPieces,
          showAnimations: true,
          animationDurationInMs: 300,
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
