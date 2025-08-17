import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MazeBoard } from "../MazeBoard";
import { MazePuzzle } from "../../../types/types";
import settingsSlice from "../../../store/settingsSlice";

// Mock the MazeEngine
jest.mock("../../../utils/MazeEngine");

// Mock dependencies
jest.mock("../../CustomPieces/CustomPieces", () => ({
  useCustomPieces: () => ({
    wR: () => <div data-testid="white-rook">♖</div>,
    bR: () => <div data-testid="black-rook">♜</div>,
    wP: () => <div data-testid="white-pawn">♙</div>,
    bP: () => <div data-testid="black-pawn">♟</div>,
  }),
}));

jest.mock("../../PromotionDialog/PromotionDialog", () => ({
  PromotionDialog: ({ isOpen, onSelect, onClose }: any) =>
    isOpen ? (
      <div data-testid="promotion-dialog">
        <button onClick={() => onSelect("q")} data-testid="promote-queen">
          Queen
        </button>
        <button onClick={onClose} data-testid="close-promotion">
          Close
        </button>
      </div>
    ) : null,
}));

jest.mock("../../MazeCounters/MazeCounters", () => ({
  MazeCounters: ({
    remainingCheckpoints,
    remainingMoves,
    remainingTime,
  }: any) => (
    <div data-testid="maze-counters">
      {remainingCheckpoints > 0 && (
        <div data-testid="checkpoints-counter">
          Checkpoints: {remainingCheckpoints}
        </div>
      )}
      {remainingMoves !== undefined && remainingMoves !== null && (
        <div data-testid="moves-counter">Moves: {remainingMoves}</div>
      )}
      {remainingTime !== undefined && remainingTime !== null && (
        <div data-testid="time-counter">Time: {remainingTime}</div>
      )}
    </div>
  ),
}));

jest.mock("../../MazeControls/MazeControls", () => ({
  MazeControls: ({ showHints, onToggleHints, onRestart }: any) => (
    <div data-testid="maze-controls">
      <button onClick={onToggleHints} data-testid="toggle-hints">
        {showHints ? "Hide Hints" : "Show Hints"}
      </button>
      <button onClick={onRestart} data-testid="restart-button">
        Restart
      </button>
    </div>
  ),
}));

// Mock ChessCoordinates component
jest.mock("../../ChessCoordinates/ChessCoordinates", () => ({
  ChessCoordinates: () => (
    <div data-testid="chess-coordinates">Coordinates</div>
  ),
}));

// Global mock game state for use in hooks
const mockGameState = {
  position: new Map([["a1", "R"]]),
  playerPiece: { square: "a1" as any, type: "R" },
  walls: new Set(["b2", "c2", "d2"]),
  exits: new Set(["a8"]),
  checkpoints: new Set(["g7"]),
  visitedCheckpoints: new Set(),
  remainingMoves: 10,
  remainingTime: 60,
  gameStatus: "playing" as const,
  turn: "w" as const,
};

// Mock the new hooks
let mockUseMazeGameReturn: any;
let mockUseTimerReturn: any;
let mockUseDragAndDropReturn: any;

jest.mock("../hooks/useTimer", () => ({
  useTimer: jest.fn(),
}));

jest.mock("../hooks/useMazeGame", () => ({
  useMazeGame: jest.fn(),
}));

jest.mock("../hooks/useDragAndDrop", () => ({
  useDragAndDrop: jest.fn(),
}));

// Test wrapper component with Redux Provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = configureStore({
    reducer: {
      settings: settingsSlice,
    },
    preloadedState: {
      settings: {
        language: "en",
        boardOrientation: "white",
        pieceSet: "classic",
      },
    },
  });

  return <Provider store={store}>{children}</Provider>;
};

// Helper function to render MazeBoard with TestWrapper
const renderMazeBoard = (props: any) => {
  return render(
    <TestWrapper>
      <MazeBoard {...props} />
    </TestWrapper>
  );
};

