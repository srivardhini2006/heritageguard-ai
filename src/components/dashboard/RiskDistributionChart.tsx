import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { RiskDistribution } from "../../types";

const COLORS: Record<string, string> = {
  Low: "#2E7D32",      // Green/Verdigris
  Medium: "#E28D38",   // Orange/Ochre
  High: "#C94B32",     // Red/Rust
  Critical: "#8C2F26", // Dark red
};

export default function RiskDistributionChart({ distribution }: { distribution: RiskDistribution }) {
  const total = (distribution.low ?? 0) + (distribution.medium ?? 0) + (distribution.high ?? 0) + (distribution.critical ?? 0);
  
  const rawData = [
    { name: "Low", value: distribution.low ?? 0 },
    { name: "Medium", value: distribution.medium ?? 0 },
    { name: "High", value: (distribution.high ?? 0) + (distribution.critical ?? 0) },
  ];

  const chartData = rawData.filter((d) => d.value > 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      {/* Donut Chart */}
      <div className="w-full sm:w-1/2 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="w-full sm:w-1/2 space-y-3">
        {rawData.map((item) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const color = COLORS[item.name];
          
          return (
            <div key={item.name} className="flex items-center gap-3 text-xs font-medium text-brand-text-dark">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <div className="flex-1 flex justify-between">
                <span>{item.name} Risk</span>
                <span className="font-semibold text-brand-text-muted">
                  {item.value} <span className="font-normal text-gray-400">({percentage}%)</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
