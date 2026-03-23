import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: Record<string, number>;
  title?: string;
}

export function BusLineBarChart({
  data,
  title = "Complaints by Bus Line",
}: Props): React.ReactElement {
  const chartData = Object.entries(data)
    .map(([busLine, count]) => ({ busLine, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // top 10

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 16, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="busLine"
            tick={{ fontSize: 11 }}
            width={40}
          />
          <Tooltip formatter={(value: number) => [value, "Complaints"]} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            dataKey="count"
            fill="#8b5cf6"
            radius={[0, 4, 4, 0]}
            name="Complaints"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
