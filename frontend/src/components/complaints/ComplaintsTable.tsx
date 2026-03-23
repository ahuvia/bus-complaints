import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye } from "lucide-react";
import { useComplaints, useDeleteComplaint } from "@/hooks/useComplaints";
import {
  ComplaintCategory,
  ComplaintDirection,
  ComplaintStatus,
  FilterComplaintParams,
} from "@/types";
import { cn, formatDate, formatCategory, formatEnum } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [ComplaintStatus.RESOLVED]: "bg-green-100 text-green-800",
};

export function ComplaintsTable(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: deleteComplaint } = useDeleteComplaint();

  const [filters, setFilters] = useState<FilterComplaintParams>({
    page: 1,
    limit: 20,
  });
  const [search, setSearch] = useState("");

  const { data, isLoading } = useComplaints({
    ...filters,
    search: search || undefined,
  });

  const setFilter = <K extends keyof FilterComplaintParams>(
    key: K,
    value: FilterComplaintParams[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const handleDelete = (id: string) => {
    if (confirm("למחוק את התלונה?")) deleteComplaint(id);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="חיפוש קו או הערות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          onChange={(e) =>
            setFilter(
              "direction",
              (e.target.value as ComplaintDirection) || undefined,
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">כל הכיוונים</option>
          <option value={ComplaintDirection.INBOUND}>הלוך</option>
          <option value={ComplaintDirection.OUTBOUND}>חזור</option>
        </select>
        <select
          onChange={(e) =>
            setFilter(
              "status",
              (e.target.value as ComplaintStatus) || undefined,
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">כל הסטטוסים</option>
          <option value={ComplaintStatus.PENDING}>ממתין</option>
          <option value={ComplaintStatus.RESOLVED}>טופל</option>
        </select>
        <select
          onChange={(e) =>
            setFilter(
              "category",
              (e.target.value as ComplaintCategory) || undefined,
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">כל הקטגוריות</option>
          {Object.values(ComplaintCategory).map((c) => (
            <option key={c} value={c}>
              {formatCategory(c)}
            </option>
          ))}
        </select>
        <input
          type="date"
          onChange={(e) => setFilter("dateFrom", e.target.value || undefined)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          onChange={(e) => setFilter("dateTo", e.target.value || undefined)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "קו אוטובוס",
                "כיוון",
                "תאריך",
                "שעה",
                "סטטוס",
                "קטגוריה",
                "פעולות",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  טוען...
                </td>
              </tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  לא נמצאו תלונות.
                </td>
              </tr>
            ) : (
              data?.data.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  <td className="px-4 py-3 font-medium">{complaint.busLine}</td>
                  <td className="px-4 py-3 capitalize">
                    {formatEnum(complaint.direction)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(complaint.incidentDate)}
                  </td>
                  <td className="px-4 py-3">{complaint.incidentTime}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        STATUS_COLORS[complaint.status],
                      )}
                    >
                      {formatEnum(complaint.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatCategory(complaint.category)}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100"
                        title="צפייה"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {user?.role === UserRole.ADMIN && (
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className="rounded p-1 text-red-400 hover:bg-red-50"
                          title="מחיקה"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            עמוד {data.page} מתוך {data.totalPages} (סה"כ {data.total})
          </span>
          <div className="flex gap-2">
            <button
              disabled={data.page <= 1}
              onClick={() => setFilter("page", data.page - 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
            >
              הקודם
            </button>
            <button
              disabled={data.page >= data.totalPages}
              onClick={() => setFilter("page", data.page + 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
            >
              הבא
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
