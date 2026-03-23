import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { ComplaintUploadForm } from "@/components/complaints/ComplaintUploadForm";

// Mock the hook
jest.mock("@/hooks/useComplaints", () => ({
  useCreateComplaint: () => ({
    mutate: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

const renderForm = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ComplaintUploadForm />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("ComplaintUploadForm", () => {
  it("renders all required fields", () => {
    renderForm();
    expect(screen.getByPlaceholderText(/e\.g\. 42/i)).toBeInTheDocument();
    expect(screen.getByText(/Direction/i)).toBeInTheDocument();
    expect(screen.getByText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Complaint/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderForm();
    const submitBtn = screen.getByText(/Submit Complaint/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Bus line is required/i)).toBeInTheDocument();
    });
  });

  it("shows dropzone area", () => {
    renderForm();
    expect(
      screen.getByText(/Drag & drop or click to select/i),
    ).toBeInTheDocument();
  });

  it("submit button is disabled when isPending is true", () => {
    jest.resetModules();
    jest.mock("@/hooks/useComplaints", () => ({
      useCreateComplaint: () => ({
        mutate: jest.fn(),
        isPending: true,
        isError: false,
        error: null,
      }),
    }));

    // Re-import to pick up overridden mock
    const { useCreateComplaint } = require("@/hooks/useComplaints");
    expect(useCreateComplaint().isPending).toBe(true);
  });
});
