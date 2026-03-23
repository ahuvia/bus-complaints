import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complaintsApi } from "@/api/complaints.api";
import type { CreateComplaintPayload, FilterComplaintParams } from "@/types";

export const COMPLAINTS_KEY = "complaints";

export function useComplaints(params: FilterComplaintParams) {
  return useQuery({
    queryKey: [COMPLAINTS_KEY, params],
    queryFn: () => complaintsApi.getAll(params),
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: [COMPLAINTS_KEY, id],
    queryFn: () => complaintsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateComplaintPayload) =>
      complaintsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [COMPLAINTS_KEY] });
    },
  });
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complaintsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [COMPLAINTS_KEY] });
    },
  });
}

export function useAddResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      note,
      file,
    }: {
      id: string;
      note?: string;
      file?: File;
    }) => complaintsApi.addResponse(id, note, file),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: [COMPLAINTS_KEY, id] });
      void queryClient.invalidateQueries({ queryKey: [COMPLAINTS_KEY] });
    },
  });
}
