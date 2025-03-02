import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Square, PromotionPiece } from "../types/types";
import { SimplifiedChessEngine } from "../utils/SimplifiedChessEngine";
interface ChessTutorialBoardProps {
  initialPosition: string;
  onCapture?: (square: Square) => void;
  onComplete?: (gameStatus: "white_wins" | "draw") => void;
}

export function ChessTutorialBoard({
  initialPosition,
  onCapture,
  onComplete,
}: ChessTutorialBoardProps) {
  const [game, setGame] = useState<SimplifiedChessEngine>(
    new SimplifiedChessEngine(initialPosition)
  );
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<
    "playing" | "white_wins" | "draw"
  >("playing");

  const currentTurn = game.fen().split(" ")[1];
  let turnMessage = currentTurn === "w" ? "Ход белых" : "Ход черных";

  // Изменяем сообщение в зависимости от статуса игры
  if (gameStatus === "white_wins") {
    turnMessage = "Победа белых! Все черные фигуры побиты";
  } else if (gameStatus === "draw") {
    turnMessage = "Ничья! Нет больше возможных ходов";
  }

  function onPromotionCheck(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    if (!piece.endsWith("P")) return false;
    const [, toRank] = targetSquare.split("");
    return toRank === "8";
  }

  function onPromotionPieceSelect(
    promotionPiece?: string,
    sourceSquare?: Square,
    targetSquare?: Square
  ): boolean {
    if (!promotionPiece || !sourceSquare || !targetSquare) return false;

    const piece = promotionPiece.charAt(1).toLowerCase() as PromotionPiece;

    const result = game.move(sourceSquare, targetSquare, piece);
    if (result) {
      const newFen = game.fen();

      const newGame = new SimplifiedChessEngine(newFen);
      setGame(newGame);

      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.captured) {
        onCapture?.(targetSquare);
      }

      const newGameStatus = newGame.getGameStatus();
      setGameStatus(newGameStatus);
      if (newGameStatus !== "playing") {
        onComplete?.(newGameStatus);
      }
      return true;
    }
    return false;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    const result = game.move(sourceSquare, targetSquare);

    if (result) {
      const newGame = new SimplifiedChessEngine(game.fen());
      setGame(newGame);
      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.captured) {
        onCapture?.(targetSquare);
      }

      const newGameStatus = newGame.getGameStatus();
      setGameStatus(newGameStatus);
      if (newGameStatus !== "playing") {
        onComplete?.(newGameStatus);
      }
      return true;
    }

    setErrorMessage("Невалидный ход");
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
        {errorMessage ? `${turnMessage} - ${errorMessage}` : turnMessage}
      </div>

      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        onPromotionCheck={onPromotionCheck} // TODO: remove not needed
        onPromotionPieceSelect={onPromotionPieceSelect}
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
