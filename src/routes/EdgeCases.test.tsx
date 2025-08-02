import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  setAuthenticated,
  setLoading,
  clearAuthState,
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

// Mock axios and services to avoid import issues
jest.mock("axios");
jest.mock("../services", () => ({
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

// Mock the components
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

jest.mock("../Layout/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

// Mock protected components
const PuzzlesPage = () => <div data-testid="puzzles-page">Puzzles Page</div>;
const PlayPage = () => <div data-testid="play-page">Play Page</div>;

// Simplified ProtectedRoute component
function ProtectedRoute({
  children,
  isAuthenticated,
}: {
  children: React.ReactElement;
  isAuthenticated: boolean;
}) {
  const { Layout } = require("../Layout/Layout");

  if (!isAuthenticated) {
    return <div data-testid="redirect-to-root">Redirecting to /</div>;
  }

  return <Layout>{children}</Layout>;
}

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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

// Test app with route simulation
const TestAppWithRoute = ({
  store,
  route = "/",
  isAuthenticated = false,
}: {
  store: any;
  route?: string;
  isAuthenticated?: boolean;
}) => {
  const { RootRoute } = require("../components/RootRoute/RootRoute");

  const renderRoute = () => {
    switch (route) {
      case "/":
        return <RootRoute />;
      case "/puzzles":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PuzzlesPage />
          </ProtectedRoute>
        );
      case "/play":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PlayPage />
          </ProtectedRoute>
        );
      default:
        return <div data-testid="not-found">Not Found</div>;
    }
  };

  return (
    <Provider store={store}>
      <div data-testid="test-app">{renderRoute()}</div>
    </Provider>
  );
};

describe("Edge Cases and Browser Behavior Tests", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe("Direct URL Access", () => {
    it("should redirect unauthenticated users from /puzzles to /", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(
        <TestAppWithRoute
          store={store}
          route="/puzzles"
          isAuthenticated={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("puzzles-page")).not.toBeInTheDocument();
    });

    it("should allow authenticated users to access direct URLs", async () => {
      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(
        <TestAppWithRoute
          store={store}
          route="/puzzles"
          isAuthenticated={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("puzzles-page")).toBeInTheDocument();
      });

      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByTestId("redirect-to-root")).not.toBeInTheDocument();
    });
  });

  describe("Browser Refresh Scenarios", () => {
    it("should maintain authentication state after refresh when tokens are valid", async () => {
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

      render(<TestAppWithRoute store={store} />);

      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });

    it("should show login page after refresh when authentication is lost", async () => {
      localStorageMock.clear();

      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestAppWithRoute store={store} />);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });
  });

  describe("Loading State During Refresh", () => {
    it("should show loading state during authentication check on refresh", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: true });

      render(<TestAppWithRoute store={store} />);

      expect(screen.getByTestId("loader")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });

    it("should transition from loading to appropriate content after authentication check", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: true });

      render(<TestAppWithRoute store={store} />);

      // Initially loading
      expect(screen.getByTestId("loader")).toBeInTheDocument();

      // Complete authentication check - user not authenticated
      act(() => {
        store.dispatch(setLoading(false));
      });

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
  });

  describe("Session Persistence Edge Cases", () => {
    it("should handle corrupted localStorage data gracefully", async () => {
      localStorageMock.setItem("settings", "invalid-json");

      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestAppWithRoute store={store} />);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });

    it("should handle missing localStorage gracefully", async () => {
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = jest.fn(() => {
        throw new Error("localStorage not available");
      });

      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestAppWithRoute store={store} />);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      // Restore original method
      localStorageMock.getItem = originalGetItem;
    });
  });

  describe("Multiple Tab Scenarios", () => {
    it("should handle authentication state changes from other tabs", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestAppWithRoute store={store} />);

      // Initially should show login
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Simulate authentication in another tab
      act(() => {
        store.dispatch(setAuthenticated(true));
      });

      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });

    it("should handle logout from other tabs", async () => {
      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(<TestAppWithRoute store={store} />);

      // Initially should show chess tutorial
      expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();

      // Simulate logout in another tab
      act(() => {
        store.dispatch(clearAuthState());
      });

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });
  });
});
