import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { progressService } from "../api";
import {
  Progress,
  CreateProgressRequest,
  UpdateProgressRequest,
  UserProgressUpdateRequest,
} from "../api/types/progress";

// Async thunks for API calls
export const fetchAllProgress = createAsyncThunk(
  "progress/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await progressService.getAllProgress();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProgressById = createAsyncThunk(
  "progress/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await progressService.getProgressById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProgress = createAsyncThunk(
  "progress/create",
  async (data: CreateProgressRequest, { rejectWithValue }) => {
    try {
      return await progressService.createProgress(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProgressById = createAsyncThunk(
  "progress/updateById",
  async (
    { id, data }: { id: string; data: UpdateProgressRequest },
    { rejectWithValue }
  ) => {
    try {
      return await progressService.updateProgressById(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProgressById = createAsyncThunk(
  "progress/deleteById",
  async (id: string, { rejectWithValue }) => {
    try {
      await progressService.deleteProgressById(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCompletedItem = createAsyncThunk(
  "progress/addCompletedItem",
  async ({ id, item }: { id: string; item: string }, { rejectWithValue }) => {
    try {
      return await progressService.addCompletedItem(id, item);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeCompletedItem = createAsyncThunk(
  "progress/removeCompletedItem",
  async ({ id, item }: { id: string; item: string }, { rejectWithValue }) => {
    try {
      return await progressService.removeCompletedItem(id, item);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProgress = createAsyncThunk(
  "progress/updateUserProgress",
  async (
    { userId, data }: { userId: string; data: UserProgressUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      return await progressService.updateUserProgress(userId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// State interface
interface ProgressState {
  items: Progress[];
  currentProgress: Progress | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

// Initial state
const initialState: ProgressState = {
  items: [],
  currentProgress: null,
  loading: false,
  error: null,
  lastFetch: null,
};

// Slice
const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProgress: (state) => {
      state.currentProgress = null;
    },
    setCurrentProgress: (state, action: PayloadAction<Progress>) => {
      state.currentProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all progress
    builder
      .addCase(fetchAllProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchAllProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch progress by ID
    builder
      .addCase(fetchProgressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProgress = action.payload;

        // Update in items array if exists
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchProgressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create progress
    builder
      .addCase(createProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.currentProgress = action.payload;
      })
      .addCase(createProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update progress by ID
    builder
      .addCase(updateProgressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgressById.fulfilled, (state, action) => {
        state.loading = false;

        // Update in items array
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }

        // Update current progress if it's the same item
        if (state.currentProgress?.id === action.payload.id) {
          state.currentProgress = action.payload;
        }
      })
      .addCase(updateProgressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete progress by ID
    builder
      .addCase(deleteProgressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgressById.fulfilled, (state, action) => {
        state.loading = false;

        // Remove from items array
        state.items = state.items.filter((item) => item.id !== action.payload);

        // Clear current progress if it was deleted
        if (state.currentProgress?.id === action.payload) {
          state.currentProgress = null;
        }
      })
      .addCase(deleteProgressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add completed item
    builder.addCase(addCompletedItem.fulfilled, (state, action) => {
      // Update in items array
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }

      // Update current progress if it's the same item
      if (state.currentProgress?.id === action.payload.id) {
        state.currentProgress = action.payload;
      }
    });

    // Remove completed item
    builder.addCase(removeCompletedItem.fulfilled, (state, action) => {
      // Update in items array
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }

      // Update current progress if it's the same item
      if (state.currentProgress?.id === action.payload.id) {
        state.currentProgress = action.payload;
      }
    });

    // Update user progress
    builder
      .addCase(updateUserProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProgress.fulfilled, (state, action) => {
        state.loading = false;

        // Convert UserProgressResponse to Progress format for consistency
        const progressItem: Progress = {
          id: action.payload.id,
          user: action.payload.user,
          type: action.payload.type,
          category: action.payload.category,
          completed: action.payload.completed,
        };

        // Update in items array if exists, otherwise add new item
        const index = state.items.findIndex(
          (item) => item.id === progressItem.id
        );
        if (index !== -1) {
          state.items[index] = progressItem;
        } else {
          state.items.push(progressItem);
        }

        // Update current progress if it's the same item
        if (state.currentProgress?.id === progressItem.id) {
          state.currentProgress = progressItem;
        }
      })
      .addCase(updateUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, clearCurrentProgress, setCurrentProgress } =
  progressSlice.actions;

// Selectors
export const selectAllProgress = (state: { progress: ProgressState }) =>
  state.progress.items;
export const selectCurrentProgress = (state: { progress: ProgressState }) =>
  state.progress.currentProgress;
export const selectProgressLoading = (state: { progress: ProgressState }) =>
  state.progress.loading;
export const selectProgressError = (state: { progress: ProgressState }) =>
  state.progress.error;
export const selectLastFetch = (state: { progress: ProgressState }) =>
  state.progress.lastFetch;

// Utility selectors
export const selectProgressByCategory =
  (category: string) => (state: { progress: ProgressState }) =>
    state.progress.items.filter((item) => item.category === category);

export const selectProgressByType =
  (type: string) => (state: { progress: ProgressState }) =>
    state.progress.items.filter((item) => item.type === type);

export const selectIsItemCompleted =
  (category: string, item: string) => (state: { progress: ProgressState }) =>
    state.progress.items
      .filter((progress) => progress.category === category)
      .some((progress) => progress.completed.includes(item));

// Export reducer
export default progressSlice.reducer;
