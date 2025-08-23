import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loader from "../Loader";

describe("Loader Accessibility", () => {
  describe("ARIA attributes and roles", () => {
    it("should have proper ARIA attributes", () => {
      render(<Loader />);

      const loader = screen.getByRole("status");
      expect(loader).toHaveAttribute("aria-label", "Loading");
      expect(loader).toHaveAttribute("aria-live", "polite");
    });

    it("should support custom aria-label", () => {
      render(<Loader ariaLabel="Processing data" />);

      const loader = screen.getByRole("status");
      expect(loader).toHaveAttribute("aria-label", "Processing data");
    });

    it("should have screen reader only text", () => {
      render(<Loader ariaLabel="Custom loading message" />);

      // Check that screen reader text exists
      const srText = screen.getByText("Custom loading message");
      expect(srText).toBeInTheDocument();

      // Verify it's visually hidden but accessible to screen readers
      const styles = window.getComputedStyle(srText);
      expect(styles.position).toBe("absolute");
      expect(styles.width).toBe("1px");
      expect(styles.height).toBe("1px");
    });
  });

  describe("Size variants", () => {
    it("should render small size correctly", () => {
      render(<Loader size="small" />);
      const loader = screen.getByRole("status");
      expect(loader).toBeInTheDocument();
    });

    it("should render medium size correctly", () => {
      render(<Loader size="medium" />);
      const loader = screen.getByRole("status");
      expect(loader).toBeInTheDocument();
    });

    it("should render large size correctly", () => {
      render(<Loader size="large" />);
      const loader = screen.getByRole("status");
      expect(loader).toBeInTheDocument();
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

      render(<Loader />);
      const loader = screen.getByRole("status");
      expect(loader).toBeInTheDocument();
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

      render(<Loader />);
      const loader = screen.getByRole("status");
      expect(loader).toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("should apply custom className", () => {
      render(<Loader className="custom-loader" />);
      const loader = screen.getByRole("status");
      expect(loader).toHaveClass("custom-loader");
    });
  });
});
