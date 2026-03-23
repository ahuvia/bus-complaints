import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Bus } from "lucide-react";

type Mode = "login" | "register";

export function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const { loginMutation, registerMutation, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) {
    navigate("/", { replace: true });
  }

  const mutation = mode === "login" ? loginMutation : registerMutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password }, { onSuccess: () => navigate("/") });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">תלונות אוטובוס</h1>
          <p className="text-sm text-slate-500">
            {mode === "login" ? "כניסה לחשבון" : "יצירת חשבון חדש"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              אימייל
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              סיסמא
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {mutation.isError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {(mutation.error as Error).message ?? "שגיאה בהתחברות"}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending
              ? mode === "login"
                ? "מתחבר..."
                : "יוצר חשבון..."
              : mode === "login"
                ? "כניסה"
                : "הרשמה"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === "login" ? "אין לך חשבון? " : "יש לך חשבון? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-medium text-blue-600 hover:underline"
          >
            {mode === "login" ? "הרשם" : "כניסה"}
          </button>
        </p>
      </div>
    </div>
  );
}
