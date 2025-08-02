import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { RootRoute } from "./RootRoute";
import settingsReducer from "../../store/settingsSlice";

// Mock axios and services to avoid import issues
jest.mock("axios");
jest.mock("../../services", () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
  },
  userService: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    updateLanguage: jest.fn(),
    updateAvatarAndGender: jest.fn(),
    updateChessSet: jest.fn(),
  },
}));

// Mock the components that RootRoute renders
jest.mock("../../pages/LoginPage/LoginPage", () => ({
  LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

jest.mock("../../pages/ChessTutorial/ChessTutorial", () => ({
  __esModule: true,
  default: () => <div data-testid="chess-tutorial">Chess Tutorial</div>,
}));

jest.mock("../../Layout/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock("../Loader/Loader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Helper function to create a test store with custom initial state
const createTestStore = (initialState: any) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        language: "he",
        chessSet: "1",
        isAuthenticated: false,
        loading: false,
        ...initialState,
      },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

// Helper function to render RootRoute with Redux provider
const renderRootRoute = (initialState: any = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <RootRoute />
    </Provider>
  );
};

describe("RootRoute Component", () => {
  describe("Loading State", () => {
    it("should render Loader component when loading is true", () => {
      renderRootRoute({ loading: true });

      expect(screen.getByTestId("loader")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });

    it("should render Loader regardless of authentication state when loading", () => {
      renderRootRoute({ loading: true, isAuthenticated: true });

      expect(screen.getByTestId("loader")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated State", () => {
    it("should render LoginPage when user is not authenticated and not loading", () => {
      renderRootRoute({ isAuthenticated: false, loading: false });

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
      expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    it("should render LoginPage without Layout wrapper when unauthenticated", () => {
      renderRootRoute({ isAuthenticated: false, loading: false });

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
      expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
    });
  });

  describe("Authenticated State", () => {
    it("should render ChessTutorial with Layout when user is authenticated and not loading", () => {
      renderRootRoute({ isAuthenticated: true, loading: false });

      expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    it("should wrap ChessTutorial in Layout component when authenticated", () => {
      renderRootRoute({ isAuthenticated: true, loading: false });

      const layout = screen.getByTestId("layout");
      const chessTutorial = screen.getByTestId("chess-tutorial");

      expect(layout).toBeInTheDocument();
      expect(chessTutorial).toBeInTheDocument();
      expect(layout).toContainElement(chessTutorial);
    });
  });

  describe("Redux State Integration", () => {
    it("should respond to changes in authentication state", () => {
      const { rerender } = renderRootRoute({
        isAuthenticated: false,
        loading: false,
      });

      // Initially should show login page
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Re-render with authenticated state
      const authenticatedStore = createTestStore({
        isAuthenticated: true,
        loading: false,
      });
      rerender(
        <Provider store={authenticatedStore}>
          <RootRoute />
        </Provider>
      );

      expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });

    it("should respond to changes in loading state", () => {
      const { rerender } = renderRootRoute({
        isAuthenticated: false,
        loading: false,
      });

      // Initially should show login page
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Re-render with loading state
      const loadingStore = createTestStore({
        isAuthenticated: false,
        loading: true,
      });
      rerender(
        <Provider store={loadingStore}>
          <RootRoute />
        </Provider>
      );

      expect(screen.getByTestId("loader")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined user state gracefully", () => {
      renderRootRoute({
        isAuthenticated: false,
        loading: false,
        user: undefined,
      });

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("should prioritize loading state over authentication state", () => {
      renderRootRoute({
        isAuthenticated: true,
        loading: true,
      });

      expect(screen.getByTestId("loader")).toBeInTheDocument();
      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });

    it("should handle missing Redux state gracefully", () => {
      const storeWithMinimalState = configureStore({
        reducer: {
          settings: settingsReducer,
        },
        preloadedState: {
          settings: {
            language: "he",
            chessSet: "1",
            isAuthenticated: false,
            loading: false,
          },
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      });

      render(
        <Provider store={storeWithMinimalState}>
          <RootRoute />
        </Provider>
      );

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });
});
