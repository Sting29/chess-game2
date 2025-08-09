// Test utilities for rendering components with providers

import React, { ReactElement } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

// Mock i18n instance for tests
const mockI18n = i18n.createInstance();
mockI18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        // Common translations used in tests
        your_turn: "Your turn (white)",
        your_turn_kids: "Your turn! Make a move!",
        computer_thinking: "Computer is thinking...",
        checkmate_white_wins: "Checkmate! White wins!",
        checkmate_black_wins: "Checkmate! Black wins!",
        draw: "Draw",
        stalemate: "Stalemate",
        game_over: "Game over",
        game_error: "Game error occurred",
        fun_message_1: "Nice move!",
        fun_message_2: "Good thinking!",
        fun_message_3: "Keep it up!",
        fun_message_4: "Great job!",
      },
    },
  },
});

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // Add minimal reducers for testing
      game: (state = { currentGame: null }, action) => state,
      auth: (state = { user: null, isAuthenticated: false }, action) => state,
      settings: (state = { theme: "light", language: "en" }, action) => state,
    },
    preloadedState: initialState,
  });
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialState?: any;
  store?: any;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    initialState = {},
    store = createMockStore(initialState),
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={mockI18n}>{children}</I18nextProvider>
      </Provider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock game settings factory
export const createMockGameSettings = (overrides = {}) => ({
  skill: 0,
  depth: 1,
  time: 300,
  MultiPV: 3,
  threads: 1,
  kidsMode: false,
  ...overrides,
});

// Mock UI settings factory
export const createMockUISettings = (overrides = {}) => ({
  showLastMoveArrow: true,
  showThreatHighlight: false,
  showMoveHints: false,
  enableSoundEffects: true,
  ...overrides,
});

// Helper to wait for engine initialization
export const waitForEngineInitialization = async () => {
  // Wait for mock engine to "initialize"
  await new Promise((resolve) => setTimeout(resolve, 50));
};

// Helper to create mock chess position
export const createMockChessPosition = (fen?: string) => {
  return fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
};

// Helper to create mock auth response
export const createMockAuthResponse = (overrides = {}) => ({
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  token_type: "Bearer",
  session_id: "mock-session-id",
  user: {
    id: "mock-user-id",
    email: "test@example.com",
    username: "testuser",
    role: "student",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  ...overrides,
});

// Helper to create mock HTTP error
export const createMockHttpError = (
  status: number,
  message: string,
  config = {}
) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    data: { message },
    headers: {},
    config,
  };
  error.config = config;
  error.isAxiosError = true;
  error.name = "AxiosError";
  error.toJSON = () => ({});
  return error;
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
