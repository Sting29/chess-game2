import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Square } from "chess.js";
import { PersonsChessEngine } from "../../utils/PersonsChessEngine";
import { BoardContainer, GameStatus } from "./styles";
import { useCustomPieces } from "../CustomPieces/CustomPieces";
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
        game.move(selectedSquare, square);
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
        position={game.fen()}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        }}
        customDarkSquareStyle={{
          backgroundColor: "#779952",
        }}
        customLightSquareStyle={{
          backgroundColor: "#edeed1",
        }}
        customSquareStyles={{
          ...(selectedSquare && {
            [selectedSquare]: { background: "rgba(255, 255, 0, 0.4)" },
          }),
          ...Object.fromEntries(
            highlightSquares.map((square) => [
              square,
              {
                background:
                  "radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%)",
                borderRadius: "50%",
              },
            ])
          ),
        }}
        customPieces={customPieces}
      />
    </BoardContainer>
  );
}
