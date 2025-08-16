import React from "react";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

import { MazeBoard } from "../components/MazeBoard/MazeBoard";
import mazeProgressReducer, {
  completePuzzle,
  setCurrentPuzzle,
  resetProgress,
  loadProgress,
  selectMazeProgress,
  selectIsPuzzleCompleted,
  mazeProgressLocalStorageMiddleware,
  loadMazeProgressFromStorage,
} from "../store/mazeProgressSlice";
import settingsReducer from "../store/settingsSlice";
import { MAZE_PUZZLES } from "../data/mazePuzzles";
import { MazePuzzle } from "../types/types";

// Mock dependencies
jest.mock("../utils/MazeEngine");
const MockedMazeEngine = jest.mocked(require("../utils/MazeEngine").MazeEngine);

jest.mock("../components/CustomPieces/CustomPieces", () => ({
  useCustomPieces: () => ({ wR: () => <div data-testid="white-rook">♖</div> }),
}));

jest.mock("../components/PromotionDialog/PromotionDialog", () => ({
  PromotionDialog: ({ isOpen, onSelect, onClose }: any) =>
    isOpen ? (
      <div data-testid="promotion-dialog">
        <button onClick={() => onSelect("q")} data-testid="promote-queen">
          Queen
        </button>
        <button onClick={() => onSelect("r")} data-testid="promote-rook">
          Rook
        </button>
        <button onClick={() => onSelect("b")} data-testid="promote-bishop">
          Bishop
        </button>
        <button onClick={() => onSelect("n")} data-testid="promote-knight">
          Knight
        </button>
        <button onClick={onClose} data-testid="promotion-close">
          Close
        </button>
      </div>
    ) : null,
}));

jest.mock("react-chessboard", () => ({
  Chessboard: ({
    position,
    onSquareClick,
    onPieceDrop,
    customSquareStyles,
  }: any) => (
    <div data-testid="chessboard">
      <div data-testid="board-position">{position}</div>
      {onSquareClick && (
        <button
          data-testid="square-click-handler"
          onClick={() => onSquareClick({ square: "a1" })}
        >
          Click Square a1
        </button>
      )}
      {onPieceDrop && (
        <button
          data-testid="piece-drop-handler"
          onClick={() =>
            onPieceDrop({ sourceSquare: "a1", targetSquare: "a2" })
          }
        >
          Move a1 to a2
        </button>
      )}
      <div data-testid="custom-styles">
        {JSON.stringify(customSquareStyles)}
      </div>
    </div>
  ),
}));

// Mock i18n
const mockI18n = i18n.createInstance();
mockI18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        maze_puzzles: "Maze Puzzles",
        maze_complete: "Maze completed!",
        congratulations_maze_solved: "Congratulations! You solved the maze!",
        next_maze: "Next Maze",
        back_to_maze_list: "Back to Maze List",
        task_not_found: "Task not found",
        back_to_maze_puzzles: "Back to Maze Puzzles",
        max_moves_allowed: "Max moves: {{count}}",
        time_limit: "Time limit: {{time}} minutes",
        maze_puzzle_1_title: "Simple Path",
        maze_puzzle_1_desc: "Navigate the rook to the exit",
        maze_puzzle_2_title: "Checkpoint Challenge",
        maze_puzzle_2_desc: "Visit the checkpoint before reaching the exit",
        maze_puzzle_3_title: "Timed Challenge",
        maze_puzzle_3_desc: "Reach the exit within the time limit",
        max_moves: "Max moves",
        toggle_hints: "Toggle Hints",
        restart: "Restart",
        checkpoints_remaining: "Checkpoints remaining: {{count}}",
        moves_remaining: "Moves remaining: {{count}}",
        time_remaining: "Time remaining: {{time}}",
        maze_failed: "Maze failed!",
        no_moves_left: "No moves remaining",
        time_expired: "Time's up!",
      },
    },
  },
});

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      mazeProgress: mazeProgressReducer,
      settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(mazeProgressLocalStorageMiddleware),
    preloadedState: {
      mazeProgress: {
        completedPuzzles: [],
        currentPuzzleId: null,
        totalPuzzles: MAZE_PUZZLES.length,
        completionPercentage: 0,
      },
      settings: {
        isAuthenticated: true,
        language: "en",
        theme: "light",
        gameSettings: {},
        uiSettings: {},
      },
      ...initialState,
    },
  });
};

