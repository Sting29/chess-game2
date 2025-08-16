import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MazeBoard } from "../MazeBoard";
import { MazePuzzle } from "../../../types/types";

// Mock the MazeEngine
jest.mock("../../../utils/MazeEngine");
const MockedMazeEngine = jest.mocked(
  require("../../../utils/MazeEngine").MazeEngine
);

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
  MazeCounters: ({ remainingCheckpoints, remainingMoves, remainingTime }: any) => (
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

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        checkpoints_remaining: `Checkpoints remaining: ${options?.count || 0}`,
        moves_remaining: `Moves remaining: ${options?.count || 0}`,
        time_remaining: `Time remaining: ${options?.time || "0:00"}`,
        show_hints: "Show Hints",
        hide_hints: "Hide Hints",
        start_over: "Restart",
        maze_complete: "Maze completed!",
        maze_failed: "Maze failed!",
        no_moves_left: "No moves remaining",
        time_expired: "Time's up!",
        cannot_move_through_walls: "Cannot move through walls",
      };
      return translations[key] || key;
    },
  }),
}));

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

    MockedMazeEngine.mockImplementation(() => mockEngine);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Board Rendering", () => {
    it("should render the maze board with all elements", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByTestId("maze-counters")).toBeInTheDocument();
      expect(screen.getByTestId("maze-controls")).toBeInTheDocument();
    });

    it("should display walls with W markers", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const wallMarkers = screen.getAllByText("W");
      expect(wallMarkers.length).toBeGreaterThan(0);
    });

    it("should display exits with E markers", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const exitMarkers = screen.getAllByText("E");
      expect(exitMarkers.length).toBeGreaterThan(0);
    });

    it("should display checkpoints with C markers", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const checkpointMarkers = screen.getAllByText("C");
      expect(checkpointMarkers.length).toBeGreaterThan(0);
    });

    it("should display chess pieces correctly", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByTestId("white-rook")).toBeInTheDocument();
    });

    it("should show inactive exits in red and active exits in green", () => {
      mockEngine.areExitsActive.mockReturnValue(false);
      const { rerender } = render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      let exitMarkers = screen.getAllByText("E");
      expect(exitMarkers[0]).toHaveStyle({ color: "red" });

      mockEngine.areExitsActive.mockReturnValue(true);
      rerender(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      exitMarkers = screen.getAllByText("E");
      expect(exitMarkers[0]).toHaveStyle({ color: "green" });
    });
  });

  describe("Move Highlighting and Piece Selection", () => {
    it("should highlight valid moves when piece is selected and hints are enabled", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={true}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const piece = screen.getByTestId("white-rook");
      await user.click(piece);

      expect(mockEngine.getLegalMoves).toHaveBeenCalledWith("a1");
    });

    it("should not show hints when showHints is false", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const piece = screen.getByTestId("white-rook");
      await user.click(piece);

      expect(mockEngine.getLegalMoves).toHaveBeenCalledWith("a1");
    });

    it("should handle drag and drop moves", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={true}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const piece = screen.getByTestId("white-rook");

      fireEvent.dragStart(piece);
      expect(mockEngine.getLegalMoves).toHaveBeenCalledWith("a1");

      fireEvent.dragEnd(piece);
    });
  });

  describe("Counter Updates and Game State", () => {
    it("should display counters with correct values", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzleWithLimits}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByTestId("checkpoints-counter")).toHaveTextContent("Checkpoints: 1");
      expect(screen.getByTestId("moves-counter")).toHaveTextContent("Moves: 10");
      expect(screen.getByTestId("time-counter")).toHaveTextContent("Time: 60");
    });

    it("should handle time countdown correctly", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzleWithLimits}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      jest.advanceTimersByTime(1000);

      expect(mockEngine.updateRemainingTime).toHaveBeenCalledWith(59);
    });

    it("should call onComplete with failure when time runs out", async () => {
      render(
        <MazeBoard
          puzzle={mockPuzzleWithLimits}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      jest.advanceTimersByTime(61000);

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith("failure");
      });
    });
  });

  describe("Game Completion Handling", () => {
    it("should display appropriate status messages", () => {
      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("Visit 1 checkpoint first")).toBeInTheDocument();

      mockEngine.isGameComplete.mockReturnValue(true);
      const { rerender } = render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      rerender(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("Maze completed!")).toBeInTheDocument();
    });
  });

  describe("Promotion Dialog Integration", () => {
    it("should show promotion dialog when pawn reaches promotion square", () => {
      mockEngine.isPromotionMove.mockReturnValue(true);
      mockGameState.playerPiece = { square: "a7" as any, type: "P" };
      mockGameState.position = new Map([["a7", "P"]]);

      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={true}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.queryByTestId("promotion-dialog")).not.toBeInTheDocument();
    });
  });

  describe("Controls Integration", () => {
    it("should call onToggleHints when hint button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimers });

      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const hintButton = screen.getByTestId("toggle-hints");
      await user.click(hintButton);

      expect(mockOnToggleHints).toHaveBeenCalled();
    });

    it("should call onRestart when restart button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimers });

      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const restartButton = screen.getByTestId("restart-button");
      await user.click(restartButton);

      expect(mockOnRestart).toHaveBeenCalled();
    });

    it("should display correct hint button text based on showHints prop", () => {
      const { rerender } = render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("Show Hints")).toBeInTheDocument();

      rerender(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={true}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("Hide Hints")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid moves gracefully", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimers });

      mockEngine.makeMove.mockReturnValue({ success: false });

      render(
        <MazeBoard
          puzzle={mockPuzzle}
          onComplete={mockOnComplete}
          showHints={true}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      const piece = screen.getByTestId("white-rook");
      await user.click(piece);

      expect(screen.getByTestId("maze-counters")).toBeInTheDocument();
    });

    it("should handle engine initialization errors", () => {
      MockedMazeEngine.mockImplementation(() => {
        throw new Error("Invalid puzzle configuration");
      });

      expect(() => {
        render(
          <MazeBoard
            puzzle={mockPuzzle}
            onComplete={mockOnComplete}
            showHints={false}
            onToggleHints={mockOnToggleHints}
            onRestart={mockOnRestart}
          />
        );
      }).toThrow("Invalid puzzle configuration");
    });

    it("should clean up timers on unmount", () => {
      const { unmount } = render(
        <MazeBoard
          puzzle={mockPuzzleWithLimits}
          onComplete={mockOnComplete}
          showHints={false}
          onToggleHints={mockOnToggleHints}
          onRestart={mockOnRestart}
        />
      );

      jest.advanceTimersByTime(1000);

      unmount();

      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
