import { RISK_COLORS, RISK_BG } from "../data/heritageSites";
import L from "leaflet";

// Returns the hex color for a given risk level
export function getRiskColor(riskLevel) {
  return RISK_COLORS[riskLevel] || "#6B7280";
}

// Returns the background color for badge
export function getRiskBg(riskLevel) {
  return RISK_BG[riskLevel] || "#F3F4F6";
}

// Creates a custom Leaflet divIcon SVG pin for a risk level
export function createRiskIcon(riskLevel) {
  const color = getRiskColor(riskLevel);
  const svgPin = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
      <path
        d="M16 2C9.373 2 4 7.373 4 14c0 8.5 12 26 12 26s12-17.5 12-26c0-6.627-5.373-12-12-12z"
        fill="${color}"
        filter="url(#shadow)"
      />
      <circle cx="16" cy="14" r="5" fill="white" opacity="0.9"/>
    </svg>
  `;
  return L.divIcon({
    html: svgPin,
    className: "",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
}
