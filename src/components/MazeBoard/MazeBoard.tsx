import { useState, useEffect, useRef } from "react";
import { Square, PromotionPiece, MazePuzzle } from "../../types/types";
import { MazeEngine } from "../../utils/MazeEngine";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";
import { MazeCounters } from "../MazeCounters/MazeCounters";
import { MazeControls } from "../MazeControls/MazeControls";
import { useCustomPieces } from "src/components/CustomPieces/CustomPieces";
import { ChessCoordinates } from "../ChessCoordinates/ChessCoordinates";
import styled from "styled-components";

// Custom board styles
const BoardWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ChessBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  border: 2px solid #8b4513;
  background-color: #deb887;

  @media (max-width: 768px) {
    grid-template-columns: repeat(8, 45px);
    grid-template-rows: repeat(8, 45px);
  }
`;

interface BoardSquareProps {
  $color: "light" | "dark";
  $selected: boolean;
  $highlighted: boolean;
  $contentType: "piece" | "wall" | "exit" | "checkpoint" | "empty";
  $active?: boolean;
}

const BoardSquare = styled.div<BoardSquareProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  background-color: ${({ $color, $contentType, $active }) => {
    if ($contentType === "wall") return "#8B4513";
    if ($contentType === "exit") return $active ? "#90EE90" : "#FFB6C1";
    if ($contentType === "checkpoint") return "#87CEEB";
    return $color === "light" ? "#F0D9B5" : "#B58863";
  }};

  ${({ $selected }) =>
    $selected &&
    `
    background: rgba(255, 255, 0, 0.4) !important;
  `}

  &:hover {
    ${({ $contentType }) =>
      $contentType !== "wall" &&
      `
      filter: brightness(1.1);
      transform: scale(1.02);
    `}
  }
`;

const PieceElement = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

interface HintDotProps {
  $hasPiece: boolean;
}

const HintDot = styled.div<HintDotProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;

  ${({ $hasPiece }) =>
    $hasPiece
      ? `
        background: radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%);
      `
      : `
        background: radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%);
      `}
