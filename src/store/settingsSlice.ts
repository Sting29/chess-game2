import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SettingsState = {
  language: string;
  chessSet: string;
};

const initialState: SettingsState = {
  language: "en",
  chessSet: "default",
};

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
