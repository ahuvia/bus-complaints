import React, { useState } from "react";
import { format, subMonths } from "date-fns";
import { useSummary } from "@/hooks/useSummary";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { BusLineBarChart } from "@/components/dashboard/BusLineBarChart";
import { StatCards } from "@/components/dashboard/StatCards";

export function MonthlySummaryPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: summary, isLoading } = useSummary(year, month);

  const topBusLine = summary
    ? (Object.entries(summary.byBusLine).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      null)
    : null;

  const resolutionRate =
    summary && summary.totalComplaints > 0
      ? `${Math.round((summary.resolvedComplaints / summary.totalComplaints) * 100)}%`
      : "N/A";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">סיכום חודשי</h1>
          <p className="text-sm text-slate-500">פירוט לחודש הנבחר</p>
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
            ‹ הקודם
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
            הבא ›
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-slate-400">טוען...</div>
      ) : summary ? (
        <>
          <StatCards
            totalComplaints={summary.totalComplaints}
            resolvedComplaints={summary.resolvedComplaints}
            pendingComplaints={summary.pendingComplaints}
            topBusLine={topBusLine}
          />

          {/* Summary text highlights */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              נקודות מפתח
            </h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>
                • שיעור פתרון: <strong>{resolutionRate}</strong>
              </li>
              {topBusLine && (
                <li>
                  • קו עם הכי הרבה תלונות: <strong>{topBusLine}</strong> (
                  {summary.byBusLine[topBusLine]} תלונות)
                </li>
              )}
              {Object.entries(summary.byCategory).sort(
                (a, b) => b[1] - a[1],
              )[0] && (
                <li>
                  • סוג בעיה מוביל:{" "}
                  <strong>
                    {Object.entries(summary.byCategory)
                      .sort((a, b) => b[1] - a[1])[0][0]
                      .replace(/_/g, " ")}
                  </strong>
                </li>
              )}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MonthlyBarChart data={summary.dailyCounts} title="Daily Volume" />
            <CategoryPieChart data={summary.byCategory} />
          </div>

          <BusLineBarChart data={summary.byBusLine} />

          {/* Direction breakdown */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              פילוח לפי כיוון
            </h3>
            <div className="flex gap-8">
              {Object.entries(summary.byDirection).map(([dir, count]) => (
                <div key={dir}>
                  <p className="text-xs text-slate-500 capitalize">{dir}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-slate-400">אין נתונים לתקופה זו.</p>
      )}
    </div>
  );
}
