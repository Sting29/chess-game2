// Central mock exports
import React from 'react';

export {
  MockStockfishEngine,
  createMockStockfishEngine,
  StockfishEngineMock,
} from "./StockfishEngine.mock";

export {
  mockAxios,
  mockAxiosInstance,
  mockAxiosCreate,
  setupAxiosMocks,
  createMockAxiosError,
  createMockAxiosResponse,
  type MockAxiosInstance,
} from "./axios.mock";

// Global mock setup function
export const setupGlobalMocks = () => {
  // Mock StockfishEngine globally
  jest.mock("src/utils/StockfishEngine", () => ({
    StockfishEngine: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue(undefined),
      quit: jest.fn().mockResolvedValue(undefined),
      setOptions: jest.fn(),
      getBestMove: jest.fn().mockResolvedValue("e2e4"),
      getMultiPVMoves: jest.fn().mockReturnValue([]),
    })),
  }));

  // Mock react-chessboard
  jest.mock("react-chessboard", () => ({
    Chessboard: ({ options }: any) => (
      <div data-testid="chessboard">
        <div data-testid="board-position">{options.position}</div>
        {options.onSquareClick && (
          <button
            data-testid="square-click-handler"
            onClick={() => options.onSquareClick({ square: "e2" })}
          >
            Click Square
          </button>
        )}
        {options.onPieceDrop && (
          <button
            data-testid="piece-drop-handler"
            onClick={() =>
              options.onPieceDrop({ sourceSquare: "e2", targetSquare: "e4" })
            }
          >
            Drop Piece
          </button>
        )}
      </div>
    ),
  }));

  // Mock react-i18next
  jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: jest.fn(),
        language: "en",
      },
    }),
    Trans: ({ children }: any) => children,
    I18nextProvider: ({ children }: any) => children,
  }));

  // Mock CustomPieces hook
  jest.mock("src/components/CustomPieces/CustomPieces", () => ({
    useCustomPieces: () => ({}),
  }));

  // Mock PromotionDialog
  jest.mock("src/components/PromotionDialog/PromotionDialog", () => ({
    PromotionDialog: ({ isOpen, onSelect, onClose }: any) =>
      isOpen ? (
        <div data-testid="promotion-dialog">
          <button onClick={() => onSelect("q")}>Queen</button>
          <button onClick={() => onSelect("r")}>Rook</button>
          <button onClick={() => onSelect("b")}>Bishop</button>
          <button onClick={() => onSelect("n")}>Knight</button>
          <button onClick={onClose}>Close</button>
        </div>
      ) : null,
  }));
};
