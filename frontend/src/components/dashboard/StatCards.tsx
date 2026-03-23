import React from "react";
import { cn } from "@/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  colorClass = "bg-blue-50 text-blue-600",
}: StatCardProps): React.ReactElement {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          colorClass,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

interface StatCardsProps {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  topBusLine: string | null;
}

export function StatCards({
  totalComplaints,
  resolvedComplaints,
  pendingComplaints,
  topBusLine,
}: StatCardsProps): React.ReactElement {
  const resolutionRate =
    totalComplaints > 0
      ? `${Math.round((resolvedComplaints / totalComplaints) * 100)}%`
      : "N/A";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="סהק תלונות"
        value={totalComplaints}
        icon={<span className="text-xl">📋</span>}
        colorClass="bg-blue-50 text-blue-600"
      />
      <StatCard
        title="טופלו"
        value={resolvedComplaints}
        subtitle={`${resolutionRate} שיעור פתרון`}
        icon={<span className="text-xl">✅</span>}
        colorClass="bg-green-50 text-green-600"
      />
      <StatCard
        title="ממתינות"
        value={pendingComplaints}
        icon={<span className="text-xl">⏳</span>}
        colorClass="bg-yellow-50 text-yellow-600"
      />
      <StatCard
        title="קו מוביל"
        value={topBusLine ?? "—"}
        subtitle="הכי הרבה תלונות"
        icon={<span className="text-xl">🚌</span>}
        colorClass="bg-purple-50 text-purple-600"
      />
    </div>
  );
}
