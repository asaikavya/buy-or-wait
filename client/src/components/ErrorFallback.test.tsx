import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorFallback from "./ErrorFallback";

describe("ErrorFallback", () => {
  it("calls reset when Try again is clicked", async () => {
    const reset = vi.fn();   // a fake function that records calls (like a Moq mock)
    const user = userEvent.setup();

    render(<ErrorFallback error={new Error("boom")} resetErrorBoundary={reset} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(reset).toHaveBeenCalledTimes(1);   // like mock.Verify(..., Times.Once)
  });
});