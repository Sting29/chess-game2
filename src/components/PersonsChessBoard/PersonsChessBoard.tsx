import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Square } from "chess.js";
import { PersonsChessEngine } from "../../utils/PersonsChessEngine";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
import { useCustomPieces } from "../CustomPieces/CustomPieces";
import { boardStyles } from "src/data/boardSettings";
interface PersonsChessBoardProps {
  onGameEnd?: (result: string) => void;
}

export function PersonsChessBoard({ onGameEnd }: PersonsChessBoardProps) {
  const [game, setGame] = useState<PersonsChessEngine>(
    new PersonsChessEngine()
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);

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
    </BoardContainer>
  );
}
