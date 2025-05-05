import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { PromotionPiece, Piece } from "../../types/types";
import { Square } from "../../types/playTypes";
import { SimplifiedChessEngine } from "../../utils/SimplifiedChessEngine";
import { useCustomPieces } from "../CustomPieces/CustomPieces";

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
  const [promotionSquare, setPromotionSquare] = useState<Square | null>(null);
  const [, setLastMoveType] = useState<"drop" | "click" | null>(null);
  const [lastSourceSquare, setLastSourceSquare] = useState<Square | null>(null);

  const currentTurn = game.fen().split(" ")[1];
  let turnMessage = currentTurn === "w" ? "White's move" : "Black's move";

  // Change message based on game status
  if (gameStatus === "white_wins") {
    turnMessage = "White wins! All black pieces captured";
  } else if (gameStatus === "draw") {
    turnMessage = "Draw! No more possible moves";
  }

  function onPromotionCheck(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    if (!piece.endsWith("P")) return false;
    if (sourceSquare[0] !== targetSquare[0]) return false;
    const [, toRank] = targetSquare.split("");
    return toRank === "8";
  }

  function onPromotionPieceSelect(
    promotionPiece?: string,
    sourceSquare?: Square,
    targetSquare?: Square
  ): boolean {
    if (!promotionPiece || !targetSquare) return false;

    // If sourceSquare is not provided, use the saved one
    const actualSourceSquare = sourceSquare ?? lastSourceSquare;
    if (!actualSourceSquare) return false;

    const piece = promotionPiece.charAt(1).toLowerCase() as PromotionPiece;

    const result = game.move(actualSourceSquare, targetSquare, piece);
    if (result) {
      const newFen = game.fen();

      const newGame = new SimplifiedChessEngine(newFen);
      setGame(newGame);

      setHighlightSquares([]);
      setSelectedSquare(null);
      setPromotionSquare(null);
      setLastMoveType(null);
      setLastSourceSquare(null);

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
      const newGame = new SimplifiedChessEngine(game.fen());
      setGame(newGame);
      setHighlightSquares([]);
      setSelectedSquare(null);
      setPromotionSquare(null);
      setLastMoveType(null);
      setLastSourceSquare(null);
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

    setErrorMessage("Invalid move");
    setTimeout(() => setErrorMessage(null), 2000);
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
        setHighlightSquares(legalMoves as Square[]);
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
        const newGame = new SimplifiedChessEngine(game.fen());
        setGame(newGame);
        setHighlightSquares([]);
        setSelectedSquare(null);
        setPromotionSquare(null);
        setLastMoveType(null);
        setLastSourceSquare(null);

        if (result.captured) {
          onCapture?.(square);
        }

        const newGameStatus = newGame.getGameStatus();
        setGameStatus(newGameStatus);
        if (newGameStatus !== "playing") {
          onComplete?.(newGameStatus);
        }
      }
    } else {
      // Если кликнули на другую фигуру, выбираем её
      const piece = game.getPiece(square);
      if (piece) {
        const legalMoves = game.getLegalMoves(square);
        if (legalMoves.length > 0) {
          setSelectedSquare(square);
          setHighlightSquares(legalMoves as Square[]);
        }
      } else {
        // Если кликнули на пустую клетку, снимаем выделение
        setSelectedSquare(null);
        setHighlightSquares([]);
      }
    }
  }

  function isDraggablePiece(args: { piece: Piece }): boolean {
    const isBlackPawn = args.piece === "bP";
    return isBlackPawn ? false : true;
  }

  const customPieces = useCustomPieces();

  return (
    <div style={{ width: "550px", margin: "0 auto" }}>
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
        onPromotionCheck={onPromotionCheck}
        onPromotionPieceSelect={onPromotionPieceSelect}
        isDraggablePiece={isDraggablePiece}
        promotionToSquare={promotionSquare}
        showPromotionDialog={!!promotionSquare}
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