// Test wrapper component
const TestWrapper = ({
  children,
  store = createTestStore(),
}: {
  children: React.ReactNode;
  store?: any;
}) => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={mockI18n}>
        <div>{children}</div>
      </I18nextProvider>
    </Provider>
  );
};

describe("Maze Puzzle Integration Tests", () => {
  let mockEngine: any;
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset localStorage
    localStorage.clear();

    // Create fresh store
    store = createTestStore();

    // Create mock engine with default game state
    mockEngine = {
      getGameState: jest.fn(() => ({
        position: new Map([["a1", "R"]]),
        playerPiece: { square: "a1", type: "R" },
        walls: new Set(["b2", "c2"]),
        exits: new Set(["a8"]),
        checkpoints: new Set(["h8"]),
        visitedCheckpoints: new Set(),
        remainingMoves: 10,
        remainingTime: 60,
        gameStatus: "playing",
        turn: "w",
      })),
      getLegalMoves: jest.fn(() => ["a2", "b1", "h1"]),
      makeMove: jest.fn(() => ({ success: true, gameComplete: false })),
      isGameComplete: jest.fn(() => false),
      isGameFailed: jest.fn(() => false),
      isPromotionMove: jest.fn(() => false),
      areExitsActive: jest.fn(() => false),
      updateRemainingTime: jest.fn(),
      getRemainingCheckpoints: jest.fn(() => 1),
      getRemainingMoves: jest.fn(() => 10),
      getRemainingTime: jest.fn(() => 60),
      isWall: jest.fn((square) => ["b2", "c2"].includes(square)),
      isExit: jest.fn((square) => square === "a8"),
      isCheckpoint: jest.fn((square) => square === "h8"),
    };

    MockedMazeEngine.mockImplementation(() => mockEngine);
  });

  describe("Full Puzzle Completion Workflow", () => {
    it("should complete a simple maze puzzle successfully", async () => {
      const user = userEvent.setup();

      // Mock successful completion
      mockEngine.makeMove.mockReturnValue({
        success: true,
        gameComplete: true,
      });
      mockEngine.isGameComplete.mockReturnValue(true);
      mockEngine.areExitsActive.mockReturnValue(true);

      const testPuzzle: MazePuzzle = {
        id: "test-1",
        titleKey: "maze_puzzle_1_title",
        descriptionKey: "maze_puzzle_1_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      const onComplete = jest.fn();
      const onToggleHints = jest.fn();
      const onRestart = jest.fn();

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={onComplete}
            showHints={false}
            onToggleHints={onToggleHints}
            onRestart={onRestart}
          />
        </TestWrapper>
      );

      // Verify initial render
      expect(screen.getByTestId("chessboard")).toBeInTheDocument();
      expect(screen.getByText("Toggle Hints")).toBeInTheDocument();
      expect(screen.getByText("Restart")).toBeInTheDocument();

      // Make a move that completes the puzzle
      const moveButton = screen.getByTestId("piece-drop-handler");
      await user.click(moveButton);

      // Verify move was made
      expect(mockEngine.makeMove).toHaveBeenCalledWith("a1", "a2", undefined);

      // Verify completion callback was called
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith("success");
      });
    });

    it("should handle checkpoint collection workflow", async () => {
      const user = userEvent.setup();

      // Mock checkpoint collection sequence
      let checkpointsRemaining = 1;
      mockEngine.getRemainingCheckpoints.mockImplementation(
        () => checkpointsRemaining
      );
      mockEngine.areExitsActive.mockImplementation(
        () => checkpointsRemaining === 0
      );

      // First move: collect checkpoint
      mockEngine.makeMove.mockReturnValueOnce({
        success: true,
        checkpointVisited: true,
        gameComplete: false,
      });

      // Second move: reach exit after checkpoint
      mockEngine.makeMove.mockReturnValueOnce({
        success: true,
        gameComplete: true,
      });

      const testPuzzle: MazePuzzle = {
        id: "test-2",
        titleKey: "maze_puzzle_2_title",
        descriptionKey: "maze_puzzle_2_desc",
        initialPosition: "E6C/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      const onComplete = jest.fn();

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={onComplete}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // First move: collect checkpoint
      const moveButton = screen.getByTestId("piece-drop-handler");
      await user.click(moveButton);

      // Update mock state after checkpoint collection
      checkpointsRemaining = 0;
      mockEngine.getGameState.mockReturnValue({
        ...mockEngine.getGameState(),
        visitedCheckpoints: new Set(["h8"]),
      });

      // Second move: reach exit
      mockEngine.isGameComplete.mockReturnValue(true);
      await user.click(moveButton);

      // Verify completion
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith("success");
      });
    });

    it("should handle puzzle failure scenarios", async () => {
      const user = userEvent.setup();

      // Mock failure due to no moves left
      mockEngine.makeMove.mockReturnValue({
        success: true,
        gameFailed: true,
      });
      mockEngine.isGameFailed.mockReturnValue(true);
      mockEngine.getRemainingMoves.mockReturnValue(0);

      const testPuzzle: MazePuzzle = {
        id: "test-3",
        titleKey: "maze_puzzle_3_title",
        descriptionKey: "maze_puzzle_3_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        maxMoves: 1,
        hintKey: "test_hint",
      };

      const onComplete = jest.fn();

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={onComplete}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Make move that uses last move
      const moveButton = screen.getByTestId("piece-drop-handler");
      await user.click(moveButton);

      // Verify failure callback
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith("failure");
      });
    });

    it("should handle pawn promotion in maze context", async () => {
      const user = userEvent.setup();

      // Mock promotion scenario
      mockEngine.isPromotionMove.mockReturnValue(true);
      mockEngine.makeMove.mockReturnValue({
        success: true,
        promotion: true,
      });

      const testPuzzle: MazePuzzle = {
        id: "test-promotion",
        titleKey: "maze_puzzle_promotion_title",
        descriptionKey: "maze_puzzle_promotion_desc",
        initialPosition: "E7/P7/8/8/8/8/8/8 w - - 0 1",
        hintKey: "test_hint",
      };

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Make promotion move
      const moveButton = screen.getByTestId("piece-drop-handler");
      await user.click(moveButton);

      // Verify promotion dialog appears
      await waitFor(() => {
        expect(screen.getByTestId("promotion-dialog")).toBeInTheDocument();
      });

      // Select queen promotion
      const queenButton = screen.getByTestId("promote-queen");
      await user.click(queenButton);

      // Verify promotion was processed
      expect(mockEngine.makeMove).toHaveBeenCalledWith("a1", "a2", "q");
    });
  });

  describe("Progress Tracking and Redux State Updates", () => {
    it("should update Redux state when puzzle is completed", async () => {
      // Initial state should have no completed puzzles
      expect(store.getState().mazeProgress.completedPuzzles).toEqual([]);
      expect(store.getState().mazeProgress.completionPercentage).toBe(0);

      // Complete a puzzle
      store.dispatch(completePuzzle("1"));
      store.dispatch(setCurrentPuzzle("1"));

      // Wait for state update
      await waitFor(() => {
        const state = store.getState().mazeProgress;
        expect(state.completedPuzzles).toContain("1");
        expect(state.completionPercentage).toBeGreaterThan(0);
        expect(state.currentPuzzleId).toBe("1");
      });
    });

    it("should persist progress to localStorage", async () => {
      // Dispatch completion action
      store.dispatch(completePuzzle("1"));
      store.dispatch(setCurrentPuzzle("1"));

      // Verify localStorage was updated
      await waitFor(() => {
        const saved = localStorage.getItem("mazeProgress");
        expect(saved).toBeTruthy();

        const parsed = JSON.parse(saved!);
        expect(parsed.completedPuzzles).toContain("1");
        expect(parsed.currentPuzzleId).toBe("1");
      });
    });

    it("should load progress from localStorage", () => {
      // Set up localStorage data
      const progressData = {
        completedPuzzles: ["1", "2"],
        currentPuzzleId: "2",
      };
      localStorage.setItem("mazeProgress", JSON.stringify(progressData));

      // Load progress
      const loaded = loadMazeProgressFromStorage();
      expect(loaded).toEqual(progressData);

      // Apply to store
      store.dispatch(loadProgress(loaded));

      const state = store.getState().mazeProgress;
      expect(state.completedPuzzles).toEqual(["1", "2"]);
      expect(state.currentPuzzleId).toBe("2");
      expect(state.completionPercentage).toBe(
        Math.round((2 / MAZE_PUZZLES.length) * 100)
      );
    });

    it("should calculate completion percentage correctly", () => {
      const totalPuzzles = MAZE_PUZZLES.length;

      // Complete first puzzle
      store.dispatch(completePuzzle("1"));
      expect(store.getState().mazeProgress.completionPercentage).toBe(
        Math.round((1 / totalPuzzles) * 100)
      );

      // Complete second puzzle
      store.dispatch(completePuzzle("2"));
      expect(store.getState().mazeProgress.completionPercentage).toBe(
        Math.round((2 / totalPuzzles) * 100)
      );
    });

    it("should use selectors correctly", () => {
      // Set up state
      store.dispatch(completePuzzle("1"));
      store.dispatch(completePuzzle("3"));
      store.dispatch(setCurrentPuzzle("2"));

      const state = store.getState();

      // Test selectors
      expect(selectMazeProgress(state).completedPuzzles).toEqual(["1", "3"]);
      expect(selectIsPuzzleCompleted("1")(state)).toBe(true);
      expect(selectIsPuzzleCompleted("2")(state)).toBe(false);
      expect(selectIsPuzzleCompleted("3")(state)).toBe(true);
    });

    it("should handle progress reset correctly", () => {
      // Set up some progress
      store.dispatch(completePuzzle("1"));
      store.dispatch(completePuzzle("2"));
      store.dispatch(setCurrentPuzzle("2"));

      // Verify progress exists
      let state = store.getState().mazeProgress;
      expect(state.completedPuzzles).toEqual(["1", "2"]);
      expect(state.currentPuzzleId).toBe("2");
      expect(state.completionPercentage).toBeGreaterThan(0);

      // Reset progress
      store.dispatch(resetProgress());

      // Verify progress is reset
      state = store.getState().mazeProgress;
      expect(state.completedPuzzles).toEqual([]);
      expect(state.currentPuzzleId).toBe(null);
      expect(state.completionPercentage).toBe(0);
    });
  });

  describe("Error Handling Scenarios", () => {
    it("should handle MazeEngine initialization errors", () => {
      // Mock engine constructor to throw error
      MockedMazeEngine.mockImplementation(() => {
        throw new Error("Invalid puzzle configuration");
      });

      const testPuzzle: MazePuzzle = {
        id: "invalid",
        titleKey: "invalid_title",
        descriptionKey: "invalid_desc",
        initialPosition: "invalid position",
        hintKey: "invalid_hint",
      };

      // Should throw error during render
      expect(() => {
        render(
          <TestWrapper store={store}>
            <MazeBoard
              puzzle={testPuzzle}
              onComplete={jest.fn()}
              showHints={false}
              onToggleHints={jest.fn()}
              onRestart={jest.fn()}
            />
          </TestWrapper>
        );
      }).toThrow("Invalid puzzle configuration");
    });

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error("Storage quota exceeded");
      });

      // Should not crash when saving progress
      expect(() => {
        store.dispatch(completePuzzle("1"));
      }).not.toThrow();

      // Restore localStorage
      localStorage.setItem = originalSetItem;
    });

    it("should handle invalid moves gracefully", async () => {
      const user = userEvent.setup();

      // Mock invalid move
      mockEngine.makeMove.mockReturnValue({
        success: false,
        error: "Invalid move",
      });

      const testPuzzle: MazePuzzle = {
        id: "test-invalid-move",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      const onComplete = jest.fn();

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={onComplete}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Try to make invalid move
      const moveButton = screen.getByTestId("piece-drop-handler");
      await user.click(moveButton);

      // Should not call completion callback for invalid move
      expect(onComplete).not.toHaveBeenCalled();
    });

    it("should handle restart functionality correctly", async () => {
      const user = userEvent.setup();

      const testPuzzle: MazePuzzle = {
        id: "test-restart",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      const onRestart = jest.fn();

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={onRestart}
          />
        </TestWrapper>
      );

      // Click restart button
      const restartButton = screen.getByText("Restart");
      await user.click(restartButton);

      // Verify restart callback was called
      expect(onRestart).toHaveBeenCalled();
    });

    it("should handle hint toggle functionality", async () => {
      const user = userEvent.setup();

      const testPuzzle: MazePuzzle = {
        id: "test-hints",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      const onToggleHints = jest.fn();

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={onToggleHints}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Click hints toggle button
      const hintsButton = screen.getByText("Toggle Hints");
      await user.click(hintsButton);

      // Verify toggle callback was called
      expect(onToggleHints).toHaveBeenCalled();
    });

    it("should handle time expiration correctly", async () => {
      // Mock time expiration
      mockEngine.getRemainingTime.mockReturnValue(0);
      mockEngine.isGameFailed.mockReturnValue(true);

      const testPuzzle: MazePuzzle = {
        id: "test-timed",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        timeLimit: 60,
        hintKey: "test_hint",
      };

      const onComplete = jest.fn();

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={onComplete}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Should detect time expiration and call failure
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith("failure");
      });
    });
  });

  describe("UI State Management", () => {
    it("should display counters correctly", () => {
      const testPuzzle: MazePuzzle = {
        id: "test-counters",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E6C/8/8/8/8/8/8/R7 w - - 0 1",
        maxMoves: 15,
        timeLimit: 120,
        hintKey: "test_hint",
      };

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Should display all counters
      expect(screen.getByText(/Checkpoints remaining: 1/)).toBeInTheDocument();
      expect(screen.getByText(/Moves remaining: 10/)).toBeInTheDocument();
      expect(screen.getByText(/Time remaining: 60/)).toBeInTheDocument();
    });

    it("should update counters after moves", async () => {
      const user = userEvent.setup();

      // Mock state changes after move
      let movesRemaining = 5;
      let checkpointsRemaining = 1;

      mockEngine.getRemainingMoves.mockImplementation(() => movesRemaining);
      mockEngine.getRemainingCheckpoints.mockImplementation(
        () => checkpointsRemaining
      );

      mockEngine.makeMove.mockImplementation(() => {
        movesRemaining--;
        return { success: true, gameComplete: false };
      });

      const testPuzzle: MazePuzzle = {
        id: "test-counter-updates",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E6C/8/8/8/8/8/8/R7 w - - 0 1",
        maxMoves: 5,
        hintKey: "test_hint",
      };

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Make a move
      const moveButton = screen.getByTestId("piece-drop-handler");
      await user.click(moveButton);

      // Counters should update
      await waitFor(() => {
        expect(mockEngine.getRemainingMoves).toHaveBeenCalled();
        expect(mockEngine.getRemainingCheckpoints).toHaveBeenCalled();
      });
    });

    it("should handle hint display correctly", () => {
      const testPuzzle: MazePuzzle = {
        id: "test-hints-display",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      // Test with hints enabled
      const { rerender } = render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={true}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Verify legal moves are calculated when hints are shown
      expect(mockEngine.getLegalMoves).toHaveBeenCalled();

      // Test with hints disabled
      rerender(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Should still work without hints
      expect(screen.getByTestId("chessboard")).toBeInTheDocument();
    });
  });

  describe("Data Validation and Edge Cases", () => {
    it("should handle puzzles without move limits", () => {
      const testPuzzle: MazePuzzle = {
        id: "test-unlimited",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
        // No maxMoves specified
      };

      mockEngine.getRemainingMoves.mockReturnValue(null);

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Should not display moves counter
      expect(screen.queryByText(/Moves remaining/)).not.toBeInTheDocument();
    });

    it("should handle puzzles without time limits", () => {
      const testPuzzle: MazePuzzle = {
        id: "test-untimed",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
        // No timeLimit specified
      };

      mockEngine.getRemainingTime.mockReturnValue(null);

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Should not display time counter
      expect(screen.queryByText(/Time remaining/)).not.toBeInTheDocument();
    });

    it("should handle puzzles without checkpoints", () => {
      const testPuzzle: MazePuzzle = {
        id: "test-no-checkpoints",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      mockEngine.getRemainingCheckpoints.mockReturnValue(0);
      mockEngine.areExitsActive.mockReturnValue(true);

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={jest.fn()}
            onRestart={jest.fn()}
          />
        </TestWrapper>
      );

      // Should not display checkpoint counter
      expect(
        screen.queryByText(/Checkpoints remaining/)
      ).not.toBeInTheDocument();
    });
  });
});
