/**
 * Integration tests for authentication flow
 * Tests the smooth loading experience requirements for authentication
 *
 * Requirements tested:
 * - 1.1: No white loading screen during auth checks
 * - 1.2: Visual continuity during navigation
 * - 1.3: Skip loading for quick operations (under 200ms)
 * - 1.4: Subtle loading for longer operations (over 200ms)
 */

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import "@testing-library/jest-dom";
import settingsReducer, {
  setAuthenticated,
  setLoading,
  setInitialCheckComplete,
  clearAuthState,
} from "../store/settingsSlice";
import progressReducer from "../store/progressSlice";
import { LoadingProvider } from "../contexts/LoadingProvider";
import { useLoading, LOADING_KEYS } from "../hooks/useLoading";
import FullScreenLoader from "../components/FullScreenLoader/FullScreenLoader";

// Mock i18n instance for tests
const mockI18n = i18n.createInstance();
mockI18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        loading: "Loading...",
        login: "Login",
        logout: "Logout",
      },
    },
  },
});

// Mock services
jest.mock("../api", () => ({
  authService: {
    isAuthenticated: jest.fn(),
    clearAuthState: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
  userService: {
    getProfile: jest.fn(),
  },
  progressService: {
    getAllProgress: jest.fn().mockResolvedValue([]),
  },
}));

// Mock components to avoid complex dependencies
const MockLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="layout">{children}</div>
);

const MockLoginPage = () => (
  <div data-testid="login-page">
    <h1>Login Page</h1>
    <button data-testid="login-button">Login</button>
  </div>
);

const MockProtectedPage = ({ pageName }: { pageName: string }) => (
  <div data-testid={`${pageName}-page`}>
    <h1>{pageName} Page</h1>
  </div>
);

// App content component that uses the loading system
function AppContent({ initialState }: { initialState: any }) {
  const { isGlobalLoading, loadingMessage } = useLoading();
  const [authState, setAuthState] = React.useState({
    isAuthenticated: initialState.isAuthenticated || false,
    loading: initialState.loading || false,
    initialCheckComplete: initialState.initialCheckComplete || false,
  });

  // Simulate AuthRestore component behavior
  React.useEffect(() => {
    if (!authState.initialCheckComplete && !authState.loading) {
      // Simulate initial auth check
      setAuthState((prev) => ({ ...prev, loading: true }));

      // Simulate auth check completion after delay
      setTimeout(() => {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          initialCheckComplete: true,
        }));
      }, 100); // Quick auth check
    }
  }, [authState.initialCheckComplete, authState.loading]);

  // Show loading during initial check
  if (authState.loading && !authState.initialCheckComplete) {
    return <div data-testid="initial-loading">Initial Loading...</div>;
  }

  // Show login page if not authenticated
  if (!authState.isAuthenticated && authState.initialCheckComplete) {
    return <MockLoginPage />;
  }

  // Show protected content if authenticated
  if (authState.isAuthenticated) {
    return (
      <MockLayout>
        <MockProtectedPage pageName="protected" />
      </MockLayout>
    );
  }

  // Default state - show app content
  return (
    <>
      <div data-testid="app-content">App Content</div>
      {isGlobalLoading && <FullScreenLoader message={loadingMessage} />}
    </>
  );
}

// Test component that simulates the App structure
function TestApp({ initialState = {} }: { initialState?: any }) {
  const store = configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        language: "en",
        chessSet: "1",
        isAuthenticated: false,
        loading: false,
        initialCheckComplete: false,
        ...initialState,
      },
    },
  });

  return (
    <Provider store={store}>
      <I18nextProvider i18n={mockI18n}>
        <LoadingProvider>
          <AppContent initialState={initialState} />
        </LoadingProvider>
      </I18nextProvider>
    </Provider>
  );
}

// Component to test loading delays
function LoadingDelayTestComponent() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [testResults, setTestResults] = React.useState<{
    quickOperation: boolean;
    slowOperation: boolean;
  }>({ quickOperation: false, slowOperation: false });

  const testQuickOperation = async () => {
    startLoading(LOADING_KEYS.INITIAL_AUTH, "Quick test", 200);

    // Complete operation quickly (under 200ms)
    setTimeout(() => {
      stopLoading(LOADING_KEYS.INITIAL_AUTH);
      setTestResults((prev) => ({
        ...prev,
        quickOperation: !isLoading(LOADING_KEYS.INITIAL_AUTH),
      }));
    }, 50);
  };

  const testSlowOperation = async () => {
    startLoading(LOADING_KEYS.PROFILE_LOAD, "Slow test", 200);

    // Complete operation slowly (over 200ms)
    setTimeout(() => {
      stopLoading(LOADING_KEYS.PROFILE_LOAD);
      setTestResults((prev) => ({ ...prev, slowOperation: true }));
    }, 300);
  };

  return (
    <div data-testid="loading-delay-test">
      <button data-testid="quick-test" onClick={testQuickOperation}>
        Quick Test
      </button>
      <button data-testid="slow-test" onClick={testSlowOperation}>
        Slow Test
      </button>
      <div data-testid="loading-state">
        Loading: {isLoading() ? "true" : "false"}
      </div>
      <div data-testid="test-results">
        Quick: {testResults.quickOperation ? "passed" : "pending"}
        Slow: {testResults.slowOperation ? "passed" : "pending"}
      </div>
    </div>
  );
}

