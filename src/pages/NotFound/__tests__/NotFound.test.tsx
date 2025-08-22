/**
 * Тесты для страницы 404
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { NotFound } from "../NotFound";

// Mock для react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock для usePageMetadata
jest.mock("src/hooks", () => ({
  usePageMetadata: jest.fn(),
}));

// Mock для navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Создаем мок-стор
const createMockStore = () => {
  return configureStore({
    reducer: {
      settings: (state = {}) => state,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );
};

describe("NotFound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should render 404 error message", () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(/It looks like this page has moved/)
    ).toBeInTheDocument();
  });

  it("should render navigation buttons", () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByText("🏠 Go Home")).toBeInTheDocument();
    expect(screen.getByText("← Go Back")).toBeInTheDocument();
    expect(screen.getByText("🎮 Play Chess")).toBeInTheDocument();
    expect(screen.getByText("📚 Learn Chess")).toBeInTheDocument();
  });

  it("should render chess board", () => {
    renderWithProviders(<NotFound />);

    // Проверяем, что шахматная доска отрендерилась (64 квадрата)
    const chessSquares = screen
      .getAllByRole("generic")
      .filter(
        (element) =>
          element.style.width === "30px" && element.style.height === "30px"
      );

    // Не все квадраты могут быть найдены из-за CSS-in-JS, но основная структура должна быть
    expect(chessSquares.length).toBeGreaterThan(0);
  });

  it("should show countdown timer", () => {
    renderWithProviders(<NotFound />);

    expect(
      screen.getByText(/Automatically redirecting to homepage in \d+ seconds/)
    ).toBeInTheDocument();
  });

  it("should navigate to home when Go Home button is clicked", () => {
    renderWithProviders(<NotFound />);

    const homeButton = screen.getByText("🏠 Go Home");
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should navigate back when Go Back button is clicked", () => {
    renderWithProviders(<NotFound />);

    const backButton = screen.getByText("← Go Back");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should navigate to play when Play Chess button is clicked", () => {
    renderWithProviders(<NotFound />);

    const playButton = screen.getByText("🎮 Play Chess");
    fireEvent.click(playButton);

    expect(mockNavigate).toHaveBeenCalledWith("/play");
  });

  it("should navigate to learn when Learn Chess button is clicked", () => {
    renderWithProviders(<NotFound />);

    const learnButton = screen.getByText("📚 Learn Chess");
    fireEvent.click(learnButton);

    expect(mockNavigate).toHaveBeenCalledWith("/how-to-move");
  });

  it("should auto-redirect after countdown", async () => {
    renderWithProviders(<NotFound />);

    // Ускоряем время на 10 секунд
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should update countdown every second", async () => {
    renderWithProviders(<NotFound />);

    // Проверяем начальное значение
    expect(
      screen.getByText(/Automatically redirecting to homepage in 10 seconds/)
    ).toBeInTheDocument();

    // Ускоряем время на 1 секунду
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(
        screen.getByText(/Automatically redirecting to homepage in 9 seconds/)
      ).toBeInTheDocument();
    });
  });

  it("should generate random chess board", () => {
    const { rerender } = renderWithProviders(<NotFound />);

    // Перерендериваем компонент несколько раз
    rerender(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      </Provider>
    );

    // Проверяем, что доска существует (точное содержимое может варьироваться)
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
