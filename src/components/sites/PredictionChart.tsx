import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PredictionPoint } from "../../types";

export default function PredictionChart({ points, currentScore }: { points: PredictionPoint[]; currentScore: number }) {
  const data = [
    { label: "Now", predictedRiskScore: currentScore, lowerBound: currentScore, upperBound: currentScore },
    ...points.map((p) => ({
      label: `+${p.yearsAhead}yr`,
      predictedRiskScore: p.predictedRiskScore,
      lowerBound: p.lowerBound,
      upperBound: p.upperBound,
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="predictionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D2A06E" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#D2A06E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#262E33" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3A8" }} axisLine={{ stroke: "#37424A" }} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9CA3A8" }} axisLine={{ stroke: "#37424A" }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1C2226", border: "1px solid #37424A", borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: "#EDEAE3" }}
        />
        <Area
          type="monotone"
          dataKey="upperBound"
          stroke="none"
          fill="url(#predictionFill)"
          name="Upper bound"
        />
        <Area
          type="monotone"
          dataKey="predictedRiskScore"
          stroke="#D2A06E"
          strokeWidth={2}
          fill="url(#predictionFill)"
          name="Predicted risk"
          dot={{ r: 3, fill: "#D2A06E" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
