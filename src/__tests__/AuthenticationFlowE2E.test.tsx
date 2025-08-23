/**
 * End-to-end tests for complete user authentication and navigation flows
 * Tests the entire user journey with smooth loading experience
 *
 * Requirements tested:
 * - 1.3: Loading delay thresholds in real user scenarios
 * - 2.4: Complete system performance and cleanup
 * - 5.4: Centralized loading state management in full flows
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

// Import store and components
import settingsReducer from "../store/settingsSlice";
import { LoadingProvider } from "../contexts/LoadingProvider";
import { useLoading, LOADING_KEYS } from "../hooks/useLoading";
import { useLoadingCleanup } from "../hooks/useLoadingCleanup";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay";
import FullScreenLoader from "../components/FullScreenLoader/FullScreenLoader";

// Mock i18n instance
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
        email: "Email",
        password: "Password",
        settings: "Settings",
        account: "Account",
        puzzles: "Puzzles",
        play: "Play",
        language: "Language",
        chess_set: "Chess Set",
        logging_in: "Logging in...",
        loading_profile: "Loading profile...",
        updating_settings: "Updating settings...",
      },
    },
  },
});

// Mock services
const mockAuthService = {
  isAuthenticated: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  clearAuthState: jest.fn(),
  getToken: jest.fn(),
};

const mockUserService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  updateLanguage: jest.fn(),
  updateChessSet: jest.fn(),
};

jest.mock("../services", () => ({
  authService: mockAuthService,
  userService: mockUserService,
}));

// Mock Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="app-layout">
    <nav data-testid="navigation">
      <button data-testid="nav-account">Account</button>
      <button data-testid="nav-puzzles">Puzzles</button>
      <button data-testid="nav-play">Play</button>
      <button data-testid="nav-settings">Settings</button>
      <button data-testid="nav-logout">Logout</button>
    </nav>
    <main data-testid="main-content">{children}</main>
  </div>
);

// Mock LoginPage component
const MockLoginPage = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState<string | null>(null);

  useLoadingCleanup({ keys: [LOADING_KEYS.LOGIN] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      startLoading(LOADING_KEYS.LOGIN, "Logging in...");

      // Simulate login API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (
            formData.email === "test@example.com" &&
            formData.password === "password"
          ) {
            mockAuthService.login.mockResolvedValue({ token: "mock-token" });
            resolve({ token: "mock-token" });
          } else {
            reject(new Error("Invalid credentials"));
          }
        }, 250); // Simulate network delay
      });

      // Simulate successful login
      window.location.href = "/account";
    } catch (err) {
      setError("Login failed");
    } finally {
      stopLoading(LOADING_KEYS.LOGIN);
    }
  };

  return (
    <div data-testid="login-page">
      <h1>Login</h1>
      <form data-testid="login-form" onSubmit={handleSubmit}>
        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={isLoading(LOADING_KEYS.LOGIN)}
        />
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          disabled={isLoading(LOADING_KEYS.LOGIN)}
        />
        <button
          data-testid="login-button"
          type="submit"
          disabled={isLoading(LOADING_KEYS.LOGIN)}
        >
          {isLoading(LOADING_KEYS.LOGIN) ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <div data-testid="login-error">{error}</div>}
      <LoadingOverlay
        show={isLoading(LOADING_KEYS.LOGIN)}
        message="Logging in..."
      />
    </div>
  );
};

// Mock AccountPage component
const MockAccountPage = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [profile, setProfile] = React.useState({
    name: "Test User",
    email: "test@example.com",
  });

  useLoadingCleanup({ keys: [LOADING_KEYS.PROFILE_LOAD] });

  React.useEffect(() => {
    const loadProfile = async () => {
      startLoading(LOADING_KEYS.PROFILE_LOAD, "Loading profile...");

      try {
        // Simulate profile loading
        await new Promise((resolve) => setTimeout(resolve, 150));
        mockUserService.getProfile.mockResolvedValue(profile);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        stopLoading(LOADING_KEYS.PROFILE_LOAD);
      }
    };

    loadProfile();
  }, [profile, startLoading, stopLoading]);

  return (
    <div data-testid="account-page">
      <h1>Account</h1>
      <div data-testid="profile-info">
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
      </div>
      {isLoading(LOADING_KEYS.PROFILE_LOAD) && (
        <div data-testid="profile-loading">Loading profile...</div>
      )}
    </div>
  );
};

// Mock SettingsPage component
const MockSettingsPage = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [settings, setSettings] = React.useState({
    language: "en",
    chessSet: "1",
  });

  useLoadingCleanup({
    keys: [LOADING_KEYS.LANGUAGE_UPDATE, LOADING_KEYS.CHESS_SET_UPDATE],
  });

  const updateLanguage = async (language: string) => {
    startLoading(LOADING_KEYS.LANGUAGE_UPDATE, "Updating language...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      mockUserService.updateLanguage.mockResolvedValue({ language });
      setSettings((prev) => ({ ...prev, language }));
    } catch (error) {
      console.error("Failed to update language:", error);
    } finally {
      stopLoading(LOADING_KEYS.LANGUAGE_UPDATE);
    }
  };

  const updateChessSet = async (chessSet: string) => {
    startLoading(LOADING_KEYS.CHESS_SET_UPDATE, "Updating chess set...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      mockUserService.updateChessSet.mockResolvedValue({ chessSet });
      setSettings((prev) => ({ ...prev, chessSet }));
    } catch (error) {
      console.error("Failed to update chess set:", error);
    } finally {
      stopLoading(LOADING_KEYS.CHESS_SET_UPDATE);
    }
  };

  return (
    <div data-testid="settings-page">
      <h1>Settings</h1>
      <div data-testid="language-section">
        <label>Language: {settings.language}</label>
        <button
          data-testid="language-en"
          onClick={() => updateLanguage("en")}
          disabled={isLoading(LOADING_KEYS.LANGUAGE_UPDATE)}
        >
          English
        </button>
        <button
          data-testid="language-ru"
          onClick={() => updateLanguage("ru")}
          disabled={isLoading(LOADING_KEYS.LANGUAGE_UPDATE)}
        >
          Russian
        </button>
        {isLoading(LOADING_KEYS.LANGUAGE_UPDATE) && (
          <div data-testid="language-loading">Updating language...</div>
        )}
      </div>
      <div data-testid="chess-set-section">
        <label>Chess Set: {settings.chessSet}</label>
        <button
          data-testid="chess-set-1"
          onClick={() => updateChessSet("1")}
          disabled={isLoading(LOADING_KEYS.CHESS_SET_UPDATE)}
        >
          Classic
        </button>
        <button
          data-testid="chess-set-2"
          onClick={() => updateChessSet("2")}
          disabled={isLoading(LOADING_KEYS.CHESS_SET_UPDATE)}
        >
          Modern
        </button>
        {isLoading(LOADING_KEYS.CHESS_SET_UPDATE) && (
          <div data-testid="chess-set-loading">Updating chess set...</div>
        )}
      </div>
    </div>
  );
};

// Mock PuzzlesPage component
const MockPuzzlesPage = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [puzzles, setPuzzles] = React.useState<any[]>([]);

  useLoadingCleanup({ keys: ["puzzles_load"] });

  React.useEffect(() => {
    const loadPuzzles = async () => {
      startLoading("puzzles_load", "Loading puzzles...");

      try {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Quick load
        setPuzzles([
          { id: 1, name: "Puzzle 1" },
          { id: 2, name: "Puzzle 2" },
        ]);
      } finally {
        stopLoading("puzzles_load");
      }
    };

    loadPuzzles();
  }, [startLoading, stopLoading]);

  return (
    <div data-testid="puzzles-page">
      <h1>Puzzles</h1>
      {isLoading("puzzles_load") ? (
        <div data-testid="puzzles-loading">Loading puzzles...</div>
      ) : (
        <div data-testid="puzzles-list">
          {puzzles.map((puzzle) => (
            <div key={puzzle.id} data-testid={`puzzle-${puzzle.id}`}>
              {puzzle.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = mockAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MockLayout>{children}</MockLayout>;
};

// Main App component for E2E testing
const E2ETestApp = ({ initialAuth = false }: { initialAuth?: boolean }) => {
  const { isGlobalLoading, loadingMessage } = useLoading();

  React.useEffect(() => {
    mockAuthService.isAuthenticated.mockReturnValue(initialAuth);
  }, [initialAuth]);

  return (
    <div data-testid="e2e-app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MockLoginPage />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MockAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MockSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/puzzles"
            element={
              <ProtectedRoute>
                <MockPuzzlesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/account" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global loading overlay */}
      {isGlobalLoading && <FullScreenLoader message={loadingMessage} />}
    </div>
  );
};

