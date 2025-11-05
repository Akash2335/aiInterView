/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../App";
import LanguageSelection from "../Components/LanguageSelection";

// 🧩 Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));


// 🧩 Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

// 🧩 Mock CalendarInterviewTracker (since it’s used inside LanguageSelection)
jest.mock("../Pages/CalendarInterviewTracker", () => () => (
  <div data-testid="calendar-mock">Calendar Mock</div>
));

describe("LanguageSelection Component", () => {
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

  test("renders header and basic UI elements", () => {
    renderWithContext();

    // Check main heading
    expect(screen.getByText(/AI-POWERED TECHNICAL INTERVIEWS/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose a domain/i)).toBeInTheDocument();

    // Check Calendar mock is rendered
    expect(screen.getByTestId("calendar-mock")).toBeInTheDocument();

    // Check Learning and Interview buttons
    expect(screen.getByText("Learning")).toBeInTheDocument();
    expect(screen.getByText("Interview")).toBeInTheDocument();
  });

  test("shows toast error when selecting language before choosing mode", async () => {
    renderWithContext();

    const arrowButtons = screen.getAllByRole("button", { hidden: true });

    // Simulate clicking a card without selecting mode
    fireEvent.click(arrowButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please select Learning or Interview mode first."
      );
    });
  });

  test("navigates when mode selected and card clicked", async () => {
    renderWithContext();

    // Click "Learning" mode
    const learningButton = screen.getByText("Learning");
    fireEvent.click(learningButton);

    // Find a card's arrow and click it
    const arrows = screen.getAllByRole("img", { hidden: true }); // Lucide icons render as svg
    expect(arrows.length).toBeGreaterThan(0);

    // Simulate selecting first language
    const arrowIcon = arrows[0];
    fireEvent.click(arrowIcon);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test("renders correctly in dark mode", () => {
    renderWithContext(true);

    const container = screen.getByText(/AI-POWERED TECHNICAL INTERVIEWS/i)
      .closest("div");
    expect(container).toHaveClass("backdrop-blur-md");
  });
});
