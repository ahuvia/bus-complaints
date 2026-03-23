import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { ComplaintsTable } from "@/components/complaints/ComplaintsTable";

export function ComplaintsListPage(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
          <p className="text-sm text-slate-500">
            Browse and manage all bus complaints
          </p>
        </div>
        <button
          onClick={() => navigate("/complaints/new")}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Complaint
        </button>
      </div>

      <ComplaintsTable />
    </div>
  );
}
