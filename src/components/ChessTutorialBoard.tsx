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
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);

  const currentTurn = game.fen().split(" ")[1];
  const turnMessage = currentTurn === "w" ? "Ход белых" : "Ход черных";

  function isPawnPromotion(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    if (!piece.endsWith("P")) return false;
    const [, toRank] = targetSquare.split("");
    return (
      (piece.startsWith("w") && toRank === "8") ||
      (piece.startsWith("b") && toRank === "1")
    );
  }

  function onDrop(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    const legalMoves = game.getLegalMoves(sourceSquare);

    if (!legalMoves.includes(targetSquare)) {
      setErrorMessage("Невалидный ход");
      setTimeout(() => setErrorMessage(null), 2000);
      return false;
    }

    if (isPawnPromotion(sourceSquare, targetSquare, piece)) {
      setPendingPromotion({ from: sourceSquare, to: targetSquare });
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

  function handlePromotion(piece: PromotionPiece) {
    if (pendingPromotion) {
      const { from, to } = pendingPromotion;
      const result = game.move(from, to, piece);
      if (result) {
        const newGame = new SimplifiedChessEngine(game.fen());
        setGame(newGame);
        setPendingPromotion(null);
        setHighlightSquares([]);
        setSelectedSquare(null);

        const gameStatus = newGame.getGameStatus();
        if (gameStatus !== "playing") {
          onComplete?.(gameStatus);
        }
      }
    }
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
    <div style={{ width: "400px", margin: "0 auto", position: "relative" }}>
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

      {pendingPromotion && (
        <div
          className="promotion-modal"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <h3>Выберите фигуру для превращения:</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            {["q", "r", "n", "b"].map((piece) => (
              <button
                key={piece}
                onClick={() => handlePromotion(piece as PromotionPiece)}
                style={{ padding: "10px", cursor: "pointer" }}
              >
                {piece === "q"
                  ? "Ферзь"
                  : piece === "r"
                  ? "Ладья"
                  : piece === "n"
                  ? "Конь"
                  : "Слон"}
              </button>
            ))}
          </div>
        </div>
      )}

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
                background: "rgba(0, 255, 0, 0.4)",
                "::before": {
                  content: '""',
                  display: "block",
                  width: "25%",
                  height: "25%",
                  margin: "auto",
                  marginTop: "37.5%",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 255, 0, 0.4)",
                },
              },
            ])
          ),
        }}
      />
    </div>
  );
}
