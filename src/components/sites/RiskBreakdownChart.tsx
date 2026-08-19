import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { RiskAssessment } from "../../types";

export default function RiskBreakdownChart({ risk }: { risk: RiskAssessment }) {
  const data = [
    { name: "Environmental", value: risk.environmentalRisk },
    { name: "Structural", value: risk.structuralRisk },
    { name: "Visitor", value: risk.visitorRisk },
    { name: "Pollution", value: risk.pollutionRisk },
    { name: "Climate", value: risk.climateRisk },
  ];

  const colorFor = (v: number) => (v >= 70 ? "#B5482F" : v >= 45 ? "#C99A3A" : "#4E8479");

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262E33" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#9CA3A8" }} axisLine={{ stroke: "#37424A" }} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fontSize: 12, fill: "#D9D3C7" }}
          axisLine={{ stroke: "#37424A" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: "#1C2226", border: "1px solid #37424A", borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: "#EDEAE3" }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((d) => (
            <Cell key={d.name} fill={colorFor(d.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
