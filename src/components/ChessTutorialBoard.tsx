import { useState } from "react";
import { Chessboard } from "react-chessboard";
import {
  SimplifiedChessEngine,
  Square,
  PromotionPiece,
} from "../utils/SimplifiedChessEngine";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const currentTurn = game.fen().split(" ")[1];
  const turnMessage = currentTurn === "w" ? "Ход белых" : "Ход черных";

  function onPromotionCheck(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    if (!piece.endsWith("P")) return false;
    console.log("onPromotionCheck", sourceSquare, targetSquare, piece);
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

    console.log(
      "Promoting to:",
      piece,
      "from:",
      sourceSquare,
      "to:",
      targetSquare
    );

    const result = game.move(sourceSquare, targetSquare, piece);
    if (result) {
      const newFen = game.fen();
      console.log("New FEN after promotion:", newFen);

      const newGame = new SimplifiedChessEngine(newFen);
      setGame(newGame);

      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.captured) {
        onCapture?.(targetSquare);
      }

      const gameStatus = newGame.getGameStatus();
      if (gameStatus !== "playing") {
        onComplete?.(gameStatus);
      }
      return true;
    }
    return false;
  }

  function onDrop(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    if (onPromotionCheck(sourceSquare, targetSquare, piece)) {
      return false;
    }

    const legalMoves = game.getLegalMoves(sourceSquare);

    if (!legalMoves.includes(targetSquare)) {
      setErrorMessage("Невалидный ход");
      setTimeout(() => setErrorMessage(null), 2000);
      return false;
    }

    const result = game.move(sourceSquare, targetSquare);

    if (result) {
      const newGame = new SimplifiedChessEngine(game.fen());
      setGame(newGame);
      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.captured) {
        onCapture?.(targetSquare);
      }

      const gameStatus = newGame.getGameStatus();
      if (gameStatus !== "playing") {
        onComplete?.(gameStatus);
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
