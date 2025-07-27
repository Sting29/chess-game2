import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { PromotionPiece, Piece } from "../../types/types";
import { Square } from "../../types/playTypes";
import { SimplifiedChessEngine } from "../../utils/SimplifiedChessEngine";
import { useCustomPieces } from "../CustomPieces/CustomPieces";
import { boardStyles } from "src/data/boardSettings";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";

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
  const [promotionData, setPromotionData] = useState<{
    sourceSquare: Square;
    targetSquare: Square;
  } | null>(null);

  const currentTurn = game.fen().split(" ")[1];
  let turnMessage = currentTurn === "w" ? "White's move" : "Black's move";

  // Change message based on game status
  if (gameStatus === "white_wins") {
    turnMessage = "White wins! All black pieces captured";
  } else if (gameStatus === "draw") {
    turnMessage = "Draw! No more possible moves";
  }

  function isPromotionMove(
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ): boolean {
    if (!piece.endsWith("P")) return false;
    const [, toRank] = targetSquare.split("");
    return toRank === "8";
  }

  function handlePromotionSelection(promotionPiece: PromotionPiece) {
    if (!promotionData) return;

    const { sourceSquare, targetSquare } = promotionData;
    const result = game.move(sourceSquare, targetSquare, promotionPiece);

    if (result) {
      const newGame = new SimplifiedChessEngine(game.fen());
      setGame(newGame);
      setHighlightSquares([]);
      setSelectedSquare(null);
      setPromotionData(null);

      if (result.captured) {
        onCapture?.(targetSquare);
      }

      const newGameStatus = newGame.getGameStatus();
      setGameStatus(newGameStatus);
      if (newGameStatus !== "playing") {
        onComplete?.(newGameStatus);
      }
    }
  }

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    const piece = game.getPiece(sourceSquare);
    if (!piece) return false;

    // Check if this is a promotion move
    if (isPromotionMove(sourceSquare, targetSquare, piece)) {
      setPromotionData({ sourceSquare, targetSquare });
      return true;
    }

    const result = game.move(sourceSquare, targetSquare);
    if (result) {
      const newGame = new SimplifiedChessEngine(game.fen());
      setGame(newGame);
      setHighlightSquares([]);
      setSelectedSquare(null);
      setPromotionData(null);

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

    // If clicked on a highlighted square, make the move
    if (highlightSquares.includes(square)) {
      const piece = game.getPiece(selectedSquare);
      if (!piece) return;

      // Check if this is a promotion move
      if (isPromotionMove(selectedSquare, square, piece)) {
        setPromotionData({
          sourceSquare: selectedSquare,
          targetSquare: square,
        });
        return;
      }

      // Make normal move
      const result = game.move(selectedSquare, square);
      if (result) {
        const newGame = new SimplifiedChessEngine(game.fen());
        setGame(newGame);
        setHighlightSquares([]);
        setSelectedSquare(null);
        setPromotionData(null);

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
    <BoardContainer
      style={{ width: "550px", margin: "0 auto", position: "relative" }}
    >
      <GameStatus>
        {errorMessage ? `${turnMessage} - ${errorMessage}` : turnMessage}
      </GameStatus>

      <Chessboard
        options={{
          position: game.fen(),
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            targetSquare
              ? onDrop(sourceSquare as Square, targetSquare as Square)
              : false,
          onSquareClick: ({ square }) => onSquareClick(square as Square),
          canDragPiece: ({ piece }) =>
            isDraggablePiece({ piece: piece.pieceType }),
          ...boardStyles,
          squareStyles: {
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
          },
          pieces: customPieces,
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
