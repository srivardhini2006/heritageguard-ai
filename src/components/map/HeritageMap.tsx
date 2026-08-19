import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import type { HeritageSite, RiskLevel } from "../../types";
import RiskBadge from "../common/RiskBadge";

// ─────────────────────────────────────────────────────────────────────────
// Isolated map component. Member 2 (GIS & Spatial Analytics) can replace
// or extend this file directly — the rest of the dashboard/pages only ever
// import <HeritageMap /> and pass it `sites`, never Leaflet internals.
// Keeping all GIS logic here (instead of spread across the app) means
// swapping in real spatial-analytics layers won't touch other pages.
// ─────────────────────────────────────────────────────────────────────────

const MARKER_COLOR: Record<RiskLevel, string> = {
  LOW: "#4E8479",
  MEDIUM: "#C99A3A",
  HIGH: "#CC6A4C",
  CRITICAL: "#B5482F",
};

interface HeritageMapProps {
  sites: HeritageSite[];
  height?: number | string;
}

export default function HeritageMap({ sites, height = 520 }: HeritageMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (sites.length === 0) return [22.3511, 78.6677]; // geographic center of India
    const lat = sites.reduce((sum, s) => sum + s.latitude, 0) / sites.length;
    const lng = sites.reduce((sum, s) => sum + s.longitude, 0) / sites.length;
    return [lat, lng];
  }, [sites]);

  return (
    <div style={{ height }} className="card-surface overflow-hidden !rounded-lg p-0">
      <MapContainer center={center} zoom={5} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map((site) => (
          <CircleMarker
            key={site.id}
            center={[site.latitude, site.longitude]}
            radius={9}
            pathOptions={{
              color: MARKER_COLOR[site.currentRiskLevel],
              fillColor: MARKER_COLOR[site.currentRiskLevel],
              fillOpacity: 0.75,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[180px] space-y-1.5 font-body">
                <p className="font-display text-sm font-semibold text-stone-50">{site.name}</p>
                <p className="text-xs text-stone-400">{site.location}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <RiskBadge level={site.currentRiskLevel} size="sm" />
                  <span className="font-mono text-xs text-stone-300">{site.riskScore}/100</span>
                </div>
                <Link
                  to={`/sites/${site.id}`}
                  className="mt-1 inline-block text-xs font-medium text-sandstone-400 hover:text-sandstone-300"
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
