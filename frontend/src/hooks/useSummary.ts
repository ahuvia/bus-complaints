import { useQuery } from "@tanstack/react-query";
import { summaryApi } from "@/api/summary.api";

export const SUMMARY_KEY = "summary";

export function useSummary(year: number, month: number) {
  return useQuery({
    queryKey: [SUMMARY_KEY, year, month],
    queryFn: () => summaryApi.getMonthly(year, month),
  });
}