`;

interface MazeBoardProps {
  puzzle: MazePuzzle;
  onComplete?: (result: "success" | "failure") => void;
  showHints: boolean;
  onToggleHints: () => void;
  onRestart: () => void;
}

export function MazeBoard({
  puzzle,
  onComplete,
  showHints,
  onToggleHints,
  onRestart,
}: MazeBoardProps) {
  const customPieces = useCustomPieces();

  const [engine] = useState<MazeEngine>(() => {
    try {
      return new MazeEngine(puzzle);
    } catch (error) {
      console.error("Failed to initialize maze engine:", error);
      throw error;
    }
  });

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(
    puzzle.timeLimit || null
  );
  const [promotionData, setPromotionData] = useState<{
    sourceSquare: Square;
    targetSquare: Square;
  } | null>(null);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [draggedPiece, setDraggedPiece] = useState<{
    square: Square;
    piece: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameState = engine.getGameState();

  // Use renderTrigger to force component updates when needed
  const boardKey = `maze-board-${renderTrigger}`;

  // Timer effect
  useEffect(() => {
    if (
      puzzle.timeLimit &&
      currentTime !== null &&
      currentTime > 0 &&
      !engine.isGameComplete() &&
      !engine.isGameFailed()
    ) {
      timerRef.current = setTimeout(() => {
        const newTime = currentTime - 1;
        setCurrentTime(newTime);
        engine.updateRemainingTime(newTime);

        if (newTime <= 0) {
          onComplete?.("failure");
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentTime, puzzle.timeLimit, engine, onComplete]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Convert square notation to coordinates (currently unused but may be needed for future features)
  // const squareToCoords = (square: Square) => {
  //   const file = square.charCodeAt(0) - 97; // 'a' = 0
  //   const rank = parseInt(square[1]) - 1; // '1' = 0
  //   return { file, rank };
  // };

  // Convert coordinates to square notation
  const coordsToSquare = (file: number, rank: number): Square => {
    return `${String.fromCharCode(97 + file)}${rank + 1}` as Square;
  };

  // Get square color (light/dark)
  const getSquareColor = (file: number, rank: number) => {
    return (file + rank) % 2 === 0 ? "dark" : "light";
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, square: Square) => {
    const piece = getPieceOnSquare(square);
    if (piece) {
      setDraggedPiece({ square, piece });
      e.dataTransfer.effectAllowed = "move";

      // Show legal moves when dragging starts
      const legalMoves = engine.getLegalMoves(square);
      setHighlightSquares(legalMoves);
      setSelectedSquare(square);
    }
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    setHighlightSquares([]);
    setSelectedSquare(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (draggedPiece) {
      makeMove(draggedPiece.square, targetSquare);
    }
  };

  // Handle square click
  const handleSquareClick = (square: Square) => {
    const piece = getPieceOnSquare(square);

    // If no square is selected
    if (!selectedSquare) {
      // Only select if there's a player piece on this square
      if (piece && engine.isPlayerPiece(piece)) {
        const legalMoves = engine.getLegalMoves(square);
        setSelectedSquare(square);
        setHighlightSquares(legalMoves);
      }
      return;
    }

    // If clicking the same square, deselect
    if (square === selectedSquare) {
      setSelectedSquare(null);
      setHighlightSquares([]);
      return;
    }

    // If clicking a valid move destination, make the move
    if (highlightSquares.includes(square)) {
      makeMove(selectedSquare, square);
      return;
    }

    // If clicking another player piece, switch selection
    if (piece && engine.isPlayerPiece(piece)) {
      const legalMoves = engine.getLegalMoves(square);
      setSelectedSquare(square);
      setHighlightSquares(legalMoves);
      return;
    }

    // If clicking on invalid square (wall, opponent piece that can't be captured, or empty square with no valid move)
    // Deselect current piece
    setSelectedSquare(null);
    setHighlightSquares([]);
  };

  // Make a move
  const makeMove = (from: Square, to: Square, promotion?: PromotionPiece) => {
    // Check if this is a promotion move
    if (!promotion && engine.isPromotionMove(from, to)) {
      setPromotionData({ sourceSquare: from, targetSquare: to });
      return;
    }

    const result = engine.makeMove(from, to, promotion);

    if (result.success) {
      // Update the existing engine state
      if (currentTime !== null) {
        engine.updateRemainingTime(currentTime);
      }

      // Force re-render by incrementing the render trigger
      setRenderTrigger((prev) => prev + 1);

      setHighlightSquares([]);
      setSelectedSquare(null);

      if (result.gameComplete) {
        onComplete?.("success");
      } else if (result.gameFailed) {
        onComplete?.("failure");
      }
    } else {
      setErrorMessage("Invalid move");
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  // Handle promotion selection
  const handlePromotionSelection = (promotionPiece: PromotionPiece) => {
    if (!promotionData) return;

    const { sourceSquare, targetSquare } = promotionData;
    makeMove(sourceSquare, targetSquare, promotionPiece);
    setPromotionData(null);
  };

  // Get piece on square
  const getPieceOnSquare = (square: Square) => {
    return gameState.position.get(square);
  };

  // Get square content (piece, wall, exit, checkpoint)
  const getSquareContent = (
    square: Square
  ): {
    type: "piece" | "wall" | "exit" | "checkpoint" | "empty";
    content: string | null;
    active?: boolean;
  } => {
    const piece = getPieceOnSquare(square);
    if (piece) {
      return { type: "piece" as const, content: piece };
    }

    if (gameState.walls.has(square)) {
      return { type: "wall" as const, content: "W" };
    }

    if (gameState.exits.has(square)) {
      const isActive = engine.areExitsActive();
      return { type: "exit" as const, content: "E", active: isActive };
    }

    if (gameState.checkpoints.has(square)) {
      return { type: "checkpoint" as const, content: "C" };
    }

    return { type: "empty" as const, content: null };
  };

  // Status message
  let statusMessage = "Navigate to the exit";
  if (engine.isGameComplete()) {
    statusMessage = "Maze completed!";
  } else if (engine.isGameFailed()) {
    statusMessage = "Maze failed!";
  } else if (currentTime !== null && currentTime <= 0) {
    statusMessage = "Time's up!";
  } else if (gameState.remainingMoves === 0) {
    statusMessage = "No moves remaining!";
  } else if (gameState.checkpoints.size > 0) {
    statusMessage = `Visit ${gameState.checkpoints.size} checkpoint${
      gameState.checkpoints.size > 1 ? "s" : ""
    } first`;
  }

  // Render the board
  const renderBoard = () => {
    const squares = [];

    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const square = coordsToSquare(file, rank);
        const squareColor = getSquareColor(file, rank);
        const content = getSquareContent(square);
        const isSelected = selectedSquare === square;
        const isHighlighted = highlightSquares.includes(square);

        squares.push(
          <BoardSquare
            key={square}
            $color={squareColor}
            $selected={isSelected}
            $highlighted={isHighlighted}
            onClick={() => handleSquareClick(square)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, square)}
            $contentType={content.type}
            $active={content.active}
          >
            {content.type === "piece" && content.content && (
              <PieceElement
                draggable
                onDragStart={(e) => handleDragStart(e, square)}
                onDragEnd={handleDragEnd}
              >
                {(() => {
                  // Convert single character piece notation to custom pieces format
                  // Uppercase = white, lowercase = black
                  const isWhite =
                    content.content === content.content.toUpperCase();
                  const pieceType = content.content.toUpperCase();
                  const pieceKey = `${isWhite ? "w" : "b"}${pieceType}`;

                  if (customPieces && customPieces[pieceKey]) {
                    return customPieces[pieceKey]();
                  }

                  // Fallback to text display
                  return (
                    <div
                      style={{
                        fontSize: "40px",
                        lineHeight: "1",
                        textAlign: "center",
                        color: isWhite ? "#fff" : "#000",
                        textShadow: isWhite
                          ? "1px 1px 1px #000"
                          : "1px 1px 1px #fff",
                      }}
                    >
                      {content.content}
                    </div>
                  );
                })()}
              </PieceElement>
            )}
            {content.type === "wall" && (
              <div
                style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}
              >
                {content.content}
              </div>
            )}
            {content.type === "exit" && (
              <div
                style={{
                  color: content.active ? "green" : "red",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {content.content}
              </div>
            )}
            {content.type === "checkpoint" && (
              <div
                style={{ color: "blue", fontWeight: "bold", fontSize: "20px" }}
              >
                {content.content}
              </div>
            )}
            {isHighlighted && square !== selectedSquare && (
              <HintDot
                $hasPiece={
                  content.type === "checkpoint" ||
                  (content.type === "exit" && content.active === true)
                }
              />
            )}
          </BoardSquare>
        );
      }
    }

    return squares;
  };

  return (
    <BoardContainer>
      <MazeCounters
        remainingCheckpoints={gameState.checkpoints.size}
        remainingMoves={gameState.remainingMoves}
        remainingTime={currentTime}
      />

      <GameStatus>{errorMessage || statusMessage}</GameStatus>

      <BoardWrapper>
        <ChessBoard key={boardKey}>{renderBoard()}</ChessBoard>
        <ChessCoordinates boardOrientation="white" />
      </BoardWrapper>

      <PromotionDialog
        isOpen={!!promotionData}
        onSelect={handlePromotionSelection}
        onClose={() => setPromotionData(null)}
      />

      <MazeControls
        showHints={showHints}
        onToggleHints={onToggleHints}
        onRestart={onRestart}
      />
    </BoardContainer>
  );
}
