// Mock implementation of StockfishEngine

export class StockfishEngine {
  init = jest.fn().mockImplementation(() => Promise.resolve());
  quit = jest.fn().mockImplementation(() => Promise.resolve());
  setOptions = jest.fn();
  getBestMove = jest.fn().mockImplementation(() => Promise.resolve("e2e4"));
  getMultiPVMoves = jest.fn().mockReturnValue([]);
}
