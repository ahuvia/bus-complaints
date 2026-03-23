import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import { useComplaint } from "@/hooks/useComplaints";
import { ResponseUploadForm } from "./ResponseUploadForm";
import { formatDate, formatCategory, formatEnum, cn } from "@/utils";
import { ComplaintStatus } from "@/types";

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [ComplaintStatus.RESOLVED]: "bg-green-100 text-green-800",
};

export function ComplaintDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: complaint, isLoading, refetch } = useComplaint(id!);
  const [showResponseForm, setShowResponseForm] = useState(false);

  if (isLoading) {
    return <p className="text-slate-400">טוען...</p>;
  }

  if (!complaint) {
    return <p className="text-red-500">התלונה לא נמצאה.</p>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/complaints")}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        חזרה לרשימה
      </button>

      {/* Metadata Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold">פרטי תלונה</h2>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              STATUS_COLORS[complaint.status],
            )}
          >
            {formatEnum(complaint.status)}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">קו אוטובוס</dt>
            <dd className="font-medium">{complaint.busLine}</dd>
          </div>
          <div>
            <dt className="text-slate-500">כיוון</dt>
            <dd className="font-medium capitalize">
              {formatEnum(complaint.direction)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">תאריך</dt>
            <dd className="font-medium">
              {formatDate(complaint.incidentDate)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">שעה</dt>
            <dd className="font-medium">{complaint.incidentTime}</dd>
          </div>
          <div>
            <dt className="text-slate-500">קטגוריה</dt>
            <dd className="font-medium">
              {formatCategory(complaint.category)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">הוגש</dt>
            <dd className="font-medium">{formatDate(complaint.createdAt)}</dd>
          </div>
        </dl>

        {complaint.notes && (
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-1">הערות</p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm">
              {complaint.notes}
            </p>
          </div>
        )}

        {complaint.filePath && (
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-1">קובץ מצורף</p>
            <a
              href={`/api/uploads/complaints/${complaint.filePath.split("/").pop()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <FileText className="h-4 w-4" />
              {complaint.originalFileName ?? "הורד קובץ"}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Response Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">תגובת הגורם המוסמך</h3>

        {complaint.response ? (
          <div className="space-y-3">
            {complaint.response.note && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-900">
                {complaint.response.note}
              </p>
            )}
            {complaint.response.filePath && (
              <a
                href={`/api/uploads/responses/${complaint.response.filePath.split("/").pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <FileText className="h-4 w-4" />
                {complaint.response.originalFileName ?? "מסמך תגובה"}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <p className="text-xs text-slate-400">
              התקבל ב-{formatDate(complaint.response.createdAt)}
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-sm text-slate-500">
              טרם התקבלה תגובה מרשות התחבורה.
            </p>
            {!showResponseForm ? (
              <button
                onClick={() => setShowResponseForm(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                העלה תגובה
              </button>
            ) : (
              <ResponseUploadForm
                complaintId={complaint.id}
                onSuccess={() => {
                  setShowResponseForm(false);
                  void refetch();
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
