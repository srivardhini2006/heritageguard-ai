const LEGEND_ITEMS = [
  { level: "Critical", color: "#EF4444", range: "81 – 100" },
  { level: "High",     color: "#F97316", range: "61 – 80" },
  { level: "Moderate", color: "#F59E0B", range: "41 – 60" },
  { level: "Low",      color: "#10B981", range: "0 – 40" },
];

export default function Legend({ sites = [] }) {
  const counts = sites.reduce((acc, s) => {
    acc[s.riskLevel] = (acc[s.riskLevel] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="legend">
      <div className="legend-header">
        <p className="legend-title">Risk Scale</p>
        <span className="legend-total">{sites.length} Sites</span>
      </div>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.level} className="legend-item">
          <span className="legend-dot" style={{ background: item.color }} />
          <span className="legend-label">{item.level}</span>
          <span className="legend-count-pill" style={{ color: item.color }}>
            {counts[item.level] || 0}
          </span>
          <span className="legend-range">{item.range}</span>
        </div>
      ))}
    </div>
  );
}
