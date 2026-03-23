import React, { useState } from "react";
import { format, subMonths } from "date-fns";
import { useSummary } from "@/hooks/useSummary";
import { StatCards } from "@/components/dashboard/StatCards";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { BusLineBarChart } from "@/components/dashboard/BusLineBarChart";

export function DashboardPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: summary, isLoading } = useSummary(year, month);

  const topBusLine = summary
    ? (Object.entries(summary.byBusLine).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      null)
    : null;

  const prevMonth = subMonths(new Date(year, month - 1, 1), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview for the selected period
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const d = subMonths(new Date(year, month - 1), 1);
              setYear(d.getFullYear());
              setMonth(d.getMonth() + 1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            ← Prev
          </button>
          <span className="text-sm font-medium">
            {format(new Date(year, month - 1, 1), "MMMM yyyy")}
          </span>
          <button
            onClick={() => {
              const d = new Date(year, month, 1);
              setYear(d.getFullYear());
              setMonth(d.getMonth() + 1);
            }}
            disabled={
              year === now.getFullYear() && month === now.getMonth() + 1
            }
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading summary…</div>
      ) : summary ? (
        <>
          <StatCards
            totalComplaints={summary.totalComplaints}
            resolvedComplaints={summary.resolvedComplaints}
            pendingComplaints={summary.pendingComplaints}
            topBusLine={topBusLine}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MonthlyBarChart data={summary.dailyCounts} />
            <CategoryPieChart data={summary.byCategory} />
          </div>

          <BusLineBarChart data={summary.byBusLine} />
        </>
      ) : (
        <p className="text-slate-400">No data available.</p>
      )}
    </div>
  );
}
