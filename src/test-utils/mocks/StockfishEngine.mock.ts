// Comprehensive mock for StockfishEngine

export class MockStockfishEngine {
  private worker: Worker | null = null;
  private currentResolve: ((value: string) => void) | null = null;
  private isReady: boolean = false;
  private settings: {
    skill: number;
    depth: number;
    time: number;
    MultiPV: number;
    threads: number;
    kidsMode?: boolean;
  } = {
    skill: 0,
    depth: 1,
    time: 300,
    MultiPV: 3,
    threads: 1,
    kidsMode: false,
  };
  private multiPVMoves: { move: string; score: number }[] = [];

  // Mock implementation of init method
  init = jest.fn().mockImplementation(() => {
    this.isReady = true;
    // Simulate async initialization
    return Promise.resolve();
  });

  // Mock implementation of quit method
  quit = jest.fn().mockImplementation(() => {
    this.worker = null;
    this.isReady = false;
    this.currentResolve = null;
    return Promise.resolve();
  });

  // Mock implementation of setOptions method
  setOptions = jest
    .fn()
    .mockImplementation((options: { [key: string]: number | boolean }) => {
      Object.entries(options).forEach(([key, value]) => {
        if (key === "Skill") {
          this.settings.skill = value as number;
        } else if (key === "Depth") {
          this.settings.depth = value as number;
        } else if (key === "Time") {
          this.settings.time = value as number;
        } else if (key === "MultiPV") {
          this.settings.MultiPV = value as number;
        } else if (key === "Threads") {
          this.settings.threads = value as number;
        } else if (key === "KidsMode") {
          this.settings.kidsMode = value as boolean;
        }
      });
    });

  // Mock implementation of getBestMove method
  getBestMove = jest
    .fn()
    .mockImplementation(
      async (fen: string, legalMoves?: any[]): Promise<string> => {
        // Simulate thinking time
        await new Promise((resolve) => setTimeout(resolve, 10));

        // If in kids mode and legal moves provided, return random move
        if (this.settings.kidsMode && legalMoves && legalMoves.length > 0) {
          const randomMove =
            legalMoves[Math.floor(Math.random() * legalMoves.length)];
          return randomMove.from + randomMove.to + (randomMove.promotion || "");
        }

        // Return default moves based on position
        if (fen.includes("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")) {
          // Starting position
          return "e2e4";
        } else if (fen.includes("w")) {
          // White to move
          return "e2e4";
        } else {
          // Black to move
          return "e7e5";
        }
      }
    );

  // Mock implementation of getMultiPVMoves method
  getMultiPVMoves = jest.fn().mockImplementation(() => {
    return this.multiPVMoves;
  });

  // Helper methods for testing
  setReady(ready: boolean) {
    this.isReady = ready;
  }

  getSettings() {
    return { ...this.settings };
  }

  simulateEngineError() {
    if (this.currentResolve) {
      this.currentResolve("e2e4"); // Default move on error
      this.currentResolve = null;
    }
  }

  // Mock private methods for testing
  private sendCommand = jest.fn();
  private parseMultiPVInfo = jest.fn();
}

// Create the mock factory
export const createMockStockfishEngine = () => new MockStockfishEngine();

// Jest mock implementation
export const StockfishEngineMock = {
  StockfishEngine: jest
    .fn()
    .mockImplementation(() => createMockStockfishEngine()),
};

// Default export for easy mocking
export default MockStockfishEngine;
