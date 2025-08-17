import React from "react";
import { screen, render } from "@testing-library/react";
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
} from "../store/mazeProgressSlice";
import settingsReducer from "../store/settingsSlice";
import { MAZE_PUZZLES } from "../data/mazePuzzles";
import { MazePuzzle } from "../types/types";

// Mock dependencies
jest.mock("../utils/MazeEngine");

jest.mock("../components/CustomPieces/CustomPieces", () => ({
  useCustomPieces: () => ({ wR: () => <div data-testid="white-rook">♖</div> }),
}));

jest.mock("../components/PromotionDialog/PromotionDialog", () => ({
  PromotionDialog: ({ isOpen }: any) =>
    isOpen ? <div data-testid="promotion-dialog">Promotion</div> : null,
}));

// Mock the new MazeBoard hooks with simple implementations
jest.mock("../components/MazeBoard/hooks/useTimer", () => ({
  useTimer: () => ({ currentTime: 120 }),
}));

jest.mock("../components/MazeBoard/hooks/useDragAndDrop", () => ({
  useDragAndDrop: () => ({
    handleDragStart: jest.fn(),
    handleDragEnd: jest.fn(),
    handleDragOver: jest.fn(),
    handleDrop: jest.fn(),
  }),
}));

jest.mock("../components/MazeBoard/hooks/useMazeGame", () => ({
  useMazeGame: () => ({
    engine: {
      getGameState: () => ({
        position: new Map([["a1", "R"]]),
        walls: new Set(["b2"]),
        exits: new Set(["a8"]),
        checkpoints: new Set(["h8"]),
        remainingMoves: 10,
        remainingTime: 120,
      }),
      isGameComplete: () => false,
      isGameFailed: () => false,
      areExitsActive: () => false,
      updateRemainingTime: jest.fn(),
    },
    gameState: {
      position: new Map([["a1", "R"]]),
      walls: new Set(["b2"]),
      exits: new Set(["a8"]),
      checkpoints: new Set(["h8"]),
      remainingMoves: 10,
      remainingTime: 120,
    },
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
  }),
}));

// Mock MazeCounters
jest.mock("../components/MazeCounters/MazeCounters", () => ({
  MazeCounters: ({
    remainingCheckpoints,
    remainingMoves,
    remainingTime,
  }: any) => (
    <div data-testid="maze-counters">
      {remainingCheckpoints > 0 && (
        <div>Checkpoints remaining: {remainingCheckpoints}</div>
      )}
      {remainingMoves !== undefined && remainingMoves !== null && (
        <div>Moves remaining: {remainingMoves}</div>
      )}
      {remainingTime !== undefined && remainingTime !== null && (
        <div>Time remaining: 2:00</div>
      )}
    </div>
  ),
}));

// Mock MazeControls
jest.mock("../components/MazeControls/MazeControls", () => ({
  MazeControls: ({ showHints, onToggleHints, onRestart }: any) => (
    <div data-testid="maze-controls">
      <button onClick={onToggleHints}>Toggle Hints</button>
      <button onClick={onRestart}>Restart</button>
    </div>
  ),
}));

// Mock ChessCoordinates
jest.mock("../components/ChessCoordinates/ChessCoordinates", () => ({
  ChessCoordinates: () => (
    <div data-testid="chess-coordinates">Coordinates</div>
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
        maze_complete: "Maze completed!",
        toggle_hints: "Toggle Hints",
        restart: "Restart",
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
        boardOrientation: "white",
        pieceSet: "classic",
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

describe("Maze Puzzle Integration Tests (Simplified)", () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorage.clear();
    store = createTestStore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Component Rendering", () => {
    it("should render MazeBoard with all components", () => {
      const testPuzzle: MazePuzzle = {
        id: "test-1",
        titleKey: "maze_puzzle_1_title",
        descriptionKey: "maze_puzzle_1_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
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

      // Verify all main components are rendered
      expect(screen.getByTestId("maze-counters")).toBeInTheDocument();
      expect(screen.getByTestId("maze-controls")).toBeInTheDocument();
      expect(screen.getByTestId("chess-coordinates")).toBeInTheDocument();
      expect(screen.getByTestId("white-rook")).toBeInTheDocument();
    });

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
      expect(screen.getByText(/Time remaining: 2:00/)).toBeInTheDocument();
    });

    it("should handle control interactions", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const onToggleHints = jest.fn();
      const onRestart = jest.fn();

      const testPuzzle: MazePuzzle = {
        id: "test-controls",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
      };

      render(
        <TestWrapper store={store}>
          <MazeBoard
            puzzle={testPuzzle}
            onComplete={jest.fn()}
            showHints={false}
            onToggleHints={onToggleHints}
            onRestart={onRestart}
          />
        </TestWrapper>
      );

      // Test hint toggle
      const hintsButton = screen.getByText("Toggle Hints");
      await user.click(hintsButton);
      expect(onToggleHints).toHaveBeenCalled();

      // Test restart
      const restartButton = screen.getByText("Restart");
      await user.click(restartButton);
      expect(onRestart).toHaveBeenCalled();
    });
  });

  describe("Redux State Management", () => {
    it("should update Redux state when puzzle is completed", () => {
      // Initial state should have no completed puzzles
      expect(store.getState().mazeProgress.completedPuzzles).toEqual([]);
      expect(store.getState().mazeProgress.completionPercentage).toBe(0);

      // Complete a puzzle
      store.dispatch(completePuzzle("1"));
      store.dispatch(setCurrentPuzzle("1"));

      // Check state update
      const state = store.getState().mazeProgress;
      expect(state.completedPuzzles).toContain("1");
      expect(state.completionPercentage).toBeGreaterThan(0);
      expect(state.currentPuzzleId).toBe("1");
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

  describe("Edge Cases", () => {
    it("should handle puzzles without move limits", () => {
      const testPuzzle: MazePuzzle = {
        id: "test-unlimited",
        titleKey: "test_title",
        descriptionKey: "test_desc",
        initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "test_hint",
        // No maxMoves specified
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

      // Should still render without moves counter
      expect(screen.getByTestId("maze-counters")).toBeInTheDocument();
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

      // Should still render
      expect(screen.getByTestId("maze-counters")).toBeInTheDocument();
    });
  });
});
