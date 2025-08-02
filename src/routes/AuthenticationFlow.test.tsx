import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  setAuthenticated,
  setLoading,
  clearAuthState,
} from "../store/settingsSlice";

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
    return (
      <div data-testid="login-page">
        <h1>Login Page</h1>
        <button data-testid="login-button">Login</button>
      </div>
    );
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

// Mock protected page components
const PuzzlesPage = () => <div data-testid="puzzles-page">Puzzles Page</div>;
const PlayPage = () => <div data-testid="play-page">Play Page</div>;
const AccountPage = () => <div data-testid="account-page">Account Page</div>;

// Simplified ProtectedRoute component for testing
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

// Test app component with routing simulation
const TestApp = ({
  store,
  currentRoute = "/",
  isAuthenticated = false,
}: {
  store: any;
  currentRoute?: string;
  isAuthenticated?: boolean;
}) => {
  const { RootRoute } = require("../components/RootRoute/RootRoute");

  // Simulate different routes
  const renderCurrentRoute = () => {
    switch (currentRoute) {
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
      case "/account":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AccountPage />
          </ProtectedRoute>
        );
      default:
        return <div data-testid="not-found">Not Found</div>;
    }
  };

  return (
    <Provider store={store}>
      <div data-testid="test-app">{renderCurrentRoute()}</div>
    </Provider>
  );
};

describe("Authentication Flow Integration Tests", () => {
  describe("Initial App Load", () => {
    it("should show login page when app loads with unauthenticated user", () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} />);

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
      expect(screen.getByText("Login Page")).toBeInTheDocument();
      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });

    it("should show loading state during initial authentication check", () => {
      const store = createTestStore({ isAuthenticated: false, loading: true });

      render(<TestApp store={store} />);

      expect(screen.getByTestId("loader")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
    });

    it("should show chess tutorial when app loads with authenticated user", () => {
      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(<TestApp store={store} />);

      expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });
  });

  describe("Authentication State Changes", () => {
    it("should transition from loading to login page when authentication check completes", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: true });

      render(<TestApp store={store} />);

      // Initially should show loader
      expect(screen.getByTestId("loader")).toBeInTheDocument();

      // Simulate authentication check completion
      store.dispatch(setLoading(false));

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    it("should transition from login page to chess tutorial after successful login", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} />);

      // Initially should show login page
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Simulate successful login
      store.dispatch(setAuthenticated(true));

      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
    });

    it("should transition from chess tutorial to login page after logout", async () => {
      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(<TestApp store={store} />);

      // Initially should show chess tutorial
      expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();

      // Simulate logout
      store.dispatch(clearAuthState());

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("chess-tutorial")).not.toBeInTheDocument();
      expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
    });
  });

  describe("Protected Route Access", () => {
    it("should redirect unauthenticated users from protected routes to root", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(
        <TestApp
          store={store}
          currentRoute="/puzzles"
          isAuthenticated={false}
        />
      );

      // Should show redirect message
      await waitFor(() => {
        expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("puzzles-page")).not.toBeInTheDocument();
    });

    it("should allow authenticated users to access protected routes", async () => {
      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(
        <TestApp store={store} currentRoute="/puzzles" isAuthenticated={true} />
      );

      await waitFor(() => {
        expect(screen.getByTestId("puzzles-page")).toBeInTheDocument();
      });

      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByTestId("redirect-to-root")).not.toBeInTheDocument();
    });

    it("should redirect to login when authentication is lost while on protected route", async () => {
      const store = createTestStore({ isAuthenticated: true, loading: false });

      const { rerender } = render(
        <TestApp store={store} currentRoute="/account" isAuthenticated={true} />
      );

      // Initially should show protected content
      await waitFor(() => {
        expect(screen.getByTestId("account-page")).toBeInTheDocument();
      });

      // Simulate authentication loss
      store.dispatch(clearAuthState());

      // Re-render to trigger state change
      rerender(
        <TestApp
          store={store}
          currentRoute="/account"
          isAuthenticated={false}
        />
      );

      // Should redirect to root
      await waitFor(() => {
        expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("account-page")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases and Error Scenarios", () => {
    it("should handle authentication state changes during loading", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: true });

      render(<TestApp store={store} />);

      // Should show loader initially
      expect(screen.getByTestId("loader")).toBeInTheDocument();

      // Change auth state while loading
      store.dispatch(setAuthenticated(true));

      // Should still show loader until loading is complete
      expect(screen.getByTestId("loader")).toBeInTheDocument();

      // Complete loading
      store.dispatch(setLoading(false));

      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    it("should handle rapid authentication state changes", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} />);

      // Start with login page
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Rapid state changes
      store.dispatch(setAuthenticated(true));
      store.dispatch(setAuthenticated(false));
      store.dispatch(setAuthenticated(true));

      await waitFor(() => {
        expect(screen.getByTestId("chess-tutorial")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    });

    it("should handle invalid routes gracefully", async () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} currentRoute="/invalid-route" />);

      // Should show not found page
      await waitFor(() => {
        expect(screen.getByTestId("not-found")).toBeInTheDocument();
      });
    });
  });

  describe("Layout Integration", () => {
    it("should properly wrap authenticated content in Layout", async () => {
      const store = createTestStore({ isAuthenticated: true, loading: false });

      render(
        <TestApp store={store} currentRoute="/puzzles" isAuthenticated={true} />
      );

      await waitFor(() => {
        expect(screen.getByTestId("puzzles-page")).toBeInTheDocument();
      });

      const layout = screen.getByTestId("layout");
      const puzzlesPage = screen.getByTestId("puzzles-page");

      expect(layout).toBeInTheDocument();
      expect(layout).toContainElement(puzzlesPage);
    });

    it("should not wrap login page in Layout", () => {
      const store = createTestStore({ isAuthenticated: false, loading: false });

      render(<TestApp store={store} />);

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
      expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
    });
  });
});
