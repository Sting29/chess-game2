import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  settingsLocalStorageMiddleware,
} from "./settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(settingsLocalStorageMiddleware as any),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
