export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum ComplaintStatus {
  PENDING = "pending",
  RESOLVED = "resolved",
}

export enum ComplaintDirection {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

export enum ComplaintCategory {
  MISSED_BUS = "missed_bus",
  LATE_BUS = "late_bus",
  SAFETY = "safety",
  DRIVER_BEHAVIOR = "driver_behavior",
  VEHICLE_CONDITION = "vehicle_condition",
  OTHER = "other",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface ComplaintResponse {
  id: string;
  complaintId: string;
  filePath: string | null;
  originalFileName: string | null;
  note: string | null;
  createdAt: string;
}

export interface Complaint {
  id: string;
  busLine: string;
  direction: ComplaintDirection;
  incidentDate: string;
  incidentTime: string;
  notes: string | null;
  filePath: string | null;
  originalFileName: string | null;
  status: ComplaintStatus;
  category: ComplaintCategory;
  userId: string;
  response: ComplaintResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  byBusLine: Record<string, number>;
  byDirection: Record<string, number>;
  byCategory: Record<string, number>;
  dailyCounts: DailyCount[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateComplaintPayload {
  busLine: string;
  direction: ComplaintDirection;
  incidentDate: string;
  incidentTime: string;
  notes?: string;
  file?: File;
}

export interface FilterComplaintParams {
  busLine?: string;
  direction?: ComplaintDirection;
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}
