import apiClient from "./client";
import type {
  Complaint,
  CreateComplaintPayload,
  FilterComplaintParams,
  PaginatedResult,
} from "@/types";

export const complaintsApi = {
  getAll: async (
    params: FilterComplaintParams,
  ): Promise<PaginatedResult<Complaint>> => {
    const { data } = await apiClient.get<PaginatedResult<Complaint>>(
      "/complaints",
      { params },
    );
    return data;
  },

  getOne: async (id: string): Promise<Complaint> => {
    const { data } = await apiClient.get<Complaint>(`/complaints/${id}`);
    return data;
  },

  create: async (payload: CreateComplaintPayload): Promise<Complaint> => {
    const form = new FormData();
    form.append("busLine", payload.busLine);
    form.append("direction", payload.direction);
    form.append("incidentDate", payload.incidentDate);
    form.append("incidentTime", payload.incidentTime);
    if (payload.notes) form.append("notes", payload.notes);
    if (payload.file) form.append("file", payload.file);

    const { data } = await apiClient.post<Complaint>("/complaints", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: string, patch: Partial<Complaint>): Promise<Complaint> => {
    const { data } = await apiClient.patch<Complaint>(
      `/complaints/${id}`,
      patch,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/complaints/${id}`);
  },

  addResponse: async (
    id: string,
    note?: string,
    file?: File,
  ): Promise<Complaint> => {
    const form = new FormData();
    if (note) form.append("note", note);
    if (file) form.append("file", file);

    const { data } = await apiClient.post<Complaint>(
      `/complaints/${id}/response`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },
};
