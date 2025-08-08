import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ComputerChessBoard } from "../ComputerChessBoard";
import {
  GameEngineSettings,
  GameUISettings,
} from "src/data/play-with-computer";

// Mock the StockfishEngine
jest.mock("src/utils/StockfishEngine", () => ({
  StockfishEngine: jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    quit: jest.fn(),
    setOptions: jest.fn(),
    getBestMove: jest.fn().mockResolvedValue("e7e5"),
  })),
}));

// Mock the custom pieces hook
jest.mock("src/components/CustomPieces/CustomPieces", () => ({
  useCustomPieces: () => ({}),
}));

describe("ComputerChessBoard Threat Integration", () => {
  const mockOnThreatsChange = jest.fn();
  const mockOnGameEnd = jest.fn();

  const kidsEngineSettings: GameEngineSettings = {
    skill: 5,
    depth: 3,
    time: 1000,
    MultiPV: 1,
    threads: 1,
    kidsMode: true,
  };

  const adultEngineSettings: GameEngineSettings = {
    skill: 15,
    depth: 10,
    time: 2000,
    MultiPV: 1,
    threads: 1,
    kidsMode: false,
  };

  const kidsUISettings: GameUISettings = {
    showMoveHints: true,
    showThreatHighlight: true,
    showLastMoveArrow: true,
  };

  const adultUISettings: GameUISettings = {
    showMoveHints: false,
    showThreatHighlight: false,
    showLastMoveArrow: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Kids Mode Threat Detection", () => {
    it("should call onThreatsChange with correct threat info in kids mode", async () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      // Wait for initial threat analysis
      await waitFor(() => {
        expect(mockOnThreatsChange).toHaveBeenCalledWith({
          threatSquares: expect.any(Array),
          showHints: true,
          kidsMode: true,
        });
      });
    });

    it("should show hints toggle button in kids mode", () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      const hintsButton = screen.getByText(
        /Скрыть подсказки|Показать подсказки/
      );
      expect(hintsButton).toBeInTheDocument();
    });

    it("should toggle hints when button is clicked", async () => {
      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      const hintsButton = screen.getByText(/Скрыть подсказки/);

      // Click to hide hints
      fireEvent.click(hintsButton);

      await waitFor(() => {
        expect(mockOnThreatsChange).toHaveBeenCalledWith({
          threatSquares: expect.any(Array),
          showHints: false,
          kidsMode: true,
        });
      });

      // Button text should change
      expect(screen.getByText(/Показать подсказки/)).toBeInTheDocument();
    });

    it("should not show threat highlights when hints are disabled", async () => {
      const uiSettingsNoHints: GameUISettings = {
        ...kidsUISettings,
        showMoveHints: false,
      };

      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={uiSettingsNoHints}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      await waitFor(() => {
        expect(mockOnThreatsChange).toHaveBeenCalledWith({
          threatSquares: expect.any(Array),
          showHints: false,
          kidsMode: true,
        });
      });
    });
  });

  describe("Adult Mode Behavior", () => {
    it("should not show hints toggle button in adult mode", () => {
      render(
        <ComputerChessBoard
          settings={adultEngineSettings}
          uiSettings={adultUISettings}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      const hintsButton = screen.queryByText(
        /Скрыть подсказки|Показать подсказки/
      );
      expect(hintsButton).not.toBeInTheDocument();
    });

    it("should call onThreatsChange with empty threats in adult mode", async () => {
      render(
        <ComputerChessBoard
          settings={adultEngineSettings}
          uiSettings={adultUISettings}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      await waitFor(() => {
        expect(mockOnThreatsChange).toHaveBeenCalledWith({
          threatSquares: [],
          showHints: false,
          kidsMode: false,
        });
      });
    });
  });

  describe("Threat Highlighting Disabled", () => {
    it("should not detect threats when threat highlighting is disabled", async () => {
      const uiSettingsNoThreats: GameUISettings = {
        ...kidsUISettings,
        showThreatHighlight: false,
      };

      render(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={uiSettingsNoThreats}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      await waitFor(() => {
        expect(mockOnThreatsChange).toHaveBeenCalledWith({
          threatSquares: [],
          showHints: true,
          kidsMode: true,
        });
      });
    });
  });

  describe("Settings Changes", () => {
    it("should update threat detection when switching from adult to kids mode", async () => {
      const { rerender } = render(
        <ComputerChessBoard
          settings={adultEngineSettings}
          uiSettings={adultUISettings}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      // Initially should have no threats in adult mode
      await waitFor(() => {
        expect(mockOnThreatsChange).toHaveBeenCalledWith({
          threatSquares: [],
          showHints: false,
          kidsMode: false,
        });
      });

      // Switch to kids mode
      rerender(
        <ComputerChessBoard
          settings={kidsEngineSettings}
          uiSettings={kidsUISettings}
          onGameEnd={mockOnGameEnd}
          onThreatsChange={mockOnThreatsChange}
        />
      );

      // Should now detect threats in kids mode
      await waitFor(() => {
        expect(mockOnThreatsChange).toHaveBeenCalledWith({
          threatSquares: expect.any(Array),
          showHints: true,
          kidsMode: true,
        });
      });
    });
  });

  describe("Callback Safety", () => {
    it("should not crash when onThreatsChange is not provided", () => {
      expect(() => {
        render(
          <ComputerChessBoard
            settings={kidsEngineSettings}
            uiSettings={kidsUISettings}
            onGameEnd={mockOnGameEnd}
          />
        );
      }).not.toThrow();
    });
  });
});
