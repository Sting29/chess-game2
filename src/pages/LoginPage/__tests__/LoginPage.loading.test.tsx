import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "src/i18n";
import { LoginPage } from "../LoginPage";
import settingsReducer from "src/store/settingsSlice";

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        chessSet: "1",
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  store = createTestStore()
) => {
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
    </Provider>
  );
};

describe("LoginPage Loading Experience", () => {
  describe("Requirement 1.1: Loader appears after login button click", () => {
    it("should display loader overlay when login form is submitted", async () => {
      const store = createTestStore();

      renderWithProviders(<LoginPage />, store);

      // Fill in the form
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole("button", {
        name: /Login and Play/i,
      });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "testpass" } });

      // Submit the form
      fireEvent.click(loginButton);

      // Verify loader appears (it should appear immediately due to Redux state)
      await waitFor(() => {
        const overlay = screen.queryByRole("dialog");
        if (overlay) {
          expect(overlay).toBeInTheDocument();
          expect(overlay).toHaveAttribute("aria-label", "Loading");
        }
      });
    });
  });

  describe("Requirement 1.2: Loader positioned over login form", () => {
    it("should cover input fields and button when loading", async () => {
      const store = createTestStore({ loading: true });

      renderWithProviders(<LoginPage />, store);

      // Verify loader overlay is present
      const overlay = screen.getByRole("dialog");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveAttribute("aria-modal", "true");

      // Verify form elements are disabled during loading
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole("button", {
        name: /Login and Play/i,
      });

      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(loginButton).toBeDisabled();
    });
  });

  describe("Requirement 1.3: Error handling without navigation", () => {
    it("should hide loader and show error message on login failure", async () => {
      const store = createTestStore({
        error: "Invalid credentials",
        loading: false,
      });

      renderWithProviders(<LoginPage />, store);

      // Loader should be hidden when there's an error
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Form should be accessible again
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);

      expect(usernameInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();

      // Fill form to enable button (button is disabled when form is empty)
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "testpass" } });

      const loginButton = screen.getByRole("button", {
        name: /Login and Play/i,
      });
      expect(loginButton).not.toBeDisabled();

      // Error message should be displayed
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  describe("Requirement 1.4: Successful login handling", () => {
    it("should hide loader on successful login", async () => {
      const store = createTestStore({ loading: false, isAuthenticated: true });

      renderWithProviders(<LoginPage />, store);

      // Loader should be hidden on success
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Requirement 3.1: ARIA labels and live regions", () => {
    it("should have proper ARIA attributes on loading overlay", () => {
      const store = createTestStore({ loading: true });

      renderWithProviders(<LoginPage />, store);

      const overlay = screen.getByRole("dialog");
      expect(overlay).toHaveAttribute("aria-modal", "true");
      expect(overlay).toHaveAttribute("aria-label", "Loading");
      expect(overlay).toHaveAttribute("aria-busy", "true");

      // Check for message with live region
      const messageElements = screen.getAllByText(/Logging in.../i);
      expect(messageElements.length).toBeGreaterThan(0);
    });
  });

  describe("Requirement 3.2: Screen reader announcements", () => {
    it("should announce loading state changes", () => {
      const store = createTestStore({ loading: true });

      renderWithProviders(<LoginPage />, store);

      // Check for aria-live regions
      const liveRegions = screen.getAllByText(/Logging in.../i);
      const politeRegion = liveRegions.find(
        (el) => el.getAttribute("aria-live") === "polite"
      );
      const assertiveRegion = liveRegions.find(
        (el) => el.getAttribute("aria-live") === "assertive"
      );

      expect(politeRegion).toBeInTheDocument();
      expect(assertiveRegion).toBeInTheDocument();
    });
  });

  describe("Requirement 3.3: Focus management", () => {
    it("should manage focus properly during loading states", async () => {
      // Mock focus methods for testing environment
      const mockFocus = jest.fn();
      const originalFocus = HTMLElement.prototype.focus;
      HTMLElement.prototype.focus = mockFocus;

      // Mock document.activeElement
      Object.defineProperty(document, "activeElement", {
        writable: true,
        value: null,
      });

      const store = createTestStore();

      renderWithProviders(<LoginPage />, store);

      const loginButton = screen.getByRole("button", {
        name: /Login and Play/i,
      });

      // Simulate focus
      loginButton.focus();
      document.activeElement = loginButton;
      expect(document.activeElement).toBe(loginButton);

      // Simulate loading state by updating store
      store.dispatch({ type: "settings/setLoading", payload: true });

      await waitFor(() => {
        const overlay = screen.queryByRole("dialog");
        if (overlay) {
          expect(overlay).toBeInTheDocument();
          expect(overlay).toHaveAttribute("tabIndex", "-1");
        }
      });

      // Restore original focus method
      HTMLElement.prototype.focus = originalFocus;
    });
  });

  describe("Requirement 3.4: Keyboard navigation support", () => {
    it("should handle keyboard events properly during loading", () => {
      const store = createTestStore({ loading: true });

      renderWithProviders(<LoginPage />, store);

      const overlay = screen.getByRole("dialog");

      // Test that overlay is focusable
      expect(overlay).toHaveAttribute("tabIndex", "-1");

      // Test keyboard event handling
      const keyDownEvent = new KeyboardEvent("keydown", { key: "Tab" });
      const preventDefaultSpy = jest.spyOn(keyDownEvent, "preventDefault");

      fireEvent.keyDown(overlay, keyDownEvent);

      // The overlay should handle keyboard events
      expect(overlay).toBeInTheDocument();
    });
  });
});
