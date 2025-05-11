import { createSlice, PayloadAction, Middleware } from "@reduxjs/toolkit";

export type SettingsState = {
  language: string;
  chessSet: string;
};

const getInitialSettings = (): SettingsState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
  }
  return {
    language: "en",
    chessSet: "1",
  };
};

const initialState: SettingsState = getInitialSettings();

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
  },
});

export const { setLanguage, setChessSet } = settingsSlice.actions;
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
