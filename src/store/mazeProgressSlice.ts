import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAZE_PUZZLES } from "../data/mazePuzzles";

interface MazeProgressState {
  completedPuzzles: string[];
  currentPuzzleId: string | null;
  totalPuzzles: number;
  completionPercentage: number;
}

const initialState: MazeProgressState = {
  completedPuzzles: [],
  currentPuzzleId: null,
  totalPuzzles: MAZE_PUZZLES.length,
  completionPercentage: 0,
};

const mazeProgressSlice = createSlice({
  name: "mazeProgress",
  initialState,
  reducers: {
    completePuzzle: (state, action: PayloadAction<string>) => {
      const puzzleId = action.payload;
      if (!state.completedPuzzles.includes(puzzleId)) {
        state.completedPuzzles.push(puzzleId);
        state.completionPercentage = Math.round(
          (state.completedPuzzles.length / state.totalPuzzles) * 100
        );
      }
    },

    setCurrentPuzzle: (state, action: PayloadAction<string | null>) => {
      state.currentPuzzleId = action.payload;
    },

    resetProgress: (state) => {
      state.completedPuzzles = [];
      state.currentPuzzleId = null;
      state.completionPercentage = 0;
    },

    loadProgress: (
      state,
      action: PayloadAction<Partial<MazeProgressState>>
    ) => {
      const { completedPuzzles, currentPuzzleId } = action.payload;

      if (completedPuzzles) {
        state.completedPuzzles = completedPuzzles;
        state.completionPercentage = Math.round(
          (completedPuzzles.length / state.totalPuzzles) * 100
        );
      }

      if (currentPuzzleId !== undefined) {
        state.currentPuzzleId = currentPuzzleId;
      }
    },

    updateTotalPuzzles: (state, action: PayloadAction<number>) => {
      state.totalPuzzles = action.payload;
      state.completionPercentage = Math.round(
        (state.completedPuzzles.length / state.totalPuzzles) * 100
      );
    },
  },
});

export const {
  completePuzzle,
  setCurrentPuzzle,
  resetProgress,
  loadProgress,
  updateTotalPuzzles,
} = mazeProgressSlice.actions;

export default mazeProgressSlice.reducer;

// Selectors
export const selectMazeProgress = (state: {
  mazeProgress: MazeProgressState;
}) => state.mazeProgress;
export const selectCompletedPuzzles = (state: {
  mazeProgress: MazeProgressState;
}) => state.mazeProgress.completedPuzzles;
export const selectCurrentPuzzle = (state: {
  mazeProgress: MazeProgressState;
}) => state.mazeProgress.currentPuzzleId;
export const selectCompletionPercentage = (state: {
  mazeProgress: MazeProgressState;
}) => state.mazeProgress.completionPercentage;
export const selectTotalPuzzles = (state: {
  mazeProgress: MazeProgressState;
}) => state.mazeProgress.totalPuzzles;

// Helper selector to check if a specific puzzle is completed
export const selectIsPuzzleCompleted =
  (puzzleId: string) => (state: { mazeProgress: MazeProgressState }) =>
    state.mazeProgress.completedPuzzles.includes(puzzleId);
// Middleware for localStorage persistence
export const mazeProgressLocalStorageMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    // Save to localStorage after state changes
    if (action.type.startsWith("mazeProgress/")) {
      try {
        const state = store.getState().mazeProgress;
        localStorage.setItem(
          "mazeProgress",
          JSON.stringify({
            completedPuzzles: state.completedPuzzles,
            currentPuzzleId: state.currentPuzzleId,
          })
        );
      } catch (error) {
        console.warn("Failed to save maze progress to localStorage:", error);
      }
    }

    return result;
  };

// Function to load progress from localStorage
export const loadMazeProgressFromStorage = (): Partial<MazeProgressState> => {
  try {
    const saved = localStorage.getItem("mazeProgress");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn("Failed to load maze progress from localStorage:", error);
  }
  return {};
};
