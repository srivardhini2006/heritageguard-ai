import { useState, useRef, useEffect } from "react";
import { Search, X, MapPin } from "lucide-react";
import { RISK_COLORS } from "../data/heritageSites";

export default function SearchBox({ sites, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered =
    query.trim().length === 0
      ? []
      : sites.filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.state.toLowerCase().includes(query.toLowerCase()) ||
            s.id.toLowerCase().includes(query.toLowerCase()) ||
            s.soilType.toLowerCase().includes(query.toLowerCase()) ||
            s.primaryThreat.toLowerCase().includes(query.toLowerCase())
        );

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleSelect(site) {
    setQuery(site.name);
    setOpen(false);
    onSelect(site);
  }

  function clearSearch() {
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="searchbox-wrapper" ref={ref}>
      <div className="searchbox-input-row">
        <Search size={16} className="searchbox-icon" />
        <input
          className="searchbox-input"
          type="text"
          placeholder="Search 100 heritage sites (e.g. Taj Mahal, Bihar, SITE_021)…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
        />
        {query && (
          <button className="searchbox-clear" onClick={clearSearch}>
            <X size={14} />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="searchbox-dropdown">
          <div className="searchbox-results-count">
            Found {filtered.length} matching site{filtered.length > 1 ? "s" : ""}
          </div>
          {filtered.slice(0, 10).map((site) => (
            <li
              key={site.id}
              className="searchbox-item"
              onMouseDown={() => handleSelect(site)}
            >
              <MapPin
                size={14}
                style={{ color: RISK_COLORS[site.riskLevel], flexShrink: 0 }}
              />
              <div className="searchbox-item-text">
                <div className="searchbox-item-title-row">
                  <span className="searchbox-item-name">{site.name}</span>
                  <span className="searchbox-item-id">{site.id}</span>
                </div>
                <span className="searchbox-item-meta">
                  {site.state} · {site.soilType} · AQI {site.aqi}
                </span>
              </div>
              <span
                className="searchbox-item-badge"
                style={{
                  color: RISK_COLORS[site.riskLevel],
                  background: `${RISK_COLORS[site.riskLevel]}18`,
                  border: `1px solid ${RISK_COLORS[site.riskLevel]}40`,
                }}
              >
                {site.riskLevel} ({site.riskScore})
              </span>
            </li>
          ))}
          {filtered.length > 10 && (
            <div className="searchbox-more">
              + {filtered.length - 10} more sites matching query
            </div>
          )}
        </ul>
      )}

      {open && query.trim() && filtered.length === 0 && (
        <div className="searchbox-empty">No heritage sites found for "{query}"</div>
      )}
    </div>
  );
}
