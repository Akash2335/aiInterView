/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";
import { DarkModeContext } from "../App";
import LanguageSelection from "../Components/LanguageSelection";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

// Mock toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn()
}));

// Mock Calendar
jest.mock("../Pages/CalendarInterviewTracker", () => () => (
  <div data-testid="calendar-mock">Calendar Mock</div>
));

// Helper render
const renderWithContext = (darkMode = false) => {
  return render(
    <DarkModeContext.Provider value={{ darkMode }}>
      <LanguageSelection />
    </DarkModeContext.Provider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("LanguageSelection Component", () => {

  test("renders header and UI elements", () => {
    renderWithContext();

    expect(screen.getByText(/AI-POWERED TECHNICAL INTERVIEWS/i)).toBeInTheDocument();
    expect(screen.getByTestId("calendar-mock")).toBeInTheDocument();
    expect(screen.getByText("Learning")).toBeInTheDocument();
    expect(screen.getByText("Interview")).toBeInTheDocument();
  });

  test("shows toast error when clicking language before selecting mode", async () => {
    renderWithContext();

    // Lucide icons are SVG → use role: img
    const arrowIcons = screen.getAllByRole("img", { hidden: true });

    fireEvent.click(arrowIcons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please select Learning or Interview mode first."
      );
    });
  });

  test("navigates when mode selected and language clicked", async () => {
    renderWithContext();

    // Select Learning Mode
    fireEvent.click(screen.getByText("Learning"));

    // Click first language arrow
    const arrowIcons = screen.getAllByRole("img", { hidden: true });
    fireEvent.click(arrowIcons[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test("renders correctly in dark mode", () => {
    renderWithContext(true);

    const header = screen.getByText(/AI-POWERED TECHNICAL INTERVIEWS/i);
    expect(header).toHaveClass("backdrop-blur-md");

  });

});
