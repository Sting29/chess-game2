import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Simple test to check if mocking works
describe("Simple Mock Test", () => {
  test("should render without crashing", () => {
    const TestComponent = () => <div>Test Component</div>;

    render(<TestComponent />);

    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });
});
