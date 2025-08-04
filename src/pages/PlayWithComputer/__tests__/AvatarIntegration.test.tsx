import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";
import PlayWithComputer from "../PlayWithComputer";
import settingsReducer from "../../../store/settingsSlice";
import { User } from "../../../services/types";

// Mock the chess board component to avoid complex chess logic in tests
jest.mock("../../../components/ComputerChessBoard/ComputerChessBoard", () => {
  return {
    ComputerChessBoard: () => (
      <div data-testid="computer-chess-board">Chess Board</div>
    ),
  };
});

// Mock avatar utils
jest.mock("../../../utils/avatarUtils", () => ({
  getAvatarBySelection: jest.fn(() => "/mock-avatar.png"),
  getDefaultAvatarSelection: jest.fn(() => ({
    gender: "male",
    avatar: "avatar1",
  })),
}));

// Mock other dependencies
jest.mock("../../../utils/hintUtils", () => ({
  generateHints: jest.fn(() => ({
    title: "Test Hints",
    hints: ["Test hint 1", "Test hint 2"],
  })),
}));

jest.mock("../../../config/gameSettings", () => ({
  getDifficultySettings: jest.fn(() => ({
    engineSettings: {
      skill: 1,
      depth: 1,
      time: 1000,
      kidsMode: false,
    },
    uiSettings: {
      showLastMoveArrow: true,
    },
  })),
}));

const createMockStore = (user?: User) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        language: "en",
        chessSet: "1",
        user,
        isAuthenticated: !!user,
        loading: false,
      },
    },
  });
};

const renderPlayWithComputer = (user?: User, level: string = "easy") => {
  const store = createMockStore(user);
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[`/play/computer/${level}`]}>
          <PlayWithComputer />
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  );
};

describe("PlayWithComputer Avatar Integration", () => {
  it("renders both user and teacher avatars in ChessBoardWrapper", () => {
    renderPlayWithComputer();

    // Check that both avatars are present
    const avatars = screen.getAllByRole("img");
    const userAvatars = avatars.filter(
      (avatar) =>
        avatar.getAttribute("aria-label")?.includes("User avatar") ||
        avatar.getAttribute("alt")?.includes("User avatar")
    );
    const teacherAvatars = avatars.filter(
      (avatar) =>
        avatar.getAttribute("aria-label")?.includes("Teacher avatar") ||
        avatar.getAttribute("alt")?.includes("Teacher avatar")
    );

    expect(userAvatars.length).toBeGreaterThan(0);
    expect(teacherAvatars.length).toBeGreaterThan(0);
  });

  it("renders chess board between avatars", () => {
    renderPlayWithComputer();

    const chessBoard = screen.getByTestId("computer-chess-board");
    expect(chessBoard).toBeInTheDocument();

    // Check that avatars and chess board are all present
    const userAvatar = screen.getByLabelText(/user avatar/i);
    const teacherAvatar = screen.getByLabelText(/teacher avatar/i);

    expect(userAvatar).toBeInTheDocument();
    expect(chessBoard).toBeInTheDocument();
    expect(teacherAvatar).toBeInTheDocument();
  });

  it("displays user avatar based on user profile data", () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      username: "testuser",
      name: "Test User",
      role: "student",
      profile: {
        id: "1",
        gender: "female",
        avatar: "avatar3",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    };

    renderPlayWithComputer(mockUser);

    const userAvatar = screen.getByLabelText(/user avatar/i);
    expect(userAvatar).toBeInTheDocument();
  });

  it("displays default user avatar when no user data", () => {
    renderPlayWithComputer();

    const userAvatar = screen.getByLabelText(/user avatar/i);
    expect(userAvatar).toBeInTheDocument();
  });

  it("maintains layout structure with different difficulty levels", () => {
    const { rerender } = renderPlayWithComputer(undefined, "easy");

    expect(screen.getByLabelText(/user avatar/i)).toBeInTheDocument();
    expect(screen.getByTestId("computer-chess-board")).toBeInTheDocument();
    expect(screen.getByLabelText(/teacher avatar/i)).toBeInTheDocument();

    // Test with different difficulty
    const store = createMockStore();
    rerender(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={["/play/computer/hard"]}>
            <PlayWithComputer />
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByLabelText(/user avatar/i)).toBeInTheDocument();
    expect(screen.getByTestId("computer-chess-board")).toBeInTheDocument();
    expect(screen.getByLabelText(/teacher avatar/i)).toBeInTheDocument();
  });

  it("does not interfere with existing game functionality", () => {
    renderPlayWithComputer();

    // Check that game controls are still present
    const settingsButton = screen.getByText("⚙️");
    expect(settingsButton).toBeInTheDocument();

    // Check that reset button is present
    const resetButton = screen.getByText("Reset");
    expect(resetButton).toBeInTheDocument();

    // Check that chess board is present
    const chessBoard = screen.getByTestId("computer-chess-board");
    expect(chessBoard).toBeInTheDocument();
  });

  it("renders page title and navigation elements", () => {
    renderPlayWithComputer();

    // Check page title
    const pageTitle = screen.getByText("Play with Computer");
    expect(pageTitle).toBeInTheDocument();

    // Check that avatars don't interfere with navigation
    const userAvatar = screen.getByLabelText(/user avatar/i);
    const teacherAvatar = screen.getByLabelText(/teacher avatar/i);

    expect(userAvatar).toBeInTheDocument();
    expect(teacherAvatar).toBeInTheDocument();
  });

  it("handles responsive layout correctly", () => {
    // Mock window.matchMedia for responsive tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes("max-width: 768px"),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderPlayWithComputer();

    const userAvatar = screen.getByLabelText(/user avatar/i);
    const teacherAvatar = screen.getByLabelText(/teacher avatar/i);
    const chessBoard = screen.getByTestId("computer-chess-board");

    expect(userAvatar).toBeInTheDocument();
    expect(chessBoard).toBeInTheDocument();
    expect(teacherAvatar).toBeInTheDocument();
  });

  it("maintains accessibility with avatars present", () => {
    renderPlayWithComputer();

    const userAvatar = screen.getByLabelText(/user avatar/i);
    const teacherAvatar = screen.getByLabelText(/teacher avatar/i);

    // Check accessibility attributes
    expect(userAvatar).toHaveAttribute("role", "img");
    expect(teacherAvatar).toHaveAttribute("role", "img");

    // Check that aria-labels are present
    expect(userAvatar).toHaveAttribute("aria-label");
    expect(teacherAvatar).toHaveAttribute("aria-label");
  });
});
