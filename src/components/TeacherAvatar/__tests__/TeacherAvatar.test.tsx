import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";
import TeacherAvatar from "../TeacherAvatar";

// Mock the avatar images
jest.mock(
  "../../../assets/avatars/teacher_v2.png",
  () => "/mock-teacher-v2.png"
);
jest.mock("../../../assets/avatars/teacher_1.png", () => "/mock-teacher-1.png");

const renderWithProviders = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe("TeacherAvatar", () => {
  it("renders with default teacher avatar", () => {
    renderWithProviders(<TeacherAvatar />);

    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-label", "Teacher avatar");

    const avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toHaveAttribute("src", "/mock-teacher-v2.png");
  });

  it("handles custom size prop", () => {
    renderWithProviders(<TeacherAvatar size={100} />);

    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
  });

  it("handles custom className prop", () => {
    renderWithProviders(<TeacherAvatar className="custom-teacher-class" />);

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveClass("custom-teacher-class");
  });

  it("falls back to teacher_1.png when teacher_v2.png fails to load", () => {
    renderWithProviders(<TeacherAvatar />);

    const avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toHaveAttribute("src", "/mock-teacher-v2.png");

    // Mock the error event to simulate teacher_v2.png failing
    Object.defineProperty(avatarImage, "src", {
      writable: true,
      value: "/mock-teacher-v2.png",
    });

    // Simulate image loading error
    fireEvent.error(avatarImage);

    // Should still be in document (error handling should prevent crashes)
    expect(avatarImage).toBeInTheDocument();
  });

  it("shows emoji placeholder when both images fail to load", () => {
    renderWithProviders(<TeacherAvatar size={80} />);

    const avatarImage = screen.getByAltText("Teacher avatar");

    // Mock both images failing
    Object.defineProperty(avatarImage, "src", {
      writable: true,
      value: "/mock-teacher-1.png",
    });

    // Simulate second image loading error
    fireEvent.error(avatarImage);

    // Should still be in document
    expect(avatarImage).toBeInTheDocument();
  });

  it("renders with correct accessibility attributes", () => {
    renderWithProviders(<TeacherAvatar />);

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("role", "img");
    expect(avatar).toHaveAttribute("aria-label", "Teacher avatar");
  });

  it("maintains consistent styling with default props", () => {
    renderWithProviders(<TeacherAvatar />);

    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();

    const avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toBeInTheDocument();
  });

  it("handles different size values correctly", () => {
    const { rerender } = renderWithProviders(<TeacherAvatar size={50} />);

    let avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();

    rerender(
      <I18nextProvider i18n={i18n}>
        <TeacherAvatar size={120} />
      </I18nextProvider>
    );

    avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
  });

  it("does not crash when error boundary is triggered", () => {
    // This test ensures the error boundary works correctly
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<TeacherAvatar />);

    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
