import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ComplaintUploadForm } from "@/components/complaints/ComplaintUploadForm";

export function NewComplaintPage(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button
          onClick={() => navigate("/complaints")}
          className="mb-4 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
        <h1 className="text-2xl font-bold text-slate-900">New Complaint</h1>
        <p className="text-sm text-slate-500">
          Fill in the details and attach supporting documents.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <ComplaintUploadForm />
      </div>
    </div>
  );
}