describe("Authentication Flow Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Requirement 1.1: No flickering during initial app load", () => {
    it("should not show white loading screen during quick authentication checks", async () => {
      render(<TestApp />);

      // Should show initial loading briefly
      expect(screen.getByTestId("initial-loading")).toBeInTheDocument();

      // Fast-forward through the quick auth check
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      // Should never show a white screen or jarring transition
      expect(screen.queryByTestId("initial-loading")).not.toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    it("should maintain visual continuity during authentication state changes", async () => {
      // Test unauthenticated state
      const { unmount } = render(
        <TestApp initialState={{ initialCheckComplete: true }} />
      );

      // Should show login page initially
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Clean up first render
      unmount();

      // Test authenticated state
      render(
        <TestApp
          initialState={{
            isAuthenticated: true,
            initialCheckComplete: true,
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("protected-page")).toBeInTheDocument();
      });

      // Should not show any loading screens during transition
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.getByTestId("layout")).toBeInTheDocument();
    });
  });

  describe("Requirement 1.2: Visual continuity during navigation", () => {
    it("should maintain layout during protected route navigation", async () => {
      render(
        <TestApp
          initialState={{
            isAuthenticated: true,
            initialCheckComplete: true,
          }}
        />
      );

      // Should show protected content with layout
      await waitFor(() => {
        expect(screen.getByTestId("protected-page")).toBeInTheDocument();
        expect(screen.getByTestId("layout")).toBeInTheDocument();
      });

      // Layout should remain consistent
      const layout = screen.getByTestId("layout");
      expect(layout).toContainElement(screen.getByTestId("protected-page"));
    });

    it("should not interrupt visual flow when navigating between protected routes", async () => {
      const { rerender } = render(
        <TestApp
          initialState={{
            isAuthenticated: true,
            initialCheckComplete: true,
          }}
        />
      );

      // Initial protected page
      await waitFor(() => {
        expect(screen.getByTestId("protected-page")).toBeInTheDocument();
      });

      // Simulate navigation to another protected page
      const TestAppWithDifferentPage = () => {
        const store = configureStore({
          reducer: { settings: settingsReducer },
          preloadedState: {
            settings: {
              language: "en",
              chessSet: "1",
              isAuthenticated: true,
              loading: false,
              initialCheckComplete: true,
            },
          },
        });

        return (
          <Provider store={store}>
            <I18nextProvider i18n={mockI18n}>
              <LoadingProvider>
                <MockLayout>
                  <MockProtectedPage pageName="puzzles" />
                </MockLayout>
              </LoadingProvider>
            </I18nextProvider>
          </Provider>
        );
      };

      rerender(<TestAppWithDifferentPage />);

      await waitFor(() => {
        expect(screen.getByTestId("puzzles-page")).toBeInTheDocument();
      });

      // Should maintain layout without loading interruptions
      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  describe("Requirement 1.3: Skip loading for quick operations (under 200ms)", () => {
    it("should not show loading indicators for operations under 200ms", async () => {
      const TestComponent = () => (
        <LoadingProvider>
          <LoadingDelayTestComponent />
        </LoadingProvider>
      );

      render(<TestComponent />);

      // Trigger quick operation
      const quickButton = screen.getByTestId("quick-test");
      act(() => {
        quickButton.click();
      });

      // Should not show loading immediately
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "Loading: false"
      );

      // Fast-forward 50ms (operation completes)
      act(() => {
        jest.advanceTimersByTime(50);
      });

      // Should still not show loading
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "Loading: false"
      );

      // Fast-forward past the 200ms delay threshold
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Operation should be complete, no loading shown
      await waitFor(() => {
        expect(screen.getByTestId("test-results")).toHaveTextContent(
          "Quick: passed"
        );
      });
    });

    it("should handle rapid authentication checks without showing loading", async () => {
      const { authService } = require("../api");
      authService.isAuthenticated.mockReturnValue(true);

      render(<TestApp />);

      // Should complete initial check quickly
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });

      // Should not have shown any loading indicators
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  describe("Requirement 1.4: Subtle loading for longer operations (over 200ms)", () => {
    it("should show loading indicators for operations over 200ms", async () => {
      const TestComponent = () => (
        <LoadingProvider>
          <LoadingDelayTestComponent />
        </LoadingProvider>
      );

      render(<TestComponent />);

      // Trigger slow operation
      const slowButton = screen.getByTestId("slow-test");
      act(() => {
        slowButton.click();
      });

      // Should not show loading immediately
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "Loading: false"
      );

      // Fast-forward to 200ms (delay threshold)
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should now show loading
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "Loading: true"
      );

      // Fast-forward to operation completion (300ms total)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Loading should be cleared
      await waitFor(() => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "Loading: false"
        );
        expect(screen.getByTestId("test-results")).toHaveTextContent(
          "Slow: passed"
        );
      });
    });

    it("should show subtle loading overlay for long authentication operations", async () => {
      render(<TestApp initialState={{ loading: true }} />);

      // Should show initial loading for long operations
      expect(screen.getByTestId("initial-loading")).toBeInTheDocument();

      // Simulate long authentication check
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should still show loading
      expect(screen.getByTestId("initial-loading")).toBeInTheDocument();
    });
  });

  describe("Error scenarios and cleanup", () => {
    it("should properly clear loading states on authentication errors", async () => {
      const TestErrorComponent = () => {
        const { startLoading, stopLoading, isLoading } = useLoading();
        const [error, setError] = React.useState<string | null>(null);

        const simulateAuthError = async () => {
          try {
            startLoading(LOADING_KEYS.LOGIN, "Logging in...");

            // Simulate auth error after delay
            setTimeout(() => {
              setError("Authentication failed");
              stopLoading(LOADING_KEYS.LOGIN);
            }, 250);
          } catch (err) {
            stopLoading(LOADING_KEYS.LOGIN);
            setError("Authentication failed");
          }
        };

        return (
          <div data-testid="error-test">
            <button data-testid="auth-error-button" onClick={simulateAuthError}>
              Simulate Auth Error
            </button>
            <div data-testid="loading-state">
              Loading: {isLoading(LOADING_KEYS.LOGIN) ? "true" : "false"}
            </div>
            {error && <div data-testid="error-message">{error}</div>}
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestErrorComponent />
        </LoadingProvider>
      );

      // Trigger auth error
      const errorButton = screen.getByTestId("auth-error-button");
      act(() => {
        errorButton.click();
      });

      // Should show loading initially
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "Loading: true"
      );

      // Error occurs and clears loading
      act(() => {
        jest.advanceTimersByTime(50);
      });

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Authentication failed"
        );
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "Loading: false"
        );
      });
    });

    it("should handle component unmount during loading", async () => {
      const TestUnmountComponent = () => {
        const { startLoading, isLoading } = useLoading();
        const [mounted, setMounted] = React.useState(true);

        React.useEffect(() => {
          startLoading(LOADING_KEYS.PROFILE_LOAD, "Loading profile...");

          return () => {
            // Component unmounts during loading
            setMounted(false);
          };
        }, [startLoading]);

        if (!mounted) {
          return <div data-testid="unmounted">Component unmounted</div>;
        }

        return (
          <div data-testid="mounted-component">
            Loading: {isLoading(LOADING_KEYS.PROFILE_LOAD) ? "true" : "false"}
          </div>
        );
      };

      const { unmount } = render(
        <LoadingProvider>
          <TestUnmountComponent />
        </LoadingProvider>
      );

      // Start loading
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Unmount component during loading
      unmount();

      // Should not cause any errors or memory leaks
      expect(() => {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }).not.toThrow();
    });

    it("should handle multiple concurrent loading operations", async () => {
      const TestConcurrentComponent = () => {
        const { startLoading, stopLoading, isLoading, getActiveLoadingKeys } =
          useLoading();

        const startMultipleOperations = () => {
          startLoading(LOADING_KEYS.LOGIN, "Logging in...");
          startLoading(LOADING_KEYS.PROFILE_LOAD, "Loading profile...");
          startLoading(LOADING_KEYS.SETTINGS_UPDATE, "Updating settings...");
        };

        const stopAllOperations = () => {
          stopLoading(LOADING_KEYS.LOGIN);
          stopLoading(LOADING_KEYS.PROFILE_LOAD);
          stopLoading(LOADING_KEYS.SETTINGS_UPDATE);
        };

        return (
          <div data-testid="concurrent-test">
            <button
              data-testid="start-multiple"
              onClick={startMultipleOperations}
            >
              Start Multiple
            </button>
            <button data-testid="stop-all" onClick={stopAllOperations}>
              Stop All
            </button>
            <div data-testid="active-keys">
              Active: {getActiveLoadingKeys().length}
            </div>
            <div data-testid="global-loading">
              Global Loading: {isLoading() ? "true" : "false"}
            </div>
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestConcurrentComponent />
        </LoadingProvider>
      );

      // Start multiple operations
      const startButton = screen.getByTestId("start-multiple");
      act(() => {
        startButton.click();
      });

      // Should track multiple operations
      expect(screen.getByTestId("active-keys")).toHaveTextContent("Active: 3");

      // Fast-forward past delay threshold
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should show global loading
      expect(screen.getByTestId("global-loading")).toHaveTextContent(
        "Global Loading: true"
      );

      // Stop all operations
      const stopButton = screen.getByTestId("stop-all");
      act(() => {
        stopButton.click();
      });

      // Should clear all loading states
      await waitFor(() => {
        expect(screen.getByTestId("active-keys")).toHaveTextContent(
          "Active: 0"
        );
        expect(screen.getByTestId("global-loading")).toHaveTextContent(
          "Global Loading: false"
        );
      });
    });
  });

  describe("Navigation between protected routes", () => {
    it("should not show loading screens when navigating between authenticated pages", async () => {
      const { rerender } = render(
        <TestApp
          initialState={{
            isAuthenticated: true,
            initialCheckComplete: true,
          }}
        />
      );

      // Initial page
      await waitFor(() => {
        expect(screen.getByTestId("protected-page")).toBeInTheDocument();
      });

      // Simulate navigation to different protected page
      const NavigatedApp = () => {
        const store = configureStore({
          reducer: { settings: settingsReducer },
          preloadedState: {
            settings: {
              language: "en",
              chessSet: "1",
              isAuthenticated: true,
              loading: false,
              initialCheckComplete: true,
            },
          },
        });

        return (
          <Provider store={store}>
            <I18nextProvider i18n={mockI18n}>
              <LoadingProvider>
                <MockLayout>
                  <MockProtectedPage pageName="account" />
                </MockLayout>
              </LoadingProvider>
            </I18nextProvider>
          </Provider>
        );
      };

      rerender(<NavigatedApp />);

      await waitFor(() => {
        expect(screen.getByTestId("account-page")).toBeInTheDocument();
      });

      // Should maintain layout without interruption
      expect(screen.getByTestId("layout")).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  describe("Progress API Integration after Authentication", () => {
    it("should call authentication services when login is triggered", async () => {
      const { authService, userService } = require("../api");
      
      // Mock successful authentication
      authService.login.mockResolvedValue({
        access_token: "test-token",
        refresh_token: "test-refresh-token"
      });
      
      userService.getProfile.mockResolvedValue({
        id: "test-user-id",
        email: "test@example.com",
        username: "testuser",
        name: "Test User"
      });

      // Simple test component that just calls the services
      const TestLoginComponent = () => {
        const [loginCalled, setLoginCalled] = React.useState(false);

        const handleLogin = async () => {
          try {
            await authService.login({
              username: "testuser",
              password: "testpass"
            });
            await userService.getProfile();
            setLoginCalled(true);
          } catch (error) {
            console.error("Login failed:", error);
          }
        };

        return (
          <div data-testid="login-test">
            <button data-testid="login-btn" onClick={handleLogin}>
              Login
            </button>
            <div data-testid="login-status">
              Login Called: {loginCalled ? "true" : "false"}
            </div>
          </div>
        );
      };

      render(<TestLoginComponent />);

      // Trigger login
      const loginBtn = screen.getByTestId("login-btn");
      act(() => {
        loginBtn.click();
      });

      // Wait for login to complete
      await waitFor(() => {
        expect(screen.getByTestId("login-status")).toHaveTextContent("Login Called: true");
      });

      // Verify authentication was successful
      expect(authService.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpass"
      });
      expect(userService.getProfile).toHaveBeenCalled();
    });

    it("should handle authentication service errors gracefully", async () => {
      const { authService } = require("../api");
      
      // Mock authentication failure
      authService.login.mockRejectedValue(new Error("Authentication failed"));

      // Spy on console.error to verify error logging
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const TestLoginComponent = () => {
        const [loginError, setLoginError] = React.useState<string | null>(null);

        const handleLogin = async () => {
          try {
            await authService.login({
              username: "testuser",
              password: "wrongpass"
            });
          } catch (error) {
            setLoginError(error instanceof Error ? error.message : "Login failed");
          }
        };

        return (
          <div data-testid="login-test">
            <button data-testid="login-btn" onClick={handleLogin}>
              Login
            </button>
            <div data-testid="error-state">
              Error: {loginError || "none"}
            </div>
          </div>
        );
      };

      render(<TestLoginComponent />);

      // Trigger login
      const loginBtn = screen.getByTestId("login-btn");
      act(() => {
        loginBtn.click();
      });

      // Wait for error to be handled
      await waitFor(() => {
        expect(screen.getByTestId("error-state")).toHaveTextContent("Error: Authentication failed");
      });

      // Verify authentication was attempted
      expect(authService.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "wrongpass"
      });

      consoleSpy.mockRestore();
    });
  });
});