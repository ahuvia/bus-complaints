import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X } from "lucide-react";
import { useCreateComplaint } from "@/hooks/useComplaints";
import { ComplaintDirection } from "@/types";
import { cn } from "@/utils";

const schema = z.object({
  busLine: z.string().min(1, "שדה חובה"),
  direction: z.nativeEnum(ComplaintDirection, {
    required_error: "שדה חובה",
  }),
  incidentDate: z.string().min(1, "שדה חובה"),
  incidentTime: z.string().regex(/^\d{2}:\d{2}$/, "פורמט שגוי, נדרש HH:MM"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ComplaintUploadForm(): React.ReactElement {
  const navigate = useNavigate();
  const {
    mutate: createComplaint,
    isPending,
    isError,
    error,
  } = useCreateComplaint();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const onSubmit = (values: FormValues) => {
    createComplaint(
      { ...values, file: file ?? undefined },
      { onSuccess: (c) => navigate(`/complaints/${c.id}`) },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Bus Line */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          קו אוטובוס
        </label>
        <input
          {...register("busLine")}
          type="text"
          placeholder="לדוגמא: 42"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.busLine && (
          <p className="mt-1 text-xs text-red-500">{errors.busLine.message}</p>
        )}
      </div>

      {/* Direction */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          כיוון
        </label>
        <select
          {...register("direction")}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">בחר כיוון</option>
          <option value={ComplaintDirection.INBOUND}>הלוך</option>
          <option value={ComplaintDirection.OUTBOUND}>חזור</option>
        </select>
        {errors.direction && (
          <p className="mt-1 text-xs text-red-500">
            {errors.direction.message}
          </p>
        )}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            תאריך
          </label>
          <input
            {...register("incidentDate")}
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.incidentDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.incidentDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            שעה
          </label>
          <input
            {...register("incidentTime")}
            type="time"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.incidentTime && (
            <p className="mt-1 text-xs text-red-500">
              {errors.incidentTime.message}
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          הערות
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="תאר את התלונה..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* File Dropzone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          צירוף קובץ (PDF / JPEG / PNG, עד 10MB)
        </label>
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400",
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
          {file ? (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="rounded-full p-0.5 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              {isDragActive ? "שחרר כאן" : "גרור ושחרר, או לחץ לבחירה"}
            </p>
          )}
        </div>
      </div>

      {isError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {(error as Error).message ?? "שליחת התלונה נכשלה"}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "שולח..." : "שלח תלונה"}
      </button>
    </form>
  );
}
