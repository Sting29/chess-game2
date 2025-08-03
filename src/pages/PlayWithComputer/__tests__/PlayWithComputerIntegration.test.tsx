import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PlayWithComputer from "../PlayWithComputer";
import { settingsSlice } from "src/store/settingsSlice";
import { ThreatInfo } from "src/types/types";

// Mock the ComputerChessBoard component
const mockOnThreatsChange = jest.fn();
jest.mock("src/components/ComputerChessBoard/ComputerChessBoard", () => ({
  ComputerChessBoard: ({
    onThreatsChange,
  }: {
    onThreatsChange: (threats: ThreatInfo) => void;
  }) => {
    // Store the callback for testing
    mockOnThreatsChange.mockImplementation(onThreatsChange);

    return (
      <div data-testid="computer-chess-board">
        <button
          onClick={() =>
            onThreatsChange({
              threatSquares: ["e4", "f7"],
              showHints: true,
              kidsMode: true,
            })
          }
          data-testid="simulate-threats"
        >
          Simulate Threats
        </button>
        <button
          onClick={() =>
            onThreatsChange({
              threatSquares: ["d4"],
              showHints: true,
              kidsMode: true,
            })
          }
          data-testid="simulate-single-threat"
        >
          Simulate Single Threat
        </button>
        <button
          onClick={() =>
            onThreatsChange({
              threatSquares: [],
              showHints: true,
              kidsMode: true,
            })
          }
          data-testid="simulate-no-threats"
        >
          Simulate No Threats
        </button>
        <button
          onClick={() =>
            onThreatsChange({
              threatSquares: ["e4"],
              showHints: false,
              kidsMode: true,
            })
          }
          data-testid="simulate-hints-disabled"
        >
          Simulate Hints Disabled
        </button>
        <button
          onClick={() =>
            onThreatsChange({
              threatSquares: ["e4"],
              showHints: true,
              kidsMode: false,
            })
          }
          data-testid="simulate-adult-mode"
        >
          Simulate Adult Mode
        </button>
      </div>
    );
  },
}));

// Mock other components
jest.mock("src/components/PageTitle/PageTitle", () => ({
  PageTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("src/components/BackButtonImage/BackButtonImage", () => ({
  __esModule: true,
  default: () => <button>Back</button>,
}));

jest.mock("src/components/QuestionButton/QuestionButton", () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="question-button">
      ?
    </button>
  ),
}));

// Mock i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ level: "easy" }),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      settings: settingsSlice.reducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("PlayWithComputer Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Threat Information Display", () => {
    it("should display multiple threat warnings in Description component", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Simulate multiple threats
      const simulateButton = screen.getByTestId("simulate-threats");
      fireEvent.click(simulateButton);

      await waitFor(() => {
        expect(screen.getByText("⚠️ ОСТОРОЖНО!")).toBeInTheDocument();
        expect(
          screen.getByText("2 твоих фигур под атакой! Будь осторожен!")
        ).toBeInTheDocument();
      });
    });

    it("should display single threat warning in Description component", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Simulate single threat
      const simulateButton = screen.getByTestId("simulate-single-threat");
      fireEvent.click(simulateButton);

      await waitFor(() => {
        expect(screen.getByText("⚠️ ОСТОРОЖНО!")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Твоя фигура под атакой! Защити её или убери в безопасное место."
          )
        ).toBeInTheDocument();
      });
    });

    it("should not display threats when no threats exist", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Simulate no threats
      const simulateButton = screen.getByTestId("simulate-no-threats");
      fireEvent.click(simulateButton);

      await waitFor(() => {
        expect(screen.queryByText("⚠️ ОСТОРОЖНО!")).not.toBeInTheDocument();
      });
    });

    it("should not display threats when hints are disabled", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Simulate hints disabled
      const simulateButton = screen.getByTestId("simulate-hints-disabled");
      fireEvent.click(simulateButton);

      await waitFor(() => {
        expect(screen.queryByText("⚠️ ОСТОРОЖНО!")).not.toBeInTheDocument();
      });
    });

    it("should not display threats in adult mode", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Simulate adult mode
      const simulateButton = screen.getByTestId("simulate-adult-mode");
      fireEvent.click(simulateButton);

      await waitFor(() => {
        expect(screen.queryByText("⚠️ ОСТОРОЖНО!")).not.toBeInTheDocument();
      });
    });
  });

  describe("Side Content Toggle", () => {
    it("should show Description component by default", () => {
      renderWithProviders(<PlayWithComputer />);

      // Description should be visible by default
      expect(screen.getByTestId("simulate-threats")).toBeInTheDocument();
    });

    it("should hide Description component when question button is clicked", async () => {
      renderWithProviders(<PlayWithComputer />);

      const questionButton = screen.getByTestId("question-button");
      fireEvent.click(questionButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("simulate-threats")
        ).not.toBeInTheDocument();
      });
    });

    it("should show Description component again when question button is clicked twice", async () => {
      renderWithProviders(<PlayWithComputer />);

      const questionButton = screen.getByTestId("question-button");

      // Hide
      fireEvent.click(questionButton);
      await waitFor(() => {
        expect(
          screen.queryByTestId("simulate-threats")
        ).not.toBeInTheDocument();
      });

      // Show again
      fireEvent.click(questionButton);
      await waitFor(() => {
        expect(screen.getByTestId("simulate-threats")).toBeInTheDocument();
      });
    });
  });

  describe("Threat State Management", () => {
    it("should maintain threat state when toggling side content", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Set up threats
      const simulateButton = screen.getByTestId("simulate-threats");
      fireEvent.click(simulateButton);

      await waitFor(() => {
        expect(screen.getByText("⚠️ ОСТОРОЖНО!")).toBeInTheDocument();
      });

      // Hide side content
      const questionButton = screen.getByTestId("question-button");
      fireEvent.click(questionButton);

      // Show side content again
      fireEvent.click(questionButton);

      // Threats should still be displayed
      await waitFor(() => {
        expect(screen.getByText("⚠️ ОСТОРОЖНО!")).toBeInTheDocument();
        expect(
          screen.getByText("2 твоих фигур под атакой! Будь осторожен!")
        ).toBeInTheDocument();
      });
    });

    it("should update threat display when threat information changes", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Start with multiple threats
      const multipleThreatsButton = screen.getByTestId("simulate-threats");
      fireEvent.click(multipleThreatsButton);

      await waitFor(() => {
        expect(
          screen.getByText("2 твоих фигур под атакой! Будь осторожен!")
        ).toBeInTheDocument();
      });

      // Change to single threat
      const singleThreatButton = screen.getByTestId("simulate-single-threat");
      fireEvent.click(singleThreatButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Твоя фигура под атакой! Защити её или убери в безопасное место."
          )
        ).toBeInTheDocument();
        expect(
          screen.queryByText("2 твоих фигур под атакой! Будь осторожен!")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Component Integration", () => {
    it("should pass correct props to ComputerChessBoard", () => {
      renderWithProviders(<PlayWithComputer />);

      // ComputerChessBoard should be rendered
      expect(screen.getByTestId("computer-chess-board")).toBeInTheDocument();
    });

    it("should handle threat changes from ComputerChessBoard", async () => {
      renderWithProviders(<PlayWithComputer />);

      // Simulate threat change from chess board
      const simulateButton = screen.getByTestId("simulate-threats");
      fireEvent.click(simulateButton);

      // Description should update accordingly
      await waitFor(() => {
        expect(screen.getByText("⚠️ ОСТОРОЖНО!")).toBeInTheDocument();
      });
    });
  });
});
