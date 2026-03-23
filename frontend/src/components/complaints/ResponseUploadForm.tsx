import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { useAddResponse } from "@/hooks/useComplaints";
import { cn } from "@/utils";

interface Props {
  complaintId: string;
  onSuccess: () => void;
}

export function ResponseUploadForm({
  complaintId,
  onSuccess,
}: Props): React.ReactElement {
  const { mutate: addResponse, isPending, isError, error } = useAddResponse();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResponse(
      { id: complaintId, note: note || undefined, file: file ?? undefined },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          הערה מהגורם המוסמך
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="טקסט תגובה רשמי..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          מסמך תגובה (אופציונלי)
        </label>
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-6 cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400",
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mb-2 h-6 w-6 text-slate-400" />
          {file ? (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              {isDragActive ? "שחרר כאן" : "גרור ושחרר, או לחץ"}
            </p>
          )}
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-600">
          {(error as Error).message ?? "ההעלאה נכשלה"}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || (!note && !file)}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "מעלה..." : "שלח תגובה"}
      </button>
    </form>
  );
}
