import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  settingsLocalStorageMiddleware,
  profileSyncMiddleware,
} from "./settingsSlice";
import mazeProgressReducer, {
  mazeProgressLocalStorageMiddleware,
  loadMazeProgressFromStorage,
  loadProgress,
} from "./mazeProgressSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    mazeProgress: mazeProgressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      settingsLocalStorageMiddleware as any,
      profileSyncMiddleware as any,
      mazeProgressLocalStorageMiddleware as any
    ),
});

// Load maze progress from localStorage on app start
const savedMazeProgress = loadMazeProgressFromStorage();
if (Object.keys(savedMazeProgress).length > 0) {
  store.dispatch(loadProgress(savedMazeProgress));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
