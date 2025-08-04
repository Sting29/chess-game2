import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";
import UserAvatar from "../UserAvatar";
import settingsReducer from "../../../store/settingsSlice";
import { User, Gender, Avatar } from "../../../services/types";

// Mock avatar utils
jest.mock("../../../utils/avatarUtils", () => ({
  getAvatarBySelection: jest.fn(
    (gender: Gender, avatar: Avatar) => `/mock-avatar-${gender}-${avatar}.png`
  ),
  getDefaultAvatarSelection: jest.fn(() => ({
    gender: "male" as Gender,
    avatar: "avatar1" as Avatar,
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

const renderWithProviders = (component: React.ReactElement, user?: User) => {
  const store = createMockStore(user);
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
    </Provider>
  );
};

describe("UserAvatar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default avatar when no user data", () => {
    renderWithProviders(<UserAvatar />);

    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-label", "User avatar");
  });

  it("renders with user avatar when user data is available", () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      username: "testuser",
      name: "Test User",
      role: "student",
      profile: {
        id: "1",
        gender: "female",
        avatar: "avatar2",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    };

    renderWithProviders(<UserAvatar />, mockUser);

    const avatarImage = screen.getByAltText("User avatar");
    expect(avatarImage).toHaveAttribute(
      "src",
      "/mock-avatar-female-avatar2.png"
    );
  });

  it("handles custom size prop", () => {
    renderWithProviders(<UserAvatar size={100} />);

    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
  });

  it("handles custom className prop", () => {
    renderWithProviders(<UserAvatar className="custom-class" />);

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveClass("custom-class");
  });

  it("handles image loading error with fallback", () => {
    renderWithProviders(<UserAvatar />);

    const avatarImage = screen.getByAltText("User avatar");

    // Simulate image loading error
    fireEvent.error(avatarImage);

    // Should still be in document (error handling should prevent crashes)
    expect(avatarImage).toBeInTheDocument();
  });

  it("displays user name in aria-label when available", () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      username: "testuser",
      name: "John Doe",
      role: "student",
      profile: {
        id: "1",
        gender: "male",
        avatar: "avatar1",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    };

    renderWithProviders(<UserAvatar />, mockUser);

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("aria-label", "User avatar");
  });

  it("falls back to default when user profile is incomplete", () => {
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      username: "testuser",
      role: "student",
      profile: {
        id: "1",
        // Missing gender and avatar
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    };

    renderWithProviders(<UserAvatar />, mockUser);

    const avatarImage = screen.getByAltText("User avatar");
    expect(avatarImage).toHaveAttribute("src", "/mock-avatar-male-avatar1.png");
  });
});
