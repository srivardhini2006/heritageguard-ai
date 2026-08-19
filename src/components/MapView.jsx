import { useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createRiskIcon, getRiskColor, getRiskBg } from "../utils/mapUtils";
import Legend from "./Legend";

// ---- Fly-To controller (renders nothing, just moves the map) ----
function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 12, { duration: 1.4 });
    }
  }, [target, map]);
  return null;
}

// ---- Score progress bar ----
function ScoreBar({ score, color }) {
  return (
    <div className="popup-score-bar-bg">
      <div
        className="popup-score-bar-fill"
        style={{ width: `${score}%`, background: color }}
      />
    </div>
  );
}

// ---- Rich Popup Card with ML Feature Indicators ----
function SitePopup({ site }) {
  const color = getRiskColor(site.riskLevel);
  const bg = getRiskBg(site.riskLevel);

  return (
    <div className="popup-card">
      {/* Header */}
      <div className="popup-header" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="popup-title-row">
          <h3 className="popup-title">{site.name}</h3>
          <span className="popup-site-id">{site.id}</span>
        </div>
        <p className="popup-location">
          📍 {site.state} · {site.soilType} Soil
        </p>
      </div>

      {/* Risk row */}
      <div className="popup-risk-row">
        <span
          className="popup-risk-badge"
          style={{ background: bg, color, border: `1px solid ${color}66` }}
        >
          {site.riskLevel} ({site.conditionLabelName})
        </span>
        <span className="popup-score-label">
          Risk Index: <strong>{site.riskScore}/100</strong>
        </span>
      </div>

      <ScoreBar score={site.riskScore} color={color} />

      {/* Primary Threat Banner */}
      <div className="popup-threat">
        <span className="popup-threat-label">⚠ Primary Identified Threat</span>
        <span className="popup-threat-value">{site.primaryThreat}</span>
      </div>

      {/* Analytics Grid */}
      <div className="popup-stats-grid">
        <div className="stat-box">
          <span className="stat-label">Air Quality (AQI)</span>
          <span className="stat-val" style={{ color: site.aqi > 120 ? "#EF4444" : "#10B981" }}>
            {site.aqi} AQI (PM2.5: {site.pm25})
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Annual Rainfall</span>
          <span className="stat-val">{site.annualRainfall} mm</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Daily Footfall</span>
          <span className="stat-val">{site.dailyFootfall.toLocaleString()} visitors</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Flood Risk / Zone</span>
          <span className="stat-val" style={{ color: site.floodRiskScore > 5 ? "#EF4444" : "#475569" }}>
            {site.floodRiskScore}/10 {site.floodZone ? "· Flood Zone" : ""}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Seismic Rating</span>
          <span className="stat-val">Zone {site.seismicZone} / 5</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Crowd Control</span>
          <span className="stat-val">{site.crowdControlMeasures}</span>
        </div>
      </div>

      {/* Coords & Elevation */}
      <div className="popup-footer">
        <span>🌐 {site.lat.toFixed(4)}°N, {site.lng.toFixed(4)}°E</span>
        <span>⛰ {site.elevation}m elev.</span>
      </div>
    </div>
  );
}

// ---- Main Map View ----
export default function MapView({ sites, flyTarget, selectedFilter }) {
  const markerRefs = useRef({});

  // Auto-open popup for fly target
  useEffect(() => {
    if (flyTarget && markerRefs.current[flyTarget.id]) {
      setTimeout(() => {
        markerRefs.current[flyTarget.id].openPopup();
      }, 1500);
    }
  }, [flyTarget]);

  const displayedSites = selectedFilter && selectedFilter !== "All"
    ? sites.filter(s => s.riskLevel === selectedFilter)
    : sites;

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[22.5, 79.5]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        {/* CartoDB Voyager tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Fly controller */}
        <FlyTo target={flyTarget} />

        {/* Site markers */}
        {displayedSites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={createRiskIcon(site.riskLevel)}
            ref={(el) => {
              if (el) markerRefs.current[site.id] = el;
            }}
          >
            <Popup minWidth={300} maxWidth={340}>
              <SitePopup site={site} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend overlay with live counts */}
      <Legend sites={sites} />
    </div>
  );
}
