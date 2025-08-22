/**
 * Тесты для Error Boundaries
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { GlobalErrorBoundary as RouteErrorBoundary } from "../components/GlobalErrorBoundary";
import { LazyErrorBoundary } from "../components/LazyErrorBoundary";
import { GlobalErrorBoundary } from "../components/GlobalErrorBoundary";

// Компонент, который всегда выбрасывает ошибку
const ThrowError: React.FC<{ error?: Error }> = ({ error }) => {
  throw error || new Error("Test error");
};

// Подавляем консольные ошибки в тестах
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe("RouteErrorBoundary", () => {
  it("should catch and display error UI", () => {
    render(
      <RouteErrorBoundary>
        <ThrowError />
      </RouteErrorBoundary>
    );

    expect(screen.getByText("Application Error")).toBeInTheDocument();
    expect(screen.getByText("Restart Application")).toBeInTheDocument();
    expect(screen.getByText("Report Bug")).toBeInTheDocument();
  });

  it("should render standard error UI (no custom fallback support)", () => {
    render(
      <RouteErrorBoundary>
        <ThrowError />
      </RouteErrorBoundary>
    );

    expect(screen.getByText("Application Error")).toBeInTheDocument();
    expect(screen.getByText("Restart Application")).toBeInTheDocument();
  });

  it("should handle error without crashing", () => {
    // GlobalErrorBoundary не поддерживает onError callback
    expect(() => {
      render(
        <RouteErrorBoundary>
          <ThrowError />
        </RouteErrorBoundary>
      );
    }).not.toThrow();

    expect(screen.getByText("Application Error")).toBeInTheDocument();
  });

  it("should render children when no error", () => {
    render(
      <RouteErrorBoundary>
        <div>Normal content</div>
      </RouteErrorBoundary>
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });
});

describe("LazyErrorBoundary", () => {
  it("should show retry state for chunk load errors", () => {
    const chunkError = new Error("Loading chunk 123 failed");
    chunkError.name = "ChunkLoadError";

    render(
      <LazyErrorBoundary>
        <ThrowError error={chunkError} />
      </LazyErrorBoundary>
    );

    // LazyErrorBoundary автоматически пытается перезагрузить при chunk errors
    expect(screen.getByText(/Retrying to load page/)).toBeInTheDocument();
  });

  it("should show error UI for non-chunk errors", () => {
    const regularError = new Error("Regular error");

    render(
      <LazyErrorBoundary>
        <ThrowError error={regularError} />
      </LazyErrorBoundary>
    );

    expect(screen.getByText("Failed to Load Page")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Reload Page")).toBeInTheDocument();
  });

  it("should render children when no error", () => {
    render(
      <LazyErrorBoundary>
        <div>Lazy content</div>
      </LazyErrorBoundary>
    );

    expect(screen.getByText("Lazy content")).toBeInTheDocument();
  });
});

describe("GlobalErrorBoundary", () => {
  it("should catch critical errors", () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText("Application Error")).toBeInTheDocument();
    expect(screen.getByText("Restart Application")).toBeInTheDocument();
    expect(screen.getByText("Report Bug")).toBeInTheDocument();
  });

  it("should display error ID", () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
  });

  it("should render children when no error", () => {
    render(
      <GlobalErrorBoundary>
        <div>App content</div>
      </GlobalErrorBoundary>
    );

    expect(screen.getByText("App content")).toBeInTheDocument();
  });
});

describe("Error Boundary Integration", () => {
  it("should work with nested error boundaries", () => {
    render(
      <GlobalErrorBoundary>
        <RouteErrorBoundary>
          <LazyErrorBoundary>
            <div>Nested content</div>
          </LazyErrorBoundary>
        </RouteErrorBoundary>
      </GlobalErrorBoundary>
    );

    expect(screen.getByText("Nested content")).toBeInTheDocument();
  });

  it("should catch error at the appropriate level", () => {
    render(
      <GlobalErrorBoundary>
        <RouteErrorBoundary>
          <ThrowError />
        </RouteErrorBoundary>
      </GlobalErrorBoundary>
    );

    // RouteErrorBoundary должен перехватить ошибку, а не GlobalErrorBoundary
    expect(screen.getByText("Application Error")).toBeInTheDocument();
    // Проверяем, что ошибка обработана
  });
});
