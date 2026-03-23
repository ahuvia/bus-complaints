import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { ComplaintsTable } from "@/components/complaints/ComplaintsTable";
import {
  ComplaintDirection,
  ComplaintStatus,
  ComplaintCategory,
  UserRole,
} from "@/types";
import type { Complaint } from "@/types";

// Mock hooks
jest.mock("@/hooks/useComplaints", () => ({
  useComplaints: () => ({
    data: {
      data: mockComplaints,
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
    isLoading: false,
  }),
  useDeleteComplaint: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { role: UserRole.USER } }),
}));

const mockComplaints: Complaint[] = [
  {
    id: "c1",
    busLine: "42",
    direction: ComplaintDirection.INBOUND,
    incidentDate: "2026-03-10",
    incidentTime: "08:30",
    notes: "Bus was late",
    filePath: null,
    originalFileName: null,
    status: ComplaintStatus.PENDING,
    category: ComplaintCategory.LATE_BUS,
    userId: "u1",
    response: null,
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "c2",
    busLine: "17",
    direction: ComplaintDirection.OUTBOUND,
    incidentDate: "2026-03-12",
    incidentTime: "17:00",
    notes: "Driver was rude",
    filePath: null,
    originalFileName: null,
    status: ComplaintStatus.RESOLVED,
    category: ComplaintCategory.DRIVER_BEHAVIOR,
    userId: "u1",
    response: null,
    createdAt: "2026-03-12T18:00:00Z",
    updatedAt: "2026-03-12T18:00:00Z",
  },
];

const renderTable = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ComplaintsTable />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("ComplaintsTable", () => {
  it("renders table headers", () => {
    renderTable();
    expect(screen.getByText("Bus Line")).toBeInTheDocument();
    expect(screen.getByText("Direction")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
  });

  it("renders complaint rows", () => {
    renderTable();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();
  });

  it("shows status badges", () => {
    renderTable();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("renders filter inputs", () => {
    renderTable();
    expect(screen.getByPlaceholderText(/Search bus line/i)).toBeInTheDocument();
  });
});
