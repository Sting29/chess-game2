import React from "react";
import { MazePuzzle, Square } from "../../types/types";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";
import { MazeCounters } from "../MazeCounters/MazeCounters";
import { MazeControls } from "../MazeControls/MazeControls";
import { ChessCoordinates } from "src/components/ChessCoordinates/ChessCoordinates";

// Import refactored modules
import { BoardWrapper, ChessBoard } from "./styles";
import { MazeBoardSquare } from "./components";
import { coordsToSquare, getSquareColor, getStatusMessage } from "./utils";
import { useTimer } from "./hooks/useTimer";
import { useMazeGame } from "./hooks/useMazeGame";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

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
  // Initialize game logic with custom hooks
  const {
    engine,
    gameState,
    selectedSquare,
    highlightSquares,
    errorMessage,
    promotionData,
    renderTrigger,
    setSelectedSquare,
    setHighlightSquares,
    setPromotionData,
    handleSquareClick,
    makeMove,
    handlePromotionSelection,
  } = useMazeGame({
    puzzle,
    onComplete,
    currentTime: null, // Will be updated by timer
  });

  // Initialize timer with engine
  const { currentTime } = useTimer({
    initialTime: puzzle.timeLimit || null,
    engine,
    onTimeUp: () => onComplete?.("failure"),
  });

  // Update current time in game engine
  React.useEffect(() => {
    if (currentTime !== null && engine) {
      engine.updateRemainingTime(currentTime);
    }
  }, [currentTime, engine]);

  // Initialize drag & drop
  const { handleDragStart, handleDragEnd, handleDragOver, handleDrop } =
    useDragAndDrop({
      engine,
      onMove: makeMove,
      setHighlightSquares,
      setSelectedSquare,
    });

  // Get square content helper
  const getSquareContent = (square: Square) => {
    const piece = gameState.position.get(square);
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

  // Generate status message
  const statusMessage = getStatusMessage(
    engine.isGameComplete(),
    engine.isGameFailed(),
    currentTime,
    gameState.remainingMoves || null,
    gameState.checkpoints.size
  );

  // Render the board using the new component structure
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
          <MazeBoardSquare
            key={square}
            square={square}
            color={squareColor}
            content={content}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
            onClick={() => handleSquareClick(square)}
            onDragStart={(e) => handleDragStart(e, square)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, square)}
          />
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
        <ChessBoard key={`maze-board-${renderTrigger}`}>
          {renderBoard()}
        </ChessBoard>
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
