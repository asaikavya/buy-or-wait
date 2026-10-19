import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalysisResult from "./AnalysisResult";
import type { AnalyseResult, Recommendation } from "../buyOrWaitApi";

// The chart needs a real browser size, which the fake browser doesn't have.
// Replace it with "draw nothing", like swapping in a fake service in DI.
vi.mock("./BalanceChart", () => ({ default: () => null }));

function makeResult(recommendation: Recommendation): AnalyseResult {
  return {
    recommendation,
    explanation: "Test explanation.",
    lowestProjectedBalance: 3800,
    trace: ["Step one"],
    timeLine: [],
  };
}

describe("AnalysisResult", () => {
  it.each([
    ["PayNow", "Buy it now"],
    ["PayPartial", "Pay part now"],
    ["Installments", "Split into installments"],
    ["Wait", "Wait for now"],
  ] as const)("shows the right title for %s", (recommendation, expectedTitle) => {
    render(
      <AnalysisResult
        result={makeResult(recommendation)}
        productName="Headphones"
        price={2400}
        minimumBalance={3000}
      />
    );

    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
    expect(screen.getByText("Test explanation.")).toBeInTheDocument();
  });
});