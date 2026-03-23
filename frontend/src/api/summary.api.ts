import apiClient from "./client";
import type { MonthlySummary } from "@/types";

export const summaryApi = {
  getMonthly: async (year: number, month: number): Promise<MonthlySummary> => {
    const { data } = await apiClient.get<MonthlySummary>("/summary/monthly", {
      params: { year, month },
    });
    return data;
  },
};
