import { MapPin, AlertTriangle, Layers } from "lucide-react";

export default function Header({ sites, activeFilter, onFilterChange }) {
  const counts = sites.reduce((acc, s) => {
    acc[s.riskLevel] = (acc[s.riskLevel] || 0) + 1;
    return acc;
  }, {});

  const badges = [
    { label: "All",      color: "#64748B", bg: "#F1F5F9", count: sites.length },
    { label: "Critical", color: "#EF4444", bg: "#FEE2E2", count: counts["Critical"] || 0 },
    { label: "High",     color: "#F97316", bg: "#FFEDD5", count: counts["High"] || 0 },
    { label: "Moderate", color: "#F59E0B", bg: "#FEF3C7", count: counts["Moderate"] || 0 },
    { label: "Low",      color: "#10B981", bg: "#D1FAE5", count: counts["Low"] || 0 },
  ];

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-icon">
          <MapPin size={22} color="white" />
        </div>
        <div>
          <div className="header-title-row">
            <h1 className="header-title">Heritage Risk GIS</h1>
            <span className="header-dataset-badge">100 Sites Synchronized</span>
          </div>
          <p className="header-sub">Predictive Analytics for Heritage Site Risk &amp; Conservation · SIH P4</p>
        </div>
      </div>

      <div className="header-badges">
        <span className="header-filter-label">
          <Layers size={14} style={{ marginRight: 4 }} /> Filter:
        </span>
        {badges.map((b) => {
          const isActive = activeFilter === b.label;
          return (
            <button
              key={b.label}
              className={`risk-badge-btn ${isActive ? "active" : ""}`}
              onClick={() => onFilterChange(b.label)}
              style={{
                color: b.color,
                background: isActive ? b.color : b.bg,
                borderColor: b.color,
                color: isActive ? "#ffffff" : b.color,
              }}
            >
              {b.count} {b.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
