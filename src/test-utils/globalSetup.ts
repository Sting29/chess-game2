// Global setup that runs after test environment is set up

import "@testing-library/jest-dom";

// Global test utilities
import { cleanup } from "@testing-library/react";

// Setup global mocks
import { setupGlobalMocks } from "./mocks";

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clean up any global mocks
  if ((global as any).cleanupMocks) {
    (global as any).cleanupMocks();
  }

  // Clear all timers
  jest.clearAllTimers();

  // Restore Date.now if it was mocked
  if ((global as any).restoreDateNow) {
    (global as any).restoreDateNow();
  }
});

// Global beforeEach setup
beforeEach(() => {
  // Reset console mocks
  jest.clearAllMocks();

  // Ensure clean state for each test
  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

// Handle unhandled promise rejections in tests
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock IntersectionObserver for components that might use it
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = "0px";
  thresholds: ReadonlyArray<number> = [];

  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
