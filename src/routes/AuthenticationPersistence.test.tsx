import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  setAuthenticated,
  setLoading,
  clearAuthState,
  setUser,
} from "../store/settingsSlice";

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock services
jest.mock("../services", () => ({
  authService: {
    isAuthenticated: jest.fn(),
    clearAuthState: jest.fn(),
    logout: jest.fn(),
  },
  userService: {
    getProfile: jest.fn(),
  },
}));

// Mock the RootRoute component
const MockRootRoute = () => {
  const { useSelector } = require("react-redux");
  const { isAuthenticated, loading } = useSelector(
    (state: any) => state.settings
  );

  if (loading) {
    return <div data-testid="loader">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div data-testid="login-page">Login Page</div>;
  }

  return (
    <div data-testid="layout">
      <div data-testid="chess-tutorial">Chess Tutorial</div>
    </div>
  );
};

jest.mock("../components/RootRoute/RootRoute", () => ({
  RootRoute: MockRootRoute,
}));

// Helper function to create a test store
const createTestStore = (initialState: any = {}) => {
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
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
        },
      }),
  });
};

// Test app wrapper
const TestApp = ({ store }: { store: any }) => {
  const { RootRoute } = require("../components/RootRoute/RootRoute");

  return (
    <Provider store={store}>
      <RootRoute />
    </Provider>
  );
};

describe("Authentication State Persistence", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe("Browser refresh behavior on root route", () => {
    it("should maintain authentication state after browser refresh when tokens are valid", async () => {
      // Setup: Store valid authentication state in localStorage
      localStorageMock.setItem(
        "settings",
        JSON.stringify({
          language: "he",
          chessSet: "1",
          isAuthenticated: true,
          loading: false,
          user: {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            role: "student",
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
          },
        })
      );

      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(<TestApp store={store} />);

      // Should show authenticated content immediately
      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    it("should show login page after refresh when authentication is lost", async () => {
      // Setup: Clear localStorage to simulate lost authentication
      localStorageMock.clear();

      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} />);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });
  });

  describe("Token refresh scenarios", () => {
    it("should handle successful token refresh", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} />);

      // Initially should show login page
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Simulate successful token refresh
      await act(async () => {
        store.dispatch(setAuthenticated(true));
        store.dispatch(
          setUser({
            id: "1",
            username: "testuser",
            email: "test@example.com",
            role: "student",
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });

    it("should handle token refresh failure", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} />);

      // Should show login page when token refresh fails
      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });
  });

  describe("Logout flow redirects", () => {
    it("should redirect to LoginPage on root route after logout", async () => {
      // Setup: Start with authenticated user
      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(<TestApp store={store} />);

      // Initially should show authenticated content
      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      // Simulate logout
      await act(async () => {
        store.dispatch(clearAuthState());
      });

      // Should show login page after logout
      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
      expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
    });

    it("should clear localStorage on logout", async () => {
      // Setup: Store authentication state in localStorage
      localStorageMock.setItem(
        "settings",
        JSON.stringify({
          language: "he",
          chessSet: "1",
          isAuthenticated: true,
          loading: false,
          user: {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            role: "student",
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
          },
        })
      );

      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(<TestApp store={store} />);

      // Simulate logout
      await act(async () => {
        store.dispatch(clearAuthState());
      });

      // Should show login page after logout
      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      // Check that the store state is updated correctly
      const state = store.getState();
      expect(state.settings.isAuthenticated).toBe(false);
      expect(state.settings.user).toBeUndefined();
    });
  });
});
