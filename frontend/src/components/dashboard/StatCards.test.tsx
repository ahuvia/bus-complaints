import React from "react";
import { render, screen } from "@testing-library/react";
import { StatCards } from "@/components/dashboard/StatCards";

describe("StatCards", () => {
  const defaultProps = {
    totalComplaints: 50,
    resolvedComplaints: 30,
    pendingComplaints: 20,
    topBusLine: "42",
  };

  it("renders all stat values", () => {
    render(<StatCards {...defaultProps} />);
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("displays resolution rate", () => {
    render(<StatCards {...defaultProps} />);
    expect(screen.getByText(/60% resolution rate/i)).toBeInTheDocument();
  });

  it("shows N/A for resolution rate when no complaints", () => {
    render(
      <StatCards
        totalComplaints={0}
        resolvedComplaints={0}
        pendingComplaints={0}
        topBusLine={null}
      />,
    );
    expect(screen.getByText(/N\/A resolution rate/i)).toBeInTheDocument();
  });

  it("shows — when topBusLine is null", () => {
    render(<StatCards {...defaultProps} topBusLine={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders all four card titles", () => {
    render(<StatCards {...defaultProps} />);
    expect(screen.getByText("Total Complaints")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Top Bus Line")).toBeInTheDocument();
  });
});
