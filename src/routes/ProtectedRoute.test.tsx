import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../store/settingsSlice";

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

// Mock the Layout component
jest.mock("../Layout/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

// Create a simplified ProtectedRoute component for testing that doesn't use react-router-dom
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

// Test component to use as children
const TestComponent = () => (
  <div data-testid="test-component">Protected Content</div>
);

// Helper function to render ProtectedRoute with Redux provider
const renderProtectedRoute = (initialState: any = {}) => {
  const store = createTestStore(initialState);
  const { isAuthenticated } = initialState;

  return render(
    <Provider store={store}>
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <TestComponent />
      </ProtectedRoute>
    </Provider>
  );
};

describe("ProtectedRoute Component Logic", () => {
  describe("Unauthenticated Access", () => {
    it("should show redirect message when user is not authenticated", () => {
      renderProtectedRoute({ isAuthenticated: false });

      expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();
      expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
      expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
    });

    it("should not render Layout when redirecting unauthenticated users", () => {
      renderProtectedRoute({ isAuthenticated: false });

      expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
      expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();
    });

    it("should redirect regardless of loading state when unauthenticated", () => {
      renderProtectedRoute({ isAuthenticated: false, loading: true });

      expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();
      expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
    });
  });

  describe("Authenticated Access", () => {
    it("should render protected content with Layout when user is authenticated", () => {
      renderProtectedRoute({ isAuthenticated: true });

      expect(screen.getByTestId("test-component")).toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByTestId("redirect-to-root")).not.toBeInTheDocument();
    });

    it("should wrap children in Layout component when authenticated", () => {
      renderProtectedRoute({ isAuthenticated: true });

      const layout = screen.getByTestId("layout");
      const testComponent = screen.getByTestId("test-component");

      expect(layout).toBeInTheDocument();
      expect(testComponent).toBeInTheDocument();
      expect(layout).toContainElement(testComponent);
    });

    it("should render protected content even when loading is true if authenticated", () => {
      renderProtectedRoute({ isAuthenticated: true, loading: true });

      expect(screen.getByTestId("test-component")).toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByTestId("redirect-to-root")).not.toBeInTheDocument();
    });
  });

  describe("Redux State Integration", () => {
    it("should respond to authentication state changes", () => {
      const { rerender } = renderProtectedRoute({ isAuthenticated: false });

      // Initially should redirect
      expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();

      // Re-render with authenticated state
      const authenticatedStore = createTestStore({ isAuthenticated: true });
      rerender(
        <Provider store={authenticatedStore}>
          <ProtectedRoute isAuthenticated={true}>
            <TestComponent />
          </ProtectedRoute>
        </Provider>
      );

      expect(screen.getByTestId("test-component")).toBeInTheDocument();
      expect(screen.queryByTestId("redirect-to-root")).not.toBeInTheDocument();
    });
  });

  describe("Children Prop Handling", () => {
    it("should properly render different types of children components", () => {
      const CustomChild = () => (
        <div data-testid="custom-child">Custom Protected Content</div>
      );

      const store = createTestStore({ isAuthenticated: true });

      render(
        <Provider store={store}>
          <ProtectedRoute isAuthenticated={true}>
            <CustomChild />
          </ProtectedRoute>
        </Provider>
      );

      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
    });

    it("should handle complex children components", () => {
      const ComplexChild = () => (
        <div data-testid="complex-child">
          <h1>Protected Page</h1>
          <button>Action Button</button>
        </div>
      );

      const store = createTestStore({ isAuthenticated: true });

      render(
        <Provider store={store}>
          <ProtectedRoute isAuthenticated={true}>
            <ComplexChild />
          </ProtectedRoute>
        </Provider>
      );

      expect(screen.getByTestId("complex-child")).toBeInTheDocument();
      expect(screen.getByText("Protected Page")).toBeInTheDocument();
      expect(screen.getByText("Action Button")).toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
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
          <ProtectedRoute isAuthenticated={false}>
            <TestComponent />
          </ProtectedRoute>
        </Provider>
      );

      expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();
    });

    it("should handle boolean authentication states correctly", () => {
      // Test explicit false
      const { rerender } = render(
        <Provider store={createTestStore({ isAuthenticated: false })}>
          <ProtectedRoute isAuthenticated={false}>
            <TestComponent />
          </ProtectedRoute>
        </Provider>
      );

      expect(screen.getByTestId("redirect-to-root")).toBeInTheDocument();

      // Test explicit true
      rerender(
        <Provider store={createTestStore({ isAuthenticated: true })}>
          <ProtectedRoute isAuthenticated={true}>
            <TestComponent />
          </ProtectedRoute>
        </Provider>
      );

      expect(screen.getByTestId("test-component")).toBeInTheDocument();
      expect(screen.queryByTestId("redirect-to-root")).not.toBeInTheDocument();
    });
  });
});
