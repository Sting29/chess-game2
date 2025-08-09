// Global setup for Jest tests - runs before each test file

// Mock Worker API for StockfishEngine
global.Worker = class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  constructor(public url: string) {}

  postMessage(message: any) {
    // Simulate async response
    setTimeout(() => {
      if (this.onmessage) {
        if (message === "uci") {
          this.onmessage(new MessageEvent("message", { data: "uciok" }));
        } else if (message === "isready") {
          this.onmessage(new MessageEvent("message", { data: "readyok" }));
        } else if (message.startsWith("go")) {
          this.onmessage(
            new MessageEvent("message", { data: "bestmove e2e4" })
          );
        }
      }
    }, 10);
  }

  terminate() {
    // Mock terminate
  }
} as any;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Restore console for specific tests if needed
(global as any).restoreConsole = () => {
  global.console = originalConsole;
};

// Mock Date.now for consistent testing
const originalDateNow = Date.now;
let mockDateNow: number | null = null;

(global as any).mockDateNow = (timestamp: number) => {
  mockDateNow = timestamp;
  Date.now = jest.fn(() => mockDateNow!);
};

(global as any).restoreDateNow = () => {
  Date.now = originalDateNow;
  mockDateNow = null;
};

// Cleanup function for tests
(global as any).cleanupMocks = () => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
};
