import {
  createSlice,
  PayloadAction,
  Middleware,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  User,
  LoginRequest,
  UpdateProfileRequest,
  ChessSet,
} from "../services/types";
import { authService, userService } from "../services";

export type SettingsState = {
  language: string;
  chessSet: string;
  user?: User;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
};

const getInitialSettings = (): SettingsState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all required fields are present
        return {
          language: parsed.language || "he",
          chessSet: parsed.chessSet || "1",
          user: parsed.user,
          isAuthenticated: parsed.isAuthenticated || false,
          loading: false,
          error: undefined,
        };
      } catch {}
    }
  }
  return {
    language: "he",
    chessSet: "1",
    isAuthenticated: false,
    loading: false,
  };
};

const initialState: SettingsState = getInitialSettings();

// Helper function to convert API chess set to local format
const convertApiChessSetToLocal = (apiChessSet: ChessSet): string => {
  switch (apiChessSet) {
    case ChessSet.Set1:
      return "1";
    case ChessSet.Set2:
      return "2";
    case ChessSet.Set3:
      return "3";
    case ChessSet.Set4:
      return "4";
    default:
      return "1"; // fallback to first set
  }
};

// Async thunks for API operations
export const loginUser = createAsyncThunk(
  "settings/loginUser",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "settings/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const loadUserProfile = createAsyncThunk(
  "settings/loadUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await userService.getProfile();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load profile");
    }
  }
);

export const updateUserProfileAsync = createAsyncThunk(
  "settings/updateUserProfile",
  async (profileData: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const user = await userService.updateProfile(profileData);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const updateLanguageAsync = createAsyncThunk(
  "settings/updateLanguage",
  async (language: "he" | "en" | "ar" | "ru", { rejectWithValue }) => {
    try {
      const user = await userService.updateLanguage(language);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update language");
    }
  }
);

export const updateChessSetAsync = createAsyncThunk(
  "settings/updateChessSet",
  async (chessSet: ChessSet, { rejectWithValue }) => {
    try {
      const user = await userService.updateChessSet(chessSet);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update chess set");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setChessSet(state, action: PayloadAction<string>) {
      state.chessSet = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = undefined;
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.user = undefined;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthState(state) {
      state.user = undefined;
      state.isAuthenticated = false;
      state.error = undefined;
      state.loading = false;
    },
    updateUserProfile(state, action: PayloadAction<User>) {
      if (state.user) {
        state.user = action.payload;
        // Sync language and chess set with user profile
        if (action.payload.profile?.language) {
          state.language = action.payload.profile.language;
        }
        if (action.payload.profile?.chessSet) {
          state.chessSet = convertApiChessSetToLocal(
            action.payload.profile.chessSet
          );
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = undefined;
        // Sync language and chess set from user profile
        if (action.payload.user.profile?.language) {
          state.language = action.payload.user.profile.language;
        }
        if (action.payload.user.profile?.chessSet) {
          state.chessSet = convertApiChessSetToLocal(
            action.payload.user.profile.chessSet
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = undefined;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = undefined;
        state.isAuthenticated = false;
        state.error = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Still clear auth state even if logout API call failed
        state.user = undefined;
        state.isAuthenticated = false;
      });

    // Load user profile
    builder
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = undefined;
        // Sync language and chess set from user profile
        if (action.payload.profile?.language) {
          state.language = action.payload.profile.language;
        }
        if (action.payload.profile?.chessSet) {
          state.chessSet = convertApiChessSetToLocal(
            action.payload.profile.chessSet
          );
        }
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = undefined;
        // Sync language and chess set from updated profile
        if (action.payload.profile?.language) {
          state.language = action.payload.profile.language;
        }
        if (action.payload.profile?.chessSet) {
          state.chessSet = convertApiChessSetToLocal(
            action.payload.profile.chessSet
          );
        }
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update language
    builder
      .addCase(updateLanguageAsync.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateLanguageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = undefined;
        // Update language immediately
        if (action.payload.profile?.language) {
          state.language = action.payload.profile.language;
        }
      })
      .addCase(updateLanguageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update chess set
    builder
      .addCase(updateChessSetAsync.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateChessSetAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = undefined;
        // Update chess set immediately
        if (action.payload.profile?.chessSet) {
          state.chessSet = convertApiChessSetToLocal(
            action.payload.profile.chessSet
          );
        }
      })
      .addCase(updateChessSetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLanguage,
  setChessSet,
  setUser,
  setAuthenticated,
  setLoading,
  setError,
  clearAuthState,
  updateUserProfile,
} = settingsSlice.actions;
export default settingsSlice.reducer;

export const settingsLocalStorageMiddleware: Middleware<{}, any> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    try {
      localStorage.setItem("settings", JSON.stringify(state.settings));
    } catch {}
    return result;
  };

// Profile synchronization middleware for i18next integration
export const profileSyncMiddleware: Middleware<{}, any> =
  (store) => (next) => (action: any) => {
    const result = next(action);
    const state = store.getState();

    // Check if language changed and sync with i18next
    if (
      action.type &&
      (action.type.includes("language") ||
        action.type.includes("loginUser/fulfilled") ||
        action.type.includes("loadUserProfile/fulfilled") ||
        action.type.includes("updateLanguageAsync/fulfilled"))
    ) {
      try {
        // Dynamic import to avoid circular dependency
        import("../i18n")
          .then((i18nModule) => {
            const currentLanguage = state.settings.language;
            if (i18nModule.default.language !== currentLanguage) {
              i18nModule.default.changeLanguage(currentLanguage);
            }
          })
          .catch((error) => {
            console.error("Failed to sync language with i18next:", error);
          });
      } catch (error) {
        console.error("Failed to import i18n module:", error);
      }
    }

    return result;
  };
