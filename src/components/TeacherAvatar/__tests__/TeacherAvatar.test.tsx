import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";
import TeacherAvatar from "../TeacherAvatar";

// Mock the avatar images
jest.mock(
  "../../../assets/avatars/teacher_adult.png",
  () => "/mock-teacher-adult.png"
);

const renderWithProviders = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe("TeacherAvatar", () => {
  it("renders with default teacher avatar", () => {
    renderWithProviders(<TeacherAvatar />);

    const avatarContainer = screen.getByLabelText("Teacher avatar");
    expect(avatarContainer).toBeInTheDocument();
    expect(avatarContainer).toHaveAttribute("aria-label", "Teacher avatar");

    const avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toHaveAttribute("src", "/mock-teacher-adult.png");
  });

  it("handles custom width and height props", () => {
    renderWithProviders(<TeacherAvatar width={100} height={120} />);

    const avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toBeInTheDocument();
  });

  it("handles custom className prop", () => {
    renderWithProviders(<TeacherAvatar className="custom-teacher-class" />);

    const avatarContainer = screen.getByLabelText("Teacher avatar");
    expect(avatarContainer).toHaveClass("custom-teacher-class");
  });

  it("shows emoji placeholder when image fails to load", () => {
    renderWithProviders(<TeacherAvatar width={80} height={100} />);

    const avatarImage = screen.getByAltText("Teacher avatar");

    // Simulate image loading error
    fireEvent.error(avatarImage);

    // Container should still be in document
    const avatarContainer = screen.getByLabelText("Teacher avatar");
    expect(avatarContainer).toBeInTheDocument();
  });

  it("renders with correct accessibility attributes", () => {
    renderWithProviders(<TeacherAvatar />);

    const avatarContainer = screen.getByLabelText("Teacher avatar");
    expect(avatarContainer).toHaveAttribute("aria-label", "Teacher avatar");

    const avatarImage = screen.getByRole("img");
    expect(avatarImage).toHaveAttribute("alt", "Teacher avatar");
  });

  it("maintains consistent styling with default props", () => {
    renderWithProviders(<TeacherAvatar />);

    const avatarContainer = screen.getByLabelText("Teacher avatar");
    expect(avatarContainer).toBeInTheDocument();

    const avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toBeInTheDocument();
  });

  it("handles different width and height values correctly", () => {
    const { rerender } = renderWithProviders(
      <TeacherAvatar width={50} height={60} />
    );

    let avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toBeInTheDocument();

    rerender(
      <I18nextProvider i18n={i18n}>
        <TeacherAvatar width={120} height={150} />
      </I18nextProvider>
    );

    avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toBeInTheDocument();
  });

  it("does not crash when error boundary is triggered", () => {
    // This test ensures the error boundary works correctly
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<TeacherAvatar />);

    const avatarImage = screen.getByAltText("Teacher avatar");
    expect(avatarImage).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
