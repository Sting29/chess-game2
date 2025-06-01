import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Square, PromotionPiece } from "src/types/types";
import { BattleChessEngine } from "src/utils/BattleChessEngine";
import { useCustomPieces } from "src/components/CustomPieces/CustomPieces";
import { useTranslation } from "react-i18next";

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
  const [promotionSquare, setPromotionSquare] = useState<Square | null>(null);
  const [, setLastMoveType] = useState<"drop" | "click" | null>(null);
  const [lastSourceSquare, setLastSourceSquare] = useState<Square | null>(null);

  const { t } = useTranslation();

  const currentTurn = game.fen().split(" ")[1];
  let turnMessage = currentTurn === "w" ? t("white_move") : t("black_move");

  if (gameStatus === "white_wins") {
    turnMessage = t("white_wins");
  } else if (gameStatus === "black_wins") {
    turnMessage = t("black_wins");
  } else if (gameStatus === "draw") {
    turnMessage = t("draw");
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
    if (!promotionPiece || !targetSquare) return false;
    // Если sourceSquare не передан, используем сохранённый
    const actualSourceSquare = sourceSquare ?? lastSourceSquare;
    if (!actualSourceSquare) return false;
    const piece = promotionPiece.charAt(1).toLowerCase() as PromotionPiece;
    const result = game.move(actualSourceSquare, targetSquare, piece);
    if (result) {
      setGame(
        Object.create(
          Object.getPrototypeOf(game),
          Object.getOwnPropertyDescriptors(game)
        )
      );
      setHighlightSquares([]);
      setSelectedSquare(null);
      setPromotionSquare(null);
      setLastMoveType(null);
      setLastSourceSquare(null);
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
    const piece = game.getPiece(sourceSquare);
    if (!piece) return false;
    // Проверяем, является ли ход промоушеном
    const isPromotion = onPromotionCheck(sourceSquare, targetSquare, piece);
    if (isPromotion) {
      setLastMoveType("drop");
      setLastSourceSquare(sourceSquare);
      setPromotionSquare(targetSquare);
      return true;
    }
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
      setPromotionSquare(null);
      setLastMoveType(null);
      setLastSourceSquare(null);
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
    // Если нет выбранной клетки, выбираем фигуру и показываем возможные ходы
    if (!selectedSquare) {
      const piece = game.getPiece(square);
      if (!piece) return;
      const legalMoves = game.getLegalMoves(square);
      if (legalMoves.length > 0) {
        setSelectedSquare(square);
        setHighlightSquares(legalMoves);
      }
      return;
    }
    // Если кликнули на ту же клетку, снимаем выделение
    if (square === selectedSquare) {
      setSelectedSquare(null);
      setHighlightSquares([]);
      return;
    }
    // Если кликнули на подсвеченную клетку, делаем ход
    if (highlightSquares.includes(square)) {
      const piece = game.getPiece(selectedSquare);
      if (!piece) return;
      // Проверяем, является ли ход промоушеном
      const isPromotion = onPromotionCheck(selectedSquare, square, piece);
      if (isPromotion) {
        setLastMoveType("click");
        setLastSourceSquare(selectedSquare);
        setPromotionSquare(square);
        return;
      }
      // Если это обычный ход
      const result = game.move(selectedSquare, square);
      if (result) {
        setGame(
          Object.create(
            Object.getPrototypeOf(game),
            Object.getOwnPropertyDescriptors(game)
          )
        );
        setHighlightSquares([]);
        setSelectedSquare(null);
        setPromotionSquare(null);
        setLastMoveType(null);
        setLastSourceSquare(null);
        if (result.captured) {
          onCapture?.(square);
        }
        const newGameStatus = game.getGameStatus();
        setGameStatus(newGameStatus);
        if (newGameStatus !== "playing") {
          onComplete?.(newGameStatus);
        }
      }
      return;
    }
    // Если кликнули на другую фигуру, выбираем её
    const piece = game.getPiece(square);
    if (piece) {
      const legalMoves = game.getLegalMoves(square);
      if (legalMoves.length > 0) {
        setSelectedSquare(square);
        setHighlightSquares(legalMoves);
      }
    } else {
      // Если кликнули на пустую клетку, снимаем выделение
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
        {gameStatus === "playing"
          ? errorMessage
            ? `${turnMessage} - ${errorMessage}`
            : turnMessage
          : turnMessage}
      </div>

      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        onPromotionCheck={onPromotionCheck}
        onPromotionPieceSelect={onPromotionPieceSelect}
        promotionToSquare={promotionSquare as any}
        showPromotionDialog={!!promotionSquare}
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