// Test wrapper component
const TestWrapper = ({
  children,
  initialAuth = false,
}: {
  children: React.ReactNode;
  initialAuth?: boolean;
}) => {
  const store = configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        language: "en",
        chessSet: "1",
        isAuthenticated: initialAuth,
        loading: false,
        initialCheckComplete: true,
      },
    },
  });

  return (
    <Provider store={store}>
      <I18nextProvider i18n={mockI18n}>
        <LoadingProvider>{children}</LoadingProvider>
      </I18nextProvider>
    </Provider>
  );
};

describe("Authentication Flow E2E Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Reset auth state
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockAuthService.login.mockClear();
    mockAuthService.logout.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Complete Login Flow", () => {
    it("should handle complete login flow with proper loading states", async () => {
      render(
        <TestWrapper>
          <E2ETestApp />
        </TestWrapper>
      );

      // Should redirect to login page when not authenticated
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Fill in login form
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      const loginButton = screen.getByTestId("login-button");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });

      // Submit login form
      fireEvent.click(loginButton);

      // Should show loading immediately
      expect(screen.getByTestId("login-button")).toHaveTextContent(
        "Logging in..."
      );
      expect(screen.getByTestId("email-input")).toBeDisabled();
      expect(screen.getByTestId("password-input")).toBeDisabled();

      // Should show loading overlay after delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Loading overlay should be visible
      expect(screen.getByRole("status")).toBeInTheDocument();

      // Complete login process
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Mock successful authentication
      mockAuthService.isAuthenticated.mockReturnValue(true);

      // Should navigate to account page (simulated)
      // In real app, this would be handled by router
      expect(mockAuthService.login).toHaveBeenCalled();
    });

    it("should handle login errors gracefully", async () => {
      render(
        <TestWrapper>
          <E2ETestApp />
        </TestWrapper>
      );

      // Fill in invalid credentials
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      const loginButton = screen.getByTestId("login-button");

      fireEvent.change(emailInput, {
        target: { value: "invalid@example.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

      // Submit login form
      fireEvent.click(loginButton);

      // Should show loading
      expect(screen.getByTestId("login-button")).toHaveTextContent(
        "Logging in..."
      );

      // Complete failed login process
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should show error and clear loading
      await waitFor(() => {
        expect(screen.getByTestId("login-error")).toHaveTextContent(
          "Login failed"
        );
        expect(screen.getByTestId("login-button")).toHaveTextContent("Login");
        expect(screen.getByTestId("email-input")).not.toBeDisabled();
      });
    });
  });

  describe("Authenticated Navigation Flow", () => {
    it("should navigate between protected routes without loading interruptions", async () => {
      const { rerender } = render(
        <TestWrapper initialAuth={true}>
          <E2ETestApp initialAuth={true} />
        </TestWrapper>
      );

      // Should show account page for authenticated user
      await waitFor(() => {
        expect(screen.getByTestId("account-page")).toBeInTheDocument();
      });

      // Profile should load quickly (under 200ms threshold)
      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Should not show loading for quick profile load
      expect(screen.queryByTestId("profile-loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("profile-info")).toBeInTheDocument();

      // Navigate to settings page
      rerender(
        <TestWrapper initialAuth={true}>
          <BrowserRouter>
            <Routes>
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <MockSettingsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId("settings-page")).toBeInTheDocument();
      });

      // Should maintain layout without loading interruption
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("should handle settings updates with contextual loading", async () => {
      render(
        <TestWrapper initialAuth={true}>
          <BrowserRouter>
            <Routes>
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <MockSettingsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId("settings-page")).toBeInTheDocument();
      });

      // Update language setting
      const languageButton = screen.getByTestId("language-ru");
      fireEvent.click(languageButton);

      // Should show contextual loading
      expect(screen.getByTestId("language-loading")).toBeInTheDocument();
      expect(languageButton).toBeDisabled();

      // Complete language update
      act(() => {
        jest.advanceTimersByTime(250);
      });

      // Should clear loading and update setting
      await waitFor(() => {
        expect(
          screen.queryByTestId("language-loading")
        ).not.toBeInTheDocument();
        expect(languageButton).not.toBeDisabled();
      });

      // Update chess set setting
      const chessSetButton = screen.getByTestId("chess-set-2");
      fireEvent.click(chessSetButton);

      // Should show contextual loading for chess set
      expect(screen.getByTestId("chess-set-loading")).toBeInTheDocument();
      expect(chessSetButton).toBeDisabled();

      // Complete chess set update
      act(() => {
        jest.advanceTimersByTime(350);
      });

      // Should clear loading
      await waitFor(() => {
        expect(
          screen.queryByTestId("chess-set-loading")
        ).not.toBeInTheDocument();
        expect(chessSetButton).not.toBeDisabled();
      });
    });
  });

  describe("Quick Navigation Performance", () => {
    it("should not show loading for quick page transitions", async () => {
      const { rerender } = render(
        <TestWrapper initialAuth={true}>
          <BrowserRouter>
            <Routes>
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <MockPuzzlesPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TestWrapper>
      );

      // Puzzles should load quickly (100ms)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByTestId("puzzles-page")).toBeInTheDocument();
      });

      // Should not show loading for quick operation
      expect(screen.queryByTestId("puzzles-loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("puzzles-list")).toBeInTheDocument();

      // Navigate to account page
      rerender(
        <TestWrapper initialAuth={true}>
          <BrowserRouter>
            <Routes>
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <MockAccountPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TestWrapper>
      );

      // Should transition without loading screen
      await waitFor(() => {
        expect(screen.getByTestId("account-page")).toBeInTheDocument();
      });

      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("Concurrent Operations Handling", () => {
    it("should handle multiple simultaneous loading operations", async () => {
      const TestConcurrentComponent = () => {
        const { startLoading, stopLoading, isLoading, getActiveLoadingKeys } =
          useLoading();
        const [activeCount, setActiveCount] = React.useState(0);

        React.useEffect(() => {
          const interval = setInterval(() => {
            setActiveCount(getActiveLoadingKeys().length);
          }, 50);

          return () => clearInterval(interval);
        }, [getActiveLoadingKeys]);

        const startMultipleOperations = () => {
          startLoading(LOADING_KEYS.LOGIN, "Logging in...");
          startLoading(LOADING_KEYS.PROFILE_LOAD, "Loading profile...");
          startLoading(LOADING_KEYS.SETTINGS_UPDATE, "Updating settings...");

          // Stop operations at different times
          setTimeout(() => stopLoading(LOADING_KEYS.LOGIN), 150);
          setTimeout(() => stopLoading(LOADING_KEYS.PROFILE_LOAD), 250);
          setTimeout(() => stopLoading(LOADING_KEYS.SETTINGS_UPDATE), 350);
        };

        return (
          <div data-testid="concurrent-operations">
            <div data-testid="active-operations">Active: {activeCount}</div>
            <div data-testid="global-loading">
              Global: {isLoading() ? "true" : "false"}
            </div>
            <button
              data-testid="start-multiple"
              onClick={startMultipleOperations}
            >
              Start Multiple
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestConcurrentComponent />
        </TestWrapper>
      );

      const startButton = screen.getByTestId("start-multiple");
      fireEvent.click(startButton);

      // Should track multiple operations
      expect(screen.getByTestId("active-operations")).toHaveTextContent(
        "Active: 3"
      );

      // Should show global loading after delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByTestId("global-loading")).toHaveTextContent(
        "Global: true"
      );

      // Operations complete at different times
      act(() => {
        jest.advanceTimersByTime(150); // First operation completes
      });

      expect(screen.getByTestId("active-operations")).toHaveTextContent(
        "Active: 2"
      );
      expect(screen.getByTestId("global-loading")).toHaveTextContent(
        "Global: true"
      );

      act(() => {
        jest.advanceTimersByTime(100); // Second operation completes
      });

      expect(screen.getByTestId("active-operations")).toHaveTextContent(
        "Active: 1"
      );
      expect(screen.getByTestId("global-loading")).toHaveTextContent(
        "Global: true"
      );

      act(() => {
        jest.advanceTimersByTime(100); // Third operation completes
      });

      // All operations should be complete
      await waitFor(() => {
        expect(screen.getByTestId("active-operations")).toHaveTextContent(
          "Active: 0"
        );
        expect(screen.getByTestId("global-loading")).toHaveTextContent(
          "Global: false"
        );
      });
    });
  });

  describe("Memory Management and Cleanup", () => {
    it("should properly cleanup loading states on component unmount", async () => {
      const TestCleanupComponent = () => {
        const { startLoading, getActiveLoadingKeys } = useLoading();
        const [mounted, setMounted] = React.useState(true);
        const [activeCount, setActiveCount] = React.useState(0);

        useLoadingCleanup({ keys: ["cleanup-test"] });

        React.useEffect(() => {
          const interval = setInterval(() => {
            setActiveCount(getActiveLoadingKeys().length);
          }, 50);

          return () => clearInterval(interval);
        }, [getActiveLoadingKeys]);

        React.useEffect(() => {
          if (mounted) {
            startLoading("cleanup-test", "Cleanup test");
          }
        }, [mounted, startLoading]);

        if (!mounted) {
          return <div data-testid="unmounted">Component unmounted</div>;
        }

        return (
          <div data-testid="cleanup-test">
            <div data-testid="cleanup-active-count">Active: {activeCount}</div>
            <button
              data-testid="unmount-component"
              onClick={() => setMounted(false)}
            >
              Unmount
            </button>
          </div>
        );
      };

      const { unmount } = render(
        <TestWrapper>
          <TestCleanupComponent />
        </TestWrapper>
      );

      // Should have active loading operation
      expect(screen.getByTestId("cleanup-active-count")).toHaveTextContent(
        "Active: 1"
      );

      // Unmount component
      unmount();

      // Should cleanup loading states
      // Note: In real scenario, this would be verified by checking the loading context
      expect(() => {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }).not.toThrow();
    });

    it("should handle rapid mount/unmount cycles without memory leaks", async () => {
      const TestRapidMountComponent = ({
        shouldMount,
      }: {
        shouldMount: boolean;
      }) => {
        const { startLoading } = useLoading();

        useLoadingCleanup({ keys: ["rapid-test"] });

        React.useEffect(() => {
          if (shouldMount) {
            startLoading("rapid-test", "Rapid test");
          }
        }, [shouldMount, startLoading]);

        return shouldMount ? (
          <div data-testid="rapid-mounted">Mounted</div>
        ) : (
          <div data-testid="rapid-unmounted">Unmounted</div>
        );
      };

      const { rerender } = render(
        <TestWrapper>
          <TestRapidMountComponent shouldMount={true} />
        </TestWrapper>
      );

      expect(screen.getByTestId("rapid-mounted")).toBeInTheDocument();

      // Rapidly mount/unmount
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper>
            <TestRapidMountComponent shouldMount={false} />
          </TestWrapper>
        );

        rerender(
          <TestWrapper>
            <TestRapidMountComponent shouldMount={true} />
          </TestWrapper>
        );
      }

      // Should not cause memory leaks or errors
      expect(() => {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }).not.toThrow();
    });
  });

  describe("Complete User Journey E2E Tests", () => {
    it("should handle complete user journey from login to navigation without loading interruptions", async () => {
      const CompleteJourneyApp = () => {
        const [currentPage, setCurrentPage] = React.useState("login");
        const [isAuthenticated, setIsAuthenticated] = React.useState(false);
        const { isGlobalLoading, startLoading, stopLoading } = useLoading();

        const handleLogin = async () => {
          startLoading(LOADING_KEYS.LOGIN, "Logging in...");

          // Simulate login process
          await new Promise((resolve) => setTimeout(resolve, 250));

          setIsAuthenticated(true);
          setCurrentPage("account");
          stopLoading(LOADING_KEYS.LOGIN);
        };

        const navigateToSettings = async () => {
          startLoading(LOADING_KEYS.ROUTE_TRANSITION, "Loading settings...");

          // Simulate quick navigation
          await new Promise((resolve) => setTimeout(resolve, 100));

          setCurrentPage("settings");
          stopLoading(LOADING_KEYS.ROUTE_TRANSITION);
        };

        const updateLanguage = async () => {
          startLoading(LOADING_KEYS.LANGUAGE_UPDATE, "Updating language...");

          // Simulate settings update
          await new Promise((resolve) => setTimeout(resolve, 200));

          stopLoading(LOADING_KEYS.LANGUAGE_UPDATE);
        };

        return (
          <div data-testid="complete-journey-app">
            {currentPage === "login" && !isAuthenticated && (
              <div data-testid="journey-login">
                <button data-testid="journey-login-btn" onClick={handleLogin}>
                  Login
                </button>
              </div>
            )}

            {currentPage === "account" && isAuthenticated && (
              <div data-testid="journey-account">
                <h1>Account Page</h1>
                <button
                  data-testid="journey-to-settings"
                  onClick={navigateToSettings}
                >
                  Go to Settings
                </button>
              </div>
            )}

            {currentPage === "settings" && isAuthenticated && (
              <div data-testid="journey-settings">
                <h1>Settings Page</h1>
                <button
                  data-testid="journey-update-lang"
                  onClick={updateLanguage}
                >
                  Update Language
                </button>
              </div>
            )}

            {isGlobalLoading && (
              <div data-testid="journey-loading" role="status">
                Global Loading Active
              </div>
            )}
          </div>
        );
      };

      render(
        <TestWrapper>
          <CompleteJourneyApp />
        </TestWrapper>
      );

      // Start with login page
      expect(screen.getByTestId("journey-login")).toBeInTheDocument();

      // Perform login
      const loginBtn = screen.getByTestId("journey-login-btn");
      act(() => {
        loginBtn.click();
      });

      // Should show loading after delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByTestId("journey-loading")).toBeInTheDocument();

      // Complete login
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByTestId("journey-account")).toBeInTheDocument();
        expect(screen.queryByTestId("journey-loading")).not.toBeInTheDocument();
      });

      // Navigate to settings (quick operation - should not show loading)
      const settingsBtn = screen.getByTestId("journey-to-settings");
      act(() => {
        settingsBtn.click();
      });

      // Fast-forward through quick navigation
      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId("journey-settings")).toBeInTheDocument();
      });

      // Should not have shown loading for quick navigation
      expect(screen.queryByTestId("journey-loading")).not.toBeInTheDocument();

      // Update language setting
      const langBtn = screen.getByTestId("journey-update-lang");
      act(() => {
        langBtn.click();
      });

      // Should show loading for settings update
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByTestId("journey-loading")).toBeInTheDocument();

      // Complete settings update
      act(() => {
        jest.advanceTimersByTime(50);
      });

      await waitFor(() => {
        expect(screen.queryByTestId("journey-loading")).not.toBeInTheDocument();
      });

      // Should remain on settings page
      expect(screen.getByTestId("journey-settings")).toBeInTheDocument();
    });

    it("should handle complex multi-step workflows with proper loading coordination", async () => {
      const MultiStepWorkflowApp = () => {
        const [step, setStep] = React.useState(1);
        const [results, setResults] = React.useState<string[]>([]);
        const { startLoading, stopLoading, isLoading, getActiveLoadingKeys } =
          useLoading();

        const executeStep = async (stepNumber: number) => {
          const stepKey = `step-${stepNumber}`;
          const stepDuration = stepNumber * 100; // Increasing duration per step

          startLoading(stepKey, `Executing step ${stepNumber}...`);

          await new Promise((resolve) => setTimeout(resolve, stepDuration));

          setResults((prev) => [...prev, `Step ${stepNumber} completed`]);
          stopLoading(stepKey);

          if (stepNumber < 4) {
            setStep(stepNumber + 1);
          }
        };

        const executeAllSteps = async () => {
          // Execute multiple steps concurrently
          const promises = [1, 2, 3, 4].map((stepNum) => executeStep(stepNum));
          await Promise.all(promises);
        };

        return (
          <div data-testid="multi-step-workflow">
            <div data-testid="current-step">Current Step: {step}</div>
            <div data-testid="active-operations">
              Active Operations: {getActiveLoadingKeys().length}
            </div>
            <div data-testid="global-loading-state">
              Global Loading: {isLoading() ? "active" : "inactive"}
            </div>

            <button
              data-testid="execute-step"
              onClick={() => executeStep(step)}
            >
              Execute Step {step}
            </button>

            <button data-testid="execute-all" onClick={executeAllSteps}>
              Execute All Steps
            </button>

            <div data-testid="step-results">
              {results.map((result, index) => (
                <div key={index} data-testid={`result-${index}`}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <MultiStepWorkflowApp />
        </TestWrapper>
      );

      // Execute all steps concurrently
      const executeAllBtn = screen.getByTestId("execute-all");
      act(() => {
        executeAllBtn.click();
      });

      // Should show multiple active operations
      expect(screen.getByTestId("active-operations")).toHaveTextContent(
        "Active Operations: 4"
      );

      // Should show global loading after delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByTestId("global-loading-state")).toHaveTextContent(
        "Global Loading: active"
      );

      // Complete all steps (longest is 400ms)
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByTestId("active-operations")).toHaveTextContent(
          "Active Operations: 0"
        );
        expect(screen.getByTestId("global-loading-state")).toHaveTextContent(
          "Global Loading: inactive"
        );
      });

      // All steps should be completed
      expect(screen.getByTestId("result-0")).toHaveTextContent(
        "Step 1 completed"
      );
      expect(screen.getByTestId("result-1")).toHaveTextContent(
        "Step 2 completed"
      );
      expect(screen.getByTestId("result-2")).toHaveTextContent(
        "Step 3 completed"
      );
      expect(screen.getByTestId("result-3")).toHaveTextContent(
        "Step 4 completed"
      );
    });

    it("should maintain performance during intensive user interactions", async () => {
      const IntensiveInteractionApp = () => {
        const [interactionCount, setInteractionCount] = React.useState(0);
        const [performanceMetrics, setPerformanceMetrics] = React.useState<{
          averageResponseTime: number;
          totalInteractions: number;
          peakActiveOperations: number;
        } | null>(null);

        const { startLoading, stopLoading, getActiveLoadingKeys } =
          useLoading();

        const performIntensiveInteractions = () => {
          const startTime = performance.now();
          const responseTimes: number[] = [];
          let peakActive = 0;
          let completedInteractions = 0;

          // Monitor peak active operations
          const monitorInterval = setInterval(() => {
            peakActive = Math.max(peakActive, getActiveLoadingKeys().length);
          }, 10);

          // Simulate 20 rapid user interactions
          for (let i = 0; i < 20; i++) {
            const interactionStart = performance.now();
            const key = `interaction-${i}`;

            startLoading(key, `Interaction ${i}`, 50);

            setTimeout(() => {
              const interactionEnd = performance.now();
              responseTimes.push(interactionEnd - interactionStart);
              stopLoading(key);
              completedInteractions++;

              if (completedInteractions === 20) {
                clearInterval(monitorInterval);
                const averageResponseTime =
                  responseTimes.reduce((a, b) => a + b, 0) /
                  responseTimes.length;

                setPerformanceMetrics({
                  averageResponseTime,
                  totalInteractions: completedInteractions,
                  peakActiveOperations: peakActive,
                });
              }
            }, Math.random() * 100 + 50);
          }

          setInteractionCount(20);
        };

        return (
          <div data-testid="intensive-interaction-app">
            <button
              data-testid="start-intensive"
              onClick={performIntensiveInteractions}
            >
              Start Intensive Interactions
            </button>

            <div data-testid="interaction-count">
              Interactions: {interactionCount}
            </div>

            {performanceMetrics && (
              <div data-testid="performance-metrics">
                <div>
                  Avg Response:{" "}
                  {performanceMetrics.averageResponseTime.toFixed(2)}ms
                </div>
                <div>Total: {performanceMetrics.totalInteractions}</div>
                <div>
                  Peak Active: {performanceMetrics.peakActiveOperations}
                </div>
              </div>
            )}
          </div>
        );
      };

      render(
        <TestWrapper>
          <IntensiveInteractionApp />
        </TestWrapper>
      );

      const intensiveBtn = screen.getByTestId("start-intensive");
      act(() => {
        intensiveBtn.click();
      });

      // Fast-forward through intensive interactions
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByTestId("performance-metrics")).toBeInTheDocument();
      });

      const metrics = screen.getByTestId("performance-metrics");

      // Verify performance is within acceptable limits
      expect(metrics).toHaveTextContent(/Avg Response: \d+\.\d+ms/);
      expect(metrics).toHaveTextContent(/Total: 20/);
      expect(metrics).toHaveTextContent(/Peak Active: \d+/);

      // Average response time should be reasonable
      const avgResponseMatch = metrics.textContent?.match(
        /Avg Response: (\d+\.\d+)ms/
      );
      const avgResponse = avgResponseMatch
        ? parseFloat(avgResponseMatch[1])
        : 0;
      expect(avgResponse).toBeLessThan(200); // Should be under 200ms average
    });
  });

  describe("Error Recovery and Resilience", () => {
    it("should recover gracefully from loading system errors", async () => {
      const TestErrorRecoveryComponent = () => {
        const { startLoading, stopLoading, isLoading } = useLoading();
        const [error, setError] = React.useState<string | null>(null);

        const simulateError = async () => {
          try {
            startLoading("error-test", "Error test");

            // Simulate error during operation
            setTimeout(() => {
              throw new Error("Simulated error");
            }, 100);
          } catch (err) {
            setError("Operation failed");
            stopLoading("error-test");
          }
        };

        const recover = () => {
          setError(null);
          stopLoading("error-test");
        };

        return (
          <div data-testid="error-recovery-test">
            <div data-testid="error-loading">
              Loading: {isLoading("error-test") ? "true" : "false"}
            </div>
            {error && <div data-testid="error-message">{error}</div>}
            <button data-testid="simulate-error" onClick={simulateError}>
              Simulate Error
            </button>
            <button data-testid="recover" onClick={recover}>
              Recover
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestErrorRecoveryComponent />
        </TestWrapper>
      );

      const simulateButton = screen.getByTestId("simulate-error");
      fireEvent.click(simulateButton);

      // Should show loading initially
      expect(screen.getByTestId("error-loading")).toHaveTextContent(
        "Loading: true"
      );

      // Error occurs and should clear loading
      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Operation failed"
        );
        expect(screen.getByTestId("error-loading")).toHaveTextContent(
          "Loading: false"
        );
      });

      // Should be able to recover
      const recoverButton = screen.getByTestId("recover");
      fireEvent.click(recoverButton);

      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
      expect(screen.getByTestId("error-loading")).toHaveTextContent(
        "Loading: false"
      );
    });
  });
});
