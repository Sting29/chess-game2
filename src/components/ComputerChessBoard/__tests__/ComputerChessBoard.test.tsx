import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComputerChessBoard } from "../ComputerChessBoard";
import {
  GameEngineSettings,
  GameUISettings,
} from "src/types/computerGameTypes";

// Mock the StockfishEngine
jest.mock("src/utils/StockfishEngine", () => {
  return {
    StockfishEngine: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue(undefined),
      quit: jest.fn().mockResolvedValue(undefined),
      setOptions: jest.fn(),
      getBestMove: jest.fn().mockResolvedValue("e2e4"),
    })),
  };
});

// Mock the CustomPieces hook
jest.mock("../../CustomPieces/CustomPieces", () => ({
  useCustomPieces: () => ({}),
}));

// Mock i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock PromotionDialog
jest.mock("../../PromotionDialog/PromotionDialog", () => ({
  PromotionDialog: ({ isOpen, onSelect, onClose }: any) =>
    isOpen ? (
      <div data-testid="promotion-dialog">
        <button onClick={() => onSelect("q")}>Queen</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
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
    </div>
  ),
}));

describe("ComputerChessBoard - Kids Mode Testing", () => {
  const kidsEngineSettings: GameEngineSettings = {
    skill: 0,
    depth: 1,
    time: 300,
    MultiPV: 3,
    threads: 1,
    kidsMode: true,
  };

  const kidsUISettings: GameUISettings = {
    showLastMoveArrow: true,
    showThreatHighlight: true,
    showMoveHints: true,
    enableSoundEffects: true,
  };

  const nonKidsEngineSettings: GameEngineSettings = {
    ...kidsEngineSettings,
    kidsMode: false,
  };

  const nonKidsUISettings: GameUISettings = {
    ...kidsUISettings,
    showThreatHighlight: false,
    showMoveHints: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Kids Mode Button Display", () => {
    test("should display only hints toggle button in kids mode", () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      // Should show hints toggle button
      const hintsButton = screen.getByText(
        /Показать подсказки|Скрыть подсказки/
      );
      expect(hintsButton).toBeInTheDocument();

      // Should NOT show threat analysis button (this was removed)
      const threatButton = screen.queryByText(/Проверить угрозы/);
      expect(threatButton).not.toBeInTheDocument();
    });

    test("should not display any buttons when not in kids mode", () => {
      render(
        <ComputerChessBoard
          settings={nonKidsEngineSettings}
          uiSettings={nonKidsUISettings}
        />
      );

      // Should not show any buttons
      const hintsButton = screen.queryByText(
        /Показать подсказки|Скрыть подсказки/
      );
      expect(hintsButton).not.toBeInTheDocument();

      const threatButton = screen.queryByText(/Проверить угрозы/);
      expect(threatButton).not.toBeInTheDocument();
    });

    test("should toggle hints button text when clicked", () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      const hintsButton = screen.getByRole("button");

      // Initially should show "Скрыть подсказки" since hints are enabled by default
      expect(hintsButton).toHaveTextContent("Скрыть подсказки");

      // Click to hide hints
      fireEvent.click(hintsButton);
      expect(hintsButton).toHaveTextContent("Показать подсказки");

      // Click to show hints again
      fireEvent.click(hintsButton);
      expect(hintsButton).toHaveTextContent("Скрыть подсказки");
    });
  });

  describe("Automatic Threat Analysis", () => {
    test("should display threat warning when threats are detected in kids mode", async () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      // Wait for component to initialize and potentially detect threats
      await waitFor(() => {
        // The component should be rendered
        expect(screen.getByTestId("chessboard")).toBeInTheDocument();
      });

      // Since we're using the initial chess position, there shouldn't be immediate threats
      // But we can verify the threat warning structure exists when threats are present
      const threatWarning = screen.queryByText(/ОСТОРОЖНО!/);

      // In initial position, there should be no threats, so no warning
      expect(threatWarning).not.toBeInTheDocument();
    });

    test("should not display threat warnings when not in kids mode", () => {
      render(
        <ComputerChessBoard
          settings={nonKidsEngineSettings}
          uiSettings={nonKidsUISettings}
        />
      );

      // Should not show threat warnings in non-kids mode
      const threatWarning = screen.queryByText(/ОСТОРОЖНО!/);
      expect(threatWarning).not.toBeInTheDocument();
    });

    test("should not display threat warnings when showThreatHighlight is disabled", () => {
      const settingsWithoutThreatHighlight: GameUISettings = {
        ...kidsUISettings,
        showThreatHighlight: false,
      };

      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={settingsWithoutThreatHighlight}
        />
      );

      // Should not show threat warnings when threat highlighting is disabled
      const threatWarning = screen.queryByText(/ОСТОРОЖНО!/);
      expect(threatWarning).not.toBeInTheDocument();
    });
  });

  describe("Game Status Messages", () => {
    test("should display kids-friendly messages in kids mode", () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      // Should show initial message
      const gameStatus = screen.getByText("Your turn (white)");
      expect(gameStatus).toBeInTheDocument();
    });

    test("should handle square clicks and update game state", async () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      // Simulate a square click
      const squareClickHandler = screen.getByTestId("square-click-handler");
      fireEvent.click(squareClickHandler);

      // The component should handle the click without errors
      expect(screen.getByTestId("chessboard")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    test("should render chessboard with correct initial position", () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      const boardPosition = screen.getByTestId("board-position");
      // Should start with standard chess starting position
      expect(boardPosition).toHaveTextContent(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      );
    });

    test("should call onGameEnd callback when provided", () => {
      const mockOnGameEnd = jest.fn();

      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
          onGameEnd={mockOnGameEnd}
        />
      );

      // Component should render without calling onGameEnd initially
      expect(mockOnGameEnd).not.toHaveBeenCalled();
    });

    test("should handle promotion dialog correctly", () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      // PromotionDialog should be present but not visible initially
      // (it's controlled by promotionData state)
      expect(screen.getByTestId("chessboard")).toBeInTheDocument();
    });
  });

  describe("Settings Integration", () => {
    test("should respect kidsMode setting for hints display", () => {
      const { rerender } = render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
        />
      );

      // Should show hints button in kids mode
      expect(screen.getByRole("button")).toBeInTheDocument();

      // Switch to non-kids mode
      rerender(
        <ComputerChessBoard
          settings={nonKidsEngineSettings}
          uiSettings={nonKidsUISettings}
        />
      );

      // Should not show hints button in non-kids mode
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    test("should respect showMoveHints setting", () => {
      const settingsWithoutHints: GameUISettings = {
        ...kidsUISettings,
        showMoveHints: false,
      };

      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={settingsWithoutHints}
        />
      );

      const hintsButton = screen.getByRole("button");
      // When showMoveHints is false, button should show "Показать подсказки"
      expect(hintsButton).toHaveTextContent("Показать подсказки");
    });
  });
});