describe("MazeBoard Component", () => {
  const mockPuzzle: MazePuzzle = {
    id: "test-1",
    titleKey: "test_puzzle_title",
    descriptionKey: "test_puzzle_desc",
    initialPosition: "E6C/WWWW1WWW/8/8/8/2W1W3/WWW1WWW1/R7 w - - 0 1",
    hintKey: "test_puzzle_hint",
  };

  const mockPuzzleWithLimits: MazePuzzle = {
    ...mockPuzzle,
    maxMoves: 10,
    timeLimit: 60,
  };

  let mockEngine: any;
  let mockOnComplete: jest.Mock;
  let mockOnToggleHints: jest.Mock;
  let mockOnRestart: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockOnComplete = jest.fn();
    mockOnToggleHints = jest.fn();
    mockOnRestart = jest.fn();

    mockEngine = {
      getGameState: jest.fn(() => mockGameState),
      getLegalMoves: jest.fn(() => ["a2", "b1"]),
      makeMove: jest.fn(() => ({ success: true })),
      isGameComplete: jest.fn(() => false),
      isGameFailed: jest.fn(() => false),
      isPromotionMove: jest.fn(() => false),
      areExitsActive: jest.fn(() => false),
      updateRemainingTime: jest.fn(),
    };

    // Setup mock returns for hooks
    mockUseTimerReturn = {
      currentTime: 60,
    };

    mockUseMazeGameReturn = {
      engine: mockEngine,
      gameState: mockGameState,
      selectedSquare: null,
      highlightSquares: [],
      errorMessage: null,
      promotionData: null,
      renderTrigger: 0,
      setSelectedSquare: jest.fn(),
      setHighlightSquares: jest.fn(),
      setPromotionData: jest.fn(),
      handleSquareClick: jest.fn(),
      makeMove: jest.fn(),
      handlePromotionSelection: jest.fn(),
    };

    mockUseDragAndDropReturn = {
      handleDragStart: jest.fn(),
      handleDragEnd: jest.fn(),
      handleDragOver: jest.fn(),
      handleDrop: jest.fn(),
    };

    // Setup the mocked functions to return our mock data
    const useTimerMock = require("../hooks/useTimer").useTimer as jest.Mock;
    const useMazeGameMock = require("../hooks/useMazeGame")
      .useMazeGame as jest.Mock;
    const useDragAndDropMock = require("../hooks/useDragAndDrop")
      .useDragAndDrop as jest.Mock;

    useTimerMock.mockReturnValue(mockUseTimerReturn);
    useMazeGameMock.mockReturnValue(mockUseMazeGameReturn);
    useDragAndDropMock.mockReturnValue(mockUseDragAndDropReturn);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Board Rendering", () => {
    it("should render the maze board with all elements", () => {
      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByTestId("maze-counters")).toBeInTheDocument();
      expect(screen.getByTestId("maze-controls")).toBeInTheDocument();
      expect(screen.getByTestId("chess-coordinates")).toBeInTheDocument();
    });

    it("should display walls with W markers", () => {
      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      const wallMarkers = screen.getAllByText("W");
      expect(wallMarkers.length).toBeGreaterThan(0);
    });

    it("should display exits with E markers", () => {
      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      const exitMarkers = screen.getAllByText("E");
      expect(exitMarkers.length).toBeGreaterThan(0);
    });

    it("should display checkpoints with star images", () => {
      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      const checkpointImages = screen.getAllByAltText("Checkpoint");
      expect(checkpointImages.length).toBeGreaterThan(0);
    });

    it("should display chess pieces correctly", () => {
      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByTestId("white-rook")).toBeInTheDocument();
    });
  });

  describe("Game State Integration", () => {
    it("should display counters with correct values", () => {
      renderMazeBoard({
        puzzle: mockPuzzleWithLimits,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByTestId("checkpoints-counter")).toHaveTextContent(
        "Checkpoints: 1"
      );
      expect(screen.getByTestId("moves-counter")).toHaveTextContent(
        "Moves: 10"
      );
      expect(screen.getByTestId("time-counter")).toHaveTextContent("Time: 60");
    });

    it("should display appropriate status messages", () => {
      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByText("Visit 1 checkpoint first")).toBeInTheDocument();
    });

    it("should show completed status when game is complete", () => {
      mockEngine.isGameComplete.mockReturnValue(true);
      mockUseMazeGameReturn.engine = mockEngine;

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByText("Maze completed!")).toBeInTheDocument();
    });
  });

  describe("Controls Integration", () => {
    it("should call onToggleHints when hint button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      const hintButton = screen.getByTestId("toggle-hints");
      await user.click(hintButton);

      expect(mockOnToggleHints).toHaveBeenCalled();
    });

    it("should call onRestart when restart button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      const restartButton = screen.getByTestId("restart-button");
      await user.click(restartButton);

      expect(mockOnRestart).toHaveBeenCalled();
    });

    it("should display correct hint button text based on showHints prop", () => {
      const { rerender } = renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByText("Show Hints")).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <MazeBoard
            puzzle={mockPuzzle}
            onComplete={mockOnComplete}
            showHints={true}
            onToggleHints={mockOnToggleHints}
            onRestart={mockOnRestart}
          />
        </TestWrapper>
      );

      expect(screen.getByText("Hide Hints")).toBeInTheDocument();
    });
  });

  describe("Hook Integration", () => {
    it("should call useTimer with correct parameters", () => {
      const useTimerMock = require("../hooks/useTimer").useTimer;

      renderMazeBoard({
        puzzle: mockPuzzleWithLimits,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(useTimerMock).toHaveBeenCalledWith({
        initialTime: 60,
        engine: mockEngine,
        onTimeUp: expect.any(Function),
      });
    });

    it("should call useMazeGame with correct parameters", () => {
      const useMazeGameMock = require("../hooks/useMazeGame").useMazeGame;

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(useMazeGameMock).toHaveBeenCalledWith({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        currentTime: null,
      });
    });

    it("should call useDragAndDrop with correct parameters", () => {
      const useDragAndDropMock =
        require("../hooks/useDragAndDrop").useDragAndDrop;

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: false,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(useDragAndDropMock).toHaveBeenCalledWith({
        engine: mockEngine,
        onMove: mockUseMazeGameReturn.makeMove,
        setHighlightSquares: mockUseMazeGameReturn.setHighlightSquares,
        setSelectedSquare: mockUseMazeGameReturn.setSelectedSquare,
      });
    });
  });

  describe("Promotion Dialog Integration", () => {
    it("should show promotion dialog when promotionData is set", () => {
      mockUseMazeGameReturn.promotionData = {
        sourceSquare: "a7",
        targetSquare: "a8",
      };

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: true,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByTestId("promotion-dialog")).toBeInTheDocument();
    });

    it("should not show promotion dialog when promotionData is null", () => {
      mockUseMazeGameReturn.promotionData = null;

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: true,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.queryByTestId("promotion-dialog")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display error message when present", () => {
      mockUseMazeGameReturn.errorMessage = "Invalid move";

      renderMazeBoard({
        puzzle: mockPuzzle,
        onComplete: mockOnComplete,
        showHints: true,
        onToggleHints: mockOnToggleHints,
        onRestart: mockOnRestart,
      });

      expect(screen.getByText("Invalid move")).toBeInTheDocument();
    });
  });
});
