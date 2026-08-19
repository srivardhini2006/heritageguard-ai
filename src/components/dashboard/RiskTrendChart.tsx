import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { RiskTrendPoint } from "../../types";

export default function RiskTrendChart({ data }: { data: RiskTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262E33" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3A8" }} axisLine={{ stroke: "#37424A" }} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9CA3A8" }} axisLine={{ stroke: "#37424A" }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1C2226", border: "1px solid #37424A", borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: "#EDEAE3" }}
        />
        <Line
          type="monotone"
          dataKey="averageRiskScore"
          name="Avg. Risk Score"
          stroke="#D2A06E"
          strokeWidth={2}
          dot={{ r: 3, fill: "#D2A06E" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
