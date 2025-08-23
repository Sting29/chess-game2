import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingOverlay from "../LoadingOverlay";

describe("LoadingOverlay Accessibility", () => {
  const TestContent = () => (
    <div>
      <button>Test Button</button>
      <input placeholder="Test Input" />
    </div>
  );

  describe("ARIA attributes and roles", () => {
    it("should have proper ARIA attributes when visible", () => {
      render(
        <LoadingOverlay isVisible={true} message="Loading data...">
          <TestContent />
        </LoadingOverlay>
      );

      const overlay = screen.getByRole("dialog");
      expect(overlay).toHaveAttribute("aria-modal", "true");
      expect(overlay).toHaveAttribute("aria-busy", "true");
      expect(overlay).toHaveAttribute("aria-label", "Loading");
    });

    it("should support custom aria-label", () => {
      render(
        <LoadingOverlay
          isVisible={true}
          message="Saving changes..."
          ariaLabel="Saving your data"
        >
          <TestContent />
        </LoadingOverlay>
      );

      const overlay = screen.getByRole("dialog");
      expect(overlay).toHaveAttribute("aria-label", "Saving your data");
    });

    it("should have live regions for screen reader announcements", () => {
      render(
        <LoadingOverlay isVisible={true} message="Processing request...">
          <TestContent />
        </LoadingOverlay>
      );

      // Check for polite live region
      const politeRegion = screen.getByText("Processing request...", {
        selector: "[aria-live='polite']",
      });
      expect(politeRegion).toHaveAttribute("aria-live", "polite");
      expect(politeRegion).toHaveAttribute("aria-atomic", "true");

      // Check for assertive live region (screen reader only)
      const assertiveRegion = screen.getByText("Processing request...", {
        selector: "[aria-live='assertive']",
      });
      expect(assertiveRegion).toHaveAttribute("aria-live", "assertive");
    });
  });

  describe("Focus management", () => {
    it("should focus the overlay when it becomes visible", () => {
      const { rerender } = render(
        <LoadingOverlay isVisible={false}>
          <TestContent />
        </LoadingOverlay>
      );

      // Make overlay visible
      rerender(
        <LoadingOverlay isVisible={true}>
          <TestContent />
        </LoadingOverlay>
      );

      const overlay = screen.getByRole("dialog");
      expect(overlay).toHaveFocus();
    });

    it("should restore focus when overlay is hidden", () => {
      const TestWithButton = () => {
        const [isLoading, setIsLoading] = React.useState(false);
        return (
          <LoadingOverlay isVisible={isLoading}>
            <button
              onClick={() => setIsLoading(!isLoading)}
              data-testid="toggle-button"
            >
              Toggle Loading
            </button>
          </LoadingOverlay>
        );
      };

      render(<TestWithButton />);

      const button = screen.getByTestId("toggle-button");
      button.focus();
      expect(button).toHaveFocus();

      // Show overlay
      fireEvent.click(button);
      const overlay = screen.getByRole("dialog");
      expect(overlay).toHaveFocus();

      // Hide overlay
      fireEvent.click(button);
      expect(button).toHaveFocus();
    });
  });

  describe("Keyboard navigation", () => {
    it("should prevent keyboard interactions with background content", () => {
      render(
        <LoadingOverlay isVisible={true}>
          <TestContent />
        </LoadingOverlay>
      );

      const overlay = screen.getByRole("dialog");

      // Test that Tab key is prevented
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });

      overlay.dispatchEvent(tabEvent);
      expect(tabEvent.defaultPrevented).toBe(true);
    });

    it("should allow Escape key to bubble up", () => {
      render(
        <LoadingOverlay isVisible={true}>
          <TestContent />
        </LoadingOverlay>
      );

      const overlay = screen.getByRole("dialog");

      // Test that Escape key is not prevented
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      });

      overlay.dispatchEvent(escapeEvent);
      expect(escapeEvent.defaultPrevented).toBe(false);
    });
  });

  describe("Screen reader support", () => {
    it("should have screen reader only content for important announcements", () => {
      render(
        <LoadingOverlay isVisible={true} message="Uploading file...">
          <TestContent />
        </LoadingOverlay>
      );

      // Check that screen reader only content exists and is properly hidden
      const srOnlyElement = screen.getByText("Uploading file...", {
        selector: "[aria-live='assertive']",
      });

      const styles = window.getComputedStyle(srOnlyElement);
      expect(styles.position).toBe("absolute");
      expect(styles.width).toBe("1px");
      expect(styles.height).toBe("1px");
    });
  });

  describe("High contrast mode support", () => {
    it("should render without errors in high contrast mode", () => {
      // Mock high contrast media query
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-contrast: high)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <LoadingOverlay isVisible={true} message="Loading...">
          <TestContent />
        </LoadingOverlay>
      );

      const overlay = screen.getByRole("dialog");
      expect(overlay).toBeInTheDocument();
    });
  });

  describe("Reduced motion support", () => {
    it("should render without errors when reduced motion is preferred", () => {
      // Mock reduced motion media query
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <LoadingOverlay isVisible={true} message="Loading...">
          <TestContent />
        </LoadingOverlay>
      );

      const overlay = screen.getByRole("dialog");
      expect(overlay).toBeInTheDocument();
    });
  });
});
