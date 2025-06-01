import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Square, PromotionPiece } from "../types/types";
import { BattleChessEngine } from "../utils/BattleChessEngine";
import { useCustomPieces } from "./CustomPieces/CustomPieces";

interface ChessBattleBoardProps {
  initialPosition: string;
  onCapture?: (square: Square) => void;
  onComplete?: (
    result: "playing" | "white_wins" | "black_wins" | "draw"
  ) => void;
  rulesOfWin?: "promotion" | "noFiguresLeft";
}

export function ChessBattleBoard({
  initialPosition,
  onCapture,
  onComplete,
  rulesOfWin = "noFiguresLeft",
}: ChessBattleBoardProps) {
  const [game, setGame] = useState<BattleChessEngine>(
    new BattleChessEngine(initialPosition, rulesOfWin)
  );
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<
    "playing" | "white_wins" | "black_wins" | "draw"
  >("playing");

  const currentTurn = game.fen().split(" ")[1];
  let turnMessage = currentTurn === "w" ? "White's move" : "Black's move";

  if (gameStatus === "white_wins") {
    turnMessage = "White wins!";
  } else if (gameStatus === "black_wins") {
    turnMessage = "Black wins!";
  } else if (gameStatus === "draw") {
    turnMessage = "Draw!";
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
      setGame(
        Object.create(
          Object.getPrototypeOf(game),
          Object.getOwnPropertyDescriptors(game)
        )
      );

      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.captured) {
        onCapture?.(targetSquare);
      }

      const newGameStatus = game.getGameStatus();
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
      setGame(
        Object.create(
          Object.getPrototypeOf(game),
          Object.getOwnPropertyDescriptors(game)
        )
      );
      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.captured) {
        onCapture?.(targetSquare);
      }

      const newGameStatus = game.getGameStatus();
      setGameStatus(newGameStatus);
      if (newGameStatus !== "playing") {
        onComplete?.(newGameStatus);
      }
      return true;
    }

    setErrorMessage("Invalid move");
    setTimeout(() => setErrorMessage(null), 500);
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

  const customPieces = useCustomPieces();

  // Функция для хода компьютера (черные)
  function makeComputerMove(currentGame: BattleChessEngine) {
    // Сначала ищем все возможные ходы для черных пешек
    const promotionMoves: { from: Square; to: Square }[] = [];
    const captureMoves: { from: Square; to: Square }[] = [];
    const normalMoves: { from: Square; to: Square }[] = [];
    for (const file of "abcdefgh") {
      for (let rank = 1; rank <= 8; rank++) {
        const square = `${file}${rank}` as Square;
        const piece = (currentGame as any).position?.get(square);
        if (
          piece &&
          piece === piece.toLowerCase() &&
          piece.toLowerCase() === "p"
        ) {
          // только черные пешки
          const legalMoves = currentGame.getLegalMoves(square);
          for (const to of legalMoves) {
            const targetPiece = (currentGame as any).position?.get(to);
            const isPromotion = to[1] === "1";
            if (isPromotion) {
              promotionMoves.push({ from: square, to });
            } else if (
              targetPiece &&
              targetPiece !== targetPiece.toLowerCase()
            ) {
              // Это взятие
              captureMoves.push({ from: square, to });
            } else if (!targetPiece) {
              // Обычный ход
              normalMoves.push({ from: square, to });
            }
          }
        }
      }
    }
    let move: { from: Square; to: Square } | undefined;
    let promotion: "q" | undefined = undefined;
    if (promotionMoves.length > 0) {
      // Если есть ход с промоушеном — делаем его и всегда превращаем в ферзя
      move = promotionMoves[Math.floor(Math.random() * promotionMoves.length)];
      promotion = "q";
    } else if (captureMoves.length > 0) {
      // Если есть взятия — выбираем их
      move = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    } else if (normalMoves.length > 0) {
      // Если нет взятий — обычный ход
      move = normalMoves[Math.floor(Math.random() * normalMoves.length)];
    } else {
      return;
    }
    const result = currentGame.move(move.from, move.to, promotion);
    if (result) {
      setGame(
        Object.create(
          Object.getPrototypeOf(currentGame),
          Object.getOwnPropertyDescriptors(currentGame)
        )
      );
      setHighlightSquares([]);
      setSelectedSquare(null);
      if (result.captured) {
        onCapture?.(move.to);
      }
      const newGameStatus = currentGame.getGameStatus();
      setGameStatus(newGameStatus);
      if (newGameStatus !== "playing") {
        onComplete?.(newGameStatus);
      }
    }
  }

  // useEffect для автоматического хода компьютера
  useEffect(() => {
    if (gameStatus !== "playing") return;
    const currentTurn = game.fen().split(" ")[1];
    if (currentTurn === "b") {
      setTimeout(() => makeComputerMove(game), 500);
    }
    // eslint-disable-next-line
  }, [game, gameStatus]);

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
        customPieces={customPieces}
      />
    </div>
  );
}
